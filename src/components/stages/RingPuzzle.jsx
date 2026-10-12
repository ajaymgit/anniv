import React, { useState } from "react";
import { Disc, RotateCw, CheckCircle2 } from "lucide-react";
import { sounds } from "../../utils/audio";

export default function RingPuzzle({ onComplete }) {
  const [angles, setAngles] = useState([120, 240, 90]); // Outer, Middle, Inner
  const [isLocked, setIsLocked] = useState(false);

  const rotateRing = (index, step = 30) => {
    sounds.playGear();
    setAngles((prev) => {
      const next = [...prev];
      next[index] = (next[index] + step) % 360;
      return next;
    });
  };

  const isSolved = angles.every((a) => a === 0);

  const handleVerify = () => {
    if (isSolved) {
      sounds.playSuccess();
      setIsLocked(true);
      setTimeout(onComplete, 900);
    } else {
      sounds.playError();
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/95 border border-slate-800 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl">
      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
        <Disc className="w-4 h-4 animate-spin" />
        <span>LAYER 02 // CHRONO DIAL MECHANISM</span>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        Align all concentric rings to the Top Meridian (0°) to unlock the vault gears.
      </p>

      {/* Target Marker */}
      <div className="w-3 h-5 bg-cyan-400 rounded-sm mb-1.5 shadow-lg shadow-cyan-400/50 animate-pulse" />

      {/* Concentric Circles Visual */}
      <div className="relative w-64 h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-full mb-6 bg-black/40">
        {/* Outer Ring */}
        <div
          onClick={() => rotateRing(0)}
          style={{ transform: `rotate(${angles[0]}deg)` }}
          className="absolute w-60 h-60 rounded-full border-4 border-cyan-500/40 cursor-pointer hover:border-cyan-400 transition-transform duration-300 flex items-start justify-center p-1"
          title="Click to rotate outer ring"
        >
          <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400" />
        </div>

        {/* Middle Ring */}
        <div
          onClick={() => rotateRing(1)}
          style={{ transform: `rotate(${angles[1]}deg)` }}
          className="absolute w-44 h-44 rounded-full border-4 border-fuchsia-500/40 cursor-pointer hover:border-fuchsia-400 transition-transform duration-300 flex items-start justify-center p-1"
          title="Click to rotate middle ring"
        >
          <div className="w-3.5 h-3.5 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-400" />
        </div>

        {/* Inner Ring */}
        <div
          onClick={() => rotateRing(2)}
          style={{ transform: `rotate(${angles[2]}deg)` }}
          className="absolute w-28 h-28 rounded-full border-4 border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition-transform duration-300 flex items-start justify-center p-1"
          title="Click to rotate inner ring"
        >
          <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400" />
        </div>

        {/* Center Pivot */}
        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
          <span className="text-[10px] font-mono text-slate-400 font-bold">CORE</span>
        </div>
      </div>

      {/* Interactive Controls & Degree Readout */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        <button
          onClick={() => rotateRing(0)}
          className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-400/50 rounded-xl text-xs transition cursor-pointer flex flex-col items-center"
        >
          <span className="text-slate-400 text-[10px]">Outer Dial</span>
          <span className="text-cyan-400 font-bold font-mono">{angles[0]}°</span>
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> +30°
          </span>
        </button>

        <button
          onClick={() => rotateRing(1)}
          className="p-2.5 bg-slate-950 border border-slate-800 hover:border-fuchsia-400/50 rounded-xl text-xs transition cursor-pointer flex flex-col items-center"
        >
          <span className="text-slate-400 text-[10px]">Middle Dial</span>
          <span className="text-fuchsia-400 font-bold font-mono">{angles[1]}°</span>
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> +30°
          </span>
        </button>

        <button
          onClick={() => rotateRing(2)}
          className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-400/50 rounded-xl text-xs transition cursor-pointer flex flex-col items-center"
        >
          <span className="text-slate-400 text-[10px]">Inner Dial</span>
          <span className="text-emerald-400 font-bold font-mono">{angles[2]}°</span>
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> +30°
          </span>
        </button>
      </div>

      <button
        onClick={handleVerify}
        disabled={!isSolved || isLocked}
        className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
          isSolved
            ? "bg-emerald-400 hover:bg-emerald-300 text-black shadow-lg shadow-emerald-400/30 cursor-pointer"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{isLocked ? "LOCK ENGAGED..." : isSolved ? "ENGAGE CHRONO LOCK" : "AWAITING 0° ALIGNMENT"}</span>
      </button>
    </div>
  );
}
