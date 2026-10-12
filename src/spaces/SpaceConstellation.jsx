import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Download,
  Volume2,
  VolumeX,
  X,
  Camera,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  SparkleStar
} from "../components/common/GirlyPopDecorations";

// -----------------------------------------------------------------
// 1. Dual Aries + Infinity Constellation Star Nodes (7 Years)
// -----------------------------------------------------------------
export const CONSTELLATION_STARS = [
  {
    id: "star-center",
    order: 0,
    label: "Core Nexus",
    sign: "♈ × ♈",
    title: "Where Two Aries Collide",
    yearBadge: "The Origin",
    date: "Day 01 // Where It Began",
    caption: "Two fiery, headstrong souls who found their equal in each other. The gravity center of our story.",
    x: 0.50,
    y: 0.50,
    isCore: true,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80",
    color: "#fbbf24"
  },
  // Left Loop (Jayjay's Aries Arc)
  {
    id: "star-left-1",
    order: 1,
    label: "Hamal (Alpha Arietis)",
    sign: "♈ Jayjay",
    title: "First Rain-Soaked Ride",
    yearBadge: "Year 01",
    date: "Year 01 // City Streets",
    caption: "Night rain dripping off our jackets, empty roads at midnight, and your arms holding on tight.",
    x: 0.36,
    y: 0.37,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    color: "#6ee7b7"
  },
  {
    id: "star-left-2",
    order: 2,
    label: "Sheratan (Beta Arietis)",
    sign: "♈ Jayjay",
    title: "The Quiet Corner Table",
    yearBadge: "Year 02",
    date: "Year 02 // Favorite Café",
    caption: "Iced coffees, extra crispy fries, and realizing we could talk for four hours without looking at our phones.",
    x: 0.22,
    y: 0.50,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    color: "#34d399"
  },
  {
    id: "star-left-3",
    order: 3,
    label: "Mesarthim (Gamma Arietis)",
    sign: "♈ Jayjay",
    title: "Learning Your Rhythm",
    yearBadge: "Year 03",
    date: "Year 03 // Inside Jokes",
    caption: "Understanding your quiet moments, laughing through UNO rivalries, and finding peace in the routine.",
    x: 0.36,
    y: 0.63,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    color: "#a7f3d0"
  },
  // Right Loop (Mythri's Aries Arc)
  {
    id: "star-right-1",
    order: 4,
    label: "Botein (Delta Arietis)",
    sign: "♈ Mythri",
    title: "Your Fierce Warmth",
    yearBadge: "Year 04",
    date: "Year 04 // Heart to Heart",
    caption: "How fiercely loyal you are to those you love, and how your laughter can instantly dismantle a tough day.",
    x: 0.64,
    y: 0.37,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    color: "#4ade80"
  },
  {
    id: "star-right-2",
    order: 5,
    label: "Bharani (41 Arietis)",
    sign: "♈ Mythri",
    title: "The Airport Promise",
    yearBadge: "Year 05",
    date: "Year 05 // Counting Miles",
    caption: "Counting down departure gates and time zones, knowing that physical miles could never dilute what we built.",
    x: 0.78,
    y: 0.50,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    color: "#86efac"
  },
  {
    id: "star-right-3",
    order: 6,
    label: "Nair al Butain",
    sign: "♈ Mythri",
    title: "Unshakable Home",
    yearBadge: "Year 06",
    date: "Year 06 // Sanctuary",
    caption: "No matter how noisy or chaotic life became, sitting with you felt like reaching home.",
    x: 0.64,
    y: 0.63,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    color: "#10b981"
  },
  // Grand Apex Crown Star (Year 07)
  {
    id: "star-crown",
    order: 7,
    label: "Apex Arietis",
    sign: "♈ Forever",
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "Year 07 // Today",
    date: "October 2026 // Forever",
    caption: "Two Aries, seven years, and an infinite horizon. You are my greatest certainty.",
    x: 0.50,
    y: 0.22,
    isApex: true,
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    color: "#fef08a"
  }
];

