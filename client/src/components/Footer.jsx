import React from 'react';
import { ShieldCheck, HeartPulse, Award, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenDemo }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">Sit<span className="text-brand-400">Smart</span></span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm mb-4 leading-relaxed">
              Sit Smart, Work Better. AI-powered real-time ergonomics, biomechanical angle feedback, and guided micro-breaks to eliminate prolonged sitting health risks.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <HeartPulse className="w-3.5 h-3.5" /> Advancing UN SDG 3 (Good Health &amp; Well-being)
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#live-tracker" className="hover:text-brand-400 transition-colors">AI Pose Tracker</a></li>
              <li><a href="#assessment-wizard" className="hover:text-brand-400 transition-colors">Ergonomic Wizard</a></li>
              <li><a href="#analytics-dashboard" className="hover:text-brand-400 transition-colors">Daily Analytics</a></li>
              <li><a href="#micro-breaks" className="hover:text-brand-400 transition-colors">Desk Stretch Player</a></li>
              <li><a href="#sdg-impact" className="hover:text-brand-400 transition-colors">SDG 3 Health Target</a></li>
            </ul>
          </div>

          {/* Organization & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Enterprise &amp; Trust</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenDemo} className="hover:text-brand-400 transition-colors text-left">
                  Request Corporate Demo
                </button>
              </li>
              <li><span className="text-slate-500">100% On-Device Privacy</span></li>
              <li><span className="text-slate-500">Zero Video Storage</span></li>
              <li><span className="text-slate-500">Occupational Health Standards</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} SitSmart Platform. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl text-slate-400">
            <strong>Ergonomic Notice:</strong> SitSmart provides biomechanical posture guidance and movement prompts. It is not intended as formal medical diagnosis. Consult healthcare professionals for severe spinal pathology.
          </p>
        </div>

      </div>
    </footer>
  );
}
