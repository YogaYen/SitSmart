import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Sparkles, Eye, Hand } from 'lucide-react';

export default function PostureGauge({
  score = 100,
  status = "Optimal",
  statusColor = "#10b981",
  metrics = {
    neckAngle: 0,
    torsoAngle: 0,
    shoulderTiltDeg: 0,
    eyeTiltDev: 0,
    leftElbowAngle: 95,
    rightElbowAngle: 95,
    neckScorePercent: 96,
    eyeScorePercent: 98,
    armScorePercent: 94,
    torsoScorePercent: 95,
    isSlouching: false
  },
  slouchSeconds = 0,
  feedback = "Align your shoulders and sit tall."
}) {
  // SVG Circular Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStatusBadge = () => {
    if (score >= 82) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5" /> Optimal Posture
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> Minor Slouch Drift
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" /> Slouch Detected
      </span>
    );
  };

  const getScoreColor = (pct) => {
    if (pct >= 82) return "text-emerald-400";
    if (pct >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getBarColor = (pct) => {
    if (pct >= 82) return "bg-emerald-400";
    if (pct >= 60) return "bg-amber-400";
    return "bg-rose-500";
  };

  const neckPct = metrics?.neckScorePercent ?? 96;
  const eyePct = metrics?.eyeScorePercent ?? 98;
  const armPct = metrics?.armScorePercent ?? 94;
  const torsoPct = metrics?.torsoScorePercent ?? 95;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white">Posture Score Gauge</h3>
        </div>
        {getStatusBadge()}
      </div>

      {/* Center Dynamic SVG Gauge */}
      <div className="flex flex-col items-center justify-center relative py-1">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth="11"
              fill="transparent"
            />
            {/* Animated Dynamic Progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={statusColor}
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 0.35s ease-out, stroke 0.35s ease"
              }}
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className="text-4xl font-black tracking-tight"
              style={{ color: statusColor }}
            >
              {score}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Live Accuracy
            </span>
          </div>
        </div>

        {/* Real-Time Contextual Feedback */}
        <p className="mt-2 text-center text-xs font-medium text-slate-300 max-w-xs bg-slate-900/70 py-1.5 px-3 rounded-lg border border-slate-800/90 shadow-sm">
          {feedback}
        </p>
      </div>

      {/* 4 Accurate Landmark Percentage Cards: Neck, Eyes, Hands, Spine */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
        {/* 🧬 1. Neck Alignment */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <span>🧬</span> Neck
            </span>
            <span className="text-[10px] text-slate-500">{metrics?.neckAngle ?? 0}° (&lt;15°)</span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className={`text-xl font-black ${getScoreColor(neckPct)}`}>
              {neckPct}%
            </span>
            <span className="text-[10px] text-slate-400">
              {(metrics?.neckAngle ?? 0) > 18 ? "Tech Neck" : "Aligned"}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(neckPct)}`}
              style={{ width: `${neckPct}%` }}
            />
          </div>
        </div>

        {/* 👀 2. Eye Horizon & Gaze */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Eye className="w-3 h-3 text-sky-400" /> Eyes
            </span>
            <span className="text-[10px] text-slate-500">{metrics?.eyeTiltDev ?? 0}° tilt</span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className={`text-xl font-black ${getScoreColor(eyePct)}`}>
              {eyePct}%
            </span>
            <span className="text-[10px] text-slate-400">
              {(metrics?.eyeTiltDev ?? 0) > 4 ? "Head Tilt" : "Level"}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(eyePct)}`}
              style={{ width: `${eyePct}%` }}
            />
          </div>
        </div>

        {/* ✋ 3. Hands & Laptop Typing Posture */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Hand className="w-3.5 h-3.5 text-amber-400" /> Hands &amp; Typing
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {metrics?.elbowAngle ? `${metrics.elbowAngle}° angle` : `${metrics?.rightElbowAngle || 95}° elbow`}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className={`text-xl font-black ${getScoreColor(armPct)}`}>
              {armPct}%
            </span>
            <span
              className="text-[10px] font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 truncate max-w-[110px]"
              title={metrics?.handStatus || (armPct >= 85 ? "Optimal Typing" : "Reaching")}
            >
              {metrics?.handStatus || (armPct >= 85 ? "Optimal Typing" : "Reaching")}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(armPct)}`}
              style={{ width: `${armPct}%` }}
            />
          </div>
          {metrics?.handAdvice && (
            <div className="mt-1.5 text-[10px] text-slate-400 truncate flex items-center gap-1" title={metrics.handAdvice}>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
              <span className="truncate">{metrics.handAdvice}</span>
            </div>
          )}
        </div>

        {/* 🦴 4. Spine & Torso Flexion */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <span>🦴</span> Spine
            </span>
            <span className="text-[10px] text-slate-500">{metrics?.torsoAngle ?? 0}° lean</span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className={`text-xl font-black ${getScoreColor(torsoPct)}`}>
              {torsoPct}%
            </span>
            <span className="text-[10px] text-slate-400">
              {(metrics?.torsoAngle ?? 0) > 15 ? "Hunched" : "Upright"}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarColor(torsoPct)}`}
              style={{ width: `${torsoPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-Footer: Slouch Streak & Shoulder Symmetry */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Shoulders: <strong className="text-slate-200">{metrics?.shoulderTiltDeg ?? 0}° tilt</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Slouch Streak: <strong className={slouchSeconds > 5 ? "text-rose-400 animate-pulse font-mono" : "text-slate-200 font-mono"}>{slouchSeconds}s</strong></span>
        </div>
      </div>
    </div>
  );
}
