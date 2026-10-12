import React, { createContext, useContext, useState, useEffect } from "react";
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

const AnniversaryContext = createContext(null);

export function AnniversaryProvider({ children }) {
  const [activeSpaceId, setActiveSpaceId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
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

  const markSpaceVisited = (spaceId) => {
    setProgress((prev) => ({
      ...prev,
      [spaceId]: {
        ...(prev[spaceId] || {}),
        visited: true,
        lastVisited: new Date().toISOString()
      }
    }));
  };

  const markSpaceCompleted = (spaceId) => {
    setProgress((prev) => ({
      ...prev,
      [spaceId]: {
        ...(prev[spaceId] || {}),
        completed: true,
        lastVisited: new Date().toISOString()
      }
    }));
  };

  const goToSpace = (spaceId) => {
    setActiveSpaceId(spaceId);
    if (spaceId) {
      markSpaceVisited(spaceId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToHub = () => {
    setActiveSpaceId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAllProgress = () => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const visitedCount = Object.values(progress).filter((p) => p.visited).length;

  return (
    <AnniversaryContext.Provider
      value={{
        spaces: SPACES,
        activeSpaceId,
        activeSpace: SPACES.find((s) => s.id === activeSpaceId) || null,
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
