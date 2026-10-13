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
  HelpCircle,
  Eye
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

// Generates mathematically precise cycloidal/involute watchmaker gear tooth geometry
function generateInvoluteGearPath(cx, cy, r, teeth, innerR) {
  const toothDepth = r * 0.15;
  const rRoot = r - toothDepth;
  const rTip = r + toothDepth * 0.55;
  let d = "";
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.36;
    const a3 = a0 + step * 0.64;
    const a4 = a0 + step * 0.78;
    const a5 = a0 + step;

    const x0 = cx + Math.cos(a0) * rRoot;
    const y0 = cy + Math.sin(a0) * rRoot;
    const x1 = cx + Math.cos(a1) * rRoot;
    const y1 = cy + Math.sin(a1) * rRoot;
    const x2 = cx + Math.cos(a2) * rTip;
    const y2 = cy + Math.sin(a2) * rTip;
    const x3 = cx + Math.cos(a3) * rTip;
    const y3 = cy + Math.sin(a3) * rTip;
    const x4 = cx + Math.cos(a4) * rRoot;
    const y4 = cy + Math.sin(a4) * rRoot;
    const x5 = cx + Math.cos(a5) * rRoot;
    const y5 = cy + Math.sin(a5) * rRoot;

    if (i === 0) {
      d += `M ${x0.toFixed(2)} ${y0.toFixed(2)} `;
    }
    d += `A ${rRoot.toFixed(1)} ${rRoot.toFixed(1)} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} `;
    d += `L ${x2.toFixed(2)} ${y2.toFixed(2)} `;
    d += `A ${rTip.toFixed(1)} ${rTip.toFixed(1)} 0 0 1 ${x3.toFixed(2)} ${y3.toFixed(2)} `;
    d += `L ${x4.toFixed(2)} ${y4.toFixed(2)} `;
    d += `A ${rRoot.toFixed(1)} ${rRoot.toFixed(1)} 0 0 1 ${x5.toFixed(2)} ${y5.toFixed(2)} `;
  }

  // Inner cutout boundary
  if (innerR) {
    d += ` M ${cx + innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`;
  }

  return d;
}

