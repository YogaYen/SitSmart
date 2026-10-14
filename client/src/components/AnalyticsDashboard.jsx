import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Sparkles,
  Shield,
  Coffee
} from 'lucide-react';
import { getDailyAnalytics } from '../services/api';

const defaultAnalytics = {
  date: new Date().toISOString().split('T')[0],
  summary: {
    avgScore: 88,
    goodPercent: 89,
    totalDurationMinutes: 149,
    totalSlouchEvents: 4,
    breaksCompleted: 2,
    riskLevel: "Low Ergonomic Risk"
  },
  hourlyTrends: [
    { hour: "09:00", score: 91, benchmark: 85, slouchedMinutes: 3 },
    { hour: "10:00", score: 86, benchmark: 85, slouchedMinutes: 6 },
    { hour: "11:00", score: 80, benchmark: 85, slouchedMinutes: 11 },
    { hour: "12:00", score: 72, benchmark: 85, slouchedMinutes: 16 },
    { hour: "13:00", score: 88, benchmark: 85, slouchedMinutes: 4 },
    { hour: "14:00", score: 82, benchmark: 85, slouchedMinutes: 9 },
    { hour: "15:00", score: 92, benchmark: 85, slouchedMinutes: 14 },
    { hour: "16:00", score: 83, benchmark: 85, slouchedMinutes: 8 },
    { hour: "17:00", score: 79, benchmark: 85, slouchedMinutes: 12 }
  ],
  recentSessions: []
};

export default function AnalyticsDashboard({ currentUser, onOpenAuth }) {
  const [data, setData] = useState(defaultAnalytics);
  const [loading, setLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const userId = currentUser ? (currentUser.userId || currentUser.id) : 'demo-user';

  const loadData = async () => {
    try {
      const res = await getDailyAnalytics(null, userId);
      if (res && res.summary) {
        setData(res);
      }
    } catch (e) {
      console.warn("Analytics load note:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleSessionSaved = () => {
      loadData();
    };

    window.addEventListener('sitsmart:session-saved', handleSessionSaved);
    return () => window.removeEventListener('sitsmart:session-saved', handleSessionSaved);
  }, [userId, currentUser]);

  const { summary = defaultAnalytics.summary, hourlyTrends = defaultAnalytics.hourlyTrends, recentSessions = [] } = data || defaultAnalytics;

  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">
              <BarChart3 className="w-4 h-4" /> Comprehensive Workplace Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Daily Posture &amp; Ergonomic Analytics
            </h2>
            <p className="mt-1 text-slate-400 text-sm">
              Hourly posture tracking trends, continuous slouch events, and break compliance for today.
            </p>
          </div>

          <div className="flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Date: <strong>{data.date}</strong></span>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Average Posture Score */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Avg Posture Score</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.avgScore}%</span>
              <span className="text-xs text-emerald-400 font-semibold">+4% vs yesterday</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${summary.avgScore}%` }}
              />
            </div>
          </div>

          {/* Good Posture Ratio */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Optimal Alignment</span>
              <CheckCircle className="w-4 h-4 text-brand-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.goodPercent}%</span>
              <span className="text-xs text-slate-400 font-medium">of seated time</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-brand-400 h-full rounded-full transition-all"
                style={{ width: `${summary.goodPercent}%` }}
              />
            </div>
          </div>

          {/* Slouch Duration & Events */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Slouch Incidents</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{summary.totalSlouchEvents}</span>
              <span className="text-xs text-slate-400 font-medium">incidents detected</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-3">
              Total slouch: 14 mins across 5.2 hrs
            </span>
          </div>

          {/* Micro-Breaks Completed */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Micro-Breaks</span>
              <Coffee className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-teal-400">{summary.breaksCompleted}</span>
              <span className="text-xs text-emerald-400 font-medium">Target: 6 / day</span>
            </div>
            <span className="text-[11px] text-teal-300/80 block mt-3 font-semibold">
              Goal Exceeded! Relaxed muscles
            </span>
          </div>
        </div>

        {/* Hourly Posture Trend Chart */}
        <div className="glass-panel-glow rounded-2xl border border-slate-800 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Hourly Posture Performance (09:00 - 17:00)
              </h3>
              <p className="text-xs text-slate-400">Score variation over typical working hours</p>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Optimal (85%+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-slate-300">Mid-day Strain (70-84%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-brand-400" />
                <span className="text-slate-400">Ergonomic Benchmark</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="relative pt-6 pb-2">
            <div className="grid grid-cols-9 gap-2 sm:gap-4 items-end h-56 border-b border-slate-800 px-2">
              {hourlyTrends.map((item, idx) => {
                const heightPercent = Math.max(15, item.score);
                const isOptimal = item.score >= 85;
                const isHovered = selectedHour === item.hour;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedHour(item.hour)}
                    onMouseLeave={() => setSelectedHour(null)}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-3 z-20 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] text-white shadow-xl pointer-events-none whitespace-nowrap">
                        <strong>{item.hour}</strong>: {item.score}% score • {item.slouchedMinutes}m slouched
                      </div>
                    )}

                    <span className="text-[11px] font-bold text-slate-400 mb-1.5 group-hover:text-white transition-colors">
                      {item.score}%
                    </span>

                    {/* Dynamic Bar */}
                    <div
                      className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 relative ${
                        isOptimal
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-110 shadow-lg shadow-emerald-500/20'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110 shadow-lg shadow-amber-500/20'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    <span className="text-[11px] font-medium text-slate-400 mt-2">
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Ergonomic Benchmark line */}
            <div
              className="absolute left-2 right-2 border-t-2 border-dashed border-brand-400/50 pointer-events-none"
              style={{ bottom: `calc(85% * 0.56 + 32px)` }}
            >
              <span className="absolute -top-3 right-0 text-[10px] text-brand-300 font-semibold bg-slate-900/90 px-1.5 rounded">
                Target Benchmark 85%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Tracked Sessions Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Recent Monitored Blocks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-2.5 font-semibold">Time Block</th>
                  <th className="pb-2.5 font-semibold">Duration</th>
                  <th className="pb-2.5 font-semibold">Avg Posture</th>
                  <th className="pb-2.5 font-semibold">Slouch Alerts</th>
                  <th className="pb-2.5 font-semibold">Breaks Taken</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {recentSessions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-500 italic">
                      No sessions recorded yet today. Click "Save Session" on the Live Tracker to log your posture.
                    </td>
                  </tr>
                ) : (
                  recentSessions.map((s, idx) => {
                    const timeLabel = s.startTime && s.endTime
                      ? `${s.startTime} - ${s.endTime}`
                      : s.currentHour || (s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Block ${idx + 1}`);

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono">{timeLabel}</td>
                        <td className="py-3">{s.durationMinutes} mins</td>
                        <td className="py-3 font-bold text-emerald-400">{s.avgScore}%</td>
                        <td className="py-3 text-amber-400">{s.slouchCount} events</td>
                        <td className="py-3">{s.breaksTaken} micro-breaks</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Logged
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
