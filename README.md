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

6. **Chapter 6: The Transformation (Three Freeform Architectural Plans)**
   - **Core Theme:** *Personal evolution through shared time* — reflecting how her presence sparked genuine transformation over seven years, fostering new perspectives, emotional grounding, fresh habits, and becoming a new person.
   - **Plan A — The Growth Ecosystem (Interactive Sandbox Canvas):**
     - *Concept:* A fluid, physics-driven sandbox canvas where an initial minimalist core node ("Who I Was") is surrounded by draggable, free-floating "catalyst seeds" representing concrete dimensions of personal growth (e.g., *Quiet Composure*, *Learning How to Truly Listen*, *Appreciating Everyday Details*, *New Passions & Literary Tastes*, *Broadened Worldview*).
     - *Interactivity:* Completely freeform placement and connection. Users can drag, group, and tether catalyst seeds to the core or to each other. Docking a seed causes organic growth rings to expand, spouts watercolor leaves, and reveals a personal reflection card detailing how that trait took root. Zero linear constraints; users can curate and explore their personal transformation constellation freely.
   - **Plan B — The Constellation Weaver (Celestial Mind-Map & Sky Canvas):**
     - *Concept:* An expansive, drifting celestial canvas populated by glowing star nodes categorized across transformation themes (*Perspectives Reimagined*, *Emotional Grounding*, *Habits & Everyday Rhythms*, *Shared Curiosity*).
     - *Interactivity:* Touch or cursor drag draws luminous silk ribbon filaments between star nodes. Connecting stars forms bespoke geometric constellations; upon completion of each mini-cluster, a handwritten note unfurls with gentle audio resonance, highlighting the exact lesson or shift experienced through her presence. Includes pan, pinch-to-zoom, and free reset/reweave capabilities.
   - **Plan C — The Metamorphosis Studio (Watercolor & Resonance Wash):**
     - *Concept:* A tactile, gesture-driven digital watercolor wash environment. The scene begins in muted, monochromatic charcoal and parchment tones. A floating palette contains organic interactive elements and pigment drops representing facets of growth.
     - *Interactivity:* Swiping, holding, or blending pigments across the textured canvas causes pastel matcha, warm ochre, and soft petal gradients to blossom outward. Embedded reflections, memories, and handwritten confessions gently float up from beneath the dried paint layers (*"Habits I gently absorbed from you"*, *"How my patience grew"*, *"Becoming someone I am proud of"*). Total artistic freedom with no right or wrong path, allowing organic discovery through tactile touch.

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
