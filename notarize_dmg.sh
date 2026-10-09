#!/bin/bash
set -e

# ==============================================================================
# CoupleStick: Automated Apple Notarization & Stapling Pipeline
# ==============================================================================
# Prerequisites:
# 1. An Apple Developer Account with a Developer ID Application Certificate.
# 2. Store your notarytool credentials in your Mac Keychain:
#    xcrun notarytool store-credentials "AC_PASSWORD" \
#      --apple-id "your-apple-id@email.com" \
#      --team-id "YOUR_TEAM_ID" \
#      --password "app-specific-password-from-appleid.apple.com"
# ==============================================================================

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

KEYCHAIN_PROFILE="${1:-AC_PASSWORD}"
DMG_FILE="CoupleStick.dmg"

if [ ! -f "$DMG_FILE" ]; then
    echo "==> Error: $DMG_FILE not found! Building DMG first..."
    ./build_dmg.sh
fi

echo "======================================================================"
echo "==> 1. Submitting $DMG_FILE to Apple Notary Service..."
echo "==> Using Keychain Profile: $KEYCHAIN_PROFILE"
echo "======================================================================"

xcrun notarytool submit "$DMG_FILE" \
    --keychain-profile "$KEYCHAIN_PROFILE" \
    --wait

echo ""
echo "======================================================================"
echo "==> 2. Stapling Notarization Ticket to $DMG_FILE..."
echo "======================================================================"

xcrun stapler staple "$DMG_FILE"

echo ""
echo "======================================================================"
echo "==> 3. Verifying Gatekeeper Acceptance..."
echo "======================================================================"

spctl -a -vvv -t install "$DMG_FILE"

echo ""
echo "======================================================================"
echo "==> SUCCESS! CoupleStick.dmg is fully notarized and stapled."
echo "==> Anyone on macOS can now install and open it with ZERO warnings."
echo "======================================================================"
