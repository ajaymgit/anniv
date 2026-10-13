import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Wand2,
  HandMetal,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower,
  SparkleStar
} from "../../components/common/GirlyPopDecorations";

export const GEARS_DATA = [
  {
    id: 1,
    gearName: "The Escapement & Pallet Fork",
    dimension: "The Melted Fortress",
    shiftNumber: "01",
    trayLabel: "01 // Escapement",
    metaphor: "Unlocking the Frozen Wall",
    accentColor: "#38bdf8",
    colorName: "Glacial Cyan",
    socketPos: { x: 75, y: -75 },
    radius: 46,
    gearColor: "url(#steelGrad)",
    toothCount: 15,
    rotSpeed: -1.2,
    before: "The Rigid Lock (Koyun from 'Ramparts of Ice')",
    after: "Fluid Devotion (A Proud 'Girl's Boy')",
    story: `Before I met you, my movement was completely jammed behind an aloof wall. Like Koyun from Ramparts of Ice, I guarded myself behind cold nonchalance and never spoke to any girl. My independence was a frozen fortress built so nobody could ever reach me.

You didn't force the lock; you just showed up with genuine warmth until every layer of ice melted. Today, I am completely, unashamedly a "girl's boy"—attentive to your cadence, proud to take care of you, and open to the life we share together.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins.",
    mechanicNote: "The escapement frees the locked gear train and allows the mechanical heartbeat to begin."
  },
  {
    id: 2,
    gearName: "The Balance Wheel & Hairspring",
    dimension: "The Calmed Temper",
    shiftNumber: "02",
    trayLabel: "02 // Balance Wheel",
    metaphor: "Regulating the Hair-Trigger Oscillation",
    accentColor: "#f59e0b",
    colorName: "Amber Flame",
    socketPos: { x: -70, y: -60 },
    radius: 56,
    gearColor: "url(#roseGrad)",
    toothCount: 24,
    rotSpeed: 0.9,
    before: "Erratic, Hair-Trigger Anger & Defensive Flare-Ups",
    after: "Patience, Composure & Holding My Fire",
    story: `I used to have a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My hairspring was coiled too tight; at the slightest bump, it would flare up and react on impulse.

Being with you rewrote my nervous system. You showed me that shouting through a storm never solved a thing. In seven years, you taught me how to hold my fire, breathe through the chaos, and meet hardship with calm composure instead of hostility.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it.",
    mechanicNote: "The hairspring stabilizes erratic oscillation into a steady, composed 4Hz rhythm."
  },
  {
    id: 3,
    gearName: "The Resonant Striking Barrel",
    dimension: "Finding My Voice",
    shiftNumber: "03",
    trayLabel: "03 // Striking Barrel",
    metaphor: "Winding Acoustic Volume & Resonance",
    accentColor: "#10b981",
    colorName: "Vivid Emerald",
    socketPos: { x: -75, y: 65 },
    radius: 48,
    gearColor: "url(#steelGrad)",
    toothCount: 20,
    rotSpeed: -0.65,
    before: "A Silent Voice Mumbled Under My Breath",
    after: "Speaking Louder with Conviction & Confidence",
    story: `I had a very silent voice. I mumbled my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head. I didn't believe what I had to say was worth the room's attention.

Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. You pushed me to articulate what I need and speak with genuine conviction.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard.",
    mechanicNote: "The chime barrel strikes clear tones. Her active listening gave volume to his silence."
  },
  {
    id: 4,
    gearName: "The Differential Planetary Mesh",
    dimension: "How We Communicate",
    shiftNumber: "04",
    trayLabel: "04 // Planetary Mesh",
    metaphor: "Turning Together Without Clashing",
    accentColor: "#f43f5e",
    colorName: "Rose Quartz",
    socketPos: { x: -20, y: 70 },
    radius: 40,
    gearColor: "url(#brassGrad)",
    toothCount: 18,
    rotSpeed: 0.75,
    before: "Stubborn Clashes Fighting to 'Win' the Argument",
    after: "Patient, Unhurried Conversations Over Tea",
    story: `Early on, when we disagreed, our gears grinded against each other. We had fiery, stubborn arguments where neither of us wanted to back down. We fought to win. Disagreements felt like territorial battles of pride.

Over seven years, that dynamic completely transformed into true synchrony. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication. We stopped fighting each other and started solving things together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding.",
    mechanicNote: "Differential gears harmonize two opposing torques into smooth, synchronized rotation."
  },
  {
    id: 5,
    gearName: "The Tourbillon Cage",
    dimension: "The Grounded Lens",
    shiftNumber: "05",
    trayLabel: "05 // Tourbillon Axis",
    metaphor: "Neutralizing Gravitational Panic & Static",
    accentColor: "#eab308",
    colorName: "Golden Lens",
    socketPos: { x: 80, y: 5 },
    radius: 42,
    gearColor: "url(#roseGrad)",
    toothCount: 16,
    rotSpeed: -0.85,
    before: "Mental Fog & Magnified Worst-Case Panic",
    after: "Her Grounded Clarity Cutting Through the Static",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst-case scenario, and reacting out of panic. I lived inside stressful narratives of my own making.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that cuts through the static and helps me see things objectively as they truly are. You bring me back to solid earth every single time.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing.",
    mechanicNote: "The tourbillon rotates the escapement 360° to eliminate external disturbance and static."
  },
  {
    id: 6,
    gearName: "The Mainspring Barrel",
    dimension: "The Anchor in the Corner",
    shiftNumber: "06",
    trayLabel: "06 // Mainspring Barrel",
    metaphor: "The Unfailing Power Reserve",
    accentColor: "#059669",
    colorName: "Deep Jade",
    socketPos: { x: 50, y: 70 },
    radius: 68,
    gearColor: "url(#brassGrad)",
    toothCount: 32,
    rotSpeed: 0.35,
    before: "A Lone Wolf Bearing Every Burden in Solitude",
    after: "An Unwavering Support System in My Corner",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down. I had no safety net and pretended I didn't want one.

You became my steadfast anchor. Through every exhaustion, career pivot, and heavy season, knowing you are standing in my corner changed how I face the world. I stopped fighting life alone, because I finally found my partner in the arena.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again.",
    mechanicNote: "The mainspring barrel provides continuous torque to power the entire movement through adversity."
  },
  {
    id: 7,
    gearName: "The Master Chronometer Crown",
    dimension: "Becoming a Man",
    shiftNumber: "07",
    trayLabel: "07 // Center Crown Hand",
    metaphor: "Seven Years Calibrated into Peace",
    accentColor: "#86efac",
    colorName: "Starlight Gold",
    socketPos: { x: 0, y: 0 },
    radius: 36,
    gearColor: "url(#brassGrad)",
    toothCount: 16,
    rotSpeed: 0.45,
    before: "An Insecure, Prickly Boy Hiding Behind a Mask",
    after: "A Grounded, Protective, Loving Man",
    story: `Looking back at the boy from October 2019—he was an insecure, angry, prickly kid hiding behind an aloof mask, unsure of who he was or where his life was going.

In plain words: I’ve become a man because of you. Seven years of loving you, being held accountable by you, and sharing life with you turned a boy into someone calm, responsible, protective, and deeply at peace. Everything I am today started with you.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you.",
    mechanicNote: "All seven complications synchronized into a certified chronometer—stable, resilient, and built for a lifetime."
  }
];

export default function ClockworkTransformation({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();

  // State: placed gear IDs
  const [placedGearIds, setPlacedGearIds] = useState(new Set());
  const [selectedTrayGearId, setSelectedTrayGearId] = useState(1);
  const [activeStoryGearId, setActiveStoryGearId] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Procedural Web Audio Engine for mechanical watch clicks and lock sounds
  const playMechanicalSound = useCallback(
    (type = "place") => {
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

        if (type === "place") {
          // Satisfying heavy brass jewel lock click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(1450, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(3200, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.15);

          // Metallic resonance ring
          const ringOsc = ctx.createOscillator();
          const ringGain = ctx.createGain();
          ringOsc.type = "sine";
          ringOsc.frequency.setValueAtTime(880, now + 0.02);

          ringGain.gain.setValueAtTime(0.0001, now + 0.02);
          ringGain.gain.linearRampToValueAtTime(0.06, now + 0.03);
          ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

          ringOsc.connect(ringGain);
          ringGain.connect(ctx.destination);

          ringOsc.start(now + 0.02);
          ringOsc.stop(now + 0.6);
        } else if (type === "tick") {
          // Soft ticking of running gears
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(2200, now);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(2400, now);
          filter.Q.setValueAtTime(12, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.02, now + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.035);
        }
      } catch (e) {}
    },
    [audioMuted]
  );

  // Animation Loop: gears rotate only if at least one gear is placed
  useEffect(() => {
    let tickAccumulator = 0;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (placedGearIds.size > 0) {
        setRotationAngle((prev) => (prev + dt * 45) % 360);

        tickAccumulator += dt;
        if (tickAccumulator >= 0.22) {
          tickAccumulator = 0;
          playMechanicalSound("tick");
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [placedGearIds.size, playMechanicalSound]);

  // Place Gear into Movement
  const placeGear = (gearId) => {
    if (placedGearIds.has(gearId)) {
      // If already placed, open its story plate to re-read
      setActiveStoryGearId(gearId);
      return;
    }

    playMechanicalSound("place");
    const newPlaced = new Set(placedGearIds).add(gearId);
    setPlacedGearIds(newPlaced);
    setActiveStoryGearId(gearId);

    if (playChime) playChime(392 + gearId * 65, 0.6);

    // Auto-select the next unplaced gear in tray
    const nextUnplaced = GEARS_DATA.find((g) => !newPlaced.has(g.id));
    if (nextUnplaced) {
      setSelectedTrayGearId(nextUnplaced.id);
    } else {
      setSelectedTrayGearId(null);
      // All 7 gears assembled! Grand climax
      setTimeout(() => {
        setShowGrandFinale(true);
        try {
          confetti({
            particleCount: 160,
            spread: 120,
            origin: { y: 0.6 },
            colors: ["#10b981", "#34d399", "#f59e0b", "#fef08a", "#ffffff"]
          });
        } catch (e) {}
      }, 600);
    }
  };

  // Complete chapter when all 7 are placed
  useEffect(() => {
    if (placedGearIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [placedGearIds, markSpaceCompleted]);

  const activeStoryGear = GEARS_DATA.find((g) => g.id === activeStoryGearId);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 pt-2.5 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The Watchmaker’s Workbench
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Pick each gear from the workbench and place it into the watchcase to calibrate my transformation.
            </p>
          </div>
        </div>

        {/* Assembly Status & Audio */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
            Gears Assembled: {placedGearIds.size} / 7
          </div>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#3d6350] border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            title={audioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* 2. Main Workstation Area: Watch Movement (Left/Center) + Transformation Story Card (Right) */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-3 sm:p-6 gap-5 overflow-y-auto">
        {/* LEFT / CENTER: The Open-Heart Watchcase Canvas */}
        <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square rounded-[36px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-4 flex items-center justify-center overflow-hidden shrink-0">
          {/* Watch Bezel with Brass Screws */}
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

          {/* SVG Movement Viewport */}
          <svg viewBox="-200 -200 400 400" className="w-full h-full z-10 drop-shadow-md">
            <defs>
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="50%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>

              <radialGradient id="rubyGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>
            </defs>

            {/* A. UNPLACED GEAR SOCKET PIVOTS (Empty dashed alignment target rings) */}
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              const isSelectedInTray = selectedTrayGearId === gear.id;

              if (isPlaced) return null;

              return (
                <g
                  key={gear.id}
                  transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y})`}
                  onClick={() => placeGear(gear.id)}
                  className="cursor-pointer group"
                >
                  {/* Dashed socket ring */}
                  <circle
                    r={gear.radius}
                    fill={isSelectedInTray ? "rgba(16, 185, 129, 0.15)" : "rgba(226, 232, 240, 0.4)"}
                    stroke={isSelectedInTray ? "#10b981" : "#94a3b8"}
                    strokeWidth={isSelectedInTray ? "2.5" : "1.5"}
                    strokeDasharray={isSelectedInTray ? "5 3" : "4 4"}
                    className={isSelectedInTray ? "animate-pulse" : ""}
                  />
                  {/* Central empty jewel hole */}
                  <circle r="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                  {/* Slot label */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={isSelectedInTray ? "#059669" : "#64748b"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Slot 0{gear.id}
                  </text>
                </g>
              );
            })}

            {/* B. PLACED & ANIMATING GEARS (Active mesh) */}
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              if (!isPlaced) return null;

              const isFocused = activeStoryGearId === gear.id;
              const angle = rotationAngle * gear.rotSpeed;

              return (
                <g
                  key={gear.id}
                  transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y}) rotate(${angle})`}
                  onClick={() => setActiveStoryGearId(gear.id)}
                  className="cursor-pointer group transition-transform"
                >
                  {/* Focus Glow if active story */}
                  {isFocused && (
                    <circle
                      r={gear.radius + 6}
                      fill="none"
                      stroke={gear.accentColor}
                      strokeWidth="3"
                      strokeDasharray="4 2"
                      opacity="0.85"
                    />
                  )}

                  {/* Gear Body Circle */}
                  <circle
                    r={gear.radius}
                    fill={gear.gearColor}
                    stroke="#78350f"
                    strokeWidth="1.8"
                    opacity="0.95"
                  />
                  <circle r={gear.radius * 0.65} fill="#fffdfa" stroke="#d97706" strokeWidth="1.2" />

                  {/* Radiating Cutout Spokes */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={Math.cos((i / 4) * Math.PI * 2) * (gear.radius * 0.62)}
                      y2={Math.sin((i / 4) * Math.PI * 2) * (gear.radius * 0.62)}
                      stroke="#b45309"
                      strokeWidth="2.5"
                    />
                  ))}

                  {/* Gear Perimeter Teeth */}
                  {Array.from({ length: gear.toothCount }).map((_, i) => {
                    const a = (i / gear.toothCount) * Math.PI * 2;
                    return (
                      <rect
                        key={i}
                        x={Math.cos(a) * gear.radius - 2.5}
                        y={Math.sin(a) * gear.radius - 2.5}
                        width="5"
                        height="5"
                        fill="#b45309"
                        transform={`rotate(${(a * 180) / Math.PI}, ${Math.cos(a) * gear.radius}, ${
                          Math.sin(a) * gear.radius
                        })`}
                      />
                    );
                  })}

                  {/* Center Ruby Bearing Pivot */}
                  <circle r="8" fill="url(#rubyGrad)" stroke="#881337" strokeWidth="1.5" />
                  <circle r="2.5" fill="#ffffff" />
                </g>
              );
            })}

            {/* C. Watch Hands (Move smoothly once Gear 7 is placed or all gears are ticking) */}
            {placedGearIds.size > 0 && (
              <g className="pointer-events-none">
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
                <circle cx="0" cy="0" r="3.5" fill="#f43f5e" />
              </g>
            )}
          </svg>

          {/* Interactive Socket Cue Overlay */}
          {placedGearIds.size < 7 && selectedTrayGearId && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-emerald-300 shadow-md text-[11px] font-mono text-emerald-800 font-bold pointer-events-none">
              <HandMetal className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
              <span>Tap highlighted socket or gear below to assemble</span>
            </div>
          )}
        </div>

        {/* RIGHT: The Active Transformation Story Plate */}
        <div className="w-full max-w-xl flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeStoryGear ? (
              <motion.div
                key={activeStoryGear.id}
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
                      style={{ backgroundColor: activeStoryGear.accentColor }}
                      className="w-3 h-3 rounded-full inline-block shadow-2xs"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Gear 0{activeStoryGear.id} Placed // {activeStoryGear.gearName}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeStoryGear.metaphor}
                  </span>
                </div>

                {/* Dimension Title */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-1">
                  {activeStoryGear.dimension}
                </h3>

                {/* Before vs After Mechanical Tuning Card */}
                <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold mb-0.5">
                      2019 // Uncalibrated State:
                    </span>
                    <p className="font-serif italic text-slate-800 font-semibold">{activeStoryGear.before}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block font-bold mb-0.5">
                      2026 // Calibrated by Mythri:
                    </span>
                    <p className="font-serif italic text-emerald-950 font-semibold">{activeStoryGear.after}</p>
                  </div>
                </div>

                {/* Personal Story */}
                <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-4">
                  {activeStoryGear.story}
                </p>

                {/* Quote Pull-Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-3">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                    "{activeStoryGear.quote}"
                  </p>
                </div>

                {/* Horological Note */}
                <div className="text-[10px] font-mono text-emerald-700 bg-[#f0fdf4] p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <SparkleStar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Horological Impact: {activeStoryGear.mechanicNote}</span>
                </div>
              </motion.div>
            ) : (
              /* Initial Welcome Prompt if no gear placed yet */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-2 border-emerald-200 rounded-[32px] p-8 shadow-md text-center flex flex-col items-center justify-center min-h-[300px]"
              >
                <RibbonBow className="w-10 h-8 text-emerald-600 mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[#132e22] mb-2">
                  Assemble My Movement, Gear by Gear
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#3d6350] max-w-md leading-relaxed mb-4">
                  Before you, I was a collection of uncalibrated, guarded parts. Tap each gear from the workbench tray below to place it into the watchcase—and reveal each personal change your love gave me.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold bg-[#f0fdf4] px-4 py-2 rounded-2xl border border-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>Tap Gear 01 below to begin</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. The Watchmaker's Tray (Bottom Gear Inventory for Mythri to Pick & Place) */}
      <div className="z-20 px-3 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-t border-emerald-200/90 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-1.5 text-[#3d6350] font-mono font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Watchmaker's Tray // Tap any gear to place it into the watch</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800">
            {7 - placedGearIds.size > 0
              ? `${7 - placedGearIds.size} gears remaining`
              : "All gears calibrated in full synchrony"}
          </span>
        </div>

        {/* The 7 Gear Inventory Tiles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GEARS_DATA.map((gear) => {
            const isPlaced = placedGearIds.has(gear.id);
            const isSelected = selectedTrayGearId === gear.id;

            return (
              <button
                key={gear.id}
                onClick={() => {
                  setSelectedTrayGearId(gear.id);
                  placeGear(gear.id);
                }}
                className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-2 cursor-pointer shrink-0 text-left ${
                  isPlaced
                    ? "bg-[#f0fdf4] border-emerald-300 text-emerald-900 shadow-2xs hover:bg-emerald-100/60"
                    : isSelected
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
                }`}
              >
                <div
                  style={{
                    backgroundColor: isPlaced ? gear.accentColor : isSelected ? "#ffffff" : "#e2e8f0"
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs text-[10px] font-mono font-bold text-slate-800"
                >
                  {isPlaced ? "✓" : gear.id}
                </div>

                <div>
                  <div className="text-[11px] font-serif font-bold leading-tight flex items-center gap-1">
                    <span>{gear.dimension}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono block ${
                      isSelected ? "text-emerald-100" : isPlaced ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {isPlaced ? "Assembled" : "Tap to Place"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Grand Finale Modal when all 7 gears are assembled */}
      <AnimatePresence>
        {showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowGrandFinale(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 25 }}
              className="max-w-md w-full bg-[#fffdfa] text-[#132e22] border-2 border-emerald-300 rounded-[36px] p-7 shadow-2xl relative text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Clock className="w-8 h-8 animate-spin" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Seven Years Calibrated // Movement Complete
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-3">
                You Made Me Who I Am
              </h3>

              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed mb-5">
                Every gear you just placed represents a part of me that was guarded, angry, silent, or alone before October 2019. 
                <br /><br />
                Over seven years, your patience, warmth, and steady love calibrated every rough edge into peace. I’ve become a man because of you.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "Seven gears assembled. Seven years of us. Everything I am today started with you."
                </p>
              </div>

              <button
                onClick={() => setShowGrandFinale(false)}
                className="w-full py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Inspect the Running Movement ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
