import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, HelpCircle, AlertCircle, ArrowRight, Heart } from "lucide-react";
import { DEFAULT_TRIVIA_QUESTIONS } from "../../heistData";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

export default function CoupleTrivia({ onComplete, customQuestions }) {
  const questions = (customQuestions && customQuestions.length > 0)
    ? customQuestions
    : DEFAULT_TRIVIA_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (optIdx) => {
    if (selectedOption !== null && isAnswerCorrect) return;

    setSelectedOption(optIdx);

    if (optIdx === currentQ.correctAnswerIndex) {
      sounds.playSuccess();
      setIsAnswerCorrect(true);

      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOption(null);
          setIsAnswerCorrect(null);
          setShowHint(false);
        } else {
          setIsFinished(true);
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#4ade80", "#fda4af", "#c084fc", "#fef08a", "#bbf7d0"]
          });
          setTimeout(() => {
            onComplete();
          }, 1400);
        }
      }, 700);
    } else {
      sounds.playError();
      setIsAnswerCorrect(false);
      setTimeout(() => {
        setSelectedOption(null);
        setIsAnswerCorrect(null);
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center font-sans select-none">
      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 06 ♡ Memory Quiz</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          Seven Secrets of Our Story
        </h2>
        <p className="text-xs text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          Answer 7 sweet questions from our shared journey to unlock the final memory layer.
        </p>
      </div>

      {/* Main Girly Pop Scrapbook Card */}
      <div className="w-full bg-white border-2 border-[#bbf7d0] rounded-[32px] p-6 sm:p-8 shadow-card relative">
        {/* Washi Tape Decor */}
        <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
        </div>

        {/* Progress Bar & Indicators */}
        <div className="flex items-center justify-between gap-3 border-b border-[#bbf7d0]/70 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <RibbonBow className="w-5 h-4 text-emerald-400" />
            <span className="font-serif text-xs font-bold text-emerald-800">
              Question 0{currentIdx + 1} of 0{questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx < currentIdx
                    ? "bg-emerald-400"
                    : idx === currentIdx
                    ? "bg-emerald-500 scale-125 shadow-xs animate-pulse"
                    : "bg-emerald-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Header & Hint Button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold font-serif text-[#132e22] leading-snug">
            "{currentQ.question}"
          </h3>

          {currentQ.hint && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowHint((prev) => !prev);
              }}
              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs transition cursor-pointer shrink-0"
              title="Toggle Hint"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && currentQ.hint && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 animate-in fade-in duration-200">
            <span className="font-bold text-amber-900">Ajju's Little Clue: </span>
            <span>{currentQ.hint}</span>
          </div>
        )}

        {/* 4 Multiple-Choice Options */}
        <div className="space-y-2.5 mb-2 mt-2">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = isAnswerCorrect === true && isSelected;
            const isWrong = isAnswerCorrect === false && isSelected;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswerCorrect === true}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm scale-[1.01]"
                    : isWrong
                    ? "border-rose-300 bg-rose-50 text-rose-800 animate-shake"
                    : "border-emerald-200 bg-[#fff8fa] hover:bg-emerald-100/60 text-[#132e22]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full font-serif text-xs font-bold flex items-center justify-center shrink-0 ${
                      isCorrect
                        ? "bg-emerald-400 text-white"
                        : isWrong
                        ? "bg-rose-400 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {isWrong && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Finished State */}
        {isFinished && (
          <div className="mt-4 pt-3 border-t border-[#bbf7d0] text-center text-xs text-emerald-700 font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>All 7 Memory Questions Answered Perfectly ♡</span>
          </div>
        )}
      </div>
    </div>
  );
}
