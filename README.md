# CoupleStick ❤️ — Live Couple Desktop Stickers for macOS

CoupleStick is a lightweight, native macOS menu-bar and desktop sticker app that keeps two partners connected in real-time across the internet.

---

## 📥 Download & Quick Install

### Option 1: Direct Download
👉 **[Click Here to Download CoupleStick.dmg (Latest Release)](https://github.com/ajaymgit/anniv/releases/latest/download/CoupleStick.dmg)**

1. Open `CoupleStick.dmg` and drag **CoupleStick.app** into your **Applications** folder.
2. If macOS displays *"Apple cannot check it for malicious software"*, run this once in Terminal:
   ```bash
   xattr -cr /Applications/CoupleStick.app
   ```

### Option 2: 1-Line Terminal Download & Open
Paste this into Terminal to download and open the installer automatically:
```bash
curl -L -O https://github.com/ajaymgit/anniv/releases/latest/download/CoupleStick.dmg && open CoupleStick.dmg
```

---

## ✨ Features

- **Live Desktop Sticker:** Anchored, draggable partner avatar that stays pinned to your screen across all Spaces and full-screen apps.
- **Two-Column Settings:** Organized side-by-side layout separating connection/profile configuration from reaction media.
- **Paginated Reaction Media:** Browse custom reaction media 5 at a time with page controls, or switch to smooth scroll-all mode.
- **Instant Unpair & Pair:** Connect via 6-digit OTP code or unpair at any time to generate a new private room code.
- **Real-Time Reactions:** Send and receive kisses, pokes, hugs, love notes, and reactions with custom sounds and fluid spring animations.
- **Bottom-Docked Messaging:** Minimal, distraction-free speech bubbles that pop in directly below the avatar.
- **Instant Photo & Video Sharing:** Mini picture-frame display for photos and video clips right on your desktop.
- **0% Idle CPU & Battery Efficient:** Geometric hit-testing, coalesced timers, and on-demand rendering.
- **Sparkle 2 Auto-Updates:** In-app updates via `appcast.xml` feed.

---

## ⌨️ Global Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Cmd + Shift + P` | Poke Partner 👉 |
| `Cmd + Shift + K` | Send Kiss 💋 |
| `Cmd + Shift + R` | React Back ❤️ |
| `Cmd + Shift + U` | Send Photo / Video 📸 |

---

## 🚀 Building & Packaging

### Run in Development:
```bash
swift build
swift run
```

### Build & Package DMG:
```bash
./build_dmg.sh
```
Produces an optimized `CoupleStick.dmg` with embedded frameworks and code-signing.

### Notarize for Distribution:
```bash
./notarize_dmg.sh
```

---

## 🔄 Auto-Updates (Sparkle)
1. Generate your EdDSA keypair:
   ```bash
   ./.build/artifacts/sparkle/Sparkle/bin/generate_keys
   ```
2. Update `SPARKLE_PUBLIC_ED_KEY` in `build_dmg.sh` and host `appcast.xml` on your GitHub Releases or server.

---

## 🛡️ macOS Gatekeeper / Quarantine Override

If you download `CoupleStick.dmg` or `CoupleStick.app` directly from GitHub without Apple Developer Notarization, macOS may show a warning:
> *"CoupleStick.app can't be opened because Apple cannot check it for malicious software"*.

To bypass this check, open Terminal and run:

```bash
# If installed in Applications:
xattr -cr /Applications/CoupleStick.app

# Or directly on the app bundle in your Downloads:
xattr -cr ~/Downloads/CoupleStick.app
```

*(Alternatively, go to **System Settings > Privacy & Security** and click **Open Anyway**.)*
