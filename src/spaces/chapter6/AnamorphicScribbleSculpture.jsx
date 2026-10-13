import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  Layers,
  Check
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

// The 7 Transformation Perspectives with High-Contrast Iconic Themes & Chromatic Signatures
export const PERSPECTIVES = [
  {
    id: 1,
    name: "The Ice Rampart",
    faculty: "Melting the Ice Wall",
    angleTheta: 0, // 0 deg
    anglePhi: 0.04,
    tagline: "From 'Ramparts of Ice' Nonchalance to Proud Devotion",
    accentColor: "#38bdf8", // Ice Blue
    colorName: "Glacial Cyan",
    story: `Before I met you, I was an exact mirror of Koyun from Ramparts of Ice. 

My vibe was aloof, guarded, and nonchalant. I acted like I didn't care about anything, and I never spoke to any girl. My independence was a frozen wall built to keep the world away.

You didn't fight that wall; you just showed up with genuine warmth until every layer of ice melted. Today, I am unashamedly a "girl's boy"—attentive to your world, learning your cadence, and proud to be the one who cares for you.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins."
  },
  {
    id: 2,
    name: "The Calmed Lantern",
    faculty: "Taming the Temper",
    angleTheta: (Math.PI * 2) * (1 / 7), // ~51.4 deg
    anglePhi: 0.16,
    tagline: "From Hot-Headed Anger to Composure",
    accentColor: "#f59e0b", // Warm Amber
    colorName: "Amber Flame",
    story: `I used to be a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My first reflex was to snap and fight back.

Being with you taught me that losing my temper never solved a single problem. In seven years, you showed me how to hold my fire, breathe through chaos, and meet hardship with composure instead of hostility.

My fire didn't disappear; you just gave it a steady lantern so it didn't burn everything around me.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it."
  },
  {
    id: 3,
    name: "The Speaking Voice",
    faculty: "Finding My Voice",
    angleTheta: (Math.PI * 2) * (2 / 7), // ~102.8 deg
    anglePhi: -0.12,
    tagline: "From a Silent Mumble to Speaking with Conviction",
    accentColor: "#10b981", // Electric Emerald
    colorName: "Vivid Emerald",
    story: `I had a very silent voice. I kept my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head.

Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. 

You pushed me to speak up, express what I think, and articulate what I need without shrinking down into a corner.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard."
  },
  {
    id: 4,
    name: "The Two in Conversation",
    faculty: "How We Communicate",
    angleTheta: (Math.PI * 2) * (3 / 7), // ~154.3 deg
    anglePhi: 0.18,
    tagline: "From Fiery Arguments to Patient Talk",
    accentColor: "#f43f5e", // Rose Quartz
    colorName: "Rose Quartz",
    story: `Early on, when we disagreed, we had fiery, stubborn arguments where neither of us wanted to back down. We fought to win.

Over seven years, that dynamic completely transformed. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication.

We stopped fighting each other, and started fighting the problem together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding."
  },
  {
    id: 5,
    name: "The Clear Eye of Truth",
    faculty: "The Grounded Lens",
    angleTheta: (Math.PI * 2) * (4 / 7), // ~205.7 deg
    anglePhi: -0.15,
    tagline: "Seeing Things as They Actually Are",
    accentColor: "#eab308", // Golden Citrine
    colorName: "Golden Prism",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst, and reacting out of panic.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that strips away the fog and helps me see things objectively as they truly are.

You cut through all the static in my head and bring me back to solid ground.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing."
  },
  {
    id: 6,
    name: "The Unshakable Anchor",
    faculty: "The Unfailing Support",
    angleTheta: (Math.PI * 2) * (5 / 7), // ~257.1 deg
    anglePhi: 0.12,
    tagline: "No Longer Alone in the Arena",
    accentColor: "#059669", // Deep Jade
    colorName: "Deep Jade",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down.

You became my steadfast support system. Through every exhaustion, career pivot, and stressful season, knowing you are standing in my corner changed how I face the world.

I stopped fighting life as a lone wolf, because I finally found my partner.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again."
  },
  {
    id: 7,
    name: "The Man Standing Tall",
    faculty: "Becoming a Man",
    angleTheta: (Math.PI * 2) * (6 / 7), // ~308.6 deg
    anglePhi: -0.08,
    tagline: "The Man I Am Today",
    accentColor: "#86efac", // Starlight Pearl
    colorName: "Starlight Pearl",
    story: `If the boy from October 2019 saw me today, he wouldn't recognize me. 

Back then, I was an angry, prickly kid hiding behind nonchalance. Seven years of loving you, being held accountable by you, and sharing life with you shaped me into who I am.

In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you."
  }
];

// Helper: Generates high-detail recognizable 2D silhouette contours
function getRecognizableSilhouettePoints(id) {
  const pts = [];
  const add = (x, y) => pts.push(new THREE.Vector2(x, y));

  switch (id) {
    case 1: {
      // 1. The Ice Rampart / Wall cracking open
      // Jagged battlements of ice fortress
      add(-1.1, -1.2);
      add(-1.1, 0.2);
      add(-0.9, 0.2);
      add(-0.9, 0.7);
      add(-0.7, 0.7);
      add(-0.7, 1.2);
      add(-0.4, 0.8);
      add(-0.1, 1.2);
      add(0.2, 0.8);
      add(0.5, 1.2);
      add(0.7, 0.7);
      add(0.9, 0.7);
      add(0.9, 0.2);
      add(1.1, 0.2);
      add(1.1, -1.2);
      // Large fracture line down the center
      add(0.8, -1.2);
      add(0.3, -0.4);
      add(-0.1, 0.1);
      add(0.2, 0.6);
      add(-0.2, 0.3);
      add(-0.3, -0.5);
      add(-0.8, -1.2);
      break;
    }
    case 2: {
      // 2. The Calmed Lantern & Gentle Flame
      // Lantern hanging loop & top cap
      add(0, 1.3);
      add(-0.2, 1.15);
      add(0.2, 1.15);
      add(0, 1.3);
      add(0, 1.05);
      // Roof canopy
      add(-0.8, 0.75);
      add(0.8, 0.75);
      add(0, 1.05);
      // Glass frame
      add(0.7, 0.75);
      add(0.55, -0.75);
      add(-0.55, -0.75);
      add(-0.7, 0.75);
      // Base pedestal
      add(-0.75, -0.9);
      add(0.75, -0.9);
      add(0.55, -0.75);
      // Inner teardrop flame
      add(0, -0.5);
      add(-0.25, -0.1);
      add(-0.15, 0.25);
      add(0, 0.48);
      add(0.15, 0.25);
      add(0.25, -0.1);
      add(0, -0.5);
      break;
    }
    case 3: {
      // 3. The Speaking Voice (Profile face with radiating acoustic speech waves)
      // Human head profile
      add(-0.6, 1.1);
      add(-0.8, 0.8);
      add(-0.9, 0.4);
      add(-0.8, 0.0);
      add(-0.6, -0.3);
      add(-0.7, -0.8); // back of neck
      add(-0.3, -0.8); // neck
      add(-0.3, -0.5); // jaw
      add(-0.1, -0.4); // chin
      add(-0.15, -0.2); // lower lip
      add(0.0, -0.15); // mouth open speaking
      add(-0.1, -0.1); // upper lip
      add(-0.05, 0.15); // nose tip
      add(-0.25, 0.3); // eye hollow
      add(-0.2, 0.6); // forehead
      add(-0.4, 0.95);
      add(-0.6, 1.1);
      // Radiating acoustic sound waves moving right
      // Wave 1
      add(0.3, 0.3);
      add(0.45, 0.0);
      add(0.3, -0.3);
      // Wave 2
      add(0.65, 0.55);
      add(0.85, 0.0);
      add(0.65, -0.55);
      // Wave 3
      add(1.0, 0.85);
      add(1.25, 0.0);
      add(1.0, -0.85);
      break;
    }
    case 4: {
      // 4. The Two in Conversation (Two faces facing each other across a table)
      // Left person profile
      add(-1.0, -0.9);
      add(-1.0, -0.3);
      add(-0.7, -0.1);
      add(-0.6, 0.3);
      add(-0.8, 0.8);
      add(-0.5, 0.9);
      add(-0.35, 0.5);
      add(-0.3, 0.2);
      add(-0.4, 0.0);
      add(-0.35, -0.2);
      add(-0.5, -0.4);
      add(-0.5, -0.9);
      // Table between them
      add(-0.7, -0.9);
      add(0.7, -0.9);
      // Right person profile
      add(0.5, -0.9);
      add(0.5, -0.4);
      add(0.35, -0.2);
      add(0.4, 0.0);
      add(0.3, 0.2);
      add(0.35, 0.5);
      add(0.5, 0.9);
      add(0.8, 0.8);
      add(0.6, 0.3);
      add(0.7, -0.1);
      add(1.0, -0.3);
      add(1.0, -0.9);
      // Speech bridge connecting overhead
      add(0.4, 0.5);
      add(0.0, 0.8);
      add(-0.4, 0.5);
      break;
    }
    case 5: {
      // 5. The Clear Eye of Truth (Detailed eye with pupil and radiating focus rays)
      // Upper eyelid
      add(-1.2, 0.0);
      add(-0.8, 0.55);
      add(0.0, 0.75);
      add(0.8, 0.55);
      add(1.2, 0.0);
      // Lower eyelid
      add(0.8, -0.55);
      add(0.0, -0.75);
      add(-0.8, -0.55);
      add(-1.2, 0.0);
      // Iris circle
      for (let i = 0; i <= 20; i++) {
        const th = (i / 20) * Math.PI * 2;
        add(Math.cos(th) * 0.45, Math.sin(th) * 0.45);
      }
      // Inner Pupil
      for (let i = 0; i <= 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        add(Math.cos(th) * 0.2, Math.sin(th) * 0.2);
      }
      // Vertical ray of absolute clarity through center
      add(0, 1.2);
      add(0, -1.2);
      break;
    }
    case 6: {
      // 6. The Unshakable Anchor (Classic maritime anchor with flukes and stock)
      // Top ring
      for (let i = 0; i <= 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        add(Math.cos(th) * 0.22, 1.0 + Math.sin(th) * 0.22);
      }
      // Cross bar (stock)
      add(-0.7, 0.65);
      add(0.7, 0.65);
      // Vertical shank
      add(0, 0.78);
      add(0, -0.85);
      // Lower sweeping curved arms (flukes)
      add(-1.0, -0.2);
      add(-0.8, -0.8);
      add(0.0, -1.15);
      add(0.8, -0.8);
      add(1.0, -0.2);
      // Fluke barbed points
      add(0.85, -0.3);
      add(0.8, -0.8);
      add(0.0, -1.15);
      add(-0.8, -0.8);
      add(-0.85, -0.3);
      break;
    }
    case 7: {
      // 7. The Man Standing Tall (Standing tall, head high, shoulders back, holding blooming flower)
      // Head
      for (let i = 0; i <= 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        add(Math.cos(th) * 0.22, 0.95 + Math.sin(th) * 0.22);
      }
      // Neck & Strong broad shoulders
      add(-0.1, 0.72);
      add(-0.65, 0.55); // Left shoulder
      add(-0.45, -0.1); // Left torso
      add(-0.4, -0.4);  // Left hip
      add(-0.35, -1.2); // Left leg
      // Stance
      add(-0.1, -1.2);
      add(0.0, -0.4);   // Crotch
      add(0.1, -1.2);
      add(0.35, -1.2);  // Right leg
      add(0.4, -0.4);   // Right hip
      add(0.45, -0.1);  // Right torso
      add(0.65, 0.55);  // Right shoulder
      add(0.1, 0.72);
      // Blooming heart flower at chest
      add(0.0, 0.35);
      add(-0.18, 0.48);
      add(-0.25, 0.3);
      add(0.0, 0.05);
      add(0.25, 0.3);
      add(0.18, 0.48);
      add(0.0, 0.35);
      break;
    }
    default:
      break;
  }

  return pts;
}

export default function AnamorphicScribbleSculpture({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const wireMeshesRef = useRef([]);
  const backgroundLoopsRef = useRef([]);

  // Camera Orbit state
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const cameraPolarRef = useRef({
    theta: 0,
    phi: 0.04,
    radius: 4.6
  });
  const targetPolarRef = useRef(null);

  // UI state
  const [activePerspective, setActivePerspective] = useState(PERSPECTIVES[0]);
  const [lockedPerspectiveId, setLockedPerspectiveId] = useState(1);
  const [alignmentScore, setAlignmentScore] = useState(100);
  const [discoveredIds, setDiscoveredIds] = useState(new Set([1]));
  const [audioMuted, setAudioMuted] = useState(false);
  const [showFullStoryModal, setShowFullStoryModal] = useState(false);

  // Audio Chime Trigger
  const triggerAudioTone = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfef08a, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x86efac, 2.2);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const softFillLight = new THREE.PointLight(0xa7f3d0, 1.8, 9);
    softFillLight.position.set(0, 0, 0);
    scene.add(softFillLight);

    // 3. Reflective Jade Pedestal
    const baseGeom = new THREE.CylinderGeometry(1.65, 1.75, 0.08, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.1,
      metalness: 0.88
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -1.62;
    scene.add(baseMesh);

    // Luminous Jade Rim
    const ringGeom = new THREE.RingGeometry(1.25, 1.4, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.57;
    scene.add(ringMesh);

    // 4. Build the 7 Chromatic Wire Strands
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    const wireMeshes = [];
    wireMeshesRef.current = wireMeshes;

    PERSPECTIVES.forEach((p) => {
      const theta = p.angleTheta;
      const phi = p.anglePhi;
      const R = 4.6;

      // Camera view position
      const viewPos = new THREE.Vector3(
        R * Math.cos(phi) * Math.sin(theta),
        R * Math.sin(phi),
        R * Math.cos(phi) * Math.cos(theta)
      );

      // Camera local basis
      const forward = viewPos.clone().negate().normalize();
      const upGlobal = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(forward, upGlobal).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      // Get recognizable 2D points
      const points2D = getRecognizableSilhouettePoints(p.id);

      // Project into 3D with distributed parallax depth d
      const curvePoints3D = [];
      points2D.forEach((pt, i) => {
        // Controlled sinusoidal depth variation along line of sight
        const d = Math.sin((i / points2D.length) * Math.PI * 4) * 0.78;
        const pos3D = new THREE.Vector3()
          .addScaledVector(right, pt.x)
          .addScaledVector(up, pt.y)
          .addScaledVector(forward, d);
        curvePoints3D.push(pos3D);
      });

      const spline = new THREE.CatmullRomCurve3(curvePoints3D, false, "centripetal", 0.35);
      const tubeGeom = new THREE.TubeGeometry(spline, 72, 0.024, 8, false);

      // Dedicated chromatic material with transparency & emissive glow
      const wireMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.accentColor),
        roughness: 0.22,
        metalness: 0.85,
        transparent: true,
        opacity: p.id === 1 ? 1.0 : 0.16, // Initial state: Perspective 1 is focused
        emissive: new THREE.Color(p.accentColor),
        emissiveIntensity: p.id === 1 ? 0.9 : 0.05
      });

      const mesh = new THREE.Mesh(tubeGeom, wireMat);
      mesh.userData = { perspectiveId: p.id, baseColor: p.accentColor };

      sculptureGroup.add(mesh);
      wireMeshes.push(mesh);
    });

    // 5. Connective Background Scribble Loops (knits the strands together into a unified tangled sculpture)
    const backgroundLoops = [];
    backgroundLoopsRef.current = backgroundLoops;

    for (let k = 0; k < 3; k++) {
      const loopPoints = [];
      const loopCount = 24;
      for (let i = 0; i < loopCount; i++) {
        const t = (i / loopCount) * Math.PI * 4 + k * 1.5;
        loopPoints.push(
          new THREE.Vector3(
            Math.sin(t) * (1.0 + Math.cos(t * 1.3) * 0.35),
            Math.cos(t * 0.7) * (0.95 + Math.sin(t * 1.1) * 0.25),
            Math.cos(t) * (1.0 + Math.sin(t * 1.5) * 0.35)
          )
        );
      }
      const loopSpline = new THREE.CatmullRomCurve3(loopPoints, true);
      const loopGeom = new THREE.TubeGeometry(loopSpline, 64, 0.014, 6, true);
      const loopMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.4,
        metalness: 0.6,
        transparent: true,
        opacity: 0.1
      });
      const loopMesh = new THREE.Mesh(loopGeom, loopMat);
      sculptureGroup.add(loopMesh);
      backgroundLoops.push(loopMesh);
    }

    // 6. Floating Stardust Embers
    const dustCount = 80;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 3.4;
      dustPositions[i + 1] = (Math.random() - 0.5) * 2.8;
      dustPositions[i + 2] = (Math.random() - 0.5) * 3.4;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    scene.add(dustParticles);

    // 7. Render & Animation Loop with Adaptive Focal Attenuation (Sightline Blur / Selective Dimming)
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera lerp interpolation towards target viewpoint
      if (targetPolarRef.current) {
        const target = targetPolarRef.current;
        const current = cameraPolarRef.current;

        current.theta += (target.theta - current.theta) * 0.085;
        current.phi += (target.phi - current.phi) * 0.085;
        current.radius += (target.radius - current.radius) * 0.085;

        if (
          Math.abs(target.theta - current.theta) < 0.004 &&
          Math.abs(target.phi - current.phi) < 0.004
        ) {
          current.theta = target.theta;
          current.phi = target.phi;
          targetPolarRef.current = null;
        }
      }

      // Update camera position
      const { theta, phi, radius } = cameraPolarRef.current;
      camera.position.set(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);

      dustParticles.rotation.y = elapsed * 0.035;

      // Real-Time Optical Alignment Calculation
      let bestScore = 0;
      let closestPerspective = PERSPECTIVES[0];
      const currentDir = camera.position.clone().normalize();

      PERSPECTIVES.forEach((p) => {
        const pDir = new THREE.Vector3(
          Math.cos(p.anglePhi) * Math.sin(p.angleTheta),
          Math.sin(p.anglePhi),
          Math.cos(p.anglePhi) * Math.cos(p.angleTheta)
        ).normalize();

        const dot = Math.max(-1, Math.min(1, currentDir.dot(pDir)));
        const angleDist = Math.acos(dot);
        const score = Math.max(0, Math.min(100, Math.round((1 - angleDist / 0.52) * 100)));

        if (score > bestScore) {
          bestScore = score;
          closestPerspective = p;
        }
      });

      setAlignmentScore(bestScore);

      // ADAPTIVE SIGHTLINE ATTENUATION:
      // When nearing an angle (score >= 75%), the active strand locks to full opacity & vivid glow,
      // while all other strands smoothly fade down to a soft translucent blur!
      // In free orbit (score < 75%), all 7 strands maintain equal ambient jewel opacity (~0.35).
      const isLocked = bestScore >= 75;

      wireMeshes.forEach((mesh) => {
        const id = mesh.userData.perspectiveId;
        const mat = mesh.material;

        if (isLocked) {
          if (id === closestPerspective.id) {
            // Target locked figure: Surge to 100% opacity, radiant glow
            mat.opacity += (1.0 - mat.opacity) * 0.12;
            mat.emissiveIntensity += (0.95 - mat.emissiveIntensity) * 0.12;
          } else {
            // Other 6 figures: Attenuate / Blur into soft background starlight
            mat.opacity += (0.13 - mat.opacity) * 0.1;
            mat.emissiveIntensity += (0.04 - mat.emissiveIntensity) * 0.1;
          }
        } else {
          // Free 3D orbit: Balanced chromatic sculpture
          mat.opacity += (0.38 - mat.opacity) * 0.08;
          mat.emissiveIntensity += (0.25 - mat.emissiveIntensity) * 0.08;
        }
      });

      // Background connecting loops stay very subtle
      backgroundLoops.forEach((mesh) => {
        mesh.material.opacity += (isLocked ? 0.06 : 0.12 - mesh.material.opacity) * 0.08;
      });

      // Lock perspective update
      if (isLocked) {
        if (lockedPerspectiveId !== closestPerspective.id) {
          setLockedPerspectiveId(closestPerspective.id);
          setActivePerspective(closestPerspective);
          setDiscoveredIds((prev) => new Set(prev).add(closestPerspective.id));
          triggerAudioTone(440 + closestPerspective.id * 50);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Pointer Drag Orbit Events
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      targetPolarRef.current = null;
      prevPointerRef.current = {
        x: e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0),
        y: e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)
      };
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;

      prevPointerRef.current = { x: clientX, y: clientY };

      cameraPolarRef.current.theta -= deltaX * 0.0075;
      cameraPolarRef.current.phi = Math.max(
        -Math.PI / 3.2,
        Math.min(Math.PI / 3.2, cameraPolarRef.current.phi + deltaY * 0.0075)
      );
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [lockedPerspectiveId, triggerAudioTone]);

  // Smoothly fly camera to chosen perspective
  const snapToPerspective = (perspective) => {
    setActivePerspective(perspective);
    setLockedPerspectiveId(perspective.id);
    setDiscoveredIds((prev) => new Set(prev).add(perspective.id));

    targetPolarRef.current = {
      theta: perspective.angleTheta,
      phi: perspective.anglePhi,
      radius: 4.6
    };

    triggerAudioTone(440 + perspective.id * 50);
  };

  // Complete Space 06 when all 7 are unlocked
  useEffect(() => {
    if (discoveredIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [discoveredIds, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // 3D Multi-Perspective Wire Sculpture
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              7 distinct chromatic silhouettes hidden in one tangled wire. Orbit in 3D to align and isolate each perspective.
            </p>
          </div>
        </div>

        {/* HUD Alignment & Discovery Meters */}
        <div className="flex items-center gap-2">
          {/* Dynamic Convergence Meter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono">
            <span className="text-[#3d6350]">Sightline:</span>
            <span
              className={`font-bold transition-colors ${
                alignmentScore >= 75 ? "text-emerald-700 font-extrabold" : "text-amber-700"
              }`}
            >
              {alignmentScore}% {alignmentScore >= 75 ? "✦ Focused & Isolated" : "• Free Orbit"}
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-serif font-bold shadow-2xs">
            Discovered: {discoveredIds.size} / 7
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

      {/* 2. Main 3D Canvas Viewport */}
      <div className="relative flex-1 w-full h-full touch-none select-none flex items-center justify-center">
        {/* Soft Radial Ambient Halo */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

        {/* Three.js Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Central Alignment Reticle HUD */}
        <div className="absolute pointer-events-none flex flex-col items-center">
          <div
            style={{
              borderColor: alignmentScore >= 75 ? activePerspective.accentColor : "rgba(167, 243, 208, 0.4)",
              boxShadow: alignmentScore >= 75 ? `0 0 24px ${activePerspective.accentColor}66` : "none"
            }}
            className={`w-16 h-16 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              alignmentScore >= 75 ? "scale-110 ring-2 ring-emerald-200 bg-white/40" : "opacity-35"
            }`}
          >
            <Sparkles
              style={{ color: alignmentScore >= 75 ? activePerspective.accentColor : undefined }}
              className="w-5 h-5 text-emerald-400"
            />
          </div>

          {alignmentScore >= 75 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderColor: activePerspective.accentColor }}
              className="mt-2 text-[10px] font-mono font-bold tracking-widest text-emerald-950 uppercase bg-white/95 px-3 py-0.5 rounded-full border shadow-sm flex items-center gap-1.5"
            >
              <span
                style={{ backgroundColor: activePerspective.accentColor }}
                className="w-2 h-2 rounded-full inline-block"
              />
              <span>Silhouette 0{activePerspective.id}: {activePerspective.name}</span>
            </motion.div>
          )}
        </div>

        {/* Floating Story Card at Bottom when Locked */}
        <AnimatePresence>
          {activePerspective && (
            <motion.div
              key={activePerspective.id}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-20 pointer-events-auto"
            >
              <div className="bg-[#fffdfa]/95 backdrop-blur-md border-2 border-emerald-300 rounded-[28px] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-[#132e22]">
                {/* Washi Tape */}
                <div className="absolute -top-1.5 right-10 pointer-events-none">
                  <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
                </div>

                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: activePerspective.accentColor }}
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Perspective 0{activePerspective.id} // {activePerspective.faculty}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFullStoryModal(true)}
                    className="text-xs font-serif italic text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Read Full Reflection
                  </button>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-1">
                  {activePerspective.name}
                </h4>
                <p className="text-xs font-mono uppercase text-emerald-700 font-bold mb-2">
                  {activePerspective.tagline}
                </p>

                <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed line-clamp-2 mb-3">
                  {activePerspective.story}
                </p>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium">
                    "{activePerspective.quote}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Perspective Navigation Bar with Chromatic Color Dots */}
      <div className="z-20 w-full px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-serif font-bold text-[#132e22] shrink-0 hidden sm:inline">
          Perspectives:
        </span>

        {/* 7 Color-Coded Perspective Anchors */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {PERSPECTIVES.map((p) => {
            const isDiscovered = discoveredIds.has(p.id);
            const isSelected = activePerspective?.id === p.id;

            return (
              <button
                key={p.id}
                onClick={() => snapToPerspective(p)}
                style={{
                  borderColor: isSelected ? p.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${p.accentColor}55` : undefined
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs scale-105 ring-2 ring-emerald-300"
                    : isDiscovered
                    ? "bg-[#f0fdf4] text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                title={`Snap to Perspective 0${p.id}: ${p.name}`}
              >
                <span
                  style={{ backgroundColor: p.accentColor }}
                  className="w-2 h-2 rounded-full inline-block shrink-0 shadow-2xs"
                />
                <span>0{p.id}</span>
                <span className="hidden md:inline">{p.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            snapToPerspective(PERSPECTIVES[0]);
          }}
          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Reset to Perspective 01"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Full Story Reading Modal */}
      <AnimatePresence>
        {showFullStoryModal && activePerspective && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowFullStoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 25 }}
              className="max-w-lg w-full bg-[#fffdfa] text-[#132e22] border-2 border-emerald-300 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: activePerspective.accentColor }}
                    className="w-3 h-3 rounded-full inline-block shadow-xs"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    Perspective 0{activePerspective.id} // {activePerspective.faculty}
                  </span>
                </div>
                <button
                  onClick={() => setShowFullStoryModal(false)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-1">
                {activePerspective.name}
              </h3>
              <p className="text-xs font-mono uppercase text-emerald-700 font-bold mb-4">
                {activePerspective.tagline}
              </p>

              <div className="text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-6">
                {activePerspective.story}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "{activePerspective.quote}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
