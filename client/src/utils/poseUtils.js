/**
 * poseUtils.js - Biomechanical calculations & Posture Scoring for SitSmart
 * Coordinates MediaPipe Pose keypoints (ears, nose, shoulders, spine, hips)
 * to calculate cervical inclination, torso flexion, shoulder asymmetry,
 * and dynamic 0-100% posture health score.
 */

// Calculate angle between two 2D points relative to the vertical Y axis (in degrees)
export function calculateVerticalAngle(p1, p2) {
  if (!p1 || !p2) return 0;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  // dy in screen coords is positive downwards
  const radians = Math.atan2(Math.abs(dx), Math.abs(dy));
  return Math.round((radians * 180) / Math.PI);
}

// Calculate angle between 3 points: A -> B -> C (in degrees)
export function calculateJointAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return Math.round(angle);
}

// Calculate 3D joint angle with perspective depth compensation for laptop workstations
export function calculateLaptopArmAngle(shoulder, elbow, wrist) {
  if (!shoulder || !elbow || !wrist) return 95;

  // 1. Calculate 2D displacement vectors
  const dxUpper = elbow.x - shoulder.x;
  const dyUpper = elbow.y - shoulder.y;
  const lenUpper2D = Math.sqrt(dxUpper * dxUpper + dyUpper * dyUpper);

  const dxForearm = wrist.x - elbow.x;
  const dyForearm = wrist.y - elbow.y;
  const lenForearm2D = Math.sqrt(dxForearm * dxForearm + dyForearm * dyForearm);

  if (lenUpper2D < 0.01 || lenForearm2D < 0.01) return 95;

  // 2. Foreshortening estimation: Forearm points forward toward laptop keyboard (depth Z)
  // Anatomically, forearm length is ~0.92 - 1.0x length of upper arm.
  // When forearm extends forward toward laptop, 2D projected length is foreshortened.
  const expectedForearmLen = lenUpper2D * 0.95;
  const foreshortenedRatio = Math.min(1.0, lenForearm2D / Math.max(0.04, expectedForearmLen));
  // Depth component derived from foreshortening
  const depthZ = Math.sqrt(Math.max(0, 1.0 - foreshortenedRatio * foreshortenedRatio)) * expectedForearmLen;

  // Use MediaPipe z coordinate if available, or synthesized foreshortening depth
  const sZ = shoulder.z ?? 0;
  const eZ = elbow.z ?? (sZ + 0.05);
  // Wrists in front on keyboard have negative relative Z (closer to webcam)
  const wZ = (wrist.z !== undefined && Math.abs(wrist.z) > 0.01)
    ? wrist.z 
    : (eZ - depthZ);

  // Vector 1: elbow -> shoulder
  const v1 = { x: shoulder.x - elbow.x, y: shoulder.y - elbow.y, z: sZ - eZ };
  // Vector 2: elbow -> wrist
  const v2 = { x: wrist.x - elbow.x, y: wrist.y - elbow.y, z: wZ - eZ };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 === 0 || mag2 === 0) return 95;
  const cosA = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return Math.round((Math.acos(cosA) * 180) / Math.PI);
}

/**
 * Evaluates body landmarks from MediaPipe Pose:
 * Landmarks indices:
 * 0: Nose
 * 1-3: Left Eye (Inner, Eye, Outer), 4-6: Right Eye (Inner, Eye, Outer)
 * 7: Left Ear, 8: Right Ear
 * 11: Left Shoulder, 12: Right Shoulder
 * 13: Left Elbow, 14: Right Elbow
 * 15: Left Wrist, 16: Right Wrist
 * 17-22: Hands & Fingers (Pinky, Index, Thumb)
 * 23: Left Hip, 24: Right Hip
 */
