import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Play, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { RibbonBow, FlowerBlossom } from "../../components/common/GirlyPopDecorations";

const BUBBLE_TIERS = [
  { level: 1, name: "Seed", r: 18, color: "#10b981", icon: "🌱" },
  { level: 2, name: "Sprout", r: 24, color: "#34d399", icon: "🌿" },
  { level: 3, name: "Bud", r: 30, color: "#6ee7b7", icon: "🌷" },
  { level: 4, name: "Half Bloom", r: 38, color: "#a7f3d0", icon: "🌸" },
  { level: 5, name: "Full Blossom", r: 48, color: "#fef08a", icon: "✨" }
];

export default function DemoBubbleMerge({ playChime }) {
  const canvasRef = useRef(null);
  const [nextTier, setNextTier] = useState(1);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [aimX, setAimX] = useState(0.5);

  const bubblesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    let animId;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, w, h);

      // Soft container background
      ctx.fillStyle = "#f4f9f6";
      ctx.fillRect(0, 0, w, h);

      // Floor line
      ctx.strokeStyle = "#86efac";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, h - 20);
      ctx.lineTo(w - 20, h - 20);
      ctx.stroke();

      const bubbles = bubblesRef.current;

      // Physics: Gravity & Floor/Wall bounds
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.vy += 0.25; // gravity
        b.vx *= 0.98; // drag
        b.x += b.vx;
        b.y += b.vy;

        // Floor collision
        if (b.y > h - 20 - b.r) {
          b.y = h - 20 - b.r;
          b.vy = -b.vy * 0.35;
        }

        // Left / Right wall collisions
        if (b.x < b.r + 20) {
          b.x = b.r + 20;
          b.vx = -b.vx * 0.5;
        } else if (b.x > w - b.r - 20) {
          b.x = w - b.r - 20;
          b.vx = -b.vx * 0.5;
        }
      }

      // Bubble vs Bubble collision & Merge
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const b1 = bubbles[i];
          const b2 = bubbles[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < b1.r + b2.r && dist > 0) {
            // Check if same tier -> Merge!
            if (b1.level === b2.level && b1.level < 5) {
              const newLevel = b1.level + 1;
              const tierInfo = BUBBLE_TIERS.find((t) => t.level === newLevel);
              const midX = (b1.x + b2.x) / 2;
              const midY = (b1.y + b2.y) / 2;

              // Replace b1 with upgraded bubble and remove b2
              b1.level = newLevel;
              b1.r = tierInfo.r;
              b1.color = tierInfo.color;
              b1.icon = tierInfo.icon;
              b1.x = midX;
              b1.y = midY;
              b1.vy = -2;

              bubbles.splice(j, 1);
              setScore((s) => s + newLevel * 25);
              if (playChime) playChime(400 + newLevel * 90, 0.5);

              // Check if reached top tier (Level 5 Full Blossom)
              if (newLevel === 5) {
                setSuccess(true);
                if (playChime) playChime(880, 0.9);
                confetti({
                  particleCount: 60,
                  spread: 80,
                  origin: { y: 0.6 }
                });
              }
              break;
            }

            // Normal elastic collision push
            const overlap = b1.r + b2.r - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Dampen velocities
            b1.vx -= nx * 0.1;
            b1.vy -= ny * 0.1;
            b2.vx += nx * 0.1;
            b2.vy += ny * 0.1;
          }
        }
      }

      // Render Bubbles
      bubbles.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.strokeStyle = "#132e22";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.font = `${Math.floor(b.r * 0.9)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.icon, b.x, b.y + 1);
      });

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animId);
  }, [playChime]);

  const dropBubble = () => {
    if (success) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tierInfo = BUBBLE_TIERS.find((t) => t.level === nextTier);
    bubblesRef.current.push({
      x: aimX * canvas.width,
      y: 40,
      vx: 0,
      vy: 1,
      level: nextTier,
      r: tierInfo.r,
      color: tierInfo.color,
      icon: tierInfo.icon
    });

    // Randomize next tier (mostly level 1 and 2)
    setNextTier(Math.random() < 0.65 ? 1 : 2);
    if (playChime) playChime(380, 0.3);
  };

  const resetMerge = () => {
    bubblesRef.current = [];
    setScore(0);
    setSuccess(false);
    setNextTier(1);
    if (playChime) playChime(330, 0.3);
  };

  const upcomingTier = BUBBLE_TIERS.find((t) => t.level === nextTier);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-[#f7faf8] text-[#132e22]">
      {/* Top HUD */}
      <div className="z-10 mt-3 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between gap-3 max-w-md w-full text-xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-500" />
          <span className="font-serif font-bold text-sm">Blossom Merge</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-sans">
          <span>Next: <strong>{upcomingTier.icon} {upcomingTier.name}</strong></span>
          <span>Score: <strong>{score}</strong></span>
        </div>
        <button
          onClick={resetMerge}
          className="p-1 rounded-full hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Aim & Drop Controls Overlay at Top */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-sans text-emerald-800">Aim:</span>
          <input
            type="range"
            min="0.15"
            max="0.85"
            step="0.01"
            value={aimX}
            onChange={(e) => setAimX(parseFloat(e.target.value))}
            className="w-28 sm:w-36 accent-emerald-600 cursor-pointer"
          />
          <button
            onClick={dropBubble}
            disabled={success}
            className="px-3.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-sans text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Drop</span>
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL: The Effect Comes Up */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border-2 border-emerald-300 p-6 sm:p-7 rounded-[32px] shadow-2xl max-w-md w-full text-center relative">
              <div className="flex justify-center mb-2">
                <RibbonBow className="w-8 h-7 text-emerald-500" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                Full Blossom Reached ✨
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-2">
                The Cumulative Evolution
              </h3>

              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans mb-4">
                "Small habits, quiet laughs, and daily perspectives quietly merged together over seven years. You didn't change me all at once; your presence compounded gently until I blossomed into someone completely new."
              </p>

              <button
                onClick={resetMerge}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Merge Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
