import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Lock, Copy, Check, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  TulipFlower,
  WashiTape,
  SparkleStar
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

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Header with Ribbon & Blossom */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-sans font-medium shadow-sm">
            <FlowerBlossom className="w-3.5 h-3.5" />
            <span>Chapter 7 // Your Private Diary</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] font-serif tracking-tight">
            What do you wanna say to me?
          </h2>
          <p className="text-sm text-[#3d6350] max-w-lg mx-auto leading-relaxed font-sans">
            No mandatory forms, no expectations. You can write a single sentence, three pages, or simply leave this page blank. This space belongs entirely to you.
          </p>
        </div>

        {/* Writing Canvas in Aesthetic Scrapbook Diary Paper */}
        <div className="relative bg-white border-2 border-[#bbf7d0] rounded-[36px] p-7 sm:p-10 shadow-card transition-all overflow-hidden">
          {/* Washi Tape on Diary Top */}
          <div className="absolute -top-1.5 left-10 z-20 pointer-events-none">
            <WashiTape className="w-20 h-5 opacity-75" color="bg-emerald-200/80" />
          </div>
          <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
            <WashiTape className="w-20 h-5 opacity-75" color="bg-purple-200/80" />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dear Jayjay... (Your words save automatically as you type)"
            rows={12}
            className="w-full bg-transparent text-[#132e22] placeholder:text-[#6e9981] focus:outline-none resize-none font-serif text-lg sm:text-xl leading-relaxed mt-2"
          />

          {/* Bottom Bar: Word count & Privacy reassurance */}
          <div className="mt-4 pt-4 border-t border-[#bbf7d0]/70 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-[#3d6350]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved privately on your device. Only you decide when to share it.</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
              {text.trim().length > 0 && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition-colors shadow-sm active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy to Send ♡"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Optional Prompts Drawer with Flowers */}
        <div className="pt-2">
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-[#bbf7d0] flex items-center justify-between text-xs font-sans font-semibold text-[#3d6350] hover:text-[#132e22] shadow-sm transition-all"
          >
            <span className="flex items-center gap-2">
              <FlowerBlossom className="w-4 h-4" />
              <span>Need inspiration? Open optional journal prompts</span>
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
                      <SparkleStar className="w-3.5 h-3.5 text-emerald-400" />
                      <h4 className="text-xs font-bold text-emerald-700 tracking-wide font-sans">
                        {cat.category}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {cat.prompts.map((prompt, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => insertPrompt(prompt)}
                          className="cursor-pointer p-3.5 rounded-2xl bg-[#fff8fa] hover:bg-emerald-50 border border-[#bbf7d0] hover:border-emerald-300 text-xs sm:text-sm text-[#132e22] transition-all flex items-center justify-between group"
                        >
                          <span className="font-serif italic text-sm text-[#55324e]">"{prompt}"</span>
                          <span className="text-[11px] font-sans text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-2">
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
