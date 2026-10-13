import React, { useRef, useCallback, useEffect } from "react";
import { useAnniversary } from "../context/AnniversaryContext";
import ClockworkTransformation from "./chapter6/ClockworkTransformation";

export default function SpaceMythriEffect() {
  const { markSpaceCompleted } = useAnniversary();
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
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] overflow-hidden select-none font-sans">
      <ClockworkTransformation playChime={playAdaptiveChime} />
    </div>
  );
}
