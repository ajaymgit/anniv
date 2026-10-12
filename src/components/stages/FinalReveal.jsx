import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, RotateCcw, ArrowRight } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape, SparkleStar } from "../common/GirlyPopDecorations";
import { useAnniversary } from "../../context/AnniversaryContext";

export default function FinalReveal({ onReset, storyData }) {
  const { goToSpace, markSpaceCompleted } = useAnniversary();

  const recipient = storyData?.recipient || "Mythri";
  const revealTitle = storyData?.revealTitle || "Happy 7th Anniversary!";
  const revealMessage =
    storyData?.revealMessage ||
    "Through every locked dial, every dark corridor, and every scrambled memory, you proved that what we have is impossible to erase. Happy Anniversary, Mythri! Forever and always. ❤️";

  useEffect(() => {
    sounds.playVictoryFanfare();

    // Cascading Fireworks confetti in pastel tones
    const count = 260;
    const defaults = { origin: { y: 0.65 } };

    function fire(particleRatio, opts) {
      try {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ["#4ade80", "#fda4af", "#c084fc", "#fef08a", "#bbf7d0", "#a7f3d0"]
        });
      } catch (e) {
        console.error("Confetti error", e);
      }
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const handleNextChapter = () => {
    sounds.playSuccess();
    if (markSpaceCompleted) {
      markSpaceCompleted("01-time-heist");
    }
    if (goToSpace) {
      goToSpace("02-constellation");
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white border-2 border-emerald-200 rounded-[36px] p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden font-sans select-none text-[#132e22]">
      {/* Washi Tape Accent */}
      <div className="absolute -top-1.5 left-10 z-20 pointer-events-none">
        <WashiTape className="w-20 h-5 opacity-75" color="bg-emerald-200/80" />
      </div>
      <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
        <WashiTape className="w-20 h-5 opacity-75" color="bg-purple-200/80" />
      </div>

      {/* Ribbon Bow Decor */}
      <div className="flex justify-center mb-3">
        <RibbonBow className="w-14 h-12 text-emerald-400 drop-shadow-sm" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-4 shadow-sm">
        <FlowerBlossom className="w-3.5 h-3.5" />
        <span>All 7 Memory Puzzles Solved ♡ Happy Anniversary</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#132e22] mb-2 tracking-tight flex items-center justify-center gap-3">
        <span>{revealTitle}</span>
        <Heart className="w-8 h-8 text-emerald-500 fill-emerald-400 animate-bounce" />
      </h1>

      <p className="text-xs sm:text-sm text-[#3d6350] mb-6 font-medium">
        Made with all my heart for <span className="text-emerald-600 font-bold">{recipient}</span> ♡ Seven Years & Always
      </p>

      {/* Romantic Anniversary Letter */}
      <div className="bg-[#fffdfa] border-2 border-[#bbf7d0] rounded-[28px] p-7 sm:p-9 text-left mb-6 shadow-sm space-y-4 relative">
        <div className="absolute top-4 right-5 opacity-40">
          <SparkleStar className="w-5 h-5 text-emerald-300" />
        </div>

        <p className="text-base sm:text-lg text-[#132e22] leading-relaxed whitespace-pre-line font-serif">
          {revealMessage}
        </p>

        <div className="pt-6 border-t border-[#bbf7d0] flex items-center justify-between text-xs text-[#3d6350]">
          <span className="flex items-center gap-1.5 font-medium">
            <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span>Forever & Always, Ajay.</span>
          </span>
          <span className="font-script text-2xl text-emerald-600 font-bold">Always yours ♡</span>
        </div>
      </div>

      {/* Bottom Actions: Next Chapter & Replay */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-emerald-200/80">
        <button
          type="button"
          onClick={handleNextChapter}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition shadow-pop hover:shadow-popHover cursor-pointer active:scale-95"
        >
          <span>Next Chapter: Our Constellation ♡</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onReset();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 text-[#3d6350] hover:text-emerald-700 rounded-full text-xs font-semibold transition cursor-pointer border border-emerald-200 shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Play Memory Vault Again</span>
        </button>
      </div>
    </div>
  );
}
