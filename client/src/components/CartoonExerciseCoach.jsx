import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Play,
  Pause,
  Maximize2,
  Activity,
  Award,
  Video
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';

export default function CartoonExerciseCoach({
  stretchId = 'spine_twist_reach',
  isActive = false,
  secondsLeft = 35,
  totalDuration = 35,
  instruction = '',
  stretchTitle = ''
}) {
  const base = import.meta.env.BASE_URL || '/';

  // 6 Clinical Exercises with Real Human Exercise Trainer Video Demonstrations
  const trainerData = {
    spine_twist_reach: {
      title: "Spine: Seated Torso Twist & Reach",
      target: "Thoracic Spine & Vertebral Discs",
      action: "Torso Rotation & Overhead Reach",
      image: `${base}exercises/spinal_twist.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "Twist Left (15s)", threshold: 0.65 },
        { label: "Twist Right (15s)", threshold: 0.25 },
        { label: "Overhead Reach & Decompress", threshold: 0.0 }
      ],
      angleIndicator: "Torso Rotation: 28°",
      spokenIntro: "Hello! I'm Coach Maya. Let's do the Seated Torso Twist and Reach. Sit upright, place your right hand on your left knee, and gently twist your torso to the left while keeping your spine long. Hold it and breathe deeply.",
      spokenMidpoint: "Now smoothly switch sides! Place your left hand on your right knee and gently twist to the right.",
      spokenFinal: "Now finish strong! Reach both arms straight overhead to the sky, stretch tall, and decompress your vertebrae! Beautiful job!"
    },
    shoulder_rolls_squeeze: {
      title: "Shoulders: Shoulder Rolls with Blade Squeeze",
      target: "Upper Back, Trapezius & Rhomboids",
      action: "Backward Rolls & Scapular Squeeze",
      image: `${base}exercises/scapular_retraction.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "Inhale Shrug Up", threshold: 0.70 },
        { label: "Roll Back & Squeeze Blades", threshold: 0.30 },
        { label: "Lower Down (10 Reps)", threshold: 0.0 }
      ],
      angleIndicator: "Scapular Retraction: 100%",
      spokenIntro: "Inhale deeply as you shrug your shoulders up toward your ears, roll them back, and squeeze your shoulder blades firmly together before lowering them down. Let's perform ten backward circles together to release all upper-back tension.",
      spokenMidpoint: "Keep rolling those shoulders back smoothly. Inhale up, roll back, squeeze tight, and release down. Feel your chest opening wide.",
      spokenFinal: "Last couple of rolls... squeeze those shoulder blades together... and relax down. Fantastic posture reset!"
    },
    eyes_20_20_palming: {
      title: "Eyes: The 20-20-20 Rule & Palming",
      target: "Ciliary Eye Muscles & Optic Nerves",
      action: "20-Foot Horizon Gaze & Warm Palming",
      image: `${base}exercises/rule_20_20_20.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "20-Foot Horizon Gaze (20s)", threshold: 0.60 },
        { label: "Rub Warm Palms Together", threshold: 0.50 },
        { label: "Cup Eyes & Relax Optic Nerves (30s)", threshold: 0.0 }
      ],
      angleIndicator: "Focal Distance: >20 Feet",
      spokenIntro: "Time for your visual reset! Look away from your screen at an object at least twenty feet away across the room or out a window. Let your gaze soften, blink smoothly, and relax your brow.",
      spokenMidpoint: "Now rub your palms vigorously together until warm! Gently cup your warm palms over your closed eyes without pressing on your eyeballs, and let the soothing darkness relax your optic nerves.",
      spokenFinal: "Take a slow breath in the darkness... and gently lower your hands. Notice how refreshed your vision feels!"
    },
    wrist_finger_spreads: {
      title: "Hands: Wrist Flexor/Extensor Stretch & Finger Spreads",
      target: "Wrists, Forearms & Carpal Tunnel",
      action: "Flexor/Extensor Pull & Fist Squeeze",
      image: `${base}exercises/wrist_flexor.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "Palm Out Fingers Back (15s)", threshold: 0.65 },
        { label: "Press Fingers Downward (15s)", threshold: 0.30 },
        { label: "Spread Wide & Make Tight Fist (5 Reps)", threshold: 0.0 }
      ],
      angleIndicator: "Wrist Flexion: 90°",
      spokenIntro: "Extend one arm in front of you with your palm facing outward. Use your other hand to gently pull your fingers back toward your wrist for fifteen seconds. Feel that tension release along your forearm.",
      spokenMidpoint: "Now press your fingers downward for fifteen seconds to stretch the extensor muscles.",
      spokenFinal: "Now spread your fingers as wide as possible! Hold for three seconds, then make a tight fist! Repeat five times to stimulate full hand circulation. Awesome work!"
    },
    neck_tilt_chin_tuck: {
      title: "Neck: Upper Trapezius Side Tilt & Chin Tuck",
      target: "Cervical Spine & Suboccipital Muscles",
      action: "Side Ear-Tilt & Double Chin Tuck",
      image: `${base}exercises/trapezius_release.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "Tilt Right Ear to Shoulder (20s)", threshold: 0.55 },
        { label: "Tilt Left Ear to Shoulder (20s)", threshold: 0.20 },
        { label: "Chin Tuck Alignments (5 Reps)", threshold: 0.0 }
      ],
      angleIndicator: "Lateral Neck Angle: 25°",
      spokenIntro: "Sit tall and gently drop your right ear toward your right shoulder without lifting your shoulder. For a deeper stretch, place your right hand lightly on your head without pulling. Hold and breathe deeply.",
      spokenMidpoint: "Gently switch sides now! Drop your left ear toward your left shoulder and feel that soothing neck tension ease away.",
      spokenFinal: "Now sit tall and pull your chin straight back into your neck like making a double chin. Hold for two seconds and release. Repeat five times to strengthen your cervical alignment. Perfect!"
    },
    knee_leg_extension: {
      title: "Knee: Seated Straight-Leg Extension",
      target: "Quadriceps & Knee Synovial Fluid",
      action: "Parallel Leg Hold & Quad Contraction",
      image: `${base}exercises/knee_leg_extension.jpg`,
      videoBadge: "1080p HD Video Clip",
      phases: [
        { label: "Straighten Right Leg (3-5s hold)", threshold: 0.55 },
        { label: "Flex Foot & Squeeze Quad", threshold: 0.40 },
        { label: "Switch to Left Leg (10-12 Reps)", threshold: 0.0 }
      ],
      angleIndicator: "Knee Extension: 180° Parallel",
      spokenIntro: "Sit back firmly in your chair. Slowly straighten your right leg in front of you until parallel to the floor, flex your foot toward your shin, and contract your quadriceps for three to five seconds. Lower down smoothly and repeat.",
      spokenMidpoint: "Now switch to your left leg! Slowly straighten your left leg parallel to the floor, flex your foot, contract your quadriceps, and lower down smoothly. Feel that healthy joint circulation.",
      spokenFinal: "Last rep... hold and lower gently. Incredible job! Your knees and legs are revitalized!"
    }
  };

  const currentTrainer = trainerData[stretchId] || trainerData.spine_twist_reach;

  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const prevIsActiveRef = useRef(false);
  const prevStretchIdRef = useRef(stretchId);
  const midpointSpokenRef = useRef(false);

  // Determine current active phase based on progress ratio
  const progressRatio = totalDuration > 0 ? secondsLeft / totalDuration : 0;
  const activePhase =
    currentTrainer.phases.find(p => progressRatio >= p.threshold) ||
    currentTrainer.phases[currentTrainer.phases.length - 1];

  // Speaks Coach Maya's voice instructions aloud so user does not need to read
  const speakMaya = (text) => {
    if (isVoiceMuted || soundManager.isMuted) {
      setCurrentSpokenText(text);
      return;
    }

    setCurrentSpokenText(text);
    setIsSpeaking(true);

    soundManager.speakVoiceInstruction(text, {
      character: 'maya',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // Trigger voice guidance on exercise start or switch
  useEffect(() => {
    if (prevStretchIdRef.current !== stretchId) {
      soundManager.stopSpeaking();
      midpointSpokenRef.current = false;
      prevStretchIdRef.current = stretchId;
      if (isActive) {
        speakMaya(currentTrainer.spokenIntro);
      } else {
        setCurrentSpokenText(currentTrainer.spokenIntro);
      }
    }

    if (isActive && !prevIsActiveRef.current) {
      midpointSpokenRef.current = false;
      speakMaya(currentTrainer.spokenIntro);
    }

    if (!isActive && prevIsActiveRef.current) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    }

    prevIsActiveRef.current = isActive;
  }, [isActive, stretchId]);

  // Midpoint & completion cues
  useEffect(() => {
    if (!isActive) return;

    const midpoint = Math.floor(totalDuration / 2);
    if (secondsLeft === midpoint && !midpointSpokenRef.current && secondsLeft > 5) {
      midpointSpokenRef.current = true;
      speakMaya(currentTrainer.spokenMidpoint);
    }

    if (secondsLeft === 0) {
      speakMaya(currentTrainer.spokenFinal);
    }
  }, [secondsLeft, isActive, totalDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundManager.stopSpeaking();
    };
  }, []);

  // Replay voice button handler
  const handleReplayVoice = () => {
    speakMaya(currentTrainer.spokenIntro);
  };

  // Toggle voice mute
  const handleToggleVoiceMute = () => {
    const nextMute = !isVoiceMuted;
    setIsVoiceMuted(nextMute);
    if (nextMute) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakMaya(currentTrainer.spokenIntro);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 p-4 relative overflow-hidden shadow-2xl">
      {/* 1. TOP VIDEO HEADER BAR */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider">Trainer Video Clip</span>
          </div>

          <span className="text-xs font-bold text-white flex items-center gap-1">
            Coach Maya <span className="text-[11px] text-slate-400 font-normal">• Ergonomics &amp; Yoga Trainer</span>
          </span>
        </div>

        {/* Audio Mute / Unmute Button */}
        <button
          onClick={handleToggleVoiceMute}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
            isVoiceMuted
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title={isVoiceMuted ? "Maya's voice is muted. Click to turn audio on." : "Maya's voice is speaking. Click to mute audio."}
        >
          {isVoiceMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Voice Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Maya's Voice</span>
            </>
          )}
        </button>
      </div>

      {/* 2. REAL HUMAN EXERCISE TRAINER VIDEO DEMONSTRATION VIEWPORT */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl aspect-video sm:aspect-[16/10] mb-3 group">
        {/* Real Human Exercise Trainer Video Frame with Smooth Looping Exercise Motion */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
          <img
            src={currentTrainer.image}
            alt={currentTrainer.title}
            className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
              isActive && !isVideoPaused ? 'animate-trainer-motion scale-[1.03]' : 'scale-100'
            }`}
          />

          {/* Cinematic Contrast Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

          {/* Top Left: 1080p HD Badge & Biomechanical Target */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-md">
              1080p • 60 FPS
            </span>
            <span className="bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-700/80 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
              {currentTrainer.target}
            </span>
          </div>

          {/* Top Right: Biomechanical Joint Alignment Indicator */}
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className="bg-brand-500/20 backdrop-blur-md text-brand-300 border border-brand-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Activity className="w-3 h-3 text-brand-400" />
              {currentTrainer.angleIndicator}
            </span>
          </div>

          {/* Bottom Overlay: Active Movement Phase Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Active Movement:
              </span>
              <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md border border-slate-700 shadow-md">
                {activePhase.label}
              </span>
            </div>

            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              {secondsLeft}s remaining
            </span>
          </div>

          {/* Video Scrub Bar Across Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-brand-400 transition-all duration-300 ease-linear"
              style={{
                width: `${Math.round(((totalDuration - secondsLeft) / totalDuration) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. COACH MAYA'S LIVE SPOKEN VOICE CALLOUT (NO READING REQUIRED) */}
      <div className="space-y-2.5 text-left">
        {/* Speech Bubble */}
        <div className="relative bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                Coach Maya Speaking
              </span>

              {/* Animated Audio Equalizer Wave if Maya is Speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                  <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-1 inline-block" />
                  <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-2 inline-block" />
                  <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-3 inline-block" />
                  <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-4 inline-block" />
                  <span className="text-[9px] font-mono font-bold ml-1">Live Audio...</span>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 font-mono">
              {currentTrainer.action}
            </span>
          </div>

          {/* Spoken Dialogue Text (Spoken by Maya into User's Ears) */}
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            "{currentSpokenText || currentTrainer.spokenIntro}"
          </p>

          {/* Toolbar: Guidance note + Replay Maya Voice button */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              Watch Maya's video above and listen to her voice
            </span>

            {/* Repeat Voice Button */}
            <button
              onClick={handleReplayVoice}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Play Coach Maya's spoken instructions again"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Repeat Maya's Voice</span>
            </button>
          </div>
        </div>

        {/* Toggle Full Clinical Instruction Text */}
        <button
          onClick={() => setShowFullText(!showFullText)}
          className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>{showFullText ? "Hide text details" : "View clinical statement text"}</span>
          {showFullText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showFullText && (
          <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Exact Clinical Exercise Statement:
            </p>
            <p className="text-slate-300">{instruction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
