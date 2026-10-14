const express = require('express');
const router = express.Router();
const storage = require('../storage');

// 1. Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SitSmart Ergonomics API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: storage.getDatabaseStatus()
  });
});

// --- Authentication Endpoints ---
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, org } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const user = await storage.registerUser({ name, email, password, role, org });
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token: "token_" + user.id
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await storage.authenticateUser({ email, password });
    res.json({
      success: true,
      message: "Signed in successfully",
      user,
      token: "token_" + user.id
    });
  } catch (err) {
    res.status(401).json({ error: err.message || "Invalid email or password" });
  }
});

// Helper to extract userId from headers or body
function getUserIdFromRequest(req) {
  if (req.body && req.body.userId) return req.body.userId;
  if (req.query && req.query.userId) return req.query.userId;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token_')) {
    return authHeader.replace('Bearer token_', '').trim();
  }
  return null;
}

router.get('/auth/me', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req) || "demo-user";
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user session" });
  }
});

// Update user profile info (name, role, org)
router.put('/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role, org } = req.body;
    const updatedUser = await storage.updateUserProfile(userId, { name, role, org });
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update profile" });
  }
});

// Update user ergonomic preferences
router.put('/users/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    const updatedUser = await storage.updateUserPreferences(userId, preferences);
    res.json({ success: true, message: "Preferences updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update preferences" });
  }
});

// Get all past sessions for a user
router.get('/users/:userId/sessions', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await storage.getUserSessions(userId);
    res.json({ success: true, userId, count: sessions.length, sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user sessions" });
  }
});

// GET /api/analytics/user/:userId - Daily Improvement Tracker
router.get('/analytics/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const improvement = await storage.getUserDailyImprovement(userId);
    res.json({ success: true, ...improvement });
  } catch (err) {
    console.error("Error fetching user improvement:", err);
    res.status(500).json({ error: "Failed to fetch improvement analytics" });
  }
});

// 2. Posture Analysis Endpoint: POST /api/posture/analyze
router.post('/posture/analyze', async (req, res) => {
  try {
    const { angles, landmarks, userId } = req.body;
    
    let neckAngle = 8;
    let torsoAngle = 5;
    let shoulderTilt = 1;

    if (angles) {
      neckAngle = Number(angles.neck || angles.neckAngle || 8);
      torsoAngle = Number(angles.torso || angles.torsoAngle || 5);
      shoulderTilt = Number(angles.shoulderTilt || angles.shoulderTiltDeg || 1);
    }

    // Biomechanical score calculation (0 - 100)
    let score = 100;
    if (neckAngle > 15) score -= (neckAngle - 15) * 2.2;
    if (torsoAngle > 12) score -= (torsoAngle - 12) * 2.0;
    if (shoulderTilt > 3) score -= (shoulderTilt - 3) * 3.5;
    score = Math.max(10, Math.min(100, Math.round(score)));

    let status = "Optimal";
    let isSlouching = false;
    let advice = "Great alignment! Keep shoulders relaxed.";

    if (score < 60) {
      status = "Slouching";
      isSlouching = true;
      advice = "Forward head or torso hunch detected! Pull chin back and sit upright.";
    } else if (score < 82) {
      status = "Mild Slouch";
      advice = "Mild spinal drift. Check screen height and relax shoulder blades.";
    }

    // Record posture log asynchronously
    storage.addPostureLog({
      userId: userId || 'demo-user',
      score,
      angles: { neck: neckAngle, torso: torsoAngle, shoulderTilt },
      status
    }).catch(e => console.warn("Log write note:", e.message));

    res.json({
      success: true,
      score,
      status,
      isSlouching,
      advice,
      angles: {
        neck: neckAngle,
        torso: torsoAngle,
        shoulderTilt
      },
      idealRanges: {
        neck: "<15°",
        torso: "<12°",
        shoulderTilt: "<3°"
      }
    });
  } catch (err) {
    console.error("Posture analysis error:", err);
    res.status(500).json({ error: "Failed to analyze posture" });
  }
});

// 3. Alerts Endpoints:
// POST /api/alerts/create
router.post('/alerts/create', async (req, res) => {
  try {
    const { userId, type, message, scheduledAt } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Alert message is required" });
    }

    const alert = await storage.createAlert({
      userId: userId || "demo-user",
      type: type || "movement",
      message,
      scheduledAt: scheduledAt || new Date().toISOString()
    });

    res.status(201).json({ success: true, alert });
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// GET /api/alerts/upcoming/:userId
router.get('/alerts/upcoming/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const alerts = await storage.getUpcomingAlerts(userId);
    res.json({ success: true, userId, alerts });
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: "Failed to fetch upcoming alerts" });
  }
});

