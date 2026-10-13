import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Volume2, VolumeX, Eye, Heart, X } from "lucide-react";
import { RibbonBow, FlowerBlossom, WashiTape, PopFlower } from "../../components/common/GirlyPopDecorations";

const RESONANCES = [
  {
    id: 1,
    title: "The Quieting of Noise",
    faculty: "Gentleness",
    vignette:
      "When your movements slow down, the static clears. In seven years, your gentleness has always been the one thing capable of silencing the storm in my head.",
    quote: "You taught me that strength isn't volume; it's the quiet patience that outlasts the storm.",
    x: 22,
    y: 30,
    color: "#059669",
    freq: 392.0 // G4
  },
  {
    id: 2,
    title: "Altered Trajectory",
    faculty: "Warmth & Laughter",
    vignette:
      "A single burst of your laughter changes the course of my entire day. You gently redirected my compass away from cold cynicism and toward openhearted warmth.",
    quote: "You proved that life doesn't need to be defended against; it can be laughed with.",
    x: 75,
    y: 26,
    color: "#10b981",
    freq: 440.0 // A4
  },
  {
    id: 3,
    title: "The Center of Gravity",
    faculty: "Sanctuary",
    vignette:
      "Whenever you hold still, everything gathers around you. In the chaos of work, schedules, and distance, you became the gravity I always return to.",
    quote: "Home stopped being an address; it became wherever you are sitting.",
    x: 32,
    y: 72,
    color: "#34d399",
    freq: 523.25 // C5
  },
  {
    id: 4,
    title: "Vibrancy in Routine",
    faculty: "Color & Spontaneity",
    vignette:
      "You flooded my world with color—spontaneous food cravings, fierce opinions on UNO cards, and the sheer warmth you radiate wherever you step.",
    quote: "You taught me to stop living for tomorrow and fall in love with today.",
    x: 80,
    y: 68,
    color: "#6ee7b7",
    freq: 587.33 // D5
  },
  {
    id: 5,
    title: "A Benchmark of Integrity",
    faculty: "Unconditional Loyalty",
    vignette:
      "You never perform kindness for an audience. Watching your quiet, uncompromising loyalty to those you love taught me what real character looks like.",
    quote: "You are the standard of integrity I measure my own actions against.",
    x: 50,
    y: 20,
    color: "#047857",
    freq: 659.25 // E5
  },
  {
    id: 6,
    title: "The Mythri Effect",
    faculty: "The Cumulative Symphony",
    vignette:
      "Seven years of your light, ripples, gravity, and warmth. I am kinder, happier, and infinitely better because I love you. That is the Mythri Effect.",
    quote: "To love you for seven years was to be remade into someone I truly love being.",
    x: 50,
    y: 52,
    color: "#059669",
    freq: 783.99 // G5
  }
];

