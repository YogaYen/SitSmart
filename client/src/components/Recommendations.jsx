import React from 'react';
import { Sparkles, Eye, Shield, Droplets, CheckCircle, ArrowUpRight } from 'lucide-react';

const TIPS = [
  {
    icon: Eye,
    title: "The 20-20-20 Vision Rule",
    category: "Ocular Health",
    description: "Every 20 minutes, focus your eyes on an object 20 feet away for at least 20 seconds to prevent digital eye strain and headaches.",
    action: "Relax Eyes"
  },
  {
    icon: Shield,
    title: "Scapular Chin Tucks",
    category: "Cervical Alignment",
    description: "Retract your head horizontally backward without tilting downward, creating a double chin. Hold 5 seconds to reverse forward head posture.",
    action: "Do 3 Reps"
  },
  {
    icon: Droplets,
    title: "Hydration Micro-Breaks",
    category: "Metabolic Activity",
    description: "Drink a glass of water every 60 minutes. Frequent sips keep spinal discs hydrated and encourage natural standing intervals.",
    action: "Grab Water"
  },
  {
    icon: CheckCircle,
    title: "90-90-90 Alignment Rule",
    category: "Ergonomic Baseline",
    description: "Ensure your elbows, hips, and knees are each positioned at roughly 90° to 100° angles with feet planted flat on the floor.",
    action: "Check Angles"
  }
];

export default function Recommendations({ onOpenBreak }) {
  return (
    <section id="micro-breaks" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Contextual Wellness Tips
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Personalized Ergonomic Advice
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Evidence-based micro-habits designed to relieve musculoskeletal strain during intense work sessions.
            </p>
          </div>

          <button
            onClick={onOpenBreak}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            Launch Stretch Routine <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tip.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{tip.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{tip.description}</p>
                </div>

                <button
                  onClick={onOpenBreak}
                  className="w-full py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{tip.action}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
