import AppKit
import SwiftUI

public final class AppDelegate: NSObject, NSApplicationDelegate, NSMenuDelegate {
    private var statusItem: NSStatusItem!
    private var stickerPanel: FloatingPanel<StickerView>?
    private var toggleMenuItem: NSMenuItem!
    private var pokeMenuItem: NSMenuItem!
    private var kissMenuItem: NSMenuItem!
    private var reactBackMenuItem: NSMenuItem!
    private var mediaMenuItem: NSMenuItem!
    private var cameraMenuItem: NSMenuItem!
    private var interactionsSeparator: NSMenuItem!
    private var settingsWindow: NSWindow?
    private var isStickerVisible: Bool = true
    private var nickname: String {
        UserDefaults.standard.string(forKey: "CoupleStick_Nickname") ?? "Babe"
    }

    public func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)

        UpdateChecker.shared.start()

        setupMainMenu()
        setupStatusBarItem()
        setupFloatingSticker()
        setupRealtimeTriggers()
    }

    private func setupMainMenu() {
        let mainMenu = NSMenu()
        let editMenuItem = NSMenuItem()
        let editMenu = NSMenu(title: "Edit")
        editMenu.addItem(withTitle: "Undo", action: Selector(("undo:")), keyEquivalent: "z")
        editMenu.addItem(withTitle: "Redo", action: Selector(("redo:")), keyEquivalent: "Z")
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(withTitle: "Cut", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copy", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Paste", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Select All", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        editMenuItem.submenu = editMenu
        mainMenu.addItem(editMenuItem)
        NSApp.mainMenu = mainMenu
    }

    private func setupStatusBarItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.title = "❤️"
            button.toolTip = "CoupleStick — Live Couple Stickers"
        }

        let menu = NSMenu()
        menu.delegate = self
        
        // Visibility toggle
        toggleMenuItem = NSMenuItem(title: "Hide Sticker", action: #selector(toggleStickerVisibility), keyEquivalent: "h")
        menu.addItem(toggleMenuItem)
        menu.addItem(NSMenuItem.separator())

        // Quick interactions with Global Hotkeys
        pokeMenuItem = NSMenuItem(title: "Poke Partner 👉 (Cmd+Shift+P)", action: #selector(sendPoke), keyEquivalent: "P")
        pokeMenuItem.keyEquivalentModifierMask = [.command, .shift]
        pokeMenuItem.isHidden = true
        menu.addItem(pokeMenuItem)

        kissMenuItem = NSMenuItem(title: "Send Kiss 💋 (Cmd+Shift+K)", action: #selector(sendTestKiss), keyEquivalent: "K")
        kissMenuItem.keyEquivalentModifierMask = [.command, .shift]
        kissMenuItem.isHidden = true
        menu.addItem(kissMenuItem)

        reactBackMenuItem = NSMenuItem(title: "React Back to \(nickname) ❤️ (Cmd+Shift+R)", action: #selector(reactBack), keyEquivalent: "R")
        reactBackMenuItem.keyEquivalentModifierMask = [.command, .shift]
        reactBackMenuItem.isHidden = true
        menu.addItem(reactBackMenuItem)

        mediaMenuItem = NSMenuItem(title: "Send Photo or Video... 📸 (Cmd+Shift+U)", action: #selector(sendPhotoOrVideo), keyEquivalent: "U")
        mediaMenuItem.keyEquivalentModifierMask = [.command, .shift]
        mediaMenuItem.isHidden = true
        menu.addItem(mediaMenuItem)

        cameraMenuItem = NSMenuItem(title: "Take Selfie for \(nickname) 📸 (Cmd+Shift+C)", action: #selector(takeWebcamSnap), keyEquivalent: "C")
        cameraMenuItem.keyEquivalentModifierMask = [.command, .shift]
        cameraMenuItem.isHidden = true
        menu.addItem(cameraMenuItem)

        interactionsSeparator = NSMenuItem.separator()
        interactionsSeparator.isHidden = true
        menu.addItem(interactionsSeparator)

        // Sound Mute Toggle
        let muteTitle = SoundManager.shared.isMuted ? "Unmute Sound FX 🔔" : "Mute Sound FX 🔕"
        menu.addItem(NSMenuItem(title: muteTitle, action: #selector(toggleSoundMute), keyEquivalent: "m"))
        menu.addItem(NSMenuItem.separator())

        // Status Submenu (Focus & Sleep Hat)
        let statusSubmenu = NSMenu()
        let activeItem = NSMenuItem(title: "Active 🟢", action: #selector(setStatusNormal), keyEquivalent: "")
        let workItem = NSMenuItem(title: "In Deep Work 🎧", action: #selector(setStatusWork), keyEquivalent: "")
        let sleepItem = NSMenuItem(title: "Sleeping 💤", action: #selector(setStatusSleep), keyEquivalent: "")
        statusSubmenu.addItem(activeItem)
        statusSubmenu.addItem(workItem)
        statusSubmenu.addItem(sleepItem)

        let statusMenuItem = NSMenuItem(title: "My Status", action: nil, keyEquivalent: "")
        statusMenuItem.submenu = statusSubmenu
        menu.addItem(statusMenuItem)
        menu.addItem(NSMenuItem.separator())

        // Configuration
        menu.addItem(NSMenuItem(title: "Settings & Face Photo...", action: #selector(openSettings), keyEquivalent: ","))
        menu.addItem(NSMenuItem(title: "Reset Sticker Position", action: #selector(resetPosition), keyEquivalent: "r"))
        menu.addItem(NSMenuItem(title: "Restart CoupleStick ⚡️", action: #selector(relaunchApp), keyEquivalent: ""))
        menu.addItem(NSMenuItem(title: "Check for Updates... 🔄", action: #selector(checkForUpdates), keyEquivalent: "u"))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Quit CoupleStick", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))

        statusItem.menu = menu
    }

    private func setupFloatingSticker() {
        let panelRect = NSRect(x: 0, y: 0, width: 320, height: 320)
        stickerPanel = FloatingPanel(contentRect: panelRect, rootView: StickerView())
        stickerPanel?.orderFrontRegardless()
        isStickerVisible = true
    }

    @objc private func toggleStickerVisibility() {
        guard let panel = stickerPanel else { return }
        if isStickerVisible {
            panel.orderOut(nil)
            isStickerVisible = false
            toggleMenuItem.title = "Show Sticker"
        } else {
            panel.orderFrontRegardless()
            isStickerVisible = true
            toggleMenuItem.title = "Hide Sticker"
        }
    }

    private func setupRealtimeTriggers() {
        RealtimeService.shared.onEmoteReceived = { [weak self] payload in
            guard let self = self, let panel = self.stickerPanel else { return }
            
            if !self.isStickerVisible {
                panel.orderFrontRegardless()
                self.isStickerVisible = true
                self.toggleMenuItem.title = "Hide Sticker"
            }

            // The big popup panel ONLY appears when PHOTOS / VIDEOS are being sent!
            if let photo = payload.popupPhotoUrl, !photo.isEmpty {
                PhotoPopupPanel.shared.present(
                    near: panel.frame,
                    photoUrl: photo,
                    message: payload.message
                )
            }
        }
    }

    @objc private func toggleSoundMute(sender: NSMenuItem) {
        SoundManager.shared.isMuted.toggle()
        sender.title = SoundManager.shared.isMuted ? "Unmute Sound FX 🔔" : "Mute Sound FX 🔕"
    }

    public func menuNeedsUpdate(_ menu: NSMenu) {
        let isConnected = RealtimeService.shared.isConnected
        let nick = nickname
        pokeMenuItem.title = "Poke \(nick) 👉 (Cmd+Shift+P)"
        kissMenuItem.title = "Send Kiss to \(nick) 💋 (Cmd+Shift+K)"
        reactBackMenuItem.title = "React Back to \(nick) ❤️ (Cmd+Shift+R)"
        mediaMenuItem.title = "Send Photo to \(nick)... 📸 (Cmd+Shift+U)"
        cameraMenuItem.title = "Take Selfie for \(nick) 📸 (Cmd+Shift+C)"

        pokeMenuItem.isHidden = !isConnected
        kissMenuItem.isHidden = !isConnected
        reactBackMenuItem.isHidden = !isConnected
        mediaMenuItem.isHidden = !isConnected
        cameraMenuItem.isHidden = !isConnected
        interactionsSeparator.isHidden = !isConnected
    }

    @objc private func sendPoke() {
        guard RealtimeService.shared.isConnected else { return }
        let customDataUrl = CustomReactionManager.shared.getCustomReactionDataUrl(for: .poke)
        if let photo = customDataUrl, !photo.isEmpty {
            RealtimeService.shared.sendEmote(.poke, photoUrl: photo, message: "Poked you! 👉")
            if let panel = stickerPanel {
                PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: photo, message: "Poked \(nickname)! 👉")
            }
        } else {
            RealtimeService.shared.sendPoke()
        }
    }

    @objc private func sendTestKiss() {
        guard RealtimeService.shared.isConnected else { return }
        let customDataUrl = CustomReactionManager.shared.getCustomReactionDataUrl(for: .kiss)
        RealtimeService.shared.sendEmote(.kiss, photoUrl: customDataUrl, message: "Sent you a kiss! 💋")
        if let panel = stickerPanel, let photo = customDataUrl, !photo.isEmpty {
            PhotoPopupPanel.shared.present(near: panel.frame, photoUrl: photo, message: "Sent kiss to \(nickname)! 💋")
        }
    }

    @objc private func takeWebcamSnap() {
        guard RealtimeService.shared.isConnected else { return }
        if let p = self.stickerPanel {
            CameraCapturePanel.shared.present(near: p.frame)
        } else {
            CameraCapturePanel.shared.present()
        }
    }

    @objc private func sendPhotoOrVideo() {
        guard RealtimeService.shared.isConnected else { return }
        let panel = NSOpenPanel()
        panel.title = "Choose Photo or Video to Send"
        panel.prompt = "Send to Partner"
        panel.allowedContentTypes = [
            .png, .jpeg, .heic, .gif, .movie, .quickTimeMovie, .mpeg4Movie
        ]
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false

        if panel.runModal() == .OK, let url = panel.url {
            let ext = url.pathExtension.lowercased()
            let isVideo = ["mov", "mp4", "m4v"].contains(ext)
            if let imageSource = CGImageSourceCreateWithURL(url as CFURL, nil) {
                let options: [CFString: Any] = [
                    kCGImageSourceCreateThumbnailFromImageAlways: true,
                    kCGImageSourceShouldCacheImmediately: true,
                    kCGImageSourceCreateThumbnailWithTransform: true,
                    kCGImageSourceThumbnailMaxPixelSize: 600
                ]
                if let thumb = CGImageSourceCreateThumbnailAtIndex(imageSource, 0, options as CFDictionary) {
                    let nsImg = NSImage(cgImage: thumb, size: NSSize(width: 400, height: 300))
                    if let tiff = nsImg.tiffRepresentation,
                       let rep = NSBitmapImageRep(data: tiff),
                       let jpeg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.72]) {
                        let base64 = jpeg.base64EncodedString()
                        let dataUrl = "data:image/jpeg;base64,\(base64)"
                        RealtimeService.shared.sendMedia(dataUrl: dataUrl, isVideo: isVideo, message: isVideo ? "Sent video: \(url.lastPathComponent) 🎬" : "Sent photo! 📸")
                        if let p = self.stickerPanel {
                            PhotoPopupPanel.shared.present(near: p.frame, photoUrl: dataUrl, message: isVideo ? "Sent video: \(url.lastPathComponent) 🎬" : "Sent photo! 📸")
                        }
                    }
                }
            }
        }
    }

    @objc private func reactBack() {
        guard RealtimeService.shared.isConnected else { return }
        RealtimeService.shared.sendEmote(.loveYou)
    }

    @objc private func setStatusNormal() {
        RealtimeService.shared.sendStatusUpdate(.normal)
    }

    @objc private func setStatusWork() {
        RealtimeService.shared.sendStatusUpdate(.deepWork)
    }

    @objc private func setStatusSleep() {
        RealtimeService.shared.sendStatusUpdate(.sleeping)
    }

    @objc private func openSettings() {
        if settingsWindow == nil {
            let hosting = NSHostingController(rootView: SettingsView())
            let window = NSWindow(contentViewController: hosting)
            window.title = "CoupleStick Settings"
            window.styleMask = [.titled, .closable]
            window.isReleasedWhenClosed = false
            window.center()
            self.settingsWindow = window
        }
        settingsWindow?.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }


    @objc private func checkForUpdates() {
        UpdateChecker.shared.checkForUpdates(userInitiated: true)
    }

    @objc private func resetPosition() {
        guard let screen = NSScreen.main, let panel = stickerPanel else { return }
        let visible = screen.visibleFrame
        let targetPoint = NSPoint(x: visible.maxX - panel.frame.width - 24, y: visible.maxY - panel.frame.height - 48)
        panel.setFrameOrigin(targetPoint)
    }

    @objc private func relaunchApp() {
        let bundlePath = Bundle.main.bundleURL.path
        let task = Process()
        task.executableURL = URL(fileURLWithPath: "/usr/bin/open")
        task.arguments = ["-n", bundlePath]
        try? task.run()
        NSApp.terminate(nil)
    }
}
