import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves,
  Sparkles,
  Radio,
  Gem,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Check,
  ChevronRight
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

const ART_ENGINES = [
  {
    id: "fluid",
    name: "Fluid Dynamics",
    icon: Waves,
    subtitle: "Viscous Turbulence to Calm",
    theme: "Taming the Inner Storm & Hot-Headed Temper",
    accentColor: "#059669",
    story: `Before you, my mind was full of volatile, turbulent friction. I was easily angered, quick to snap, and defensive over the smallest friction.

Watching how you met adversity with quiet grace rewrote my nervous system. You didn't fight my fire; you gave it a wide, calm sea. You taught me that true strength isn't shouting through a storm—it is the calm composure that outlasts it.`,
    quote: "You took my turbulent, hot-headed friction and gently smoothed it into serene, steady flow.",
    interactionHint: "Drag or move your cursor through the fluid to stir color and watch turbulent eddies smooth into calm laminar streams."
  },
  {
    id: "swarm",
    name: "Swarm Ribbons",
    icon: Sparkles,
    subtitle: "Flocking Chaos to Harmony",
    theme: "From a Lone Wolf to a True Partner",
    accentColor: "#10b981",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down.

You became my steadfast anchor. Like thousands of scattered particles finding a single center of gravity, being with you synchronized my life. I stopped fighting life alone, because I finally found my partner in the arena.`,
    quote: "I used to be a lone particle clashing against the world. Your presence gave me a center of gravity and pulled me into harmony.",
    interactionHint: "Move your cursor to act as an attractor—watch scattered erratic ribbons coalesce into a synchronized swirling orbit of light."
  },
  {
    id: "cymatics",
    name: "Cymatic Resonance",
    icon: Radio,
    subtitle: "Acoustic Voice to Mandalas",
    theme: "From Silent Mumble to Speaking with Conviction",
    story: `I had a very silent voice. I mumbled my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head. And when we disagreed early on, it was fiery, stubborn clashes.

You listened so attentively that you made me realize my voice had value. You taught me to speak louder, articulate what I think, and trade stubborn clashes for patient, unhurried communication.`,
    quote: "You gave volume to my silence, and turned chaotic noise into sacred, patient harmony.",
    interactionHint: "Drag the frequency slider to shift sound vibrations—at harmonic frequencies, chaotic sand grains physically snap into sacred geometric mandalas!"
  },
  {
    id: "kintsugi",
    name: "Molten Kintsugi",
    icon: Gem,
    subtitle: "Fractures to Molten Gold",
    theme: "The Ice Rampart Melting & Becoming a Man",
    accentColor: "#d97706",
    story: `I was the exact mirror of Koyun from Ramparts of Ice—aloof, guarded, and acting nonchalant like I didn't care about anything. I never spoke to any girl. My independence was a frozen fortress.

You didn't fight that wall. You just showed up with genuine warmth until every crack was filled with gold. In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "You melted the ramparts of ice and poured molten gold through every fracture. I became a man because of you.",
    interactionHint: "Click and drag across the dark stone fractures to pour liquid molten gold into the cracks until the entire sculpture radiates with golden light."
  }
];

