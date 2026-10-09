import Foundation
import Combine
import AppKit
import CoreGraphics

public final class RealtimeService: ObservableObject {
    public static let shared = RealtimeService()

    @Published public var isConnected: Bool = false
    @Published public var partnerOnline: Bool = false
    @Published public var currentEmote: EmoteType? = nil
    @Published public var activeMessage: String? = nil
    @Published public var partnerStatus: PartnerStatus = .inUse
    @Published public var activePhotoPopupUrl: String? = nil

    private var coupleRoomId: String = "ajay-couple-room"
    private var userId: String = UUID().uuidString
    private var supabaseUrl: String = ""
    private var supabaseKey: String = ""
    private var webSocketTask: URLSessionWebSocketTask?

    private var channelTopic: String {
        let clean = coupleRoomId.replacingOccurrences(of: ":", with: "_")
        return "realtime:couple_\(clean)"
    }

    // Resiliency & Battery Timers
    private var heartbeatTimer: Timer?
    private var activityCheckTimer: Timer?
    private var reconnectTimer: Timer?
    private var reconnectAttempts: Int = 0
    private var isSuspended: Bool = false
    private var lastEmoteSendTime: Double = 0.0

    private var lastLocalStatus: PartnerStatus = .inUse
    private var lastPartnerSeen: Date?

    public var onEmoteReceived: ((CoupleEmotePayload) -> Void)?

    private init() {
        self.coupleRoomId = UserDefaults.standard.string(forKey: "CoupleStick_RoomId") ?? "ajay-couple-room"
        if let savedUser = UserDefaults.standard.string(forKey: "CoupleStick_UserId") {
            self.userId = savedUser
        } else {
            UserDefaults.standard.set(userId, forKey: "CoupleStick_UserId")
        }
        let savedUrl = UserDefaults.standard.string(forKey: "CoupleStick_SupabaseUrl") ?? ""
        self.supabaseUrl = savedUrl.isEmpty ? "https://pbaraqcadpporplwwrcz.supabase.co" : savedUrl

        let savedKey = UserDefaults.standard.string(forKey: "CoupleStick_SupabaseKey") ?? ""
        self.supabaseKey = savedKey.isEmpty ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiYXJhcWNhZHBwb3JwbHd3cmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Mjc0NjEsImV4cCI6MjEwNzEwMzQ2MX0.O48Wf2Sr4izB5BDs8OKqYDq5IicNv0kHv8ljRUcS0Qw" : savedKey

        setupSystemSleepWakeObservers()
        startActivityTracker()
        connect(url: self.supabaseUrl, key: self.supabaseKey)
    }

