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
    title: "The 3 AM Co-Pilot & Dedicated Fixer",
    subtitle: "From Aloof Detachment to Her Dedicated Fixer",
    plinthLabel: "Plinth I // Support",
    medium: "Faceted Ice Crystals & Unfurling Botanical Blossom",
    accentColor: "#38bdf8",
    colorName: "Glacial Cyan",
    tagline: "Staying Up All Night in Her Corner",
    story: `Before you, I was completely detached, guarded, and wrapped up in my own head. Reluctant to get involved in anyone else’s problems or invest emotional energy into daily logistics. My default reflex was cold one-word replies and pretending nothing mattered.

Being with you turned me into your 24/7 co-pilot and personal support system. I stay up until 3:00 AM helping you format PPTs, research complex topics, clean up academic reports, and organize study decks whenever you're overwhelmed. 

'Send me what you have, I’ll format it' became second nature—staying on the call while you study and building custom tools just to make your life easier.`,
    quote: "You turned someone who used to be detached into the guy who will happily stay up all night making sure your world is taken care of."
  },
  {
    id: 2,
    title: "The 'Psychotherapist' Calm",
    subtitle: "Taming the Temper",
    plinthLabel: "Plinth II // Composure",
    medium: "Burnished Hexagonal Brass Lantern & Perpetual Candlelight",
    accentColor: "#f59e0b",
    colorName: "Amber Flame",
    tagline: "The Observant, Steady Listener",
    story: `I used to have hair-trigger frustration and an instant defensive reflex. If things went sideways, my reflex was to pace the floor, snap with a sharp tone, clench my jaw, and react immediately on impulse.

Being with you made me the observant, patient listener. Like our inside joke about The Silent Patient ('reading this book is like your POV if you were a psychotherapist'), I learned to take a breath, sit with your rants, absorb chaotic moments, and respond with steady reassurance instead of matching the stress.

I listen quietly without interrupting, ask 'what happened next?', and stay your calm center when everything else gets loud.`,
    quote: "You taught me that being strong isn't reacting with fire; it’s being the steady, calm listener when everything else is loud."
  },
  {
    id: 3,
    title: "Finding Conviction",
    subtitle: "Volume & Voice",
    plinthLabel: "Plinth III // Resonance",
    medium: "Studio Metallic Acoustic Capsule & Orbital Soundwave Rings",
    accentColor: "#10b981",
    colorName: "Vivid Emerald",
    tagline: "From a Silent Whisper to Real Conviction",
    story: `I kept my thoughts locked inside. I looked down, mumbled under my breath, and shrank away from asserting what I wanted, assuming people wouldn't care anyway.

Because you always gave me your full, undivided attention and genuinely cared about my thoughts, I stopped shrinking into the corner. You gave volume to my silence.

Now, I look you in the eye, voice what I need, and articulate ideas with confidence and real conviction.`,
    quote: "You gave volume to my silence because you were the first person who made me feel like my words actually carried weight."
  },
  {
    id: 4,
    title: "'Send the Other Three Info Ya'",
    subtitle: "Communication Over Ego",
    plinthLabel: "Plinth IV // Dialogue",
    medium: "Polished Walnut Café Table, Ceramic Mugs & Shared Plate",
    accentColor: "#f43f5e",
    colorName: "Rose Quartz",
    tagline: "Solving Life as a Team",
    story: `Early on, disagreements were stubborn, defensive battles where we fought to 'win' or prove a point with passive-aggressive distance and walking away mid-argument.

Over seven years, that dynamic completely transformed into true teamwork rhythm. No passive-aggressive silence or bruised pride. Even when deadlines, fatigue, or friction hit, it shifts into collaborative problem-solving, making tea, laughing through the tension, and saying 'let's sit down and figure this out together'.

We stopped fighting each other, and started solving life as a team.`,
    quote: "We stopped fighting each other and started solving life as a team."
  },
  {
    id: 5,
    title: "The Reality Check",
    subtitle: "Cutting Through Overthinking",
    plinthLabel: "Plinth V // Clarity",
    medium: "Optical Crystal Glass Prism on Gimbal Brass Mount",
    accentColor: "#eab308",
    colorName: "Golden Prism",
    tagline: "Cutting Straight Through the Noise",
    story: `My head used to dive into overthinking rabbit holes—restless pacing, internal spirals, catastrophizing, and insomnia over imagined worst-case scenarios. I lived inside stressful narratives of my own making.

You became my reality check. With your straightforward, no-nonsense clarity, you cut straight through the static and anchor me back to solid ground.

Talking it out with you for ten minutes makes me realize things are never as impossible as my head made them seem.`,
    quote: "Whenever my mind starts spiraling into a hundred 'what-ifs', you bring me right back to earth with one sentence."
  },
  {
    id: 6,
    title: "Her Number One Cheerleader",
    subtitle: "From Lone Wolf to Teammate",
    plinthLabel: "Plinth VI // Anchor",
    medium: "Forged Dark Jade Bronze Anchor with Coiled Maritime Rope",
    accentColor: "#059669",
    colorName: "Deep Jade",
    tagline: "No Longer Alone in the Arena",
    story: `I operated like a solitary fighter. I believed relying on anyone was a weakness, carried every burden alone, hid my stress, and kept emotional armor tightly strapped on.

Loving you made me unashamedly your partner and biggest cheerleader. Whether it’s building an entire 7-chapter anniversary suite, crafting desktop companion apps like CoupleStick, or celebrating every milestone you hit, I take genuine pride in your wins.

I stopped fighting life as a lone wolf, because I finally found a permanent anchor in my corner.`,
    quote: "I spent years thinking I had to fight life alone. Loving you made me realize how much better it is to have an anchor in your corner."
  },
  {
    id: 7,
    title: "The Culmination",
    subtitle: "October 2019 to Today",
    plinthLabel: "Plinth VII // Today",
    medium: "Cast Bronze Statue of a Man Holding a Radiant Lotus Core",
    accentColor: "#86efac",
    colorName: "Starlight Pearl",
    tagline: "The Man Standing Here Today",
    story: `Looking back at who I used to be—I was an insecure, guarded kid from October 2019 hiding behind nonchalance, unsure of his purpose, and reacting defensively to the world to avoid vulnerability.

Seven years of loving you, being held accountable by you, and sharing life with you turned that kid into a grounded, protective, reliable partner. 

I stand tall with calm shoulders, keep my promises, protect your peace, and live with real purpose. Seven years turned an insecure boy into the man standing here today.`,
    quote: "Seven years of loving you, being held accountable by you, and sharing life with you turned an insecure kid into the man standing here today."
  }
];