// Generates skeletonized spoke cutout windows between inner hub and outer rim
function generateSpokeWindows(cx, cy, hubR, rimR, count = 4) {
  const paths = [];
  const step = (Math.PI * 2) / count;
  const armWidth = 0.28; // Spoke width fraction

  for (let i = 0; i < count; i++) {
    const aStart = i * step + step * (armWidth / 2);
    const aEnd = (i + 1) * step - step * (armWidth / 2);

    const x1 = cx + Math.cos(aStart) * hubR;
    const y1 = cy + Math.sin(aStart) * hubR;
    const x2 = cx + Math.cos(aStart) * rimR;
    const y2 = cy + Math.sin(aStart) * rimR;
    const x3 = cx + Math.cos(aEnd) * rimR;
    const y3 = cy + Math.sin(aEnd) * rimR;
    const x4 = cx + Math.cos(aEnd) * hubR;
    const y4 = cy + Math.sin(aEnd) * hubR;

    paths.push(
      `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${rimR.toFixed(
        1
      )} ${rimR.toFixed(1)} 0 0 1 ${x3.toFixed(2)} ${y3.toFixed(2)} L ${x4.toFixed(
        2
      )} ${y4.toFixed(2)} A ${hubR.toFixed(1)} ${hubR.toFixed(1)} 0 0 0 ${x1.toFixed(
        2
      )} ${y1.toFixed(2)} Z`
    );
  }

  return paths;
}

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
    socketPos: { x: 74, y: -74 },
    radius: 46,
    material: "steel",
    gradientId: "steelGrad",
    toothCount: 15,
    rotSpeed: -1.2,
    spokeCount: 5,
    before: "The Rigid Lock (Koyun from 'Ramparts of Ice')",
    after: "Fluid Devotion (A Proud 'Girl's Boy')",
    story: `Before I met you, my movement was completely jammed behind an aloof wall. Like Koyun from Ramparts of Ice, I guarded myself behind cold nonchalance and never spoke to any girl. My independence was a frozen fortress built so nobody could ever reach me.

You didn't force the lock; you just showed up with genuine warmth until every layer of ice melted. Today, I am completely, unashamedly a "girl's boy"—attentive to your cadence, proud to take care of you, and open to the life we share together.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins.",
    mechanicNote: "The escapement converts raw tension into measured, fluid motion. Her warmth unlocked a locked gear train."
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
    socketPos: { x: -72, y: -62 },
    radius: 54,
    material: "rosegold",
    gradientId: "roseGoldGrad",
    toothCount: 22,
    rotSpeed: 0.9,
    spokeCount: 3,
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
    socketPos: { x: -74, y: 64 },
    radius: 48,
    material: "steel",
    gradientId: "steelGrad",
    toothCount: 20,
    rotSpeed: -0.65,
    spokeCount: 4,
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
    socketPos: { x: -22, y: 72 },
    radius: 40,
    material: "brass",
    gradientId: "brassGrad",
    toothCount: 18,
    rotSpeed: 0.75,
    spokeCount: 4,
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
    socketPos: { x: 78, y: 8 },
    radius: 44,
    material: "rosegold",
    gradientId: "roseGoldGrad",
    toothCount: 18,
    rotSpeed: -0.85,
    spokeCount: 3,
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
    material: "brass",
    gradientId: "brassGrad",
    toothCount: 30,
    rotSpeed: 0.35,
    spokeCount: 5,
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
    material: "gold",
    gradientId: "goldGrad",
    toothCount: 16,
    rotSpeed: 0.45,
    spokeCount: 4,
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

  // Procedural Web Audio Engine: Dual-impulse synthetic ruby pallet click + metallic resonance
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
          // 1. Heavy Swiss brass chassis lock click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(1450, now);
          osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(3600, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.14, now + 0.003);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);

          // 2. High-grade ruby jewel chime resonance
          const ringOsc = ctx.createOscillator();
          const ringGain = ctx.createGain();
          ringOsc.type = "sine";
          ringOsc.frequency.setValueAtTime(880, now + 0.02);

          ringGain.gain.setValueAtTime(0.0001, now + 0.02);
          ringGain.gain.linearRampToValueAtTime(0.07, now + 0.035);
          ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

          ringOsc.connect(ringGain);
          ringGain.connect(ctx.destination);

          ringOsc.start(now + 0.02);
          ringOsc.stop(now + 0.7);
        } else if (type === "tick") {
          // Precise 4Hz mechanical chronometer tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(2350, now);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(2500, now);
          filter.Q.setValueAtTime(12, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.024, now + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.036);
        }
      } catch (e) {}
    },
    [audioMuted]
  );

  // Animation Loop: Real gear motion
  useEffect(() => {
    let tickAccumulator = 0;

    const loop = (currentTime) => {
      const dt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (placedGearIds.size > 0) {
        setRotationAngle((prev) => (prev + dt * 42) % 360);

        tickAccumulator += dt;
        if (tickAccumulator >= 0.24) {
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
      setActiveStoryGearId(gearId);
      return;
    }

    playMechanicalSound("place");
    const newPlaced = new Set(placedGearIds).add(gearId);
    setPlacedGearIds(newPlaced);
    setActiveStoryGearId(gearId);

    if (playChime) playChime(392 + gearId * 65, 0.6);

    const nextUnplaced = GEARS_DATA.find((g) => !newPlaced.has(g.id));
    if (nextUnplaced) {
      setSelectedTrayGearId(nextUnplaced.id);
    } else {
      setSelectedTrayGearId(null);
      setTimeout(() => {
        setShowGrandFinale(true);
        try {
          confetti({
            particleCount: 170,
            spread: 130,
            origin: { y: 0.6 },
            colors: ["#10b981", "#34d399", "#f59e0b", "#fef08a", "#ffffff"]
          });
        } catch (e) {}
      }, 650);
    }
  };

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
              Pick each gear from the workbench tray below to assemble the movement and calibrate my personal transformation.
            </p>
          </div>
        </div>

        {/* Assembly Status & Audio */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
            Complications Calibrated: {placedGearIds.size} / 7
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

      {/* 2. Main Workstation Area: Ultra-Realistic Luxury Watch Case (Left) + Story Plate (Right) */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-3 sm:p-6 gap-6 overflow-y-auto">
        {/* LEFT / CENTER: Photorealistic Open-Heart Skeleton Watchcase */}
        <div className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-square rounded-[40px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-3 sm:p-4 flex items-center justify-center overflow-hidden shrink-0">
          {/* Circular Brushed Titanium Outer Bezel */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border-[6px] sm:border-[8px] border-slate-300 shadow-2xl bg-radial from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] pointer-events-none" />

          {/* Côtes de Genève (Geneva Stripes) Inner Movement Chassis Ring */}
          <div className="absolute inset-5 sm:inset-6 rounded-full border border-amber-200 shadow-inner bg-radial from-[#ffffff] via-[#f7faf8] to-[#edf7f2] pointer-events-none opacity-90" />

          {/* 12 Mirror-Polished Heat-Blued Screws on the Bezel */}
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            const radius = 46.5;
            return (
              <div
                key={i}
                style={{
                  top: `${50 + Math.sin(ang) * radius}%`,
                  left: `${50 + Math.cos(ang) * radius}%`,
                  transform: "translate(-50%, -50%)"
                }}
                className="absolute w-2.5 h-2.5 rounded-full bg-blue-700 border border-blue-900 shadow-xs flex items-center justify-center pointer-events-none"
              >
                {/* Screw slot */}
                <div
                  style={{ transform: `rotate(${i * 30 + 15}deg)` }}
                  className="w-2 h-0.5 bg-blue-200"
                />
              </div>
            );
          })}

          {/* SVG Movement Viewport */}
          <svg viewBox="-200 -200 400 400" className="w-full h-full z-10 drop-shadow-xl overflow-visible">
            <defs>
              {/* Realistic Brushed Brass Gradient with Specular Sheen */}
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="75%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Realistic Polished Rhodium / Steel Gradient */}
              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="28%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="78%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* Realistic Rose Gold Gradient */}
              <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="30%" stopColor="#fb7185" />
                <stop offset="55%" stopColor="#fda4af" />
                <stop offset="80%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>

              {/* Pure Yellow Gold Gradient */}
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="35%" stopColor="#eab308" />
                <stop offset="65%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              {/* Synthetic Ruby Jewel Bearing with Deep Refraction */}
              <radialGradient id="rubyJewelGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="25%" stopColor="#f43f5e" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="90%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              {/* Gold Chaton Setting Collar */}
              <radialGradient id="chatonGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              {/* Côtes de Genève (Geneva Stripes) Pattern for Movement Plate */}
              <pattern id="genevaStripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="20" fill="#f8fafc" opacity="0.6" />
                <rect x="10" width="10" height="20" fill="#edf2f7" opacity="0.8" />
                <line x1="0" y1="0" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="0.8" />
              </pattern>

              {/* Real Depth Drop Shadows */}
              <filter id="gearShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.35" />
              </filter>

              <filter id="socketGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* BASEPLATE: Côtes de Genève Guilloché Plate */}
            <circle r="148" fill="url(#genevaStripes)" stroke="#cbd5e1" strokeWidth="2" opacity="0.85" />
            <circle r="148" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

            {/* CHAPTER RING: 60 Delicate Minute Track Indices */}
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const isHour = i % 5 === 0;
              const r1 = isHour ? 136 : 140;
              const r2 = 144;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * r1}
                  y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2}
                  y2={Math.sin(a) * r2}
                  stroke={isHour ? "#132e22" : "#94a3b8"}
                  strokeWidth={isHour ? 2.5 : 1}
                />
              );
            })}

            {/* A. UNPLACED GEAR SOCKET PIVOTS (Authentic gold chaton settings with alignment guides) */}
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
                  {/* Outer Alignment Dashed Guide */}
                  <circle
                    r={gear.radius}
                    fill={isSelectedInTray ? "rgba(16, 185, 129, 0.16)" : "rgba(226, 232, 240, 0.35)"}
                    stroke={isSelectedInTray ? "#10b981" : "#94a3b8"}
                    strokeWidth={isSelectedInTray ? "2.5" : "1.2"}
                    strokeDasharray={isSelectedInTray ? "6 3" : "4 4"}
                    filter={isSelectedInTray ? "url(#socketGlow)" : undefined}
                    className={isSelectedInTray ? "animate-pulse" : ""}
                  />

                  {/* Recessed Pivot Jewel Well */}
                  <circle r="10" fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="1" />
                  <circle r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />

                  {/* Slot Number Label */}
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

            {/* B. PLACED PHOTOREALISTIC INVOLUTE GEARS (Turning with real meshing geometry) */}
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              if (!isPlaced) return null;

              const isFocused = activeStoryGearId === gear.id;
              const angle = rotationAngle * gear.rotSpeed;
              const hubR = gear.radius * 0.28;
              const rimInnerR = gear.radius * 0.72;

              // Compute continuous involute gear tooth path
              const gearPath = generateInvoluteGearPath(0, 0, gear.radius, gear.toothCount, hubR);
              // Compute skeletonized spoke windows
              const spokeWindows = generateSpokeWindows(0, 0, hubR + 4, rimInnerR - 2, gear.spokeCount);

              return (
                <g
                  key={gear.id}
                  transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y}) rotate(${angle})`}
                  onClick={() => setActiveStoryGearId(gear.id)}
                  filter="url(#gearShadow)"
                  className="cursor-pointer group"
                >
                  {/* Focus Glow if active story */}
                  {isFocused && (
                    <circle
                      r={gear.radius + 6}
                      fill="none"
                      stroke={gear.accentColor}
                      strokeWidth="3.5"
                      strokeDasharray="5 3"
                      opacity="0.9"
                    />
                  )}

                  {/* Main Involute Gear Body with Beveled Tooth Edges */}
                  <path
                    d={gearPath}
                    fill={`url(#${gear.gradientId})`}
                    stroke="#78350f"
                    strokeWidth="1.2"
                  />

                  {/* Skeletonized Spoke Windows Cut Through Movement */}
                  {spokeWindows.map((swPath, wIdx) => (
                    <path
                      key={wIdx}
                      d={swPath}
                      fill="#f8fafc"
                      stroke="#92400e"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                  ))}

                  {/* Outer Rim Circular Bevel Rings */}
                  <circle
                    r={gear.radius * 0.88}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  <circle
                    r={rimInnerR}
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="1.2"
                    opacity="0.8"
                  />

                  {/* Central Gold Chaton Collar */}
                  <circle r={hubR} fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="1.2" />

                  {/* 2 Micro Heat-Blued Screws on Chaton */}
                  <circle cx={-hubR * 0.65} cy="0" r="1.8" fill="#1d4ed8" stroke="#172554" strokeWidth="0.5" />
                  <circle cx={hubR * 0.65} cy="0" r="1.8" fill="#1d4ed8" stroke="#172554" strokeWidth="0.5" />

                  {/* Deep Crimson Synthetic Ruby Jewel Bearing with Specular Glint */}
                  <circle r="7.5" fill="url(#rubyJewelGrad)" stroke="#4c0519" strokeWidth="1" />
                  {/* Jewel oil sink pit */}
                  <circle r="2.8" fill="#4c0519" opacity="0.6" />
                  {/* Diamond-cut specular pinhead reflection */}
                  <circle cx="-2.2" cy="-2.2" r="1.2" fill="#ffffff" opacity="0.95" />

                  {/* Specific Detail for Balance Wheel (Gear 2): Physical Breguet Hairspring Spiral */}
                  {gear.id === 2 && (
                    <path
                      d="M 0,0 Q 5,-4 8,3 Q 14,10 16,-5 Q 22,-16 26,8 Q 32,24 38,-10"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  )}
                </g>
              );
            })}

            {/* C. WATCH HANDS: Polished Feuille (Leaf) Hands with Counterweights */}
            {placedGearIds.size > 0 && (
              <g className="pointer-events-none drop-shadow-md">
                {/* Hour Hand (Faceted deep blued steel) */}
                <g transform={`rotate(${(rotationAngle * 0.05) % 360})`}>
                  <path
                    d="M 0,16 L 3.5,0 L 0,-74 L -3.5,0 Z"
                    fill="#132e22"
                    stroke="#042f2e"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="0" r="6" fill="#132e22" />
                </g>

                {/* Minute Hand (Slender lancette hand) */}
                <g transform={`rotate(${(rotationAngle * 0.6) % 360})`}>
                  <path
                    d="M 0,22 L 2.8,0 L 0,-112 L -2.8,0 Z"
                    fill="#047857"
                    stroke="#064e3b"
                    strokeWidth="0.8"
                  />
                  <circle cx="0" cy="0" r="5" fill="#047857" />
                </g>

                {/* Seconds Hand (Carmine needle with counterweight ring) */}
                <g transform={`rotate(${(rotationAngle * 3.6) % 360})`}>
                  <line x1="0" y1="28" x2="0" y2="-128" stroke="#f43f5e" strokeWidth="1.4" />
                  <circle cx="0" cy="20" r="4.5" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="4.5" fill="#f43f5e" />
                  <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* D. Sapphire Crystal Reflection Glare */}
            <path
              d="M -130,-130 Q 0,-60 130,-130 A 148 148 0 0 1 130,130 Q 0,60 -130,130 Z"
              fill="url(#steelGrad)"
              opacity="0.04"
              className="pointer-events-none"
            />
          </svg>

          {/* Interactive Socket Cue Overlay */}
          {placedGearIds.size < 7 && selectedTrayGearId && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-emerald-300 shadow-md text-[11px] font-mono text-emerald-800 font-bold pointer-events-none">
              <HandMetal className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
              <span>Tap highlighted socket in watch or gear in tray</span>
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

      {/* 3. The Watchmaker’s Workbench Tray (Plush Jeweler’s Suede Tray) */}
      <div className="z-20 px-3 sm:px-6 py-2.5 bg-gradient-to-t from-[#064e3b] via-[#065f46] to-[#047857] text-white border-t-2 border-amber-300/60 shadow-xl flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-1.5 text-amber-200 font-mono font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>The Watchmaker's Jeweled Tray // Tap any gear to assemble it into the movement</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-200">
            {7 - placedGearIds.size > 0
              ? `${7 - placedGearIds.size} complications remaining`
              : "Calibrated in full synchrony ♡"}
          </span>
        </div>

        {/* 7 Realistic Gear Inventory Tokens */}
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
                className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-2.5 cursor-pointer shrink-0 text-left ${
                  isPlaced
                    ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-100 shadow-2xs hover:bg-emerald-900"
                    : isSelected
                    ? "bg-amber-400 text-slate-950 border-amber-200 shadow-lg scale-105 ring-2 ring-amber-300"
                    : "bg-emerald-900/60 border-emerald-700/60 text-emerald-100 hover:border-amber-300 hover:bg-emerald-800/80"
                }`}
              >
                {/* Mini Realistic Gear Graphic in Tray */}
                <div className="relative w-7 h-7 rounded-full bg-slate-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-inner">
                  <div
                    style={{
                      backgroundColor: isPlaced ? gear.accentColor : isSelected ? "#059669" : "#d97706"
                    }}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-2xs"
                  >
                    {isPlaced ? "✓" : gear.id}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-serif font-bold leading-tight flex items-center gap-1">
                    <span>{gear.dimension}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono block ${
                      isSelected
                        ? "text-slate-900 font-semibold"
                        : isPlaced
                        ? "text-emerald-300"
                        : "text-emerald-300/70"
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
