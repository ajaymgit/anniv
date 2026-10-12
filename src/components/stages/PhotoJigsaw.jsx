import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Eye, EyeOff, RotateCcw, Heart, CheckCircle2, ArrowRight, Maximize2, X } from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, PopFlower, FlowerBlossom, WashiTape, SparkleStar } from "../common/GirlyPopDecorations";

const DEFAULT_JIGSAW_PHOTO = "/jigsaw.jpg";
const OLD_UNSPLASH_PLACEHOLDER =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80";

export default function PhotoJigsaw({ onComplete, customPhoto }) {
  // If customPhoto is still pointing to the old Unsplash stock placeholder, override with /jigsaw.jpg
  const isOldPlaceholder = !customPhoto || customPhoto.includes("images.unsplash.com/photo-1529156069898");
  const effectivePhoto = isOldPlaceholder ? DEFAULT_JIGSAW_PHOTO : customPhoto;

  const [photoUrl, setPhotoUrl] = useState(effectivePhoto);
  const initialTiles = [7, 2, 4, 0, 6, 1, 8, 3, 5];

  useEffect(() => {
    const isOld = !customPhoto || customPhoto.includes("images.unsplash.com/photo-1529156069898");
    const target = isOld ? DEFAULT_JIGSAW_PHOTO : customPhoto;
    setPhotoUrl(target);
  }, [customPhoto]);

  const [tiles, setTiles] = useState(initialTiles);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);

  useEffect(() => {
    const solved = tiles.every((tile, index) => tile === index);
    if (solved && !isSolved) {
      setIsSolved(true);
      sounds.playSuccess();

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#fda4af", "#c084fc", "#fb7185", "#fef08a", "#bbf7d0"]
      });
    }
  }, [tiles, isSolved]);

  const handleTileClick = (index) => {
    if (isSolved) return;

    if (selectedIdx === null) {
      sounds.playClick();
      setSelectedIdx(index);
    } else if (selectedIdx === index) {
      sounds.playClick();
      setSelectedIdx(null);
    } else {
      sounds.playTileSwap();
      setTiles((prev) => {
        const next = [...prev];
        const temp = next[selectedIdx];
        next[selectedIdx] = next[index];
        next[index] = temp;
        return next;
      });
      setSelectedIdx(null);
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setTiles([7, 2, 4, 0, 6, 1, 8, 3, 5]);
    setSelectedIdx(null);
    setIsSolved(false);
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center select-none font-sans">
      {/* Header Info */}
      <div className="text-center mb-5">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-10 h-8 text-emerald-400 drop-shadow-xs" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold shadow-sm mb-2">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Puzzle 02 // Our Polaroid Puzzle</span>
        </div>
        <h2 className="text-2xl font-serif text-[#132e22]">
          Put Our Polaroid Together
        </h2>
        <p className="text-xs text-[#3d6350] mt-0.5">
          Tap any two pieces to swap them until the photo is complete ♡
        </p>
      </div>

      {/* Floating Polaroid Frame with Washi Tape and Bow */}
      <div
        className={`w-80 sm:w-96 bg-white border-2 rounded-[36px] p-5 sm:p-6 shadow-card transition-all duration-700 relative ${
          isSolved
            ? "border-emerald-300 shadow-pop scale-[1.02]"
            : "border-[#bbf7d0]"
        }`}
      >
        {/* Washi Tape Corners */}
        <div className="absolute -top-2 left-6 z-20 pointer-events-none flex items-center">
          <WashiTape className="w-14 h-4 opacity-75" color="bg-emerald-200/80" />
          <PopFlower color="mint" className="w-4 h-4 -ml-2 -mt-1 drop-shadow-xs" rotate={-10} />
        </div>
        <div className="absolute -top-2 right-6 z-20 pointer-events-none flex items-center">
          <WashiTape className="w-14 h-4 opacity-75" color="bg-purple-200/80" />
          <PopFlower color="lavender" className="w-4 h-4 -ml-2 -mt-1 drop-shadow-xs" rotate={15} />
        </div>

        {/* 3x3 Photo Canvas OR Complete Seamless Image when Solved */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-200 shadow-inner">
          {isSolved ? (
            /* ============================================================== */
            /* SOLVED STATE: Seamless, unbroken, complete original picture!   */
            /* ============================================================== */
            <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-700 group cursor-pointer" onClick={() => setShowFullModal(true)}>
              <img
                src={photoUrl}
                alt="Completed Memory Polaroid"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end justify-center p-3 pointer-events-none">
                <span className="bg-white/95 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-emerald-500" />
                  <span>Click to view full photo ♡</span>
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 pointer-events-none">
                <SparkleStar className="w-5 h-5 text-amber-300 drop-shadow-md animate-pulse" />
              </div>
            </div>
          ) : showPreview ? (
            /* Preview State */
            <div className="relative w-full h-full animate-in fade-in duration-200">
              <img
                src={photoUrl}
                alt="Memory Preview"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                  Previewing Original Photo ♡
                </span>
              </div>
            </div>
          ) : (
            /* Active Solving Jigsaw Grid */
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1 p-1 bg-emerald-100/50">
              {tiles.map((tilePosition, index) => {
                const origRow = Math.floor(tilePosition / 3);
                const origCol = tilePosition % 3;
                const isSelected = selectedIdx === index;

                return (
                  <div
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`relative w-full h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "ring-4 ring-emerald-400 scale-[0.96] z-10 shadow-md"
                        : "hover:scale-[0.98]"
                    }`}
                  >
                    <div
                      className="w-full h-full transition-all duration-700 grayscale contrast-110"
                      style={{
                        backgroundImage: `url(${photoUrl})`,
                        backgroundSize: "300% 300%",
                        backgroundPosition: `${origCol * 50}% ${origRow * 50}%`
                      }}
                    />

                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-white/80 text-[9px] font-sans font-bold text-emerald-700 pointer-events-none">
                      #{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Polaroid Bottom Margin with Cute Handwriting */}
        <div className="pt-4 pb-1 text-center min-h-[56px] flex flex-col items-center justify-center">
          {isSolved ? (
            <div className="animate-in fade-in zoom-in duration-500 space-y-1">
              <p className="font-script text-2xl sm:text-3xl text-emerald-600 font-bold">
                Found you in the pieces. Still my favorite smile ♡
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Polaroid Completed Seamlessly ♡</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-[#3d6350] font-sans">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Tap two pieces to swap their spots</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons in Pastel */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
        {!isSolved && (
          <>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowPreview((prev) => !prev);
              }}
              className="px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] border border-[#bbf7d0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5 text-emerald-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{showPreview ? "Back to Puzzle" : "Peek Original Photo"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] border border-[#bbf7d0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shuffle</span>
            </button>
          </>
        )}

        {isSolved && (
          <>
            <button
              type="button"
              onClick={() => setShowFullModal(true)}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] hover:text-emerald-700 border border-[#bbf7d0] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>View Full Photo ♡</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onComplete();
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-300 hover:from-emerald-500 hover:to-purple-400 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-pop active:scale-95"
            >
              <span>Next Puzzle ♡</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Full-Resolution Photo Lightbox Modal */}
      {showFullModal && (
        <div
          onClick={() => setShowFullModal(false)}
          className="fixed inset-0 bg-[#132e22]/70 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] flex flex-col items-center border-2 border-emerald-200 shadow-2xl relative overflow-hidden text-[#132e22]"
          >
            <div className="absolute -top-1.5 right-8 z-20 pointer-events-none flex items-center">
              <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
              <PopFlower color="mint" className="w-4 h-4 -ml-2 -mt-1 drop-shadow-xs" rotate={12} />
            </div>

            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <RibbonBow className="w-6 h-5 text-emerald-400" />
                <span className="font-serif text-lg font-bold">Our Completed Memory ♡</span>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[68vh] overflow-hidden rounded-2xl border border-emerald-100 shadow-inner flex items-center justify-center bg-emerald-50/50">
              <img
                src={photoUrl}
                alt="Full Memory"
                className="max-h-[68vh] max-w-full object-contain rounded-2xl"
              />
            </div>

            <div className="pt-3 text-center">
              <p className="font-script text-xl text-emerald-600 font-bold">
                "Found you in the pieces. Still my favorite smile ♡"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
