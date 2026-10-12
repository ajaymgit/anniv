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
  Maximize2,
  Moon,
  Palette
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
// 1. Dual Aries + Infinity Constellation Star Nodes in Van Gogh's Starry Night
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
    caption: "Two fiery, headstrong souls who found their equal in each other. The gravity center of our entire universe.",
    x: 0.50,
    y: 0.46,
    isCore: true,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80",
    color: "#facc15"
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
    y: 0.36,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    color: "#fef08a"
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
    x: 0.23,
    y: 0.47,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    color: "#38bdf8"
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
    y: 0.58,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    color: "#fde047"
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
    y: 0.36,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    color: "#67e8f9"
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
    x: 0.77,
    y: 0.47,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    color: "#fef08a"
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
    y: 0.58,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    color: "#38bdf8"
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
    color: "#fde047"
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
  const [beaconA, setBeaconA] = useState({ x: 0.35, y: 0.46, name: "Jayjay" });
  const [beaconB, setBeaconB] = useState({ x: 0.65, y: 0.46, name: "Mythri" });
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
  const [showMoonModal, setShowMoonModal] = useState(false);

  // Traveling Photons (Electric starlight pulses racing through beams)
  const photonsRef = useRef([]);

  // Van Gogh Swirling Sky Brushstroke Field
  const vanGoghSwirlsRef = useRef([]);

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

  // Generate 320 Dynamic Van Gogh Impasto Swirling Sky Strokes
  useEffect(() => {
    const list = [];
    // Colors of Vincent van Gogh's Starry Night palette:
    // Cobalt, Ultramarine, Prussian Navy, Sky Cyan, Cream, Cadmium Gold
    const colors = [
      "rgba(37, 99, 235, 0.40)",   // Cobalt Blue
      "rgba(29, 78, 216, 0.45)",   // French Ultramarine
      "rgba(30, 58, 138, 0.50)",   // Deep Navy
      "rgba(56, 189, 248, 0.35)",  // Soft Sky Cyan
      "rgba(125, 211, 252, 0.40)", // Luminous Pale Cyan
      "rgba(254, 240, 138, 0.50)", // Starlight Butter Yellow
      "rgba(250, 204, 21, 0.45)",  // Cadmium Gold
      "rgba(255, 255, 255, 0.35)"  // Foam White Impasto
    ];

    for (let i = 0; i < 340; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.06 + Math.random() * 0.48;
      list.push({
        baseAngle: angle,
        radius,
        length: 15 + Math.random() * 26,
        curveSpread: 0.1 + Math.random() * 0.3,
        speed: (Math.random() > 0.45 ? 1 : -1) * (0.00025 + Math.random() * 0.0004),
        lineWidth: 2.2 + Math.random() * 2.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        dash: [Math.floor(Math.random() * 8 + 8), Math.floor(Math.random() * 4 + 4)]
      });
    }
    vanGoghSwirlsRef.current = list;
  }, []);

  // Spawn Traveling Photons Along Beams
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
          color: Math.random() > 0.5 ? "#fef08a" : "#38bdf8"
        });
      }
    }, 320);

    return () => clearInterval(interval);
  }, [activeBeams]);

  // Main Canvas Render Loop (Authentic Van Gogh Starry Night)
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

      // 1. Deep Midnight Cobalt & Prussian Blue Oil Canvas Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#081329");    // Deepest Midnight Blue
      bgGrad.addColorStop(0.35, "#0d224a"); // Rich Cobalt
      bgGrad.addColorStop(0.65, "#153366"); // Luminous Ultramarine
      bgGrad.addColorStop(0.85, "#0b1836"); // Deep Horizon Blue
      bgGrad.addColorStop(1, "#050b18");    // Night Earth
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. The Great Swirling Cosmic Stream (Central Turbulent Eddies of Light)
      // Van Gogh's signature horizontal s-curve waves
      ctx.lineCap = "round";
      const waveCount = 7;
      for (let i = 0; i < waveCount; i++) {
        const waveY = h * (0.28 + i * 0.06);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
          const wavePhase = (x / w) * Math.PI * 3 + now * 0.0006 + i;
          const y = waveY + Math.sin(wavePhase) * (20 + i * 4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.15)" : "rgba(37, 99, 235, 0.22)";
        ctx.lineWidth = 4 + i * 1.5;
        ctx.stroke();
      }

      // 3. Central Van Gogh Spiral Vortex of Brushstrokes
      vanGoghSwirlsRef.current.forEach((swirl) => {
        const curAngle = swirl.baseAngle + now * swirl.speed;
        const centerX = w * 0.50;
        const centerY = h * 0.42;

        const sx = centerX + Math.cos(curAngle) * swirl.radius * w * 1.45;
        const sy = centerY + Math.sin(curAngle) * swirl.radius * h * 0.85;
        const tangent = curAngle + Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        const ex = sx + Math.cos(tangent) * swirl.length;
        const ey = sy + Math.sin(tangent) * swirl.length * 0.7;
        const cpx = (sx + ex) / 2 + Math.cos(curAngle) * 7;
        const cpy = (sy + ey) / 2 + Math.sin(curAngle) * 7;
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);

        ctx.strokeStyle = swirl.color;
        ctx.lineWidth = swirl.lineWidth;
        ctx.stroke();
      });

      // 4. The Iconic Glowing Golden Crescent Moon (Upper Right)
      const moonX = w * 0.85;
      const moonY = h * 0.18;

      // Radiant Concentric Impasto Halos of Warm Moonlight
      const moonHalos = [
        { r: 48, dashes: [5, 6], color: "rgba(254, 240, 138, 0.35)", width: 2.5 },
        { r: 38, dashes: [6, 5], color: "rgba(250, 204, 21, 0.45)", width: 3.0 },
        { r: 28, dashes: [7, 4], color: "rgba(234, 179, 8, 0.60)", width: 3.5 },
        { r: 18, dashes: [8, 3], color: "rgba(254, 249, 195, 0.80)", width: 4.0 }
      ];
      moonHalos.forEach((halo, idx) => {
        const pulse = (Math.sin(now * 0.003 + idx) + 1) * 3;
        ctx.beginPath();
        ctx.arc(moonX, moonY, halo.r + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = halo.color;
        ctx.lineWidth = halo.width;
        ctx.setLineDash(halo.dashes);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Glowing Crescent Moon Body
      ctx.beginPath();
      ctx.arc(moonX, moonY, 19, -Math.PI * 0.35, Math.PI * 0.75, false);
      ctx.arc(moonX + 7, moonY - 5, 16, Math.PI * 0.75, -Math.PI * 0.35, true);
      ctx.closePath();
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner Cadmium Gold Specular Impasto
      ctx.beginPath();
      ctx.arc(moonX, moonY, 15, -Math.PI * 0.25, Math.PI * 0.65, false);
      ctx.arc(moonX + 5, moonY - 3, 13, Math.PI * 0.65, -Math.PI * 0.25, true);
      ctx.closePath();
      ctx.fillStyle = "#facc15";
      ctx.fill();

      // 5. Van Gogh Rolling Hills (Alpilles) Along the Lower Horizon
      // Back Ridge
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.83);
      ctx.bezierCurveTo(w * 0.2, h * 0.76, w * 0.45, h * 0.86, w * 0.7, h * 0.80);
      ctx.bezierCurveTo(w * 0.85, h * 0.77, w * 0.95, h * 0.82, w, h * 0.79);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = "#0c1b38";
      ctx.fill();

      // Hill Impasto Contour Strokes
      for (let x = 0; x < w; x += 18) {
        ctx.beginPath();
        const hy = h * 0.84 + Math.sin(x * 0.01) * 15;
        ctx.moveTo(x, hy);
        ctx.lineTo(x + 12, hy + 8);
        ctx.strokeStyle = "rgba(30, 58, 138, 0.4)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Front Village Ridge
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.89);
      ctx.bezierCurveTo(w * 0.3, h * 0.86, w * 0.6, h * 0.93, w, h * 0.88);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = "#060f22";
      ctx.fill();

      // Sleeping Village Cottage Roofs & Church Spire
      const villageX = w * 0.58;
      const villageY = h * 0.89;

      // Church Spire
      ctx.beginPath();
      ctx.moveTo(villageX, villageY);
      ctx.lineTo(villageX + 7, villageY - 32);
      ctx.lineTo(villageX + 14, villageY);
      ctx.closePath();
      ctx.fillStyle = "#030814";
      ctx.fill();

      // Cottage Roofs with Warm Glowing Windows
      for (let i = 0; i < 5; i++) {
        const cx = villageX + 22 + i * 26;
        const cy = villageY + 4;
        ctx.fillStyle = "#040b1a";
        ctx.fillRect(cx, cy, 20, 14);

        // Glowing Yellow Windows
        ctx.fillStyle = "#fef08a";
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 6;
        ctx.fillRect(cx + 4, cy + 4, 4, 5);
        ctx.fillRect(cx + 12, cy + 4, 4, 5);
        ctx.shadowBlur = 0;
      }

      // 6. The Iconic Towering Cypress Tree (Left Foreground Silhouette)
      // Van Gogh's flame-like cypress rising into the heavens
      const cBaseX = w * 0.09;
      const cTopX = w * 0.12;
      const cTopY = h * 0.28;

      ctx.beginPath();
      ctx.moveTo(w * 0.03, h);
      ctx.bezierCurveTo(w * 0.05, h * 0.72, w * 0.08, h * 0.52, cTopX, cTopY);
      ctx.bezierCurveTo(w * 0.14, h * 0.48, w * 0.18, h * 0.70, w * 0.19, h);
      ctx.closePath();
      ctx.fillStyle = "#020a07"; // Dark Cypress Charcoal Pine
      ctx.fill();

      // Vertical Flame-like Impasto Brushstrokes on the Cypress
      const cypressStrokes = [
        { x: cBaseX - 12, y: h * 0.82, len: 45, col: "#062013" },
        { x: cBaseX, y: h * 0.70, len: 55, col: "#0b2e1c" },
        { x: cBaseX + 10, y: h * 0.60, len: 60, col: "#0e3b24" },
        { x: cBaseX + 4, y: h * 0.45, len: 50, col: "#14492d" },
        { x: cTopX - 4, y: cTopY + 30, len: 35, col: "#1b5a38" }
      ];
      cypressStrokes.forEach((cs) => {
        ctx.beginPath();
        ctx.moveTo(cs.x, cs.y);
        ctx.quadraticCurveTo(cs.x + 8, cs.y - cs.len / 2, cs.x + 2, cs.y - cs.len);
        ctx.strokeStyle = cs.col;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      });

      // 7. Shockwave Concentric Impasto Ripples
      pulseRipplesRef.current.forEach((ripple, rIdx) => {
        ripple.radius += ripple.speed;
        ripple.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(ripple.x * w, ripple.y * h, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(254, 240, 138, ${ripple.alpha})`;
        ctx.lineWidth = 2.4;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (ripple.alpha < 0.02) {
          pulseRipplesRef.current.splice(rIdx, 1);
        }
      });

      // 8. In Intro Phase: Render Draggable Beacons A & B (Van Gogh Star Orbs)
      if (phase === "intro") {
        const ax = beaconA.x * w;
        const ay = beaconA.y * h;
        const bx = beaconB.x * w;
        const by = beaconB.y * h;

        // Proximity line
        const dist = Math.hypot(bx - ax, by - ay);
        const maxDist = w * 0.45;
        const proximity = Math.max(0, 1 - dist / maxDist);

        // Magnetic Attraction Swirl Filament
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        const midX = (ax + bx) / 2 + Math.sin(now * 0.003) * 20;
        const midY = (ay + by) / 2 - Math.cos(now * 0.003) * 20;
        ctx.quadraticCurveTo(midX, midY, bx, by);
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.25 + proximity * 0.75})`;
        ctx.lineWidth = 2.0 + proximity * 3.5;
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = proximity * 25;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Beacon A (Jayjay)
        drawBeacon(ctx, ax, ay, "#38bdf8", "Jayjay ♡", proximity);

        // Draw Beacon B (Mythri)
        drawBeacon(ctx, bx, by, "#facc15", "Mythri ♡", proximity);

        // Check if fusion threshold reached!
        if (dist < 60) {
          triggerFusion(midX / w, midY / h);
        }
      }

      // 9. In Drawing / Complete Phase: Render Structural Beams & Photons
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
            // Radiant Van Gogh Luminous Impasto Ribbon
            ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
            ctx.lineWidth = 3.6;
            ctx.shadowColor = "#fde047";
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Core White-Gold Oil Bristle Line
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else {
            // Dormant Van Gogh dashed starlight brushstrokes
            ctx.strokeStyle = "rgba(125, 211, 252, 0.22)";
            ctx.lineWidth = 1.8;
            ctx.setLineDash([5, 8]);
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
          ctx.arc(curX, curY, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = ph.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 10. Draw Live Swirling Stardust Particle Trail
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
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 11. Spark Explosions from Igniting Stars
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
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        });

        // 12. Render All 8 Constellation Stars as Van Gogh Swirling Halo Orbs
        CONSTELLATION_STARS.forEach((star) => {
          const sx = star.x * w;
          const sy = star.y * h;
          const isLit = litStarIds.has(star.id);

          // Van Gogh's Signature Broken Concentric Rings of Radiating Starlight Halos
          if (isLit) {
            const rings = [
              { r: 32, dashes: [5, 7], color: "rgba(56, 189, 248, 0.40)", width: 2.2 },
              { r: 24, dashes: [6, 5], color: "rgba(254, 240, 138, 0.55)", width: 2.6 },
              { r: 16, dashes: [7, 4], color: "rgba(250, 204, 21, 0.85)", width: 3.2 }
            ];
            rings.forEach((ring) => {
              const pulse = (Math.sin(now * 0.003 + star.order) + 1) * 3;
              ctx.beginPath();
              ctx.arc(sx, sy, ring.r + pulse, 0, Math.PI * 2);
              ctx.strokeStyle = ring.color;
              ctx.lineWidth = ring.width;
              ctx.setLineDash(ring.dashes);
              ctx.stroke();
              ctx.setLineDash([]);
            });
          }

          // Star Core Body (Rich Cadmium / Starlight Yellow)
          const coreRadius = star.isCore ? 12 : star.isApex ? 10 : 8.5;
          ctx.beginPath();
          ctx.arc(sx, sy, coreRadius, 0, Math.PI * 2);
          ctx.fillStyle = isLit ? star.color : "#1e293b";
          if (isLit) {
            ctx.shadowColor = star.color;
            ctx.shadowBlur = 25;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner white-gold specular impasto glint
          if (isLit) {
            ctx.beginPath();
            ctx.arc(sx, sy, 3.8, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }

          // Labels in elegant serif
          ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = isLit ? "#fef08a" : "#64748b";
          ctx.textAlign = "center";
          ctx.fillText(star.label, sx, sy - 20);

          // Zodiac / Order Tag
          ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = isLit ? "#bae6fd" : "#475569";
          ctx.fillText(star.sign, sx, sy + 24);

          // Orbiting Photo Memory Glyph
          if (isLit) {
            const orbitAngle = now * 0.002 + star.order;
            const orbitR = 17;
            const ox = sx + Math.cos(orbitAngle) * orbitR;
            const oy = sy + Math.sin(orbitAngle) * orbitR;

            ctx.beginPath();
            ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
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

  // Helper: Draw Beacon (Van Gogh Star Orb)
  const drawBeacon = (ctx, x, y, color, label, proximity) => {
    const now = Date.now();
    const pulse = (Math.sin(now * 0.005) + 1) * 8 + 14;

    // Concentric Van Gogh Halos
    [pulse + 18, pulse + 10, pulse + 2].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(x, y, r + proximity * 18, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(254, 240, 138, 0.65)";
      ctx.lineWidth = 2.4;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Core Star Orb
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Specular Impasto
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Label
    ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#fef08a";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 28);
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
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.009 + 0.003;
      sparkExplosionsRef.current.push({
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4.5 + 2,
        life: 1.0,
        color: Math.random() > 0.5 ? "#fde047" : "#38bdf8"
      });
    }

    // Play radiant fusion chord
    playChime(0, true);
    setTimeout(() => playChime(2, true), 220);
    setTimeout(() => playChime(4, true), 440);
  };

  // Pointer Down
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;

    // Check if Moon clicked (Secret Note)
    const moonDist = Math.hypot(x - 0.85, y - 0.18);
    if (moonDist < 0.08) {
      setShowMoonModal(true);
      playChime(6, true);
      return;
    }

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

    // Tap lit star to open photo portal
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

  // Pointer Move
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

    // Collision with unlit stars
    const nearby = findNearbyStar(x, y, 0.055);
    if (nearby && !litStarIds.has(nearby.id)) {
      igniteStar(nearby);
    }
  };

  const handlePointerUp = () => {
    setDraggingBeacon(null);
    setIsDrawing(false);
  };

  // Add Glowing Embers (Van Gogh Oil Paint Swirls)
  const addStardustEmbers = (x, y) => {
    for (let i = 0; i < 3; i++) {
      drawingParticlesRef.current.push({
        x: x + (Math.random() - 0.5) * 0.015,
        y: y + (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.001,
        vy: (Math.random() - 0.5) * 0.001,
        radius: Math.random() * 4.0 + 2.0,
        age: 0,
        color: Math.random() > 0.5 ? "250, 204, 21" : "56, 189, 248"
      });
    }
  };

  // Ignite Star and Activate Connective Filament
  const igniteStar = (star) => {
    setLitStarIds((prev) => {
      const next = new Set(prev);
      next.add(star.id);

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

    // Spawn sparks
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.007 + 0.002;
      sparkExplosionsRef.current.push({
        x: star.x,
        y: star.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        life: 1.0,
        color: star.color
      });
    }

    playChime(star.order);
  };

  const findNearbyStar = (x, y, threshold = 0.05) => {
    return CONSTELLATION_STARS.find((star) => Math.hypot(star.x - x, star.y - y) <= threshold);
  };

  const handleGrandCompletion = () => {
    setPhase("complete");
    setShowCelebrationModal(true);
    markSpaceCompleted("02-constellation");

    playChime(0, true);
    setTimeout(() => playChime(3, true), 300);
    setTimeout(() => playChime(6, true), 600);

    try {
      confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.65 },
        colors: ["#fde047", "#facc15", "#38bdf8", "#1d4ed8", "#ffffff"]
      });
    } catch (e) {}
  };

  const handleReset = () => {
    setPhase("intro");
    setBeaconA({ x: 0.35, y: 0.46, name: "Jayjay" });
    setBeaconB({ x: 0.65, y: 0.46, name: "Mythri" });
    setLitStarIds(new Set(["star-center"]));
    setActiveBeams(new Set());
    setActivePhotoIndex(null);
    setShowCelebrationModal(false);
    setShowMoonModal(false);
    drawingParticlesRef.current = [];
    photonsRef.current = [];
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "The_Starry_Night_Van_Gogh_Anniversary.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#081329] text-[#f8fafc] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Gallery HUD Header */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-[#0b1b3b]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-400/40 text-white shadow-xl flex items-center gap-3">
          <Palette className="w-6 h-6 text-amber-300" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-amber-200 font-bold tracking-wide">
                Chapter 2 // The Starry Night • Vincent van Gogh Style
              </span>
              <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-sky-200/80 font-sans mt-0.5">
              {phase === "intro"
                ? "Drag our two Aries stars together to ignite the swirling cosmic vortex ♡"
                : "Trace swirling impasto brushstrokes outward to weave our infinity ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2.5 rounded-full bg-[#0b1b3b]/90 backdrop-blur-md border border-sky-400/40 text-sky-200 hover:text-amber-300 hover:bg-[#122854] transition-colors shadow-lg cursor-pointer"
            title={audioMuted ? "Unmute Celestial Chimes" : "Mute Chimes"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Reset Canvas */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-full bg-[#0b1b3b]/90 backdrop-blur-md border border-sky-400/40 text-sky-200 hover:text-white hover:bg-[#122854] transition-colors shadow-lg cursor-pointer"
            title="Reset Masterpiece"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Download Masterpiece */}
          <button
            onClick={handleDownload}
            className="p-2.5 rounded-full bg-[#0b1b3b]/90 backdrop-blur-md border border-sky-400/40 text-sky-200 hover:text-amber-300 hover:bg-[#122854] transition-colors shadow-lg cursor-pointer"
            title="Save Oil Painting"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Van Gogh Starry Night Canvas */}
      <div
        className="w-full h-full relative cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Museum Exhibition Wall Plaque (Bottom Left Corner) */}
        <div className="absolute bottom-6 left-6 pointer-events-none hidden md:block z-10">
          <div className="bg-[#0b1b3b]/85 backdrop-blur-md border border-sky-400/30 rounded-2xl p-4 shadow-2xl max-w-xs text-left">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase block tracking-wider">
              MASTERPIECE STUDY // NO. 02
            </span>
            <h4 className="font-serif text-base font-bold text-amber-100 mt-0.5">
              The Starry Night
            </h4>
            <p className="text-[11px] text-sky-200 font-sans mt-0.5">
              After Vincent van Gogh (1889) • Dedicated to Mythri
            </p>
            <p className="text-[10px] text-sky-300/70 font-sans mt-1 italic">
              Medium: Interactive Impasto Oil Canvas. Tap the radiant crescent moon or any swirling star orb to read our memories.
            </p>
          </div>
        </div>

        {/* Ambient Prompt in Intro */}
        {phase === "intro" && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none text-center z-10">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="px-5 py-2.5 rounded-full bg-[#0b1b3b]/90 backdrop-blur-md border border-amber-300/50 text-xs font-sans text-amber-200 flex items-center gap-2 shadow-2xl"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Touch and drag our two Aries stars together to ignite Vincent's cosmic sky ♡</span>
            </motion.div>
          </div>
        )}

        {/* Progress Pill in Drawing Phase */}
        {phase !== "intro" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="px-5 py-2 rounded-full bg-[#0b1b3b]/90 backdrop-blur-md border border-sky-400/40 text-xs font-sans text-white flex items-center gap-2.5 shadow-xl">
              <SparkleStar className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-medium text-sky-200">Starry Sky Progress:</span>
              <span className="text-amber-300 font-bold">
                {litStarIds.size} of {CONSTELLATION_STARS.length} Stars Awakened
              </span>
              <span className="text-sky-400">•</span>
              <span className="text-sky-200/80 text-[11px]">
                Tap any swirling star to reveal our memory ♡
              </span>
            </div>
          </div>
        )}

        {/* Secret Crescent Moon Modal */}
        <AnimatePresence>
          {showMoonModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#050b18]/70 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShowMoonModal(false)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                className="max-w-md w-full bg-[#0b1b3b] border-2 border-amber-300/60 rounded-[32px] p-7 shadow-2xl text-center relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-amber-300/20 border border-amber-300 flex items-center justify-center">
                    <Moon className="w-7 h-7 text-amber-300 fill-amber-300" />
                  </div>
                </div>

                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block mb-1">
                  THE RADIANT CRESCENT
                </span>
                <h3 className="text-2xl font-serif font-bold text-amber-100 mb-3">
                  To My Starry Night, Mythri
                </h3>
                <p className="text-sm text-sky-100 font-serif leading-relaxed italic mb-6">
                  "Just as Vincent painted the moon with swirling layers of golden warmth against the darkest Prussian blue sky, you are the light that turns my whole night golden. No matter where we are or how stormy life feels, looking toward you brings me peace."
                </p>

                <button
                  onClick={() => setShowMoonModal(false)}
                  className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs font-sans transition-all shadow-lg cursor-pointer"
                >
                  Close with Love ♡
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCelebrationModal && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-lg w-[90%] bg-[#0b1b3b]/95 backdrop-blur-2xl border-2 border-amber-300 p-6 sm:p-8 rounded-[36px] shadow-2xl text-center z-30"
            >
              <div className="flex justify-center mb-2">
                <RibbonBow className="w-10 h-8 text-amber-300" />
              </div>

              <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                THE ARIES INFINITY MASTERPIECE COMPLETED
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 mt-1 mb-2">
                Our Starry Night Forever
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-serif italic mb-6">
                "Two points in the sky, seven years of swirling starlight, and an infinite loop of devotion. Happy 7th Anniversary, Mythri."
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-sans text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Masterpiece (PNG)</span>
                </button>

                <button
                  onClick={() => setShowCelebrationModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#122854] hover:bg-[#1a3875] text-sky-200 border border-sky-400/40 font-sans text-xs font-bold transition-all cursor-pointer"
                >
                  Admire Painting ♡
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo Memory Portal Modal */}
        <AnimatePresence>
          {activePhotoIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#050b18]/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setActivePhotoIndex(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-lg w-full bg-[#0b1b3b] border-2 border-amber-300/70 rounded-[32px] p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-sky-400/30 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <SparkleStar className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-mono font-bold text-amber-200">
                      {CONSTELLATION_STARS[activePhotoIndex].yearBadge} // {CONSTELLATION_STARS[activePhotoIndex].sign}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePhotoIndex(null)}
                    className="p-1 rounded-full text-sky-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Photo with Van Gogh Gilded Frame */}
                <div className="relative rounded-2xl overflow-hidden mb-4 border border-amber-300/40 shadow-inner h-56 bg-slate-900">
                  <img
                    src={CONSTELLATION_STARS[activePhotoIndex].photoUrl}
                    alt={CONSTELLATION_STARS[activePhotoIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081329]/80 via-transparent to-transparent pointer-events-none" />
                </div>

                <h4 className="font-serif text-2xl font-bold text-amber-100 mb-1">
                  {CONSTELLATION_STARS[activePhotoIndex].title}
                </h4>
                <p className="text-xs text-sky-300 font-mono mb-3">
                  {CONSTELLATION_STARS[activePhotoIndex].date}
                </p>
                <p className="text-sm font-serif text-sky-100 leading-relaxed italic mb-6">
                  "{CONSTELLATION_STARS[activePhotoIndex].caption}"
                </p>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-sky-400/30 pt-3">
                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) =>
                        prev === 0 ? CONSTELLATION_STARS.length - 1 : prev - 1
                      )
                    }
                    className="p-2 rounded-full bg-[#122854] hover:bg-[#1a3875] text-sky-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono text-amber-300">
                    Star {activePhotoIndex + 1} of {CONSTELLATION_STARS.length}
                  </span>

                  <button
                    onClick={() =>
                      setActivePhotoIndex((prev) =>
                        (prev + 1) % CONSTELLATION_STARS.length
                      )
                    }
                    className="p-2 rounded-full bg-[#122854] hover:bg-[#1a3875] text-sky-200 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
