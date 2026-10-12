import React, { useState, useEffect } from "react";
import { HelpCircle, Volume2, VolumeX, Clock, Settings, Sparkles, Heart } from "lucide-react";
import { STAGE_NAMES, STAGE_HINTS, DEFAULT_STORY, DEFAULT_MATRIX_PHOTOS } from "../heistData";
import { sounds } from "../utils/audio";
import { useAnniversary, STAGE_SLUGS } from "../context/AnniversaryContext";
import StoryCustomizer from "./StoryCustomizer";
import BootSequence from "./stages/BootSequence";
import PhotoJigsaw from "./stages/PhotoJigsaw";
import RelationshipCrossword from "./stages/RelationshipCrossword";
import FlashlightArchive from "./stages/FlashlightArchive";
import PhotoMemoryIQ from "./stages/PhotoMemoryIQ";
import CoupleTrivia from "./stages/CoupleTrivia";
import PhotoMatch from "./stages/PhotoMatch";
import FinalReveal from "./stages/FinalReveal";
import { RibbonBow, FlowerBlossom, WashiTape, SparkleStar } from "./common/GirlyPopDecorations";

export default function HeistController() {
  const { heistStage, setHeistStage, soundEnabled, setSoundEnabled } = useAnniversary();
  const [currentStage, setCurrentStage] = useState(() => (typeof heistStage === "number" ? heistStage : 0));
  const [hintTier, setHintTier] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (typeof heistStage === "number" && heistStage !== currentStage) {
      setCurrentStage(heistStage);
    }
  }, [heistStage]);

  // Load custom story from localStorage if present
  const [storyData, setStoryData] = useState(() => {
    try {
      const saved = localStorage.getItem("time_heist_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out any cached legacy unsplash placeholder
        if (parsed.jigsawPhoto && parsed.jigsawPhoto.includes("images.unsplash.com/photo-1529156069898")) {
          parsed.jigsawPhoto = "/jigsaw.jpg";
        }
        // If memoryPairs are still pointing to old unsplash URLs, replace with local memorymatch photos
        if (
          !parsed.memoryPairs ||
          parsed.memoryPairs.some(
            (p) => p.photo && p.photo.includes("images.unsplash.com")
          )
        ) {
          parsed.memoryPairs = DEFAULT_MEMORY_PAIRS;
        }
        return parsed;
      }
      return DEFAULT_STORY;
    } catch {
      return DEFAULT_STORY;
    }
  });

  // Mission Timer
  useEffect(() => {
    if (currentStage >= 7) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStage]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const nextStage = () => {
    setHintTier(0);
    setShowHintModal(false);
    setCurrentStage((prev) => {
      const next = prev + 1;
      if (setHeistStage) setHeistStage(next);
      if (STAGE_SLUGS && STAGE_SLUGS[next]) {
        window.history.pushState({ stage: next }, "", `/${STAGE_SLUGS[next]}`);
      }
      return next;
    });
  };

  const handleOpenHint = () => {
    sounds.playClick();
    setShowHintModal(true);
  };

  const escalateHint = () => {
    sounds.playClick();
    if (hintTier < 2) {
      setHintTier((prev) => prev + 1);
    }
  };

  const bypassCurrentStage = () => {
    sounds.playSuccess();
    nextStage();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.muted = !next;
  };

  const handleSaveStory = (newConfig) => {
    setStoryData(newConfig);
    try {
      localStorage.setItem("time_heist_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };

  const progressPercent = Math.min(100, Math.round((currentStage / 7) * 100));

  return (
    <div
      className="min-h-screen bg-[#f7faf8] text-[#132e22] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 relative select-none"
    >
      {/* Top Girly Pop Pastel Header Bar with Ribbon & Flowers */}
      <header className="border-b border-[#bbf7d0] bg-[#fffdfa]/90 backdrop-blur-xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-sm">
        {/* Logo & Recipient */}
        <div className="flex items-center gap-3">
          <RibbonBow className="w-8 h-7 text-emerald-400 drop-shadow-sm" />
          <div>
            <div className="font-bold text-xs sm:text-sm text-[#132e22] flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg">The Memory Vault</span>
              <FlowerBlossom className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] text-[#3d6350] flex items-center gap-1 font-medium">
              <span>Made with love for:</span>
              <span className="text-emerald-600 font-bold">{storyData.recipient} ♡</span>
            </div>
          </div>
        </div>

        {/* Puzzle Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {currentStage < 7 && (
            <>
              {/* Mission Elapsed Time */}
              <div className="hidden sm:flex items-center gap-1.5 text-[#3d6350] bg-white border border-[#bbf7d0] px-3 py-1 rounded-full shadow-sm font-sans font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatTime(elapsedSec)}</span>
              </div>

              {/* Puzzle Stage Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-sm">
                <FlowerBlossom className="w-3.5 h-3.5" />
                <span>Puzzle 0{currentStage + 1} of 07</span>
              </div>

              {/* Hint Button */}
              <button
                type="button"
                onClick={handleOpenHint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-full text-amber-800 transition border border-amber-200 cursor-pointer shadow-sm text-xs font-bold active:scale-95"
                title="Get Help or Skip"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>HINT ♡</span>
              </button>
            </>
          )}

          {/* Customize Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowSettingsModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 rounded-full text-[#3d6350] hover:text-emerald-700 transition border border-[#bbf7d0] cursor-pointer shadow-sm text-xs font-semibold active:scale-95"
            title="Edit Memories, PINs & Photos"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-full bg-white hover:bg-emerald-50 border border-[#bbf7d0] text-[#3d6350] hover:text-emerald-600 transition cursor-pointer shadow-sm active:scale-95"
            title={!soundEnabled ? "Unmute Sound" : "Mute Sound"}
          >
            {!soundEnabled ? <VolumeX className="w-4 h-4 opacity-50" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      </header>

      {/* Sweet Pastel Candy Progress Line */}
      {currentStage < 7 && (
        <div className="w-full bg-emerald-100/60 h-2 relative">
          <div
            className="bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-300 h-2 rounded-r-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Puzzle Stage View */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 relative z-10">
        {currentStage === 0 && (
          <BootSequence
            onComplete={nextStage}
            passcode={storyData.passcode}
          />
        )}
        {currentStage === 1 && (
          <PhotoJigsaw
            onComplete={nextStage}
            customPhoto={storyData.jigsawPhoto}
          />
        )}
        {currentStage === 2 && (
          <RelationshipCrossword
            onComplete={nextStage}
          />
        )}
        {currentStage === 3 && (
          <FlashlightArchive
            onComplete={nextStage}
            customCode={storyData.archiveCode}
            customPhotos={storyData.chamberPhotos}
          />
        )}
        {currentStage === 4 && (
          <PhotoMemoryIQ
            onComplete={nextStage}
            customPhotos={storyData.matrixPhotos || DEFAULT_MATRIX_PHOTOS}
          />
        )}
        {currentStage === 5 && (
          <CoupleTrivia
            onComplete={nextStage}
            customQuestions={storyData.triviaQuestions}
          />
        )}
        {currentStage === 6 && (
          <PhotoMatch
            onComplete={nextStage}
            customPairs={storyData.memoryPairs}
          />
        )}
        {currentStage === 7 && (
          <FinalReveal
            storyData={storyData}
            onReset={() => {
              setElapsedSec(0);
              setCurrentStage(0);
            }}
          />
        )}
      </main>

      {/* Story Customizer Modal */}
      <StoryCustomizer
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        storyData={storyData}
        onSave={handleSaveStory}
      />

      {/* Soft Pastel Hint Modal */}
      {showHintModal && currentStage < 7 && (
        <div className="fixed inset-0 bg-[#132e22]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white border-2 border-emerald-200 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
              <WashiTape className="w-16 h-4 opacity-75" color="bg-amber-200/80" />
            </div>

            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-4">
              <FlowerBlossom className="w-4 h-4" />
              <span>A Little Gentle Hint ♡ [Tier {hintTier + 1}/3]</span>
            </div>

            <div className="bg-[#fff8fa] p-4 rounded-2xl border border-[#bbf7d0] text-xs mb-6 min-h-[90px] flex items-center leading-relaxed font-sans text-[#132e22]">
              {hintTier === 0 && (
                <p className="italic font-serif text-sm">"{STAGE_HINTS[currentStage]?.cryptic}"</p>
              )}
              {hintTier === 1 && (
                <p className="font-semibold text-emerald-700 text-sm">{STAGE_HINTS[currentStage]?.literal}</p>
              )}
              {hintTier === 2 && (
                <div className="text-center w-full">
                  <p className="text-emerald-600 font-bold mb-1">Want to skip forward?</p>
                  <p className="text-[11px] text-[#3d6350]">
                    You can bypass this puzzle right now and continue on to the next chapter.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowHintModal(false);
                }}
                className="px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] border border-[#bbf7d0] cursor-pointer transition font-bold"
              >
                Close
              </button>

              {hintTier < 2 ? (
                <button
                  type="button"
                  onClick={escalateHint}
                  className="px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 cursor-pointer transition font-bold"
                >
                  Need a Bigger Clue? ♡
                </button>
              ) : (
                <button
                  type="button"
                  onClick={bypassCurrentStage}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Skip to Next Puzzle ♡
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
