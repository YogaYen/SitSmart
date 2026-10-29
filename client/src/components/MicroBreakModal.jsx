import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  Eye,
  Activity,
  Award
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';
import CartoonExerciseCoach from './CartoonExerciseCoach';

const STRETCHES = [
  {
    id: "spine_twist_reach",
    title: "Spine: Seated Torso Twist & Reach",
    target: "Thoracic Spine & Vertebral Discs",
    durationSec: 35,
    icon: HeartPulse,
    color: "from-purple-500 to-indigo-500",
    instruction: "Sit upright, place your right hand on your left knee, and gently twist your torso to the left while keeping your spine long. Hold for 15 seconds, switch sides, then finish by reaching both arms straight overhead to decompress your vertebrae.",
    benefit: "Releases spinal facet joint pressure, stimulates synovial lubrication, and decompresses vertebrae."
  },
  {
    id: "shoulder_rolls_squeeze",
    title: "Shoulders: Shoulder Rolls with Blade Squeeze",
    target: "Upper Back, Trapezius & Rhomboids",
    durationSec: 30,
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
    instruction: "Inhale as you shrug your shoulders up toward your ears, roll them back, and squeeze your shoulder blades firmly together before lowering them down. Perform 10 backward circles to release upper-back tension.",
    benefit: "Reverses anterior shoulder rounding from keyboard hunching and stimulates upper back circulation."
  },
  {
    id: "eyes_20_20_palming",
    title: "Eyes: The 20-20-20 Rule & Palming",
    target: "Ciliary Eye Muscles & Optic Nerves",
    durationSec: 50,
    icon: Eye,
    color: "from-cyan-500 to-blue-500",
    instruction: "Look away from your screen at an object at least 20 feet away for 20 seconds. Then, rub your palms together until warm and gently cup them over your closed eyes (without pressing on the eyeballs) for 30 seconds to relax your optic nerves.",
    benefit: "Relaxes fatigued ciliary lens muscles, eliminates digital blue-light strain, and soothes the optic nerve."
  },
  {
    id: "wrist_finger_spreads",
    title: "Hands: Wrist Flexor/Extensor Stretch & Finger Spreads",
    target: "Wrists, Forearms & Carpal Tunnel",
    durationSec: 45,
    icon: Activity,
    color: "from-amber-500 to-orange-500",
    instruction: "Extend one arm in front of you with the palm facing outward. Use your other hand to gently pull your fingers back toward your wrist for 15 seconds, then press them downward for 15 seconds. Follow by spreading your fingers as wide as possible, holding for 3 seconds, and making a tight fist (repeat 5 times).",
    benefit: "Reduces repetitive strain injury (RSI) risks, releases forearm typing tightness, and preserves median nerve health."
  },
  {
    id: "neck_tilt_chin_tuck",
    title: "Neck: Upper Trapezius Side Tilt & Chin Tuck",
    target: "Cervical Spine & Suboccipital Muscles",
    durationSec: 45,
    icon: Activity,
    color: "from-blue-500 to-indigo-500",
    instruction: "Sit tall and gently drop your right ear toward your right shoulder without lifting the shoulder. For a deeper stretch, place your right hand lightly on your head without pulling. Hold for 20 seconds per side, then pull your chin straight back into your neck (making a double chin) for 5 repetitions.",
    benefit: "Relieves cervical nerve compression, eases tension headaches, and corrects forward head carriage ('text-neck')."
  },
  {
    id: "knee_leg_extension",
    title: "Knee: Seated Straight-Leg Extension",
    target: "Quadriceps & Knee Synovial Joint Fluid",
    durationSec: 35,
    icon: HeartPulse,
    color: "from-teal-500 to-emerald-500",
    instruction: "Sit back firmly in your chair. Slowly straighten your right leg in front of you until parallel to the floor, flex your foot toward your shin, and contract your quadriceps for 3–5 seconds. Lower down smoothly and repeat for 10–12 reps on each leg to circulate synovial fluid and relieve stiffness.",
    benefit: "Circulates synovial lubricating fluid, prevents sedentary knee stiffness, and activates stabilizing quadriceps."
  }
];

