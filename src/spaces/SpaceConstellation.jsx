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

// The 8 Petals & Stories of the Rose
export const ROSE_PETALS = [
  {
    id: 1,
    order: 1,
    name: "Outer Petal I",
    title: "Where Two Aries Collided",
    yearBadge: "Year 01 // 2019",
    date: "October 2019 // The First Spark",
    summary: "Two headstrong souls who found their equal in each other.",
    story: `There was an instant, unspoken recognition between us from the very first talk. 

Two stubborn, fiery Aries who normally guard their independence fiercely—suddenly wanting to stay in the exact same room, talking for hours without running out of things to say. 

You weren't like anyone else I had ever met. You carried this fierce, quiet authenticity that immediately broke through all my defenses. That first spark wasn't just a moment; it was the foundation of our entire story.`,
    photoUrl: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=800&q=80",
    angle: 0.1,
    radius: 0.82,
    elevation: 0.15,
    tilt: 0.75,
    curl: 0.35,
    scale: 1.15
  },
  {
    id: 2,
    order: 2,
    name: "Outer Petal II",
    title: "Midnight Rain & Empty Roads",
    yearBadge: "Year 02 // 2020",
    date: "Year 02 // City Nights",
    summary: "Riding through rain at 1 AM with your arms around me.",
    story: `Some of my favorite memories with you don't cost a single rupee.

Like riding through torrential night rain when neither of us had any business being on the road. Water dripping from our helmets and soaking through our jackets, cold winds whipping past, and your hands tucked tightly into my pockets.

In that quiet midnight city, with nobody else around, I realized I would ride anywhere in the world as long as you were sitting behind me.`,
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    angle: 1.6,
    radius: 0.85,
    elevation: 0.18,
    tilt: 0.78,
    curl: 0.38,
    scale: 1.18
  },
  {
    id: 3,
    order: 3,
    name: "Outer Petal III",
    title: "The Corner Table & Crispy Fries",
    yearBadge: "Year 03 // 2021",
    date: "Year 03 // Favorite Café",
    summary: "Four hours passing like four minutes across a wooden table.",
    story: `Sitting across from you over iced coffees, watching the afternoon light shift into evening.

Splitting an order of extra crispy fries and silently leaving the crunchiest one at the bottom for you. The way we could talk about the most absurd, ridiculous thoughts one minute, and dive into our deepest family vulnerabilities the next.

With you, there was never any awkward silence—only comfort so deep it felt like breathing.`,
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    angle: 3.15,
    radius: 0.84,
    elevation: 0.22,
    tilt: 0.74,
    curl: 0.36,
    scale: 1.16
  },
  {
    id: 4,
    order: 4,
    name: "Outer Petal IV",
    title: "Learning Your Quiet Cadence",
    yearBadge: "Year 04 // 2022",
    date: "Year 04 // Inside Jokes",
    summary: "Understanding your silence and laughing through stubborn UNO rivalries.",
    story: `By year four, love was no longer a question—it had become our second nature.

I learned the subtle signs of when you were exhausted before you said a word. I learned how your laughter could instantly dismantle a bad day, and how seriously you take an UNO Draw 4 card.

We learned how to forgive quickly, how to tease gently, and how to hold space for each other when life felt heavy. You became my safest harbor.`,
    photoUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    angle: 4.7,
    radius: 0.83,
    elevation: 0.16,
    tilt: 0.72,
    curl: 0.34,
    scale: 1.14
  },
  {
    id: 5,
    order: 5,
    name: "Inner Petal V",
    title: "Your Fierce, Unshakable Heart",
    yearBadge: "Year 05 // 2023",
    date: "Year 05 // Benchmark of Integrity",
    summary: "The quiet courage and fierce loyalty that defines who you are.",
    story: `The thing I admire most about you is how unconditionally you stand by the people you love.

You never perform kindness for an audience. When someone is hurting, you show up. When things are difficult, you set your jaw, figure out what needs to be done, and do it with grace.

In five years of watching you grow, my respect for your character only deepened. You are the standard of integrity and honesty in my life.`,
    photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    angle: 0.85,
    radius: 0.54,
    elevation: 0.38,
    tilt: 0.52,
    curl: 0.28,
    scale: 0.96
  },
  {
    id: 6,
    order: 6,
    name: "Inner Petal VI",
    title: "Counting Gates & Time Zones",
    yearBadge: "Year 06 // 2024",
    date: "Year 06 // The Distance Anchor",
    summary: "Counting down airport gates, knowing distance could never dilute us.",
    story: `Distance tests everything. It tests patience, routines, and endurance.

Yet across busy schedules, departures, and counting down the days until we could sit in the same room again, our bond never wavered. Every late-night call and every countdown proved what we always knew:

Physical miles could never dilute what we built. We were anchored in each other long before the miles appeared.`,
    photoUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    angle: 2.8,
    radius: 0.52,
    elevation: 0.42,
    tilt: 0.55,
    curl: 0.26,
    scale: 0.94
  },
  {
    id: 7,
    order: 7,
    name: "Inner Petal VII",
    title: "Unshakable Home",
    yearBadge: "Year 07 // 2025",
    date: "Year 07 // The Sanctuary",
    summary: "In a chaotic noisy world, you are the peace I always come home to.",
    story: `At the end of an exhausting week, when the world demands too much and everything feels noisy—just sitting beside you cuts through all the static.

You don't need to give advice or solve my problems. Just resting your head on my shoulder or holding my hand reminds me of who I am.

In seven years, you turned love from a fleeting feeling into a permanent home.`,
    photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    angle: 4.95,
    radius: 0.5,
    elevation: 0.46,
    tilt: 0.48,
    curl: 0.24,
    scale: 0.92
  },
  {
    id: 8,
    order: 8,
    name: "The Core Heart Petal",
    title: "Seven Years & An Infinity Ahead",
    yearBadge: "October 2026 // Today & Forever",
    date: "Forever & Always",
    summary: "The final petal that blooms an entire garden of roses for you.",
    story: `This is the heart of the rose, and the center of my life.

I chose you seven years ago on a quiet evening, and I have chosen you every single morning since. 

There is no version of my future, no dream I want to build, and no horizon I look toward that doesn't have you standing by my side. Seven years of us was just the prologue.

To our next seven, our next seventy, and a lifetime of roses blooming for you. Happy 7th Anniversary, Mythri ♡`,
    photoUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    angle: 0,
    radius: 0.05,
    elevation: 0.65,
    tilt: 0.15,
    curl: 0.15,
    scale: 0.8
  }
];

