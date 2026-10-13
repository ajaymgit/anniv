import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Heart,
  Camera,
  Eye,
  Maximize2,
  RefreshCw,
  Compass,
  Play
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  SparkleStar,
  WashiTape
} from "../components/common/GirlyPopDecorations";

// Sequential Milestone Stories (1 through 8 in order)
export const LILY_STORIES = [
  {
    id: 1,
    order: 1,
    title: "Where Two Aries Collided",
    yearBadge: "Year 01 // 2019",
    date: "October 2019 // The First Spark",
    summary: "Two headstrong souls who found their equal in each other.",
    story: `There was an instant, unspoken recognition between us from the very first talk. 

Two stubborn, fiery Aries who normally guard their independence fiercely—suddenly wanting to stay in the exact same room, talking for hours without running out of things to say. 

You weren't like anyone else I had ever met. You carried this fierce, quiet authenticity that immediately broke through all my defenses. That first spark wasn't just a moment; it was the foundation of our entire story.`,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    order: 2,
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    date: "Year 02 // City Nights",
    summary: "Riding through rain at 1 AM with your arms around me.",
    story: `Some of my favorite memories with you don't cost a single rupee.

Like riding through torrential night rain when neither of us had any business being on the road. Water dripping from our helmets and soaking through our jackets, cold winds whipping past, and your hands tucked tightly into my pockets.

In that quiet midnight city, with nobody else around, I realized I would ride anywhere in the world as long as you were sitting behind me.`,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    order: 3,
    title: "The Corner Table & Crispy Fries",
    yearBadge: "Year 03 // 2021",
    date: "Year 03 // Favorite Café",
    summary: "Four hours passing like four minutes across a wooden table.",
    story: `Sitting across from you over iced coffees, watching the afternoon light shift into evening.

Splitting an order of extra crispy fries and silently leaving the crunchiest one at the bottom for you. The way we could talk about the most absurd, ridiculous thoughts one minute, and dive into our deepest family vulnerabilities the next.

With you, there was never any awkward silence—only comfort so deep it felt like breathing.`,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    order: 4,
    title: "Learning Your Quiet Cadence",
    yearBadge: "Year 04 // 2022",
    date: "Year 04 // Inside Jokes",
    summary: "Understanding your silence and laughing through stubborn UNO rivalries.",
    story: `By year four, love was no longer a question—it had become our second nature.

I learned the subtle signs of when you were exhausted before you said a word. I learned how your laughter could instantly dismantle a bad day, and how seriously you take an UNO Draw 4 card.

We learned how to forgive quickly, how to tease gently, and how to hold space for each other when life felt heavy. You became my safest harbor.`,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    order: 5,
    title: "Your Fierce, Unshakable Heart",
    yearBadge: "Year 05 // 2023",
    date: "Year 05 // Benchmark of Integrity",
    summary: "The quiet courage and fierce loyalty that defines who you are.",
    story: `The thing I admire most about you is how unconditionally you stand by the people you love.

You never perform kindness for an audience. When someone is hurting, you show up. When things are difficult, you set your jaw, figure out what needs to be done, and do it with grace.

In five years of watching you grow, my respect for your character only deepened. You are the standard of integrity and honesty in my life.`,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    order: 6,
    title: "Counting Gates & Time Zones",
    yearBadge: "Year 06 // 2024",
    date: "Year 06 // The Distance Anchor",
    summary: "Counting down airport gates, knowing distance could never dilute us.",
    story: `Distance tests everything. It tests patience, routines, and endurance.

Yet across busy schedules, departures, and counting down the days until we could sit in the same room again, our bond never wavered. Every late-night call and every countdown proved what we always knew:

Physical miles could never dilute what we built. We were anchored in each other long before the miles appeared.`,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    order: 7,
    name: "Heart Petal VII",
    title: "Unshakable Home",
    yearBadge: "Year 07 // 2025",
    date: "Year 07 // The Sanctuary",
    summary: "In a chaotic noisy world, you are the peace I always come home to.",
    story: `At the end of an exhausting week, when the world demands too much and everything feels noisy—just sitting beside you cuts through all the static.

You don't need to give advice or solve my problems. Just resting your head on my shoulder or holding my hand reminds me of who I am.

In seven years, you turned love from a fleeting feeling into a permanent home.`,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    order: 8,
    name: "The Core Heart Tepal",
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "October 2026 // Today & Forever",
    date: "Forever & Always",
    summary: "The final petal that blooms an entire garden of lilies for you.",
    story: `This is the heart of the lily, and the center of my life.

I chose you seven years ago on a quiet evening, and I have chosen you every single morning since. 

There is no version of my future, no dream I want to build, and no horizon I look toward that doesn't have you standing by my side. Seven years of us was just the prologue.

To our next seven, our next seventy, and a lifetime of lilies blooming for you. Happy 7th Anniversary, Mythri ♡`,
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
  }
];

export const LILY_PETALS = LILY_STORIES;
export const ROSE_PETALS = LILY_STORIES;

export const BLOOMING_LILIES = Array.from({ length: 36 }).map((_, i) => ({
  id: i,
  x: `${(i * 19.3) % 92 + 4}%`,
  y: `${(i * 27.7) % 86 + 7}%`,
  size: 34 + (i % 6) * 6,
  rotation: (i * 47) % 360,
  delay: (i % 12) * 0.12
}));

