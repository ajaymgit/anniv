import React, { useState, useRef, useCallback, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { RibbonBow, FlowerBlossom } from "../components/common/GirlyPopDecorations";
import { useAnniversary } from "../context/AnniversaryContext";
import DemoBiTemporalGallery from "./chapter6/DemoBiTemporalGallery";

export default function SpaceMythriEffect() {
  const { markSpaceCompleted } = useAnniversary();
  const [audioMuted, setAudioMuted] = useState(false);
  const audioCtxRef = useRef(null);

  // Mark space completed on exploration
  useEffect(() => {
    if (markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [markSpaceCompleted]);

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
      {/* Top Header */}
      <div className="z-30 w-full px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The Bi-Temporal Gallery (The Mythri Effect)
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              An archival lens: who I was in 2019 versus who I became across seven years with you
            </p>
          </div>
        </div>

        {/* Audio Mute/Unmute */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-[#3d6350] hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
            title={audioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Main Bi-Temporal Gallery Experience */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <DemoBiTemporalGallery playChime={playAdaptiveChime} />
      </div>
    </div>
  );
}
