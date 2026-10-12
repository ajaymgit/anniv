import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  SparkleStar,
  PopFlower
} from "../components/common/GirlyPopDecorations";

// The 8 Petals & Stories of the Rose
export const ROSE_PETALS = [
  {
    id: 1,
    order: 1,
    name: "Outer Petal I",
    title: "Where Two Aries Collided",
    yearBadge: "Year 01 // 2019",
    date: "October 2019 // The First Spark",
    summary: "Two headstrong souls who found their equal in each other.",
    story: `There was an instant, unspoken recognition between us from the very first talk. 

Two stubborn, fiery Aries who normally guard their independence fiercely—suddenly wanting to stay in the exact same room, talking for hours without running out of things to say. 

You weren't like anyone else I had ever met. You carried this fierce, quiet authenticity that immediately broke through all my defenses. That first spark wasn't just a moment; it was the foundation of our entire story.`,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    order: 2,
    name: "Outer Petal II",
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    date: "Year 02 // City Nights",
    summary: "Riding through rain at 1 AM with your arms around me.",
    story: `Some of my favorite memories with you don't cost a single rupee.

Like riding through torrential night rain when neither of us had any business being on the road. Water dripping from our helmets and soaking through our jackets, cold winds whipping past, and your hands tucked tightly into my pockets.

In that quiet midnight city, with nobody else around, I realized I would ride anywhere in the world as long as you were sitting behind me.`,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    order: 3,
    name: "Outer Petal III",
    title: "The Corner Table & Crispy Fries",
    yearBadge: "Year 03 // 2021",
    date: "Year 03 // Favorite Café",
    summary: "Four hours passing like four minutes across a wooden table.",
    story: `Sitting across from you over iced coffees, watching the afternoon light shift into evening.

Splitting an order of extra crispy fries and silently leaving the crunchiest one at the bottom for you. The way we could talk about the most absurd, ridiculous thoughts one minute, and dive into our deepest family vulnerabilities the next.

With you, there was never any awkward silence—only comfort so deep it felt like breathing.`,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    order: 4,
    name: "Outer Petal IV",
    title: "Learning Your Quiet Cadence",
    yearBadge: "Year 04 // 2022",
    date: "Year 04 // Inside Jokes",
    summary: "Understanding your silence and laughing through stubborn UNO rivalries.",
    story: `By year four, love was no longer a question—it had become our second nature.

I learned the subtle signs of when you were exhausted before you said a word. I learned how your laughter could instantly dismantle a bad day, and how seriously you take an UNO Draw 4 card.

We learned how to forgive quickly, how to tease gently, and how to hold space for each other when life felt heavy. You became my safest harbor.`,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    order: 5,
    name: "Inner Petal V",
    title: "Your Fierce, Unshakable Heart",
    yearBadge: "Year 05 // 2023",
    date: "Year 05 // Benchmark of Integrity",
    summary: "The quiet courage and fierce loyalty that defines who you are.",
    story: `The thing I admire most about you is how unconditionally you stand by the people you love.

You never perform kindness for an audience. When someone is hurting, you show up. When things are difficult, you set your jaw, figure out what needs to be done, and do it with grace.

In five years of watching you grow, my respect for your character only deepened. You are the standard of integrity and honesty in my life.`,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    order: 6,
    name: "Inner Petal VI",
    title: "Counting Gates & Time Zones",
    yearBadge: "Year 06 // 2024",
    date: "Year 06 // The Distance Anchor",
    summary: "Counting down airport gates, knowing distance could never dilute us.",
    story: `Distance tests everything. It tests patience, routines, and endurance.

Yet across busy schedules, departures, and counting down the days until we could sit in the same room again, our bond never wavered. Every late-night call and every countdown proved what we always knew:

Physical miles could never dilute what we built. We were anchored in each other long before the miles appeared.`,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    order: 7,
    name: "Inner Petal VII",
    title: "Unshakable Home",
    yearBadge: "Year 07 // 2025",
    date: "Year 07 // The Sanctuary",
    summary: "In a chaotic noisy world, you are the peace I always come home to.",
    story: `At the end of an exhausting week, when the world demands too much and everything feels noisy—just sitting beside you cuts through all the static.

You don't need to give advice or solve my problems. Just resting your head on my shoulder or holding my hand reminds me of who I am.

In seven years, you turned love from a fleeting feeling into a permanent home.`,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    order: 8,
    name: "The Core Heart Petal",
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "October 2026 // Today & Forever",
    date: "Forever & Always",
    summary: "The final petal that blooms an entire garden of roses for you.",
    story: `This is the heart of the rose, and the center of my life.

I chose you seven years ago on a quiet evening, and I have chosen you every single morning since. 

There is no version of my future, no dream I want to build, and no horizon I look toward that doesn't have you standing by my side. Seven years of us was just the prologue.

To our next seven, our next seventy, and a lifetime of roses blooming for you. Happy 7th Anniversary, Mythri ♡`,
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
  }
];

