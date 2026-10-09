import Foundation
import SwiftUI

public enum EmoteType: String, CaseIterable, Codable, Identifiable, Sendable {
    case hi = "HI"
    case kiss = "KISS"
    case hug = "HUG"
    case poke = "POKE"
    case loveYou = "LOVE_YOU"
    case missYou = "MISS_YOU"
    case laugh = "LAUGH"
    case blowKiss = "BLOW_KISS"
    case fire = "FIRE"
    case heartEyes = "HEART_EYES"
    case sleepy = "SLEEPY"
    case thinking = "THINKING"
    case party = "PARTY"
    case sad = "SAD"
    case blush = "BLUSH"
    case angry = "ANGRY"
    case eyes = "EYES"
    case sparkles = "SPARKLES"
    case chat = "CHAT"

    public var id: String { rawValue }

    public var emoji: String {
        switch self {
        case .hi: return "👋"
        case .kiss: return "💋"
        case .hug: return "🫂"
        case .poke: return "👉"
        case .loveYou: return "❤️"
        case .missYou: return "🥹"
        case .laugh: return "😂"
        case .blowKiss: return "😘"
        case .fire: return "🔥"
        case .heartEyes: return "😍"
        case .sleepy: return "😴"
        case .thinking: return "🤔"
        case .party: return "🥳"
        case .sad: return "🥺"
        case .blush: return "😊"
        case .angry: return "😤"
        case .eyes: return "👀"
        case .sparkles: return "✨"
        case .chat: return "💬"
        }
    }

    public var label: String {
        switch self {
        case .hi: return "Hi!"
        case .kiss: return "Kiss"
        case .hug: return "Hug"
        case .poke: return "Poke"
        case .loveYou: return "Love You"
        case .missYou: return "Miss You"
        case .laugh: return "Laugh"
        case .blowKiss: return "Blow a Kiss"
        case .fire: return "Hot!"
        case .heartEyes: return "In Love"
        case .sleepy: return "Sleepy"
        case .thinking: return "Thinking"
        case .party: return "Party!"
        case .sad: return "Please?"
        case .blush: return "Blush"
        case .angry: return "Hmph!"
        case .eyes: return "Looking"
        case .sparkles: return "Magic"
        case .chat: return "Message"
        }
    }
}

public enum PartnerStatus: String, CaseIterable, Codable, Sendable {
    case normal = "NORMAL"
    case inUse = "IN_USE"       // 🟢 Active on laptop
    case idle = "IDLE"           // 🟡 Away / Idle
    case offline = "OFFLINE"     // ⚪️ Offline
    case deepWork = "DEEP_WORK"  // 🎧
    case sleeping = "SLEEPING"   // 💤

    public var badgeEmoji: String? {
        switch self {
        case .normal, .inUse: return nil
        case .idle: return "🟡"
        case .offline: return "⚪️"
        case .deepWork: return "🎧"
        case .sleeping: return "💤"
        }
    }

    public var statusDescription: String {
        switch self {
        case .normal, .inUse: return "Active on Mac"
        case .idle: return "Away from Mac"
        case .offline: return "Offline"
        case .deepWork: return "In Deep Work"
        case .sleeping: return "Sleeping"
        }
    }
}
