import SwiftUI
import AppKit
import AVFoundation
import AVKit

// MARK: - Looping Video Player for .mov / .mp4
public struct LoopingVideoPlayerView: NSViewRepresentable {
    let videoUrl: URL

    public init(videoUrl: URL) {
        self.videoUrl = videoUrl
    }

    public func makeNSView(context: Context) -> AVPlayerView {
        let playerView = AVPlayerView()
        playerView.controlsStyle = .none
        let player = AVQueuePlayer()
        let item = AVPlayerItem(url: videoUrl)
        let looper = AVPlayerLooper(player: player, templateItem: item)
        context.coordinator.looper = looper
        context.coordinator.player = player
        playerView.player = player
        player.isMuted = true
        player.play()
        return playerView
    }

    public func updateNSView(_ nsView: AVPlayerView, context: Context) {}

    public func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    public class Coordinator {
        var looper: AVPlayerLooper?
        var player: AVQueuePlayer?
    }
}

public final class PhotoPopupViewModel: ObservableObject {
    @Published public var scale: CGFloat = 0.2
    @Published public var opacity: Double = 0.0

    public init() {}

    public func popIn() {
        withAnimation(.spring(response: 0.24, dampingFraction: 0.65)) {
            self.scale = 1.0
            self.opacity = 1.0
        }
    }

    public func dismiss(onDone: @escaping () -> Void) {
        withAnimation(.easeIn(duration: 0.22)) {
            self.scale = 0.75
            self.opacity = 0.0
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.24) {
            onDone()
        }
    }
}

public struct PhotoPopupView: View {
    let photoUrl: String?
    let message: String?
    let onDismiss: () -> Void

    @ObservedObject private var animModel = PhotoPopupViewModel()

    private var nickname: String {
        UserDefaults.standard.string(forKey: "CoupleStick_Nickname") ?? "Babe"
    }

    public init(photoUrl: String?, message: String?, onDismiss: @escaping () -> Void) {
        self.photoUrl = photoUrl
        self.message = message
        self.onDismiss = onDismiss
    }

    public var body: some View {
        VStack(spacing: 8) {
            // Header with dismiss button
            HStack {
                HStack(spacing: 5) {
                    Image(systemName: "photo.fill")
                        .foregroundColor(.pink)
                        .font(.system(size: 11))
                    Text("From \(nickname) ❤️")
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundColor(.white.opacity(0.92))
                }
                Spacer()
                Button(action: {
                    animModel.dismiss(onDone: onDismiss)
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.white.opacity(0.6))
                        .font(.system(size: 14))
                }
                .buttonStyle(.plain)
            }

            // Mini Digital Photo / GIF / Video Screen
            if let photoUrl = photoUrl, !photoUrl.isEmpty {
                miniPhotoScreen(for: photoUrl)
            }

            // Optional message caption
            if let msg = message, !msg.isEmpty {
                Text(msg)
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(RoundedRectangle(cornerRadius: 10).fill(Color.white.opacity(0.12)))
            }
        }
        .padding(12)
        .frame(width: 230)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.black.opacity(0.9))
                .background(.ultraThinMaterial)
                .shadow(color: .pink.opacity(0.45), radius: 18, x: 0, y: 6)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(
                    LinearGradient(
                        colors: [.pink.opacity(0.9), .purple.opacity(0.8)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.8
                )
        )
        .scaleEffect(animModel.scale)
        .opacity(animModel.opacity)
        .onAppear {
            animModel.popIn()

            // Vanish automatically after 4.5 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 4.5) {
                animModel.dismiss(onDone: onDismiss)
            }
        }
    }

    @ViewBuilder
    private func miniPhotoScreen(for urlString: String) -> some View {
        if isGif(urlString) {
            if let gifData = extractGifData(from: urlString) {
                AnimatedGIFView(gifData: gifData)
                    .frame(width: 206, height: 175)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.2), lineWidth: 1))
            }
        } else if isVideo(urlString) {
            if let videoUrl = extractVideoUrl(from: urlString) {
                LoopingVideoPlayerView(videoUrl: videoUrl)
                    .frame(width: 206, height: 175)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.2), lineWidth: 1))
            }
        } else if urlString.hasPrefix("data:image/") {
            if let base64Data = extractBase64Data(from: urlString),
               let nsImage = NSImage(data: base64Data) {
                Image(nsImage: nsImage)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 206, height: 175)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.2), lineWidth: 1))
            }
        } else if let url = URL(string: urlString) {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                        .frame(width: 206, height: 175)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                default:
                    ZStack {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.white.opacity(0.08))
                            .frame(width: 206, height: 175)
                        ProgressView()
                    }
                }
            }
        }
    }

    private func isVideo(_ urlString: String) -> Bool {
        if urlString.hasPrefix("data:video/") || urlString.lowercased().hasSuffix(".mov") || urlString.lowercased().hasSuffix(".mp4") || urlString.lowercased().hasSuffix(".m4v") {
            return true
        }
        return false
    }

    private func extractVideoUrl(from urlString: String) -> URL? {
        if urlString.hasPrefix("data:video/") {
            guard let data = extractBase64Data(from: urlString) else { return nil }
            let tempDir = FileManager.default.temporaryDirectory
            let tempUrl = tempDir.appendingPathComponent("couplestick_incoming_\(UUID().uuidString).mp4")
            try? data.write(to: tempUrl)
            return tempUrl
        } else if urlString.hasPrefix("file://"), let url = URL(string: urlString) {
            return url
        } else if FileManager.default.fileExists(atPath: urlString) {
            return URL(fileURLWithPath: urlString)
        } else if let url = URL(string: urlString) {
            return url
        }
        return nil
    }

    private func isGif(_ urlString: String) -> Bool {
        if urlString.hasPrefix("data:image/gif") || urlString.lowercased().hasSuffix(".gif") {
            return true
        }
        if urlString.hasPrefix("data:") {
            if let data = extractBase64Data(from: urlString), data.count >= 6 {
                let header = String(decoding: data.prefix(6), as: UTF8.self)
                if header == "GIF87a" || header == "GIF89a" {
                    return true
                }
            }
        }
        return false
    }

    private func extractGifData(from urlString: String) -> Data? {
        if urlString.hasPrefix("data:") {
            return extractBase64Data(from: urlString)
        } else if urlString.hasPrefix("file://"), let url = URL(string: urlString) {
            return try? Data(contentsOf: url)
        } else if FileManager.default.fileExists(atPath: urlString) {
            return try? Data(contentsOf: URL(fileURLWithPath: urlString))
        }
        return nil
    }

    private func extractBase64Data(from dataUrl: String) -> Data? {
        guard let commaIndex = dataUrl.firstIndex(of: ",") else {
            return Data(base64Encoded: dataUrl)
        }
        let base64Substring = dataUrl[dataUrl.index(after: commaIndex)...]
        return Data(base64Encoded: String(base64Substring))
    }
}
