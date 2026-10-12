import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Heart
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  SparkleStar,
  WashiTape
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
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80",
    landingX: 130,
    landingY: 466,
    landingRotate: -28
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
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    landingX: 310,
    landingY: 468,
    landingRotate: 32
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
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    landingX: 165,
    landingY: 476,
    landingRotate: -15
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
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    landingX: 275,
    landingY: 474,
    landingRotate: 18
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
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    landingX: 195,
    landingY: 486,
    landingRotate: -8
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
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    landingX: 245,
    landingY: 488,
    landingRotate: 10
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
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    landingX: 215,
    landingY: 494,
    landingRotate: -3
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
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    landingX: 220,
    landingY: 478,
    landingRotate: 0
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

// Floating stardust embers inside the cloche
const CLOCHE_EMBERS = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  cx: 135 + Math.random() * 170,
  cy: 130 + Math.random() * 260,
  r: Math.random() * 2.2 + 0.8,
  duration: Math.random() * 3 + 3,
  delay: Math.random() * 2
}));

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();

  // Fallen petals state: set of petal IDs that have been plucked
  const [fallenPetals, setFallenPetals] = useState(new Set());
  // Petal currently in mid-air falling animation
  const [activeFallingPetalId, setActiveFallingPetalId] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [rippleActive, setRippleActive] = useState(false);
  const [bloomedRosesEverywhere, setBloomedRosesEverywhere] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  // Pluck a petal: visually detaches with natural fluttering fall, lands on water, and reveals memory
  const handlePluckPetal = (petal) => {
    if (fallenPetals.has(petal.id) || activeFallingPetalId === petal.id) {
      // If already plucked, tapping it opens its story directly
      setActiveStory(petal);
      return;
    }

    // Trigger visual detachment and falling animation
    setActiveFallingPetalId(petal.id);
    setFallenPetals((prev) => new Set(prev).add(petal.id));

    // Stagger opening the memory modal so the user gets to see the petal peel and flutter down
    setTimeout(() => {
      setActiveStory(petal);
      setActiveFallingPetalId(null);
    }, 650);

    // If petal 8 is clicked (the final heart petal):
    if (petal.id === 8) {
      setRippleActive(true);

      setTimeout(() => {
        setBloomedRosesEverywhere(true);
        markSpaceCompleted("02-constellation");

        try {
          confetti({
            particleCount: 120,
            spread: 130,
            origin: { y: 0.6 },
            colors: ["#ef4444", "#f43f5e", "#fda4af", "#fecdd3", "#ffffff"]
          });
        } catch (e) {}
      }, 800);

      setTimeout(() => {
        setShowGrandFinale(true);
      }, 2600);
    }
  };

  const handleReset = () => {
    setFallenPetals(new Set());
    setActiveFallingPetalId(null);
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
                ? `Pluck each petal to let it fall and reveal our story (${remainingPetalCount} petals left) ♡`
                : remainingPetalCount === 1
                ? "Only the 8th heart petal remains... Tap to let it drop ♡"
                : "All eight petals have shed into the sea — a garden of roses blooms ♡"}
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

      {/* 3. The Centerpiece: The Concentric Spiral Chalice Rose Inside Glass Cloche */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Ambient Romantic Halo behind Rose Head */}
        <div className="absolute w-96 h-96 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

        {/* The Realistic Spiral Chalice Rose SVG with Cloche */}
        <div className="relative w-[360px] h-[480px] sm:w-[440px] sm:h-[550px] flex items-center justify-center">
          <svg
            viewBox="0 0 440 520"
            className="w-full h-full drop-shadow-[0_20px_45px_rgba(225,29,72,0.4)] select-none overflow-visible"
          >
            <defs>
              {/* Real Photographic Rose Velvet Texture Fill Pattern */}
              <pattern
                id="realRoseVelvetPattern"
                patternUnits="userSpaceOnUse"
                width="440"
                height="440"
              >
                <image
                  href="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
                  x="40"
                  y="20"
                  width="360"
                  height="360"
                  preserveAspectRatio="xMidYMid slice"
                  opacity="0.88"
                />
              </pattern>

              {/* 3D Drop Shadows for Concentric Overlapping Petals */}
              <filter id="petalShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1a0106" floodOpacity="0.75" />
              </filter>
              <filter id="innerPetalShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#2d020c" floodOpacity="0.8" />
              </filter>

              {/* Authentic Rose Chalice & Whorl Gradients */}
              <radialGradient id="gradChaliceBack" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="35%" stopColor="#9f1239" />
                <stop offset="75%" stopColor="#58081f" />
                <stop offset="100%" stopColor="#24020a" />
              </radialGradient>

              <radialGradient id="gradChaliceSideLeft" cx="30%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="25%" stopColor="#e11d48" />
                <stop offset="60%" stopColor="#9f1239" />
                <stop offset="85%" stopColor="#58081f" />
                <stop offset="100%" stopColor="#24020a" />
              </radialGradient>

              <radialGradient id="gradChaliceSideRight" cx="70%" cy="35%" r="75%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="25%" stopColor="#e11d48" />
                <stop offset="60%" stopColor="#9f1239" />
                <stop offset="85%" stopColor="#58081f" />
                <stop offset="100%" stopColor="#24020a" />
              </radialGradient>

              <radialGradient id="gradGuardFrontLeft" cx="40%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="30%" stopColor="#e11d48" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#3d0311" />
              </radialGradient>

              <radialGradient id="gradGuardFrontRight" cx="60%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="30%" stopColor="#e11d48" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#3d0311" />
              </radialGradient>

              <radialGradient id="gradInnerWhorlLeft" cx="45%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="30%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#5c071d" />
              </radialGradient>

              <radialGradient id="gradInnerWhorlRight" cx="55%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="30%" stopColor="#f43f5e" />
                <stop offset="70%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#5c071d" />
              </radialGradient>

              <radialGradient id="gradCoreSpiral" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="25%" stopColor="#fb7185" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="90%" stopColor="#881337" />
                <stop offset="100%" stopColor="#3d0311" />
              </radialGradient>

              {/* Permanent Underlying Inner Chalice Base (Prevents holes upon plucking) */}
              <radialGradient id="roseBaseGrad" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#be123c" />
                <stop offset="55%" stopColor="#881337" />
                <stop offset="100%" stopColor="#2b020c" />
              </radialGradient>

              {/* Stem & Leaves Botanically Textured Gradients */}
              <linearGradient id="stemNatural" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="25%" stopColor="#16a34a" />
                <stop offset="60%" stopColor="#15803d" />
                <stop offset="85%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>

              <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="45%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>

              <linearGradient id="leafGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#052e16" />
              </linearGradient>

              {/* Water Surface Pond Glow */}
              <radialGradient id="waterSurfaceGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0a192f" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0" />
              </radialGradient>

              {/* Curled Lip Fold-over Highlight Gradient */}
              <linearGradient id="curledLipHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#ffe4e6" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#fb7185" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#be123c" stopOpacity="0.1" />
              </linearGradient>

              {/* Glass Cloche Sheen & Reflection Gradients */}
              <linearGradient id="clocheSheenLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="20%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="clocheSheenRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* A. Reflective Water Pond & Pedestal Base (Where Petals Rest) */}
            <g className="water-base">
              {/* Ornate Gold & Mahogany Pedestal Trim */}
              <ellipse cx="220" cy="482" rx="195" ry="32" fill="#1e1b18" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.6" />
              <ellipse cx="220" cy="480" rx="188" ry="28" fill="#120e0c" stroke="#fbbf24" strokeWidth="0.8" strokeOpacity="0.4" />

              {/* Calm Water Surface Oval */}
              <ellipse
                cx="220"
                cy="470"
                rx="180"
                ry="38"
                fill="url(#waterSurfaceGrad)"
              />
              <ellipse
                cx="220"
                cy="470"
                rx="140"
                ry="22"
                stroke="#60a5fa"
                strokeWidth="0.8"
                strokeOpacity="0.35"
                fill="none"
              />
              <ellipse
                cx="220"
                cy="470"
                rx="85"
                ry="14"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeOpacity="0.3"
                fill="none"
              />
            </g>

            {/* B. Botanical Stem, Thorns, and Compound Leaves */}
            <g className="botanical-foundation">
              {/* Natural Stem with organic curve */}
              <path
                d="M220,240 C216,290 228,355 218,415 C214,440 220,465 220,472"
                stroke="url(#stemNatural)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cylindrical shadow edge */}
              <path
                d="M217,245 C213,292 225,357 215,417 C211,442 217,465 217,472"
                stroke="#052e16"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />

              {/* Realistic Rose Thorns */}
              {/* Left Thorn */}
              <path
                d="M215,310 C202,314 194,324 192,330 C200,328 214,324 216,322 Z"
                fill="#881337"
                stroke="#052e16"
                strokeWidth="0.8"
              />
              {/* Right Thorn */}
              <path
                d="M222,390 C234,394 242,404 245,410 C236,408 223,404 221,402 Z"
                fill="#881337"
                stroke="#052e16"
                strokeWidth="0.8"
              />

              {/* Left Compound Rose Leaf with Botanical Veins */}
              <g>
                <path
                  d="M215,335 C185,315 155,305 130,325 C115,340 120,360 145,372 C175,385 205,365 215,335 Z"
                  fill="url(#leafGradLeft)"
                  stroke="#052e16"
                  strokeWidth="1.8"
                />
                <path
                  d="M215,335 C185,340 155,350 135,345"
                  stroke="#86efac"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                  fill="none"
                />
                <path d="M195,338 L188,326 M180,344 L170,330 M165,350 L152,340" stroke="#86efac" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
                <path d="M195,338 L192,352 M180,344 L178,362 M165,350 L160,366" stroke="#86efac" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
              </g>

              {/* Right Compound Rose Leaf with Botanical Veins */}
              <g>
                <path
                  d="M222,365 C252,345 282,335 307,355 C322,370 317,390 292,402 C262,415 232,395 222,365 Z"
                  fill="url(#leafGradRight)"
                  stroke="#052e16"
                  strokeWidth="1.8"
                />
                <path
                  d="M222,365 C252,370 282,380 302,375"
                  stroke="#86efac"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                  fill="none"
                />
                <path d="M242,368 L248,356 M257,374 L267,360 M272,380 L285,370" stroke="#86efac" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
                <path d="M242,368 L245,382 M257,374 L260,392 M272,380 L277,396" stroke="#86efac" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
              </g>

              {/* Receptacle & Calyx Sepals (The botanical cup holding the flower base) */}
              <ellipse cx="220" cy="255" rx="16" ry="12" fill="url(#stemNatural)" />
              {/* 5 Sepals curling around the cupped flower base */}
              <path d="M208,255 C185,268 165,290 156,306 C168,290 192,272 212,262 Z" fill="#15803d" stroke="#052e16" strokeWidth="0.8" />
              <path d="M232,255 C255,268 275,290 284,306 C272,290 248,272 228,262 Z" fill="#166534" stroke="#052e16" strokeWidth="0.8" />
              <path d="M202,258 C190,278 182,302 178,320 C186,302 198,280 208,264 Z" fill="#15803d" />
              <path d="M238,258 C250,278 258,302 262,320 C254,302 242,280 232,264 Z" fill="#166534" />
              <path d="M220,262 C218,282 216,308 220,330 C224,308 222,282 220,262 Z" fill="#14532d" />
            </g>

            {/* C. Permanent Underlying Inner Rose Base (Prevents a hollow hole when outer petals fall) */}
            <g className="inner-rose-receptacle">
              <path
                d="M220,135 C170,130 155,230 220,252 C285,230 270,130 220,135 Z"
                fill="url(#roseBaseGrad)"
                opacity="0.95"
              />
              <path
                d="M220,150 C185,150 180,220 220,238 C260,220 255,150 220,150 Z"
                fill="#700c25"
                opacity="0.85"
              />
            </g>

            {/* ========================================================= */}
            {/* D. THE 8 CONCENTRIC SPIRAL CHALICE VELVET PETALS */}
            {/* (Authentic Rose Cup & Vortex — NEVER a flat Hibiscus!) */}
            {/* ========================================================= */}

            {/* PETAL 5: Back Chalice Wall (Forms the upper back cup of the rose) */}
            {!fallenPetals.has(5) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[4])}
                className="cursor-pointer group"
                filter="url(#petalShadow3D)"
              >
                {/* Photographic Velvet Texture */}
                <path
                  d="M150,155 C150,115 180,95 220,95 C260,95 290,115 290,155 C290,195 260,225 220,225 C180,225 150,195 150,155 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.8"
                />
                {/* Shading Overlay */}
                <path
                  d="M150,155 C150,115 180,95 220,95 C260,95 290,115 290,155 C290,195 260,225 220,225 C180,225 150,195 150,155 Z"
                  fill="url(#gradChaliceBack)"
                  opacity="0.9"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_18px_rgba(244,63,94,0.75)]"
                />
                {/* Curled top rim folding forward */}
                <path
                  d="M165,115 C190,100 220,98 250,100 C275,115 272,122 250,108 C220,105 190,108 165,115 Z"
                  fill="url(#curledLipHighlight)"
                />
              </g>
            )}

            {/* PETAL 4: Right-Rear Wrapping Cup */}
            {!fallenPetals.has(4) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[3])}
                className="cursor-pointer group"
                filter="url(#petalShadow3D)"
              >
                {/* Petal contour cupping the right flank */}
                <path
                  d="M210,120 C250,115 295,135 305,175 C315,215 285,248 240,248 C215,248 205,210 210,120 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.78"
                />
                <path
                  d="M210,120 C250,115 295,135 305,175 C315,215 285,248 240,248 C215,248 205,210 210,120 Z"
                  fill="url(#gradChaliceSideRight)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_18px_rgba(244,63,94,0.75)]"
                />
                {/* Curled upper right lip */}
                <path
                  d="M250,125 C280,135 302,158 305,175 C298,162 278,142 250,132 Z"
                  fill="url(#curledLipHighlight)"
                />
              </g>
            )}

            {/* PETAL 3: Left-Rear Wrapping Cup */}
            {!fallenPetals.has(3) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[2])}
                className="cursor-pointer group"
                filter="url(#petalShadow3D)"
              >
                {/* Petal contour cupping the left flank */}
                <path
                  d="M230,120 C190,115 145,135 135,175 C125,215 155,248 200,248 C225,248 235,210 230,120 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.78"
                />
                <path
                  d="M230,120 C190,115 145,135 135,175 C125,215 155,248 200,248 C225,248 235,210 230,120 Z"
                  fill="url(#gradChaliceSideLeft)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_18px_rgba(244,63,94,0.75)]"
                />
                {/* Curled upper left lip */}
                <path
                  d="M190,125 C160,135 138,158 135,175 C142,162 162,142 190,132 Z"
                  fill="url(#curledLipHighlight)"
                />
              </g>
            )}

            {/* PETAL 2: Outer Front-Right Guard Chalice Petal */}
            {!fallenPetals.has(2) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[1])}
                className="cursor-pointer group"
                filter="url(#petalShadow3D)"
              >
                {/* Broad cupped chalice contour */}
                <path
                  d="M210,165 C265,155 320,185 315,235 C310,268 265,275 220,265 C205,255 200,210 210,165 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.82"
                />
                <path
                  d="M210,165 C265,155 320,185 315,235 C310,268 265,275 220,265 C205,255 200,210 210,165 Z"
                  fill="url(#gradGuardFrontRight)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]"
                />
                {/* Luxurious curled outward rim */}
                <path
                  d="M230,172 C275,168 312,192 315,235 C305,212 270,185 230,178 Z"
                  fill="url(#curledLipHighlight)"
                />
                {/* Realistic Glistening Dewdrop */}
                <g transform="translate(295, 220)">
                  <ellipse cx="0" cy="1" rx="4.5" ry="3" fill="#1f0208" opacity="0.65" />
                  <ellipse cx="0" cy="0" rx="4" ry="2.6" fill="#fda4af" opacity="0.85" />
                  <circle cx="-1" cy="-0.6" r="1.1" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* PETAL 1: Outer Front-Left Guard Chalice Petal (Cradles the flower from below) */}
            {!fallenPetals.has(1) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[0])}
                className="cursor-pointer group"
                filter="url(#petalShadow3D)"
              >
                {/* Broad cupped chalice contour */}
                <path
                  d="M230,165 C175,155 120,185 125,235 C130,268 175,275 220,265 C235,255 240,210 230,165 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.82"
                />
                <path
                  d="M230,165 C175,155 120,185 125,235 C130,268 175,275 220,265 C235,255 240,210 230,165 Z"
                  fill="url(#gradGuardFrontLeft)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]"
                />
                {/* Luxurious curled outward rim */}
                <path
                  d="M210,172 C165,168 128,192 125,235 C135,212 170,185 210,178 Z"
                  fill="url(#curledLipHighlight)"
                />
                {/* Realistic Glistening Dewdrop */}
                <g transform="translate(145, 220)">
                  <ellipse cx="0" cy="1" rx="4.5" ry="3" fill="#1f0208" opacity="0.65" />
                  <ellipse cx="0" cy="0" rx="4" ry="2.6" fill="#fda4af" opacity="0.85" />
                  <circle cx="-1" cy="-0.6" r="1.1" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* PETAL 6: Mid Inner Left Whorl (Wraps the inner bud cone from the left) */}
            {!fallenPetals.has(6) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[5])}
                className="cursor-pointer group"
                filter="url(#innerPetalShadow3D)"
              >
                {/* Wrapping spiral contour */}
                <path
                  d="M215,142 C175,152 165,215 212,236 C225,228 222,185 215,142 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.8"
                />
                <path
                  d="M215,142 C175,152 165,215 212,236 C225,228 222,185 215,142 Z"
                  fill="url(#gradInnerWhorlLeft)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_18px_rgba(244,63,94,0.75)]"
                />
                {/* Curled Lip */}
                <path
                  d="M182,155 C186,195 204,226 212,236 C206,224 192,198 188,162 Z"
                  fill="url(#curledLipHighlight)"
                  opacity="0.85"
                />
              </g>
            )}

            {/* PETAL 7: Mid Inner Right Whorl (Wraps the inner bud cone from the right) */}
            {!fallenPetals.has(7) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[6])}
                className="cursor-pointer group"
                filter="url(#innerPetalShadow3D)"
              >
                {/* Wrapping spiral contour */}
                <path
                  d="M225,142 C265,152 275,215 228,236 C215,228 218,185 225,142 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.8"
                />
                <path
                  d="M225,142 C265,152 275,215 228,236 C215,228 218,185 225,142 Z"
                  fill="url(#gradInnerWhorlRight)"
                  opacity="0.88"
                  className="transition-all duration-300 group-hover:brightness-115 group-hover:drop-shadow-[0_0_18px_rgba(244,63,94,0.75)]"
                />
                {/* Curled Lip */}
                <path
                  d="M258,155 C254,195 236,226 228,236 C234,224 248,198 252,162 Z"
                  fill="url(#curledLipHighlight)"
                  opacity="0.85"
                />
              </g>
            )}

            {/* PETAL 8: The Core Heart Spiral Vortex (The Iconic Rosebud Center!) */}
            {!fallenPetals.has(8) && (
              <g
                onClick={() => handlePluckPetal(ROSE_PETALS[7])}
                className="cursor-pointer group"
                filter="url(#innerPetalShadow3D)"
              >
                {/* Golden & Crimson Ambient Warmth */}
                <circle cx="220" cy="180" r="32" fill="rgba(244,63,94,0.35)" className="animate-pulse" />

                {/* Core Tight Bud Shell with Photographic Texture */}
                <path
                  d="M220,146 C186,156 190,215 220,220 C250,215 254,156 220,146 Z"
                  fill="url(#realRoseVelvetPattern)"
                  opacity="0.85"
                />
                <path
                  d="M220,146 C186,156 190,215 220,220 C250,215 254,156 220,146 Z"
                  fill="url(#gradCoreSpiral)"
                  opacity="0.9"
                  className="transition-all duration-300 group-hover:scale-105 group-hover:brightness-120 group-hover:drop-shadow-[0_0_22px_rgba(255,228,230,0.95)]"
                />

                {/* Iconic Interlocking Rosebud Spiral Whorls */}
                <path
                  d="M212,168 C206,154 234,154 228,168 C224,188 210,188 214,176"
                  stroke="#fff1f2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M216,186 Q220,198 224,186"
                  stroke="#fecdd3"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M220,160 C228,165 226,180 218,184"
                  stroke="#ffe4e6"
                  strokeWidth="1.4"
                  fill="none"
                />

                {/* Specular Glint Star on the Heart Petal */}
                <circle cx="220" cy="180" r="3" fill="#ffffff" className="animate-ping" style={{ animationDuration: "2.5s" }} />
                <circle cx="220" cy="180" r="2.5" fill="#ffffff" />
              </g>
            )}

            {/* ========================================================= */}
            {/* E. RESTING FALLEN PETALS FLOATING IN THE WATER AT THE BASE */}
            {/* ========================================================= */}
            <g className="resting-fallen-petals">
              {ROSE_PETALS.map((petal) => {
                if (!fallenPetals.has(petal.id) || activeFallingPetalId === petal.id) return null;

                return (
                  <g
                    key={`resting-${petal.id}`}
                    transform={`translate(${petal.landingX}, ${petal.landingY}) rotate(${petal.landingRotate})`}
                    onClick={() => setActiveStory(petal)}
                    className="cursor-pointer group"
                  >
                    {/* Water Contact Ripple Ring */}
                    <ellipse
                      cx="0"
                      cy="4"
                      rx="26"
                      ry="8"
                      stroke="#fda4af"
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                      fill="none"
                    />

                    {/* Resting Petal Silhouette with Photographic Velvet */}
                    <path
                      d="M0,-14 C18,-6 24,12 0,16 C-24,12 -18,-6 0,-14 Z"
                      fill="url(#realRoseVelvetPattern)"
                    />
                    <path
                      d="M0,-14 C18,-6 24,12 0,16 C-24,12 -18,-6 0,-14 Z"
                      fill="url(#gradGuardFrontRight)"
                      opacity="0.85"
                      stroke="#fecdd3"
                      strokeWidth="1.2"
                      className="transition-transform duration-300 group-hover:scale-125 group-hover:brightness-120"
                    />
                    <path
                      d="M0,-14 Q0,2 0,16"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                      strokeOpacity="0.6"
                      fill="none"
                    />

                    {/* Subtle floating glow */}
                    <circle cx="0" cy="0" r="12" fill="rgba(244,63,94,0.2)" className="group-hover:fill-rose-500/40 transition-colors" />
                  </g>
                );
              })}
            </g>

            {/* ========================================================= */}
            {/* F. ACTIVE FALLING PETAL FLUTTERING DOWN TO THE WATER */}
            {/* ========================================================= */}
            {activeFallingPetalId && (() => {
              const petal = ROSE_PETALS.find((p) => p.id === activeFallingPetalId);
              if (!petal) return null;

              // Starting coordinate depending on which petal is plucked
              const startX = petal.id % 2 === 1 ? 190 : 250;
              const startY = petal.id <= 4 ? 180 : 160;

              return (
                <motion.g
                  key={`falling-${petal.id}`}
                  initial={{
                    x: startX,
                    y: startY,
                    rotate: 0,
                    scale: 1,
                    opacity: 1
                  }}
                  animate={{
                    x: [startX, startX + (petal.id % 2 === 1 ? -38 : 38), startX + (petal.id % 2 === 1 ? 18 : -18), petal.landingX],
                    y: [startY, startY + 80, startY + 180, petal.landingY],
                    rotate: [0, petal.id % 2 === 1 ? -48 : 48, petal.id % 2 === 1 ? 28 : -28, petal.landingRotate],
                    scale: [1, 0.98, 0.95, 0.92],
                    opacity: [1, 1, 0.95, 0.9]
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="pointer-events-none"
                >
                  <path
                    d="M0,-18 C25,-8 32,16 0,22 C-32,16 -25,-8 0,-18 Z"
                    fill="url(#realRoseVelvetPattern)"
                  />
                  <path
                    d="M0,-18 C25,-8 32,16 0,22 C-32,16 -25,-8 0,-18 Z"
                    fill="url(#gradGuardFrontRight)"
                    opacity="0.88"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    filter="drop-shadow(0 6px 12px rgba(225,29,72,0.6))"
                  />
                  <path
                    d="M0,-18 Q0,2 0,22"
                    stroke="#ffe4e6"
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                    fill="none"
                  />
                </motion.g>
              );
            })()}

            {/* ========================================================= */}
            {/* G. ENCHANTED GLASS BELL JAR (CLOCHE) SHEEN & STARDUST */}
            {/* ========================================================= */}
            <g className="enchanted-cloche pointer-events-none">
              {/* Glass Cloche Outline */}
              <path
                d="M100,470 L100,210 C100,100 340,100 340,210 L340,470"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
                fill="none"
              />
              {/* Inner ambient glass reflection */}
              <path
                d="M100,470 L100,210 C100,100 340,100 340,210 L340,470 Z"
                fill="rgba(255,255,255,0.02)"
              />
              {/* Left Curved Glass Sheen */}
              <path
                d="M104,465 L104,215 C104,130 180,108 210,105 C160,118 116,160 116,220 L116,465 Z"
                fill="url(#clocheSheenLeft)"
              />
              {/* Right Curved Glass Sheen */}
              <path
                d="M336,465 L336,215 C336,130 260,108 230,105 C280,118 324,160 324,220 L324,465 Z"
                fill="url(#clocheSheenRight)"
              />
              {/* Ornate Glass Finial Knob at top of Dome */}
              <circle cx="220" cy="98" r="8" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              <circle cx="218" cy="96" r="2.5" fill="#ffffff" />

              {/* Floating Golden Stardust Embers inside Cloche */}
              {CLOCHE_EMBERS.map((ember) => (
                <circle
                  key={`ember-${ember.id}`}
                  cx={ember.cx}
                  cy={ember.cy}
                  r={ember.r}
                  fill="#fef08a"
                  opacity="0.75"
                  className="animate-pulse"
                  style={{ animationDuration: `${ember.duration}s`, animationDelay: `${ember.delay}s` }}
                />
              ))}
            </g>
          </svg>

          {/* Water Ripple Shockwave on 8th Petal Drop */}
          <AnimatePresence>
            {rippleActive && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                {[0, 0.2, 0.4, 0.6].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ width: 10, height: 10, opacity: 1 }}
                    animate={{
                      width: [10, 800, 1600],
                      height: [10, 400, 800],
                      opacity: [0.95, 0.6, 0]
                    }}
                    transition={{ duration: 2.4, delay, ease: "easeOut" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-300/80 shadow-[0_0_50px_rgba(244,63,94,0.9)]"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt Cue Below the Rose */}
        <div className="mt-2 text-center z-20">
          <p className="text-xs font-serif italic text-rose-200/90 tracking-wide">
            {remainingPetalCount > 1
              ? "Touch any petal on the enchanted rose — watch it fall into the water and reveal its story ♡"
              : remainingPetalCount === 1
              ? "The final heart petal holds our infinity... Tap it to let it drop ♡"
              : "All 8 petals rest peacefully in the water. Click any floating petal to re-read its memory ♡"}
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
                  scale: [0, 1.25, 1],
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
                {/* Realistic Blooming Rose SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="44" fill="#881337" opacity="0.9" />
                  <path
                    d="M50,12 C28,28 22,62 45,88 C68,62 72,28 50,12 Z"
                    fill="#be123c"
                  />
                  <path
                    d="M18,45 C32,22 68,22 82,45 C68,78 32,78 18,45 Z"
                    fill="#e11d48"
                  />
                  <circle cx="50" cy="50" r="18" fill="#fb7185" />
                  <path
                    d="M44,46 C42,40 56,40 54,46 C52,54 44,54 44,48"
                    stroke="#fff1f2"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="50" cy="50" r="4" fill="#ffffff" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 5. Floating Bottom Navigation & Guidance */}
      <div className="relative z-20 pb-4 text-center text-xs text-rose-200/70 font-sans">
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
