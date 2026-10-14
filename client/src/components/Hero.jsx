import React from 'react';
import { Camera, CheckCircle2, ShieldCheck, ArrowRight, HeartPulse, Sparkles, Lock } from 'lucide-react';

export default function Hero({ onStartDemo, onStartWizard }) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Ambient background glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>UN SDG 3: Promoting Good Health & Well-being</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            <span>100% Client-Side Private AI</span>
          </div>
        </div>

        {/* Main Headline & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Sit Smart, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-teal-300">Work Better.</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Real-time ergonomic posture tracking powered by on-device computer vision. Detect slouching, prevent chronic back & neck strain, and build healthier desk habits.
          </p>
          
          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white font-bold text-base shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Try Live AI Tracker</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onStartWizard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-base transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ergonomic Setup Wizard</span>
            </button>
          </div>

          {/* Quick value proposition points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No wearable hardware needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero video uploaded to servers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Biomechanical angle accuracy
            </span>
          </div>
        </div>

        {/* Visual Mockup Preview */}
        <div className="mt-4 max-w-4xl mx-auto rounded-2xl glass-panel-glow p-3 sm:p-4 shadow-2xl relative">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center">
            
            {/* Visual background scene for mockup */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
              {/* Simulated Skeleton Wireframe preview */}
              <svg className="w-72 h-72 text-emerald-400/80 opacity-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" viewBox="0 0 200 200">
                {/* Head */}
                <circle cx="100" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="100" cy="40" r="4" fill="currentColor" />
                {/* Neck */}
                <line x1="100" y1="58" x2="100" y2="78" stroke="currentColor" strokeWidth="3" />
                {/* Shoulders */}
                <line x1="60" y1="78" x2="140" y2="78" stroke="currentColor" strokeWidth="3" />
                <circle cx="60" cy="78" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                <circle cx="140" cy="78" r="5" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
                {/* Spine */}
                <line x1="100" y1="78" x2="100" y2="150" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" />
                {/* Arms */}
                <line x1="60" y1="78" x2="45" y2="115" stroke="currentColor" strokeWidth="2.5" />
                <line x1="45" y1="115" x2="70" y2="135" stroke="currentColor" strokeWidth="2.5" />
                <line x1="140" y1="78" x2="155" y2="115" stroke="currentColor" strokeWidth="2.5" />
                <line x1="155" y1="115" x2="130" y2="135" stroke="currentColor" strokeWidth="2.5" />
                {/* Hips */}
                <line x1="75" y1="150" x2="125" y2="150" stroke="currentColor" strokeWidth="3" />
                <circle cx="75" cy="150" r="4" fill="currentColor" />
                <circle cx="125" cy="150" r="4" fill="currentColor" />
              </svg>
            </div>

            {/* Overlaid UI Mockup Badges */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-emerald-400">MediaPipe Pose: Optimal Alignment</span>
            </div>

            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg px-3 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Posture Health</span>
              <span className="text-lg font-black text-emerald-400">94% Score</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Neck Angle</span>
                  <span className="font-bold text-emerald-400">8° (Optimal &lt;15°)</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Torso Flexion</span>
                  <span className="font-bold text-emerald-400">6° (Neutral)</span>
                </div>
                <div className="h-6 w-px bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Shoulder Tilt</span>
                  <span className="font-bold text-emerald-400">Balanced (1°)</span>
                </div>
              </div>
              <button
                onClick={onStartDemo}
                className="text-xs font-bold bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 border border-brand-500/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Click to Start Live Camera &rarr;
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
