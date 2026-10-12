import SwiftUI
import AppKit
import AVFoundation

// MARK: - Animated Particle Sparkle
public struct AnimatedParticle: Identifiable {
    public let id = UUID()
    public let emoji: String
    public var x: CGFloat
    public var y: CGFloat
    public var vx: CGFloat
    public var vy: CGFloat
    public var scale: CGFloat
    public var opacity: Double
}

// MARK: - Sticker View Model
public final class StickerViewModel: ObservableObject {
    @Published public var showEmoteMenu: Bool = false
    @Published public var showTextInput: Bool = false
    @Published public var showCamera: Bool = false
    @Published public var isHovering: Bool = false
    @Published public var activeEmotePopup: EmoteType? = nil
    @Published public var nickname: String = "Babe"
    @Published public var isInactive: Bool = false

    // Transform States (Apple-Grade Fluid Spring Physics)
    @Published public var scale: CGFloat = 1.0
    @Published public var xOffset: CGFloat = 0.0
    @Published public var yOffset: CGFloat = 0.0

    @Published public var quickText: String = ""
    @Published public var partnerImage: NSImage? = nil
    @Published public var particles: [AnimatedParticle] = []

    private var lastInteractionDate: Date = Date()
    private var inactivityTimer: Timer?

    public init() {
        loadPartnerImage()
        loadNickname()
        NotificationCenter.default.addObserver(self, selector: #selector(didUpdateFace), name: NSNotification.Name("CoupleStick_FaceUpdated"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(didUpdateNickname), name: NSNotification.Name("CoupleStick_NicknameUpdated"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(didRequestOpenLiveCamera), name: NSNotification.Name("CoupleStick_OpenLiveCamera"), object: nil)
        startInactivityTimer()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
        inactivityTimer?.invalidate()
    }

    // MARK: - Inactivity Auto-Hide (1 Minute)
    private func startInactivityTimer() {
        inactivityTimer?.invalidate()
        let timer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            if Date().timeIntervalSince(self.lastInteractionDate) >= 60.0 {
                if !self.isInactive && !self.showTextInput && !self.showEmoteMenu {
                    withAnimation(.easeInOut(duration: 0.8)) {
                        self.isInactive = true
                    }
                }
            }
        }
        timer.tolerance = 2.0
        self.inactivityTimer = timer
    }

