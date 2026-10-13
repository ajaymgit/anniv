import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles, Check, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { RibbonBow, FlowerBlossom } from "../../components/common/GirlyPopDecorations";

const INFLUENCES = [
  {
    id: "coffee",
    icon: "☕",
    name: "Slow Mornings",
    item: "Her Coffee Habit",
    change: "You turned my chaotic mornings into a peaceful coffee ritual.",
    color: "#d97706"
  },
  {
    id: "music",
    icon: "🎧",
    name: "Her Playlist",
    item: "Shared Songs",
    change: "My daily playlist is now 80% songs and artists you put me on.",
    color: "#059669"
  },
  {
    id: "books",
    icon: "📚",
    name: "Curiosity",
    item: "Books & Essays",
    change: "You introduced me to authors and perspectives that opened my mind.",
    color: "#2563eb"
  },
  {
    id: "patience",
    icon: "🌿",
    name: "Composure",
    item: "Patience",
    change: "Watching you stay calm in stress taught me how to breathe through storms.",
    color: "#10b981"
  },
  {
    id: "kindness",
    icon: "🌸",
    name: "Gentleness",
    item: "Softened Edges",
    change: "You showed me that quiet tenderness is stronger than hard cynicism.",
    color: "#f472b6"
  }
];

export default function DemoEvolvingAvatar({ playChime }) {
  const [givenItems, setGivenItems] = useState([]);
  const [recentReaction, setRecentReaction] = useState(null);
  const [success, setSuccess] = useState(false);

  const giveItem = (item) => {
    if (givenItems.includes(item.id)) return;

    const next = [...givenItems, item.id];
    setGivenItems(next);
    setRecentReaction(item);
    if (playChime) playChime(440 + next.length * 75, 0.5);

    if (next.length === INFLUENCES.length) {
      setTimeout(() => {
        setSuccess(true);
        if (playChime) playChime(880, 0.8);
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 700);
    }
  };

  const resetAvatar = () => {
    setGivenItems([]);
    setRecentReaction(null);
    setSuccess(false);
    if (playChime) playChime(330, 0.3);
  };

  const level = givenItems.length;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-gradient-to-b from-[#f7faf8] via-[#eef7f2] to-[#e6f4ec] p-4 text-[#132e22]">
      {/* Top Header */}
      <div className="z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between gap-3 max-w-md w-full text-xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-500" />
          <span className="font-serif font-bold text-sm">The Evolving Companion</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-sans">
          <span>Evolution: <strong>Level {level} / 5</strong></span>
        </div>
        <button
          onClick={resetAvatar}
          className="p-1 rounded-full hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Avatar Stage */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center">
        {/* Reaction Speech Bubble */}
        <AnimatePresence>
          {recentReaction && (
            <motion.div
              key={recentReaction.id}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute top-8 bg-white/95 backdrop-blur-md border border-emerald-300 px-4 py-2 rounded-2xl shadow-sm text-center max-w-xs z-20"
            >
              <span className="text-[10px] uppercase font-mono text-emerald-700 font-bold block">
                {recentReaction.item} Absorbed!
              </span>
              <p className="text-xs font-serif font-bold text-[#132e22] mt-0.5">
                "{recentReaction.change}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cute Avatar Character */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: 1 + level * 0.03
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Floral Glow Aura based on Evolution Level */}
          <div
            className="absolute -inset-6 rounded-full blur-xl transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: `rgba(52, 211, 153, ${0.1 + level * 0.12})`,
              transform: `scale(${1 + level * 0.15})`
            }}
          />

          {/* Avatar Head */}
          <div className="relative w-28 h-28 rounded-full bg-[#fdecd2] border-2 border-[#d97706]/40 shadow-md flex items-center justify-center z-10">
            {/* Hair */}
            <div className="absolute -top-1 w-24 h-10 bg-[#3b2a1a] rounded-t-full" />

            {/* Eyes */}
            <div className="flex items-center gap-6 mt-1">
              <div className="w-2.5 h-3.5 bg-[#1e293b] rounded-full" />
              <div className="w-2.5 h-3.5 bg-[#1e293b] rounded-full" />
            </div>

            {/* Smile (Happy curved line) */}
            <div className="absolute bottom-5 w-5 h-2.5 border-b-2 border-[#1e293b] rounded-full" />

            {/* Blush Cheeks */}
            <div className="absolute bottom-6 left-3 w-3 h-2 bg-rose-300/60 rounded-full" />
            <div className="absolute bottom-6 right-3 w-3 h-2 bg-rose-300/60 rounded-full" />

            {/* Equipped Accessories */}
            {givenItems.includes("music") && (
              <div className="absolute -top-2 w-32 h-16 border-t-4 border-emerald-600 rounded-t-full pointer-events-none" />
            )}
            {givenItems.includes("kindness") && (
              <div className="absolute -top-3 -right-1 text-base animate-bounce">🌸</div>
            )}
          </div>

          {/* Cozy Sweater Body */}
          <div
            className="w-36 h-20 rounded-t-3xl border-t-2 border-emerald-300 shadow-sm mt-1 z-10 flex items-center justify-center transition-colors duration-500"
            style={{
              backgroundColor: level >= 4 ? "#10b981" : level >= 2 ? "#34d399" : "#6ee7b7"
            }}
          >
            <div className="flex items-center gap-1.5 opacity-70">
              <RibbonBow className="w-5 h-4 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Influences Shelf (Items she can tap to gift) */}
      <div className="z-10 w-full max-w-lg bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-around gap-2 mb-2">
        {INFLUENCES.map((item) => {
          const isGiven = givenItems.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => giveItem(item)}
              disabled={isGiven || success}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                isGiven
                  ? "bg-emerald-100/70 border-emerald-300 opacity-60"
                  : "bg-[#f0fdf4] hover:bg-emerald-100 border-emerald-200 active:scale-95 shadow-2xs hover:shadow-xs"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-sans font-bold text-[#132e22]">
                {item.name}
              </span>
              {isGiven && <Check className="w-3 h-3 text-emerald-700" />}
            </button>
          );
        })}
      </div>

      {/* SUCCESS MODAL: The Effect of Her */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border-2 border-emerald-300 p-6 sm:p-7 rounded-[32px] shadow-2xl max-w-md w-full text-center relative">
              <div className="flex justify-center mb-2">
                <RibbonBow className="w-8 h-7 text-emerald-500" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                Evolution Complete ✨
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-2">
                The Person I Became With You
              </h3>

              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans mb-4">
                "The person I was seven years ago feels like an unpolished rough draft. The coffee I drink, the music I enjoy, the patience I practice, and the kindness I aim to give the world — your presence gave all of it to me."
              </p>

              <button
                onClick={resetAvatar}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Evolve Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
