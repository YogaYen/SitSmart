import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  PictureInPicture,
  Minimize2,
  BellRing,
  VolumeCheck,
  ExternalLink
} from 'lucide-react';
import { analyzePosture, drawErgonomicSkeleton } from '../utils/biomechanics';
import { soundManager } from '../utils/audioAlerts';
import PostureGauge from './PostureGauge';

export default function LiveTracker({ isMuted, onTriggerBreak, onUpdateScore }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);

  // Background & PiP States
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [backgroundAlertsEnabled, setBackgroundAlertsEnabled] = useState(true);
  const [testedPop, setTestedPop] = useState(false);

  // Analysis State
  const [analysis, setAnalysis] = useState({
    score: 95,
    status: "Optimal",
    statusColor: "#10b981",
    feedback: "Camera ready. Start camera or toggle Demo Mode to begin.",
    metrics: { neckAngle: 8, torsoAngle: 5, shoulderTiltDeg: 1, isSlouching: false, isOptimal: true }
  });

  const [slouchSeconds, setSlouchSeconds] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [calibrationOffset, setCalibrationOffset] = useState({ neck: 0, torso: 0 });
  const [calibrationNotice, setCalibrationNotice] = useState(false);

  // Interactive Demo Sliders
  const [simSlouchAmount, setSimSlouchAmount] = useState(0); // 0 = perfect, 100 = full slouch

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pipCanvasRef = useRef(null);
  const pipVideoRef = useRef(null);
  const poseRef = useRef(null);
  const cameraUtilRef = useRef(null);
  const slouchTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const backgroundIntervalRef = useRef(null);

  // Sync mute state
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Session duration timer
  useEffect(() => {
    let interval = null;
    if (isCameraActive || isSimulatedMode) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCameraActive, isSimulatedMode]);

  // Document visibility change listener (User switched tabs or minimized)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabHidden(hidden);
      if (hidden && backgroundAlertsEnabled) {
        soundManager.requestNotificationPermission();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [backgroundAlertsEnabled]);

  // Slouch streak counter & background alert trigger
  useEffect(() => {
    if (analysis.metrics.isSlouching && (isCameraActive || isSimulatedMode)) {
      slouchTimerRef.current = setInterval(() => {
        setSlouchSeconds(prev => {
          const next = prev + 1;
          
          // Alert trigger: At 4s in background or 5s foreground
          if (next === 4 && isTabHidden && backgroundAlertsEnabled) {
            soundManager.playPopSound();
            soundManager.sendDesktopNotification(
              "⚠️ SitSmart Posture Alert",
              "You are slouching while working on another web page! Straighten your spine and pull your shoulders back."
            );
          } else if (next === 5) {
            soundManager.playSlouchWarning();
          }
          return next;
        });
      }, 1000);
    } else {
      if (slouchTimerRef.current) {
        clearInterval(slouchTimerRef.current);
      }
      setSlouchSeconds(0);
    }
    return () => {
      if (slouchTimerRef.current) clearInterval(slouchTimerRef.current);
    };
  }, [analysis.metrics.isSlouching, isCameraActive, isSimulatedMode, isTabHidden, backgroundAlertsEnabled]);

  // Background frame evaluator when tab is hidden (browser may throttle requestAnimationFrame)
  useEffect(() => {
    if (isTabHidden && isCameraActive && poseRef.current && videoRef.current) {
      backgroundIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState >= 2 && poseRef.current) {
          try {
            await poseRef.current.send({ image: videoRef.current });
          } catch (e) {}
        }
      }, 1500);
    } else {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    }
    return () => {
      if (backgroundIntervalRef.current) clearInterval(backgroundIntervalRef.current);
    };
  }, [isTabHidden, isCameraActive]);

  // Initialize MediaPipe Pose Instance
  useEffect(() => {
    if (window.Pose) {
      try {
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(handlePoseResults);
        poseRef.current = pose;
      } catch (err) {
        console.warn("MediaPipe Pose initialization note:", err);
      }
    }
  }, []);

  // Update PiP Canvas with video feed + HUD overlay
  const updatePipCanvas = (evaluated) => {
    if (!pipCanvasRef.current) return;
    const pCanvas = pipCanvasRef.current;
    const pCtx = pCanvas.getContext('2d');
    const width = pCanvas.width;
    const height = pCanvas.height;

    pCtx.clearRect(0, 0, width, height);

    // Draw camera or simulated canvas
    if (videoRef.current && isCameraActive && videoRef.current.readyState >= 2) {
      pCtx.save();
      if (isMirrored) {
        pCtx.translate(width, 0);
        pCtx.scale(-1, 1);
      }
      pCtx.drawImage(videoRef.current, 0, 0, width, height);
      pCtx.restore();
    } else if (canvasRef.current) {
      pCtx.drawImage(canvasRef.current, 0, 0, width, height);
    }

    // Draw floating score badge overlay on top of the PiP feed
    pCtx.save();
    pCtx.fillStyle = "rgba(15, 23, 42, 0.88)";
    pCtx.roundRect(14, 14, 220, 52, 10);
    pCtx.fill();
    pCtx.lineWidth = 2;
    pCtx.strokeStyle = evaluated.statusColor;
    pCtx.stroke();

    pCtx.font = "bold 18px Inter, sans-serif";
    pCtx.fillStyle = evaluated.statusColor;
    pCtx.fillText(`${evaluated.score}% ${evaluated.status.toUpperCase()}`, 26, 40);

    pCtx.font = "11px Inter, sans-serif";
    pCtx.fillStyle = "#cbd5e1";
    pCtx.fillText(`Neck: ${evaluated.metrics.neckAngle}° | SitSmart PiP`, 26, 56);
    pCtx.restore();
  };

  // Handle incoming MediaPipe Pose landmarks
  const handlePoseResults = (results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Run biomechanical analysis
    const evaluated = analyzePosture(results.poseLandmarks, calibrationOffset);
    if (evaluated) {
      setAnalysis(evaluated);
      if (onUpdateScore) onUpdateScore(evaluated.score);

      // Draw skeleton on main canvas
      if (showSkeleton) {
        drawErgonomicSkeleton(ctx, results.poseLandmarks, evaluated, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Update PiP stream if active
      if (isPiPActive) {
        updatePipCanvas(evaluated);
      }
    }
  };

  // Start Real Webcam Stream
  const startCamera = async () => {
    setCameraError(null);
    setIsSimulatedMode(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
          
          if (window.Camera && poseRef.current) {
            const camera = new window.Camera(videoRef.current, {
              onFrame: async () => {
                if (videoRef.current && poseRef.current) {
                  await poseRef.current.send({ image: videoRef.current });
                }
              },
              width: 640,
              height: 480
            });
            camera.start();
            cameraUtilRef.current = camera;
          } else {
            const processFrame = async () => {
              if (videoRef.current && poseRef.current && videoRef.current.readyState >= 2) {
                await poseRef.current.send({ image: videoRef.current });
              }
              if (isCameraActive) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
              }
            };
            processFrame();
          }
        };
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError("Camera unavailable or permission denied. Switch to Interactive Demo Mode to test posture detection!");
      setIsCameraActive(false);
    }
  };

  // Stop Webcam Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (cameraUtilRef.current) {
      cameraUtilRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsCameraActive(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Picture-in-Picture (PiP) Toggle
  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else {
        if (!pipCanvasRef.current || !pipVideoRef.current) return;
        
        // Render initial frame to PiP canvas
        updatePipCanvas(analysis);

        // Capture stream from canvas
        const stream = pipCanvasRef.current.captureStream(30);
        pipVideoRef.current.srcObject = stream;
        await pipVideoRef.current.play();

        await pipVideoRef.current.requestPictureInPicture();
        setIsPiPActive(true);

        pipVideoRef.current.addEventListener('leavepictureinpicture', () => {
          setIsPiPActive(false);
        }, { once: true });
      }
    } catch (err) {
      console.error("Picture-in-Picture error:", err);
      alert("Picture-in-Picture is not supported or was blocked in this browser window.");
    }
  };

  // Test Pop Sound & Desktop Notification
  const handleTestPopAndNotification = async () => {
    soundManager.playPopSound();
    setTestedPop(true);
    setTimeout(() => setTestedPop(false), 2500);

    const granted = await soundManager.requestNotificationPermission();
    if (granted) {
      soundManager.sendDesktopNotification(
        "🔔 SitSmart Pop Notification Test",
        "Pop alert confirmed! While you work on other websites, SitSmart will send this chime and alert if you slouch."
      );
    }
  };

  // Run Simulated Interactive Posture Demo
  useEffect(() => {
    if (!isSimulatedMode) return;

    const renderSimulatedFrame = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      const factor = simSlouchAmount / 100;
      const headY = 0.22 + factor * 0.12;
      const headX = 0.50 + factor * 0.08;
      const shoulderY = 0.40 + factor * 0.06;
      const shoulderTilt = factor * 0.05;

      const syntheticLandmarks = [
        { x: headX, y: headY, visibility: 0.99 },
        { x: headX - 0.03, y: headY, visibility: 0.99 },
        { x: headX - 0.04, y: headY, visibility: 0.99 },
        { x: headX - 0.05, y: headY, visibility: 0.99 },
        { x: headX + 0.03, y: headY, visibility: 0.99 },
        { x: headX + 0.04, y: headY, visibility: 0.99 },
        { x: headX + 0.05, y: headY, visibility: 0.99 },
        { x: headX - 0.06, y: headY + 0.02, visibility: 0.99 },
        { x: headX + 0.06, y: headY + 0.02, visibility: 0.99 },
        { x: headX - 0.02, y: headY + 0.05, visibility: 0.99 },
        { x: headX + 0.02, y: headY + 0.05, visibility: 0.99 },
        { x: 0.38, y: shoulderY + shoulderTilt, visibility: 0.99 },
        { x: 0.62, y: shoulderY - shoulderTilt, visibility: 0.99 },
        { x: 0.32, y: shoulderY + 0.18, visibility: 0.95 },
        { x: 0.68, y: shoulderY + 0.18, visibility: 0.95 },
        { x: 0.35, y: shoulderY + 0.32, visibility: 0.90 },
        { x: 0.65, y: shoulderY + 0.32, visibility: 0.90 },
        ...Array(6).fill({ x: 0.5, y: 0.5, visibility: 0 }),
        { x: 0.42, y: 0.76, visibility: 0.95 },
        { x: 0.58, y: 0.76, visibility: 0.95 },
      ];

      const evaluated = analyzePosture(syntheticLandmarks, calibrationOffset);
      if (evaluated) {
        setAnalysis(evaluated);
        if (onUpdateScore) onUpdateScore(evaluated.score);

        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(51, 65, 85, 0.25)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(30, 41, 59, 0.6)";
        ctx.beginPath();
        ctx.arc(headX * width, headY * height, 32, 0, Math.PI * 2);
        ctx.fill();

        if (showSkeleton) {
          drawErgonomicSkeleton(ctx, syntheticLandmarks, evaluated, width, height);
        }

        if (isPiPActive) {
          updatePipCanvas(evaluated);
        }
      }
    };

    renderSimulatedFrame();
  }, [isSimulatedMode, simSlouchAmount, showSkeleton, calibrationOffset, isPiPActive]);

  // Calibrate current upright posture
  const calibrateNeutral = () => {
    if (analysis && analysis.metrics) {
      setCalibrationOffset({
        neck: Math.max(0, analysis.metrics.neckAngle - 5),
        torso: Math.max(0, analysis.metrics.torsoAngle - 3)
      });
      setCalibrationNotice(true);
      soundManager.playSuccessChime();
      setTimeout(() => setCalibrationNotice(false), 3000);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="live-tracker" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hidden Elements for Picture-in-Picture */}
        <canvas ref={pipCanvasRef} width={480} height={360} className="hidden" />
        <video ref={pipVideoRef} width={480} height={360} className="hidden" muted playsInline />

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Live AI Posture Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Real-Time Vision &amp; Ergonomic Feed
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track posture locally in your browser. Use <strong>Floating PiP</strong> or <strong>Background Mode</strong> to stay alerted with pop sounds &amp; notifications while working on other pages!
            </p>
          </div>

          {/* Session Timer & Status */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <div className="glass-panel px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-slate-400">Session:</span>
              <span className="font-mono font-bold text-white">{formatTime(sessionDuration)}</span>
            </div>

            {/* Test Pop Sound & Desktop Notification */}
            <button
              onClick={handleTestPopAndNotification}
              title="Test the pop alert sound and desktop notification"
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BellRing className={`w-3.5 h-3.5 ${testedPop ? 'text-emerald-400' : 'text-brand-400'}`} />
              <span>{testedPop ? "Pop Played!" : "Test Pop Alert"}</span>
            </button>

            <button
              onClick={onTriggerBreak}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
            >
              Stretch Break
            </button>
          </div>
        </div>

        {/* Background Minimized Feature Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/90 border border-brand-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <PictureInPicture className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Work in Another Tab or Software? (PiP &amp; Background Pop Alerts)
              </span>
              <span className="text-slate-400">
                Pop out a floating window over Word / VS Code, or let SitSmart send a <strong>Pop Sound &amp; Notification</strong> when slouching on other pages.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* PiP Floating Window Button */}
            <button
              onClick={togglePictureInPicture}
              disabled={!isCameraActive && !isSimulatedMode}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isPiPActive
                  ? 'bg-brand-500 text-white border-brand-400 shadow-lg shadow-brand-500/30'
                  : 'bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border-brand-500/40 disabled:opacity-40'
              }`}
            >
              <PictureInPicture className="w-4 h-4" />
              <span>{isPiPActive ? "Exit Floating PiP" : "Pop Out Floating PiP"}</span>
            </button>

            {/* Toggle Background Alerts */}
            <button
              onClick={() => setBackgroundAlertsEnabled(!backgroundAlertsEnabled)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                backgroundAlertsEnabled
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${backgroundAlertsEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span>{backgroundAlertsEnabled ? "Background Pop On" : "Background Muted"}</span>
            </button>
          </div>
        </div>

        {/* Camera Error Message */}
        {cameraError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{cameraError}</span>
            </div>
            <button
              onClick={() => {
                setCameraError(null);
                setIsSimulatedMode(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold shrink-0 hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Launch Demo Mode
            </button>
          </div>
        )}

        {/* Main Grid: Video/Canvas Feed on Left, Posture Score on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Feed Container (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 relative">
            
            {/* Top Container Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-ping' : (isSimulatedMode ? 'bg-brand-400' : 'bg-slate-500')}`} />
                <span className="font-bold text-white">
                  {isCameraActive ? "Live Webcam Feed" : (isSimulatedMode ? "Simulated Posture Feed" : "Camera Standby")}
                </span>
                {isTabHidden && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                    Tab Hidden (Background Active)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mirror Toggle */}
                <button
                  onClick={() => setIsMirrored(!isMirrored)}
                  title="Mirror Camera Video"
                  className={`p-1.5 rounded-lg border transition-colors ${isMirrored ? 'bg-slate-800 text-brand-400 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Skeleton Overlay Toggle */}
                <button
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  title="Toggle Skeletal Lines"
                  className={`p-1.5 rounded-lg border transition-colors ${showSkeleton ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                >
                  {showSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Calibrate Button */}
                <button
                  onClick={calibrateNeutral}
                  disabled={!isCameraActive && !isSimulatedMode}
                  title="Calibrate your current straight posture as baseline"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>Calibrate</span>
                </button>
              </div>
            </div>

            {/* Calibration Notice Banner */}
            {calibrationNotice && (
              <div className="absolute top-16 left-8 right-8 z-30 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs py-2 px-3 rounded-lg text-center font-semibold shadow-xl">
                Baseline posture calibrated! Measurements now reference your neutral upright posture.
              </div>
            )}

            {/* Video & Canvas Viewport */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
              
              {/* Actual Webcam Video */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${isCameraActive ? 'block' : 'hidden'}`}
                playsInline
                muted
              />

              {/* Skeletal Overlay Canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isMirrored && isCameraActive ? 'scale-x-[-1]' : ''}`}
              />

              {/* Inactive Standby Screen */}
              {!isCameraActive && !isSimulatedMode && (
                <div className="flex flex-col items-center justify-center text-center p-6 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                    <Camera className="w-8 h-8 text-brand-400" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Camera Is Not Active</h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Click "Start Live Camera" to enable webcam posture tracking, or choose "Interactive Demo" to test without webcam.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Live Camera
                    </button>
                    <button
                      onClick={() => {
                        stopCamera();
                        setIsSimulatedMode(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Interactive Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Feed Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isCameraActive ? (
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CameraOff className="w-4 h-4" /> Stop Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4" /> Launch Camera
                  </button>
                )}

                <button
                  onClick={() => {
                    if (isCameraActive) stopCamera();
                    setIsSimulatedMode(!isSimulatedMode);
                  }}
                  className={`px-3 py-2 rounded-xl border font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSimulatedMode
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  {isSimulatedMode ? 'Exit Demo' : 'Simulated Demo'}
                </button>
              </div>

              {/* Slouch Alert Pop-up Badge */}
              {slouchSeconds >= 4 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold animate-pulse">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Slouch Streak ({slouchSeconds}s) – Straighten Up!</span>
                </div>
              )}
            </div>

            {/* Interactive Sliders when in Simulated Demo Mode */}
            {isSimulatedMode && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-brand-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Interactive Slouch Simulator:
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {simSlouchAmount === 0 ? "Perfect Posture" : `${simSlouchAmount}% Slouch Intensity`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simSlouchAmount}
                  onChange={(e) => setSimSlouchAmount(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <button
                    onClick={() => setSimSlouchAmount(0)}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    1. Optimal Alignment (100%)
                  </button>
                  <button
                    onClick={() => setSimSlouchAmount(40)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    2. Mild Neck Tilt (75%)
                  </button>
                  <button
                    onClick={() => setSimSlouchAmount(85)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    3. Severe Slouch (&lt;50%)
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Gauge & Biomechanical Metrics Container (5 cols) */}
          <div className="lg:col-span-5">
            <PostureGauge
              score={analysis.score}
              status={analysis.status}
              statusColor={analysis.statusColor}
              metrics={analysis.metrics}
              slouchSeconds={slouchSeconds}
              feedback={analysis.feedback}
            />
          </div>

        </div>

      </div>
    </section>
  );
}
