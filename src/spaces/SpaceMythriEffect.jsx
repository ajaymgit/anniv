import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { RibbonBow, FlowerBlossom } from "../components/common/GirlyPopDecorations";
import DemoBiTemporalGallery from "./chapter6/DemoBiTemporalGallery";
import DemoRippleResonance from "./chapter6/DemoRippleResonance";
import DemoLivingTree from "./chapter6/DemoLivingTree";

const DIRECTIONS = [
  {
    id: "gallery",
    name: "1. Bi-Temporal Gallery",
    shortName: "1. Before & After",
    icon: "🎞️",
    desc: "Interactive Archival Lens (2019 vs 2026)"
  },
  {
    id: "resonance",
    name: "2. Ripple & Resonance",
    shortName: "2. Ripple & Touch",
    icon: "🫧",
    desc: "Bioluminescent Touch & Botanical Chimes"
  },
  {
    id: "tree",
    name: "3. The Living Tree",
    shortName: "3. 2,556 Days",
    icon: "🌳",
    desc: "Dendrochronology of 7 Annual Growth Rings"
  }
];

export default function SpaceMythriEffect() {
  const [selectedDirection, setSelectedDirection] = useState("gallery");
  const [audioMuted, setAudioMuted] = useState(false);
  const audioCtxRef = useRef(null);

  // Shared Procedural Web Audio Engine
  const playAdaptiveChime = useCallback(
    (frequency = 440, velocity = 0.5) => {
      if (audioMuted) return;
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = velocity < 0.4 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1100 + velocity * 1200, ctx.currentTime);

        const peak = Math.min(0.12, 0.03 + velocity * 0.07);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.3);
      } catch (e) {}
    },
    [audioMuted]
  );

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Header & Interactive Direction Selector Bar */}
      <div className="z-30 w-full px-4 sm:px-6 pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        {/* Title Section */}
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The Mythri Effect (3 Interactive Concepts)
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Exploring personal transformation and who I became across seven years with you
            </p>
          </div>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#f0fdf4] p-1 rounded-2xl border border-emerald-200 shadow-2xs overflow-x-auto max-w-full">
          {DIRECTIONS.map((dir) => {
            const isActive = selectedDirection === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => {
                  setSelectedDirection(dir.id);
                  playAdaptiveChime(523.25, 0.4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-white text-emerald-950 shadow-xs border border-emerald-300 ring-1 ring-emerald-200"
                    : "text-[#3d6350] hover:text-[#132e22] hover:bg-white/60"
                }`}
              >
                <span>{dir.icon}</span>
                <span className="hidden md:inline">{dir.name}</span>
                <span className="md:hidden">{dir.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Mute/Unmute */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-[#3d6350] hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
            title={audioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Dynamic Demo Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedDirection === "gallery" && (
            <motion.div
              key="demo-gallery"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <DemoBiTemporalGallery playChime={playAdaptiveChime} />
            </motion.div>
          )}

          {selectedDirection === "resonance" && (
            <motion.div
              key="demo-resonance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <DemoRippleResonance playChime={playAdaptiveChime} />
            </motion.div>
          )}

          {selectedDirection === "tree" && (
            <motion.div
              key="demo-tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <DemoLivingTree playChime={playAdaptiveChime} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