export default function AbstractGenerativeMuseum({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const [activeEngineId, setActiveEngineId] = useState("fluid");
  const [audioMuted, setAudioMuted] = useState(false);
  const [exploredEngines, setExploredEngines] = useState(new Set(["fluid"]));

  // Engine Control Parameters
  const [fluidCalmness, setFluidCalmness] = useState(0.8); // 0 (chaotic) to 1 (serene)
  const [swarmCohesion, setSwarmCohesion] = useState(0.85); // 0 (scatter) to 1 (synchronized)
  const [cymaticFreq, setCymaticFreq] = useState(432); // Hz
  const [kintsugiProgress, setKintsugiProgress] = useState(35); // % filled

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, isDown: false });

  const activeEngine = ART_ENGINES.find((e) => e.id === activeEngineId) || ART_ENGINES[0];

  const triggerChime = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  // Initialize Canvas & Active Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initEngine(activeEngineId);
    };
    window.addEventListener("resize", handleResize);

    // Initialize particles depending on active engine
    const initEngine = (engineId) => {
      particlesRef.current = [];
      const count = engineId === "fluid" ? 1800 : engineId === "swarm" ? 420 : 1600;

      if (engineId === "fluid") {
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2.5 + 1.2,
            color: Math.random() > 0.5 ? "#10b981" : Math.random() > 0.3 ? "#34d399" : "#fbbf24",
            alpha: Math.random() * 0.7 + 0.3
          });
        }
      } else if (engineId === "swarm") {
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 2.2 + 1.5,
            history: [],
            color: Math.random() > 0.4 ? "#34d399" : "#fef08a"
          });
        }
      } else if (engineId === "cymatics") {
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: (Math.random() - 0.5) * Math.min(width, height) * 0.78,
            y: (Math.random() - 0.5) * Math.min(width, height) * 0.78,
            size: Math.random() * 1.8 + 1.0,
            alpha: Math.random() * 0.8 + 0.2
          });
        }
      }
    };

    initEngine(activeEngineId);

    // Engine Render Loop
    let time = 0;
    const render = () => {
      time += 0.016;

      if (activeEngineId === "fluid") {
        // FLUID DYNAMICS ENGINE: Viscous flow lines with color diffusion
        ctx.fillStyle = "rgba(7, 26, 18, 0.16)";
        ctx.fillRect(0, 0, width, height);

        const calm = fluidCalmness; // 0 to 1
        const centerX = width / 2;
        const centerY = height / 2;

        particlesRef.current.forEach((p) => {
          // Flow Field calculation
          const angle =
            Math.sin(p.x * 0.003 + time * (1 - calm * 0.7)) * 2 +
            Math.cos(p.y * 0.003 + time * (1 - calm * 0.7)) * 2;

          // Stir with mouse velocity
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 140) {
            p.vx += (mdx / mdist) * 0.6;
            p.vy += (mdy / mdist) * 0.6;
          }

          // Laminar smoothing as calmness increases
          const targetVx = Math.cos(angle) * (1.5 + (1 - calm) * 3);
          const targetVy = Math.sin(angle) * (1.5 + (1 - calm) * 3);

          p.vx += (targetVx - p.vx) * 0.08;
          p.vy += (targetVy - p.vy) * 0.08;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw fluid point
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
      } else if (activeEngineId === "swarm") {
        // SWARM RIBBONS: Flocking particles coalescing into harmonic orbital ribbons
        ctx.fillStyle = "rgba(7, 26, 18, 0.22)";
        ctx.fillRect(0, 0, width, height);

        const cohesion = swarmCohesion;
        const targetX = mouseRef.current.x || width / 2;
        const targetY = mouseRef.current.y || height / 2;

        particlesRef.current.forEach((p, idx) => {
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const dist = Math.hypot(dx, dy) || 1;

          // Gravitational attraction towards target
          const force = (dist / 300) * cohesion * 0.25;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

          // Tangential orbital spin
          p.vx += (-dy / dist) * (1.8 * cohesion);
          p.vy += (dx / dist) * (1.8 * cohesion);

          // Damping
          p.vx *= 0.95;
          p.vy *= 0.95;

          p.x += p.vx;
          p.y += p.vy;

          // Store ribbon history
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 7) p.history.shift();

          // Draw ribbon stroke
          if (p.history.length > 2) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let h = 1; h < p.history.length; h++) {
              ctx.lineTo(p.history[h].x, p.history[h].y);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.globalAlpha = 0.65;
            ctx.stroke();
          }
        });
      } else if (activeEngineId === "cymatics") {
        // CYMATICS ENGINE: Chladni plate frequency mandalas
        ctx.fillStyle = "rgba(7, 26, 18, 0.35)";
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        // Frequencies create nodal lines where vibration is zero
        // Chladni equation: cos(n*pi*x/L)*cos(m*pi*y/L) - cos(m*pi*x/L)*cos(n*pi*y/L) = 0
        const m = Math.floor(cymaticFreq / 100) + 1;
        const n = ((cymaticFreq % 100) / 18) + 2;
        const L = Math.min(width, height) * 0.4;

        particlesRef.current.forEach((p) => {
          // Calculate Chladni vibration amplitude at this point
          const nx = (p.x / L) * Math.PI;
          const ny = (p.y / L) * Math.PI;

          const amplitude =
            Math.cos(n * nx) * Math.cos(m * ny) - Math.cos(m * nx) * Math.cos(n * ny);

          // Particles migrate towards nodal lines (where amplitude == 0)
          const gradX = -Math.sin(n * nx) * Math.cos(m * ny) * n + Math.sin(m * nx) * Math.cos(n * ny) * m;
          const gradY = -Math.cos(n * nx) * Math.sin(m * ny) * m + Math.cos(m * nx) * Math.sin(n * ny) * n;

          p.x -= gradX * amplitude * 1.5;
          p.y -= gradY * amplitude * 1.5;

          // Gentle brownian jitter
          p.x += (Math.random() - 0.5) * 0.8;
          p.y += (Math.random() - 0.5) * 0.8;

          // Draw sand grain
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY + p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#fef08a";
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });

        // Outer Chladni Plate Rim
        ctx.beginPath();
        ctx.arc(centerX, centerY, L, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(110, 231, 183, 0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (activeEngineId === "kintsugi") {
        // KINTSUGI ENGINE: Minimalist fractured stone with molten gold veins
        ctx.fillStyle = "#091c13"; // Dark matte stone
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const stoneSize = Math.min(width, height) * 0.72;

        // Draw dark monolith stone slab
        ctx.save();
        ctx.translate(centerX, centerY);

        ctx.fillStyle = "#0c271b";
        ctx.strokeStyle = "#164e37";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-stoneSize / 2, -stoneSize / 2, stoneSize, stoneSize, 36);
        ctx.fill();
        ctx.stroke();

        // Fractures across the stone
        const fractures = [
          [[-0.4, -0.4], [-0.15, -0.1], [0.1, 0.05], [0.38, 0.35]],
          [[0.4, -0.38], [0.15, -0.15], [-0.1, 0.15], [-0.35, 0.42]],
          [[0.0, -0.45], [0.05, -0.1], [-0.05, 0.25], [0.0, 0.46]],
          [[-0.45, 0.0], [-0.2, 0.05], [0.25, -0.05], [0.46, 0.0]]
        ];

        // Draw glowing molten gold through fractures based on kintsugiProgress
        const progressFrac = kintsugiProgress / 100;

        fractures.forEach((frac, fIdx) => {
          ctx.beginPath();
          ctx.moveTo(frac[0][0] * stoneSize, frac[0][1] * stoneSize);
          for (let i = 1; i < frac.length; i++) {
            ctx.lineTo(frac[i][0] * stoneSize, frac[i][1] * stoneSize);
          }

          // Fractured crack baseline
          ctx.strokeStyle = "#04150e";
          ctx.lineWidth = 8;
          ctx.stroke();

          // Molten Gold Fill
          if (progressFrac > 0) {
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 5;
            ctx.shadowColor = "#fef08a";
            ctx.shadowBlur = progressFrac * 22;
            ctx.globalAlpha = Math.min(1, progressFrac * 1.25);
            ctx.stroke();

            // Core white-gold intense light
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });

        // Center Gold Seal Core
        if (progressFrac > 0.6) {
          ctx.beginPath();
          ctx.arc(0, 0, progressFrac * 32, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeEngineId, fluidCalmness, swarmCohesion, cymaticFreq, kintsugiProgress]);

  // Pointer tracking
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.isDown = true;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;

    if (activeEngineId === "kintsugi") {
      setKintsugiProgress((prev) => Math.min(100, prev + 15));
      triggerChime(523.25 + kintsugiProgress * 2);
    } else {
      triggerChime(440);
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.px = mouseRef.current.x;
    mouseRef.current.py = mouseRef.current.y;
    mouseRef.current.x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    mouseRef.current.y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    if (mouseRef.current.isDown && activeEngineId === "kintsugi") {
      setKintsugiProgress((prev) => Math.min(100, prev + 2.5));
    }
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  const switchEngine = (id) => {
    setActiveEngineId(id);
    setExploredEngines((prev) => new Set(prev).add(id));
    triggerChime(523.25);
  };

  // Complete Space 06 once all 4 abstract systems are explored
  useEffect(() => {
    if (exploredEngines.size === 4 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [exploredEngines, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#06170f] text-white">
      {/* 1. Header Toolbar with Engine Switcher */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 bg-[#0a2317]/95 backdrop-blur-md border-b border-emerald-900/80 shadow-md">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-emerald-100">
                Chapter 6 // The Generative Art Studio: The Mythri Effect
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-300/80 font-sans">
              Experience the 4 abstract mediums—choose which artistic visualization represents your transformation best
            </p>
          </div>
        </div>

        {/* 4 Engine Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#05140c] p-1 rounded-2xl border border-emerald-800 shadow-inner overflow-x-auto max-w-full">
          {ART_ENGINES.map((eng) => {
            const isActive = activeEngineId === eng.id;
            const Icon = eng.icon;

            return (
              <button
                key={eng.id}
                onClick={() => switchEngine(eng.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs scale-105 ring-1 ring-emerald-400"
                    : "text-emerald-300/70 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{eng.name}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Mute & Explored Tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-300/70">
            Explored: {exploredEngines.size} / 4
          </span>
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-1.5 rounded-full bg-[#05140c] hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 transition-colors shadow-2xs cursor-pointer"
            title={audioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. Main Generative Interactive Canvas Viewport */}
      <div className="relative flex-1 w-full h-full select-none overflow-hidden touch-none flex items-center justify-center">
        {/* The Generative Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Top Interactive Controls Overlay for Active Engine */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-[#0a2317]/90 backdrop-blur-md border border-emerald-700/80 rounded-full px-5 py-2 shadow-xl flex items-center justify-between gap-4 z-20 text-xs font-mono">
          {activeEngineId === "fluid" && (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-emerald-300 shrink-0">Turbulent (2019)</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={fluidCalmness}
                onChange={(e) => setFluidCalmness(Number(e.target.value))}
                className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-emerald-400 font-bold shrink-0">Serene (2026)</span>
            </div>
          )}

          {activeEngineId === "swarm" && (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-emerald-300 shrink-0">Lone Scatter</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={swarmCohesion}
                onChange={(e) => setSwarmCohesion(Number(e.target.value))}
                className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-emerald-400 font-bold shrink-0">Harmonic Orbit</span>
            </div>
          )}

          {activeEngineId === "cymatics" && (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-emerald-300 shrink-0">Frequency:</span>
              <input
                type="range"
                min="100"
                max="880"
                step="20"
                value={cymaticFreq}
                onChange={(e) => {
                  setCymaticFreq(Number(e.target.value));
                  triggerChime(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-emerald-400 font-bold shrink-0 w-16 text-right">
                {cymaticFreq} Hz
              </span>
            </div>
          )}

          {activeEngineId === "kintsugi" && (
            <div className="flex items-center justify-between w-full gap-3">
              <span className="text-amber-400 shrink-0 font-bold">Molten Gold:</span>
              <div className="w-full bg-[#05140c] h-2 rounded-full overflow-hidden border border-amber-800/80">
                <div
                  style={{ width: `${kintsugiProgress}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-200"
                />
              </div>
              <span className="text-amber-300 font-bold shrink-0 w-12 text-right">
                {Math.round(kintsugiProgress)}%
              </span>
            </div>
          )}
        </div>

        {/* Bottom Narrative Reflection Card */}
        <motion.div
          key={activeEngine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-20 pointer-events-auto"
        >
          <div className="bg-[#0a2317]/95 backdrop-blur-md border border-emerald-700/90 rounded-[28px] p-5 shadow-2xl relative overflow-hidden text-emerald-100">
            {/* Washi Tape */}
            <div className="absolute -top-1.5 right-10 pointer-events-none">
              <WashiTape className="w-16 h-4 opacity-70" color="bg-emerald-800" />
            </div>

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800/80">
              <div className="flex items-center gap-2">
                <PopFlower className="w-4 h-4 text-emerald-400" color="#34d399" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                  {activeEngine.name} // {activeEngine.subtitle}
                </span>
              </div>
              <span className="text-[11px] font-serif text-emerald-300/80 italic">
                {activeEngine.theme}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans text-emerald-200/90 leading-relaxed mb-3">
              {activeEngine.story}
            </p>

            <div className="p-3 rounded-2xl bg-[#05140c]/90 border border-emerald-800/80">
              <p className="text-xs font-serif italic text-amber-200 font-medium">
                "{activeEngine.quote}"
              </p>
            </div>

            <p className="text-[10px] font-mono text-emerald-400/80 mt-2 text-center">
              💡 {activeEngine.interactionHint}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
