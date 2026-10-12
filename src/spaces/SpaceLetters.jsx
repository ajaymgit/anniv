import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Feather
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import { RibbonBow, PopFlower, FlowerBlossom, FlowerCluster, FlowerGarland, WashiTape } from "../components/common/GirlyPopDecorations";

export const LETTERS = [
  {
    id: 1,
    roman: "I",
    title: "On Quiet Fierceness",
    subtitle: "Something I admire about you",
    postmark: "OUR STORY ♡ OCT 2019",
    flowerColor: "rose",
    waxColor: "from-teal-400 to-emerald-500",
    preview: "The quiet grace with which you hold your ground and carry everyone around you...",
    date: "Chapter 1 // The Discovery",
    content: `There is a particular kind of strength that never advertises itself, and you carry it everywhere you go.

From our earliest days together, I noticed that you don’t perform kindness or manufacture loyalty for an audience. When you love someone, you protect them completely—without hesitation, without keeping score, and without waiting for them to ask.

I watch the way you navigate hard days: you don't crumble, and you never turn cynical. You just set your jaw, figure out what needs to be done, and do it with that fierce, stubborn grace that belongs only to you. 

In seven years of watching you grow and change, my admiration for your character has never settled into familiarity. You remain the benchmark of quiet integrity in my life.`
  },
  {
    id: 2,
    roman: "II",
    title: "The Quieting of the Static",
    subtitle: "Something you may not realise you do for me",
    postmark: "MIDNIGHT ♡ US",
    flowerColor: "lavender",
    waxColor: "from-emerald-400 to-teal-400",
    preview: "You anchor my mind whenever my thoughts start racing ahead of me...",
    date: "Chapter 2 // The Anchor",
    content: `My mind rarely sits still. It is almost always racing ahead—calculating, overthinking, worrying about what comes next, dissecting things that haven't even happened.

You probably don’t even know you do this, but the moment you sit behind me on the bike and rest your hand against my jacket, or the moment we sit across from each other over iced coffees without speaking for twenty minutes, the noise just cuts out.

You don’t have to deliver a profound speech or offer a solution. Just having you exist in the same physical room grounds me in a way nothing else in this world can. 

You are the only person who can make me stop living inside my head and simply be glad I am alive in the present hour.`
  },
  {
    id: 3,
    roman: "III",
    title: "Love on Ordinary Tuesdays",
    subtitle: "What being with you has taught me",
    postmark: "RAIN SEASONS ♡ US",
    flowerColor: "buttercup",
    waxColor: "from-purple-300 to-indigo-400",
    preview: "That love isn't dramatic speeches; it is showing up on ordinary days...",
    date: "Chapter 3 // The Lesson",
    content: `When you are younger, you assume love is made of dramatic declarations, grand surprises, and cinematic milestones.

Seven years with you taught me that real love is actually built out of the unglamorous, repetitive fabric of daily life. It is riding through pouring rain when neither of us wants to be on the road, just to share a meal. It is learning how to forgive each other quickly after ridiculous UNO arguments. It is splitting a basket of fries and leaving the crispest one at the bottom without saying a word.

Being with you taught me patience, softness, and how to stay when things are hard. 

You turned love from a fleeting feeling into a permanent home.`
  },
  {
    id: 4,
    roman: "IV",
    title: "The Rituals Nobody Else Sees",
    subtitle: "What I find beautiful in the ordinary",
    postmark: "LATE NIGHTS ♡ 01:00 AM",
    flowerColor: "peach",
    waxColor: "from-amber-300 to-orange-400",
    preview: "The mundane rituals that nobody else gets to witness...",
    date: "Chapter 4 // Everyday Poetry",
    content: `If you asked anyone else what makes you special, they would talk about your smile, your sharp wit, or how effortlessly you light up a room.

And all of that is true. But the moments I find most beautiful are the completely ordinary ones nobody else gets to witness:

The way you insist on putting ketchup on literally every meal, even dishes that have no business being near ketchup. The way you hum half-remembered melodies while staring out the car window. Your sleepy, gravelly voice when you answer late-night calls. The slight furrow between your eyebrows when you're concentrating.

The ordinary life we have woven together is my favorite place in the universe. I would never trade our routine for anyone else's grand adventure.`
  },
  {
    id: 5,
    roman: "V",
    title: "The Weight of Vulnerability",
    subtitle: "Something difficult to express out loud",
    postmark: "HEART TO HEART ♡ FOREVER",
    flowerColor: "mint",
    waxColor: "from-teal-400 to-red-400",
    preview: "The vulnerability of knowing how much of my happiness lives in you...",
    date: "Chapter 5 // The Truth",
    content: `I don’t always have the courage to say this to your face, because admitting it feels like exposing my softest, most vulnerable underbelly.

Loving you so completely means I have handed you the master key to my emotional weather. When you are hurting or exhausted, it physically aches in my chest. When you doubt yourself, I feel an overwhelming urge to challenge the entire world on your behalf.

Knowing how much of my happiness rests in your hands can be terrifying. But in seven years, you have never once mishandled my heart. 

Loving you with this much vulnerability is the safest thing I have ever done.`
  },
  {
    id: 6,
    roman: "VI",
    title: "The Unconditional Anchor",
    subtitle: "What I hope you never doubt about us",
    postmark: "COUNTING MILES ♡ US",
    flowerColor: "mint",
    waxColor: "from-teal-300 to-emerald-400",
    preview: "That distance, time, and chaotic seasons can ever weaken this bond...",
    date: "Chapter 6 // The Promise",
    content: `Relationships live through many seasons. We have lived through seasons of effortless laughter, seasons of heavy fatigue, seasons of quiet routine, and seasons where distance or chaotic schedules tested our stamina.

If there ever comes an evening where life feels overwhelming, or where you wonder if the initial spark is drowned out by the noise of the world, I need you to know this with absolute, unyielding certainty:

I chose you seven years ago, and I have chosen you every single morning since. 

There is no version of my future, no dream I am building, and no horizon I look toward that doesn't have you standing by my side. What we have is not an accident—it is an anchor.`
  },
  {
    id: 7,
    roman: "VII",
    title: "Armor for the Hard Days",
    subtitle: "What I want you to carry with you",
    postmark: "INTO FOREVER ♡ ALWAYS",
    flowerColor: "sky",
    waxColor: "from-emerald-400 to-purple-400",
    preview: "A reminder of who you are whenever the world feels overwhelming...",
    date: "Chapter 7 // Into Forever",
    content: `Whenever the world gets loud, demanding, or unkind—and whenever your own mind tries to convince you that you aren’t doing enough or being enough—I want you to pull this letter out and read these words:

You are deeply, profoundly, and unconditionally cherished.

You are not loved for what you accomplish or how easily you make everyone happy. You are loved for the fierce heart you carry, the kindness you give away so freely, and the irreplaceable person you are.

Carry my love like armor. Whatever comes at you in the years ahead, you will never face it alone.

Happy 7th Anniversary, Mythri. To our next seven, and every seven after.`
  }
];

