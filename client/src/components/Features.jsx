import React from 'react';
import {
  Camera,
  Activity,
  BellRing,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    title: "Real-Time 2D Joint Tracking",
    description: "MediaPipe Pose deep vision models track 2D body joints (ears, shoulders, spine, elbows) smoothly at 30 FPS.",
    tag: "MediaPipe Pose"
  },
  {
    icon: Activity,
    title: "Biomechanical Angle Engine",
    description: "Calculates precise neck inclination, spinal flexion, and shoulder asymmetry angles to detect forward head tilt and slouching.",
    tag: "Clinical Angles"
  },
  {
    icon: SlidersHorizontal,
    title: "Dynamic Posture Gauge",
    description: "Smooth 0–100% responsive score updating continuously with visual color feedback (Green = Optimal, Red = Slouched).",
    tag: "Real-Time 0-100%"
  },
  {
    icon: BellRing,
    title: "Micro-Break & Stretch Alerts",
    description: "Automated prompts sound a gentle chime when slouching persists over 5 seconds or when sitting intervals elapse.",
    tag: "Smart Notifications"
  },
  {
    icon: Sparkles,
    title: "Ergonomic Assessment Wizard",
    description: "5-step interactive workstation setup evaluator for chair lumbar support, desk height, monitor distance, and glare.",
    tag: "Customized Checklist"
  },
  {
    icon: Lock,
    title: "100% On-Device Privacy",
    description: "Computer vision processes exclusively in your local browser memory via WebAssembly. Zero video frames are ever recorded or uploaded.",
    tag: "Privacy Guaranteed"
  }
];

export default function Features() {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">
            <Zap className="w-4 h-4" /> Next-Generation Ergonomics
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Engineered for Healthy, Pain-Free Work
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Everything you need to eliminate occupational musculoskeletal risks and maintain peak daily stamina.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
