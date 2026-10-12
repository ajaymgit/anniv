import SwiftUI
import AppKit

public final class SettingsViewModel: ObservableObject {
    @Published public var myOtpCode: String
    @Published public var partnerOtpInput: String = ""
    @Published public var nickname: String = "Babe"
    @Published public var isPaired: Bool = false
    @Published public var partnerFacePath: String
    @Published public var facePreviewImage: NSImage? = nil
    @Published public var isSaved: Bool = false
    @Published public var statusMessage: String? = nil
    @Published public var launchAtLogin: Bool = false
    @Published public var showAdvancedServer: Bool = false
    @Published public var customSupabaseUrl: String
    @Published public var customSupabaseKey: String

    // Photos & Pagination State
    @Published public var currentPage: Int = 0
    @Published public var showAllPhotos: Bool = false
    @Published public var showUnpairAlert: Bool = false

    public init() {
        if let savedRoom = UserDefaults.standard.string(forKey: "CoupleStick_RoomId"), !savedRoom.isEmpty {
            self.myOtpCode = savedRoom
        } else {
            let randomCode = String(format: "%03d-%03d", Int.random(in: 100...999), Int.random(in: 100...999))
            self.myOtpCode = randomCode
            UserDefaults.standard.set(randomCode, forKey: "CoupleStick_RoomId")
            RealtimeService.shared.configure(
                supabaseUrl: AppConfig.defaultSupabaseUrl,
                supabaseKey: AppConfig.defaultSupabaseKey,
                roomId: randomCode
            )
        }

        self.isPaired = UserDefaults.standard.bool(forKey: "CoupleStick_IsPaired")
        self.partnerOtpInput = UserDefaults.standard.string(forKey: "CoupleStick_PartnerOtp") ?? ""
        self.customSupabaseUrl = UserDefaults.standard.string(forKey: "CoupleStick_SupabaseUrl") ?? ""
        self.customSupabaseKey = UserDefaults.standard.string(forKey: "CoupleStick_SupabaseKey") ?? ""
        self.partnerFacePath = UserDefaults.standard.string(forKey: "CoupleStick_PartnerFacePath") ?? ""
        self.nickname = UserDefaults.standard.string(forKey: "CoupleStick_Nickname") ?? "Babe"
        self.launchAtLogin = LaunchAtLoginManager.shared.isEnabled
        loadPreview()
    }

    public func saveNickname(_ newName: String) {
        let trimmed = newName.trimmingCharacters(in: .whitespacesAndNewlines)
        let finalName = trimmed.isEmpty ? "Babe" : trimmed
        self.nickname = finalName
        UserDefaults.standard.set(finalName, forKey: "CoupleStick_Nickname")
        NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_NicknameUpdated"), object: nil)
    }

    public func uploadReactionPhoto(for emote: EmoteType) {
        let panel = NSOpenPanel()
        panel.title = "Upload Reaction Photo, GIF, or Video for \(emote.emoji) \(emote.label)"
        panel.prompt = "Save Reaction"
        panel.allowedContentTypes = [
            .gif, .movie, .quickTimeMovie, .mpeg4Movie, .png, .jpeg, .heic
        ]
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false

        if panel.runModal() == .OK, let url = panel.url {
            ReactionPhotoManager.shared.setPhoto(from: url, for: emote)
            self.objectWillChange.send()
        }
    }

    public func removeReactionPhoto(for emote: EmoteType) {
        ReactionPhotoManager.shared.removePhoto(for: emote)
        self.objectWillChange.send()
    }

    public func loadPreview() {
        if !partnerFacePath.isEmpty, let img = NSImage(contentsOfFile: partnerFacePath) {
            self.facePreviewImage = img
        } else {
            self.facePreviewImage = nil
        }
    }

    public func generateNewOtp() {
        let newCode = String(format: "%03d-%03d", Int.random(in: 100...999), Int.random(in: 100...999))
        self.myOtpCode = newCode
        UserDefaults.standard.set(newCode, forKey: "CoupleStick_RoomId")
        RealtimeService.shared.configure(
            supabaseUrl: customSupabaseUrl.isEmpty ? AppConfig.defaultSupabaseUrl : customSupabaseUrl,
            supabaseKey: customSupabaseKey.isEmpty ? AppConfig.defaultSupabaseKey : customSupabaseKey,
            roomId: newCode
        )
    }