// Pre-generated blooming rose coordinates for the grand finale ripple
const BLOOMING_ROSES = Array.from({ length: 36 }).map((_, i) => ({
  id: i,
  x: `${(i % 6) * 16 + (Math.random() * 8 + 4)}%`,
  y: `${Math.floor(i / 6) * 15 + (Math.random() * 8 + 6)}%`,
  size: Math.floor(Math.random() * 24 + 32),
  rotation: Math.floor(Math.random() * 360),
  delay: (i * 0.05) + Math.random() * 0.2
}));

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();

  // Fallen petals state: set of petal IDs that have been plucked
  const [fallenPetals, setFallenPetals] = useState(new Set());
  const [activeStory, setActiveStory] = useState(null);
  const [rippleActive, setRippleActive] = useState(false);
  const [bloomedRosesEverywhere, setBloomedRosesEverywhere] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  // Pluck a petal and read its story
  const handlePluckPetal = (petal) => {
    // If petal 8 is clicked:
    if (petal.id === 8) {
      // Trigger the 8th petal drop & massive ripple sequence!
      setFallenPetals((prev) => new Set(prev).add(8));
      setActiveStory(petal);
      setRippleActive(true);

      // Sound & dramatic ripple burst
      setTimeout(() => {
        setBloomedRosesEverywhere(true);
        markSpaceCompleted("02-constellation");

        try {
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.6 },
            colors: ["#ef4444", "#f43f5e", "#fda4af", "#fecdd3", "#ffffff"]
          });
        } catch (e) {}
      }, 700);

      setTimeout(() => {
        setShowGrandFinale(true);
      }, 2500);
      return;
    }

    // Normal petal 1 to 7 pluck
    setFallenPetals((prev) => new Set(prev).add(petal.id));
    setActiveStory(petal);
  };

  const handleReset = () => {
    setFallenPetals(new Set());
    setActiveStory(null);
    setRippleActive(false);
    setBloomedRosesEverywhere(false);
    setShowGrandFinale(false);
  };

  const nextStory = () => {
    if (!activeStory) return;
    const curIdx = ROSE_PETALS.findIndex((p) => p.id === activeStory.id);
    const nextIdx = (curIdx + 1) % ROSE_PETALS.length;
    setActiveStory(ROSE_PETALS[nextIdx]);
  };

  const prevStory = () => {
    if (!activeStory) return;
    const curIdx = ROSE_PETALS.findIndex((p) => p.id === activeStory.id);
    const prevIdx = curIdx === 0 ? ROSE_PETALS.length - 1 : curIdx - 1;
    setActiveStory(ROSE_PETALS[prevIdx]);
  };

  const remainingPetalCount = 8 - fallenPetals.size;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#070e17] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 1. Starry Night Atmospheric Backdrop (Softly Muted for the Rose) */}
      <img
        src="/starry-night.jpg"
        alt="Starry Night Backdrop"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none pointer-events-none filter blur-[1px]"
      />

      {/* Atmospheric Dark Velvet Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b13]/85 via-[#08121f]/75 to-[#04080e]/95 pointer-events-none" />

      {/* 2. Floating Top Header Overlay */}
      <div className="relative z-30 pt-6 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4 pointer-events-none max-w-6xl mx-auto w-full">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
          <RibbonBow className="w-6 h-5 text-rose-300 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base text-rose-100 font-bold">
                Chapter 2 // The Rose of Seven Years
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#fda4af" centerColor="#fecdd3" />
            </div>
            <p className="text-[11px] text-rose-200/80 font-sans mt-0.5">
              {remainingPetalCount > 1
                ? `Pluck each petal to uncover our stories (${remainingPetalCount} petals remaining) ♡`
                : remainingPetalCount === 1
                ? "Only the 8th heart petal remains... Tap to let it fall ♡"
                : "The 8th petal has fallen — a sea of roses blooms for you ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Button */}
          {fallenPetals.size > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-rose-200 hover:text-white transition-colors shadow-xl cursor-pointer"
              title="Reset Rose"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Petal Progress Pill */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-xs font-sans text-rose-100 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
            <SparkleStar className="w-3.5 h-3.5 text-rose-300" />
            <span>Petals Plucked:</span>
            <span className="font-mono text-rose-300 font-bold">
              {fallenPetals.size} / 8
            </span>
          </div>
        </div>
      </div>

      {/* 3. The Centerpiece: The Enchanted 8-Petal Rose on Water */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
        {/* Glow Halo behind Rose Head */}
        <div className="absolute w-80 h-80 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

        {/* The Interactive Layered Rose Graphic */}
        <div className="relative w-[340px] h-[400px] sm:w-[400px] sm:h-[460px] flex items-center justify-center">
          <svg
            viewBox="0 0 400 460"
            className="w-full h-full drop-shadow-[0_15px_35px_rgba(225,29,72,0.35)] select-none overflow-visible"
          >
            <defs>
              {/* Petal Rich Velvet Red & Rose Gradients */}
              <radialGradient id="petalGradOuter1" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
              <radialGradient id="petalGradOuter2" cx="60%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </radialGradient>
              <radialGradient id="petalGradInner" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </radialGradient>
              <radialGradient id="petalGradCore" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="35%" stopColor="#fb7185" />
                <stop offset="80%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#166534" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>
            </defs>

            {/* Stem & Leaves (Permanent Foundation) */}
            <path
              d="M200,240 Q190,320 205,430"
              stroke="url(#stemGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Leaf */}
            <path
              d="M195,330 C130,320 110,380 190,360 Z"
              fill="#15803d"
              stroke="#052e16"
              strokeWidth="2"
            />
            {/* Right Leaf */}
            <path
              d="M202,360 C270,350 280,410 206,390 Z"
              fill="#166534"
              stroke="#052e16"
              strokeWidth="2"
            />
            {/* Sepals (Green base calyx) */}
            <path d="M175,245 Q200,270 185,290 Q200,265 200,250 Z" fill="#15803d" />
            <path d="M225,245 Q200,270 215,290 Q200,265 200,250 Z" fill="#166534" />

            {/* ========================================================= */}
            {/* THE 8 INTERACTIVE PETALS */}
            {/* ========================================================= */}

            {/* PETAL 1: Outer Upper Left */}
            <AnimatePresence>
              {!fallenPetals.has(1) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 220,
                    x: -60,
                    rotate: -45,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[0])}
                  className="cursor-pointer transition-all"
                  d="M195,170 C120,90 90,190 165,245 C185,255 198,230 195,170 Z"
                  fill="url(#petalGradOuter1)"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 2: Outer Upper Right */}
            <AnimatePresence>
              {!fallenPetals.has(2) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 220,
                    x: 60,
                    rotate: 45,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[1])}
                  className="cursor-pointer transition-all"
                  d="M205,170 C280,90 310,190 235,245 C215,255 202,230 205,170 Z"
                  fill="url(#petalGradOuter2)"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 3: Outer Lower Left */}
            <AnimatePresence>
              {!fallenPetals.has(3) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 210,
                    x: -80,
                    rotate: -35,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[2])}
                  className="cursor-pointer transition-all"
                  d="M190,200 C110,210 130,270 190,260 C205,255 200,230 190,200 Z"
                  fill="url(#petalGradOuter1)"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 4: Outer Lower Right */}
            <AnimatePresence>
              {!fallenPetals.has(4) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 210,
                    x: 80,
                    rotate: 35,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[3])}
                  className="cursor-pointer transition-all"
                  d="M210,200 C290,210 270,270 210,260 C195,255 200,230 210,200 Z"
                  fill="url(#petalGradOuter2)"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 5: Upper Crown */}
            <AnimatePresence>
              {!fallenPetals.has(5) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 230,
                    x: -20,
                    rotate: -20,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[4])}
                  className="cursor-pointer transition-all"
                  d="M200,165 C145,105 255,105 200,165 Z"
                  fill="url(#petalGradInner)"
                  stroke="#fecdd3"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 6: Mid Left Swirl */}
            <AnimatePresence>
              {!fallenPetals.has(6) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 220,
                    x: -40,
                    rotate: 25,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[5])}
                  className="cursor-pointer transition-all"
                  d="M198,175 C150,145 155,225 198,235 C205,225 202,195 198,175 Z"
                  fill="url(#petalGradInner)"
                  stroke="#fecdd3"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 7: Mid Right Swirl */}
            <AnimatePresence>
              {!fallenPetals.has(7) && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    y: 220,
                    x: 40,
                    rotate: -25,
                    opacity: [1, 0.9, 0],
                    transition: { duration: 1.2, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[6])}
                  className="cursor-pointer transition-all"
                  d="M202,175 C250,145 245,225 202,235 C195,225 198,195 202,175 Z"
                  fill="url(#petalGradInner)"
                  stroke="#fecdd3"
                  strokeWidth="1.5"
                />
              )}
            </AnimatePresence>

            {/* PETAL 8: The Center Heart Core (The Climax Petal!) */}
            <AnimatePresence>
              {!fallenPetals.has(8) && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.06, 1],
                    transition: { scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } }
                  }}
                  exit={{
                    y: 230,
                    rotate: [0, 180, 360],
                    scale: [1, 0.8, 0],
                    opacity: [1, 1, 0],
                    transition: { duration: 1.0, ease: "easeIn" }
                  }}
                  whileHover={{ scale: 1.15, filter: "brightness(1.2)" }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePluckPetal(ROSE_PETALS[7])}
                  className="cursor-pointer"
                >
                  {/* Glowing Heart Petal Aura */}
                  <circle cx="200" cy="195" r="28" fill="rgba(244,63,94,0.35)" className="animate-pulse" />

                  {/* Core Petal Spiral */}
                  <path
                    d="M200,165 C170,175 180,225 200,228 C220,225 230,175 200,165 Z"
                    fill="url(#petalGradCore)"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Subtle inner swirl curl */}
                  <path
                    d="M195,185 Q200,175 205,185 Q200,205 197,195"
                    stroke="#ffe4e6"
                    strokeWidth="1.8"
                    fill="none"
                  />
                  {/* Star glint icon on the 8th petal */}
                  <circle cx="200" cy="195" r="3" fill="#ffffff" />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>

          {/* Water Ripple Shockwave on 8th Petal Drop */}
          <AnimatePresence>
            {rippleActive && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                {[0, 0.25, 0.5, 0.75].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ width: 10, height: 10, opacity: 1 }}
                    animate={{
                      width: [10, 800, 1600],
                      height: [10, 400, 800],
                      opacity: [0.9, 0.6, 0]
                    }}
                    transition={{ duration: 2.2, delay, ease: "easeOut" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-300/80 shadow-[0_0_40px_rgba(244,63,94,0.8)]"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt Cue Below the Rose */}
        <div className="mt-4 text-center z-20">
          <p className="text-xs font-serif italic text-rose-200/90 tracking-wide">
            {remainingPetalCount > 1
              ? "Touch any petal to gently pluck it and reveal its memory ♡"
              : remainingPetalCount === 1
              ? "The final heart petal holds our infinity... Tap it to let it drop ♡"
              : "A sea of blooming roses for Mythri ♡"}
          </p>
        </div>
      </div>

      {/* 4. THE GRAND CLIMAX: ROSES BLOOMING EVERYWHERE! */}
      <AnimatePresence>
        {bloomedRosesEverywhere && (
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {BLOOMING_ROSES.map((rose) => (
              <motion.div
                key={rose.id}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.95],
                  rotate: rose.rotation
                }}
                transition={{
                  duration: 0.9,
                  delay: rose.delay,
                  type: "spring",
                  stiffness: 220,
                  damping: 14
                }}
                style={{
                  left: rose.x,
                  top: rose.y,
                  width: rose.size,
                  height: rose.size
                }}
                className="absolute text-rose-400 drop-shadow-[0_8px_20px_rgba(244,63,94,0.5)]"
              >
                {/* Blooming Rose SVG Icon */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="42" fill="#e11d48" opacity="0.9" />
                  <path
                    d="M50,15 C30,30 25,60 45,85 C65,60 70,30 50,15 Z"
                    fill="#f43f5e"
                  />
                  <path
                    d="M20,45 C35,25 65,25 80,45 C65,75 35,75 20,45 Z"
                    fill="#fb7185"
                  />
                  <circle cx="50" cy="50" r="14" fill="#fda4af" />
                  <circle cx="50" cy="50" r="6" fill="#fff1f2" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 5. Floating Bottom Navigation & Guidance */}
      <div className="relative z-20 pb-5 text-center text-xs text-rose-200/70 font-sans">
        <span>Chapter 2 • Dedicated to Mythri by Ajay // Forever & Always</span>
      </div>

      {/* 6. Story Memory Modal for Plucked Petal */}
      <AnimatePresence>
        {activeStory && !showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              className="max-w-lg w-full bg-[#fffdfa] text-[#132e22] border-2 border-rose-300 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-rose-200/80" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-rose-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FlowerBlossom className="w-4 h-4" petalColor="#fda4af" centerColor="#fecdd3" />
                  <span className="text-xs font-bold text-rose-700 font-sans">
                    {activeStory.name} // {activeStory.yearBadge}
                  </span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden mb-4 border border-rose-200 shadow-sm h-52 bg-rose-50">
                <img
                  src={activeStory.photoUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Title & Date */}
              <h4 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {activeStory.title}
              </h4>
              <p className="text-xs text-rose-600 font-sans font-medium mb-3">
                {activeStory.date}
              </p>

              {/* Story Content */}
              <div className="text-sm font-serif text-[#3d6350] leading-relaxed whitespace-pre-line mb-6 italic max-h-48 overflow-y-auto pr-1">
                {activeStory.story}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between border-t border-rose-200 pt-3 text-xs font-sans">
                <button
                  onClick={prevStory}
                  className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold text-rose-800">
                  Petal {activeStory.order} of 8 Plucked
                </span>

                <button
                  onClick={nextStory}
                  className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Grand Finale Reveal Modal When All 8 Petals Have Fallen */}
      <AnimatePresence>
        {showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-[#fffdfa] text-[#132e22] border-4 border-rose-300 rounded-[36px] p-8 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="flex justify-center mb-3">
                <RibbonBow className="w-12 h-10 text-rose-400 drop-shadow-sm" />
              </div>

              <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase block mb-1">
                ALL EIGHT PETALS HAVE SHED INTO THE SEA
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#132e22] mb-3">
                A Garden of Roses For You
              </h3>
              <p className="text-sm font-serif text-[#3d6350] leading-relaxed italic mb-6">
                "Each petal was a year we lived through. And when the heart of the rose fell, it didn't end—it sent ripples across the water, blooming a thousand more roses. I will love you through every season, Mythri."
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowGrandFinale(false)}
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-sans transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Admire the Blooming Sea of Roses ♡
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs font-sans transition-colors cursor-pointer"
                >
                  Re-bloom the Rose from the Start
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
