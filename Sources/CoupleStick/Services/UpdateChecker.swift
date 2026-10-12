import Foundation
import AppKit

public final class UpdateChecker: NSObject, ObservableObject {
    public static let shared = UpdateChecker()

    @Published public var isChecking: Bool = false

    private override init() {
        super.init()
    }

    public func start() {
        // Runs silently in background on launch
    }

    public func checkForUpdates(userInitiated: Bool = true) {
        guard !isChecking else { return }
        isChecking = true

        let feedUrlStr = Bundle.main.object(forInfoDictionaryKey: "SUFeedURL") as? String ?? "https://raw.githubusercontent.com/ajay/CoupleStick/main/appcast.xml"
        guard let url = URL(string: feedUrlStr) else {
            isChecking = false
            return
        }

        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isChecking = false

                if let data = data,
                   let xmlString = String(data: data, encoding: .utf8),
                   let latestVersion = self?.parseLatestVersion(from: xmlString) {
                    let currentVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0.0"

                    if latestVersion.compare(currentVersion, options: .numeric) == .orderedDescending {
                        self?.showUpdateAvailableAlert(latestVersion: latestVersion)
                        return
                    }
                }

                if userInitiated {
                    let alert = NSAlert()
                    alert.messageText = "CoupleStick is Up to Date"
                    alert.informativeText = "You are currently running the latest version."
                    alert.alertStyle = .informational
                    alert.addButton(withTitle: "OK")
                    alert.runModal()
                }
            }
        }.resume()
    }

    private func parseLatestVersion(from xml: String) -> String? {
        if let match = xml.range(of: "sparkle:shortVersionString=\"([^\"]+)\"", options: .regularExpression) {
            let substr = xml[match]
            let parts = substr.components(separatedBy: "\"")
            if parts.count >= 2 {
                return parts[1]
            }
        }
        return nil
    }

    private func showUpdateAvailableAlert(latestVersion: String) {
        let alert = NSAlert()
        alert.messageText = "New Update Available! (v\(latestVersion))"
        alert.informativeText = "A new version of CoupleStick is available. Would you like to view and download it now?"
        alert.alertStyle = .informational
        alert.addButton(withTitle: "Download Update")
        alert.addButton(withTitle: "Later")

        if alert.runModal() == .alertFirstButtonReturn {
            if let downloadUrl = URL(string: "https://github.com/ajay/CoupleStick/releases/latest") {
                NSWorkspace.shared.open(downloadUrl)
            }
        }
    }
}
