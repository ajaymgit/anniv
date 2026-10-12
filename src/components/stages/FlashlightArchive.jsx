import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Delete, Lightbulb, ArrowRight, HelpCircle, X } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

// Default 4 photos from the lightchamber folder (cache-busted with version query)
const CHAMBER_PHOTOS = [
  "/lightchamber/polaroid1.jpg?v=3",
  "/lightchamber/polaroid2.jpg?v=3",
  "/lightchamber/polaroid3.jpg?v=3",
  "/lightchamber/polaroid4.jpg?v=3"
];

const ROMAN_NUMERALS = ["[I]", "[II]", "[III]", "[IV]"];
const POLAROID_LOCATIONS = [
  "Upper-Left Room Corner",
  "Lower-Left Scrapbook Wall",
  "Upper-Right Ceiling Corner",
  "Lower-Right Cozy Floor"
];

export default function FlashlightArchive({ onComplete, customCode = "1210", customPhotos }) {
  const [pos, setPos] = useState({ x: 300, y: 300 });
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SUCCESS, ERROR
  const [isLanternBoosted, setIsLanternBoosted] = useState(false);
  const [activePreview, setActivePreview] = useState(null); // index of inspected polaroid

  const targetCode = (customCode || "1210").trim();
  const digits = targetCode.padEnd(4, "0").split("");
  const photos = customPhotos && customPhotos.length >= 4 ? customPhotos : CHAMBER_PHOTOS;

  // Initialize lantern near center of window
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPos({ x: window.innerWidth / 2, y: Math.min(360, window.innerHeight / 2) });
    }
  }, []);

  // Track pointer across the entire page so the whole page is the room
  useEffect(() => {
    const handlePointerMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

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
        if (activePreview !== null) {
          setActivePreview(null);
        } else {
          handleClear();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, status, targetCode, activePreview]);

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

  const handlePolaroidClick = (idx) => {
    sounds.playClick();
    setActivePreview(idx);
    // Input this digit into the keypad
    if (code.length < 4) {
      handleKeypad(digits[idx]);
    }
  };

  return (
    <div className="w-full max-w-5xl min-h-[740px] sm:min-h-[800px] flex flex-col items-center justify-center font-sans select-none text-[#132e22] relative px-4 py-8">
      {/* ============================================================== */}
      {/* CEILING FAIRY LIGHTS STRING ACROSS TOP OF THE ROOM            */}
      {/* ============================================================== */}
      <div className="absolute top-2 left-0 right-0 h-1 border-t-2 border-dashed border-amber-300/40 flex justify-between px-8 pointer-events-none z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="relative -translate-y-2 flex flex-col items-center opacity-85"
          >
            <div className="w-0.5 h-2 bg-amber-400/40" />
            <div
              className="w-2.5 h-2.5 rounded-full bg-amber-200/90 shadow-md shadow-amber-300/40 animate-pulse"
              style={{
                animationDuration: `${2.2 + (i % 3) * 0.5}s`,
                animationDelay: `${i * 180}ms`
              }}
            />
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 4 POLAROIDS SPREAD AROUND THE ENTIRE ROOM CANVAS               */}
      {/* ============================================================== */}

      {/* Polaroid 1: Upper-Left of the Room (Clue [I]) */}
      <div
        onClick={() => handlePolaroidClick(0)}
        className="absolute top-6 sm:top-12 left-2 sm:left-8 md:left-14 lg:left-18 w-20 sm:w-24 md:w-28 bg-[#fffdfa] border-2 border-amber-200/90 rounded-xl p-1.5 sm:p-2 shadow-xl rotate-[-9deg] transition-all hover:scale-125 cursor-pointer z-20 group"
        title="Click to inspect Polaroid I"
      >
        <div className="w-3 h-3 bg-amber-400 rounded-xs mx-auto -mt-3.5 mb-1 shadow-xs" />
        <div className="w-full h-16 sm:h-20 md:h-24 rounded-sm overflow-hidden bg-black mb-1 border border-black/15">
          <img
            src={photos[0]}
            alt="Polaroid 1"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="text-center font-bold text-[10px] sm:text-xs text-emerald-800 font-serif leading-none tracking-tight py-1 bg-emerald-50 rounded-sm border border-emerald-100/70">
          [I] = {digits[0]}
        </div>
      </div>

      {/* Polaroid 2: Lower-Left of the Room (Clue [II]) */}
      <div
        onClick={() => handlePolaroidClick(1)}
        className="absolute bottom-8 sm:bottom-16 left-3 sm:left-10 md:left-16 lg:left-20 w-20 sm:w-24 md:w-28 bg-[#fffdfa] border-2 border-amber-200/90 rounded-xl p-1.5 sm:p-2 shadow-xl rotate-[8deg] transition-all hover:scale-125 cursor-pointer z-20 group"
        title="Click to inspect Polaroid II"
      >
        <div className="w-3 h-3 bg-amber-400 rounded-xs mx-auto -mt-3.5 mb-1 shadow-xs" />
        <div className="w-full h-16 sm:h-20 md:h-24 rounded-sm overflow-hidden bg-black mb-1 border border-black/15">
          <img
            src={photos[1]}
            alt="Polaroid 2"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="text-center font-bold text-[10px] sm:text-xs text-rose-800 font-serif leading-none tracking-tight py-1 bg-rose-50 rounded-sm border border-rose-100/70">
          [II] = {digits[1]}
        </div>
      </div>

      {/* Polaroid 3: Upper-Right of the Room (Clue [III]) */}
      <div
        onClick={() => handlePolaroidClick(2)}
        className="absolute top-8 sm:top-14 right-2 sm:right-8 md:right-14 lg:right-18 w-20 sm:w-24 md:w-28 bg-[#fffdfa] border-2 border-amber-200/90 rounded-xl p-1.5 sm:p-2 shadow-xl rotate-[-8deg] transition-all hover:scale-125 cursor-pointer z-20 group"
        title="Click to inspect Polaroid III"
      >
        <div className="w-3 h-3 bg-amber-400 rounded-xs mx-auto -mt-3.5 mb-1 shadow-xs" />
        <div className="w-full h-16 sm:h-20 md:h-24 rounded-sm overflow-hidden bg-black mb-1 border border-black/15">
          <img
            src={photos[2]}
            alt="Polaroid 3"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="text-center font-bold text-[10px] sm:text-xs text-purple-800 font-serif leading-none tracking-tight py-1 bg-purple-50 rounded-sm border border-purple-100/70">
          [III] = {digits[2]}
        </div>
      </div>

      {/* Polaroid 4: Lower-Right of the Room (Clue [IV]) */}
      <div
        onClick={() => handlePolaroidClick(3)}
        className="absolute bottom-10 sm:bottom-18 right-3 sm:right-10 md:right-16 lg:right-20 w-20 sm:w-24 md:w-28 bg-[#fffdfa] border-2 border-amber-200/90 rounded-xl p-1.5 sm:p-2 shadow-xl rotate-[9deg] transition-all hover:scale-125 cursor-pointer z-20 group"
        title="Click to inspect Polaroid IV"
      >
        <div className="w-3 h-3 bg-amber-400 rounded-xs mx-auto -mt-3.5 mb-1 shadow-xs" />
        <div className="w-full h-16 sm:h-20 md:h-24 rounded-sm overflow-hidden bg-black mb-1 border border-black/15">
          <img
            src={photos[3]}
            alt="Polaroid 4"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="text-center font-bold text-[10px] sm:text-xs text-amber-900 font-serif leading-none tracking-tight py-1 bg-amber-50 rounded-sm border border-amber-100/70">
          [IV] = {digits[3]}
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULL-PAGE DARK ROOM SHADOW MASK OVERLAY                        */}
      {/* Covers the entire screen: pitch-black outside the circular beam */}
      {/* ============================================================== */}
      <div
        className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
        style={{
          background: isLanternBoosted
            ? "radial-gradient(circle 800px at 50% 50%, rgba(254, 240, 138, 0.18) 0%, rgba(0, 0, 0, 0.45) 100%)"
            : `radial-gradient(circle 150px at ${pos.x}px ${pos.y}px, rgba(254, 240, 138, 0.28) 0%, rgba(254, 240, 138, 0.08) 60px, rgba(0, 0, 0, 0.95) 130px, rgba(0, 0, 0, 0.998) 165px)`
        }}
      />

      {/* Glowing Fairy Lantern Halo following pointer anywhere */}
      {!isLanternBoosted && (
        <div
          className="fixed pointer-events-none z-35 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        >
          <div className="w-20 h-20 rounded-full bg-amber-300/35 blur-xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-md" />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CENTER ROOM CONTENT (Original pastel scrapbook aesthetic)       */}
      {/* ============================================================== */}

      {/* Header Info */}
      <div className="text-center mb-5 relative z-10">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-9 h-7 text-emerald-400 drop-shadow-sm" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 04 ♡ The Lantern Room</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          The Fairy-Light Chamber
        </h2>
        <p className="text-xs sm:text-sm text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          The entire page is the dark room! Sweep your fairy lantern across the room to hunt down the 4 Polaroids spread across the shadows ♡
        </p>
      </div>

      {/* Helper Controls: Light Boost & Instructions */}
      <div className="flex items-center justify-between w-full max-w-sm mb-5 px-2 relative z-10">
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
      <div className="bg-white border-2 border-[#bbf7d0] rounded-[32px] p-5 sm:p-6 flex flex-col items-center shadow-card w-full max-w-xs relative z-10">
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

      {/* Polaroid Inspection Lightbox Modal */}
      {activePreview !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#fffdfa] border-2 border-amber-200 rounded-[28px] p-5 sm:p-6 max-w-sm w-full shadow-2xl flex flex-col items-center relative text-[#132e22]">
            <button
              type="button"
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-2.5 h-3 bg-amber-400 rounded-xs mx-auto -mt-3 mb-2 shadow-xs" />

            <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-black mb-3 border border-black/20 shadow-md">
              <img
                src={photos[activePreview]}
                alt={`Inspected Polaroid ${activePreview + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold font-serif">
                <span>{ROMAN_NUMERALS[activePreview]} = {digits[activePreview]}</span>
              </div>
              <p className="text-[11px] text-[#3d6350]">
                Location: {POLAROID_LOCATIONS[activePreview]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePreview(null)}
              className="mt-4 px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              Close & Keep Exploring ♡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
