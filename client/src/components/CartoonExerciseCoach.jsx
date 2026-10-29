import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Bot,
  User,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';

// Available AI & Ergonomic Coach Profiles
export const COACH_CHARACTERS = {
  maya: {
    id: 'maya',
    name: 'Coach Maya',
    title: 'Yoga & Mindfulness Guide',
    avatarTag: '🧘‍♀️ Maya',
    accentColor: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/40',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    personality: 'Calm, gentle, breathing-focused guidance',
    tagline: 'Gentle Mindful Mobility'
  },
  alex: {
    id: 'alex',
    name: 'Coach Alex',
    title: 'Dynamic Biomechanics Trainer',
    avatarTag: '🏋️‍♂️ Alex',
    accentColor: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/40',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    personality: 'Energetic, motivational desk-athlete coaching',
    tagline: 'High-Energy Posture Reset'
  },
  zenbot: {
    id: 'zenbot',
    name: 'ZenBot AI',
    title: '3D Optical Biomechanical Cyborg',
    avatarTag: '🤖 ZenBot',
    accentColor: 'from-purple-500 to-cyan-400',
    borderColor: 'border-purple-500/40',
    badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    personality: 'Precise robotic telemetry & holographic joint angles',
    tagline: 'Holographic Angle Tracking'
  }
};

