import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Volume2,
  VolumeX,
  Check
} from "lucide-react";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower,
  SparkleStar
} from "../../components/common/GirlyPopDecorations";
import { SEVEN_TRANSFORMATIONS } from "./BiTemporalIceSlider";

const ARTIFACT_ICONS = {
  1: (
    // The Melting Ice Shard
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      <defs>
        <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="50%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Fractured Ice Crystals */}
      <polygon points="50,12 75,45 60,88 28,78 20,40" fill="url(#iceGrad)" stroke="#38bdf8" strokeWidth="2" />
      <polygon points="50,12 35,48 50,70 65,45" fill="#f0f9ff" opacity="0.8" />
      {/* Melting water droplets & green sprout */}
      <circle cx="50" cy="92" r="3.5" fill="#38bdf8" />
      <circle cx="68" cy="94" r="2.5" fill="#7dd3fc" />
      <path d="M48,82 Q42,70 48,65 Q54,70 48,82 Z" fill="#86efac" />
    </svg>
  ),
  2: (
    // The Calmed Lantern & Gentle Flame
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      {/* Lantern top cap and loop */}
      <circle cx="50" cy="16" r="6" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <polygon points="30,30 70,30 60,22 40,22" fill="#d97706" />
      {/* Glass chamber */}
      <polygon points="32,30 68,30 62,80 38,80" fill="#fef3c7" opacity="0.6" stroke="#b45309" strokeWidth="2" />
      {/* Base */}
      <rect x="34" y="80" width="32" height="6" rx="2" fill="#d97706" />
      {/* Dancing Teardrop Flame */}
      <path d="M50,42 Q42,58 50,68 Q58,58 50,42 Z" fill="url(#flameGrad)" />
      <circle cx="50" cy="62" r="4" fill="#ffffff" />
    </svg>
  ),
  3: (
    // The Acoustic Soundwave
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      {/* Speaking profile / soundwave node */}
      <circle cx="32" cy="50" r="14" fill="#10b981" />
      <circle cx="32" cy="50" r="6" fill="#ecfdf5" />
      {/* Radiating sound arcs */}
      <path d="M52,38 A16,16 0 0,1 52,62" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <path d="M62,30 A26,26 0 0,1 62,70" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72,22 A36,36 0 0,1 72,78" fill="none" stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  4: (
    // The Shared Café Table
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      {/* Table surface */}
      <rect x="18" y="68" width="64" height="6" rx="2" fill="#92400e" />
      <rect x="46" y="74" width="8" height="18" fill="#78350f" />
      {/* Cup 1 */}
      <rect x="26" y="52" width="16" height="16" rx="3" fill="#f43f5e" />
      <path d="M42,56 C46,56 46,64 42,64" fill="none" stroke="#f43f5e" strokeWidth="2" />
      {/* Cup 2 */}
      <rect x="58" y="52" width="16" height="16" rx="3" fill="#fda4af" />
      <path d="M58,56 C54,56 54,64 58,64" fill="none" stroke="#fda4af" strokeWidth="2" />
      {/* Steaming ribbons rising into heart */}
      <path d="M34,48 Q30,38 36,30 Q40,40 34,48" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
      <path d="M66,48 Q70,38 64,30 Q60,40 66,48" fill="none" stroke="#fda4af" strokeWidth="1.8" />
    </svg>
  ),
  5: (
    // The Clear Prism Lens
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      <defs>
        <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Equilateral Prism Triangle */}
      <polygon points="50,20 84,76 16,76" fill="url(#prismGrad)" opacity="0.85" stroke="#ca8a04" strokeWidth="2" />
      <polygon points="50,20 65,76 35,76" fill="#fef9c3" opacity="0.6" />
      {/* Refracted beam of focused white light */}
      <line x1="50" y1="20" x2="50" y2="88" stroke="#ffffff" strokeWidth="3" />
      <circle cx="50" cy="88" r="4" fill="#ffffff" />
    </svg>
  ),
  6: (
    // The Maritime Anchor
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      {/* Top ring */}
      <circle cx="50" cy="22" r="8" fill="none" stroke="#059669" strokeWidth="3" />
      {/* Crossbar */}
      <line x1="28" y1="36" x2="72" y2="36" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
      {/* Shank */}
      <line x1="50" y1="30" x2="50" y2="78" stroke="#059669" strokeWidth="4" />
      {/* Curved flukes */}
      <path d="M22,58 Q50,92 78,58" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
      <polygon points="22,58 18,66 28,64" fill="#047857" />
      <polygon points="78,58 82,66 72,64" fill="#047857" />
    </svg>
  ),
  7: (
    // The Golden Mirror
    <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md">
      {/* Mirror handle */}
      <rect x="47" y="72" width="6" height="22" rx="3" fill="#d97706" />
      {/* Mirror outer frame */}
      <circle cx="50" cy="44" r="28" fill="#fef3c7" stroke="#d97706" strokeWidth="3.5" />
      {/* Reflective glass */}
      <circle cx="50" cy="44" r="22" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
      {/* Silhouette of man inside */}
      <circle cx="50" cy="34" r="6" fill="#10b981" />
      <path d="M40,54 C40,45 60,45 60,54 Z" fill="#10b981" />
      <SparkleStar className="w-5 h-5 text-amber-500 absolute top-2 right-2" />
    </svg>
  )
};

