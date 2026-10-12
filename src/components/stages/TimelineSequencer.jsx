import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { ArrowUp, ArrowDown, CheckCircle2, Calendar, Sparkles, GripVertical, AlertCircle, Heart } from "lucide-react";
import { TIMELINE_MEMORIES } from "../../heistData";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

export default function TimelineSequencer({ onComplete, customMemories }) {
  const initialData = (customMemories && customMemories.length > 0) ? customMemories : TIMELINE_MEMORIES;

  // Scramble cards initially so they start out of order
  const [items, setItems] = useState(() => {
    if (initialData.length >= 5) {
      return [initialData[3], initialData[0], initialData[4], initialData[1], initialData[2]];
    }
    return [...initialData].reverse();
  });

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (customMemories && customMemories.length > 0) {
      setItems([
        customMemories[3] || customMemories[0],
        customMemories[0],
        customMemories[4] || customMemories[1],
        customMemories[1] || customMemories[2],
        customMemories[2] || customMemories[0],
      ]);
    }
  }, [customMemories]);

  const moveItem = (idx, direction) => {
    sounds.playClick();
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const next = [...items];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setItems(next);
    setIsError(false);
  };

  const handleVerify = () => {
    const isCorrect = items.every((item, i) => item.order === i + 1);
    if (isCorrect) {
      sounds.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1200);
    } else {
      sounds.playError();
      setIsError(true);
      setTimeout(() => setIsError(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center font-sans select-none">
      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 05 ♡ Cherished Memories</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          Our Milestone Scrapbook
        </h2>
        <p className="text-xs text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          Drag and drop (or use the arrows) to arrange our favorite moments in chronological order from earliest to most recent.
        </p>
      </div>

      {/* Main Girly Pop Scrapbook Container */}
      <div className="w-full bg-white border-2 border-[#bbf7d0] rounded-[32px] p-5 sm:p-7 shadow-card relative">
        {/* Washi Tape Decor */}
        <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
          <WashiTape className="w-20 h-4.5 opacity-75" color="bg-emerald-200/80" />
        </div>
        <div className="absolute -top-1.5 left-8 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-purple-200/80" />
        </div>

        {/* Reorderable List */}
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={(newOrder) => {
            sounds.playClick();
            setItems(newOrder);
            setIsError(false);
          }}
          className="space-y-3 mb-5"
        >
          {items.map((item, idx) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className={`p-3.5 bg-[#fff8fa] hover:bg-emerald-50/50 border rounded-2xl flex items-center justify-between gap-3 shadow-xs transition-all cursor-grab active:cursor-grabbing select-none ${
                isSuccess
                  ? "border-emerald-300 bg-emerald-50/60"
                  : "border-emerald-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                {/* Drag Handle & Order Badge */}
                <div className="flex items-center gap-1.5 text-emerald-400 shrink-0">
                  <GripVertical className="w-4 h-4 text-emerald-300" />
                  <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-serif text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>

                {/* Photo Thumbnail */}
                {item.photo && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200 shrink-0 shadow-xs">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Milestone Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#132e22] text-xs sm:text-sm truncate font-serif">
                      {item.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                      {item.year}
                    </span>
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-[#3d6350] truncate mt-0.5">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* Up / Down Controls for Quick Fallback */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(idx, -1);
                  }}
                  disabled={idx === 0 || isSuccess}
                  className="p-1.5 rounded-xl bg-white hover:bg-emerald-100 text-[#3d6350] hover:text-emerald-800 border border-emerald-200 disabled:opacity-20 transition cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(idx, 1);
                  }}
                  disabled={idx === items.length - 1 || isSuccess}
                  className="p-1.5 rounded-xl bg-white hover:bg-emerald-100 text-[#3d6350] hover:text-emerald-800 border border-emerald-200 disabled:opacity-20 transition cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Feedback Messages */}
        {isError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center justify-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Almost there! Check the milestone dates and try rearranging them ♡</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={isSuccess}
          className={`w-full py-3.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isSuccess
              ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95"
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <FlowerBlossom className="w-4 h-4" />}
          <span>{isSuccess ? "Timeline Restored Perfectly ♡" : "Verify Our Milestones ♡"}</span>
        </button>
      </div>
    </div>
  );
}
