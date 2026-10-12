#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

VERSION="${APP_VERSION:-1.0.1}"
BUILD_NUM="${BUILD_NUMBER:-2}"
DEVELOPER_ID="${DEVELOPER_ID_APPLICATION:--}"
FEED_URL="${SPARKLE_FEED_URL:-https://raw.githubusercontent.com/ajay/CoupleStick/main/appcast.xml}"
ED_KEY="${SPARKLE_PUBLIC_ED_KEY:-d+Xw1JpZ0t8b5...}"

echo "======================================================================"
echo "==> 1. Compiling CoupleStick (Version: $VERSION, Build: $BUILD_NUM)..."
echo "======================================================================"
swift build --disable-sandbox -c release -Xswiftc -O -Xswiftc -whole-module-optimization -Xlinker -dead_strip

echo "==> 2. Creating macOS App Bundle..."
APP_DIR="CoupleStick.app"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"
mkdir -p "$APP_DIR/Contents/Frameworks"

cp .build/release/CoupleStick "$APP_DIR/Contents/MacOS/CoupleStick"
chmod +x "$APP_DIR/Contents/MacOS/CoupleStick"
strip -x "$APP_DIR/Contents/MacOS/CoupleStick"

if [ -f "AppIcon.icns" ]; then
    cp AppIcon.icns "$APP_DIR/Contents/Resources/AppIcon.icns"
fi

# Robustly find and embed Sparkle.framework
SPARKLE_FW=$(find .build -name "Sparkle.framework" -type d 2>/dev/null | grep -v "\.dSYM" | head -n 1 || true)
if [ -n "$SPARKLE_FW" ] && [ -d "$SPARKLE_FW" ]; then
    echo "==> Embedding Sparkle Framework from: $SPARKLE_FW..."
    cp -R "$SPARKLE_FW" "$APP_DIR/Contents/Frameworks/"
    install_name_tool -add_rpath "@executable_path/../Frameworks" "$APP_DIR/Contents/MacOS/CoupleStick" 2>/dev/null || true
fi

cat << PLIST > "$APP_DIR/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>CoupleStick</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.couplestick.app</string>
    <key>CFBundleName</key>
    <string>CoupleStick</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$VERSION</string>
    <key>CFBundleVersion</key>
    <string>$BUILD_NUM</string>
    <key>LSUIElement</key>
    <true/>
    <key>NSCameraUsageDescription</key>
    <string>CoupleStick uses your camera to send 1-click live selfies to your partner.</string>
    <key>SUFeedURL</key>
    <string>$FEED_URL</string>
    <key>SUPublicEDKey</key>
    <string>$ED_KEY</string>
    <key>SUEnableAutomaticChecks</key>
    <true/>
</dict>
</plist>
PLIST

echo "==> 3. Code Signing..."
if [ -d "$APP_DIR/Contents/Frameworks/Sparkle.framework" ]; then
    echo "==> Signing Sparkle.framework..."
    codesign --force --deep --sign "$DEVELOPER_ID" "$APP_DIR/Contents/Frameworks/Sparkle.framework"
fi

if [ -f "CoupleStick.entitlements" ]; then
    echo "==> Signing CoupleStick.app with entitlements..."
    codesign --force --deep --sign "$DEVELOPER_ID" --entitlements CoupleStick.entitlements "$APP_DIR"
else
    codesign --force --deep --sign "$DEVELOPER_ID" "$APP_DIR"
fi

echo "==> 4. Packaging Drag-and-Drop DMG Installer..."
DMG_STAGING="/tmp/CoupleStick_DMG_Staging"
rm -rf "$DMG_STAGING"
mkdir -p "$DMG_STAGING"

cp -R "$APP_DIR" "$DMG_STAGING/"
ln -s /Applications "$DMG_STAGING/Applications"

rm -f CoupleStick.dmg
hdiutil create -volname "CoupleStick" -srcfolder "$DMG_STAGING" -ov -format UDZO CoupleStick.dmg
rm -rf "$DMG_STAGING"

echo "==> Success! High-performance installer created at: $DIR/CoupleStick.dmg"
ls -lh CoupleStick.dmg
