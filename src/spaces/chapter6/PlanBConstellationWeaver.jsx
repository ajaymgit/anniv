import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X, Check, Star } from "lucide-react";
import { RibbonBow, FlowerBlossom } from "../../components/common/GirlyPopDecorations";

const CONSTELLATION_NODES = [
  // Cluster 1: Perspectives Reimagined
  {
    id: "star-1",
    label: "A Calmer Ambition",
    cluster: "Perspectives",
    x: 22,
    y: 28,
    color: "#86efac",
    lesson: "Before our time together, success to me was frantic output. Seeing your quiet confidence showed me that true momentum comes from purpose and inner peace, not rushing.",
    spark: "Your centered way of living"
  },
  {
    id: "star-2",
    label: "Seeing Tomorrow Differently",
    cluster: "Perspectives",
    x: 36,
    y: 20,
    color: "#6ee7b7",
    lesson: "You changed how I envision the future. It stopped being an anxious checklist of milestones and became an exciting road of quiet mornings, shared meals, and building something steady together.",
    spark: "How you dream with warmth and clarity"
  },
  {
    id: "star-3",
    label: "Valuing Stillness",
    cluster: "Perspectives",
    x: 44,
    y: 35,
    color: "#34d399",
    lesson: "You taught me that resting isn't falling behind. Just sitting beside each other without speaking became one of the richest parts of my day.",
    spark: "Comfortable silences on rainy afternoons"
  },

  // Cluster 2: Emotional Grounding
  {
    id: "star-4",
    label: "Reflexive Gentleness",
    cluster: "Grounding",
    x: 62,
    y: 25,
    color: "#a7f3d0",
    lesson: "Whenever stress threatened to make me rigid or impatient, your gentle nature was a mirror. You showed me that softness is the greatest sign of maturity.",
    spark: "The gentleness in your touch and tone"
  },
  {
    id: "star-5",
    label: "Vulnerability as Strength",
    cluster: "Grounding",
    x: 75,
    y: 34,
    color: "#10b981",
    lesson: "I used to hide doubts behind a composed wall. Being with you showed me that sharing what's heavy doesn't push people away; it deepens every bridge between us.",
    spark: "The safety of your presence"
  },
  {
    id: "star-6",
    label: "Emotional Anchoring",
    cluster: "Grounding",
    x: 68,
    y: 48,
    color: "#059669",
    lesson: "No matter how turbulent the outside world got, talking to you at the end of the day reset my pulse. You became the quiet center of gravity for my mind.",
    spark: "Our late evening decompressions"
  },

  // Cluster 3: Habits & Living Rhythms
  {
    id: "star-7",
    label: "Morning Rhythms",
    cluster: "Rhythms",
    x: 28,
    y: 65,
    color: "#6ee7b7",
    lesson: "I used to wake up straight into screens and panic. You introduced the ritual of slow starts: natural daylight, breathing in, and cherishing the first cup.",
    spark: "Your morning serenity"
  },
  {
    id: "star-8",
    label: "Tasting New Worlds",
    cluster: "Rhythms",
    x: 40,
    y: 76,
    color: "#34d399",
    lesson: "From spontaneous bakeries to unfamiliar dishes I never would have tried on my own, your adventurous palate taught me to embrace new flavors with joy.",
    spark: "Your spontaneous foodie cravings"
  },
  {
    id: "star-9",
    label: "The Gift of Attentiveness",
    cluster: "Rhythms",
    x: 52,
    y: 62,
    color: "#86efac",
    lesson: "Remembering what others care about, checking in on people, noticing when a friend is quiet — your natural empathy trained my own attention to be wider and warmer.",
    spark: "How thoughtfully you care for others"
  },

  // Cluster 4: Personal Maturation
  {
    id: "star-10",
    label: "Becoming Someone I Respect",
    cluster: "Maturation",
    x: 72,
    y: 72,
    color: "#10b981",
    lesson: "The person I was seven years ago feels like an early draft. Looking in the mirror today, the qualities I am proudest of are the ones your presence nurtured into bloom.",
    spark: "Seven years of your influence"
  }
];

const PREDEFINED_LINKS = [
  ["star-1", "star-2"],
  ["star-2", "star-3"],
  ["star-1", "star-3"],
  ["star-4", "star-5"],
  ["star-5", "star-6"],
  ["star-4", "star-6"],
  ["star-7", "star-8"],
  ["star-8", "star-9"],
  ["star-7", "star-9"],
  ["star-3", "star-6"],
  ["star-6", "star-10"],
  ["star-9", "star-10"]
];

