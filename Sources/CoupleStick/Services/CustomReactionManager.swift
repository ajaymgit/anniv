import Foundation
import AppKit

public final class CustomReactionManager: ObservableObject {
    public static let shared = CustomReactionManager()

    private init() {}

    public func hasCustomReaction(for emote: EmoteType) -> Bool {
        return ReactionPhotoManager.shared.hasPhoto(for: emote)
    }

    public func isGIF(for emote: EmoteType) -> Bool {
        return ReactionPhotoManager.shared.isGIF(for: emote)
    }

    public func isVideo(for emote: EmoteType) -> Bool {
        return ReactionPhotoManager.shared.isVideo(for: emote)
    }

    public func getCustomReactionGifData(for emote: EmoteType) -> Data? {
        return ReactionPhotoManager.shared.gifData(for: emote)
    }

    public func getCustomReactionVideoUrl(for emote: EmoteType) -> URL? {
        return ReactionPhotoManager.shared.videoUrl(for: emote)
    }

    public func getCustomReactionPath(for emote: EmoteType) -> String? {
        return nil
    }

    public func getCustomReactionPreview(for emote: EmoteType) -> NSImage? {
        return ReactionPhotoManager.shared.image(for: emote)
    }

    public func setCustomReaction(for emote: EmoteType, sourceUrl: URL) -> Bool {
        ReactionPhotoManager.shared.setPhoto(from: sourceUrl, for: emote)
        return true
    }

    public func removeCustomReaction(for emote: EmoteType) {
        ReactionPhotoManager.shared.removePhoto(for: emote)
    }

    public func getCustomReactionDataUrl(for emote: EmoteType) -> String? {
        return ReactionPhotoManager.shared.dataUrl(for: emote)
    }
}