    public func resetInactivity() {
        lastInteractionDate = Date()
        if isInactive {
            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                self.isInactive = false
            }
        }
    }

    @objc private func didUpdateFace() {
        loadPartnerImage()
    }

    @objc private func didUpdateNickname() {
        loadNickname()
    }

    @objc private func didRequestOpenLiveCamera() {
        DispatchQueue.main.async {
            self.resetInactivity()
            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                self.showCamera = true
                self.showEmoteMenu = false
                self.showTextInput = false
            }
        }
    }

    public func loadNickname() {
        self.nickname = UserDefaults.standard.string(forKey: "CoupleStick_Nickname") ?? "Babe"
    }

    public func loadPartnerImage() {
        if let path = UserDefaults.standard.string(forKey: "CoupleStick_PartnerFacePath"),
           let image = NSImage(contentsOfFile: path) {
            self.partnerImage = image
        } else {
            self.partnerImage = nil
        }
    }

    // MARK: - Live Camera Viewfinder & Snap
    public func openCameraCapture() {
        resetInactivity()
        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
            self.showCamera.toggle()
            self.showEmoteMenu = false
            self.showTextInput = false
        }
    }

    // MARK: - Photo & Video Dispatch (File Picker)
    public func sendPhotoOrVideo() {
        resetInactivity()
        let panel = NSOpenPanel()
        panel.title = "Choose Photo or Video to Send to \(nickname)"
        panel.prompt = "Send"
        panel.allowedContentTypes = [
            .png, .jpeg, .heic, .gif, .movie, .quickTimeMovie, .mpeg4Movie
        ]
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false

        if panel.runModal() == .OK, let url = panel.url {
            processAndSendMedia(at: url)
        }
    }

    private func processAndSendMedia(at url: URL) {
        let ext = url.pathExtension.lowercased()
        let isVideo = ["mov", "mp4", "m4v"].contains(ext)

        if isVideo {
            if let fileData = try? Data(contentsOf: url) {
                if fileData.count <= 220 * 1024 {
                    let base64 = fileData.base64EncodedString()
                    let dataUrl = "data:video/mp4;base64,\(base64)"
                    RealtimeService.shared.sendMedia(dataUrl: dataUrl, isVideo: true, message: "Sent you a video! 🎬")
                    if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                        PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: dataUrl, message: "Sent video! 🎬")
                    }
                } else {
                    let asset = AVURLAsset(url: url)
                    let gen = AVAssetImageGenerator(asset: asset)
                    gen.appliesPreferredTrackTransform = true
                    let time = CMTime(seconds: 0.1, preferredTimescale: 600)
                    if let imageRef = try? gen.copyCGImage(at: time, actualTime: nil) {
                        let thumb = NSImage(cgImage: imageRef, size: NSSize(width: 400, height: 300))
                        if let thumbData = jpegData(for: thumb, quality: 0.65) {
                            let base64 = thumbData.base64EncodedString()
                            let dataUrl = "data:image/jpeg;base64,\(base64)"
                            RealtimeService.shared.sendMedia(dataUrl: dataUrl, isVideo: true, message: "Sent video: \(url.lastPathComponent) 🎬")
                            if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                                PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: dataUrl, message: "Sent video: \(url.lastPathComponent) 🎬")
                            }
                        }
                    }
                }
            }
        } else {
            if let downsampled = downsampleImage(at: url, maxPixelSize: 600),
               let data = jpegData(for: downsampled, quality: 0.72) {
                let base64 = data.base64EncodedString()
                let dataUrl = "data:image/jpeg;base64,\(base64)"
                RealtimeService.shared.sendMedia(dataUrl: dataUrl, isVideo: false, message: "Sent you a photo! 📸")
                if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                    PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: dataUrl, message: "Sent photo! 📸")
                }
            }
        }
    }

    private func jpegData(for image: NSImage, quality: CGFloat) -> Data? {
        guard let tiff = image.tiffRepresentation,
              let rep = NSBitmapImageRep(data: tiff) else { return nil }
        return rep.representation(using: .jpeg, properties: [.compressionFactor: quality])
    }

    private func downsampleImage(at url: URL, maxPixelSize: Int) -> NSImage? {
        guard let imageSource = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
        let options: [CFString: Any] = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceShouldCacheImmediately: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceThumbnailMaxPixelSize: maxPixelSize
        ]
        guard let downsampled = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, options as CFDictionary) else {
            return nil
        }
        return NSImage(cgImage: downsampled, size: NSSize(width: maxPixelSize, height: maxPixelSize))
    }

    public func sendCurrentText() {
        resetInactivity()
        let trimmed = quickText.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmed.isEmpty {
            RealtimeService.shared.sendTextMessage(trimmed)
            RealtimeService.shared.activeMessage = trimmed
            DispatchQueue.main.asyncAfter(deadline: .now() + 6.0) {
                if RealtimeService.shared.activeMessage == trimmed {
                    RealtimeService.shared.activeMessage = nil
                }
            }
            quickText = ""
            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                showTextInput = false
            }
        }
    }

    // MARK: - Refined Apple-Grade Reaction Animation
    public func triggerReaction(for emote: EmoteType) {
        resetInactivity()
        if emote != .chat {
            withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                self.activeEmotePopup = emote
                self.scale = 1.09
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                    self.scale = 1.0
                }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.5) {
                if self.activeEmotePopup == emote {
                    withAnimation(.easeOut(duration: 0.25)) {
                        self.activeEmotePopup = nil
                    }
                }
            }
        }

        spawnTastefulSparkles(emoji: emote.emoji)
    }

    // MARK: - Tasteful Sparkle Particles
    private func spawnTastefulSparkles(emoji: String) {
        particles.removeAll()
        for _ in 0..<8 {
            let angle = Double.random(in: -Double.pi * 0.75 ... -Double.pi * 0.25)
            let speed = CGFloat.random(in: 40...75)
            let vx = cos(angle) * speed
            let vy = sin(angle) * speed

            let particle = AnimatedParticle(
                emoji: emoji,
                x: CGFloat.random(in: -10...10),
                y: CGFloat.random(in: -10...10),
                vx: vx,
                vy: vy,
                scale: CGFloat.random(in: 0.5...0.8),
                opacity: 1.0
            )
            particles.append(particle)
        }

        withAnimation(.easeOut(duration: 1.2)) {
            for i in particles.indices {
                particles[i].x += particles[i].vx
                particles[i].y += particles[i].vy + 20
                particles[i].scale = CGFloat.random(in: 0.9...1.2)
                particles[i].opacity = 0.0
            }
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.25) {
            self.particles.removeAll()
        }
    }
}

