import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Heart, Delete } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, PopFlower, FlowerBlossom, WashiTape, SparkleStar } from "../common/GirlyPopDecorations";

// Pastel Keycap Palettes (Macaron / Pastel Candy Palette)
const PASTEL_KEYS = [
  { digit: "1", bg: "bg-[#f0fdf4]", hoverBg: "hover:bg-[#dcfce7]", border: "border-[#bbf7d0]", text: "text-[#047857]", flower: "mint" },
  { digit: "2", bg: "bg-[#fefce8]", hoverBg: "hover:bg-[#fef9c3]", border: "border-[#fef08a]", text: "text-[#a16207]", flower: "buttercup" },
  { digit: "3", bg: "bg-[#f0fdf4]", hoverBg: "hover:bg-[#dcfce7]", border: "border-[#bbf7d0]", text: "text-[#15803d]", flower: "mint" },
  { digit: "4", bg: "bg-[#f0f9ff]", hoverBg: "hover:bg-[#e0f2fe]", border: "border-[#bae6fd]", text: "text-[#0369a1]", flower: "sky" },
  { digit: "5", bg: "bg-[#faf5ff]", hoverBg: "hover:bg-[#f3e8ff]", border: "border-[#e9d5ff]", text: "text-[#7e22ce]", flower: "lavender" },
  { digit: "6", bg: "bg-[#fff7ed]", hoverBg: "hover:bg-[#ffedd5]", border: "border-[#fed7aa]", text: "text-[#c2410c]", flower: "peach" },
  { digit: "7", bg: "bg-[#fff1f2]", hoverBg: "hover:bg-[#ffe4e6]", border: "border-[#fecdd3]", text: "text-[#be123c]", flower: "rose" },
  { digit: "8", bg: "bg-[#f0fdfa]", hoverBg: "hover:bg-[#ccfbf1]", border: "border-[#99f6e4]", text: "text-[#0f766e]", flower: "mint" },
  { digit: "9", bg: "bg-[#fdf4ff]", hoverBg: "hover:bg-[#fae8ff]", border: "border-[#f5d0fe]", text: "text-[#a21caf]", flower: "lavender" }
];

const SLOT_FLOWERS = ["mint", "buttercup", "mint", "sky", "lavender", "peach"];

