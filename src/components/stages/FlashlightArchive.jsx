import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Delete, Lightbulb, ArrowRight, HelpCircle, Eye } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

// The 4 photos from the lightchamber folder
const CHAMBER_PHOTOS = [
  "/lightchamber/polaroid1.jpg",
  "/lightchamber/polaroid2.jpg",
  "/lightchamber/polaroid3.jpg",
  "/lightchamber/polaroid4.jpg"
];

export default function FlashlightArchive({ onComplete, customCode = "1210", customPhotos }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 180, y: 150 });
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SUCCESS, ERROR
  const [isLanternBoosted, setIsLanternBoosted] = useState(false);
  const [activePreview, setActivePreview] = useState(null); // index of inspected polaroid

  const targetCode = (customCode || "1210").trim();
  const digits = targetCode.padEnd(4, "0").split("");
  const photos = customPhotos && customPhotos.length >= 4 ? customPhotos : CHAMBER_PHOTOS;

  const updateCoordinates = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setPos({ x, y });
  };

  const handleMouseMove = (e) => {
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Keyboard support for 4-digit code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status === "SUCCESS") return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleKeypad(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, status, targetCode]);

  const handleKeypad = (digit) => {
    if (status === "SUCCESS") return;
    sounds.playCrystalTap(parseInt(digit, 10) % 8);

    setCode((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + digit;

      if (next.length === 4) {
        if (next === targetCode) {
          sounds.playSuccess();
          setStatus("SUCCESS");
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 },
            colors: ["#4ade80", "#86efac", "#a7f3d0", "#6ee7b7", "#fef08a", "#67e8f9"]
          });
          setTimeout(onComplete, 1600);
        } else {
          sounds.playError();
          setStatus("ERROR");
          setTimeout(() => {
            setCode("");
            setStatus("IDLE");
          }, 900);
        }
      }
      return next;
    });
  };

  const handleBackspace = () => {
    sounds.playClick();
    setCode((prev) => prev.slice(0, -1));
    if (status === "ERROR") setStatus("IDLE");
  };

  const handleClear = () => {
    sounds.playClick();
    setCode("");
    setStatus("IDLE");
  };

  const handlePeekCode = () => {
    sounds.playClick();
    setIsLanternBoosted(true);
    // Fill the next missing digit
    setCode((prev) => {
      if (prev.length < 4) {
        const nextChar = targetCode[prev.length];
        const nextCode = prev + nextChar;
        if (nextCode.length === 4 && nextCode === targetCode) {
          sounds.playSuccess();
          setStatus("SUCCESS");
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 },
            colors: ["#4ade80", "#86efac", "#a7f3d0", "#6ee7b7", "#fef08a", "#67e8f9"]
          });
          setTimeout(onComplete, 1600);
        }
        return nextCode;
      }
      return prev;
    });
  };

  const handlePolaroidClick = (idx, targetX, targetY) => {
    sounds.playClick();
    setPos({ x: targetX, y: targetY });
    setActivePreview(idx);
    // Input this digit into the keypad
    if (code.length < 4) {
      handleKeypad(digits[idx]);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl w-full font-sans select-none text-[#132e22] pb-6">
      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-9 h-7 text-emerald-400" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 04 ♡ The Lantern Room</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          The Fairy-Light Chamber
        </h2>
        <p className="text-xs sm:text-sm text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          The room is dark! Sweep your fairy lantern into the corners to hunt down 4 mini Polaroids hidden in the shadows ♡
        </p>
      </div>

      {/* Interactive Pitch-Dark Chamber */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[420px] sm:h-[460px] bg-black rounded-[32px] border-2 border-emerald-200/90 overflow-hidden mb-4 shadow-card select-none touch-none"
        style={{ minHeight: "400px" }}
      >
        {/* Subtle ceiling fairy lights string (dim, giving ambiance) */}
        <div className="absolute top-5 left-0 right-0 h-1 border-t-2 border-dashed border-amber-300/30 flex justify-between px-6 pointer-events-none z-10">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="relative -translate-y-2 flex flex-col items-center opacity-85"
            >
              <div className="w-0.5 h-1.5 bg-amber-400/40" />
              <div
                className="w-2.5 h-2.5 rounded-full bg-amber-200/90 shadow-md shadow-amber-300/40 animate-pulse"
                style={{
                  animationDuration: `${2.2 + (i % 3) * 0.5}s`,
                  animationDelay: `${i * 200}ms`
                }}
              />
            </div>
          ))}
        </div>

        {/* ============================================================== */}
        {/* 4 COMPACT MINI POLAROIDS HIDDEN IN SNEAKY CORNERS              */}
        {/* ============================================================== */}

        {/* Polaroid 1: Top-Left Corner (Clue [I]) */}
        <div
          onClick={() => handlePolaroidClick(0, 48, 70)}
          className="absolute top-7 left-4 sm:left-7 w-14 sm:w-16 bg-[#fffdfa] border border-amber-200/90 rounded-md p-1 shadow-lg rotate-[-8deg] transition-all hover:scale-130 hover:z-30 cursor-pointer z-10 group"
          title="Click to inspect Polaroid I"
        >
          <div className="w-2 h-2.5 bg-amber-400 rounded-xs mx-auto -mt-2.5 mb-0.5 shadow-xs" />
          <div className="w-full h-11 sm:h-13 rounded-xs overflow-hidden bg-black mb-1 border border-black/20">
            <img
              src={photos[0]}
              alt="Polaroid 1"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="text-center font-bold text-[9px] sm:text-[10px] text-emerald-800 font-serif leading-none tracking-tight py-0.5 bg-emerald-50 rounded-xs">
            [I] = {digits[0]}
          </div>
        </div>

        {/* Polaroid 2: Center-Left Lower Ground (Clue [II]) */}
        <div
          onClick={() => handlePolaroidClick(1, 130, 360)}
          className="absolute bottom-6 left-20 sm:left-28 w-14 sm:w-16 bg-[#fffdfa] border border-amber-200/90 rounded-md p-1 shadow-lg rotate-[7deg] transition-all hover:scale-130 hover:z-30 cursor-pointer z-10 group"
          title="Click to inspect Polaroid II"
        >
          <div className="w-2 h-2.5 bg-amber-400 rounded-xs mx-auto -mt-2.5 mb-0.5 shadow-xs" />
          <div className="w-full h-11 sm:h-13 rounded-xs overflow-hidden bg-black mb-1 border border-black/20">
            <img
              src={photos[1]}
              alt="Polaroid 2"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="text-center font-bold text-[9px] sm:text-[10px] text-rose-800 font-serif leading-none tracking-tight py-0.5 bg-rose-50 rounded-xs">
            [II] = {digits[1]}
          </div>
        </div>

        {/* Polaroid 3: High Upper Right Ceiling (Clue [III]) */}
        <div
          onClick={() => handlePolaroidClick(2, 380, 80)}
          className="absolute top-9 right-6 sm:right-12 w-14 sm:w-16 bg-[#fffdfa] border border-amber-200/90 rounded-md p-1 shadow-lg rotate-[-6deg] transition-all hover:scale-130 hover:z-30 cursor-pointer z-10 group"
          title="Click to inspect Polaroid III"
        >
          <div className="w-2 h-2.5 bg-amber-400 rounded-xs mx-auto -mt-2.5 mb-0.5 shadow-xs" />
          <div className="w-full h-11 sm:h-13 rounded-xs overflow-hidden bg-black mb-1 border border-black/20">
            <img
              src={photos[2]}
              alt="Polaroid 3"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="text-center font-bold text-[9px] sm:text-[10px] text-purple-800 font-serif leading-none tracking-tight py-0.5 bg-purple-50 rounded-xs">
            [III] = {digits[2]}
          </div>
        </div>

        {/* Polaroid 4: Far Bottom-Right Floor Corner (Clue [IV]) */}
        <div
          onClick={() => handlePolaroidClick(3, 440, 370)}
          className="absolute bottom-7 right-4 sm:right-8 w-14 sm:w-16 bg-[#fffdfa] border border-amber-200/90 rounded-md p-1 shadow-lg rotate-[8deg] transition-all hover:scale-130 hover:z-30 cursor-pointer z-10 group"
          title="Click to inspect Polaroid IV"
        >
          <div className="w-2 h-2.5 bg-amber-400 rounded-xs mx-auto -mt-2.5 mb-0.5 shadow-xs" />
          <div className="w-full h-11 sm:h-13 rounded-xs overflow-hidden bg-black mb-1 border border-black/20">
            <img
              src={photos[3]}
              alt="Polaroid 4"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="text-center font-bold text-[9px] sm:text-[10px] text-amber-900 font-serif leading-none tracking-tight py-0.5 bg-amber-50 rounded-xs">
            [IV] = {digits[3]}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PITCH-BLACK SHADOW MASK (Everything pitch-black outside beam)  */}
        {/* ============================================================== */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: isLanternBoosted
              ? "radial-gradient(circle 500px at 50% 50%, rgba(254, 240, 138, 0.18) 0%, rgba(0, 0, 0, 0.6) 100%)"
              : `radial-gradient(circle 95px at ${pos.x}px ${pos.y}px, rgba(254, 240, 138, 0.28) 0%, rgba(254, 240, 138, 0.08) 42%, rgba(0, 0, 0, 0.96) 82px, rgba(0, 0, 0, 0.998) 115px)`
          }}
        />

        {/* Glowing Fairy Lantern Halo Cursor following pointer */}
        {!isLanternBoosted && (
          <div
            className="absolute pointer-events-none z-25 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div className="w-16 h-16 rounded-full bg-amber-300/30 blur-lg animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 drop-shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Helper Controls: Light Boost & Instructions */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setIsLanternBoosted((prev) => !prev);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
            isLanternBoosted
              ? "bg-amber-100 text-amber-900 border border-amber-300"
              : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{isLanternBoosted ? "Restore Dark Room" : "Light Up Chamber"}</span>
        </button>

        <button
          type="button"
          onClick={handlePeekCode}
          className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Peek Digit</span>
        </button>
      </div>

      {/* Girly Pop Pastel Keypad Panel */}
      <div className="bg-white border-2 border-[#bbf7d0] rounded-[32px] p-5 sm:p-6 flex flex-col items-center shadow-card w-full max-w-xs relative">
        <div className="absolute -top-1.5 right-6 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <RibbonBow className="w-6 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-700 font-serif">Enter 4-Digit Chamber Code</span>
        </div>

        {/* Code Display */}
        <div
          className={`w-full border-2 rounded-2xl p-2.5 text-center font-serif text-xl tracking-[0.45em] mb-4 transition-all ${
            status === "SUCCESS"
              ? "border-emerald-300 text-emerald-700 bg-emerald-50 shadow-sm"
              : status === "ERROR"
              ? "border-rose-300 text-rose-700 bg-rose-50 animate-shake"
              : "border-emerald-200 text-[#132e22] bg-[#f0fdf4]"
          }`}
        >
          {status === "SUCCESS" ? "UNLOCKED ♡" : code.padEnd(4, "•")}
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-2 w-full font-serif font-bold">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleKeypad(String(n))}
              disabled={status === "SUCCESS"}
              className="h-11 bg-[#f0fdf4] hover:bg-emerald-100 text-[#132e22] hover:text-emerald-900 border border-emerald-200 rounded-2xl text-lg transition cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            disabled={status === "SUCCESS"}
            className="h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-sans font-bold transition cursor-pointer flex items-center justify-center active:scale-95 disabled:opacity-50 shadow-xs"
          >
            CLR
          </button>

          <button
            type="button"
            onClick={() => handleKeypad("0")}
            disabled={status === "SUCCESS"}
            className="h-11 bg-[#f0fdf4] hover:bg-emerald-100 text-[#132e22] hover:text-emerald-900 border border-emerald-200 rounded-2xl text-lg transition cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            disabled={status === "SUCCESS"}
            className="h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-sans font-bold transition cursor-pointer flex items-center justify-center active:scale-95 disabled:opacity-50 shadow-xs"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Completion Action Button */}
        {status === "SUCCESS" && (
          <div className="mt-4 pt-3 border-t border-emerald-200 w-full flex justify-center animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onComplete();
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-pop active:scale-95"
            >
              <span>Next Puzzle ♡</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
