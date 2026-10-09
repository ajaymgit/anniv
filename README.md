# CoupleStick ❤️ — Live Couple Desktop Stickers for macOS

CoupleStick is a lightweight, native macOS menu-bar and desktop sticker app that keeps two partners connected in real-time across the internet.

---

## ✨ Features

- **Live Desktop Sticker:** Anchored, draggable partner avatar that stays pinned to your screen across all Spaces and full-screen apps.
- **Real-Time Reactions:** Send and receive kisses, pokes, hugs, love notes, and reactions with custom sounds and fluid Apple-grade spring animations.
- **Bottom-Docked Messaging:** Minimal, distraction-free speech bubbles that pop in directly below the avatar.
- **Instant Photo & Video Sharing:** Mini digital picture-frame display for photos and video clips right on your desktop.
- **Customizable Nicknames:** Personalize your partner's name across all menus, tooltips, and messages.
- **0% Idle CPU & Battery Efficient:** $O(1)$ geometric hit-testing, coalesced timers, and on-demand Metal rendering.
- **Sparkle 2 Auto-Updates:** In-app updates via `appcast.xml` feed.
- **Apple Notarization Ready:** Modern `notarytool` and stapling pipeline for warning-free Gatekeeper distribution.

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
Produces an optimized, symbol-stripped `CoupleStick.dmg` with embedded frameworks and hardened runtime code-signing.

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
