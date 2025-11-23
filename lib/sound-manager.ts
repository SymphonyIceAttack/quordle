class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioContext();
      const savedEnabled = localStorage.getItem("sound-enabled");
      const savedVolume = localStorage.getItem("sound-volume");
      this.enabled = savedEnabled !== null ? JSON.parse(savedEnabled) : true;
      this.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
    }
  }

  private initAudioContext() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = this.volume,
  ) {
    if (!this.enabled || !this.audioContext) return;

    this.resumeAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.01,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playChord(
    frequencies: number[],
    duration: number,
    type: OscillatorType = "sine",
    volume: number = this.volume,
  ) {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration, type, volume);
      }, index * 50);
    });
  }

  // Keyboard click sound
  playKeyPress() {
    this.playTone(600, 0.04, "sine", 0.2);
  }

  // Letter input sound (slightly different from key press)
  playLetterInput() {
    this.playTone(450, 0.06, "sine", 0.18);
  }

  // Guess submission sound
  playSubmit() {
    this.playTone(350, 0.12, "sine", 0.25);
  }

  // Success celebration sound (ascending chord)
  playSuccess() {
    const frequencies = [392, 493.88, 587.33]; // G4, B4, D5 (gentler)
    this.playChord(frequencies, 0.25, "sine", 0.3);
  }

  // Error notification sound (gentle, not jarring)
  playError() {
    this.playTone(180, 0.15, "sine", 0.2);
  }

  // Puzzle solved sound
  playPuzzleSolved() {
    this.playChord([349.23, 440, 523.25], 0.2, "sine", 0.28);
  }

  // All puzzles solved (victory fanfare)
  playGameVictory() {
    const sequence = [
      { freq: 392, delay: 0 }, // G4
      { freq: 493.88, delay: 100 }, // B4
      { freq: 587.33, delay: 200 }, // D5
      { freq: 783.99, delay: 300 }, // G5
      { freq: 659.25, delay: 500 }, // E5
      { freq: 783.99, delay: 700 }, // G5
    ];

    sequence.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.freq, 0.18, "sine", 0.35);
      }, note.delay);
    });
  }

  // Flip sound (for letter flip animation)
  playFlip() {
    this.playTone(250, 0.08, "sine", 0.15);
  }

  // Game over sound
  playGameOver() {
    this.playTone(130, 0.4, "sine", 0.25);
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("sound-enabled", JSON.stringify(this.enabled));
    if (this.enabled) {
      this.playLetterInput();
    }
  }

  // Set volume
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem("sound-volume", this.volume.toString());
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Check if sound is enabled
  isEnabled() {
    return this.enabled;
  }

  // Play a test sound
  testSound() {
    this.playLetterInput();
  }
}

export const soundManager =
  typeof window !== "undefined" ? new SoundManager() : null;
