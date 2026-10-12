import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Award,
  Zap
} from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape } from "../common/GirlyPopDecorations";

const DEFAULT_9_PHOTOS = [
  { id: 0, src: "/memorymatrix/matrix1.jpg" },
  { id: 1, src: "/memorymatrix/matrix2.jpg" },
  { id: 2, src: "/memorymatrix/matrix3.jpg" },
  { id: 3, src: "/memorymatrix/matrix4.jpg" },
  { id: 4, src: "/memorymatrix/matrix5.jpg" },
  { id: 5, src: "/memorymatrix/matrix6.jpg" },
  { id: 6, src: "/memorymatrix/matrix7.jpg" },
  { id: 7, src: "/memorymatrix/matrix8.jpg" },
  { id: 8, src: "/memorymatrix/matrix9.jpg" }
];

// 3 Levels with 5, 6, and 7 illuminations
const ROUNDS_CONFIG = [
  { round: 1, length: 5, label: "Level 1 · 5 Illuminations", badge: "Level 1 Cleared ♡" },
  { round: 2, length: 6, label: "Level 2 · 6 Illuminations", badge: "Level 2 Cleared ♡" },
  { round: 3, length: 7, label: "Level 3 · 7 Illuminations", badge: "Level 3 Mastermind ♡" }
];

