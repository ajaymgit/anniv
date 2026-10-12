import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Sparkles,
  RefreshCw,
  Download,
  Volume2,
  VolumeX,
  Heart,
  ChevronDown,
  ChevronUp,
  Camera,
  Eye,
  Info
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import { RibbonBow, FlowerBlossom, PopFlower, WashiTape, SparkleStar } from "../components/common/GirlyPopDecorations";

// -------------------------------------------------------------
// Emergent Personal Truths (Botanical Living Art)
// -------------------------------------------------------------
const EMERGENT_TRUTHS = [
  {
    id: "gentleness",
    trigger: "Gentle Touch",
    title: "The Quieting of Noise",
    vignette: "When your movements slow down, the static clears. In seven years, your gentleness has always been the one thing capable of silencing the storm in my head.",
    color: "#34d399",
    badge: "Discovered through Calmness"
  },
  {
    id: "rhythm",
    trigger: "Sweeping Momentum",
    title: "Altered Trajectory",
    vignette: "A single burst of your energy or laughter changes the course of my entire day. You gently redirected my compass away from cynicism and toward heart.",
    color: "#6ee7b7",
    badge: "Discovered through Momentum"
  },
  {
    id: "dwell",
    trigger: "Lingering Presence",
    title: "The Center of Gravity",
    vignette: "Whenever you hold still, everything gathers around you. In the chaos of work, cities, and distance, you became the gravity I always return to.",
    color: "#10b981",
    badge: "Discovered through Stillness"
  },
  {
    id: "color",
    trigger: "Spatial Bloom",
    title: "Vibrancy in the Routine",
    vignette: "You flooded my world with color—your spontaneous food cravings, your fiery opinions, and the sheer warmth you radiate wherever you step.",
    color: "#a7f3d0",
    badge: "Discovered through Breadth"
  },
  {
    id: "persistence",
    trigger: "Repeated Pathways",
    title: "Trails That Never Fade",
    vignette: "Moments from year one and yesterday don't disappear into memory. They leave permanent golden trails across my mind, shaping who I am becoming.",
    color: "#86efac",
    badge: "Discovered through Habit"
  },
  {
    id: "synthesis",
    trigger: "The Cumulative Effect",
    title: "The Mythri Effect",
    vignette: "Seven years of your light, ripples, gravity, and warmth. I am kinder, happier, and infinitely better because I love you. That is the Mythri Effect.",
    color: "#059669",
    badge: "Complete Organic Symphony"
  }
];

