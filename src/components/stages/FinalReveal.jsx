import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, RotateCcw, Heart, Calendar, ArrowRight, Award } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape, SparkleStar } from "../common/GirlyPopDecorations";

export default function FinalReveal({ onReset, storyData }) {
  const [activeTab, setActiveTab] = useState("letter");

  const recipient = storyData?.recipient || "Mythri";
  const revealTitle = storyData?.revealTitle || "Happy 7th Anniversary!";
  const revealMessage =
    storyData?.revealMessage ||
    "Through every locked dial, every dark corridor, and every scrambled memory, you proved that what we have is impossible to erase. Happy Anniversary, Mythri! Forever and always. ❤️";
  const memories = storyData?.memories || [];

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
          colors: ["#4ade80", "#fda4af", "#c084fc", "#fef08a", "#bbf7d0", "#bbf7d0"]
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

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab("letter");
          }}
          className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
            activeTab === "letter"
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100 hover:text-[#132e22]"
          }`}
        >
          Anniversary Letter ♡
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setActiveTab("memories");
          }}
          className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
            activeTab === "memories"
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100 hover:text-[#132e22]"
          }`}
        >
          Recovered Milestones ({memories.length})
        </button>
      </div>

      {/* Tab 1: Romantic Letter */}
      {activeTab === "letter" ? (
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
      ) : (
        /* Tab 2: Recovered Milestones */
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1 text-left font-sans">
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                {m.photo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-100 shrink-0 border border-emerald-200">
                    <img src={m.photo} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold font-serif text-[#132e22]">{m.title}</div>
                  <div className="text-[11px] text-[#3d6350] mt-0.5">{m.desc}</div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold px-3 py-1 bg-emerald-100/70 border border-emerald-200 rounded-full shrink-0">
                {m.year}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Replay Action */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onReset();
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-emerald-50 text-[#3d6350] hover:text-emerald-700 rounded-full text-xs font-semibold transition cursor-pointer border border-emerald-200 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Play Memory Vault Again ♡</span>
        </button>
      </div>
    </div>
  );
}
