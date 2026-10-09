import AppKit
import SwiftUI

public final class CameraCapturePanel: NSPanel {
    public static let shared = CameraCapturePanel()

    private init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 280, height: 340),
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        self.isOpaque = false
        self.backgroundColor = .clear
        self.hasShadow = false
        self.level = .floating + 2
        self.isMovableByWindowBackground = false
        self.ignoresMouseEvents = false
        self.hidesOnDeactivate = false
        self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    }

    public override var canBecomeKey: Bool { true }
    public override var canBecomeMain: Bool { true }

    public func present(near stickerFrame: NSRect? = nil) {
        let view = CameraCaptureView { [weak self] in
            self?.dismiss()
        }
        self.contentView = NSHostingView(rootView: view)

        let targetFrame = stickerFrame ?? NSApp.windows.first(where: { $0 is FloatingPanel<StickerView> })?.frame ?? NSRect(x: 200, y: 200, width: 320, height: 320)
        let activeScreen = NSScreen.screens.first(where: { NSMouseInRect(targetFrame.origin, $0.frame, false) }) ?? NSScreen.main
        let screenMinX = activeScreen?.visibleFrame.minX ?? 0

        var panelOrigin = NSPoint(
            x: targetFrame.minX - 295,
            y: targetFrame.midY - 150
        )
        if panelOrigin.x < screenMinX + 20 {
            panelOrigin.x = targetFrame.maxX + 15
        }
        self.setFrameOrigin(panelOrigin)
        self.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    public func dismiss() {
        self.orderOut(nil)
        self.contentView = nil
    }
}