    public func copyOtpToClipboard() {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(myOtpCode, forType: .string)
    }

    public func connectWithPartnerOtp() {
        let cleaned = partnerOtpInput.trimmingCharacters(in: .whitespacesAndNewlines).replacingOccurrences(of: " ", with: "")
        guard !cleaned.isEmpty else { return }

        let formattedCode: String
        if cleaned.count == 6 && !cleaned.contains("-") {
            let firstPart = cleaned.prefix(3)
            let secondPart = cleaned.suffix(3)
            formattedCode = "\(firstPart)-\(secondPart)"
        } else {
            formattedCode = cleaned
        }

        self.myOtpCode = formattedCode
        self.isPaired = true
        UserDefaults.standard.set(true, forKey: "CoupleStick_IsPaired")
        UserDefaults.standard.set(formattedCode, forKey: "CoupleStick_RoomId")
        UserDefaults.standard.set(formattedCode, forKey: "CoupleStick_PartnerOtp")
        RealtimeService.shared.configure(
            supabaseUrl: customSupabaseUrl.isEmpty ? AppConfig.defaultSupabaseUrl : customSupabaseUrl,
            supabaseKey: customSupabaseKey.isEmpty ? AppConfig.defaultSupabaseKey : customSupabaseKey,
            roomId: formattedCode
        )
        isSaved = true
        self.statusMessage = "Paired with partner! ❤️"
        HapticManager.shared.triggerHeartbeatTap()
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            self.isSaved = false
            self.statusMessage = nil
        }
    }

    public func unpair() {
        self.isPaired = false
        self.partnerOtpInput = ""
        UserDefaults.standard.set(false, forKey: "CoupleStick_IsPaired")
        UserDefaults.standard.removeObject(forKey: "CoupleStick_PartnerOtp")

        let newCode = String(format: "%03d-%03d", Int.random(in: 100...999), Int.random(in: 100...999))
        self.myOtpCode = newCode
        UserDefaults.standard.set(newCode, forKey: "CoupleStick_RoomId")

        RealtimeService.shared.configure(
            supabaseUrl: customSupabaseUrl.isEmpty ? AppConfig.defaultSupabaseUrl : customSupabaseUrl,
            supabaseKey: customSupabaseKey.isEmpty ? AppConfig.defaultSupabaseKey : customSupabaseKey,
            roomId: newCode
        )
        RealtimeService.shared.partnerOnline = false

        self.statusMessage = "Unpaired successfully. Generated new private code."
        HapticManager.shared.triggerGentleTap()
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.5) {
            self.statusMessage = nil
        }
    }

    public func chooseFacePhoto() {
        let panel = NSOpenPanel()
        panel.title = "Choose Partner Face Photo"
        panel.allowedContentTypes = [.png, .jpeg, .heic]
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false

        if panel.runModal() == .OK, let url = panel.url {
            if let optimizedImage = downsampleImage(at: url, maxPixelSize: 256) {
                let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first ?? FileManager.default.temporaryDirectory
                let cacheDir = appSupport.appendingPathComponent("CoupleStick")
                try? FileManager.default.createDirectory(at: cacheDir, withIntermediateDirectories: true)
                let destinationUrl = cacheDir.appendingPathComponent("partner_face_optimized.png")

                if let tiff = optimizedImage.tiffRepresentation,
                   let bitmap = NSBitmapImageRep(data: tiff),
                   let pngData = bitmap.representation(using: .png, properties: [:]) {
                    try? pngData.write(to: destinationUrl)
                    self.partnerFacePath = destinationUrl.path
                    self.facePreviewImage = optimizedImage
                    UserDefaults.standard.set(destinationUrl.path, forKey: "CoupleStick_PartnerFacePath")
                    NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_FaceUpdated"), object: nil)
                    return
                }
            }

            self.partnerFacePath = url.path
            loadPreview()
            UserDefaults.standard.set(partnerFacePath, forKey: "CoupleStick_PartnerFacePath")
            NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_FaceUpdated"), object: nil)
        }
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

    public func removeFacePhoto() {
        self.partnerFacePath = ""
        self.facePreviewImage = nil
        UserDefaults.standard.removeObject(forKey: "CoupleStick_PartnerFacePath")
        NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_FaceUpdated"), object: nil)
    }

    public func toggleLaunchAtLogin(_ enabled: Bool) {
        launchAtLogin = enabled
        LaunchAtLoginManager.shared.setLaunchAtLogin(enabled)
    }

    public func saveCustomServer() {
        UserDefaults.standard.set(customSupabaseUrl, forKey: "CoupleStick_SupabaseUrl")
        UserDefaults.standard.set(customSupabaseKey, forKey: "CoupleStick_SupabaseKey")
        RealtimeService.shared.configure(
            supabaseUrl: customSupabaseUrl.isEmpty ? AppConfig.defaultSupabaseUrl : customSupabaseUrl,
            supabaseKey: customSupabaseKey.isEmpty ? AppConfig.defaultSupabaseKey : customSupabaseKey,
            roomId: myOtpCode
        )
        isSaved = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.isSaved = false
        }
    }
}

