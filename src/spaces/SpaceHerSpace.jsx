import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  Lock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  BookOpen,
  PenTool,
  Bookmark
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  SparkleStar,
  PopFlower
} from "../components/common/GirlyPopDecorations";

const DRAFT_KEY = "mythri_her_space_draft_v1";

const PROMPT_CATEGORIES = [
  {
    category: "Things you might not know I noticed",
    prompts: [
      "What's something about us that means more to you than I realise?",
      "Is there a small habit of mine you quietly find endearing or funny?",
      "What's an ordinary moment between us that stayed with you?"
    ]
  },
  {
    category: "Our story, from your side",
    prompts: [
      "What moment made you see me differently?",
      "What was going through your mind during our first rainy bike ride?",
      "When did you first realize this was going to last?"
    ]
  },
  {
    category: "Things between the lines",
    prompts: [
      "Is there something you've wanted to explain but haven't found the words for?",
      "What's something you wish we talked about more often?",
      "What does being loved by me feel like on your hardest days?"
    ]
  },
  {
    category: "Whatever comes next",
    prompts: [
      "What would you like us to make more room for in the future?",
      "What is one dream you want us to chase over the next seven years?",
      "Where do you want us to be sitting seven years from today?"
    ]
  }
];

export default function SpaceHerSpace() {
  const { markSpaceCompleted } = useAnniversary();
  const [text, setText] = useState(() => {
    return localStorage.getItem(DRAFT_KEY) || "";
  });
  const [showPrompts, setShowPrompts] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, text);
    if (text.length > 20) {
      markSpaceCompleted("07-her-space");
    }
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const insertPrompt = (promptText) => {
    setText((prev) => (prev ? `${prev}\n\n[Prompt: "${promptText}"]\n` : `[Prompt: "${promptText}"]\n`));
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none font-sans">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header with Ribbon & Blossom */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-sans font-semibold shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chapter 7 // Bound Linen Hardcover Diary & Secret Notebook</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] font-serif tracking-tight">
            What do you wanna say to me?
          </h2>
          <p className="text-sm text-[#3d6350] max-w-lg mx-auto leading-relaxed font-sans font-normal">
            No rules, no expectations. You can write a single sentence, three pages, or simply leave this page blank. This open journal belongs entirely to you.
          </p>
        </div>

        {/* Bound Hardcover Diary Spread */}
        <div className="relative bg-white border-2 border-[#bbf7d0] rounded-[40px] p-6 sm:p-10 shadow-card transition-all overflow-hidden">
          {/* Top Washi Tape Corner Accents */}
          <div className="absolute -top-1.5 left-10 z-20 pointer-events-none">
            <WashiTape className="w-20 h-5 opacity-80" color="bg-emerald-200/80" />
          </div>
          <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
            <WashiTape className="w-20 h-5 opacity-80" color="bg-emerald-200/80" />
          </div>

          {/* Stitched Spine Indicator Line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-emerald-100 border-l border-dashed border-emerald-200 pointer-events-none" />

          {/* Hanging Emerald Silk Ribbon Bookmark */}
          <div className="absolute -top-2 right-24 z-20 pointer-events-none flex flex-col items-center">
            <div className="w-4 h-16 bg-emerald-500 rounded-b-md shadow-md border-x border-emerald-600" />
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-emerald-600" />
          </div>

          {/* Diary Header Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#bbf7d0]/70 pb-4 mb-6 text-xs text-emerald-800 font-sans">
            <div className="flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold font-serif text-sm text-[#132e22]">
                Personal Diary Entry
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-[#3d6350]">Ink dry & autosaved</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-emerald-700 bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-emerald-200">
                {wordCount} words written
              </span>
            </div>
          </div>

          {/* Two-Column Notebook Feel on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Page: Quick Inspiration Index Tabs (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 font-sans">
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Journal Guidelines:</span>
                </div>
                <ul className="text-xs text-[#3d6350] space-y-2 leading-relaxed font-sans">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Write whatever is in your heart without editing yourself.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Saved exclusively on your device; you decide if/when to send.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Click any prompt below to paste it directly into your entry.</span>
                  </li>
                </ul>
              </div>

              {/* Security Badge */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#bbf7d0] flex items-center gap-2.5 text-xs text-[#3d6350]">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Private client-side storage. Never transmitted without your permission.
                </span>
              </div>
            </div>

            {/* Right Page: Ruled Notebook Paper with Ruled Lines (8 cols) */}
            <div className="md:col-span-8 relative">
              {/* Vertical Margin Red/Sage Rule */}
              <div className="absolute top-0 bottom-0 left-6 w-px bg-emerald-200/60 pointer-events-none hidden sm:block" />

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Dear Jayjay... (Your words save automatically as you type)"
                rows={12}
                className="w-full bg-transparent text-[#132e22] placeholder:text-[#6e9981] focus:outline-none resize-none font-serif text-lg sm:text-xl leading-relaxed sm:pl-10 p-2 select-text"
              />
            </div>
          </div>

          {/* Bottom Bar: Copy to Send Action */}
          <div className="mt-6 pt-4 border-t border-[#bbf7d0]/70 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#3d6350]">
            <div className="flex items-center gap-2">
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
              <span>Dedicated to Mythri // Written for Ajay</span>
            </div>

            {text.trim().length > 0 && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Entry ♡" : "Copy to Send to Ajay ♡"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Prompts Drawer */}
        <div className="pt-2">
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-[#bbf7d0] flex items-center justify-between text-xs font-sans font-semibold text-emerald-800 hover:text-emerald-950 shadow-sm transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
              <span>Need inspiration? Open optional journal writing prompts</span>
            </span>
            {showPrompts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showPrompts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-6 pt-6"
              >
                {PROMPT_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="bg-white border-2 border-[#bbf7d0] rounded-[28px] p-6 space-y-3 shadow-card relative">
                    <div className="flex items-center gap-2">
                      <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
                      <h4 className="text-xs font-bold text-emerald-800 tracking-wide font-sans">
                        {cat.category}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {cat.prompts.map((prompt, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => insertPrompt(prompt)}
                          className="cursor-pointer p-3.5 rounded-2xl bg-[#f0fdf4] hover:bg-emerald-100/70 border border-[#bbf7d0] hover:border-emerald-300 text-xs sm:text-sm text-[#132e22] transition-all flex items-center justify-between group"
                        >
                          <span className="font-serif italic text-sm text-emerald-900">"{prompt}"</span>
                          <span className="text-[11px] font-sans text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-2">
                            Insert ↵
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
