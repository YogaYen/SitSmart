/**
 * Web Audio API Ergonomic Alert Synthesizer
 * Generates pleasant, non-jarring ergonomic notification tones and pop alerts
 * without requiring external MP3/WAV audio files.
 */

class AudioAlertEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;
    this.lastNotificationTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  // Two crisp, distinct pop sounds in immediate succession ("pop... pop!")
  playDoublePop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Pop 1: First bubble pop (400Hz -> 880Hz -> 280Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(400, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.035);
      osc1.frequency.exponentialRampToValueAtTime(280, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.40, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.085);

      // Pop 2: Second distinct pop staggered 120ms later (540Hz -> 1200Hz -> 360Hz)
      const t2 = now + 0.12;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(540, t2);
      osc2.frequency.exponentialRampToValueAtTime(1200, t2 + 0.035);
      osc2.frequency.exponentialRampToValueAtTime(360, t2 + 0.08);

      gain2.gain.setValueAtTime(0.001, t2);
      gain2.gain.linearRampToValueAtTime(0.42, t2 + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.08);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.085);
    } catch (e) {
      console.warn("Audio double pop error:", e);
    }
  }

  // Alias for backward compatibility
  playPopSound() {
    this.playDoublePop();
  }

  // Cancels any ongoing spoken audio immediately
  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Speech cancel error:", e);
      }
    }
  }

  // Speaks actionable audio instructions so busy users hear what to do without needing to see the screen
  speakVoiceInstruction(text, options = {}) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // Cancel any ongoing utterance to avoid queuing delays
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const character = options.character || 'maya';

      // Tailored pitch and cadence per character personality
      let defaultRate = 1.0;
      let defaultPitch = 1.0;
      if (character === 'maya') {
        defaultRate = 0.98; // gentle, reassuring yoga pacing
        defaultPitch = 1.08; // warm, feminine melodic tone
      } else if (character === 'alex') {
        defaultRate = 1.05; // energetic, upbeat athletic pacing
        defaultPitch = 0.92; // confident, lower trainer tone
      } else if (character === 'zenbot') {
        defaultRate = 1.02; // precise, structured digital pacing
        defaultPitch = 1.20; // futuristic synthesizer tone
      }

      utterance.rate = options.rate || defaultRate;
      utterance.pitch = options.pitch || defaultPitch;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      // Select character-matched voice if available on system
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        let preferred = null;
        if (character === 'maya') {
          preferred = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Victoria') || v.name.includes('Female'))
          );
        } else if (character === 'alex') {
          preferred = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('David') || v.name.includes('Guy') || v.name.includes('George') || v.name.includes('Male'))
          );
        } else if (character === 'zenbot') {
          preferred = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
          );
        }
        if (!preferred) {
          preferred = voices.find(v => v.lang.startsWith('en'));
        }
        if (preferred) utterance.voice = preferred;
      }

      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;
      if (options.onError) utterance.onerror = options.onError;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
    }
  }

  // Plays 2 pop sounds immediately, followed by spoken audio instructions
  playYellowPostureAlert(instructionText = "Your posture has drifted into yellow. Sit up straight, lift your chin, and align your spine.", options = {}) {
    if (this.isMuted) return;

    // 1. Immediately play pop sound two times
    this.playDoublePop();

    // 2. Play audio instructions 320ms later after the second pop finishes
    setTimeout(() => {
      this.speakVoiceInstruction(instructionText, options);
    }, 320);
  }

  // Soft warning chime when slouching persists (>5 sec)
  playSlouchWarning() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Uplifting chime when user corrects posture or completes a micro-break
  playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        const startTime = now + idx * 0.1;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      console.warn("Success audio chime error:", e);
    }
  }

  // Request browser Web Notification permission
  async requestNotificationPermission() {
    if (!this.hasNotificationSupport) return false;
    if (Notification.permission === "granted") return true;
    try {
      const result = await Notification.requestPermission();
      return result === "granted";
    } catch (e) {
      return false;
    }
  }

  // Trigger system notification (throttled to max once per 15 seconds)
  sendDesktopNotification(title, body) {
    if (!this.hasNotificationSupport) return;
    if (Notification.permission !== "granted") return;

    const now = Date.now();
    if (now - this.lastNotificationTime < 15000) {
      return; // prevent notification spamming
    }
    this.lastNotificationTime = now;

    try {
      const notif = new Notification(title, {
        body,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444'><path d='M12 2L1 21h22L12 2zm0 3.5L20.3 19H3.7L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z'/></svg>",
        silent: true,
        tag: "sitsmart-posture-alert",
        renotify: true
      });

      // Auto close after 6 seconds
      setTimeout(() => {
        try { notif.close(); } catch (e) {}
      }, 6000);
    } catch (err) {
      console.warn("Desktop notification failed:", err);
    }
  }
}

export const soundManager = new AudioAlertEngine();

// Auto-unlock Web Audio Context on the first user interaction anywhere on the page
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    soundManager.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}
