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
    medium: "Glacial Cyan Brass Wire, Fractured Ice & Devotion",
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
    medium: "Amber Flame Wire, Hand-Forged Glass & Composure",
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
    medium: "Electric Emerald Wire & Concentric Soundwaves",
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
    medium: "Rose Quartz Ribbon Wire & Intersecting Dialogue",
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
    medium: "Golden Citrine Wire, Optic Iris & Objective Light",
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
    medium: "Deep Jade Brass Wire & Maritime Anchor Flukes",
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
    medium: "Starlight Pearl Wire & Blooming Floral Core",
    accentColor: "#86efac",
    colorName: "Starlight Pearl",
    tagline: "The Man I Am Today",
    story: `If the boy from October 2019 saw me today, he wouldn't recognize me. 

Back then, I was an angry, prickly kid hiding behind nonchalance. Seven years of loving you, being held accountable by you, and sharing life with you shaped me into who I am.

In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you."
  }
];

// Helper: Generates 3D sculpture points for each of the 7 separate museum pieces
function createExhibit3DCurve(id) {
  const points = [];

  switch (id) {
    case 1: {
      // 1. The Ice Rampart: Crystalline jagged fortress battlements cracking into fluid base
      const jagged = [
        [-0.8, -0.9, 0],
        [-0.8, 0.2, 0.1],
        [-0.6, 0.2, -0.1],
        [-0.6, 0.6, 0.15],
        [-0.4, 0.6, -0.1],
        [-0.4, 0.95, 0.2],
        [-0.2, 0.7, 0],
        [0.0, 1.05, 0.25],
        [0.2, 0.7, 0],
        [0.4, 0.95, -0.2],
        [0.4, 0.6, 0.1],
        [0.6, 0.6, -0.15],
        [0.6, 0.2, 0.1],
        [0.8, 0.2, -0.1],
        [0.8, -0.9, 0]
      ];
      jagged.forEach(([x, y, z]) => points.push(new THREE.Vector3(x, y, z)));
      // Melting fracture tendrils curling in 3D
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const th = t * Math.PI * 3;
        points.push(
          new THREE.Vector3(
            Math.sin(th) * 0.45 * (1 - t * 0.5),
            0.1 - t * 1.0,
            Math.cos(th) * 0.45 * (1 - t * 0.5)
          )
        );
      }
      break;
    }
    case 2: {
      // 2. The Calmed Lantern & Teardrop Flame
      // Hexagonal lantern ribs
      const ribCount = 6;
      for (let r = 0; r < ribCount; r++) {
        const th = (r / ribCount) * Math.PI * 2;
        const x = Math.cos(th) * 0.55;
        const z = Math.sin(th) * 0.55;
        points.push(new THREE.Vector3(x, -0.7, z));
        points.push(new THREE.Vector3(x * 1.15, 0.5, z * 1.15));
        points.push(new THREE.Vector3(0, 0.95, 0));
        points.push(new THREE.Vector3(0, 1.15, 0)); // hanging loop
        points.push(new THREE.Vector3(0, 0.95, 0));
      }
      // Inner glowing teardrop flame spiral
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const th = t * Math.PI * 5;
        const rad = Math.sin(t * Math.PI) * 0.22;
        points.push(new THREE.Vector3(Math.cos(th) * rad, -0.4 + t * 0.7, Math.sin(th) * rad));
      }
      break;
    }
    case 3: {
      // 3. The Speaking Voice: Human head profile & expanding acoustic wave rings
      const profile = [
        [-0.45, 0.9, 0],
        [-0.6, 0.65, 0],
        [-0.7, 0.35, 0],
        [-0.6, 0.05, 0],
        [-0.45, -0.2, 0],
        [-0.55, -0.65, 0],
        [-0.2, -0.65, 0],
        [-0.2, -0.4, 0],
        [-0.05, -0.3, 0], // chin
        [-0.1, -0.15, 0],
        [0.05, -0.1, 0],  // speaking lips
        [-0.05, -0.05, 0],
        [0.0, 0.15, 0],   // nose
        [-0.15, 0.3, 0],
        [-0.1, 0.55, 0],
        [-0.3, 0.8, 0],
        [-0.45, 0.9, 0]
      ];
      profile.forEach(([x, y, z]) => points.push(new THREE.Vector3(x, y, z)));
      // 3 Expanding 3D Soundwaves projecting forward
      for (let w = 1; w <= 3; w++) {
        const radius = 0.35 + w * 0.35;
        for (let i = 0; i <= 14; i++) {
          const t = i / 14;
          const th = -Math.PI / 2.5 + t * (Math.PI / 1.25);
          points.push(
            new THREE.Vector3(
              0.1 + Math.cos(th) * radius,
              Math.sin(th) * radius,
              Math.sin(t * Math.PI) * (w * 0.2)
            )
          );
        }
      }
      break;
    }
    case 4: {
      // 4. The Two in Conversation: Two sculpted faces facing each other across a table
      // Left person
      const leftPerson = [
        [-0.8, -0.7, 0],
        [-0.8, -0.2, -0.1],
        [-0.55, 0.0, 0],
        [-0.45, 0.3, 0.1],
        [-0.6, 0.65, 0],
        [-0.35, 0.75, 0],
        [-0.25, 0.45, 0],
        [-0.2, 0.2, 0],
        [-0.3, 0.0, 0],
        [-0.25, -0.2, 0],
        [-0.4, -0.35, 0],
        [-0.4, -0.7, 0]
      ];
      leftPerson.forEach(([x, y, z]) => points.push(new THREE.Vector3(x, y, z)));
      // Table bridge
      points.push(new THREE.Vector3(-0.55, -0.7, 0));
      points.push(new THREE.Vector3(0.55, -0.7, 0));
      // Right person
      const rightPerson = [
        [0.4, -0.7, 0],
        [0.4, -0.35, 0],
        [0.25, -0.2, 0],
        [0.3, 0.0, 0],
        [0.2, 0.2, 0],
        [0.25, 0.45, 0],
        [0.35, 0.75, 0],
        [0.6, 0.65, 0],
        [0.45, 0.3, -0.1],
        [0.55, 0.0, 0],
        [0.8, -0.2, 0.1],
        [0.8, -0.7, 0]
      ];
      rightPerson.forEach(([x, y, z]) => points.push(new THREE.Vector3(x, y, z)));
      // Overhead speech ribbon loop
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(t) * 0.45,
            0.65 + Math.sin(t) * 0.25,
            Math.sin(t * 2) * 0.25
          )
        );
      }
      break;
    }
    case 5: {
      // 5. The Clear Eye of Truth: Eyelids, floating spherical iris and vertical plumb beam
      // Upper lid
      for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI;
        points.push(new THREE.Vector3(-0.9 + (i / 16) * 1.8, Math.sin(t) * 0.65, 0));
      }
      // Lower lid
      for (let i = 0; i <= 16; i++) {
        const t = (i / 16) * Math.PI;
        points.push(new THREE.Vector3(0.9 - (i / 16) * 1.8, -Math.sin(t) * 0.65, 0));
      }
      // 3D Spherical Iris Ring
      for (let i = 0; i <= 24; i++) {
        const th = (i / 24) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(th) * 0.38, Math.sin(th) * 0.38, Math.sin(th) * 0.15));
      }
      // Central vertical plumb focus ray
      points.push(new THREE.Vector3(0, 0.95, 0));
      points.push(new THREE.Vector3(0, -0.95, 0));
      break;
    }
    case 6: {
      // 6. The Unshakable Anchor: Anchor ring, cross-stock, shank and curved barbed flukes
      // Top shackle ring
      for (let i = 0; i <= 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(th) * 0.2, 0.85 + Math.sin(th) * 0.2, 0));
      }
      // Cross-stock
      points.push(new THREE.Vector3(-0.6, 0.55, 0));
      points.push(new THREE.Vector3(0.6, 0.55, 0));
      // Shank
      points.push(new THREE.Vector3(0, 0.65, 0));
      points.push(new THREE.Vector3(0, -0.75, 0));
      // Curved flukes in 3D arc
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI;
        const x = -Math.cos(t) * 0.75;
        const y = -0.75 + Math.sin(t) * 0.45;
        const z = Math.sin(t * 2) * 0.18;
        points.push(new THREE.Vector3(x, y, z));
      }
      // Fluke barb points
      points.push(new THREE.Vector3(0.65, -0.3, 0));
      points.push(new THREE.Vector3(0.55, -0.6, 0));
      points.push(new THREE.Vector3(0, -0.75, 0));
      points.push(new THREE.Vector3(-0.55, -0.6, 0));
      points.push(new THREE.Vector3(-0.65, -0.3, 0));
      break;
    }
    case 7: {
      // 7. The Man Standing Tall: Proud upright silhouette with shoulders and blooming heart
      // Head ring
      for (let i = 0; i <= 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(th) * 0.18, 0.82 + Math.sin(th) * 0.18, 0));
      }
      // Neck, shoulders & torso
      const body = [
        [-0.08, 0.64, 0],
        [-0.55, 0.5, 0.08], // left shoulder
        [-0.4, 0.0, 0.05],
        [-0.32, -0.3, 0],
        [-0.28, -0.95, 0], // left leg
        [-0.08, -0.95, 0],
        [0.0, -0.3, 0],    // crotch
        [0.08, -0.95, 0],
        [0.28, -0.95, 0],  // right leg
        [0.32, -0.3, 0],
        [0.4, 0.0, -0.05],
        [0.55, 0.5, -0.08], // right shoulder
        [0.08, 0.64, 0]
      ];
      body.forEach(([x, y, z]) => points.push(new THREE.Vector3(x, y, z)));
      // Blooming heart core at chest in 3D spiral
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI * 4;
        points.push(
          new THREE.Vector3(
            Math.sin(t) * 0.22,
            0.28 + Math.cos(t) * 0.16,
            Math.cos(t) * 0.15
          )
        );
      }
      break;
    }
    default:
      break;
  }

  const spline = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.4);
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

  // Build the 3D Museum Hall Scene
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

    // Warm Key Light across hall
    const hallLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    hallLight.position.set(5, 8, 6);
    scene.add(hallLight);

    // 3. Polished Museum Hall Floor
    const floorGeom = new THREE.PlaneGeometry(60, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Deep polished emerald marble
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

    // 4. Build the 7 Separate Museum Pedestals (spaced 3.8 units apart along the gallery wing)
    const pedestalSpacing = 3.8;
    const pedestalGroups = [];
    const spotLights = [];
    const wireMeshes = [];

    EXHIBITS.forEach((exhibit, idx) => {
      const group = new THREE.Group();
      const xPos = (idx - 0) * pedestalSpacing; // Centered on idx 0 initially
      group.position.set(xPos, 0, 0);
      scene.add(group);
      pedestalGroups.push(group);

      // A. Stone Pedestal Plinth (White Carrara / Soft Mint Plinth)
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
        idx === 0 ? 4.5 : 1.2, // Highlight active pedestal
        12,
        Math.PI / 5,
        0.4,
        1
      );
      spot.position.set(xPos, 5.5, 1.5);
      spot.target = plinthMesh;
      scene.add(spot);
      spotLights.push(spot);

      // C. The 3D Wire Sculpture for this exhibit
      const spline = createExhibit3DCurve(exhibit.id);
      const tubeGeom = new THREE.TubeGeometry(spline, 96, 0.026, 8, false);
      const wireMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(exhibit.accentColor),
        roughness: 0.22,
        metalness: 0.85,
        emissive: new THREE.Color(exhibit.accentColor),
        emissiveIntensity: idx === 0 ? 0.75 : 0.15
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

      // Smooth camera translation along the gallery hall (centered on active exhibit)
      camera.position.x += (targetCamXRef.current - camera.position.x) * 0.08;

      // Rotate each sculpture gently; active sculpture responds to user drag spin
      pedestalGroupsRef.current.forEach((grp, idx) => {
        const wire = grp.children[3]; // The 3D wire sculpture
        if (wire) {
          if (idx === activeIdx) {
            // Apply drag spin + subtle natural rotation
            wire.rotation.y = activeSpinRef.current + Math.sin(elapsed * 0.6) * 0.1;
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
      prevPointerRef.current.x = clientX;

      // Spin the active sculpture
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

      // Move camera X to center on that pedestal (spacing 3.8)
      targetCamXRef.current = idx * 3.8;
      activeSpinRef.current = 0; // Reset spin

      // Update spotlight intensities & wire emissive highlights
      spotLightsRef.current.forEach((spot, i) => {
        spot.intensity = i === idx ? 4.5 : 1.1;
      });

      wireMeshesRef.current.forEach((wire, i) => {
        wire.material.emissiveIntensity = i === idx ? 0.75 : 0.15;
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

  // Mark space completed when all 7 exhibits have been explored
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
                Chapter 6 // The Museum of Seven Transformations
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Seven separate 3D wire sculptures displayed on museum pedestals. Drag to inspect each in 360°.
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
            Exhibits Explored: {visitedIds.size} / 7
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
              <p className="text-[11px] font-mono text-[#3d6350] mb-2 italic">
                Medium: {activeExhibit.medium}
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-emerald-200 text-[11px] font-serif text-[#3d6350] shadow-2xs pointer-events-none">
          Drag horizontally on the sculpture to spin it on its pedestal
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
              <p className="text-xs font-mono text-[#3d6350] italic mb-4">
                Medium: {activeExhibit.medium}
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
