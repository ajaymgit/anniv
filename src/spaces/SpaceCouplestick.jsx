import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Terminal,
  Laptop,
  Check,
  Copy
} from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import {
  RibbonBow,
  PopFlower,
  FlowerBlossom,
  TulipFlower,
  WashiTape,
  SparkleStar
} from "../components/common/GirlyPopDecorations";

export default function SpaceCouplestick() {
  const { markSpaceCompleted } = useAnniversary();

  // Web Simulator State
  const [stickerAction, setStickerAction] = useState(null);
  const [bubbleText, setBubbleText] = useState("Hey handsome ♡");
  const [inputMsg, setInputMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const pairingCode = "220305"; // Mythri's birthday code

  const triggerAction = (action, label) => {
    setStickerAction({ type: action, label });
    markSpaceCompleted("04-couplestick");
    setTimeout(() => {
      setStickerAction(null);
    }, 2500);
  };

  const handleSendBubble = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setBubbleText(inputMsg.trim());
    setInputMsg("");
    triggerAction("message", "Message sent!");
  };

  const copyPairingCode = () => {
    navigator.clipboard?.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none">
      {/* Chapter Header with Bow and Florals */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="flex justify-center mb-3">
          <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-sans font-medium mb-4 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Chapter 4 // Our Desktop Companion</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] mb-3 font-serif">
          CoupleStick for macOS
        </h2>
        <p className="text-sm sm:text-base text-[#3d6350] max-w-xl mx-auto font-sans leading-relaxed">
          A cute little partner sticker app I engineered for our Macs. It pins our avatars to your screen so we can send pokes, kisses, and photos in real time while working.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left: The Interactive Desktop Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#bbf7d0] rounded-[36px] p-6 sm:p-8 shadow-card relative overflow-hidden">
          {/* Washi Tape on Simulator */}
          <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
            <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
          </div>

          <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-300" />
              <span className="w-3 h-3 rounded-full bg-amber-300" />
              <span className="w-3 h-3 rounded-full bg-emerald-300" />
              <span className="text-xs font-sans text-[#3d6350] pl-2 font-semibold">
                Live Mac Simulator
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-sans px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shadow-sm">
              <FlowerBlossom className="w-3 h-3" />
              <span>Realtime Paired</span>
            </div>
          </div>

          {/* Simulated Mac Desktop Canvas in Pastel */}
          <div className="relative h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-[#fff2f5] via-[#fcf6fb] to-[#f4f7fe] border border-[#f0e3de] flex items-center justify-center p-6 overflow-hidden shadow-inner">
            {/* Draggable Avatar Sticker Simulation */}
            <motion.div
              drag
              dragConstraints={{ left: -100, right: 100, top: -70, bottom: 70 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-grab active:cursor-grabbing flex flex-col items-center z-10"
            >
              {/* Sticker Frame with Ribbon Accent */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] bg-gradient-to-br from-emerald-300 via-teal-200 to-purple-300 p-1 shadow-pop relative">
                <div className="w-full h-full rounded-[24px] bg-white flex flex-col items-center justify-center text-center p-2 relative overflow-hidden shadow-inner">
                  <span className="text-4xl sm:text-5xl select-none mb-1">👩🏻‍❤️‍👨🏻</span>
                  <span className="text-[11px] font-sans font-bold text-emerald-700">Jayjay ♡</span>
                </div>

                {/* Reaction Bubble Animation */}
                <AnimatePresence>
                  {stickerAction && (
                    <motion.div
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1.15, y: -25 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-4 bg-emerald-500 text-white font-sans font-bold text-xs px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap z-20 flex items-center gap-1.5"
                    >
                      {stickerAction.type === "poke" && "👉 Poked!"}
                      {stickerAction.type === "kiss" && "💋 Mwah!"}
                      {stickerAction.type === "heart" && "♡ Heart sent!"}
                      {stickerAction.type === "flower" && (
                        <>
                          <PopFlower color="mint" className="w-3.5 h-3.5" />
                          <span>Flowers bloomed!</span>
                        </>
                      )}
                      {stickerAction.type === "message" && "💬 Note sent!"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Docked Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-white border border-[#bbf7d0] px-4 py-1.5 rounded-full text-xs text-[#132e22] shadow-md max-w-xs text-center font-sans font-semibold"
              >
                {bubbleText}
              </motion.div>
            </motion.div>
          </div>

          {/* Simulator Interactive Touch Controls */}
          <div className="mt-6 space-y-4">
            <div className="text-xs font-sans text-[#3d6350] font-medium flex items-center gap-1.5">
              <SparkleStar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Controls (Tap to test live animations):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => triggerAction("poke", "Poke")}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-sans text-emerald-700 font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <span>👉 Poke</span>
              </button>
              <button
                onClick={() => triggerAction("kiss", "Kiss")}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-sans text-rose-700 font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <span>💋 Send Kiss</span>
              </button>
              <button
                onClick={() => triggerAction("heart", "Heart")}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-sans text-purple-700 font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <span>♡ Heart Wave</span>
              </button>
              <button
                onClick={() => triggerAction("flower", "Flower")}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-sans text-emerald-700 font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <PopFlower color="mint" className="w-4 h-4" />
                <span>Send Flower</span>
              </button>
            </div>

            {/* Bubble Input */}
            <form onSubmit={handleSendBubble} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Send a cute little note..."
                className="flex-1 bg-white border border-[#bbf7d0] rounded-2xl px-4 py-2 text-xs font-sans text-[#132e22] placeholder:text-[#6e9981] focus:outline-none focus:border-emerald-400 shadow-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-sans font-bold transition-colors shadow-sm active:scale-95"
              >
                Send ♡
              </button>
            </form>
          </div>
        </div>

        {/* Right: Installation & Pairing Ceremony (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pairing Code Card */}
          <div className="bg-white border-2 border-[#bbf7d0] rounded-[36px] p-7 shadow-card relative overflow-hidden">
            <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
              <WashiTape className="w-16 h-4 opacity-75" color="bg-purple-200/80" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-600 font-bold mb-2">
              <FlowerBlossom className="w-4 h-4" />
              <span>YOUR PAIRING KEY</span>
            </div>
            <h3 className="text-2xl font-serif text-[#132e22] mb-2">
              Connect Directly To Me
            </h3>
            <p className="text-xs text-[#3d6350] mb-4 leading-relaxed font-sans">
              When you launch CoupleStick on your Mac, enter this 6-digit room code to instantly link our stickers together.
            </p>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] mb-2">
              <span className="font-serif text-3xl font-bold tracking-widest text-emerald-600">
                {pairingCode}
              </span>
              <button
                onClick={copyPairingCode}
                className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? "Copied" : "Copy key"}</span>
              </button>
            </div>
          </div>

          {/* Download macOS App Card */}
          <div className="bg-white border-2 border-[#bbf7d0] rounded-[36px] p-7 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-xs font-sans text-[#3d6350] font-semibold">
              <Laptop className="w-4 h-4 text-sky-500" />
              <span>NATIVE MACOS APP</span>
            </div>
            <h3 className="text-xl font-serif text-[#132e22]">
              Download CoupleStick.dmg
            </h3>
            <p className="text-xs text-[#3d6350] leading-relaxed font-sans">
              Packaged and ready to drag straight into your Applications folder. Built with native Swift for 0% idle CPU and battery efficiency.
            </p>

            <a
              href="https://github.com/ajaymgit/anniv/releases/latest/download/CoupleStick.dmg"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 hover:from-emerald-500 hover:to-purple-500 text-white font-sans text-xs font-bold transition-all shadow-pop active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download CoupleStick.dmg (1.7 MB)</span>
            </a>

            {/* Quick Terminal command */}
            <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] font-sans text-[#3d6350] space-y-1">
              <div className="text-[#6e9981] flex items-center gap-1 font-medium">
                <Terminal className="w-3.5 h-3.5" /> 1-Line Terminal Quick Install:
              </div>
              <div className="text-[#132e22] select-all break-all font-mono text-[10px]">
                curl -L -O https://github.com/ajaymgit/anniv/releases/latest/download/CoupleStick.dmg && open CoupleStick.dmg
              </div>
            </div>
          </div>

          {/* Shortcuts Reference */}
          <div className="bg-white border-2 border-[#bbf7d0] rounded-[36px] p-7 shadow-card">
            <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-600 font-bold mb-3">
              <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
              <span>Keyboard Shortcuts on Mac:</span>
            </div>
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center py-1.5 border-b border-[#bbf7d0]/60">
                <span className="text-[#55324e]">Poke Ajay 👉</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">Cmd + Shift + P</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#bbf7d0]/60">
                <span className="text-[#55324e]">Send Kiss 💋</span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">Cmd + Shift + K</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#bbf7d0]/60">
                <span className="text-[#55324e]">React Back ♡</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">Cmd + Shift + R</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#55324e]">Send Camera Snap 📸</span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">Cmd + Shift + U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
