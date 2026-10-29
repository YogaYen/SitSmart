import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle2, ChevronDown, ChevronUp, Activity, Zap } from 'lucide-react';

export default function HumanExerciseCoach({
  stretchId,
  isActive = false,
  secondsLeft = 30,
  instruction = ""
}) {
  const [showFullText, setShowFullText] = useState(false);

  const base = import.meta.env.BASE_URL || '/';
  // 4K Human Coach Data & Enthusiastic Voice Prompts
  const coachData = {
    trapezius_release: {
      image: `${base}exercises/trapezius_release.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Upper Trapezius Release",
      target: "Neck & Upper Trapezius",
      excitedQuote: "YES! Let's release that neck tension together! Gently tilt your ear towards your shoulder, rest your hand softly on your head without pulling, and feel that incredible relief. Keep breathing—you're doing amazing!",
      formChecklist: [
        "Tilt ear directly toward shoulder (no twisting)",
        "Use subtle hand weight only—zero aggressive pulling",
        "Hold 15 seconds, then switch sides with me!"
      ],
      energyTag: "Release & Refresh 🔥"
    },
    scapular_retraction: {
      image: `${base}exercises/scapular_retraction.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Scapular Retraction Pinch",
      target: "Rhomboids & Upper Back",
      excitedQuote: "LET'S GO! Sit tall, open up your chest, pull those elbows back and PINCH those shoulder blades together like squeezing a pencil! Feel your posture reset instantly! Hold it with me... 5, 4, 3, 2, 1!",
      formChecklist: [
        "Puff chest out and keep shoulders down",
        "Draw shoulder blades backward and together",
        "Hold for 5 solid seconds, relax, and repeat!"
      ],
      energyTag: "Power Up Your Spine ⚡"
    },
    rule_20_20_20: {
      image: `${base}exercises/rule_20_20_20.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "20-20-20 Eye Strain Reset",
      target: "Ciliary Muscles & Gaze Depth",
      excitedQuote: "LOOK OUT THERE! Look past the screen and fixate on something 20 feet away through the window! Let your eyes soak in the natural horizon, blink smoothly, and let all screen fatigue vanish! Loving this energy!",
      formChecklist: [
        "Fixate on a distant object at least 20 feet (6m) away",
        "Relax your facial muscles and eye brow",
        "Blink smoothly 5 times to replenish natural tears"
      ],
      energyTag: "Visual Reset 👁️"
    },
    spinal_twist: {
      image: `${base}exercises/spinal_twist.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Seated Torso Spinal Twist",
      target: "Thoracic & Lumbar Spine",
      excitedQuote: "AWESOME! Sit up tall, cross your arm over your opposite thigh, and gently rotate that torso! Look back over your shoulder and feel your spine decompress! Inhale tall, exhale and twist—you've got this!",
      formChecklist: [
        "Lengthen spine on inhale before rotating",
        "Use chair arm/back for gentle rotational leverage",
        "Hold 15 seconds per side with smooth breathing"
      ],
      energyTag: "Spinal Mobility 🌀"
    },
    wrist_flexor: {
      image: `${base}exercises/wrist_flexor.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Wrist & Finger Flexor Stretch",
      target: "Forearms & Carpal Tunnel",
      excitedQuote: "YOU'VE GOT THIS! Extend that arm straight forward, point fingers down toward the floor, and use your other hand to ease them back! Typing hands work so hard—feel that delicious forearm stretch!",
      formChecklist: [
        "Extend arm straight with elbow unlocked",
        "Fingers pointing down, palm facing away",
        "Gentle pressure on fingers toward your body"
      ],
      energyTag: "Anti-RSI Protection ✋"
    },
    chest_opener: {
      image: `${base}exercises/chest_opener.jpg`,
      coachName: "Coach Maya",
      role: "Lead Ergonomics & Movement Trainer",
      action: "Chest & Anterior Shoulder Opener",
      target: "Pectorals & Front Deltoids",
      excitedQuote: "PURE POWER! Stand or sit tall, interlace your fingers behind your back, roll those shoulders down, and expand your chest wide open! Take a giant diaphragmatic breath in with me—YES! Feel that desk hunching disappear!",
      formChecklist: [
        "Interlace fingers behind lower back",
        "Roll shoulders back and straighten arms gently",
        "Take 3 deep, energized belly breaths"
      ],
      energyTag: "Open & Energize 💖"
    }
  };

  const currentCoach = coachData[stretchId] || coachData.trapezius_release;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-4 relative overflow-hidden shadow-xl">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            {isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-emerald-400' : 'bg-brand-400'}`} />
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {currentCoach.coachName} • <span className="text-slate-400 font-normal text-[11px]">{currentCoach.role}</span>
          </span>
        </div>

        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          {currentCoach.energyTag}
        </span>
      </div>

      {/* Main 4K Human Coach Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* 4K Photorealistic Human Coach Image with Active Ring */}
        <div className="sm:col-span-5 relative group">
          <div className={`relative aspect-square w-full rounded-2xl overflow-hidden border transition-all duration-300 ${
            isActive
              ? 'border-emerald-500/80 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400/50'
              : 'border-slate-800/90 shadow-md'
          }`}>
            <img
              src={currentCoach.image}
              alt={currentCoach.action}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* 4K Ultra-HD Badge */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/80 text-[10px] font-black text-amber-300 tracking-wider backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> 4K COACH
            </div>

            {/* Live Workout State Indicator */}
            {isActive && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 font-black text-[10px] uppercase tracking-wider text-center shadow-lg backdrop-blur-sm animate-pulse flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-950" />
                Active Stretch • {secondsLeft}s Left
              </div>
            )}
          </div>
        </div>

        {/* Excited Coaching Dialogue & Form Guidance */}
        <div className="sm:col-span-7 space-y-3 text-left">
          
          {/* Excited Speech Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm relative">
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic">
              "{currentCoach.excitedQuote}"
            </p>
          </div>

          {/* Key Form Checkpoints */}
          <div className="space-y-1.5 pl-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Pro Form Checkpoints:
            </p>
            <ul className="space-y-1 text-xs text-slate-300">
              {currentCoach.formChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Toggle Full Technical Instruction Link */}
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer pt-1"
          >
            <Activity className="w-3 h-3" />
            <span>{showFullText ? "Hide clinical notes" : "View medical clinical reference"}</span>
            {showFullText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

      </div>

      {/* Expandable Technical Instruction Detail */}
      {showFullText && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="font-semibold text-white mb-1">Standard Clinical Instruction:</p>
          <p className="text-slate-300">{instruction}</p>
        </div>
      )}
    </div>
  );
}
