import SwiftUI
import AppKit

public struct AnimatedGIFView: NSViewRepresentable {
    let gifData: Data

    public init(gifData: Data) {
        self.gifData = gifData
    }

    public func makeNSView(context: Context) -> NSImageView {
        let imageView = NSImageView()
        imageView.imageScaling = .scaleProportionallyUpOrDown
        imageView.animates = true
        imageView.wantsLayer = true
        if let image = NSImage(data: gifData) {
            imageView.image = image
        }
        context.coordinator.lastDataHash = gifData.hashValue
        return imageView
    }

    public func updateNSView(_ nsView: NSImageView, context: Context) {
        // Crucial: Only reload if the gifData actually changed!
        // Re-assigning nsView.image on every SwiftUI layout tick resets the GIF frame animation,
        // which makes animated GIFs run in slow motion or stutter.
        if context.coordinator.lastDataHash != gifData.hashValue {
            context.coordinator.lastDataHash = gifData.hashValue
            if let image = NSImage(data: gifData) {
                nsView.image = image
                nsView.animates = true
            }
        }
    }

    public func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    public class Coordinator {
        var lastDataHash: Int = 0
    }
}
