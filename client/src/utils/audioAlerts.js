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
  }

  // Crisp, punchy "double pop / ping" tone that cuts through clearly while working on other tabs/windows
  playPopSound() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Pop 1: Rapid pitch sweep (bubble pop 380Hz -> 780Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(380, now);
      osc1.frequency.exponentialRampToValueAtTime(780, now + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(260, now + 0.08);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.085);

      // Pop 2 (staggered 65ms later): Higher snap (520Hz -> 1150Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, now + 0.065);
      osc2.frequency.exponentialRampToValueAtTime(1150, now + 0.105);
      osc2.frequency.exponentialRampToValueAtTime(350, now + 0.165);

      gain2.gain.setValueAtTime(0.001, now + 0.065);
      gain2.gain.linearRampToValueAtTime(0.38, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.165);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.065);
      osc2.stop(now + 0.17);
    } catch (e) {
      console.warn("Audio pop chime error:", e);
    }
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
