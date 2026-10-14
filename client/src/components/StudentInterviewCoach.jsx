import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Smile,
  Shield,
  Zap,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight,
  UserCheck,
  Compass,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Volume2,
  Camera,
  CameraOff,
  RefreshCw,
  Sliders,
  Maximize2
} from 'lucide-react';
import { soundManager } from '../utils/audioAlerts';

export default function StudentInterviewCoach() {
  const [activeTab, setActiveTab] = useState('foundation');
  const [comparisonMode, setComparisonMode] = useState('confident'); // 'confident' | 'slouched'
  
  // Camera & Live Practice State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [simPostureIndex, setSimPostureIndex] = useState(0); // 0: Optimal, 1: Looking Down, 2: Slouching, 3: Face Touching

  // Live Biomechanical Telemetry for Interviews
  const [interviewMetrics, setInterviewMetrics] = useState({
    score: 95,
    isEyeLevel: true,
    isShouldersLevel: true,
    isSpineUpright: true,
    isTouchingFace: false,
    statusText: "Camera initialized. Sit tall on the front 2/3 of your chair."
  });

  // 3-Minute Interview Posture Practice Timer
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const isCameraActiveRef = useRef(false);
  const animFrameRef = useRef(null);

  // 3-Minute Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      setTimerCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(180);
    setTimerCompleted(false);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Ensure MediaPipe Pose is loaded
  const ensurePose = async () => {
    if (poseRef.current) return poseRef.current;
    if (typeof window === 'undefined') return null;

    if (!window.Pose) {
      await new Promise((resolve) => {
        let script = document.querySelector('script[src*="@mediapipe/pose"]');
        if (!script) {
          script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }
        script.addEventListener('load', () => resolve(true), { once: true });
        script.addEventListener('error', () => resolve(false), { once: true });
        setTimeout(() => resolve(Boolean(window.Pose)), 3000);
      });
    }

    if (window.Pose && !poseRef.current) {
      try {
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        pose.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        pose.onResults(handlePoseResults);
        poseRef.current = pose;
      } catch (err) {
        console.warn("Pose init note:", err);
      }
    }
    return poseRef.current;
  };

  // Evaluate candidate landmarks for interview presence
  const evaluateInterviewLandmarks = (lms) => {
    if (!lms || lms.length < 13) return null;

    const nose = lms[0] || { x: 0.5, y: 0.28 };
    const leftEye = lms[2] || lms[1] || { x: 0.47, y: 0.26 };
    const rightEye = lms[5] || lms[4] || { x: 0.53, y: 0.26 };
    const leftEar = lms[7] || { x: 0.45, y: 0.27 };
    const rightEar = lms[8] || { x: 0.55, y: 0.27 };
    const leftShoulder = lms[11] || { x: 0.38, y: 0.48 };
    const rightShoulder = lms[12] || { x: 0.62, y: 0.48 };
    const leftWrist = lms[15];
    const rightWrist = lms[16];

    // 1. Eye Horizon Level & Looking Down Check
    const midEarY = (leftEar.y + rightEar.y) / 2;
    const eyeDx = rightEye.x - leftEye.x;
    const eyeDy = rightEye.y - leftEye.y;
    const eyeTilt = Math.abs((Math.atan2(eyeDy, eyeDx) * 180) / Math.PI);
    const isLookingDown = (nose.y - midEarY) > 0.045;
    const isEyeLevel = eyeTilt <= 4.5 && !isLookingDown;

    // 2. Shoulder Level & Openness Check
    const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y) * 100;
    const isShouldersLevel = shoulderTilt <= 3.8;

    // 3. Upright Spine & Seated Centering Check
    const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
    const isSpineUpright = Math.abs(midShoulderX - 0.50) < 0.08;

    // 4. Hands Touching Face / Nervous Fidgeting Check
    let isTouchingFace = false;
    if (leftWrist && (leftWrist.visibility ?? 1) > 0.3) {
      if (Math.hypot(leftWrist.x - nose.x, leftWrist.y - nose.y) < 0.16) isTouchingFace = true;
    }
    if (rightWrist && (rightWrist.visibility ?? 1) > 0.3) {
      if (Math.hypot(rightWrist.x - nose.x, rightWrist.y - nose.y) < 0.16) isTouchingFace = true;
    }

    // Compute composite interview executive presence score
    let score = 100;
    if (!isEyeLevel) score -= (isLookingDown ? 28 : 18);
    if (!isSpineUpright) score -= 30;
    if (!isShouldersLevel) score -= 18;
    if (isTouchingFace) score -= 25;
    score = Math.max(25, Math.min(100, score));

    // Dynamic advice
    let statusText = "Ready for Panel! Spine tall, eye contact aligned, chest open.";
    if (isTouchingFace) {
      statusText = "Hands touching face/neck! Rest hands calmly in open steeple or lap.";
    } else if (isLookingDown) {
      statusText = "Looking down at lap/notes! Lift your chin to meet judges' eye horizon.";
    } else if (!isSpineUpright) {
      statusText = "Spine tilted or slouched! Sit on front 2/3 of chair and sit tall.";
    } else if (!isShouldersLevel) {
      statusText = "Shoulders uneven! Roll shoulders back and relax both arms.";
    } else if (score < 80) {
      statusText = "Engage your core and lean 5° forward toward the judges.";
    }

    return {
      score,
      isEyeLevel,
      isShouldersLevel,
      isSpineUpright,
      isTouchingFace,
      statusText
    };
  };

  // Draw overlay with interview guidelines
  const drawInterviewOverlay = (ctx, lms, evaluated, width, height) => {
    if (!ctx || !lms || lms.length < 13) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    const themeColor = evaluated.score >= 85 ? "#10b981" : (evaluated.score >= 65 ? "#f59e0b" : "#ef4444");

    const nose = lms[0] || { x: 0.5, y: 0.28 };
    const leftEye = lms[2] || { x: 0.47, y: 0.26 };
    const rightEye = lms[5] || { x: 0.53, y: 0.26 };
    const leftShoulder = lms[11] || { x: 0.38, y: 0.48 };
    const rightShoulder = lms[12] || { x: 0.62, y: 0.48 };
    const leftWrist = lms[15];
    const rightWrist = lms[16];

    // Pixel coords
    const nosePx = { x: nose.x * width, y: nose.y * height };
    const leftEyePx = { x: leftEye.x * width, y: leftEye.y * height };
    const rightEyePx = { x: rightEye.x * width, y: rightEye.y * height };
    const leftShoulderPx = { x: leftShoulder.x * width, y: leftShoulder.y * height };
    const rightShoulderPx = { x: rightShoulder.x * width, y: rightShoulder.y * height };
    const midShoulderPx = { x: (leftShoulderPx.x + rightShoulderPx.x) / 2, y: (leftShoulderPx.y + rightShoulderPx.y) / 2 };
    const midHipPx = { x: width / 2, y: midShoulderPx.y + (Math.abs(rightShoulderPx.x - leftShoulderPx.x) * 1.3) };

    // 1. Draw Panel Eye-Line Guide (Horizontal Cyan line)
    const eyeLineY = (leftEyePx.y + rightEyePx.y) / 2;
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, eyeLineY);
    ctx.lineTo(width - 20, eyeLineY);
    ctx.stroke();

    // Eye line badge
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(20, eyeLineY - 18, 140, 16);
    ctx.font = "bold 9px Inter, sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("👀 PANEL EYE LINE", 26, eyeLineY - 6);
    ctx.restore();

    // 2. Draw Eyes & Gaze Level Guide
    const eyeColor = evaluated.isEyeLevel ? "#10b981" : "#ef4444";
    ctx.strokeStyle = eyeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(leftEyePx.x, leftEyePx.y);
    ctx.lineTo(rightEyePx.x, rightEyePx.y);
    ctx.stroke();

    // Eye nodes
    [leftEyePx, rightEyePx].forEach(pt => {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 3. Draw Shoulders & Clavicle line
    const shoulderColor = evaluated.isShouldersLevel ? "#10b981" : "#f59e0b";
    ctx.strokeStyle = shoulderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftShoulderPx.x, leftShoulderPx.y);
    ctx.lineTo(rightShoulderPx.x, rightShoulderPx.y);
    ctx.stroke();

    [leftShoulderPx, rightShoulderPx].forEach(pt => {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shoulderColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 4. Draw Spinal Column (The 2/3 Rule & 5° Incline Line)
    const spineColor = evaluated.isSpineUpright ? "#10b981" : "#ef4444";
    ctx.strokeStyle = spineColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(midShoulderPx.x, midShoulderPx.y);
    ctx.lineTo(midHipPx.x, midHipPx.y);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(midHipPx.x, midHipPx.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Hand Position Warnings
    if (evaluated.isTouchingFace) {
      ctx.save();
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.beginPath();
      ctx.arc(nosePx.x, nosePx.y, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Top High-Tech Glassmorphism HUD Bar
    const hudW = Math.min(width - 24, 380);
    const hudX = (width - hudW) / 2;
    const hudY = 12;
    ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, 30, 8);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = themeColor;
    ctx.stroke();

    ctx.font = "bold 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`🎓 Presence: ${evaluated.score}%`, hudX + 12, hudY + 19);

    ctx.fillStyle = themeColor;
    ctx.fillText(evaluated.score >= 85 ? "• Panel Ready" : "• Needs Adjusting", hudX + 130, hudY + 19);

    ctx.restore();
  };

  const handlePoseResults = (results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const lms = results.poseLandmarks;
    const evaluated = evaluateInterviewLandmarks(lms);
    if (!evaluated) return;

    setInterviewMetrics(evaluated);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (showGuides) {
      drawInterviewOverlay(ctx, lms, evaluated, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  // Start Real Student Webcam
  const startCamera = async () => {
    setCameraError(null);
    setIsSimulatedMode(false);
    setIsCameraStarting(true);

    try {
      await ensurePose();

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
      } catch (e1) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;

        await videoRef.current.play();

        isCameraActiveRef.current = true;
        setIsCameraActive(true);
        setIsCameraStarting(false);

        let isProcessing = false;
        const processFrame = async () => {
          if (!isCameraActiveRef.current) return;
          const video = videoRef.current;
          if (video && video.readyState >= 2 && video.videoWidth > 0 && !isProcessing) {
            if (poseRef.current) {
              try {
                isProcessing = true;
                await poseRef.current.send({ image: video });
              } catch (e) {
                // busy
              } finally {
                isProcessing = false;
              }
            }
          }
          if (isCameraActiveRef.current) {
            if (video && 'requestVideoFrameCallback' in video) {
              video.requestVideoFrameCallback(processFrame);
            } else {
              animFrameRef.current = requestAnimationFrame(processFrame);
            }
          }
        };

        if ('requestVideoFrameCallback' in videoRef.current) {
          videoRef.current.requestVideoFrameCallback(processFrame);
        } else {
          animFrameRef.current = requestAnimationFrame(processFrame);
        }
      }
    } catch (err) {
      console.warn("Camera start note:", err);
      setCameraError("Camera unavailable or in use. You can use the Interactive Posture Simulator below to try all sitting guides!");
      setIsCameraStarting(false);
      setIsCameraActive(false);
      setIsSimulatedMode(true);
    }
  };

  const stopCamera = () => {
    isCameraActiveRef.current = false;
    setIsCameraActive(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Handle Simulated Mode Posture Switch
  useEffect(() => {
    if (!isSimulatedMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Build simulated landmarks based on posture index
    // 0: Optimal 5° Incline (Hire)
    // 1: Looking Down at Lap
    // 2: Slouching / Leaning Back
    // 3: Nervous Neck Touching
    const lms = [];
    if (simPostureIndex === 0) {
      // Optimal Upright with 5° Incline
      lms[0] = { x: 0.50, y: 0.28 };
      lms[2] = { x: 0.47, y: 0.26 };
      lms[5] = { x: 0.53, y: 0.26 };
      lms[7] = { x: 0.45, y: 0.27 };
      lms[8] = { x: 0.55, y: 0.27 };
      lms[11] = { x: 0.38, y: 0.48 };
      lms[12] = { x: 0.62, y: 0.48 };
      lms[15] = { x: 0.42, y: 0.74 };
      lms[16] = { x: 0.58, y: 0.74 };
    } else if (simPostureIndex === 1) {
      // Looking Down into lap
      lms[0] = { x: 0.50, y: 0.36 };
      lms[2] = { x: 0.47, y: 0.33 };
      lms[5] = { x: 0.53, y: 0.33 };
      lms[7] = { x: 0.45, y: 0.28 };
      lms[8] = { x: 0.55, y: 0.28 };
      lms[11] = { x: 0.38, y: 0.49 };
      lms[12] = { x: 0.62, y: 0.49 };
      lms[15] = { x: 0.42, y: 0.74 };
      lms[16] = { x: 0.58, y: 0.74 };
    } else if (simPostureIndex === 2) {
      // Slouching / Leaning Back (Sofa slouch)
      lms[0] = { x: 0.56, y: 0.32 };
      lms[2] = { x: 0.53, y: 0.30 };
      lms[5] = { x: 0.59, y: 0.30 };
      lms[7] = { x: 0.50, y: 0.31 };
      lms[8] = { x: 0.60, y: 0.31 };
      lms[11] = { x: 0.44, y: 0.53 };
      lms[12] = { x: 0.68, y: 0.54 };
      lms[15] = { x: 0.40, y: 0.74 };
      lms[16] = { x: 0.60, y: 0.74 };
    } else {
      // Nervous Neck Touching / Fidgeting
      lms[0] = { x: 0.50, y: 0.28 };
      lms[2] = { x: 0.47, y: 0.26 };
      lms[5] = { x: 0.53, y: 0.26 };
      lms[7] = { x: 0.45, y: 0.27 };
      lms[8] = { x: 0.55, y: 0.27 };
      lms[11] = { x: 0.38, y: 0.48 };
      lms[12] = { x: 0.62, y: 0.48 };
      lms[15] = { x: 0.49, y: 0.35 }; // Hand on throat/neck
      lms[16] = { x: 0.58, y: 0.74 };
    }

    const evaluated = evaluateInterviewLandmarks(lms);
    if (evaluated) {
      setInterviewMetrics(evaluated);
      drawInterviewOverlay(ctx, lms, evaluated, width, height);
    }
  }, [isSimulatedMode, simPostureIndex, showGuides]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section id="interview-guide" className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Student Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Student &amp; Interview Candidate Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              Sitting in Front of Judges: Interview Posture &amp; Practice Camera
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Use your live webcam below to practice how to sit in front of an interview panel. SitSmart guides your eye level, 2/3 chair sitting, 5° forward incline, and hand placement in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
              🎓 Placements &amp; Viva
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
              Corporate Panels
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
              Zoom &amp; Video Viva
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🎥 LIVE STUDENT INTERVIEW PRACTICE CAMERA STUDIO & CHECKLIST */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Camera className="w-4 h-4" /> Live Interactive Practice Mirror
              </div>
              <h3 className="text-xl font-bold text-white">
                Test Your Seated Presence in Front of Judges
              </h3>
            </div>

            {/* Camera Control Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  disabled={isCameraStarting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCameraStarting ? "Starting Camera..." : "Start Interview Camera"}</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CameraOff className="w-4 h-4" /> Stop Camera
                </button>
              )}

              <button
                onClick={() => {
                  stopCamera();
                  setIsSimulatedMode(!isSimulatedMode);
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSimulatedMode
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Toggle simulated practice without camera"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isSimulatedMode ? "Simulating On" : "Try Simulator"}</span>
              </button>

              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Flip mirror"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Camera Error Alert */}
          {cameraError && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Practice Camera Wireframe: Viewport Left (7 Cols), Live Interview Checklist Right (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Viewport on Left */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center">
                {/* Real video feed */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transition-transform ${isMirrored ? 'scale-x-[-1]' : ''} ${
                    isCameraActive ? 'block' : 'hidden'
                  }`}
                  playsInline
                  muted
                />

                {/* MediaPipe landmark & guide overlay canvas */}
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className={`absolute inset-0 w-full h-full pointer-events-none transition-transform ${
                    isMirrored ? 'scale-x-[-1]' : ''
                  }`}
                />

                {/* Camera Inactive Empty State */}
                {!isCameraActive && !isSimulatedMode && (
                  <div className="text-center p-6 space-y-3 max-w-sm">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Camera className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-white">Interview Practice Mirror</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click <strong>"Start Interview Camera"</strong> to see how you sit in front of judges with real-time eye-level and posture guides.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        Turn On Camera
                      </button>
                      <button
                        onClick={() => setIsSimulatedMode(true)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                      >
                        Try Simulator
                      </button>
                    </div>
                  </div>
                )}

                {/* Simulated Mode Active Indicator */}
                {isSimulatedMode && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-brand-500/40 text-[10px] font-mono text-brand-300">
                    Simulator Mode Active (No Camera Required)
                  </div>
                )}
              </div>

              {/* Simulation Mode Posture Switcher Pill Bar */}
              {isSimulatedMode && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Test Sitting Posture:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSimPostureIndex(0)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        simPostureIndex === 0
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      1. Optimal 5° Incline (98%)
                    </button>
                    <button
                      onClick={() => setSimPostureIndex(1)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        simPostureIndex === 1
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      2. Looking Down (68%)
                    </button>
                    <button
                      onClick={() => setSimPostureIndex(2)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        simPostureIndex === 2
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      3. Slouched Back (54%)
                    </button>
                    <button
                      onClick={() => setSimPostureIndex(3)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        simPostureIndex === 3
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      4. Touching Neck (48%)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Interview Checklist & Real-Time Score on Right */}
            <div className="lg:col-span-5 space-y-4">
              {/* Executive Presence Score Card */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Executive Presence Score
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    interviewMetrics.score >= 85
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : interviewMetrics.score >= 65
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {interviewMetrics.score >= 85 ? "Interview Ready" : "Adjust Posture"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-mono font-black ${
                    interviewMetrics.score >= 85 ? 'text-emerald-400' : (interviewMetrics.score >= 65 ? 'text-amber-400' : 'text-rose-400')
                  }`}>
                    {interviewMetrics.score}%
                  </span>
                  <span className="text-xs text-slate-400">/ 100% Board Readiness</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      interviewMetrics.score >= 85 ? 'bg-emerald-500' : (interviewMetrics.score >= 65 ? 'bg-amber-500' : 'bg-rose-500')
                    }`}
                    style={{ width: `${interviewMetrics.score}%` }}
                  />
                </div>

                {/* Real-time advice message */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{interviewMetrics.statusText}</span>
                </div>
              </div>

              {/* 4 Live Checkpoints for Seated Interview Posture */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Real-Time Sitting Checkpoints:
                </div>

                {/* Checkpoint 1: Eye Level */}
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  interviewMetrics.isEyeLevel
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {interviewMetrics.isEyeLevel ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold">1. Eyes Level with Panel Line</span>
                  </div>
                  <span className="text-[10px] font-mono">
                    {interviewMetrics.isEyeLevel ? "Aligned" : "Look up & level chin"}
                  </span>
                </div>

                {/* Checkpoint 2: Spine 2/3 Rule */}
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  interviewMetrics.isSpineUpright
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {interviewMetrics.isSpineUpright ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold">2. 2/3 Chair Spine Engagement</span>
                  </div>
                  <span className="text-[10px] font-mono">
                    {interviewMetrics.isSpineUpright ? "Upright" : "Sit tall, don't slump"}
                  </span>
                </div>

                {/* Checkpoint 3: Shoulders */}
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  interviewMetrics.isShouldersLevel
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {interviewMetrics.isShouldersLevel ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold">3. Shoulders Rolled &amp; Level</span>
                  </div>
                  <span className="text-[10px] font-mono">
                    {interviewMetrics.isShouldersLevel ? "Level" : "Even shoulders out"}
                  </span>
                </div>

                {/* Checkpoint 4: Hands Still */}
                <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  !interviewMetrics.isTouchingFace
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {!interviewMetrics.isTouchingFace ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold">4. Hands Still &amp; Grounded</span>
                  </div>
                  <span className="text-[10px] font-mono">
                    {!interviewMetrics.isTouchingFace ? "Poised" : "Avoid touching face"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📚 4 GOLDEN PRINCIPLES & INTERACTIVE GUIDE MODULES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-brand-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-black text-base mb-3">
              1
            </div>
            <h3 className="font-bold text-white text-base">The 2/3 Chair Rule</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Sit on the front two-thirds of the seat cushion. Never sink back into the chair corners like relaxing on a couch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base mb-3">
              2
            </div>
            <h3 className="font-bold text-white text-base">The Golden 5° Incline</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Lean gently 5° forward from your hips toward the judges to non-verbally signal keen interest and active listening.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-base mb-3">
              3
            </div>
            <h3 className="font-bold text-white text-base">Open Steeple Hands</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Rest hands in view on the table or your lap in a relaxed open steeple or soft cup. Keep palms visible to project trust.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base mb-3">
              4
            </div>
            <h3 className="font-bold text-white text-base">Grounded Flat Feet</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Plant both soles firmly on the ground. Eliminates nervous leg bouncing, knee shaking, and anxious chair-leg curling.
            </p>
          </div>
        </div>

        {/* Detailed Interactive Guide Navigation Tabs */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('foundation')}
              className={`px-5 py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'foundation'
                  ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🪑</span> Entering &amp; Seating Foundation
            </button>
            <button
              onClick={() => setActiveTab('spine')}
              className={`px-5 py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'spine'
                  ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🦴</span> Spine, Shoulders &amp; Breathing
            </button>
            <button
              onClick={() => setActiveTab('eyes')}
              className={`px-5 py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'eyes'
                  ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>👁️</span> Eye Contact &amp; Panel Triangle
            </button>
            <button
              onClick={() => setActiveTab('hands')}
              className={`px-5 py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hands'
                  ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>✋</span> Hand Placement &amp; Gestures
            </button>
            <button
              onClick={() => setActiveTab('toughQuestions')}
              className={`px-5 py-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'toughQuestions'
                  ? 'border-brand-500 text-brand-400 bg-brand-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧠</span> Handling Tough Questions Calmly
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8">
            {activeTab === 'foundation' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🪑</span> Entering the Room &amp; Taking Your Seat
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Your interview begins the exact moment your hand touches the door handle, not when the questions start.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                    <div className="text-brand-400 font-bold text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-400" /> Step 1: The Entrance
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Knock gently (two crisp knocks). Wait for "Please enter." Walk with a steady, confident stride with shoulders squared and arms swinging naturally. Maintain a genuine, warm smile.
                    </p>
                    <div className="pt-2 text-[11px] text-amber-400/90 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      ⚠️ Avoid looking down at your shoes or clutching your resume folder tightly like a shield over your chest.
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                    <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Step 2: The Chair Invitation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Walk to the candidate chair and remain standing comfortably behind or beside it. Wait for the lead judge to say: <em>"Please, take your seat."</em> Reply: <em>"Thank you, Sir/Ma'am."</em>
                    </p>
                    <div className="pt-2 text-[11px] text-emerald-400/90 font-medium bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                      💡 If the chair needs to be pulled out, lift it slightly to avoid screeching scraping sounds across the floor.
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                    <div className="text-indigo-400 font-bold text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" /> Step 3: The 2/3 Seating Rule
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Do not push your hips all the way back into the chair corner. Sit on the front two-thirds (60-70%) of the chair. This naturally forces your abdominal core to engage and keeps your back straight.
                    </p>
                    <div className="pt-2 text-[11px] text-indigo-400/90 font-medium bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                      ✨ Result: You look energetic, alert, and ready to contribute, rather than passive and lazy.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spine' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🦴</span> Spine Alignment, Shoulder Relaxation &amp; Voice Resonance
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Good posture is physiological: an open upright posture allows deep diaphragmatic breathing, keeping your heart rate down and eliminating nervous voice trembling.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <h5 className="font-bold text-white text-base flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> The Vertical String Visualization
                    </h5>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-3">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span><strong>Crown to Tailbone:</strong> Imagine a golden thread attached to the crown of your head pulling gently toward the ceiling. Your spine elongates naturally without stiffness.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span><strong>Shoulder Roll Reset:</strong> In the waiting lobby, roll your shoulders up to your ears, then roll them back and drop them gently down. This opens your chest cavity and releases trapped anxiety.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span><strong>Diaphragmatic Breath Anchor:</strong> When hunched, your lungs are compressed by 30%, causing shallow chest breathing that triggers panic and voice crackles. Upright posture gives your voice full, resonant authority.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <h5 className="font-bold text-white text-base flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-400" /> Dangerous Posture Habits to Eliminate
                    </h5>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-3">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                        <span><strong>The "Sofa Slouch":</strong> Leaning backward with your upper back rounded against the chair back. Judges perceive this as casual indifference, arrogance, or lack of respect.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                        <span><strong>The "Turtle Neck":</strong> Straining your neck forward toward the panel table. This signals submissiveness, anxiety, and creates neck strain.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                        <span><strong>Asymmetric Leaning:</strong> Leaning heavily on one elbow or resting your weight onto one buttock cheek. It twists your spinal axis and looks unorganized.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'eyes' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>👁️</span> Eye Contact: The "Panel Triangle" Technique
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    When facing a panel of multiple judges (2 to 5 members), candidates often make the mistake of only looking at the person who asked the question. Here is how to engage the entire panel.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="text-brand-400 font-bold text-sm">1. Initial Connection (3 Seconds)</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Begin answering by looking directly at the judge who asked the question for the first 3 seconds to validate their query and show attentive understanding.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="text-emerald-400 font-bold text-sm">2. Pan Across Panel (2-3 Sec Each)</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      As you develop your explanation, smoothly shift your gaze to the left judge and the right judge for 2-3 seconds each. This makes every judge feel included and respected.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="text-indigo-400 font-bold text-sm">3. The Conclusion Anchor</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      When delivering your final concluding sentence, bring your eyes back to the primary interviewer and offer a confident, calm nod.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/20 flex items-center gap-3">
                  <Smile className="w-5 h-5 text-brand-400 shrink-0" />
                  <p className="text-xs text-slate-300">
                    <strong>Pro-Tip for Shy Candidates:</strong> If direct eye-to-eye contact makes you feel intimidated, look at the bridge of the judge's nose or between their eyebrows. From 5 feet away, it appears indistinguishable from direct eye contact!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'hands' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>✋</span> Hand Placement, Open Palms &amp; Purposeful Gestures
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Your hands reveal what your mouth tries to hide. Subconscious fidgeting signals nervousness to judges before you even finish your sentence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h5 className="font-bold text-emerald-400 text-sm uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Ideal Hand Positions
                    </h5>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5">
                      <li>• <strong>The Table Resting Steeple:</strong> If there is a table, rest forearms comfortably on the surface with fingertips lightly touching in an open steeple.</li>
                      <li>• <strong>The Gentle Lap Cup:</strong> If sitting with no table (common in UPSC / viva), rest hands gently on top of your thighs, fingers softly curled together, palms down.</li>
                      <li>• <strong>Purposeful Explanatory Gestures:</strong> Use open-palm gestures within the "chest box" (between waist and collarbone) when emphasizing key achievements.</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h5 className="font-bold text-rose-400 text-sm uppercase tracking-wider flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> The 6 Fidgeting Traps to Avoid
                    </h5>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5">
                      <li>• <strong>Neck / Ear Touching:</strong> Non-verbal pacifying behavior that immediately signals severe stress or self-doubt.</li>
                      <li>• <strong>Pen Clicking / Ring Twirling:</strong> Keeps nervous energy in motion and distracts judges.</li>
                      <li>• <strong>Crossing Arms:</strong> Creates an instant psychological wall between you and the interview board.</li>
                      <li>• <strong>Hiding Hands in Lap / Pockets:</strong> Evolutionary psychology shows judges perceive hidden hands as secretive or unconfident.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'toughQuestions' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🧠</span> Composure During Challenging Questions &amp; Stress Tests
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Interview judges frequently ask difficult, trick, or stress questions not to test your exact factual knowledge, but to observe how your body language reacts under pressure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
                    <h5 className="font-bold text-brand-400 text-base">The 3-Second Composure Reset</h5>
                    <ol className="text-xs sm:text-sm text-slate-300 space-y-2.5 list-decimal pl-4">
                      <li><strong>Do NOT flinch:</strong> Keep your shoulders still and spine upright. Avoid blinking rapidly or leaning backward.</li>
                      <li><strong>Inhale silently:</strong> Take a deep, silent diaphragmatic breath through your nose to oxygenate your brain.</li>
                      <li><strong>Acknowledge with poise:</strong> Nod slightly and smile calmly. Say: <em>"That is an insightful question, Sir. Let me take a brief moment to structure my thoughts."</em></li>
                    </ol>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
                    <h5 className="font-bold text-indigo-400 text-base">Ending the Interview with Lasting Impact</h5>
                    <ol className="text-xs sm:text-sm text-slate-300 space-y-2.5 list-decimal pl-4">
                      <li><strong>When dismissed:</strong> Do not scramble to grab papers. Sit tall for one second, smile, and say: <em>"Thank you very much for your time and this conversation."</em></li>
                      <li><strong>Standing up:</strong> Push yourself up with your leg muscles, not by leaning heavily onto the table with both hands.</li>
                      <li><strong>The Chair Courtesy:</strong> Gently push your chair back into the table without dragging, turn around, and exit with an upright, measured walk.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What Judges See: Interactive Candidate Comparison */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>👁️</span> What the Judges See: Non-Verbal Psychology Matrix
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Toggle below to see the psychological impression created by your seated posture.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setComparisonMode('confident')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  comparisonMode === 'confident'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confident Candidate (Hire)
              </button>
              <button
                onClick={() => setComparisonMode('slouched')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  comparisonMode === 'slouched'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" /> Anxious / Slouched (Reject)
              </button>
            </div>
          </div>

          {comparisonMode === 'confident' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-100 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">1. Head &amp; Eyes</span>
                <p className="text-sm font-semibold text-white">Direct gaze, level chin, smiling eyes</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>Honest, transparent, emotionally resilient, and highly prepared.</em></p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">2. Torso &amp; Spine</span>
                <p className="text-sm font-semibold text-white">Upright spine with 5° forward engagement</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>Passionate about the role, energetic, respects the interview board.</em></p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">3. Hands &amp; Feet</span>
                <p className="text-sm font-semibold text-white">Steepled hands visible, feet planted</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>Grounded stability, executive authority, capable of leadership.</em></p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-100 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">1. Head &amp; Eyes</span>
                <p className="text-sm font-semibold text-white">Downward gaze, chin tucked, darting eyes</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>Lacking confidence, timid, hiding information, or unprepared.</em></p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">2. Torso &amp; Spine</span>
                <p className="text-sm font-semibold text-white">Hunched thoracic spine, leaning back</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>Low energy, defensive attitude, indifferent about company/college.</em></p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">3. Hands &amp; Feet</span>
                <p className="text-sm font-semibold text-white">Fidgeting, touching neck, crossed ankles</p>
                <p className="text-xs text-slate-300">Judges perceive: <em>High anxiety, emotional vulnerability under slight pressure.</em></p>
              </div>
            </div>
          )}
        </div>

        {/* 3-Minute Interview Hold Practice Drill & Printable Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: 3-Minute Posture Hold Drill */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-brand-950/60 to-slate-900 border border-brand-500/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Practice Drill
              </div>
              <h4 className="text-xl font-bold text-white">
                3-Minute Interview Hold Drill
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sit in your chair right now. Press start and practice holding your 2/3 chair position, open chest, and steady breathing for 3 full minutes without fidgeting.
              </p>

              {/* Countdown Clock Display */}
              <div className="py-6 text-center">
                <div className="text-5xl font-mono font-black text-white tracking-widest drop-shadow-md">
                  {formatTimer(timerSeconds)}
                </div>
                <p className="text-xs text-brand-400 font-semibold mt-2">
                  {timerCompleted
                    ? "🎉 Fantastic! You maintained poised posture for 3 minutes."
                    : isTimerRunning
                      ? "Inhale calmly for 4s • Exhale slowly for 4s"
                      : "Ready to test your composure?"}
                </p>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-500/20"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerRunning ? "Pause Practice" : "Start 3-Min Hold"}
              </button>
              <button
                onClick={resetTimer}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Right Column: Pre-Interview 5-Minute Emergency Checklist */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Pre-Interview 5-Minute Checklist
                </h4>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  Review Before Entering Room
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Feet:</strong> Both soles planted flat on floor. No ankle cross or leg wrapping.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Hips:</strong> Sitting on front 2/3 of seat cushion. Core gently active.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Shoulders:</strong> Rolled up, back, and dropped. Chest naturally opened.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Hands:</strong> Visible on table or lap in open steeple. No fidgeting.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Neck &amp; Chin:</strong> Chin level with horizon. No downward neck drop.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Breath:</strong> 3 slow nasal breaths before greeting the panel.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Good luck! Sit with pride and speak with conviction.</span>
              </span>
              <a
                href="#live-tracker"
                className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1 transition-colors"
              >
                Test Workplace Tracker <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