export default function SpaceMythriEffect() {
  const { markSpaceCompleted } = useAnniversary();
  const canvasRef = useRef(null);

  // Procedural Audio
  const audioCtxRef = useRef(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // RL-inspired Interaction Metrics
  const metricsRef = useRef({
    totalDistance: 0,
    gentleScore: 0,       // Slow, tender movement
    momentumScore: 0,     // Swift, dynamic movement
    dwellScore: 0,        // Holding down in one location
    coverageScore: 0,     // Exploring different quadrants
    repetitionScore: 0,   // Retracing areas
    lastX: null,
    lastY: null,
    lastTime: null,
    dwellAnchor: null
  });

  // Discovered Vignettes
  const [unlockedTruths, setUnlockedTruths] = useState([]);
  const [activeWhisper, setActiveWhisper] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Particle & Fluid Simulation System
  const particlesRef = useRef([]);
  const persistentTrailsRef = useRef([]);
  const shockwavesRef = useRef([]);

  // Procedural Web Audio Engine
  const playAdaptiveChime = useCallback((frequency = 440, velocity = 0.5) => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Softer sine for slow touch, triangle for fast sweeps
      osc.type = velocity < 0.4 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200 + velocity * 1000, ctx.currentTime);

      const peak = Math.min(0.12, 0.04 + velocity * 0.08);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {}
  }, [audioMuted]);

  // Unlock Trigger Helper
  const triggerUnlock = (truthId) => {
    const truth = EMERGENT_TRUTHS.find((t) => t.id === truthId);
    if (!truth) return;

    setUnlockedTruths((prev) => {
      if (prev.some((p) => p.id === truthId)) return prev;
      const next = [...prev, truth];
      if (next.length === EMERGENT_TRUTHS.length) {
        markSpaceCompleted("06-mythri-effect");
      }
      return next;
    });

    setActiveWhisper(truth);
    playAdaptiveChime(523.25, 0.8);
    setTimeout(() => {
      setActiveWhisper(null);
    }, 6000);
  };

  // Initialize Particles in Organic Botanical Green Spectrum
  useEffect(() => {
    const count = 120;
    const initial = [];
    for (let i = 0; i < count; i++) {
      initial.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.001,
        vy: (Math.random() - 0.5) * 0.001,
        baseRadius: Math.random() * 3.5 + 1.5,
        radius: Math.random() * 3.5 + 1.5,
        // Botanical green spectrum: mint (150) to emerald (165) with occasional gold (50)
        hue: Math.random() > 0.8 ? 50 : 140 + Math.random() * 25,
        lightness: 65 + Math.random() * 20,
        alpha: Math.random() * 0.6 + 0.25
      });
    }
    particlesRef.current = initial;
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const metrics = metricsRef.current;

      // Soft Warm Matcha Pearl Canvas with gentle persistence decay
      ctx.fillStyle = "rgba(247, 250, 248, 0.25)";
      ctx.fillRect(0, 0, w, h);

      // Render Persistent Memory Trails in soft sage/mint
      persistentTrailsRef.current.forEach((tr) => {
        ctx.beginPath();
        ctx.arc(tr.x * w, tr.y * h, tr.weight * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${Math.min(0.35, tr.weight * 0.12)})`;
        ctx.fill();
      });

      // Render Expanding Shockwaves
      shockwavesRef.current.forEach((sw, idx) => {
        sw.r += sw.speed;
        sw.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(sw.x * w, sw.y * h, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${sw.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (sw.alpha < 0.01) {
          shockwavesRef.current.splice(idx, 1);
        }
      });

      // Update and Draw Adaptive Botanical Particles
      const particles = particlesRef.current;
      particles.forEach((p, idx) => {
        // Dwell Gravity Pull
        if (metrics.dwellAnchor) {
          const dx = metrics.dwellAnchor.x - p.x;
          const dy = metrics.dwellAnchor.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.35 && dist > 0.01) {
            p.vx += (dx / dist) * 0.00012;
            p.vy += (dy / dist) * 0.00012;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Soft bounce bounds
        if (p.x < 0.02 || p.x > 0.98) p.vx *= -0.9;
        if (p.y < 0.02 || p.y > 0.98) p.vy *= -0.9;

        const px = p.x * w;
        const py = p.y * h;

        // Draw particle body in pastel green glow
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, ${p.lightness}%, ${p.alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 70%, 60%, 0.35)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connective organic botanical vine filaments between close particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 0.12) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2.x * w, p2.y * h);
            ctx.strokeStyle = `hsla(${p.hue}, 65%, 65%, ${(1 - dist / 0.12) * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Pointer Interaction Tracking
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;

    metricsRef.current.lastX = x;
    metricsRef.current.lastY = y;
    metricsRef.current.lastTime = Date.now();
    metricsRef.current.dwellAnchor = { x, y };

    // Emit gentle ripple
    shockwavesRef.current.push({ x, y, r: 5, speed: 3.5, alpha: 0.6 });
    playAdaptiveChime(329.63, 0.3);
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / canvas.width));
    const y = Math.max(0.02, Math.min(0.98, (e.clientY - rect.top) / canvas.height));
    const now = Date.now();

    const m = metricsRef.current;
    if (m.lastX !== null && m.lastY !== null && m.lastTime !== null) {
      const dist = Math.hypot(x - m.lastX, y - m.lastY);
      const dt = Math.max(1, now - m.lastTime);
      const velocity = dist / (dt / 1000);

      m.totalDistance += dist;

      // 1. Evaluate Gentleness vs Momentum
      if (velocity < 0.25 && dist > 0.005) {
        m.gentleScore += 1;
        if (m.gentleScore > 35) triggerUnlock("gentleness");
      } else if (velocity >= 0.65) {
        m.momentumScore += 1;
        if (m.momentumScore > 30) triggerUnlock("rhythm");
      }

      // 2. Evaluate Dwell
      if (m.dwellAnchor) {
        const driftFromAnchor = Math.hypot(x - m.dwellAnchor.x, y - m.dwellAnchor.y);
        if (driftFromAnchor < 0.08) {
          m.dwellScore += 1;
          if (m.dwellScore > 40) triggerUnlock("dwell");
        } else {
          m.dwellAnchor = { x, y };
        }
      }

      // 3. Evaluate Spatial Coverage
      m.coverageScore += dist * 10;
      if (m.coverageScore > 45) triggerUnlock("color");

      // 4. Reinforce Persistent Trails
      const existingTrail = persistentTrailsRef.current.find(
        (t) => Math.hypot(t.x - x, t.y - y) < 0.03
      );
      if (existingTrail) {
        existingTrail.weight = Math.min(4, existingTrail.weight + 0.3);
        m.repetitionScore += 1;
        if (m.repetitionScore > 25) triggerUnlock("persistence");
      } else {
        persistentTrailsRef.current.push({ x, y, weight: 1 });
        if (persistentTrailsRef.current.length > 250) {
          persistentTrailsRef.current.shift();
        }
      }

      // 5. Check Overall Cumulative Synthesis
      if (
        m.gentleScore > 20 &&
        m.momentumScore > 15 &&
        m.dwellScore > 20 &&
        m.coverageScore > 30
      ) {
        triggerUnlock("synthesis");
      }

      // Dynamic Sound Feedback
      if (Math.random() < 0.15) {
        const noteFreq = 260 + (x + y) * 280;
        playAdaptiveChime(noteFreq, Math.min(1.0, velocity));
      }
    }

    m.lastX = x;
    m.lastY = y;
    m.lastTime = now;
  };

  const handlePointerUp = () => {
    metricsRef.current.lastX = null;
    metricsRef.current.lastY = null;
    metricsRef.current.lastTime = null;
    metricsRef.current.dwellAnchor = null;
  };

  const handleReset = () => {
    metricsRef.current = {
      totalDistance: 0,
      gentleScore: 0,
      momentumScore: 0,
      dwellScore: 0,
      coverageScore: 0,
      repetitionScore: 0,
      lastX: null,
      lastY: null,
      lastTime: null,
      dwellAnchor: null
    };
    persistentTrailsRef.current = [];
    shockwavesRef.current = [];
    setUnlockedTruths([]);
    setActiveWhisper(null);
  };

  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "The_Mythri_Effect_Botanical_Exhibition.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top HUD Header - Botanical Art Gallery Installation */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-3">
          <RibbonBow className="w-7 h-6 text-emerald-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-[#132e22] font-bold">
                Chapter 6 // Living Art Gallery • The Mythri Effect
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
            </div>
            <p className="text-[11px] text-[#3d6350] font-sans mt-0.5">
              Exhibition No. 06 — Living botanical flora responds to your touch ♡
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-emerald-700 hover:bg-white transition-colors shadow-sm"
            title={audioMuted ? "Unmute Adaptive Sound" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-[#132e22] hover:bg-white transition-colors shadow-sm"
            title="Reset Canvas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Download Imprint */}
          <button
            onClick={handleDownloadSnapshot}
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-emerald-700 hover:bg-white transition-colors shadow-sm"
            title="Save Gallery Imprint"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Adaptive Botanical Canvas with Art Frame Border */}
      <div
        className="w-full h-full relative cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Museum Exhibition Wall Plaque (Bottom Left Corner) */}
        <div className="absolute bottom-6 left-6 pointer-events-none hidden md:block z-10">
          <div className="bg-white/90 backdrop-blur-md border border-emerald-200 rounded-2xl p-4 shadow-sm max-w-xs text-left">
            <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block tracking-wider">
              EXHIBITION PLAQUE No. 06
            </span>
            <h4 className="font-serif text-base font-bold text-[#132e22] mt-0.5">
              The Mythri Effect
            </h4>
            <p className="text-[11px] text-emerald-800 font-sans mt-0.5">
              Ajay & Mythri // 2019 — Present
            </p>
            <p className="text-[10px] text-[#3d6350] font-sans mt-1 italic">
              Medium: Touch-Responsive Generative Flora. The canvas learns and blooms from your stillness, sweep, and touch.
            </p>
          </div>
        </div>

        {/* Ambient Starting Whisper when canvas is untouched */}
        {unlockedTruths.length === 0 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 text-xs font-sans text-emerald-800 shadow-sm flex items-center gap-2"
            >
              <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
              <span>Touch and explore freely. The world blossoms to how you move ♡</span>
            </motion.div>
          </div>
        )}

        {/* Emergent Floating Whisper */}
        <AnimatePresence>
          {activeWhisper && (
            <motion.div
              key={activeWhisper.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 max-w-lg w-[90%] bg-white/95 backdrop-blur-xl border-2 border-emerald-200 p-6 sm:p-7 rounded-[32px] shadow-card text-center z-20"
            >
              <div className="flex justify-center mb-1">
                <RibbonBow className="w-7 h-6 text-emerald-400" />
              </div>
              <span className="text-[11px] font-sans uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                {activeWhisper.badge}
              </span>
              <h3 className="text-2xl font-bold text-[#132e22] font-serif mb-2">
                {activeWhisper.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans italic">
                "{activeWhisper.vignette}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawer Trigger for Discovered Truths */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="px-5 py-2 rounded-full bg-white/95 hover:bg-white border border-emerald-200 text-xs font-sans font-semibold text-emerald-800 hover:text-emerald-950 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
            <span>
              Curatorial Log ({unlockedTruths.length} of {EMERGENT_TRUTHS.length} Discoveries)
            </span>
            {drawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Discovered Truths Drawer Modal */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-2xl w-[94%] max-h-[60vh] bg-white/95 backdrop-blur-2xl border-2 border-emerald-200 rounded-[32px] p-6 sm:p-7 shadow-2xl overflow-y-auto z-30 relative text-left"
            >
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-20 h-4.5 opacity-80" color="bg-emerald-200/80" />
              </div>

              <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <RibbonBow className="w-6 h-5 text-emerald-400" />
                  <h4 className="text-lg font-bold font-serif text-[#132e22]">
                    Your Organic Imprint on Me
                  </h4>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22]"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {unlockedTruths.length === 0 ? (
                <p className="text-xs font-sans text-[#3d6350] text-center py-6">
                  No truths discovered yet. Explore the canvas with gentle caresses, sweeping motions, and lingering touches ♡
                </p>
              ) : (
                <div className="space-y-4">
                  {unlockedTruths.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-200 text-left space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans text-emerald-700 font-bold uppercase">
                          {t.badge}
                        </span>
                        <span className="text-[11px] font-sans text-emerald-800">{t.trigger}</span>
                      </div>
                      <h5 className="text-base font-bold text-[#132e22] font-serif">{t.title}</h5>
                      <p className="text-xs text-[#2d4d3d] font-sans leading-relaxed">
                        "{t.vignette}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
