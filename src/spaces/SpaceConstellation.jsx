import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Moon,
  Volume2,
  VolumeX,
  Compass
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  SparkleStar,
  PopFlower
} from "../components/common/GirlyPopDecorations";

// Star coordinates aligned directly onto the full-bleed canvas of "The Starry Night"
export const STARRY_NIGHT_STARS = [
  {
    id: "star-1",
    order: 1,
    title: "The First Glimpse",
    yearBadge: "Year 01 // 2019",
    name: "Venus (The Morning Star)",
    x: "34%",
    y: "53%",
    color: "#fef08a",
    date: "October 2019 // The Beginning",
    caption: "The giant luminous star shining brightest beside the cypress. Two headstrong Aries who crossed paths and realized neither could ever look away.",
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-2",
    order: 2,
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    name: "The Upper Cypress Star",
    x: "22%",
    y: "22%",
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
    x: "38%",
    y: "17%",
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
    y: "33%",
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
    y: "13%",
    color: "#fde047",
    date: "Year 06 // The Anchor",
    caption: "Counting down flights, departures, and busy days, knowing with absolute certainty that physical distance could never weaken what we built.",
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "star-7",
    order: 7,
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "Year 07 // Today",
    name: "The Village Watcher",
    x: "78%",
    y: "46%",
    color: "#fde047",
    date: "October 2026 // Forever & Always",
    caption: "Sitting beside you at the end of an exhausting week. In a world full of chaotic static and demands, you are the calm I always come home to. Seven years of us, and a lifetime still to write.",
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  }
];

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();
  const [visitedStars, setVisitedStars] = useState(() => new Set(["star-1"]));
  const [selectedStar, setSelectedStar] = useState(null);
  const [showMoonModal, setShowMoonModal] = useState(false);

  const openStar = (star) => {
    setSelectedStar(star);
    setVisitedStars((prev) => {
      const next = new Set(prev);
      next.add(star.id);
      if (next.size >= STARRY_NIGHT_STARS.length) {
        markSpaceCompleted("02-constellation");
        try {
          confetti({
            particleCount: 80,
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
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden select-none font-sans bg-slate-950">
      {/* 1. Full-Page Van Gogh "The Starry Night" Background */}
      <img
        src="/starry-night.jpg"
        alt="Vincent van Gogh - The Starry Night (1889)"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
      />

      {/* Subtle atmospheric vignette over the painting for clean contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/35 pointer-events-none" />

      {/* 2. Floating Top-Left Header Overlay */}
      <div className="absolute top-5 left-5 sm:left-8 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/75 backdrop-blur-xl border border-white/20 text-white px-5 py-3 rounded-3xl shadow-2xl flex items-center gap-3.5">
          <RibbonBow className="w-8 h-7 text-amber-300 drop-shadow-sm shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base text-amber-100 font-bold tracking-wide">
                Chapter 2 // The Starry Night
              </span>
              <SparkleStar className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <p className="text-[11px] text-sky-200/80 font-sans mt-0.5">
              Vincent van Gogh (1889) • Reimagined for Mythri & Ajay ♡
            </p>
          </div>
        </div>
      </div>

      {/* 3. Floating Top-Right Progress Pill */}
      <div className="absolute top-5 right-5 sm:right-8 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/75 backdrop-blur-xl border border-white/20 text-xs font-sans text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
          <FlowerBlossom className="w-3.5 h-3.5" petalColor="#fef08a" centerColor="#facc15" />
          <span className="text-sky-200 font-medium">Memories Explored:</span>
          <span className="text-amber-300 font-bold font-mono">
            {visitedStars.size} / {STARRY_NIGHT_STARS.length}
          </span>
        </div>
      </div>

      {/* 4. Clickable Crescent Moon Hotspot (Upper Right) */}
      <button
        onClick={() => setShowMoonModal(true)}
        className="absolute top-[10%] sm:top-[12%] right-[8%] sm:right-[11%] w-20 h-20 sm:w-28 sm:h-28 rounded-full cursor-pointer group flex items-center justify-center transition-transform active:scale-95 z-20"
        title="Van Gogh's Crescent Moon"
      >
        {/* Pulsing Moonlight Aura */}
        <span className="absolute inset-0 rounded-full bg-amber-300/25 group-hover:bg-amber-300/50 transition-colors animate-pulse" />
        <span className="sr-only">Secret Moon Note</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 text-[11px] font-sans font-bold text-amber-200 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full whitespace-nowrap border border-amber-300/50 shadow-2xl">
          Moon Note ♡
        </span>
      </button>

      {/* 5. Interactive Star Nodes Embedded Directly Across The Full Painting */}
      {STARRY_NIGHT_STARS.map((star) => {
        const isExplored = visitedStars.has(star.id);

        return (
          <button
            key={star.id}
            onClick={() => openStar(star)}
            style={{ left: star.x, top: star.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
          >
            {/* Outer Starlight Radiance Halo */}
            <span
              className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                isExplored
                  ? "bg-amber-300/35 group-hover:bg-amber-300/60"
                  : "bg-white/45 group-hover:bg-amber-300/70 animate-pulse"
              }`}
            />

            {/* Core Star Orb Beacon */}
            <span className="relative flex items-center justify-center">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-200 text-slate-900 font-bold text-xs flex items-center justify-center shadow-2xl border-2 border-white group-hover:scale-125 transition-transform">
                {star.order}
              </span>
            </span>

            {/* Hover Tooltip */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-amber-100 bg-slate-950/95 backdrop-blur-md px-3 py-1 rounded-full whitespace-nowrap border border-amber-300/50 shadow-2xl pointer-events-none z-30">
              Year 0{star.order} • {star.title}
            </span>
          </button>
        );
      })}

      {/* 6. Floating Bottom Guidance Bar */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/75 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-full text-xs font-sans shadow-2xl flex items-center gap-2.5">
          <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-sky-200">
            Tap any numbered star or the glowing crescent moon to unfold our story ♡
          </span>
        </div>
      </div>

      {/* Secret Crescent Moon Modal */}
      <AnimatePresence>
        {showMoonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
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
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
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