export function analyzePosture(landmarks, calibrationOffset = { neck: 0, torso: 0 }) {
  if (!landmarks || landmarks.length < 13) {
    return null;
  }

  const nose = landmarks[0] || { x: 0.5, y: 0.28, visibility: 0.9 };
  const leftEye = landmarks[2] || landmarks[1] || landmarks[3] || { x: nose.x - 0.03, y: nose.y - 0.02, visibility: 0.9 };
  const rightEye = landmarks[5] || landmarks[4] || landmarks[6] || { x: nose.x + 0.03, y: nose.y - 0.02, visibility: 0.9 };
  const leftEar = landmarks[7] || { x: nose.x - 0.07, y: nose.y, visibility: 0.9 };
  const rightEar = landmarks[8] || { x: nose.x + 0.07, y: nose.y, visibility: 0.9 };
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  // Midpoint calculations
  const midEar = {
    x: (leftEar.x + rightEar.x) / 2,
    y: (leftEar.y + rightEar.y) / 2,
    z: (leftEar.z !== undefined && rightEar.z !== undefined) ? (leftEar.z + rightEar.z) / 2 : 0,
    visibility: Math.min(leftEar.visibility ?? 1, rightEar.visibility ?? 1)
  };

  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
    z: (leftShoulder.z !== undefined && rightShoulder.z !== undefined) ? (leftShoulder.z + rightShoulder.z) / 2 : 0,
    visibility: Math.min(leftShoulder.visibility ?? 1, rightShoulder.visibility ?? 1)
  };

  const midEye = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
    z: (leftEye.z !== undefined && rightEye.z !== undefined) ? (leftEye.z + rightEye.z) / 2 : 0,
    visibility: Math.min(leftEye.visibility ?? 1, rightEye.visibility ?? 1)
  };

  // If hips are visible, use mid-hip; otherwise extrapolate downward
  const hasHips = leftHip && rightHip && (leftHip.visibility > 0.3 || rightHip.visibility > 0.3);
  const midHip = hasHips
    ? { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
    : { x: midShoulder.x, y: midShoulder.y + 0.35 };

  // 1. NECK INCLINATION & ACCURATE NECK SCORE %
  const rawNeckAngle = calculateVerticalAngle(midEar, midShoulder);
  const neckAngle = Math.max(0, rawNeckAngle - (calibrationOffset?.neck || 0));

  let neckScorePercent = 100;
  if (neckAngle <= 12) {
    neckScorePercent = Math.round(100 - (neckAngle * 0.5));
  } else if (neckAngle <= 20) {
    neckScorePercent = Math.round(94 - ((neckAngle - 12) * 2.8));
  } else {
    neckScorePercent = Math.round(72 - ((neckAngle - 20) * 2.4));
  }
  neckScorePercent = Math.max(15, Math.min(100, neckScorePercent));

  // 2. EYE LEVEL ALIGNMENT & ACCURATE EYE SCORE %
  const eyeDx = rightEye.x - leftEye.x;
  const eyeDy = rightEye.y - leftEye.y;
  const rawEyeTilt = Math.abs((Math.atan2(eyeDy, eyeDx) * 180) / Math.PI);
  const eyeTiltDev = Math.round(Math.min(rawEyeTilt, Math.abs(180 - rawEyeTilt)));

  let eyeScorePercent = 100;
  if (eyeTiltDev <= 3) {
    eyeScorePercent = Math.round(100 - (eyeTiltDev * 0.7));
  } else if (eyeTiltDev <= 8) {
    eyeScorePercent = Math.round(98 - ((eyeTiltDev - 3) * 3.2));
  } else {
    eyeScorePercent = Math.round(82 - ((eyeTiltDev - 8) * 3.5));
  }
  eyeScorePercent = Math.max(20, Math.min(100, eyeScorePercent));

  // 3. HANDS & ARMS ERGONOMIC SCORING FOR LAPTOP & OFFICE WORKSTATIONS
  const hasLeftWrist = leftWrist && (leftWrist.visibility ?? 1) > 0.25;
  const hasRightWrist = rightWrist && (rightWrist.visibility ?? 1) > 0.25;
  const hasLeftElbow = leftElbow && (leftElbow.visibility ?? 1) > 0.25;
  const hasRightElbow = rightElbow && (rightElbow.visibility ?? 1) > 0.25;

  const hasLeftArm = leftShoulder && hasLeftElbow && hasLeftWrist;
  const hasRightArm = rightShoulder && hasRightElbow && hasRightWrist;

  let leftElbowAngle = 95;
  let rightElbowAngle = 95;

  if (hasLeftArm) {
    leftElbowAngle = calculateLaptopArmAngle(leftShoulder, leftElbow, leftWrist);
  }
  if (hasRightArm) {
    rightElbowAngle = calculateLaptopArmAngle(rightShoulder, rightElbow, rightWrist);
  }

  // Upper arm vertical inclination (humeral angle) - should hang naturally (10°-25° from vertical)
  let leftUpperArmSlope = 15;
  let rightUpperArmSlope = 15;
  if (leftShoulder && hasLeftElbow) {
    leftUpperArmSlope = calculateVerticalAngle(leftShoulder, leftElbow);
  }
  if (rightShoulder && hasRightElbow) {
    rightUpperArmSlope = calculateVerticalAngle(rightShoulder, rightElbow);
  }
  const avgUpperArmSlope = (leftUpperArmSlope + rightUpperArmSlope) / 2;

  // Shoulder-to-ear vertical distance ratio (detects shoulder shrugging from a high desk/laptop)
  const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x) || 0.25;
  const earToShoulderDist = Math.max(0, midShoulder.y - midEar.y);
  const shrugRatio = earToShoulderDist / shoulderWidth; // Normal relaxed: 0.52 - 0.70; Shrugged: < 0.44
  const isShoulderShrugging = shrugRatio < 0.44;

  let armScorePercent = 95;
  let handStatus = "Optimal Typing";
  let handAdvice = "Neutral 90°-100° desk posture";

  if (hasLeftArm || hasRightArm) {
    // Both arms or best visible arm
    const activeElbowAngle = (hasLeftArm && hasRightArm)
      ? Math.round((leftElbowAngle + rightElbowAngle) / 2)
      : (hasLeftArm ? leftElbowAngle : rightElbowAngle);

    // OSHA & CCOHS Ideal zone for laptop typing: 80° - 118° (zero penalty zone for laptop typing)
    let anglePenalty = 0;
    if (activeElbowAngle >= 80 && activeElbowAngle <= 118) {
      anglePenalty = 0; // Ideal neutral typing
    } else if (activeElbowAngle > 118) {
      // Reaching forward (laptop too far away)
      const overReach = activeElbowAngle - 118;
      anglePenalty = overReach * 0.9;
    } else {
      // Arms too acute / laptop too close (< 80°)
      const underReach = 80 - activeElbowAngle;
      anglePenalty = underReach * 1.0;
    }

    // Upper arm forward reach penalty (if upper arms are angled far forward > 28°)
    let reachPenalty = 0;
    if (avgUpperArmSlope > 28) {
      reachPenalty = (avgUpperArmSlope - 28) * 1.2;
    }

    // Shoulder shrugging penalty (desk too high)
    let shrugPenalty = 0;
    if (isShoulderShrugging) {
      shrugPenalty = Math.round((0.44 - shrugRatio) * 60);
    }

    // Wrist height symmetry (e.g., typing with both hands vs one hand dropped)
    let asymPenalty = 0;
    if (hasLeftArm && hasRightArm) {
      const wristDiffY = Math.abs(leftWrist.y - rightWrist.y);
      if (wristDiffY > 0.08) {
        asymPenalty = Math.min(12, Math.round((wristDiffY - 0.08) * 100));
      }
    }

    const totalArmDeduction = Math.round(anglePenalty + reachPenalty + shrugPenalty + asymPenalty);
    armScorePercent = Math.max(30, Math.min(100, 100 - totalArmDeduction));

    // Dynamic hand status & advice tailored for laptop employees
    if (isShoulderShrugging) {
      handStatus = "Shoulders High";
      handAdvice = "Lower desk or raise chair to relieve neck tension";
    } else if (activeElbowAngle > 128 || avgUpperArmSlope > 32) {
      handStatus = "Reaching Forward";
      handAdvice = "Pull laptop closer so elbows rest at 90°";
    } else if (activeElbowAngle < 75) {
      handStatus = "Laptop Too Close";
      handAdvice = "Give forearms space to rest comfortably";
    } else if (armScorePercent >= 90) {
      handStatus = "Optimal Typing";
      handAdvice = "Perfect neutral typing alignment";
    } else if (armScorePercent >= 80) {
      handStatus = "Good Desk Setup";
      handAdvice = "Forearms resting comfortably";
    } else {
      handStatus = "Arm Strain";
      handAdvice = "Adjust laptop distance and desk height";
    }
  } else {
    // Hands resting below camera view on laptop keyboard / trackpad
    // Infer posture from upper arm relaxation and shoulder symmetry
    const shoulderLevelDiff = Math.abs(leftShoulder.y - rightShoulder.y) * 100;
    const isRelaxedHang = avgUpperArmSlope <= 25;

    let inferredScore = 95;
    if (isShoulderShrugging) {
      inferredScore -= 12;
      handStatus = "Shoulders High";
      handAdvice = "Relax shoulders while typing on laptop";
    } else if (!isRelaxedHang) {
      inferredScore -= Math.min(18, Math.round((avgUpperArmSlope - 25) * 1.2));
      handStatus = "Arms Reaching";
      handAdvice = "Move laptop closer to your body";
    } else if (shoulderLevelDiff > 3) {
      inferredScore -= Math.min(15, Math.round(shoulderLevelDiff * 3));
      handStatus = "Leaning on Desk";
      handAdvice = "Distribute weight evenly across both arms";
    } else {
      inferredScore = 96;
      handStatus = "Neutral Laptop Desk";
      handAdvice = "Comfortable typing position";
    }

    armScorePercent = Math.max(40, Math.min(100, inferredScore));
  }

  // 4. TORSO & SPINAL FLEXION (Ideal: 0°-12°)
  const rawTorsoAngle = calculateVerticalAngle(midShoulder, midHip);
  const torsoAngle = Math.max(0, rawTorsoAngle - (calibrationOffset?.torso || 0));

  let torsoScorePercent = 100;
  if (torsoAngle <= 10) {
    torsoScorePercent = Math.round(100 - (torsoAngle * 0.5));
  } else if (torsoAngle <= 18) {
    torsoScorePercent = Math.round(95 - ((torsoAngle - 10) * 2.8));
  } else {
    torsoScorePercent = Math.round(73 - ((torsoAngle - 18) * 2.5));
  }
  torsoScorePercent = Math.max(15, Math.min(100, torsoScorePercent));

  // 5. SHOULDER SYMMETRY
  const shoulderDiffY = Math.abs(leftShoulder.y - rightShoulder.y);
  const shoulderTiltDeg = Math.round(shoulderDiffY * 100);
  const shoulderScorePercent = Math.max(20, Math.min(100, 100 - (shoulderTiltDeg > 2 ? (shoulderTiltDeg - 2) * 5 : 0)));

  // 6. FORWARD HEAD PROJECTION
  const forwardHeadDisplacement = Math.abs(nose.x - midShoulder.x);

  // 7. COMPREHENSIVE WEIGHTED ACCURATE OVERALL POSTURE PERCENTAGE
  // Neck: 35%, Torso: 30%, Shoulder: 15%, Eyes: 10%, Hands/Arms: 10%
  let score = Math.round(
    neckScorePercent * 0.35 +
    torsoScorePercent * 0.30 +
    shoulderScorePercent * 0.15 +
    eyeScorePercent * 0.10 +
    armScorePercent * 0.10
  );

  // Additional fine penalty for forward head displacement
  if (forwardHeadDisplacement > 0.08) {
    score = Math.max(15, Math.round(score - (forwardHeadDisplacement - 0.08) * 60));
  }

  score = Math.max(15, Math.min(100, score));

  // Biomechanical state classification
  let status = "Optimal";
  let statusColor = "#10b981"; // Emerald Green
  let feedback = "Spine, neck, and eyes are in healthy ergonomic balance.";
  let isSlouching = false;
  let isOptimal = true;

  if (score < 60) {
    status = "Slouching";
    statusColor = "#ef4444"; // Crimson Red
    isSlouching = true;
    isOptimal = false;
    if (neckScorePercent < 60 && torsoScorePercent < 65) {
      feedback = "Severe forward slouch! Pull chin back, sit against lumbar support, and reset shoulders.";
    } else if (neckScorePercent < 65) {
      feedback = "Forward Head Posture (Tech Neck) detected! Raise screen to eye level and lift chin.";
    } else if (eyeScorePercent < 70) {
      feedback = "Head tilted sideways! Level your eyes with the monitor horizon.";
    } else if (armScorePercent < 65) {
      feedback = handAdvice || "Arm reach strain detected! Bring keyboard closer to achieve 90° elbow bend.";
    } else {
      feedback = "Slouched position. Take a deep breath and sit tall.";
    }
  } else if (score < 82) {
    status = "Mild Slouch";
    statusColor = "#f59e0b"; // Amber Yellow
    isSlouching = false;
    isOptimal = false;
    if (shoulderTiltDeg > 4) {
      feedback = "Shoulders uneven. Avoid leaning toward one armrest.";
    } else if (neckAngle > 15) {
      feedback = "Slight forward neck drift. Lift your crown toward the ceiling.";
    } else if (eyeTiltDev > 5) {
      feedback = "Head roll detected. Keep eyes level with screen.";
    } else if (armScorePercent < 78) {
      feedback = handAdvice || "Adjust arm posture to maintain 90° neutral elbow bend.";
    } else {
      feedback = "Minor posture drift. Engage core and relax shoulders.";
    }
  }

  return {
    score,
    status,
    statusColor,
    feedback,
    metrics: {
      neckAngle,
      torsoAngle,
      shoulderTiltDeg,
      eyeTiltDev,
      leftElbowAngle,
      rightElbowAngle,
      elbowAngle: (hasLeftArm && hasRightArm)
        ? Math.round((leftElbowAngle + rightElbowAngle) / 2)
        : (hasLeftArm ? leftElbowAngle : rightElbowAngle),
      handStatus,
      handAdvice,
      isShoulderShrugging,
      neckScorePercent,
      eyeScorePercent,
      armScorePercent,
      torsoScorePercent,
      shoulderScorePercent,
      forwardHeadDisplacement: Number(forwardHeadDisplacement.toFixed(3)),
      hasHands: (hasLeftArm || hasRightArm || hasLeftElbow || hasRightElbow),
      isSlouching,
      isOptimal
    }
  };
}

