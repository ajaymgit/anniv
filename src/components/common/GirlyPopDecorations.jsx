import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Color palettes for the 5-petal flower from user's image
export const FLOWER_PALETTES = {
  pink: {
    name: "Matcha Mint",
    petalFill: "#dcfce7",     // soft mint sage
    petalStroke: "#4ade80",   // fresh green outline
    centerFill: "#fef08a",    // sunny buttercup yellow
    centerStroke: "#eab308",  // warm golden amber outline
    highlight: "#ffffff"
  },
  lavender: {
    name: "Lavender Haze",
    petalFill: "#f3e8ff",     // soft lilac
    petalStroke: "#c084fc",   // sweet purple outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  buttercup: {
    name: "Buttercup Yellow",
    petalFill: "#fef9c3",     // soft pastel butter
    petalStroke: "#eab308",   // golden outline
    centerFill: "#fed7aa",    // peach center
    centerStroke: "#f97316",
    highlight: "#ffffff"
  },
  peach: {
    name: "Peach Blossom",
    petalFill: "#ffedd5",     // soft warm peach
    petalStroke: "#fb923c",   // coral outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  mint: {
    name: "Matcha Mint",
    petalFill: "#dcfce7",     // soft mint sage
    petalStroke: "#4ade80",   // fresh green outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  sky: {
    name: "Forget-Me-Not Sky",
    petalFill: "#e0f2fe",     // soft baby blue
    petalStroke: "#60a5fa",   // sky outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  rose: {
    name: "Rose Water",
    petalFill: "#ffe4e6",     // delicate rose
    petalStroke: "#fb7185",   // raspberry outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  white: {
    name: "Vanilla Daisy",
    petalFill: "#ffffff",     // pure marshmallow white
    petalStroke: "#4ade80",   // pink outline
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  },
  coral: {
    name: "Sweet Coral",
    petalFill: "#ffe4e1",
    petalStroke: "#f87171",
    centerFill: "#fef08a",
    centerStroke: "#eab308",
    highlight: "#ffffff"
  }
};

/**
 * Exact vector replica of user's 5-petal flower sticker:
 * 5 overlapping circular petals, center yellow disc with outline,
 * and shiny white specular highlight dot!
 */
export function PopFlower({
  color = "mint",
  className = "w-6 h-6",
  rotate = 0,
  style = {}
}) {
  const p = FLOWER_PALETTES[color] || FLOWER_PALETTES.pink;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
    >
      {/* 5 Overlapping Petal Circles with natural pinwheel overlap */}
      {/* Petal 5: Top-Left */}
      <circle
        cx="30"
        cy="43.5"
        r="17.5"
        fill={p.petalFill}
        stroke={p.petalStroke}
        strokeWidth="3.2"
      />
      {/* Petal 4: Bottom-Left */}
      <circle
        cx="37.5"
        cy="67.5"
        r="17.5"
        fill={p.petalFill}
        stroke={p.petalStroke}
        strokeWidth="3.2"
      />
      {/* Petal 3: Bottom-Right */}
      <circle
        cx="62.5"
        cy="67.5"
        r="17.5"
        fill={p.petalFill}
        stroke={p.petalStroke}
        strokeWidth="3.2"
      />
      {/* Petal 2: Top-Right */}
      <circle
        cx="70"
        cy="43.5"
        r="17.5"
        fill={p.petalFill}
        stroke={p.petalStroke}
        strokeWidth="3.2"
      />
      {/* Petal 1: Top (overlaps top-right & top-left) */}
      <circle
        cx="50"
        cy="28.5"
        r="17.5"
        fill={p.petalFill}
        stroke={p.petalStroke}
        strokeWidth="3.2"
      />

      {/* Flower Center Disc */}
      <circle
        cx="50"
        cy="50"
        r="13.5"
        fill={p.centerFill}
        stroke={p.centerStroke}
        strokeWidth="2.8"
      />

      {/* Shiny Specular Highlight Bead (matching user's reference image) */}
      <circle
        cx="45.5"
        cy="45.5"
        r="3.5"
        fill={p.highlight}
      />
    </svg>
  );
}

