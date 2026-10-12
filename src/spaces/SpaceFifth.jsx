import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Radio, MapPin, CalendarClock } from "lucide-react";
import { useAnniversary } from "../context/AnniversaryContext";
import {
  RibbonBow,
  FlowerBlossom,
  WashiTape,
  SparkleStar
} from "../components/common/GirlyPopDecorations";

const CONCEPTS = [
  {
    id: "frequency",
    icon: Radio,
    tag: "Option A",
    title: "The Heartbeat Frequency",
    subtitle: "Acoustic Memory Tuner",
    desc: "An interactive retro radio dial sweeping across frequencies from static into real audio soundscapes: rain on the car windshield, the hum of night rides on empty roads, café chatter, and snippets of our favorite songs.",
    vibe: "Auditory nostalgia ♡",
    color: "from-sky-200 to-indigo-100"
  },
  {
    id: "atlas",
    icon: MapPin,
    tag: "Option B",
    title: "The Coordinate Atlas",
    subtitle: "Cartography of Seven Years",
    desc: "A custom pastel vector map of our shared places, marking hyper-specific personal coordinates: the quiet curb from our first talk, the midnight snack stall, the airport gate, with glowing ride routes between them.",
    vibe: "Our physical places ♡",
    color: "from-emerald-200 to-teal-100"
  },
  {
    id: "horizon",
    icon: CalendarClock,
    tag: "Option C",
    title: "The Next Seven",
    subtitle: "The Forward Horizon Capsule",
    desc: "While every other chapter looks backward at our first seven years, this chapter looks forward to Year 14. An interactive horizon slider unlocking future travel pacts, bucket lists, and promises waiting to be written.",
    vibe: "Our future together ♡",
    color: "from-amber-200 to-teal-100"
  }
];

export default function SpaceFifth() {
  const { markSpaceCompleted } = useAnniversary();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [voted, setVoted] = useState(false);

  const handleVote = (id) => {
    setSelectedConcept(id);
    setVoted(true);
    markSpaceCompleted("05-undecided");
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f7faf8] text-[#132e22] py-12 px-4 sm:px-6 relative select-none">
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-12 h-10 drop-shadow-sm text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-sans font-medium mb-4 shadow-sm">
          <FlowerBlossom className="w-3.5 h-3.5" petalColor="#bbf7d0" centerColor="#fef08a" />
          <span>Chapter 5 // A Surprise Chapter</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-[#132e22] mb-3 font-serif">
          Chapter Five
        </h2>
        <p className="text-sm sm:text-base text-[#3d6350] max-w-xl mx-auto font-sans leading-relaxed">
          We left this one room open rather than filling it with something generic. Pick the concept you want us to bring to life next!
        </p>
      </div>

      {/* Candidate Concepts with Washi Tape and Florals */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 mb-12 relative z-10">
        {CONCEPTS.map((concept, idx) => {
          const Icon = concept.icon;
          const isChosen = selectedConcept === concept.id;

          return (
            <motion.div
              key={concept.id}
              whileHover={{ y: -6, scale: 1.015 }}
              onClick={() => handleVote(concept.id)}
              className={`cursor-pointer rounded-[32px] p-7 border-2 transition-all duration-300 relative flex flex-col justify-between shadow-card hover:shadow-pop overflow-hidden ${
                isChosen
                  ? "bg-white border-emerald-300 shadow-pop"
                  : "bg-white/90 hover:bg-white border-[#bbf7d0]"
              }`}
            >
              {/* Washi Tape Strip on Corner */}
              <div className="absolute -top-1.5 right-6 z-20 pointer-events-none">
                <WashiTape className="w-16 h-4 opacity-75" color={idx === 0 ? "bg-sky-200/80" : idx === 1 ? "bg-emerald-200/80" : "bg-emerald-200/80"} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-600 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-emerald-700 font-bold px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                    {concept.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-[#132e22] mb-1">{concept.title}</h3>
                <p className="text-xs text-emerald-600 font-semibold mb-3 font-sans">{concept.subtitle}</p>
                <p className="text-xs text-[#55324e] leading-relaxed mb-4 font-sans">{concept.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#bbf7d0]/70 flex items-center justify-between text-xs font-sans">
                <span className="text-[#3d6350]">{concept.vibe}</span>
                <span className="text-emerald-600 font-bold">
                  {isChosen ? "Selected ♡" : "Choose →"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation feedback */}
      <AnimatePresence>
        {voted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center p-4 rounded-2xl bg-white border-2 border-emerald-200 text-emerald-700 text-xs font-sans font-semibold shadow-pop relative z-10 flex items-center justify-center gap-2"
          >
            <FlowerBlossom className="w-4 h-4" />
            <span>Preference registered! We will build this chapter next ♡</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