export default function BootSequence({ onComplete, passcode = "220305" }) {
  const [inputCode, setInputCode] = useState("");
  const [status, setStatus] = useState("IDLE"); // IDLE, SUCCESS, ERROR
  const [showClue, setShowClue] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const targetPasscode = (passcode || "220305").trim();

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status === "SUCCESS") return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigitClick(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputCode, status, targetPasscode]);

  const handleScanClue = () => {
    sounds.playScan();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowClue(true);
      sounds.playSuccess();
    }, 450);
  };

  const handleDigitClick = (digit) => {
    const num = parseInt(digit, 10);
    sounds.playCrystalTap(isNaN(num) ? 0 : num);

    if (inputCode.length < 6) {
      const next = inputCode + digit;
      setInputCode(next);

      if (next.trim().toUpperCase() === targetPasscode.toUpperCase()) {
        triggerSuccess();
      } else if (next.length === targetPasscode.length) {
        triggerError();
      }
    }
  };

  const handleBackspace = () => {
    sounds.playClick();
    setInputCode((prev) => prev.slice(0, -1));
    if (status === "ERROR") setStatus("IDLE");
  };

  const handleClear = () => {
    sounds.playClick();
    setInputCode("");
    setStatus("IDLE");
  };

  const triggerSuccess = () => {
    sounds.playSuccess();
    setStatus("SUCCESS");
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  const triggerError = () => {
    sounds.playError();
    setStatus("ERROR");
    setTimeout(() => {
      setInputCode("");
      setStatus("IDLE");
    }, 850);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (inputCode.trim().toUpperCase() === targetPasscode.toUpperCase()) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  const handleQuickFill = () => {
    sounds.playClick();
    setInputCode(targetPasscode);
    triggerSuccess();
  };

  const pinSlots = Array.from({ length: 6 });

  return (
    <div className="w-full max-w-md bg-[#fffdfa] border-2 border-[#bbf7d0] rounded-[36px] p-6 sm:p-8 shadow-card text-[#132e22] flex flex-col items-center relative overflow-hidden font-sans select-none">
      {/* Corner Washi Tape in Soft Pastel Lavender */}
      <div className="absolute -top-1.5 right-8 z-20 pointer-events-none flex items-center">
        <WashiTape className="w-20 h-4.5 opacity-80" color="bg-purple-200/80" />
        <PopFlower color="lavender" className="w-5 h-5 -ml-3 -mt-2 drop-shadow-xs" rotate={12} />
      </div>

      {/* Header with Silk Ribbon Bow & Flower */}
      <div className="w-full flex items-center justify-between border-b border-[#bbf7d0]/70 pb-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <RibbonBow className="w-8 h-7 text-emerald-400 drop-shadow-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-600 font-sans tracking-wide">Puzzle 01</span>
              <FlowerBlossom className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-serif font-bold text-[#132e22]">The Birthday Keypad</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleScanClue}
          disabled={isScanning || status === "SUCCESS"}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-[#faf5ff] hover:bg-[#f3e8ff] text-[#6b21a8] border border-[#e9d5ff] shadow-xs shrink-0 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{isScanning ? "Revealing..." : showClue ? "Hint Open ♡" : "Need Hint?"}</span>
        </button>
      </div>

      {/* Clue Banner in Soft Pastel Palette */}
      <div className="w-full min-h-[56px] mb-4 relative z-10">
        {showClue ? (
          <div className="w-full bg-[#fdfbf7] border border-[#fed7aa] rounded-2xl p-3.5 text-xs text-[#78350f] flex items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="font-bold flex items-center gap-1 text-[#b45309] text-xs">
                <PopFlower color="buttercup" className="w-3.5 h-3.5" />
                <span>Sweet Memory Clue:</span>
              </div>
              <p className="text-[11px] text-[#78350f]/80 font-sans">
                Hint: The most special birthday on your calendar & the keys to my phone...
                <span className="font-bold text-[#b45309] ml-1">[{targetPasscode}]</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3.5 py-1.5 bg-[#fef08a] hover:bg-[#fde047] text-[#854d0e] rounded-xl text-xs font-bold transition cursor-pointer shadow-xs shrink-0 active:scale-95 border border-[#fde047]"
            >
              Fill ♡
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-[#faf5f8] border border-dashed border-[#bbf7d0] rounded-2xl p-3 flex items-center justify-center text-center text-xs text-[#3d6350] font-sans">
            <span>
              Tap <span className="text-purple-600 font-bold">"Need Hint?"</span> if you want a little reminder of the 6-digit key.
            </span>
          </div>
        )}
      </div>

      {/* 6-Digit PIN Display Slots (Pastel Blooming Bouquet) */}
      <div className="flex justify-center gap-2 sm:gap-2.5 mb-5 w-full relative z-10">
        {pinSlots.map((_, idx) => {
          const char = inputCode[idx];
          const isActive = inputCode.length === idx;
          const flowerColor = SLOT_FLOWERS[idx % SLOT_FLOWERS.length];

          return (
            <div
              key={idx}
              className={`w-11 sm:w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 shadow-xs ${
                status === "SUCCESS"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 scale-105"
                  : status === "ERROR"
                  ? "border-rose-300 bg-rose-50 text-rose-600 animate-pulse"
                  : char
                  ? "border-emerald-200 bg-white text-emerald-600 shadow-sm"
                  : isActive
                  ? "border-purple-300 bg-white text-[#3d6350] ring-2 ring-purple-100"
                  : "border-[#bbf7d0]/70 bg-white text-[#6e9981]"
              }`}
            >
              {status === "SUCCESS" ? (
                <span className="text-lg font-bold text-emerald-600">✓</span>
              ) : char ? (
                <PopFlower color={flowerColor} className="w-6 h-6 animate-in zoom-in-50 duration-150 drop-shadow-xs" />
              ) : (
                <span className="text-xl text-[#e2c4dc]">·</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Line */}
      <div className="text-center text-xs h-8 mb-4 flex items-center justify-center relative z-10">
        {status === "SUCCESS" ? (
          <div className="bg-emerald-50 border border-emerald-300 px-4 py-1.5 rounded-full text-emerald-800 font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Unlocked! Moving to next memory puzzle...</span>
          </div>
        ) : status === "ERROR" ? (
          <div className="bg-rose-50 border border-rose-300 px-3.5 py-1 rounded-full text-rose-700 font-bold flex items-center gap-1.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Not quite right — try again ♡</span>
          </div>
        ) : (
          <span className="text-[#3d6350] text-xs font-sans">
            Type via keyboard or tap the pastel keycaps below
          </span>
        )}
      </div>

      {/* Dreamy Pastel Macaron Keypad Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-5 relative z-10">
        {PASTEL_KEYS.map((k) => (
          <button
            key={k.digit}
            type="button"
            onClick={() => handleDigitClick(k.digit)}
            disabled={status === "SUCCESS"}
            className={`h-12 ${k.bg} ${k.hoverBg} border ${k.border} rounded-2xl text-lg font-bold ${k.text} transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-50 relative`}
          >
            <span>{k.digit}</span>
            <PopFlower color={k.flower} className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}

        {/* Clear Button (Soft Pastel Coral) */}
        <button
          type="button"
          onClick={handleClear}
          disabled={status === "SUCCESS"}
          className="h-12 bg-[#fff1f2] hover:bg-[#ffe4e6] border border-[#fecdd3] text-[#be123c] rounded-2xl text-xs font-bold transition cursor-pointer flex items-center justify-center shadow-xs active:scale-95 disabled:opacity-50"
        >
          Clear
        </button>

        {/* 0 Button (Soft Pastel Buttercup) */}
        <button
          type="button"
          onClick={() => handleDigitClick("0")}
          disabled={status === "SUCCESS"}
          className="h-12 bg-[#fefce8] hover:bg-[#fef9c3] border border-[#fef08a] text-[#a16207] rounded-2xl text-lg font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-50"
        >
          <span>0</span>
          <PopFlower color="buttercup" className="w-2.5 h-2.5 opacity-60" />
        </button>

        {/* Backspace Button (Soft Pastel Periwinkle) */}
        <button
          type="button"
          onClick={handleBackspace}
          disabled={status === "SUCCESS"}
          className="h-12 bg-[#f5f3ff] hover:bg-[#ede9fe] border border-[#ddd6fe] text-[#6d28d9] rounded-2xl text-xs font-bold transition cursor-pointer flex items-center justify-center shadow-xs active:scale-95 disabled:opacity-50"
          title="Backspace"
        >
          <Delete className="w-4 h-4 text-[#7c3aed]" />
        </button>
      </div>

      {/* Pastel Unlock Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "SUCCESS" || inputCode.length === 0}
        className={`w-full max-w-xs py-3.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm relative z-10 active:scale-95 ${
          status === "SUCCESS"
            ? "bg-emerald-300 text-emerald-950 shadow-emerald-200/50"
            : inputCode.length === 0
            ? "bg-[#faf5f8] text-[#6e9981] border border-[#bbf7d0] cursor-not-allowed"
            : "bg-gradient-to-r from-[#bbf7d0] via-[#e9d5ff] to-[#bae6fd] hover:from-[#4ade80] hover:via-[#c084fc] hover:to-[#60a5fa] text-[#4c1d95] font-bold border border-white/80 shadow-md"
        }`}
      >
        <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
        <span>UNLOCK CHAPTER ONE ♡</span>
      </button>
    </div>
  );
}