// 4. Wizard Setup & Status Endpoints:
// POST /api/wizard/setup
// POST /api/wizard/setup
router.post('/wizard/setup', async (req, res) => {
  try {
    const targetUserId = req.body.userId || getUserIdFromRequest(req) || "demo-user";
    const { stepsCompleted, setupData, responses } = req.body;
    const progress = await storage.saveWizardProgress({
      userId: targetUserId,
      stepsCompleted: stepsCompleted || 4,
      setupData: setupData || responses || {},
      score: 85,
      riskLevel: "Low Risk"
    });
    res.status(201).json({ success: true, progress });
  } catch (err) {
    console.error("Error saving wizard setup:", err);
    res.status(500).json({ error: "Failed to save wizard setup" });
  }
});

// GET /api/wizard/status/:userId
router.get('/wizard/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const status = await storage.getWizardStatus(userId);
    res.json({ success: true, userId, status });
  } catch (err) {
    console.error("Error fetching wizard status:", err);
    res.status(500).json({ error: "Failed to fetch wizard status" });
  }
});

// 5. Analytics Endpoints:
// GET /api/analytics/daily/:userId
router.get('/analytics/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const analytics = await storage.getDailyAnalytics(date, userId);
    res.json(analytics);
  } catch (err) {
    console.error("Error fetching daily user analytics:", err);
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
});

// GET /api/analytics/daily (Global/default fallback)
router.get('/analytics/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const targetUserId = req.query.userId || getUserIdFromRequest(req) || "demo-user";
    const analytics = await storage.getDailyAnalytics(date, targetUserId);
    res.json(analytics);
  } catch (err) {
    console.error("Error fetching daily analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET /api/analytics/trends/:userId
router.get('/analytics/trends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const trends = await storage.getTrends(userId);
    res.json(trends);
  } catch (err) {
    console.error("Error fetching trends:", err);
    res.status(500).json({ error: "Failed to fetch analytics trends" });
  }
});

// 6. Recommendations Endpoints:
// GET /api/recommendations/:userId
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await storage.getRecommendationsForUser(userId);
    res.json(recommendations);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// 7. MicroBreak Suggestion: POST /api/microbreak/suggest
router.post('/microbreak/suggest', (req, res) => {
  try {
    const { sittingDuration } = req.body;
    const suggestion = storage.suggestMicrobreak(Number(sittingDuration) || 30);
    res.json({ success: true, ...suggestion });
  } catch (err) {
    console.error("Error suggesting microbreak:", err);
    res.status(500).json({ error: "Failed to suggest microbreak" });
  }
});

