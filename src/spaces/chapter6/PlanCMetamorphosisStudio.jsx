import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Download, Palette, Eraser, Check } from "lucide-react";
import { RibbonBow, FlowerBlossom, PopFlower, WashiTape } from "../../components/common/GirlyPopDecorations";

const PIGMENTS = [
  {
    id: "matcha",
    name: "Matcha Sage",
    color: "#34d399",
    hex: "rgba(52, 211, 153, 0.45)",
    meaning: "Patience & Grounding"
  },
  {
    id: "ochre",
    name: "Warm Ochre",
    color: "#fbbf24",
    hex: "rgba(251, 191, 36, 0.4)",
    meaning: "Joy & Everyday Spontaneity"
  },
  {
    id: "blossom",
    name: "Blossom Blush",
    color: "#f472b6",
    hex: "rgba(244, 114, 182, 0.4)",
    meaning: "Gentleness & Warmth"
  },
  {
    id: "forest",
    name: "Deep Forest",
    color: "#059669",
    hex: "rgba(5, 150, 105, 0.4)",
    meaning: "Resilience & Steady Roots"
  },
  {
    id: "gold",
    name: "Golden Starlight",
    color: "#fcd34d",
    hex: "rgba(252, 211, 77, 0.45)",
    meaning: "Personal Evolution"
  }
];

const HIDDEN_REFLECTIONS = [
  {
    id: "ref-1",
    zone: { x: 0.22, y: 0.28 },
    title: "Stillness Over Noise",
    text: "Before spending years beside you, I rushed through every hour. You taught me to pause, look up at the sky, and savor the quiet in between.",
    tag: "Patience Learned"
  },
  {
    id: "ref-2",
    zone: { x: 0.72, y: 0.25 },
    title: "The Art of Listening",
    text: "You transformed how I communicate. Hearing someone without formulating a counter-argument — just holding space with total attention.",
    tag: "Presence Gained"
  },
  {
    id: "ref-3",
    zone: { x: 0.32, y: 0.72 },
    title: "Curiosity Expanded",
    text: "Books I never would have opened, melodies I never would have hummed, and foods I never would have tried now fill my daily life because you shared them.",
    tag: "New Horizons"
  },
  {
    id: "ref-4",
    zone: { x: 0.75, y: 0.68 },
    title: "Becoming Someone I Respect",
    text: "The person I was seven years ago feels like a rough sketch. Looking at who I am today, the qualities I value most are the ones your presence nurtured.",
    tag: "The Mutual Shift"
  }
];

