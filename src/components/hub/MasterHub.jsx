import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  HeartHandshake,
  Compass,
  Wand2,
  Feather,
  ArrowRight,
  Heart
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  PopFlower,
  FlowerBlossom,
  FlowerCluster,
  FlowerGarland,
  FlowerStamp,
  TulipFlower,
  WashiTape,
  SparkleStar
} from "../common/GirlyPopDecorations";

const ICON_MAP = {
  Heart,
  Sparkles,
  Mail,
  HeartHandshake,
  Compass,
  Wand2,
  Feather
};

const CHAPTER_METADATA = {
  "01-time-heist": {
    flower: "mint",
    secondFlower: "buttercup",
    tape: "bg-emerald-200/80",
    yearTag: "Year 01 // 2019",
    highlight: "7 memory puzzles with photos & inside jokes"
  },
  "02-constellation": {
    flower: "lavender",
    secondFlower: "sky",
    tape: "bg-purple-200/80",
    yearTag: "Year 02 // 2020",
    highlight: "Interactive celestial canvas across the distance"
  },
  "03-seven-letters": {
    flower: "rose",
    secondFlower: "peach",
    tape: "bg-rose-200/80",
    yearTag: "Year 03 // 2021",
    highlight: "7 sealed envelopes of honest, quiet truths"
  },
  "04-couplestick": {
    flower: "mint",
    secondFlower: "buttercup",
    tape: "bg-emerald-200/80",
    yearTag: "Year 04 // 2022",
    highlight: "Native Mac desktop partner sticker & live pokes"
  },
  "05-undecided": {
    flower: "peach",
    secondFlower: "lavender",
    tape: "bg-amber-200/80",
    yearTag: "Year 05 // 2023",
    highlight: "An unwritten adventure we choose together"
  },
  "06-mythri-effect": {
    flower: "sky",
    secondFlower: "mint",
    tape: "bg-sky-200/80",
    yearTag: "Year 06 // 2024",
    highlight: "Generative particle ecosystem blooming to touch"
  },
  "07-her-space": {
    flower: "buttercup",
    secondFlower: "white",
    tape: "bg-yellow-200/80",
    yearTag: "Year 07 // Today",
    highlight: "Private, expectation-free writing sanctuary"
  }
};