// 8. Sessions Recording: POST /api/sessions
router.post('/sessions', async (req, res) => {
  try {
    const targetUserId = req.body.userId || getUserIdFromRequest(req) || "demo-user";
    const {
      durationMinutes,
      avgScore,
      goodPosturePercent,
      slouchCount,
      totalSlouchSeconds,
      breaksTaken,
      hourlyAvg
    } = req.body;

    const currentHour = new Date().getHours().toString().padStart(2, '0') + ":00";

    const session = await storage.addSession({
      userId: targetUserId,
      durationMinutes: durationMinutes || 0,
      avgScore: avgScore || 80,
      goodPosturePercent: goodPosturePercent || 80,
      slouchCount: slouchCount || 0,
      totalSlouchSeconds: totalSlouchSeconds || 0,
      breaksTaken: breaksTaken || 0,
      hourlyAvg: hourlyAvg || [],
      currentHour
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    console.error("Error saving session:", err);
    res.status(500).json({ error: "Failed to record session" });
  }
});

// 9. Workplace Assessment: POST /api/assessments
router.post('/assessments', async (req, res) => {
  try {
    const targetUserId = req.body.userId || getUserIdFromRequest(req) || "demo-user";
    const { responses } = req.body;
    let score = 35;
    const recommendations = [];

    if (responses?.monitorEyeLevel === 'yes') {
      score += 15;
    } else {
      recommendations.push("Elevate monitor so the top 1/3 of the screen aligns directly with your horizontal eye level.");
    }

    if (responses?.monitorDistance === 'arm_length') {
      score += 12;
    } else {
      recommendations.push("Reposition screen roughly one arm's length (20-30 inches) away to prevent eye strain and forward head thrust.");
    }

    if (responses?.chairLumbar === 'yes') {
      score += 15;
    } else {
      recommendations.push("Use a lumbar roll or ergonomic cushion to support the inward curve of your lower back.");
    }

    if (responses?.feetFlat === 'yes') {
      score += 13;
    } else {
      recommendations.push("Adjust chair height or add a footrest so thighs are parallel to the floor and feet rest completely flat.");
    }

    if (responses?.elbowAngle === '90_degrees') {
      score += 10;
    } else {
      recommendations.push("Adjust desk/armrest height so elbows form an open 90° to 100° angle with forearms parallel to the desk.");
    }

    score = Math.min(100, Math.max(10, score));

    let riskLevel = "Low Ergonomic Risk";
    if (score < 65) {
      riskLevel = "High Musculoskeletal Strain Risk";
    } else if (score < 80) {
      riskLevel = "Moderate Strain Risk";
    }

    if (recommendations.length === 0) {
      recommendations.push("Excellent ergonomic setup! Maintain regular 20-minute movement breaks.");
    }

    const assessment = await storage.saveAssessment({
      userId: targetUserId,
      score,
      riskLevel,
      responses,
      recommendations
    });

    res.status(201).json({
      success: true,
      assessment: {
        ...assessment,
        score,
        riskLevel,
        recommendations
      }
    });
  } catch (err) {
    console.error("Error saving assessment:", err);
    res.status(500).json({ error: "Failed to evaluate assessment" });
  }
});

// 10. Corporate Demo Request: POST /api/demo-request
router.post('/demo-request', async (req, res) => {
  try {
    const { name, email, company, teamSize, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const request = await storage.saveDemoRequest({
      name,
      email,
      company: company || "N/A",
      teamSize: teamSize || "1-10",
      message: message || ""
    });

    res.status(201).json({
      success: true,
      message: "Thank you for contacting SitSmart. Our ergonomics specialist will reach out shortly.",
      request
    });
  } catch (err) {
    console.error("Error saving demo request:", err);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// 11. Stretches Library: GET /api/recommendations
router.get('/recommendations', (req, res) => {
  res.json({
    stretches: [
      {
        id: "trapezius_release",
        title: "Upper Trapezius Stretch",
        target: "Neck & Upper Back",
        durationSec: 30,
        instructions: "Gently tilt right ear toward right shoulder. Place right hand over head for subtle downward pressure without pulling. Hold 15 seconds, switch sides.",
        benefit: "Relieves cervical compression and muscle tightness from forward head tilt."
      },
      {
        id: "scapular_retraction",
        title: "Scapular Retraction (Shoulder Pinch)",
        target: "Upper Back & Chest",
        durationSec: 30,
        instructions: "Sit upright with arms relaxed. Pull shoulder blades backward and downward as if squeezing a pencil between them. Hold 5 seconds, repeat 5 times.",
        benefit: "Counteracts rounded hunching shoulders and expands thoracic chest space."
      },
      {
        id: "spinal_twist",
        title: "Seated Torso Spinal Twist",
        target: "Lumbar & Mid-Spine",
        durationSec: 30,
        instructions: "Sit tall. Cross right arm over left knee and place left hand on chair back. Inhale to lengthen spine, exhale to gently rotate torso. Hold 15s, switch.",
        benefit: "Promotes spinal fluid circulation and reduces stiffness in lumbar vertebrae."
      },
      {
        id: "rule_20_20_20",
        title: "20-20-20 Eye Strain Reset",
        target: "Vision & Ciliary Muscles",
        durationSec: 20,
        instructions: "Shift gaze away from your digital screen. Focus on an object at least 20 feet (6 meters) away for 20 seconds. Blink smoothly 5 times.",
        benefit: "Prevents digital eye strain, blurred vision, and screen-induced headaches."
      },
      {
        id: "wrist_flexor_stretch",
        title: "Wrist & Forearm Flexor Stretch",
        target: "Forearms & Wrists",
        durationSec: 30,
        instructions: "Extend arm in front with palm facing out and fingers pointed down. Use opposite hand to gently pull fingers back toward body. Hold 15s per side.",
        benefit: "Alleviates Carpal Tunnel pressure and keyboard typing fatigue."
      },
      {
        id: "chest_opener",
        title: "Chest & Anterior Shoulder Opener",
        target: "Pectorals & Anterior Deltoids",
        durationSec: 30,
        instructions: "Clasp hands behind your lower back. Gently roll shoulders back and straighten arms, lifting chest toward the ceiling. Inhale deeply.",
        benefit: "Reverses anterior hunching and restores natural cervical lordosis."
      }
    ],
    ergonomicRules: [
      { rule: "90-90-90 Rule", desc: "Keep elbows, hips, and knees bent at approximately 90-100 degrees." },
      { rule: "Eye-Level Rule", desc: "The top third of your display should be at or slightly below eye level." },
      { rule: "Arm-Length Distance", desc: "Position your screen roughly 20-30 inches (arm's length) from your eyes." },
      { rule: "Hydration Micro-Breaks", desc: "Drink a glass of water every hour to stay hydrated and naturally prompt standing." }
    ]
  });
});

module.exports = router;
