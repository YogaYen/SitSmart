/**
 * notifications.js - Audio & Browser Push Notification Manager for SitSmart
 * Provides Web Audio API synthesized chimes and system notifications for:
 * - 5-Second Sustained Slouch Warning
 * - Hourly Movement Reminders
 * - Micro-Break Completion Chimes
 * - Workday Hydration Prompts
 */

class NotificationManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.notificationPermission = "default";

    // Check notification support
    if (typeof window !== "undefined" && "Notification" in window) {
      this.notificationPermission = Notification.permission;
    }
  }

  // Initialize Web Audio Context lazily on user gesture
  getAudioContext() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Request browser notification permissions
  async requestNotificationPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        this.notificationPermission = permission;
        return permission === "granted";
      } catch (err) {
        console.warn("Notification permission request failed:", err);
        return false;
      }
    }
    return false;
  }

  // Send Browser Push Notification if granted
  sendPushNotification(title, options = {}) {
    if (this.isMuted) return;

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          body: options.body || "Time to check your posture and stretch!",
          silent: this.isMuted,
          ...options
        });
      } catch (err) {
        console.warn("Failed to dispatch push notification:", err);
      }
    }
  }

  // Play Gentle Slouch Warning (Double Pulse Amber/Red tone)
  playSlouchWarning() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Descending gentle warning note (392Hz G4 -> 330Hz E4)
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.25);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);

      // Second soft pulse
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(330, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(261.6, now + 0.45);

      gain2.gain.setValueAtTime(0.001, now + 0.2);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.24);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.2);
      osc2.stop(now + 0.52);
    } catch (e) {
      console.warn("Audio warning playback error:", e);
    }
  }

  // Play Uplifting Success / Break Complete Chime (C-Major Triad Arpeggio)
  playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
      });
    } catch (e) {
      console.warn("Audio success playback error:", e);
    }
  }

  // Soft Movement Bell (Harmonic Bell tone)
  playMovementBell() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {
      console.warn("Audio bell playback error:", e);
    }
  }
}

export const notifications = new NotificationManager();
export default notifications;
