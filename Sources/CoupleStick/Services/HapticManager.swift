import AppKit

public final class HapticManager {
    public static let shared = HapticManager()

    private init() {}

    public func triggerGentleTap() {
        NSHapticFeedbackManager.defaultPerformer.perform(
            .generic,
            performanceTime: .now
        )
    }

    public func triggerHeartbeatTap() {
        NSHapticFeedbackManager.defaultPerformer.perform(.alignment, performanceTime: .now)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            NSHapticFeedbackManager.defaultPerformer.perform(.levelChange, performanceTime: .now)
        }
    }

    public func triggerDoubleTap() {
        NSHapticFeedbackManager.defaultPerformer.perform(.levelChange, performanceTime: .now)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
            NSHapticFeedbackManager.defaultPerformer.perform(.levelChange, performanceTime: .now)
        }
    }
}