export default function PhotoMemoryIQ({ onComplete, customPhotos }) {
  // Use memorymatrix photos by default, or customPhotos if configured
  const photos = DEFAULT_9_PHOTOS.map((p, idx) => ({
    ...p,
    src: (customPhotos && customPhotos[idx] && (customPhotos[idx].photo || customPhotos[idx].src || customPhotos[idx])) || p.src
  }));

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0); // 0, 1, 2
  const [sequence, setSequence] = useState([]); // Array of photo indices (0 to 8)
  const [activeFlashIndex, setActiveFlashIndex] = useState(null); // Which photo is currently glowing
  const [playerInput, setPlayerInput] = useState([]); // Array of player taps
  const [gameState, setGameState] = useState("idle"); // "displaying", "playerTurn", "roundSuccess", "error", "finished"
  const [iqScore, setIqScore] = useState(115);
  const [statusMessage, setStatusMessage] = useState("Get ready to watch the 3×3 memory matrix glow...");

  const isPlayingRef = useRef(false);

  // Generate sequence for current round
  const startRound = (roundIdx) => {
    const config = ROUNDS_CONFIG[roundIdx];
    const targetLength = config.length;

    // Generate random sequence of photos (0 to 8) without consecutive repeats
    const newSeq = [];
    for (let i = 0; i < targetLength; i++) {
      let rand = Math.floor(Math.random() * 9);
      if (i > 0 && rand === newSeq[i - 1]) {
        rand = (rand + 1) % 9;
      }
      newSeq.push(rand);
    }

    setSequence(newSeq);
    setPlayerInput([]);
    playSequence(newSeq);
  };

  // Playback the sequence flashing cards one by one
  const playSequence = (seqToPlay) => {
    setGameState("displaying");
    setStatusMessage("Watch closely as the photos illuminate...");
    isPlayingRef.current = true;

    seqToPlay.forEach((photoId, stepIdx) => {
      // Step interval: 680ms per card
      setTimeout(() => {
        if (!isPlayingRef.current) return;
        setActiveFlashIndex(photoId);
        sounds.playCrystalTap(photoId);

        // Turn off flash after 420ms
        setTimeout(() => {
          setActiveFlashIndex(null);
        }, 420);
      }, stepIdx * 680 + 500);
    });

    // When sequence finishes, switch to player turn
    setTimeout(() => {
      if (!isPlayingRef.current) return;
      setActiveFlashIndex(null);
      setGameState("playerTurn");
      setStatusMessage("Your turn! Tap the photos in the exact same order ♡");
    }, seqToPlay.length * 680 + 700);
  };

  // Start round 1 on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startRound(0);
    }, 600);
    return () => {
      isPlayingRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  // Handle player clicking a photo
  const handlePhotoClick = (photoId) => {
    if (gameState !== "playerTurn") return;

    // Play tactile feedback
    sounds.playCrystalTap(photoId);
    setActiveFlashIndex(photoId);
    setTimeout(() => setActiveFlashIndex(null), 250);

    const nextInput = [...playerInput, photoId];
    setPlayerInput(nextInput);

    const currentStep = nextInput.length - 1;

    // Check if the tap is correct for this step
    if (nextInput[currentStep] !== sequence[currentStep]) {
      // Mistake: Forgiving, play gentle buzz and replay sequence
      sounds.playError();
      setGameState("error");
      setStatusMessage("Oops, almost! Watch the replay and try again ♡");

      setTimeout(() => {
        setPlayerInput([]);
        playSequence(sequence);
      }, 1400);
      return;
    }

    // If step is correct and round is finished!
    if (nextInput.length === sequence.length) {
      sounds.playSuccess();
      setGameState("roundSuccess");
      const nextScore = iqScore + (currentRoundIndex === 0 ? 25 : currentRoundIndex === 1 ? 30 : 35);
      setIqScore(nextScore);

      // Check if all 3 rounds are complete
      if (currentRoundIndex + 1 >= ROUNDS_CONFIG.length) {
        setGameState("finished");
        setStatusMessage("100% Photographic Memory Confirmed! You're a Genius ♡");
        sounds.playVictoryFanfare();
        setTimeout(() => {
          onComplete();
        }, 2200);
      } else {
        setStatusMessage(`${ROUNDS_CONFIG[currentRoundIndex].badge} completed! Loading next round...`);
        setTimeout(() => {
          const nextIdx = currentRoundIndex + 1;
          setCurrentRoundIndex(nextIdx);
          startRound(nextIdx);
        }, 1300);
      }
    }
  };

  const handleReplay = () => {
    if (gameState !== "playerTurn") return;
    setPlayerInput([]);
    playSequence(sequence);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center font-sans select-none px-2 sm:px-4">
      {/* Header Info */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 05 ♡ Photographic Memory IQ (3×3 Matrix)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          Memory Matrix IQ Test
        </h2>
        <p className="text-xs text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          Watch our 9 photo moments illuminate in sequence, then tap them in the exact order. Clear all 3 levels to unlock the vault!
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full bg-white border-2 border-[#bbf7d0] rounded-[32px] p-4 sm:p-6 shadow-card relative overflow-hidden">
        {/* Washi Tape Decor */}
        <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
          <WashiTape className="w-20 h-4.5 opacity-75" color="bg-emerald-200/80" />
        </div>
        <div className="absolute -top-1.5 left-8 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-purple-200/80" />
        </div>

        {/* Top Status & IQ Score Ribbon */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl px-3 sm:px-4 py-2 text-xs">
          {/* Round Indicator */}
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-600" />
            <span className="font-serif font-bold text-emerald-950 text-sm">
              Level {currentRoundIndex + 1} of 3
            </span>
          </div>

          {/* 3 Level Bulbs */}
          <div className="flex items-center gap-1.5">
            {ROUNDS_CONFIG.map((r, idx) => (
              <div
                key={r.round}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  idx < currentRoundIndex
                    ? "bg-emerald-500 border-emerald-600 text-white"
                    : idx === currentRoundIndex
                    ? "bg-amber-300 border-amber-400 text-amber-950 animate-pulse scale-110"
                    : "bg-white border-emerald-200 text-emerald-300"
                }`}
                title={r.label}
              >
                {idx < currentRoundIndex ? "✓" : idx + 1}
              </div>
            ))}
          </div>

          {/* Live IQ Rating */}
          <div className="flex items-center gap-1 text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            <span>IQ: {iqScore}</span>
          </div>
        </div>

        {/* Dynamic Instructional Banner */}
        <div
          className={`w-full py-2 px-3 rounded-2xl text-xs text-center font-medium mb-3.5 transition-all duration-300 border ${
            gameState === "displaying"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : gameState === "playerTurn"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
              : gameState === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}
        >
          <span>{statusMessage}</span>
          {gameState === "playerTurn" && (
            <span className="ml-2 font-mono font-bold text-emerald-600">
              ({playerInput.length}/{sequence.length} taps)
            </span>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3×3 PHOTO GRID (9 TILES - NO TEXT LABELS) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 max-w-md mx-auto mb-4">
          {photos.map((photo) => {
            const isFlashing = activeFlashIndex === photo.id;
            const isClickable = gameState === "playerTurn";

            return (
              <motion.div
                key={photo.id}
                whileHover={isClickable ? { scale: 1.04 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
                onClick={() => handlePhotoClick(photo.id)}
                className={`relative bg-white border-2 rounded-2xl p-1.5 sm:p-2 shadow-card transition-all duration-200 select-none overflow-hidden ${
                  isClickable
                    ? "cursor-pointer hover:border-emerald-300 hover:shadow-md"
                    : "cursor-default"
                } ${
                  isFlashing
                    ? "border-amber-400 shadow-[0_0_28px_rgba(251,191,36,0.85)] scale-105 bg-amber-100/80 z-10 ring-2 ring-amber-300"
                    : "border-emerald-200"
                }`}
              >
                {/* Photo Frame */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-emerald-50 border border-emerald-100 shadow-inner">
                  <img
                    src={photo.src}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Flash Overlay with Sparkles */}
                  {isFlashing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-amber-400/40 via-yellow-200/30 to-white/60 backdrop-blur-[1px] flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1.25, rotate: 0 }}
                        className="text-2xl sm:text-3xl drop-shadow-md"
                      >
                        ✨
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions (Replay Helper) */}
        <div className="flex items-center justify-between text-xs text-[#3d6350] pt-2 border-t border-emerald-100">
          <button
            type="button"
            onClick={handleReplay}
            disabled={gameState !== "playerTurn"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold cursor-pointer disabled:opacity-40 transition shadow-2xs"
            title="Watch the sequence flash again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Flashes ♡</span>
          </button>

          <span className="text-[11px] text-[#6e9981]">
            {gameState === "displaying" ? "👀 Memorizing..." : "👆 Tap photos to repeat sequence"}
          </span>
        </div>
      </div>

      {/* Finished Celebration Banner */}
      <AnimatePresence>
        {gameState === "finished" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center text-emerald-800 text-xs font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5 text-emerald-600" />
            <span>IQ TEST PASSED: 100% Photographic Memory! Unlocking Vault... ♡</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
