# 🌿 The 7-Year Anniversary Suite (Time Heist Web App)
### Dedicated to Mythri ♡
A bespoke interactive web suite built with React 19, Vite, Tailwind CSS, and Framer Motion, styled in a Girly Pop pastel green scrapbook aesthetic.

---

## ✨ Features & Architecture

1. **Chapter 1: The Memory Vault (7 Interactive Puzzles)**
   - **Puzzle 01 (Birthday Keypad):** 6-digit PIN entry (`220305`) with pastel macaron keys and blooming flower slots.
   - **Puzzle 02 (Polaroid Jigsaw):** 9-piece tap-to-swap polaroid puzzle using your custom anniversary photo (`/jigsaw.jpg`), complete with a full-photo reveal lightbox.
   - **Puzzle 03 (2D Relationship Crossword):** Authentic 2D interlocking crossword board (13×12 grid, 55 letters) with all 14 inside-joke clues crossing at shared letters, standard corner numbering (1–14), keyboard navigation, and side-by-side clue decks.
   - **Puzzle 04 (The Fairy-Light Chamber):** Dark room with glowing ceiling fairy lights, warm lantern spotlight beam (`circle 140px`), pointer halo, "Light Up Chamber" boost toggle, and clothespinned Polaroids displaying Roman numerals (`[I]`, `[II]`, `[III]`, `[IV]` = `1210`).
   - **Puzzle 05 (Timeline Sequencer):** Drag-and-drop chronological sorting of 5 core milestones.
   - **Puzzle 06 (Couple's Trivia):** 7 shared memory verification questions with feedback.
   - **Puzzle 07 (Memory Match):** 20-card memory matching matrix (10 pairs).
   - **Climax Reveal:** Final vault decryption, celebration fanfare, and anniversary letter.

2. **Chapter 2: The Stargazer Lily (3D Nocturnal Bloom & 8 Stories)**
   - **Full-Viewport 3D Nocturnal Canvas:** Three.js scene (`absolute inset-0 w-full h-full`) over a star-reflecting nocturnal pond.
   - **Solitary Entrance:** Starts with only a solitary, unbloomed Stargazer lily bud that blossoms smoothly at 2.0 seconds.
   - **Botanical Realism:** 8-petal double whorl geometry with curled tips, magenta stippling, lime throat, and tapered curved lanceolate leaves with watercolor midrib veins.
   - **Interactive 8-Petal Fall:** Tapping the lily releases petals sequentially with flutter physics and water ripples upon hitting the pond, progressively unlocking 8 intimate stories.
   - **Unbloomed Buds & Grand Finale:** Upon completing all 8 drops, unbloomed celestial and pond buds appear with visible lime-green nectar furrows.
   - **Pull-Down Bloom Gesture:** Smooth pull-down handle gesture at top center blooms celestial lilies and pond blossoms simultaneously.
   - **Unobtrusive Side Card:** Unfolds reflection card on the bottom-left (`fixed bottom-6 left-6 max-w-sm`), keeping the central 3D flower and pond fully in view.

3. **Chapter 3: Seven Love Letters**
   - 7 sealed wax envelopes with typographic reading room.

4. **Chapter 4: Couplestick Web Showcase**
   - Interactive desktop simulator, reaction triggers, pairing code (`220305`), and download link for the macOS app.

5. **Chapter 5: The Fifth Space**
   - Preview chamber for Heartbeat Frequency, Coordinate Atlas, and Forward Horizon.

6. **Chapter 6: The Transformation (Personal Evolution)**
   - Freeform interactive experience exploring personal growth, new perspectives learned, and the profound mutual effect over time.

7. **Chapter 7: Her Space**
   - Private writing sanctuary with prompt drawer and local autosave.

---

## 🎨 Theme & Styling

- **Background:** Fresh vanilla matcha cream (`#f7faf8`)
- **Card Surfaces:** Soft honeydew mint (`#f0fdf4`)
- **Borders & Accents:** Pastel mint green lace (`#bbf7d0` / `#dcfce7`)
- **Typography:** High-contrast deep forest slate (`#132e22`) and muted sage (`#3d6350`)
- **Scrapbook Decor:** Silk ribbon bows, washi tape strips, 5-petal blossoms, and drifting flower breeze.

---

## 📱 Mobile Responsiveness

- Grid scales responsively to fit screens down to 320px width without horizontal scrolling.
- Tap-friendly touch targets with `active:scale-95` tactile feedback.
- `touch-none` enabled in the lantern chamber to prevent unintended page scroll while dragging.

---

## 🚀 Development & Deployment

### Run Locally:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production:
```bash
npm run build
```

### Deploy to Vercel:
```bash
git push -u origin main
# or directly:
npx vercel --prod
```
