import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { notifications } from '../utils/notifications';

export default function AlertsPopup({
  slouchSeconds = 0,
  score = 95,
  onTriggerBreak,
  isMuted = false,
  onToggleMute
}) {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const dismissedAlertIdsRef = React.useRef(new Set());

  // 1. Monitor Slouch Persistence (Trigger alert when slouching for >= 5 seconds)
  useEffect(() => {
    if (slouchSeconds >= 5) {
      if (!dismissedAlertIdsRef.current.has('slouch_persistent')) {
        const newAlert = {
          id: 'slouch_persistent',
          type: 'danger',
          title: 'Slouch Warning (5s+ Detected)',
          message: 'Your spine and neck have drifted forward. Sit back against the lumbar support and lift your chin.',
          actionLabel: 'Quick Stretch',
          actionType: 'break',
          timestamp: Date.now()
        };

        setActiveAlerts(prev => {
          if (prev.some(a => a.id === 'slouch_persistent')) return prev;
          notifications.playSlouchWarning();
          notifications.sendPushNotification('SitSmart Posture Warning', {
            body: 'Sustained slouch detected. Please sit upright and realign your neck.'
          });
          return [newAlert, ...prev];
        });
      }
    } else if (slouchSeconds === 0) {
      dismissedAlertIdsRef.current.delete('slouch_persistent');
      setActiveAlerts(prev => {
        if (!prev.some(a => a.id === 'slouch_persistent')) return prev;
        return prev.filter(a => a.id !== 'slouch_persistent');
      });
    }
  }, [slouchSeconds]);

  // 2. Periodic Movement / 20-20-20 Rule Reminder (Every 20-30 minutes of activity)
  useEffect(() => {
    const timer = setInterval(() => {
      const periodicAlert = {
        id: `movement_${Date.now()}`,
        type: 'info',
        title: '20-20-20 Movement Prompt',
        message: 'Look at an object 20 feet away for 20 seconds and roll your shoulders back 5 times.',
        actionLabel: 'Start Micro-Break',
        actionType: 'break',
        timestamp: Date.now()
      };

      setActiveAlerts(prev => [periodicAlert, ...prev.slice(0, 2)]);
      notifications.playMovementBell();
    }, 1000 * 60 * 25); // Every 25 minutes

    return () => clearInterval(timer);
  }, []);

  const dismissAlert = (id) => {
    dismissedAlertIdsRef.current.add(id);
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      {activeAlerts.map(alert => (
        <div
          key={alert.id}
          className={`relative p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 animate-slide-in ${
            alert.type === 'danger'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-50'
              : alert.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-50'
              : 'bg-slate-900/90 border-brand-500/50 text-slate-100'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              {alert.type === 'danger' ? (
                <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertCircle className="w-4 h-4 animate-bounce" />
                </div>
              ) : (
                <div className="p-1 rounded-lg bg-brand-500/20 text-brand-400">
                  <Bell className="w-4 h-4" />
                </div>
              )}
              <h5 className="text-xs font-bold tracking-wide uppercase">
                {alert.title}
              </h5>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alert Body */}
          <p className="text-xs text-slate-200/90 mb-3 leading-relaxed">
            {alert.message}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            {alert.actionType === 'break' && onTriggerBreak && (
              <button
                onClick={() => {
                  onTriggerBreak();
                  dismissAlert(alert.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 ${
                  alert.type === 'danger'
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> {alert.actionLabel}
              </button>
            )}

            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-[11px] text-slate-400 hover:text-slate-200 font-medium px-2 py-1 rounded"
            >
              Dismiss
            </button>

            {onToggleMute && (
              <button
                onClick={onToggleMute}
                title={isMuted ? "Unmute Audio Chimes" : "Mute Audio Chimes"}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 text-xs flex items-center gap-1"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