// MARK: - Main Sticker View
public struct StickerView: View {
    @ObservedObject var realtime = RealtimeService.shared
    @ObservedObject public var model = StickerViewModel()
    @FocusState private var isTextFieldFocused: Bool

    public init() {}

    public var body: some View {
        ZStack {
            // Subtle floating particles
            if !model.particles.isEmpty {
                ForEach(model.particles) { p in
                    Text(p.emoji)
                        .font(.system(size: 22))
                        .offset(x: p.x, y: p.y)
                        .scaleEffect(p.scale)
                        .opacity(p.opacity)
                }
                .drawingGroup()
            }

            VStack(spacing: 8) {
                if model.showCamera {
                    CameraCaptureView(onDismiss: {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            model.showCamera = false
                        }
                    })
                    .transition(.scale(scale: 0.85).combined(with: .opacity))
                } else {
                    // Top floating emote bar
                    if model.showEmoteMenu && realtime.isConnected {
                        emoteSelectionBar
                            .transition(.scale(scale: 0.85).combined(with: .opacity))
                    }

                    // Emote Pop-up Badge above avatar
                    if let activeEmote = model.activeEmotePopup {
                        emotePopupCard(emote: activeEmote)
                            .transition(.scale(scale: 0.5).combined(with: .opacity))
                    }

                    // Partner Avatar Anchor
                    partnerAvatarSection

                    // Sleek Message Pill popping in at the BOTTOM! (Font size 17pt)
                    if let message = realtime.activeMessage {
                        speechBubble(text: message)
                            .transition(.asymmetric(
                                insertion: .scale(scale: 0.85).combined(with: .opacity).combined(with: .offset(y: 8)),
                                removal: .opacity.combined(with: .scale(scale: 0.9))
                            ))
                    }

                    // Compact Quick Text Input Bar (docked at the BOTTOM, Font size 17pt)
                    if model.showTextInput && realtime.isConnected {
                        quickTextInputBar
                            .transition(.scale(scale: 0.9).combined(with: .opacity))
                    }
                }
            }
        }
        .frame(width: 320, height: 320)
        .opacity(model.isInactive ? 0.20 : 1.0) // Auto-hide dim after 1 minute inactivity
        .onExitCommand {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                model.showEmoteMenu = false
                model.showTextInput = false
                model.showCamera = false
            }
        }
        .onReceive(realtime.$currentEmote) { emote in
            if let emote = emote {
                model.triggerReaction(for: emote)
            }
        }
        .onReceive(realtime.$activeMessage) { msg in
            if msg != nil {
                model.resetInactivity()
            }
        }
    }

    // MARK: - Partner Avatar & Micro-Actions Below
    private var partnerAvatarSection: some View {
        VStack(spacing: 8) {
            partnerAvatar

            // Quick Micro-Action Toolbar (BELOW the avatar)
            if model.isHovering && realtime.isConnected {
                HStack(spacing: 8) {
                    hoverButton(icon: model.showEmoteMenu ? "xmark" : "heart.fill", color: .pink) {
                        model.resetInactivity()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            model.showEmoteMenu.toggle()
                            model.showTextInput = false
                        }
                    }

                    hoverButton(icon: "bubble.left.fill", color: .purple) {
                        model.resetInactivity()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            model.showTextInput.toggle()
                            model.showEmoteMenu = false
                            if model.showTextInput {
                                DispatchQueue.main.async {
                                    if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                                        panel.makeKey()
                                        NSApp.activate(ignoringOtherApps: true)
                                    }
                                }
                            }
                        }
                    }

                    // Live Camera Viewfinder & Snap
                    hoverButton(icon: "camera.fill", color: .red) {
                        model.openCameraCapture()
                    }

                    // Photo / Video picker
                    hoverButton(icon: "photo.fill", color: .orange) {
                        model.sendPhotoOrVideo()
                    }
                }
                .transition(.scale(scale: 0.85).combined(with: .opacity))
            } else if model.isHovering && !realtime.isConnected {
                HStack(spacing: 5) {
                    ProgressView()
                        .scaleEffect(0.5)
                        .frame(width: 14, height: 14)
                    Text("Connecting to \(model.nickname)...")
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.9))
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Capsule().fill(Color.black.opacity(0.8)))
                .transition(.scale(scale: 0.85).combined(with: .opacity))
            }
        }
        .contentShape(Rectangle())
        .onHover { hovering in
            if hovering { model.resetInactivity() }
            withAnimation(.spring(response: 0.25, dampingFraction: 0.8)) {
                model.isHovering = hovering
            }
        }
    }

    // MARK: - Partner Avatar
    private var partnerAvatar: some View {
        ZStack {
            // Avatar circle with crisp, elegant border (zero fuzzy glow)
            ZStack {
                Circle()
                    .strokeBorder(Color.white.opacity(0.9), lineWidth: 2.5)
                    .background(Circle().fill(Color.black.opacity(0.45)))
                    .frame(width: 86, height: 86)
                    .shadow(color: Color.black.opacity(0.25), radius: 8, x: 0, y: 4)

                if let customImage = model.partnerImage {
                    Image(nsImage: customImage)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 81, height: 81)
                        .clipShape(Circle())
                } else {
                    Image(systemName: "person.crop.circle.fill")
                        .resizable()
                        .scaledToFit()
                        .foregroundColor(.white.opacity(0.92))
                        .padding(8)
                        .frame(width: 81, height: 81)
                }
            }
            .scaleEffect(model.scale)
            .offset(x: model.xOffset, y: model.yOffset)
            .contentShape(Circle())
            .onTapGesture {
                model.resetInactivity()
                guard realtime.isConnected else { return }
                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                    model.showEmoteMenu.toggle()
                    model.showTextInput = false
                }
            }
            .gesture(
                DragGesture(minimumDistance: 3)
                    .onChanged { value in
                        model.resetInactivity()
                        if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) as? FloatingPanel<StickerView> {
                            panel.updateDrag(translationX: value.translation.width, translationY: value.translation.height)
                        }
                    }
                    .onEnded { _ in
                        model.resetInactivity()
                        if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) as? FloatingPanel<StickerView> {
                            panel.endDrag()
                        }
                    }
            )

            // Partner Real-time Laptop Status Dot (In Use 🟢 / Away 🟡 / Offline ⚪️)
            Circle()
                .fill(statusDotColor)
                .frame(width: 14, height: 14)
                .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
                .shadow(radius: 2)
                .offset(x: 29, y: 29)

            // Status Badge Icon (if Deep Work 🎧 or Sleeping 💤)
            if let badge = realtime.partnerStatus.badgeEmoji {
                Text(badge)
                    .font(.system(size: 22))
                    .shadow(radius: 3)
                    .offset(x: 26, y: -34)
            }
        }
    }

    private var statusDotColor: Color {
        if !realtime.partnerOnline || realtime.partnerStatus == .offline {
            return Color.gray.opacity(0.8)
        }
        switch realtime.partnerStatus {
        case .normal, .inUse:
            return Color.green
        case .idle:
            return Color.yellow
        case .sleeping:
            return Color.blue
        case .deepWork:
            return Color.purple
        case .offline:
            return Color.gray.opacity(0.8)
        }
    }

    private func hoverButton(icon: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.white)
                .frame(width: 28, height: 28)
                .background(Circle().fill(color))
                .shadow(color: color.opacity(0.4), radius: 5, x: 0, y: 2)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Emote Pop-Up Badge
    private func emotePopupCard(emote: EmoteType) -> some View {
        VStack(spacing: 4) {
            if let videoUrl = CustomReactionManager.shared.getCustomReactionVideoUrl(for: emote) {
                LoopingVideoPlayerView(videoUrl: videoUrl)
                    .frame(width: 54, height: 54)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else if let gifData = CustomReactionManager.shared.getCustomReactionGifData(for: emote) {
                AnimatedGIFView(gifData: gifData)
                    .frame(width: 54, height: 54)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else if let customImage = CustomReactionManager.shared.getCustomReactionPreview(for: emote) {
                Image(nsImage: customImage)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 54, height: 54)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                Text(emote.emoji)
                    .font(.system(size: 48))
                    .shadow(color: .pink.opacity(0.5), radius: 10, x: 0, y: 3)
            }
            Text(emote.label)
                .font(.system(size: 13, weight: .bold, design: .rounded))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.black.opacity(0.85))
                .background(.ultraThinMaterial)
                .shadow(color: .pink.opacity(0.35), radius: 12, x: 0, y: 5)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(
                    LinearGradient(
                        colors: [.pink.opacity(0.85), .purple.opacity(0.8)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.6
                )
        )
    }

    // MARK: - Sleek Bottom Speech Bubble Pill (+4 Font Size: 17pt)
    private func speechBubble(text: String) -> some View {
        HStack(spacing: 7) {
            Image(systemName: "bubble.left.fill")
                .foregroundColor(.pink)
                .font(.system(size: 14))
            Text("\(model.nickname): \(text)")
                .font(.system(size: 17, weight: .semibold, design: .rounded))
                .foregroundColor(.white)
                .multilineTextAlignment(.leading)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 9)
        .background(
            Capsule()
                .fill(Color.black.opacity(0.88))
                .background(.ultraThinMaterial)
                .shadow(color: .black.opacity(0.35), radius: 10, x: 0, y: 3)
        )
        .overlay(Capsule().stroke(Color.pink.opacity(0.7), lineWidth: 1.4))
        .frame(maxWidth: 270)
    }

    // MARK: - Compact Quick Text Input Bar (Docked at Bottom, Font Size 17pt)
    private var quickTextInputBar: some View {
        HStack(spacing: 8) {
            Button(action: {
                model.sendPhotoOrVideo()
            }) {
                Image(systemName: "photo.badge.plus")
                    .foregroundColor(.pink)
                    .font(.system(size: 15, weight: .semibold))
            }
            .buttonStyle(.plain)
            .help("Attach Photo or Video")

            TextField("Message \(model.nickname)...", text: $model.quickText)
                .textFieldStyle(.plain)
                .foregroundColor(.white)
                .font(.system(size: 17, weight: .medium, design: .rounded))
                .focused($isTextFieldFocused)
                .onSubmit {
                    model.sendCurrentText()
                }

            if !model.quickText.isEmpty {
                Button(action: { model.quickText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.white.opacity(0.55))
                        .font(.system(size: 13))
                }
                .buttonStyle(.plain)
            }

            Button(action: {
                model.sendCurrentText()
            }) {
                ZStack {
                    Circle()
                        .fill(Color.pink)
                        .frame(width: 28, height: 28)
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 11, weight: .bold))
                }
            }
            .buttonStyle(.plain)
            .contentShape(Circle())
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(Color.black.opacity(0.9))
                .background(.ultraThinMaterial)
                .shadow(color: .black.opacity(0.4), radius: 10, x: 0, y: 3)
        )
        .overlay(Capsule().stroke(Color.pink.opacity(0.75), lineWidth: 1.5))
        .frame(width: 260)
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                    panel.makeKey()
                    NSApp.activate(ignoringOtherApps: true)
                }
                isTextFieldFocused = true
            }
        }
    }

    // MARK: - Emote Selection Bar (Scrollable 18 Couple Reactions)
    private var emoteSelectionBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 7) {
                ForEach(EmoteType.allCases.filter { $0 != .chat }) { emote in
                    Button(action: {
                        model.resetInactivity()
                        let customDataUrl = CustomReactionManager.shared.getCustomReactionDataUrl(for: emote)
                        if let photo = customDataUrl, !photo.isEmpty {
                            let msg = (emote == .kiss) ? "Sent you a kiss! 💋" : (emote == .poke ? "Poked you! 👉" : "\(emote.label) from \(model.nickname)! \(emote.emoji)")
                            realtime.sendEmote(emote, photoUrl: photo, message: msg)
                            if let panel = NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> }) {
                                PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: photo, message: (emote == .kiss) ? "Sent kiss to \(model.nickname)! 💋" : (emote == .poke ? "Poked \(model.nickname)! 👉" : "Sent \(emote.label.lowercased()) to \(model.nickname)! \(emote.emoji)"))
                            }
                        } else {
                            if emote == .poke {
                                realtime.sendPoke()
                            } else {
                                realtime.sendEmote(emote)
                            }
                        }
                        model.triggerReaction(for: emote)
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            model.showEmoteMenu = false
                        }
                    }) {
                        Text(emote.emoji)
                            .font(.system(size: 19))
                            .padding(5)
                            .background(Circle().fill(Color.white.opacity(0.95)))
                            .shadow(color: .black.opacity(0.2), radius: 3, x: 0, y: 1)
                    }
                    .buttonStyle(.plain)
                    .help(emote.label)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
        }
        .frame(maxWidth: 275)
        .background(
            Capsule()
                .fill(Color.black.opacity(0.85))
                .background(.ultraThinMaterial)
                .shadow(radius: 8)
        )
    }
}
