import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Clock,
  Activity,
  Award,
  Settings,
  Bell,
  Sliders,
  History,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Sparkles,
  Save,
  Volume2,
  VolumeX,
  Target
} from 'lucide-react';
import {
  updateUserProfile,
  updateUserPreferences,
  getUserSessions,
  getUserDailyImprovement
} from '../services/api';

export default function UserProfileModal({ isOpen, onClose, currentUser, onUpdateUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'settings' | 'history'
  const [sessions, setSessions] = useState([]);
  const [improvement, setImprovement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    org: ''
  });

  const [preferences, setPreferences] = useState({
    audioAlerts: true,
    alertFrequencyMinutes: 25,
    cameraMirror: true,
    targetScore: 85
  });

  const userId = currentUser ? (currentUser.userId || currentUser.id) : 'demo-user';

  // Load user data and sessions when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name || '',
        role: currentUser.role || 'Software Engineer',
        org: currentUser.org || 'General'
      });

      setPreferences({
        audioAlerts: currentUser.preferences?.audioAlerts ?? true,
        alertFrequencyMinutes: currentUser.preferences?.alertFrequencyMinutes ?? 25,
        cameraMirror: currentUser.preferences?.cameraMirror ?? true,
        targetScore: currentUser.preferences?.targetScore ?? 85
      });

      loadUserData();
    }
  }, [isOpen, currentUser]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, improvRes] = await Promise.all([
        getUserSessions(userId),
        getUserDailyImprovement(userId)
      ]);
      if (sessionsRes && sessionsRes.sessions) {
        setSessions(sessionsRes.sessions);
      }
      if (improvRes) {
        setImprovement(improvRes);
      }
    } catch (e) {
      console.warn("Could not fetch user history data:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Update Profile Info
      const profileRes = await updateUserProfile(userId, formData);
      // 2. Update Preferences
      const prefRes = await updateUserPreferences(userId, preferences);

      const updated = {
        ...currentUser,
        ...(profileRes.user || {}),
        preferences: {
          ...(currentUser.preferences || {}),
          ...preferences
        }
      };

      if (onUpdateUser) onUpdateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save user settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const avgPostureScore = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + (s.avgScore || 0), 0) / sessions.length)
    : (improvement?.metrics?.currentScore || 85);
  const totalSlouches = sessions.reduce((acc, s) => acc + (s.slouchCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-glow max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-brand-500/20">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-semibold">
                  {currentUser.role || 'Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-brand-400 text-brand-300 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Profile &amp; Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-brand-400 text-brand-300 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Preferences &amp; Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'history'
                ? 'border-brand-400 text-brand-300 bg-brand-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Tracked Sessions ({sessions.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & LIFETIME STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Lifetime Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Sessions
                  </span>
                  <span className="text-2xl font-black text-white font-mono">{sessions.length}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Recorded</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Monitored Time
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {totalMinutes}m
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Active Ergonomics</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Avg Score
                  </span>
                  <span className="text-2xl font-black text-brand-400 font-mono">
                    {avgPostureScore}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Spinal Alignment</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Slouches
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {totalSlouches}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Corrected Alerts</span>
                </div>
              </div>

              {/* Tier & Streak Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider block">
                      Ergonomic Level
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {improvement?.metrics?.levelTitle || "Master Ergonomist"}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Streak: <strong>{improvement?.metrics?.activeStreakDays || 1} Days Active</strong>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    Tier {improvement?.metrics?.tierLevel || 1} of 3
                  </span>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-brand-400" /> Account &amp; Organization Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FULL NAME</span>
                    <span className="font-medium text-white">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EMAIL</span>
                    <span className="font-medium text-white">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">OCCUPATION</span>
                    <span className="font-medium text-white">{currentUser.role || "Software Engineer"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ORGANIZATION</span>
                    <span className="font-medium text-white">{currentUser.org || "General"}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PREFERENCES & EDIT PROFILE */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your profile and ergonomic preferences have been saved to your account!</span>
                </div>
              )}

              {/* Profile Details Edit */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-400" /> Profile Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Occupation</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Organization</label>
                    <input
                      type="text"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>
              </div>

              {/* Ergonomic & Alert Preferences */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-400" /> Ergonomic Preferences
                </h4>

                <div className="space-y-3">
                  {/* Audio Alerts Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-white block">Audible Posture Alert Sounds</span>
                      <span className="text-[11px] text-slate-400">Play pop chimes when slouching or spine drifts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferences({ ...preferences, audioAlerts: !preferences.audioAlerts })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        preferences.audioAlerts
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {preferences.audioAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{preferences.audioAlerts ? "Enabled" : "Muted"}</span>
                    </button>
                  </div>

                  {/* Camera Mirror Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-xs font-semibold text-white block">Camera Mirror Mode</span>
                      <span className="text-[11px] text-slate-400">Mirror video horizontally like a natural looking-glass</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferences({ ...preferences, cameraMirror: !preferences.cameraMirror })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        preferences.cameraMirror
                          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {preferences.cameraMirror ? "Mirrored" : "Normal"}
                    </button>
                  </div>

                  {/* Target Posture Score Slider */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">Daily Target Posture Score</span>
                      <span className="text-xs font-bold text-brand-400 font-mono">{preferences.targetScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      step="5"
                      value={preferences.targetScore}
                      onChange={(e) => setPreferences({ ...preferences, targetScore: Number(e.target.value) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>70% (Relaxed)</span>
                      <span>85% (Recommended)</span>
                      <span>95% (Elite)</span>
                    </div>
                  </div>

                  {/* Alert Frequency */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">Micro-Break Reminder Interval</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">{preferences.alertFrequencyMinutes} mins</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={preferences.alertFrequencyMinutes}
                      onChange={(e) => setPreferences({ ...preferences, alertFrequencyMinutes: Number(e.target.value) })}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>15 min (Frequent)</span>
                      <span>25 min (Pomodoro/Standard)</span>
                      <span>60 min (Hourly)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Preferences..." : "Save Preferences to Account"}</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: TRACKED SESSIONS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-brand-400" /> Recorded Posture Workstations
                </h4>
                <button
                  onClick={loadUserData}
                  className="text-[11px] text-brand-400 hover:underline cursor-pointer"
                >
                  Refresh History
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">No Posture Sessions Recorded Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Activate the camera on the Live AI Dashboard or click "Save Session" while tracking to record your first workstation posture entry!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map((sess, idx) => (
                    <div
                      key={sess.id || idx}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          sess.avgScore >= 82
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : sess.avgScore >= 65
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {sess.avgScore}%
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {sess.date || "Today"} {sess.startTime ? `• ${sess.startTime}` : ''}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Duration: <strong>{sess.durationMinutes || 1}m</strong> • Good Posture: <strong>{sess.goodPosturePercent || 85}%</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">
                          {sess.slouchCount || 0} slouches
                        </span>
                        <span className="text-[10px] text-indigo-400">
                          {sess.breaksTaken || 0} breaks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
