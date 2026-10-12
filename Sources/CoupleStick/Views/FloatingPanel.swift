import AppKit
import SwiftUI

// MARK: - Reliable Fast Pass-Through Hosting View
/// Ensures all active UI controls (avatar, buttons, popups) capture clicks 100% reliably.
/// Empty transparent window corners pass clicks straight through to background apps.
public final class InteractiveHostingView<Content: View>: NSHostingView<Content> {
    public override func hitTest(_ point: NSPoint) -> NSView? {
        guard let hitView = super.hitTest(point) else { return nil }
        
        let localPoint = self.convert(point, from: nil)
        
        // Return hitView directly so all SwiftUI buttons, text fields, and tap gestures receive clicks 100%!
        if localPoint.x >= 10 && localPoint.x <= 310 && localPoint.y >= 10 && localPoint.y <= 310 {
            return hitView
        }
        
        // Empty outer corners pass clicks through to background apps
        return nil
    }
}

// MARK: - Floating Panel
public final class FloatingPanel<Content: View>: NSPanel {
    private var dragStartOrigin: NSPoint = .zero
    private let positionStorageKey = "CoupleStick_StickerPosition"

    public init(contentRect: NSRect, rootView: Content) {
        super.init(
            contentRect: contentRect,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )

        self.isOpaque = false
        self.backgroundColor = .clear
        self.hasShadow = false
        self.level = .floating
        self.isMovableByWindowBackground = false
        self.ignoresMouseEvents = false
        self.hidesOnDeactivate = false

        // Keep sticker visible across all macOS spaces & full-screen apps
        self.collectionBehavior = [
            .canJoinAllSpaces,
            .fullScreenAuxiliary,
            .stationary
        ]

        let hostingView = InteractiveHostingView(rootView: rootView)
        self.contentView = hostingView

        restorePosition()
        setupScreenChangeObserver()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    public override var canBecomeKey: Bool { true }
    public override var canBecomeMain: Bool { true }

    // MARK: - Multi-Monitor & Display Disconnect Protection
    private func setupScreenChangeObserver() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenParametersChanged),
            name: NSApplication.didChangeScreenParametersNotification,
            object: nil
        )
    }

    @objc private func screenParametersChanged() {
        guard let currentScreen = self.screen ?? NSScreen.main else { return }
        let visible = currentScreen.visibleFrame

        var origin = self.frame.origin
        if origin.x < visible.minX || origin.x > visible.maxX - 80 ||
           origin.y < visible.minY || origin.y > visible.maxY - 80 {
            origin.x = visible.maxX - self.frame.width - 24
            origin.y = visible.maxY - self.frame.height - 48
            self.setFrameOrigin(origin)
            savePosition(origin)
        }
    }

    // MARK: - Freeform Full-Screen Dragging
    public func startDrag() {
        dragStartOrigin = self.frame.origin
    }

    public func updateDrag(translationX: CGFloat, translationY: CGFloat) {
        if dragStartOrigin == .zero {
            dragStartOrigin = self.frame.origin
        }

        var newOrigin = NSPoint(
            x: dragStartOrigin.x + translationX,
            y: dragStartOrigin.y - translationY
        )

        if let screen = self.screen ?? NSScreen.main {
            let visible = screen.visibleFrame
            newOrigin.x = max(visible.minX - 40, min(newOrigin.x, visible.maxX - frame.width + 40))
            newOrigin.y = max(visible.minY - 40, min(newOrigin.y, visible.maxY - frame.height + 40))
        }

        self.setFrameOrigin(newOrigin)
    }

    public func endDrag() {
        savePosition(self.frame.origin)
        dragStartOrigin = .zero
    }

    private func savePosition(_ origin: NSPoint) {
        UserDefaults.standard.set(["x": origin.x, "y": origin.y], forKey: positionStorageKey)
    }

    private func restorePosition() {
        if let dict = UserDefaults.standard.dictionary(forKey: positionStorageKey),
           let x = dict["x"] as? CGFloat,
           let y = dict["y"] as? CGFloat {
            self.setFrameOrigin(NSPoint(x: x, y: y))
        } else if let screen = NSScreen.main {
            let visible = screen.visibleFrame
            let defaultX = visible.maxX - frame.width - 24
            let defaultY = visible.maxY - frame.height - 48
            self.setFrameOrigin(NSPoint(x: defaultX, y: defaultY))
        }
    }
}
