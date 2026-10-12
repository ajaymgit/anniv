import React from "react";
import { AnniversaryProvider, useAnniversary } from "./context/AnniversaryContext";
import Navbar from "./components/hub/Navbar";
import MasterHub from "./components/hub/MasterHub";
import SpaceHeist from "./spaces/SpaceHeist";
import SpaceConstellation from "./spaces/SpaceConstellation";
import SpaceLetters from "./spaces/SpaceLetters";
import SpaceCouplestick from "./spaces/SpaceCouplestick";
import SpaceFifth from "./spaces/SpaceFifth";
import SpaceMythriEffect from "./spaces/SpaceMythriEffect";
import SpaceHerSpace from "./spaces/SpaceHerSpace";
import { FloatingPetalsBackground, FlowerClickSparkles } from "./components/common/GirlyPopDecorations";
import BackgroundAudio from "./components/common/BackgroundAudio";
import { AnimatePresence, motion } from "framer-motion";

class ChapterErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ChapterErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white/90 backdrop-blur-md border border-rose-200 rounded-3xl p-6 max-w-md shadow-xl">
            <p className="text-sm font-serif font-bold text-rose-800 mb-2">
              Something unexpectedly paused this chapter.
            </p>
            <p className="text-xs text-rose-600/80 mb-4">
              {this.state.error?.message || "Render error"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2 rounded-full bg-emerald-600 text-white font-sans text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md cursor-pointer"
            >
              Resume Chapter
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SuiteRouter() {
  const { activeSpaceId } = useAnniversary();

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#132e22] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 relative">
      {/* Background Full Song Player */}
      <BackgroundAudio />

      {/* Site-wide Floating Cherry Blossom Petals & Floral Breeze */}
      <FloatingPetalsBackground />

      {/* Interactive Blossom Click Effect (spawns cute pastel flowers on click) */}
      <FlowerClickSparkles />

      <Navbar />
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {activeSpaceId === null && (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <MasterHub />
            </motion.div>
          )}

          {activeSpaceId === "01-time-heist" && (
            <motion.div
              key="01"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceHeist />
            </motion.div>
          )}

          {activeSpaceId === "02-constellation" && (
            <motion.div
              key="02"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <ChapterErrorBoundary>
                <SpaceConstellation />
              </ChapterErrorBoundary>
            </motion.div>
          )}

          {activeSpaceId === "03-seven-letters" && (
            <motion.div
              key="03"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceLetters />
            </motion.div>
          )}

          {activeSpaceId === "04-couplestick" && (
            <motion.div
              key="04"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceCouplestick />
            </motion.div>
          )}

          {activeSpaceId === "05-undecided" && (
            <motion.div
              key="05"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceFifth />
            </motion.div>
          )}

          {activeSpaceId === "06-mythri-effect" && (
            <motion.div
              key="06"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceMythriEffect />
            </motion.div>
          )}

          {activeSpaceId === "07-her-space" && (
            <motion.div
              key="07"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <SpaceHerSpace />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AnniversaryProvider>
      <SuiteRouter />
    </AnniversaryProvider>
  );
}