    private func setupSystemSleepWakeObservers() {
        let nc = NSWorkspace.shared.notificationCenter
        nc.addObserver(self, selector: #selector(macWillSleep), name: NSWorkspace.willSleepNotification, object: nil)
        nc.addObserver(self, selector: #selector(macDidWake), name: NSWorkspace.didWakeNotification, object: nil)
        nc.addObserver(self, selector: #selector(screensDidSleep), name: NSWorkspace.screensDidSleepNotification, object: nil)
        nc.addObserver(self, selector: #selector(screensDidWake), name: NSWorkspace.screensDidWakeNotification, object: nil)
    }

    @objc private func macWillSleep() {
        print("[RealtimeService] Mac sleeping: Notifying partner & suspending socket.")
        isSuspended = true
        sendStatusUpdate(.sleeping)
        disconnect()
    }

    @objc private func macDidWake() {
        print("[RealtimeService] Mac woke: Restoring connection & active status.")
        isSuspended = false
        reconnectAttempts = 0
        connect(url: supabaseUrl, key: supabaseKey)
        checkLocalActivity()
    }

    @objc private func screensDidSleep() {
        heartbeatTimer?.invalidate()
        heartbeatTimer = nil
        sendStatusUpdate(.idle)
    }

    @objc private func screensDidWake() {
        startHeartbeat()
        checkLocalActivity()
    }

    // MARK: - Activity & Presence Detection
    private func startActivityTracker() {
        activityCheckTimer?.invalidate()
        let timer = Timer.scheduledTimer(withTimeInterval: 12.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.checkLocalActivity()
            self.checkPartnerActivity()
        }
        timer.tolerance = 2.0
        self.activityCheckTimer = timer
    }

    private func checkLocalActivity() {
        guard isConnected, !isSuspended else { return }
        let idleSeconds = CGEventSource.secondsSinceLastEventType(.combinedSessionState, eventType: CGEventType(rawValue: ~0)!)
        let currentStatus: PartnerStatus = (idleSeconds < 120.0) ? .inUse : .idle
        if currentStatus != lastLocalStatus {
            lastLocalStatus = currentStatus
            sendStatusUpdate(currentStatus)
        }
    }

    private func checkPartnerActivity() {
        guard let lastSeen = lastPartnerSeen else {
            if partnerOnline {
                DispatchQueue.main.async {
                    self.partnerOnline = false
                    self.partnerStatus = .offline
                }
            }
            return
        }
        if Date().timeIntervalSince(lastSeen) > 65.0 {
            DispatchQueue.main.async {
                self.partnerOnline = false
                self.partnerStatus = .offline
            }
        }
    }

    public func configure(supabaseUrl: String, supabaseKey: String, roomId: String) {
        self.coupleRoomId = roomId
        self.supabaseUrl = supabaseUrl
        self.supabaseKey = supabaseKey
        UserDefaults.standard.set(roomId, forKey: "CoupleStick_RoomId")
        UserDefaults.standard.set(supabaseUrl, forKey: "CoupleStick_SupabaseUrl")
        UserDefaults.standard.set(supabaseKey, forKey: "CoupleStick_SupabaseKey")
        reconnectAttempts = 0
        connect(url: supabaseUrl, key: supabaseKey)
    }

    public func connect(url: String = "", key: String = "") {
        let activeUrl = url.isEmpty ? self.supabaseUrl : url
        let activeKey = key.isEmpty ? self.supabaseKey : key

        guard !activeUrl.isEmpty, !activeKey.isEmpty,
              let cleanHost = URL(string: activeUrl)?.host,
              let wsUrl = URL(string: "wss://\(cleanHost)/realtime/v1/websocket?apikey=\(activeKey)&vsn=1.0.0") else {
            print("[RealtimeService] Running in local simulation mode for room: \(coupleRoomId)")
            DispatchQueue.main.async {
                self.isConnected = true
                self.partnerOnline = true
            }
            return
        }

        disconnect()

        print("[RealtimeService] Connecting to \(cleanHost) for room: \(coupleRoomId)...")

        let task = URLSession.shared.webSocketTask(with: wsUrl)
        self.webSocketTask = task
        task.resume()

        listenForMessages()
        joinChannel()
        startHeartbeat()
    }

    public func disconnect() {
        self.heartbeatTimer?.invalidate()
        self.heartbeatTimer = nil
        self.reconnectTimer?.invalidate()
        self.reconnectTimer = nil
        self.webSocketTask?.cancel(with: .goingAway, reason: nil)
        self.webSocketTask = nil
        if Thread.isMainThread {
            self.isConnected = false
        } else {
            DispatchQueue.main.async {
                self.isConnected = false
            }
        }
    }

    private func startHeartbeat() {
        DispatchQueue.main.async { [weak self] in
            self?.heartbeatTimer?.invalidate()
            let timer = Timer.scheduledTimer(withTimeInterval: 20.0, repeats: true) { [weak self] _ in
                guard let self = self, let task = self.webSocketTask else { return }

                // 1. Native WebSocket ping
                task.sendPing { error in
                    if let error = error {
                        print("[RealtimeService] Heartbeat ping failed: \(error.localizedDescription)")
                    }
                }

                // 2. Phoenix protocol heartbeat to prevent Supabase 25s timeout
                let heartbeat: [String: Any] = [
                    "topic": "phoenix",
                    "event": "heartbeat",
                    "payload": [:],
                    "ref": UUID().uuidString
                ]
                if let data = try? JSONSerialization.data(withJSONObject: heartbeat),
                   let text = String(data: data, encoding: .utf8) {
                    task.send(.string(text)) { _ in }
                }

                // 3. Periodic presence heartbeat with activity state
                self.sendStatusUpdate(self.lastLocalStatus)
            }
            timer.tolerance = 2.0
            self?.heartbeatTimer = timer
        }
    }

    private func handleDisconnect() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, !self.isSuspended else { return }
            self.disconnect()

            self.reconnectAttempts += 1
            let backoff = min(pow(2.0, Double(self.reconnectAttempts)), 30.0)
            print("[RealtimeService] Connection dropped. Auto-reconnecting in \(Int(backoff))s (Attempt \(self.reconnectAttempts))...")

            self.reconnectTimer?.invalidate()
            self.reconnectTimer = Timer.scheduledTimer(withTimeInterval: backoff, repeats: false) { [weak self] _ in
                guard let self = self else { return }
                self.connect(url: self.supabaseUrl, key: self.supabaseKey)
            }
        }
    }

    deinit {
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        activityCheckTimer?.invalidate()
        disconnect()
    }

    private func joinChannel() {
        let joinMsg: [String: Any] = [
            "topic": channelTopic,
            "event": "phx_join",
            "payload": [
                "config": [
                    "broadcast": ["ack": false, "self": false],
                    "presence": ["enabled": false],
                    "postgres_changes": [],
                    "private": false
                ]
            ],
            "ref": "1",
            "join_ref": "1"
        ]
        if let data = try? JSONSerialization.data(withJSONObject: joinMsg),
           let text = String(data: data, encoding: .utf8) {
            print("[RealtimeService] Sending phx_join for \(channelTopic)...")
            webSocketTask?.send(.string(text)) { [weak self] error in
                if error == nil {
                    print("[RealtimeService] phx_join sent successfully! Connected.")
                    DispatchQueue.main.async {
                        self?.isConnected = true
                        self?.partnerOnline = true
                        self?.reconnectAttempts = 0
                    }
                    self?.checkLocalActivity()
                } else {
                    print("[RealtimeService] Failed to send phx_join: \(String(describing: error))")
                }
            }
        }
    }

    private func listenForMessages() {
        webSocketTask?.receive { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success(let message):
                switch message {
                case .string(let text):
                    self.parseIncomingMessage(text)
                case .data(let data):
                    if let text = String(data: data, encoding: .utf8) {
                        self.parseIncomingMessage(text)
                    }
                @unknown default:
                    break
                }
                self.listenForMessages()
            case .failure(let error):
                let nsError = error as NSError
                if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
                    return
                }
                print("[RealtimeService] Receive failure: \(error.localizedDescription)")
                self.handleDisconnect()
            }
        }
    }