export default function MicroBreakModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STRETCHES[0].durationSec);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStretch = STRETCHES[currentIndex];

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      soundManager.playSuccessChime();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  // Stop speech when modal closes
  useEffect(() => {
    if (!isOpen) {
      soundManager.stopSpeaking();
      setIsActive(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    soundManager.stopSpeaking();
    setIsActive(false);
    onClose();
  };

  // Reset when changing stretch
  const switchStretch = (index) => {
    soundManager.stopSpeaking();
    setCurrentIndex(index);
    setSecondsLeft(STRETCHES[index].durationSec);
    setIsActive(false);
    setCompleted(false);
  };

  if (!isOpen) return null;

  const progressPercent = Math.round(
    ((currentStretch.durationSec - secondsLeft) / currentStretch.durationSec) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow max-w-lg w-full max-h-[96vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-700 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Micro-Break &amp; Desk Stretch</h3>
              <p className="text-[11px] text-slate-400">Human trainer video clip demonstrations with Coach Maya's voice</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stretch Progress Step Dots */}
        <div className="px-5 pt-3 flex items-center justify-between gap-1.5 shrink-0">
          {STRETCHES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => switchStretch(idx)}
              title={`${idx + 1}. ${s.title}`}
              className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-emerald-400'
                  : idx < currentIndex
                  ? 'bg-brand-500/60'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Modal Body (Scrollable if needed) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Card Showcase */}
          <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
                {currentStretch.target}
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded-md">
                Routine {currentIndex + 1} of {STRETCHES.length}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-white mb-3">{currentStretch.title}</h4>
            
            {/* Animated Cartoon Coach Doing the Exact Exercise Movement */}
            <div className="mb-3">
              <CartoonExerciseCoach
                stretchId={currentStretch.id}
                isActive={isActive}
                secondsLeft={secondsLeft}
                totalDuration={currentStretch.durationSec}
                instruction={currentStretch.instruction}
                stretchTitle={currentStretch.title}
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Biomechanical Benefit:</strong> {currentStretch.benefit}</span>
            </div>
          </div>

          {/* Countdown & Timer Status */}
          <div className="flex items-center justify-center gap-5 py-1">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={completed ? "#10b981" : isActive ? "#38bdf8" : "#94a3b8"}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (progressPercent / 100) * 264}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">{secondsLeft}s</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                  {completed ? "Done!" : isActive ? "Active" : "Left"}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                {isActive ? "Stretch in Progress" : completed ? "Completed!" : "Ready to Start"}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isActive ? "Follow the cartoon movement above" : completed ? "Great work resetting posture!" : "Press Start when you're ready"}
              </p>
              {completed && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5" /> Posture Reset!
                </div>
              )}
            </div>
          </div>

          {/* Dedicated On-Screen Controls: Previous, Start/Pause, Next & Reset */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {/* PREVIOUS BUTTON */}
              <button
                disabled={currentIndex === 0}
                onClick={() => switchStretch(currentIndex - 1)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed text-slate-200 border border-slate-700 transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                title={currentIndex === 0 ? "Already at first exercise" : "Go to previous stretch"}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Previous</span>
              </button>

              {/* START / PAUSE / RESUME BUTTON */}
              {isActive ? (
                <button
                  onClick={() => {
                    soundManager.stopSpeaking();
                    setIsActive(false);
                  }}
                  className="flex-[1.4] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.init();
                    setIsActive(true);
                    setCompleted(false);
                  }}
                  className="flex-[1.4] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                  <span>{secondsLeft < currentStretch.durationSec ? "Resume" : "Start"}</span>
                </button>
              )}

              {/* NEXT BUTTON */}
              <button
                onClick={() => {
                  if (currentIndex < STRETCHES.length - 1) {
                    switchStretch(currentIndex + 1);
                  } else {
                    handleClose();
                  }
                }}
                className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                  currentIndex === STRETCHES.length - 1
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
                title={currentIndex < STRETCHES.length - 1 ? "Go to next stretch" : "Complete routine and close"}
              >
                <span>{currentIndex < STRETCHES.length - 1 ? "Next" : "Finish"}</span>
                {currentIndex < STRETCHES.length - 1 ? (
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                )}
              </button>

              {/* RESET TIMER BUTTON */}
              <button
                onClick={() => {
                  soundManager.stopSpeaking();
                  setSecondsLeft(currentStretch.durationSec);
                  setIsActive(false);
                  setCompleted(false);
                }}
                title="Reset timer for current stretch"
                className="p-2.5 sm:p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
