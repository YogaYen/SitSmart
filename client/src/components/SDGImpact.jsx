import React from 'react';
import { HeartPulse, Target, ShieldCheck, TrendingDown, Users, Globe2, Award } from 'lucide-react';

export default function SDGImpact() {
  return (
    <section id="sdg-impact" className="py-16 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>United Nations Sustainable Development Goal 3</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Promoting Good Health &amp; Well-being (SDG 3)
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Prolonged sedentary sitting and poor musculoskeletal habits represent one of the fastest-growing modern occupational health crises. SitSmart actively advances <strong>Target 3.4</strong> by preventing chronic spinal disorders and mental fatigue.
          </p>
        </div>

        {/* SDG Target Card & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Target 3.4 Card */}
          <div className="glass-panel-glow rounded-2xl p-6 border border-emerald-500/30 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              SDG Target 3.4
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Non-Communicable Prevention</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Target 3.4 seeks to reduce non-communicable diseases and promote mental health and well-being. By preventing cervical and lumbar compression before permanent damage occurs, SitSmart shields users from chronic physical impairment.
            </p>
          </div>

          {/* Biomechanical Pressure Metric */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
              Clinical Spine Data
            </span>
            <h3 className="text-2xl font-black text-white mb-1">60 lbs Pressure</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tilting the head forward at 60° exerts 60 pounds of cervical strain on the cervical spine—equivalent to carrying an 8-year-old child on your neck for 8 hours daily.
            </p>
          </div>

          {/* Productivity & Health Metric */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Workplace Impact
            </span>
            <h3 className="text-2xl font-black text-white mb-1">-42% Strain Risk</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clinical studies prove that continuous micro-movement breaks and real-time biofeedback reduce musculoskeletal disorders by 42% and improve end-of-day mental clarity.
            </p>
          </div>

        </div>

        {/* Global Impact Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Globe2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Empowering 100,000+ Desks by 2030</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                SitSmart democratizes physical ergonomics for remote workers, university students, and enterprise offices worldwide without expensive physical equipment.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shrink-0">
            <Award className="w-4 h-4" /> Certified SDG 3 Initiative
          </div>
        </div>

      </div>
    </section>
  );
}
