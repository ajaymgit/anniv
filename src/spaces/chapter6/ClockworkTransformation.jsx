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
  Move,
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

  if (innerR) {
    d += ` M ${cx + innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 1 0 ${cx + innerR} ${cy}`;
  }

  return d;
}

// Generates skeletonized spoke cutout windows between inner hub and outer rim
function generateSpokeWindows(cx, cy, hubR, rimR, count = 4) {
  const paths = [];
  const step = (Math.PI * 2) / count;
  const armWidth = 0.28;

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

  // Assembly state
  const [placedGearIds, setPlacedGearIds] = useState(new Set());
  const [activeStoryGearId, setActiveStoryGearId] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  // Active drag state
  const [draggingGearId, setDraggingGearId] = useState(null);
  const [dragPointerPos, setDragPointerPos] = useState({ x: 0, y: 0 });
  const [isNearSocket, setIsNearSocket] = useState(false);

  const watchContainerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Procedural Web Audio Engine
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

  // Animation Loop: Gear rotation
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

  // Compute screen pixel position of any SVG socket
  const getSocketScreenPos = useCallback((socketPos) => {
    if (!watchContainerRef.current) return null;
    const rect = watchContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // SVG viewBox is [-200, -200, 400, 400]
    const screenX = centerX + (socketPos.x / 400) * rect.width;
    const screenY = centerY + (socketPos.y / 400) * rect.height;
    return { screenX, screenY, width: rect.width };
  }, []);

  // Check proximity between pointer and target gear socket
  const checkProximity = useCallback(
    (clientX, clientY, gear) => {
      const target = getSocketScreenPos(gear.socketPos);
      if (!target) return false;

      const dist = Math.hypot(clientX - target.screenX, clientY - target.screenY);
      // Snap threshold based on gear radius scaled to screen pixels
      const threshold = (gear.radius / 400) * target.width * 1.5;
      return dist <= threshold;
    },
    [getSocketScreenPos]
  );

  // DRAG INTERACTION HANDLERS (Unified Pointer Events for mouse & touch)
  const startDrag = (gearId, e) => {
    if (placedGearIds.has(gearId)) {
      setActiveStoryGearId(gearId);
      return;
    }

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    setDraggingGearId(gearId);
    setDragPointerPos({ x: clientX, y: clientY });
    setIsNearSocket(false);
  };

  const onPointerMove = useCallback(
    (e) => {
      if (!draggingGearId) return;

      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      setDragPointerPos({ x: clientX, y: clientY });

      const gear = GEARS_DATA.find((g) => g.id === draggingGearId);
      if (gear) {
        const near = checkProximity(clientX, clientY, gear);
        setIsNearSocket(near);
      }
    },
    [draggingGearId, checkProximity]
  );

  const onPointerUp = useCallback(
    (e) => {
      if (!draggingGearId) return;

      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : dragPointerPos.x);
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : dragPointerPos.y);

      const gear = GEARS_DATA.find((g) => g.id === draggingGearId);

      if (gear && checkProximity(clientX, clientY, gear)) {
        // SUCCESSFUL SNAP & PLACE!
        playMechanicalSound("place");
        const newPlaced = new Set(placedGearIds).add(gear.id);
        setPlacedGearIds(newPlaced);
        setActiveStoryGearId(gear.id);

        if (playChime) playChime(392 + gear.id * 65, 0.6);

        if (newPlaced.size === 7) {
          setTimeout(() => {
            setShowGrandFinale(true);
            try {
              confetti({
                particleCount: 170,
                spread: 130,
                origin: { y: 0.6 },
                colors: ["#10b981", "#34d399", "#f59e0b", "#fef08a", "#ffffff"]
              });
            } catch (err) {}
          }, 650);
        }
      }

      setDraggingGearId(null);
      setIsNearSocket(false);
    },
    [draggingGearId, dragPointerPos, checkProximity, placedGearIds, playMechanicalSound, playChime]
  );

  useEffect(() => {
    if (draggingGearId) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("touchmove", onPointerMove, { passive: false });
      window.addEventListener("touchend", onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [draggingGearId, onPointerMove, onPointerUp]);

  useEffect(() => {
    if (placedGearIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [placedGearIds, markSpaceCompleted]);

  const activeStoryGear = GEARS_DATA.find((g) => g.id === activeStoryGearId);
  const currentDraggingGear = GEARS_DATA.find((g) => g.id === draggingGearId);

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
              Drag each gear from the velvet tray below and drop it into its matching socket in the movement.
            </p>
          </div>
        </div>

        {/* Assembly Status & Audio */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800 shadow-2xs">
            Gears Placed: {placedGearIds.size} / 7
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

      {/* 2. Main Workstation Area: Watchcase (Left) + Story Plate (Right) */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-3 sm:p-6 gap-6 overflow-y-auto">
        {/* LEFT / CENTER: Photorealistic Open-Heart Skeleton Watchcase */}
        <div
          ref={watchContainerRef}
          className="relative w-full max-w-[440px] sm:max-w-[480px] aspect-square rounded-[40px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-3 sm:p-4 flex items-center justify-center overflow-hidden shrink-0 touch-none"
        >
          {/* Circular Brushed Titanium Outer Bezel */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border-[6px] sm:border-[8px] border-slate-300 shadow-2xl bg-radial from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] pointer-events-none" />

          {/* Geneva Stripes Movement Chassis Ring */}
          <div className="absolute inset-5 sm:inset-6 rounded-full border border-amber-200 shadow-inner bg-radial from-[#ffffff] via-[#f7faf8] to-[#edf7f2] pointer-events-none opacity-90" />

          {/* 12 Heat-Blued Screws on the Bezel */}
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
                <div style={{ transform: `rotate(${i * 30 + 15}deg)` }} className="w-2 h-0.5 bg-blue-200" />
              </div>
            );
          })}

          {/* SVG Movement Viewport */}
          <svg viewBox="-200 -200 400 400" className="w-full h-full z-10 drop-shadow-xl overflow-visible pointer-events-none">
            <defs>
              <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="75%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="28%" stopColor="#f1f5f9" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="78%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" />
                <stop offset="30%" stopColor="#fb7185" />
                <stop offset="55%" stopColor="#fda4af" />
                <stop offset="80%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>

              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="35%" stopColor="#eab308" />
                <stop offset="65%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              <radialGradient id="rubyJewelGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="25%" stopColor="#f43f5e" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="90%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              <radialGradient id="chatonGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              <pattern id="genevaStripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="20" fill="#f8fafc" opacity="0.6" />
                <rect x="10" width="10" height="20" fill="#edf2f7" opacity="0.8" />
                <line x1="0" y1="0" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="0.8" />
              </pattern>

              <filter id="gearShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.35" />
              </filter>

              <filter id="targetDropGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* BASEPLATE */}
            <circle r="148" fill="url(#genevaStripes)" stroke="#cbd5e1" strokeWidth="2" opacity="0.85" />
            <circle r="148" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

            {/* MINUTE TRACK */}
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

            {/* A. UNPLACED GEAR SOCKET TARGETS */}
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              if (isPlaced) return null;

              const isBeingDragged = draggingGearId === gear.id;
              const isDropHovered = isBeingDragged && isNearSocket;

              return (
                <g
                  key={gear.id}
                  transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y})`}
                  className="pointer-events-auto"
                >
                  {/* Outer Alignment Drop Target Ring */}
                  <circle
                    r={gear.radius}
                    fill={isDropHovered ? "rgba(16, 185, 129, 0.28)" : isBeingDragged ? "rgba(16, 185, 129, 0.12)" : "rgba(226, 232, 240, 0.35)"}
                    stroke={isDropHovered ? "#059669" : isBeingDragged ? "#10b981" : "#94a3b8"}
                    strokeWidth={isDropHovered ? "3.5" : isBeingDragged ? "2.5" : "1.2"}
                    strokeDasharray={isBeingDragged ? "6 3" : "4 4"}
                    filter={isBeingDragged ? "url(#targetDropGlow)" : undefined}
                    className={isBeingDragged ? "animate-pulse" : ""}
                  />

                  {/* Recessed Pivot Jewel Well */}
                  <circle r="10" fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="1" />
                  <circle r="6" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />

                  {/* Slot Number Label */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={isDropHovered ? "#047857" : isBeingDragged ? "#059669" : "#64748b"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {isDropHovered ? "DROP!" : `Slot 0${gear.id}`}
                  </text>
                </g>
              );
            })}

            {/* B. PLACED PHOTOREALISTIC INVOLUTE GEARS */}
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              if (!isPlaced) return null;

              const isFocused = activeStoryGearId === gear.id;
              const angle = rotationAngle * gear.rotSpeed;
              const hubR = gear.radius * 0.28;
              const rimInnerR = gear.radius * 0.72;

              const gearPath = generateInvoluteGearPath(0, 0, gear.radius, gear.toothCount, hubR);
              const spokeWindows = generateSpokeWindows(0, 0, hubR + 4, rimInnerR - 2, gear.spokeCount);

              return (
                <g
                  key={gear.id}
                  transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y}) rotate(${angle})`}
                  onClick={() => setActiveStoryGearId(gear.id)}
                  filter="url(#gearShadow)"
                  className="cursor-pointer group pointer-events-auto"
                >
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

                  <path d={gearPath} fill={`url(#${gear.gradientId})`} stroke="#78350f" strokeWidth="1.2" />

                  {spokeWindows.map((swPath, wIdx) => (
                    <path key={wIdx} d={swPath} fill="#f8fafc" stroke="#92400e" strokeWidth="1.2" opacity="0.9" />
                  ))}

                  <circle r={gear.radius * 0.88} fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                  <circle r={rimInnerR} fill="none" stroke="#78350f" strokeWidth="1.2" opacity="0.8" />

                  <circle r={hubR} fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="1.2" />
                  <circle cx={-hubR * 0.65} cy="0" r="1.8" fill="#1d4ed8" stroke="#172554" strokeWidth="0.5" />
                  <circle cx={hubR * 0.65} cy="0" r="1.8" fill="#1d4ed8" stroke="#172554" strokeWidth="0.5" />

                  <circle r="7.5" fill="url(#rubyJewelGrad)" stroke="#4c0519" strokeWidth="1" />
                  <circle r="2.8" fill="#4c0519" opacity="0.6" />
                  <circle cx="-2.2" cy="-2.2" r="1.2" fill="#ffffff" opacity="0.95" />

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

            {/* C. WATCH HANDS */}
            {placedGearIds.size > 0 && (
              <g className="pointer-events-none drop-shadow-md">
                <g transform={`rotate(${(rotationAngle * 0.05) % 360})`}>
                  <path d="M 0,16 L 3.5,0 L 0,-74 L -3.5,0 Z" fill="#132e22" stroke="#042f2e" strokeWidth="1" />
                  <circle cx="0" cy="0" r="6" fill="#132e22" />
                </g>
                <g transform={`rotate(${(rotationAngle * 0.6) % 360})`}>
                  <path d="M 0,22 L 2.8,0 L 0,-112 L -2.8,0 Z" fill="#047857" stroke="#064e3b" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="5" fill="#047857" />
                </g>
                <g transform={`rotate(${(rotationAngle * 3.6) % 360})`}>
                  <line x1="0" y1="28" x2="0" y2="-128" stroke="#f43f5e" strokeWidth="1.4" />
                  <circle cx="0" cy="20" r="4.5" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="4.5" fill="#f43f5e" />
                  <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* Sapphire Glass Glare */}
            <path
              d="M -130,-130 Q 0,-60 130,-130 A 148 148 0 0 1 130,130 Q 0,60 -130,130 Z"
              fill="url(#steelGrad)"
              opacity="0.04"
              className="pointer-events-none"
            />
          </svg>

          {/* Interactive Cue Badge */}
          {placedGearIds.size < 7 && !draggingGearId && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-emerald-300 shadow-md text-[11px] font-mono text-emerald-800 font-bold pointer-events-none">
              <Move className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Drag gear from velvet tray below into its socket</span>
            </div>
          )}
        </div>

        {/* RIGHT: Active Transformation Story Plate */}
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
                <div className="absolute -top-1.5 right-10 pointer-events-none">
                  <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
                </div>

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

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-1">
                  {activeStoryGear.dimension}
                </h3>

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

                <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-4">
                  {activeStoryGear.story}
                </p>

                <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-3">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                    "{activeStoryGear.quote}"
                  </p>
                </div>

                <div className="text-[10px] font-mono text-emerald-700 bg-[#f0fdf4] p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <SparkleStar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Horological Impact: {activeStoryGear.mechanicNote}</span>
                </div>
              </motion.div>
            ) : (
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
                  Drag each gear from the velvet tray below and drop it into its matching socket in the watchcase. Each gear placed reveals the authentic change your love gave me over seven years.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold bg-[#f0fdf4] px-4 py-2 rounded-2xl border border-emerald-200">
                  <HandMetal className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Drag Gear 01 from the tray below into Slot 01</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. The Watchmaker’s Workbench Velvet Tray (Drag Sources) */}
      <div className="z-20 px-3 sm:px-6 py-2.5 bg-gradient-to-t from-[#064e3b] via-[#065f46] to-[#047857] text-white border-t-2 border-amber-300/60 shadow-xl flex flex-col gap-1.5 select-none touch-none">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-1.5 text-amber-200 font-mono font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>The Watchmaker's Jeweled Tray // Hold & Drag each gear into the movement above</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-200">
            {7 - placedGearIds.size > 0
              ? `${7 - placedGearIds.size} complications remaining`
              : "Calibrated in full synchrony ♡"}
          </span>
        </div>

        {/* 7 Draggable Gear Inventory Tokens */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {GEARS_DATA.map((gear) => {
            const isPlaced = placedGearIds.has(gear.id);
            const isBeingDragged = draggingGearId === gear.id;

            return (
              <div
                key={gear.id}
                onPointerDown={(e) => startDrag(gear.id, e)}
                onTouchStart={(e) => startDrag(gear.id, e)}
                className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-2.5 cursor-grab active:cursor-grabbing shrink-0 text-left select-none touch-none ${
                  isPlaced
                    ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-100 shadow-2xs hover:bg-emerald-900 opacity-90 cursor-pointer"
                    : isBeingDragged
                    ? "bg-amber-400 text-slate-950 border-amber-200 shadow-xl scale-105 opacity-60 ring-2 ring-amber-300"
                    : "bg-emerald-900/70 border-emerald-700/60 text-emerald-100 hover:border-amber-300 hover:bg-emerald-800 active:scale-95"
                }`}
              >
                {/* Mini Gear Avatar */}
                <div className="relative w-7 h-7 rounded-full bg-slate-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-inner">
                  <div
                    style={{
                      backgroundColor: isPlaced ? gear.accentColor : "#d97706"
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
                      isPlaced ? "text-emerald-300" : "text-emerald-300/80"
                    }`}
                  >
                    {isPlaced ? "Assembled" : "Drag to Socket"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FLOATING DRAGGED GEAR (Under the user's cursor/finger while actively dragging) */}
      {draggingGearId && currentDraggingGear && (
        <div
          style={{
            position: "fixed",
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999
          }}
          className="transition-transform duration-75"
        >
          <div
            style={{
              borderColor: isNearSocket ? "#10b981" : "#f59e0b",
              boxShadow: isNearSocket
                ? "0 0 25px rgba(16, 185, 129, 0.85), 0 10px 20px rgba(0,0,0,0.3)"
                : "0 10px 25px rgba(0,0,0,0.4)"
            }}
            className="w-20 h-20 rounded-full bg-[#fffdfa]/95 border-2 flex flex-col items-center justify-center p-1 backdrop-blur-xs scale-110"
          >
            <div
              style={{ backgroundColor: currentDraggingGear.accentColor }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm mb-0.5"
            >
              0{currentDraggingGear.id}
            </div>
            <span className="text-[9px] font-serif font-bold text-[#132e22] text-center leading-tight">
              {currentDraggingGear.dimension}
            </span>
            <span className="text-[8px] font-mono text-emerald-700 font-bold mt-0.5">
              {isNearSocket ? "✓ Drop to Snap!" : "Drop on Socket"}
            </span>
          </div>
        </div>
      )}

      {/* 5. Grand Finale Modal when all 7 gears are assembled */}
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
                Every gear you placed represents a part of me that was guarded, angry, silent, or alone before October 2019. 
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
