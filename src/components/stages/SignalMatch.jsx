import React, { useState, useEffect, useRef } from "react";
import { Activity, Radio, CheckCircle2 } from "lucide-react";
import { sounds } from "../../utils/audio";

export default function SignalMatch({ onComplete }) {
  const canvasRef = useRef(null);

  // Target Parameters
  const target = { amp: 40, freq: 0.05, phase: 1.5 };

  // User Parameters
  const [amp, setAmp] = useState(20);
  const [freq, setFreq] = useState(0.02);
  const [phase, setPhase] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Calculate similarity error
  const ampErr = Math.abs(amp - target.amp) / 40;
  const freqErr = Math.abs(freq - target.freq) / 0.05;
  const phaseErr = Math.abs(phase - target.phase) / Math.PI;
  const totalMatch = Math.max(0, Math.round((1 - (ampErr + freqErr + phaseErr) / 3) * 100));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const h = canvas.height / 2;

      // Subtle background grid lines
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Target Wave (Cyan dashed)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x++) {
        const y = h + target.amp * Math.sin(x * target.freq + target.phase + t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // User Wave (Rose when not matched, Emerald when locked)
      ctx.beginPath();
      ctx.strokeStyle = totalMatch >= 95 ? "#10b981" : "#f43f5e";
      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x++) {
        const y = h + amp * Math.sin(x * freq + phase + t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      t += 0.035;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [amp, freq, phase, totalMatch]);

  useEffect(() => {
    if (totalMatch >= 95 && !hasCompleted) {
      setHasCompleted(true);
      sounds.playSuccess();
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [totalMatch, hasCompleted, onComplete]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>LAYER 03 // FREQUENCY HARMONIZER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">TARGET OVERLAP:</span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            totalMatch >= 95
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}>
            {totalMatch}%
          </span>
        </div>
      </div>

      <div className="relative mb-6">
        <canvas ref={canvasRef} width={500} height={180} className="w-full bg-slate-950 rounded-xl border border-slate-800" />
        <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400/60 bg-black/60 px-2 py-1 rounded">
          CYAN: TARGET // {totalMatch >= 95 ? "EMERALD: SYNCED" : "ROSE: HARMONIZE"}
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-slate-400 mb-1.5 font-mono text-[11px]">
            <span>AMPLITUDE (WAVE HEIGHT)</span>
            <span className="text-cyan-400 font-bold">{amp}</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="1"
            value={amp}
            onChange={(e) => {
              sounds.playClick();
              setAmp(Number(e.target.value));
            }}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-slate-400 mb-1.5 font-mono text-[11px]">
            <span>FREQUENCY (CYCLE DENSITY)</span>
            <span className="text-fuchsia-400 font-bold">{freq.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.08"
            step="0.005"
            value={freq}
            onChange={(e) => {
              sounds.playClick();
              setFreq(Number(e.target.value));
            }}
            className="w-full accent-fuchsia-400 cursor-pointer"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-slate-400 mb-1.5 font-mono text-[11px]">
            <span>PHASE SHIFT (HORIZONTAL ALIGN)</span>
            <span className="text-emerald-400 font-bold">{phase.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3.14"
            step="0.1"
            value={phase}
            onChange={(e) => {
              sounds.playClick();
              setPhase(Number(e.target.value));
            }}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
