import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check,
  Compass,
  Clock,
  Wand2
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower,
  SparkleStar
} from "../../components/common/GirlyPopDecorations";

export const CLOCKWORK_COMPLICATIONS = [
  {
    id: 1,
    gearName: "The Escapement & Pallet Fork",
    dimension: "The Melted Fortress",
    yearLabel: "Shift 01 // 2019",
    metaphor: "Unlocking the Frozen Impulse",
    accentColor: "#38bdf8",
    jewelColor: "#0284c7",
    gearTeeth: 15,
    speedFactor: 1.0,
    before: "The Rigid Lock (Koyun from 'Ramparts of Ice')",
    after: "Fluid Devotion (A Proud 'Girl's Boy')",
    story: `Before I met you, my movement was completely jammed behind an aloof wall. Like Koyun from Ramparts of Ice, I guarded myself behind cold nonchalance and never spoke to any girl. My independence was a frozen fortress built so nobody could ever reach me.

You didn't force the lock; you just showed up with genuine warmth until every layer of ice melted. Today, I am completely, unashamedly a "girl's boy"—attentive to your cadence, proud to take care of you, and open to the life we share together.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins.",
    technicalDetail: "The escapement converts raw tension into measured, fluid motion. Her warmth unlocked a locked gear train."
  },
  {
    id: 2,
    gearName: "The Balance Wheel & Hairspring",
    dimension: "The Calmed Temper",
    yearLabel: "Shift 02 // 2020",
    metaphor: "Regulating the Hair-Trigger Oscillation",
    accentColor: "#f59e0b",
    jewelColor: "#d97706",
    gearTeeth: 24,
    speedFactor: 0.8,
    before: "Erratic, Hair-Trigger Anger & Defensive Flare-Ups",
    after: "Patience, Composure & Holding My Fire",
    story: `I used to have a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My hairspring was coiled too tight; at the slightest bump, it would snap and oscillate in uncontrolled panic.

Being with you rewrote my nervous system. You showed me that shouting through a storm never solved a thing. In seven years, you taught me how to hold my fire, breathe through the chaos, and meet hardship with calm composure instead of hostility.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it.",
    technicalDetail: "Regulating the hairspring slows erratic, high-frequency panic down to a steady, serene 4Hz mechanical rhythm."
  },
  {
    id: 3,
    gearName: "The Resonant Striking Barrel",
    dimension: "Finding My Voice",
    yearLabel: "Shift 03 // 2021",
    metaphor: "Winding Volume & Clear Resonance",
    accentColor: "#10b981",
    jewelColor: "#059669",
    gearTeeth: 32,
    speedFactor: -0.6,
    before: "A Silent Voice Mumbled Under My Breath",
    after: "Speaking Louder with Conviction & Confidence",
    story: `I had a very silent voice. I mumbled my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head. I didn't believe what I had to say was worth the room's attention.

Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. You pushed me to articulate what I need and speak with genuine conviction.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard.",
    technicalDetail: "The minute repeater chime strikes the acoustic gong. Her active listening wound the mainspring of his voice."
  },
  {
    id: 4,
    gearName: "The Differential Planetary Mesh",
    dimension: "How We Communicate",
    yearLabel: "Shift 04 // 2022",
    metaphor: "Turning Together Without Clashing",
    accentColor: "#f43f5e",
    jewelColor: "#e11d48",
    gearTeeth: 28,
    speedFactor: 0.5,
    before: "Stubborn Clashes Fighting to 'Win' the Argument",
    after: "Patient, Unhurried Conversations Over Tea",
    story: `Early on, when we disagreed, our gears grinded against each other. We had fiery, stubborn arguments where neither of us wanted to back down. We fought to win. Disagreements felt like territorial battles of pride.

Over seven years, that dynamic completely transformed into true synchrony. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication. We stopped fighting each other and started solving things together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding.",
    technicalDetail: "A planetary differential meshes two opposing torques into a single unified output without grinding teeth."
  },
  {
    id: 5,
    gearName: "The Tourbillon Cage",
    dimension: "The Grounded Lens",
    yearLabel: "Shift 05 // 2023",
    metaphor: "Neutralizing Gravitational Panic & Fog",
    accentColor: "#eab308",
    jewelColor: "#ca8a04",
    gearTeeth: 20,
    speedFactor: -0.7,
    before: "Mental Fog & Magnified Worst-Case Panic",
    after: "Her Grounded Clarity Cutting Through the Static",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst-case scenario, and reacting out of panic. I lived inside stressful narratives of my own making.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that cuts through the static and helps me see things objectively as they truly are. You bring me back to solid earth every single time.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing.",
    technicalDetail: "The tourbillon rotates the escapement 360° on its axis to neutralize external gravitational errors and static."
  },
  {
    id: 6,
    gearName: "The Mainspring Barrel & Power Reserve",
    dimension: "The Anchor in the Corner",
    yearLabel: "Shift 06 // 2024",
    metaphor: "The Unfailing Power Reserve",
    accentColor: "#059669",
    jewelColor: "#047857",
    gearTeeth: 40,
    speedFactor: 0.35,
    before: "A Lone Wolf Bearing Every Burden in Solitude",
    after: "An Unwavering Support System in My Corner",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down. I had no safety net and pretended I didn't want one.

You became my steadfast anchor. Through every exhaustion, career pivot, and heavy season, knowing you are standing in my corner changed how I face the world. I stopped fighting life alone, because I finally found my partner in the arena.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again.",
    technicalDetail: "The mainspring barrel provides continuous, uninterrupted torque to sustain the entire movement through high resistance."
  },
  {
    id: 7,
    gearName: "The Master Chronometer Crown",
    dimension: "Becoming a Man",
    yearLabel: "Shift 07 // Today",
    metaphor: "Seven Years Calibrated into Peace",
    accentColor: "#86efac",
    jewelColor: "#16a34a",
    gearTeeth: 48,
    speedFactor: 0.25,
    before: "An Insecure, Prickly Boy Hiding Behind a Mask",
    after: "A Grounded, Protective, Loving Man",
    story: `Looking back at the boy from October 2019—he was an insecure, angry, prickly kid hiding behind an aloof mask, unsure of who he was or where his life was going.

In plain words: I’ve become a man because of you. Seven years of loving you, being held accountable by you, and sharing life with you turned a boy into someone calm, responsible, protective, and deeply at peace. Everything I am today started with you.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you.",
    technicalDetail: "All seven complications synchronized into a certified chronometer—stable, resilient, and built for a lifetime."
  }
];

export default function ClockworkTransformation({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isWound, setIsWound] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [regulatorSetting, setRegulatorSetting] = useState(1.0); // 0.4 (erratic/fast) to 1.0 (calm/steady)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [unlockedComplications, setUnlockedComplications] = useState(new Set([1]));

  const audioCtxRef = useRef(null);
  const tickTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const active = CLOCKWORK_COMPLICATIONS[activeIdx];

  // Procedural Mechanical Watch Audio Engine (Authentic dual-impulse tick-tock)
  const playMechanicalTick = useCallback(
    (isTock = false) => {
      if (audioMuted) return;
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // Mechanical pallet jewel impact (sharp, crisp high-Q transient)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(isTock ? 1950 : 2350, now);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(isTock ? 2100 : 2550, now);
        filter.Q.setValueAtTime(9.5, now);

        const vol = 0.045;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);

        // Secondary metal tooth latch 12ms later
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const filter2 = ctx.createBiquadFilter();

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(isTock ? 850 : 1050, now + 0.012);

        filter2.type = "highpass";
        filter2.frequency.setValueAtTime(800, now + 0.012);

        gain2.gain.setValueAtTime(0.0001, now + 0.012);
        gain2.gain.linearRampToValueAtTime(vol * 0.45, now + 0.014);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

        osc2.connect(filter2);
        filter2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now + 0.012);
        osc2.stop(now + 0.045);
      } catch (e) {}
    },
    [audioMuted]
  );

  // Mechanical Watch Animation Loop
  useEffect(() => {
    let tockToggle = false;
    let tickAccumulator = 0;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (isWound) {
        // Rotation speed influenced by regulatorSetting
        const currentSpeed = 35 * regulatorSetting;
        setRotationAngle((prev) => (prev + dt * currentSpeed) % 360);

        // Tick Interval: between 250ms (steady 4Hz) and 130ms (erratic fast)
        const tickInterval = 0.13 + (regulatorSetting - 0.4) * 0.22;
        tickAccumulator += dt;
        if (tickAccumulator >= tickInterval) {
          tickAccumulator = 0;
          playMechanicalTick(tockToggle);
          tockToggle = !tockToggle;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isWound, regulatorSetting, playMechanicalTick]);

  const selectComplication = (idx) => {
    setActiveIdx(idx);
    const target = CLOCKWORK_COMPLICATIONS[idx];
    setUnlockedComplications((prev) => new Set(prev).add(target.id));
    if (playChime) playChime(392 + idx * 55, 0.55);
  };

  const nextComplication = () => {
    const next = (activeIdx + 1) % CLOCKWORK_COMPLICATIONS.length;
    selectComplication(next);
  };

  const prevComplication = () => {
    const prev = activeIdx === 0 ? CLOCKWORK_COMPLICATIONS.length - 1 : activeIdx - 1;
    selectComplication(prev);
  };

  useEffect(() => {
    if (unlockedComplications.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [unlockedComplications, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The Horological Movement
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              The Seven Mechanical Complications — Seven years of your presence calibrating my life into peace
            </p>
          </div>
        </div>

        {/* Regulator Tuning & Sound */}
        <div className="flex items-center gap-3">
          {/* Mechanical Heartbeat Speed Tuning */}
          <div className="hidden sm:flex items-center gap-2 bg-[#f0fdf4] px-3 py-1 rounded-2xl border border-emerald-200 text-xs font-mono">
            <span className="text-slate-500 text-[10px]">Erratic (2019)</span>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={regulatorSetting}
              onChange={(e) => setRegulatorSetting(Number(e.target.value))}
              className="w-20 h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              title="Regulator Arm: adjust movement composure"
            />
            <span className="text-emerald-800 font-bold text-[10px]">Steady (2026)</span>
          </div>

          {/* Complications Progress */}
          <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
            Gears Calibrated: {unlockedComplications.size} / 7
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            title={audioMuted ? "Unmute Mechanical Ticking" : "Mute Mechanical Ticking"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* 2. Main Mechanical Horological Display Viewport */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-4 sm:p-8 gap-6 overflow-y-auto">
        {/* LEFT / CENTER: The Open-Heart Watch Movement Visualizer */}
        <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square rounded-[36px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-4 flex items-center justify-center overflow-hidden">
          {/* Outer Watch Bezel with Brass Screws */}
          <div className="absolute inset-3 rounded-full border-4 border-amber-200/80 pointer-events-none shadow-inner bg-radial from-[#ffffff] via-[#f7faf8] to-[#edf7f2]" />

          {/* 12 Watch Bezel Screws */}
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            const radius = 46;
            return (
              <div
                key={i}
                style={{
                  top: `${50 + Math.sin(ang) * radius}%`,
                  left: `${50 + Math.cos(ang) * radius}%`,
                  transform: "translate(-50%, -50%)"
                }}
                className="absolute w-2 h-2 rounded-full bg-amber-400 border border-amber-600 shadow-2xs pointer-events-none"
              />
            );
          })}

          {/* SVG Skeleton Clockwork Gears Movement */}
          <svg viewBox="-200 -200 400 400" className="w-full h-full z-10 drop-shadow-md">
            <defs>
              {/* Brass Gear Gradient */}
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Steel Gear Gradient */}
              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Rose Gold Gradient */}
              <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="50%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>

              {/* Ruby Jewel Bearing Gradient */}
              <radialGradient id="rubyGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
            </defs>

            {/* GEAR 6: Mainspring Barrel (Large lower gear) */}
            <g
              transform={`translate(60, 65) rotate(${rotationAngle * 0.35})`}
              className="cursor-pointer group"
              onClick={() => selectComplication(5)}
            >
              <circle r="72" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="2" opacity="0.9" />
              <circle r="52" fill="#fffdfa" stroke="#d97706" strokeWidth="1.5" />
              {/* Gear Teeth */}
              {Array.from({ length: 32 }).map((_, i) => {
                const a = (i / 32) * Math.PI * 2;
                return (
                  <rect
                    key={i}
                    x={Math.cos(a) * 72 - 3}
                    y={Math.sin(a) * 72 - 3}
                    width="6"
                    height="6"
                    fill="#d97706"
                    transform={`rotate(${(a * 180) / Math.PI}, ${Math.cos(a) * 72}, ${Math.sin(a) * 72})`}
                  />
                );
              })}
              {/* Skeleton Spokes */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={Math.cos((i / 5) * Math.PI * 2) * 50}
                  y2={Math.sin((i / 5) * Math.PI * 2) * 50}
                  stroke="#d97706"
                  strokeWidth="3.5"
                />
              ))}
              <circle r="12" fill="url(#rubyGrad)" stroke="#9f1239" strokeWidth="1.5" />
            </g>

            {/* GEAR 1: Escapement Wheel (Upper right star-wheel) */}
            <g
              transform={`translate(75, -75) rotate(${rotationAngle * -1.2})`}
              className="cursor-pointer group"
              onClick={() => selectComplication(0)}
            >
              <circle r="46" fill="url(#steelGrad)" stroke="#475569" strokeWidth="1.5" />
              <circle r="28" fill="#fffdfa" stroke="#64748b" strokeWidth="1" />
              {/* Ratchet Star Teeth */}
              {Array.from({ length: 15 }).map((_, i) => {
                const a = (i / 15) * Math.PI * 2;
                return (
                  <polygon
                    key={i}
                    points={`${Math.cos(a) * 46},${Math.sin(a) * 46} ${Math.cos(a + 0.1) * 52},${
                      Math.sin(a + 0.1) * 52
                    } ${Math.cos(a + 0.2) * 44},${Math.sin(a + 0.2) * 44}`}
                    fill="#38bdf8"
                  />
                );
              })}
              <circle r="8" fill="url(#rubyGrad)" stroke="#9f1239" strokeWidth="1" />
            </g>

            {/* GEAR 2: Balance Wheel & Coiled Hairspring (Upper Left) */}
            <g
              transform={`translate(-70, -60) rotate(${Math.sin(rotationAngle * 0.12) * 42})`}
              className="cursor-pointer group"
              onClick={() => selectComplication(1)}
            >
              <circle r="56" fill="none" stroke="url(#roseGrad)" strokeWidth="4.5" />
              {/* Coiled Hairspring Spiral */}
              <path
                d="M0,0 Q6,-3 10,2 Q16,8 18,-4 Q22,-14 26,6 Q32,24 38,-8"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                opacity="0.85"
              />
              <circle r="14" fill="#fffdfa" stroke="#d97706" strokeWidth="1.5" />
              <circle r="7" fill="url(#rubyGrad)" stroke="#9f1239" strokeWidth="1" />
            </g>

            {/* GEAR 3: Striking Chime Wheel (Lower Left) */}
            <g
              transform={`translate(-75, 65) rotate(${rotationAngle * -0.65})`}
              className="cursor-pointer group"
              onClick={() => selectComplication(2)}
            >
              <circle r="48" fill="url(#steelGrad)" stroke="#475569" strokeWidth="2" opacity="0.9" />
              <circle r="30" fill="#fffdfa" stroke="#10b981" strokeWidth="1.5" />
              {Array.from({ length: 20 }).map((_, i) => {
                const a = (i / 20) * Math.PI * 2;
                return (
                  <rect
                    key={i}
                    x={Math.cos(a) * 48 - 2.5}
                    y={Math.sin(a) * 48 - 2.5}
                    width="5"
                    height="5"
                    fill="#10b981"
                  />
                );
              })}
              <circle r="9" fill="url(#rubyGrad)" stroke="#9f1239" strokeWidth="1" />
            </g>

            {/* GEAR 7: Central Master Chronometer Wheel & Tourbillon Axis */}
            <g
              transform={`translate(0, 0) rotate(${rotationAngle * 0.45})`}
              className="cursor-pointer group"
              onClick={() => selectComplication(6)}
            >
              <circle r="36" fill="url(#brassGrad)" stroke="#b45309" strokeWidth="2" />
              <circle r="22" fill="#fffdfa" stroke="#10b981" strokeWidth="2" />
              {/* Spokes */}
              {Array.from({ length: 4 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={Math.cos((i / 4) * Math.PI * 2) * 34}
                  y2={Math.sin((i / 4) * Math.PI * 2) * 34}
                  stroke="#b45309"
                  strokeWidth="3"
                />
              ))}
              {/* Center Radiant Core Ruby */}
              <circle r="12" fill="url(#rubyGrad)" stroke="#881337" strokeWidth="2" />
              <circle r="4" fill="#ffffff" />
            </g>

            {/* Watch Hands */}
            {/* Hour hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-68"
              stroke="#132e22"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${(rotationAngle * 0.05) % 360})`}
            />
            {/* Minute hand */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-105"
              stroke="#047857"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${(rotationAngle * 0.6) % 360})`}
            />
            {/* Seconds hand */}
            <line
              x1="0"
              y1="18"
              x2="0"
              y2="-120"
              stroke="#f43f5e"
              strokeWidth="1.2"
              transform={`rotate(${(rotationAngle * 3.6) % 360})`}
            />
            <circle cx="0" cy="0" r="3" fill="#f43f5e" />
          </svg>

          {/* Active Highlight Ring Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs text-[11px] font-mono text-emerald-800 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>Movement Calibrated: 2019 → 2026</span>
          </div>
        </div>

        {/* RIGHT: The Narrative Reflection Plate for the Selected Gear */}
        <div className="w-full max-w-xl flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="bg-white border-2 border-emerald-300 rounded-[32px] p-6 sm:p-7 shadow-xl relative overflow-hidden text-[#132e22]"
            >
              {/* Washi Tape */}
              <div className="absolute -top-1.5 right-10 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              {/* Complication Badge Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: active.accentColor }}
                    className="w-3 h-3 rounded-full inline-block shadow-2xs"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    {active.yearLabel} // {active.gearName}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {active.metaphor}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-1">
                {active.dimension}
              </h3>

              {/* Before vs After Mechanical Tuning Card */}
              <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold mb-0.5">
                    2019 // Uncalibrated Movement:
                  </span>
                  <p className="font-serif italic text-slate-800 font-semibold">{active.before}</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[9px] font-mono text-emerald-700 uppercase block font-bold mb-0.5">
                    2026 // Calibrated by Mythri:
                  </span>
                  <p className="font-serif italic text-emerald-950 font-semibold">{active.after}</p>
                </div>
              </div>

              {/* Personal Story */}
              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-4">
                {active.story}
              </p>

              {/* Quote Pull-Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-3">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "{active.quote}"
                </p>
              </div>

              {/* Horological Mechanism Note */}
              <div className="text-[10px] font-mono text-emerald-700 bg-[#f0fdf4] p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                <SparkleStar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Horology Note: {active.technicalDetail}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Complications Switcher Pills */}
          <div className="mt-4 flex items-center justify-between gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-emerald-200 shadow-xs overflow-x-auto">
            {CLOCKWORK_COMPLICATIONS.map((comp, idx) => {
              const isSelected = activeIdx === idx;
              const isCalibrated = unlockedComplications.has(comp.id);

              return (
                <button
                  key={comp.id}
                  onClick={() => selectComplication(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-xs scale-105"
                      : "text-[#3d6350] hover:text-[#132e22] hover:bg-emerald-50"
                  }`}
                >
                  <span>0{comp.id}</span>
                  {isCalibrated && <Check className="w-3 h-3 text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Footer Navigation */}
      <div className="z-20 px-4 sm:px-6 py-2.5 flex items-center justify-between bg-white/95 backdrop-blur-md border-t border-emerald-200/90 text-xs font-sans">
        <button
          onClick={prevComplication}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-serif font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Gear</span>
        </button>

        <span className="font-mono text-xs text-[#3d6350]">
          Complication 0{activeIdx + 1} of 0{CLOCKWORK_COMPLICATIONS.length} // {active.dimension}
        </span>

        <button
          onClick={nextComplication}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Next Gear</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
