import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Snowflake,
  Sun
} from "lucide-react";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

export const SEVEN_TRANSFORMATIONS = [
  {
    id: 1,
    dimension: "The 3 AM Co-Pilot & Dedicated Fixer",
    badge: "Dedicated Fixer",
    subtitle: "From Aloof Nonchalance to Her 24/7 Support System",
    beforeYear: "2019 // Before You",
    beforeState: "Detached, Guarded & Reluctant to Invest",
    beforeDesc:
      "Detached, guarded, and wrapped up in my own head. I was reluctant to get involved in anyone else’s problems or invest emotional energy into daily logistics. My default reflex was cold one-word answers and pretending nothing mattered.",
    beforeMannerism: "Cold one-word replies, aloof hands-in-pockets attitude, walking away, pretending nothing mattered.",
    afterYear: "2026 // With Mythri",
    afterState: "Her 24/7 Co-Pilot & Personal Support System",
    afterDesc:
      "Her 24/7 co-pilot and personal support system. I stay up until 3:00 AM helping her format PPTs, research complex topics, clean up academic reports, and organize study decks whenever she's overwhelmed.",
    afterMannerism: "'Send me what you have, I’ll format it,' staying on the call while she studies, building custom tools and apps just to make her life easier.",
    quote: "You turned someone who used to be detached into the guy who will happily stay up all night making sure your world is taken care of.",
    color: "#38bdf8"
  },
  {
    id: 2,
    dimension: "The 'Psychotherapist' Calm",
    badge: "Taming the Temper",
    subtitle: "From Hair-Trigger Irritation to Observant Composure",
    beforeYear: "2019 // Before You",
    beforeState: "Hair-Trigger Frustration & Defensive Reflex",
    beforeDesc:
      "Hair-trigger frustration, defensive reflex, snapping when things went wrong, and clenching my jaw over minor friction. My first impulse was always to react immediately.",
    beforeMannerism: "Pacing the floor, sharp tone, reacting immediately on impulse.",
    afterYear: "2026 // With Mythri",
    afterState: "The Observant, Patient Listener",
    afterDesc:
      "The observant, patient listener. Like our inside joke about The Silent Patient ('reading this book is like your POV if you were a psychotherapist'), I've learned to sit with her rants, absorb chaotic moments, and respond with steady reassurance instead of matching the stress.",
    afterMannerism: "Taking a breath, listening quietly without interrupting, asking 'what happened next?', and being the calm center when things get chaotic.",
    quote: "You taught me that being strong isn't reacting with fire; it’s being the steady, calm listener when everything else is loud.",
    color: "#f59e0b"
  },
  {
    id: 3,
    dimension: "Finding Conviction",
    badge: "Volume & Voice",
    subtitle: "From a Mumbled Whisper to Speaking with Conviction",
    beforeYear: "2019 // Before You",
    beforeState: "Locked Thoughts & Shrinking Away",
    beforeDesc:
      "I kept my thoughts locked inside, mumbled under my breath, and shrank away from asserting what I wanted, assuming people wouldn't care anyway.",
    beforeMannerism: "Looking down, speaking under my breath, letting others dominate.",
    afterYear: "2026 // With Mythri",
    afterState: "Expressing Ideas Clearly Without Hesitation",
    afterDesc:
      "Expressing myself clearly and without hesitation. Because Mythri always gave me full, undivided attention and genuinely cared about my thoughts, I stopped shrinking into the corner.",
    afterMannerism: "Looking her in the eye, voicing what I need, articulating ideas with confidence and conviction.",
    quote: "You gave volume to my silence because you were the first person who made me feel like my words actually carried weight.",
    color: "#10b981"
  },
  {
    id: 4,
    dimension: "'Send the Other Three Info Ya'",
    badge: "Communication Over Ego",
    subtitle: "From Stubborn Pride to Team Problem-Solving",
    beforeYear: "2019 // Before You",
    beforeState: "Stubborn Clashes Fighting to 'Win'",
    beforeDesc:
      "Stubborn, defensive arguments where disagreements felt like territorial battles to 'win' or prove a point with passive-aggressive distance.",
    beforeMannerism: "Walking away mid-argument, cold shoulder, defensive debate points.",
    afterYear: "2026 // With Mythri",
    afterState: "Teamwork Rhythm & Unhurried Problem Solving",
    afterDesc:
      "The teamwork rhythm. No passive-aggressive silence or bruised pride. Even when deadlines, fatigue, or disagreements hit, it shifts into collaborative problem-solving, playful banter, and sitting down to talk things through unhurriedly.",
    afterMannerism: "'Let's sit down and figure this out together,' making tea, laughing through the tension, focusing on fixing the issue rather than fighting each other.",
    quote: "We stopped fighting each other and started solving life as a team.",
    color: "#f43f5e"
  },
  {
    id: 5,
    dimension: "The Reality Check",
    badge: "Cutting Through Overthinking",
    subtitle: "From Catastrophizing to Grounded Clarity",
    beforeYear: "2019 // Before You",
    beforeState: "Overthinking Rabbit Holes & Spiraling",
    beforeDesc:
      "Overthinking rabbit holes, catastrophizing, spiraling into 'what-ifs', and getting trapped in stressful mental narratives of my own making.",
    beforeMannerism: "Restless pacing, internal spiral, insomnia over imagined worst-case scenarios.",
    afterYear: "2026 // With Mythri",
    afterState: "Straightforward, No-Nonsense Clarity",
    afterDesc:
      "Mythri’s straightforward, no-nonsense clarity. Whenever my mind starts overcomplicating things or spinning out, her grounded perspective cuts straight through the noise and anchors me back to solid ground.",
    afterMannerism: "Talking it out with her for 10 minutes and realizing things are never as impossible as my head made them seem.",
    quote: "Whenever my mind starts spiraling into a hundred 'what-ifs', you bring me right back to earth with one sentence.",
    color: "#eab308"
  },
  {
    id: 6,
    dimension: "From Lone Wolf to Her #1 Cheerleader",
    badge: "Her #1 Cheerleader",
    subtitle: "From Carrying Burdens Alone to a True Partner",
    beforeYear: "2019 // Before You",
    beforeState: "Solitary Operator Carrying Burdens Alone",
    beforeDesc:
      "The solitary operator. Believing that relying on anyone was a weakness, carrying every burden alone, refusing help, and keeping emotional armor on.",
    beforeMannerism: "Hiding stress, refusing support, fighting the world alone.",
    afterYear: "2026 // With Mythri",
    afterState: "Unapologetically Her Partner & Biggest Fan",
    afterDesc:
      "Unapologetically her partner and biggest fan. Building an entire 7-chapter anniversary suite, crafting desktop companion apps (CoupleStick), celebrating her milestones, and knowing you have a permanent teammate in your corner.",
    afterMannerism: "Sharing the load, taking genuine pride in her wins, resting in the safety of having each other.",
    quote: "I spent years thinking I had to fight life alone. Loving you made me realize how much better it is to have an anchor in your corner.",
    color: "#059669"
  },
  {
    id: 7,
    dimension: "The Culmination",
    badge: "October 2019 to Today",
    subtitle: "From an Insecure Kid to the Grounded Man Standing Today",
    beforeYear: "2019 // Before You",
    beforeState: "Insecure, Guarded 2019 Kid Behind Walls",
    beforeDesc:
      "An insecure, guarded 2019 kid hiding behind nonchalance, unsure of his purpose, reacting defensively to the world to avoid vulnerability.",
    beforeMannerism: "Wandering without clear direction, putting up walls to avoid vulnerability.",
    afterYear: "2026 // With Mythri",
    afterState: "A Grounded, Protective, Reliable Partner",
    afterDesc:
      "A grounded, protective, reliable partner who takes accountability, stays steady through hardships, and genuinely knows who he is.",
    afterMannerism: "Standing tall with calm shoulders, keeping promises, protecting her peace, and living with purpose.",
    quote: "Seven years of loving you, being held accountable by you, and sharing life with you turned an insecure kid into the man standing here today.",
    color: "#86efac"
  }
];

