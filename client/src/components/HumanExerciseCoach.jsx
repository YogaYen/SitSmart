import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, Activity, Heart } from 'lucide-react';

export default function HumanExerciseCoach({
  stretchId,
  isActive = false,
  secondsLeft = 35,
  instruction = ""
}) {
  const [showFullText, setShowFullText] = useState(false);
  const base = import.meta.env.BASE_URL || '/';

  // 4K Human Coach Maya Data
  const coachData = {
    spine_twist_reach: {
      image: `${base}exercises/spinal_twist.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Spine: Seated Torso Twist & Reach",
      target: "Thoracic Spine & Vertebral Discs",
      excitedQuote: "Sit tall with me, place your right hand on your left knee, and gently twist your torso to the left while keeping your spine long. Hold for 15 seconds, switch sides, then finish by reaching both arms straight overhead to decompress your vertebrae!",
      formChecklist: [
        "Keep spine lengthened and shoulders down",
        "Twist 15s left, then 15s right smoothly",
        "Finish with arms overhead to decompress vertebrae"
      ],
      energyTag: "Spinal Decompression 🌀"
    },
    shoulder_rolls_squeeze: {
      image: `${base}exercises/scapular_retraction.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Shoulders: Shoulder Rolls with Blade Squeeze",
      target: "Upper Back & Rhomboids",
      excitedQuote: "Inhale as you shrug your shoulders up toward your ears, roll them back, and squeeze your shoulder blades firmly together before lowering them down. Perform 10 backward circles to release upper-back tension!",
      formChecklist: [
        "Inhale shrug shoulders toward ears",
        "Roll backward and squeeze blades firmly",
        "Perform 10 backward circles smoothly"
      ],
      energyTag: "Release Upper Back ⚡"
    },
    eyes_20_20_palming: {
      image: `${base}exercises/rule_20_20_20.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Eyes: The 20-20-20 Rule & Palming",
      target: "Ciliary Eye Muscles & Optic Nerves",
      excitedQuote: "Look away from your screen at an object at least 20 feet away for 20 seconds. Then, rub your palms together until warm and gently cup them over your closed eyes for 30 seconds to relax your optic nerves!",
      formChecklist: [
        "Fixate 20 feet away for 20 seconds",
        "Rub palms vigorously together until warm",
        "Cup eyes gently without eyeball pressure for 30s"
      ],
      energyTag: "Optic Nerve Relief 👁️"
    },
    wrist_finger_spreads: {
      image: `${base}exercises/wrist_flexor.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Hands: Wrist Flexor/Extensor Stretch & Finger Spreads",
      target: "Forearms, Wrists & Carpal Tunnel",
      excitedQuote: "Extend one arm with palm facing outward. Gently pull fingers back for 15s, then press downward for 15s. Follow by spreading fingers wide for 3s and making a tight fist (repeat 5 times)!",
      formChecklist: [
        "Pull fingers back 15s, press down 15s",
        "Spread fingers as wide as possible for 3s",
        "Make tight fist and repeat 5 times"
      ],
      energyTag: "Anti-RSI Protection ✋"
    },
    neck_tilt_chin_tuck: {
      image: `${base}exercises/trapezius_release.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Neck: Upper Trapezius Side Tilt & Chin Tuck",
      target: "Cervical Spine & Suboccipital Muscles",
      excitedQuote: "Sit tall and gently drop your right ear toward your right shoulder. Lightly place hand on head without pulling for 20s per side, then pull your chin straight back into your neck making a double chin for 5 reps!",
      formChecklist: [
        "Ear to shoulder 20s per side without pulling",
        "Pull chin straight back into neck (double chin)",
        "Hold 2s per chin tuck and repeat 5 times"
      ],
      energyTag: "Cervical Alignment 🔥"
    },
    knee_leg_extension: {
      image: `${base}exercises/knee_leg_extension.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Knee: Seated Straight-Leg Extension",
      target: "Quadriceps & Knee Synovial Joint Fluid",
      excitedQuote: "Sit back firmly in your chair. Slowly straighten your right leg parallel to the floor, flex your foot toward your shin, and contract your quadriceps for 3–5 seconds. Lower down smoothly and repeat for 10–12 reps on each leg!",
      formChecklist: [
        "Sit back firmly with spine upright",
        "Straighten leg parallel to floor & flex foot",
        "Contract quadricep 3–5s, repeat 10–12 reps per leg"
      ],
      energyTag: "Knee Mobility & Synovial Fluid 🦵"
    }
  };

  const currentCoach = coachData[stretchId] || coachData.spine_twist_reach;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-4 relative overflow-hidden shadow-xl">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            {isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          </span>
          <span className="text-xs font-bold text-slate-200">
            {currentCoach.coachName} • <span className="text-[11px] text-slate-400 font-normal">{currentCoach.role}</span>
          </span>
        </div>

        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
          {currentCoach.energyTag}
        </span>
      </div>

      {/* Human Photo Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video mb-3">
        <img
          src={currentCoach.image}
          alt={currentCoach.action}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            isActive ? 'scale-[1.03] animate-trainer-motion' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
          <span>{currentCoach.action}</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded">
            {currentCoach.target}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
          "{currentCoach.excitedQuote}"
        </p>

        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
          {currentCoach.formChecklist.map((item, idx) => (
            <span key={idx} className="text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
