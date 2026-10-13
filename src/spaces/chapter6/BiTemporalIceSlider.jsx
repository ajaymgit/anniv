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
    dimension: "The Ice Rampart",
    badge: "Melting the Fortress",
    subtitle: "From Prickly Nonchalance to Unashamed Devotion",
    beforeYear: "2019 // Before You",
    beforeState: "Koyun from 'Ramparts of Ice'",
    beforeDesc:
      "I was the exact mirror of Koyun from Ramparts of Ice. Aloof, guarded, and acting completely nonchalant like I didn't care about anything. I never spoke to any girl. My independence was a frozen wall built to keep everyone out.",
    beforeMannerism: "Hands in pockets, cold one-word answers, walking away, pretending nothing mattered.",
    afterYear: "2026 // With Mythri",
    afterState: "Unashamedly a 'Girl's Boy'",
    afterDesc:
      "You didn't fight that wall; you just showed up with genuine warmth until every layer of ice melted. Today, I am completely, unashamedly a 'girl's boy'—attentive to your moods, learning your world, and proud to care for you.",
    afterMannerism: "Listening to your day, checking if you've eaten, soft smiles, being your safe space.",
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins.",
    color: "#38bdf8"
  },
  {
    id: 2,
    dimension: "The Controlled Flame",
    badge: "Taming the Temper",
    subtitle: "From a Hot-Headed Temper to Composure",
    beforeYear: "2019 // Before You",
    beforeState: "Hair-Trigger Irritation & Sudden Anger",
    beforeDesc:
      "I had a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. If something went sideways, my first reflex was to flare up, snap, and clench my jaw in frustration.",
    beforeMannerism: "Pacing the floor, sharp tone, slamming doors, reacting on impulse.",
    afterYear: "2026 // With Mythri",
    afterState: "Patience, Composure & Deep Breaths",
    afterDesc:
      "Being with you taught me that losing my temper never solved a single problem. In seven years, you showed me how to hold my fire, breathe through chaos, and meet hardship with composure instead of hostility.",
    afterMannerism: "Holding your hand, taking a deep breath, laughing off minor delays, staying steady.",
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it.",
    color: "#f59e0b"
  },
  {
    id: 3,
    dimension: "Finding My Voice",
    badge: "Volume & Conviction",
    subtitle: "From a Silent Mumble to Speaking with Conviction",
    beforeYear: "2019 // Before You",
    beforeState: "A Silent Voice Under My Breath",
    beforeDesc:
      "I had a very silent voice. I mumbled my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head. I didn't believe what I had to say was worth the room's attention.",
    beforeMannerism: "Looking down, speaking in a quiet whisper, letting others talk over me.",
    afterYear: "2026 // With Mythri",
    afterState: "Speaking Louder with Confidence",
    afterDesc:
      "Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. You pushed me to articulate my thoughts and stand tall.",
    afterMannerism: "Speaking with projection, looking people in the eye, standing firm in my words.",
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard.",
    color: "#10b981"
  },
  {
    id: 4,
    dimension: "How We Communicate",
    badge: "Dialogue over Ego",
    subtitle: "From Fiery Arguments to Patient Talk",
    beforeYear: "2019 // Before You",
    beforeState: "Stubborn Clashes to 'Win'",
    beforeDesc:
      "Early on, when we disagreed, we had fiery, stubborn arguments where neither of us wanted to back down. We fought to be right. Disagreements felt like battles of pride and territory.",
    beforeMannerism: "Defending my stance, arguing over points, letting silence turn into tension.",
    afterYear: "2026 // With Mythri",
    afterState: "Patient, Unhurried Conversations",
    afterDesc:
      "Over seven years, that dynamic completely transformed. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication. We stopped fighting each other and started solving things together.",
    afterMannerism: "Sitting down over tea, listening without interrupting, asking 'how are you feeling?'.",
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding.",
    color: "#f43f5e"
  },
  {
    id: 5,
    dimension: "The Grounded Lens",
    badge: "Objective Reality",
    subtitle: "From Distorted Panic to Seeing Things as They Are",
    beforeYear: "2019 // Before You",
    beforeState: "Mental Fog & Magnified Panic",
    beforeDesc:
      "When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst-case scenario, and reacting out of panic. I lived inside stressful narratives of my own making.",
    beforeMannerism: "Catastrophizing, spiraling into 'what-ifs', restless insomnia.",
    afterYear: "2026 // With Mythri",
    afterState: "Her Grounded Reality Check",
    afterDesc:
      "You became my reality check. When everything in my mind is racing, you have this grounded clarity that cuts through the fog and helps me see things objectively as they truly are. You bring me back to solid earth.",
    afterMannerism: "Talking it out with you, stepping back from the panic, trusting the present hour.",
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing.",
    color: "#eab308"
  },
  {
    id: 6,
    dimension: "The Unfailing Support",
    badge: "An Anchor in the Corner",
    subtitle: "From a Lone Wolf to a True Partner",
    beforeYear: "2019 // Before You",
    beforeState: "Fighting the Arena in Solitude",
    beforeDesc:
      "I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down. I had no emotional safety net and pretended I didn't want one.",
    beforeMannerism: "Refusing help, burying stress, believing nobody could truly understand.",
    afterYear: "2026 // With Mythri",
    afterState: "An Unwavering Support System",
    afterDesc:
      "You became my steadfast anchor. Through every exhaustion, career pivot, and heavy season, knowing you are standing in my corner changed how I face the world. I stopped fighting life alone, because I finally found my partner.",
    afterMannerism: "Sharing the load, resting in your presence, facing challenges with calm certainty.",
    quote: "Because of your unwavering support, I never have to walk into the arena alone again.",
    color: "#059669"
  },
  {
    id: 7,
    dimension: "Becoming a Man",
    badge: "The Culmination",
    subtitle: "From a Guarded Boy to a Grounded Man",
    beforeYear: "2019 // Before You",
    beforeState: "An Insecure, Prickly Kid",
    beforeDesc:
      "Looking back at the boy from October 2019—he was an insecure, angry, prickly kid hiding behind an aloof mask, unsure of who he was or where his life was going.",
    beforeMannerism: "Self-centered decisions, defensive posture, wandering without clear purpose.",
    afterYear: "2026 // With Mythri",
    afterState: "A Grounded, Protective Man",
    afterDesc:
      "In plain words: I’ve become a man because of you. Seven years of loving you, being held accountable by you, and sharing life with you turned a boy into someone calm, responsible, protective, and deeply at peace.",
    afterMannerism: "Protecting what matters, keeping promises, standing tall with shoulders back.",
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you.",
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
