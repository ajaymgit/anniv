// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CoupleStick",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "CoupleStick", targets: ["CoupleStick"])
    ],
    targets: [
        .executableTarget(
            name: "CoupleStick",
            path: "Sources/CoupleStick"
        )
    ]
)
