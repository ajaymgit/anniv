import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Sparkles,
  Heart,
  CheckCircle2,
  Coffee,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape, PopFlower } from "../common/GirlyPopDecorations";

// 4 Signature Milestone Stops along the midnight route
const MILESTONE_STOPS = [
  {
    pct: 25,
    tag: "Stop 01 · Year 01",
    title: "First Coffee Under the Rain",
    subtitle: "The Awkward Corner Table",
    desc: "That first nervous coffee meetup where rain beat against the glass and hours flew by like ten minutes. We both knew right then that this wasn't just a regular coffee.",
    icon: "☕",
    tokenName: "The Coffee Keepsake",
    spotlightImg: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=400&q=80"
  },
  {
    pct: 50,
    tag: "Stop 02 · Year 03",
    title: "The 3 AM Heart-to-Heart",
    subtitle: "Engine Cut & City Asleep",
    desc: "Parked by the quiet curb with the headlights turned off, talking about our dreams, our fears, and everything in between until 3:00 AM. Neither of us wanted to go home.",
    icon: "🌙",
    tokenName: "The Midnight Confession",
    spotlightImg: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80"
  },
  {
    pct: 75,
    tag: "Stop 03 · Year 05",
    title: "1 AM Midnight Snack Feast",
    subtitle: "Fries & Extra Ketchup",
    desc: "Steaming hot crispy fries eaten straight out of the paper bag while sitting together on the scooter seat. Mythri claimed she wasn't hungry, then ate 80% of them.",
    icon: "🍟",
    tokenName: "The Secret Snack Crest",
    spotlightImg: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80"
  },
  {
    pct: 100,
    tag: "Destination · Year 07",
    title: "Holding Onto Forever",
    subtitle: "My Forever Co-Pilot",
    desc: "Seven whole years of winding roads, empty streets, and you holding onto me tight around every turn. The destination was always you.",
    icon: "💖",
    tokenName: "The 7-Year Golden Key",
    spotlightImg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
  }
];

