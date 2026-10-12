import Foundation
import ServiceManagement

public final class LaunchAtLoginManager: ObservableObject {
    public static let shared = LaunchAtLoginManager()

    @Published public var isEnabled: Bool = false

    private init() {
        checkStatus()
    }

    public func checkStatus() {
        if #available(macOS 13.0, *) {
            self.isEnabled = (SMAppService.mainApp.status == .enabled)
        }
    }

    public func setLaunchAtLogin(_ enabled: Bool) {
        if #available(macOS 13.0, *) {
            do {
                if enabled {
                    try SMAppService.mainApp.register()
                } else {
                    try SMAppService.mainApp.unregister()
                }
                self.isEnabled = enabled
            } catch {
                print("[LaunchAtLogin] Could not update login item: \(error.localizedDescription)")
                self.isEnabled = (SMAppService.mainApp.status == .enabled)
            }
        }
    }
}
