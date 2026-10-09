import AppKit

public final class SoundManager {
    public static let shared = SoundManager()

    public var isMuted: Bool {
        get { UserDefaults.standard.bool(forKey: "CoupleStick_SoundMuted") }
        set { UserDefaults.standard.set(newValue, forKey: "CoupleStick_SoundMuted") }
    }

    private init() {}

    public func playEmoteSound(for emote: EmoteType) {
        guard !isMuted else { return }

        DispatchQueue.main.async {
            let soundName: String
            switch emote {
            case .kiss, .blowKiss:
                soundName = "Pop"
            case .poke:
                soundName = "Tink"
            case .laugh:
                soundName = "Frog"
            case .hug, .loveYou, .missYou:
                soundName = "Purr"
            case .hi:
                soundName = "Bottle"
            case .chat:
                soundName = "Blow"
            case .fire, .party:
                soundName = "Hero"
            case .heartEyes, .blush:
                soundName = "Purr"
            case .sleepy:
                soundName = "Submarine"
            case .thinking, .eyes:
                soundName = "Tink"
            case .sad:
                soundName = "Basso"
            case .angry:
                soundName = "Sosumi"
            case .sparkles:
                soundName = "Glass"
            }

            if let sound = NSSound(named: NSSound.Name(soundName)) {
                sound.volume = 0.5
                sound.play()
            }
        }
    }

    public func playCameraShutter() {
        guard !isMuted else { return }
        DispatchQueue.main.async {
            if let sound = NSSound(named: NSSound.Name("Tink")) {
                sound.volume = 0.6
                sound.play()
            }
        }
    }
}
