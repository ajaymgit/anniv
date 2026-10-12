import React, { useState } from "react";
import { Settings, Save, RotateCcw, X, Heart, Calendar, KeyRound, Image, HelpCircle, FileText, Lock, Unlock, Upload } from "lucide-react";
import { sounds } from "../utils/audio";
import { DEFAULT_TRIVIA_QUESTIONS, DEFAULT_MEMORY_PAIRS, DEFAULT_CHAMBER_PHOTOS } from "../heistData";
import { RibbonBow, FlowerBlossom, WashiTape } from "./common/GirlyPopDecorations";

export default function StoryCustomizer({ isOpen, onClose, storyData, onSave }) {
  const [activeTab, setActiveTab] = useState("story"); // 'story', 'trivia', 'photos', 'memories'

  const [recipient, setRecipient] = useState(storyData.recipient || "Mythri");
  const [passcode, setPasscode] = useState(storyData.passcode || "220305");
  const [archiveCode, setArchiveCode] = useState(storyData.archiveCode || "1210");
  const [revealTitle, setRevealTitle] = useState(storyData.revealTitle || "Happy 7th Anniversary!");
  const [revealMessage, setRevealMessage] = useState(
    storyData.revealMessage ||
      "Through every locked dial, every dark corridor, and every scrambled memory, you proved that what we have is impossible to erase. Happy Anniversary, Mythri! Forever and always. ❤️"
  );
  const [jigsawPhoto, setJigsawPhoto] = useState(storyData.jigsawPhoto || "/jigsaw.jpg");
  const [chamberPhotos, setChamberPhotos] = useState(
    storyData.chamberPhotos || DEFAULT_CHAMBER_PHOTOS || [
      "/lightchamber/polaroid1.jpg",
      "/lightchamber/polaroid2.jpg",
      "/lightchamber/polaroid3.jpg",
      "/lightchamber/polaroid4.jpg"
    ]
  );
  const [memories, setMemories] = useState(storyData.memories || []);
  const [triviaQuestions, setTriviaQuestions] = useState(
    storyData.triviaQuestions || DEFAULT_TRIVIA_QUESTIONS
  );
  const [memoryPairs, setMemoryPairs] = useState(
    storyData.memoryPairs || DEFAULT_MEMORY_PAIRS
  );

  // Override State for changing files and photos
  const [overrideInput, setOverrideInput] = useState("");
  const [isOverrideUnlocked, setIsOverrideUnlocked] = useState(() => {
    try {
      return localStorage.getItem("time_heist_override") === "true";
    } catch {
      return false;
    }
  });
  const [overrideMessage, setOverrideMessage] = useState("");

  if (!isOpen) return null;

  const handleOverride = () => {
    if (overrideInput.trim().length > 0) {
      setIsOverrideUnlocked(true);
      try {
        localStorage.setItem("time_heist_override", "true");
      } catch (e) {
        console.warn(e);
      }
      sounds.playSuccess();
      setOverrideMessage("Access Granted: Override active! You can now customize all files and photos ♡");
    } else {
      sounds.playError();
      setOverrideMessage("Please enter an override code into the textbox to proceed.");
    }
  };

  const handleRelock = () => {
    setIsOverrideUnlocked(false);
    try {
      localStorage.removeItem("time_heist_override");
    } catch (e) {
      console.warn(e);
    }
    sounds.playClick();
    setOverrideMessage("File and photo access is now locked.");
  };

  const handleMemoryChange = (index, field, value) => {
    const updated = [...memories];
    updated[index] = { ...updated[index], [field]: value };
    setMemories(updated);
  };

  const handleChamberPhotoChange = (idx, value) => {
    const updated = [...chamberPhotos];
    updated[idx] = value;
    setChamberPhotos(updated);
  };

  const handleTriviaQuestionChange = (qIdx, field, value) => {
    const updated = [...triviaQuestions];
    updated[qIdx] = { ...updated[qIdx], [field]: value };
    setTriviaQuestions(updated);
  };

  const handleTriviaOptionChange = (qIdx, optIdx, value) => {
    const updated = [...triviaQuestions];
    const newOptions = [...updated[qIdx].options];
    newOptions[optIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: newOptions };
    setTriviaQuestions(updated);
  };

  const handleFileUpload = (e, callback) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    sounds.playSuccess();
    const newConfig = {
      ...storyData,
      recipient,
      passcode: passcode.trim() || "220305",
      archiveCode: archiveCode.trim() || "1210",
      revealTitle,
      revealMessage,
      jigsawPhoto: jigsawPhoto || storyData.jigsawPhoto,
      chamberPhotos,
      memories,
      triviaQuestions,
      memoryPairs
    };
    onSave(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#132e22]/40 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-sans select-none">
      <div className="bg-white border-2 border-emerald-200 rounded-[36px] p-6 sm:p-7 max-w-2xl w-full shadow-2xl max-h-[92vh] flex flex-col text-[#132e22] relative">
        <div className="absolute -top-1.5 right-10 z-20 pointer-events-none">
          <WashiTape className="w-20 h-4.5 opacity-75" color="bg-emerald-200/80" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#bbf7d0]/70 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <RibbonBow className="w-7 h-6 text-emerald-400" />
            <span className="font-serif font-bold text-base text-[#132e22]">
              Custom Memory Vault Settings ♡
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#3d6350] hover:text-[#132e22] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "story"
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Story & PINs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trivia")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "trivia"
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>7 Trivia Questions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "photos"
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photos & Files {isOverrideUnlocked ? "🔓" : "🔒"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("memories")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "memories"
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-emerald-50 text-[#3d6350] hover:bg-emerald-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>5 Milestones</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto pr-2 space-y-4 text-xs flex-1">
          {/* TAB 1: STORY & PINS */}
          {activeTab === "story" && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-[#3d6350] mb-1 font-semibold">Recipient / Player Name:</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-[#fff8fa] border border-emerald-200 focus:border-emerald-400 rounded-xl px-3 py-2 text-[#132e22] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3d6350] mb-1 font-semibold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Puzzle 01 PIN (Default: 220305):</span>
                  </label>
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="220305"
                    className="w-full bg-[#fff8fa] border border-emerald-200 focus:border-emerald-400 rounded-xl px-3 py-2 text-emerald-700 font-serif tracking-widest outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#3d6350] mb-1 font-semibold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-500" />
                    <span>Puzzle 04 Code (Default: 1210):</span>
                  </label>
                  <input
                    type="text"
                    value={archiveCode}
                    onChange={(e) => setArchiveCode(e.target.value)}
                    placeholder="1210"
                    className="w-full bg-[#fff8fa] border border-emerald-200 focus:border-emerald-400 rounded-xl px-3 py-2 text-purple-700 font-serif tracking-widest outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#3d6350] mb-1 font-semibold">Reveal Screen Headline:</label>
                <input
                  type="text"
                  value={revealTitle}
                  onChange={(e) => setRevealTitle(e.target.value)}
                  className="w-full bg-[#fff8fa] border border-emerald-200 focus:border-emerald-400 rounded-xl px-3 py-2 text-[#132e22] outline-none font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#3d6350] mb-1 font-semibold">Reveal Message / Love Letter:</label>
                <textarea
                  rows={4}
                  value={revealMessage}
                  onChange={(e) => setRevealMessage(e.target.value)}
                  className="w-full bg-[#fff8fa] border border-emerald-200 focus:border-emerald-400 rounded-xl p-3 text-[#132e22] outline-none resize-none font-serif text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: 7 TRIVIA QUESTIONS */}
          {activeTab === "trivia" && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-[11px] text-[#3d6350]">
                Customize the 7 relationship trivia questions for Puzzle 06. Select the radio button next to the correct answer for each question.
              </p>

              {triviaQuestions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 font-serif text-xs">Question 0{qIdx + 1}</span>
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleTriviaQuestionChange(qIdx, "question", e.target.value)}
                    placeholder="Question prompt"
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-[#132e22] outline-none text-xs"
                  />

                  <div className="space-y-1.5 pl-1">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctAnswerIndex === optIdx}
                          onChange={() => handleTriviaQuestionChange(qIdx, "correctAnswerIndex", optIdx)}
                          className="accent-emerald-500 cursor-pointer"
                          title="Mark as correct answer"
                        />
                        <span className="font-serif text-[#3d6350] text-xs font-bold w-4">{String.fromCharCode(65 + optIdx)}:</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleTriviaOptionChange(qIdx, optIdx, e.target.value)}
                          className="flex-1 bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-[#132e22] outline-none text-[11px]"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={q.hint || ""}
                    onChange={(e) => handleTriviaQuestionChange(qIdx, "hint", e.target.value)}
                    placeholder="Optional hint for this question"
                    className="w-full bg-white border border-dashed border-emerald-200 rounded-lg px-2.5 py-1 text-[#3d6350] outline-none text-[10px]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PHOTOS & FILES (WITH OVERRIDE ACCESS) */}
          {activeTab === "photos" && (
            <div className="space-y-4 animate-in fade-in">
              {!isOverrideUnlocked ? (
                /* Protected Lock State with Override Input and Button */
                <div className="p-6 bg-[#fff8fa] border-2 border-dashed border-emerald-300 rounded-3xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#132e22]">File & Photo Customization Protected</h3>
                    <p className="text-xs text-[#3d6350] mt-1 max-w-sm mx-auto leading-relaxed">
                      Enter the override code below and click <span className="font-bold text-emerald-700">Override</span> to unlock access to customize all files, polaroids, and photos across the vault.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto w-full">
                    <input
                      type="text"
                      value={overrideInput}
                      onChange={(e) => {
                        setOverrideInput(e.target.value);
                        if (overrideMessage) setOverrideMessage("");
                      }}
                      placeholder="Type override key (e.g. override)..."
                      className="flex-1 w-full bg-white border border-emerald-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-[#132e22] outline-none shadow-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleOverride();
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleOverride}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Override</span>
                    </button>
                  </div>
                  {overrideMessage && (
                    <p className={`text-[11px] font-medium ${overrideMessage.includes("Granted") ? "text-emerald-600" : "text-rose-600"}`}>
                      {overrideMessage}
                    </p>
                  )}
                </div>
              ) : (
                /* Unlocked State: Full access to change files and photos */
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
                      <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Override Active ♡ Full access to change all files and photos is granted.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRelock}
                      className="text-[11px] text-[#3d6350] hover:text-rose-600 underline font-medium cursor-pointer"
                    >
                      Lock
                    </button>
                  </div>

                  {/* Section 1: Light Chamber 4 Polaroids */}
                  <div className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 text-xs font-serif">
                        Puzzle 04: The Fairy-Light Chamber Polaroids (4 Photos)
                      </span>
                      <span className="text-[10px] text-[#3d6350] font-sans">Clues [I], [II], [III], [IV]</span>
                    </div>
                    <p className="text-[11px] text-[#3d6350]">
                      Customize the 4 hanging mini polaroids hidden in the shadows of the dark chamber.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {["[I] Top-Left", "[II] Lower-Left", "[III] Upper-Right", "[IV] Lower-Right"].map((label, idx) => (
                        <div key={idx} className="p-3 bg-white border border-emerald-100 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-emerald-800">Polaroid {label}</span>
                            <span className="text-[10px] text-[#3d6350]">Digit: {archiveCode[idx] || "0"}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-emerald-200">
                              <img
                                src={chamberPhotos[idx]}
                                alt={`Polaroid ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = "/jigsaw.jpg"; }}
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                value={chamberPhotos[idx]}
                                onChange={(e) => handleChamberPhotoChange(idx, e.target.value)}
                                placeholder="/lightchamber/polaroid..."
                                className="w-full bg-[#fafffd] border border-emerald-200 rounded-lg px-2 py-1 text-[#132e22] outline-none text-[11px]"
                              />
                              <label className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 cursor-pointer text-[10px] font-semibold">
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload from Mac</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, (dataUrl) => handleChamberPhotoChange(idx, dataUrl))}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Jigsaw Photo */}
                  <div className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-2">
                    <span className="font-bold text-emerald-700 text-xs font-serif">Puzzle 02: Polaroid Jigsaw Photo</span>
                    <p className="text-[11px] text-[#3d6350]">
                      Upload your anniversary photo or paste a URL for the 3x3 tile-swap jigsaw puzzle.
                    </p>
                    <div className="flex items-center gap-3">
                      {jigsawPhoto && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-50 shrink-0 border border-emerald-200">
                          <img src={jigsawPhoto} alt="Jigsaw Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={jigsawPhoto}
                          onChange={(e) => setJigsawPhoto(e.target.value)}
                          placeholder="Paste image URL..."
                          className="w-full bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-[#132e22] outline-none text-xs"
                        />
                        <label className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 rounded-full text-emerald-800 cursor-pointer text-[11px] font-semibold">
                          <Upload className="w-3 h-3" />
                          <span>Upload from Mac</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setJigsawPhoto)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Milestone Photos */}
                  <div className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-2.5">
                    <span className="font-bold text-emerald-700 text-xs font-serif">Puzzle 05: Milestone Timeline Photos</span>
                    <p className="text-[11px] text-[#3d6350]">
                      Customize the photos for each of your 5 chronological milestones.
                    </p>
                    <div className="space-y-2">
                      {memories.map((m, idx) => (
                        <div key={m.id || idx} className="flex items-center gap-3 p-2 bg-white border border-emerald-100 rounded-xl">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-emerald-50 shrink-0 border border-emerald-200">
                            <img src={m.photo} alt={m.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-[11px] font-bold text-[#132e22] truncate">{m.title}</div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={m.photo || ""}
                                onChange={(e) => handleMemoryChange(idx, "photo", e.target.value)}
                                placeholder="Photo URL..."
                                className="flex-1 bg-[#fafffd] border border-emerald-200 rounded px-2 py-0.5 text-[10px] text-[#132e22] outline-none"
                              />
                              <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 cursor-pointer text-[10px] font-semibold shrink-0">
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, (dataUrl) => handleMemoryChange(idx, "photo", dataUrl))}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 5 MILESTONES */}
          {activeTab === "memories" && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-[11px] text-[#3d6350]">
                Edit the 5 chronological memories used in Puzzle 05 (Milestone Scrapbook).
              </p>
              {memories.map((m, idx) => (
                <div key={m.id || idx} className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-emerald-700 font-serif font-bold">
                    <span>Milestone 0{idx + 1}</span>
                    <span className="text-[10px] text-[#3d6350]">Order: #{m.order}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={m.title}
                      onChange={(e) => handleMemoryChange(idx, "title", e.target.value)}
                      className="bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-[#132e22] outline-none font-serif"
                    />
                    <input
                      type="text"
                      placeholder="Date / Month"
                      value={m.year}
                      onChange={(e) => handleMemoryChange(idx, "year", e.target.value)}
                      className="bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-[#132e22] outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short description"
                    value={m.desc || ""}
                    onChange={(e) => handleMemoryChange(idx, "desc", e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-[#3d6350] outline-none text-[11px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#bbf7d0]/70 pt-3 mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("time_heist_config");
              localStorage.removeItem("time_heist_override");
              window.location.reload();
            }}
            className="text-[11px] text-[#3d6350] hover:text-rose-600 flex items-center gap-1 cursor-pointer transition font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-xs transition cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings ♡</span>
          </button>
        </div>
      </div>
    </div>
  );
}
