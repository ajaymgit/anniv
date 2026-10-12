import Foundation
import AppKit
import AVFoundation

public final class ReactionPhotoManager: ObservableObject {
    public static let shared = ReactionPhotoManager()

    private let fileManager = FileManager.default
    private var cachedDataUrls: [String: String] = [:]
    private var cachedImages: [String: NSImage] = [:]
    private var cachedGifData: [String: Data] = [:]
    private var cachedVideoUrls: [String: URL] = [:]

    private var storageDirectory: URL {
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first ?? fileManager.temporaryDirectory
        let dir = appSupport.appendingPathComponent("CoupleStick/Reactions", isDirectory: true)
        try? fileManager.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir
    }

    private init() {
        preloadCache()
    }

    private func preloadCache() {
        for emote in EmoteType.allCases where emote != .chat {
            let extensions = ["mov", "mp4", "m4v", "gif", "png", "jpg", "jpeg"]
            for ext in extensions {
                let fileUrl = storageDirectory.appendingPathComponent("\(emote.rawValue).\(ext)")
                if fileManager.fileExists(atPath: fileUrl.path),
                   let data = try? Data(contentsOf: fileUrl) {
                    if ext == "mov" || ext == "mp4" || ext == "m4v" {
                        cachedVideoUrls[emote.rawValue] = fileUrl
                        let mime = (ext == "mov") ? "video/quicktime" : "video/mp4"
                        let base64 = data.base64EncodedString()
                        cachedDataUrls[emote.rawValue] = "data:\(mime);base64,\(base64)"
                        if let thumb = extractVideoThumbnail(url: fileUrl) {
                            cachedImages[emote.rawValue] = thumb
                        }
                        break
                    } else if ext == "gif" {
                        if let image = NSImage(data: data) {
                            cachedImages[emote.rawValue] = image
                        }
                        cachedGifData[emote.rawValue] = data
                        let base64 = data.base64EncodedString()
                        cachedDataUrls[emote.rawValue] = "data:image/gif;base64,\(base64)"
                        break
                    } else if ext == "png" || ext == "jpg" || ext == "jpeg" {
                        if let image = NSImage(data: data) {
                            cachedImages[emote.rawValue] = image
                            let base64 = data.base64EncodedString()
                            let mime = (ext == "png") ? "image/png" : "image/jpeg"
                            cachedDataUrls[emote.rawValue] = "data:\(mime);base64,\(base64)"
                        }
                        break
                    }
                }
            }
        }
    }

    public func hasPhoto(for emote: EmoteType) -> Bool {
        return cachedImages[emote.rawValue] != nil || cachedGifData[emote.rawValue] != nil || cachedVideoUrls[emote.rawValue] != nil
    }

    public func image(for emote: EmoteType) -> NSImage? {
        return cachedImages[emote.rawValue]
    }

    public func dataUrl(for emote: EmoteType) -> String? {
        return cachedDataUrls[emote.rawValue]
    }

    public func isGIF(for emote: EmoteType) -> Bool {
        return cachedGifData[emote.rawValue] != nil
    }

    public func gifData(for emote: EmoteType) -> Data? {
        return cachedGifData[emote.rawValue]
    }

    public func isVideo(for emote: EmoteType) -> Bool {
        return cachedVideoUrls[emote.rawValue] != nil
    }

    public func videoUrl(for emote: EmoteType) -> URL? {
        return cachedVideoUrls[emote.rawValue]
    }

    public func setPhoto(from fileUrl: URL, for emote: EmoteType) {
        let ext = fileUrl.pathExtension.lowercased()
        let isVideoFile = ["mov", "mp4", "m4v", "qt"].contains(ext)
        var isGif = (ext == "gif")

        if !isGif && !isVideoFile, let data = try? Data(contentsOf: fileUrl), data.count >= 6 {
            let header = String(decoding: data.prefix(6), as: UTF8.self)
            if header == "GIF87a" || header == "GIF89a" {
                isGif = true
            }
        }

        // If the user uploaded a .mov or .mp4 video, preserve and use the original video file directly for 100% full speed!
        if isVideoFile {
            saveVideo(sourceUrl: fileUrl, for: emote)
            return
        }

        if isGif {
            guard let data = try? Data(contentsOf: fileUrl),
                  let image = NSImage(data: data) else {
                return
            }
            saveGif(data: data, image: image, for: emote)
        } else {
            guard let downsampled = downsampleImage(at: fileUrl, maxPixelSize: 500),
                  let jpegData = jpegData(for: downsampled, quality: 0.72) else {
                return
            }
            saveJpeg(data: jpegData, image: downsampled, for: emote)
        }
    }

