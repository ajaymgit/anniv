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
    dimension: "The 3 AM Co-Pilot & Dedicated Fixer",
    shiftNumber: "01",
    trayLabel: "01 // Escapement",
    metaphor: "3 AM Co-Pilot",
    accentColor: "#38bdf8",
    colorName: "Glacial Cyan",
    socketPos: { x: 74, y: -74 },
    radius: 46,
    material: "Steel",
    gradientId: "steelGrad",
    toothCount: 15,
    rotSpeed: -1.2,
    spokeCount: 5,
    before: "Cold one-word replies, aloof hands in pockets, pretending nothing mattered",
    after: "Staying up until 3:00 AM formatting PPTs, study calls, and building tools",
    story: `Before you, I was completely detached, guarded, and wrapped up in my own head. I was reluctant to get involved in anyone else’s problems or invest emotional energy into daily logistics. My default reflex was cold one-word replies and pretending nothing mattered.

Being with you turned me into your 24/7 co-pilot and personal support system. I stay up until 3:00 AM helping you format PPTs, research complex topics, clean up academic reports, and organize study decks whenever you're overwhelmed. 'Send me what you have, I’ll format it' became second nature—staying on the call while you study and building custom tools and apps just to make your life easier.`,
    quote: "You turned someone who used to be detached into the guy who will happily stay up all night making sure your world is taken care of.",
    mechanicNote: "From aloof detachment to staying up until 3 AM in your corner."
  },
  {
    id: 2,
    gearName: "The Balance Wheel & Hairspring",
    dimension: "The 'Psychotherapist' Calm (Taming the Temper)",
    shiftNumber: "02",
    trayLabel: "02 // Balance Wheel",
    metaphor: "Taming the Temper",
    accentColor: "#f59e0b",
    colorName: "Amber Flame",
    socketPos: { x: -72, y: -62 },
    radius: 54,
    material: "Rose Gold",
    gradientId: "roseGoldGrad",
    toothCount: 22,
    rotSpeed: 0.9,
    spokeCount: 3,
    before: "Pacing the floor, sharp tone, reacting immediately on impulse",
    after: "Taking a breath, observant patient listener, calm in chaotic moments",
    story: `I used to have hair-trigger frustration and an instant defensive reflex. If something went sideways, my reflex was to pace the floor, snap with a sharp tone, clench my jaw, and react immediately on impulse.

Being with you made me the observant, patient listener. Like our inside joke about The Silent Patient—'reading this book is like your POV if you were a psychotherapist'—I learned to take a breath, sit with your rants, absorb chaotic moments, and respond with steady reassurance instead of matching the stress. I listen quietly without interrupting, ask 'what happened next?', and stay your calm center when everything else gets loud.`,
    quote: "You taught me that being strong isn't reacting with fire; it’s being the steady, calm listener when everything else is loud.",
    mechanicNote: "Taught me to hold my fire and be your steady listener."
  },
  {
    id: 3,
    gearName: "The Resonant Striking Barrel",
    dimension: "Finding Conviction (Volume & Voice)",
    shiftNumber: "03",
    trayLabel: "03 // Striking Barrel",
    metaphor: "Volume & Voice",
    accentColor: "#10b981",
    colorName: "Vivid Emerald",
    socketPos: { x: -74, y: 64 },
    radius: 48,
    material: "Steel",
    gradientId: "steelGrad",
    toothCount: 20,
    rotSpeed: -0.65,
    spokeCount: 4,
    before: "Looking down, speaking under breath, letting others dominate",
    after: "Looking you in the eye, voicing needs, speaking with conviction",
    story: `I kept my thoughts locked inside. I looked down, mumbled under my breath, and shrank away from asserting what I wanted, assuming people wouldn't care anyway.

Because you always gave me your full, undivided attention and genuinely cared about my thoughts, I stopped shrinking into the corner. You gave volume to my silence. Now, I look you in the eye, voice what I need, and articulate ideas with confidence and real conviction.`,
    quote: "You gave volume to my silence because you were the first person who made me feel like my words actually carried weight.",
    mechanicNote: "You made my words carry weight and gave volume to my silence."
  },
  {
    id: 4,
    gearName: "The Differential Planetary Mesh",
    dimension: "'Send the Other Three Info Ya' (Communication Over Ego)",
    shiftNumber: "04",
    trayLabel: "04 // Planetary Mesh",
    metaphor: "Communication Over Ego",
    accentColor: "#f43f5e",
    colorName: "Rose Quartz",
    socketPos: { x: -22, y: 72 },
    radius: 40,
    material: "Brass",
    gradientId: "brassGrad",
    toothCount: 18,
    rotSpeed: 0.75,
    spokeCount: 4,
    before: "Walking away mid-argument, cold shoulder, defensive debate points",
    after: "'Let's sit down and figure this out,' collaborative problem-solving",
    story: `Early on, disagreements were stubborn, defensive battles where we fought to 'win' or prove a point. Walking away mid-argument, cold shoulders, and bruised pride.

Over seven years, that dynamic completely transformed into true teamwork rhythm. No passive-aggressive silence or bruised pride. Even when deadlines, fatigue, or friction hit, it shifts into collaborative problem-solving, making tea, laughing through the tension, and saying 'let's sit down and figure this out together'. We stopped fighting each other and started solving life as a team.`,
    quote: "We stopped fighting each other and started solving life as a team.",
    mechanicNote: "Communication over ego: solving everything together as a team."
  },
  {
    id: 5,
    gearName: "The Tourbillon Cage",
    dimension: "The Reality Check (Cutting Through Overthinking)",
    shiftNumber: "05",
    trayLabel: "05 // Tourbillon Axis",
    metaphor: "Cutting Through Overthinking",
    accentColor: "#eab308",
    colorName: "Golden Lens",
    socketPos: { x: 78, y: 8 },
    radius: 44,
    material: "Rose Gold",
    gradientId: "roseGoldGrad",
    toothCount: 18,
    rotSpeed: -0.85,
    spokeCount: 3,
    before: "Restless pacing, internal spiral, catastrophizing worst-case what-ifs",
    after: "Mythri's straightforward clarity grounding me back in 10 minutes",
    story: `My head used to dive into overthinking rabbit holes—restless pacing, internal spirals, catastrophizing, and insomnia over imagined worst-case scenarios. I lived inside stressful narratives of my own making.

You became my reality check. With your straightforward, no-nonsense clarity, you cut straight through the static and anchor me back to solid ground. Talking it out with you for ten minutes makes me realize things are never as impossible as my head made them seem.`,
    quote: "Whenever my mind starts spiraling into a hundred 'what-ifs', you bring me right back to earth with one sentence.",
    mechanicNote: "Your straightforward clarity cuts through every mental spiral."
  },
  {
    id: 6,
    gearName: "The Mainspring Barrel",
    dimension: "From Lone Wolf to Her Number One Cheerleader",
    shiftNumber: "06",
    trayLabel: "06 // Mainspring Barrel",
    metaphor: "Her #1 Cheerleader",
    accentColor: "#059669",
    colorName: "Deep Jade",
    socketPos: { x: 50, y: 70 },
    radius: 68,
    material: "Brass",
    gradientId: "brassGrad",
    toothCount: 30,
    rotSpeed: 0.35,
    spokeCount: 5,
    before: "Solitary operator, hiding stress, refusing help, emotional armor",
    after: "Building entire suites for you, cheering every win, sharing the load",
    story: `I operated like a solitary fighter. I believed relying on anyone was a weakness, carried every burden alone, hid my stress, and kept emotional armor tightly strapped on.

Loving you made me unashamedly your partner and biggest cheerleader. Whether it’s building an entire 7-chapter anniversary suite, crafting desktop companion apps like CoupleStick, or celebrating every milestone you hit, I take genuine pride in your wins. I stopped fighting life alone because I finally found a permanent anchor in my corner.`,
    quote: "I spent years thinking I had to fight life alone. Loving you made me realize how much better it is to have an anchor in your corner.",
    mechanicNote: "From a lone wolf to your proudest cheerleader and teammate."
  },
  {
    id: 7,
    gearName: "The Master Chronometer Crown",
    dimension: "The Culmination (October 2019 to Today)",
    shiftNumber: "07",
    trayLabel: "07 // Center Crown Hand",
    metaphor: "October 2019 to Today",
    accentColor: "#86efac",
    colorName: "Starlight Gold",
    socketPos: { x: 0, y: 0 },
    radius: 36,
    material: "Pure Gold",
    gradientId: "goldGrad",
    toothCount: 16,
    rotSpeed: 0.45,
    spokeCount: 4,
    before: "Insecure guarded kid wandering without direction, defensive walls",
    after: "Grounded protective partner keeping promises, living with purpose",
    story: `Looking back at who I used to be—I was an insecure, guarded kid from October 2019 hiding behind nonchalance, unsure of his purpose, and reacting defensively to the world to avoid vulnerability.

Seven years of loving you, being held accountable by you, and sharing life with you turned that kid into a grounded, protective, reliable partner. I stand tall with calm shoulders, keep my promises, protect your peace, and live with real purpose. Seven years turned an insecure boy into the man standing here today.`,
    quote: "Seven years of loving you, being held accountable by you, and sharing life with you turned an insecure kid into the man standing here today.",
    mechanicNote: "Seven years of loving you turned an insecure kid into a real man."
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
  const [mismatchNotice, setMismatchNotice] = useState(null);

  const watchContainerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const mismatchTimeoutRef = useRef(null);

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
        } else if (type === "mismatch") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(130, now + 0.08);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(450, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.07, now + 0.004);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.1);
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

  // Check drop result when pointer is released: match, mismatch, or miss
  const checkDropResult = useCallback(
    (clientX, clientY, gear) => {
      for (const sGear of GEARS_DATA) {
        if (placedGearIds.has(sGear.id)) continue;
        const target = getSocketScreenPos(sGear.socketPos);
        if (!target) continue;

        const dist = Math.hypot(clientX - target.screenX, clientY - target.screenY);
        // Generous snap radius based on target socket diameter
        const threshold = (sGear.radius / 400) * target.width * 1.5;
        if (dist <= threshold) {
          if (sGear.id === gear.id) {
            return { type: "match", socket: sGear };
          } else {
            return { type: "mismatch", socket: sGear };
          }
        }
      }
      return { type: "miss" };
    },
    [getSocketScreenPos, placedGearIds]
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
  };

  const onPointerMove = useCallback(
    (e) => {
      if (!draggingGearId) return;

      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      setDragPointerPos({ x: clientX, y: clientY });
    },
    [draggingGearId]
  );

  const onPointerUp = useCallback(
    (e) => {
      if (!draggingGearId) return;

      const clientX = e.clientX || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : dragPointerPos.x);
      const clientY = e.clientY || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : dragPointerPos.y);

      const gear = GEARS_DATA.find((g) => g.id === draggingGearId);

      if (gear) {
        const dropResult = checkDropResult(clientX, clientY, gear);

        if (dropResult.type === "match") {
          // SUCCESSFUL MATCH & SNAP!
          playMechanicalSound("place");
          const newPlaced = new Set(placedGearIds).add(gear.id);
          setPlacedGearIds(newPlaced);
          setActiveStoryGearId(gear.id);
          setMismatchNotice(null);

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
        } else if (dropResult.type === "mismatch") {
          // MISMATCH - User dropped onto a wrong socket
          playMechanicalSound("mismatch");
          setMismatchNotice("Doesn't mesh here — try another pivot!");
          if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
          mismatchTimeoutRef.current = setTimeout(() => {
            setMismatchNotice(null);
          }, 2200);
        }
      }

      setDraggingGearId(null);
    },
    [draggingGearId, dragPointerPos, checkDropResult, placedGearIds, playMechanicalSound, playChime]
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
      <div className="z-20 px-4 sm:px-6 pt-2 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/90 shadow-2xs">
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
              Drag each gear from the velvet tray on the right and find its matching socket in the watch caliber.
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

      {/* 2. Main Workstation Area: Story Plate (Left) + Watchcase (Center) + Velvet Tray on the RIGHT */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-3 sm:p-5 gap-4 lg:gap-6 overflow-hidden">
        {/* LEFT COLUMN: Active Transformation Story Plate */}
        <div className="w-full lg:w-[350px] xl:w-[410px] h-full flex flex-col justify-center overflow-y-auto shrink-0 z-10">
          <AnimatePresence mode="wait">
            {activeStoryGear ? (
              <motion.div
                key={activeStoryGear.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-2 border-emerald-300 rounded-[28px] p-5 sm:p-6 shadow-xl relative overflow-hidden text-[#132e22]"
              >
                <div className="absolute -top-1.5 right-8 pointer-events-none">
                  <WashiTape className="w-14 h-3.5 opacity-80" color="bg-emerald-200" />
                </div>

                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: activeStoryGear.accentColor }}
                      className="w-3 h-3 rounded-full inline-block shadow-2xs"
                    />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Gear 0{activeStoryGear.id} Meshed // {activeStoryGear.material}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeStoryGear.metaphor}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-1">
                  {activeStoryGear.dimension}
                </h3>

                <div className="my-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                  <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold mb-0.5">
                      Before You:
                    </span>
                    <p className="font-serif italic text-slate-800 font-semibold text-[11px] sm:text-xs">
                      {activeStoryGear.before}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[9px] font-mono text-emerald-700 uppercase block font-bold mb-0.5">
                      With You:
                    </span>
                    <p className="font-serif italic text-emerald-950 font-semibold text-[11px] sm:text-xs">
                      {activeStoryGear.after}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-3">
                  {activeStoryGear.story}
                </p>

                <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-2.5">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                    "{activeStoryGear.quote}"
                  </p>
                </div>

                <div className="text-[10px] font-mono text-emerald-700 bg-[#f0fdf4] p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <SparkleStar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{activeStoryGear.mechanicNote}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-2 border-emerald-200 rounded-[28px] p-6 shadow-md text-center flex flex-col items-center justify-center min-h-[280px]"
              >
                <RibbonBow className="w-9 h-7 text-emerald-600 mb-2.5" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-2">
                  Assemble My Movement, Gear by Gear
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#3d6350] max-w-sm leading-relaxed mb-4">
                  Drag each gear from the velvet tray on the right and find its matching socket in the watch caliber.
                  <br className="hidden sm:inline" />
                  No clues are shown—examine each gear’s size and placement to discover where it belongs.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold bg-[#f0fdf4] px-4 py-2 rounded-2xl border border-emerald-200">
                  <HandMetal className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Drag gears from the right into the movement</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER COLUMN: Photorealistic Open-Heart Skeleton Watchcase */}
        <div className="flex-1 h-full flex flex-col items-center justify-center relative min-w-0 z-0">
          <div
            ref={watchContainerRef}
            className="relative w-full max-w-[400px] sm:max-w-[450px] aspect-square rounded-[36px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-3 sm:p-4 flex items-center justify-center overflow-hidden shrink-0 touch-none"
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

              {/* A. UNPLACED GEAR SOCKETS (Neutral horological caliber recesses - NO GREEN!) */}
              {GEARS_DATA.map((gear) => {
                const isPlaced = placedGearIds.has(gear.id);
                if (isPlaced) return null;

                return (
                  <g
                    key={gear.id}
                    transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y})`}
                    className="pointer-events-none"
                  >
                    {/* Neutral Caliber Recess Bore */}
                    <circle
                      r={gear.radius}
                      fill="rgba(241, 245, 249, 0.45)"
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />

                    {/* Subtle Concentric Pitch Guide Ring */}
                    <circle
                      r={gear.radius * 0.76}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      opacity="0.85"
                    />

                    {/* Recessed Pivot Jewel Well & Chaton Collar */}
                    <circle r="9" fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="1" />
                    <circle r="5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
                    <circle r="2.8" fill="url(#rubyJewelGrad)" stroke="#4c0519" strokeWidth="0.8" />
                    <circle cx="-0.9" cy="-0.9" r="0.7" fill="#ffffff" opacity="0.9" />
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

            {/* Mismatch Feedback Toast (Shown briefly when dropped on wrong socket) */}
            <AnimatePresence>
              {mismatchNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#1e293b]/95 text-amber-200 border border-amber-400/80 px-3.5 py-1.5 rounded-full shadow-xl text-[11px] font-mono font-bold pointer-events-none"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>{mismatchNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle Interactive Instruction Cue (Neutral, no green) */}
            {placedGearIds.size < 7 && !draggingGearId && !mismatchNotice && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full border border-slate-300 shadow-md text-[11px] font-mono text-slate-700 font-bold pointer-events-none">
                <Move className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
                <span>Drag gears from tray on right into movement</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Watchmaker’s Jeweled Tray (Drag Sources on the RIGHT) */}
        <div className="w-full lg:w-[290px] xl:w-[330px] h-full flex flex-col bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#022c22] rounded-[28px] border-2 border-amber-300/60 shadow-2xl p-3 sm:p-4 text-white overflow-hidden shrink-0 z-10 select-none touch-none">
          {/* Tray Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-200/20">
            <div className="flex items-center gap-1.5 text-amber-200 font-mono font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Jeweled Gear Tray</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-200 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
              {7 - placedGearIds.size > 0
                ? `${7 - placedGearIds.size} unplaced`
                : "Calibrated ♡"}
            </span>
          </div>

          <p className="text-[10px] font-sans text-emerald-100/80 mb-2 leading-tight">
            Hold and drag each gear to the movement on the left. Find where each complication meshes.
          </p>

          {/* 7 Draggable Gear Cards in Vertical Velvet Rack */}
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5">
            {GEARS_DATA.map((gear) => {
              const isPlaced = placedGearIds.has(gear.id);
              const isBeingDragged = draggingGearId === gear.id;

              return (
                <div
                  key={gear.id}
                  onPointerDown={(e) => startDrag(gear.id, e)}
                  onTouchStart={(e) => startDrag(gear.id, e)}
                  onClick={() => {
                    if (isPlaced) setActiveStoryGearId(gear.id);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center gap-3 shrink-0 text-left select-none touch-none ${
                    isPlaced
                      ? "bg-emerald-950/70 border-emerald-500/70 text-emerald-100 shadow-xs hover:bg-emerald-900 cursor-pointer opacity-90"
                      : isBeingDragged
                      ? "bg-amber-400 text-slate-950 border-amber-200 shadow-xl scale-[1.02] opacity-50 ring-2 ring-amber-300 cursor-grabbing"
                      : "bg-emerald-900/60 border-emerald-700/60 text-emerald-100 hover:border-amber-300 hover:bg-emerald-800/90 active:scale-[0.98] cursor-grab"
                  }`}
                >
                  {/* Miniature Gear Indicator */}
                  <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-inner">
                    <div
                      style={{
                        backgroundColor: isPlaced ? gear.accentColor : "#d97706"
                      }}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-2xs"
                    >
                      {isPlaced ? "✓" : gear.id}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-serif font-bold truncate text-white">
                        {gear.dimension}
                      </span>
                      <span className="text-[9px] font-mono text-amber-200/90 shrink-0">
                        {gear.radius}mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-200/80 truncate">
                        {gear.toothCount}T • {gear.material}
                      </span>
                      <span className={`shrink-0 font-bold ${isPlaced ? "text-emerald-300" : "text-amber-300"}`}>
                        {isPlaced ? "Meshed" : "Drag ⇠"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FLOATING DRAGGED GEAR (Follows pointer during drag - NO GREEN!) */}
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
              borderColor: "#d97706",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.4)"
            }}
            className="w-22 h-22 rounded-full bg-[#fffdfa]/95 border-2 flex flex-col items-center justify-center p-1.5 backdrop-blur-sm scale-110 shadow-2xl"
          >
            <div
              style={{ backgroundColor: currentDraggingGear.accentColor }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm mb-0.5"
            >
              0{currentDraggingGear.id}
            </div>
            <span className="text-[10px] font-serif font-bold text-[#132e22] text-center leading-tight">
              {currentDraggingGear.dimension}
            </span>
            <span className="text-[8px] font-mono text-amber-800 font-bold mt-0.5">
              Drop onto matching pivot
            </span>
          </div>
        </div>
      )}

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
                Seven Years Together ♡
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-3">
                You Made Me Who I Am
              </h3>

              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed mb-5">
                Every gear you placed represents a part of me that was guarded, angry, silent, or alone before you. 
                <br /><br />
                Over seven years, your patience, warmth, and steady love calmed every rough edge. I’ve become a man because of you.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "Seven gears assembled. Seven years of us. Everything good about me started with you."
                </p>
              </div>

              <button
                onClick={() => setShowGrandFinale(false)}
                className="w-full py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Watch It Turn ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
