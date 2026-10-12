import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Heart
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import confetti from "canvas-confetti";
import {
  RibbonBow,
  FlowerBlossom,
  SparkleStar,
  WashiTape
} from "../components/common/GirlyPopDecorations";

// The 8 Petals & Stories of the 3D Stargazer Lily
export const LILY_PETALS = [
  {
    id: 1,
    order: 1,
    name: "Outer Tepal I",
    title: "Where Two Aries Collided",
    yearBadge: "Year 01 // 2019",
    date: "October 2019 // The First Spark",
    summary: "Two headstrong souls who found their equal in each other.",
    story: `There was an instant, unspoken recognition between us from the very first talk. 

Two stubborn, fiery Aries who normally guard their independence fiercely—suddenly wanting to stay in the exact same room, talking for hours without running out of things to say. 

You weren't like anyone else I had ever met. You carried this fierce, quiet authenticity that immediately broke through all my defenses. That first spark wasn't just a moment; it was the foundation of our entire story.`,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80",
    angle: 0,
    radius: 0.88,
    elevation: 0.12,
    tilt: 0.94,
    curl: 0.42,
    scale: 1.15
  },
  {
    id: 2,
    order: 2,
    name: "Outer Tepal II",
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    date: "Year 02 // City Nights",
    summary: "Riding through rain at 1 AM with your arms around me.",
    story: `Some of my favorite memories with you don't cost a single rupee.

Like riding through torrential night rain when neither of us had any business being on the road. Water dripping from our helmets and soaking through our jackets, cold winds whipping past, and your hands tucked tightly into my pockets.

In that quiet midnight city, with nobody else around, I realized I would ride anywhere in the world as long as you were sitting behind me.`,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    angle: Math.PI / 2,
    radius: 0.9,
    elevation: 0.14,
    tilt: 0.96,
    curl: 0.45,
    scale: 1.18
  },
  {
    id: 3,
    order: 3,
    name: "Outer Tepal III",
    title: "The Corner Table & Crispy Fries",
    yearBadge: "Year 03 // 2021",
    date: "Year 03 // Favorite Café",
    summary: "Four hours passing like four minutes across a wooden table.",
    story: `Sitting across from you over iced coffees, watching the afternoon light shift into evening.

Splitting an order of extra crispy fries and silently leaving the crunchiest one at the bottom for you. The way we could talk about the most absurd, ridiculous thoughts one minute, and dive into our deepest family vulnerabilities the next.

With you, there was never any awkward silence—only comfort so deep it felt like breathing.`,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    angle: Math.PI,
    radius: 0.89,
    elevation: 0.13,
    tilt: 0.95,
    curl: 0.44,
    scale: 1.16
  },
  {
    id: 4,
    order: 4,
    name: "Outer Tepal IV",
    title: "Learning Your Quiet Cadence",
    yearBadge: "Year 04 // 2022",
    date: "Year 04 // Inside Jokes",
    summary: "Understanding your silence and laughing through stubborn UNO rivalries.",
    story: `By year four, love was no longer a question—it had become our second nature.

I learned the subtle signs of when you were exhausted before you said a word. I learned how your laughter could instantly dismantle a bad day, and how seriously you take an UNO Draw 4 card.

We learned how to forgive quickly, how to tease gently, and how to hold space for each other when life felt heavy. You became my safest harbor.`,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    angle: (3 * Math.PI) / 2,
    radius: 0.88,
    elevation: 0.12,
    tilt: 0.94,
    curl: 0.43,
    scale: 1.15
  },
  {
    id: 5,
    order: 5,
    name: "Inner Tepal V",
    title: "Your Fierce, Unshakable Heart",
    yearBadge: "Year 05 // 2023",
    date: "Year 05 // Benchmark of Integrity",
    summary: "The quiet courage and fierce loyalty that defines who you are.",
    story: `The thing I admire most about you is how unconditionally you stand by the people you love.

You never perform kindness for an audience. When someone is hurting, you show up. When things are difficult, you set your jaw, figure out what needs to be done, and do it with grace.

In five years of watching you grow, my respect for your character only deepened. You are the standard of integrity and honesty in my life.`,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    angle: Math.PI / 4,
    radius: 0.54,
    elevation: 0.34,
    tilt: 0.65,
    curl: 0.32,
    scale: 0.98
  },
  {
    id: 6,
    order: 6,
    name: "Inner Tepal VI",
    title: "Counting Gates & Time Zones",
    yearBadge: "Year 06 // 2024",
    date: "Year 06 // The Distance Anchor",
    summary: "Counting down airport gates, knowing distance could never dilute us.",
    story: `Distance tests everything. It tests patience, routines, and endurance.

Yet across busy schedules, departures, and counting down the days until we could sit in the same room again, our bond never wavered. Every late-night call and every countdown proved what we always knew:

Physical miles could never dilute what we built. We were anchored in each other long before the miles appeared.`,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    angle: (11 * Math.PI) / 12,
    radius: 0.56,
    elevation: 0.38,
    tilt: 0.68,
    curl: 0.34,
    scale: 0.96
  },
  {
    id: 7,
    order: 7,
    name: "Inner Tepal VII",
    title: "Unshakable Home",
    yearBadge: "Year 07 // 2025",
    date: "Year 07 // The Sanctuary",
    summary: "In a chaotic noisy world, you are the peace I always come home to.",
    story: `At the end of an exhausting week, when the world demands too much and everything feels noisy—just sitting beside you cuts through all the static.

You don't need to give advice or solve my problems. Just resting your head on my shoulder or holding my hand reminds me of who I am.

In seven years, you turned love from a fleeting feeling into a permanent home.`,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    angle: (19 * Math.PI) / 12,
    radius: 0.53,
    elevation: 0.35,
    tilt: 0.64,
    curl: 0.31,
    scale: 0.95
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
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    angle: 0,
    radius: 0.04,
    elevation: 0.58,
    tilt: 0.18,
    curl: 0.18,
    scale: 0.85
  }
];

