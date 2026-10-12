import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Heart, RefreshCw } from "lucide-react";
import { DEFAULT_MEMORY_PAIRS } from "../../heistData";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

export default function PhotoMatch({ onComplete, customPairs }) {
  const basePairs = (customPairs && customPairs.length >= 10) ? customPairs.slice(0, 10) : DEFAULT_MEMORY_PAIRS;

  // Generate 20 cards (2 of each from 10 pairs) and shuffle them
  const createShuffledDeck = () => {
    const deck = [];
    basePairs.forEach((pair, pairIdx) => {
      deck.push({ id: `c_${pairIdx}_a`, pairKey: pair.pairKey || `p_${pairIdx}`, ...pair });
      deck.push({ id: `c_${pairIdx}_b`, pairKey: pair.pairKey || `p_${pairIdx}`, ...pair });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(createShuffledDeck);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedKeys, setMatchedKeys] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCardClick = (index) => {
    if (
      isCompleted ||
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedKeys.includes(cards[index].pairKey)
    ) {
      return;
    }

    sounds.playCardFlip();
    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const [idx1, idx2] = nextFlipped;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.pairKey === card2.pairKey) {
        // Matched
        sounds.playSuccess();
        const nextMatched = [...matchedKeys, card1.pairKey];
        setMatchedKeys(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length === basePairs.length) {
          setIsCompleted(true);
          sounds.playVictoryFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#4ade80", "#fda4af", "#c084fc", "#fef08a", "#bbf7d0"]
          });
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      } else {
        // Mismatch
        sounds.playError();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const handleReshuffle = () => {
    sounds.playClick();
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMatchedKeys([]);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center font-sans select-none">
      {/* Header Info */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 07 ♡ Final Memory Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          The Memory Match Game
        </h2>
        <p className="text-xs text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          Flip cards two at a time to find all 10 matching milestone pairs and open the anniversary vault.
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

        {/* Top Status & Remix Control */}
        <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#3d6350] font-medium">Pairs Matched:</span>
            <span className="text-emerald-700 font-bold px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
              {matchedKeys.length} of 10 Pairs
            </span>
          </div>

          <button
            type="button"
            onClick={handleReshuffle}
            disabled={isCompleted}
            className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] hover:text-emerald-700 text-xs font-semibold transition flex items-center gap-1.5 border border-emerald-200 cursor-pointer disabled:opacity-40 shadow-xs"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Reshuffle Cards</span>
          </button>
        </div>

        {/* 5x4 Grid (20 Cards) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 mb-2">
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedKeys.includes(card.pairKey);
            const isMatched = matchedKeys.includes(card.pairKey);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-[3/4] rounded-2xl border-2 cursor-pointer transition-all duration-300 select-none relative overflow-hidden group ${
                  isMatched
                    ? "border-emerald-300 bg-emerald-50/60 shadow-xs scale-[0.98]"
                    : isFlipped
                    ? "border-emerald-300 bg-[#fff8fa] shadow-sm scale-[1.02]"
                    : "border-emerald-200 bg-[#fffdfa] hover:border-emerald-300 hover:bg-[#fff8fa] hover:scale-[1.02]"
                }`}
              >
                {isFlipped ? (
                  <div className="w-full h-full p-1 animate-in fade-in duration-200">
                    {/* Pure Full-Card Photo — No text or label overlays */}
                    <div className="w-full h-full rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100">
                      {card.photo ? (
                        <img
                          src={card.photo}
                          alt="Memory Card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {card.icon || "💖"}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Card Back (Girly Pop Ribbon — Clean & no text) */
                  <div className="w-full h-full flex items-center justify-center p-2 text-emerald-300 group-hover:text-emerald-500 transition">
                    <RibbonBow className="w-7 h-6 group-hover:scale-115 transition-transform drop-shadow-xs" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Announcement */}
        {isCompleted && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 animate-in fade-in">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-500 shrink-0" />
            <span>All 10 Memory Pairs Reunited! Opening the Anniversary Vault... ♡</span>
          </div>
        )}
      </div>
    </div>
  );
}
