import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Info, CheckCircle2, ChevronRight, X } from "lucide-react";
import { RibbonBow, FlowerBlossom, WashiTape, PopFlower } from "../../components/common/GirlyPopDecorations";

const CATALYST_SEEDS = [
  {
    id: "composure",
    title: "Quiet Composure",
    category: "Inner Foundation",
    color: "#34d399",
    tag: "Steadiness in Storms",
    reflection: "Before we spent years together, every minor frustration felt urgent. Watching how calmly and gracefully you handle life taught me to breathe, pause, and keep my composure when everything around is spinning.",
    learnedFrom: "Your instinctive calm under pressure",
    initX: -140,
    initY: -110
  },
  {
    id: "listening",
    title: "Presence & Listening",
    category: "Communication",
    color: "#10b981",
    tag: "Hearing Beyond Words",
    reflection: "I used to listen just to answer or fix things. You taught me the rare art of holding space — listening simply to understand, to care, and to let someone feel truly seen.",
    learnedFrom: "The patience in how you listen",
    initX: 140,
    initY: -110
  },
  {
    id: "appreciation",
    title: "Noticing Small Wonders",
    category: "Perspective",
    color: "#6ee7b7",
    tag: "The Quiet Beauty",
    reflection: "Rushing from task to task was my default state. You opened my eyes to ordinary magic: morning light through window panes, funny shapes in clouds, and savoring warm tea in silence.",
    learnedFrom: "How you stop to admire simple things",
    initX: -170,
    initY: 60
  },
  {
    id: "curiosity",
    title: "Expanded Horizons",
    category: "Mindset",
    color: "#059669",
    tag: "Books, Music & Tastes",
    reflection: "So many books on my shelf, melodies in my playlist, and cuisines I now crave exist solely because you gently brought them into my world. My mind grew bigger because of your curiosity.",
    learnedFrom: "Your recommendations and spontaneous interests",
    initX: 170,
    initY: 60
  },
  {
    id: "gentleness",
    title: "A Kinder Lens",
    category: "Character",
    color: "#86efac",
    tag: "Softening Hard Edges",
    reflection: "I had sharper edges and cynical instincts before. Your innate kindness softened those corners. You showed me that gentleness is not weakness, but quiet, unshakable strength.",
    learnedFrom: "Your generosity toward people and animals",
    initX: 0,
    initY: 150
  },
  {
    id: "routines",
    title: "The Art of Daily Life",
    category: "Lifestyle",
    color: "#a7f3d0",
    tag: "Shared Rhythms",
    reflection: "You transformed simple days into sacred routines. Weekend mornings, evening debriefs, and comfortable silences became the anchor that gives my life structure and deep peace.",
    learnedFrom: "The warmth of our shared everyday rituals",
    initX: 0,
    initY: -170
  }
];