// Helper: Build a natural double-curved 3D rose petal mesh geometry
function create3DPetalGeometry(width = 0.9, length = 1.3, curl = 0.35, cup = 0.35) {
  const segX = 24;
  const segY = 32;
  const geom = new THREE.PlaneGeometry(width, length, segX, segY);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    // Normalize coordinates: u in [-1, 1], v in [0, 1]
    const u = x / (width / 2);
    const v = (y + length / 2) / length;

    // Organic width profile: narrow base, wide heart-shaped waist, soft rounded apex
    const widthFactor = Math.pow(Math.sin(v * Math.PI), 0.72) * (1 - 0.2 * v);
    pos.setX(i, (u * width / 2) * widthFactor);

    // Double curvature: transverse cupping (like a spoon) and longitudinal curling
    const cupZ = -Math.pow(u, 2) * cup * Math.sin(v * Math.PI);
    let curlZ = Math.sin(v * Math.PI * 0.75) * curl;

    // Reflexed outer lip: tip curls backward gently catching rim light
    if (v > 0.68) {
      curlZ -= Math.pow((v - 0.68) / 0.32, 2) * (curl * 1.1);
    }

    // Subtle natural organic ruffle along the margin
    const ruffle = Math.sin(u * 10 + v * 5) * 0.025 * Math.sin(v * Math.PI);

    pos.setZ(i, cupZ + curlZ + ruffle);
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
  const [bloomedRosesEverywhere, setBloomedRosesEverywhere] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);

  // Set up the Three.js 3D Rose Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 5.2);
    camera.lookAt(0, -0.15, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Cinematic 3D Lighting
    const ambientLight = new THREE.AmbientLight(0x280512, 1.6);
    scene.add(ambientLight);

    // Warm Key Light (Directional from top-left)
    const keyLight = new THREE.DirectionalLight(0xfff1f2, 2.8);
    keyLight.position.set(-3.5, 4.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim Light (Directional from behind-right)
    const rimLight = new THREE.DirectionalLight(0xfb7185, 2.2);
    rimLight.position.set(3, 2, -2.5);
    scene.add(rimLight);

    // Soft Blue Water Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // Inner Glowing Warm Starlight in the center of the bloom
    const heartGlow = new THREE.PointLight(0xff85a1, 1.8, 3.5);
    heartGlow.position.set(0, 0.5, 0.2);
    scene.add(heartGlow);

    // 3. Water Pool Plane & Ripples
    const waterGeom = new THREE.CircleGeometry(2.2, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x07111e,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75
    });
    const waterPlane = new THREE.Mesh(waterGeom, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -1.85;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Expanding water ripple ring mesh
    const rippleGeom = new THREE.RingGeometry(0.01, 0.08, 48);
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

    // 4. Botanical Stem, Thorns, and Calyx Sepals
    const roseGroup = new THREE.Group();
    roseGroup.position.set(0, -0.1, 0);
    scene.add(roseGroup);

    // Natural curved stem spline
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(-0.06, -0.3, 0.04),
      new THREE.Vector3(0.04, -1.0, -0.03),
      new THREE.Vector3(-0.02, -1.5, 0.02),
      new THREE.Vector3(0, -1.85, 0)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.048, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.65,
      metalness: 0.08
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.castShadow = true;
    roseGroup.add(stemMesh);

    // Thorns
    const thornMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 });
    const thorn1 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), thornMat);
    thorn1.position.set(-0.08, -0.5, 0.04);
    thorn1.rotation.set(0, 0, Math.PI / 1.5);
    roseGroup.add(thorn1);

    const thorn2 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 8), thornMat);
    thorn2.position.set(0.06, -1.1, -0.02);
    thorn2.rotation.set(0, 0, -Math.PI / 1.5);
    roseGroup.add(thorn2);

    // Compound leaves
    const leafGeom = new THREE.PlaneGeometry(0.35, 0.65, 8, 8);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      roughness: 0.45,
      side: THREE.DoubleSide
    });
    const leaf1 = new THREE.Mesh(leafGeom, leafMat);
    leaf1.position.set(-0.35, -0.7, 0.05);
    leaf1.rotation.set(0.3, 0.2, Math.PI / 3);
    roseGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeom, leafMat);
    leaf2.position.set(0.35, -1.05, -0.02);
    leaf2.rotation.set(-0.2, -0.3, -Math.PI / 3.2);
    roseGroup.add(leaf2);

    // Calyx Sepals holding the flower base
    const sepalMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5, side: THREE.DoubleSide });
    for (let i = 0; i < 5; i++) {
      const sepalGeom = new THREE.ConeGeometry(0.06, 0.45, 6);
      const sepal = new THREE.Mesh(sepalGeom, sepalMat);
      const theta = (i * Math.PI * 2) / 5;
      sepal.position.set(Math.cos(theta) * 0.12, 0.28, Math.sin(theta) * 0.12);
      sepal.rotation.set(Math.sin(theta) * 0.65, 0, -Math.cos(theta) * 0.65);
      roseGroup.add(sepal);
    }

    // Permanent Receptacle Base (Holds bloom volume when petals fall)
    const baseBudGeom = new THREE.SphereGeometry(0.42, 20, 20);
    const baseBudMat = new THREE.MeshStandardMaterial({
      color: 0x58081f,
      roughness: 0.4,
      metalness: 0.05
    });
    const baseBud = new THREE.Mesh(baseBudGeom, baseBudMat);
    baseBud.position.set(0, 0.42, 0);
    baseBud.scale.set(0.9, 1.15, 0.9);
    roseGroup.add(baseBud);

    // 5. The 8 Interactive 3D Rose Petals
    const petalMeshes = [];
    petalMeshesRef.current = petalMeshes;

    ROSE_PETALS.forEach((petalData) => {
      const geom = create3DPetalGeometry(
        0.85 * petalData.scale,
        1.15 * petalData.scale,
        petalData.curl,
        petalData.tilt * 0.5
      );

      // Deep velvet crimson material with satin sheen
      const mat = new THREE.MeshStandardMaterial({
        color: petalData.id === 8 ? 0xe11d48 : 0xbe123c,
        roughness: 0.38,
        metalness: 0.04,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Position along concentric spiral chalice
      const angle = petalData.angle;
      const radius = petalData.radius;
      mesh.position.set(
        Math.cos(angle) * radius,
        petalData.elevation + 0.3,
        Math.sin(angle) * radius
      );

      // Rotate petal so it cups the center and flares outwards naturally
      mesh.rotation.y = -angle + Math.PI / 2;
      mesh.rotation.x = -petalData.tilt;

      // Center bud specific spiral
      if (petalData.id === 8) {
        mesh.rotation.set(-0.15, 0.4, 0);
        mesh.position.set(0, 0.62, 0);
      }

      mesh.userData = {
        id: petalData.id,
        petalData,
        originalPos: mesh.position.clone(),
        originalRot: mesh.rotation.clone(),
        plucked: false
      };

      roseGroup.add(mesh);
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
            m.material.emissive.setHex(0x440815);
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

      // Subtle gentle ambient sway of the rose
      roseGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.08;
      roseGroup.rotation.z = Math.cos(elapsed * 0.8) * 0.02;

      // Animate active falling petals
      for (let i = fallingPetalsRef.current.length - 1; i >= 0; i--) {
        const fp = fallingPetalsRef.current[i];
        fp.progress += 0.022;

        // Aerodynamic S-curve fluttering fall
        fp.mesh.position.y -= 0.055;
        fp.mesh.position.x += Math.sin(fp.progress * 8) * 0.025;
        fp.mesh.position.z += Math.cos(fp.progress * 6) * 0.015;

        fp.mesh.rotation.x += 0.06;
        fp.mesh.rotation.z += 0.04;

        // Petal hits water surface
        if (fp.mesh.position.y <= -1.82) {
          fp.mesh.position.y = -1.82;
          fp.mesh.rotation.x = Math.PI / 2;
          fp.mesh.rotation.z = Math.random() * Math.PI * 2;

          // Trigger water ripple
          if (ripplePlaneRef.current) {
            ripplePlaneRef.current.position.set(fp.mesh.position.x, -1.84, fp.mesh.position.z);
            ripplePlaneRef.current.material.opacity = 0.9;
            ripplePlaneRef.current.scale.set(0.1, 0.1, 0.1);
          }

          // Move from falling to resting collection
          restingPetalsRef.current.push(fp.mesh);
          fallingPetalsRef.current.splice(i, 1);
        }
      }

      // Animate resting petals floating gently on the water
      restingPetalsRef.current.forEach((mesh, idx) => {
        mesh.position.y = -1.82 + Math.sin(elapsed * 1.5 + idx) * 0.012;
      });

      // Animate water ripple fade & expand
      if (ripplePlaneRef.current && ripplePlaneRef.current.material.opacity > 0) {
        ripplePlaneRef.current.scale.x += 0.06;
        ripplePlaneRef.current.scale.y += 0.06;
        ripplePlaneRef.current.material.opacity -= 0.025;
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

    // Convert mesh to scene world coordinates and detach from roseGroup
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
        setBloomedRosesEverywhere(true);
        markSpaceCompleted("02-constellation");

        try {
          confetti({
            particleCount: 140,
            spread: 140,
            origin: { y: 0.6 },
            colors: ["#ef4444", "#f43f5e", "#fda4af", "#fecdd3", "#ffffff"]
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
      sceneRef.current.children[5].attach(mesh); // Reattach to roseGroup
    });

    fallingPetalsRef.current = [];
    restingPetalsRef.current = [];

    setFallenPetals(new Set());
    setActiveStory(null);
    setHoveredPetal(null);
    setBloomedRosesEverywhere(false);
    setShowGrandFinale(false);
  };

  const nextStory = () => {
    if (!activeStory) return;
    const curIdx = ROSE_PETALS.findIndex((p) => p.id === activeStory.id);
    const nextIdx = (curIdx + 1) % ROSE_PETALS.length;
    setActiveStory(ROSE_PETALS[nextIdx]);
  };

  const prevStory = () => {
    if (!activeStory) return;
    const curIdx = ROSE_PETALS.findIndex((p) => p.id === activeStory.id);
    const prevIdx = curIdx === 0 ? ROSE_PETALS.length - 1 : curIdx - 1;
    setActiveStory(ROSE_PETALS[prevIdx]);
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
                Chapter 2 // The 3D Rose of Seven Years
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#fda4af" centerColor="#fecdd3" />
            </div>
            <p className="text-[11px] text-rose-200/80 font-sans mt-0.5">
              {remainingPetalCount > 1
                ? `Click any 3D petal to pluck it into the water (${remainingPetalCount} petals left) ♡`
                : remainingPetalCount === 1
                ? "Only the 8th heart petal remains... Click to drop the core ♡"
                : "All eight petals have shed into the sea — a garden of roses blooms ♡"}
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Button */}
          {fallenPetals.size > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-rose-300/30 text-rose-200 hover:text-white transition-colors shadow-xl cursor-pointer"
              title="Reset 3D Rose"
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

      {/* 3. The 3D Three.js WebGL Rose Viewport */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Ambient Romantic Halo behind Rose */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

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
          className="relative w-[360px] h-[480px] sm:w-[460px] sm:h-[550px] flex items-center justify-center touch-none select-none drop-shadow-[0_20px_50px_rgba(225,29,72,0.45)]"
        />

        {/* Prompt Cue Below the Rose */}
        <div className="mt-2 text-center z-20">
          <p className="text-xs font-serif italic text-rose-200/90 tracking-wide">
            {remainingPetalCount > 1
              ? "Touch any 3D velvet petal to pluck it — watch it flutter into the water and reveal its story ♡"
              : remainingPetalCount === 1
              ? "The final heart petal holds our infinity... Click it to let it drop ♡"
              : "All 8 petals rest peacefully in the water. Click any floating petal to re-read its memory ♡"}
          </p>
        </div>
      </div>

      {/* 4. THE GRAND CLIMAX: ROSES BLOOMING EVERYWHERE! */}
      <AnimatePresence>
        {bloomedRosesEverywhere && (
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {BLOOMING_ROSES.map((rose) => (
              <motion.div
                key={rose.id}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.25, 1],
                  opacity: [0, 1, 0.95],
                  rotate: rose.rotation
                }}
                transition={{
                  duration: 0.9,
                  delay: rose.delay,
                  type: "spring",
                  stiffness: 220,
                  damping: 14
                }}
                style={{
                  left: rose.x,
                  top: rose.y,
                  width: rose.size,
                  height: rose.size
                }}
                className="absolute text-rose-400 drop-shadow-[0_8px_20px_rgba(244,63,94,0.5)]"
              >
                {/* 3D-styled Blooming Rose SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="44" fill="#881337" opacity="0.9" />
                  <path
                    d="M50,12 C28,28 22,62 45,88 C68,62 72,28 50,12 Z"
                    fill="#be123c"
                  />
                  <path
                    d="M18,45 C32,22 68,22 82,45 C68,78 32,78 18,45 Z"
                    fill="#e11d48"
                  />
                  <circle cx="50" cy="50" r="18" fill="#fb7185" />
                  <path
                    d="M44,46 C42,40 56,40 54,46 C52,54 44,54 44,48"
                    stroke="#fff1f2"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="50" cy="50" r="4" fill="#ffffff" />
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
                ALL EIGHT PETALS HAVE SHED INTO THE SEA
              </span>
              <h3 className="text-3xl font-serif font-bold text-[#132e22] mb-3">
                A Garden of Roses For You
              </h3>
              <p className="text-sm font-serif text-[#3d6350] leading-relaxed italic mb-6">
                "Each petal was a year we lived through. And when the heart of the rose fell, it didn't end—it sent ripples across the water, blooming a thousand more roses. I will love you through every season, Mythri."
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowGrandFinale(false)}
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-sans transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Admire the Blooming Sea of Roses ♡
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs font-sans transition-colors cursor-pointer"
                >
                  Re-bloom the Rose from the Start
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
