import React, { useState } from 'react';
import { Sparkles, Heart, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function AnimeStretchCharacter({
  stretchId,
  isActive = false,
  secondsLeft = 30,
  instruction = ""
}) {
  const [showFullText, setShowFullText] = useState(false);

  // Custom anime voice lines for each exercise
  const dialogueMap = {
    trapezius_release: {
      action: "Gentle Neck Stretch",
      speech: "Tilt your ear gently toward your shoulder and rest your hand softly on your head~ Feel that tight neck tension melt away!",
      bubbleTag: "Head Tilt & Rest",
      repCue: "Keep shoulders relaxed and breathe steadily"
    },
    scapular_retraction: {
      action: "Shoulder Pinch",
      speech: "Pull your elbows back and squeeze your shoulder blades like holding a pencil between them! Hold it... perfect!",
      bubbleTag: "Squeeze & Retract",
      repCue: "Puff chest out and hold for 5 seconds"
    },
    rule_20_20_20: {
      action: "Far-Distance Gaze",
      speech: "Look far away into the distance with me! Find an object 20 feet away and blink softly~ Screen break time!",
      bubbleTag: "Look 20ft Away",
      repCue: "Rest your eye muscles and blink 5 times"
    },
    spinal_twist: {
      action: "Torso Rotation",
      speech: "Cross your arm over and twist your upper body gently to the side~ Inhale tall, exhale and twist!",
      bubbleTag: "Gentle Spinal Twist",
      repCue: "Rotate smoothly without forcing the movement"
    },
    wrist_flexor: {
      action: "Wrist & Finger Flex",
      speech: "Extend your arm forward with fingers down, then gently ease them back with your other hand! Happy wrists!",
      bubbleTag: "Gentle Finger Pull",
      repCue: "Relieves typing tightness in forearms"
    },
    chest_opener: {
      action: "Expansive Chest Opener",
      speech: "Clasp your hands behind your back and open up your chest wide! Take a big, deep breath in with me~ Ahh!",
      bubbleTag: "Open Chest & Breathe",
      repCue: "Reverse desk hunching with 3 deep breaths"
    }
  };

  const currentDialogue = dialogueMap[stretchId] || dialogueMap.trapezius_release;

  // Render specific animated anime character based on stretchId
  const renderCharacterSVG = () => {
    switch (stretchId) {
      case "trapezius_release":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            {/* Background Zen Glow */}
            <circle cx="80" cy="80" r="55" fill="rgba(56, 189, 248, 0.08)" />
            
            {/* Stretch Wave Lines around Neck */}
            <path
              d="M 60 76 Q 52 70 56 62"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-anime-sparkle"
            />
            <path
              d="M 54 84 Q 46 80 50 72"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-anime-sparkle"
              style={{ animationDelay: '0.6s' }}
            />

            {/* Seated Body / Torso */}
            <g className="animate-anime-bob">
              {/* Chair Back */}
              <rect x="52" y="90" width="56" height="42" rx="8" fill="#1e293b" />
              
              {/* Ergonomic Athletic Tee / Hoodie */}
              <path d="M 58 102 C 64 96 96 96 102 102 L 108 140 L 52 140 Z" fill="#0284c7" />
              {/* Collar Accent */}
              <path d="M 70 102 Q 80 110 90 102" fill="none" stroke="#e0f2fe" strokeWidth="2.5" />
              {/* Logo Emblem */}
              <circle cx="80" cy="116" r="4.5" fill="#38bdf8" />
              <path d="M 80 113 L 80 119 M 77 116 L 83 116" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

              {/* Left Arm (Resting on lap/knee) */}
              <path d="M 58 104 Q 48 116 52 128" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
              <circle cx="52" cy="128" r="4" fill="#fed7aa" />

              {/* Right Arm: Raised Over Head to gently guide neck stretch! */}
              <path
                d="M 102 104 Q 118 80 104 56 Q 96 46 82 48"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Hand gently resting on temple/head */}
              <circle cx="82" cy="49" r="4.5" fill="#fed7aa" />

              {/* Head Group with Animated Tilt */}
              <g className="animate-anime-tilt">
                {/* Neck */}
                <rect x="74" y="85" width="12" height="15" rx="3" fill="#fed7aa" />
                
                {/* Chibi Head */}
                <ellipse cx="80" cy="70" rx="24" ry="22" fill="#fed7aa" />
                
                {/* Soft Anime Hair Backing */}
                <path d="M 56 68 C 54 44 106 44 104 68 C 104 88 56 88 56 68 Z" fill="#475569" opacity="0.25" />
                
                {/* Anime Hair (Styled Bangs & Tufts) */}
                <path d="M 56 64 C 58 46 72 42 80 42 C 88 42 102 46 104 64 C 98 56 90 56 86 60 C 82 56 74 56 70 62 C 66 56 60 58 56 64 Z" fill="#1e1b4b" />
                
                {/* Cute Left Ear */}
                <ellipse cx="57" cy="72" rx="3.5" ry="5" fill="#fecaca" />
                {/* Cute Right Ear */}
                <ellipse cx="103" cy="72" rx="3.5" ry="5" fill="#fecaca" />

                {/* Closed Happy Eyes ( ^ ‿ ^ ) */}
                <path d="M 68 70 Q 72 66 76 70" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 84 70 Q 88 66 92 70" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Cheerful Blush Cheeks */}
                <circle cx="68" cy="76" r="4" fill="#fb7185" opacity="0.6" />
                <circle cx="92" cy="76" r="4" fill="#fb7185" opacity="0.6" />

                {/* Sweet Smile */}
                <path d="M 77 78 Q 80 82 83 78" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        );

      case "scapular_retraction":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            <circle cx="80" cy="80" r="55" fill="rgba(16, 185, 129, 0.08)" />

            {/* Muscle Pinch Star Sparkles */}
            <g className="animate-anime-sparkle">
              <path d="M 40 92 L 43 96 L 40 100 L 37 96 Z" fill="#10b981" />
              <path d="M 120 92 L 123 96 L 120 100 L 117 96 Z" fill="#10b981" />
            </g>

            <g className="animate-anime-pinch">
              {/* Torso & Proud Posture */}
              <path d="M 54 98 C 62 90 98 90 106 98 L 112 140 L 48 140 Z" fill="#059669" />
              <path d="M 68 98 Q 80 106 92 98" fill="none" stroke="#d1fae5" strokeWidth="2.5" />
              
              {/* SitSmart Heart Badge */}
              <path d="M 80 114 C 78 111 74 111 74 114 C 74 118 80 122 80 122 C 80 122 86 118 86 114 C 86 111 82 111 80 114 Z" fill="#34d399" />

              {/* Both Arms Drawn Backward in Squeeze Position */}
              <path d="M 56 100 Q 42 112 48 126" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="48" cy="126" r="4.5" fill="#fed7aa" />

              <path d="M 104 100 Q 118 112 112 126" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="112" cy="126" r="4.5" fill="#fed7aa" />

              {/* Upright Head */}
              <rect x="74" y="80" width="12" height="14" rx="3" fill="#fed7aa" />
              <ellipse cx="80" cy="65" rx="23" ry="21" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 56 60 C 58 42 72 38 80 38 C 88 38 102 42 104 60 C 98 52 90 52 86 56 C 82 52 74 52 70 58 C 66 52 60 54 56 60 Z" fill="#0f172a" />
              
              {/* Ears */}
              <ellipse cx="57" cy="67" rx="3.5" ry="5" fill="#fecaca" />
              <ellipse cx="103" cy="67" rx="3.5" ry="5" fill="#fecaca" />

              {/* Proud Happy Eyes */}
              <circle cx="71" cy="65" r="3.5" fill="#0f172a" />
              <circle cx="72" cy="64" r="1.2" fill="#ffffff" />
              <circle cx="89" cy="65" r="3.5" fill="#0f172a" />
              <circle cx="90" cy="64" r="1.2" fill="#ffffff" />

              {/* Rose Blushes */}
              <circle cx="68" cy="71" r="3.8" fill="#fb7185" opacity="0.65" />
              <circle cx="92" cy="71" r="3.8" fill="#fb7185" opacity="0.65" />

              {/* Confident Smile */}
              <path d="M 76 74 Q 80 78 84 74" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "rule_20_20_20":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            <circle cx="80" cy="80" r="55" fill="rgba(14, 165, 233, 0.08)" />

            {/* Distant 20ft Horizon Target (Mountain & Pine Tree Icon) */}
            <g transform="translate(108, 36)">
              <polygon points="12,18 20,4 28,18" fill="#38bdf8" opacity="0.75" />
              <polygon points="18,18 24,8 30,18" fill="#0284c7" opacity="0.85" />
              <rect x="0" y="2" width="22" height="12" rx="4" fill="#0369a1" />
              <text x="11" y="11" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">20ft</text>
            </g>

            {/* Gaze Ray Lines */}
            <path d="M 88 56 L 110 44" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

            <g className="animate-anime-bob">
              {/* Torso */}
              <path d="M 54 98 C 62 90 98 90 106 98 L 112 140 L 48 140 Z" fill="#0284c7" />
              
              {/* Right Hand Shading Forehead (Scouting into Distance) */}
              <path d="M 104 100 Q 116 78 98 52" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
              <circle cx="98" cy="51" r="4.5" fill="#fed7aa" />

              {/* Left Hand Relaxed */}
              <path d="M 56 100 Q 46 114 52 126" fill="none" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
              <circle cx="52" cy="126" r="4.5" fill="#fed7aa" />

              {/* Head with Gaze Shifted Right */}
              <rect x="74" y="80" width="12" height="14" rx="3" fill="#fed7aa" />
              <ellipse cx="80" cy="65" rx="23" ry="21" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 56 60 C 58 42 72 38 80 38 C 88 38 102 42 104 60 C 98 52 90 52 86 56 C 82 52 74 52 70 58 C 66 52 60 54 56 60 Z" fill="#1e1b4b" />
              
              {/* Big Shimmering Eyes (with Animated Blink!) */}
              <g className="animate-anime-blink">
                <ellipse cx="73" cy="64" rx="4.5" ry="5.5" fill="#0369a1" />
                <circle cx="74" cy="62" r="2" fill="#ffffff" />
                <circle cx="72" cy="66" r="1" fill="#bae6fd" />

                <ellipse cx="89" cy="64" rx="4.5" ry="5.5" fill="#0369a1" />
                <circle cx="90" cy="62" r="2" fill="#ffffff" />
                <circle cx="88" cy="66" r="1" fill="#bae6fd" />
              </g>

              {/* Eye sparkle stars */}
              <path d="M 64 56 L 66 58 L 64 60 L 62 58 Z" fill="#38bdf8" className="animate-anime-sparkle" />
              
              {/* Soft Blushes */}
              <circle cx="68" cy="71" r="3.5" fill="#fb7185" opacity="0.6" />
              <circle cx="92" cy="71" r="3.5" fill="#fb7185" opacity="0.6" />

              {/* Peaceful Open Smile */}
              <path d="M 77 74 Q 81 77 85 74" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "spinal_twist":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            <circle cx="80" cy="80" r="55" fill="rgba(168, 85, 247, 0.08)" />

            {/* Rotational Flow Swirls */}
            <path
              d="M 50 115 Q 80 135 110 115"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.65"
              className="animate-anime-sparkle"
            />

            {/* Seated Office Chair Back */}
            <rect x="52" y="85" width="56" height="46" rx="8" fill="#1e293b" />
            
            {/* Animated Twisting Torso & Head */}
            <g className="animate-anime-twist">
              {/* Torso angled to side */}
              <path d="M 56 98 C 64 92 96 92 104 98 L 108 138 L 52 138 Z" fill="#9333ea" />
              <path d="M 68 98 Q 80 106 92 98" fill="none" stroke="#f3e8ff" strokeWidth="2.5" />

              {/* Right Arm: Reaching across opposite side */}
              <path d="M 60 102 Q 80 114 96 116" fill="none" stroke="#c084fc" strokeWidth="6" strokeLinecap="round" />
              <circle cx="96" cy="116" r="4" fill="#fed7aa" />

              {/* Left Arm: Holding Chair Back */}
              <path d="M 100 102 Q 112 108 108 122" fill="none" stroke="#c084fc" strokeWidth="6" strokeLinecap="round" />
              <circle cx="108" cy="122" r="4" fill="#fed7aa" />

              {/* Head looking over shoulder */}
              <rect x="74" y="80" width="12" height="14" rx="3" fill="#fed7aa" />
              <ellipse cx="80" cy="65" rx="23" ry="21" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 56 60 C 58 42 72 38 80 38 C 88 38 102 42 104 60 C 98 52 90 52 86 56 C 82 52 74 52 70 58 C 66 52 60 54 56 60 Z" fill="#3b0764" />
              
              {/* Eyes shifted sideways */}
              <circle cx="73" cy="64" r="3.5" fill="#3b0764" />
              <circle cx="74" cy="63" r="1.2" fill="#ffffff" />
              <circle cx="89" cy="64" r="3.5" fill="#3b0764" />
              <circle cx="90" cy="63" r="1.2" fill="#ffffff" />

              {/* Blush */}
              <circle cx="70" cy="71" r="3.5" fill="#f472b6" opacity="0.6" />
              <circle cx="92" cy="71" r="3.5" fill="#f472b6" opacity="0.6" />

              {/* Focused smile */}
              <path d="M 78 74 Q 82 78 86 74" fill="none" stroke="#831843" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "wrist_flexor":
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            <circle cx="80" cy="80" r="55" fill="rgba(245, 158, 11, 0.08)" />

            {/* Wrist Stretch Aura Ring */}
            <circle cx="88" cy="98" r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />

            <g className="animate-anime-bob">
              {/* Torso */}
              <path d="M 54 98 C 62 90 98 90 106 98 L 112 140 L 48 140 Z" fill="#d97706" />

              {/* Right Arm Extended Forward with Wrist Flex Animation */}
              <g className="animate-anime-wrist">
                {/* Upper Right Arm */}
                <path d="M 98 100 L 92 110" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                {/* Forearm extending forward */}
                <path d="M 92 110 L 88 98" fill="none" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
                {/* Wrist joint node */}
                <circle cx="88" cy="98" r="4.5" fill="#fed7aa" />
                {/* Hand pointing downward */}
                <path d="M 88 98 L 88 114" fill="none" stroke="#fed7aa" strokeWidth="4.5" strokeLinecap="round" />
                
                {/* Left Arm Reaching Across to gently hold fingers */}
                <path d="M 60 100 Q 72 108 86 108" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                <circle cx="86" cy="108" r="4.5" fill="#fed7aa" />
              </g>

              {/* Head */}
              <rect x="74" y="80" width="12" height="14" rx="3" fill="#fed7aa" />
              <ellipse cx="80" cy="65" rx="23" ry="21" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 56 60 C 58 42 72 38 80 38 C 88 38 102 42 104 60 C 98 52 90 52 86 56 C 82 52 74 52 70 58 C 66 52 60 54 56 60 Z" fill="#451a03" />

              {/* Playful Wink (Left eye open, right eye winking > ) */}
              <circle cx="72" cy="64" r="3.5" fill="#451a03" />
              <circle cx="73" cy="63" r="1.2" fill="#ffffff" />
              <path d="M 86 64 L 92 67 L 86 70" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />

              {/* Blushes */}
              <circle cx="68" cy="71" r="3.5" fill="#fb7185" opacity="0.6" />
              <circle cx="92" cy="71" r="3.5" fill="#fb7185" opacity="0.6" />

              {/* Encouraging Smile */}
              <path d="M 77 75 Q 81 79 85 75" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "chest_opener":
      default:
        return (
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-lg">
            <circle cx="80" cy="80" r="55" fill="rgba(20, 184, 166, 0.08)" />

            {/* Peaceful Floating Breath Sparkles */}
            <g className="animate-anime-sparkle">
              <circle cx="48" cy="50" r="2.5" fill="#2dd4bf" />
              <circle cx="112" cy="46" r="3" fill="#2dd4bf" />
              <path d="M 80 32 Q 86 28 92 34" fill="none" stroke="#5eead4" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Animated Deep Chest Expansion Breathing */}
            <g className="animate-anime-breathe">
              {/* Torso Expanding Upward */}
              <path d="M 52 96 C 62 88 98 88 108 96 L 112 140 L 48 140 Z" fill="#0d9488" />
              <path d="M 68 96 Q 80 104 92 96" fill="none" stroke="#ccfbf1" strokeWidth="2.5" />
              
              {/* Clapped Hands Behind Lower Back */}
              <path d="M 54 98 Q 42 116 58 126" fill="none" stroke="#14b8a6" strokeWidth="6" strokeLinecap="round" />
              <path d="M 106 98 Q 118 116 102 126" fill="none" stroke="#14b8a6" strokeWidth="6" strokeLinecap="round" />
              {/* Interlaced hands behind back */}
              <ellipse cx="80" cy="128" rx="8" ry="4.5" fill="#fed7aa" />

              {/* Head Tilted Slightly Back in Pure Relief */}
              <rect x="74" y="78" width="12" height="15" rx="3" fill="#fed7aa" />
              <ellipse cx="80" cy="63" rx="23" ry="21" fill="#fed7aa" />
              
              {/* Hair */}
              <path d="M 56 58 C 58 40 72 36 80 36 C 88 36 102 40 104 58 C 98 50 90 50 86 54 C 82 50 74 50 70 56 C 66 50 60 52 56 58 Z" fill="#134e4a" />

              {/* Serene Blissful Closed Eyes ( ˘ ᵕ ˘ ) */}
              <path d="M 68 64 Q 72 61 76 64" fill="none" stroke="#134e4a" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 84 64 Q 88 61 92 64" fill="none" stroke="#134e4a" strokeWidth="2.2" strokeLinecap="round" />

              {/* Deep Relax Blush */}
              <circle cx="68" cy="69" r="4" fill="#fb7185" opacity="0.65" />
              <circle cx="92" cy="69" r="4" fill="#fb7185" opacity="0.65" />

              {/* Gentle Breathing Smile */}
              <path d="M 77 72 Q 80 76 83 72" fill="none" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-4 relative overflow-hidden shadow-inner">
      {/* Decorative Top Pill */}
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
            Aoi • Ergo Coach
          </span>
        </div>

        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          {currentDialogue.action}
        </span>
      </div>

      {/* Main Stage: Animated Anime Character & Interactive Speech Bubble */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        {/* Anime Character Display Avatar */}
        <div className="w-36 h-36 shrink-0 relative flex items-center justify-center p-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-md">
          {renderCharacterSVG()}
          
          {/* Active Workout Glow Badge */}
          {isActive && (
            <div className="absolute -bottom-2 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg animate-bounce">
              Exercising!
            </div>
          )}
        </div>

        {/* Anime Coach Speech Bubble */}
        <div className="flex-1 space-y-2.5 text-left">
          {/* Speech Bubble Arrow Box */}
          <div className="relative bg-slate-900/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-sm">
            {/* Left triangle pointer for desktop */}
            <div className="hidden sm:block absolute -left-2 top-6 w-3 h-3 bg-slate-900 border-l border-b border-slate-700/80 transform rotate-45" />

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
            <span>{showFullText ? "Hide detailed clinical steps" : "View detailed clinical instruction"}</span>
            {showFullText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Technical Instruction Detail */}
      {showFullText && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="font-semibold text-white mb-1">Clinical Execution:</p>
          <p className="text-slate-300">{instruction}</p>
        </div>
      )}
    </div>
  );
}
