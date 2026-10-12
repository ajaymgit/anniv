import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, KeyRound, Delete, Heart, Lightbulb, ArrowRight, HelpCircle } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

// Default photos for the 4 hanging Polaroids from user's lightchamber folder
const DEFAULT_POLAROID_PHOTOS = [
  "/lightchamber/polaroid1.jpg",
  "/lightchamber/polaroid2.jpg",
  "/lightchamber/polaroid3.jpg",
  "/lightchamber/polaroid4.jpg"
];

export default function FlashlightArchive({ onComplete, customCode = "1210", customPhotos }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 260, y: 200 });
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SUCCESS, ERROR
  const [isLanternBoosted, setIsLanternBoosted] = useState(false);

  const targetCode = (customCode || "1210").trim();
  const digits = targetCode.padEnd(4, "0").split("");
  const photos = customPhotos && customPhotos.length >= 4 ? customPhotos : DEFAULT_POLAROID_PHOTOS;

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
            particleCount: 100,
            spread: 80,
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
            particleCount: 100,
            spread: 80,
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
    // Also input this digit if not full
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
          Move your warm fairy lantern beam across the dark room to reveal 4 hanging Polaroids marked with Roman numerals [I, II, III, IV] ♡
        </p>
      </div>

      {/* Interactive Fairy-Light Spotlight Room */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[420px] bg-gradient-to-b from-[#0c1f17] via-[#07130e] to-[#030805] rounded-[32px] border-2 border-emerald-200/90 overflow-hidden cursor-crosshair mb-5 shadow-card select-none touch-none"
        style={{ minHeight: "380px" }}
      >
        {/* Fairy Light Strings across the ceiling */}
        <div className="absolute top-6 left-0 right-0 h-1 border-t-2 border-dashed border-amber-200/50 flex justify-between px-6 pointer-events-none z-10">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="relative -translate-y-2 flex flex-col items-center"
            >
              <div className="w-0.5 h-2 bg-amber-400/60" />
              <div
                className="w-3 h-3 rounded-full bg-amber-200 shadow-lg shadow-amber-300 animate-pulse"
                style={{
                  animationDuration: `${1.8 + (i % 3) * 0.4}s`,
                  animationDelay: `${i * 150}ms`
                }}
              />
            </div>
          ))}
        </div>

        {/* Ambient floating fairy sparkles in the room */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/70 blur-[0.5px] animate-pulse"
              style={{
                top: `${(i * 23) % 85 + 8}%`,
                left: `${(i * 31) % 90 + 5}%`,
                animationDelay: `${i * 300}ms`,
                animationDuration: `${2 + (i % 4)}s`
              }}
            />
          ))}
        </div>

        {/* 4 Hanging Polaroids with Clothespins & Roman Numeral Clues */}
        {/* Polaroid 1: [I] = digits[0] */}
        <div
          onClick={() => handlePolaroidClick(0, 80, 110)}
          className="absolute top-12 left-5 sm:left-9 w-28 bg-[#fffdfa] border border-amber-200/80 rounded-xl p-2 shadow-2xl rotate-[-6deg] transition-transform hover:scale-105 cursor-pointer z-10"
        >
          {/* Wooden Clothespin */}
          <div className="w-3.5 h-4 bg-amber-400/90 rounded-xs mx-auto -mt-4 mb-1 shadow-sm" />
          <div className="w-full h-20 rounded-lg overflow-hidden bg-emerald-950 mb-1.5 border border-emerald-900/40">
            <img
              src={photos[0]}
              alt="Clue 1"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center font-bold text-xs text-emerald-800 font-serif tracking-wider bg-emerald-50/80 py-0.5 rounded-md border border-emerald-200/60">
            [I] = {digits[0]}
          </div>
        </div>

        {/* Polaroid 2: [II] = digits[1] */}
        <div
          onClick={() => handlePolaroidClick(1, 190, 290)}
          className="absolute bottom-8 left-32 sm:left-44 w-28 bg-[#fffdfa] border border-amber-200/80 rounded-xl p-2 shadow-2xl rotate-[4deg] transition-transform hover:scale-105 cursor-pointer z-10"
        >
          <div className="w-3.5 h-4 bg-amber-400/90 rounded-xs mx-auto -mt-4 mb-1 shadow-sm" />
          <div className="w-full h-20 rounded-lg overflow-hidden bg-emerald-950 mb-1.5 border border-emerald-900/40">
            <img
              src={photos[1]}
              alt="Clue 2"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center font-bold text-xs text-rose-800 font-serif tracking-wider bg-rose-50/80 py-0.5 rounded-md border border-rose-200/60">
            [II] = {digits[1]}
          </div>
        </div>

        {/* Polaroid 3: [III] = digits[2] */}
        <div
          onClick={() => handlePolaroidClick(2, 330, 120)}
          className="absolute top-14 right-28 sm:right-40 w-28 bg-[#fffdfa] border border-amber-200/80 rounded-xl p-2 shadow-2xl rotate-[-3deg] transition-transform hover:scale-105 cursor-pointer z-10"
        >
          <div className="w-3.5 h-4 bg-amber-400/90 rounded-xs mx-auto -mt-4 mb-1 shadow-sm" />
          <div className="w-full h-20 rounded-lg overflow-hidden bg-emerald-950 mb-1.5 border border-emerald-900/40">
            <img
              src={photos[2]}
              alt="Clue 3"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center font-bold text-xs text-purple-800 font-serif tracking-wider bg-purple-50/80 py-0.5 rounded-md border border-purple-200/60">
            [III] = {digits[2]}
          </div>
        </div>

        {/* Polaroid 4: [IV] = digits[3] */}
        <div
          onClick={() => handlePolaroidClick(3, 440, 290)}
          className="absolute bottom-10 right-4 sm:right-9 w-28 bg-[#fffdfa] border border-amber-200/80 rounded-xl p-2 shadow-2xl rotate-[5deg] transition-transform hover:scale-105 cursor-pointer z-10"
        >
          <div className="w-3.5 h-4 bg-amber-400/90 rounded-xs mx-auto -mt-4 mb-1 shadow-sm" />
          <div className="w-full h-20 rounded-lg overflow-hidden bg-emerald-950 mb-1.5 border border-emerald-900/40">
            <img
              src={photos[3]}
              alt="Clue 4"
              onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center font-bold text-xs text-amber-900 font-serif tracking-wider bg-amber-50/80 py-0.5 rounded-md border border-amber-200/60">
            [IV] = {digits[3]}
          </div>
        </div>

        {/* Warm Golden Fairy-Lantern Spotlight Beam Mask */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: isLanternBoosted
              ? "radial-gradient(circle 500px at 50% 50%, rgba(254, 240, 138, 0.16) 0%, rgba(6, 18, 12, 0.45) 100%)"
              : `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, rgba(254, 240, 138, 0.22) 0%, rgba(254, 240, 138, 0.08) 55%, rgba(6, 15, 10, 0.88) 120px, rgba(3, 8, 5, 0.97) 160px)`
          }}
        />

        {/* Floating Fairy Lantern Glow at Cursor */}
        {!isLanternBoosted && (
          <div
            className="absolute pointer-events-none z-25 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div className="w-20 h-20 rounded-full bg-amber-300/25 blur-xl animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-md animate-pulse" />
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
          <span>{isLanternBoosted ? "Dim Room" : "Light Up Chamber"}</span>
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
