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
    dimension: "The Late-Night Anchor",
    metaphor: "Always in Your Corner",
    accentColor: "#38bdf8",
    colorName: "Glacial Cyan",
    socketPos: { x: 74, y: -74 },
    radius: 46,
    material: "Pure Devotion",
    gradientId: "steelGrad",
    toothCount: 15,
    rotSpeed: -1.2,
    spokeCount: 5,
    before: "Cold, guarded, and locked inside my own head—pretending nothing mattered just to keep people away.",
    after: "The guy who stays awake until 3 AM by your side, making sure you never face an exhausting night alone.",
    story: `Before you, I was closed off behind walls I spent years building. I kept everyone at arm's length, gave cold one-word answers, and pretended I didn't care about anything just so no one could reach me.

You never fought my walls; you just met me with steady warmth until every layer melted away. Now, staying awake through the night just to keep you company, being the one you lean on when you're exhausted, and quietly taking care of your world is the easiest thing I do. You turned someone who used to be detached into the one who will never let you feel alone.`,
    quote: "You turned someone who used to be detached into the guy who will happily stay up all night making sure your world is taken care of.",
    note: "Staying up with you until the world goes quiet ♡"
  },
  {
    id: 2,
    dimension: "The Calm in the Storm",
    metaphor: "Gentle Composure",
    accentColor: "#f59e0b",
    colorName: "Amber Flame",
    socketPos: { x: -72, y: -62 },
    radius: 54,
    material: "Gentle Composure",
    gradientId: "roseGoldGrad",
    toothCount: 22,
    rotSpeed: 0.9,
    spokeCount: 3,
    before: "Hair-trigger anger, snapping over minor friction, and reacting on sharp impulse.",
    after: "Taking a deep breath, holding my fire, and being your calm center when everything feels overwhelming.",
    story: `I used to have a hot head. If something went wrong, my reflex was to clench my jaw, snap with a sharp tone, and let irritation take over. I thought reacting with fire was strength.

Being with you completely rewrote my nervous system. You showed me that shouting through a storm never solved a single thing. Over seven years, you taught me how to take a breath, sit quietly with your heavy days, and meet your chaos with steady reassurance instead of matching the stress. You gave me the patience I never had.`,
    quote: "You taught me that being strong isn't reacting with fire; it’s being the steady, calm listener when everything else is loud.",
    note: "You taught me to breathe through chaos and be your safe harbor ♡"
  },
  {
    id: 3,
    dimension: "Finding My Voice",
    metaphor: "My Words Carry Weight",
    accentColor: "#10b981",
    colorName: "Vivid Emerald",
    socketPos: { x: -74, y: 64 },
    radius: 48,
    material: "Deep Conviction",
    gradientId: "steelGrad",
    toothCount: 20,
    rotSpeed: -0.65,
    spokeCount: 4,
    before: "Looking down, mumbling under my breath, and shrinking away into the corner.",
    after: "Looking you in the eyes, speaking with honest confidence, and believing my voice matters.",
    story: `I kept everything locked inside my chest. I looked down, mumbled under my breath, and stayed silent because I never believed what I had to say was worth the room's attention.

Because you listened to me with your full heart and genuinely cared about my thoughts, I stopped shrinking into the corner. You gave volume to my silence. Now, I look you in the eyes, speak what I feel without fear, and articulate what I need with honest conviction.`,
    quote: "You gave volume to my silence because you were the first person who made me feel like my words actually carried weight.",
    note: "You made me feel heard for the first time in my life ♡"
  },
  {
    id: 4,
    dimension: "Solving Life as a Team",
    metaphor: "No Ego, Just Us",
    accentColor: "#f43f5e",
    colorName: "Rose Quartz",
    socketPos: { x: -22, y: 72 },
    radius: 40,
    material: "Teamwork Rhythm",
    gradientId: "brassGrad",
    toothCount: 18,
    rotSpeed: 0.75,
    spokeCount: 4,
    before: "Stubborn clashes, cold shoulders, and fighting defensive battles just to 'win'.",
    after: "Putting down our pride, laughing through tension, and sitting down to talk things through together.",
    story: `Early on, when we disagreed, our pride flared up. We had stubborn, fiery clashes where we fought to be right—walking away with bruised egos and cold silence.

Over seven years, that dynamic completely transformed. We learned that being right means nothing if it hurts us. Now, when tension hits, we drop our defenses, sit down, and talk through it patiently. We stopped fighting each other and started solving life as a team.`,
    quote: "We stopped fighting each other and started solving life as a team.",
    note: "No ego between us—just choosing each other every time ♡"
  },
  {
    id: 5,
    dimension: "The Grounded Truth",
    metaphor: "Cutting Through the Static",
    accentColor: "#eab308",
    colorName: "Golden Lens",
    socketPos: { x: 78, y: 8 },
    radius: 44,
    material: "Grounded Clarity",
    gradientId: "roseGoldGrad",
    toothCount: 18,
    rotSpeed: -0.85,
    spokeCount: 3,
    before: "Overthinking spirals, catastrophizing what-ifs, and sleepless nights trapped in mental panic.",
    after: "Your straightforward, steady clarity that pulls me out of my head and brings me right back to earth.",
    story: `My mind has a habit of racing ahead—magnifying small worries, spiraling into worst-case scenarios, and getting trapped in stressful narratives of my own making.

You became my reality check. When everything in my head is spinning, your steady, grounded clarity cuts straight through the static. Talking to you for ten minutes brings me back to solid earth and makes me realize things are never as terrifying as my thoughts made them seem. You bring me peace when my mind won't rest.`,
    quote: "Whenever my mind starts spiraling into a hundred 'what-ifs', you bring me right back to earth with one sentence.",
    note: "Your steady clarity cuts right through all my mental static ♡"
  },
  {
    id: 6,
    dimension: "No Longer Alone in the Arena",
    metaphor: "Never Alone Again",
    accentColor: "#059669",
    colorName: "Deep Jade",
    socketPos: { x: 50, y: 70 },
    radius: 68,
    material: "Unconditional Anchor",
    gradientId: "brassGrad",
    toothCount: 30,
    rotSpeed: 0.35,
    spokeCount: 5,
    before: "Carrying every burden alone, hiding my stress, and pretending I didn't need anyone.",
    after: "Taking pride in your happiness, sharing every load, and resting in having an anchor in my corner.",
    story: `I operated like a solitary fighter. I believed relying on anyone was an invitation to get hurt, so I carried every burden alone, hid my stress, and kept my emotional armor tightly strapped on.

Loving you showed me how exhausting it was to fight the world by myself. You became my safest home and my proudest partner. Sharing life with you, cheering for every dream you chase, and knowing you are standing in my corner changed how I face the world. I don't have to carry life alone anymore.`,
    quote: "I spent years thinking I had to fight life alone. Loving you made me realize how much better it is to have an anchor in your corner.",
    note: "I stopped fighting life alone because I found my partner ♡"
  },
  {
    id: 7,
    dimension: "The Man Standing Here Today",
    metaphor: "Seven Years of Loving You",
    accentColor: "#86efac",
    colorName: "Starlight Gold",
    socketPos: { x: 0, y: 0 },
    radius: 36,
    material: "Full Devotion",
    gradientId: "goldGrad",
    toothCount: 16,
    rotSpeed: 0.45,
    spokeCount: 4,
    before: "An insecure, guarded boy hiding behind nonchalance, unsure of his purpose or worth.",
    after: "A grounded, calm, protective partner who keeps his promises and loves you with his whole soul.",
    story: `Looking back at who I used to be, I was an insecure, guarded boy hiding behind an aloof mask, unsure of where he belonged and scared of being vulnerable.

Seven years of loving you, being held accountable by you, and sharing life with you turned that kid into a real man. I stand tall with calm shoulders, keep my promises, protect your peace, and live with genuine purpose. Everything gentle, steady, and good about me started with you.`,
    quote: "Seven years of loving you, being held accountable by you, and sharing life with you turned an insecure kid into the man standing here today.",
    note: "Seven years of loving you made me who I am today ♡"
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
          playMechanicalSound("mismatch");
          setMismatchNotice("Not here — find where it fits in my heart ♡");
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
      <div className="z-20 px-4 sm:px-6 pt-2.5 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#132e22]">
                The Mythri Effect ♡
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[11px] text-[#3d6350] font-serif italic">
              Seven years of how loving you quietly rewrote my entire heart.
            </p>
          </div>
        </div>

        {/* Assembly Status & Audio */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-serif font-bold text-emerald-800 shadow-2xs">
            {placedGearIds.size} of 7 in my heart ♡
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

      {/* 2. Main Workstation Area: Story Plate (Left) + Turning Movement (Center) + Memories Tray on the RIGHT */}
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
                    <span className="text-xs font-serif font-bold text-emerald-800">
                      With You ♡
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {activeStoryGear.metaphor}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-1">
                  {activeStoryGear.dimension}
                </h3>

                <div className="my-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                  <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200">
                    <span className="text-[10px] font-sans text-slate-500 uppercase block font-bold mb-0.5">
                      Before You:
                    </span>
                    <p className="font-serif italic text-slate-800 font-medium text-xs sm:text-[13px]">
                      {activeStoryGear.before}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-sans text-emerald-700 uppercase block font-bold mb-0.5">
                      With You:
                    </span>
                    <p className="font-serif italic text-emerald-950 font-medium text-xs sm:text-[13px]">
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

                <div className="text-[11px] font-sans text-emerald-800 bg-[#f0fdf4] p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <SparkleStar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{activeStoryGear.note}</span>
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
                  How You Changed Me ♡
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#3d6350] max-w-sm leading-relaxed mb-4">
                  Every piece of who I am today exists because of you. Drag each memory across to see what seven years of your love built in me.
                </p>
                <div className="flex items-center gap-2 text-xs font-serif text-emerald-700 font-bold bg-[#f0fdf4] px-4 py-2 rounded-2xl border border-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Drag each memory across to begin ♡</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER COLUMN: Turning Open-Heart Movement with Ghost Gears */}
        <div className="flex-1 h-full flex flex-col items-center justify-center relative min-w-0 z-0">
          <div
            ref={watchContainerRef}
            className="relative w-full max-w-[400px] sm:max-w-[450px] aspect-square rounded-[36px] bg-[#fffdfa] border-2 border-emerald-300 shadow-2xl p-3 sm:p-4 flex items-center justify-center overflow-hidden shrink-0 touch-none"
          >
            {/* Outer Bezel Ring */}
            <div className="absolute inset-2 sm:inset-3 rounded-full border-[6px] sm:border-[8px] border-slate-300 shadow-2xl bg-radial from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] pointer-events-none" />

            {/* Inner Movement Ring */}
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

              {/* A. UNPLACED GHOST GEARS: "Seen without being seen" for intuitive matching! */}
              {GEARS_DATA.map((gear) => {
                const isPlaced = placedGearIds.has(gear.id);
                if (isPlaced) return null;

                const hubR = gear.radius * 0.28;
                const rimInnerR = gear.radius * 0.72;
                const ghostGearPath = generateInvoluteGearPath(0, 0, gear.radius, gear.toothCount, hubR);
                const ghostSpokeWindows = generateSpokeWindows(0, 0, hubR + 4, rimInnerR - 2, gear.spokeCount);

                return (
                  <g
                    key={gear.id}
                    transform={`translate(${gear.socketPos.x}, ${gear.socketPos.y})`}
                    className="pointer-events-none"
                  >
                    {/* Ghost Gear Silhouette Outline */}
                    <path
                      d={ghostGearPath}
                      fill="rgba(241, 245, 249, 0.45)"
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                      strokeDasharray="3 2"
                      opacity="0.32"
                    />

                    {/* Ghost Spokes */}
                    {ghostSpokeWindows.map((swPath, wIdx) => (
                      <path
                        key={wIdx}
                        d={swPath}
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="0.8"
                        opacity="0.35"
                      />
                    ))}

                    {/* Subtle Pivot Chaton & Jewel */}
                    <circle r={hubR} fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.4" />
                    <circle r="7" fill="url(#chatonGrad)" stroke="#78350f" strokeWidth="0.8" opacity="0.6" />
                    <circle r="3.5" fill="url(#rubyJewelGrad)" stroke="#4c0519" strokeWidth="0.6" opacity="0.65" />
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

              {/* C. TURNING HANDS */}
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

            {/* Mismatch Feedback (Soft, emotional cue) */}
            <AnimatePresence>
              {mismatchNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#1e293b]/95 text-amber-200 border border-amber-400/80 px-4 py-1.5 rounded-full shadow-xl text-xs font-serif font-medium pointer-events-none"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>{mismatchNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle Interactive Instruction Cue (Neutral, pure emotion) */}
            {placedGearIds.size < 7 && !draggingGearId && !mismatchNotice && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-3.5 py-1 rounded-full border border-emerald-200 shadow-md text-xs font-serif text-emerald-800 font-medium pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Find where each piece fits into my heart ♡</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Memories of Change Tray (Drag Sources on the RIGHT) */}
        <div className="w-full lg:w-[290px] xl:w-[330px] h-full flex flex-col bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#022c22] rounded-[28px] border-2 border-amber-300/60 shadow-2xl p-3 sm:p-4 text-white overflow-hidden shrink-0 z-10 select-none touch-none">
          {/* Tray Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-200/20">
            <div className="flex items-center gap-1.5 text-amber-200 font-serif font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Memories of Change ♡</span>
            </div>
            <span className="text-[10px] font-sans text-emerald-200 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 font-medium">
              {7 - placedGearIds.size > 0
                ? `${7 - placedGearIds.size} left to explore`
                : "All in my heart ♡"}
            </span>
          </div>

          <p className="text-[11px] font-serif italic text-emerald-100/90 mb-2 leading-tight">
            Hold and drag each memory across into my heart.
          </p>

          {/* 7 Draggable Memory Cards in Right Column */}
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
                  {/* Miniature Indicator */}
                  <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-inner">
                    <div
                      style={{
                        backgroundColor: isPlaced ? gear.accentColor : "#d97706"
                      }}
                      className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-serif font-bold text-white shadow-2xs"
                    >
                      {isPlaced ? "♡" : gear.id}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-serif font-bold truncate text-white">
                        {gear.dimension}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-sans">
                      <span className="text-emerald-200/90 truncate italic">
                        {gear.metaphor}
                      </span>
                      <span className={`shrink-0 font-bold ml-1 ${isPlaced ? "text-emerald-300" : "text-amber-300"}`}>
                        {isPlaced ? "In my heart ♡" : "Drag ⇠"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FLOATING DRAGGED TOKEN (Pure emotion!) */}
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
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif font-bold text-white shadow-sm mb-0.5"
            >
              0{currentDraggingGear.id}
            </div>
            <span className="text-[10px] font-serif font-bold text-[#132e22] text-center leading-tight">
              {currentDraggingGear.dimension}
            </span>
            <span className="text-[8px] font-sans text-amber-900 font-semibold mt-0.5">
              Place into my heart ♡
            </span>
          </div>
        </div>
      )}

      {/* 4. Grand Finale Modal when all 7 truths are assembled */}
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

              <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Seven Years Together ♡
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-3">
                You Made Me Who I Am
              </h3>

              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed mb-5">
                Every single part of me that is gentle, patient, loving, and strong was shaped by you. 
                <br /><br />
                Over seven years, your warmth melted through every wall I ever put up. You turned an angry, guarded boy into a real man. Everything good about me started with you.
              </p>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "Seven years of loving you. Every beat of my heart belongs to you."
                </p>
              </div>

              <button
                onClick={() => setShowGrandFinale(false)}
                className="w-full py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Forever Yours ♡
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
