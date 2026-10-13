import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Calendar,
  Layers,
  Heart
} from "lucide-react";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

const EXHIBITS = [
  {
    id: 1,
    dimension: "The Temperament",
    themeBadge: "Patience & Composure",
    subtitle: "From Restless Friction to Grounded Calm",
    beforeYear: "2019 // Before You",
    beforeState: "Quick to Agitation & Guarded Armor",
    beforeDesc:
      "I used to meet stress with immediate defensiveness. Traffic jams, delayed plans, or minor frustrations would sour my entire evening. My instinct was always to stiffen my spine, close off, and fight the world alone.",
    beforeMannerism: "Pacing the floor, clenching my jaw, keeping a tight lid on vulnerability.",
    afterYear: "2026 // Shaped by You",
    afterState: "Quiet Composure & Deep Breath",
    afterDesc:
      "You never lectured me to calm down. Instead, you demonstrated how to stay soft when circumstances are hard. In seven years of watching you meet adversity with quiet grace, your calm rewrote my nervous system.",
    afterMannerism: "Reaching for your hand, breathing through delays, smiling at the chaos.",
    keyShiftQuote:
      "You didn't ask me to change my fire; you simply gave it a safe hearth where it didn't need to burn the house down.",
    color: "#059669"
  },
  {
    id: 2,
    dimension: "The Perspective",
    themeBadge: "Presence & Wonder",
    subtitle: "From Milestone Obsession to Everyday Wonder",
    beforeYear: "2019 // Before You",
    beforeState: "Tunnel-Vision on the Next Goalpost",
    beforeDesc:
      "Life felt like a treadmill of productivity. If an evening wasn't productive, I treated it as wasted time. I barely noticed the smell of rain or the way coffee tastes when you sit still for an hour.",
    beforeMannerism: "Constantly checking the clock, rushing to the next task, blind to the present.",
    afterYear: "2026 // Shaped by You",
    afterState: "Finding Sacredness in Ordinary Tuesdays",
    afterDesc:
      "You taught me that our best memories wouldn't be boardroom wins or expensive dinners. They are midnight rides in soaking rain, leaving the crunchiest fry at the bottom for you, and talking across a wooden table.",
    afterMannerism: "Lingering over coffee, listening to the rain, savoring mundane routines.",
    keyShiftQuote:
      "You showed me that eternity isn't waiting at the finish line—it's tucked into a rainy 1 AM ride with your arms around me.",
    color: "#10b981"
  },
  {
    id: 3,
    dimension: "The Defenses",
    themeBadge: "Vulnerability & Safe Harbor",
    subtitle: "From Fierce Solitude to Unconditional Sanctuary",
    beforeYear: "2019 // Before You",
    beforeState: "Stubborn Aries Self-Sufficiency",
    beforeDesc:
      "I believed that needing anyone was a liability. I prided myself on handling every burden in silence, viewing emotional openness as an invitation to get hurt. My independence was my fortress.",
    beforeMannerism: "Saying 'I am fine' when exhausted, isolating until the storm passed.",
    afterYear: "2026 // Shaped by You",
    afterState: "Resting in Safe Harbor",
    afterDesc:
      "With you, the fortress vanished on day one. I learned that laying my head on your shoulder after an exhausting week isn't surrender—it is coming home. You made vulnerability feel like breathing.",
    afterMannerism: "Admitting when I'm tired, asking for a hug, showing the unfinished pieces.",
    keyShiftQuote:
      "With everyone else, I keep my armor polished. With you, I leave it at the doorstep without a second thought.",
    color: "#34d399"
  },
  {
    id: 4,
    dimension: "The Everyday Rhythm",
    themeBadge: "Gentle Habits",
    subtitle: "From Chaotic Friction to Absorbed Mannerisms",
    beforeYear: "2019 // Before You",
    beforeState: "Rough Edges & Unfiltered Hurry",
    beforeDesc:
      "I lived in a state of hurried friction. I spoke abruptly, disregarded subtle room shifts, and operated like a freight train with only my own track in mind.",
    beforeMannerism: "Talking over quiet moments, walking fast ahead, forgetting small thoughtful gestures.",
    afterYear: "2026 // Shaped by You",
    afterState: "The Habits I Softly Borrowed from You",
    afterDesc:
      "I catch myself laughing in your cadence, using words I stole from your vocabulary, checking if you've eaten before I take my first bite, and noticing when someone across the table is quietly uncomfortable.",
    afterMannerism: "Saving the last bite for you, matching your walking pace, absorbing your gentle humor.",
    keyShiftQuote:
      "Seven years with you didn't erase who I was; it softly sanded down every jagged edge until I became someone I am actually proud to be.",
    color: "#6ee7b7"
  },
  {
    id: 5,
    dimension: "The Moral Compass",
    themeBadge: "Integrity & Loyalty",
    subtitle: "From Skeptical Caution to Unshakable Integrity",
    beforeYear: "2019 // Before You",
    beforeState: "Self-Protective Cynicism",
    beforeDesc:
      "Disappointments had left me cautious and transactional. I calculated loyalty and kept score, expecting people to disappoint or leave when things became inconvenient.",
    beforeMannerism: "Keeping score, anticipating disappointment, guarding emotional investment.",
    afterYear: "2026 // Shaped by You",
    afterState: "Rooted in Quiet, Fierce Loyalty",
    afterDesc:
      "Watching how fiercely you stand by your people with zero performance or audience reshaped my moral benchmark. You taught me what unconditional integrity looks like in real time.",
    afterMannerism: "Showing up without being asked, forgiving quickly, anchoring those I love.",
    keyShiftQuote:
      "Whenever I face a hard decision or feel cynical about the world, I look at how you live your life—and that is all the direction I need.",
    color: "#059669"
  }
];