export default function PlanAGrowthEcosystem({ playChime }) {
  const [connectedIds, setConnectedIds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [positions, setPositions] = useState(() => {
    const map = {};
    CATALYST_SEEDS.forEach((s) => {
      map[s.id] = { x: s.initX, y: s.initY };
    });
    return map;
  });

  const containerRef = useRef(null);

  const toggleConnection = (id) => {
    const isConnected = connectedIds.includes(id);
    const target = CATALYST_SEEDS.find((s) => s.id === id);

    if (isConnected) {
      setConnectedIds((prev) => prev.filter((item) => item !== id));
      if (playChime) playChime(330, 0.3);
    } else {
      setConnectedIds((prev) => [...prev, id]);
      setSelectedSeed(target);
      if (playChime) playChime(440 + connectedIds.length * 70, 0.6);
    }
  };

  const handleReset = () => {
    setConnectedIds([]);
    setSelectedSeed(null);
    const map = {};
    CATALYST_SEEDS.forEach((s) => {
      map[s.id] = { x: s.initX, y: s.initY };
    });
    setPositions(map);
    if (playChime) playChime(350, 0.4);
  };

  const connectAll = () => {
    setConnectedIds(CATALYST_SEEDS.map((s) => s.id));
    if (playChime) playChime(660, 0.8);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-[#f7faf8]">
      {/* Top Banner Context */}
      <div className="z-10 mt-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-xs flex items-center gap-3">
        <RibbonBow className="w-5 h-4 text-emerald-500" />
        <span className="text-xs font-serif font-bold text-[#132e22]">
          Plan A: The Growth Ecosystem
        </span>
        <span className="text-[11px] text-[#3d6350] hidden sm:inline">
          — Drag seeds to shape your growth network, or click to tether & reflect
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={connectAll}
            className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium transition-colors"
          >
            Tether All
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] transition-colors"
            title="Reset Seeds"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Sandbox Space */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
      >
        {/* SVG Connective Tendrils & Vines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="tendrilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#86efac" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Connected Tendril Lines */}
          {connectedIds.map((id) => {
            const pos = positions[id];
            if (!pos) return null;
            // Center is at 50% 50%
            return (
              <g key={id}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${pos.x}px)`}
                  y2={`calc(50% + ${pos.y}px)`}
                  stroke="url(#tendrilGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="animate-pulse"
                />
                {/* Sprouted Midpoint Blossom */}
                <circle
                  cx={`calc(50% + ${pos.x * 0.5}px)`}
                  cy={`calc(50% + ${pos.y * 0.5}px)`}
                  r="4"
                  fill="#34d399"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Core Entity: "Who I Was" */}
        <motion.div
          className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-emerald-100 via-white to-emerald-50 border-2 border-emerald-300 shadow-md flex flex-col items-center justify-center text-center p-3 cursor-default"
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              "0 4px 20px rgba(16,185,129,0.12)",
              "0 8px 30px rgba(16,185,129,0.24)",
              "0 4px 20px rgba(16,185,129,0.12)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-200/70 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-emerald-800 font-bold">
            Core Origin
          </span>
          <h4 className="text-xs sm:text-sm font-serif font-bold text-[#132e22] leading-tight">
            Who I Am With You
          </h4>
          <span className="text-[9px] text-[#3d6350] mt-0.5 font-sans">
            {connectedIds.length} of {CATALYST_SEEDS.length} Roots Anchored
          </span>
        </motion.div>

        {/* Draggable & Clickable Catalyst Seeds */}
        {CATALYST_SEEDS.map((seed) => {
          const isConnected = connectedIds.includes(seed.id);
          const currentPos = positions[seed.id] || { x: seed.initX, y: seed.initY };

          return (
            <motion.div
              key={seed.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                setPositions((prev) => ({
                  ...prev,
                  [seed.id]: {
                    x: currentPos.x + info.offset.x,
                    y: currentPos.y + info.offset.y
                  }
                }));
              }}
              style={{
                x: currentPos.x,
                y: currentPos.y
              }}
              onClick={() => toggleConnection(seed.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute z-20 cursor-grab active:cursor-grabbing p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex items-center gap-2.5 ${
                isConnected
                  ? "bg-white border-emerald-400 shadow-md ring-2 ring-emerald-200"
                  : "bg-white/85 backdrop-blur-sm border-emerald-200/80 hover:bg-white hover:border-emerald-300"
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform"
                style={{ backgroundColor: `${seed.color}25` }}
              >
                <FlowerBlossom
                  className="w-4.5 h-4.5"
                  petalColor={seed.color}
                  centerColor="#fef08a"
                />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-serif font-bold text-[#132e22]">
                    {seed.title}
                  </span>
                  {isConnected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-[#3d6350] block font-sans">
                  {seed.tag}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Reflection Modal Card */}
      <AnimatePresence>
        {selectedSeed && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-[92%] bg-white/95 backdrop-blur-xl border-2 border-emerald-300 p-5 sm:p-6 rounded-[28px] shadow-xl z-30 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <RibbonBow className="w-5 h-4 text-emerald-500" />
                <span className="text-[11px] font-sans uppercase tracking-wider text-emerald-700 font-bold">
                  {selectedSeed.category} • {selectedSeed.tag}
                </span>
              </div>
              <button
                onClick={() => setSelectedSeed(null)}
                className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#132e22] mb-1.5">
              {selectedSeed.title}
            </h3>

            <p className="text-xs sm:text-sm font-sans text-[#2d4d3d] leading-relaxed mb-3">
              "{selectedSeed.reflection}"
            </p>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-100">
              <span className="text-[#3d6350] italic font-serif">
                Sparked by: {selectedSeed.learnedFrom}
              </span>
              <button
                onClick={() => toggleConnection(selectedSeed.id)}
                className="font-sans font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                {connectedIds.includes(selectedSeed.id) ? "Untether" : "Tether Root"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