export default function PlanBConstellationWeaver({ playChime }) {
  const [activeConnections, setActiveConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [lastClickedNode, setLastClickedNode] = useState(null);

  const handleStarClick = (star) => {
    setSelectedNode(star);

    if (lastClickedNode && lastClickedNode.id !== star.id) {
      // Connect stars
      const newLinkKey = [lastClickedNode.id, star.id].sort().join("-");
      if (!activeConnections.includes(newLinkKey)) {
        setActiveConnections((prev) => [...prev, newLinkKey]);
        if (playChime) playChime(440 + activeConnections.length * 45, 0.6);
      }
      setLastClickedNode(null);
    } else {
      setLastClickedNode(star);
      if (playChime) playChime(523.25, 0.4);
    }
  };

  const weaveAllConstellations = () => {
    const allKeys = PREDEFINED_LINKS.map((link) => [...link].sort().join("-"));
    setActiveConnections(Array.from(new Set(allKeys)));
    if (playChime) playChime(784, 0.8);
  };

  const resetConstellations = () => {
    setActiveConnections([]);
    setSelectedNode(null);
    setLastClickedNode(null);
    if (playChime) playChime(330, 0.3);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-gradient-to-b from-[#0f241a] via-[#132e22] to-[#0b1a13] text-[#f7faf8]">
      {/* Top HUD Controls */}
      <div className="z-10 mt-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-md flex items-center justify-between gap-3 text-xs w-[92%] max-w-xl">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-400" />
          <span className="font-serif font-bold text-white">
            Plan B: The Constellation Weaver
          </span>
          <span className="text-[10px] text-emerald-300 font-mono hidden sm:inline">
            ({activeConnections.length} Threads Woven)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={weaveAllConstellations}
            className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-medium transition-all"
          >
            Weave All
          </button>
          <button
            onClick={resetConstellations}
            className="p-1 rounded-full text-emerald-300 hover:text-white transition-colors"
            title="Reset Threads"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Celestial Sky Canvas Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Ambient Stardust Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${(i % 3) + 1.5}px`,
                height: `${(i % 3) + 1.5}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                animationDuration: `${2 + (i % 4)}s`,
                opacity: 0.3 + (i % 5) * 0.15
              }}
            />
          ))}
        </div>

        {/* Constellation SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="silkStarlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {activeConnections.map((key) => {
            const [idA, idB] = key.split("-");
            const starA = CONSTELLATION_NODES.find((s) => s.id === idA);
            const starB = CONSTELLATION_NODES.find((s) => s.id === idB);
            if (!starA || !starB) return null;

            return (
              <line
                key={key}
                x1={`${starA.x}%`}
                y1={`${starA.y}%`}
                x2={`${starB.x}%`}
                y2={`${starB.y}%`}
                stroke="url(#silkStarlight)"
                strokeWidth="1.8"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Interactive Star Nodes */}
        {CONSTELLATION_NODES.map((star) => {
          const isSelected = selectedNode?.id === star.id;
          const isPending = lastClickedNode?.id === star.id;

          return (
            <motion.div
              key={star.id}
              onClick={() => handleStarClick(star)}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex flex-col items-center group`}
            >
              {/* Star Core Halo */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected || isPending
                    ? "bg-white shadow-[0_0_20px_#34d399] ring-2 ring-emerald-300"
                    : "bg-emerald-950/80 border border-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:border-white"
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 transition-colors ${
                    isSelected || isPending ? "text-emerald-700 fill-emerald-600" : "text-emerald-300 fill-emerald-400/30"
                  }`}
                />
              </div>

              {/* Node Label Floating Underneath */}
              <span className="mt-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] sm:text-[11px] font-sans text-emerald-100 whitespace-nowrap border border-emerald-500/20 group-hover:border-emerald-300 transition-colors">
                {star.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Floating Instruction & Reflection Modal */}
      <div className="z-10 mb-4 w-full flex flex-col items-center">
        {lastClickedNode && !selectedNode && (
          <span className="text-[11px] text-emerald-300 bg-black/50 px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
            Click another star to weave a thread between them ✨
          </span>
        )}

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.95 }}
              className="max-w-lg w-[92%] bg-white/95 backdrop-blur-xl border border-emerald-300 p-5 rounded-[26px] shadow-2xl text-left text-[#132e22] relative"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <RibbonBow className="w-5 h-4 text-emerald-500" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                    Constellation Node • {selectedNode.cluster}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-base sm:text-lg font-serif font-bold text-[#132e22]">
                {selectedNode.label}
              </h4>

              <p className="text-xs sm:text-sm font-sans text-[#2d4d3d] mt-1.5 leading-relaxed">
                "{selectedNode.lesson}"
              </p>

              <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                <span className="italic font-serif text-[#3d6350]">
                  Sparked by: {selectedNode.spark}
                </span>
                <span className="text-emerald-700 font-medium font-sans">
                  Click another node to connect
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
