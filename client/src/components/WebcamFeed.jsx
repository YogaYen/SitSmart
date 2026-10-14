import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  PictureInPicture,
  BellRing
} from 'lucide-react';
import { analyzePosture, drawErgonomicSkeleton } from '../utils/poseUtils';
import { soundManager } from '../utils/audioAlerts';

export default function WebcamFeed({
  onAnalysisChange,
  onTrackingChange,
  isMuted = false,
  onCalibrationSuccess,
  calibrationOffset = { neck: 0, torso: 0 },
  setCalibrationOffset
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [startingStatus, setStartingStatus] = useState("Initializing camera...");
  const [hasFirstPose, setHasFirstPose] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);
  const [simSlouchAmount, setSimSlouchAmount] = useState(0); // 0 = optimal, 100 = full slouch
  const [calibrationNotice, setCalibrationNotice] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [testedPop, setTestedPop] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pipCanvasRef = useRef(null);
  const pipVideoRef = useRef(null);
  const poseRef = useRef(null);
  const cameraUtilRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastLandmarksRef = useRef(null);
  const lastAnalysisRef = useRef(null);
  const backgroundIntervalRef = useRef(null);

  // Mutable refs to prevent stale closures inside MediaPipe / timers
  const isPiPActiveRef = useRef(isPiPActive);
  const showSkeletonRef = useRef(showSkeleton);
  const isMirroredRef = useRef(isMirrored);
  const calibrationOffsetRef = useRef(calibrationOffset);
  const isCameraActiveRef = useRef(isCameraActive);
  const onAnalysisChangeRef = useRef(onAnalysisChange);
  const onTrackingChangeRef = useRef(onTrackingChange);

  useEffect(() => { isPiPActiveRef.current = isPiPActive; }, [isPiPActive]);
  useEffect(() => { showSkeletonRef.current = showSkeleton; }, [showSkeleton]);
  useEffect(() => { isMirroredRef.current = isMirrored; }, [isMirrored]);
  useEffect(() => { calibrationOffsetRef.current = calibrationOffset; }, [calibrationOffset]);
  useEffect(() => { isCameraActiveRef.current = isCameraActive; }, [isCameraActive]);
  useEffect(() => { onAnalysisChangeRef.current = onAnalysisChange; }, [onAnalysisChange]);
  useEffect(() => { onTrackingChangeRef.current = onTrackingChange; }, [onTrackingChange]);

  // Background tab pose estimation: ensures camera detects posture when working on other tabs/windows
  useEffect(() => {
    const handleVisChange = () => {
      const hidden = document.hidden;
      setIsTabHidden(hidden);
      if (hidden) {
        soundManager.requestNotificationPermission();
        // Start background interval to continuously pump webcam frames into MediaPipe even when backgrounded
        if (!backgroundIntervalRef.current && isCameraActive && videoRef.current && poseRef.current) {
          backgroundIntervalRef.current = setInterval(async () => {
            if (videoRef.current && poseRef.current && videoRef.current.readyState >= 2) {
              try {
                await poseRef.current.send({ image: videoRef.current });
              } catch (e) {
                // frame dropped or busy
              }
            }
          }, 1000);
        }
      } else {
        if (backgroundIntervalRef.current) {
          clearInterval(backgroundIntervalRef.current);
          backgroundIntervalRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisChange);
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
        backgroundIntervalRef.current = null;
      }
    };
  }, [isCameraActive]);

  // Update Picture-in-Picture canvas with camera feed, skeletal lines, and posture HUD
  const updatePip = (evaluated) => {
    if (!pipCanvasRef.current || !evaluated) return;
    const pCanvas = pipCanvasRef.current;
    const pCtx = pCanvas.getContext('2d');
    const width = pCanvas.width;
    const height = pCanvas.height;

    pCtx.clearRect(0, 0, width, height);

    if (videoRef.current && isCameraActiveRef.current && videoRef.current.readyState >= 2) {
      pCtx.save();
      if (isMirroredRef.current) {
        pCtx.translate(width, 0);
        pCtx.scale(-1, 1);
      }
      // 1. Draw webcam video feed
      pCtx.drawImage(videoRef.current, 0, 0, width, height);

      // 2. Draw skeletal overlay lines directly on top of video feed with identical mirroring!
      if (showSkeletonRef.current && canvasRef.current) {
        pCtx.drawImage(canvasRef.current, 0, 0, width, height);
      }
      pCtx.restore();
    } else if (canvasRef.current) {
      // In simulated mode or standby screen
      pCtx.fillStyle = "#090d16";
      pCtx.fillRect(0, 0, width, height);
      if (showSkeletonRef.current) {
        pCtx.drawImage(canvasRef.current, 0, 0, width, height);
      }
    }

    // Dynamic HUD Badge for Picture-in-Picture window (unmirrored for crisp readability)
    const score = evaluated.score ?? 95;
    const status = evaluated.status || (score >= 82 ? "Optimal" : score >= 60 ? "Mild Slouch" : "Slouching");
    const color = evaluated.statusColor || (score >= 82 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444");
    const metrics = evaluated.metrics || {};

    pCtx.save();
    // Glassmorphism HUD Pill
    pCtx.fillStyle = "rgba(15, 23, 42, 0.94)";
    pCtx.beginPath();
    pCtx.roundRect(12, 12, 276, 72, 10);
    pCtx.fill();
    pCtx.lineWidth = 2;
    pCtx.strokeStyle = color;
    pCtx.stroke();

    // Status Indicator Dot
    pCtx.fillStyle = color;
    pCtx.beginPath();
    pCtx.arc(26, 28, 5.5, 0, Math.PI * 2);
    pCtx.fill();

    // Score & Status text
    pCtx.font = "bold 15px Inter, system-ui, sans-serif";
    pCtx.fillStyle = color;
    pCtx.fillText(`${score}% ${status.toUpperCase()}`, 38, 32);

    // Live Regional Percentages (Neck, Eyes, Hands)
    pCtx.font = "bold 10px Inter, system-ui, sans-serif";
    pCtx.fillStyle = "#94a3b8";
    pCtx.fillText(`🧬 Neck: `, 20, 50);
    pCtx.fillStyle = "#38bdf8";
    pCtx.fillText(`${metrics.neckScorePercent ?? 95}%   `, 65, 50);

    pCtx.fillStyle = "#94a3b8";
    pCtx.fillText(`👀 Eyes: `, 105, 50);
    pCtx.fillStyle = "#38bdf8";
    pCtx.fillText(`${metrics.eyeScorePercent ?? 98}%   `, 150, 50);

    pCtx.fillStyle = "#94a3b8";
    pCtx.fillText(`✋ Hands: `, 190, 50);
    pCtx.fillStyle = "#38bdf8";
    pCtx.fillText(`${metrics.armScorePercent ?? 92}%`, 240, 50);

    // Audio Pop status & alignment advice
    pCtx.font = "10px Inter, system-ui, sans-serif";
    pCtx.fillStyle = score < 75 ? "#fca5a5" : "#cbd5e1";
    pCtx.fillText(score < 75 ? "⚠️ Sit Up! Pop Alert Active" : "✓ Aligned • Multi-Tab Pop Sound Armed", 20, 68);

    // Red warning border around the whole viewport when posture score is low
    if (score < 75) {
      pCtx.lineWidth = 4;
      pCtx.strokeStyle = "rgba(239, 68, 68, 0.85)";
      pCtx.strokeRect(2, 2, width - 4, height - 4);
    }
    pCtx.restore();
  };

  // Continuous PiP rendering loop while PiP is active
  useEffect(() => {
    let animId = null;
    let intervalId = null;

    if (isPiPActive) {
      const renderPip = () => {
        if (isPiPActiveRef.current) {
          updatePip(lastAnalysisRef.current || { score: 95, status: 'Optimal', statusColor: '#10b981' });
          animId = requestAnimationFrame(renderPip);
        }
      };
      animId = requestAnimationFrame(renderPip);

      // Fallback interval when browser tab is hidden / rAF is throttled
      intervalId = setInterval(() => {
        if (document.hidden && isPiPActiveRef.current) {
          updatePip(lastAnalysisRef.current || { score: 95, status: 'Optimal', statusColor: '#10b981' });
        }
      }, 300);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPiPActive]);

  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else {
        if (!pipCanvasRef.current || !pipVideoRef.current) return;
        const currentAnalysis = lastAnalysisRef.current || { score: 95, status: 'Optimal', statusColor: '#10b981' };
        updatePip(currentAnalysis);

        if (!pipVideoRef.current.srcObject) {
          const stream = pipCanvasRef.current.captureStream(30);
          pipVideoRef.current.srcObject = stream;
        }

        await pipVideoRef.current.play();
        await pipVideoRef.current.requestPictureInPicture();
        setIsPiPActive(true);

        pipVideoRef.current.addEventListener('leavepictureinpicture', () => {
          setIsPiPActive(false);
        }, { once: true });
      }
    } catch (e) {
      console.warn("PiP error:", e);
    }
  };

  const handleTestPop = async () => {
    soundManager.playPopSound();
    setTestedPop(true);
    setTimeout(() => setTestedPop(false), 2000);
    const granted = await soundManager.requestNotificationPermission();
    if (granted) {
      soundManager.sendDesktopNotification(
        "🔔 SitSmart Pop Notification Test",
        "Pop alert confirmed! While you work on other websites or apps, SitSmart will send this alert if you slouch."
      );
    }
  };

  const loadPoseScriptIfNeeded = () => {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if (window.Pose) return Promise.resolve(true);

    return new Promise((resolve) => {
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
  };

  const ensurePoseInitialized = async () => {
    if (poseRef.current) return poseRef.current;
    if (typeof window === 'undefined') return null;

    if (!window.Pose) {
      await loadPoseScriptIfNeeded();
    }

    if (window.Pose && !poseRef.current) {
      try {
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        // modelComplexity: 0 (BlazePose Lite) downloads in seconds, provides all 33 landmarks and runs 60 FPS
        pose.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(handlePoseResults);
        poseRef.current = pose;
        return pose;
      } catch (err) {
        console.warn("MediaPipe Pose load note:", err);
      }
    }
    return poseRef.current;
  };

  // Initialize MediaPipe Pose on mount or poll until ready
  useEffect(() => {
    ensurePoseInitialized();
    const interval = setInterval(() => {
      if (!poseRef.current && typeof window !== 'undefined' && window.Pose) {
        ensurePoseInitialized();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle incoming MediaPipe Pose landmarks
  const handlePoseResults = (results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    // Immediately dismiss camera startup loading overlay once first pose arrives
    setIsCameraStarting(false);
    setHasFirstPose(true);

    lastLandmarksRef.current = results.poseLandmarks;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Run biomechanical evaluation using live calibration baseline
    const evaluated = analyzePosture(results.poseLandmarks, calibrationOffsetRef.current);
    if (evaluated) {
      lastAnalysisRef.current = evaluated;
      if (onAnalysisChangeRef.current) onAnalysisChangeRef.current(evaluated);

      // Draw skeleton on canvas
      if (showSkeletonRef.current) {
        drawErgonomicSkeleton(ctx, results.poseLandmarks, evaluated, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Live update Picture-in-Picture window with camera + skeleton lines
      if (isPiPActiveRef.current) {
        updatePip(evaluated);
      }
    }
  };

  // Start Real Webcam Stream with direct frame pumping & resilient fallbacks
  const startCamera = async () => {
    setCameraError(null);
    setIsSimulatedMode(false);
    setIsCameraStarting(true);
    setHasFirstPose(false);
    setStartingStatus("Requesting webcam access...");

    try {
      // Ensure Pose starts warming up in parallel
      ensurePoseInitialized();

      // Resilient camera constraints: try standard 640x480 first, fallback to basic video
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
      } catch (e1) {
        console.warn("Preferred constraints failed, attempting fallback to basic video stream:", e1);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        setStartingStatus("Starting camera feed...");

        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Video play exception:", playErr);
        }

        // Make camera live immediately without waiting for AI models
        isCameraActiveRef.current = true;
        setIsCameraActive(true);
        setIsCameraStarting(false);
        if (onTrackingChangeRef.current) onTrackingChangeRef.current(true);

        // High-performance frame loop using requestVideoFrameCallback or requestAnimationFrame
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
                // frame busy
              } finally {
                isProcessing = false;
              }
            } else {
              ensurePoseInitialized();
            }
          }

          if (isCameraActiveRef.current) {
            if (video && 'requestVideoFrameCallback' in video) {
              video.requestVideoFrameCallback(processFrame);
            } else {
              animationFrameRef.current = requestAnimationFrame(processFrame);
            }
          }
        };

        processFrame();
      }
    } catch (err) {
      console.error("Webcam access error:", err);
      setIsCameraStarting(false);
      setIsCameraActive(false);
      isCameraActiveRef.current = false;
      if (onTrackingChangeRef.current) onTrackingChangeRef.current(false);

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was blocked. Click the lock/camera icon (🔒) on the left of your browser address bar to change Camera to 'Allow', then refresh.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No webcam was detected on this device. Click 'Launch Live Demo' below to test with instant simulated posture!");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Your webcam is currently locked or in use by another application (Zoom, Teams, Skype, etc.). Please close other camera apps and click Retry.");
      } else if (err.name === "OverconstrainedError") {
        setCameraError("Your camera doesn't support the requested resolution. Try Launch Live Demo below.");
      } else {
        setCameraError(`Camera error (${err.name || 'Unavailable'}). Click 'Launch Live Demo' below to experience all posture detection features!`);
      }
    }
  };

  // Stop Webcam Stream cleanly
  const stopCamera = () => {
    isCameraActiveRef.current = false;
    setIsCameraStarting(false);
    setHasFirstPose(false);
    setIsCameraActive(false);
    if (onTrackingChangeRef.current) onTrackingChangeRef.current(false);

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Switch to Simulated Demo Mode
  const startSimulatedMode = () => {
    stopCamera();
    setIsSimulatedMode(true);
    setCameraError(null);
    setIsAutoCycle(true);
    if (onTrackingChangeRef.current) onTrackingChangeRef.current(true);
  };

  // Auto-Cycle Posture Animation in Demo Mode
  useEffect(() => {
    if (!isSimulatedMode || !isAutoCycle) return;

    // Sequence of realistic posture stages:
    // 0: Upright (95%), 35: Mild drift (78%), 80: Slouch (52%), 0: Aligned
    const sequence = [0, 35, 80, 0];
    let seqIdx = 0;

    const interval = setInterval(() => {
      seqIdx = (seqIdx + 1) % sequence.length;
      setSimSlouchAmount(sequence[seqIdx]);
    }, 5500);

    return () => clearInterval(interval);
  }, [isSimulatedMode, isAutoCycle]);

  // Render Simulated Posture Keypoints
  useEffect(() => {
    if (!isSimulatedMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Slouch interpolation factor (0.0 = perfect upright, 1.0 = heavy forward hunch)
    const factor = simSlouchAmount / 100;

    // Upright base landmarks normalized (0.0 - 1.0)
    const nose = { x: 0.50 + factor * 0.08, y: 0.28 + factor * 0.12, visibility: 0.99 };
    // Eyes with realistic horizontal line and gaze drift during slouch
    const leftEye = { x: 0.47 + factor * 0.07, y: 0.255 + factor * 0.11, visibility: 0.99 };
    const rightEye = { x: 0.53 + factor * 0.07, y: 0.255 + factor * 0.115, visibility: 0.99 };
    const leftEar = { x: 0.45 + factor * 0.07, y: 0.26 + factor * 0.10, visibility: 0.99 };
    const rightEar = { x: 0.55 + factor * 0.07, y: 0.26 + factor * 0.10, visibility: 0.99 };

    const leftShoulder = { x: 0.39, y: 0.46 + factor * 0.04, visibility: 0.99 };
    const rightShoulder = { x: 0.61, y: 0.46 + factor * 0.06, visibility: 0.99 }; // slight asymmetry

    // Arms, Elbows, Wrists, Hands (typing posture at desk)
    const leftElbow = { x: 0.34 + factor * 0.02, y: 0.62 + factor * 0.05, z: -0.05, visibility: 0.99 };
    const rightElbow = { x: 0.66 + factor * 0.02, y: 0.62 + factor * 0.06, z: -0.05, visibility: 0.99 };
    const leftWrist = { x: 0.41 + factor * 0.03, y: 0.76 + factor * 0.04, z: -0.22 - factor * 0.05, visibility: 0.99 };
    const rightWrist = { x: 0.59 + factor * 0.03, y: 0.76 + factor * 0.05, z: -0.22 - factor * 0.05, visibility: 0.99 };
    const leftIndex = { x: 0.43 + factor * 0.03, y: 0.79 + factor * 0.03, z: -0.26 - factor * 0.05, visibility: 0.99 };
    const rightIndex = { x: 0.57 + factor * 0.03, y: 0.79 + factor * 0.04, z: -0.26 - factor * 0.05, visibility: 0.99 };

    const leftHip = { x: 0.43, y: 0.85, visibility: 0.99 };
    const rightHip = { x: 0.57, y: 0.85, visibility: 0.99 };

    const simulatedLandmarks = [];
    simulatedLandmarks[0] = nose;
    simulatedLandmarks[2] = leftEye;
    simulatedLandmarks[5] = rightEye;
    simulatedLandmarks[7] = leftEar;
    simulatedLandmarks[8] = rightEar;
    simulatedLandmarks[11] = leftShoulder;
    simulatedLandmarks[12] = rightShoulder;
    simulatedLandmarks[13] = leftElbow;
    simulatedLandmarks[14] = rightElbow;
    simulatedLandmarks[15] = leftWrist;
    simulatedLandmarks[16] = rightWrist;
    simulatedLandmarks[19] = leftIndex;
    simulatedLandmarks[20] = rightIndex;
    simulatedLandmarks[23] = leftHip;
    simulatedLandmarks[24] = rightHip;

    lastLandmarksRef.current = simulatedLandmarks;
    const evaluated = analyzePosture(simulatedLandmarks, calibrationOffsetRef.current);

    if (evaluated) {
      lastAnalysisRef.current = evaluated;
      if (onAnalysisChangeRef.current) onAnalysisChangeRef.current(evaluated);
      if (showSkeletonRef.current) {
        drawErgonomicSkeleton(ctx, simulatedLandmarks, evaluated, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      if (isPiPActiveRef.current) {
        updatePip(evaluated);
      }
    }
  }, [isSimulatedMode, simSlouchAmount, showSkeleton, calibrationOffset]);

  // Calibration action: record current angles as zero baseline
  const calibrateBaseline = () => {
    if (lastLandmarksRef.current) {
      const raw = analyzePosture(lastLandmarksRef.current, { neck: 0, torso: 0 });
      if (raw && raw.metrics) {
        const newOffset = {
          neck: Math.max(0, raw.metrics.neckAngle - 5),
          torso: Math.max(0, raw.metrics.torsoAngle - 3)
        };
        if (setCalibrationOffset) {
          setCalibrationOffset(newOffset);
        }
        setCalibrationNotice(true);
        if (onCalibrationSuccess) onCalibrationSuccess();
        setTimeout(() => setCalibrationNotice(false), 3000);
      }
    }
  };

  // Reset Calibration
  const resetCalibration = () => {
    if (setCalibrationOffset) {
      setCalibrationOffset({ neck: 0, torso: 0 });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Video / Canvas Viewport */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
        
        {/* Subtle Ergonomic Alignment Guide Grid (Prevents empty black screen) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border border-dashed border-brand-400/40 mb-2 flex items-center justify-center">
              <span className="text-[10px] text-brand-300/80 font-mono tracking-wider">HEAD ZONE</span>
            </div>
            <div className="w-64 h-20 border-t-2 border-dashed border-brand-400/30 rounded-t-full flex items-center justify-center">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">SHOULDER ALIGNMENT</span>
            </div>
          </div>
        </div>

        {/* Real Webcam Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isMirrored ? 'scale-x-[-1]' : ''
          } ${isCameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Real-Time Pose Skeletal Overlay Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-10 transition-transform duration-300 ${
            isMirrored && isCameraActive ? 'scale-x-[-1]' : ''
          }`}
        />

        {/* Workstation Silhouette in Demo Mode (Visually rich ergonomic setup backdrop) */}
        {isSimulatedMode && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-brand-500/10 blur-3xl absolute" />
            <svg className="w-80 h-80 opacity-20 text-slate-400" viewBox="0 0 200 200" fill="currentColor">
              {/* Ergonomic chair back */}
              <rect x="80" y="75" width="8" height="70" rx="4" opacity="0.6" />
              {/* Chair seat */}
              <rect x="68" y="145" width="64" height="8" rx="3" opacity="0.7" />
              {/* Chair base */}
              <rect x="97" y="153" width="6" height="28" opacity="0.5" />
              <line x1="75" y1="181" x2="125" y2="181" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
              {/* Desk outline */}
              <rect x="135" y="115" width="60" height="6" rx="2" opacity="0.4" />
              {/* Monitor */}
              <rect x="155" y="80" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
              <rect x="169" y="106" width="4" height="9" opacity="0.5" />
            </svg>
          </div>
        )}

        {/* Camera Starting Overlay (Non-blocking, sleek floating status) */}
        {isCameraStarting && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-brand-400 border-r-brand-400 border-b-transparent border-l-transparent animate-spin" />
              <Camera className="w-7 h-7 text-brand-400 animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Starting AI Vision Engine</h4>
            <p className="text-xs text-brand-300 font-medium mb-1 font-mono">{startingStatus}</p>
            <p className="text-[11px] text-slate-400 max-w-xs mb-5">
              Warming up on-device neural pose model. 100% private — video never leaves your browser.
            </p>
            <button
              onClick={startSimulatedMode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-400" />
              <span>Camera taking time? Switch to Instant Demo Mode</span>
            </button>
          </div>
        )}

        {/* Inactive Standby Screen */}
        {!isCameraActive && !isSimulatedMode && !isCameraStarting && !cameraError && (
          <div className="flex flex-col items-center justify-center p-8 text-center z-20 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 text-brand-400 shadow-lg shadow-brand-500/10">
              <Camera className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Webcam Posture Tracking</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              100% private on-device computer vision. Video frames are processed in-browser via WebAssembly and never sent to any server.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={startCamera}
                disabled={isCameraStarting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" /> Start Webcam
              </button>
              <button
                onClick={startSimulatedMode}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-brand-400" /> Instant Demo
              </button>
            </div>
          </div>
        )}

        {/* Camera Error / Unavailable Resolution Card */}
        {cameraError && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-sm w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Webcam Access Notice</h4>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                {cameraError}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  onClick={startSimulatedMode}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" /> Launch Live Demo
                </button>
                <button
                  onClick={startCamera}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Demo Mode Indicator Overlay */}
        {isSimulatedMode && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Interactive Demo Mode (Simulated AI Pose)
          </div>
        )}

        {/* PiP Floating Window Active Indicator */}
        {isPiPActive && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 border border-brand-500/50 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <PictureInPicture className="w-3.5 h-3.5 animate-pulse" /> Floating PiP Active (Camera + Lines)
          </div>
        )}

        {/* Camera Active Live Badge */}
        {isCameraActive && !isCameraStarting && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live AI Skeletal Tracking (60 FPS)
          </div>
        )}

        {/* Calibration Saved Notification */}
        {calibrationNotice && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl shadow-emerald-950/50 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> Baseline Posture Calibrated!
          </div>
        )}

        {/* Camera Error Message */}
        {cameraError && (
          <div className="absolute inset-x-4 top-4 z-30 p-3 rounded-xl bg-rose-500/90 text-white text-xs backdrop-blur-md flex items-center gap-2 shadow-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{cameraError}</span>
            <button
              onClick={startSimulatedMode}
              className="px-2 py-1 bg-white text-rose-700 font-semibold rounded text-[11px] hover:bg-rose-50 cursor-pointer"
            >
              Try Demo
            </button>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
              >
                <CameraOff className="w-3.5 h-3.5" /> Stop Camera
              </button>
            ) : isSimulatedMode ? (
              <button
                onClick={() => setIsSimulatedMode(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Exit Demo
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all"
              >
                <Camera className="w-3.5 h-3.5" /> Start Camera
              </button>
            )}

            {!isCameraActive && !isSimulatedMode && (
              <button
                onClick={startSimulatedMode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-brand-400" /> Demo Mode
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePictureInPicture}
              disabled={!isCameraActive && !isSimulatedMode}
              title="Pop out floating camera window with skeletal lines on top of other tabs/apps"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isPiPActive
                  ? 'bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/30 ring-2 ring-brand-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-brand-300 border-slate-700 disabled:opacity-40'
              }`}
            >
              <PictureInPicture className="w-3.5 h-3.5" />
              <span>{isPiPActive ? "Exit Floating PiP" : "Floating PiP"}</span>
            </button>

            <button
              onClick={handleTestPop}
              title="Test pop alert sound and desktop notification"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <BellRing className={`w-3.5 h-3.5 ${testedPop ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{testedPop ? "Pop Sent!" : "Test Pop"}</span>
            </button>

            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              title={showSkeleton ? "Hide Skeleton" : "Show Skeleton"}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                showSkeleton
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                  : 'bg-slate-850 text-slate-400 border-slate-750 hover:text-slate-200'
              }`}
            >
              {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsMirrored(!isMirrored)}
              title="Toggle Camera Mirroring"
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                isMirrored
                  ? 'bg-slate-800 text-brand-400 border-slate-700'
                  : 'bg-slate-850 text-slate-400 border-slate-750'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={calibrateBaseline}
              disabled={!isCameraActive && !isSimulatedMode}
              title="Calibrate Current Seated Posture as Ideal Baseline"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Calibrate
            </button>
          </div>
        </div>

        {/* Picture-in-Picture Pipeline Elements (Offscreen rendered) */}
        <canvas
          ref={pipCanvasRef}
          width={480}
          height={360}
          style={{ position: 'fixed', top: -9999, left: -9999, width: 480, height: 360, opacity: 0, pointerEvents: 'none' }}
        />
        <video
          ref={pipVideoRef}
          width={480}
          height={360}
          muted
          playsInline
          style={{ position: 'fixed', top: -9999, left: -9999, width: 480, height: 360, opacity: 0, pointerEvents: 'none' }}
        />

        {/* Interactive Demo Posture Slouch Controls */}
        {isSimulatedMode && (
          <div className="pt-2 border-t border-slate-800/60 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-medium text-xs text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-brand-400" /> Interactive Posture Tester:
                </span>
                <button
                  onClick={() => setIsAutoCycle(!isAutoCycle)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAutoCycle
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle automated realistic posture cycling"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoCycle ? 'bg-brand-400 animate-ping' : 'bg-slate-500'}`} />
                  Auto-Animate: {isAutoCycle ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={() => {
                    setIsAutoCycle(false);
                    setSimSlouchAmount(0);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold border transition-all cursor-pointer ${
                    simSlouchAmount <= 15
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  ✓ Upright
                </button>
                <button
                  onClick={() => {
                    setIsAutoCycle(false);
                    setSimSlouchAmount(40);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold border transition-all cursor-pointer ${
                    simSlouchAmount > 15 && simSlouchAmount <= 60
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  ⚠️ Mild Drift
                </button>
                <button
                  onClick={() => {
                    setIsAutoCycle(false);
                    setSimSlouchAmount(85);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold border transition-all cursor-pointer ${
                    simSlouchAmount > 60
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  🚨 Slouching
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={simSlouchAmount}
              onChange={(e) => {
                setIsAutoCycle(false);
                setSimSlouchAmount(Number(e.target.value));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              title="Drag slider to test live angle, score, and alert changes"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-emerald-400/80">0% (Spine Aligned)</span>
              <span className="text-amber-400/80">50% (Forward Neck)</span>
              <span className="text-rose-400/80">100% (Slouch Alarm)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