// Generates high-res botanical watercolor canvas texture for the Stargazer Lily
function createLilyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Vertical gradient from throat to tip
  const grad = ctx.createLinearGradient(512, 1024, 512, 0);
  grad.addColorStop(0.0, "#9f1239");   // Deep ruby throat
  grad.addColorStop(0.2, "#be123c");   // Velvety carmine
  grad.addColorStop(0.5, "#f43f5e");   // Stargazer rose-pink
  grad.addColorStop(0.75, "#fda4af");  // Blush pink
  grad.addColorStop(0.92, "#fff1f2");  // Soft cream
  grad.addColorStop(1.0, "#ffffff");   // Pure white reflexed tip
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Central vivid ruby midrib streak
  const centerGrad = ctx.createLinearGradient(512, 1024, 512, 120);
  centerGrad.addColorStop(0, "rgba(159, 18, 57, 0.95)");
  centerGrad.addColorStop(0.35, "rgba(225, 29, 72, 0.88)");
  centerGrad.addColorStop(0.7, "rgba(251, 113, 133, 0.5)");
  centerGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.moveTo(512, 1024);
  ctx.bezierCurveTo(460, 650, 480, 300, 512, 80);
  ctx.bezierCurveTo(544, 300, 564, 650, 512, 1024);
  ctx.fill();

  // Pale lime-green nectar furrow at base
  const grooveGrad = ctx.createLinearGradient(512, 1024, 512, 800);
  grooveGrad.addColorStop(0.0, "rgba(132, 204, 22, 0.95)");
  grooveGrad.addColorStop(0.75, "rgba(190, 242, 100, 0.65)");
  grooveGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grooveGrad;
  ctx.beginPath();
  ctx.ellipse(512, 920, 18, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pearlescent translucent outer white margins
  const leftEdge = ctx.createLinearGradient(0, 0, 180, 0);
  leftEdge.addColorStop(0, "rgba(255, 255, 255, 0.92)");
  leftEdge.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = leftEdge;
  ctx.fillRect(0, 0, 180, 1024);

  const rightEdge = ctx.createLinearGradient(1024, 0, 844, 0);
  rightEdge.addColorStop(0, "rgba(255, 255, 255, 0.92)");
  rightEdge.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = rightEdge;
  ctx.fillRect(844, 0, 180, 1024);

  // Stargazer freckles / papillae clustered along throat
  ctx.fillStyle = "#4c0519";
  for (let i = 0; i < 170; i++) {
    const seed = i * 9301 + 49297;
    const r1 = (seed % 233280) / 233280;
    const r2 = ((seed * 7) % 233280) / 233280;
    const r3 = ((seed * 13) % 233280) / 233280;

    const py = 360 + r1 * 540;
    const spread = (1 - Math.abs((py - 620) / 380)) * 130;
    const px = 512 + (r2 - 0.5) * spread * 2;
    const radius = 1.4 + r3 * 2.8;

    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates soft nocturnal water pool gradient fading seamlessly into starry sky
function createWaterTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0.0, "rgba(10, 22, 38, 0.85)");
  grad.addColorStop(0.55, "rgba(8, 18, 32, 0.65)");
  grad.addColorStop(0.85, "rgba(6, 14, 25, 0.25)");
  grad.addColorStop(1.0, "rgba(5, 11, 20, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Builds a floating blooming water lily with notched emerald lily pad beside the main flower
function buildPondLily(x, z, scale = 1.0, notchRotation = 0, offset = 0) {
  const group = new THREE.Group();
  group.position.set(x, -1.93, z);
  group.scale.setScalar(scale);

  // 1. Lily pad with natural V-notch
  const shape = new THREE.Shape();
  const radius = 0.58;
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, 0.22, Math.PI * 2 - 0.22, false);
  shape.lineTo(0, 0);
  const padGeom = new THREE.ShapeGeometry(shape, 32);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.55,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  const padMesh = new THREE.Mesh(padGeom, padMat);
  padMesh.rotation.x = -Math.PI / 2;
  padMesh.rotation.z = notchRotation;
  padMesh.receiveShadow = true;
  group.add(padMesh);

  // 2. Flower group on pad
  const flower = new THREE.Group();
  flower.position.set(0, 0.02, 0);
  group.add(flower);

  const petalPivots = [];
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xffe4e6, // blush pearl white
    roughness: 0.35,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e, // rose pink
    roughness: 0.35,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  const count = 10;
  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count;
    const isOuter = i % 2 === 0;
    const pivot = new THREE.Group();
    pivot.rotation.y = -angle - Math.PI / 2;
    pivot.position.set(Math.cos(angle) * (isOuter ? 0.07 : 0.04), 0, Math.sin(angle) * (isOuter ? 0.07 : 0.04));

    const pGeom = new THREE.PlaneGeometry(isOuter ? 0.15 : 0.12, isOuter ? 0.44 : 0.36, 6, 8);
    pGeom.translate(0, (isOuter ? 0.44 : 0.36) / 2, 0);
    const pMesh = new THREE.Mesh(pGeom, isOuter ? outerMat : innerMat);
    pMesh.rotation.x = -0.15; // starts closed in bud
    pivot.add(pMesh);
    flower.add(pivot);
    petalPivots.push({ pivot, mesh: pMesh, isOuter });
  }

  // Golden stamen core
  const coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.1 })
  );
  coreMesh.position.y = 0.04;
  flower.add(coreMesh);

  return { group, flower, petalPivots, baseY: -1.93, offset };
}

// Builds single petal geometry with base anchored at y = 0
function createPetalGeometry(width = 1.15, length = 2.45, isOuter = true) {
  const segX = 24;
  const segY = 32;
  const geom = new THREE.PlaneGeometry(width, length, segX, segY);
  // Shift pivot so base connects cleanly at (0, 0, 0)
  geom.translate(0, length / 2, 0);

  const pos = geom.attributes.position;
  const origU = [];
  const origV = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    origU.push(Math.max(-1, Math.min(1, x / (width / 2))));
    origV.push(Math.max(0, Math.min(1, y / length))); // clamp strictly to [0, 1] to avoid float precision NaN
  }

  geom.userData = { origU, origV, width, length, isOuter };
  return geom;
}

