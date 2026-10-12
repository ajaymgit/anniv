import React, { useState } from "react";
import { Grid, Sparkles, RotateCcw } from "lucide-react";
import { sounds } from "../../utils/audio";

export default function PatternLock({ onComplete }) {
  const [selectedDots, setSelectedDots] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Target infinity pattern sequence: 4 (left) -> 2 (top) -> 6 (right) -> 8 (bottom) -> 5 (center)
  const targetPattern = [4, 2, 6, 8, 5];

  // Coordinates for the 3x3 grid (center coordinates for SVG line drawing)
  const dotCoords = {
    1: { x: 40, y: 40 },
    2: { x: 120, y: 40 },
    3: { x: 200, y: 40 },
    4: { x: 40, y: 120 },
    5: { x: 120, y: 120 },
    6: { x: 200, y: 120 },
    7: { x: 40, y: 200 },
    8: { x: 120, y: 200 },
    9: { x: 200, y: 200 },
  };

  const handleDotClick = (id) => {
    sounds.playClick();
    if (!selectedDots.includes(id)) {
      const next = [...selectedDots, id];
      setSelectedDots(next);

      if (next.length === targetPattern.length) {
        const matches = next.every((val, idx) => val === targetPattern[idx]);
        if (matches) {
          sounds.playSuccess();
          setIsSuccess(true);
          setTimeout(onComplete, 950);
        } else {
          sounds.playError();
          setTimeout(() => setSelectedDots([]), 550);
        }
      }
    }
  };

  const handleClear = () => {
    sounds.playClick();
    setSelectedDots([]);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
      <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
        <Grid className="w-4 h-4" />
        <span>LAYER 06 // VAULT PATTERN LOCK</span>
      </div>

      <div className="bg-black/70 p-3.5 rounded-2xl text-xs text-slate-300 italic mb-6 border border-slate-800 leading-relaxed font-sans">
        "I have no beginning, no end. I curve and cross through the center to link past and future endlessly. Trace my shape."
      </div>

      {/* Interactive SVG & 3x3 Dot Grid */}
      <div className="relative w-60 h-60 mx-auto mb-6 bg-slate-950 rounded-2xl border border-slate-800 p-2 overflow-hidden shadow-inner">
        {/* Render Connected Glowing SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 240 240">
          {selectedDots.map((dotId, idx) => {
            if (idx === 0) return null;
            const prevDot = selectedDots[idx - 1];
            const p1 = dotCoords[prevDot];
            const p2 = dotCoords[dotId];
            return (
              <line
                key={`${prevDot}-${dotId}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#06b6d4]"
              />
            );
          })}
        </svg>

        {/* 3x3 Clickable Nodes */}
        <div className="grid grid-cols-3 gap-6 w-full h-full relative z-20 p-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dotId) => {
            const isSelected = selectedDots.includes(dotId);
            const orderIndex = selectedDots.indexOf(dotId);

            return (
              <button
                key={dotId}
                onClick={() => handleDotClick(dotId)}
                className={`w-11 h-11 rounded-full border-2 transition-all flex flex-col items-center justify-center font-mono text-xs cursor-pointer select-none relative m-auto ${
                  isSelected
                    ? "bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/50 font-bold scale-110"
                    : "border-slate-800 bg-slate-900 text-slate-500 hover:border-cyan-500/40 hover:text-slate-300"
                }`}
              >
                <span>{dotId}</span>
                {isSelected && (
                  <span className="text-[8px] absolute -bottom-1 bg-black text-cyan-400 px-1 rounded-full border border-cyan-400 font-bold">
                    {orderIndex + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
        <span>Connected: {selectedDots.length} / {targetPattern.length}</span>
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {isSuccess && (
        <div className="mt-4 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold font-mono animate-pulse">
          INFINITY PATTERN CONFIRMED // GATEWAY OPEN
        </div>
      )}
    </div>
  );
}
