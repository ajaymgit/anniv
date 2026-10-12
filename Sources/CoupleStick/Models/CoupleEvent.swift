import Foundation

public struct CoupleEmotePayload: Codable, Sendable {
    public let action: EmoteType
    public let senderId: String
    public let assetId: String?
    public let popupPhotoUrl: String?
    public let message: String?
    public let statusBadge: PartnerStatus?
    public let timestamp: Double

    public init(
        action: EmoteType,
        senderId: String,
        assetId: String? = nil,
        popupPhotoUrl: String? = nil,
        message: String? = nil,
        statusBadge: PartnerStatus? = nil,
        timestamp: Double = Date().timeIntervalSince1970
    ) {
        self.action = action
        self.senderId = senderId
        self.assetId = assetId
        self.popupPhotoUrl = popupPhotoUrl
        self.message = message
        self.statusBadge = statusBadge
        self.timestamp = timestamp
    }
}