// Spoken Voice Scripts & Dialogue for Each Coach & Stretch
const COACH_SCRIPTS = {
  trapezius_release: {
    title: 'Upper Trapezius Release',
    target: 'Neck & Cervical Spine',
    action: 'Ear-to-Shoulder Head Tilt',
    maya: {
      intro: "Hello, I'm Coach Maya! Let's release neck tension together. Gently tilt your right ear towards your right shoulder. Softly place your hand on your head without pulling, and take a slow, deep breath with me.",
      midpoint: "Halfway there! Now gently switch sides. Tilt your head to your left side and breathe smoothly.",
      completion: "Wonderful job! Feel all that tightness melting away."
    },
    alex: {
      intro: "Hey, Coach Alex here! Time to unlock that neck! Sit tall, tilt your ear down to your shoulder, and let gravity do the work. Keep your shoulders down and hold that form!",
      midpoint: "Boom! Halfway done. Switch sides smoothly and maintain that steady posture!",
      completion: "Great work! That cervical reset keeps text-neck away!"
    },
    zenbot: {
      intro: "ZenBot online. Calibrating cervical vertebrae. Tilt head 25 degrees laterally. Apply subtle counter-weight. Initiating tension dissipation.",
      midpoint: "T-minus 15 seconds. Inverting trajectory to contralateral neck group. Angle alignment nominal.",
      completion: "Cervical decompression complete. Posture telemetry restored."
    }
  },
  scapular_retraction: {
    title: 'Scapular Retraction',
    target: 'Upper Back & Rhomboids',
    action: 'Shoulder Blade Pinch',
    maya: {
      intro: "Sit tall with me and open your chest. Draw your elbows back and squeeze your shoulder blades together like you're holding a delicate pencil. Hold it gently... and breathe.",
      midpoint: "You're doing beautifully! Keep squeezing gently, relax your neck, and feel your heart center open.",
      completion: "Beautifully done! That reverses hours of laptop slouching."
    },
    alex: {
      intro: "Let's power up your upper back! Puff that chest out, pull your elbows back, and pinch those shoulder blades tight! Hold it for 5 solid seconds, relax, and squeeze again!",
      midpoint: "Keep that energy up! Squeeze tight, feel your spine stand tall!",
      completion: "Power move! That's how we build bulletproof workstation posture!"
    },
    zenbot: {
      intro: "Activating upper thoracic stabilizers. Retract bilateral scapulae to maximum range. Engaging rhomboid muscle groups.",
      midpoint: "Isometric squeeze verified. Maintain contraction for optimal spinal uprightness.",
      completion: "Shoulder retraction protocol finished. Anterior slump eliminated."
    }
  },
  rule_20_20_20: {
    title: '20-20-20 Eye Strain Reset',
    target: 'Ciliary Eye Muscles',
    action: '20-Foot Horizon Gaze',
    maya: {
      intro: "Look away from your screen with me. Fixate your eyes on something far away—at least 20 feet out through a window. Softly blink your eyes 5 times and let your vision soften.",
      midpoint: "Keep looking at the horizon. Soft blinks... let the soothing distance relax your eye muscles.",
      completion: "Ah, notice how refreshed your eyes feel now!"
    },
    alex: {
      intro: "Eyes off the monitor right now! Look out at a target 20 feet away across the room or window. Give me 5 deliberate, smooth blinks to replenish your eyes!",
      midpoint: "Keep holding that distant focus! Let screen fatigue vanish!",
      completion: "Sharp vision restored! Back in the zone!"
    },
    zenbot: {
      intro: "Optical strain alert detected. Shifting focal length to 6 meters. Ciliary muscle relaxation routine initialized. Execute 5 corneal lubrications.",
      midpoint: "Focal distance calibrated. Digital screen glare neutralized.",
      completion: "Optical depth perception reset complete."
    }
  },
  spinal_twist: {
    title: 'Seated Torso Spinal Twist',
    target: 'Thoracic & Lumbar Spine',
    action: 'Seated Torso Rotation',
    maya: {
      intro: "Sit upright and tall. Cross your right hand over your opposite knee, place your left hand on the chair back, and gently twist your torso as you exhale. Breathe deeply into your spine.",
      midpoint: "Halfway mark! Slowly unwind and rotate to the other side. Lengthen your spine on every inhale.",
      completion: "Glorious! Your spinal discs are lubricated and happy."
    },
    alex: {
      intro: "Let's decompress that spine! Cross your arm over, grab the chair back, and rotate that upper torso! Inhale tall, exhale and twist smoothly!",
      midpoint: "Switch sides right now! Inhale tall, rotate, and feel that lower back tension release!",
      completion: "Boom! Full spinal mobility unlocked!"
    },
    zenbot: {
      intro: "Rotational spinal calibration started. Cross extremity over contralateral thigh. Rotate thoracic axis 30 degrees.",
      midpoint: "Axis rotation 50% reached. Transitioning rotational vector to opposing quadrant.",
      completion: "Vertebral disc decompression accomplished."
    }
  },
  wrist_flexor: {
    title: 'Wrist & Finger Flexor Stretch',
    target: 'Forearms & Carpal Tunnel',
    action: 'Gentle Finger Pull',
    maya: {
      intro: "Extend your arm forward with your fingers pointing down toward the floor. Use your other hand to softly pull your fingers back toward your body. Feel that soothing forearm stretch.",
      midpoint: "Switch hands now! Extend your other arm and gently ease those typing fingers back.",
      completion: "Wonderful! Your wrists and hands are refreshed and tension-free."
    },
    alex: {
      intro: "Typing arms need love too! Extend that arm straight out, fingers down, and gently pull back with your other hand! Protect yourself from carpal tunnel!",
      midpoint: "Switch arms right now! Straight arm, gentle pull, feel that forearm flexor open up!",
      completion: "Awesome job! Ready for pain-free typing and coding!"
    },
    zenbot: {
      intro: "Carpal tunnel preventative sequence engaged. Extend forearm horizontally. Apply negative angular deflection to metacarpal joints.",
      midpoint: "Switching to contralateral limb. Forearm tendon sheath strain diminishing.",
      completion: "Repetitive strain risk reduced to baseline levels."
    }
  },
  chest_opener: {
    title: 'Chest & Anterior Shoulder Opener',
    target: 'Pectorals & Front Deltoids',
    action: 'Expansive Chest Opener',
    maya: {
      intro: "Interlace your fingers behind your back. Roll your shoulders back and gently lift your chest towards the sky. Take three deep, expansive belly breaths with me.",
      midpoint: "Keep your chest high and open. Inhale calm energy... exhale all remaining desk hunching.",
      completion: "Pure harmony! Your posture and lung capacity are fully restored."
    },
    alex: {
      intro: "Let's crush that desk hunch! Hands clasped behind your back, roll those shoulders down, and push your chest forward! Big breath in through your nose!",
      midpoint: "Hold that big chest open! Inhale power, exhale fatigue! Stand or sit like a champion!",
      completion: "Look at that upright posture! You are sitting like a pro!"
    },
    zenbot: {
      intro: "Pectoral expansion protocol engaged. Interlock digital phalanges posterior to lumbar region. Elevate sternum to maximum elevation angle.",
      midpoint: "Oxygenation cycle halfway. Maintain expansive thoracic volume.",
      completion: "Full posture recalibration complete. Ergonomic score optimized."
    }
  }
};