/**
 * Draws skeletal joint overlay on canvas with dynamic color coding:
 * Shows precise landmarks for EYES, NECK, HANDS, SHOULDERS & SPINE,
 * with real-time percentage badges and angle readouts.
 */
export function drawErgonomicSkeleton(ctx, landmarks, analysis, width, height) {
  if (!ctx || !landmarks || landmarks.length < 13) return;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const themeColor = analysis?.statusColor || "#10b981";
  const metrics = analysis?.metrics || {};
  const isSlouching = metrics.isSlouching || false;

  // Extract Landmarks safely
  const nose = landmarks[0] || { x: 0.5, y: 0.28 };
  const leftEye = landmarks[2] || landmarks[1] || { x: nose.x - 0.03, y: nose.y - 0.02 };
  const rightEye = landmarks[5] || landmarks[4] || { x: nose.x + 0.03, y: nose.y - 0.02 };
  const leftEar = landmarks[7] || { x: nose.x - 0.07, y: nose.y };
  const rightEar = landmarks[8] || { x: nose.x + 0.07, y: nose.y };

  const leftShoulder = landmarks[11] || { x: 0.40, y: 0.48 };
  const rightShoulder = landmarks[12] || { x: 0.60, y: 0.48 };
  const leftElbow = landmarks[13];
  const rightElbow = landmarks[14];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];
  const leftIndex = landmarks[19] || landmarks[17] || landmarks[21];
  const rightIndex = landmarks[20] || landmarks[18] || landmarks[22];

  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  // Convert to pixel coordinates
  const nosePx = { x: nose.x * width, y: nose.y * height };
  const leftEyePx = { x: leftEye.x * width, y: leftEye.y * height };
  const rightEyePx = { x: rightEye.x * width, y: rightEye.y * height };
  const midEyePx = { x: (leftEyePx.x + rightEyePx.x) / 2, y: (leftEyePx.y + rightEyePx.y) / 2 };

  const leftEarPx = { x: leftEar.x * width, y: leftEar.y * height };
  const rightEarPx = { x: rightEar.x * width, y: rightEar.y * height };
  const midEarPx = { x: (leftEarPx.x + rightEarPx.x) / 2, y: (leftEarPx.y + rightEarPx.y) / 2 };

  const leftShoulderPx = { x: leftShoulder.x * width, y: leftShoulder.y * height };
  const rightShoulderPx = { x: rightShoulder.x * width, y: rightShoulder.y * height };
  const midShoulderPx = { x: (leftShoulderPx.x + rightShoulderPx.x) / 2, y: (leftShoulderPx.y + rightShoulderPx.y) / 2 };

  // Base of Neck / C7 Vertebra is at mid-shoulder
  const neckC7Px = { x: midShoulderPx.x, y: midShoulderPx.y - 4 };

  const hasHips = leftHip && rightHip && (leftHip.visibility > 0.3 || rightHip.visibility > 0.3);
  const midHipPx = hasHips
    ? { x: ((leftHip.x + rightHip.x) / 2) * width, y: ((leftHip.y + rightHip.y) / 2) * height }
    : { x: midShoulderPx.x, y: midShoulderPx.y + height * 0.35 };

  // Helper: draw line segment
  const drawSegment = (p1, p2, color, lineWidth = 3.5, isDashed = false) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    if (isDashed) {
      ctx.setLineDash([5, 4]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Helper: draw joint node with outer glow
  const drawNode = (p, radius = 5, fillColor = "#ffffff", strokeColor = themeColor, glow = false) => {
    ctx.save();
    if (glow) {
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.restore();
  };

  // Helper: draw HUD Tag badge
  const drawBadge = (x, y, text, color, bgColor = "rgba(15, 23, 42, 0.88)") => {
    ctx.save();
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 7;
    const badgeHeight = 20;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y - badgeHeight / 2, textWidth + paddingX * 2, badgeHeight, 6);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillText(text, x + paddingX, y + 4);
    ctx.restore();
  };

  // Helper for percentage colors
  const getPctColor = (pct) => {
    if (pct >= 82) return "#10b981"; // Emerald
    if (pct >= 60) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  // 1. VERTICAL REFERENCE PLUMB LINE
  drawSegment(
    { x: midShoulderPx.x, y: midShoulderPx.y - 75 },
    { x: midShoulderPx.x, y: midHipPx.y + 15 },
    "rgba(148, 163, 184, 0.25)",
    2,
    true
  );

  // -------------------------------------------------------------
  // 2. 🧬 NECK & CERVICAL SPINE LANDMARKS
  // -------------------------------------------------------------
  const neckColor = getPctColor(metrics.neckScorePercent ?? 95);
  // Cervical segment from head (mid-ear) down to neck C7
  drawSegment(midEarPx, neckC7Px, neckColor, isSlouching ? 5 : 4);

  // C7 Vertebra node with double-ring pulse
  drawNode(neckC7Px, 7, "#ffffff", neckColor, true);
  ctx.save();
  ctx.beginPath();
  ctx.arc(neckC7Px.x, neckC7Px.y, 11, 0, 2 * Math.PI);
  ctx.strokeStyle = neckColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Head apex node
  drawNode(midEarPx, 5, "#ffffff", neckColor);

  // Neck HUD badge
  const neckText = `🧬 Neck ${metrics.neckScorePercent ?? 95}% (${metrics.neckAngle || 0}°)`;
  drawBadge(midEarPx.x + 16, (midEarPx.y + neckC7Px.y) / 2, neckText, neckColor);

  // -------------------------------------------------------------
  // 3. 👀 EYES & HORIZONTAL GAZE LANDMARKS
  // -------------------------------------------------------------
  const eyeColor = getPctColor(metrics.eyeScorePercent ?? 98);
  // Eye horizontal level line between eyes
  drawSegment(leftEyePx, rightEyePx, eyeColor, 2.5);

  // Extended gaze level guide (dashed wings to indicate monitor level)
  const eyeHalfDist = Math.abs(rightEyePx.x - leftEyePx.x);
  drawSegment(
    { x: leftEyePx.x - eyeHalfDist * 0.7, y: leftEyePx.y },
    { x: leftEyePx.x, y: leftEyePx.y },
    "rgba(56, 189, 248, 0.4)",
    1.5,
    true
  );
  drawSegment(
    { x: rightEyePx.x, y: rightEyePx.y },
    { x: rightEyePx.x + eyeHalfDist * 0.7, y: rightEyePx.y },
    "rgba(56, 189, 248, 0.4)",
    1.5,
    true
  );

  // Eye nodes
  drawNode(leftEyePx, 4.5, "#ffffff", eyeColor, true);
  drawNode(rightEyePx, 4.5, "#ffffff", eyeColor, true);
  // Nose anchor
  drawNode(nosePx, 3.5, eyeColor, "#ffffff");

  // Eye HUD badge
  const eyeText = `👀 Eyes ${metrics.eyeScorePercent ?? 98}% (${metrics.eyeTiltDev ?? 0}° tilt)`;
  drawBadge(rightEyePx.x + 14, rightEyePx.y, eyeText, eyeColor);

  // -------------------------------------------------------------
  // 4. ✋ HANDS, ARMS & ELBOW LANDMARKS
  // -------------------------------------------------------------
  const armColor = getPctColor(metrics.armScorePercent ?? 92);
  const leftElbowPx = leftElbow ? { x: leftElbow.x * width, y: leftElbow.y * height } : null;
  const rightElbowPx = rightElbow ? { x: rightElbow.x * width, y: rightElbow.y * height } : null;
  const leftWristPx = leftWrist ? { x: leftWrist.x * width, y: leftWrist.y * height } : null;
  const rightWristPx = rightWrist ? { x: rightWrist.x * width, y: rightWrist.y * height } : null;
  const leftIndexPx = leftIndex ? { x: leftIndex.x * width, y: leftIndex.y * height } : null;
  const rightIndexPx = rightIndex ? { x: rightIndex.x * width, y: rightIndex.y * height } : null;

  // Left Arm (Shoulder -> Elbow -> Wrist -> Hand)
  if (leftElbowPx && (leftElbow?.visibility ?? 1) > 0.25) {
    drawSegment(leftShoulderPx, leftElbowPx, armColor, 3);
    drawNode(leftElbowPx, 5, "#ffffff", armColor);

    if (leftWristPx && (leftWrist?.visibility ?? 1) > 0.2) {
      drawSegment(leftElbowPx, leftWristPx, armColor, 3);
      drawNode(leftWristPx, 4.5, "#ffffff", armColor, true);

      // Hand / Knuckle tip
      if (leftIndexPx && (leftIndex?.visibility ?? 1) > 0.2) {
        drawSegment(leftWristPx, leftIndexPx, armColor, 2);
        drawNode(leftIndexPx, 3.5, armColor, "#ffffff");
      }
    }
  }

  // Right Arm (Shoulder -> Elbow -> Wrist -> Hand)
  if (rightElbowPx && (rightElbow?.visibility ?? 1) > 0.25) {
    drawSegment(rightShoulderPx, rightElbowPx, armColor, 3);
    drawNode(rightElbowPx, 5, "#ffffff", armColor);

    if (rightWristPx && (rightWrist?.visibility ?? 1) > 0.2) {
      drawSegment(rightElbowPx, rightWristPx, armColor, 3);
      drawNode(rightWristPx, 4.5, "#ffffff", armColor, true);

      // Hand / Knuckle tip
      if (rightIndexPx && (rightIndex?.visibility ?? 1) > 0.2) {
        drawSegment(rightWristPx, rightIndexPx, armColor, 2);
        drawNode(rightIndexPx, 3.5, armColor, "#ffffff");
      }
    }
  }

  // Hands HUD badge (near right hand or right shoulder)
  const handAnchor = rightWristPx || rightElbowPx || { x: rightShoulderPx.x + 10, y: rightShoulderPx.y + 40 };
  const handStatusLabel = metrics.handStatus ? ` • ${metrics.handStatus}` : ` (${metrics.rightElbowAngle || 95}°)`;
  const handText = `✋ Hands ${metrics.armScorePercent ?? 94}%${handStatusLabel}`;
  drawBadge(handAnchor.x + 12, handAnchor.y, handText, armColor);

  // -------------------------------------------------------------
  // 5. 🦴 SHOULDERS & SPINAL COLUMN LANDMARKS
  // -------------------------------------------------------------
  const spineColor = getPctColor(metrics.torsoScorePercent ?? 95);
  // Clavicle axis
  drawSegment(leftShoulderPx, rightShoulderPx, themeColor, 3.5);
  drawNode(leftShoulderPx, 5.5, "#ffffff", themeColor);
  drawNode(rightShoulderPx, 5.5, "#ffffff", themeColor);

  // Spinal Column (Mid-Shoulder to Mid-Hip)
  drawSegment(midShoulderPx, midHipPx, spineColor, isSlouching ? 6 : 4.5);
  drawNode(midHipPx, 6, "#ffffff", spineColor);

  // Spine HUD badge
  const spineText = `🦴 Spine ${metrics.torsoScorePercent ?? 95}% (${metrics.torsoAngle || 0}°)`;
  drawBadge(midShoulderPx.x + 14, (midShoulderPx.y + midHipPx.y) / 2 + 10, spineText, spineColor);

  // -------------------------------------------------------------
  // 6. 📊 TOP HIGH-TECH GLASSMORPHISM HUD BAR
  // -------------------------------------------------------------
  const hudHeight = 30;
  const hudY = 12;
  const hudWidth = Math.min(width - 24, 480);
  const hudX = (width - hudWidth) / 2;

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.90)";
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudWidth, hudHeight, 8);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = themeColor;
  ctx.stroke();

  // Draw 4 compact metrics inside HUD
  ctx.font = "bold 11px Inter, system-ui, sans-serif";
  const items = [
    { label: "🧬 Neck", val: `${metrics.neckScorePercent ?? 95}%`, color: neckColor },
    { label: "👀 Eyes", val: `${metrics.eyeScorePercent ?? 98}%`, color: eyeColor },
    { label: "✋ Hands", val: `${metrics.armScorePercent ?? 92}%`, color: armColor },
    { label: "🦴 Spine", val: `${metrics.torsoScorePercent ?? 95}%`, color: spineColor },
  ];

  const colWidth = hudWidth / items.length;
  items.forEach((item, idx) => {
    const itemX = hudX + idx * colWidth + 8;
    // Dot
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(itemX + 4, hudY + hudHeight / 2, 3.5, 0, 2 * Math.PI);
    ctx.fill();

    // Label & Percentage
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(item.label, itemX + 12, hudY + hudHeight / 2 + 3.5);
    const labelW = ctx.measureText(item.label).width;
    ctx.fillStyle = item.color;
    ctx.fillText(item.val, itemX + 16 + labelW, hudY + hudHeight / 2 + 3.5);
  });

  ctx.restore();

  ctx.restore();
}

