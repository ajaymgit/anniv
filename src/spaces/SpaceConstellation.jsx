import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
  Moon,
  Info
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  SparkleStar,
  PopFlower
} from "../components/common/GirlyPopDecorations";

// Real star coordinates mapped directly onto Vincent van Gogh's "The Starry Night"
export const STARRY_NIGHT_STARS = [
  {
    id: "star-1",
    order: 1,
    title: "The First Glimpse",
    yearBadge: "Year 01 // 2019",
    name: "Venus (The Morning Star)",
    x: "34%",
    y: "50%",
    size: "w-8 h-8",
    color: "#fef08a",
    date: "October 2019 // The Beginning",
    caption: "The giant luminous star shining brightest near the cypress. Two headstrong Aries who crossed paths and realized neither could ever look away.",
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-2",
    order: 2,
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    name: "The Upper Cypress Star",
    x: "24%",
    y: "22%",
    size: "w-6 h-6",
    color: "#fde047",
    date: "Year 02 // City Nights",
    caption: "Rain dripping off our jackets, silent roads at 1 AM, and your hands tucked securely in my jacket pockets. The simplest ride that felt like everything.",
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-3",
    order: 3,
    title: "The Quiet Corner Table",
    yearBadge: "Year 03 // 2021",
    name: "The Northern Swirl Star",
    x: "39%",
    y: "18%",
    size: "w-7 h-7",
    color: "#facc15",
    date: "Year 03 // Favorite Café",
    caption: "Cold coffees, extra crispy fries, and four hours passing like ten minutes. Learning every small mannerism you didn't even know you had.",
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-4",
    order: 4,
    title: "Learning Your Cadence",
    yearBadge: "Year 04 // 2022",
    name: "The Central Swirl Core",
    x: "48%",
    y: "32%",
    size: "w-7 h-7",
    color: "#fef08a",
    date: "Year 04 // Inside Jokes",
    caption: "Understanding your quiet moods before you speak them. Laughing through stubborn UNO arguments and discovering real peace in ordinary days.",
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-5",
    order: 5,
    title: "Your Fierce Loyalty",
    yearBadge: "Year 05 // 2023",
    name: "The Eastern Horizon Star",
    x: "62%",
    y: "28%",
    size: "w-6 h-6",
    color: "#facc15",
    date: "Year 05 // Heart to Heart",
    caption: "How fiercely protective you are of the people you love. You never manufacture kindness for an audience—it is just who you are.",
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-6",
    order: 6,
    title: "Counting Gates & Miles",
    yearBadge: "Year 06 // 2024",
    name: "The Upper Zenith Star",
    x: "67%",
    y: "14%",
    size: "w-7 h-7",
    color: "#fde047",
    date: "Year 06 // The Anchor",
    caption: "Counting down flights, departures, and busy days, knowing with absolute certainty that physical distance could never weaken what we built.",
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-7",
    order: 7,
    title: "Unshakable Home",
    yearBadge: "Year 07 // 2025",
    name: "The Village Watcher",
    x: "77%",
    y: "43%",
    size: "w-6 h-6",
    color: "#fef08a",
    date: "Year 07 // Sanctuary",
    caption: "Sitting beside you at the end of an exhausting week. In a world full of chaotic static and demands, you are the calm I always come home to.",
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-8",
    order: 8,
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "October 2026 // Today",
    name: "The Moon Guardian Star",
    x: "73%",
    y: "25%",
    size: "w-7 h-7",
    color: "#fde047",
    date: "Forever & Always",
    caption: "Seven years, two Aries, and a lifetime still to write. I chose you back then, and I would choose you in every single lifetime after.",
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
  }
];

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();
  const [visitedStars, setVisitedStars] = useState(() => new Set(["star-1"]));
  const [selectedStar, setSelectedStar] = useState(null);
  const [showMoonModal, setShowMoonModal] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const openStar = (star) => {
    setSelectedStar(star);
    setVisitedStars((prev) => {
      const next = new Set(prev);
      next.add(star.id);
      if (next.size >= STARRY_NIGHT_STARS.length) {
        markSpaceCompleted("02-constellation");
        try {
          confetti({
            particleCount: 75,
            spread: 90,
            origin: { y: 0.65 },
            colors: ["#fef08a", "#facc15", "#38bdf8", "#bbf7d0", "#ffffff"]
          });
        } catch (e) {}
      }
      return next;
    });
  };

  const nextStar = () => {
    if (!selectedStar) return;
    const curIdx = STARRY_NIGHT_STARS.findIndex((s) => s.id === selectedStar.id);
    const nextIdx = (curIdx + 1) % STARRY_NIGHT_STARS.length;
    openStar(STARRY_NIGHT_STARS[nextIdx]);
  };

  const prevStar = () => {
    if (!selectedStar) return;
    const curIdx = STARRY_NIGHT_STARS.findIndex((s) => s.id === selectedStar.id);
    const nextIdx = curIdx === 0 ? STARRY_NIGHT_STARS.length - 1 : curIdx - 1;
    openStar(STARRY_NIGHT_STARS[nextIdx]);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-8 sm:py-12 px-4 sm:px-6 relative select-none font-sans flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto text-center mb-8 relative z-10">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-sans font-semibold mb-3 shadow-sm">
          <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Chapter 2 // Vincent van Gogh's The Starry Night (1889)</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] mb-2 font-serif tracking-tight">
          Our Starry Night
        </h2>
        <p className="text-sm sm:text-base text-[#3d6350] max-w-xl mx-auto font-sans leading-relaxed">
          Vincent van Gogh’s authentic masterpiece, woven with our memories. Tap the glowing stars or the golden crescent moon to unfold our story.
        </p>

        {/* Progress Badge */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-emerald-800 font-sans">
          <span className="px-3.5 py-1 rounded-full bg-white border border-[#bbf7d0] shadow-2xs font-semibold flex items-center gap-1.5">
            <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
            <span>Memories Discovered: {visitedStars.size} of {STARRY_NIGHT_STARS.length}</span>
          </span>
          <span className="text-[#6e9981] hidden sm:inline">•</span>
          <span className="text-[#3d6350] hidden sm:inline">Tap the Crescent Moon for a secret note ♡</span>
        </div>
      </div>

      {/* Main Museum Canvas Frame */}
      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="bg-white p-3 sm:p-5 rounded-[36px] border-4 border-[#bbf7d0] shadow-card relative overflow-hidden">
          {/* Top Washi Tape */}
          <div className="absolute -top-1.5 right-12 z-20 pointer-events-none">
            <WashiTape className="w-20 h-4.5 opacity-80" color="bg-emerald-200/80" />
          </div>

          {/* The Painting Container */}
          <div className="relative w-full rounded-[24px] overflow-hidden shadow-inner aspect-[4/3] sm:aspect-[16/10] bg-slate-950">
            {/* The Authentic Masterpiece Image */}
            <img
              src="/starry-night.jpg"
              alt="Vincent van Gogh - The Starry Night (1889)"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Subtle Vignette for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />

            {/* Clickable Crescent Moon Hotspot (Upper Right) */}
            <button
              onClick={() => setShowMoonModal(true)}
              className="absolute top-[9%] right-[6%] w-16 h-16 sm:w-24 sm:h-24 rounded-full cursor-pointer group flex items-center justify-center transition-transform active:scale-95 z-20"
              title="A Note Under the Moon"
            >
              {/* Gentle Starlight Aura on Moon */}
              <span className="absolute inset-0 rounded-full bg-amber-300/20 group-hover:bg-amber-300/40 transition-colors animate-pulse" />
              <span className="sr-only">Secret Moon Note</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 text-[10px] font-sans font-bold text-amber-200 bg-slate-900/90 px-2.5 py-0.5 rounded-full whitespace-nowrap border border-amber-300/40">
                Moon Note ♡
              </span>
            </button>

            {/* Interactive Glowing Star Pinpoints Embedded Into the Real Painting */}
            {STARRY_NIGHT_STARS.map((star) => {
              const isExplored = visitedStars.has(star.id);

              return (
                <button
                  key={star.id}
                  onClick={() => openStar(star)}
                  style={{ left: star.x, top: star.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                >
                  {/* Outer Gentle Halo */}
                  <span
                    className={`absolute -inset-2.5 rounded-full transition-all duration-300 ${
                      isExplored
                        ? "bg-amber-300/30 group-hover:bg-amber-300/50"
                        : "bg-white/40 group-hover:bg-amber-300/60 animate-pulse"
                    }`}
                  />

                  {/* Pulsing Core Star Beacon */}
                  <span className="relative flex items-center justify-center">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-200 text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-125 transition-transform">
                      {star.order}
                    </span>
                  </span>

                  {/* Star Label Tooltip on Hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-7 left-1/2 -translate-x-1/2 text-[10px] font-sans font-bold text-amber-100 bg-slate-900/95 px-2.5 py-1 rounded-full whitespace-nowrap border border-amber-300/40 shadow-xl pointer-events-none z-30">
                    Year 0{star.order} • {star.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Museum Exhibition Plaque Below Canvas */}
          <div className="pt-4 px-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#3d6350] border-t border-[#bbf7d0]/60 mt-3 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-serif font-bold text-[#132e22] text-sm">
                The Starry Night (1889)
              </span>
              <span className="text-[#6e9981]">•</span>
              <span>Vincent van Gogh • Saint-Rémy-de-Provence</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800 font-medium italic">
              <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
              <span>Dedicated to Mythri & Ajay // 2019 — 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Crescent Moon Modal */}
      <AnimatePresence>
        {showMoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#132e22]/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowMoonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="max-w-md w-full bg-[#fcfdfc] border-2 border-amber-300 rounded-[32px] p-7 shadow-2xl text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-sm">
                  <Moon className="w-7 h-7 text-amber-600 fill-amber-500" />
                </div>
              </div>

              <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-wider block mb-1">
                UNDER VAN GOGH'S CRESCENT MOON
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-3">
                To My Starry Night, Mythri
              </h3>
              <p className="text-sm text-[#3d6350] font-serif leading-relaxed italic mb-6">
                "When Vincent painted the swirling golden crescent against the deep ultramarine sky, he wanted to capture the fierce, quiet comfort that light brings to the dark. That is what you have been for me in seven years—the steady, beautiful light that turns my whole world golden."
              </p>

              <button
                onClick={() => setShowMoonModal(false)}
                className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-sans transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Close with Love ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Photo Portal Modal */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#132e22]/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedStar(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="max-w-lg w-full bg-[#fcfdfc] border-2 border-emerald-200 rounded-[32px] p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
                  <span className="text-xs font-bold text-emerald-800 font-sans">
                    Star 0{selectedStar.order} // {selectedStar.yearBadge}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStar(null)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#bbf7d0] shadow-sm h-56 bg-slate-100">
                <img
                  src={selectedStar.photoUrl}
                  alt={selectedStar.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              <h4 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {selectedStar.title}
              </h4>
              <p className="text-xs text-emerald-700 font-sans font-medium mb-3">
                {selectedStar.date} • {selectedStar.name}
              </p>
              <p className="text-sm font-serif text-[#3d6350] leading-relaxed italic mb-6">
                "{selectedStar.caption}"
              </p>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-[#bbf7d0]/70 pt-3 text-xs font-sans">
                <button
                  onClick={prevStar}
                  className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold text-emerald-800">
                  Memory {selectedStar.order} of {STARRY_NIGHT_STARS.length}
                </span>

                <button
                  onClick={nextStar}
                  className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
