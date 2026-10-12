import AppKit
import SwiftUI

public final class PhotoPopupPanel: NSPanel {
    public static let shared = PhotoPopupPanel()
    private var dismissWorkItem: DispatchWorkItem?

    private init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 250, height: 260),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )

        self.isOpaque = false
        self.backgroundColor = .clear
        self.hasShadow = false
        self.level = .floating + 1
        self.hidesOnDeactivate = false
        self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    }

    public func present(near stickerFrame: NSRect, photoUrl: String, message: String?) {
        dismissWorkItem?.cancel()

        let view = PhotoPopupView(photoUrl: photoUrl, message: message) { [weak self] in
            self?.dismiss()
        }
        self.contentView = NSHostingView(rootView: view)

        let activeScreen = NSScreen.screens.first(where: { NSMouseInRect(stickerFrame.origin, $0.frame, false) }) ?? NSScreen.main
        let screenMinX = activeScreen?.visibleFrame.minX ?? 0

        var popupOrigin = NSPoint(
            x: stickerFrame.minX - 260,
            y: stickerFrame.midY - 110
        )
        if popupOrigin.x < screenMinX + 20 {
            popupOrigin.x = stickerFrame.maxX + 10
        }
        self.setFrameOrigin(popupOrigin)
        self.orderFrontRegardless()

        let workItem = DispatchWorkItem { [weak self] in
            self?.dismiss()
        }
        self.dismissWorkItem = workItem
        // Auto-dismiss safety net after 4.2 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 4.2, execute: workItem)
    }

    public func dismiss() {
        dismissWorkItem?.cancel()
        dismissWorkItem = nil
        self.orderOut(nil)
    }
}
