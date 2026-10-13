import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Layers,
  BookOpen
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

export const EXHIBITS = [
  {
    id: 1,
    title: "The Ice Rampart",
    subtitle: "Melting the Ice Wall",
    plinthLabel: "Plinth I // 2019",
    medium: "Single-Stroke 3D Scribble Wire • 380+ Loops",
    accentColor: "#38bdf8",
    colorName: "Glacial Cyan",
    tagline: "From 'Ramparts of Ice' Nonchalance to Proud Devotion",
    story: `Before I met you, I was an exact mirror of Koyun from Ramparts of Ice. 

My vibe was aloof, guarded, and nonchalant. I acted like I didn't care about anything, and I never spoke to any girl. My independence was a frozen wall built to keep the world away.

You didn't fight that wall; you just showed up with genuine warmth until every layer of ice melted. Today, I am unashamedly a "girl's boy"—attentive to your world, learning your cadence, and proud to be the one who cares for you.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins."
  },
  {
    id: 2,
    title: "The Calmed Lantern",
    subtitle: "Taming the Temper",
    plinthLabel: "Plinth II // 2020",
    medium: "Single-Stroke 3D Scribble Wire • 410+ Loops",
    accentColor: "#f59e0b",
    colorName: "Amber Flame",
    tagline: "From Hot-Headed Anger to Composure",
    story: `I used to be a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My first reflex was to snap and fight back.

Being with you taught me that losing my temper never solved a single problem. In seven years, you showed me how to hold my fire, breathe through chaos, and meet hardship with composure instead of hostility.

My fire didn't disappear; you just gave it a steady lantern so it didn't burn everything around me.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it."
  },
  {
    id: 3,
    title: "The Speaking Voice",
    subtitle: "Finding My Voice",
    plinthLabel: "Plinth III // 2021",
    medium: "Single-Stroke 3D Scribble Wire • 390+ Loops",
    accentColor: "#10b981",
    colorName: "Vivid Emerald",
    tagline: "From a Silent Mumble to Speaking with Conviction",
    story: `I had a very silent voice. I kept my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head.

Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. 

You pushed me to speak up, express what I think, and articulate what I need without shrinking down into a corner.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard."
  },
  {
    id: 4,
    title: "The Two in Conversation",
    subtitle: "How We Communicate",
    plinthLabel: "Plinth IV // 2022",
    medium: "Single-Stroke 3D Scribble Wire • 440+ Loops",
    accentColor: "#f43f5e",
    colorName: "Rose Quartz",
    tagline: "From Fiery Arguments to Patient Talk",
    story: `Early on, when we disagreed, we had fiery, stubborn arguments where neither of us wanted to back down. We fought to win.

Over seven years, that dynamic completely transformed. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication.

We stopped fighting each other, and started fighting the problem together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding."
  },
  {
    id: 5,
    title: "The Clear Eye of Truth",
    subtitle: "The Grounded Lens",
    plinthLabel: "Plinth V // 2023",
    medium: "Single-Stroke 3D Scribble Wire • 420+ Loops",
    accentColor: "#eab308",
    colorName: "Golden Prism",
    tagline: "Seeing Things as They Actually Are",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst, and reacting out of panic.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that strips away the fog and helps me see things objectively as they truly are.

You cut through all the static in my head and bring me back to solid ground.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing."
  },
  {
    id: 6,
    title: "The Unshakable Anchor",
    subtitle: "The Unfailing Support",
    plinthLabel: "Plinth VI // 2024",
    medium: "Single-Stroke 3D Scribble Wire • 400+ Loops",
    accentColor: "#059669",
    colorName: "Deep Jade",
    tagline: "No Longer Alone in the Arena",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down.

You became my steadfast support system. Through every exhaustion, career pivot, and stressful season, knowing you are standing in my corner changed how I face the world.

I stopped fighting life as a lone wolf, because I finally found my partner.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again."
  },
  {
    id: 7,
    title: "The Man Standing Tall",
    subtitle: "Becoming a Man",
    plinthLabel: "Plinth VII // Today",
    medium: "Single-Stroke 3D Scribble Wire • 460+ Loops",
    accentColor: "#86efac",
    colorName: "Starlight Pearl",
    tagline: "The Man I Am Today",
    story: `If the boy from October 2019 saw me today, he wouldn't recognize me. 

Back then, I was an angry, prickly kid hiding behind nonchalance. Seven years of loving you, being held accountable by you, and sharing life with you shaped me into who I am.

In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you."
  }
];

// Helper: Generates a genuine, full-on 3D SINGLE-STROKE continuous tangled scribble
function createSingleStrokeScribbleSpline(id) {
  const points = [];
  let globalT = 0;

  // Retrieve base anchor silhouette
  let anchors = [];
  switch (id) {
    case 1: {
      // 1. The Ice Ramparts
      anchors = [
        new THREE.Vector2(-0.85, -0.9),
        new THREE.Vector2(-0.85, 0.2),
        new THREE.Vector2(-0.65, 0.2),
        new THREE.Vector2(-0.65, 0.65),
        new THREE.Vector2(-0.4, 0.65),
        new THREE.Vector2(-0.4, 1.05),
        new THREE.Vector2(-0.1, 0.75),
        new THREE.Vector2(0.0, 1.15),
        new THREE.Vector2(0.1, 0.75),
        new THREE.Vector2(0.4, 1.05),
        new THREE.Vector2(0.4, 0.65),
        new THREE.Vector2(0.65, 0.65),
        new THREE.Vector2(0.65, 0.2),
        new THREE.Vector2(0.85, 0.2),
        new THREE.Vector2(0.85, -0.9),
        new THREE.Vector2(0.5, -0.9),
        new THREE.Vector2(0.2, -0.3),
        new THREE.Vector2(-0.1, 0.1),
        new THREE.Vector2(0.1, 0.5),
        new THREE.Vector2(-0.2, 0.2),
        new THREE.Vector2(-0.3, -0.4),
        new THREE.Vector2(-0.6, -0.9),
        new THREE.Vector2(-0.85, -0.9)
      ];
      break;
    }
    case 2: {
      // 2. The Calmed Lantern & Teardrop Flame
      anchors = [
        new THREE.Vector2(0, -0.85),
        new THREE.Vector2(-0.65, -0.85),
        new THREE.Vector2(-0.55, 0.55),
        new THREE.Vector2(-0.75, 0.75),
        new THREE.Vector2(0, 1.05),
        new THREE.Vector2(0, 1.25),
        new THREE.Vector2(0.15, 1.15),
        new THREE.Vector2(0, 1.05),
        new THREE.Vector2(0.75, 0.75),
        new THREE.Vector2(0.55, 0.55),
        new THREE.Vector2(0.65, -0.85),
        new THREE.Vector2(0, -0.85),
        // Inner flame path
        new THREE.Vector2(0, -0.5),
        new THREE.Vector2(-0.22, -0.15),
        new THREE.Vector2(-0.12, 0.22),
        new THREE.Vector2(0, 0.45),
        new THREE.Vector2(0.12, 0.22),
        new THREE.Vector2(0.22, -0.15),
        new THREE.Vector2(0, -0.5),
        new THREE.Vector2(-0.65, -0.85)
      ];
      break;
    }
    case 3: {
      // 3. The Speaking Voice Profile with Acoustic Soundwave Arcs
      anchors = [
        new THREE.Vector2(-0.5, 0.95),
        new THREE.Vector2(-0.7, 0.7),
        new THREE.Vector2(-0.75, 0.3),
        new THREE.Vector2(-0.65, 0.0),
        new THREE.Vector2(-0.45, -0.2),
        new THREE.Vector2(-0.55, -0.7),
        new THREE.Vector2(-0.2, -0.7),
        new THREE.Vector2(-0.2, -0.4),
        new THREE.Vector2(-0.05, -0.3),
        new THREE.Vector2(-0.1, -0.15),
        new THREE.Vector2(0.05, -0.1),
        new THREE.Vector2(-0.05, -0.05),
        new THREE.Vector2(0.0, 0.15),
        new THREE.Vector2(-0.15, 0.3),
        new THREE.Vector2(-0.1, 0.55),
        new THREE.Vector2(-0.35, 0.8),
        new THREE.Vector2(-0.5, 0.95),
        // Radiating Soundwaves
        new THREE.Vector2(0.25, 0.25),
        new THREE.Vector2(0.4, 0.0),
        new THREE.Vector2(0.25, -0.25),
        new THREE.Vector2(0.55, 0.5),
        new THREE.Vector2(0.75, 0.0),
        new THREE.Vector2(0.55, -0.5),
        new THREE.Vector2(0.85, 0.75),
        new THREE.Vector2(1.1, 0.0),
        new THREE.Vector2(0.85, -0.75),
        new THREE.Vector2(-0.5, -0.7)
      ];
      break;
    }
    case 4: {
      // 4. The Two in Conversation Across Table
      anchors = [
        new THREE.Vector2(-0.8, -0.85),
        new THREE.Vector2(-0.8, -0.25),
        new THREE.Vector2(-0.5, 0.0),
        new THREE.Vector2(-0.4, 0.35),
        new THREE.Vector2(-0.55, 0.75),
        new THREE.Vector2(-0.3, 0.8),
        new THREE.Vector2(-0.2, 0.45),
        new THREE.Vector2(-0.15, 0.15),
        new THREE.Vector2(-0.3, -0.1),
        new THREE.Vector2(-0.35, -0.35),
        new THREE.Vector2(-0.4, -0.85),
        new THREE.Vector2(0.4, -0.85), // table bridge
        new THREE.Vector2(0.35, -0.35),
        new THREE.Vector2(0.3, -0.1),
        new THREE.Vector2(0.15, 0.15),
        new THREE.Vector2(0.2, 0.45),
        new THREE.Vector2(0.3, 0.8),
        new THREE.Vector2(0.55, 0.75),
        new THREE.Vector2(0.4, 0.35),
        new THREE.Vector2(0.5, 0.0),
        new THREE.Vector2(0.8, -0.25),
        new THREE.Vector2(0.8, -0.85),
        // Overhead speech ribbon loop connecting both
        new THREE.Vector2(0.3, 0.5),
        new THREE.Vector2(0.0, 0.75),
        new THREE.Vector2(-0.3, 0.5),
        new THREE.Vector2(-0.8, -0.85)
      ];
      break;
    }
    case 5: {
      // 5. The Clear Eye of Truth & Center Focus Ray
      anchors = [
        new THREE.Vector2(-0.95, 0.0),
        new THREE.Vector2(-0.6, 0.5),
        new THREE.Vector2(0.0, 0.7),
        new THREE.Vector2(0.6, 0.5),
        new THREE.Vector2(0.95, 0.0),
        new THREE.Vector2(0.6, -0.5),
        new THREE.Vector2(0.0, -0.7),
        new THREE.Vector2(-0.6, -0.5),
        new THREE.Vector2(-0.95, 0.0),
        // Iris & Pupil loops
        new THREE.Vector2(0.0, 0.45),
        new THREE.Vector2(-0.35, 0.0),
        new THREE.Vector2(0.0, -0.45),
        new THREE.Vector2(0.35, 0.0),
        new THREE.Vector2(0.0, 0.22),
        new THREE.Vector2(-0.18, 0.0),
        new THREE.Vector2(0.0, -0.22),
        new THREE.Vector2(0.18, 0.0),
        // Vertical focus plumb line
        new THREE.Vector2(0.0, 1.05),
        new THREE.Vector2(0.0, -1.05),
        new THREE.Vector2(-0.95, 0.0)
      ];
      break;
    }
    case 6: {
      // 6. The Unshakable Anchor
      anchors = [
        new THREE.Vector2(0, 0.8),
        new THREE.Vector2(-0.2, 0.95),
        new THREE.Vector2(0, 1.1),
        new THREE.Vector2(0.2, 0.95),
        new THREE.Vector2(0, 0.8),
        // Cross stock
        new THREE.Vector2(-0.65, 0.6),
        new THREE.Vector2(0.65, 0.6),
        new THREE.Vector2(0, 0.6),
        new THREE.Vector2(0, -0.75),
        // Flukes
        new THREE.Vector2(0.7, -0.65),
        new THREE.Vector2(0.8, -0.3),
        new THREE.Vector2(0.65, -0.75),
        new THREE.Vector2(0, -1.05),
        new THREE.Vector2(-0.65, -0.75),
        new THREE.Vector2(-0.8, -0.3),
        new THREE.Vector2(-0.7, -0.65),
        new THREE.Vector2(0, -0.75),
        new THREE.Vector2(0, 0.8)
      ];
      break;
    }
    case 7: {
      // 7. The Man Standing Tall with Blooming Heart
      anchors = [
        new THREE.Vector2(0, 0.75),
        new THREE.Vector2(-0.18, 0.92),
        new THREE.Vector2(0, 1.1),
        new THREE.Vector2(0.18, 0.92),
        new THREE.Vector2(0, 0.75),
        // Shoulders and body
        new THREE.Vector2(-0.55, 0.55),
        new THREE.Vector2(-0.38, 0.0),
        new THREE.Vector2(-0.35, -0.95),
        new THREE.Vector2(-0.1, -0.95),
        new THREE.Vector2(0.0, -0.3),
        new THREE.Vector2(0.1, -0.95),
        new THREE.Vector2(0.35, -0.95),
        new THREE.Vector2(0.38, 0.0),
        new THREE.Vector2(0.55, 0.55),
        new THREE.Vector2(0, 0.6),
        // Blooming Heart at Chest
        new THREE.Vector2(0, 0.4),
        new THREE.Vector2(-0.18, 0.48),
        new THREE.Vector2(-0.25, 0.28),
        new THREE.Vector2(0, 0.05),
        new THREE.Vector2(0.25, 0.28),
        new THREE.Vector2(0.18, 0.48),
        new THREE.Vector2(0, 0.4),
        new THREE.Vector2(-0.55, 0.55)
      ];
      break;
    }
    default:
      break;
  }

  // Generate continuous single stroke with frantic 3D scribble micro-loops and depth jitter
  const totalPasses = 2;
  for (let pass = 0; pass < totalPasses; pass++) {
    for (let i = 0; i < anchors.length - 1; i++) {
      const p1 = anchors[i];
      const p2 = anchors[i + 1];
      const segmentSteps = 10;

      for (let s = 0; s < segmentSteps; s++) {
        globalT += 0.085;
        const alpha = s / segmentSteps;
        const baseX = p1.x + (p2.x - p1.x) * alpha;
        const baseY = p1.y + (p2.y - p1.y) * alpha;

        // Micro-scribble loop displacement in 3D
        const scribbleRadius = 0.045 + Math.sin(globalT * 11) * 0.025;
        const loopAngle = globalT * Math.PI * 4;
        
        // Depth jitter (visible when rotating in 3D, collapses from front)
        const zDepth = Math.sin(globalT * 5.2) * 0.28 + Math.cos(globalT * 3.1) * 0.12;

        points.push(
          new THREE.Vector3(
            baseX + Math.cos(loopAngle) * scribbleRadius,
            baseY + Math.sin(loopAngle) * scribbleRadius,
            zDepth
          )
        );
      }
    }
  }

  // Fit smooth 3D CatmullRom spline to the continuous single stroke
  const spline = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.35);
  return spline;
}

export default function MuseumGallery({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  // Gallery state
  const [activeIdx, setActiveIdx] = useState(0);
  const [visitedIds, setVisitedIds] = useState(new Set([1]));
  const [audioMuted, setAudioMuted] = useState(false);
  const [showFullPlaque, setShowFullPlaque] = useState(false);

  // Pedestal Meshes & Spotlights references
  const pedestalGroupsRef = useRef([]);
  const spotLightsRef = useRef([]);
  const wireMeshesRef = useRef([]);

  // Drag interaction to spin active sculpture on its pedestal
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const activeSpinRef = useRef(0);
  const targetCamXRef = useRef(0);

  const activeExhibit = EXHIBITS[activeIdx];

  const triggerChime = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  // Build the 3D Museum Hall Scene with Single-Stroke 3D Scribbles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.4);
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

    // 2. Ambient Museum Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    const hallLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    hallLight.position.set(5, 8, 6);
    scene.add(hallLight);

    // 3. Polished Museum Hall Floor
    const floorGeom = new THREE.PlaneGeometry(60, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Polished emerald marble
      roughness: 0.15,
      metalness: 0.85
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle gallery wall backdrop
    const wallGeom = new THREE.PlaneGeometry(60, 15);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf7faf8,
      roughness: 0.95
    });
    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallMesh.position.set(0, 3, -6);
    scene.add(wallMesh);

    // 4. Build the 7 Separate Museum Pedestals (spaced 3.8 units apart)
    const pedestalSpacing = 3.8;
    const pedestalGroups = [];
    const spotLights = [];
    const wireMeshes = [];

    EXHIBITS.forEach((exhibit, idx) => {
      const group = new THREE.Group();
      const xPos = idx * pedestalSpacing;
      group.position.set(xPos, 0, 0);
      scene.add(group);
      pedestalGroups.push(group);

      // A. Stone Pedestal Plinth
      const plinthGeom = new THREE.CylinderGeometry(0.85, 0.95, 1.3, 36);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0xf0fdf4,
        roughness: 0.45,
        metalness: 0.08
      });
      const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
      plinthMesh.position.y = -0.95;
      plinthMesh.castShadow = true;
      plinthMesh.receiveShadow = true;
      group.add(plinthMesh);

      // Brass plinth top trim collar
      const collarGeom = new THREE.CylinderGeometry(0.88, 0.88, 0.06, 36);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85
      });
      const collarMesh = new THREE.Mesh(collarGeom, collarMat);
      collarMesh.position.y = -0.28;
      group.add(collarMesh);

      // Pedestal Base Ring on Floor
      const baseRimGeom = new THREE.RingGeometry(0.9, 1.15, 36);
      const baseRimMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(exhibit.accentColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const baseRimMesh = new THREE.Mesh(baseRimGeom, baseRimMat);
      baseRimMesh.rotation.x = -Math.PI / 2;
      baseRimMesh.position.y = -1.59;
      group.add(baseRimMesh);

      // B. Dedicated Museum Spotlight directly above this pedestal
      const spot = new THREE.SpotLight(
        new THREE.Color(exhibit.accentColor),
        idx === 0 ? 4.5 : 1.2,
        12,
        Math.PI / 5,
        0.4,
        1
      );
      spot.position.set(xPos, 5.5, 1.5);
      spot.target = plinthMesh;
      scene.add(spot);
      spotLights.push(spot);

      // C. THE FULL-ON SINGLE-STROKE CONTINUOUS 3D SCRIBBLE WIRE SCULPTURE!
      const spline = createSingleStrokeScribbleSpline(exhibit.id);
      const tubeGeom = new THREE.TubeGeometry(spline, 320, 0.016, 6, false);
      const wireMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(exhibit.accentColor),
        roughness: 0.25,
        metalness: 0.85,
        emissive: new THREE.Color(exhibit.accentColor),
        emissiveIntensity: idx === 0 ? 0.8 : 0.15
      });
      const wireMesh = new THREE.Mesh(tubeGeom, wireMat);
      wireMesh.position.set(0, 0.5, 0); // Perched above plinth
      group.add(wireMesh);
      wireMeshes.push(wireMesh);

      // Stardust particles hovering around sculpture
      const dustGeom = new THREE.BufferGeometry();
      const dustCount = 35;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let d = 0; d < dustCount * 3; d += 3) {
        dustPositions[d] = (Math.random() - 0.5) * 1.8;
        dustPositions[d + 1] = Math.random() * 1.6 - 0.2;
        dustPositions[d + 2] = (Math.random() - 0.5) * 1.8;
      }
      dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.035,
        transparent: true,
        opacity: 0.6
      });
      const dustParticles = new THREE.Points(dustGeom, dustMat);
      dustParticles.position.set(0, 0.5, 0);
      group.add(dustParticles);
    });

    pedestalGroupsRef.current = pedestalGroups;
    spotLightsRef.current = spotLights;
    wireMeshesRef.current = wireMeshes;

    // 5. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera translation along the gallery hall
      camera.position.x += (targetCamXRef.current - camera.position.x) * 0.08;

      // Rotate each scribble sculpture gently; active sculpture responds to user drag spin
      pedestalGroupsRef.current.forEach((grp, idx) => {
        const wire = grp.children[3]; // The 3D wire sculpture
        if (wire) {
          if (idx === activeIdx) {
            wire.rotation.y = activeSpinRef.current + Math.sin(elapsed * 0.6) * 0.08;
          } else {
            wire.rotation.y = elapsed * 0.4 + idx * 1.2;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Pointer Drag to Spin Active Sculpture
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      prevPointerRef.current = {
        x: e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0),
        y: e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)
      };
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const deltaX = clientX - prevPointerRef.current.x;
      prevPointerRef.current = { x: clientX, y: clientY };

      activeSpinRef.current += deltaX * 0.012;
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
  }, []);

  // Navigate to a specific exhibit (camera glides to that pedestal)
  const selectExhibit = useCallback(
    (idx) => {
      setActiveIdx(idx);
      const targetExhibit = EXHIBITS[idx];
      setVisitedIds((prev) => new Set(prev).add(targetExhibit.id));

      targetCamXRef.current = idx * 3.8;
      activeSpinRef.current = 0; // Reset spin so it faces forward initially

      spotLightsRef.current.forEach((spot, i) => {
        spot.intensity = i === idx ? 4.5 : 1.1;
      });

      wireMeshesRef.current.forEach((wire, i) => {
        wire.material.emissiveIntensity = i === idx ? 0.8 : 0.15;
      });

      triggerChime(392 + idx * 55);
    },
    [triggerChime]
  );

  const nextExhibit = () => {
    const next = (activeIdx + 1) % EXHIBITS.length;
    selectExhibit(next);
  };

  const prevExhibit = () => {
    const prev = activeIdx === 0 ? EXHIBITS.length - 1 : activeIdx - 1;
    selectExhibit(prev);
  };

  // Complete Space 06 when all 7 exhibits have been explored
  useEffect(() => {
    if (visitedIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [visitedIds, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Museum Gallery Header */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // 3D Single-Stroke Scribble Museum
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Each sculpture is literally one continuous unbroken wire stroke. Drag horizontally to spin and reveal the chaotic 3D scribble depth!
            </p>
          </div>
        </div>

        {/* Curation Progress & Audio */}
        <div className="flex items-center gap-2">
          {/* Active Plinth Badge */}
          <div className="px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
            {activeExhibit.plinthLabel}
          </div>

          {/* Visited Tracker */}
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-serif font-bold shadow-2xs">
            Exhibits: {visitedIds.size} / 7
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

      {/* 2. Main 3D Museum Hall Viewport */}
      <div className="relative flex-1 w-full h-full touch-none select-none flex items-center justify-center">
        {/* Three.js Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Floating Museum Plaque Card at Bottom-Center */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExhibit.id}
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-20 pointer-events-auto"
          >
            <div className="bg-[#fffdfa]/95 backdrop-blur-md border-2 border-emerald-300 rounded-[28px] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-[#132e22]">
              {/* Washi Tape */}
              <div className="absolute -top-1.5 right-10 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              {/* Plaque Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: activeExhibit.accentColor }}
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    {activeExhibit.plinthLabel} // {activeExhibit.subtitle}
                  </span>
                </div>
                <button
                  onClick={() => setShowFullPlaque(true)}
                  className="text-xs font-serif italic text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                >
                  Read Curatorial Plaque
                </button>
              </div>

              {/* Artwork Title & Medium */}
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-0.5">
                {activeExhibit.title}
              </h4>
              <p className="text-[11px] font-mono text-emerald-700 mb-2 font-bold">
                {activeExhibit.medium}
              </p>

              {/* Story Excerpt */}
              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed line-clamp-2 mb-3">
                {activeExhibit.story}
              </p>

              {/* Pull Quote Box */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <p className="text-xs font-serif italic text-emerald-950 font-medium">
                  "{activeExhibit.quote}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Drag Hint Overlay Cue */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-[11px] font-serif font-bold text-emerald-900 shadow-2xs pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Drag horizontally to spin the single-stroke scribble in 3D</span>
        </div>
      </div>

      {/* 3. Bottom Gallery Hall Walkway Navigation */}
      <div className="z-20 w-full px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <button
          onClick={prevExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-serif font-bold text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Exhibit</span>
        </button>

        {/* 7 Gallery Plinth Anchors */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto justify-center">
          {EXHIBITS.map((item, idx) => {
            const isSelected = activeIdx === idx;
            const isVisited = visitedIds.has(item.id);

            return (
              <button
                key={item.id}
                onClick={() => selectExhibit(idx)}
                style={{
                  borderColor: isSelected ? item.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${item.accentColor}55` : undefined
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs scale-105 ring-2 ring-emerald-300"
                    : isVisited
                    ? "bg-[#f0fdf4] text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                title={`Walk to Plinth 0${item.id}: ${item.title}`}
              >
                <span
                  style={{ backgroundColor: item.accentColor }}
                  className="w-2 h-2 rounded-full inline-block shrink-0 shadow-2xs"
                />
                <span>0{item.id}</span>
                <span className="hidden md:inline">{item.title}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={nextExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-xs flex items-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span className="hidden sm:inline">Next Exhibit</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Full Curatorial Plaque Modal */}
      <AnimatePresence>
        {showFullPlaque && activeExhibit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050b14]/75 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowFullPlaque(false)}
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
                    style={{ backgroundColor: activeExhibit.accentColor }}
                    className="w-3 h-3 rounded-full inline-block shadow-xs"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    {activeExhibit.plinthLabel} // Curatorial Plaque
                  </span>
                </div>
                <button
                  onClick={() => setShowFullPlaque(false)}
                  className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#132e22] mb-1">
                {activeExhibit.title}
              </h3>
              <p className="text-xs font-mono uppercase text-emerald-700 font-bold mb-1">
                {activeExhibit.tagline}
              </p>
              <p className="text-xs font-mono text-emerald-700 mb-4 font-bold">
                {activeExhibit.medium}
              </p>

              <div className="text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-6">
                {activeExhibit.story}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-serif italic text-emerald-950 font-medium leading-relaxed">
                  "{activeExhibit.quote}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
