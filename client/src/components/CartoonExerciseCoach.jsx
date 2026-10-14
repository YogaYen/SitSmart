import React, { useState } from 'react';
import { Sparkles, Heart, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function CartoonExerciseCoach({
  stretchId,
  isActive = false,
  secondsLeft = 30,
  instruction = ""
}) {
  const [showFullText, setShowFullText] = useState(false);

  // Coach dialogue and instructions for each stretch
  const dialogueMap = {
    trapezius_release: {
      action: "Ear-to-Shoulder Head Tilt",
      speech: "Tilt your head gently to the side and rest your hand softly on top! Feel that tight neck tension gently ease away~",
      bubbleTag: "Neck & Upper Spine",
      repCue: "Keep shoulders down and breathe steadily"
    },
    scapular_retraction: {
      action: "Shoulder Blade Pinch",
      speech: "Pull your elbows back and squeeze your shoulder blades like you're holding a pencil between them! Hold it... and relax!",
      bubbleTag: "Upper Back & Rhomboids",
      repCue: "Puff chest out and hold squeeze for 5s"
    },
    rule_20_20_20: {
      action: "20-Foot Far Horizon Gaze",
      speech: "Look far away from the screen with me! Fixate on a distant object 20 feet away and blink softly 5 times~",
      bubbleTag: "Ciliary Eye Muscles",
      repCue: "Rest your eyes & blink smoothly"
    },
    spinal_twist: {
      action: "Seated Torso Spinal Twist",
      speech: "Cross your arm over your knee, grasp the chair back, and gently rotate your upper torso! Inhale tall, exhale and twist~",
      bubbleTag: "Thoracic & Lumbar Spine",
      repCue: "Rotate smoothly without straining"
    },
    wrist_flexor: {
      action: "Wrist & Finger Flexor Stretch",
      speech: "Extend your arm forward with fingers down, then use your other hand to gently pull your fingers back! Say goodbye to typing cramps!",
      bubbleTag: "Forearms & Carpal Tunnel",
      repCue: "Hold steady and switch arms halfway"
    },
    chest_opener: {
      action: "Expansive Chest Opener",
      speech: "Interlace your fingers behind your back, roll shoulders back, and open up your chest wide! Take 3 deep diaphragmatic breaths~",
      bubbleTag: "Pectorals & Anterior Deltoids",
      repCue: "Deep breath in through nose, exhale"
    }
  };

  const currentDialogue = dialogueMap[stretchId] || dialogueMap.trapezius_release;

  // Render dedicated cartoon character SVG for the selected stretch
  const renderCharacterSVG = () => {
    switch (stretchId) {
      case "trapezius_release":
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            {/* Zen Ambient Aura */}
            <circle cx="85" cy="85" r="62" fill="rgba(56, 189, 248, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />
            
            {/* Neck Tension Relief Waves */}
            <g className="animate-anime-sparkle">
              <path d="M 64 82 Q 54 75 58 66" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 58 92 Q 48 87 52 78" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              {/* Sparkle Stars */}
              <path d="M 48 64 L 50 67 L 48 70 L 46 67 Z" fill="#38bdf8" />
              <path d="M 124 58 L 126 61 L 124 64 L 122 61 Z" fill="#34d399" />
            </g>

            {/* Seated Cartoon Body */}
            <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
              {/* Ergonomic Desk Chair Back */}
              <rect x="55" y="94" width="60" height="46" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              
              {/* Cartoon Athletic Hoodie */}
              <path d="M 60 106 C 68 100 102 100 110 106 L 116 148 L 54 148 Z" fill="#0284c7" />
              {/* Soft Inner Collar */}
              <path d="M 74 106 Q 85 115 96 106" fill="none" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
              
              {/* SitSmart Heart/Spine Logo on Chest */}
              <circle cx="85" cy="122" r="5" fill="#38bdf8" />
              <path d="M 85 119 L 85 125 M 82 122 L 88 122" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Left Arm Resting on Lap/Knee */}
              <path d="M 60 108 Q 48 122 54 136" fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <circle cx="54" cy="136" r="4.5" fill="#fed7aa" />

              {/* Right Arm: Loops up over head to guide the stretch */}
              <g className={isActive ? "animate-cartoon-arm-neck" : ""}>
                <path
                  d="M 110 108 Q 128 82 112 56 Q 102 44 88 47"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Hand gently resting on temple */}
                <ellipse cx="88" cy="48" rx="5" ry="4" fill="#fed7aa" />
              </g>

              {/* Head with Animated Ear-to-Shoulder Tilt */}
              <g className={isActive ? "animate-cartoon-tilt-active" : "animate-cartoon-tilt-idle"}>
                {/* Neck */}
                <rect x="79" y="88" width="12" height="18" rx="4" fill="#fed7aa" />
                
                {/* Cartoon Chibi Face */}
                <ellipse cx="85" cy="72" rx="25" ry="23" fill="#fed7aa" />
                
                {/* Cute Ears */}
                <ellipse cx="61" cy="74" rx="4" ry="5.5" fill="#fecaca" />
                <ellipse cx="109" cy="74" rx="4" ry="5.5" fill="#fecaca" />

                {/* Styled Cartoon Hair */}
                <path d="M 60 66 C 62 46 76 42 85 42 C 94 42 108 46 110 66 C 104 56 96 56 91 61 C 87 56 79 56 75 62 C 70 56 64 58 60 66 Z" fill="#1e1b4b" />
                <path d="M 59 69 C 57 44 113 44 111 69 C 111 88 59 88 59 69 Z" fill="#312e81" opacity="0.15" />

                {/* Serene Happy Eyes ( ^ ‿ ^ ) */}
                <path d="M 72 71 Q 77 66 82 71" fill="none" stroke="#1e1b4b" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M 88 71 Q 93 66 98 71" fill="none" stroke="#1e1b4b" strokeWidth="2.8" strokeLinecap="round" />
                
                {/* Cheerful Blush Cheeks */}
                <circle cx="72" cy="78" r="4.5" fill="#fb7185" opacity="0.65" />
                <circle cx="98" cy="78" r="4.5" fill="#fb7185" opacity="0.65" />

                {/* Sweet Content Smile */}
                <path d="M 81 80 Q 85 85 89 80" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        );

      case "scapular_retraction":
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            <circle cx="85" cy="85" r="62" fill="rgba(16, 185, 129, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

            {/* Muscle Pinch Sparkles around Shoulders */}
            <g className="animate-anime-sparkle">
              <path d="M 42 98 L 45 102 L 42 106 L 39 102 Z" fill="#10b981" />
              <path d="M 128 98 L 131 102 L 128 106 L 125 102 Z" fill="#10b981" />
              <path d="M 85 84 L 87 87 L 85 90 L 83 87 Z" fill="#34d399" />
            </g>

            {/* Posture Squeeze Cartoon Body */}
            <g className={isActive ? "animate-cartoon-scapular-chest" : "animate-cartoon-float"}>
              {/* Chair */}
              <rect x="55" y="94" width="60" height="46" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2" />

              {/* Upright Chest / Torso */}
              <path d="M 58 104 C 67 95 103 95 112 104 L 118 148 L 52 148 Z" fill="#059669" />
              <path d="M 72 104 Q 85 113 98 104" fill="none" stroke="#d1fae5" strokeWidth="3" strokeLinecap="round" />
              
              {/* Ergonomic Heart Badge */}
              <path d="M 85 120 C 83 117 79 117 79 120 C 79 124 85 128 85 128 C 85 128 91 124 91 120 C 91 117 87 117 85 120 Z" fill="#34d399" />

              {/* Left Arm: Squeezing backward rhythmically */}
              <g className={isActive ? "animate-cartoon-scapular-left" : ""}>
                <path d="M 60 106 Q 44 118 50 134" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <circle cx="50" cy="134" r="5" fill="#fed7aa" />
              </g>

              {/* Right Arm: Squeezing backward rhythmically */}
              <g className={isActive ? "animate-cartoon-scapular-right" : ""}>
                <path d="M 110 106 Q 126 118 120 134" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <circle cx="120" cy="134" r="5" fill="#fed7aa" />
              </g>

              {/* Upright Confident Head */}
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 C 104 54 96 54 91 59 C 87 54 79 54 75 60 C 70 54 64 56 60 63 Z" fill="#0f172a" />
              
              {/* Ears */}
              <ellipse cx="61" cy="71" rx="4" ry="5" fill="#fecaca" />
              <ellipse cx="109" cy="71" rx="4" ry="5" fill="#fecaca" />

              {/* Big Determined Cartoon Eyes */}
              <circle cx="75" cy="69" r="4" fill="#0f172a" />
              <circle cx="76" cy="67" r="1.5" fill="#ffffff" />
              <circle cx="95" cy="69" r="4" fill="#0f172a" />
              <circle cx="96" cy="67" r="1.5" fill="#ffffff" />

              {/* Proud Cheeks */}
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.7" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.7" />

              {/* Energetic Smile */}
              <path d="M 80 78 Q 85 84 90 78" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "rule_20_20_20":
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            <circle cx="85" cy="85" r="62" fill="rgba(14, 165, 233, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

            {/* Distant 20ft Horizon Target (Mountain & Cloud Badge) */}
            <g transform="translate(112, 30)">
              <polygon points="14,20 22,4 32,20" fill="#38bdf8" opacity="0.8" />
              <polygon points="20,20 27,8 35,20" fill="#0284c7" opacity="0.9" />
              <rect x="2" y="2" width="24" height="13" rx="5" fill="#0369a1" />
              <text x="14" y="11" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">20ft</text>
            </g>

            {/* Gaze Ray Lines */}
            <path d="M 94 62 L 118 46" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />

            <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
              {/* Torso */}
              <path d="M 58 104 C 66 96 102 96 110 104 L 116 148 L 54 148 Z" fill="#0284c7" />
              
              {/* Right Hand Shading Forehead (Looking Far Out) */}
              <path d="M 110 106 Q 124 82 104 55" fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <circle cx="104" cy="54" r="5" fill="#fed7aa" />

              {/* Left Hand Relaxed */}
              <path d="M 60 106 Q 48 120 54 134" fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <circle cx="54" cy="134" r="5" fill="#fed7aa" />

              {/* Head with Gaze Focused into the Distance */}
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 C 104 54 96 54 91 59 C 87 54 79 54 75 60 C 70 54 64 56 60 63 Z" fill="#1e1b4b" />
              
              {/* Big Expressive Anime Eyes (Pans & Blinks smoothly) */}
              <g className={isActive ? "animate-cartoon-gaze" : ""}>
                <g className="animate-anime-blink">
                  <ellipse cx="76" cy="68" rx="5" ry="6" fill="#0369a1" />
                  <circle cx="78" cy="66" r="2.2" fill="#ffffff" />
                  <circle cx="75" cy="70" r="1.2" fill="#bae6fd" />

                  <ellipse cx="94" cy="68" rx="5" ry="6" fill="#0369a1" />
                  <circle cx="96" cy="66" r="2.2" fill="#ffffff" />
                  <circle cx="93" cy="70" r="1.2" fill="#bae6fd" />
                </g>
              </g>

              {/* Sparkle Stars in the Gaze */}
              <path d="M 68 58 L 70 60 L 68 62 L 66 60 Z" fill="#38bdf8" className="animate-anime-sparkle" />
              
              {/* Blushes */}
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.65" />

              {/* Relaxed Soft Smile */}
              <path d="M 81 78 Q 85 82 89 78" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "spinal_twist":
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            <circle cx="85" cy="85" r="62" fill="rgba(168, 85, 247, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

            {/* Rotational Flow Air Swirls */}
            <path
              d="M 52 122 Q 85 142 118 122"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              opacity="0.75"
              className="animate-anime-sparkle"
            />
            {/* Rotational arrow tip */}
            <polygon points="120,122 115,117 114,125" fill="#a855f7" />

            {/* Seated Office Chair Back */}
            <rect x="55" y="90" width="60" height="48" rx="9" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            
            {/* Animated Seated Torso with Smooth Rhythmic Twist */}
            <g className={isActive ? "animate-cartoon-twist-active" : "animate-cartoon-twist-idle"}>
              {/* Torso Angled in Rotation */}
              <path d="M 60 104 C 68 97 102 97 110 104 L 114 146 L 56 146 Z" fill="#9333ea" />
              <path d="M 72 104 Q 85 113 98 104" fill="none" stroke="#f3e8ff" strokeWidth="3" strokeLinecap="round" />

              {/* Right Arm: Crossing across body over opposite thigh */}
              <path d="M 64 108 Q 86 122 102 124" fill="none" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" />
              <circle cx="102" cy="124" r="4.5" fill="#fed7aa" />

              {/* Left Arm: Grasping chair back */}
              <path d="M 106 108 Q 118 114 114 130" fill="none" stroke="#c084fc" strokeWidth="7" strokeLinecap="round" />
              <circle cx="114" cy="130" r="4.5" fill="#fed7aa" />

              {/* Head Rotating along with Torso */}
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 C 104 54 96 54 91 59 C 87 54 79 54 75 60 C 70 54 64 56 60 63 Z" fill="#3b0764" />
              
              {/* Eyes Looking in Direction of Twist */}
              <circle cx="78" cy="68" r="4" fill="#3b0764" />
              <circle cx="79" cy="66" r="1.5" fill="#ffffff" />
              <circle cx="96" cy="68" r="4" fill="#3b0764" />
              <circle cx="97" cy="66" r="1.5" fill="#ffffff" />

              {/* Blush */}
              <circle cx="74" cy="76" r="4" fill="#f472b6" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#f472b6" opacity="0.65" />

              {/* Focused Smile */}
              <path d="M 83 78 Q 87 83 91 78" fill="none" stroke="#831843" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "wrist_flexor":
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            <circle cx="85" cy="85" r="62" fill="rgba(245, 158, 11, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

            {/* Wrist Stretch Ripple Ring */}
            <circle cx="94" cy="104" r="16" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />

            <g className={isActive ? "animate-anime-bob" : "animate-cartoon-float"}>
              {/* Torso */}
              <path d="M 58 104 C 66 96 102 96 110 104 L 116 148 L 54 148 Z" fill="#d97706" />

              {/* Right Arm Extended with Animated Wrist Flexion */}
              <g className={isActive ? "animate-cartoon-wrist-active" : ""}>
                {/* Upper Arm extending */}
                <path d="M 104 106 L 98 116" fill="none" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
                {/* Forearm pointing forward */}
                <path d="M 98 116 L 94 104" fill="none" stroke="#f59e0b" strokeWidth="6.5" strokeLinecap="round" />
                {/* Wrist Joint */}
                <circle cx="94" cy="104" r="5" fill="#fed7aa" />
                {/* Palm pointing forward, fingers downward */}
                <path d="M 94 104 L 94 122" fill="none" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
                
                {/* Left Hand: Reaching over to gently pull fingers */}
                <path d="M 64 106 Q 78 116 92 116" fill="none" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
                <circle cx="92" cy="116" r="5" fill="#fed7aa" />
              </g>

              {/* Upright Head */}
              <rect x="79" y="84" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="69" rx="24" ry="22" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 60 63 C 62 44 76 40 85 40 C 94 40 108 44 110 63 C 104 54 96 54 91 59 C 87 54 79 54 75 60 C 70 54 64 56 60 63 Z" fill="#451a03" />

              {/* Cheerful Playful Wink Eyes */}
              <circle cx="76" cy="68" r="4" fill="#451a03" />
              <circle cx="77" cy="67" r="1.5" fill="#ffffff" />
              <path d="M 92 68 L 98 71 L 92 74" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />

              {/* Blushes */}
              <circle cx="72" cy="76" r="4" fill="#fb7185" opacity="0.65" />
              <circle cx="98" cy="76" r="4" fill="#fb7185" opacity="0.65" />

              {/* Bright Wink Smile */}
              <path d="M 81 79 Q 85 84 89 79" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "chest_opener":
      default:
        return (
          <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-xl select-none">
            <circle cx="85" cy="85" r="62" fill="rgba(20, 184, 166, 0.1)" className={isActive ? "animate-cartoon-ripple" : ""} />

            {/* Peaceful Floating Breath Bubbles */}
            <g className="animate-anime-sparkle">
              <circle cx="50" cy="54" r="3" fill="#2dd4bf" />
              <circle cx="120" cy="48" r="3.5" fill="#2dd4bf" />
              <path d="M 85 32 Q 92 28 98 34" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Animated Deep Chest Breathing Expansion */}
            <g className={isActive ? "animate-cartoon-chest-active" : "animate-cartoon-float"}>
              {/* Torso Expanding Proudly */}
              <path d="M 56 102 C 67 93 103 93 114 102 L 118 148 L 52 148 Z" fill="#0d9488" />
              <path d="M 72 102 Q 85 111 98 102" fill="none" stroke="#ccfbf1" strokeWidth="3" strokeLinecap="round" />
              
              {/* Hands Interlaced Behind Back */}
              <path d="M 58 104 Q 44 122 62 134" fill="none" stroke="#14b8a6" strokeWidth="7" strokeLinecap="round" />
              <path d="M 112 104 Q 126 122 108 134" fill="none" stroke="#14b8a6" strokeWidth="7" strokeLinecap="round" />
              {/* Clapped hands behind lower spine */}
              <ellipse cx="85" cy="136" rx="9" ry="5" fill="#fed7aa" />

              {/* Head Tilted Slightly Back in Pure Posture Relief */}
              <rect x="79" y="82" width="12" height="17" rx="3" fill="#fed7aa" />
              <ellipse cx="85" cy="67" rx="24" ry="22" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 60 61 C 62 42 76 38 85 38 C 94 38 108 42 110 61 C 104 52 96 52 91 57 C 87 52 79 52 75 58 C 70 52 64 54 60 61 Z" fill="#134e4a" />

              {/* Serene Blissful Closed Eyes ( ˘ ᵕ ˘ ) */}
              <path d="M 72 68 Q 77 64 82 68" fill="none" stroke="#134e4a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 88 68 Q 93 64 98 68" fill="none" stroke="#134e4a" strokeWidth="2.5" strokeLinecap="round" />

              {/* Deep Relax Blushes */}
              <circle cx="72" cy="74" r="4.5" fill="#fb7185" opacity="0.7" />
              <circle cx="98" cy="74" r="4.5" fill="#fb7185" opacity="0.7" />

              {/* Relieved Exhale Smile */}
              <path d="M 81 77 Q 85 81 89 77" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-4 relative overflow-hidden shadow-inner">
      {/* Top Coach Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            {isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          </span>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Coach Aoi • Desk Stretch Mascot
          </span>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
          isActive 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {isActive ? '⚡ Active Exercise Mode' : '👀 Movement Preview'}
        </span>
      </div>

      {/* Main Stage: Animated Cartoon Character & Interactive Speech Bubble */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Cartoon Character Display Stage */}
        <div className="w-40 h-40 shrink-0 relative flex items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-lg">
          {renderCharacterSVG()}
          
          {/* Active Workout Glow Badge */}
          {isActive ? (
            <div className="absolute -bottom-2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Moving Now!
            </div>
          ) : (
            <div className="absolute -bottom-2 bg-slate-800 text-slate-300 font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-700">
              Ready to Start
            </div>
          )}
        </div>

        {/* Cartoon Coach Speech Bubble */}
        <div className="flex-1 space-y-2.5 text-left w-full">
          {/* Speech Bubble Arrow Box */}
          <div className="relative bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-sm">
            {/* Left triangle pointer for desktop */}
            <div className="hidden sm:block absolute -left-2 top-6 w-3 h-3 bg-slate-900 border-l border-b border-slate-700/80 transform rotate-45" />

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-md">
                {currentDialogue.bubbleTag}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentDialogue.action}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              "{currentDialogue.speech}"
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                {currentDialogue.repCue}
              </span>
            </div>
          </div>

          {/* Toggle Full Technical Instruction Link */}
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-[11px] text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showFullText ? "Hide detailed step-by-step" : "View clinical instruction text"}</span>
            {showFullText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Technical Instruction Detail */}
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