export default function DemoBiTemporalGallery({ playChime }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const exhibit = EXHIBITS[activeIdx];

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSlider(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateSlider(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSlider = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left);
    const newPos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(newPos);
  };

  const handleSelectExhibit = (idx) => {
    setActiveIdx(idx);
    if (playChime) playChime(440 + idx * 60, 0.4);
  };

  const nextExhibit = () => {
    const next = (activeIdx + 1) % EXHIBITS.length;
    handleSelectExhibit(next);
  };

  const prevExhibit = () => {
    const prev = activeIdx === 0 ? EXHIBITS.length - 1 : activeIdx - 1;
    handleSelectExhibit(prev);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto overflow-y-auto font-sans">
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#132e22]">
                Exhibit 0{exhibit.id} // {exhibit.dimension}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {exhibit.themeBadge}
              </span>
            </div>
            <p className="text-xs text-[#3d6350] font-sans">{exhibit.subtitle}</p>
          </div>
        </div>

        {/* Exhibit Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-[#f0fdf4] p-1 rounded-2xl border border-emerald-200 shadow-2xs">
          {EXHIBITS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleSelectExhibit(idx)}
              className={`px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                activeIdx === idx
                  ? "bg-white text-emerald-950 shadow-xs border border-emerald-300 ring-1 ring-emerald-200"
                  : "text-[#3d6350] hover:text-[#132e22]"
              }`}
            >
              0{item.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Bi-Temporal Reveal Canvas */}
      <div className="my-3 flex-1 flex flex-col items-center justify-center">
        {/* Slider Instruction Badge */}
        <div className="mb-2 flex items-center gap-2 text-xs text-[#3d6350] font-serif italic">
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Drag the silk ribbon slider horizontally to reveal how her presence transformed this trait</span>
        </div>

        {/* Dual Layer Viewport */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full max-w-4xl h-[330px] sm:h-[370px] rounded-[32px] overflow-hidden border-2 border-emerald-200 shadow-xl bg-white select-none touch-none cursor-ew-resize"
        >
          {/* Layer A: BEFORE (2019 Blueprint / Monochrome) */}
          <div className="absolute inset-0 w-full h-full bg-[#f8fafc] text-slate-800 p-6 sm:p-8 flex flex-col justify-between">
            {/* Corner Washi Tape */}
            <div className="absolute top-2 left-6 pointer-events-none">
              <WashiTape className="w-20 h-4 opacity-70" color="bg-slate-300" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 font-bold">
                  {exhibit.beforeYear}
                </span>
                <span className="text-[11px] font-mono text-slate-500 italic">
                  [The Raw Blueprint]
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {exhibit.beforeState}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-slate-600 leading-relaxed max-w-xl">
                {exhibit.beforeDesc}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">
                Physical Manifestation:
              </span>
              <p className="text-xs font-serif italic text-slate-700">
                "{exhibit.beforeMannerism}"
              </p>
            </div>
          </div>

          {/* Layer B: AFTER (2026 Warm Mint & Watercolor) - Clipped to sliderPos */}
          <div
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f0fdf4] via-[#f7faf8] to-[#ecfdf5] text-[#132e22] p-6 sm:p-8 flex flex-col justify-between transition-none"
          >
            {/* Top Washi Tape */}
            <div className="absolute top-2 right-8 pointer-events-none">
              <WashiTape className="w-20 h-4 opacity-80" color="bg-emerald-200" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  {exhibit.afterYear}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-serif font-bold">
                  <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
                  <span>[The Living Transformation]</span>
                </div>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-2 flex items-center gap-2">
                {exhibit.afterState}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed max-w-xl">
                {exhibit.afterDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block mb-0.5">
                The New Way I Live:
              </span>
              <p className="text-xs font-serif italic text-[#132e22]">
                "{exhibit.afterMannerism}"
              </p>
            </div>
          </div>

          {/* Draggable Divider Line & Ribbon Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] z-20 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-400 shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
              <RibbonBow className="w-6 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Quick Jump Anchors */}
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[11px] font-sans font-bold text-slate-500 pointer-events-none z-10">
            <span className="bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
              ← 2019 (Before)
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-800">
              2026 (With Mythri) →
            </span>
          </div>
        </div>

        {/* 3. Key Turning Point Quote Card */}
        <div className="mt-3 w-full max-w-4xl p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex items-center gap-3">
          <PopFlower className="w-7 h-7 text-emerald-500 shrink-0" color="#a7f3d0" />
          <p className="text-xs font-serif italic text-[#3d6350] leading-relaxed">
            "{exhibit.keyShiftQuote}"
          </p>
        </div>
      </div>

      {/* 4. Bottom Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs font-sans">
        <button
          onClick={prevExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Trait</span>
        </button>

        <span className="text-[#3d6350] font-mono text-[11px]">
          Exhibit {activeIdx + 1} of {EXHIBITS.length}
        </span>

        <button
          onClick={nextExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Next Trait</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