export default function DemoRippleResonance({ playChime }) {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const sproutsRef = useRef([]);
  const [activeResonance, setActiveResonance] = useState(null);
  const [discoveredIds, setDiscoveredIds] = useState(new Set());
  const [autoBreathe, setAutoBreathe] = useState(false);

  // Trigger ripple at coordinate
  const createRipple = useCallback(
    (x, y, isBig = false) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: isBig ? 180 : 110,
        opacity: isBig ? 0.7 : 0.45,
        speed: isBig ? 2.8 : 2.2,
        color: isBig ? "rgba(16, 185, 129, 0.4)" : "rgba(52, 211, 153, 0.3)"
      });

      // Sprout small persistent botanical leaves along path
      if (Math.random() > 0.4) {
        sproutsRef.current.push({
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 20 - 10),
          angle: Math.random() * Math.PI * 2,
          size: Math.random() * 8 + 6,
          opacity: 0.85,
          color: Math.random() > 0.5 ? "#86efac" : "#bbf7d0"
        });
        if (sproutsRef.current.length > 120) sproutsRef.current.shift();
      }

      // Check proximity to resonances
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      RESONANCES.forEach((res) => {
        const rx = (res.x / 100) * w;
        const ry = (res.y / 100) * h;
        const dist = Math.hypot(rx - x, ry - y);
        if (dist < 45) {
          if (!discoveredIds.has(res.id)) {
            setDiscoveredIds((prev) => new Set(prev).add(res.id));
            setActiveResonance(res);
            if (playChime) playChime(res.freq, 0.6);
          }
        }
      });
    },
    [discoveredIds, playChime]
  );

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      // Clear with soft trails
      ctx.fillStyle = "rgba(247, 250, 248, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Draw persistent sprouted leaves
      sproutsRef.current.forEach((sprout) => {
        ctx.save();
        ctx.translate(sprout.x, sprout.y);
        ctx.rotate(sprout.angle);
        ctx.fillStyle = sprout.color;
        ctx.globalAlpha = sprout.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 0, sprout.size, sprout.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Update & Draw Expanding Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.opacity -= 0.008;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = r.opacity;
        ctx.stroke();

        // Inner soft echo ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 12), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(167, 243, 208, 0.4)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = r.opacity * 0.6;
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Pointer interactions
  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createRipple(x, y, true);
    if (playChime) playChime(440, 0.4);
  };

  const handlePointerMove = (e) => {
    if (e.buttons === 1 || e.type === "touchmove") {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      createRipple(x, y, false);
    }
  };

  const clearCanvas = () => {
    ripplesRef.current = [];
    sproutsRef.current = [];
    setDiscoveredIds(new Set());
    setActiveResonance(null);
    if (playChime) playChime(523.25, 0.3);
  };

  const triggerHarmonizeAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    RESONANCES.forEach((res, i) => {
      setTimeout(() => {
        const x = (res.x / 100) * canvas.width;
        const y = (res.y / 100) * canvas.height;
        createRipple(x, y, true);
        setDiscoveredIds((prev) => new Set(prev).add(res.id));
        if (playChime) playChime(res.freq, 0.5);
      }, i * 280);
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-emerald-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Direction 2 // The Ripple & Resonance Chamber
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Resonances: {discoveredIds.size} / 6
              </span>
            </div>
            <p className="text-[11px] text-[#3d6350] font-sans">
              Touch or glide across the canvas to awaken ripples and discover personal truths
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerHarmonizeAll}
            className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-serif font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Harmonize All</span>
          </button>

          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#3d6350] border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
            title="Reset Canvas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Generative Botanical Canvas & Resonance Nodes */}
      <div className="relative flex-1 w-full h-full touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="absolute inset-0 w-full h-full bg-[#f7faf8]"
        />

        {/* Floating Resonance Nodes */}
        {RESONANCES.map((res) => {
          const isDiscovered = discoveredIds.has(res.id);
          const isSelected = activeResonance?.id === res.id;

          return (
            <motion.div
              key={res.id}
              style={{ left: `${res.x}%`, top: `${res.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer pointer-events-auto"
              onClick={() => {
                setActiveResonance(res);
                setDiscoveredIds((prev) => new Set(prev).add(res.id));
                const canvas = canvasRef.current;
                if (canvas) {
                  createRipple((res.x / 100) * canvas.width, (res.y / 100) * canvas.height, true);
                }
                if (playChime) playChime(res.freq, 0.7);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pulsing ring halo */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.8, delay: res.id * 0.3 }}
                  className={`absolute w-12 h-12 rounded-full -inset-2 ${
                    isDiscovered ? "bg-emerald-300/40" : "bg-emerald-200/20"
                  }`}
                />

                {/* Node Core */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all ${
                    isDiscovered
                      ? "bg-emerald-600 border-white text-white"
                      : "bg-white/90 border-emerald-300 text-emerald-800"
                  } ${isSelected ? "ring-4 ring-emerald-300" : ""}`}
                >
                  <FlowerBlossom
                    className="w-4 h-4"
                    petalColor={isDiscovered ? "#ffffff" : "#86efac"}
                    centerColor="#fef08a"
                  />
                </div>

                {/* Node Label Pill */}
                <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 border border-emerald-200 text-[10px] font-serif font-bold text-[#132e22] shadow-xs whitespace-nowrap pointer-events-none">
                  {res.title}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* 3. Floating Detail Card for Active Resonance */}
        <AnimatePresence>
          {activeResonance && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-30 pointer-events-auto"
            >
              <div className="bg-[#fffdfa] border-2 border-emerald-300 rounded-[28px] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-[#132e22]">
                {/* Washi tape */}
                <div className="absolute -top-1 right-8 pointer-events-none">
                  <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
                </div>

                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <PopFlower className="w-5 h-5 text-emerald-600" color="#a7f3d0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Resonance // {activeResonance.faculty}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveResonance(null)}
                    className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-2">
                  {activeResonance.title}
                </h4>

                <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed mb-3">
                  {activeResonance.vignette}
                </p>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium">
                    "{activeResonance.quote}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
