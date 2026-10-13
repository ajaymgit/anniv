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
  Layers
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

// The 7 Transformation Perspectives with Authentic Personal Truths
export const PERSPECTIVES = [
  {
    id: 1,
    name: "The Glacial Fracture",
    faculty: "Melting the Ice Ramparts",
    angleTheta: 0, // 0 deg
    anglePhi: 0.05,
    tagline: "From 'Ramparts of Ice' Nonchalance to Proud Devotion",
    story: `Before I met you, I lived behind thick ramparts of ice—the exact mirror of Koyun from Ramparts of Ice. 

My vibe was aloof, guarded, and nonchalant. I acted like I didn't care about anything, and I barely spoke to any girl. My independence was an icy fortress to keep the world out.

You didn't storm that fortress; you just stayed warm and real until every defensive wall melted away. Today, I am unashamedly a "girl's boy"—attentive to your world, learning your cadence, and proud to be the one who cares for you.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins.",
    color: "#059669"
  },
  {
    id: 2,
    name: "The Harmonic Curve",
    faculty: "Taming the Hair-Trigger",
    angleTheta: (Math.PI * 2) * (1 / 7), // ~51.4 deg
    anglePhi: 0.16,
    tagline: "From Hot-Headed Temper to Composure",
    story: `I used to be a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My instinct was to snap first and dissect later.

Being with you taught me that losing my temper never solved a single problem. In seven years, you showed me how to hold my fire, breathe through chaos, and meet hardship with composure instead of hostility.

My fire didn't disappear; you just gave it peace so it didn't burn everything around me.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it.",
    color: "#10b981"
  },
  {
    id: 3,
    name: "The Acoustic Ripple",
    faculty: "Finding My Voice",
    angleTheta: (Math.PI * 2) * (2 / 7), // ~102.8 deg
    anglePhi: -0.12,
    tagline: "From a Silent Mumble to Speaking with Conviction",
    story: `I had a very silent voice. I kept my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my own head.

With you in my corner, I literally started speaking louder. You listened so attentively that you made me realize my voice had value. 

You pushed me to speak up, express what I think, and articulate what I need without shrinking down.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard.",
    color: "#34d399"
  },
  {
    id: 4,
    name: "The Interlocking Möbius",
    faculty: "How We Communicate",
    angleTheta: (Math.PI * 2) * (3 / 7), // ~154.3 deg
    anglePhi: 0.18,
    tagline: "From Fiery Arguments to Patient Talk",
    story: `Early on, when we disagreed, we had fiery, stubborn arguments where neither of us wanted to back down. We fought to be right.

Over seven years, that dynamic completely transformed. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication.

We stopped fighting each other, and started fighting the problem together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding.",
    color: "#6ee7b7"
  },
  {
    id: 5,
    name: "The Focal Prism",
    faculty: "The Grounded Lens",
    angleTheta: (Math.PI * 2) * (4 / 7), // ~205.7 deg
    anglePhi: -0.15,
    tagline: "Seeing Things as They Actually Are",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst, and reacting out of panic.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that strips away the fog and helps me see things objectively as they truly are.

You cut through all the static in my head and bring me back to solid ground.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing.",
    color: "#059669"
  },
  {
    id: 6,
    name: "The Twin Spire",
    faculty: "The Unfailing Support",
    angleTheta: (Math.PI * 2) * (5 / 7), // ~257.1 deg
    anglePhi: 0.12,
    tagline: "No Longer Alone in the Arena",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down.

You became my steadfast support system. Through every exhaustion, career pivot, and stressful season, knowing you are standing in my corner changed how I face the world.

I stopped fighting life as a lone wolf, because I finally found my partner.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again.",
    color: "#047857"
  },
  {
    id: 7,
    name: "The Ascending Obelisk",
    faculty: "Becoming a Man",
    angleTheta: (Math.PI * 2) * (6 / 7), // ~308.6 deg
    anglePhi: -0.08,
    tagline: "The Man I Am Today",
    story: `If the boy from October 2019 saw me today, he wouldn't recognize me. 

Back then, I was an angry, prickly kid hiding behind nonchalance. Seven years of loving you, being held accountable by you, and sharing life with you shaped me into who I am.

In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you.",
    color: "#059669"
  }
];

// Helper: Generate 2D stroke points for each of the 7 abstract symbols
function get2DSilhouettePoints(id) {
  const points = [];
  const count = 48;

  switch (id) {
    case 1: {
      // The Glacial Fracture: Rigid crystalline top dissolving into flowing bottom loops
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        if (t < 0.5) {
          // Jagged crystal lattice
          const subT = t * 2;
          const x = Math.sin(subT * Math.PI * 3.5) * (0.8 - subT * 0.4);
          const y = 1.1 - subT * 0.9;
          points.push(new THREE.Vector2(x, y));
        } else {
          // Flowing botanical curves
          const subT = (t - 0.5) * 2;
          const x = Math.sin(subT * Math.PI * 2) * 0.85;
          const y = 0.2 - subT * 1.3 + Math.cos(subT * Math.PI * 2) * 0.25;
          points.push(new THREE.Vector2(x, y));
        }
      }
      break;
    }
    case 2: {
      // The Harmonic Curve: Spiky high-frequency pulse on left -> smooth sine wave on right
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const x = -1.3 + t * 2.6;
        let y = 0;
        if (t < 0.45) {
          // Spiky pulse
          const pT = t / 0.45;
          y = Math.sin(pT * Math.PI * 8) * (0.85 * (1 - pT * 0.3));
        } else {
          // Gentle sine wave
          const sT = (t - 0.45) / 0.55;
          y = Math.sin(sT * Math.PI * 2) * 0.45;
        }
        points.push(new THREE.Vector2(x, y));
      }
      break;
    }
    case 3: {
      // The Acoustic Ripple: Central focal node with expanding concentric parabolic sound arcs
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        // 4 ripple wave arcs connected in continuous path
        const arcIdx = Math.floor(t * 3.99);
        const arcT = (t * 4) % 1;
        const radius = 0.3 + arcIdx * 0.32;
        const theta = -Math.PI / 2.3 + arcT * (Math.PI / 1.15);
        const x = -0.5 + Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        points.push(new THREE.Vector2(x, y));
      }
      break;
    }
    case 4: {
      // The Interlocking Möbius: Continuous figure-8 infinity loop
      for (let i = 0; i <= count; i++) {
        const t = (i / count) * Math.PI * 2;
        const scale = 1.15;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = (scale * Math.cos(t)) / denom;
        const y = (scale * Math.sin(t) * Math.cos(t)) / denom;
        points.push(new THREE.Vector2(x, y));
      }
      break;
    }
    case 5: {
      // The Focal Prism: Equilateral triangle with converging rays focusing to a vertical plumb line
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        if (t < 0.6) {
          // Triangle perimeter
          const triT = (t / 0.6) * 3;
          let x = 0, y = 0;
          if (triT < 1) {
            x = -0.85 + triT * 0.85;
            y = -0.6 + triT * 1.6;
          } else if (triT < 2) {
            x = 0 + (triT - 1) * 0.85;
            y = 1.0 - (triT - 1) * 1.6;
          } else {
            x = 0.85 - (triT - 2) * 1.7;
            y = -0.6;
          }
          points.push(new THREE.Vector2(x, y));
        } else {
          // Center plumb laser focus line
          const lineT = (t - 0.6) / 0.4;
          const x = 0;
          const y = 0.5 - lineT * 1.6;
          points.push(new THREE.Vector2(x, y));
        }
      }
      break;
    }
    case 6: {
      // The Twin Spire: Outer sweeping arch cradling an inner pillar in balance
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        if (t < 0.55) {
          // Outer sweeping cradle arch
          const aT = t / 0.55;
          const x = -0.6 + Math.sin(aT * Math.PI) * 1.1;
          const y = -1.1 + Math.sin(aT * Math.PI * 0.85) * 2.2;
          points.push(new THREE.Vector2(x, y));
        } else {
          // Inner pillar leaning in
          const pT = (t - 0.55) / 0.45;
          const x = 0.25 - pT * 0.2;
          const y = 0.9 - pT * 1.9;
          points.push(new THREE.Vector2(x, y));
        }
      }
      break;
    }
    case 7: {
      // The Ascending Obelisk: Upright tapered pillar topped with a delicate circular halo
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        if (t < 0.65) {
          // Upright tapered pillar
          const pT = (t / 0.65) * 2;
          if (pT < 1) {
            points.push(new THREE.Vector2(-0.3 + pT * 0.2, -1.2 + pT * 1.8));
          } else {
            points.push(new THREE.Vector2(-0.1 + (pT - 1) * 0.4, 0.6 - (pT - 1) * 1.8));
          }
        } else {
          // Top celestial halo ring
          const hT = ((t - 0.65) / 0.35) * Math.PI * 2;
          const x = Math.cos(hT) * 0.38;
          const y = 0.88 + Math.sin(hT) * 0.25;
          points.push(new THREE.Vector2(x, y));
        }
      }
      break;
    }
    default:
      break;
  }

  return points;
}

export default function AnamorphicScribbleSculpture({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sculptureGroupRef = useRef(null);
  const wireMeshesRef = useRef([]);

  // Camera Orbit state
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const cameraPolarRef = useRef({
    theta: 0,
    phi: 0.1,
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

  // Web Audio Chime Helper
  const triggerAudioTone = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  // Set up Three.js WebGL Scene
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
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Cinematic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfef08a, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x86efac, 2.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const softFillLight = new THREE.PointLight(0xa7f3d0, 1.5, 8);
    softFillLight.position.set(0, 0, 0);
    scene.add(softFillLight);

    // 3. Floating Pedestal / Reflective Jade Base
    const baseGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.12,
      metalness: 0.85
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -1.6;
    scene.add(baseMesh);

    // Subtle inner glowing ring on pedestal
    const ringGeom = new THREE.RingGeometry(1.2, 1.35, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.55;
    scene.add(ringMesh);

    // 4. Build the 3D Anamorphic Scribble Sculpture Group
    const sculptureGroup = new THREE.Group();
    sculptureGroupRef.current = sculptureGroup;
    scene.add(sculptureGroup);

    // Golden metallic brass wire material
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Rich gold / brass
      roughness: 0.28,
      metalness: 0.82,
      emissive: 0x78350f,
      emissiveIntensity: 0.25
    });

    const wireMeshes = [];
    wireMeshesRef.current = wireMeshes;

    // Generate 3D anamorphic curve splines for each of the 7 viewpoints
    PERSPECTIVES.forEach((p) => {
      const theta = p.angleTheta;
      const phi = p.anglePhi;
      const R = 4.6;

      // Camera position vector for this viewpoint
      const viewPos = new THREE.Vector3(
        R * Math.cos(phi) * Math.sin(theta),
        R * Math.sin(phi),
        R * Math.cos(phi) * Math.cos(theta)
      );

      // Camera local coordinate basis
      const forward = viewPos.clone().negate().normalize();
      const upGlobal = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(forward, upGlobal).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();

      // Retrieve 2D stroke points
      const points2D = get2DSilhouettePoints(p.id);

      // Project 2D points into 3D with distributed parallax depth d
      const curvePoints3D = [];
      points2D.forEach((pt, i) => {
        // Controlled sinusoidal depth variation along line of sight
        // From this viewpoint, forward * d collapses along camera axis!
        // From any other angle, varying d creates wild tangled scribbles!
        const d = Math.sin((i / points2D.length) * Math.PI * 4) * 0.72;

        const pos3D = new THREE.Vector3()
          .addScaledVector(right, pt.x)
          .addScaledVector(up, pt.y)
          .addScaledVector(forward, d);

        curvePoints3D.push(pos3D);
      });

      // Construct smooth 3D CatmullRom curve
      const spline = new THREE.CatmullRomCurve3(curvePoints3D, false, "centripetal", 0.4);
      const tubeGeom = new THREE.TubeGeometry(spline, 64, 0.024, 8, false);
      const mesh = new THREE.Mesh(tubeGeom, wireMat.clone());
      mesh.userData = { perspectiveId: p.id };

      sculptureGroup.add(mesh);
      wireMeshes.push(mesh);
    });

    // 5. Interconnecting wandering scribble loops (knits all 7 figures into one continuous tangled sculpture)
    const connectorPoints = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 6;
      connectorPoints.push(
        new THREE.Vector3(
          Math.sin(t) * (0.9 + Math.cos(t * 1.5) * 0.4),
          Math.sin(t * 0.8) * 0.95,
          Math.cos(t) * (0.9 + Math.sin(t * 1.2) * 0.4)
        )
      );
    }
    const connectorSpline = new THREE.CatmullRomCurve3(connectorPoints, true);
    const connectorGeom = new THREE.TubeGeometry(connectorSpline, 96, 0.016, 6, true);
    const connectorMesh = new THREE.Mesh(
      connectorGeom,
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.35,
        metalness: 0.75,
        transparent: true,
        opacity: 0.85
      })
    );
    sculptureGroup.add(connectorMesh);

    // 6. Floating golden stardust embers
    const dustCount = 80;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 3.2;
      dustPositions[i + 1] = (Math.random() - 0.5) * 2.8;
      dustPositions[i + 2] = (Math.random() - 0.5) * 3.2;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.04,
      transparent: true,
      opacity: 0.7
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    scene.add(dustParticles);

    // 7. Render & Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation towards target viewpoint when button clicked
      if (targetPolarRef.current) {
        const target = targetPolarRef.current;
        const current = cameraPolarRef.current;

        // Spherical lerp
        current.theta += (target.theta - current.theta) * 0.08;
        current.phi += (target.phi - current.phi) * 0.08;
        current.radius += (target.radius - current.radius) * 0.08;

        // Check arrival
        if (
          Math.abs(target.theta - current.theta) < 0.005 &&
          Math.abs(target.phi - current.phi) < 0.005
        ) {
          current.theta = target.theta;
          current.phi = target.phi;
          targetPolarRef.current = null;
        }
      }

      // Update camera position from polar coordinates
      const { theta, phi, radius } = cameraPolarRef.current;
      camera.position.set(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 0, 0);

      // Subtle ambient hover of stardust
      dustParticles.rotation.y = elapsed * 0.04;

      // Real-time alignment calculation
      // Calculate angular distance between current camera direction and each of the 7 viewpoints
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
        const angleDist = Math.acos(dot); // radians (0 is exact alignment)

        // Convert angle distance to alignment score 0-100%
        // Perfect lock is within 0.15 rad (~8.5 deg)
        const score = Math.max(0, Math.min(100, Math.round((1 - angleDist / 0.55) * 100)));

        if (score > bestScore) {
          bestScore = score;
          closestPerspective = p;
        }
      });

      setAlignmentScore(bestScore);

      // Lock perspective when score >= 82%
      if (bestScore >= 82) {
        if (lockedPerspectiveId !== closestPerspective.id) {
          setLockedPerspectiveId(closestPerspective.id);
          setActivePerspective(closestPerspective);
          setDiscoveredIds((prev) => new Set(prev).add(closestPerspective.id));
          triggerAudioTone(440 + closestPerspective.id * 50);

          // Highlight the locked wire mesh with emissive glow
          wireMeshes.forEach((m) => {
            if (m.userData.perspectiveId === closestPerspective.id) {
              m.material.emissive.setHex(0x10b981); // Radiant emerald
              m.material.emissiveIntensity = 0.9;
            } else {
              m.material.emissive.setHex(0x78350f);
              m.material.emissiveIntensity = 0.2;
            }
          });
        }
      } else {
        // In free orbit: reset glowing highlights
        wireMeshes.forEach((m) => {
          m.material.emissive.setHex(0x78350f);
          m.material.emissiveIntensity = 0.25;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Pointer Drag Events for Orbiting Camera
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      targetPolarRef.current = null; // Break automatic tween
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

      // Orbit sensitivity
      cameraPolarRef.current.theta -= deltaX * 0.007;
      cameraPolarRef.current.phi = Math.max(
        -Math.PI / 3.2,
        Math.min(Math.PI / 3.2, cameraPolarRef.current.phi + deltaY * 0.007)
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

  // Jump smoothly to a specific perspective
  const snapToPerspective = (perspective) => {
    setActivePerspective(perspective);
    setLockedPerspectiveId(perspective.id);
    setDiscoveredIds((prev) => new Set(prev).add(perspective.id));

    // Set target polar coordinates for smooth spherical camera tween
    targetPolarRef.current = {
      theta: perspective.angleTheta,
      phi: perspective.anglePhi,
      radius: 4.6
    };

    triggerAudioTone(440 + perspective.id * 50);
  };

  // Mark Chapter 6 complete when all 7 perspectives are discovered
  useEffect(() => {
    if (discoveredIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [discoveredIds, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar & Perspective Counter */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The 3D Anamorphic Scribble Sculpture
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Drag in 3D to rotate the tangled brass wire. Align the sightline to discover all 7 transformations.
            </p>
          </div>
        </div>

        {/* Discovery Progress Pill & Audio Mute */}
        <div className="flex items-center gap-2">
          {/* Alignment Meter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono">
            <span className="text-[#3d6350]">Alignment:</span>
            <span
              className={`font-bold ${
                alignmentScore >= 80 ? "text-emerald-700 font-extrabold" : "text-amber-700"
              }`}
            >
              {alignmentScore}% {alignmentScore >= 80 ? "✦ Locked" : "• Orbiting"}
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-serif font-bold shadow-2xs">
            Perspectives: {discoveredIds.size} / 7
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

      {/* 2. Main 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 w-full h-full touch-none select-none flex items-center justify-center">
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute w-[440px] h-[440px] rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />

        {/* Three.js Container */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Central Alignment Reticle HUD */}
        <div className="absolute pointer-events-none flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              alignmentScore >= 80
                ? "border-emerald-500 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.45)] ring-2 ring-emerald-200"
                : "border-emerald-300/40 opacity-40"
            }`}
          >
            <Sparkles
              className={`w-5 h-5 transition-colors ${
                alignmentScore >= 80 ? "text-emerald-600" : "text-emerald-300/50"
              }`}
            />
          </div>

          {alignmentScore >= 80 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-[10px] font-mono font-bold tracking-widest text-emerald-800 uppercase bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs"
            >
              Perspective 0{activePerspective.id} Locked
            </motion.span>
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
                    <PopFlower className="w-5 h-5 text-emerald-600" color="#a7f3d0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                      Perspective 0{activePerspective.id} // {activePerspective.faculty}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFullStoryModal(true)}
                    className="text-xs font-serif italic text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Read Full Story
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

      {/* 3. Bottom Perspective Navigation Bar */}
      <div className="z-20 w-full px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-serif font-bold text-[#132e22] shrink-0 hidden sm:inline">
          Perspectives:
        </span>

        {/* 7 Interactive Perspective Anchors */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {PERSPECTIVES.map((p) => {
            const isDiscovered = discoveredIds.has(p.id);
            const isSelected = activePerspective?.id === p.id;

            return (
              <button
                key={p.id}
                onClick={() => snapToPerspective(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs scale-105 ring-2 ring-emerald-300"
                    : isDiscovered
                    ? "bg-[#f0fdf4] text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                title={`Snap to Perspective 0${p.id}: ${p.name}`}
              >
                <span>0{p.id}</span>
                <span className="hidden md:inline">{p.faculty}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            snapToPerspective(PERSPECTIVES[0]);
          }}
          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Reset to Viewpoint 1"
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
                  <FlowerBlossom className="w-4 h-4" petalColor="#86efac" centerColor="#fef08a" />
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
