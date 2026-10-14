import React, { useState } from 'react';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Activity,
  Award,
  BookOpen,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Zap,
  Camera,
  GraduationCap
} from 'lucide-react';

export default function Navbar({
  activePage = 'landing',
  setActivePage,
  onNavigate,
  isMuted,
  setIsMuted,
  currentScore = 95,
  isTracking = false,
  onOpenDemo,
  onOpenBreak,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getBadgeColor = () => {
    if (!isTracking) return 'bg-slate-800/80 text-slate-400 border-slate-700';
    if (currentScore >= 82) return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 animate-pulse-subtle';
    if (currentScore >= 60) return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
    return 'bg-rose-950/80 text-rose-400 border-rose-500/40 animate-bounce-subtle';
  };

  const navigateTo = (page, hash = '') => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page, hash);
    } else if (setActivePage) {
      setActivePage(page);
      if (hash) window.location.hash = hash;
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => navigateTo('landing', '#home')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">Sit<span className="text-brand-400">Smart</span></span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" /> SDG 3 Aligned
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Sit Smart, Work Better</p>
          </div>
        </button>

        {/* Navigation Tabs (Connected directly to App state and smooth scrolling) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          <button
            onClick={() => navigateTo('dashboard', '#live-tracker')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'dashboard' ? 'text-brand-400 font-semibold bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> AI Pose Tracker
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#improvement-tracker')}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Daily Improvement
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#analytics-dashboard')}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-brand-400 hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" /> Analytics
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#interview-guide')}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Interview Guide
          </button>
          <button
            onClick={() => navigateTo('wizard', '#wizard')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'wizard' ? 'text-brand-400 font-semibold bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Ergonomic Wizard
          </button>
          <button
            onClick={() => onOpenBreak && onOpenBreak()}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Micro-Breaks
          </button>
        </nav>

        {/* Actions & Live Status Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Posture Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${getBadgeColor()}`}>
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {!isTracking ? "Camera Idle" : `${currentScore}% ${currentScore >= 82 ? "Optimal" : (currentScore >= 60 ? "Mild Drift" : "Slouch Alert")}`}
            </span>
            <span className="sm:hidden">
              {!isTracking ? "Idle" : `${currentScore}%`}
            </span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Ergonomic Audio Alerts" : "Mute Ergonomic Audio Alerts"}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-brand-400" />}
          </button>

          {/* User Auth Profile Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenProfile}
                title="View Profile, History & Preferences"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <span className="font-semibold text-white hidden sm:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Corporate Demo CTA */}
          <button
            onClick={onOpenDemo}
            className="hidden sm:inline-flex text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md shadow-brand-500/25 transition-all cursor-pointer"
          >
            Request Demo
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 px-4 py-4 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2">
          <button
            onClick={() => navigateTo('dashboard', '#live-tracker')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              activePage === 'dashboard' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-brand-400" /> AI Pose Tracker
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#improvement-tracker')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-900"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Daily Posture Improvement
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#analytics-dashboard')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-300 hover:text-brand-400 hover:bg-slate-900"
          >
            <BarChart3 className="w-4 h-4 text-brand-400" /> Daily Analytics
          </button>
          <button
            onClick={() => navigateTo('dashboard', '#interview-guide')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-900"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" /> Student Interview Guide
          </button>
          <button
            onClick={() => navigateTo('wizard', '#wizard')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              activePage === 'wizard' ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-400" /> Ergonomic Wizard
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenBreak) onOpenBreak();
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-indigo-400 hover:bg-slate-900"
          >
            <Zap className="w-4 h-4" /> Micro-Break Player
          </button>
        </div>
      )}
    </header>
  );
}
