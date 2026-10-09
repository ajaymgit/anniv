import SwiftUI
import AppKit

public final class SettingsViewModel: ObservableObject {
    @Published public var myOtpCode: String
    @Published public var partnerOtpInput: String = ""
    @Published public var nickname: String = "Babe"
    @Published public var isConnectedStatus: Bool = false
    @Published public var partnerFacePath: String
    @Published public var facePreviewImage: NSImage? = nil
    @Published public var isSaved: Bool = false
    @Published public var launchAtLogin: Bool = false
    @Published public var showAdvancedServer: Bool = false
    @Published public var customSupabaseUrl: String
    @Published public var customSupabaseKey: String

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
        UserDefaults.standard.set(formattedCode, forKey: "CoupleStick_RoomId")
        RealtimeService.shared.configure(
            supabaseUrl: customSupabaseUrl.isEmpty ? AppConfig.defaultSupabaseUrl : customSupabaseUrl,
            supabaseKey: customSupabaseKey.isEmpty ? AppConfig.defaultSupabaseKey : customSupabaseKey,
            roomId: formattedCode
        )
        isSaved = true
        HapticManager.shared.triggerHeartbeatTap()
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            self.isSaved = false
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

    public init() {}

    public var body: some View {
        VStack(spacing: 18) {
            // Header Status Banner
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text("CoupleStick ❤️")
                        .font(.title2)
                        .bold()
                    HStack(spacing: 6) {
                        Circle()
                            .fill(realtime.isConnected ? Color.green : Color.yellow)
                            .frame(width: 8, height: 8)
                        Text(realtime.isConnected ? "Live Connected to Supabase Cloud" : "Connecting...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)

            Form {
                // Section 1: Partner Details & Face Photo
                Section(header: Text("Partner Profile").font(.headline)) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Partner's Nickname:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        HStack {
                            TextField("e.g. Babe, Honey, Ajay", text: $viewModel.nickname)
                                .textFieldStyle(.roundedBorder)
                            Button("Save") {
                                viewModel.saveNickname(viewModel.nickname)
                            }
                            .buttonStyle(.bordered)
                        }
                    }
                    .padding(.bottom, 6)

                    HStack(spacing: 16) {
                        if let preview = viewModel.facePreviewImage {
                            Image(nsImage: preview)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 58, height: 58)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.pink, lineWidth: 2))
                        } else {
                            Circle()
                                .fill(Color.gray.opacity(0.15))
                                .frame(width: 58, height: 58)
                                .overlay(Image(systemName: "person.crop.circle").font(.system(size: 30)).foregroundColor(.secondary))
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Button(action: { viewModel.chooseFacePhoto() }) {
                                Label(viewModel.facePreviewImage != nil ? "Change Photo..." : "Choose Face Photo...", systemImage: "photo")
                            }
                            if viewModel.facePreviewImage != nil {
                                Button("Remove Photo", role: .destructive) {
                                    viewModel.removeFacePhoto()
                                }
                                .font(.caption)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }

                // Section 2: Reaction Photos, GIFs & Videos
                Section(header: Text("Reaction Photos, GIFs & Videos (Shown on \(viewModel.nickname)'s Desktop)").font(.headline)) {
                    Text("Upload custom photos, animated GIFs, or video clips (.mov / .mp4) that pop up when you send these reactions:")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    ForEach(EmoteType.allCases.filter { $0 != .chat }) { emote in
                        HStack(spacing: 12) {
                            Text(emote.emoji)
                                .font(.system(size: 22))

                            VStack(alignment: .leading, spacing: 2) {
                                Text(emote.label)
                                    .font(.system(size: 13, weight: .semibold))
                                Text(reactionManager.hasPhoto(for: emote) ? (reactionManager.isVideo(for: emote) ? "Custom video active 🎬" : (reactionManager.isGIF(for: emote) ? "Custom GIF active 🎞️" : "Custom photo active")) : "Default emoji animation")
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
                                        .foregroundColor(.red.opacity(0.8))
                                        .font(.system(size: 12))
                                }
                                .buttonStyle(.plain)
                                .help("Remove reaction photo or GIF")
                            } else {
                                Button(action: {
                                    viewModel.uploadReactionPhoto(for: emote)
                                }) {
                                    Label("Upload...", systemImage: "photo.badge.plus")
                                        .font(.caption)
                                }
                                .buttonStyle(.bordered)
                            }
                        }
                        .padding(.vertical, 3)
                    }
                }

                // Section 3: 1-Click OTP Pairing
                Section(header: Text("Instant 6-Digit OTP Pairing").font(.headline)) {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Your Pairing Code:")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Text(viewModel.myOtpCode)
                                    .font(.system(size: 24, weight: .bold, design: .monospaced))
                                    .foregroundColor(.pink)
                            }
                            Spacer()
                            Button("Copy Code") {
                                viewModel.copyOtpToClipboard()
                            }
                            Button("New Code") {
                                viewModel.generateNewOtp()
                            }
                        }
                        .padding(10)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Color.pink.opacity(0.08)))

                        Divider()

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Or enter \(viewModel.nickname)'s code:")
                                .font(.caption)
                                .foregroundColor(.secondary)

                            HStack {
                                TextField("e.g. 582-914", text: $viewModel.partnerOtpInput)
                                    .textFieldStyle(.roundedBorder)
                                    .font(.system(size: 14, design: .monospaced))

                                Button(action: { viewModel.connectWithPartnerOtp() }) {
                                    HStack {
                                        Image(systemName: "heart.fill")
                                        Text(viewModel.isSaved ? "Paired! ❤️" : "Pair & Connect")
                                    }
                                }
                                .buttonStyle(.borderedProminent)
                                .tint(.pink)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }

                // Section 4: Mac Startup
                Section(header: Text("Startup").font(.headline)) {
                    Toggle(
                        "Launch CoupleStick on Mac Startup",
                        isOn: Binding(
                            get: { viewModel.launchAtLogin },
                            set: { viewModel.toggleLaunchAtLogin($0) }
                        )
                    )
                    Text("Starts automatically whenever you turn on or unlock your Mac.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                // Section 5: Advanced Server Override (Optional)
                Section(header: Text("Advanced Server Settings (Optional)").font(.headline)) {
                    DisclosureGroup(viewModel.showAdvancedServer ? "Hide Custom Server" : "Show Custom Server") {
                        VStack(alignment: .leading, spacing: 8) {
                            TextField("Custom Project URL", text: $viewModel.customSupabaseUrl)
                                .textFieldStyle(.roundedBorder)
                            SecureField("Custom Anon Key", text: $viewModel.customSupabaseKey)
                                .textFieldStyle(.roundedBorder)
                            Button("Save Custom Server") {
                                viewModel.saveCustomServer()
                            }
                        }
                        .padding(.top, 4)
                    }
                }
            }
        }
        .padding(.bottom, 16)
        .frame(width: 460)
    }
}
