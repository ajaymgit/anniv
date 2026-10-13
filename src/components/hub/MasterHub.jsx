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
  Heart,
  Radio,
  Eye,
  BookOpen,
  Laptop,
  Gamepad2
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  PopFlower,
  FlowerBlossom,
  FlowerGarland,
  WashiTape,
  SparkleStar
} from "../common/GirlyPopDecorations";

const ICON_MAP = {
  Heart: Gamepad2,
  Sparkles,
  Mail,
  HeartHandshake: Laptop,
  Compass: Radio,
  Wand2: Eye,
  Feather: BookOpen
};

const CHAPTER_METADATA = {
  "01-time-heist": {
    designArchetype: "Arcade Console",
    formatBadge: "Tactile Mission Terminal",
    yearTag: "Year 01",
    highlight: "7 tactile memory games: crossword, darkroom, sliding tiles & trivia"
  },
  "02-constellation": {
    designArchetype: "The Enchanted Rose",
    formatBadge: "8 Petals & Blooming Sea",
    yearTag: "Year 02",
    highlight: "Interactive 8-petal rose with stories, water ripples & blooming rose finale"
  },
  "03-seven-letters": {
    designArchetype: "Stationery Desk",
    formatBadge: "Love Letters",
    yearTag: "Year 03",
    highlight: "7 folded parchment envelopes sealed with custom sage wax monograms"
  },
  "04-couplestick": {
    designArchetype: "macOS Desktop App",
    formatBadge: "Retro-Modern Software Lab",
    yearTag: "Year 04",
    highlight: "Mac window chrome with partner sticker, real-time pokes & installer"
  },
  "05-undecided": {
    designArchetype: "Analog Radio Receiver",
    formatBadge: "FM Tuner & Cassette Deck",
    yearTag: "Year 05",
    highlight: "Interactive 104.7 FM frequency dial, needle slider & cassette tapes"
  },
  "06-mythri-effect": {
    designArchetype: "Clockwork Movement",
    formatBadge: "Watchmaker's Movement",
    yearTag: "Year 06",
    highlight: "Interactive watch movement with 7 calibrated gears you assemble"
  },
  "07-her-space": {
    designArchetype: "Bound Hardcover Diary",
    formatBadge: "Linen Stitched Notebook",
    yearTag: "Year 07",
    highlight: "Open book with mint ruled lines, red margin, silk ribbon & private ink"
  }
};

export default function MasterHub() {
  const { spaces, goToSpace, completedSpaces } = useAnniversary();

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#132e22] pb-28 pt-8 sm:pt-14 px-4 sm:px-6 select-none relative overflow-hidden font-sans">
      {/* Soft Pastel Green Background Ambient Glows */}
      <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-emerald-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-teal-100/40 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-100/50 rounded-full blur-[140px] pointer-events-none" />

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
        <PopFlower color="mint" className="w-9 h-9 drop-shadow-xs" />
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
            <RibbonBow className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-sm text-emerald-400 hover:scale-110 transition-transform cursor-pointer" />
          </motion.div>

          {/* Sweet Pill Badge with Flower Accents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#bbf7d0] text-xs font-semibold text-emerald-800 mb-5 shadow-sm"
          >
            <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
            <span>Seven Years of Us ♡ Always & Forever</span>
            <SparkleStar className="w-3 h-3 text-amber-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-serif font-normal text-[#132e22] tracking-tight mb-3 flex items-center justify-center gap-3"
          >
            <span>For Mythri</span>
            <span className="font-serif italic text-emerald-500 font-light text-4xl sm:text-6xl">♡</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#3d6350] leading-relaxed font-sans max-w-xl mx-auto font-normal"
          >
            Seven distinct chapters designed in our pastel green palette. Each room is a completely different world crafted with all my love.
          </motion.p>

          {/* Dainty Flower Garland */}
          <FlowerGarland className="mt-5 opacity-90" />
        </header>

        {/* The 7 Chapters Stream */}
        <main className="space-y-6">
          {spaces.map((space, index) => {
            const Icon = ICON_MAP[space.icon] || Heart;
            const meta = CHAPTER_METADATA[space.id] || {
              designArchetype: "Special Chapter",
              formatBadge: "Interactive Room",
              yearTag: `Year 0${index + 1}`,
              highlight: "Dedicated to our favorite moments together"
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
                className="group cursor-pointer rounded-[32px] p-6 sm:p-8 bg-white border-2 border-[#bbf7d0] hover:border-emerald-300 hover:shadow-[0_12px_32px_rgba(16,185,129,0.12)] transition-all duration-300 shadow-card relative overflow-hidden flex flex-col justify-between"
              >
                {/* Washi Tape Accent with Pinned PopFlower */}
                <div className="absolute -top-1.5 right-6 z-20 pointer-events-none flex items-center">
                  <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200/80" />
                  <PopFlower color="mint" className="w-5 h-5 -ml-3 -mt-2 drop-shadow-xs" rotate={12} />
                </div>

                <div>
                  {/* Top Row: Year Tag + Unique Design Persona Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PopFlower color="mint" className="w-4 h-4" />
                      <span className="text-xs font-bold text-emerald-700 font-sans tracking-wide">
                        {space.chapterLabel || `Chapter ${index + 1}`} // {meta.yearTag}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-200 text-emerald-800 bg-emerald-50/90 shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{meta.formatBadge}</span>
                    </span>
                  </div>

                  {/* Icon + Title + Subtitle */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-700 group-hover:bg-emerald-100 group-hover:border-emerald-300 group-hover:scale-105 transition-all shadow-sm shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#132e22] group-hover:text-emerald-900 transition-colors truncate">
                        {space.title}
                      </h2>
                      <p className="text-xs text-emerald-700 mt-0.5 font-medium">{space.subtitle}</p>
                    </div>
                  </div>

                  {/* Tagline Description */}
                  <p className="text-xs sm:text-sm text-[#3d6350] leading-relaxed font-sans mb-4">
                    {space.tagline}
                  </p>

                  {/* Chapter Feature Highlight Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] text-[#3d6350] font-medium font-sans mb-5 shadow-2xs">
                    <SparkleStar className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{meta.highlight}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#6e9981] font-serif italic">
                    <PopFlower color="mint" className="w-3.5 h-3.5" />
                    <span>Chapter 0{index + 1} of 07 • {meta.designArchetype}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-100/90 group-hover:bg-emerald-600 border border-emerald-200 group-hover:border-emerald-600 text-emerald-800 group-hover:text-white font-bold transition-all shadow-xs group-hover:shadow-md">
                    <span>{isCompleted ? "Revisit room ♡" : "Enter room ♡"}</span>
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
            <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
            <RibbonBow className="w-6 h-5 text-emerald-400" />
            <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
          </div>
          <p className="font-serif text-2xl text-[#132e22] mb-1 font-semibold">Happy 7th Anniversary, Mythri ♡</p>
          <p className="text-xs text-[#6e9981] font-medium">From Ajay, with all my love // Forever & Always</p>
        </footer>
      </div>
    </div>
  );
}