export default function CartoonExerciseCoach({
  stretchId = 'trapezius_release',
  isActive = false,
  secondsLeft = 30,
  totalDuration = 30,
  instruction = '',
  stretchTitle = ''
}) {
  // Load saved coach character or default to Maya
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('sitsmart_coach_character');
      return COACH_CHARACTERS[saved] ? saved : 'maya';
    } catch (e) {
      return 'maya';
    }
  });

  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [showFullText, setShowFullText] = useState(false);

  const prevIsActiveRef = useRef(false);
  const prevStretchIdRef = useRef(stretchId);
  const midpointSpokenRef = useRef(false);

  const currentCoach = COACH_CHARACTERS[selectedCharacter] || COACH_CHARACTERS.maya;
  const stretchScript = COACH_SCRIPTS[stretchId] || COACH_SCRIPTS.trapezius_release;
  const currentLines = stretchScript[selectedCharacter] || stretchScript.maya;

  // Save character choice to local storage
  const handleSelectCharacter = (charId) => {
    setSelectedCharacter(charId);
    try {
      localStorage.setItem('sitsmart_coach_character', charId);
    } catch (e) {}

    // Character self-introduction voice preview
    const char = COACH_CHARACTERS[charId];
    let introGreeting = '';
    if (charId === 'maya') {
      introGreeting = "Namaste! I'm Coach Maya. I will guide you through each exercise with soothing breath and mindful movement.";
    } else if (charId === 'alex') {
      introGreeting = "Hey! Coach Alex here! Let's power up your posture and crush fatigue together!";
    } else {
      introGreeting = "ZenBot online. Biomechanical optical guide ready. Optical joint calibration active.";
    }
    speakLine(introGreeting, charId);
  };

  // Speaks a line of dialogue with live speech synthesis & animated speech bubble
  const speakLine = (text, charId = selectedCharacter) => {
    if (isVoiceMuted || soundManager.isMuted) {
      setCurrentSpokenText(text);
      return;
    }

    setCurrentSpokenText(text);
    setIsSpeaking(true);

    soundManager.speakVoiceInstruction(text, {
      character: charId,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // Handle voice guidance on exercise start, switch, or midpoint
  useEffect(() => {
    // If user switched stretches, reset midpoint flag & cancel previous voice
    if (prevStretchIdRef.current !== stretchId) {
      soundManager.stopSpeaking();
      midpointSpokenRef.current = false;
      prevStretchIdRef.current = stretchId;
      if (isActive) {
        speakLine(currentLines.intro);
      } else {
        setCurrentSpokenText(currentLines.intro);
      }
    }

    // Trigger opening instruction when user presses START
    if (isActive && !prevIsActiveRef.current) {
      midpointSpokenRef.current = false;
      speakLine(currentLines.intro);
    }

    // Stop speaking when user pauses
    if (!isActive && prevIsActiveRef.current) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    }

    prevIsActiveRef.current = isActive;
  }, [isActive, stretchId, selectedCharacter]);

  // Midpoint & completion voice cues
  useEffect(() => {
    if (!isActive) return;

    const midpoint = Math.floor(totalDuration / 2);
    if (secondsLeft === midpoint && !midpointSpokenRef.current && secondsLeft > 5) {
      midpointSpokenRef.current = true;
      speakLine(currentLines.midpoint);
    }

    if (secondsLeft === 0) {
      speakLine(currentLines.completion);
    }
  }, [secondsLeft, isActive, totalDuration]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      soundManager.stopSpeaking();
    };
  }, []);

  // Replay voice button handler
  const handleReplayVoice = () => {
    speakLine(currentLines.intro);
  };

  // Toggle voice mute
  const handleToggleVoiceMute = () => {
    const nextMute = !isVoiceMuted;
    setIsVoiceMuted(nextMute);
    if (nextMute) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakLine(currentLines.intro);
    }
  };

  // RENDER DEDICATED SVG CHARACTER BASED ON SELECTED CHARACTER & STRETCH
  const renderCharacterVisual = () => {
    // ----------------- ZENBOT AI CHARACTER -----------------
    if (selectedCharacter === 'zenbot') {
      return (
        <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
          {/* Holographic Calibration Rings */}
          <circle cx="85" cy="85" r="66" fill="rgba(147, 51, 234, 0.08)" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" className={isActive ? "animate-spin" : ""} style={{ animationDuration: '20s' }} />
          <circle cx="85" cy="85" r="54" fill="rgba(6, 182, 212, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

          {/* Biomechanical Telemetry Angles HUD */}
          <g className="text-[7px] font-mono fill-cyan-400 select-none">
            <text x="18" y="24">ANG: 24.2°</text>
            <text x="18" y="34">SYM: 98%</text>
            <text x="124" y="24">FPS: 30</text>
            <text x="120" y="34">MODE: AI</text>
          </g>

          {/* Futuristic Chair Platform */}
          <rect x="52" y="96" width="66" height="46" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.8" />
          <line x1="58" y1="120" x2="112" y2="120" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Cybernetic Body with Joint Markers */}
          <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
            {/* Robot Chest / Core */}
            <path d="M 60 106 C 68 98 102 98 110 106 L 114 148 L 56 148 Z" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="1.8" />
            
            {/* Glowing Holographic Core Reactor */}
            <circle cx="85" cy="124" r="8" fill="#06b6d4" className="animate-pulse" />
            <circle cx="85" cy="124" r="4" fill="#ffffff" />

            {/* Arm & Head Rendering per Stretch for ZenBot */}
            {stretchId === 'trapezius_release' && (
              <>
                {/* Left Arm Resting */}
                <path d="M 60 108 Q 48 122 54 136" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                <circle cx="54" cy="136" r="4" fill="#a855f7" className="animate-zenbot-glow" />

                {/* Right Arm: Loops up over head to guide tilt */}
                <g className={isActive ? "animate-cartoon-arm-neck" : ""}>
                  <path d="M 110 108 Q 130 80 110 52 Q 98 42 86 46" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="86" cy="46" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                </g>

                {/* Neck & Head Tilting */}
                <g className={isActive ? "animate-cartoon-tilt-active" : "animate-cartoon-tilt-idle"}>
                  <rect x="80" y="86" width="10" height="20" rx="3" fill="#334155" />
                  <circle cx="85" cy="92" r="3" fill="#06b6d4" />
                  <ellipse cx="85" cy="68" rx="24" ry="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  {/* Glowing Visor */}
                  <rect x="68" y="62" width="34" height="11" rx="5.5" fill="#a855f7" className="animate-zenbot-glow" />
                  <line x1="72" y1="67.5" x2="98" y2="67.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </>
            )}

            {stretchId === 'scapular_retraction' && (
              <>
                {/* Left Retraction Arm */}
                <g className={isActive ? "animate-cartoon-scapular-left" : ""}>
                  <path d="M 60 108 Q 44 118 50 134" fill="none" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="50" cy="134" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                </g>

                {/* Right Retraction Arm */}
                <g className={isActive ? "animate-cartoon-scapular-right" : ""}>
                  <path d="M 110 108 Q 126 118 120 134" fill="none" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="120" cy="134" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                </g>

                {/* Upright Head */}
                <rect x="80" y="86" width="10" height="20" rx="3" fill="#334155" />
                <ellipse cx="85" cy="68" rx="24" ry="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <rect x="68" y="62" width="34" height="11" rx="5.5" fill="#06b6d4" className="animate-zenbot-glow" />
                <line x1="72" y1="67.5" x2="98" y2="67.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {stretchId === 'rule_20_20_20' && (
              <>
                {/* Hand shading brow */}
                <path d="M 110 106 Q 126 80 104 54" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                <circle cx="104" cy="54" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                <path d="M 60 106 Q 48 120 54 134" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />

                {/* Gaze Target */}
                <ellipse cx="85" cy="68" rx="24" ry="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <rect x="68" y="62" width="34" height="11" rx="5.5" fill="#38bdf8" className="animate-zenbot-glow" />
                {/* Optical laser scan ray */}
                <line x1="92" y1="67" x2="135" y2="45" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" className="animate-pulse" />
              </>
            )}

            {stretchId === 'spinal_twist' && (
              <g className={isActive ? "animate-cartoon-twist-active" : "animate-cartoon-twist-idle"}>
                {/* Crossed arm */}
                <path d="M 64 108 Q 86 122 102 124" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                <circle cx="102" cy="124" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                {/* Back arm */}
                <path d="M 106 108 Q 118 114 114 130" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />

                {/* Head */}
                <ellipse cx="85" cy="68" rx="24" ry="22" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                <rect x="68" y="62" width="34" height="11" rx="5.5" fill="#a855f7" className="animate-zenbot-glow" />
              </g>
            )}

            {stretchId === 'wrist_flexor' && (
              <>
                <g className={isActive ? "animate-cartoon-wrist-active" : ""}>
                  <path d="M 104 106 L 98 116 L 94 104" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 94 104 L 94 122" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="94" cy="104" r="4" fill="#a855f7" className="animate-zenbot-glow" />
                  {/* Opposite hand */}
                  <path d="M 64 106 Q 78 116 92 116" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="92" cy="116" r="4" fill="#06b6d4" />
                </g>
                <ellipse cx="85" cy="68" rx="24" ry="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <rect x="68" y="62" width="34" height="11" rx="5.5" fill="#06b6d4" className="animate-zenbot-glow" />
              </>
            )}

            {stretchId === 'chest_opener' && (
              <g className={isActive ? "animate-cartoon-chest-active" : "animate-cartoon-float"}>
                <path d="M 58 104 Q 44 122 62 134" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                <path d="M 112 104 Q 126 122 108 134" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
                <circle cx="85" cy="136" r="6" fill="#a855f7" className="animate-zenbot-glow" />
                <ellipse cx="85" cy="66" rx="24" ry="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <rect x="68" y="60" width="34" height="11" rx="5.5" fill="#38bdf8" className="animate-zenbot-glow" />
              </g>
            )}
          </g>
        </svg>
      );
    }

    // ----------------- COACH ALEX (ATHLETIC TRAINER) -----------------
    if (selectedCharacter === 'alex') {
      return (
        <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
          <circle cx="85" cy="85" r="62" fill="rgba(2, 132, 199, 0.12)" className={isActive ? "animate-cartoon-ripple" : ""} />

          {/* Athletic Energy Burst Sparks */}
          <g className="animate-anime-sparkle">
            <path d="M 44 58 L 47 62 L 44 66 L 41 62 Z" fill="#0284c7" />
            <path d="M 126 58 L 129 62 L 126 66 L 123 62 Z" fill="#38bdf8" />
          </g>

          {/* Ergonomic Office Chair */}
          <rect x="55" y="94" width="60" height="46" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* Alex Athletic Body */}
          <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
            {/* Athletic Training Hoodie */}
            <path d="M 58 104 C 67 96 103 96 112 104 L 118 148 L 52 148 Z" fill="#0284c7" />
            <path d="M 72 104 Q 85 113 98 104" fill="none" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="123" r="5" fill="#38bdf8" />
            <path d="M 85 120 L 85 126 M 82 123 L 88 123" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Arm Movement by Stretch */}
            {stretchId === 'trapezius_release' && (
              <>
                <path d="M 60 108 Q 48 122 54 136" fill="none" stroke="#0284c7" strokeWidth="7.5" strokeLinecap="round" />
                <circle cx="54" cy="136" r="4.5" fill="#fed7aa" />
                <g className={isActive ? "animate-cartoon-arm-neck" : ""}>
                  <path d="M 110 108 Q 128 82 112 56 Q 102 44 88 47" fill="none" stroke="#0284c7" strokeWidth="7.5" strokeLinecap="round" />
                  <ellipse cx="88" cy="48" rx="5" ry="4" fill="#fed7aa" />
                </g>
                <g className={isActive ? "animate-cartoon-tilt-active" : "animate-cartoon-tilt-idle"}>
                  <rect x="79" y="88" width="12" height="18" rx="4" fill="#fed7aa" />
                  <ellipse cx="85" cy="72" rx="24" ry="22" fill="#fed7aa" />
                  {/* Athletic Short Hair & Headband */}
                  <path d="M 61 65 C 63 46 76 42 85 42 C 94 42 107 46 109 65 Z" fill="#451a03" />
                  <rect x="62" y="58" width="46" height="7" rx="3.5" fill="#38bdf8" />
                  <circle cx="76" cy="71" r="3.5" fill="#0f172a" />
                  <circle cx="94" cy="71" r="3.5" fill="#0f172a" />
                  <circle cx="72" cy="76" r="3.5" fill="#fb7185" opacity="0.6" />
                  <circle cx="98" cy="76" r="3.5" fill="#fb7185" opacity="0.6" />
                  <path d="M 81 79 Q 85 84 89 79" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
                </g>
              </>
            )}

            {stretchId === 'scapular_retraction' && (
              <>
                <g className={isActive ? "animate-cartoon-scapular-left" : ""}>
                  <path d="M 60 106 Q 44 118 50 134" fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="50" cy="134" r="5" fill="#fed7aa" />
                </g>
                <g className={isActive ? "animate-cartoon-scapular-right" : ""}>
                  <path d="M 110 106 Q 126 118 120 134" fill="none" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="120" cy="134" r="5" fill="#fed7aa" />
                </g>
                <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
                <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
                <path d="M 61 62 C 63 43 76 39 85 39 C 94 39 107 43 109 62 Z" fill="#451a03" />
                <rect x="62" y="55" width="46" height="7" rx="3.5" fill="#38bdf8" />
                <circle cx="76" cy="68" r="3.5" fill="#0f172a" />
                <circle cx="94" cy="68" r="3.5" fill="#0f172a" />
                <path d="M 81 76 Q 85 81 89 76" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
              </>
            )}

            {stretchId === 'rule_20_20_20' && (
              <>
                <path d="M 110 106 Q 124 82 104 55" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <circle cx="104" cy="54" r="5" fill="#fed7aa" />
                <path d="M 60 106 Q 48 120 54 134" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <circle cx="54" cy="134" r="5" fill="#fed7aa" />
                <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
                <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
                <path d="M 61 62 C 63 43 76 39 85 39 C 94 39 107 43 109 62 Z" fill="#451a03" />
                <rect x="62" y="55" width="46" height="7" rx="3.5" fill="#38bdf8" />
                <g className={isActive ? "animate-cartoon-gaze" : ""}>
                  <ellipse cx="76" cy="68" rx="4.5" ry="5.5" fill="#0284c7" />
                  <ellipse cx="94" cy="68" rx="4.5" ry="5.5" fill="#0284c7" />
                </g>
                <path d="M 81 78 Q 85 82 89 78" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {stretchId === 'spinal_twist' && (
              <g className={isActive ? "animate-cartoon-twist-active" : "animate-cartoon-twist-idle"}>
                <path d="M 64 108 Q 86 122 102 124" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <circle cx="102" cy="124" r="4.5" fill="#fed7aa" />
                <path d="M 106 108 Q 118 114 114 130" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <circle cx="114" cy="130" r="4.5" fill="#fed7aa" />
                <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
                <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
                <path d="M 61 62 C 63 43 76 39 85 39 C 94 39 107 43 109 62 Z" fill="#451a03" />
                <rect x="62" y="55" width="46" height="7" rx="3.5" fill="#38bdf8" />
                <circle cx="78" cy="68" r="3.5" fill="#0f172a" />
                <circle cx="96" cy="68" r="3.5" fill="#0f172a" />
                <path d="M 82 78 Q 86 83 90 78" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {stretchId === 'wrist_flexor' && (
              <>
                <g className={isActive ? "animate-cartoon-wrist-active" : ""}>
                  <path d="M 104 106 L 98 116 L 94 104" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="94" cy="104" r="5" fill="#fed7aa" />
                  <path d="M 94 104 L 94 122" fill="none" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
                  <path d="M 64 106 Q 78 116 92 116" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="92" cy="116" r="5" fill="#fed7aa" />
                </g>
                <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
                <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
                <path d="M 61 62 C 63 43 76 39 85 39 C 94 39 107 43 109 62 Z" fill="#451a03" />
                <rect x="62" y="55" width="46" height="7" rx="3.5" fill="#38bdf8" />
                <circle cx="76" cy="68" r="3.5" fill="#0f172a" />
                <path d="M 92 68 L 98 71 L 92 74" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 81 79 Q 85 84 89 79" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
              </>
            )}

            {stretchId === 'chest_opener' && (
              <g className={isActive ? "animate-cartoon-chest-active" : "animate-cartoon-float"}>
                <path d="M 58 104 Q 44 122 62 134" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <path d="M 112 104 Q 126 122 108 134" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
                <ellipse cx="85" cy="136" rx="9" ry="5" fill="#fed7aa" />
                <rect x="79" y="82" width="12" height="17" rx="3" fill="#fed7aa" />
                <ellipse cx="85" cy="67" rx="24" ry="22" fill="#fed7aa" />
                <path d="M 61 60 C 63 41 76 37 85 37 C 94 37 107 41 109 60 Z" fill="#451a03" />
                <rect x="62" y="53" width="46" height="7" rx="3.5" fill="#38bdf8" />
                <path d="M 72 68 Q 77 64 82 68" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 88 68 Q 93 64 98 68" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 81 77 Q 85 81 89 77" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        </svg>
      );
    }

    // ----------------- COACH MAYA (YOGA & MINDFULNESS GUIDE - DEFAULT) -----------------
    return (
      <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
        <circle cx="85" cy="85" r="62" fill="rgba(16, 185, 129, 0.12)" className={isActive ? "animate-cartoon-ripple" : ""} />

        {/* Serene Zen Lotus Sparkles */}
        <g className="animate-anime-sparkle">
          <path d="M 46 64 L 48 67 L 46 70 L 44 67 Z" fill="#34d399" />
          <path d="M 124 58 L 126 61 L 124 64 L 122 61 Z" fill="#10b981" />
        </g>

        {/* Ergonomic Office Chair */}
        <rect x="55" y="94" width="60" height="46" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2" />

        {/* Seated Body */}
        <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
          {/* Yoga Athletic Tank Top */}
          <path d="M 58 104 C 67 96 103 96 112 104 L 118 148 L 52 148 Z" fill="#059669" />
          <path d="M 72 104 Q 85 113 98 104" fill="none" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
          {/* Lotus Heart Badge */}
          <circle cx="85" cy="122" r="5" fill="#34d399" />
          <path d="M 85 119 L 85 125 M 82 122 L 88 122" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

          {/* Stretches for Maya */}
          {stretchId === 'trapezius_release' && (
            <>
              <path d="M 60 108 Q 48 122 54 136" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="54" cy="136" r="4.5" fill="#fed7aa" />
              <g className={isActive ? "animate-cartoon-arm-neck" : ""}>
                <path d="M 110 108 Q 128 82 112 56 Q 102 44 88 47" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
                <ellipse cx="88" cy="48" rx="5" ry="4" fill="#fed7aa" />
              </g>
              <g className={isActive ? "animate-cartoon-tilt-active" : "animate-cartoon-tilt-idle"}>
                <rect x="79" y="88" width="12" height="18" rx="4" fill="#fed7aa" />
                <ellipse cx="85" cy="72" rx="25" ry="23" fill="#fed7aa" />
                {/* Maya's Elegant Hair & Ponytail */}
                <path d="M 60 66 C 62 46 76 42 85 42 C 94 42 108 46 110 66 C 104 56 96 56 91 61 C 87 56 79 56 75 62 C 70 56 64 58 60 66 Z" fill="#1e1b4b" />
                {/* Ponytail ribbon */}
                <circle cx="60" cy="58" r="3.5" fill="#34d399" />
                {/* Serene Happy Eyes */}
                <path d="M 72 71 Q 77 66 82 71" fill="none" stroke="#1e1b4b" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M 88 71 Q 93 66 98 71" fill="none" stroke="#1e1b4b" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="72" cy="78" r="4.5" fill="#fb7185" opacity="0.65" />
                <circle cx="98" cy="78" r="4.5" fill="#fb7185" opacity="0.65" />
                <path d="M 81 80 Q 85 85 89 80" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
              </g>
            </>
          )}

          {stretchId === 'scapular_retraction' && (
            <>
              <g className={isActive ? "animate-cartoon-scapular-left" : ""}>
                <path d="M 60 106 Q 44 118 50 134" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <circle cx="50" cy="134" r="5" fill="#fed7aa" />
              </g>
              <g className={isActive ? "animate-cartoon-scapular-right" : ""}>
                <path d="M 110 106 Q 126 118 120 134" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <circle cx="120" cy="134" r="5" fill="#fed7aa" />
              </g>
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 C 104 54 96 54 91 59 C 87 54 79 54 75 60 C 70 54 64 56 60 63 Z" fill="#1e1b4b" />
              <circle cx="75" cy="69" r="4" fill="#0f172a" />
              <circle cx="95" cy="69" r="4" fill="#0f172a" />
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.7" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.7" />
              <path d="M 80 78 Q 85 84 90 78" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {stretchId === 'rule_20_20_20' && (
            <>
              <path d="M 110 106 Q 124 82 104 55" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="104" cy="54" r="5" fill="#fed7aa" />
              <path d="M 60 106 Q 48 120 54 134" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="54" cy="134" r="5" fill="#fed7aa" />
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 Z" fill="#1e1b4b" />
              <g className={isActive ? "animate-cartoon-gaze" : ""}>
                <ellipse cx="76" cy="68" rx="5" ry="6" fill="#059669" />
                <ellipse cx="94" cy="68" rx="5" ry="6" fill="#059669" />
              </g>
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <path d="M 81 78 Q 85 82 89 78" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {stretchId === 'spinal_twist' && (
            <g className={isActive ? "animate-cartoon-twist-active" : "animate-cartoon-twist-idle"}>
              <path d="M 64 108 Q 86 122 102 124" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="102" cy="124" r="4.5" fill="#fed7aa" />
              <path d="M 106 108 Q 118 114 114 130" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="114" cy="130" r="4.5" fill="#fed7aa" />
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 Z" fill="#1e1b4b" />
              <circle cx="78" cy="68" r="4" fill="#1e1b4b" />
              <circle cx="96" cy="68" r="4" fill="#1e1b4b" />
              <circle cx="74" cy="76" r="4" fill="#f472b6" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#f472b6" opacity="0.65" />
              <path d="M 83 78 Q 87 83 91 78" fill="none" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {stretchId === 'wrist_flexor' && (
            <>
              <g className={isActive ? "animate-cartoon-wrist-active" : ""}>
                <path d="M 104 106 L 98 116 L 94 104" fill="none" stroke="#10b981" strokeWidth="6.5" strokeLinecap="round" />
                <circle cx="94" cy="104" r="5" fill="#fed7aa" />
                <path d="M 94 104 L 94 122" fill="none" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 64 106 Q 78 116 92 116" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
                <circle cx="92" cy="116" r="5" fill="#fed7aa" />
              </g>
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 Z" fill="#1e1b4b" />
              <circle cx="76" cy="68" r="4" fill="#1e1b4b" />
              <path d="M 92 68 L 98 71 L 92 74" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <path d="M 81 79 Q 85 84 89 79" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}

          {stretchId === 'chest_opener' && (
            <g className={isActive ? "animate-cartoon-chest-active" : "animate-cartoon-float"}>
              <path d="M 58 104 Q 44 122 62 134" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <path d="M 112 104 Q 126 122 108 134" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="85" cy="136" rx="9" ry="5" fill="#fed7aa" />
              <rect x="79" y="82" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="67" rx="24" ry="22" fill="#fed7aa" />
              <path d="M 60 61 C 62 42 76 38 85 38 C 94 38 108 42 110 61 Z" fill="#1e1b4b" />
              <path d="M 72 68 Q 77 64 82 68" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 88 68 Q 93 64 98 68" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="72" cy="74" r="4.5" fill="#fb7185" opacity="0.7" />
              <circle cx="98" cy="74" r="4.5" fill="#fb7185" opacity="0.7" />
              <path d="M 81 77 Q 85 81 89 77" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-4 relative overflow-hidden shadow-xl">
      {/* 1. CHARACTER SELECTOR BAR */}
      <div className="mb-3.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Choose Your Exercise Coach:
          </span>

          {/* Quick Voice Audio Mute / Unmute Button */}
          <button
            onClick={handleToggleVoiceMute}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
              isVoiceMuted
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title={isVoiceMuted ? 'Voice coach is muted. Click to hear audio instructions.' : 'Voice coach is active. Click to mute audio.'}
          >
            {isVoiceMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Voice Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Active</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Selectable Character Pills */}
        <div className="grid grid-cols-3 gap-2">
          {Object.values(COACH_CHARACTERS).map((char) => {
            const isSelected = selectedCharacter === char.id;
            return (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char.id)}
                className={`px-2.5 py-2 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `bg-slate-800/95 ${char.borderColor} shadow-md shadow-brand-500/10 ring-1 ring-brand-400/30`
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{char.avatarTag}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{char.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN STAGE: CHARACTER VISUAL DEMONSTRATION & LIVE SPOKEN CALLOUT */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Animated Character Stage with Glowing Aura */}
        <div className="w-40 h-40 shrink-0 relative flex items-center justify-center p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
          {renderCharacterVisual()}

          {/* Active Workout Status Pill */}
          {isActive ? (
            <div className="absolute -bottom-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg shadow-emerald-500/30 animate-bounce flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Moving Together!
            </div>
          ) : (
            <div className="absolute -bottom-2 bg-slate-800 text-slate-300 font-semibold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-700">
              Ready to Follow
            </div>
          )}
        </div>

        {/* Coach Speech & Audio Callout Box */}
        <div className="flex-1 space-y-2.5 text-left w-full">
          {/* Main Speech Bubble */}
          <div className="relative bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-sm">
            {/* Left triangle pointer for desktop */}
            <div className="hidden sm:block absolute -left-2 top-6 w-3 h-3 bg-slate-900 border-l border-b border-slate-700/80 transform rotate-45" />

            {/* Bubble Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${currentCoach.badgeColor}`}>
                  {currentCoach.name}
                </span>

                {/* Animated Audio Equalizer Wave if Speaking */}
                {isSpeaking && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                    <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-1 inline-block" />
                    <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-2 inline-block" />
                    <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-3 inline-block" />
                    <span className="w-1 bg-brand-400 rounded-full animate-audio-wave-4 inline-block" />
                    <span className="text-[9px] font-mono font-bold ml-1">Speaking...</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {stretchScript.action}
              </span>
            </div>

            {/* SPOKEN DIALOGUE (NO READING NEEDED - SAYS IT OUT LOUD) */}
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              "{currentSpokenText || currentLines.intro}"
            </p>

            {/* Coach Voice Action Toolbar */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                Listen &amp; mirror the coach above
              </span>

              {/* Replay Voice Button */}
              <button
                onClick={handleReplayVoice}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Play voice audio instructions again"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Repeat Voice</span>
              </button>
            </div>
          </div>

          {/* Toggle Full Technical Instruction Link for inquisitive users */}
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>{showFullText ? "Hide text steps" : "View technical clinical steps"}</span>
            {showFullText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3. EXPANDABLE CLINICAL INSTRUCTION DETAIL */}
      {showFullText && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Clinical Execution Steps:
          </p>
          <p className="text-slate-300">{instruction}</p>
        </div>
      )}
    </div>
  );
}