// Updates petal curvature based on bloom progress (0 = closed bud, 1 = open bloom)
function applyPetalCurvature(geom, bloomT) {
  const { origU, origV, width, length, isOuter } = geom.userData;
  const pos = geom.attributes.position;

  // Closed bud (bloomT=0): cupped snugly inward, straight/inward arch, no reflex
  // Full bloom (bloomT=1): broad flare, outward arch, dramatic recurved reflex
  const cup = THREE.MathUtils.lerp(0.32, isOuter ? 0.14 : 0.20, bloomT);
  const arch = THREE.MathUtils.lerp(0.12, 0.48, bloomT);
  const reflex = THREE.MathUtils.lerp(0.0, 0.46, bloomT);

  for (let i = 0; i < pos.count; i++) {
    const u = origU[i];
    const v = origV[i];

    // Organic lanceolate outline: narrow claw at base, widest at ~38% height
    const widthFactor = Math.sin(Math.pow(v, 0.68) * Math.PI) * (1.0 - 0.16 * v);
    const wExpand = THREE.MathUtils.lerp(0.72, 1.0, bloomT);
    pos.setX(i, (u * (width * wExpand) / 2) * widthFactor);

    // Transverse cup
    const cupZ = -Math.pow(u, 2) * cup * Math.sin(v * Math.PI * 0.9);

    // Longitudinal curve: arches outward, reflexes backward at tip when bloomed
    let archZ = Math.sin(v * Math.PI * 0.72) * arch;
    if (v > 0.48) {
      const tipV = (v - 0.48) / 0.52;
      archZ -= Math.pow(tipV, 2.1) * reflex;
    }

    const midrib = -Math.abs(u) * 0.035 * Math.sin(v * Math.PI);
    const softWave = Math.sin(v * 6 + u * 2) * (0.012 * bloomT) * Math.pow(Math.abs(u), 1.4);

    pos.setZ(i, cupZ + archZ + midrib + softWave);
  }

  pos.needsUpdate = true;
  geom.computeVertexNormals();
}

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const lilyGroupRef = useRef(null);
  const stamenGroupRef = useRef(null);
  const heartGlowRef = useRef(null);
  const petalPivotsRef = useRef([]);
  const fallingPetalsRef = useRef([]);
  const ripplePlaneRef = useRef(null);
  const pondLiliesRef = useRef([]);
  const bloomedLiliesTriggeredRef = useRef(false);

  // Blooming animation tracking (starts at 0 in bud, delays 2 seconds, then blooms to 1)
  const bloomProgressRef = useRef(0);
  const pageEnterTimeRef = useRef(null);
  const isBloomingRef = useRef(true);

  // Interaction lock
  const isPluckingRef = useRef(false);
  const nextStoryIndexRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0, time: 0 });

  // React state
  const [pluckedCount, setPluckedCount] = useState(0);
  const [activeStory, setActiveStory] = useState(null);
  const [bloomedLiliesEverywhere, setBloomedLiliesEverywhere] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState("cinematic");

  // 8 distinct petals layout in a balanced double whorl:
  // 4 Outer primary tepals (Petals 1..4 at 0, 90, 180, 270 deg) - wide star flare
  // 4 Inner alternating tepals (Petals 5..8 at 45, 135, 225, 315 deg) - cupped bloom star
  // Both layers bloom open into a balanced, star-shaped Stargazer lily (no awkward upright bunny ears)
  const PETAL_LAYOUT = [
    { id: 1, angle: 0,                   bloomRadius: 0.54, budRadius: 0.16, bloomTilt: 1.18, budTilt: 0.12, isOuter: true,  wScale: 1.08 },
    { id: 2, angle: Math.PI / 2,         bloomRadius: 0.54, budRadius: 0.16, bloomTilt: 1.18, budTilt: 0.12, isOuter: true,  wScale: 1.08 },
    { id: 3, angle: Math.PI,             bloomRadius: 0.54, budRadius: 0.16, bloomTilt: 1.18, budTilt: 0.12, isOuter: true,  wScale: 1.08 },
    { id: 4, angle: (3 * Math.PI) / 2,   bloomRadius: 0.54, budRadius: 0.16, bloomTilt: 1.18, budTilt: 0.12, isOuter: true,  wScale: 1.08 },
    { id: 5, angle: Math.PI / 4,         bloomRadius: 0.46, budRadius: 0.13, bloomTilt: 1.06, budTilt: 0.10, isOuter: false, wScale: 1.22 },
    { id: 6, angle: (3 * Math.PI) / 4,   bloomRadius: 0.46, budRadius: 0.13, bloomTilt: 1.06, budTilt: 0.10, isOuter: false, wScale: 1.22 },
    { id: 7, angle: (5 * Math.PI) / 4,   bloomRadius: 0.46, budRadius: 0.13, bloomTilt: 1.06, budTilt: 0.10, isOuter: false, wScale: 1.22 },
    { id: 8, angle: (7 * Math.PI) / 4,   bloomRadius: 0.46, budRadius: 0.13, bloomTilt: 1.06, budTilt: 0.10, isOuter: false, wScale: 1.22 }
  ];

  // Camera presets - Framed so the entire flower, stem, and pool are fully visible without clipping
  const CAMERA_PRESETS = [
    { id: "cinematic", label: "Cinematic", icon: Camera, pos: [0, 0.8, 6.2], target: [0, 0.1, 0], desc: "Full Flower Overview" },
    { id: "top", label: "Top Bloom", icon: Maximize2, pos: [0, 6.2, 0.1], target: [0, 0.2, 0], desc: "Direct Downward Star Bloom" },
    { id: "front", label: "Eye Level", icon: Eye, pos: [0, 0.3, 5.8], target: [0, 0.2, 0], desc: "Straight Front Profile" },
    { id: "side", label: "Side Angle", icon: Compass, pos: [5.8, 0.8, 0], target: [0, 0.1, 0], desc: "Stem Arch & Reflexed Petals" },
    { id: "macro", label: "Macro", icon: Sparkles, pos: [0, 0.8, 2.6], target: [0, 0.45, 0], desc: "Golden Anthers & Nectar Throat" }
  ];

  const applyCameraPreset = (preset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCurrentCameraPreset(preset.id);
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    const startPos = cam.position.clone();
    const endPos = new THREE.Vector3(...preset.pos);
    const startTarget = ctrl.target.clone();
    const endTarget = new THREE.Vector3(...preset.target);

    let progress = 0;
    const duration = 24;
    const animateCam = () => {
      progress++;
      const t = Math.min(progress / duration, 1);
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);

      cam.position.lerpVectors(startPos, endPos, ease);
      ctrl.target.lerpVectors(startTarget, endTarget, ease);
      ctrl.update();

      if (t < 1) {
        requestAnimationFrame(animateCam);
      }
    };
    animateCam();
  };

  // Replay the 2-second pause and blooming sequence
  const replayBloom = () => {
    bloomProgressRef.current = 0;
    pageEnterTimeRef.current = performance.now();
    isBloomingRef.current = true;
    bloomedLiliesTriggeredRef.current = false;
    setBloomedLiliesEverywhere(false);

    petalPivotsRef.current.forEach(({ pivot, mesh, layout }) => {
      if (!mesh.userData.plucked) {
        pivot.position.set(
          Math.cos(layout.angle) * layout.budRadius,
          0.38,
          Math.sin(layout.angle) * layout.budRadius
        );
        mesh.rotation.x = -layout.budTilt;
        applyPetalCurvature(mesh.geometry, 0.0);
      }
    });

    // Reset pond water lilies beside the flower to closed buds
    pondLiliesRef.current.forEach((pl) => {
      pl.petalPivots.forEach(({ mesh }) => {
        mesh.rotation.x = -0.15;
      });
    });

    if (stamenGroupRef.current) {
      stamenGroupRef.current.scale.setScalar(0.25);
    }
    if (heartGlowRef.current) {
      heartGlowRef.current.intensity = 0.3;
    }
  };

  // Build the 8 Individual Independent Petal Pivots
  const buildLilyPetals = () => {
    const lilyGroup = lilyGroupRef.current;
    if (!lilyGroup || !sceneRef.current) return;

    // Clean old objects
    petalPivotsRef.current.forEach(({ pivot, mesh }) => {
      if (pivot.parent) pivot.parent.remove(pivot);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    petalPivotsRef.current = [];

    fallingPetalsRef.current.forEach((fp) => {
      if (fp.mesh.parent) fp.mesh.parent.remove(fp.mesh);
      if (fp.mesh.geometry) fp.mesh.geometry.dispose();
      if (fp.mesh.material) fp.mesh.material.dispose();
    });
    fallingPetalsRef.current = [];

    const texture = createLilyTexture();
    const petalPivots = [];

    PETAL_LAYOUT.forEach((layout) => {
      // Pivot object placed at radial coordinate (outward flaring orientation)
      const pivot = new THREE.Group();
      pivot.rotation.y = -layout.angle - Math.PI / 2;
      pivot.position.set(
        Math.cos(layout.angle) * layout.budRadius,
        0.38,
        Math.sin(layout.angle) * layout.budRadius
      );

      // Petal mesh attached to pivot at (0, 0, 0)
      const geom = createPetalGeometry(layout.wScale * 1.15, 2.45, layout.isOuter);
      applyPetalCurvature(geom, 0.0);

      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -layout.budTilt;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData = {
        id: layout.id,
        layout,
        pivot,
        plucked: false
      };

      pivot.add(mesh);
      lilyGroup.add(pivot);
      petalPivots.push({ pivot, mesh, layout });
    });

    petalPivotsRef.current = petalPivots;

    if (stamenGroupRef.current) {
      stamenGroupRef.current.scale.setScalar(0.25);
    }
    if (heartGlowRef.current) {
      heartGlowRef.current.intensity = 0.3;
    }

    isPluckingRef.current = false;
    nextStoryIndexRef.current = 0;
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
    const height = container.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);
    camera.lookAt(0, 0.1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.minPolarAngle = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.target.set(0, 0.1, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // Cinematic Botanical Warm Lighting
    const ambientLight = new THREE.AmbientLight(0x381220, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5f5, 3.2);
    keyLight.position.set(-3.5, 5.2, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfb7185, 2.6);
    rimLight.position.set(3.5, 3.0, -3.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfecdd3, 0.7);
    fillLight.position.set(0, -2, 2.5);
    scene.add(fillLight);

    // Glowing inner starlight inside flower throat
    const heartGlow = new THREE.PointLight(0xff4d79, 0.3, 4.2);
    heartGlow.position.set(0, 0.65, 0.2);
    scene.add(heartGlow);
    heartGlowRef.current = heartGlow;

    // Soft Nocturnal Reflective Water Pool (blends into starry night without harsh boundaries)
    const waterGeom = new THREE.CircleGeometry(4.8, 64);
    const waterTexture = createWaterTexture();
    const waterMat = new THREE.MeshStandardMaterial({
      map: waterTexture,
      roughness: 0.12,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterGeom, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -1.95;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Water ripple ring mesh
    const rippleGeom = new THREE.RingGeometry(0.01, 0.1, 48);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xfda4af,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ripplePlane = new THREE.Mesh(rippleGeom, rippleMat);
    ripplePlane.rotation.x = -Math.PI / 2;
    ripplePlane.position.y = -1.94;
    scene.add(ripplePlane);
    ripplePlaneRef.current = ripplePlane;

    // Floating water lilies beside the main flower on the nocturnal pond
    const pondLilies = [
      buildPondLily(-1.75, 0.40, 0.78, 0.8, 0),
      buildPondLily(-2.40, -0.45, 0.60, 2.3, 1.2),
      buildPondLily(1.75, 0.40, 0.78, 3.9, 2.4),
      buildPondLily(2.40, -0.45, 0.60, 5.1, 3.6)
    ];
    pondLilies.forEach((pl) => scene.add(pl.group));
    pondLiliesRef.current = pondLilies;

    // Botanical Lily Stem, Foliage, Receptacle, and Stamens
    const lilyGroup = new THREE.Group();
    lilyGroup.position.set(0, -0.1, 0);
    scene.add(lilyGroup);
    lilyGroupRef.current = lilyGroup;

    // Curved stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.38, 0),
      new THREE.Vector3(-0.04, -0.22, 0.02),
      new THREE.Vector3(0.03, -0.92, -0.02),
      new THREE.Vector3(-0.02, -1.45, 0.02),
      new THREE.Vector3(0, -1.95, 0)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.054, 14, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.55,
      metalness: 0.05
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.castShadow = true;
    lilyGroup.add(stemMesh);

    // Arching leaves
    const leafGeom = new THREE.PlaneGeometry(0.3, 0.98, 8, 12);
    const leafPos = leafGeom.attributes.position;
    for (let i = 0; i < leafPos.count; i++) {
      const y = leafPos.getY(i);
      const v = (y + 0.49) / 0.98;
      leafPos.setZ(i, Math.sin(v * Math.PI * 0.7) * 0.15);
    }
    leafGeom.computeVertexNormals();
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.45,
      side: THREE.DoubleSide
    });

    const leaf1 = new THREE.Mesh(leafGeom, leafMat);
    leaf1.position.set(-0.35, -0.65, 0.06);
    leaf1.rotation.set(0.35, 0.25, Math.PI / 3);
    lilyGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeom, leafMat);
    leaf2.position.set(0.38, -1.05, -0.03);
    leaf2.rotation.set(-0.25, -0.35, -Math.PI / 3.2);
    lilyGroup.add(leaf2);

    // Receptacle base bud
    const baseBudGeom = new THREE.SphereGeometry(0.32, 20, 20);
    const baseBudMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.5,
      metalness: 0.05
    });
    const baseBud = new THREE.Mesh(baseBudGeom, baseBudMat);
    baseBud.position.set(0, 0.38, 0);
    baseBud.scale.set(0.85, 1.1, 0.85);
    lilyGroup.add(baseBud);

    // Botanical Stamens & Anthers radiating outward in full bloom
    const stamenGroup = new THREE.Group();
    stamenGroup.position.set(0, 0.45, 0);
    stamenGroup.scale.setScalar(0.25);
    lilyGroup.add(stamenGroup);
    stamenGroupRef.current = stamenGroup;

    const filamentMat = new THREE.MeshStandardMaterial({
      color: 0xd9f99d,
      roughness: 0.4
    });
    const antherMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.88,
      metalness: 0.04
    });

    for (let i = 0; i < 6; i++) {
      const theta = (i * Math.PI * 2) / 6 + Math.PI / 6;
      const filCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.04, 0),
        new THREE.Vector3(Math.cos(theta) * 0.18, 0.42, Math.sin(theta) * 0.18),
        new THREE.Vector3(Math.cos(theta) * 0.42, 0.88, Math.sin(theta) * 0.42)
      ]);
      const filGeom = new THREE.TubeGeometry(filCurve, 20, 0.018, 8, false);
      const filMesh = new THREE.Mesh(filGeom, filamentMat);
      stamenGroup.add(filMesh);

      const antherGeom = new THREE.CapsuleGeometry(0.032, 0.16, 8, 8);
      const antherMesh = new THREE.Mesh(antherGeom, antherMat);
      antherMesh.position.set(Math.cos(theta) * 0.44, 0.89, Math.sin(theta) * 0.44);
      antherMesh.rotation.set(0.25, theta, Math.PI / 2);
      stamenGroup.add(antherMesh);
    }

    // Central Pistil / Style
    const styleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.04, 0),
      new THREE.Vector3(0.02, 0.55, 0.01),
      new THREE.Vector3(0, 1.05, 0)
    ]);
    const styleMesh = new THREE.Mesh(
      new THREE.TubeGeometry(styleCurve, 20, 0.024, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.4 })
    );
    stamenGroup.add(styleMesh);

    // 3-lobed Emerald Stigma
    const stigmaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.55 })
    );
    stigmaMesh.position.set(0, 1.07, 0);
    stamenGroup.add(stigmaMesh);

    // Build the 8 Individual Independent Petal Pivots
    buildLilyPetals();

    // Start 2-second entrance delay timer
    pageEnterTimeRef.current = performance.now();
    bloomProgressRef.current = 0;
    isBloomingRef.current = true;

    // Raycasting Pointer Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      pointerDownPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      };
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const activeMeshes = petalPivotsRef.current
        .map((p) => p.mesh)
        .filter((m) => !m.userData.plucked);
      const intersects = raycaster.intersectObjects(activeMeshes, false);

      container.style.cursor = intersects.length > 0 ? "pointer" : "default";
    };

    const onPointerUp = (e) => {
      const down = pointerDownPosRef.current;
      const dist = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const dt = Date.now() - down.time;

      if (dist > 18 || dt > 850) {
        return;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check unplucked petal clicks
      const activeMeshes = petalPivotsRef.current
        .map((p) => p.mesh)
        .filter((m) => !m.userData.plucked);
      const intersects = raycaster.intersectObjects(activeMeshes, false);

      if (intersects.length > 0) {
        pluckSinglePetal(intersects[0].object);
      } else {
        // Also allow clicking flower group generally
        const groupIntersects = raycaster.intersectObjects(lilyGroup.children, true);
        if (groupIntersects.length > 0 && activeMeshes.length > 0) {
          pluckSinglePetal(activeMeshes[0]);
        }
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);

    // Animation Render Loop (Handles 2-second delay + organic blooming curve)
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const now = performance.now();

      // 2-Second Delay + 2.8-Second Organic Blooming Engine
      if (isBloomingRef.current && pageEnterTimeRef.current) {
        const timeSinceEnter = now - pageEnterTimeRef.current;
        const delayMs = 2000;      // 2.0 second pause in closed bud state
        const durationMs = 2800;   // 2.8 second gentle unfurling bloom

        if (timeSinceEnter < delayMs) {
          bloomProgressRef.current = 0.0;
        } else {
          const rawT = Math.min((timeSinceEnter - delayMs) / durationMs, 1.0);
          const easeT = 1 - Math.pow(1 - rawT, 3); // Organic ease-out-cubic
          bloomProgressRef.current = easeT;

          petalPivotsRef.current.forEach(({ pivot, mesh, layout }) => {
            if (!mesh.userData.plucked) {
              const staggerDelay = layout.isOuter ? 0.0 : 0.12;
              const petalT = Math.max(0, Math.min((rawT - staggerDelay) / (1 - staggerDelay), 1.0));
              const petalEase = 1 - Math.pow(1 - petalT, 3);

              // Morph geometry curvature
              applyPetalCurvature(mesh.geometry, petalEase);

              // Expand radial radius
              const curRadius = THREE.MathUtils.lerp(layout.budRadius, layout.bloomRadius, petalEase);
              pivot.position.set(
                Math.cos(layout.angle) * curRadius,
                0.38,
                Math.sin(layout.angle) * curRadius
              );

              // Flare open tilt
              const curTilt = THREE.MathUtils.lerp(layout.budTilt, layout.bloomTilt, petalEase);
              mesh.rotation.x = -curTilt;
            }
          });

          // Unfurl stamens from bud heart
          if (stamenGroupRef.current) {
            const stamenT = Math.max(0, (easeT - 0.2) / 0.8);
            stamenGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.25, 1.0, stamenT));
          }

          // Trigger blooming lilies across the page too
          if (!bloomedLiliesTriggeredRef.current) {
            bloomedLiliesTriggeredRef.current = true;
            setBloomedLiliesEverywhere(true);
          }

          // Unfurl floating pond water lilies beside the flower
          pondLiliesRef.current.forEach((pl) => {
            pl.petalPivots.forEach(({ mesh, isOuter }) => {
              const targetTilt = isOuter ? -1.18 : -1.05;
              mesh.rotation.x = THREE.MathUtils.lerp(-0.15, targetTilt, easeT);
            });
          });

          // Inner glowing starlight intensifies as flower opens
          if (heartGlowRef.current) {
            heartGlowRef.current.intensity = THREE.MathUtils.lerp(0.3, 2.5, easeT);
          }

          if (rawT >= 1.0) {
            isBloomingRef.current = false;
          }
        }
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Gentle ambient lily sway when not spinning
      if (!controlsRef.current || !controlsRef.current.autoRotate) {
        lilyGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.04;
        lilyGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.012;
      }

      // Ambient floating bob for pond water lilies beside the flower
      pondLiliesRef.current.forEach((pl) => {
        pl.group.position.y = pl.baseY + Math.sin(elapsed * 1.5 + pl.offset) * 0.005;
      });

      // Animate active falling petals (flutter down and disappear into the water)
      for (let i = fallingPetalsRef.current.length - 1; i >= 0; i--) {
        const fp = fallingPetalsRef.current[i];
        fp.progress += 0.024;

        fp.mesh.position.y -= 0.042;
        fp.mesh.position.x += Math.sin(fp.progress * 4.8) * 0.024;
        fp.mesh.position.z += Math.cos(fp.progress * 3.6) * 0.016;

        fp.mesh.rotation.x += 0.038;
        fp.mesh.rotation.z += 0.028;

        if (fp.mesh.position.y < -1.35) {
          fp.mesh.material.opacity = Math.max(0, fp.mesh.material.opacity - 0.038);
        }

        // Reaches water surface -> ripple and DISAPPEAR
        if (fp.mesh.position.y <= -1.92 || fp.mesh.material.opacity <= 0) {
          if (ripplePlaneRef.current) {
            ripplePlaneRef.current.position.set(fp.mesh.position.x, -1.94, fp.mesh.position.z);
            ripplePlaneRef.current.material.opacity = 0.95;
            ripplePlaneRef.current.scale.set(0.1, 0.1, 0.1);
          }

          if (fp.mesh.parent) {
            fp.mesh.parent.remove(fp.mesh);
          }
          if (fp.mesh.geometry) {
            fp.mesh.geometry.dispose();
          }
          if (fp.mesh.material) {
            fp.mesh.material.dispose();
          }

          fallingPetalsRef.current.splice(i, 1);
        }
      }

      // Water ripple expand & fade
      if (ripplePlaneRef.current && ripplePlaneRef.current.material.opacity > 0) {
        ripplePlaneRef.current.scale.x += 0.06;
        ripplePlaneRef.current.scale.y += 0.06;
        ripplePlaneRef.current.material.opacity -= 0.024;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
      const h = container.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      pondLiliesRef.current.forEach((pl) => {
        if (pl.group.parent) pl.group.parent.remove(pl.group);
      });
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Plucks EXACTLY ONE single petal, detaches it, flutters down, and opens the next sequential story
  const pluckSinglePetal = (petalMesh) => {
    if (isPluckingRef.current || petalMesh.userData.plucked) return;
    isPluckingRef.current = true;
    petalMesh.userData.plucked = true;

    // Attach directly to scene to preserve world transform without position doubling
    if (sceneRef.current) {
      sceneRef.current.attach(petalMesh);
    }

    // Add ONLY this single petal to falling physics
    fallingPetalsRef.current.push({
      mesh: petalMesh,
      progress: 0
    });

    // Sequential milestone story (1 through 8 in order)
    const storyIdx = nextStoryIndexRef.current;
    const currentStory = LILY_STORIES[storyIdx % LILY_STORIES.length];
    nextStoryIndexRef.current = storyIdx + 1;
    const newCount = storyIdx + 1;

    setPluckedCount(newCount);

    setTimeout(() => {
      setActiveStory(currentStory);
      isPluckingRef.current = false;
    }, 1400);

    // All 8 petals shed
    if (newCount >= 8) {
      setTimeout(() => {
        setBloomedLiliesEverywhere(true);
        markSpaceCompleted("02-constellation");

        try {
          confetti({
            particleCount: 160,
            spread: 140,
            origin: { y: 0.6 },
            colors: ["#f43f5e", "#fb7185", "#fda4af", "#fef08a", "#ffffff"]
          });
        } catch (e) {}
      }, 1500);
    }
  };

  const handleReset = () => {
    buildLilyPetals();
    setActiveStory(null);
    setBloomedLiliesEverywhere(false);
    bloomedLiliesTriggeredRef.current = false;
    setShowGrandFinale(false);
    setPluckedCount(0);
    replayBloom();
  };

  const nextStory = () => {
    if (!activeStory) return;
    const curIdx = LILY_STORIES.findIndex((p) => p.id === activeStory.id);
    const nextIdx = (curIdx + 1) % LILY_STORIES.length;
    setActiveStory(LILY_STORIES[nextIdx]);
  };

  const prevStory = () => {
    if (!activeStory) return;
    const curIdx = LILY_STORIES.findIndex((p) => p.id === activeStory.id);
    const prevIdx = curIdx === 0 ? LILY_STORIES.length - 1 : curIdx - 1;
    setActiveStory(LILY_STORIES[prevIdx]);
  };

  const remainingPetalCount = Math.max(0, 8 - pluckedCount);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-[#070e17] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 1. Starry Night Atmospheric Backdrop */}
      <img
        src="/starry-night.jpg"
        alt="Starry Night Backdrop"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none pointer-events-none filter blur-[1px]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#060b13]/85 via-[#08121f]/75 to-[#04080e]/95 pointer-events-none" />

      {/* Full-Screen Three.js Canvas Container (NO box, NO frame, entire flower visible) */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-10 touch-none select-none"
      />

      {/* Atmospheric center glow behind flower */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-rose-600/10 blur-3xl pointer-events-none z-10" />

      {/* 2. Top Header Overlay */}
      <div className="relative z-30 pt-5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3 pointer-events-none max-w-6xl mx-auto w-full">
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-rose-300/30 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
          <RibbonBow className="w-6 h-5 text-rose-300 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base text-rose-100 font-bold">
                Chapter 2 // The Stargazer Lily of Seven Years
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#fda4af" centerColor="#fecdd3" />
            </div>
            <p className="text-[11px] text-rose-200/80 font-sans mt-0.5">
              {remainingPetalCount > 1
                ? `Tap to drop a single petal into the water (${remainingPetalCount} petals left) ♡`
                : remainingPetalCount === 1
                ? "Only 1 petal left... Tap to drop the heart of the lily ♡"
                : "All petals have shed — celestial lilies bloom across the night ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Replay Bloom Button */}
          <button
            onClick={replayBloom}
            className="px-3.5 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-rose-200 hover:text-white transition-colors shadow-xl flex items-center gap-1.5 text-xs font-serif cursor-pointer"
            title="Watch the Lily Bloom Again"
          >
            <Play className="w-3 h-3 text-rose-300 fill-rose-300" />
            <span>Replay Bloom</span>
          </button>

          {/* Reset Plucked Petals Button */}
          {pluckedCount > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-rose-200 hover:text-white transition-colors shadow-xl cursor-pointer"
              title="Reset Lily and Reattach Petals"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-xs font-sans text-rose-100 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
            <SparkleStar className="w-3.5 h-3.5 text-rose-300" />
            <span>Petals Dropped:</span>
            <span className="font-mono text-rose-300 font-bold">
              {pluckedCount} / 8
            </span>
          </div>
        </div>
      </div>

      {/* 3. Floating Camera Views Toolbar (Right Side) */}
      <div className="absolute top-20 right-4 sm:right-8 z-30 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-xl border border-rose-300/30 p-2 sm:p-2.5 rounded-2xl shadow-2xl pointer-events-auto">
        <div className="flex items-center justify-between px-1 mb-1 border-b border-rose-300/20 pb-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-rose-200/80 font-bold flex items-center gap-1">
            <Camera className="w-3 h-3 text-rose-300" /> Camera Views
          </span>
        </div>

        {CAMERA_PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          const isActive = currentCameraPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyCameraPreset(preset)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-sans transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-rose-500/30 text-rose-100 border border-rose-400/50 shadow-sm"
                  : "text-rose-200/80 hover:text-white hover:bg-white/10"
              }`}
              title={preset.desc}
            >
              <IconComponent className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span className="truncate">{preset.label}</span>
            </button>
          );
        })}

        <div className="border-t border-rose-300/20 pt-1 mt-0.5 flex flex-col gap-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
              autoRotate
                ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                : "text-rose-200/80 hover:text-white hover:bg-white/10"
            }`}
            title="Continuous 360-degree turntable rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-emerald-300" : "text-rose-300"}`} />
            <span>{autoRotate ? "Spinning 360°" : "Auto Rotate"}</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Interactive Cue Overlay */}
      <div className="relative z-30 pb-5 text-center pointer-events-none">
        <p className="text-xs font-serif italic text-rose-200/90 tracking-wide bg-slate-900/60 backdrop-blur-md px-5 py-2 rounded-full inline-block border border-rose-300/20 shadow-lg">
          Drag to rotate camera • Scroll to zoom • Click any petal to drop it into the water and reveal the next memory ♡
        </p>
      </div>

      {/* 5. Climax Lilies Blooming Across the Night Sky */}
      <AnimatePresence>
        {bloomedLiliesEverywhere && (
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {BLOOMING_LILIES.map((lily) => (
              <motion.div
                key={lily.id}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.25, 1],
                  opacity: [0, 1, 0.95],
                  rotate: lily.rotation
                }}
                transition={{
                  duration: 0.95,
                  delay: lily.delay,
                  type: "spring",
                  stiffness: 210,
                  damping: 14
                }}
                style={{
                  left: lily.x,
                  top: lily.y,
                  width: lily.size,
                  height: lily.size
                }}
                className="absolute text-rose-400 drop-shadow-[0_8px_20px_rgba(244,63,94,0.55)]"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <radialGradient id={`lily-grad-${lily.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#881337" />
                      <stop offset="35%" stopColor="#e11d48" />
                      <stop offset="70%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </radialGradient>
                  </defs>
                  {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                    <path
                      key={idx}
                      d="M50,50 Q43,22 50,6 Q57,22 50,50 Z"
                      fill={`url(#lily-grad-${lily.id})`}
                      stroke="#fff1f2"
                      strokeWidth="0.8"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                  {[30, 90, 150, 210, 270, 330].map((deg, idx) => (
                    <circle
                      key={`stamen-${idx}`}
                      cx={50 + Math.cos((deg * Math.PI) / 180) * 12}
                      cy={50 + Math.sin((deg * Math.PI) / 180) * 12}
                      r="2.2"
                      fill="#f59e0b"
                    />
                  ))}
                  <circle cx="50" cy="50" r="4.5" fill="#4ade80" />
                  <circle cx="50" cy="50" r="2" fill="#ffffff" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 6. Story Memory Modal */}
      <AnimatePresence>
        {activeStory && !showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => {
              setActiveStory(null);
              if (pluckedCount >= 8) setShowGrandFinale(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              className="max-w-lg w-full bg-[#fffdfa] text-[#132e22] border-2 border-rose-300 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-rose-200/80" />
              </div>

              <div className="flex items-center justify-between border-b border-rose-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FlowerBlossom className="w-4 h-4" petalColor="#fda4af" centerColor="#fecdd3" />
                  <span className="text-xs font-bold text-rose-700 font-sans">
                    Story {activeStory.order} // {activeStory.yearBadge}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveStory(null);
                    if (pluckedCount >= 8) setShowGrandFinale(true);
                  }}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-4 border border-rose-200 shadow-sm h-52 bg-rose-50">
                <img
                  src={activeStory.photoUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              <h4 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {activeStory.title}
              </h4>
              <p className="text-xs text-rose-600 font-sans font-medium mb-3">
                {activeStory.date}
              </p>

              <div className="text-sm font-serif text-[#3d6350] leading-relaxed whitespace-pre-line mb-6 italic max-h-48 overflow-y-auto pr-1">
                {activeStory.story}
              </div>

              <div className="flex items-center justify-between border-t border-rose-200 pt-3 text-xs font-sans">
                <button
                  onClick={prevStory}
                  className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold text-rose-800">
                  Petal {activeStory.order} of 8 Dropped
                </span>

                {activeStory.order === 8 ? (
                  <button
                    onClick={() => {
                      setActiveStory(null);
                      setShowGrandFinale(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1 text-xs"
                  >
                    <span>Grand Finale</span>
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                ) : (
                  <button
                    onClick={nextStory}
                    className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Grand Finale Climax Modal */}
      <AnimatePresence>
        {showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-[#fffdfa] text-[#132e22] border-4 border-rose-300 rounded-[36px] p-8 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="flex justify-center mb-3">
                <RibbonBow className="w-12 h-10 text-rose-400 drop-shadow-sm" />
              </div>

              <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase block mb-1">
                ALL EIGHT PETALS HAVE SHED INTO THE WATER
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#132e22] mb-3">
                A Pond of Lilies For You
              </h3>
              <p className="text-sm font-serif text-[#3d6350] leading-relaxed italic mb-6">
                "Each petal was a year we lived through. And when the heart of the lily fell, it didn't end—it sent ripples across the water, blooming a constellation of lilies. I will love you through every season, Mythri."
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowGrandFinale(false)}
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-sans transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Admire the Blooming Pond of Lilies ♡
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs font-sans transition-colors cursor-pointer"
                >
                  Re-bloom the Lily from the Start
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