export default function ArtifactsVitrine({ playChime }) {
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState(new Set([1]));

  const openArtifact = (item) => {
    setSelectedArtifact(item);
    setUnlockedIds((prev) => new Set(prev).add(item.id));
    if (playChime) playChime(392 + item.id * 55, 0.5);
  };

  const closeArtifact = () => setSelectedArtifact(null);

  const nextArtifact = () => {
    if (!selectedArtifact) return;
    const nextIdx = (selectedArtifact.id % SEVEN_TRANSFORMATIONS.length);
    openArtifact(SEVEN_TRANSFORMATIONS[nextIdx]);
  };

  const prevArtifact = () => {
    if (!selectedArtifact) return;
    const prevIdx = selectedArtifact.id === 1 ? SEVEN_TRANSFORMATIONS.length - 1 : selectedArtifact.id - 2;
    openArtifact(SEVEN_TRANSFORMATIONS[prevIdx]);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 max-w-6xl mx-auto overflow-y-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#132e22]">
                The Seven Artifacts of Growth
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Editorial Vitrine
              </span>
            </div>
            <p className="text-xs text-[#3d6350] font-sans">
              Seven physical symbols representing the seven core ways your presence remade me
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
          Artifacts Explored: {unlockedIds.size} / 7
        </div>
      </div>

      {/* 7 Artifacts Grid */}
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 flex-1 items-center">
        {SEVEN_TRANSFORMATIONS.map((item) => {
          const isUnlocked = unlockedIds.has(item.id);

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openArtifact(item)}
              className="bg-white border-2 border-emerald-200/90 hover:border-emerald-400 rounded-[28px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden group"
            >
              {/* Corner Washi Tape */}
              <div className="absolute -top-1.5 right-6 pointer-events-none">
                <WashiTape className="w-14 h-3.5 opacity-80" color="bg-emerald-200" />
              </div>

              {/* Artifact Illustration Container */}
              <div className="flex flex-col items-center pt-2 pb-3">
                <div className="w-20 h-20 rounded-full bg-[#f0fdf4] border border-emerald-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform mb-3">
                  {ARTIFACT_ICONS[item.id]}
                </div>

                <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  Artifact 0{item.id}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#132e22] text-center mt-0.5 group-hover:text-emerald-800 transition-colors">
                  {item.dimension}
                </h4>
                <p className="text-[11px] text-[#3d6350] text-center line-clamp-1 italic mt-0.5">
                  {item.badge}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[11px] font-sans">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  {isUnlocked ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <span>Tap to Open</span>
                  )}
                </span>
                <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  Read Letter →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Reading Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeArtifact}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              className="max-w-lg w-full bg-[#fffdfa] text-[#132e22] border-2 border-emerald-300 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FlowerBlossom className="w-4 h-4" petalColor="#86efac" centerColor="#fef08a" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                      Artifact 0{selectedArtifact.id} // {selectedArtifact.badge}
                    </span>
                    <span className="text-xs font-serif font-bold text-[#132e22]">
                      {selectedArtifact.dimension}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeArtifact}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {selectedArtifact.subtitle}
              </h3>

              {/* Side-by-Side Before vs After Mini Plaque */}
              <div className="my-3 grid grid-cols-2 gap-2 text-xs font-sans">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">2019 (Before):</span>
                  <p className="font-serif font-bold text-slate-800 text-[11px] mt-0.5">{selectedArtifact.beforeState}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[9px] font-mono text-emerald-700 uppercase block font-bold">2026 (With Mythri):</span>
                  <p className="font-serif font-bold text-emerald-900 text-[11px] mt-0.5">{selectedArtifact.afterState}</p>
                </div>
              </div>

              {/* Full Narrative Text */}
              <div className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-4 max-h-48 overflow-y-auto pr-1">
                {selectedArtifact.afterDesc}
              </div>

              {/* Pull Quote */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "{selectedArtifact.quote}"
                </p>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between border-t border-emerald-100 pt-3 text-xs font-sans">
                <button
                  onClick={prevArtifact}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-serif font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="font-mono text-[11px] text-[#3d6350]">
                  Artifact {selectedArtifact.id} of 7
                </span>

                <button
                  onClick={nextArtifact}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
