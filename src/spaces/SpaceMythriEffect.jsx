import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAnniversary } from "../context/AnniversaryContext";
import BotanicalConservatory from "./chapter6/BotanicalConservatory";
import ArtifactsVitrine from "./chapter6/ArtifactsVitrine";
import { RibbonBow, FlowerBlossom } from "../components/common/GirlyPopDecorations";

export default function SpaceMythriEffect() {
  const { markSpaceCompleted } = useAnniversary();
  const [activeWing, setActiveWing] = useState("conservatory"); // "conservatory" (Option 1) | "vitrine" (Option 2)
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [markSpaceCompleted]);

  // Shared Procedural Web Audio Engine
  const playAdaptiveChime = useCallback((frequency = 440, velocity = 0.5) => {
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
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* Top Museum Wing Navigation Bar */}
      <div className="z-30 px-4 py-2 bg-white/95 backdrop-blur-md border-b border-emerald-200/90 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <span className="font-serif text-xs sm:text-sm font-bold text-[#132e22]">
            Chapter 6 // The Transformation Gallery
          </span>
        </div>

        {/* Switch between Option 1 (Botanical Conservatory) and Option 2 (Editorial Vitrine) */}
        <div className="flex items-center gap-1.5 bg-[#f0fdf4] p-1 rounded-2xl border border-emerald-200 shadow-2xs">
          <button
            onClick={() => setActiveWing("conservatory")}
            className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWing === "conservatory"
                ? "bg-emerald-700 text-white shadow-xs scale-105"
                : "text-[#3d6350] hover:text-[#132e22] hover:bg-white/60"
            }`}
          >
            <span>Option 1: 3D Conservatory</span>
            <FlowerBlossom className="w-3 h-3" petalColor="#86efac" centerColor="#fef08a" />
          </button>

          <button
            onClick={() => setActiveWing("vitrine")}
            className={`px-3 py-1 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeWing === "vitrine"
                ? "bg-emerald-700 text-white shadow-xs scale-105"
                : "text-[#3d6350] hover:text-[#132e22] hover:bg-white/60"
            }`}
          >
            <span>Option 2: Editorial Vitrine</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="relative flex-1 w-full h-[calc(100%-48px)] overflow-hidden">
        {activeWing === "conservatory" ? (
          <BotanicalConservatory playChime={playAdaptiveChime} />
        ) : (
          <ArtifactsVitrine playChime={playAdaptiveChime} />
        )}
      </div>
    </div>
  );
}
