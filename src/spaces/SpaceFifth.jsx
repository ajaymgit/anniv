import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Volume2,
  VolumeX,
  Disc3,
  Play,
  Pause,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  MapPin,
  CalendarClock
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  PopFlower,
  WashiTape,
  SparkleStar
} from "../components/common/GirlyPopDecorations";

const CASSETTE_TAPES = [
  {
    id: "frequency",
    tag: "TAPE 01 // 89.5 FM",
    frequency: 89.5,
    title: "The Heartbeat Frequency",
    subtitle: "Acoustic Memory Tuner",
    desc: "An interactive retro radio dial sweeping across frequencies from static into real audio soundscapes: rain on our jackets, the hum of night rides on empty roads, café chatter, and snippets of our songs.",
    vibe: "Auditory Nostalgia ♡",
    icon: Radio,
    colorName: "Matcha Mint"
  },
  {
    id: "atlas",
    tag: "TAPE 02 // 96.3 FM",
    frequency: 96.3,
    title: "The Coordinate Atlas",
    subtitle: "Cartography of Seven Years",
    desc: "A custom pastel vector map of our shared places, marking hyper-specific personal coordinates: the quiet curb from our first talk, our midnight snack spots, the airport gate, and ride routes connecting them.",
    vibe: "Our Physical Places ♡",
    icon: MapPin,
    colorName: "Honeydew Sage"
  },
  {
    id: "horizon",
    tag: "TAPE 03 // 104.7 FM",
    frequency: 104.7,
    title: "The Next Seven",
    subtitle: "The Forward Horizon Capsule",
    desc: "While every other chapter looks backward at our first seven years, this chapter looks forward to Year 14. An interactive horizon slider unlocking future travel pacts, bucket lists, and promises waiting to be written.",
    vibe: "Our Future Together ♡",
    icon: CalendarClock,
    colorName: "Emerald Tea"
  }
];