// Backward-compatible alias
export const ROSE_PETALS = LILY_PETALS;

// 36 blooming celestial lilies for the finale
export const BLOOMING_LILIES = Array.from({ length: 36 }).map((_, i) => ({
  id: i,
  x: `${(i * 19.3) % 92 + 4}%`,
  y: `${(i * 27.7) % 86 + 7}%`,
  size: 34 + (i % 6) * 6,
  rotation: (i * 47) % 360,
  delay: (i % 12) * 0.12
}));

// Generates procedural Stargazer Lily petal canvas texture
function createStargazerLilyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  // Vertical gradient: deep carmine-throat -> blush pink -> pearl white at tip
  const grad = ctx.createLinearGradient(256, 1024, 256, 0);
  grad.addColorStop(0, "#881337");    // Deep ruby throat
  grad.addColorStop(0.2, "#be123c");   // Carmine midtone
  grad.addColorStop(0.55, "#f43f5e");  // Stargazer pink
  grad.addColorStop(0.8, "#fda4af");   // Blush edge
  grad.addColorStop(0.95, "#fff1f2");  // Soft cream
  grad.addColorStop(1.0, "#ffffff");   // Pure white reflexed tip
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Central vivid magenta/carmine flame streak
  const centerGrad = ctx.createLinearGradient(256, 1024, 256, 150);
  centerGrad.addColorStop(0, "rgba(159, 18, 57, 0.95)");
  centerGrad.addColorStop(0.4, "rgba(225, 29, 72, 0.88)");
  centerGrad.addColorStop(0.75, "rgba(251, 113, 133, 0.5)");
  centerGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.moveTo(256, 1024);
  ctx.bezierCurveTo(232, 700, 238, 350, 256, 140);
  ctx.bezierCurveTo(274, 350, 280, 700, 256, 1024);
  ctx.fill();

  // Nectar groove: pale yellow-green streak at the very base
  const grooveGrad = ctx.createLinearGradient(256, 1024, 256, 820);
  grooveGrad.addColorStop(0, "rgba(132, 204, 22, 0.95)");
  grooveGrad.addColorStop(0.7, "rgba(190, 242, 100, 0.65)");
  grooveGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grooveGrad;
  ctx.beginPath();
  ctx.ellipse(256, 930, 8, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crisp white outer margins on left and right
  const leftEdge = ctx.createLinearGradient(0, 0, 110, 0);
  leftEdge.addColorStop(0, "rgba(255, 255, 255, 0.92)");
  leftEdge.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = leftEdge;
  ctx.fillRect(0, 0, 110, 1024);

  const rightEdge = ctx.createLinearGradient(512, 0, 402, 0);
  rightEdge.addColorStop(0, "rgba(255, 255, 255, 0.92)");
  rightEdge.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = rightEdge;
  ctx.fillRect(402, 0, 110, 1024);

  // Stargazer Papillae / Freckles: burgundy dots clustered along the central midrib
  ctx.fillStyle = "#4c0519";
  for (let i = 0; i < 170; i++) {
    const seed = i * 9301 + 49297;
    const r1 = (seed % 233280) / 233280;
    const r2 = ((seed * 7) % 233280) / 233280;
    const r3 = ((seed * 13) % 233280) / 233280;

    const py = 340 + r1 * 560;
    const spread = (1 - Math.abs((py - 600) / 420)) * 130;
    const px = 256 + (r2 - 0.5) * spread * 2;
    const radius = 1.6 + r3 * 3.4;

    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Builds a botanical 3D Stargazer Lily petal with lanceolate profile, central midrib, arching curve, and reflexed tip
function create3DLilyPetalGeometry(width = 0.85, length = 1.95, arch = 0.65, reflex = 0.38, cup = 0.28) {
  const segX = 24;
  const segY = 36;
  const geom = new THREE.PlaneGeometry(width, length, segX, segY);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    // Normalize coordinates: u in [-1, 1], v in [0, 1]
    const u = x / (width / 2);
    const v = (y + length / 2) / length;

    // Organic lanceolate width profile: narrow claw base, widest at ~40-45% height, pointed apex
    const widthFactor = Math.sin(Math.pow(v, 0.72) * Math.PI) * (1 - 0.15 * v);
    pos.setX(i, (u * width / 2) * widthFactor);

    // Central longitudinal midrib depression & transverse cupping
    const midrib = -Math.abs(u) * 0.08 * (1 - v * 0.3);
    const cupZ = -Math.pow(u, 2) * cup * Math.sin(v * Math.PI * 0.85);

    // Graceful outward arching curve
    let archZ = Math.sin(v * Math.PI * 0.65) * arch;

    // Dramatic recurved / reflexed tip
    if (v > 0.55) {
      const tipV = (v - 0.55) / 0.45;
      archZ -= Math.pow(tipV, 2.2) * (arch * 1.35 + reflex);
    }

    // Natural undulating ruffles along outer margins
    const marginDist = Math.abs(u);
    const ruffle = Math.sin(v * 24 + u * 6) * 0.035 * Math.pow(marginDist, 1.8) * Math.sin(v * Math.PI);

    pos.setZ(i, cupZ + archZ + midrib + ruffle);
  }

  geom.computeVertexNormals();
  return geom;
}

export default function SpaceConstellation() {
  const { markSpaceCompleted } = useAnniversary();

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const petalMeshesRef = useRef([]);
  const fallingPetalsRef = useRef([]);
  const restingPetalsRef = useRef([]);
  const ripplePlaneRef = useRef(null);

  // React state
  const [fallenPetals, setFallenPetals] = useState(new Set());
  const [activeStory, setActiveStory] = useState(null);
  const [hoveredPetal, setHoveredPetal] = useState(null);
  const [bloomedLiliesEverywhere, setBloomedLiliesEverywhere] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  // Set up the Three.js 3D Stargazer Lily Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.95, 5.3);
    camera.lookAt(0, -0.15, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Cinematic 3D Lighting
    const ambientLight = new THREE.AmbientLight(0x280512, 1.6);
    scene.add(ambientLight);

    // Warm Key Light (Directional from top-left)
    const keyLight = new THREE.DirectionalLight(0xfff1f2, 2.9);
    keyLight.position.set(-3.5, 4.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim Light (Directional from behind-right, catches reflexed tips)
    const rimLight = new THREE.DirectionalLight(0xfb7185, 2.4);
    rimLight.position.set(3, 2, -2.5);
    scene.add(rimLight);

    // Soft Blue Water Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x38bdf8, 0.95);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // Warm Inner Starlight Glow in the center of the bloom
    const heartGlow = new THREE.PointLight(0xff85a1, 1.9, 3.8);
    heartGlow.position.set(0, 0.5, 0.25);
    scene.add(heartGlow);

    // 3. Water Pool Plane & Ripples
    const waterGeom = new THREE.CircleGeometry(2.3, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x07111e,
      roughness: 0.08,
      metalness: 0.88,
      transparent: true,
      opacity: 0.78
    });
    const waterPlane = new THREE.Mesh(waterGeom, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -1.85;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Expanding water ripple ring mesh
    const rippleGeom = new THREE.RingGeometry(0.01, 0.09, 48);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xfda4af,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ripplePlane = new THREE.Mesh(rippleGeom, rippleMat);
    ripplePlane.rotation.x = -Math.PI / 2;
    ripplePlane.position.y = -1.84;
    scene.add(ripplePlane);
    ripplePlaneRef.current = ripplePlane;

    // 4. Botanical Lily Stem, Foliage, Receptacle, and Stamens
    const lilyGroup = new THREE.Group();
    lilyGroup.position.set(0, -0.1, 0);
    scene.add(lilyGroup);

    // Natural curved lily stem spline
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(-0.05, -0.25, 0.03),
      new THREE.Vector3(0.04, -0.95, -0.02),
      new THREE.Vector3(-0.02, -1.45, 0.02),
      new THREE.Vector3(0, -1.85, 0)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.052, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.6,
      metalness: 0.08
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.castShadow = true;
    lilyGroup.add(stemMesh);

    // Slender lanceolate lily leaves arching outward
    const leafGeom = new THREE.PlaneGeometry(0.28, 0.95, 8, 12);
    // Curl leaf along length
    const leafPos = leafGeom.attributes.position;
    for (let i = 0; i < leafPos.count; i++) {
      const y = leafPos.getY(i);
      const v = (y + 0.475) / 0.95;
      leafPos.setZ(i, Math.sin(v * Math.PI * 0.7) * 0.14);
    }
    leafGeom.computeVertexNormals();

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.4,
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

    // Flower receptacle base
    const baseBudGeom = new THREE.SphereGeometry(0.35, 20, 20);
    const baseBudMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.5,
      metalness: 0.05
    });
    const baseBud = new THREE.Mesh(baseBudGeom, baseBudMat);
    baseBud.position.set(0, 0.35, 0);
    baseBud.scale.set(0.85, 1.1, 0.85);
    lilyGroup.add(baseBud);

    // Botanical Stamens & Anthers in the heart of the Lily
    const stamenGroup = new THREE.Group();
    stamenGroup.position.set(0, 0.45, 0);
    lilyGroup.add(stamenGroup);

    const filamentMat = new THREE.MeshStandardMaterial({
      color: 0xd9f99d, // Pale lime filament
      roughness: 0.4
    });
    const antherMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Velvety rust/golden pollen
      roughness: 0.85,
      metalness: 0.05
    });

    // 6 arching filaments with golden pollen anthers
    for (let i = 0; i < 6; i++) {
      const theta = (i * Math.PI * 2) / 6;
      const filCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(theta) * 0.12, 0.35, Math.sin(theta) * 0.12),
        new THREE.Vector3(Math.cos(theta) * 0.24, 0.72, Math.sin(theta) * 0.24)
      ]);
      const filGeom = new THREE.TubeGeometry(filCurve, 16, 0.015, 8, false);
      const filMesh = new THREE.Mesh(filGeom, filamentMat);
      stamenGroup.add(filMesh);

      // T-shaped pollen anther at filament tip
      const antherGeom = new THREE.CapsuleGeometry(0.025, 0.12, 8, 8);
      const antherMesh = new THREE.Mesh(antherGeom, antherMat);
      antherMesh.position.set(Math.cos(theta) * 0.25, 0.73, Math.sin(theta) * 0.25);
      antherMesh.rotation.set(Math.random() * 0.4, theta, Math.PI / 2);
      stamenGroup.add(antherMesh);
    }

    // Central Pistil / Style
    const styleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, 0.45, 0.01),
      new THREE.Vector3(0, 0.88, 0)
    ]);
    const styleMesh = new THREE.Mesh(
      new THREE.TubeGeometry(styleCurve, 16, 0.02, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.4 })
    );
    stamenGroup.add(styleMesh);

    // 3-lobed Stigma on top of pistil
    const stigmaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 })
    );
    stigmaMesh.position.set(0, 0.9, 0);
    stamenGroup.add(stigmaMesh);

    // 5. The 8 Interactive 3D Stargazer Lily Petals
    const lilyTexture = createStargazerLilyTexture();
    const petalMeshes = [];
    petalMeshesRef.current = petalMeshes;

    LILY_PETALS.forEach((petalData) => {
      const isOuter = petalData.order <= 4;
      const isHeart = petalData.order === 8;

      const geom = create3DLilyPetalGeometry(
        0.82 * petalData.scale,
        1.95 * petalData.scale,
        petalData.curl,
        petalData.tilt * 0.42,
        isOuter ? 0.3 : 0.22
      );

      // Stargazer lily material with custom procedural texture
      const mat = new THREE.MeshStandardMaterial({
        map: lilyTexture,
        roughness: 0.36,
        metalness: 0.03,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Position along star whorl
      const angle = petalData.angle;
      const radius = petalData.radius;
      mesh.position.set(
        Math.cos(angle) * radius,
        petalData.elevation + 0.3,
        Math.sin(angle) * radius
      );

      // Rotate petal so it flares outward in star formation
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.rotation.x = -petalData.tilt;

      // Center heart petal wraps softly around the pistil base
      if (isHeart) {
        mesh.rotation.set(-0.25, 0.3, 0);
        mesh.position.set(0, 0.58, 0);
      }

      mesh.userData = {
        id: petalData.id,
        petalData,
        originalPos: mesh.position.clone(),
        originalRot: mesh.rotation.clone(),
        plucked: false
      };

      lilyGroup.add(mesh);
      petalMeshes.push(mesh);
    });

    // 6. Interactive Raycaster on Pointer Move
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const activeMeshes = petalMeshes.filter((m) => !m.userData.plucked);
      const intersects = raycaster.intersectObjects(activeMeshes, false);

      if (intersects.length > 0) {
        const topMesh = intersects[0].object;
        setHoveredPetal(topMesh.userData.petalData);
        container.style.cursor = "pointer";

        // Highlight hovered petal
        petalMeshes.forEach((m) => {
          if (m === topMesh) {
            m.material.emissive.setHex(0x500718);
          } else {
            m.material.emissive.setHex(0x000000);
          }
        });
      } else {
        setHoveredPetal(null);
        container.style.cursor = "default";
        petalMeshes.forEach((m) => m.material.emissive.setHex(0x000000));
      }
    };

    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check active unplucked petals
      const activeMeshes = petalMeshes.filter((m) => !m.userData.plucked);
      const intersects = raycaster.intersectObjects(activeMeshes, false);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        pluckPetal3D(clickedMesh);
        return;
      }

      // Also check resting petals floating in the water to reopen memories
      const restingMeshes = restingPetalsRef.current;
      const restingIntersects = raycaster.intersectObjects(restingMeshes, false);
      if (restingIntersects.length > 0) {
        const clickedResting = restingIntersects[0].object;
        setActiveStory(clickedResting.userData.petalData);
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("click", onClick);

    // 7. Render Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle ambient sway of the lily
      lilyGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.08;
      lilyGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.02;

      // Animate active falling petals
      for (let i = fallingPetalsRef.current.length - 1; i >= 0; i--) {
        const fp = fallingPetalsRef.current[i];
        fp.progress += 0.02;

        // Aerodynamic S-curve fluttering fall
        fp.mesh.position.y -= 0.052;
        fp.mesh.position.x += Math.sin(fp.progress * 7) * 0.028;
        fp.mesh.position.z += Math.cos(fp.progress * 5) * 0.016;

        fp.mesh.rotation.x += 0.05;
        fp.mesh.rotation.z += 0.035;

        // Petal hits water surface
        if (fp.mesh.position.y <= -1.82) {
          fp.mesh.position.y = -1.82;
          fp.mesh.rotation.x = Math.PI / 2;
          fp.mesh.rotation.z = Math.random() * Math.PI * 2;

          // Trigger water ripple
          if (ripplePlaneRef.current) {
            ripplePlaneRef.current.position.set(fp.mesh.position.x, -1.84, fp.mesh.position.z);
            ripplePlaneRef.current.material.opacity = 0.95;
            ripplePlaneRef.current.scale.set(0.1, 0.1, 0.1);
          }

          // Move from falling to resting collection
          restingPetalsRef.current.push(fp.mesh);
          fallingPetalsRef.current.splice(i, 1);
        }
      }

      // Animate resting petals floating gently on the water
      restingPetalsRef.current.forEach((mesh, idx) => {
        mesh.position.y = -1.82 + Math.sin(elapsed * 1.5 + idx) * 0.014;
      });

      // Animate water ripple fade & expand
      if (ripplePlaneRef.current && ripplePlaneRef.current.material.opacity > 0) {
        ripplePlaneRef.current.scale.x += 0.06;
        ripplePlaneRef.current.scale.y += 0.06;
        ripplePlaneRef.current.material.opacity -= 0.022;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("click", onClick);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Pluck a 3D petal: detaches in 3D, flutters down, ripples in water, and opens memory
  const pluckPetal3D = (mesh) => {
    if (mesh.userData.plucked) return;
    mesh.userData.plucked = true;

    const petalData = mesh.userData.petalData;

    // Convert mesh to scene world coordinates and detach from lilyGroup
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    const worldQuat = new THREE.Quaternion();
    mesh.getWorldQuaternion(worldQuat);

    sceneRef.current.attach(mesh);

    // Add to active falling animation physics
    fallingPetalsRef.current.push({
      mesh,
      petalData,
      progress: 0
    });

    setFallenPetals((prev) => new Set(prev).add(petalData.id));

    // Open memory modal right as the petal descends toward the water
    setTimeout(() => {
      setActiveStory(petalData);
    }, 600);

    // If Petal 8 (The Center Heart) is plucked:
    if (petalData.id === 8) {
      setTimeout(() => {
        setBloomedLiliesEverywhere(true);
        markSpaceCompleted("02-constellation");

        try {
          confetti({
            particleCount: 150,
            spread: 140,
            origin: { y: 0.6 },
            colors: ["#f43f5e", "#fb7185", "#fda4af", "#fef08a", "#ffffff"]
          });
        } catch (e) {}
      }, 750);

      setTimeout(() => {
        setShowGrandFinale(true);
      }, 2600);
    }
  };

  const handleReset = () => {
    // Reset all 3D meshes
    petalMeshesRef.current.forEach((mesh) => {
      mesh.userData.plucked = false;
      mesh.position.copy(mesh.userData.originalPos);
      mesh.rotation.copy(mesh.userData.originalRot);
      mesh.material.emissive.setHex(0x000000);
      sceneRef.current.children[5].attach(mesh); // Reattach to lilyGroup
    });

    fallingPetalsRef.current = [];
    restingPetalsRef.current = [];

    setFallenPetals(new Set());
    setActiveStory(null);
    setHoveredPetal(null);
    setBloomedLiliesEverywhere(false);
    setShowGrandFinale(false);
  };

  const nextStory = () => {
    if (!activeStory) return;
    const curIdx = LILY_PETALS.findIndex((p) => p.id === activeStory.id);
    const nextIdx = (curIdx + 1) % LILY_PETALS.length;
    setActiveStory(LILY_PETALS[nextIdx]);
  };

  const prevStory = () => {
    if (!activeStory) return;
    const curIdx = LILY_PETALS.findIndex((p) => p.id === activeStory.id);
    const prevIdx = curIdx === 0 ? LILY_PETALS.length - 1 : curIdx - 1;
    setActiveStory(LILY_PETALS[prevIdx]);
  };

  const remainingPetalCount = 8 - fallenPetals.size;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#070e17] text-white overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 1. Starry Night Atmospheric Backdrop */}
      <img
        src="/starry-night.jpg"
        alt="Starry Night Backdrop"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none pointer-events-none filter blur-[1px]"
      />

      {/* Atmospheric Dark Velvet Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b13]/85 via-[#08121f]/75 to-[#04080e]/95 pointer-events-none" />

      {/* 2. Floating Top Header Overlay */}
      <div className="relative z-30 pt-6 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4 pointer-events-none max-w-6xl mx-auto w-full">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3">
          <RibbonBow className="w-6 h-5 text-rose-300 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base text-rose-100 font-bold">
                Chapter 2 // The 3D Stargazer Lily of Seven Years
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#fda4af" centerColor="#fecdd3" />
            </div>
            <p className="text-[11px] text-rose-200/80 font-sans mt-0.5">
              {remainingPetalCount > 1
                ? `Click any 3D petal to pluck it into the water (${remainingPetalCount} petals left) ♡`
                : remainingPetalCount === 1
                ? "Only the 8th heart petal remains... Click to drop the core ♡"
                : "All eight petals have shed into the water — a pond of lilies blooms ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Button */}
          {fallenPetals.size > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-rose-200 hover:text-white transition-colors shadow-xl cursor-pointer"
              title="Reset 3D Lily"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Petal Progress Pill */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-xs font-sans text-rose-100 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2">
            <SparkleStar className="w-3.5 h-3.5 text-rose-300" />
            <span>Petals Plucked:</span>
            <span className="font-mono text-rose-300 font-bold">
              {fallenPetals.size} / 8
            </span>
          </div>
        </div>
      </div>

      {/* 3. The 3D Three.js WebGL Lily Viewport */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Ambient Romantic Halo behind Lily */}
        <div className="absolute w-[460px] h-[460px] rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

        {/* Floating Tooltip when hovering over a 3D petal */}
        <div className="h-7 mb-1 z-30 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {hoveredPetal && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="px-4 py-1 rounded-full bg-slate-900/90 border border-rose-300/40 text-xs font-serif text-rose-200 shadow-xl flex items-center gap-2 backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>
                  Pluck {hoveredPetal.name} // {hoveredPetal.yearBadge} ({hoveredPetal.title})
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Three.js Canvas Container */}
        <div
          ref={containerRef}
          className="relative w-[360px] h-[480px] sm:w-[480px] sm:h-[560px] flex items-center justify-center touch-none select-none drop-shadow-[0_20px_50px_rgba(244,63,94,0.45)]"
        />

        {/* Prompt Cue Below the Lily */}
        <div className="mt-2 text-center z-20">
          <p className="text-xs font-serif italic text-rose-200/90 tracking-wide">
            {remainingPetalCount > 1
              ? "Touch any 3D Stargazer petal to pluck it — watch it flutter into the water and reveal its story ♡"
              : remainingPetalCount === 1
              ? "The final heart petal holds our infinity... Click it to let it drop ♡"
              : "All 8 petals rest peacefully on the water. Click any floating petal to re-read its memory ♡"}
          </p>
        </div>
      </div>

      {/* 4. THE GRAND CLIMAX: LILIES BLOOMING ACROSS THE STARRY SKY! */}
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
                {/* 6-pointed Stargazer Water Lily SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <radialGradient id={`lily-grad-${lily.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#881337" />
                      <stop offset="35%" stopColor="#e11d48" />
                      <stop offset="70%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </radialGradient>
                  </defs>
                  {/* 6 radiating lanceolate tepals */}
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
                  {/* Inner golden stamens & pistil */}
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

      {/* 5. Floating Bottom Navigation & Guidance */}
      <div className="relative z-20 pb-4 text-center text-xs text-rose-200/70 font-sans">
        <span>Chapter 2 • Dedicated to Mythri by Ajay // Forever & Always</span>
      </div>

      {/* 6. Story Memory Modal for Plucked Petal */}
      <AnimatePresence>
        {activeStory && !showGrandFinale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              className="max-w-lg w-full bg-[#fffdfa] text-[#132e22] border-2 border-rose-300 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-rose-200/80" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-rose-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FlowerBlossom className="w-4 h-4" petalColor="#fda4af" centerColor="#fecdd3" />
                  <span className="text-xs font-bold text-rose-700 font-sans">
                    {activeStory.name} // {activeStory.yearBadge}
                  </span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Frame */}
              <div className="relative rounded-2xl overflow-hidden mb-4 border border-rose-200 shadow-sm h-52 bg-rose-50">
                <img
                  src={activeStory.photoUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Title & Date */}
              <h4 className="font-serif text-2xl font-bold text-[#132e22] mb-1">
                {activeStory.title}
              </h4>
              <p className="text-xs text-rose-600 font-sans font-medium mb-3">
                {activeStory.date}
              </p>

              {/* Story Content */}
              <div className="text-sm font-serif text-[#3d6350] leading-relaxed whitespace-pre-line mb-6 italic max-h-48 overflow-y-auto pr-1">
                {activeStory.story}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between border-t border-rose-200 pt-3 text-xs font-sans">
                <button
                  onClick={prevStory}
                  className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold text-rose-800">
                  Petal {activeStory.order} of 8 Plucked
                </span>

                <button
                  onClick={nextStory}
                  className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Grand Finale Reveal Modal When All 8 Petals Have Fallen */}
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
