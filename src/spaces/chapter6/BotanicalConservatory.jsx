import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Info
} from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  PopFlower
} from "../../components/common/GirlyPopDecorations";

export const BOTANICAL_EXHIBITS = [
  {
    id: 1,
    title: "The Winter Lily",
    botanicalName: "Lilium candidum f. glaciale",
    plinthLabel: "Cloche I // 2019",
    medium: "Botanical Cloche // Translucent Glacial White Lily",
    modelPath: "/models/real_botanical_lily.obj",
    modelType: "obj",
    color: 0xbae6fd,
    accentColor: "#38bdf8",
    tagline: "The Melted Fortress: From Koyun to Devotion",
    story: `Before I met you, I was an exact mirror of Koyun from Ramparts of Ice. 

My vibe was aloof, guarded, and nonchalant. I acted like I didn't care about anything, and I never spoke to any girl. My independence was a frozen wall built to keep the world away.

You didn't fight that wall; you just showed up with genuine warmth until every layer of ice melted. Today, I am unashamedly a "girl's boy"—attentive to your world, learning your cadence, and proud to be the one who cares for you.`,
    quote: "You melted the ramparts of ice I hid behind, and taught me that softness is where real life begins."
  },
  {
    id: 2,
    title: "The Fiery Tiger Lily",
    botanicalName: "Lilium lancifolium",
    plinthLabel: "Cloche II // 2020",
    medium: "Botanical Cloche // Warm Flamed Petals & Amber Nectar",
    modelPath: "/models/03_fiery_tiger_lily.obj",
    modelType: "obj",
    color: 0xf59e0b,
    accentColor: "#f59e0b",
    tagline: "The Calmed Temper: From Flare-ups to Composure",
    story: `I used to be a hot head. Easily angered, quick to irritate, and defensive over the smallest friction. My first reflex was to snap and fight back.

Being with you taught me that losing my temper never solved a single problem. In seven years, you showed me how to hold my fire, breathe through chaos, and meet hardship with composure instead of hostility.

My fire didn't disappear; you just gave it a steady lantern so it didn't burn everything around me.`,
    quote: "You taught me that strength isn't shouting through a storm; it is the calm composure that outlasts it."
  },
  {
    id: 3,
    title: "The Resonant Blossom",
    botanicalName: "Blossom quadrivalvis",
    plinthLabel: "Cloche III // 2021",
    medium: "Botanical Cloche // Quad-Petal Resonant Blossom",
    modelPath: "/models/03_quaternius_blossom_4.glb",
    modelType: "glb",
    color: 0x10b981,
    accentColor: "#10b981",
    tagline: "Finding My Voice: From Mumble to Conviction",
    story: `I had a very silent voice. I kept my thoughts under my breath, shrank away from speaking up, and kept everything locked inside my head.

Because of you, I literally started speaking louder. You listened so attentively and made me feel so heard that I realized my voice had value. 

You pushed me to speak up, express what I think, and articulate what I need without shrinking down into a corner.`,
    quote: "You gave volume to my silence, and taught me that my voice deserves to be heard."
  },
  {
    id: 4,
    title: "The Twin Water Lily",
    botanicalName: "Nymphaea caerulea gemina",
    plinthLabel: "Cloche IV // 2022",
    medium: "Botanical Cloche // Floating Celestial Pad & Blooms",
    modelPath: "/models/04_celestial_water_lily.obj",
    modelType: "obj",
    color: 0xf43f5e,
    accentColor: "#f43f5e",
    tagline: "How We Communicate: From Battles to Dialogue",
    story: `Early on, when we disagreed, we had fiery, stubborn arguments where neither of us wanted to back down. We fought to win.

Over seven years, that dynamic completely transformed. Now, when tension happens, we sit down and patiently talk through it. We do real, unhurried communication.

We stopped fighting each other, and started fighting the problem together.`,
    quote: "We traded stubborn clashes for patient conversations, and turned arguments into deeper understanding."
  },
  {
    id: 5,
    title: "The Golden Asiatic Lily",
    botanicalName: "Lilium auratum persica",
    plinthLabel: "Cloche V // 2023",
    medium: "Botanical Cloche // Sunlight Prism Petals & Pistil",
    modelPath: "/models/05_asiatic_peach_lily.obj",
    modelType: "obj",
    color: 0xeab308,
    accentColor: "#eab308",
    tagline: "The Grounded Lens: Seeing Reality Clearly",
    story: `When life got overwhelming, my head would distort reality—magnifying small problems, anticipating the worst, and reacting out of panic.

You became my reality check. When everything in my mind is racing, you have this grounded clarity that strips away the fog and helps me see things objectively as they truly are.

You cut through all the static in my head and bring me back to solid ground.`,
    quote: "You are the lens that clears the fog, reminding me of what is real when my mind starts racing."
  },
  {
    id: 6,
    title: "The Subsurface Evergreen",
    botanicalName: "Phalaenopsis aeterna",
    plinthLabel: "Cloche VI // 2024",
    medium: "Botanical Cloche // Khronos PBR Subsurface Foliage",
    modelPath: "/models/02_khronos_subsurface_plant.glb",
    modelType: "glb",
    color: 0x059669,
    accentColor: "#059669",
    tagline: "The Anchor in the Corner: Partner in the Arena",
    story: `I operated like a solitary fighter. I believed that every burden had to be carried alone, and that relying on anyone was an invitation to be let down.

You became my steadfast support system. Through every exhaustion, career pivot, and stressful season, knowing you are standing in my corner changed how I face the world.

I stopped fighting life as a lone wolf, because I finally found my partner.`,
    quote: "Because of your unwavering support, I never have to walk into the arena alone again."
  },
  {
    id: 7,
    title: "The Sculpted Floral Crown",
    botanicalName: "Corona floralis virilis",
    plinthLabel: "Cloche VII // Today",
    medium: "Botanical Cloche // Classical Sculpted Botanical Flora",
    modelPath: "/models/05_gabmond_sculpted_flowers.glb",
    modelType: "glb",
    color: 0x86efac,
    accentColor: "#86efac",
    tagline: "Becoming a Man: The Culmination of Seven Years",
    story: `If the boy from October 2019 saw me today, he wouldn't recognize me. 

Back then, I was an angry, prickly kid hiding behind nonchalance. Seven years of loving you, being held accountable by you, and sharing life with you shaped me into who I am.

In plain words: I’ve become a man because of you. Calm, responsible, protective, and deeply at peace.`,
    quote: "Seven years with you turned a guarded boy into a grounded man. Everything I am today started with you."
  }
];