    public func setPhoto(image: NSImage, for emote: EmoteType) {
        guard let resized = resizeImage(image: image, maxPixelSize: 500),
              let jpegData = jpegData(for: resized, quality: 0.72) else {
            return
        }
        saveJpeg(data: jpegData, image: resized, for: emote)
    }

    private func saveVideo(sourceUrl: URL, for emote: EmoteType) {
        removeExistingFiles(for: emote)

        let ext = sourceUrl.pathExtension.lowercased()
        let savedExt = (ext == "mp4" || ext == "m4v") ? "mp4" : "mov"
        let destUrl = storageDirectory.appendingPathComponent("\(emote.rawValue).\(savedExt)")

        try? fileManager.removeItem(at: destUrl)
        try? fileManager.copyItem(at: sourceUrl, to: destUrl)

        cachedVideoUrls[emote.rawValue] = destUrl

        if let thumb = extractVideoThumbnail(url: destUrl) {
            cachedImages[emote.rawValue] = thumb
        }

        if let data = try? Data(contentsOf: destUrl) {
            let mime = (savedExt == "mov") ? "video/quicktime" : "video/mp4"
            let base64 = data.base64EncodedString()
            cachedDataUrls[emote.rawValue] = "data:\(mime);base64,\(base64)"
        }

        DispatchQueue.main.async {
            self.objectWillChange.send()
            NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_ReactionPhotosUpdated"), object: nil)
        }
    }

    private func saveGif(data: Data, image: NSImage, for emote: EmoteType) {
        removeExistingFiles(for: emote)

        let fileUrl = storageDirectory.appendingPathComponent("\(emote.rawValue).gif")
        try? data.write(to: fileUrl)

        cachedImages[emote.rawValue] = image
        cachedGifData[emote.rawValue] = data
        let base64 = data.base64EncodedString()
        cachedDataUrls[emote.rawValue] = "data:image/gif;base64,\(base64)"

        DispatchQueue.main.async {
            self.objectWillChange.send()
            NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_ReactionPhotosUpdated"), object: nil)
        }
    }

    private func saveJpeg(data: Data, image: NSImage, for emote: EmoteType) {
        removeExistingFiles(for: emote)

        let fileUrl = storageDirectory.appendingPathComponent("\(emote.rawValue).jpg")
        try? data.write(to: fileUrl)

        cachedImages[emote.rawValue] = image
        cachedGifData.removeValue(forKey: emote.rawValue)
        let base64 = data.base64EncodedString()
        cachedDataUrls[emote.rawValue] = "data:image/jpeg;base64,\(base64)"

        DispatchQueue.main.async {
            self.objectWillChange.send()
            NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_ReactionPhotosUpdated"), object: nil)
        }
    }

    public func removePhoto(for emote: EmoteType) {
        removeExistingFiles(for: emote)

        cachedImages.removeValue(forKey: emote.rawValue)
        cachedDataUrls.removeValue(forKey: emote.rawValue)
        cachedGifData.removeValue(forKey: emote.rawValue)
        cachedVideoUrls.removeValue(forKey: emote.rawValue)

        DispatchQueue.main.async {
            self.objectWillChange.send()
            NotificationCenter.default.post(name: NSNotification.Name("CoupleStick_ReactionPhotosUpdated"), object: nil)
        }
    }

    private func removeExistingFiles(for emote: EmoteType) {
        let extensions = ["mov", "mp4", "m4v", "gif", "png", "jpg", "jpeg"]
        for ext in extensions {
            let fileUrl = storageDirectory.appendingPathComponent("\(emote.rawValue).\(ext)")
            try? fileManager.removeItem(at: fileUrl)
        }
    }

    private func extractVideoThumbnail(url: URL) -> NSImage? {
        let asset = AVURLAsset(url: url)
        let gen = AVAssetImageGenerator(asset: asset)
        gen.appliesPreferredTrackTransform = true
        let time = CMTime(seconds: 0.1, preferredTimescale: 600)
        if let cgImage = try? gen.copyCGImage(at: time, actualTime: nil) {
            return NSImage(cgImage: cgImage, size: NSSize(width: cgImage.width, height: cgImage.height))
        }
        return nil
    }

    // MARK: - Image Utilities
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

    private func resizeImage(image: NSImage, maxPixelSize: Int) -> NSImage? {
        guard let tiff = image.tiffRepresentation,
              let imageSource = CGImageSourceCreateWithData(tiff as CFData, nil) else { return nil }
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

    private func jpegData(for image: NSImage, quality: CGFloat) -> Data? {
        guard let tiff = image.tiffRepresentation,
              let rep = NSBitmapImageRep(data: tiff) else { return nil }
        return rep.representation(using: .jpeg, properties: [.compressionFactor: quality])
    }
}
