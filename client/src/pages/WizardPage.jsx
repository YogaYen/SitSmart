import React from 'react';
import ErgonomicWizard from '../components/ErgonomicWizard';
import {
  Award,
  CheckCircle2,
  Info,
  Layers,
  Lightbulb,
  Monitor,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function WizardPage({ onNavigateToDashboard, currentUser }) {
  return (
    <div className="w-full min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Self-Paced Ergonomic Evaluation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Workstation Ergonomics Assessment
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Evaluate your desk, chair, monitor elevation, and lighting setup in 5 simple steps to identify strain factors and generate a customized ergonomic action plan.
          </p>
        </div>

        {/* Wizard Component */}
        <ErgonomicWizard currentUser={currentUser} onComplete={() => {}} />

        {/* Ergonomic Golden Rules Quick Guide */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-sm mb-4">
            <Lightbulb className="w-4 h-4" /> Scientific Workstation Guidelines (OSHA &amp; ISO 9241)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-brand-400" /> The 20-20-20 &amp; Eye Level Rule
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Position screen top at eye level, roughly 20-30 inches away. Every 20 minutes, gaze at 20 feet for 20 seconds to prevent ocular fatigue.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" /> 90°–100° Joint Geometry
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Elbows, hips, and knees should remain at an open 90° to 100° angle. Keep forearms parallel to desk surface with wrists neutral.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" /> Lumbar Lordosis Support
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Support the inward curvature of the lower spine with a dedicated backrest cushion. Ensure thighs are parallel to floor with feet flat.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