export default function BotanicalConservatory({ playChime }) {
  const { markSpaceCompleted } = useAnniversary();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [visitedIds, setVisitedIds] = useState(new Set([1]));
  const [audioMuted, setAudioMuted] = useState(false);
  const [showFullPlaque, setShowFullPlaque] = useState(false);

  const plinthGroupsRef = useRef([]);
  const spotLightsRef = useRef([]);
  const modelHoldersRef = useRef([]);

  // Drag interaction to spin active botanical specimen
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const activeSpinRef = useRef(0);
  const targetCamXRef = useRef(0);

  const activeExhibit = BOTANICAL_EXHIBITS[activeIdx];

  const triggerChime = useCallback(
    (freq = 440) => {
      if (audioMuted) return;
      if (playChime) playChime(freq, 0.55);
    },
    [audioMuted, playChime]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 4.2);
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

    // 2. Ambient & Natural Gallery Lights
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    sunLight.position.set(4, 7, 5);
    scene.add(sunLight);

    // 3. Polished Emerald Floor
    const floorGeom = new THREE.PlaneGeometry(60, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.16,
      metalness: 0.82
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Conservatory Wall
    const wallGeom = new THREE.PlaneGeometry(60, 15);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf7faf8,
      roughness: 0.95
    });
    const wallMesh = new THREE.Mesh(wallGeom, wallMat);
    wallMesh.position.set(0, 3, -6);
    scene.add(wallMesh);

    // 4. Loaders
    const gltfLoader = new GLTFLoader();
    const objLoader = new OBJLoader();

    // 5. Build 7 Pedestals with Glass Cloches & 3D Botanical Models
    const pedestalSpacing = 3.8;
    const plinthGroups = [];
    const spotLights = [];
    const modelHolders = [];

    BOTANICAL_EXHIBITS.forEach((exhibit, idx) => {
      const group = new THREE.Group();
      const xPos = idx * pedestalSpacing;
      group.position.set(xPos, 0, 0);
      scene.add(group);
      plinthGroups.push(group);

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

      // Burnished Brass Collar Ring
      const collarGeom = new THREE.CylinderGeometry(0.88, 0.88, 0.06, 36);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85
      });
      const collarMesh = new THREE.Mesh(collarGeom, collarMat);
      collarMesh.position.y = -0.28;
      group.add(collarMesh);

      // Glass Bell Jar Cloche (Dome)
      const clocheGroup = new THREE.Group();
      clocheGroup.position.set(0, -0.25, 0);

      const clocheGlassMat = new THREE.MeshStandardMaterial({
        color: 0xf0fdf4,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      });

      // Cylinder jar body
      const jarGeom = new THREE.CylinderGeometry(0.72, 0.72, 1.25, 32, 1, true);
      const jarMesh = new THREE.Mesh(jarGeom, clocheGlassMat);
      jarMesh.position.y = 0.625;
      clocheGroup.add(jarMesh);

      // Dome cap
      const domeGeom = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh = new THREE.Mesh(domeGeom, clocheGlassMat);
      domeMesh.position.y = 1.25;
      clocheGroup.add(domeMesh);

      // Cloche brass finial knob
      const finialMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), collarMat);
      finialMesh.position.y = 1.97;
      clocheGroup.add(finialMesh);

      group.add(clocheGroup);

      // Dedicated Spotlight
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

      // Dedicated Model Holder inside Cloche
      const holder = new THREE.Group();
      holder.position.set(0, -0.25, 0);
      group.add(holder);
      modelHolders.push(holder);

      // Fallback placeholder while loading (delicate glowing flower bud)
      const fallbackGeom = new THREE.SphereGeometry(0.18, 16, 16);
      const fallbackMat = new THREE.MeshStandardMaterial({
        color: exhibit.color,
        roughness: 0.3,
        emissive: exhibit.color,
        emissiveIntensity: 0.4
      });
      const fallbackMesh = new THREE.Mesh(fallbackGeom, fallbackMat);
      fallbackMesh.position.y = 0.55;
      holder.add(fallbackMesh);

      // Asynchronously Load Actual 3D Model
      const onLoadModel = (obj) => {
        // Clear fallback
        while (holder.children.length > 0) {
          holder.remove(holder.children[0]);
        }

        // Auto-scale and center inside cloche
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = 1.05 / maxDim;

        obj.scale.setScalar(targetScale);
        obj.position.sub(center.clone().multiplyScalar(targetScale));
        obj.position.y += 0.55;

        // Apply pleasant botanical materials if OBJ
        if (exhibit.modelType === "obj") {
          obj.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: exhibit.color,
                roughness: 0.35,
                metalness: 0.1,
                side: THREE.DoubleSide
              });
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        }

        holder.add(obj);
      };

      if (exhibit.modelType === "glb") {
        gltfLoader.load(
          exhibit.modelPath,
          (gltf) => onLoadModel(gltf.scene),
          undefined,
          () => {} // Keep fallback on any load error
        );
      } else {
        objLoader.load(
          exhibit.modelPath,
          (obj) => onLoadModel(obj),
          undefined,
          () => {}
        );
      }
    });

    plinthGroupsRef.current = plinthGroups;
    spotLightsRef.current = spotLights;
    modelHoldersRef.current = modelHolders;

    // 6. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera pan
      camera.position.x += (targetCamXRef.current - camera.position.x) * 0.08;

      // Rotate specimens inside cloches
      modelHoldersRef.current.forEach((holder, idx) => {
        if (idx === activeIdx) {
          holder.rotation.y = activeSpinRef.current + Math.sin(elapsed * 0.6) * 0.08;
        } else {
          holder.rotation.y = elapsed * 0.35 + idx * 1.2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 7. Pointer drag to spin specimen
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

  const selectExhibit = useCallback(
    (idx) => {
      setActiveIdx(idx);
      const targetExhibit = BOTANICAL_EXHIBITS[idx];
      setVisitedIds((prev) => new Set(prev).add(targetExhibit.id));

      targetCamXRef.current = idx * 3.8;
      activeSpinRef.current = 0;

      spotLightsRef.current.forEach((spot, i) => {
        spot.intensity = i === idx ? 4.5 : 1.1;
      });

      triggerChime(392 + idx * 55);
    },
    [triggerChime]
  );

  const nextExhibit = () => {
    const next = (activeIdx + 1) % BOTANICAL_EXHIBITS.length;
    selectExhibit(next);
  };

  const prevExhibit = () => {
    const prev = activeIdx === 0 ? BOTANICAL_EXHIBITS.length - 1 : activeIdx - 1;
    selectExhibit(prev);
  };

  useEffect(() => {
    if (visitedIds.size === 7 && markSpaceCompleted) {
      markSpaceCompleted("06-mythri-effect");
    }
  }, [visitedIds, markSpaceCompleted]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans bg-[#f7faf8] text-[#132e22]">
      {/* 1. Header Toolbar */}
      <div className="z-20 px-4 sm:px-6 pt-2.5 pb-2 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-bold text-[#132e22]">
                Wing I // The Botanical Conservatory
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Seven authentic 3D botanical specimens preserved under museum glass cloches. Drag horizontally to inspect 360°.
            </p>
          </div>
        </div>

        {/* Cloche Selector & Audio */}
        <div className="flex items-center gap-2">
          {/* Quick Buttons */}
          <div className="flex items-center gap-1 bg-[#f0fdf4] p-1 rounded-2xl border border-emerald-200">
            {BOTANICAL_EXHIBITS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => selectExhibit(idx)}
                className={`px-2 py-0.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeIdx === idx
                    ? "bg-emerald-700 text-white shadow-xs scale-105"
                    : "text-[#3d6350] hover:text-[#132e22]"
                }`}
              >
                0{item.id}
              </button>
            ))}
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
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Floating Curatorial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeExhibit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-20 pointer-events-auto"
          >
            <div className="bg-[#fffdfa]/95 backdrop-blur-md border-2 border-emerald-300 rounded-[28px] p-5 shadow-2xl relative overflow-hidden text-[#132e22]">
              {/* Washi Tape */}
              <div className="absolute -top-1.5 right-10 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: activeExhibit.accentColor }}
                    className="w-2.5 h-2.5 rounded-full inline-block"
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                    {activeExhibit.plinthLabel} // {activeExhibit.botanicalName}
                  </span>
                </div>
                <button
                  onClick={() => setShowFullPlaque(true)}
                  className="text-xs font-serif italic text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
                >
                  Read Plaque
                </button>
              </div>

              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#132e22] mb-0.5">
                {activeExhibit.title}
              </h4>
              <p className="text-[11px] font-mono text-emerald-700 mb-2 font-bold">
                {activeExhibit.medium}
              </p>

              <p className="text-xs sm:text-sm font-sans text-[#3d6350] leading-relaxed line-clamp-2 mb-2.5">
                {activeExhibit.story}
              </p>

              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <p className="text-xs font-serif italic text-emerald-950 font-medium">
                  "{activeExhibit.quote}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Bottom Footer Navigation */}
      <div className="z-20 px-4 sm:px-6 py-2.5 flex items-center justify-between bg-white/95 backdrop-blur-md border-t border-emerald-200/80 text-xs font-sans">
        <button
          onClick={prevExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-serif font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Cloche</span>
        </button>

        <span className="font-mono text-xs text-[#3d6350]">
          Specimen 0{activeIdx + 1} of 0{BOTANICAL_EXHIBITS.length}
        </span>

        <button
          onClick={nextExhibit}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>Next Cloche</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Full Plaque Modal */}
      <AnimatePresence>
        {showFullPlaque && (
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
              <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-80" color="bg-emerald-200" />
              </div>

              <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: activeExhibit.accentColor }}
                    className="w-3 h-3 rounded-full inline-block"
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
              <p className="text-xs font-mono italic text-emerald-700 font-bold mb-1">
                {activeExhibit.botanicalName}
              </p>
              <p className="text-xs font-mono uppercase text-emerald-800 font-bold mb-3">
                {activeExhibit.tagline}
              </p>

              <div className="text-sm font-sans text-[#3d6350] leading-relaxed whitespace-pre-line mb-6 max-h-56 overflow-y-auto pr-1">
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