export default function PlanCMetamorphosisStudio({ playChime }) {
  const canvasRef = useRef(null);
  const [activePigment, setActivePigment] = useState(PIGMENTS[0]);
  const [brushSize, setBrushSize] = useState(28);
  const [revealedReflections, setRevealedReflections] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const isDrawingRef = useRef(false);

  // Initialize Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext("2d");
    // Textured paper wash background
    ctx.fillStyle = "#fafcfb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper grain dots
    ctx.fillStyle = "rgba(19, 46, 34, 0.02)";
    for (let i = 0; i < 3000; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  // Check if stroke uncovers a hidden reflection
  const checkRevealZone = (xRatio, yRatio) => {
    HIDDEN_REFLECTIONS.forEach((ref) => {
      const dist = Math.hypot(xRatio - ref.zone.x, yRatio - ref.zone.y);
      if (dist < 0.16 && !revealedReflections.includes(ref.id)) {
        setRevealedReflections((prev) => [...prev, ref.id]);
        setActiveCard(ref);
        if (playChime) playChime(587.33, 0.7);
      }
    });
  };

  const drawWatercolorWash = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);

    // Soft organic radial gradient mimicking watercolor bleeding
    const radGrad = ctx.createRadialGradient(x, y, 2, x, y, brushSize);
    radGrad.addColorStop(0, activePigment.hex);
    radGrad.addColorStop(0.7, activePigment.hex);
    radGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = radGrad;
    ctx.fill();
    ctx.restore();

    checkRevealZone(x / canvas.width, y / canvas.height);

    if (Math.random() < 0.1 && playChime) {
      playChime(350 + (x / canvas.width) * 300, 0.15);
    }
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    drawWatercolorWash(e);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    drawWatercolorWash(e);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    setupCanvas();
    setRevealedReflections([]);
    setActiveCard(null);
    if (playChime) playChime(330, 0.3);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "Metamorphosis_Watercolor_Wash.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-[#fafcfb] text-[#132e22]">
      {/* Top Bar Studio Palette Controls */}
      <div className="z-10 mt-3 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs w-[94%] max-w-2xl">
        <div className="flex items-center gap-2">
          <RibbonBow className="w-5 h-4 text-emerald-500" />
          <span className="font-serif font-bold text-[#132e22]">
            Plan C: The Metamorphosis Studio
          </span>
          <span className="text-[10px] text-[#3d6350] font-sans hidden sm:inline">
            — Paint watercolor washes to reveal emergent layers of growth
          </span>
        </div>

        {/* Pigment Swatches */}
        <div className="flex items-center gap-1.5">
          {PIGMENTS.map((p) => {
            const isSelected = activePigment.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePigment(p);
                  if (playChime) playChime(493.88, 0.3);
                }}
                className={`w-6 h-6 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isSelected ? "ring-2 ring-emerald-600 scale-110 shadow-xs" : "opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: p.color }}
                title={`${p.name} (${p.meaning})`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
              </button>
            );
          })}

          <div className="h-4 w-px bg-emerald-200 mx-1" />

          {/* Clear & Save */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-full text-[#3d6350] hover:text-[#132e22] hover:bg-emerald-50 transition-colors"
            title="Clean Canvas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full text-[#3d6350] hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            title="Export Artwork"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Drawing Paper Canvas */}
      <div
        className="relative flex-1 w-full h-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Unlocked Reflection Beacons Embedded in Canvas */}
        {HIDDEN_REFLECTIONS.map((ref) => {
          const isRevealed = revealedReflections.includes(ref.id);
          return (
            <motion.div
              key={ref.id}
              onClick={() => setActiveCard(ref)}
              style={{
                left: `${ref.zone.x * 100}%`,
                top: `${ref.zone.y * 100}%`
              }}
              animate={{
                scale: isRevealed ? [1, 1.08, 1] : 0.85,
                opacity: isRevealed ? 1 : 0.35
              }}
              transition={{ duration: 2.5, repeat: isRevealed ? Infinity : 0 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 rounded-2xl border transition-all ${
                isRevealed
                  ? "bg-white/95 border-emerald-400 shadow-md ring-2 ring-emerald-200"
                  : "bg-white/40 border-dashed border-emerald-300/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FlowerBlossom
                  className="w-4 h-4"
                  petalColor={isRevealed ? "#10b981" : "#d1d5db"}
                  centerColor="#fef08a"
                />
                <span className="text-[10px] sm:text-xs font-serif font-bold text-[#132e22]">
                  {isRevealed ? ref.title : "Wash here to reveal"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Active Reflection Card */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-[92%] bg-white/95 backdrop-blur-xl border-2 border-emerald-300 p-5 rounded-[26px] shadow-xl z-30 text-left"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <RibbonBow className="w-5 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                  Surfaced Memory • {activeCard.tag}
                </span>
              </div>
              <button
                onClick={() => setActiveCard(null)}
                className="p-1 rounded-full text-[#3d6350] hover:text-[#132e22] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h4 className="text-base sm:text-lg font-serif font-bold text-[#132e22]">
              {activeCard.title}
            </h4>

            <p className="text-xs sm:text-sm font-sans text-[#2d4d3d] mt-1.5 leading-relaxed">
              "{activeCard.text}"
            </p>

            <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-[#3d6350] italic font-serif">
              <span>Discovered through organic watercolor touch</span>
              <span className="font-sans font-medium text-emerald-700">
                {revealedReflections.length} of {HIDDEN_REFLECTIONS.length} Uncovered
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
