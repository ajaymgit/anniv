import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, Heart, ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { CROSSWORD_DATA } from "../../heistData";
import { sounds } from "../../utils/audio";
import { RibbonBow, FlowerBlossom, WashiTape, SparkleStar } from "../common/GirlyPopDecorations";

export default function RelationshipCrossword({ onComplete }) {
  const ROWS = CROSSWORD_DATA.rows || 13;
  const COLS = CROSSWORD_DATA.cols || 12;

  // Flatten all clues
  const allClues = useMemo(() => {
    const acrossWithDir = CROSSWORD_DATA.across.map((c) => ({ ...c, direction: "across" }));
    const downWithDir = CROSSWORD_DATA.down.map((c) => ({ ...c, direction: "down" }));
    return [...acrossWithDir, ...downWithDir];
  }, []);

  // Precompute grid cell metadata
  const gridMeta = useMemo(() => {
    const meta = {};
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        meta[`${r}-${c}`] = {
          r,
          c,
          isCell: false,
          char: "",
          number: null,
          acrossId: null,
          downId: null
        };
      }
    }

    CROSSWORD_DATA.across.forEach((item) => {
      for (let i = 0; i < item.word.length; i++) {
        const key = `${item.r}-${item.c + i}`;
        if (meta[key]) {
          meta[key].isCell = true;
          meta[key].char = item.word[i];
          meta[key].acrossId = item.id;
        }
      }
      if (meta[`${item.r}-${item.c}`]) {
        meta[`${item.r}-${item.c}`].number = item.number;
      }
    });

    CROSSWORD_DATA.down.forEach((item) => {
      for (let j = 0; j < item.word.length; j++) {
        const key = `${item.r + j}-${item.c}`;
        if (meta[key]) {
          meta[key].isCell = true;
          meta[key].char = item.word[j];
          meta[key].downId = item.id;
        }
      }
      if (meta[`${item.r}-${item.c}`]) {
        meta[`${item.r}-${item.c}`].number = item.number;
      }
    });

    return meta;
  }, [ROWS, COLS]);

  // Current inputs: mapping of "${r}-${c}" to user typed character
  const [gridValues, setGridValues] = useState(() => {
    const initial = {};
    Object.values(gridMeta).forEach((cell) => {
      if (cell.isCell) {
        initial[`${cell.r}-${cell.c}`] = "";
      }
    });
    return initial;
  });

  // Current focused cell { r, c }
  const [selectedCell, setSelectedCell] = useState(() => ({ r: 1, c: 0 })); // starts at 2-Across (KETCHUP)
  // Direction: "across" | "down"
  const [direction, setDirection] = useState("across");
  const [isCompleted, setIsCompleted] = useState(false);
  const hiddenInputRef = useRef(null);

  // Helper: check if a clue is solved
  const isClueSolved = (clue) => {
    if (!clue) return false;
    for (let i = 0; i < clue.word.length; i++) {
      const r = clue.direction === "across" ? clue.r : clue.r + i;
      const c = clue.direction === "across" ? clue.c + i : clue.c;
      const val = gridValues[`${r}-${c}`] || "";
      if (val.toUpperCase() !== clue.word[i]) return false;
    }
    return true;
  };

  const totalSolved = allClues.filter(isClueSolved).length;

  // Active clue resolution
  const activeClue = useMemo(() => {
    const key = `${selectedCell.r}-${selectedCell.c}`;
    const cell = gridMeta[key];
    if (!cell || !cell.isCell) return allClues[0];

    if (direction === "across" && cell.acrossId) {
      return allClues.find((cl) => cl.id === cell.acrossId) || allClues[0];
    }
    if (direction === "down" && cell.downId) {
      return allClues.find((cl) => cl.id === cell.downId) || allClues[0];
    }
    if (cell.acrossId) {
      return allClues.find((cl) => cl.id === cell.acrossId) || allClues[0];
    }
    if (cell.downId) {
      return allClues.find((cl) => cl.id === cell.downId) || allClues[0];
    }
    return allClues[0];
  }, [selectedCell, direction, gridMeta, allClues]);

  // Set of cells in the active clue
  const activeClueCellKeys = useMemo(() => {
    if (!activeClue) return new Set();
    const set = new Set();
    for (let i = 0; i < activeClue.word.length; i++) {
      const r = activeClue.direction === "across" ? activeClue.r : activeClue.r + i;
      const c = activeClue.direction === "across" ? activeClue.c + i : activeClue.c;
      set.add(`${r}-${c}`);
    }
    return set;
  }, [activeClue]);

  // Check if puzzle completion reached
  useEffect(() => {
    if (totalSolved === allClues.length && !isCompleted) {
      setIsCompleted(true);
      sounds.playSuccess();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#fda4af", "#c084fc", "#fb7185", "#fef08a"]
      });
    }
  }, [totalSolved, allClues.length, isCompleted]);

  // Focus hidden input on select
  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
  };

  const advanceCellInClue = (currentR, currentC, currentClue) => {
    if (!currentClue) return;
    const isAcross = currentClue.direction === "across";
    const len = currentClue.word.length;

    const curOffset = isAcross ? currentC - currentClue.c : currentR - currentClue.r;
    if (curOffset < len - 1) {
      const nextR = isAcross ? currentR : currentR + 1;
      const nextC = isAcross ? currentC + 1 : currentC;
      setSelectedCell({ r: nextR, c: nextC });
    } else {
      // Reached the end of word. If solved, advance to next unsolved clue
      advanceToNextUnsolved(currentClue.id);
    }
  };

  const advanceToNextUnsolved = (excludeId = null) => {
    const unsolved = allClues.find((c) => !isClueSolved(c) && c.id !== excludeId);
    if (unsolved) {
      selectClue(unsolved);
    }
  };

  const selectClue = (clue) => {
    sounds.playClick();
    setDirection(clue.direction);
    // Find first empty cell in clue, or first cell
    let targetCell = { r: clue.r, c: clue.c };
    for (let i = 0; i < clue.word.length; i++) {
      const cr = clue.direction === "across" ? clue.r : clue.r + i;
      const cc = clue.direction === "across" ? clue.c + i : clue.c;
      if (!gridValues[`${cr}-${cc}`]) {
        targetCell = { r: cr, c: cc };
        break;
      }
    }
    setSelectedCell(targetCell);
    focusInput();
  };

  const handleCellClick = (r, c) => {
    sounds.playClick();
    const key = `${r}-${c}`;
    const cell = gridMeta[key];
    if (!cell || !cell.isCell) return;

    if (selectedCell.r === r && selectedCell.c === c) {
      // Toggle direction if intersection
      if (cell.acrossId && cell.downId) {
        setDirection((prev) => (prev === "across" ? "down" : "across"));
      }
    } else {
      setSelectedCell({ r, c });
      // If current direction is not available in new cell, switch
      if (direction === "across" && !cell.acrossId && cell.downId) {
        setDirection("down");
      } else if (direction === "down" && !cell.downId && cell.acrossId) {
        setDirection("across");
      }
    }
    focusInput();
  };

  const inputLetter = (char) => {
    const key = `${selectedCell.r}-${selectedCell.c}`;
    const cell = gridMeta[key];
    if (!cell || !cell.isCell) return;

    sounds.playCrystalTap(char.charCodeAt(0) % 8);

    setGridValues((prev) => {
      const updated = { ...prev, [key]: char };

      // Check if active clue just got completed
      if (activeClue) {
        let isNowSolved = true;
        for (let i = 0; i < activeClue.word.length; i++) {
          const r = activeClue.direction === "across" ? activeClue.r : activeClue.r + i;
          const c = activeClue.direction === "across" ? activeClue.c + i : activeClue.c;
          const letterAtPos = (r === selectedCell.r && c === selectedCell.c) ? char : (updated[`${r}-${c}`] || "");
          if (letterAtPos.toUpperCase() !== activeClue.word[i]) {
            isNowSolved = false;
            break;
          }
        }
        if (isNowSolved) {
          setTimeout(() => {
            sounds.playSuccess();
          }, 100);
        }
      }

      return updated;
    });

    advanceCellInClue(selectedCell.r, selectedCell.c, activeClue);
  };

  const handleBackspace = () => {
    sounds.playClick();
    const key = `${selectedCell.r}-${selectedCell.c}`;

    if (gridValues[key]) {
      // Clear current cell
      setGridValues((prev) => ({ ...prev, [key]: "" }));
    } else if (activeClue) {
      // Move backward by 1 cell in active clue and clear it
      const isAcross = activeClue.direction === "across";
      const curOffset = isAcross ? selectedCell.c - activeClue.c : selectedCell.r - activeClue.r;
      if (curOffset > 0) {
        const prevR = isAcross ? selectedCell.r : selectedCell.r - 1;
        const prevC = isAcross ? selectedCell.c - 1 : selectedCell.c;
        const prevKey = `${prevR}-${prevC}`;
        setSelectedCell({ r: prevR, c: prevC });
        setGridValues((prev) => ({ ...prev, [prevKey]: "" }));
      }
    }
  };

  const handleKeyDown = (e) => {
    if (isCompleted) return;

    const key = e.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
      e.preventDefault();
      inputLetter(key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      moveCursor(0, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveCursor(0, -1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveCursor(1, 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveCursor(-1, 0);
    } else if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      advanceToNextUnsolved();
    }
  };

  const moveCursor = (dr, dc) => {
    sounds.playClick();
    let nr = selectedCell.r + dr;
    let nc = selectedCell.c + dc;

    // Scan in that direction for the nearest playable cell
    while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
      const k = `${nr}-${nc}`;
      if (gridMeta[k] && gridMeta[k].isCell) {
        setSelectedCell({ r: nr, c: nc });
        // Align direction if moving specifically
        if (dc !== 0 && gridMeta[k].acrossId) setDirection("across");
        if (dr !== 0 && gridMeta[k].downId) setDirection("down");
        return;
      }
      nr += dr;
      nc += dc;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, direction, activeClue, gridValues, isCompleted]);

  const handleRevealLetter = () => {
    sounds.playClick();
    const key = `${selectedCell.r}-${selectedCell.c}`;
    const cell = gridMeta[key];
    if (cell && cell.isCell && cell.char) {
      inputLetter(cell.char);
    }
  };

  const handleToggleDirection = () => {
    sounds.playClick();
    setDirection((prev) => (prev === "across" ? "down" : "across"));
    focusInput();
  };

  const currentCellMeta = gridMeta[`${selectedCell.r}-${selectedCell.c}`];
  const canToggleDirection = currentCellMeta && currentCellMeta.acrossId && currentCellMeta.downId;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center font-sans select-none text-[#132e22] pb-8">
      {/* Hidden input to bring up virtual mobile keyboard on touch devices */}
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        className="opacity-0 absolute -top-9999 left-0 pointer-events-none"
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            const char = val[val.length - 1].toUpperCase();
            if (/^[A-Z]$/.test(char)) {
              inputLetter(char);
            }
          }
          e.target.value = "";
        }}
      />

      {/* Header Banner */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <RibbonBow className="w-10 h-8 text-emerald-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold shadow-sm mb-2">
          <FlowerBlossom className="w-3.5 h-3.5" />
          <span>Puzzle 03 // Authentic 2D Crossword</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#132e22]">
          Our Inside-Joke Crossword
        </h2>
        <p className="text-xs sm:text-sm text-[#3d6350] mt-1 max-w-md mx-auto">
          An actual interlocking crossword board! 7 Across &amp; 7 Down clues intersecting across our favorite memories ♡
        </p>
      </div>

      {/* Main Pastel Crossword Workspace */}
      <div className="w-full bg-white border-2 border-[#bbf7d0] rounded-[36px] p-4 sm:p-7 shadow-card relative overflow-hidden">
        {/* Washi Tape Accent */}
        <div className="absolute -top-1.5 right-8 z-20 pointer-events-none">
          <WashiTape className="w-16 h-4 opacity-75" color="bg-emerald-200/80" />
        </div>

        {/* Top Bar: Progress & Helper Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#bbf7d0]/70 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full shadow-xs flex items-center gap-1.5">
              <FlowerBlossom className="w-3.5 h-3.5 text-emerald-500" />
              <span>{totalSolved} of 14 Clues Solved</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canToggleDirection && (
              <button
                type="button"
                onClick={handleToggleDirection}
                className="px-3 py-1 bg-[#f0fdf4] hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                {direction === "across" ? (
                  <>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Switch to Down</span>
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Switch to Across</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleRevealLetter}
              className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Peek Letter</span>
            </button>
          </div>
        </div>

        {/* Active Clue Focus Card */}
        {activeClue && (
          <div className="bg-[#f7faf8] border-2 border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 mb-5 shadow-xs relative">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                    activeClue.direction === "across"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-purple-100 text-purple-800 border-purple-200"
                  }`}
                >
                  {activeClue.number} {activeClue.direction.toUpperCase()}
                </span>
                <span className="text-xs text-[#3d6350] font-medium">
                  ({activeClue.length} Letters)
                </span>
              </div>

              {isClueSolved(activeClue) && (
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Solved ♡</span>
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-[#132e22] font-serif font-medium leading-relaxed">
              "{activeClue.clue}"
            </p>
          </div>
        )}

        {/* 2D Crossword Grid Container */}
        <div className="w-full flex justify-center overflow-x-auto pb-4 pt-1">
          <div
            className="grid gap-1 sm:gap-1.5 p-3 sm:p-4 bg-[#fff7fa] border border-[#bbf7d0] rounded-3xl shadow-inner max-w-full"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const key = `${r}-${c}`;
                const cell = gridMeta[key];
                if (!cell || !cell.isCell) {
                  return (
                    <div
                      key={key}
                      className="w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-[#fff2f6]/40 pointer-events-none"
                    />
                  );
                }

                const isSelected = selectedCell.r === r && selectedCell.c === c;
                const isInActiveClue = activeClueCellKeys.has(key);
                const enteredChar = gridValues[key] || "";
                const isCorrect = enteredChar.toUpperCase() === cell.char;
                const isPartOfSolvedWord =
                  (cell.acrossId && isClueSolved(CROSSWORD_DATA.across.find((w) => w.id === cell.acrossId))) ||
                  (cell.downId && isClueSolved(CROSSWORD_DATA.down.find((w) => w.id === cell.downId)));

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className={`relative w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center font-serif font-bold transition-all cursor-pointer focus:outline-none select-none ${
                      isSelected
                        ? "bg-white ring-2 ring-emerald-500 shadow-md scale-105 z-20 text-emerald-900 border border-emerald-300"
                        : isInActiveClue
                        ? "bg-emerald-100/85 border border-emerald-400/80 text-[#132e22] shadow-xs"
                        : isPartOfSolvedWord
                        ? "bg-emerald-50/70 border border-emerald-200/90 text-emerald-900"
                        : "bg-white border border-[#bbf7d0] text-[#132e22] hover:border-emerald-300"
                    }`}
                  >
                    {/* Clue Number in corner */}
                    {cell.number && (
                      <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-sans font-extrabold text-emerald-600/90 pointer-events-none leading-none">
                        {cell.number}
                      </span>
                    )}

                    {/* Letter */}
                    <span className="text-xs sm:text-base md:text-lg font-serif">
                      {enteredChar}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Instructions / Keyboard Hint */}
        <div className="text-center text-[11px] text-[#3d6350] my-3">
          <p>
            Click any cell to type • Click selected cell to switch Across / Down • Use Arrow Keys to navigate
          </p>
        </div>

        {/* Side-by-side Clues Section: ACROSS & DOWN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#bbf7d0]/70">
          {/* ACROSS CLUES */}
          <div className="bg-[#fffbfd] border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
              <h3 className="font-serif font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                <FlowerBlossom className="w-3.5 h-3.5 text-emerald-500" />
                <span>Across Clues</span>
              </h3>
              <span className="text-[11px] font-semibold text-[#3d6350]">
                {CROSSWORD_DATA.across.filter((c) => isClueSolved({ ...c, direction: "across" })).length}/7 Solved
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {CROSSWORD_DATA.across.map((clue) => {
                const solved = isClueSolved({ ...clue, direction: "across" });
                const isSelected = activeClue?.id === clue.id && activeClue?.direction === "across";

                return (
                  <div
                    key={clue.id}
                    onClick={() => selectClue({ ...clue, direction: "across" })}
                    className={`p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-emerald-100/90 border-emerald-400 shadow-xs font-medium text-emerald-950"
                        : solved
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900 opacity-80"
                        : "bg-white border-emerald-100 hover:bg-emerald-50/60 text-[#4c3547]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-lg text-[10px] font-bold shrink-0 flex items-center justify-center mt-0.5 ${
                        solved
                          ? "bg-emerald-200 text-emerald-800"
                          : isSelected
                          ? "bg-emerald-500 text-white"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {clue.number}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-2 leading-snug">{clue.clue}</p>
                      <span className="text-[10px] text-[#3d6350] font-sans">({clue.length} letters)</span>
                    </div>
                    {solved && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DOWN CLUES */}
          <div className="bg-[#fffbfd] border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
              <h3 className="font-serif font-bold text-sm text-purple-800 flex items-center gap-1.5">
                <FlowerBlossom className="w-3.5 h-3.5 text-purple-400" />
                <span>Down Clues</span>
              </h3>
              <span className="text-[11px] font-semibold text-[#3d6350]">
                {CROSSWORD_DATA.down.filter((c) => isClueSolved({ ...c, direction: "down" })).length}/7 Solved
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {CROSSWORD_DATA.down.map((clue) => {
                const solved = isClueSolved({ ...clue, direction: "down" });
                const isSelected = activeClue?.id === clue.id && activeClue?.direction === "down";

                return (
                  <div
                    key={clue.id}
                    onClick={() => selectClue({ ...clue, direction: "down" })}
                    className={`p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-purple-100/90 border-purple-400 shadow-xs font-medium text-purple-950"
                        : solved
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900 opacity-80"
                        : "bg-white border-emerald-100 hover:bg-emerald-50/60 text-[#4c3547]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-lg text-[10px] font-bold shrink-0 flex items-center justify-center mt-0.5 ${
                        solved
                          ? "bg-emerald-200 text-emerald-800"
                          : isSelected
                          ? "bg-purple-500 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {clue.number}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-2 leading-snug">{clue.clue}</p>
                      <span className="text-[10px] text-[#3d6350] font-sans">({clue.length} letters)</span>
                    </div>
                    {solved && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Completion Action Banner */}
        {isCompleted && (
          <div className="mt-6 pt-4 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-700 font-serif font-bold text-sm">
              <FlowerBlossom className="w-5 h-5 text-emerald-500" />
              <span>All 14 clues solved! Every single memory leads back to you ♡</span>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playSuccess();
                onComplete();
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-pop active:scale-95"
            >
              <span>Next Puzzle ♡</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
