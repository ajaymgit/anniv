import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles, CheckCircle2, Trophy, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { RibbonBow, FlowerBlossom } from "../../components/common/GirlyPopDecorations";

const STONES = [
  { id: 1, name: "Foundation Stone", width: 140, height: 42, color: "#1e3a2f", label: "River Jade", weight: "Heavy" },
  { id: 2, name: "Balance Pebble", width: 110, height: 38, color: "#3d6350", label: "Moss Slate", weight: "Medium" },
  { id: 3, name: "Stillness Rock", width: 85, height: 34, color: "#52796f", label: "Sage Marble", weight: "Light" },
  { id: 4, name: "Crown Gem", width: 60, height: 30, color: "#84a98c", label: "Golden Quartz", weight: "Delicate" }
];

export default function DemoStoneStacker({ playChime }) {
  // Stacking state: array of stone IDs in the stack from bottom to top
  const [stacked, setStacked] = useState([]);
  const [success, setSuccess] = useState(false);
  const [holdingTimer, setHoldingTimer] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [wobble, setWobble] = useState(false);

  // Remaining unstacked stones
  const availableStones = STONES.filter((s) => !stacked.includes(s.id));

  const addStoneToStack = (stoneId) => {
    if (success) return;

    // Check if valid balance placement:
    // If placing on top, can't place a stone that is much wider than the top stone by more than 40px
    if (stacked.length > 0) {
      const topStone = STONES.find((s) => s.id === stacked[stacked.length - 1]);
      const newStone = STONES.find((s) => s.id === stoneId);

      if (newStone.width > topStone.width + 30) {
        // Wobble and fail to balance
        setWobble(true);
        if (playChime) playChime(220, 0.4);
        setTimeout(() => setWobble(false), 600);
        return;
      }
    }

    const nextStack = [...stacked, stoneId];
    setStacked(nextStack);
    if (playChime) playChime(350 + nextStack.length * 90, 0.4);

    // If all stones stacked, start balance check countdown
    if (nextStack.length === STONES.length) {
      setCountdown(3);
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (playChime) playChime(500 + (3 - count) * 80, 0.5);

        if (count <= 0) {
          clearInterval(interval);
          setSuccess(true);
          setCountdown(null);
          if (playChime) playChime(880, 0.8);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#34d399", "#a7f3d0", "#fef08a", "#86efac"]
          });
        }
      }, 700);
      setHoldingTimer(interval);
    }
  };

  const resetStack = () => {
    if (holdingTimer) clearInterval(holdingTimer);
    setStacked([]);
    setSuccess(false);
    setCountdown(null);
    setWobble(false);
    if (playChime) playChime(300, 0.3);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-gradient-to-b from-[#f7faf8] to-[#edf7f2] p-4 text-[#132e22]">
      {/* Top Instructions */}
      <div className="z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between gap-3 max-w-md w-full text-xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-500" />
          <span className="font-serif font-bold text-sm">Zen Stone Stacker</span>
        </div>
        <span className="text-[11px] text-[#3d6350]">Tap stones to balance the cairn</span>
        <button
          onClick={resetStack}
          className="p-1 rounded-full hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Play Area */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-end pb-8 overflow-hidden">
        {/* Cairn Stack Column */}
        <div className="relative flex flex-col-reverse items-center justify-end z-10">
          {/* Pedestal Base */}
          <div className="w-48 h-10 rounded-t-3xl bg-gradient-to-b from-[#2d4d3d] to-[#132e22] border-t-2 border-emerald-400/40 shadow-lg flex items-center justify-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-200/80">
              Balancing Altar
            </span>
          </div>

          {/* Stacked Stones */}
          <AnimatePresence>
            {stacked.map((id, index) => {
              const stone = STONES.find((s) => s.id === id);
              return (
                <motion.div
                  key={id}
                  initial={{ y: -60, opacity: 0, scale: 0.9 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    x: wobble && index === stacked.length - 1 ? [-6, 6, -4, 4, 0] : 0,
                    rotate: (index % 2 === 0 ? 1 : -1) * (index * 0.8)
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  style={{
                    width: `${stone.width}px`,
                    height: `${stone.height}px`,
                    backgroundColor: stone.color,
                    borderRadius: "24px 24px 20px 20px"
                  }}
                  className="shadow-md mb-1 border-t border-white/20 flex items-center justify-center cursor-pointer relative group"
                  onClick={() => {
                    // Click top stone to remove it
                    if (index === stacked.length - 1 && !success) {
                      setStacked(stacked.slice(0, -1));
                      if (playChime) playChime(280, 0.3);
                    }
                  }}
                >
                  <span className="text-[10px] text-white/90 font-serif font-bold tracking-wider">
                    {stone.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Wobble Warning Toast */}
        {wobble && (
          <div className="absolute top-16 bg-rose-100/90 border border-rose-300 px-3 py-1 rounded-full text-xs text-rose-800 font-sans shadow-xs animate-bounce">
            Too wide to balance! Place a smaller stone first.
          </div>
        )}

        {/* Balance Holding Countdown */}
        {countdown !== null && (
          <div className="absolute top-14 flex flex-col items-center">
            <span className="text-2xl font-bold font-serif text-emerald-700 animate-pulse">
              Holding balance... {countdown}
            </span>
          </div>
        )}
      </div>

      {/* Available Stones Shelf (Tapping sends to stack) */}
      <div className="z-10 w-full max-w-lg bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-around gap-2 mb-2">
        {availableStones.length === 0 && !success && (
          <span className="text-xs text-emerald-800 font-sans italic">
            Balancing complete! Checking stability...
          </span>
        )}
        {availableStones.map((stone) => (
          <button
            key={stone.id}
            onClick={() => addStoneToStack(stone.id)}
            disabled={success}
            className="p-2 rounded-xl bg-[#f0fdf4] hover:bg-emerald-100 border border-emerald-200 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div
              style={{
                width: `${stone.width * 0.4}px`,
                height: `${stone.height * 0.5}px`,
                backgroundColor: stone.color
              }}
              className="rounded-lg shadow-2xs"
            />
            <span className="text-[10px] font-sans font-bold text-[#132e22]">
              {stone.label}
            </span>
          </button>
        ))}
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
                Effect Unlocked ✨
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-2">
                Composure & Quiet Stillness
              </h3>

              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans mb-4">
                "Before spending years beside you, I reacted to every sudden breeze and panic. Watching how quietly and steadily you handle chaos taught me patience, stillness, and how to hold my ground with gentle composure."
              </p>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-emerald-100">
                <button
                  onClick={resetStack}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Stack Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