// Helper: Assembles genuine, multi-part, high-craft 3D sculptural objects for each pedestal
function createExhibit3DSculpture(id) {
  const group = new THREE.Group();

  switch (id) {
    case 1: {
      // 1. The Ice Rampart: Translucent faceted ice spires split open with a blooming golden sprout
      const iceMat = new THREE.MeshStandardMaterial({
        color: 0xbae6fd,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.25
      });

      // 6 Faceted Ice Crystal Spires
      const crystalPositions = [
        [-0.35, 0.45, 0.1, 0.18, 0.9, 5, -0.15],
        [0.35, 0.45, -0.1, 0.18, 0.9, 5, 0.15],
        [-0.55, 0.35, -0.15, 0.14, 0.7, 5, -0.25],
        [0.55, 0.35, 0.15, 0.14, 0.7, 5, 0.25],
        [-0.2, 0.6, -0.2, 0.16, 1.2, 5, -0.08],
        [0.2, 0.6, 0.2, 0.16, 1.2, 5, 0.08]
      ];

      crystalPositions.forEach(([x, y, z, r, h, seg, rotZ]) => {
        const crystal = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), iceMat);
        crystal.position.set(x, y, z);
        crystal.rotation.z = rotZ;
        group.add(crystal);
      });

      // Living golden botanical stem emerging through the central fracture
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.05, 0.35, 0.02),
        new THREE.Vector3(0.04, 0.75, -0.02),
        new THREE.Vector3(0, 1.05, 0)
      ]);
      const stemGeom = new THREE.TubeGeometry(stemCurve, 24, 0.022, 8, false);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.35,
        metalness: 0.2,
        emissive: 0x059669,
        emissiveIntensity: 0.3
      });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      group.add(stemMesh);

      // Unfurling blossom at apex
      const budGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const budMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.2,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.5
      });
      const budMesh = new THREE.Mesh(budGeom, budMat);
      budMesh.position.set(0, 1.08, 0);
      budMesh.scale.set(0.9, 1.4, 0.9);
      group.add(budMesh);

      // Two emerald leaves curling out
      const leafGeom = new THREE.ConeGeometry(0.1, 0.35, 4);
      const leaf1 = new THREE.Mesh(leafGeom, stemMat);
      leaf1.position.set(-0.12, 0.6, 0.05);
      leaf1.rotation.set(0.3, 0, Math.PI / 3);
      group.add(leaf1);

      const leaf2 = new THREE.Mesh(leafGeom, stemMat);
      leaf2.position.set(0.12, 0.8, -0.05);
      leaf2.rotation.set(-0.3, 0, -Math.PI / 3);
      group.add(leaf2);
      break;
    }
    case 2: {
      // 2. The Calmed Lantern: Burnished hexagonal brass lantern with glowing candle flame
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.28,
        metalness: 0.82
      });

      // Hexagonal base plate
      const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.08, 6), brassMat);
      basePlate.position.y = 0.04;
      group.add(basePlate);

      // 6 Vertical brass struts
      for (let i = 0; i < 6; i++) {
        const th = (i / 6) * Math.PI * 2;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85, 8), brassMat);
        strut.position.set(Math.cos(th) * 0.44, 0.48, Math.sin(th) * 0.44);
        group.add(strut);
      }

      // Translucent glass chamber
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35
      });
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.82, 6), glassMat);
      glass.position.y = 0.48;
      group.add(glass);

      // Pagoda roof canopy & chimney
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.38, 6), brassMat);
      roof.position.y = 1.08;
      group.add(roof);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.022, 8, 20), brassMat);
      ring.position.y = 1.35;
      group.add(ring);

      // Wax candle inside
      const candleMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.5 });
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.36, 16), candleMat);
      candle.position.y = 0.26;
      group.add(candle);

      // Glowing teardrop flame
      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.1,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.2
      });
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), flameMat);
      flame.position.y = 0.52;
      flame.scale.set(0.8, 1.8, 0.8);
      group.add(flame);

      // Real candle point light inside lantern
      const candleLight = new THREE.PointLight(0xfbbf24, 1.5, 3.5);
      candleLight.position.set(0, 0.52, 0);
      group.add(candleLight);
      break;
    }
    case 3: {
      // 3. The Resonant Voice: Vintage studio microphone & concentric orbital soundwaves
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.2,
        metalness: 0.85
      });

      // Circular weighted base stand & vertical neck
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.08, 24), chromeMat);
      base.position.y = 0.04;
      group.add(base);

      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 12), chromeMat);
      stand.position.y = 0.4;
      group.add(stand);

      // Microphone capsule & grille
      const capsule = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.45, 24), chromeMat);
      capsule.position.y = 0.92;
      group.add(capsule);

      const grille = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), chromeMat);
      grille.position.y = 1.15;
      group.add(grille);

      // 3 Concentric Glowing Orbital Soundwave Rings
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.2,
        metalness: 0.7,
        emissive: 0x10b981,
        emissiveIntensity: 0.8
      });

      const soundRadii = [0.45, 0.72, 1.0];
      soundRadii.forEach((rad, i) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.018, 8, 48), ringMat);
        ring.position.y = 1.05;
        ring.rotation.x = Math.PI / 4 + i * 0.12;
        ring.rotation.y = i * 0.4;
        group.add(ring);
      });
      break;
    }
    case 4: {
      // 4. The Dialogue Table: Miniature café table, two ceramic mugs & rising steam
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Walnut
        roughness: 0.4,
        metalness: 0.1
      });

      // Pedestal stand and round tabletop
      const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.08, 24), woodMat);
      tableBase.position.y = 0.04;
      group.add(tableBase);

      const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12), woodMat);
      tableLeg.position.y = 0.4;
      group.add(tableLeg);

      const tabletop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 36), woodMat);
      tabletop.position.y = 0.74;
      group.add(tabletop);

      // Two ceramic coffee mugs facing each other
      const mug1Mat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
      const mug1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.18, 16), mug1Mat);
      mug1.position.set(-0.32, 0.85, 0.05);
      group.add(mug1);

      const mug2Mat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.3 });
      const mug2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.18, 16), mug2Mat);
      mug2.position.set(0.32, 0.85, -0.05);
      group.add(mug2);

      // Central golden plate
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.03, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.6 })
      );
      plate.position.set(0, 0.78, 0);
      group.add(plate);

      // Rising steam loops connecting in heart arch
      const steamCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.32, 0.95, 0.05),
        new THREE.Vector3(-0.25, 1.15, 0.08),
        new THREE.Vector3(0, 1.35, 0),
        new THREE.Vector3(0.25, 1.15, -0.08),
        new THREE.Vector3(0.32, 0.95, -0.05)
      ]);
      const steamMesh = new THREE.Mesh(
        new THREE.TubeGeometry(steamCurve, 24, 0.014, 6, false),
        new THREE.MeshBasicMaterial({ color: 0xfecdd3, transparent: true, opacity: 0.65 })
      );
      group.add(steamMesh);
      break;
    }
    case 5: {
      // 5. The Grounded Lens: Optical triangular glass prism on brass gimbal stand
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.28,
        metalness: 0.85
      });

      // Tripod mount
      const mountBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.08, 24), brassMat);
      mountBase.position.y = 0.04;
      group.add(mountBase);

      const mountFork1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), brassMat);
      mountFork1.position.set(-0.32, 0.45, 0);
      group.add(mountFork1);

      const mountFork2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), brassMat);
      mountFork2.position.set(0.32, 0.45, 0);
      group.add(mountFork2);

      // Triangular Crystal Glass Prism
      const prismMat = new THREE.MeshStandardMaterial({
        color: 0xfef9c3,
        roughness: 0.08,
        metalness: 0.1,
        transparent: true,
        opacity: 0.78,
        emissive: 0xeab308,
        emissiveIntensity: 0.35
      });
      const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.75, 3), prismMat);
      prism.position.set(0, 0.82, 0);
      prism.rotation.z = Math.PI / 2;
      group.add(prism);

      // Vertical plumb laser beam of clarity shooting through center
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8), beamMat);
      beam.position.set(0, 0.82, 0);
      group.add(beam);

      // Focused disc target on plinth
      const target = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), brassMat);
      target.position.set(0, 0.14, 0);
      group.add(target);
      break;
    }
    case 6: {
      // 6. The Unshakable Anchor: Heavy maritime anchor with curved flukes and coiled rope
      const bronzeMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b, // Deep jade bronze
        roughness: 0.35,
        metalness: 0.8
      });

      // Vertical shank
      const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 1.15, 12), bronzeMat);
      shank.position.set(0, 0.65, 0);
      group.add(shank);

      // Top shackle ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 8, 20), bronzeMat);
      ring.position.set(0, 1.25, 0);
      group.add(ring);

      // Horizontal cross stock
      const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.82, 12), bronzeMat);
      stock.position.set(0, 1.05, 0);
      stock.rotation.z = Math.PI / 2;
      group.add(stock);

      // Curved lower flukes
      const fluke = new THREE.Mesh(
        new THREE.TorusGeometry(0.44, 0.048, 10, 24, Math.PI),
        bronzeMat
      );
      fluke.position.set(0, 0.35, 0);
      fluke.rotation.z = Math.PI;
      group.add(fluke);

      // Barbed palms on ends of flukes
      const palm1 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 4), bronzeMat);
      palm1.position.set(-0.44, 0.42, 0);
      palm1.rotation.z = -Math.PI / 3;
      group.add(palm1);

      const palm2 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 4), bronzeMat);
      palm2.position.set(0.44, 0.42, 0);
      palm2.rotation.z = Math.PI / 3;
      group.add(palm2);

      // Realistic coiled rope wrapping around shank
      const ropePoints = [];
      for (let i = 0; i <= 36; i++) {
        const t = (i / 36) * Math.PI * 6;
        ropePoints.push(
          new THREE.Vector3(
            Math.cos(t) * (0.08 + i * 0.003),
            0.15 + (i / 36) * 0.8,
            Math.sin(t) * (0.08 + i * 0.003)
          )
        );
      }
      const ropeSpline = new THREE.CatmullRomCurve3(ropePoints);
      const rope = new THREE.Mesh(
        new THREE.TubeGeometry(ropeSpline, 36, 0.02, 6, false),
        new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.8 })
      );
      group.add(rope);
      break;
    }
    case 7: {
      // 7. The Man Standing Tall: Classical cast bronze statue of a man holding radiant lotus core
      const statueMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // Polished bronze
        roughness: 0.25,
        metalness: 0.85
      });

      // Pedestal base block
      const statueBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.5), statueMat);
      statueBase.position.y = 0.04;
      group.add(statueBase);

      // Legs standing upright
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.7, 12), statueMat);
      leg1.position.set(-0.16, 0.42, 0);
      group.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.7, 12), statueMat);
      leg2.position.set(0.16, 0.42, 0);
      group.add(leg2);

      // Upright torso & broad shoulders
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.52, 16), statueMat);
      torso.position.set(0, 0.95, 0);
      group.add(torso);

      // Head held high with confident posture
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), statueMat);
      head.position.set(0, 1.34, 0);
      head.scale.set(0.85, 1.05, 0.85);
      group.add(head);

      // Arms clasped at chest holding the radiant core
      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.25, 1.15, 0),
        new THREE.Vector3(-0.18, 0.95, 0.16),
        new THREE.Vector3(0, 0.92, 0.18),
        new THREE.Vector3(0.18, 0.95, 0.16),
        new THREE.Vector3(0.25, 1.15, 0)
      ]);
      const arms = new THREE.Mesh(new THREE.TubeGeometry(armCurve, 16, 0.045, 8, false), statueMat);
      group.add(arms);

      // Glowing Starlight Lotus Heart in his hands
      const lotusMat = new THREE.MeshStandardMaterial({
        color: 0x86efac,
        roughness: 0.15,
        emissive: 0x10b981,
        emissiveIntensity: 1.1
      });
      const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), lotusMat);
      lotus.position.set(0, 0.95, 0.2);
      group.add(lotus);

      const lotusLight = new THREE.PointLight(0x86efac, 1.4, 2.5);
      lotusLight.position.set(0, 0.95, 0.22);
      group.add(lotusLight);
      break;
    }
    default:
      break;
  }

  return group;
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

  // Pedestal references
  const pedestalGroupsRef = useRef([]);
  const spotLightsRef = useRef([]);

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

  // Build the 3D Museum Hall Scene with Genuine 3D Sculptures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.4);
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

    // 2. Ambient Museum Hall Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    const hallLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    hallLight.position.set(5, 8, 6);
    scene.add(hallLight);

    // 3. Polished Emerald Marble Floor
    const floorGeom = new THREE.PlaneGeometry(60, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Polished deep emerald marble
      roughness: 0.15,
      metalness: 0.85
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Gallery Wall Backdrop
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

    EXHIBITS.forEach((exhibit, idx) => {
      const group = new THREE.Group();
      const xPos = idx * pedestalSpacing;
      group.position.set(xPos, 0, 0);
      scene.add(group);
      pedestalGroups.push(group);

      // A. Stone Pedestal Plinth
      const plinthGeom = new THREE.CylinderGeometry(0.88, 0.98, 1.3, 36);
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
      const collarGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.06, 36);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85
      });
      const collarMesh = new THREE.Mesh(collarGeom, collarMat);
      collarMesh.position.y = -0.28;
      group.add(collarMesh);

      // Floor Glow Rim
      const baseRimGeom = new THREE.RingGeometry(0.92, 1.18, 36);
      const baseRimMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(exhibit.accentColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      });
      const baseRimMesh = new THREE.Mesh(baseRimGeom, baseRimMat);
      baseRimMesh.rotation.x = -Math.PI / 2;
      baseRimMesh.position.y = -1.59;
      group.add(baseRimMesh);

      // B. Dedicated Ceiling Spotlight
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

      // C. THE AUTHENTIC 3D SCULPTURAL MASTERPIECE FOR THIS EXHIBIT
      const sculpture = createExhibit3DSculpture(exhibit.id);
      sculpture.position.set(0, -0.25, 0); // Perched directly atop brass collar
      group.add(sculpture);

      // Floating stardust particles around sculpture
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
        opacity: 0.65
      });
      const dustParticles = new THREE.Points(dustGeom, dustMat);
      dustParticles.position.set(0, 0.5, 0);
      group.add(dustParticles);
    });

    pedestalGroupsRef.current = pedestalGroups;
    spotLightsRef.current = spotLights;

    // 5. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera translation along the gallery hall
      camera.position.x += (targetCamXRef.current - camera.position.x) * 0.08;

      // Rotate each 3D sculpture; active sculpture responds to user drag spin
      pedestalGroupsRef.current.forEach((grp, idx) => {
        const sculp = grp.children[3]; // The 3D sculpture group
        if (sculp) {
          if (idx === activeIdx) {
            sculp.rotation.y = activeSpinRef.current + Math.sin(elapsed * 0.6) * 0.08;
          } else {
            sculp.rotation.y = elapsed * 0.35 + idx * 1.2;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Pointer Drag to Spin Active Sculpture 360°
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
                Chapter 6 // The Museum of Seven Transformations
              </span>
              <FlowerBlossom className="w-3.5 h-3.5" petalColor="#86efac" centerColor="#fef08a" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#3d6350] font-sans">
              Seven distinct sculptural installations on museum plinths. Drag horizontally to inspect each in 360°.
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
          <span>Drag horizontally on the sculpture to inspect in 360°</span>
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