export default function SpaceFifth() {
  const { markSpaceCompleted } = useAnniversary();

  // Radio Tuner State
  const [frequency, setFrequency] = useState(104.7);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedTape, setSelectedTape] = useState(CASSETTE_TAPES[2]);
  const [voted, setVoted] = useState(false);
  const [volume, setVolume] = useState(80);

  // Equalizer Bars simulation
  const [eqLevels, setEqLevels] = useState([40, 65, 80, 50, 70, 90, 60, 45]);

  useEffect(() => {
    if (!isPlaying) {
      setEqLevels([8, 10, 8, 12, 10, 8, 10, 8]);
      return;
    }
    const interval = setInterval(() => {
      setEqLevels([
        Math.floor(Math.random() * 60 + 30),
        Math.floor(Math.random() * 70 + 25),
        Math.floor(Math.random() * 80 + 20),
        Math.floor(Math.random() * 65 + 35),
        Math.floor(Math.random() * 85 + 15),
        Math.floor(Math.random() * 75 + 25),
        Math.floor(Math.random() * 60 + 30),
        Math.floor(Math.random() * 50 + 20)
      ]);
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTune = (newFreq) => {
    setFrequency(newFreq);
    // Find closest tape
    let closest = CASSETTE_TAPES[0];
    let minDiff = 999;
    CASSETTE_TAPES.forEach((tape) => {
      const diff = Math.abs(tape.frequency - newFreq);
      if (diff < minDiff) {
        minDiff = diff;
        closest = tape;
      }
    });
    setSelectedTape(closest);
  };

  const handleInsertTape = (tape) => {
    setSelectedTape(tape);
    setFrequency(tape.frequency);
    setIsPlaying(true);
  };

  const handleLockVote = () => {
    setVoted(true);
    markSpaceCompleted("05-undecided");
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none font-sans">
      {/* Chapter Header */}
      <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
        <div className="flex justify-center mb-3">
          <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-sans font-semibold mb-4 shadow-sm">
          <Radio className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chapter 5 // Vintage Analog Radio & Cassette Player</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] mb-3 font-serif tracking-tight">
          The Memory Receiver
        </h2>
        <p className="text-sm sm:text-base text-[#3d6350] max-w-xl mx-auto font-sans leading-relaxed">
          An analog frequency tuner and cassette deck crafted in pastel sage enamel. Drag the FM tuning needle or insert a tape cassette to preview our next adventure!
        </p>
      </div>

      {/* Main Vintage Radio Cabinet Body */}
      <div className="max-w-5xl mx-auto bg-white border-2 border-[#bbf7d0] rounded-[44px] p-6 sm:p-10 shadow-card relative overflow-hidden mb-10">
        {/* Top Washi Tape Corner */}
        <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
          <WashiTape className="w-20 h-4.5 opacity-80" color="bg-emerald-200/80" />
        </div>

        {/* Radio Top Panel Trim */}
        <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="font-serif font-bold text-sm tracking-wider text-emerald-900">
              RETRO SOUND LAB • MODEL VII // 2019–2026
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-800 font-semibold shadow-2xs">
            <Disc3 className={`w-3.5 h-3.5 text-emerald-600 ${isPlaying ? "animate-spin" : ""}`} />
            <span>Tape Deck Active</span>
          </div>
        </div>

        {/* 1. Glass Frequency Tuning Window */}
        <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-3xl p-6 sm:p-8 mb-8 relative shadow-inner overflow-hidden">
          {/* Backlit dial glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-emerald-100/30 pointer-events-none" />

          {/* Scale Labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 mb-2 relative z-10 font-bold">
            <span>FM 88.0</span>
            <span className="text-emerald-900 font-extrabold text-sm sm:text-base">
              {frequency.toFixed(1)} MHz • STEREO
            </span>
            <span>108.0 FM</span>
          </div>

          {/* Frequency Ruler Markings */}
          <div className="relative h-12 flex items-center justify-between border-y border-[#bbf7d0] my-2 px-2 select-none">
            {[88, 92, 96, 100, 104, 108].map((f) => (
              <div key={f} className="flex flex-col items-center">
                <span className="h-4 w-0.5 bg-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-700 mt-1">{f}</span>
              </div>
            ))}

            {/* Glowing Emerald Tuning Needle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all pointer-events-none"
              style={{
                left: `${((frequency - 88) / (108 - 88)) * 100}%`
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 -ml-1.5 -top-1 absolute shadow-sm" />
            </div>
          </div>

          {/* Range Slider for tuning */}
          <input
            type="range"
            min={88}
            max={108}
            step={0.1}
            value={frequency}
            onChange={(e) => handleTune(parseFloat(e.target.value))}
            className="w-full mt-3 accent-emerald-600 cursor-pointer"
          />

          <div className="flex items-center justify-between mt-3 text-xs text-emerald-800 font-sans">
            <span className="italic text-[#3d6350]">Drag slider or click tapes below to tune into memories</span>
            <span className="font-bold font-serif text-emerald-900">{selectedTape.title}</span>
          </div>
        </div>

        {/* 2. Cassette Bay & VU Equalizer Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8">
          {/* Cassette Deck Bay (7 cols) */}
          <div className="md:col-span-7 bg-[#f7faf8] border-2 border-[#bbf7d0] rounded-3xl p-6 relative shadow-inner">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-sans font-bold mb-3">
              <span className="flex items-center gap-1.5">
                <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
                <span>CASSETTE COMPARTMENT</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {selectedTape.tag}
              </span>
            </div>

            {/* Cassette Shell Visualization */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm relative">
              <div className="flex items-center justify-between mb-3 border-b border-emerald-100 pb-2">
                <span className="font-serif font-bold text-base text-[#132e22]">
                  {selectedTape.title}
                </span>
                <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  SIDE A ♡
                </span>
              </div>

              {/* Two Spinning Tape Spools */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 flex items-center justify-around my-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-300 flex items-center justify-center bg-white shadow-2xs">
                    <Disc3 className={`w-8 h-8 text-emerald-500 ${isPlaying ? "animate-spin" : ""}`} />
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 mt-1">FEED SPOOL</span>
                </div>

                {/* Magnetic tape window */}
                <div className="w-24 h-7 bg-emerald-950/80 rounded-md border border-emerald-700 flex items-center justify-center">
                  <div className="w-20 h-1.5 bg-amber-700/80 rounded-full" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-300 flex items-center justify-center bg-white shadow-2xs">
                    <Disc3 className={`w-8 h-8 text-emerald-500 ${isPlaying ? "animate-spin" : ""}`} />
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 mt-1">TAKEUP</span>
                </div>
              </div>

              <p className="text-xs text-[#3d6350] leading-relaxed font-sans mt-3">
                {selectedTape.desc}
              </p>
            </div>
          </div>

          {/* Equalizer & Controls (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            {/* Equalizer VU Bars */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-3xl p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-3 font-sans">
                <span>STEREO SPECTRUM</span>
                <span className="text-[10px] text-emerald-700 font-mono">dB LEVEL: +3.2</span>
              </div>

              <div className="flex items-end justify-between gap-1.5 h-20 bg-white/80 p-3 rounded-2xl border border-emerald-100">
                {eqLevels.map((lvl, i) => (
                  <div key={i} className="flex-1 bg-emerald-100 rounded-t-sm h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm transition-all duration-100 shadow-2xs"
                      style={{ height: `${lvl}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Play/Pause & Volume Knobs */}
            <div className="bg-white border-2 border-[#bbf7d0] rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? "Pause Tape" : "Play Tape"}</span>
              </button>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-24 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Three Magnetic Cassette Tapes to Insert */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xl text-[#132e22] font-semibold flex items-center gap-2">
              <FlowerBlossom className="w-4 h-4" petalColor="#bbf7d0" centerColor="#fef08a" />
              <span>Available Memory Cassettes (Tap to Load):</span>
            </h4>
            <span className="text-xs text-[#3d6350] font-sans">Choose what we create next</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CASSETTE_TAPES.map((tape) => {
              const isSelected = selectedTape.id === tape.id;
              const Icon = tape.icon;

              return (
                <motion.div
                  key={tape.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInsertTape(tape)}
                  className={`cursor-pointer rounded-[28px] p-5 border-2 transition-all duration-300 relative flex flex-col justify-between shadow-card ${
                    isSelected
                      ? "bg-[#f0fdf4] border-emerald-400 shadow-pop"
                      : "bg-white border-[#bbf7d0] hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-2xl bg-white border border-[#bbf7d0] text-emerald-700 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-800 px-2.5 py-0.5 rounded-full bg-white border border-emerald-200">
                        {tape.frequency} FM
                      </span>
                    </div>

                    <h5 className="font-serif text-lg text-[#132e22] font-bold mb-1">
                      {tape.title}
                    </h5>
                    <p className="text-xs text-emerald-700 font-semibold mb-2 font-sans">
                      {tape.subtitle}
                    </p>
                    <p className="text-xs text-[#3d6350] leading-relaxed font-sans line-clamp-3">
                      {tape.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between text-xs font-sans">
                    <span className="text-emerald-700 font-medium">{tape.vibe}</span>
                    <span className={`font-bold ${isSelected ? "text-emerald-800 font-extrabold" : "text-[#3d6350]"}`}>
                      {isSelected ? "Inserted In Deck ✓" : "Insert Tape →"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. Lock In / Vote Button for this Chapter */}
        <div className="mt-10 pt-6 border-t border-[#bbf7d0]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg text-[#132e22] font-bold">
              Currently Loaded: {selectedTape.title} ({selectedTape.frequency} FM)
            </p>
            <p className="text-xs text-[#3d6350] font-sans">
              Cast your vote for this concept so we can build it together!
            </p>
          </div>

          <button
            onClick={handleLockVote}
            className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold transition-all shadow-pop active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {voted ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{voted ? "Vote Locked In ♡" : "Lock in as Our Choice ♡"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