export default function MasterHub() {
  const { spaces, goToSpace, completedSpaces } = useAnniversary();

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#132e22] pb-28 pt-8 sm:pt-14 px-4 sm:px-6 select-none relative overflow-hidden font-sans">
      {/* Soft Pastel Background Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-emerald-200/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-purple-200/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-amber-100/35 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Ambient Corner & Side Flowers */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-8 pointer-events-none opacity-80"
      >
        <PopFlower color="mint" className="w-10 h-10 drop-shadow-xs" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-24 right-8 pointer-events-none opacity-80"
      >
        <PopFlower color="lavender" className="w-9 h-9 drop-shadow-xs" />
      </motion.div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Aesthetic Girly Pop Header with Ribbon Bow */}
        <header className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto relative">
          {/* Top Big Ribbon Bow */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="flex justify-center mb-3"
          >
            <RibbonBow className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-sm hover:scale-110 transition-transform cursor-pointer" />
          </motion.div>

          {/* Sweet Pill Badge with Flower Accents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#bbf7d0] text-xs font-semibold text-emerald-700 mb-5 shadow-sm"
          >
            <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" />
            <span>Seven Years of Us ♡ 2019 — 2026</span>
            <SparkleStar className="w-3 h-3 text-amber-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-serif font-normal text-[#132e22] tracking-tight mb-3 flex items-center justify-center gap-3"
          >
            <span>For Mythri</span>
            <span className="font-serif italic text-emerald-400 font-light text-4xl sm:text-6xl">♡</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#3d6350] leading-relaxed font-sans max-w-xl mx-auto font-normal"
          >
            Seven sweet chapters made just for you. Filled with our favorite memories, inside jokes, and all my love.
          </motion.p>

          {/* Dainty Multi-Colored Flower Garland */}
          <FlowerGarland className="mt-5 opacity-90" />
        </header>

        {/* The 7 Chapters Sequential Scrapbook Stream (Sliding Down) */}
        <main className="space-y-6">
          {spaces.map((space, index) => {
            const Icon = ICON_MAP[space.icon] || Heart;
            const meta = CHAPTER_METADATA[space.id] || {
              flower: "mint",
              secondFlower: "buttercup",
              tape: "bg-emerald-200/80",
              yearTag: `Year 0${index + 1}`,
              highlight: "Special chapter for us"
            };
            const isCompleted = completedSpaces && completedSpaces.includes(space.id);

            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
                onClick={() => goToSpace(space.id)}
                className={`group cursor-pointer rounded-[32px] p-6 sm:p-8 ${space.cardTone || "bg-white"} border-2 border-[#bbf7d0] ${space.hoverGlow} transition-all duration-300 shadow-[0_8px_24px_-4px_rgba(244,114,182,0.10)] relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Washi Tape Accent with Pinned PopFlower */}
                <div className="absolute -top-1.5 right-6 z-20 pointer-events-none flex items-center">
                  <WashiTape className="w-16 h-4 opacity-75" color={meta.tape} />
                  <PopFlower color={meta.flower} className="w-5 h-5 -ml-3 -mt-2 drop-shadow-xs" rotate={12} />
                </div>

                <div>
                  {/* Top Row: Year Tag + Category Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PopFlower color={meta.flower} className="w-4 h-4" />
                      <span className="text-xs font-bold text-emerald-600 font-sans tracking-wide">
                        {space.chapterLabel || `Chapter ${index + 1}`} // {meta.yearTag}
                      </span>
                    </div>

                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${space.badgeColor} shadow-xs`}>
                      {space.category}
                    </span>
                  </div>

                  {/* Icon + Title + Subtitle */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#bbf7d0] text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-300 group-hover:scale-105 transition-all shadow-sm shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#132e22] group-hover:text-emerald-800 transition-colors truncate">
                        {space.title}
                      </h2>
                      <p className="text-xs text-[#3d6350] mt-0.5 font-medium">{space.subtitle}</p>
                    </div>
                  </div>

                  {/* Tagline Description */}
                  <p className="text-xs sm:text-sm text-[#55324e] leading-relaxed font-sans mb-4">
                    {space.tagline}
                  </p>

                  {/* Chapter Feature Highlight Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-[#bbf7d0] text-[11px] text-[#3d6350] font-medium font-sans mb-5 shadow-2xs">
                    <SparkleStar className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{meta.highlight}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#6e9981] font-serif italic">
                    <PopFlower color={meta.secondFlower} className="w-3.5 h-3.5" />
                    <span>Chapter 0{index + 1} of 07</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-100/90 group-hover:bg-emerald-500 border border-emerald-200 group-hover:border-emerald-500 text-emerald-800 group-hover:text-white font-bold transition-all shadow-xs group-hover:shadow-md">
                    <span>{isCompleted ? "Revisit chapter ♡" : "Open chapter ♡"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>

        {/* Sweet Floral Footer */}
        <footer className="mt-20 pt-10 border-t border-[#bbf7d0] text-center text-xs text-[#3d6350]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FlowerBlossom className="w-4 h-4" />
            <RibbonBow className="w-6 h-5 text-emerald-400" />
            <FlowerBlossom className="w-4 h-4" petalColor="#fed7aa" />
          </div>
          <p className="font-serif text-2xl text-[#132e22] mb-1 font-semibold">Happy 7th Anniversary, Mythri ♡</p>
          <p className="text-xs text-[#6e9981] font-medium">From Ajay, with all my love // Forever & Always</p>
        </footer>
      </div>
    </div>
  );
}