public struct SettingsView: View {
    @ObservedObject public var viewModel = SettingsViewModel()
    @ObservedObject var realtime = RealtimeService.shared
    @ObservedObject var reactionManager = ReactionPhotoManager.shared

    private let pageSize: Int = 5
    private let allEmotes = EmoteType.allCases.filter { $0 != .chat }

    private var totalPages: Int {
        max(1, Int(ceil(Double(allEmotes.count) / Double(pageSize))))
    }

    private var displayedEmotes: [EmoteType] {
        if viewModel.showAllPhotos {
            return allEmotes
        } else {
            let start = min(viewModel.currentPage * pageSize, allEmotes.count)
            let end = min(start + pageSize, allEmotes.count)
            return Array(allEmotes[start..<end])
        }
    }

    public init() {}

    public var body: some View {
        VStack(spacing: 0) {
            // Header Status Banner
            headerView

            Divider()

            // 2-Column Split: Pairing on Left Side, Reaction Photos on Right Side
            HStack(alignment: .top, spacing: 0) {
                // LEFT SIDE: Pairing, Nickname, Face Photo & App Settings
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        pairingSection
                        partnerProfileSection
                        startupAndAdvancedSection
                    }
                    .padding(18)
                }
                .frame(width: 380)

                Divider()

                // RIGHT SIDE: Reaction Photos (5 per page or scroll down)
                VStack(alignment: .leading, spacing: 12) {
                    photosHeaderView

                    ScrollView {
                        LazyVStack(spacing: 9) {
                            ForEach(displayedEmotes) { emote in
                                emoteReactionRow(for: emote)
                            }
                        }
                        .padding(.vertical, 4)
                        .padding(.horizontal, 2)
                    }

                    if !viewModel.showAllPhotos {
                        paginationControlBar
                    }
                }
                .padding(18)
                .frame(width: 440)
            }
        }
        .frame(width: 820, height: 600)
        .alert(isPresented: $viewModel.showUnpairAlert) {
            Alert(
                title: Text("Unpair from \(viewModel.nickname)?"),
                message: Text("This will disconnect your live session and generate a new private code. You can pair again anytime by sharing your code."),
                primaryButton: .destructive(Text("Unpair")) {
                    viewModel.unpair()
                },
                secondaryButton: .cancel()
            )
        }
    }

    // MARK: - Subviews

    private var headerView: some View {
        HStack {
            HStack(spacing: 8) {
                Text("CoupleStick")
                    .font(.title2)
                    .bold()
                Text("❤️")
                    .font(.title2)
            }

            Spacer()

            HStack(spacing: 6) {
                Circle()
                    .fill(realtime.isConnected ? Color.green : Color.yellow)
                    .frame(width: 8, height: 8)
                Text(realtime.isConnected ? (realtime.partnerOnline ? "Connected with \(viewModel.nickname) 🟢" : "Live Cloud (Partner offline) 🟡") : "Connecting...")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Capsule().fill(Color.gray.opacity(0.12)))
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
    }

    private var pairingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Pairing & Connection")
                    .font(.headline)
                Spacer()
                if viewModel.isPaired {
                    Text("Paired ❤️")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.green)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Capsule().fill(Color.green.opacity(0.15)))
                } else {
                    Text("Not Paired")
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Capsule().fill(Color.gray.opacity(0.15)))
                }
            }

            // Your Pairing Code Card
            VStack(alignment: .leading, spacing: 6) {
                Text("Your 6-Digit Pairing Code:")
                    .font(.caption)
                    .foregroundColor(.secondary)

                HStack {
                    Text(viewModel.myOtpCode)
                        .font(.system(size: 22, weight: .bold, design: .monospaced))
                        .foregroundColor(.pink)

                    Spacer()

                    Button(action: { viewModel.copyOtpToClipboard() }) {
                        Label("Copy", systemImage: "doc.on.doc")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)

                    Button(action: { viewModel.generateNewOtp() }) {
                        Label("New", systemImage: "arrow.triangle.2.circlepath")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
            }
            .padding(10)
            .background(RoundedRectangle(cornerRadius: 10).fill(Color.pink.opacity(0.08)))

            // Enter Partner Code
            VStack(alignment: .leading, spacing: 6) {
                Text(viewModel.isPaired ? "Change or re-enter partner code:" : "Enter \(viewModel.nickname)'s code:")
                    .font(.caption)
                    .foregroundColor(.secondary)

                HStack(spacing: 8) {
                    TextField("e.g. 582-914", text: $viewModel.partnerOtpInput)
                        .textFieldStyle(.roundedBorder)
                        .font(.system(size: 13, design: .monospaced))

                    Button(action: { viewModel.connectWithPartnerOtp() }) {
                        HStack(spacing: 4) {
                            Image(systemName: "heart.fill")
                            Text(viewModel.isSaved ? "Paired! ❤️" : "Pair")
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.pink)
                    .controlSize(.small)
                }
            }

            // UNPAIR BUTTON
            if viewModel.isPaired || realtime.partnerOnline {
                HStack {
                    Text("Disconnect from current room:")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Spacer()
                    Button(role: .destructive, action: {
                        viewModel.showUnpairAlert = true
                    }) {
                        Label("Unpair", systemImage: "link.badge.slash")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                    .tint(.red)
                    .controlSize(.small)
                }
                .padding(.top, 4)
            }

            if let msg = viewModel.statusMessage {
                Text(msg)
                    .font(.caption)
                    .foregroundColor(.pink)
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(nsColor: .controlBackgroundColor))
                .shadow(color: Color.black.opacity(0.03), radius: 2)
        )
    }

    private var partnerProfileSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Partner Profile")
                .font(.headline)

            VStack(alignment: .leading, spacing: 6) {
                Text("Nickname:")
                    .font(.caption)
                    .foregroundColor(.secondary)
                HStack {
                    TextField("e.g. Babe, Honey, Ajay", text: $viewModel.nickname)
                        .textFieldStyle(.roundedBorder)
                    Button("Save") {
                        viewModel.saveNickname(viewModel.nickname)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
            }

            HStack(spacing: 14) {
                if let preview = viewModel.facePreviewImage {
                    Image(nsImage: preview)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 50, height: 50)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.pink, lineWidth: 2))
                } else {
                    Circle()
                        .fill(Color.gray.opacity(0.15))
                        .frame(width: 50, height: 50)
                        .overlay(Image(systemName: "person.crop.circle").font(.system(size: 26)).foregroundColor(.secondary))
                }

                VStack(alignment: .leading, spacing: 5) {
                    Button(action: { viewModel.chooseFacePhoto() }) {
                        Label(viewModel.facePreviewImage != nil ? "Change Face..." : "Choose Face Photo...", systemImage: "photo")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)

                    if viewModel.facePreviewImage != nil {
                        Button(role: .destructive, action: { viewModel.removeFacePhoto() }) {
                            Text("Remove Photo")
                                .font(.caption2)
                                .foregroundColor(.red)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(nsColor: .controlBackgroundColor))
                .shadow(color: Color.black.opacity(0.03), radius: 2)
        )
    }

    private var startupAndAdvancedSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("System & Startup")
                .font(.headline)

            Toggle(
                "Launch at Mac Startup",
                isOn: Binding(
                    get: { viewModel.launchAtLogin },
                    set: { viewModel.toggleLaunchAtLogin($0) }
                )
            )
            .font(.subheadline)

            DisclosureGroup(viewModel.showAdvancedServer ? "Hide Custom Server" : "Custom Server (Optional)") {
                VStack(alignment: .leading, spacing: 6) {
                    TextField("Custom Project URL", text: $viewModel.customSupabaseUrl)
                        .textFieldStyle(.roundedBorder)
                        .font(.caption)
                    SecureField("Custom Anon Key", text: $viewModel.customSupabaseKey)
                        .textFieldStyle(.roundedBorder)
                        .font(.caption)
                    Button("Save Server") {
                        viewModel.saveCustomServer()
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.small)
                }
                .padding(.top, 4)
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(nsColor: .controlBackgroundColor))
                .shadow(color: Color.black.opacity(0.03), radius: 2)
        )
    }

    private var photosHeaderView: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Reaction Media")
                        .font(.headline)
                    Text("Popups on \(viewModel.nickname)'s desktop")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()

                // Mode switcher: 5 Per Page vs Scroll All
                Picker("", selection: $viewModel.showAllPhotos) {
                    Text("5 Per Page").tag(false)
                    Text("Scroll All").tag(true)
                }
                .pickerStyle(.segmented)
                .frame(width: 170)
            }
        }
    }

    private var paginationControlBar: some View {
        HStack {
            Button(action: {
                if viewModel.currentPage > 0 {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        viewModel.currentPage -= 1
                    }
                }
            }) {
                Label("Previous", systemImage: "chevron.left")
                    .font(.caption)
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .disabled(viewModel.currentPage == 0)

            Spacer()

            HStack(spacing: 6) {
                ForEach(0..<totalPages, id: \.self) { pageIndex in
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            viewModel.currentPage = pageIndex
                        }
                    }) {
                        Text("\(pageIndex + 1)")
                            .font(.system(size: 11, weight: viewModel.currentPage == pageIndex ? .bold : .regular))
                            .frame(width: 22, height: 22)
                            .background(
                                Circle()
                                    .fill(viewModel.currentPage == pageIndex ? Color.pink : Color.gray.opacity(0.15))
                            )
                            .foregroundColor(viewModel.currentPage == pageIndex ? .white : .primary)
                    }
                    .buttonStyle(.plain)
                }
            }

            Spacer()

            Button(action: {
                if viewModel.currentPage < totalPages - 1 {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        viewModel.currentPage += 1
                    }
                }
            }) {
                HStack(spacing: 4) {
                    Text("Next")
                    Image(systemName: "chevron.right")
                }
                .font(.caption)
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .disabled(viewModel.currentPage >= totalPages - 1)
        }
        .padding(.top, 4)
    }

    private func emoteReactionRow(for emote: EmoteType) -> some View {
        HStack(spacing: 12) {
            Text(emote.emoji)
                .font(.system(size: 22))
                .frame(width: 32, height: 32)
                .background(Circle().fill(Color.gray.opacity(0.12)))

            VStack(alignment: .leading, spacing: 2) {
                Text(emote.label)
                    .font(.system(size: 13, weight: .semibold))
                Text(reactionManager.hasPhoto(for: emote) ? (reactionManager.isVideo(for: emote) ? "Custom video 🎬" : (reactionManager.isGIF(for: emote) ? "Custom GIF 🎞️" : "Custom photo 📸")) : "Default animation")
                    .font(.caption2)
                    .foregroundColor(reactionManager.hasPhoto(for: emote) ? .pink : .secondary)
            }

            Spacer()

            if reactionManager.hasPhoto(for: emote) {
                if reactionManager.isVideo(for: emote), let videoUrl = reactionManager.videoUrl(for: emote) {
                    LoopingVideoPlayerView(videoUrl: videoUrl)
                        .frame(width: 36, height: 36)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.pink, lineWidth: 1.5))
                } else if reactionManager.isGIF(for: emote), let gifData = reactionManager.gifData(for: emote) {
                    AnimatedGIFView(gifData: gifData)
                        .frame(width: 36, height: 36)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.pink, lineWidth: 1.5))
                } else if let preview = reactionManager.image(for: emote) {
                    Image(nsImage: preview)
                        .resizable()
                        .scaledToFill()
                        .frame(width: 36, height: 36)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.pink, lineWidth: 1.5))
                }

                Button(action: {
                    viewModel.removeReactionPhoto(for: emote)
                }) {
                    Image(systemName: "trash")
                        .foregroundColor(.red.opacity(0.85))
                        .font(.system(size: 12))
                }
                .buttonStyle(.plain)
                .help("Remove reaction photo or video")
            } else {
                Button(action: {
                    viewModel.uploadReactionPhoto(for: emote)
                }) {
                    Label("Upload...", systemImage: "photo.badge.plus")
                        .font(.caption)
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 7)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(nsColor: .controlBackgroundColor))
                .shadow(color: Color.black.opacity(0.04), radius: 2, y: 1)
        )
    }
}
