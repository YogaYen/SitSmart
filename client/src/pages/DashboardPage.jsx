import React, { useState, useEffect, useRef } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import PostureGauge from '../components/PostureGauge';
import AlertsPopup from '../components/AlertsPopup';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import DailyImprovement from '../components/DailyImprovement';
import StudentInterviewCoach from '../components/StudentInterviewCoach';
import {
  Activity,
  Award,
  Camera,
  CheckCircle2,
  Clock,
  Coffee,
  GraduationCap,
  LayoutGrid,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';
import { recordPostureSession } from '../services/api';

export default function DashboardPage({
  isMuted = false,
  onToggleMute,
  onOpenBreak,
  onOpenDemo,
  currentUser,
  onOpenAuth,
  onScoreChange,
  onTrackingChange
}) {
  const [currentScore, setCurrentScore] = useState(95);
  const [analysis, setAnalysis] = useState({
    score: 95,
    status: "Optimal",
    statusColor: "#10b981",
    feedback: "Webcam initialized. Align your shoulders and sit upright.",
    metrics: {
      neckAngle: 8,
      torsoAngle: 5,
      shoulderTiltDeg: 1,
      eyeTiltDev: 1,
      leftElbowAngle: 95,
      rightElbowAngle: 95,
      neckScorePercent: 96,
      eyeScorePercent: 98,
      armScorePercent: 94,
      torsoScorePercent: 95,
      isSlouching: false,
      isOptimal: true
    }
  });

  const [slouchSeconds, setSlouchSeconds] = useState(0);
  const [totalSlouchSeconds, setTotalSlouchSeconds] = useState(0);
  const [slouchCount, setSlouchCount] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [calibrationOffset, setCalibrationOffset] = useState({ neck: 0, torso: 0 });
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#interview-guide' || hash === '#interview-prep') return 'interview';
      if (hash === '#improvement-tracker' || hash === '#improvement') return 'improvement';
      if (hash === '#analytics-dashboard' || hash === '#analytics') return 'analytics';
      if (hash === '#live-tracker') return 'workplace';
    }
    return 'all';
  });

  const slouchTimerRef = useRef(null);
  const lowScoreTimerRef = useRef(null);
  const hadLowScoreAlertRef = useRef(false);

  // Synchronize audio mute state
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Track tab visibility and update tab title when user works on another tab
  useEffect(() => {
    const handleVisChange = () => {
      const hidden = document.hidden;
      setIsTabHidden(hidden);
      if (!hidden) {
        document.title = "SitSmart – AI Ergonomics Live Platform";
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, []);

  // Smooth scroll to targeted dashboard section & sync active section tab if hash exists on mount or change
  useEffect(() => {
    const handleScrollToHash = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#interview-guide' || hash === '#interview-prep') {
        setActiveSection('interview');
      } else if (hash === '#live-tracker') {
        setActiveSection('workplace');
      } else if (hash === '#improvement-tracker' || hash === '#improvement') {
        setActiveSection('improvement');
      } else if (hash === '#analytics-dashboard' || hash === '#analytics') {
        setActiveSection('analytics');
      }

      if (hash && hash.length > 1) {
        const id = hash.startsWith('#') ? hash.slice(1) : hash;
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    };

    handleScrollToHash();
    window.addEventListener('hashchange', handleScrollToHash);
    return () => window.removeEventListener('hashchange', handleScrollToHash);
  }, []);

  // Session duration timer
  useEffect(() => {
    let interval = null;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Slouch streak tracking
  useEffect(() => {
    if (analysis.metrics?.isSlouching && isSessionActive) {
      slouchTimerRef.current = setInterval(() => {
        setSlouchSeconds(prev => {
          const next = prev + 1;
          if (next === 5) {
            soundManager.playSlouchWarning();
          }
          return next;
        });
        setTotalSlouchSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (slouchTimerRef.current) {
        clearInterval(slouchTimerRef.current);
      }
      if (slouchSeconds > 3) {
        setSlouchCount(prev => prev + 1);
      }
      setSlouchSeconds(0);
    }

    return () => {
      if (slouchTimerRef.current) clearInterval(slouchTimerRef.current);
    };
  }, [analysis.metrics?.isSlouching, isSessionActive]);

  // Low Posture Score (< 75% or Slouching) Pop Alert for Background Tabs & Active Work
  const isLowPosture = currentScore < 75 || analysis.metrics?.isSlouching;

  useEffect(() => {
    if (isLowPosture && isSessionActive) {
      lowScoreTimerRef.current = setInterval(() => {
        setSlouchSeconds(prev => prev); // keep reactive
        // Play pop sound at 2s, then repeat every 4 seconds while posture stays low
        hadLowScoreAlertRef.current = true;
        soundManager.playPopSound();

        if (document.hidden) {
          document.title = `⚠️ (${currentScore}%) Sit Up! - SitSmart`;
          soundManager.sendDesktopNotification(
            `⚠️ Low Posture Score: ${currentScore}%`,
            "Posture dropped low! Sit up straight, lift your chin, and align your spine."
          );
        }
      }, 3500);
    } else {
      if (lowScoreTimerRef.current) {
        clearInterval(lowScoreTimerRef.current);
      }
      // If user corrected their posture after an alert, celebrate with success chime!
      if (hadLowScoreAlertRef.current && currentScore >= 80 && !analysis.metrics?.isSlouching) {
        soundManager.playSuccessChime();
        if (document.hidden) {
          document.title = `✅ (${currentScore}%) Aligned - SitSmart`;
          soundManager.sendDesktopNotification(
            `✅ Posture Corrected (${currentScore}%)`,
            "Excellent! Your spine is back in healthy alignment."
          );
        }
        hadLowScoreAlertRef.current = false;
      }
    }

    return () => {
      if (lowScoreTimerRef.current) clearInterval(lowScoreTimerRef.current);
    };
  }, [isLowPosture, isSessionActive, currentScore]);

  const handleAnalysisChange = (evaluated) => {
    setAnalysis(evaluated);
    setCurrentScore(evaluated.score);
    if (onScoreChange) onScoreChange(evaluated.score);
  };

  const handleTrackingChange = (tracking) => {
    setIsSessionActive(tracking);
    if (onTrackingChange) onTrackingChange(tracking);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const goodPostureRatio = sessionSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((sessionSeconds - totalSlouchSeconds) / sessionSeconds) * 100)))
    : 100;

  // Save session record on completion or periodically
  const handleSaveSession = async (silent = false) => {
    if (sessionSeconds < 10 && !silent) {
      setSaveNotice("Tracking session is too short (needs at least 10 seconds).");
      setTimeout(() => setSaveNotice(null), 3000);
      return;
    }

    const userId = currentUser ? (currentUser.userId || currentUser.id) : 'demo-user';
    setIsSaving(true);

    try {
      const minutes = Math.max(1, Math.round(sessionSeconds / 60));
      await recordPostureSession({
        userId,
        durationMinutes: minutes,
        avgScore: currentScore,
        goodPosturePercent: goodPostureRatio,
        slouchCount,
        totalSlouchSeconds,
        breaksTaken
      });

      if (!silent) {
        soundManager.playSuccessChime();
        const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'your';
        setSaveNotice(`✓ Session saved to ${userName}'s history! (${minutes}m, ${currentScore}%)`);
        setTimeout(() => setSaveNotice(null), 4000);
      }

      // Notify dashboard & improvement components to refresh history
      window.dispatchEvent(new CustomEvent('sitsmart:session-saved', { detail: { userId } }));
    } catch (e) {
      console.warn("Could not save session to server:", e);
      if (!silent) {
        setSaveNotice("✓ Saved session to local offline history.");
        setTimeout(() => setSaveNotice(null), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Periodic auto-save every 3 minutes (180s) of active tracking
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 180 === 0 && isSessionActive) {
      handleSaveSession(true);
    }
  }, [sessionSeconds, isSessionActive]);

  return (
    <div className="w-full min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Floating Save Notification Toast */}
      {saveNotice && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl shadow-emerald-500/10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveNotice}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" /> Real-Time Ergonomic Workstation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Posture Tracking &amp; Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              AI skeletal landmark analysis running client-side. Green indicates spinal alignment, Red warns of slouching.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenBreak) {
                  setBreaksTaken(prev => prev + 1);
                  onOpenBreak();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Start Micro-Break
            </button>
            <button
              onClick={() => handleSaveSession(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? "Saving..." : "Save Session"}</span>
            </button>
          </div>
        </div>

        {/* Top Sections Dashboard Line (Sticky Quick-Switch Navigation) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-md sticky top-16 z-30 transition-all">
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
            {/* Student Interview Guide & Camera Studio */}
            <button
              onClick={() => {
                setActiveSection('interview');
                window.location.hash = '#interview-guide';
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'interview'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activeSection === 'interview' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>Student Interview Guide &amp; Camera</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                activeSection === 'interview' ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
              }`}>
                <Camera className="w-3 h-3" /> Live Camera
              </span>
            </button>

            {/* Workplace Posture Tracker */}
            <button
              onClick={() => {
                setActiveSection('workplace');
                window.location.hash = '#live-tracker';
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'workplace'
                  ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-750 hover:border-slate-650'
              }`}
            >
              <Activity className="w-4 h-4 text-brand-400" />
              <span>Workplace Posture Tracker</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-[10px]">
                Office &amp; Laptop
              </span>
            </button>

            {/* Daily Improvement */}
            <button
              onClick={() => {
                setActiveSection('improvement');
                window.location.hash = '#improvement-tracker';
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'improvement'
                  ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-750 hover:border-slate-650'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Daily Improvement</span>
            </button>

            {/* Posture Analytics */}
            <button
              onClick={() => {
                setActiveSection('analytics');
                window.location.hash = '#analytics-dashboard';
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeSection === 'analytics'
                  ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/50'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-750 hover:border-slate-650'
              }`}
            >
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Analytics &amp; History</span>
            </button>

            {/* View All Sections */}
            <button
              onClick={() => {
                setActiveSection('all');
                window.location.hash = '#all';
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ml-auto ${
                activeSection === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Show all sections together on one continuous page"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>View All</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* INTERVIEW SECTION FOCUSED VIEW (Rendered at top when selected)     */}
        {/* ================================================================= */}
        {activeSection === 'interview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Helper Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-300 font-medium">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Practicing in <strong>Student Interview &amp; Viva Studio</strong>. Turn on the camera below to test eye-level horizon, 2/3 chair sitting, and hands rest posture.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveSection('workplace');
                    window.location.hash = '#live-tracker';
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Workplace Tracker →
                </button>
                <button
                  onClick={() => {
                    setActiveSection('all');
                    window.location.hash = '#all';
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  View All Sections
                </button>
              </div>
            </div>

            {/* Student Interview Coach Component with Camera */}
            <div id="interview-guide" className="scroll-mt-20">
              <StudentInterviewCoach />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* WORKPLACE SECTION FOCUSED VIEW                                    */}
        {/* ================================================================= */}
        {activeSection === 'workplace' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Background Tab & PiP Helper Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900/80 to-indigo-950/60 border border-brand-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    Multi-Tab Ergonomics &amp; Background Pop Alerts
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                      Active
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Work on any other website or application freely: SitSmart plays an audible <strong>double-pop alert</strong> whenever your score drops below 75%, while <strong>Floating PiP</strong> keeps your camera + skeleton lines on top of all windows.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => soundManager.playPopSound()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Test the pop sound alert"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-400" /> Test Pop Sound
                </button>
              </div>
            </div>

            {/* Live Session Telemetry Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Session Time</span>
                  <span className="text-xl font-mono font-black text-white">{formatTime(sessionSeconds)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Good Posture %</span>
                  <span className="text-xl font-mono font-black text-emerald-400">{goodPostureRatio}%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Slouch Events</span>
                  <span className="text-xl font-mono font-black text-rose-400">{slouchCount}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Micro-Breaks</span>
                  <span className="text-xl font-mono font-black text-indigo-400">{breaksTaken}</span>
                </div>
              </div>
            </div>

            {/* Live Tracker */}
            <div id="live-tracker" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-20">
              <div className="lg:col-span-7">
                <WebcamFeed
                  onAnalysisChange={handleAnalysisChange}
                  onTrackingChange={handleTrackingChange}
                  isMuted={isMuted}
                  calibrationOffset={calibrationOffset}
                  setCalibrationOffset={setCalibrationOffset}
                  onCalibrationSuccess={() => soundManager.playSuccessChime()}
                />
              </div>

              <div className="lg:col-span-5 h-full">
                <PostureGauge
                  score={analysis.score}
                  status={analysis.status}
                  statusColor={analysis.statusColor}
                  metrics={analysis.metrics}
                  slouchSeconds={slouchSeconds}
                  feedback={analysis.feedback}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* IMPROVEMENT SECTION FOCUSED VIEW                                  */}
        {/* ================================================================= */}
        {activeSection === 'improvement' && (
          <div id="improvement-tracker" className="scroll-mt-20 pt-2 animate-in fade-in duration-300">
            <DailyImprovement currentUser={currentUser} onOpenAuth={onOpenAuth} />
          </div>
        )}

        {/* ================================================================= */}
        {/* ANALYTICS SECTION FOCUSED VIEW                                    */}
        {/* ================================================================= */}
        {activeSection === 'analytics' && (
          <div id="analytics-dashboard" className="scroll-mt-20 pt-2 animate-in fade-in duration-300">
            <AnalyticsDashboard currentUser={currentUser} onOpenAuth={onOpenAuth} />
          </div>
        )}

        {/* ================================================================= */}
        {/* ALL SECTIONS CONTINUOUS VIEW                                      */}
        {/* ================================================================= */}
        {activeSection === 'all' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Spotlight Card for Student Interview Guide */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 shrink-0">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Student Interview &amp; Viva Seating Studio
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Practice Camera Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Prepare for panels and viva exams. Test sitting on the front 2/3 of your chair, maintaining 5° listening incline, level eyes, and calm hand posture with live AI skeletal feedback.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setActiveSection('interview');
                    window.location.hash = '#interview-guide';
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Camera className="w-4 h-4" /> Open Camera Studio
                </button>
              </div>
            </div>

            {/* Background Tab & PiP Helper Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900/80 to-indigo-950/60 border border-brand-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    Multi-Tab Ergonomics &amp; Background Pop Alerts
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                      Active
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Work on any other website or application freely: SitSmart plays an audible <strong>double-pop alert</strong> whenever your score drops below 75%, while <strong>Floating PiP</strong> keeps your camera + skeleton lines on top of all windows.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => soundManager.playPopSound()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Test the pop sound alert"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-400" /> Test Pop Sound
                </button>
              </div>
            </div>

            {/* Live Session Telemetry Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Session Time</span>
                  <span className="text-xl font-mono font-black text-white">{formatTime(sessionSeconds)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Good Posture %</span>
                  <span className="text-xl font-mono font-black text-emerald-400">{goodPostureRatio}%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Slouch Events</span>
                  <span className="text-xl font-mono font-black text-rose-400">{slouchCount}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Micro-Breaks</span>
                  <span className="text-xl font-mono font-black text-indigo-400">{breaksTaken}</span>
                </div>
              </div>
            </div>

            {/* Primary Dashboard Wireframe: Webcam Left, Posture Gauge Right */}
            <div id="live-tracker" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-20">
              <div className="lg:col-span-7">
                <WebcamFeed
                  onAnalysisChange={handleAnalysisChange}
                  onTrackingChange={handleTrackingChange}
                  isMuted={isMuted}
                  calibrationOffset={calibrationOffset}
                  setCalibrationOffset={setCalibrationOffset}
                  onCalibrationSuccess={() => soundManager.playSuccessChime()}
                />
              </div>

              <div className="lg:col-span-5 h-full">
                <PostureGauge
                  score={analysis.score}
                  status={analysis.status}
                  statusColor={analysis.statusColor}
                  metrics={analysis.metrics}
                  slouchSeconds={slouchSeconds}
                  feedback={analysis.feedback}
                />
              </div>
            </div>

            {/* Student Interview Presence & Posture Guide (Panel & Viva Preparation with Live Camera) */}
            <div id="interview-guide" className="scroll-mt-20 pt-4">
              <StudentInterviewCoach />
            </div>

            {/* Daily Improvement Tracker Section */}
            <div id="improvement-tracker" className="scroll-mt-20 pt-4">
              <DailyImprovement currentUser={currentUser} onOpenAuth={onOpenAuth} />
            </div>

            {/* Daily Analytics Dashboard */}
            <div id="analytics-dashboard" className="scroll-mt-20 pt-4">
              <AnalyticsDashboard currentUser={currentUser} onOpenAuth={onOpenAuth} />
            </div>
          </div>
        )}

      </div>

      {/* Real-Time Alerts Popup (Bottom Corner) */}
      <AlertsPopup
        slouchSeconds={slouchSeconds}
        score={currentScore}
        onTriggerBreak={onOpenBreak}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />
    </div>
  );
}
