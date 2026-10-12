import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SPACES } from "../spaces/spacesConfig";

const STORAGE_KEY = "anniversary_suite_v1";

const defaultProgress = {
  "01-time-heist": { visited: false, completed: false, lastVisited: null },
  "02-constellation": { visited: false, completed: false, lastVisited: null },
  "03-seven-letters": { visited: false, openedLetters: [], completed: false, lastVisited: null },
  "04-couplestick": { visited: false, testedSimulator: false, completed: false, lastVisited: null },
  "05-undecided": { visited: false, completed: false, lastVisited: null },
  "06-mythri-effect": { visited: false, unlockedLayers: [1], completed: false, lastVisited: null },
  "07-her-space": { visited: false, hasDraft: false, completed: false, lastVisited: null }
};

export const SPACE_SLUGS = {
  "01-time-heist": "vault",
  "02-constellation": "constellation",
  "03-seven-letters": "letters",
  "04-couplestick": "couplestick",
  "05-undecided": "five",
  "06-mythri-effect": "mythri-effect",
  "07-her-space": "journal"
};

export const STAGE_SLUGS = {
  0: "keypad",
  1: "jigsaw",
  2: "crossword",
  3: "lightchamber",
  4: "timeline",
  5: "trivia",
  6: "match",
  7: "reveal"
};

export const ROUTE_MAP = {
  // Home
  "": { spaceId: null, stage: 0 },
  "home": { spaceId: null, stage: 0 },
  "anniv": { spaceId: null, stage: 0 },

  // Space 01 (The Memory Vault) & specific games
  "vault": { spaceId: "01-time-heist", stage: 0 },
  "time-heist": { spaceId: "01-time-heist", stage: 0 },
  "memory-vault": { spaceId: "01-time-heist", stage: 0 },
  "game": { spaceId: "01-time-heist", stage: 0 },
  "keypad": { spaceId: "01-time-heist", stage: 0 },
  "jigsaw": { spaceId: "01-time-heist", stage: 1 },
  "crossword": { spaceId: "01-time-heist", stage: 2 },
  "lightchamber": { spaceId: "01-time-heist", stage: 3 },
  "chamber": { spaceId: "01-time-heist", stage: 3 },
  "timeline": { spaceId: "01-time-heist", stage: 4 },
  "iq": { spaceId: "01-time-heist", stage: 4 },
  "memory-iq": { spaceId: "01-time-heist", stage: 4 },
  "trivia": { spaceId: "01-time-heist", stage: 5 },
  "match": { spaceId: "01-time-heist", stage: 6 },
  "reveal": { spaceId: "01-time-heist", stage: 7 },

  // Space 02 through 07
  "constellation": { spaceId: "02-constellation", stage: 0 },
  "stars": { spaceId: "02-constellation", stage: 0 },
  "letters": { spaceId: "03-seven-letters", stage: 0 },
  "seven-letters": { spaceId: "03-seven-letters", stage: 0 },
  "couplestick": { spaceId: "04-couplestick", stage: 0 },
  "five": { spaceId: "05-undecided", stage: 0 },
  "chapter-five": { spaceId: "05-undecided", stage: 0 },
  "mythri-effect": { spaceId: "06-mythri-effect", stage: 0 },
  "journal": { spaceId: "07-her-space", stage: 0 },
  "her-space": { spaceId: "07-her-space", stage: 0 }
};

const parseCurrentUrl = () => {
  if (typeof window === "undefined") return { spaceId: null, stage: 0 };

  let rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
  // Support prefixes like /anniversary/..., /anniv/...
  rawPath = rawPath.replace(/^(anniversary|anniv)\/?/, "");

  const params = new URLSearchParams(window.location.search);
  const puzzleParam = (params.get("puzzle") || params.get("game") || "").toLowerCase();
  const stageParam = params.get("stage");

  if (puzzleParam && ROUTE_MAP[puzzleParam]) {
    return ROUTE_MAP[puzzleParam];
  }
  if (stageParam !== null && !isNaN(parseInt(stageParam, 10))) {
    return { spaceId: "01-time-heist", stage: parseInt(stageParam, 10) };
  }

  if (ROUTE_MAP[rawPath] !== undefined) {
    return ROUTE_MAP[rawPath];
  }

  return { spaceId: null, stage: 0 };
};

const AnniversaryContext = createContext(null);

export function AnniversaryProvider({ children }) {
  const initialRoute = parseCurrentUrl();
  const [activeSpaceId, setActiveSpaceId] = useState(initialRoute.spaceId);
  const [heistStage, setHeistStage] = useState(initialRoute.stage);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("time_heist_sound_enabled");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("time_heist_sound_enabled", soundEnabled ? "true" : "false");
    } catch (e) {}
  }, [soundEnabled]);

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultProgress, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load progress from localStorage", e);
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("Could not save progress to localStorage", e);
    }
  }, [progress]);

  // Synchronize browser URL on popstate (Back/Forward button)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentUrl();
      setActiveSpaceId(route.spaceId);
      setHeistStage(route.stage);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const markSpaceVisited = useCallback((spaceId) => {
    setProgress((prev) => ({
      ...prev,
      [spaceId]: {
        ...(prev[spaceId] || {}),
        visited: true,
        lastVisited: new Date().toISOString()
      }
    }));
  }, []);

  const markSpaceCompleted = useCallback((spaceId) => {
    setProgress((prev) => ({
      ...prev,
      [spaceId]: {
        ...(prev[spaceId] || {}),
        completed: true,
        lastVisited: new Date().toISOString()
      }
    }));
  }, []);

  const goToSpace = useCallback((spaceId, stage = null) => {
    setActiveSpaceId(spaceId);
    if (stage !== null) {
      setHeistStage(stage);
    }
    if (spaceId) {
      markSpaceVisited(spaceId);

      const slug = SPACE_SLUGS[spaceId] || spaceId;
      const targetPath = stage !== null && spaceId === "01-time-heist" && STAGE_SLUGS[stage]
        ? `/${STAGE_SLUGS[stage]}`
        : `/${slug}`;

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ spaceId, stage }, "", targetPath);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [markSpaceVisited]);

  const goToHub = useCallback(() => {
    setActiveSpaceId(null);
    if (window.location.pathname !== "/home" && window.location.pathname !== "/") {
      window.history.pushState({ spaceId: null }, "", "/home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, []);

  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const visitedCount = Object.values(progress).filter((p) => p.visited).length;

  return (
    <AnniversaryContext.Provider
      value={{
        spaces: SPACES,
        activeSpaceId,
        activeSpace: SPACES.find((s) => s.id === activeSpaceId) || null,
        heistStage,
        setHeistStage,
        progress,
        completedCount,
        visitedCount,
        soundEnabled,
        setSoundEnabled,
        goToSpace,
        goToHub,
        markSpaceVisited,
        markSpaceCompleted,
        resetAllProgress
      }}
    >
      {children}
    </AnniversaryContext.Provider>
  );
}

export function useAnniversary() {
  const context = useContext(AnniversaryContext);
  if (!context) {
    throw new Error("useAnniversary must be used within an AnniversaryProvider");
  }
  return context;
}
