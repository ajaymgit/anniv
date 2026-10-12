import React, { useState } from "react";
import { Settings, Save, RotateCcw, X, Heart, Calendar, KeyRound, Image, HelpCircle, FileText } from "lucide-react";
import { sounds } from "../utils/audio";
import { DEFAULT_TRIVIA_QUESTIONS, DEFAULT_MEMORY_PAIRS } from "../heistData";
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
  const [jigsawPhoto, setJigsawPhoto] = useState(storyData.jigsawPhoto || "");
  const [memories, setMemories] = useState(storyData.memories || []);
  const [triviaQuestions, setTriviaQuestions] = useState(
    storyData.triviaQuestions || DEFAULT_TRIVIA_QUESTIONS
  );

  if (!isOpen) return null;

  const handleMemoryChange = (index, field, value) => {
    const updated = [...memories];
    updated[index] = { ...updated[index], [field]: value };
    setMemories(updated);
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
      memories,
      triviaQuestions
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
            <span>Photos</span>
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

          {/* TAB 3: PHOTOS */}
          {activeTab === "photos" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Puzzle 02 Jigsaw Photo */}
              <div className="p-4 bg-[#fff8fa] border border-emerald-200 rounded-2xl space-y-2">
                <span className="font-bold text-emerald-700 text-xs font-serif">Puzzle 02: Polaroid Jigsaw Photo</span>
                <p className="text-[11px] text-[#3d6350]">
                  Upload your selfie or paste a photo URL to be used in the 3x3 tile-swap puzzle.
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
                    <label className="inline-block px-3 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 rounded-full text-emerald-800 cursor-pointer text-[11px] font-semibold">
                      Upload from Mac
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