export default function SpaceLetters() {
  const { markSpaceCompleted } = useAnniversary();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [readLetters, setReadLetters] = useState(() => {
    try {
      const saved = localStorage.getItem("mythri_letters_read_v1");
      return saved ? new Set(JSON.parse(saved)) : new Set([1]);
    } catch (e) {
      return new Set([1]);
    }
  });
  const [viewMode, setViewMode] = useState("desk"); // 'desk' | 'archive'
  const [fontSize, setFontSize] = useState("normal"); // 'normal' | 'large'

  useEffect(() => {
    try {
      localStorage.setItem("mythri_letters_read_v1", JSON.stringify(Array.from(readLetters)));
    } catch (e) {}

    if (readLetters.size === 7) {
      markSpaceCompleted("03-seven-letters");
    }
  }, [readLetters]);

  const openLetter = (letter) => {
    setSelectedLetter(letter);
    setReadLetters((prev) => {
      const updated = new Set(prev);
      updated.add(letter.id);
      return updated;
    });
  };

  const closeLetter = () => setSelectedLetter(null);

  const goToNextLetter = () => {
    if (!selectedLetter) return;
    const nextIdx = (selectedLetter.id % 7) + 1;
    const nextLetter = LETTERS.find((l) => l.id === nextIdx);
    if (nextLetter) openLetter(nextLetter);
  };

  const goToPrevLetter = () => {
    if (!selectedLetter) return;
    const prevIdx = selectedLetter.id === 1 ? 7 : selectedLetter.id - 1;
    const prevLetter = LETTERS.find((l) => l.id === prevIdx);
    if (prevLetter) openLetter(prevLetter);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <div className="flex justify-center mb-3">
          <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-sans font-medium mb-4 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 3 // Seven Love Letters</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] mb-3 font-serif tracking-tight">
          Words Kept For You
        </h2>
        <p className="text-sm sm:text-base text-[#3d6350] max-w-xl mx-auto leading-relaxed font-sans">
          Seven sealed envelopes tied with ribbon bows. Quiet truths written specifically for you to read at your own unhurried pace.
        </p>

        {/* View Mode Toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-sans">
          <div className="px-4 py-1.5 rounded-full bg-white border border-[#bbf7d0] text-emerald-700 font-medium shadow-sm flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-500" />
            <span>Unsealed: {readLetters.size} of 7 Letters</span>
          </div>

          <div className="flex rounded-full bg-white border border-[#bbf7d0] p-1 shadow-sm">
            <button
              onClick={() => setViewMode("desk")}
              className={`px-4 py-1 rounded-full transition-all ${
                viewMode === "desk" ? "bg-emerald-100 text-emerald-800 font-bold" : "text-[#3d6350] hover:text-[#132e22]"
              }`}
            >
              Envelope Desk
            </button>
            <button
              onClick={() => setViewMode("archive")}
              className={`px-4 py-1 rounded-full transition-all ${
                viewMode === "archive" ? "bg-emerald-100 text-emerald-800 font-bold" : "text-[#3d6350] hover:text-[#132e22]"
              }`}
            >
              Reading View
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: ENVELOPE DESK (Tactile Stationery Grid with Ribbon Bows & Washi Tape) */}
      {viewMode === "desk" && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 relative z-10">
          {LETTERS.map((letter, idx) => {
            const isRead = readLetters.has(letter.id);

            return (
              <motion.div
                key={letter.id}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openLetter(letter)}
                className={`cursor-pointer rounded-[32px] p-7 border-2 transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-card hover:shadow-pop group ${
                  isRead
                    ? "bg-white border-emerald-200"
                    : "bg-[#fff8fa] border-[#bbf7d0] hover:border-emerald-300"
                }`}
              >
                {/* Washi Tape Accent on Envelope Corner with Pinned PopFlower */}
                <div className="absolute -top-1.5 right-6 z-20 pointer-events-none flex items-center">
                  <WashiTape className="w-16 h-4 opacity-75" color={idx % 2 === 0 ? "bg-emerald-200/80" : "bg-purple-200/80"} />
                  <PopFlower color={letter.flowerColor || "mint"} className="w-5 h-5 -ml-3 -mt-2 drop-shadow-xs" rotate={12} />
                </div>

                {/* Top: Silk Ribbon Bow Tie & Postal Mark */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-2">
                    <RibbonBow className="w-8 h-7 text-emerald-400 drop-shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="font-serif font-bold text-xs text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <PopFlower color={letter.flowerColor || "mint"} className="w-3.5 h-3.5" />
                      <span>Truth {letter.roman}</span>
                    </span>
                  </div>

                  <span className="text-[10px] text-[#6e9981] font-sans font-medium">
                    {letter.postmark}
                  </span>
                </div>

                {/* Letter Title & Description */}
                <div className="relative z-10 mb-6">
                  <h3 className="text-2xl font-serif text-[#132e22] mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {letter.title}
                  </h3>
                  <p className="text-xs text-[#3d6350] mb-3 font-medium">{letter.subtitle}</p>
                  <p className="text-xs text-[#55324e] line-clamp-2 italic leading-relaxed font-sans">
                    "{letter.preview}"
                  </p>
                </div>

                {/* Bottom Action Footer with Flower */}
                <div className="relative z-10 pt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between text-xs font-sans">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    {isRead ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Unsealed
                      </>
                    ) : (
                      <>
                        <PopFlower color={letter.flowerColor || "mint"} className="w-4 h-4" /> Sealed with Flower
                      </>
                    )}
                  </span>
                  <span className="text-emerald-600 font-bold group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all">
                    Open letter ♡ →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODE 2: THE ARCHIVE READER */}
      {viewMode === "archive" && (
        <div className="max-w-3xl mx-auto space-y-12 relative z-10 pb-16">
          {LETTERS.map((letter) => (
            <article
              key={letter.id}
              className="bg-white border-2 border-[#bbf7d0] rounded-[32px] p-8 sm:p-12 shadow-card relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#bbf7d0]/60 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FlowerBlossom className="w-4 h-4" />
                    <span className="text-xs font-bold text-emerald-600">
                      Truth {letter.roman} // {letter.date}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif text-[#132e22]">
                    {letter.title}
                  </h3>
                  <p className="text-xs text-[#3d6350] mt-0.5 font-medium">{letter.subtitle}</p>
                </div>

                <RibbonBow className="w-9 h-8 text-emerald-400" />
              </div>

              <div className="font-serif text-lg sm:text-xl text-[#132e22] leading-relaxed whitespace-pre-line space-y-4">
                {letter.content}
              </div>

              <div className="mt-8 pt-6 border-t border-[#bbf7d0]/60 flex items-center justify-between text-xs font-sans text-[#3d6350]">
                <span>From Ajay ♡ Dedicated to Mythri</span>
                <span className="font-script text-2xl text-emerald-600 font-bold">Always yours.</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* READING ROOM MODAL WITH FLOWERS & RIBBONS */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#132e22]/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={closeLetter}
          >
            <motion.div
              initial={{ scale: 0.93, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 25 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-2xl w-full bg-[#fffdfa] border-2 border-emerald-200 rounded-[36px] p-7 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] text-[#132e22]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Ribbon & Controls */}
              <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <RibbonBow className="w-7 h-6 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-700">
                    Truth {selectedLetter.roman} ♡ {selectedLetter.postmark}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
                    className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-sans text-emerald-800 font-bold"
                  >
                    {fontSize === "normal" ? "A+" : "A-"}
                  </button>
                  <button
                    onClick={closeLetter}
                    className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <PopFlower color={selectedLetter.flowerColor || "mint"} className="w-5 h-5" />
                  <p className="text-xs font-semibold text-emerald-600">{selectedLetter.subtitle}</p>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif text-[#132e22]">
                  {selectedLetter.title}
                </h3>
              </div>

              {/* Content */}
              <div
                className={`font-serif text-[#132e22] leading-relaxed whitespace-pre-line space-y-5 ${
                  fontSize === "large" ? "text-xl sm:text-2xl leading-loose" : "text-lg leading-relaxed"
                }`}
              >
                {selectedLetter.content}
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-[#bbf7d0]/70 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-script text-2xl text-emerald-600 font-bold">Always yours,</p>
                  <p className="text-xs font-sans text-[#3d6350]">Ajay ♡ Forever & Always</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevLetter}
                    className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-xs font-sans text-emerald-800 font-bold">
                    {selectedLetter.id} of 7
                  </span>
                  <button
                    onClick={goToNextLetter}
                    className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