// Backward-compatible alias for FlowerBlossom with colorway support
export function FlowerBlossom({
  className = "w-6 h-6",
  color = "mint",
  petalColor,
  centerColor,
  rotate = 0,
  style = {}
}) {
  // If explicitly custom petalColor is passed, map to PopFlower or custom
  if (petalColor === "#bbf7d0") {
    return <PopFlower color="mint" className={className} rotate={rotate} style={style} />;
  }
  return <PopFlower color={color} className={className} rotate={rotate} style={style} />;
}

// Cute Cluster of 2 or 3 Multi-Colored Flowers
export function FlowerCluster({
  className = "w-12 h-8",
  colors = ["mint", "lavender", "buttercup"]
}) {
  return (
    <div className={`relative inline-flex items-center ${className} select-none`}>
      <PopFlower
        color={colors[0] || "mint"}
        className="w-7 h-7 drop-shadow-xs"
        rotate={-8}
      />
      <PopFlower
        color={colors[1] || "lavender"}
        className="w-5 h-5 -ml-2 -mt-2 drop-shadow-xs"
        rotate={18}
      />
      {colors[2] && (
        <PopFlower
          color={colors[2] || "buttercup"}
          className="w-4 h-4 -ml-1.5 mt-2 drop-shadow-xs"
          rotate={-15}
        />
      )}
    </div>
  );
}

// Multi-Colored Flower Garland Strip (for section headers, card tops, banners)
export function FlowerGarland({
  className = "py-1",
  colors = ["mint", "buttercup", "lavender", "mint", "peach", "sky", "mint"]
}) {
  return (
    <div className={`flex items-center justify-center gap-1.5 sm:gap-2.5 overflow-hidden ${className}`}>
      {colors.map((col, idx) => (
        <PopFlower
          key={idx}
          color={col}
          className="w-4 h-4 sm:w-5 sm:h-5 opacity-90 hover:scale-125 transition-transform cursor-pointer"
          rotate={idx * 24}
        />
      ))}
    </div>
  );
}

// Cute Flower Sticker pinned on Washi Tape
export function FlowerStamp({
  flowerColor = "mint",
  tapeColor = "bg-emerald-200/80",
  className = ""
}) {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <WashiTape className="w-16 h-4 opacity-75" color={tapeColor} />
      <div className="absolute -top-2 right-1 z-10">
        <PopFlower color={flowerColor} className="w-5 h-5 drop-shadow-xs" rotate={12} />
      </div>
    </div>
  );
}

// Hand-crafted vector Silk Ribbon Bow (Girly Pop Coquette)
export function RibbonBow({ className = "w-8 h-8", color = "#4ade80" }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Loop */}
      <path
        d="M50 35 C42 12, 10 15, 16 38 C21 54, 45 44, 50 38 Z"
        fill="#bbf7d0"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right Loop */}
      <path
        d="M50 35 C58 12, 90 15, 84 38 C79 54, 55 44, 50 38 Z"
        fill="#bbf7d0"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Shadows for depth */}
      <path
        d="M48 35 C38 22, 22 25, 26 36 C30 44, 42 40, 48 37 Z"
        fill={color}
        fillOpacity="0.25"
      />
      <path
        d="M52 35 C62 22, 78 25, 74 36 C70 44, 58 40, 52 37 Z"
        fill={color}
        fillOpacity="0.25"
      />
      {/* Left Ribbon Tail */}
      <path
        d="M46 38 C38 48, 28 62, 24 74 C34 70, 40 68, 48 64 C47 52, 47 44, 46 38 Z"
        fill="#bbf7d0"
        stroke={color}
        strokeWidth="2"
      />
      {/* Right Ribbon Tail */}
      <path
        d="M54 38 C62 48, 72 62, 76 74 C66 70, 60 68, 52 64 C53 52, 53 44, 54 38 Z"
        fill="#bbf7d0"
        stroke={color}
        strokeWidth="2"
      />
      {/* Center Knot */}
      <ellipse
        cx="50"
        cy="36"
        rx="6.5"
        ry="6"
        fill={color}
        stroke="#16a34a"
        strokeWidth="2"
      />
    </svg>
  );
}

