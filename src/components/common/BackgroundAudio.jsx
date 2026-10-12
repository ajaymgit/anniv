import React, { useRef, useEffect } from "react";
import { useAnniversary } from "../../context/AnniversaryContext";

export default function BackgroundAudio() {
  const { soundEnabled } = useAnniversary();
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35; // Comfortable, sweet ambient background volume

    if (soundEnabled) {
      audio.play().catch((err) => {
        // Autoplay may be paused until first user interaction
        console.log("Autoplay waiting for user interaction:", err);
      });
    } else {
      audio.pause();
    }
  }, [soundEnabled]);

  // Ensure song plays on user's first interaction if sound is enabled
  useEffect(() => {
    const handleGesture = () => {
      const audio = audioRef.current;
      if (audio && soundEnabled && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("click", handleGesture);
    window.addEventListener("touchstart", handleGesture);
    window.addEventListener("keydown", handleGesture);
    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, [soundEnabled]);

  return (
    <audio
      ref={audioRef}
      src="/song.mp3"
      loop
      preload="auto"
    />
  );
}
