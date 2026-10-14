import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Recommendations from '../components/Recommendations';
import SDGImpact from '../components/SDGImpact';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  Laptop,
  Shield,
  Sparkles,
  Users,
  Zap,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export default function LandingPage({
  onNavigateToDashboard,
  onNavigateToWizard,
  onOpenBreak,
  onOpenDemo
}) {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <Hero
        onStartDemo={onNavigateToDashboard}
        onStartWizard={onNavigateToWizard}
      />

      {/* About Section: AI Ergonomics Platform Promoting SDG 3 */}
      <section id="about" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold tracking-wider uppercase">
                <Shield className="w-3.5 h-3.5" /> About SitSmart Platform
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Empowering Healthier Workdays with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Intelligent Ergonomics</span>
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                SitSmart is an AI-powered ergonomics live platform that helps employees, students, and organizations reduce the chronic health risks of prolonged sitting. With real-time computer vision posture analysis, step-by-step ergonomic guides, smart movement reminders, and evidence-based wellness routines, SitSmart directly supports <strong>UN SDG 3 (Good Health & Well-being)</strong> by preventing musculoskeletal strain and fostering workplace wellness.
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-brand-400 font-bold text-sm mb-1">
                    <Laptop className="w-4 h-4" /> 100% On-Device Privacy
                  </div>
                  <p className="text-xs text-slate-400">
                    Video frames process locally in WebAssembly. No webcam footage or images ever leave your browser.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                    <Award className="w-4 h-4" /> SDG 3.4 Alignment
                  </div>
                  <p className="text-xs text-slate-400">
                    Active prevention of non-communicable musculoskeletal disorders and mental fatigue.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Activity className="w-4 h-4" /> Launch Live Tracker <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onNavigateToWizard}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
                >
                  Workstation Setup Wizard
                </button>
              </div>
            </div>

            {/* Right Interactive Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ergonomic Telemetry</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    Live Active
                  </span>
                </div>

                <div className="my-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Spinal Alignment Index</span>
                    <span className="font-mono font-bold text-emerald-400">94 / 100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[94%] rounded-full" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Cervical (Neck) Angle</span>
                    <span className="font-mono font-bold text-brand-400">8° (Optimal)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 w-[88%] rounded-full" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Torso Flexion Angle</span>
                    <span className="font-mono font-bold text-indigo-400">6° (Neutral)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[90%] rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>
                    SitSmart continuously evaluates key joint coordinates, providing proactive posture corrections before neck strain or lumbar pain sets in.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <Features />

      {/* Advanced Ergonomics Tools Grid */}
      <section className="py-20 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" /> Secondary Feature Suite
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Advanced Biomechanical Tools
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Engineered for precision ergonomics, analytics, and active micro-interventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">MediaPipe Real-Time Keypoints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks 33 body landmarks in real time (ears, nose, shoulders, spine, hips) at 30 FPS without external hardware sensors.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Biomechanical Angle Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes neck inclination and torso flexion with mathematical precision, flagging forward head posture and spinal slouch.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Micro-Break Stretch Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contextual stretch exercises with countdown timers (Upper Trapezius Release, Scapular Retraction, 20-20-20 Eye Strain Reset).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Interview Preparation Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-brand-950/40 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-emerald-400" /> For Students &amp; Job Seekers
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Preparing for an Interview? Learn How to Sit in Front of Judges
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Master the 2/3 chair rule, the golden 5° active listening incline, 3-judge panel triangle eye contact, and grounded calm hand placements. Includes a 3-minute posture hold practice drill.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToDashboard) {
                  onNavigateToDashboard();
                  window.location.hash = 'interview-guide';
                  setTimeout(() => {
                    const el = document.getElementById('interview-guide');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 150);
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <UserCheck className="w-4 h-4" /> Open Student Interview Guide <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Columns: Reduce Pain, Improve Focus, Prevent Risks, Healthier Culture */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Forward-Thinking Teams Choose SitSmart
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Scientifically proven ergonomic benefits for daily productivity and long-term health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Reduce Pain &amp; Strain</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Substantially relieves neck, shoulder, and lumbar discomfort by eliminating chronic slouching habits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Improve Focus &amp; Energy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upright posture expands chest capacity, increasing oxygen flow to the brain and mitigating afternoon fatigue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Prevent Chronic Risks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protects against Repetitive Strain Injury (RSI), Carpal Tunnel Syndrome, and permanent cervical disc wear.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Build Healthier Culture</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demonstrate genuine organizational commitment to employee health, wellness, and UN SDG 3 goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Recommendations Library */}
      <Recommendations onOpenBreak={onOpenBreak} />

      {/* UN SDG 3 Impact Card */}
      <SDGImpact />

      {/* Testimonials */}
      <Testimonials />

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-brand-950/40 border-t border-slate-800 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Start Free in Your Browser
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Sit Smart. Work Better. Live Healthier.
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mb-8">
            Experience real-time AI posture feedback today without downloading any apps or compromising your privacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-600 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all active:scale-95 cursor-pointer"
            >
              Try Live Demo
            </button>
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-750 transition-all cursor-pointer"
            >
              Sign Up Free / Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenDemo={onOpenDemo} />
    </div>
  );
}
