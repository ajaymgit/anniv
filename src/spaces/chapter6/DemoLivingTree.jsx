import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  TreeDeciduous,
  Leaf
} from "lucide-react";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

const TREE_RINGS = [
  {
    ring: 1,
    year: "Year 01 // 2019",
    daysCumulative: "Day 1 – 365",
    theme: "The Rooting",
    tagline: "Unlearning Defensive Self-Sufficiency",
    color: "#059669",
    strokeColor: "#059669",
    radius: 38,
    story:
      "Two headstrong, fiercely independent Aries who believed needing anyone was a vulnerability. In that first year, your presence quietly dismantled my defenses. I planted roots in ground that finally felt safe enough to stop running.",
    quote: "You didn't ask me to surrender my independence; you gave it a companion."
  },
  {
    ring: 2,
    year: "Year 02 // 2020",
    daysCumulative: "Day 366 – 730",
    theme: "The Weathering",
    tagline: "Midnight Rain & Simple Comfort",
    color: "#10b981",
    strokeColor: "#10b981",
    radius: 65,
    story:
      "Riding through torrential night rain when neither of us had any business on the road, with your hands tucked tightly into my jacket pockets. That year taught me that love didn't require luxury or fair weather—it was warmth in the cold.",
    quote: "In that quiet midnight city, I realized I would ride anywhere as long as you were with me."
  },
  {
    ring: 3,
    year: "Year 03 // 2021",
    daysCumulative: "Day 731 – 1,095",
    theme: "The Canopy",
    tagline: "The Sacred Ease of Silence",
    color: "#34d399",
    strokeColor: "#34d399",
    radius: 92,
    story:
      "Four hours passing like four minutes across a wooden table over iced coffees. Splitting extra crispy fries and leaving the best one for you. You taught me the rare beauty of comfort so deep it feels like breathing.",
    quote: "With you, silence was never awkward; it was the quietest sanctuary I ever known."
  },
  {
    ring: 4,
    year: "Year 04 // 2022",
    daysCumulative: "Day 1,096 – 1,460",
    theme: "The Grain",
    tagline: "Learning Your Cadence",
    color: "#6ee7b7",
    strokeColor: "#6ee7b7",
    radius: 119,
    story:
      "By year four, love became second nature. I learned how to recognize your exhaustion before a word was spoken, how to soften my stubbornness, forgive quickly, and laugh through intense UNO rivalries.",
    quote: "We learned to hold space for each other when life felt heavy. You became my safest harbor."
  },
  {
    ring: 5,
    year: "Year 05 // 2023",
    daysCumulative: "Day 1,461 – 1,825",
    theme: "The Heartwood",
    tagline: "Absorbing Integrity",
    color: "#047857",
    strokeColor: "#047857",
    radius: 146,
    story:
      "Watching how unconditionally you stand by the people you love without any performance or audience. In five years, my respect for your character became the compass I measure my own life against.",
    quote: "You are the standard of integrity and quiet loyalty in my world."
  },
  {
    ring: 6,
    year: "Year 06 // 2024",
    daysCumulative: "Day 1,826 – 2,190",
    theme: "The Flex",
    tagline: "Unbroken Across Miles",
    color: "#065f46",
    strokeColor: "#065f46",
    radius: 173,
    story:
      "Counting down airport gates and time zones. Distance tested routines, but it never diluted us. That ring grew tough and flexible, proving our bond was anchored long before the miles appeared.",
    quote: "Physical distance could never dilute what seven years carved into our bones."
  },
  {
    ring: 7,
    year: "Year 07 // Today & Forever",
    daysCumulative: "Day 2,191 – 2,556",
    theme: "The Living Cambium",
    tagline: "The Man I Am Today",
    color: "#059669",
    strokeColor: "#059669",
    radius: 200,
    story:
      "The living outermost ring of new buds and blossoms. Looking at the person I am today compared to 2019—calmer, kinder, anchored, and deeply at peace. Every bit of that growth happened in the warmth of your love.",
    quote: "To love you for 2,556 days was to be remade into someone I am proud to be."
  }
];

