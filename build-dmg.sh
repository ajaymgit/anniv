#!/usr/bin/env bash
set -e

echo "=== Building The Time Heist macOS DMG (GUI Edition) ==="

# 1. Build the production React app if npm is available
if command -v npm &> /dev/null; then
  echo "Installing dependencies..."
  npm install
  echo "Building production bundle..."
  npm run build
fi

# 2. Prepare staging directory for DMG
DMG_STAGE="/tmp/TimeHeist_DMG_Stage"
rm -rf "$DMG_STAGE"
mkdir -p "$DMG_STAGE"

# 3. Create a macOS .app wrapper with native GUI window
APP_BUNDLE="$DMG_STAGE/Time Heist.app"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources"

# Launcher script inside the .app bundle that opens in a standalone App Window
cat << 'EOF' > "$APP_BUNDLE/Contents/MacOS/TimeHeist"
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$DIR/../../.." && pwd )"

cd "$ROOT_DIR/time-heist-source"

# Start local server in background
if command -v npm &> /dev/null; then
  npm run preview -- --port 5173 &
  SERVER_PID=$!
  sleep 1
else
  npx vite preview --port 5173 &
  SERVER_PID=$!
  sleep 1
fi

# Open in standalone app window (Chrome App mode if available, otherwise default browser)
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="http://localhost:5173" --window-size=1100,820
elif [ -d "/Applications/Brave Browser.app" ]; then
  open -na "Brave Browser" --args --app="http://localhost:5173" --window-size=1100,820
else
  open "http://localhost:5173"
fi
EOF

chmod +x "$APP_BUNDLE/Contents/MacOS/TimeHeist"

# Info.plist for the .app
cat << 'EOF' > "$APP_BUNDLE/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>TimeHeist</string>
    <key>CFBundleIdentifier</key>
    <string>com.timeheist.app</string>
    <key>CFBundleName</key>
    <string>Time Heist</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
</dict>
</plist>
EOF

# 4. Add drag-and-drop /Applications shortcut
ln -s /Applications "$DMG_STAGE/Applications"

# 5. Copy the project source files
mkdir -p "$DMG_STAGE/time-heist-source"
cp -r . "$DMG_STAGE/time-heist-source" 2>/dev/null || true

# 6. Generate DMG using hdiutil
OUTPUT_DMG="TimeHeist.dmg"
rm -f "$OUTPUT_DMG"
hdiutil create -volname "Time Heist" -srcfolder "$DMG_STAGE" -ov -format UDZO "$OUTPUT_DMG"
rm -rf "$DMG_STAGE"

echo "=== Successfully created $OUTPUT_DMG ==="
