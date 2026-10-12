import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useAnniversary } from "../../context/AnniversaryContext";
import { RibbonBow, PopFlower, FlowerCluster } from "../common/GirlyPopDecorations";

export default function Navbar() {
  const { activeSpace, goToHub, soundEnabled, setSoundEnabled } = useAnniversary();

  return (
    <header className="sticky top-0 z-50 bg-[#fffdfa]/90 backdrop-blur-xl border-b border-[#bbf7d0] px-6 sm:px-10 py-3.5 transition-all text-[#3b1c32]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Brand with Ribbon Bow or Back Link */}
        <div className="flex items-center gap-3">
          {activeSpace ? (
            <button
              onClick={goToHub}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-[#bbf7d0] text-xs sm:text-sm font-sans font-medium text-emerald-700 shadow-sm transition-all group active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-emerald-500" />
              <span>Back to Chapters</span>
              <PopFlower color="mint" className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <RibbonBow className="w-6 h-5 drop-shadow-sm text-emerald-400" />
              <span className="font-serif text-base tracking-wide text-[#3b1c32] font-semibold">
                Seven Years with Mythri
              </span>
              <div className="flex items-center -space-x-1">
                <PopFlower color="mint" className="w-4 h-4" />
                <PopFlower color="buttercup" className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {activeSpace && (
            <div className="flex items-center gap-2 text-xs font-sans text-[#3d6350] pl-3 border-l border-[#bbf7d0]">
              <span className="text-emerald-600 font-medium">{activeSpace.chapterLabel || activeSpace.number}</span>
              <span className="text-[#3b1c32] font-semibold">{activeSpace.title}</span>
            </div>
          )}
        </div>

        {/* Right: Sound Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-white hover:bg-emerald-50 border border-[#bbf7d0] text-[#3d6350] hover:text-emerald-600 shadow-sm transition-all active:scale-95"
            title={soundEnabled ? "Mute music" : "Play music"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