export default function MidnightRide({ onComplete, customMemories }) {
  // If customMemories provided from settings, use their titles/descriptions where appropriate
  const stops = MILESTONE_STOPS.map((stop, idx) => {
    if (customMemories && customMemories[idx]) {
      return {
        ...stop,
        title: customMemories[idx].title || stop.title,
        desc: customMemories[idx].desc || stop.desc,
        spotlightImg: customMemories[idx].photo || stop.spotlightImg
      };
    }
    return stop;
  });

  const [progress, setProgress] = useState(0); // 0 to 100
  const [isCruising, setIsCruising] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [tokensCollected, setTokensCollected] = useState([]);
  const [activeStop, setActiveStop] = useState(null);
  const [treatsCount, setTreatsCount] = useState(0);
  const [honkMessage, setHonkMessage] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [strayDogState, setStrayDogState] = useState("wagging"); // wagging, happy

  const cruisingRef = useRef(false);
  cruisingRef.current = isCruising;

  // Key event listeners for cruising (Space / ArrowRight / D) and honking (H / Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (activeStop || isFinished) return;

      if (e.code === "Space" || e.code === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        setIsCruising(true);
      }
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        handleHonk();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowRight" || e.key === "d" || e.key === "D") {
        setIsCruising(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeStop, isFinished]);

  // Game loop: drive forward when cruising
  useEffect(() => {
    if (!isCruising || activeStop || isFinished) {
      setSpeed(0);
      return;
    }

    setSpeed(42);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 0.5);

        // Check if we hit a milestone stop
        for (const stop of stops) {
          if (
            Math.abs(next - stop.pct) < 0.6 &&
            !tokensCollected.includes(stop.pct)
          ) {
            setIsCruising(false);
            setActiveStop(stop);
            sounds.playSuccess();
            return stop.pct;
          }
        }

        // Random treat collection while cruising
        if (Math.random() < 0.08) {
          setTreatsCount((c) => c + 1);
          sounds.playCrystalTap(Math.floor(Math.random() * 5));
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isCruising, activeStop, isFinished, tokensCollected]);

  const handleHonk = () => {
    sounds.playHonk();
    setStrayDogState("happy");
    const dogReplies = [
      "BEEP BEEP! 🛵 The street puppy wagged its tail! 🐶♡",
      "Honk! 🐶 The puppy did a little happy spin!",
      "Beep! Mythri giggled and held on tighter! 💖",
      "Scooter horn! The cold midnight breeze feels so good 💨"
    ];
    const picked = dogReplies[Math.floor(Math.random() * dogReplies.length)];
    setHonkMessage(picked);
    setTreatsCount((c) => c + 1);

    setTimeout(() => {
      setHonkMessage(null);
      setStrayDogState("wagging");
    }, 2400);
  };

  const handleCollectStopToken = () => {
    if (!activeStop) return;
    sounds.playSuccess();
    setTokensCollected((prev) => [...prev, activeStop.pct]);

    if (activeStop.pct === 100) {
      setActiveStop(null);
      setIsFinished(true);
      sounds.playVictoryFanfare();
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setActiveStop(null);
    }
  };

  const currentStopIndex = stops.findIndex((s) => s.pct === activeStop?.pct);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center font-sans select-none px-2 sm:px-4">
      {/* Header Info */}
      <div className="text-center mb-3 sm:mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-2 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 1 · Puzzle 05 ♡ The Midnight Ride</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#132e22] tracking-tight">
          The Midnight Two-Wheeler Ride
        </h2>
        <p className="text-xs text-[#3d6350] mt-1 max-w-md mx-auto leading-relaxed">
          Mythri holding onto Ajay tight through the empty night streets. Cruise together, collect treats, honk at cute puppies, and visit all 4 memory stops!
        </p>
      </div>

      {/* Main Game Stage Container */}
      <div className="w-full bg-white border-2 border-[#bbf7d0] rounded-[32px] p-4 sm:p-6 shadow-card relative overflow-hidden">
        {/* Washi Tape Decor */}
        <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
          <WashiTape className="w-20 h-4.5 opacity-75" color="bg-emerald-200/80" />
        </div>
        <div className="absolute -top-1.5 left-8 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-purple-200/80" />
        </div>

        {/* Dashboard Top Stats */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🛵</span>
            <span className="font-semibold text-emerald-900 font-mono text-[11px] sm:text-xs">
              {progress >= 100 ? "ARRIVED ♡" : `${speed > 0 ? "42 km/h" : "Parked"} · ${(progress * 0.07).toFixed(1)} km`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#3d6350]">
              <span>🍟</span>
              <span className="font-bold text-emerald-800">{treatsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <span>🗝️</span>
              <span>{tokensCollected.length} / 4 Tokens</span>
            </div>
          </div>
        </div>

        {/* Progress Route Map */}
        <div className="relative w-full h-8 mb-3 flex items-center px-3 bg-white/70 rounded-full border border-emerald-100">
          <div className="w-full bg-emerald-100/70 h-2 rounded-full relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          {/* 4 Checkpoint Markers */}
          {stops.map((stop) => {
            const isCollected = tokensCollected.includes(stop.pct);
            return (
              <div
                key={stop.pct}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-300"
                style={{ left: `${Math.max(4, Math.min(96, stop.pct))}%` }}
                title={stop.title}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border shadow-xs transition-all ${
                    isCollected
                      ? "bg-emerald-500 border-white text-white scale-110"
                      : progress >= stop.pct
                      ? "bg-amber-400 border-white text-white animate-pulse"
                      : "bg-white border-emerald-200 text-slate-400"
                  }`}
                >
                  {isCollected ? "✓" : stop.icon}
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* Animated Night Road & Two-Wheeler Scene Canvas */}
        {/* ======================================================== */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1815] via-[#102a22] to-[#132e22] border border-[#1b3d2f] shadow-inner mb-4">
          {/* Starry Sky & Moon */}
          <div className="absolute top-3 right-5 text-amber-200 text-xl opacity-90 filter drop-shadow-[0_0_8px_rgba(253,230,138,0.6)]">
            🌙
          </div>
          <div className="absolute top-6 left-12 text-white/50 text-[10px] animate-pulse">✦</div>
          <div className="absolute top-10 right-28 text-white/60 text-[8px] animate-ping">✧</div>
          <div className="absolute top-4 left-48 text-emerald-200/50 text-[9px] animate-pulse">✦</div>

          {/* Distant City Skyline Silhouettes */}
          <div className="absolute bottom-16 left-0 right-0 h-16 opacity-30 flex items-end justify-between pointer-events-none px-2">
            <div className="w-10 h-10 bg-emerald-950 rounded-t-sm" />
            <div className="w-6 h-14 bg-emerald-950 rounded-t-sm" />
            <div className="w-12 h-8 bg-emerald-950 rounded-t-sm" />
            <div className="w-8 h-12 bg-emerald-950 rounded-t-sm" />
            <div className="w-14 h-9 bg-emerald-950 rounded-t-sm" />
            <div className="w-7 h-15 bg-emerald-950 rounded-t-sm" />
            <div className="w-11 h-11 bg-emerald-950 rounded-t-sm" />
          </div>

          {/* Passing Streetlights with Parallax */}
          <div
            className="absolute bottom-16 left-0 right-0 h-28 pointer-events-none overflow-hidden"
            style={{
              transform: isCruising ? "translateZ(0)" : "none"
            }}
          >
            {[0, 1, 2, 3].map((lampIdx) => {
              // Calculate repeating lamp position based on progress
              const lampPos = ((progress * 15 + lampIdx * 30) % 120) - 10;
              return (
                <div
                  key={lampIdx}
                  className="absolute bottom-0 transition-transform"
                  style={{ left: `${lampPos}%` }}
                >
                  {/* Lamp Pole */}
                  <div className="w-1 h-20 bg-slate-400/60 mx-auto rounded-t" />
                  {/* Lamp Head */}
                  <div className="w-4 h-2 bg-slate-300 rounded-t-full -mt-20 -ml-1.5 shadow-[0_0_15px_#fef08a]" />
                  {/* Glowing Light Beam Cone on Road */}
                  <div className="w-16 h-20 bg-gradient-to-b from-amber-200/30 to-transparent -ml-7.5 rounded-full blur-xs pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Sidewalk & Cute Stray Dog */}
          <div className="absolute bottom-12 left-0 right-0 h-4 bg-[#1f3f33] border-t border-emerald-600/40" />
          <div
            onClick={handleHonk}
            className="absolute bottom-13 left-16 sm:left-24 z-10 cursor-pointer group flex flex-col items-center"
            title="Click to honk at the puppy! 🐶"
          >
            <motion.div
              animate={{
                rotate: strayDogState === "happy" ? [0, -10, 10, -10, 0] : [0, 4, -4, 0],
                y: strayDogState === "happy" ? [0, -6, 0] : 0
              }}
              transition={{ repeat: Infinity, duration: strayDogState === "happy" ? 0.3 : 1.2 }}
              className="text-lg sm:text-xl drop-shadow-sm select-none"
            >
              🐕
            </motion.div>
            <span className="text-[9px] bg-black/60 text-amber-200 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              Honk at me! 🛵
            </span>
          </div>

          {/* Road Surface */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#0c1613] border-t-2 border-[#2b5947] flex items-center overflow-hidden">
            {/* Moving Dashed Road Lines */}
            <div
              className={`w-[200%] h-1 border-t-2 border-dashed border-amber-300/70 ${
                isCruising ? "animate-[roadMove_0.4s_linear_infinite]" : ""
              }`}
            />
          </div>

          {/* =================================================== */}
          {/* THE TWO-WHEELER: AJAY DRIVING + MYTHRI PILLION */}
          {/* =================================================== */}
          <motion.div
            animate={{
              y: isCruising ? [0, -2, 1, -1, 0] : 0,
            }}
            transition={{ repeat: Infinity, duration: 0.25, ease: "easeInOut" }}
            className="absolute bottom-4 left-1/3 sm:left-2/5 -translate-x-1/2 z-20 flex items-center"
          >
            {/* Scooter Headlight Beam shining forward */}
            <div className="absolute left-24 top-6 w-32 sm:w-44 h-14 bg-gradient-to-r from-amber-200/40 via-amber-100/20 to-transparent clip-path-polygon pointer-events-none rounded-r-full blur-xs" />

            {/* Scooter + Couple Vector SVG */}
            <svg
              className="w-36 h-28 sm:w-44 sm:h-32 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              viewBox="0 0 160 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Exhaust wind puffs when cruising */}
              {isCruising && (
                <g className="animate-pulse">
                  <circle cx="10" cy="98" r="3" fill="#ffffff" opacity="0.3" />
                  <circle cx="4" cy="95" r="4.5" fill="#ffffff" opacity="0.2" />
                  <circle cx="0" cy="91" r="6" fill="#ffffff" opacity="0.1" />
                </g>
              )}

              {/* Rear Wheel */}
              <circle cx="34" cy="96" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
              <circle cx="34" cy="96" r="6" fill="#cbd5e1" />

              {/* Front Wheel */}
              <circle cx="132" cy="96" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
              <circle cx="132" cy="96" r="6" fill="#cbd5e1" />

              {/* Scooter Chassis (Mint Green & Cream Retro Vespa style) */}
              <path
                d="M34 94 C34 76, 52 70, 74 74 L84 88 L114 88 L126 62 L132 94 Z"
                fill="#4ade80"
                stroke="#15803d"
                strokeWidth="2"
              />
              {/* Scooter Seat (Dark leather) */}
              <path
                d="M48 68 C56 65, 86 65, 96 69 C94 73, 50 73, 48 68 Z"
                fill="#334155"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              {/* Front Shield & Headlight */}
              <path
                d="M118 84 L126 52 C127 48, 131 48, 133 52 L134 84 Z"
                fill="#bbf7d0"
                stroke="#15803d"
                strokeWidth="1.5"
              />
              <circle cx="131" cy="52" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Handlebar */}
              <line x1="122" y1="46" x2="136" y2="44" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

              {/* ============================================ */}
              {/* MYTHRI (Pillion: Sitting behind, arms around Ajay) */}
              {/* ============================================ */}
              {/* Mythri's Fluttering Hair in the wind */}
              <path
                d={
                  isCruising
                    ? "M48 38 C32 38, 22 46, 16 52 C24 49, 36 46, 48 44 Z"
                    : "M48 38 C38 42, 32 48, 30 56 C36 50, 42 46, 48 44 Z"
                }
                fill="#27272a"
              />
              {/* Mythri's Head */}
              <circle cx="56" cy="38" r="9" fill="#fed7aa" />
              {/* Mythri's Hair Base */}
              <circle cx="54" cy="36" r="9.5" fill="#27272a" />
              {/* Mythri's Face profile + Blushing Cheek */}
              <circle cx="58" cy="39" r="6" fill="#fed7aa" />
              <circle cx="61" cy="40" r="1.8" fill="#fb7185" />
              <circle cx="61" cy="37" r="1.2" fill="#1e293b" />
              {/* Cute mini ribbon bow in Mythri's hair */}
              <path d="M48 32 C46 30, 44 32, 46 34 L50 32 Z" fill="#f43f5e" />
              <path d="M52 32 C54 30, 56 32, 54 34 L50 32 Z" fill="#f43f5e" />

              {/* Mythri's Torso (Cute pastel sweater) */}
              <path
                d="M52 47 L62 48 L64 68 L50 68 Z"
                fill="#fbcfe8"
                stroke="#f472b6"
                strokeWidth="1.5"
              />
              {/* Mythri's Arm wrapping around Ajay's waist */}
              <path
                d="M58 52 C68 52, 78 56, 84 56"
                stroke="#fed7aa"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M58 52 C68 52, 78 56, 84 56"
                stroke="#fbcfe8"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* ============================================ */}
              {/* AJAY (Driver: Sitting in front, holding handlebars) */}
              {/* ============================================ */}
              {/* Ajay's Head & Hair */}
              <circle cx="82" cy="32" r="9" fill="#fed7aa" />
              <path
                d={
                  isCruising
                    ? "M76 26 C82 22, 92 24, 88 32 C82 30, 76 28, 76 26 Z"
                    : "M76 26 C82 23, 90 25, 87 32 C82 31, 76 29, 76 26 Z"
                }
                fill="#18181b"
              />
              {/* Ajay's Smile & Eye */}
              <circle cx="85" cy="32" r="1.2" fill="#1e293b" />
              <path d="M84 35 Q86 37 88 35" stroke="#1e293b" strokeWidth="1" fill="none" />

              {/* Ajay's Jacket/Shirt (Sage Green) */}
              <path
                d="M74 41 L88 42 L94 68 L70 68 Z"
                fill="#15803d"
                stroke="#14532d"
                strokeWidth="1.5"
              />
              {/* Ajay's Arm extending to handlebar */}
              <path
                d="M84 46 L108 50 L126 47"
                stroke="#15803d"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ajay's Hand on handlebar */}
              <circle cx="126" cy="47" r="2.5" fill="#fed7aa" />

              {/* Love Heart Floating between them */}
              <motion.text
                x="66"
                y="24"
                fontSize="12"
                animate={{ y: [24, 18, 24], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                fill="#fb7185"
              >
                ♡
              </motion.text>
            </svg>
          </motion.div>

          {/* Floating Toast Notification (Honk / Dialogue) */}
          <AnimatePresence>
            {honkMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-white/95 border border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 pointer-events-none"
              >
                <span>{honkMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================== */}
        {/* Interactive Control Dashboard */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Cruise / Throttle Button */}
          <button
            type="button"
            onMouseDown={() => setIsCruising(true)}
            onMouseUp={() => setIsCruising(false)}
            onTouchStart={() => setIsCruising(true)}
            onTouchEnd={() => setIsCruising(false)}
            className={`col-span-2 sm:col-span-2 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer select-none active:scale-95 shadow-md ${
              isCruising
                ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-98"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
            }`}
          >
            <span className="text-base sm:text-lg">🛵💨</span>
            <div className="text-left">
              <div className="font-bold">
                {isCruising ? "Cruising Through the Night... (Release to Stop)" : "Hold to Cruise Forward ♡"}
              </div>
              <div className="text-[10px] text-emerald-100 font-normal hidden sm:block">
                Press Space / Right Arrow to ride
              </div>
            </div>
          </button>

          {/* Honk Horn Button */}
          <button
            type="button"
            onClick={handleHonk}
            className="col-span-2 sm:col-span-1 py-3 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-xs"
            title="Honk the scooter horn! (Press H)"
          >
            <span className="text-base">🐶</span>
            <span>Honk Horn! 🛵</span>
          </button>
        </div>

        {/* Helpful Bottom Hint */}
        <p className="text-[11px] text-[#6e9981] text-center mt-3 font-sans">
          Tip: Hold the green pedal to drive toward the 4 milestone stops! Honk whenever you see street puppies ♡
        </p>
      </div>

      {/* ======================================================== */}
      {/* Milestone Stop Lightbox Modal */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeStop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#132e22]/50 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-2 border-emerald-300 rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
            >
              {/* Washi Tape */}
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-20 h-4.5 opacity-80" color="bg-amber-200/80" />
              </div>

              {/* Stop Tag Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>{activeStop.tag}</span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-serif font-bold text-[#132e22] mb-1">
                {activeStop.title}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mb-4">
                {activeStop.subtitle}
              </p>

              {/* Photo or Icon Card */}
              {activeStop.spotlightImg && (
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border-2 border-emerald-100 shadow-inner bg-emerald-50">
                  <img
                    src={activeStop.spotlightImg}
                    alt={activeStop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Heartfelt Description */}
              <p className="text-xs text-[#3d6350] leading-relaxed mb-6 font-sans bg-[#fff8fa] p-3.5 rounded-2xl border border-[#bbf7d0]">
                "{activeStop.desc}"
              </p>

              {/* Collect Token Action Button */}
              <button
                type="button"
                onClick={handleCollectStopToken}
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {activeStop.pct === 100
                    ? "Arrive at Forever & Unlock Stage ♡"
                    : `Collect ${activeStop.tokenName} (${currentStopIndex + 1}/4) →`}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Completion Fanfare Banner */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center text-emerald-800 text-xs font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Midnight Ride Complete! All 4 Anniversary Tokens Recovered ♡</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
