import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { getUserDailyImprovement } from '../services/api';

const defaultImprovement = {
  success: true,
  userId: 'demo-user',
  dailyHistory: [
    { date: "Day 1 (4 days ago)", avgScore: 71, slouchCount: 16, durationMinutes: 225, goodPercent: 67 },
    { date: "Day 2 (3 days ago)", avgScore: 78, slouchCount: 11, durationMinutes: 210, goodPercent: 75 },
    { date: "Day 3 (2 days ago)", avgScore: 84, slouchCount: 7, durationMinutes: 195, goodPercent: 82 },
    { date: "Day 4 (Yesterday)", avgScore: 89, slouchCount: 4, durationMinutes: 180, goodPercent: 88 },
    { date: "Day 5 (Today)", avgScore: 88, slouchCount: 4, durationMinutes: 149, goodPercent: 89 }
  ],
  metrics: {
    initialScore: 71,
    currentScore: 88,
    scoreImprovement: 17,
    slouchReductionPercent: 75,
    activeStreakDays: 5,
    levelTitle: "Master Ergonomist",
    tierLevel: 3,
    nextTier: "Elite Health Luminary (Maintain 90%+)",
    totalTrackedDays: 5,
    totalSessions: 12
  }
};

export default function DailyImprovement({ currentUser, onOpenAuth }) {
  const [data, setData] = useState(defaultImprovement);
  const [loading, setLoading] = useState(false);

  const userId = currentUser ? (currentUser.userId || currentUser.id) : 'demo-user';

  const loadData = async () => {
    try {
      const res = await getUserDailyImprovement(userId);
      if (res && res.metrics) {
        setData(res);
      }
    } catch (err) {
      console.warn("User improvement load note:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to real-time session saves from DashboardPage
    const handleSessionSaved = () => {
      loadData();
    };

    window.addEventListener('sitsmart:session-saved', handleSessionSaved);
    return () => window.removeEventListener('sitsmart:session-saved', handleSessionSaved);
  }, [userId, currentUser]);

  const { dailyHistory = defaultImprovement.dailyHistory, metrics = defaultImprovement.metrics } = data || defaultImprovement;

  return (
    <div className="glass-panel-glow rounded-2xl border border-slate-800 p-6 sm:p-7 mb-8 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1.5">
            <TrendingUp className="w-4 h-4" /> Personal Health Trajectory
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Daily Posture Improvement Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking posture gains, slouch reduction, and habits across consecutive workdays.
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl text-xs self-start sm:self-auto">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
              {currentUser.name ? currentUser.name[0] : 'U'}
            </div>
            <div>
              <span className="text-white font-bold block">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400">{currentUser.org || "Individual Desk"}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Sign In to Save History
          </button>
        )}
      </div>

      {/* 4 Improvement Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        
        {/* Score Improvement */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Score Growth</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              +{metrics.scoreImprovement}%
            </span>
            <span className="text-[11px] text-slate-400">gain</span>
          </div>
          <p className="text-[11px] text-slate-400">
            From {metrics.initialScore}% baseline to {metrics.currentScore}% today
          </p>
        </div>

        {/* Slouch Reduction */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Slouch Reduction</span>
            <Target className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-400">
              -{metrics.slouchReductionPercent}%
            </span>
            <span className="text-[11px] text-slate-400">less strain</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Significant drop in forward head lean events
          </p>
        </div>

        {/* Consistency Streak */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Posture Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {metrics.activeStreakDays} Days
            </span>
            <span className="text-[11px] text-amber-300 font-semibold">Active 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Consecutive daily monitoring sessions
          </p>
        </div>

        {/* Ergonomic Level Badge */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Ergonomic Tier</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-1">
            <span className="text-base sm:text-lg font-black text-purple-300 block leading-tight">
              {metrics.levelTitle}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Tier {metrics.tierLevel} of 3
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate" title={metrics.nextTier}>
            Next: {metrics.nextTier}
          </p>
        </div>

      </div>

      {/* Day-by-Day Posture Progression Visualization */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 mb-6">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          Daily Posture Score Evolution (Day 1 to Today)
        </h4>

        {dailyHistory.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2.5">
            <Sparkles className="w-6 h-6 text-brand-400 mx-auto" />
            <p className="text-sm font-bold text-white">Welcome to Your Personal Ergonomics Journey!</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You haven't recorded any sessions yet today. Start your webcam in the Live AI Dashboard above or click <strong className="text-emerald-400">Save Session</strong> to record your first posture entry and see your daily progression.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dailyHistory.map((day, idx) => {
              const isToday = idx === dailyHistory.length - 1;
              const diffFromPrev = idx > 0 ? day.avgScore - dailyHistory[idx - 1].avgScore : 0;

              return (
                <div
                  key={day.date}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isToday
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>{isToday ? "Today" : day.date}</span>
                    {idx > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400">
                        +{diffFromPrev}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 my-1">
                    <span className={`text-2xl font-black ${isToday ? 'text-emerald-400' : 'text-white'}`}>
                      {day.avgScore}%
                    </span>
                    <span className="text-[10px] text-slate-400">avg</span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isToday ? 'bg-emerald-400' : 'bg-brand-400'}`}
                      style={{ width: `${day.avgScore}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{day.slouchCount} slouches</span>
                    <span>{day.durationMinutes}m logged</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivation Note */}
      <div className="flex items-center justify-between gap-3 text-xs bg-brand-950/40 border border-brand-500/30 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-brand-300">
          <Zap className="w-4 h-4 text-brand-400 shrink-0" />
          <span>
            <strong>Daily Habit Impact:</strong> Your cervical strain reduced by <strong>{metrics.slouchReductionPercent}%</strong> since Day 1! Keep up the posture awareness.
          </span>
        </div>
      </div>

    </div>
  );
}