export default function DemoLivingTree({ playChime }) {
  const [selectedRingIdx, setSelectedRingIdx] = useState(6); // Default to year 7
  const [hoveredRingIdx, setHoveredRingIdx] = useState(null);

  const activeIdx = hoveredRingIdx !== null ? hoveredRingIdx : selectedRingIdx;
  const activeRing = TREE_RINGS[activeIdx];

  const handleSelectRing = (idx) => {
    setSelectedRingIdx(idx);
    if (playChime) playChime(392 + idx * 55, 0.45);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto overflow-y-auto font-sans">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#132e22]">
                Direction 3 // The Living Tree of 2,556 Days
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Botanical Dendrochronology
              </span>
            </div>
            <p className="text-xs text-[#3d6350] font-sans">
              Hover or touch any annual growth ring to reveal the personal transformation of that year
            </p>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2 bg-[#f0fdf4] px-3 py-1.5 rounded-2xl border border-emerald-200 text-xs font-mono text-emerald-800 shadow-2xs">
          <TreeDeciduous className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">7 Rings • 84 Months • 2,556 Days</span>
        </div>
      </div>

      {/* 2. Main Content Split: Interactive SVG Cross-Section & Memory Card */}
      <div className="my-3 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center justify-center">
        {/* Left: Interactive Tree Cross-Section SVG */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
            <svg
              viewBox="0 0 440 440"
              className="w-full h-full drop-shadow-xl select-none"
            >
              {/* Bark Outer Rim */}
              <circle
                cx="220"
                cy="220"
                r="215"
                fill="#f7faf8"
                stroke="#d1fae5"
                strokeWidth="12"
              />
              <circle
                cx="220"
                cy="220"
                r="206"
                fill="#ffffff"
                stroke="#6ee7b7"
                strokeWidth="4"
              />

              {/* Natural Radial Rays (wood rays radiating outward) */}
              {[15, 48, 82, 125, 160, 205, 240, 285, 320].map((deg) => (
                <line
                  key={`ray-${deg}`}
                  x1="220"
                  y1="220"
                  x2={220 + Math.cos((deg * Math.PI) / 180) * 200}
                  y2={220 + Math.sin((deg * Math.PI) / 180) * 200}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity="0.6"
                />
              ))}

              {/* 7 Concentric Tree Rings (rendered outside-in so inner ones are clickable) */}
              {[...TREE_RINGS].reverse().map((ringData) => {
                const idx = ringData.ring - 1;
                const isSelected = selectedRingIdx === idx;
                const isHovered = hoveredRingIdx === idx;

                return (
                  <g
                    key={ringData.ring}
                    className="cursor-pointer"
                    onClick={() => handleSelectRing(idx)}
                    onMouseEnter={() => setHoveredRingIdx(idx)}
                    onMouseLeave={() => setHoveredRingIdx(null)}
                  >
                    {/* Ring fill area for easy clicking */}
                    <circle
                      cx="220"
                      cy="220"
                      r={ringData.radius}
                      fill={
                        isSelected
                          ? "rgba(167, 243, 208, 0.35)"
                          : isHovered
                          ? "rgba(209, 250, 229, 0.45)"
                          : "rgba(240, 253, 244, 0.15)"
                      }
                      stroke={isSelected ? "#059669" : ringData.strokeColor}
                      strokeWidth={isSelected ? 4 : 2}
                      strokeDasharray={isSelected ? "none" : "none"}
                      className="transition-all duration-200"
                    />

                    {/* Ring number badge placed on ring curve */}
                    <circle
                      cx={220 + Math.cos(((ringData.ring * 45) * Math.PI) / 180) * (ringData.radius - 8)}
                      cy={220 + Math.sin(((ringData.ring * 45) * Math.PI) / 180) * (ringData.radius - 8)}
                      r={isSelected ? 9 : 7}
                      fill={isSelected ? "#059669" : "#ffffff"}
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <text
                      x={220 + Math.cos(((ringData.ring * 45) * Math.PI) / 180) * (ringData.radius - 8)}
                      y={220 + Math.sin(((ringData.ring * 45) * Math.PI) / 180) * (ringData.radius - 8) + 3}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#065f46"}
                      fontSize={isSelected ? "9" : "8"}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {ringData.ring}
                    </text>
                  </g>
                );
              })}

              {/* Heartwood Center Core (Day 1 Seed) */}
              <circle
                cx="220"
                cy="220"
                r="18"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer"
                onClick={() => handleSelectRing(0)}
              />
              <circle cx="220" cy="220" r="6" fill="#fef08a" />
            </svg>

            {/* Center Core Label Badge */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-[9px] font-mono text-white font-bold block drop-shadow-sm">
                SEED
              </span>
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-[#3d6350] font-serif italic">
            Tap any ring 1 through 7 to view how that year expanded your world
          </div>
        </div>

        {/* Right: Detailed Growth Story Card */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRing.ring}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-emerald-200 rounded-[32px] p-6 sm:p-7 shadow-xl relative overflow-hidden text-[#132e22]"
            >
              {/* Washi Tape */}
              <div className="absolute -top-1.5 right-10 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <FlowerBlossom className="w-4 h-4" petalColor="#86efac" centerColor="#fef08a" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    Ring {activeRing.ring} of 7 // {activeRing.daysCumulative}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activeRing.year}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {activeRing.theme}
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-3">
                {activeRing.tagline}
              </p>

              {/* Story Narrative */}
              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed mb-4">
                {activeRing.story}
              </p>

              {/* Pull Quote */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "{activeRing.quote}"
                </p>
              </div>

              {/* Ring Progress Indicator */}
              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-sans text-[#3d6350]">
                <span>Annual Layer Growth</span>
                <span className="font-mono font-bold text-emerald-800">
                  Ring Radius: {activeRing.radius}px ({Math.round((activeRing.ring / 7) * 100)}% Canopy)
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Bottom Timeline Scrubber */}
      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-3 text-xs font-sans">
        <button
          onClick={() => handleSelectRing(Math.max(0, selectedRingIdx - 1))}
          disabled={selectedRingIdx === 0}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Earlier Ring</span>
        </button>

        {/* Year Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {TREE_RINGS.map((ring, idx) => (
            <button
              key={ring.ring}
              onClick={() => handleSelectRing(idx)}
              className={`px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                selectedRingIdx === idx
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Y0{ring.ring}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSelectRing(Math.min(TREE_RINGS.length - 1, selectedRingIdx + 1))}
          disabled={selectedRingIdx === TREE_RINGS.length - 1}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Outer Ring</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
