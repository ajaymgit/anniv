import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Maximize2
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

export const SHADOW_EXHIBITS = [
  {
    id: 1,
    angleDeg: 0,
    title: "Shadow I // The Ice Rampart",
    subtitle: "The Boy Behind the Wall (2019)",
    theme: "Melting the Ice Fortress",
    medium: "Cast Shadow of Faceted Brass Assemblage on Museum Wall",
    silhouetteName: "The Hooded Boy Behind Ice Shards",
    accentColor: "#38bdf8",
    story: `Before I met you, I was an exact mirror of Koyun from Ramparts of Ice. 

My vibe was aloof, guarded, and nonchalant. I acted like I didn't care about anything, and I never spoke to any girl. My independence was an icy fortress built to keep the world away.

You didn't fight that wall; you just showed up with genuine warmth until every layer of ice melted. Today, I am unashamedly a "girl's boy"—attentive to your world, learning your cadence, and proud to be the one who cares for you.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins."
  },
  {
    id: 2,
    angleDeg: 120,
    title: "Shadow II // The Two on the Bike",
    subtitle: "Finding the Rhythm (The Turning Point)",
    theme: "Speaking Loud & Patient Talk",
    medium: "Cast Shadow of Faceted Brass Assemblage on Museum Wall",
    silhouetteName: "The Two on the Bike in the Rain",
    accentColor: "#f59e0b",
    story: `I had a very silent voice and a hot-headed temper that flared up over the smallest friction. Early on, disagreements were fiery clashes where neither of us wanted to back down.

Being with you transformed both. You listened so attentively that I literally learned to speak louder and with conviction. And instead of hot-headed arguments, we learned how to sit down and patiently talk through everything.

Like riding through torrential midnight rain on the bike with your arms around me—you became the comfort that outlasts every storm.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding."
  },
  {
    id: 3,
    angleDeg: 240,
    title: "Shadow III // The Man Standing Tall",
    subtitle: "The Man I Am Today (2026)",
    theme: "The Grounded Anchor & Becoming a Man",
    medium: "Cast Shadow of Faceted Brass Assemblage on Museum Wall",
    silhouetteName: "The Grounded Man Standing Tall With Her",
    accentColor: "#10b981",
    story: `When my head used to race and distort reality, you became my reality check. You have this grounded clarity that cuts through the fog and helps me see things objectively as they truly are.

Through every career pivot, exhaustion, and hard season, you were the steadfast support system in my corner. I stopped fighting life as a lone wolf because I finally found my partner.

If the boy from 2019 saw me today, he wouldn't recognize me. In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you."
  }
];

// High-fidelity SVG Silhouette paths for the 3 distinct cast shadows on the museum wall
function ShadowSilhouetteSVG({ exhibitId, morphFactor = 1 }) {
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full filter drop-shadow-[0_4px_16px_rgba(6,78,59,0.25)] transition-all duration-300"
      style={{ opacity: Math.max(0.2, morphFactor) }}
    >
      {exhibitId === 1 && (
        <g fill="#0f172a" fillRule="evenodd">
          {/* 1. THE ICE RAMPARTS: Jagged icy fortress & boy sitting hooded with knees up */}
          {/* Jagged Ice Wall Shards */}
          <polygon points="40,460 70,220 110,310 140,160 180,270 210,120 240,240 270,140 310,290 350,180 390,320 430,210 460,460" />
          <polygon points="60,460 90,290 130,380 170,260 220,400 270,270 320,410 380,280 440,460" opacity="0.8" />
          {/* Center Fracture fissure */}
          <polygon points="250,460 240,320 260,260 235,210 255,160 245,120 255,120 265,160 245,210 270,260 250,320 260,460" fill="#f8fafc" />
          {/* Hooded Boy sitting curled behind the wall */}
          {/* Hood head */}
          <circle cx="210" cy="270" r="28" fill="#0f172a" />
          {/* Slouched back & torso */}
          <path d="M185,290 C170,330 175,390 195,430 L260,430 C270,390 260,330 235,290 Z" />
          {/* Drawn up knees */}
          <ellipse cx="245" cy="380" rx="35" ry="25" />
          <ellipse cx="230" cy="405" rx="30" ry="20" />
        </g>
      )}

      {exhibitId === 2 && (
        <g fill="#0f172a">
          {/* 2. THE TWO ON THE BIKE IN THE RAIN */}
          {/* Motorcycle Wheels */}
          <circle cx="130" cy="390" r="55" />
          <circle cx="130" cy="390" r="30" fill="#f8fafc" />
          <circle cx="370" cy="390" r="55" />
          <circle cx="370" cy="390" r="30" fill="#f8fafc" />
          {/* Motorcycle Body Chassis & Exhaust */}
          <path d="M130,390 L210,320 L290,320 L370,390 L320,405 L210,400 Z" />
          <path d="M290,320 L330,270 L345,280 L310,335 Z" /> {/* Handlebars */}
          <polygon points="120,400 240,405 230,420 100,415" /> {/* Exhaust pipe */}
          {/* Rider 1 (Ajay) leaning forward on handlebars */}
          <circle cx="280" cy="225" r="26" /> {/* Helmet */}
          <path d="M260,250 C240,280 230,330 240,360 L290,355 C300,310 295,270 285,250 Z" /> {/* Torso */}
          <path d="M275,260 L330,275 L320,290 L270,275 Z" /> {/* Arms to handlebars */}
          {/* Rider 2 (Mythri) sitting close behind, arms wrapped around */}
          <circle cx="215" cy="210" r="24" /> {/* Helmet / Head */}
          {/* Ponytail / hair blowing backward */}
          <path d="M195,215 Q140,210 120,235 Q160,240 195,230 Z" />
          {/* Torso leaning into his back */}
          <path d="M195,235 C185,270 185,320 205,355 L245,355 C235,310 225,260 225,235 Z" />
          {/* Her arms wrapped tightly around his waist */}
          <path d="M210,260 C235,265 265,270 270,290 C265,305 235,295 210,285 Z" />
          {/* Rain streaks slashing through the air */}
          <line x1="80" y1="100" x2="60" y2="160" stroke="#0f172a" strokeWidth="3" opacity="0.4" />
          <line x1="180" y1="80" x2="160" y2="140" stroke="#0f172a" strokeWidth="3" opacity="0.4" />
          <line x1="300" y1="90" x2="280" y2="150" stroke="#0f172a" strokeWidth="3" opacity="0.4" />
          <line x1="420" y1="110" x2="400" y2="170" stroke="#0f172a" strokeWidth="3" opacity="0.4" />
        </g>
      )}

      {exhibitId === 3 && (
        <g fill="#0f172a">
          {/* 3. THE GROWN MAN STANDING TALL WITH HER */}
          {/* Ground shadow plane */}
          <ellipse cx="250" cy="450" rx="160" ry="18" opacity="0.3" />
          {/* Ajay (The Man) Standing Tall on Left */}
          <circle cx="210" cy="130" r="30" /> {/* Head held high */}
          {/* Strong broad shoulders & upright posture */}
          <path d="M150,180 L270,180 L250,290 L170,290 Z" /> {/* Torso */}
          <polygon points="170,290 205,290 200,445 175,445" /> {/* Left leg */}
          <polygon points="215,290 250,290 245,445 220,445" /> {/* Right leg */}
          <path d="M150,180 L135,270 L155,270 L168,195 Z" /> {/* Left arm at side */}
          {/* Mythri Standing Beside Him on Right */}
          <circle cx="310" cy="165" r="26" /> {/* Her Head */}
          <path d="M290,190 Q270,250 280,310 L345,310 Q355,250 335,190 Z" /> {/* Dress / Torso */}
          <polygon points="295,310 310,310 305,445 295,445" /> {/* Legs */}
          <polygon points="320,310 335,310 330,445 320,445" />
          {/* Their Clasping Hands in the Center */}
          <path d="M255,200 L275,270 L295,255 L285,200 Z" />
          <circle cx="280" cy="270" r="10" /> {/* Intertwined hands */}
          {/* Blooming Starlight flower in his chest */}
          <path d="M210,210 Q200,195 210,185 Q220,195 210,210 Z" fill="#f8fafc" />
        </g>
      )}
    </svg>
  );
}

export default function ShadowArtGallery({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const assemblageMeshRef = useRef(null);
  const spotLightRef = useRef(null);
  const lightConeMeshRef = useRef(null);

  // Spotlight angle state: 0 to 360 degrees
  const [lightAngleDeg, setLightAngleDeg] = useState(0);
  const [activeExhibit, setActiveExhibit] = useState(SHADOW_EXHIBITS[0]);
  const [alignmentScore, setAlignmentScore] = useState(100);
  const [discoveredIds, setDiscoveredIds] = useState(new Set([1]));
  const [audioMuted, setAudioMuted] = useState(false);
  const [showFullStoryModal, setShowFullStoryModal] = useState(false);
  const isDraggingRef = useRef(false);

  // Audio Chime Trigger
  const triggerAudioTone = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  // Set up Three.js 3D Gallery & Abstract Assemblage Sculpture Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.8);
    camera.lookAt(0, -0.1, 0);
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

    // 2. Ambient Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.2);
    scene.add(ambientLight);

    // Warm ceiling gallery wash
    const ceilingWash = new THREE.DirectionalLight(0xfef08a, 1.2);
    ceilingWash.position.set(0, 6, 2);
    scene.add(ceilingWash);

    // 3. Polished Museum Floor
    const floorGeom = new THREE.PlaneGeometry(16, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Polished deep emerald marble
      roughness: 0.18,
      metalness: 0.8
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.65;
    scene.add(floorMesh);

    // Museum Plinth (Stone pedestal in center)
    const plinthGeom = new THREE.CylinderGeometry(0.75, 0.85, 1.1, 36);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xf0fdf4,
      roughness: 0.5,
      metalness: 0.08
    });
    const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
    plinthMesh.position.y = -1.1;
    scene.add(plinthMesh);

    // Brass plinth collar
    const collarGeom = new THREE.CylinderGeometry(0.78, 0.78, 0.05, 36);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85
    });
    const collarMesh = new THREE.Mesh(collarGeom, collarMat);
    collarMesh.position.y = -0.53;
    scene.add(collarMesh);

    // 4. The 3D Abstract Assemblage Sculpture (Faceted brass prisms and floating cubes)
    // Inspired by Shigeo Fukuda / Kumi Yamashita / Gödel Escher Bach
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(0, 0.25, 0);
    scene.add(sculptureGroup);
    assemblageMeshRef.current = sculptureGroup;

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.28,
      metalness: 0.82
    });

    // Assemblage of interlocking faceted geometries
    const blockSizes = [
      [0.6, 0.8, 0.5, 0, 0, 0, 0.3, 0.4],
      [0.4, 0.5, 0.7, -0.3, 0.3, 0.2, -0.5, 0.2],
      [0.5, 0.4, 0.6, 0.35, -0.25, -0.15, 0.4, -0.6],
      [0.3, 0.7, 0.35, -0.25, -0.35, 0.25, 0.2, 0.8],
      [0.45, 0.3, 0.45, 0.2, 0.45, -0.2, -0.3, 0.5],
      [0.25, 0.6, 0.3, 0.0, 0.6, 0.1, 0.6, -0.2],
      [0.35, 0.35, 0.5, -0.4, -0.1, -0.25, -0.2, -0.4]
    ];

    blockSizes.forEach(([w, h, d, x, y, z, rx, ry]) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, brassMat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sculptureGroup.add(mesh);
    });

    // 5. The Dynamic Gallery Spotlight & Light Beam Cone
    const spot = new THREE.SpotLight(0xfef08a, 4.8, 14, Math.PI / 4.5, 0.3, 1);
    spot.castShadow = true;
    spot.target = sculptureGroup;
    scene.add(spot);
    spotLightRef.current = spot;

    // Visual translucent spotlight beam cone
    const coneGeom = new THREE.ConeGeometry(1.6, 4.2, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const coneMesh = new THREE.Mesh(coneGeom, coneMat);
    scene.add(coneMesh);
    lightConeMeshRef.current = coneMesh;

    // 6. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle breathing ambient sway of the assemblage sculpture
      sculptureGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.04;
      sculptureGroup.rotation.z = Math.cos(elapsed * 0.5) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

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
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update 3D Spotlight position whenever lightAngleDeg changes
  useEffect(() => {
    if (!spotLightRef.current || !lightConeMeshRef.current) return;

    const rad = (lightAngleDeg * Math.PI) / 180;
    const distance = 4.2;
    const height = 2.4;

    // Orbit spotlight around the sculpture
    const lightX = Math.sin(rad) * distance;
    const lightZ = Math.cos(rad) * distance;

    spotLightRef.current.position.set(lightX, height, lightZ);

    // Position light cone between light and sculpture
    const cone = lightConeMeshRef.current;
    cone.position.set(lightX * 0.5, height * 0.5, lightZ * 0.5);
    cone.lookAt(0, 0.25, 0);
    cone.rotateX(-Math.PI / 2);

    // Calculate alignment to nearest key angle (0, 120, 240)
    let bestDist = 999;
    let closestExhibit = SHADOW_EXHIBITS[0];

    SHADOW_EXHIBITS.forEach((ex) => {
      // Circular angular distance
      let diff = Math.abs(lightAngleDeg - ex.angleDeg);
      if (diff > 180) diff = 360 - diff;
      if (diff < bestDist) {
        bestDist = diff;
        closestExhibit = ex;
      }
    });

    // Score from 0 to 100% (within 14 deg is 100% lock)
    const score = Math.max(0, Math.min(100, Math.round((1 - bestDist / 35) * 100)));
    setAlignmentScore(score);

    if (score >= 80) {
      if (activeExhibit.id !== closestExhibit.id) {
        setActiveExhibit(closestExhibit);
        setDiscoveredIds((prev) => new Set(prev).add(closestExhibit.id));
        triggerAudioTone(440 + closestExhibit.id * 80);
      }
    }
  }, [lightAngleDeg, activeExhibit, triggerAudioTone]);

  // Jump smoothly to a key angle
  const snapToExhibit = (ex) => {
    setActiveExhibit(ex);
    setLightAngleDeg(ex.angleDeg);
    setDiscoveredIds((prev) => new Set(prev).add(ex.id));
    triggerAudioTone(440 + ex.id * 80);
  };

  // Mark space completed when all 3 shadows have been discovered
  useEffect(() => {
    if (discoveredIds.size === 3 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [discoveredIds, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <RibbonBow className="w-6 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Chapter 6 // The 3D Spotlight Shadow Museum
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Drag the gallery spotlight around the abstract sculpture to cast 3 sharp shadows on the museum wall
            </p>
          </div>
        </div>

        {/* Alignment & HUD Controls */}
        <div className="flex items-center gap-2">
          {/* Spotlight Alignment Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-emerald-200 text-xs font-mono">
            <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            <span className="text-[#3d6350]">Light Angle: {Math.round(lightAngleDeg)}°</span>
            <span
              className={`font-bold ${
                alignmentScore >= 80 ? "text-emerald-700 font-extrabold" : "text-amber-700"
              }`}
            >
              ({alignmentScore >= 80 ? "✦ Shadow Locked" : "Scattered"})
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-serif font-bold shadow-2xs">
            Shadows: {discoveredIds.size} / 3
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

      {/* 2. Main Gallery Room: 3D Sculpture Foreground + The Sharp Museum Wall Shadow Background */}
      <div className="relative flex-1 w-full h-full select-none flex items-center justify-center overflow-hidden">
        {/* A. The Clean Museum Canvas Back Wall where the crisp shadow projection is cast */}
        <div className="absolute inset-x-4 sm:inset-x-12 top-6 bottom-24 bg-white/95 rounded-[36px] border-2 border-emerald-200/90 shadow-2xl flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Subtle Canvas Grain */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Dynamic Projected Shadow Silhouette on the wall */}
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            <ShadowSilhouetteSVG
              exhibitId={activeExhibit.id}
              morphFactor={alignmentScore >= 80 ? 1 : Math.max(0.2, alignmentScore / 100)}
            />
          </div>

          {/* Wall Label Plaque Stencil */}
          <div className="absolute top-6 left-8 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>Museum Wall • Projected Shadow</span>
            <span>//</span>
            <span className="text-emerald-700 font-bold">{activeExhibit.silhouetteName}</span>
          </div>
        </div>

        {/* B. The 3D Scene Foreground (Abstract Brass Assemblage on Plinth + Spotlight) */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        />

        {/* C. Interactive Spotlight Arc Scrubber HUD */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-emerald-200 rounded-full px-4 py-2 shadow-md flex items-center gap-3 z-20">
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-mono text-[#3d6350] shrink-0 hidden sm:inline">Orbit Light:</span>
          <input
            type="range"
            min="0"
            max="359"
            value={lightAngleDeg}
            onChange={(e) => setLightAngleDeg(Number(e.target.value))}
            className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-xs font-mono font-bold text-emerald-800 shrink-0 w-12 text-right">
            {Math.round(lightAngleDeg)}°
          </span>
        </div>

        {/* D. Floating Curatorial Card when a Shadow Locks */}
        <AnimatePresence mode="wait">
          {activeExhibit && (
            <motion.div
              key={activeExhibit.id}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-30 pointer-events-auto"
            >
              <div className="bg-[#fffdfa]/95 backdrop-blur-md border-2 border-emerald-300 rounded-[28px] p-5 sm:p-6 shadow-2xl relative overflow-hidden text-[#132e22]">
                {/* Washi Tape */}
                <div className="absolute -top-1.5 right-10 pointer-events-none">
                  <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
                </div>

                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: activeExhibit.accentColor }}
                      className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                      {activeExhibit.title} // {activeExhibit.theme}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowFullStoryModal(true)}
                    className="text-xs font-serif italic text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Read Full Story
                  </button>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-0.5">
                  {activeExhibit.subtitle}
                </h4>
                <p className="text-[11px] font-mono text-emerald-700 mb-2 font-bold">
                  {activeExhibit.medium}
                </p>

                <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed line-clamp-2 mb-3">
                  {activeExhibit.story}
                </p>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <p className="text-xs font-serif italic text-emerald-950 font-medium">
                    "{activeExhibit.quote}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Key Shadow Selector Bar */}
      <div className="z-20 w-full px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-serif font-bold text-[#132e22] shrink-0 hidden sm:inline">
          Cast Shadows:
        </span>

        {/* 3 Direct Snap Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-center">
          {SHADOW_EXHIBITS.map((ex) => {
            const isSelected = activeExhibit?.id === ex.id && alignmentScore >= 80;
            const isDiscovered = discoveredIds.has(ex.id);

            return (
              <button
                key={ex.id}
                onClick={() => snapToExhibit(ex)}
                style={{
                  borderColor: isSelected ? ex.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${ex.accentColor}55` : undefined
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-xs scale-105 ring-2 ring-emerald-300"
                    : isDiscovered
                    ? "bg-[#f0fdf4] text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span
                  style={{ backgroundColor: ex.accentColor }}
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-2xs"
                />
                <span>{ex.title}</span>
                <span className="text-[10px] font-mono opacity-80">({ex.angleDeg}°)</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => snapToExhibit(SHADOW_EXHIBITS[0])}
          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Reset to Shadow 01"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Full Story Reading Modal */}
      <AnimatePresence>
        {showFullStoryModal && activeExhibit && (
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
                    style={{ backgroundColor: activeExhibit.accentColor }}
                    className="w-3 h-3 rounded-full inline-block shadow-xs"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    {activeExhibit.title} // Curatorial Story
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
                {activeExhibit.subtitle}
              </h3>
              <p className="text-xs font-mono uppercase text-emerald-700 font-bold mb-1">
                {activeExhibit.theme}
              </p>
              <p className="text-xs font-mono text-[#3d6350] italic mb-4">
                Cast Silhouette: {activeExhibit.silhouetteName}
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