// Tulip Flower SVG
export function TulipFlower({ className = "w-6 h-6", petalColor = "#4ade80" }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 45 L30 75" stroke="#86efac" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 65 Q18 55 24 45" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M30 18 C20 18 12 30 18 45 C24 50 36 50 42 45 C48 30 40 18 30 18 Z"
        fill={petalColor}
        stroke="#16a34a"
        strokeWidth="2"
      />
      <path d="M30 18 L30 45" stroke="#16a34a" strokeWidth="1.5" />
    </svg>
  );
}

// Translucent Washi Tape Strip
export function WashiTape({ className = "w-20 h-6", color = "bg-emerald-200/70" }) {
  return (
    <div
      className={`inline-block ${color} backdrop-blur-sm border-y border-white/60 shadow-xs rotate-[-3deg] select-none ${className}`}
      style={{
        clipPath: "polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)"
      }}
    />
  );
}

// Sparkle Stars
export function SparkleStar({ className = "w-4 h-4 text-amber-300" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  );
}

/**
 * Global Drifting Flower Breeze & Framing Layer
 * Floats the actual 5-petal PopFlowers in multiple colors across the screen,
 * and frames the viewport corners with cute pastel bouquets!
 */
export function FloatingPetalsBackground() {
  const flowerItems = [
    { id: 1, left: "3%", delay: 0, duration: 16, size: 34, color: "mint", rotate: 45 },
    { id: 2, left: "8%", delay: -6, duration: 20, size: 28, color: "lavender", rotate: 90 },
    { id: 3, left: "14%", delay: -12, duration: 18, size: 36, color: "buttercup", rotate: 120 },
    { id: 4, left: "20%", delay: -3, duration: 22, size: 30, color: "peach", rotate: 30 },
    { id: 5, left: "26%", delay: -9, duration: 17, size: 34, color: "mint", rotate: 75 },
    { id: 6, left: "33%", delay: -15, duration: 24, size: 26, color: "sky", rotate: 60 },
    { id: 7, left: "39%", delay: -2, duration: 19, size: 38, color: "rose", rotate: 140 },
    { id: 8, left: "46%", delay: -8, duration: 21, size: 32, color: "white", rotate: 110 },
    { id: 9, left: "53%", delay: -14, duration: 16, size: 34, color: "coral", rotate: 85 },
    { id: 10, left: "59%", delay: -4, duration: 23, size: 28, color: "mint", rotate: 15 },
    { id: 11, left: "65%", delay: -10, duration: 18, size: 36, color: "lavender", rotate: 130 },
    { id: 12, left: "71%", delay: -16, duration: 22, size: 30, color: "buttercup", rotate: 50 },
    { id: 13, left: "77%", delay: -1, duration: 17, size: 34, color: "mint", rotate: 95 },
    { id: 14, left: "83%", delay: -7, duration: 20, size: 28, color: "sky", rotate: 40 },
    { id: 15, left: "89%", delay: -13, duration: 25, size: 40, color: "peach", rotate: 160 },
    { id: 16, left: "95%", delay: -5, duration: 19, size: 32, color: "rose", rotate: 105 },
    { id: 17, left: "6%", delay: -11, duration: 21, size: 34, color: "coral", rotate: 70 },
    { id: 18, left: "23%", delay: -17, duration: 19, size: 30, color: "white", rotate: 125 },
    { id: 19, left: "50%", delay: -6, duration: 22, size: 36, color: "lavender", rotate: 150 },
    { id: 20, left: "79%", delay: -15, duration: 18, size: 32, color: "mint", rotate: 35 },
    { id: 21, left: "12%", delay: -8, duration: 24, size: 30, color: "mint", rotate: 65 },
    { id: 22, left: "91%", delay: -2, duration: 16, size: 38, color: "buttercup", rotate: 115 },
    { id: 23, left: "42%", delay: -11, duration: 20, size: 28, color: "peach", rotate: 80 },
    { id: 24, left: "68%", delay: -13, duration: 23, size: 34, color: "rose", rotate: 45 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30 select-none">
      {/* 1. Falling & Floating Pastel Flowers Across The Viewport */}
      {flowerItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 0.85, 0.85, 0],
            rotate: [0, item.rotate * 3, item.rotate * 6],
            x: [0, 25, -25, 12]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
          style={{ left: item.left, position: "absolute", top: 0 }}
        >
          <PopFlower
            color={item.color}
            style={{ width: item.size, height: item.size }}
            className="drop-shadow-xs"
          />
        </motion.div>
      ))}

      {/* 2. Top-Left Viewport Corner Flower Bouquet */}
      <motion.div
        animate={{ rotate: [-2, 3, -2], y: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 left-3 flex items-center gap-0.5 opacity-90 filter drop-shadow-sm"
      >
        <PopFlower color="mint" className="w-8 h-8 sm:w-10 sm:h-10" rotate={-10} />
        <PopFlower color="buttercup" className="w-6 h-6 sm:w-7 sm:h-7 -ml-3 -mt-2" rotate={25} />
        <PopFlower color="lavender" className="w-5 h-5 sm:w-6 sm:h-6 -ml-2 mt-3" rotate={-15} />
      </motion.div>

      {/* 3. Top-Right Viewport Corner Flower Bouquet */}
      <motion.div
        animate={{ rotate: [2, -3, 2], y: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-3 flex items-center gap-0.5 opacity-90 filter drop-shadow-sm"
      >
        <PopFlower color="mint" className="w-6 h-6 sm:w-7 sm:h-7 mt-2" rotate={-20} />
        <PopFlower color="peach" className="w-8 h-8 sm:w-10 sm:h-10 -ml-2" rotate={15} />
        <PopFlower color="sky" className="w-5 h-5 sm:w-6 sm:h-6 -ml-2 -mt-3" rotate={-5} />
      </motion.div>

      {/* 4. Bottom-Left Viewport Corner Flower Bouquet */}
      <motion.div
        animate={{ rotate: [1, -2, 1], y: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-3 flex items-center gap-0.5 opacity-90 filter drop-shadow-sm"
      >
        <PopFlower color="lavender" className="w-7 h-7 sm:w-8 sm:h-8" rotate={12} />
        <PopFlower color="mint" className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 -mt-2" rotate={-18} />
        <PopFlower color="buttercup" className="w-5 h-5 sm:w-6 sm:h-6 -ml-2 mt-2" rotate={30} />
      </motion.div>

      {/* 5. Bottom-Right Viewport Corner Flower Bouquet */}
      <motion.div
        animate={{ rotate: [-2, 2, -2], y: [0, -3, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 right-3 flex items-center gap-0.5 opacity-90 filter drop-shadow-sm"
      >
        <PopFlower color="coral" className="w-5 h-5 sm:w-6 sm:h-6 -mr-2 mt-2" rotate={-25} />
        <PopFlower color="mint" className="w-8 h-8 sm:w-10 sm:h-10" rotate={8} />
        <PopFlower color="white" className="w-6 h-6 sm:w-7 sm:h-7 -ml-2 -mt-2" rotate={-12} />
      </motion.div>
    </div>
  );
}

/**
 * Interactive Blossom Click Effect
 * Spawns little colorful pop flowers wherever Mythri taps or clicks!
 */
export function FlowerClickSparkles() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const colorKeys = ["mint", "lavender", "buttercup", "peach", "sky", "buttercup", "mint"];

    const handleClick = (e) => {
      // Don't trigger on text inputs or textareas to avoid distractions while typing
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const id = Date.now() + Math.random();
      const newSpark = {
        id,
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
        rotate: Math.floor(Math.random() * 360)
      };

      setSparks((prev) => [...prev.slice(-8), newSpark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 900);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0.2, opacity: 1, x: s.x - 12, y: s.y - 12 }}
            animate={{
              scale: [0.2, 1.25, 0.8],
              opacity: [1, 1, 0],
              y: s.y - 36,
              rotate: s.rotate + 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none"
          >
            <PopFlower color={s.color} className="w-6 h-6 drop-shadow-sm" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