// Target beams forming the complete Dual-Aries Infinity structure
export const TARGET_BEAMS = [
  // Left Aries Infinity loop
  { from: "star-center", to: "star-left-1" },
  { from: "star-left-1", to: "star-left-2" },
  { from: "star-left-2", to: "star-left-3" },
  { from: "star-left-3", to: "star-center" },

  // Right Aries Infinity loop
  { from: "star-center", to: "star-right-1" },
  { from: "star-right-1", to: "star-right-2" },
  { from: "star-right-2", to: "star-right-3" },
  { from: "star-right-3", to: "star-center" },

  // Apex Crown ties
  { from: "star-left-1", to: "star-crown" },
  { from: "star-right-1", to: "star-crown" }
];

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();
  const canvasRef = useRef(null);

  // Web Audio Context for Generative Celestial Soundscape
  const audioCtxRef = useRef(null);
  const droneOscRef = useRef(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Interactive State
  // Phase: 'intro' (2 adrift stars needing fusion) -> 'drawing' (inside-out tracing) -> 'complete'
  const [phase, setPhase] = useState("intro");
  const [beaconA, setBeaconA] = useState({ x: 0.35, y: 0.50, name: "Jayjay" });
  const [beaconB, setBeaconB] = useState({ x: 0.65, y: 0.50, name: "Mythri" });
  const [draggingBeacon, setDraggingBeacon] = useState(null);

  // Drawing & Particle Engine State
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingParticlesRef = useRef([]); // Active glowing stardust embers
  const sparkExplosionsRef = useRef([]); // Fireworks upon igniting a star
  const pulseRipplesRef = useRef([]); // Concentric shockwaves
  const [litStarIds, setLitStarIds] = useState(new Set(["star-center"]));
  const [activeBeams, setActiveBeams] = useState(new Set());
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Traveling Photons (Electric starlight pulses racing through beams)
  const photonsRef = useRef([]);

  // Background Nebula Stars
  const nebulaStarsRef = useRef([]);

  // Pentatonic Celestial Chime scale
  const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  // Procedural Celestial Audio Engine
  const playChime = useCallback((noteIndex = 0, chord = false) => {
    if (audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const baseFreq = NOTES[noteIndex % NOTES.length];
      const freqs = chord ? [baseFreq, baseFreq * 1.5, baseFreq * 2.0] : [baseFreq, baseFreq * 2.0];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, ctx.currentTime);

        const peak = chord ? 0.08 : 0.09;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(peak / (idx + 1), ctx.currentTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);
      });
    } catch (e) {
      console.warn("Audio Context note error", e);
    }
  }, [audioMuted]);

  // Ambient sound management
  useEffect(() => {
    return () => {
      if (droneOscRef.current) {
        try { droneOscRef.current.stop(); } catch (e) {}
        droneOscRef.current = null;
      }
    };
  }, []);

  // Generate 260 Ambient Nebula Star Dust Particles
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 260; i++) {
      list.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2.2 + 0.4,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color:
          Math.random() > 0.75
            ? "#fed7aa" // Warm gold
            : Math.random() > 0.45
            ? "#bae6fd" // Cosmic blue
            : "#ffffff"
      });
    }
    nebulaStarsRef.current = list;
  }, []);

  // Spawn Traveling Photons
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeBeams.size === 0) return;
      const beamList = Array.from(activeBeams);
      const chosenBeamKey = beamList[Math.floor(Math.random() * beamList.length)];
      const [fromId, toId] = chosenBeamKey.split("->");
      const fromStar = CONSTELLATION_STARS.find((s) => s.id === fromId);
      const toStar = CONSTELLATION_STARS.find((s) => s.id === toId);

      if (fromStar && toStar) {
        photonsRef.current.push({
          x1: fromStar.x,
          y1: fromStar.y,
          x2: toStar.x,
          y2: toStar.y,
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
          color: Math.random() > 0.5 ? "#fbbf24" : "#4ade80"
        });
      }
    }, 350);

    return () => clearInterval(interval);
  }, [activeBeams]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const now = Date.now();

      // 1. Deep Pine Celestial Observatory Night Gradient
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.75);
      grad.addColorStop(0, "#0a261a");
      grad.addColorStop(0.35, "#061a11");
      grad.addColorStop(0.7, "#03100a");
      grad.addColorStop(1, "#010503");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Aurora Stardust & Emerald Nebula clouds
      const drawNebulaCloud = (cx, cy, r, color) => {
        const nGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
        nGrad.addColorStop(0, color);
        nGrad.addColorStop(1, "transparent");
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };
      drawNebulaCloud(w * 0.32, h * 0.48, w * 0.30, "rgba(52, 211, 153, 0.09)");
      drawNebulaCloud(w * 0.68, h * 0.48, w * 0.30, "rgba(110, 231, 183, 0.07)");
      drawNebulaCloud(w * 0.50, h * 0.25, w * 0.25, "rgba(254, 240, 138, 0.05)");

      // 2. Background Twinkling Stars
      nebulaStarsRef.current.forEach((star) => {
        const opacity = (Math.sin(now * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.4 + 0.15;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Shockwave Ripples
      pulseRipplesRef.current.forEach((ripple, rIdx) => {
        ripple.radius += ripple.speed;
        ripple.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(ripple.x * w, ripple.y * h, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${ripple.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (ripple.alpha < 0.02) {
          pulseRipplesRef.current.splice(rIdx, 1);
        }
      });

      // 4. In Intro Phase: Render Draggable Beacons A & B
      if (phase === "intro") {
        const ax = beaconA.x * w;
        const ay = beaconA.y * h;
        const bx = beaconB.x * w;
        const by = beaconB.y * h;

        // Proximity line
        const dist = Math.hypot(bx - ax, by - ay);
        const maxDist = w * 0.45;
        const proximity = Math.max(0, 1 - dist / maxDist);

        // Magnetic Attraction Filament
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        const midX = (ax + bx) / 2 + Math.sin(now * 0.003) * 15;
        const midY = (ay + by) / 2 - Math.cos(now * 0.003) * 15;
        ctx.quadraticCurveTo(midX, midY, bx, by);
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.15 + proximity * 0.6})`;
        ctx.lineWidth = 1.5 + proximity * 2.5;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = proximity * 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Beacon A (Jayjay)
        drawBeacon(ctx, ax, ay, "#4ade80", "Jayjay ♡", proximity);

        // Draw Beacon B (Mythri)
        drawBeacon(ctx, bx, by, "#10b981", "Mythri ♡", proximity);

        // Check if fusion threshold reached!
        if (dist < 55) {
          triggerFusion(midX / w, midY / h);
        }
      }

      // 5. In Drawing / Complete Phase: Render Structural Beams & Photons
      if (phase !== "intro") {
        // Target Beams
        TARGET_BEAMS.forEach((beam) => {
          const s1 = CONSTELLATION_STARS.find((s) => s.id === beam.from);
          const s2 = CONSTELLATION_STARS.find((s) => s.id === beam.to);
          if (!s1 || !s2) return;

          const keyForward = `${beam.from}->${beam.to}`;
          const keyBackward = `${beam.to}->${beam.from}`;
          const isIgnited =
            activeBeams.has(keyForward) ||
            activeBeams.has(keyBackward) ||
            (litStarIds.has(beam.from) && litStarIds.has(beam.to));

          const x1 = s1.x * w;
          const y1 = s1.y * h;
          const x2 = s2.x * w;
          const y2 = s2.y * h;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);

          if (isIgnited) {
            // Radiant Energy Filament
            ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
            ctx.lineWidth = 2.2;
            ctx.shadowColor = "#f59e0b";
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Core white light
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 0.9;
            ctx.stroke();
          } else {
            // Dormant dotted starlight guide
            ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });

        // Traveling Photons Racing Along Beams
        photonsRef.current.forEach((ph, pIdx) => {
          ph.progress += ph.speed;
          if (ph.progress >= 1) {
            photonsRef.current.splice(pIdx, 1);
            return;
          }

          const curX = (ph.x1 + (ph.x2 - ph.x1) * ph.progress) * w;
          const curY = (ph.y1 + (ph.y2 - ph.y1) * ph.progress) * h;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = ph.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 6. Draw Live Stardust Particle Trail
        drawingParticlesRef.current.forEach((pt, pIdx) => {
          pt.age += 0.02;
          pt.radius *= 0.97;
          pt.x += pt.vx;
          pt.y += pt.vy;

          if (pt.age >= 1 || pt.radius < 0.2) {
            drawingParticlesRef.current.splice(pIdx, 1);
            return;
          }

          const alpha = 1 - pt.age;
          ctx.beginPath();
          ctx.arc(pt.x * w, pt.y * h, pt.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pt.color}, ${alpha})`;
          ctx.shadowColor = `rgba(${pt.color}, ${alpha})`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 7. Spark Explosions from Igniting Stars
        sparkExplosionsRef.current.forEach((spk, sIdx) => {
          spk.x += spk.vx;
          spk.y += spk.vy;
          spk.life -= 0.025;
          spk.size *= 0.96;

          if (spk.life <= 0) {
            sparkExplosionsRef.current.splice(sIdx, 1);
            return;
          }

          ctx.beginPath();
          ctx.arc(spk.x * w, spk.y * h, spk.size, 0, Math.PI * 2);
          ctx.fillStyle = spk.color;
          ctx.globalAlpha = spk.life;
          ctx.shadowColor = spk.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        });

        // 8. Render All 8 Constellation Stars
        CONSTELLATION_STARS.forEach((star) => {
          const sx = star.x * w;
          const sy = star.y * h;
          const isLit = litStarIds.has(star.id);

          // Diffraction Spike Flare on Bright Lit Stars
          if (isLit) {
            const flareLen = (Math.sin(now * 0.004 + star.order) + 1) * 6 + 18;
            ctx.strokeStyle = `${star.color}44`;
            ctx.lineWidth = 1;

            // Horizontal cross
            ctx.beginPath();
            ctx.moveTo(sx - flareLen, sy);
            ctx.lineTo(sx + flareLen, sy);
            ctx.stroke();

            // Vertical cross
            ctx.beginPath();
            ctx.moveTo(sx, sy - flareLen);
            ctx.lineTo(sx, sy + flareLen);
            ctx.stroke();

            // Outer Pulsing Glow Halo
            const halo = (Math.sin(now * 0.005 + star.order) + 1) * 5 + 16;
            ctx.beginPath();
            ctx.arc(sx, sy, halo, 0, Math.PI * 2);
            ctx.strokeStyle = `${star.color}33`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Star Core Body
          const coreRadius = star.isCore ? 10 : star.isApex ? 9 : 7.5;
          ctx.beginPath();
          ctx.arc(sx, sy, coreRadius, 0, Math.PI * 2);
          ctx.fillStyle = isLit ? star.color : "#334155";
          if (isLit) {
            ctx.shadowColor = star.color;
            ctx.shadowBlur = 22;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner white specular glint
          if (isLit) {
            ctx.beginPath();
            ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }

          // Labels
          ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = isLit ? "#f0fdf4" : "#3d6350";
          ctx.textAlign = "center";
          ctx.fillText(star.label, sx, sy - 18);

          // Zodiac / Order Tag
          ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = isLit ? star.color : "#6e9981";
          ctx.fillText(star.sign, sx, sy + 22);

          // Interactive Photo Portal Ring Indicator
          if (isLit) {
            const orbitAngle = now * 0.002 + star.order;
            const orbitR = 15;
            const ox = sx + Math.cos(orbitAngle) * orbitR;
            const oy = sy + Math.sin(orbitAngle) * orbitR;

            ctx.beginPath();
            ctx.arc(ox, oy, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [phase, beaconA, beaconB, activeBeams, litStarIds]);

  // Helper: Draw Beacon (Intro Phase)
  const drawBeacon = (ctx, x, y, color, label, proximity) => {
    const pulse = (Math.sin(Date.now() * 0.005) + 1) * 8 + 14;

    // Glowing aura
    ctx.beginPath();
    ctx.arc(x, y, pulse + proximity * 15, 0, Math.PI * 2);
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Core
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Specular
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Label
    ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 24);
  };

  // Trigger Fusion: Inside-out Awakening!
  const triggerFusion = (fx, fy) => {
    setPhase("drawing");

    // Spawn massive shockwave ripples
    pulseRipplesRef.current.push(
      { x: fx, y: fy, radius: 10, speed: 7, alpha: 0.9 },
      { x: fx, y: fy, radius: 5, speed: 4, alpha: 0.6 }
    );

    // Star embers explosion
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.008 + 0.003;
      sparkExplosionsRef.current.push({
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        life: 1.0,
        color: Math.random() > 0.5 ? "#fbbf24" : "#4ade80"
      });
    }

    // Play radiant fusion chord
    playChime(0, true);
    setTimeout(() => playChime(2, true), 220);
    setTimeout(() => playChime(4, true), 440);
  };

  // Pointer Down (Drag beacon in intro OR freehand stardust in drawing)
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;

    if (phase === "intro") {
      const distA = Math.hypot(x - beaconA.x, y - beaconA.y);
      const distB = Math.hypot(x - beaconB.x, y - beaconB.y);

      if (distA < 0.12) {
        setDraggingBeacon("A");
        playChime(1);
      } else if (distB < 0.12) {
        setDraggingBeacon("B");
        playChime(3);
      }
      return;
    }

    // If tapping an already lit star, open its memory portal!
    const tappedStar = findNearbyStar(x, y, 0.05);
    if (tappedStar && litStarIds.has(tappedStar.id)) {
      const idx = CONSTELLATION_STARS.findIndex((s) => s.id === tappedStar.id);
      setActivePhotoIndex(idx);
      playChime(idx, true);
      return;
    }

    setIsDrawing(true);
    addStardustEmbers(x, y);
  };

  // Pointer Move (Animate dragging or stardust trails)
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.04, Math.min(0.96, (e.clientX - rect.left) / canvas.width));
    const y = Math.max(0.04, Math.min(0.96, (e.clientY - rect.top) / canvas.height));

    if (phase === "intro" && draggingBeacon) {
      if (draggingBeacon === "A") setBeaconA((prev) => ({ ...prev, x, y }));
      if (draggingBeacon === "B") setBeaconB((prev) => ({ ...prev, x, y }));
      return;
    }

    if (!isDrawing) return;

    addStardustEmbers(x, y);

    // Check collision with unlit stars (Inside-out ignition!)
    const nearby = findNearbyStar(x, y, 0.055);
    if (nearby && !litStarIds.has(nearby.id)) {
      igniteStar(nearby);
    }
  };

  const handlePointerUp = () => {
    setDraggingBeacon(null);
    setIsDrawing(false);
  };

  // Add Glowing Embers
  const addStardustEmbers = (x, y) => {
    for (let i = 0; i < 3; i++) {
      drawingParticlesRef.current.push({
        x: x + (Math.random() - 0.5) * 0.015,
        y: y + (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.001,
        vy: (Math.random() - 0.5) * 0.001,
        radius: Math.random() * 3.5 + 1.5,
        age: 0,
        color: Math.random() > 0.5 ? "251, 191, 36" : "244, 114, 182"
      });
    }
  };

  // Ignite Star and Activate Connective Filament
  const igniteStar = (star) => {
    setLitStarIds((prev) => {
      const next = new Set(prev);
      next.add(star.id);

      // Check if all stars now awakened
      if (next.size >= CONSTELLATION_STARS.length) {
        setTimeout(handleGrandCompletion, 500);
      }
      return next;
    });

    // Connect to adjacent lit stars via TARGET_BEAMS
    TARGET_BEAMS.forEach((beam) => {
      if (beam.from === star.id && litStarIds.has(beam.to)) {
        setActiveBeams((prev) => new Set(prev).add(`${beam.to}->${beam.from}`));
      } else if (beam.to === star.id && litStarIds.has(beam.from)) {
        setActiveBeams((prev) => new Set(prev).add(`${beam.from}->${beam.to}`));
      }
    });

    // Spawn sparks around the ignited star
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.006 + 0.002;
      sparkExplosionsRef.current.push({
        x: star.x,
        y: star.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        life: 1.0,
        color: star.color
      });
    }

    // Play chime for this star
    playChime(star.order);
  };

  const findNearbyStar = (x, y, threshold = 0.05) => {
    return CONSTELLATION_STARS.find((star) => Math.hypot(star.x - x, star.y - y) <= threshold);
  };

  const handleGrandCompletion = () => {
    setPhase("complete");
    setShowCelebrationModal(true);
    markSpaceCompleted("02-constellation");

    // Harmonious victory chimes
    playChime(0, true);
    setTimeout(() => playChime(3, true), 300);
    setTimeout(() => playChime(6, true), 600);

    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.65 },
        colors: ["#34d399", "#6ee7b7", "#a7f3d0", "#fef08a", "#ffffff"]
      });
    } catch (e) {}
  };

  const handleReset = () => {
    setPhase("intro");
    setBeaconA({ x: 0.35, y: 0.50, name: "Jayjay" });
    setBeaconB({ x: 0.65, y: 0.50, name: "Mythri" });
    setLitStarIds(new Set(["star-center"]));
    setActiveBeams(new Set());
    setActivePhotoIndex(null);
    setShowCelebrationModal(false);
    drawingParticlesRef.current = [];
    photonsRef.current = [];
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "Two_Points_One_Constellation_Dual_Aries.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#010503] text-[#132e22] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top HUD Header - Stargazing Observatory Dome */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-200 text-[#132e22] shadow-sm flex items-center gap-3">
          <RibbonBow className="w-7 h-6 text-emerald-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-[#132e22] font-bold">
                Chapter 2 // Observatory Dome • Two Points, One Constellation
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
            </div>
            <p className="text-[11px] text-[#3d6350] font-sans mt-0.5">
              {phase === "intro"
                ? "Drag our two Aries stars together to ignite the infinity loop ♡ (RA 02h 07m • DEC +23° 27')"
                : "Trace stardust lines from the center outward to weave the infinity ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-emerald-600 hover:bg-white transition-colors shadow-sm"
            title={audioMuted ? "Unmute Celestial Chimes" : "Mute Chimes"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-[#132e22] hover:bg-white transition-colors shadow-sm"
            title="Reset Constellation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Download Chart */}
          <button
            onClick={handleDownload}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-[#3d6350] hover:text-emerald-600 hover:bg-white transition-colors shadow-sm"
            title="Download Star Chart"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Celestial Canvas */}
      <div
        className="w-full h-full relative cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Ambient Prompt in Intro */}
        {phase === "intro" && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none text-center">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-xs font-sans text-emerald-700 flex items-center gap-2 shadow-card"
            >
              <Heart className="w-4 h-4 text-emerald-500 fill-emerald-400" />
              <span>Touch and drag our two stars toward each other to ignite our universe ♡</span>
            </motion.div>
          </div>
        )}

        {/* Progress Pill in Drawing Phase */}
        {phase !== "intro" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-xs font-sans text-[#132e22] flex items-center gap-2.5 shadow-card">
              <FlowerBlossom className="w-3.5 h-3.5" />
              <span className="font-medium">Constellation Progress:</span>
              <span className="text-emerald-700 font-bold">
                {litStarIds.size} of {CONSTELLATION_STARS.length} Stars Awakened
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-[#3d6350] text-[11px]">
                Tap any lit star to open its photo memory ♡
              </span>
            </div>
          </div>
        )}

        {/* Completion Card Overlay */}
        <AnimatePresence>
          {showCelebrationModal && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-lg w-[90%] bg-white/95 backdrop-blur-2xl border-2 border-emerald-200 p-7 sm:p-8 rounded-[36px] shadow-2xl text-center z-20 text-[#132e22] relative"
            >
              <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
                <WashiTape className="w-20 h-4.5 opacity-75" color="bg-emerald-200/80" />
              </div>

              <button
                onClick={() => setShowCelebrationModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-2">
                <RibbonBow className="w-10 h-8 text-emerald-400 drop-shadow-sm" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#132e22] mb-2">
                Two Points, One Constellation
              </h3>
              <p className="text-xs sm:text-sm text-[#2d4d3d] leading-relaxed font-sans mb-5 italic">
                "Two fire signs whose paths refused to be anything less than eternal. Seven years woven into an endless constellation across our journey and beyond."
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowCelebrationModal(false);
                    setActivePhotoIndex(0);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-sans text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Browse Star Photos ♡</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-[#3d6350] hover:text-emerald-700 font-sans text-xs font-semibold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Star Chart</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Photo Lightbox Gallery */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#132e22]/45 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActivePhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-lg w-full bg-[#fffdfa] border-2 border-emerald-200 rounded-[36px] p-6 sm:p-8 shadow-2xl overflow-hidden text-[#132e22]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Washi Tape */}
              <div className="absolute -top-1.5 left-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Star Header & Year Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold">
                  {CONSTELLATION_STARS[activePhotoIndex].yearBadge}
                </span>
                <span className="text-xs font-sans text-[#3d6350]">
                  Star {activePhotoIndex + 1} of {CONSTELLATION_STARS.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#132e22] mb-1">
                {CONSTELLATION_STARS[activePhotoIndex].title}
              </h3>
              <p className="text-xs font-sans text-emerald-600 mb-4 font-medium">
                {CONSTELLATION_STARS[activePhotoIndex].label} ♡ {CONSTELLATION_STARS[activePhotoIndex].sign}
              </p>

              {/* Memory Picture Frame */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-emerald-200 mb-4 bg-emerald-50 relative group shadow-sm">
                <img
                  src={CONSTELLATION_STARS[activePhotoIndex].photoUrl}
                  alt={CONSTELLATION_STARS[activePhotoIndex].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-4 text-xs font-sans text-white drop-shadow font-medium">
                  {CONSTELLATION_STARS[activePhotoIndex].date}
                </div>
              </div>

              {/* Caption */}
              <p className="text-sm text-[#2d4d3d] font-sans leading-relaxed italic mb-6">
                "{CONSTELLATION_STARS[activePhotoIndex].caption}"
              </p>

              {/* Carousel Footer Navigation */}
              <div className="pt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between">
                <button
                  disabled={activePhotoIndex === 0}
                  onClick={() => {
                    const prevIdx = activePhotoIndex - 1;
                    setActivePhotoIndex(prevIdx);
                    playChime(prevIdx);
                  }}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-25 disabled:pointer-events-none text-emerald-700 transition-colors flex items-center gap-1.5 text-xs font-sans font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Star</span>
                </button>

                <div className="flex gap-1.5">
                  {CONSTELLATION_STARS.map((s, idx) => (
                    <div
                      key={s.id}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activePhotoIndex === idx
                          ? "bg-emerald-500 scale-125"
                          : "bg-emerald-200"
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activePhotoIndex === CONSTELLATION_STARS.length - 1}
                  onClick={() => {
                    const nextIdx = activePhotoIndex + 1;
                    setActivePhotoIndex(nextIdx);
                    playChime(nextIdx);
                  }}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-25 disabled:pointer-events-none text-emerald-700 transition-colors flex items-center gap-1.5 text-xs font-sans font-semibold"
                >
                  <span>Next Star</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