    private func parseIncomingMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let event = json["event"] as? String else {
            return
        }

        // Handle Phoenix join acknowledgement
        if event == "phx_reply" {
            if let payload = json["payload"] as? [String: Any],
               payload["status"] as? String == "ok" {
                DispatchQueue.main.async {
                    self.isConnected = true
                    self.reconnectAttempts = 0
                }
            }
            return
        }

        if event == "broadcast" {
            guard let outerPayload = json["payload"] as? [String: Any] else { return }
            let userPayload = (outerPayload["payload"] as? [String: Any]) ?? outerPayload
            guard let emoteData = try? JSONSerialization.data(withJSONObject: userPayload),
                  let emotePayload = try? JSONDecoder().decode(CoupleEmotePayload.self, from: emoteData) else {
                return
            }

            if emotePayload.senderId == userId { return }
            handleIncomingPayload(emotePayload)
        }
    }

    public func sendEmote(_ emote: EmoteType, photoUrl: String? = nil, message: String? = nil) {
        sendPayload(action: emote, photoUrl: photoUrl, message: message)
    }

    public func sendTextMessage(_ message: String) {
        sendPayload(action: .chat, message: message)
    }

    public func sendMedia(dataUrl: String, isVideo: Bool, message: String? = nil) {
        let defaultMsg = isVideo ? "Sent you a video! 🎬" : "Sent you a photo! 📸"
        sendPayload(action: .loveYou, photoUrl: dataUrl, message: message ?? defaultMsg)
    }

    public func sendPoke() {
        sendPayload(action: .poke, message: "Poked you! 👉")
    }

    public func sendStatusUpdate(_ status: PartnerStatus) {
        sendPayload(action: .hi, statusBadge: status)
    }

    private func sendPayload(
        action: EmoteType,
        photoUrl: String? = nil,
        message: String? = nil,
        statusBadge: PartnerStatus? = nil
    ) {
        let now = Date().timeIntervalSince1970
        if action != .hi && now - lastEmoteSendTime < 0.15 {
            return
        }
        lastEmoteSendTime = now

        let payload = CoupleEmotePayload(
            action: action,
            senderId: userId,
            popupPhotoUrl: photoUrl,
            message: message,
            statusBadge: statusBadge,
            timestamp: Date().timeIntervalSince1970
        )

        if let task = webSocketTask {
            var payloadDict: [String: Any] = [
                "action": action.rawValue,
                "senderId": userId,
                "timestamp": payload.timestamp
            ]
            if let p = photoUrl { payloadDict["popupPhotoUrl"] = p }
            if let m = message { payloadDict["message"] = m }
            if let s = statusBadge { payloadDict["statusBadge"] = s.rawValue }

            let broadcastMsg: [String: Any] = [
                "topic": channelTopic,
                "event": "broadcast",
                "payload": [
                    "type": "broadcast",
                    "event": "emote",
                    "payload": payloadDict
                ],
                "ref": UUID().uuidString,
                "join_ref": "1"
            ]
            if let data = try? JSONSerialization.data(withJSONObject: broadcastMsg),
               let text = String(data: data, encoding: .utf8) {
                task.send(.string(text)) { _ in }
            }
        }
    }

    public func handleIncomingPayload(_ payload: CoupleEmotePayload) {
        DispatchQueue.main.async {
            self.lastPartnerSeen = Date()
            self.partnerOnline = true

            if payload.action != .chat {
                self.currentEmote = payload.action
            }
            self.activePhotoPopupUrl = payload.popupPhotoUrl
            if let msg = payload.message {
                self.activeMessage = msg
            }
            if let badge = payload.statusBadge {
                self.partnerStatus = badge
            }

            if payload.action != .chat {
                SoundManager.shared.playEmoteSound(for: payload.action)
            } else {
                SoundManager.shared.playEmoteSound(for: .chat)
            }

            if payload.action == .kiss || payload.action == .blowKiss {
                HapticManager.shared.triggerHeartbeatTap()
            } else if payload.action == .poke {
                HapticManager.shared.triggerDoubleTap()
            } else {
                HapticManager.shared.triggerGentleTap()
            }

            self.onEmoteReceived?(payload)

            DispatchQueue.main.asyncAfter(deadline: .now() + 8.0) {
                if self.activeMessage == payload.message {
                    self.activeMessage = nil
                }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 4.0) {
                if self.currentEmote == payload.action {
                    self.currentEmote = nil
                }
            }
        }
    }
}