export default function BiTemporalIceSlider({ playChime }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const t = SEVEN_TRANSFORMATIONS[activeIdx];

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

  const selectTransformation = (idx) => {
    setActiveIdx(idx);
    if (playChime) playChime(392 + idx * 55, 0.4);
  };

  const nextTransformation = () => {
    const next = (activeIdx + 1) % SEVEN_TRANSFORMATIONS.length;
    selectTransformation(next);
  };

  const prevTransformation = () => {
    const prev = activeIdx === 0 ? SEVEN_TRANSFORMATIONS.length - 1 : activeIdx - 1;
    selectTransformation(prev);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-5 max-w-5xl mx-auto overflow-y-auto font-sans">
      {/* 1. Header Toolbar & Seven Transformation Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#132e22]">
                Shift 0{t.id} // {t.dimension}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t.badge}
              </span>
            </div>
            <p className="text-xs text-[#3d6350] font-sans">{t.subtitle}</p>
          </div>
        </div>

        {/* 7 Transformation Quick Buttons */}
        <div className="flex items-center gap-1.5 bg-[#f0fdf4] p-1 rounded-2xl border border-emerald-200 shadow-2xs overflow-x-auto max-w-full">
          {SEVEN_TRANSFORMATIONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => selectTransformation(idx)}
              className={`px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 ${
                activeIdx === idx
                  ? "bg-emerald-700 text-white shadow-xs scale-105"
                  : "text-[#3d6350] hover:text-[#132e22] hover:bg-white/60"
              }`}
            >
              0{item.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive "Melt the Ice" Slider Dual Viewport */}
      <div className="my-3 flex-1 flex flex-col items-center justify-center">
        {/* Instruction cue */}
        <div className="mb-2 flex items-center gap-2 text-xs text-[#3d6350] font-serif italic">
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Drag the silk ribbon slider horizontally to melt the 2019 ice wall and reveal the 2026 man</span>
        </div>

        {/* The Dual Layer Card */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-full max-w-4xl h-[340px] sm:h-[380px] rounded-[32px] overflow-hidden border-2 border-emerald-200 shadow-xl bg-white select-none touch-none cursor-ew-resize"
        >
          {/* LAYER A: 2019 FROST (Cool slate, ice crystal edges, pencil sketch) */}
          <div className="absolute inset-0 w-full h-full bg-[#f1f5f9] text-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Ice Shard Corner Accent */}
            <div className="absolute top-2 left-6 pointer-events-none flex items-center gap-1.5">
              <WashiTape className="w-20 h-4 opacity-75" color="bg-slate-300" />
              <Snowflake className="w-4 h-4 text-sky-400" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-bold">
                  {t.beforeYear}
                </span>
                <span className="text-[11px] font-mono text-slate-500 italic">
                  [The Ramparts of Ice]
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t.beforeState}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-slate-700 leading-relaxed max-w-xl">
                {t.beforeDesc}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-200/80 border border-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5 font-bold">
                Old Physical Mannerisms:
              </span>
              <p className="text-xs font-serif italic text-slate-800 font-medium">
                "{t.beforeMannerism}"
              </p>
            </div>
          </div>

          {/* LAYER B: 2026 WARMTH (Warm honeydew matcha, soft blooms, golden ink) - Clipped to sliderPos */}
          <div
            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f0fdf4] via-[#f7faf8] to-[#ecfdf5] text-[#132e22] p-6 sm:p-8 flex flex-col justify-between transition-none overflow-hidden"
          >
            {/* Warm Bloom Washi Tape */}
            <div className="absolute top-2 right-8 pointer-events-none flex items-center gap-1.5">
              <WashiTape className="w-20 h-4 opacity-80" color="bg-emerald-200" />
              <Sun className="w-4 h-4 text-amber-500" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                  {t.afterYear}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-serif font-bold">
                  <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
                  <span>[Melted & Transformed]</span>
                </div>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-2 flex items-center gap-2">
                {t.afterState}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed max-w-xl">
                {t.afterDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-0.5">
                The Way I Live Today:
              </span>
              <p className="text-xs font-serif italic text-[#132e22] font-semibold">
                "{t.afterMannerism}"
              </p>
            </div>
          </div>

          {/* Draggable Silk Ribbon Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.6)] z-20 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-400 shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
              <RibbonBow className="w-6 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Bottom quick anchors */}
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[11px] font-sans font-bold text-slate-500 pointer-events-none z-10">
            <span className="bg-white/90 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              ← 2019 (The Ice Wall)
            </span>
            <span className="bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-800 shadow-2xs">
              2026 (The Grounded Man) →
            </span>
          </div>
        </div>

        {/* 3. Pull Quote Banner */}
        <div className="mt-3 w-full max-w-4xl p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex items-center gap-3">
          <PopFlower className="w-7 h-7 text-emerald-500 shrink-0" color="#a7f3d0" />
          <p className="text-xs font-serif italic text-[#3d6350] leading-relaxed">
            "{t.quote}"
          </p>
        </div>
      </div>

      {/* 4. Bottom Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs font-sans">
        <button
          onClick={prevTransformation}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-serif font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Shift</span>
        </button>

        <span className="text-[#3d6350] font-mono text-[11px]">
          Shift 0{activeIdx + 1} of 0{SEVEN_TRANSFORMATIONS.length}
        </span>

        <button
          onClick={nextTransformation}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Next Shift</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
