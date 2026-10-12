// Web Audio API Synthesizer with Soft-Cyber / Romantic Chimes & Ambient Audio
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.droneGain = null;
    this.droneOscs = [];
    this.isDronePlaying = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAmbientDrone();
    }
    return this.muted;
  }

  // Stop any background drone or buzzing
  stopAmbientDrone() {
    try {
      if (this.droneOscs && this.droneOscs.length > 0) {
        this.droneOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
        this.droneOscs = [];
      }
      if (this.droneGain) {
        try {
          this.droneGain.disconnect();
        } catch (e) {}
        this.droneGain = null;
      }
    } catch (e) {}
    this.isDronePlaying = false;
  }

  // Disabled to eliminate vibrating drone noise
  startAmbientDrone() {
    this.stopAmbientDrone();
  }

  // Crystal chime for keypad & PIN interaction
  playCrystalTap(toneIndex = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const baseFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51];
    const freq = baseFreqs[toneIndex % baseFreqs.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Soft click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Radar diagnostic sweep
  playScan() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Tile swap sound
  playTileSwap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Card flip snap
  playCardFlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  // Success / Stage Breach Chord (sweet starlight chord)
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5]; // C major triad + octave
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.07;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }

  // Error buzz (playful, gentle)
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Cheerful scooter horn ("Beep-beep!")
  playHonk() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    [0, 0.12].forEach((delay) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + delay;

      osc.type = "sine";
      osc.frequency.setValueAtTime(620, startTime);
      osc.frequency.setValueAtTime(680, startTime + 0.04);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
  }

  // Music-box victory fanfare
  playVictoryFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.2 },
      { f: 659.25, d: 0.2 },
      { f: 783.99, d: 0.25 },
      { f: 1046.5, d: 0.5 },
      { f: 880.0, d: 0.3 },
      { f: 1046.5, d: 0.8 },
    ];

    let time = this.ctx.currentTime + 0.08;
    notes.forEach(({ f, d }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + d);
      time += d;
    });
  }
}

export const sounds = new SoundEngine();
