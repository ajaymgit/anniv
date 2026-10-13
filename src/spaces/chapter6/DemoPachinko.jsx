import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Play, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { RibbonBow, FlowerBlossom } from "../../components/common/GirlyPopDecorations";

export default function DemoPachinko({ playChime }) {
  const canvasRef = useRef(null);
  const [dropsLeft, setDropsLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  const [aimX, setAimX] = useState(0.5);

  const ballsRef = useRef([]);
  const pegsRef = useRef([]);
  const cupsRef = useRef([]);
  const isSimulatingRef = useRef(false);

  // Initialize Peg Board Layout
  const initBoard = () => {
    const pegs = [];
    const rows = 6;
    for (let r = 0; r < rows; r++) {
      const cols = r % 2 === 0 ? 7 : 6;
      const xOffset = r % 2 === 0 ? 0.12 : 0.18;
      const xStep = (1 - xOffset * 2) / (cols - 1 || 1);
      const y = 0.22 + (r / (rows + 1)) * 0.45;

      for (let c = 0; c < cols; c++) {
        pegs.push({
          x: xOffset + c * xStep,
          y: y,
          r: 7,
          hitTime: 0
        });
      }
    }
    pegsRef.current = pegs;

    // Bottom Catch Cups: [Left: +10] [Center: Jackpot / Golden] [Right: +10]
    cupsRef.current = [
      { id: "left", x: 0.22, y: 0.88, w: 0.2, label: "+20", isJackpot: false },
      { id: "jackpot", x: 0.5, y: 0.88, w: 0.22, label: "Golden Goal ✨", isJackpot: true },
      { id: "right", x: 0.78, y: 0.88, w: 0.2, label: "+20", isJackpot: false }
    ];
  };

  useEffect(() => {
    initBoard();
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

      // Draw background board tint
      ctx.fillStyle = "#f4f9f6";
      ctx.fillRect(0, 0, w, h);

      // Draw Catch Cups
      cupsRef.current.forEach((cup) => {
        const cx = cup.x * w;
        const cy = cup.y * h;
        const cw = cup.w * w;
        const ch = 34;

        ctx.beginPath();
        ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, [12, 12, 6, 6]);
        ctx.fillStyle = cup.isJackpot ? "#fef08a" : "#dcfce7";
        ctx.strokeStyle = cup.isJackpot ? "#eab308" : "#86efac";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#132e22";
        ctx.font = cup.isJackpot ? "bold 12px serif" : "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cup.label, cx, cy);
      });

      // Draw Pegs
      const now = Date.now();
      pegsRef.current.forEach((peg) => {
        const px = peg.x * w;
        const py = peg.y * h;
        const hitDelta = now - peg.hitTime;
        const isBouncing = hitDelta < 250;

        ctx.beginPath();
        ctx.arc(px, py, isBouncing ? peg.r * 1.3 : peg.r, 0, Math.PI * 2);
        ctx.fillStyle = isBouncing ? "#34d399" : "#1e3a2f";
        ctx.fill();
        ctx.strokeStyle = "#86efac";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update & Draw Balls
      const balls = ballsRef.current;
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];

        // Physics: gravity + drag
        b.vy += 0.28;
        b.vx *= 0.99;
        b.x += b.vx;
        b.y += b.vy;

        // Wall collisions
        if (b.x < b.r) {
          b.x = b.r;
          b.vx = Math.abs(b.vx) * 0.7;
        } else if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx = -Math.abs(b.vx) * 0.7;
        }

        // Peg collisions
        pegsRef.current.forEach((peg) => {
          const px = peg.x * w;
          const py = peg.y * h;
          const dx = b.x - px;
          const dy = b.y - py;
          const dist = Math.hypot(dx, dy);

          if (dist < b.r + peg.r) {
            peg.hitTime = Date.now();
            const angle = Math.atan2(dy, dx);
            const speed = Math.hypot(b.vx, b.vy);
            b.vx = Math.cos(angle) * (speed * 0.75 + (Math.random() - 0.5) * 1.5);
            b.vy = Math.sin(angle) * (speed * 0.75) + 0.5;

            b.x = px + Math.cos(angle) * (b.r + peg.r + 1);
            b.y = py + Math.sin(angle) * (b.r + peg.r + 1);

            if (playChime) playChime(400 + Math.random() * 300, 0.25);
          }
        });

        // Draw Ball
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cup Collisions (Bottom)
        if (b.y >= h * 0.86) {
          cupsRef.current.forEach((cup) => {
            const cx = cup.x * w;
            const cw = cup.w * w;
            if (b.x >= cx - cw / 2 && b.x <= cx + cw / 2) {
              if (cup.isJackpot) {
                setScore((s) => s + 100);
                setSuccess(true);
                if (playChime) playChime(880, 0.9);
                confetti({
                  particleCount: 50,
                  spread: 80,
                  origin: { y: 0.6 }
                });
              } else {
                setScore((s) => s + 20);
                if (playChime) playChime(523, 0.4);
              }
            }
          });

          // Remove ball
          balls.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animId);
  }, [playChime]);

  const dropBall = () => {
    if (dropsLeft <= 0 || success) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDropsLeft((d) => d - 1);
    ballsRef.current.push({
      x: aimX * canvas.width,
      y: 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1,
      r: 9
    });

    if (playChime) playChime(440, 0.4);
  };

  const resetGame = () => {
    ballsRef.current = [];
    setDropsLeft(5);
    setScore(0);
    setSuccess(false);
    if (playChime) playChime(350, 0.3);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-[#f7faf8] text-[#132e22]">
      {/* Top HUD */}
      <div className="z-10 mt-3 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between gap-3 max-w-md w-full text-xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-500" />
          <span className="font-serif font-bold text-sm">Pachinko Bouncer</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-sans">
          <span>Pearls: <strong>{dropsLeft}</strong></span>
          <span>Score: <strong>{score}</strong></span>
        </div>
        <button
          onClick={resetGame}
          className="p-1 rounded-full hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Aim Slider & Drop Button Overlay at Top */}
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
            onClick={dropBall}
            disabled={dropsLeft <= 0 || success}
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
                Golden Jackpot Unlocked ✨
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-2">
                Spontaneous Joy & Wonder
              </h3>

              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans mb-4">
                "Before spending years beside you, my days were rigid itineraries and serious routines. You brought spontaneous laughs, curious detours, and taught me that the happiest moments are the ones we never planned."
              </p>

              <button
                onClick={resetGame}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
