const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const models = require('./models');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password, salt) {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, userSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: userSalt };
}

function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verifyHash === hash;
}

// Compute date strings for past N days
function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const demoSalt = "sitsmart_demo_salt_2026";
const demoHash = crypto.pbkdf2Sync("demo123", demoSalt, 1000, 64, 'sha512').toString('hex');

// Initial mock & seed dataset for rich dashboard demonstration
const initialData = {
  users: [
    {
      id: "usr_demo",
      userId: "demo-user",
      name: "Alex Morgan",
      email: "alex@sitsmart.com",
      passwordHash: demoHash,
      salt: demoSalt,
      role: "Software Engineer",
      org: "TechCorp Wellness",
      preferences: {
        audioAlerts: true,
        alertFrequencyMinutes: 25,
        cameraMirror: true,
        targetScore: 85
      }
    }
  ],
  postureLogs: [],
  alerts: [],
  wizardProgress: {
    "demo-user": {
      userId: "demo-user",
      stepsCompleted: 4,
      setupData: {
        monitorEyeLevel: "yes",
        monitorDistance: "arm_length",
        chairLumbar: "yes",
        feetFlat: "yes",
        elbowAngle: "90_degrees",
        screenGlare: "minimal"
      },
      score: 85,
      riskLevel: "Low Risk",
      recommendations: [
        "Maintain current monitor height at horizontal eye level.",
        "Ensure lower lumbar support pad is firmly placed.",
        "Take regular 20-minute movement breaks."
      ]
    }
  },
  sessions: [
    // Today
    {
      id: "sess_today_01",
      userId: "demo-user",
      date: getPastDate(0),
      startTime: "09:00",
      endTime: "10:30",
      durationMinutes: 90,
      avgScore: 91,
      goodPosturePercent: 90,
      slouchCount: 2,
      totalSlouchSeconds: 65,
      breaksTaken: 2,
      hourlyAvg: [
        { hour: "09:00", score: 92, status: "Optimal" },
        { hour: "10:00", score: 90, status: "Optimal" }
      ]
    },
    {
      id: "sess_today_02",
      userId: "demo-user",
      date: getPastDate(0),
      startTime: "11:00",
      endTime: "12:30",
      durationMinutes: 90,
      avgScore: 87,
      goodPosturePercent: 86,
      slouchCount: 2,
      totalSlouchSeconds: 70,
      breaksTaken: 1,
      hourlyAvg: [
        { hour: "11:00", score: 88, status: "Optimal" },
        { hour: "12:00", score: 86, status: "Optimal" }
      ]
    },
    // Yesterday (Day 2)
    {
      id: "sess_yest_01",
      userId: "demo-user",
      date: getPastDate(1),
      startTime: "09:30",
      endTime: "12:45",
      durationMinutes: 195,
      avgScore: 84,
      goodPosturePercent: 82,
      slouchCount: 7,
      totalSlouchSeconds: 230,
      breaksTaken: 3,
      hourlyAvg: [
        { hour: "10:00", score: 86, status: "Optimal" },
        { hour: "11:00", score: 83, status: "Good" },
        { hour: "12:00", score: 82, status: "Good" }
      ]
    },
    // 2 Days Ago (Day 3)
    {
      id: "sess_2days_01",
      userId: "demo-user",
      date: getPastDate(2),
      startTime: "09:00",
      endTime: "12:30",
      durationMinutes: 210,
      avgScore: 78,
      goodPosturePercent: 75,
      slouchCount: 11,
      totalSlouchSeconds: 380,
      breaksTaken: 2,
      hourlyAvg: [
        { hour: "09:00", score: 82, status: "Good" },
        { hour: "10:00", score: 79, status: "Good" },
        { hour: "11:00", score: 75, status: "Mild Slouch" },
        { hour: "12:00", score: 74, status: "Mild Slouch" }
      ]
    },
    // 3 Days Ago (Day 4 - Baseline initial day)
    {
      id: "sess_3days_01",
      userId: "demo-user",
      date: getPastDate(3),
      startTime: "09:15",
      endTime: "13:00",
      durationMinutes: 225,
      avgScore: 71,
      goodPosturePercent: 67,
      slouchCount: 16,
      totalSlouchSeconds: 520,
      breaksTaken: 1,
      hourlyAvg: [
        { hour: "09:00", score: 78, status: "Good" },
        { hour: "10:00", score: 73, status: "Mild Slouch" },
        { hour: "11:00", score: 68, status: "Slouching" },
        { hour: "12:00", score: 65, status: "Slouching" }
      ]
    }
  ],
  assessments: [],
  demoRequests: [],
  hourlyTrends: [
    { hour: "09:00", score: 91, benchmark: 85, slouchedMinutes: 3 },
    { hour: "10:00", score: 86, benchmark: 85, slouchedMinutes: 6 },
    { hour: "11:00", score: 80, benchmark: 85, slouchedMinutes: 11 },
    { hour: "12:00", score: 72, benchmark: 85, slouchedMinutes: 16 },
    { hour: "13:00", score: 88, benchmark: 85, slouchedMinutes: 4 },
    { hour: "14:00", score: 82, benchmark: 85, slouchedMinutes: 9 },
    { hour: "15:00", score: 76, benchmark: 85, slouchedMinutes: 14 },
    { hour: "16:00", score: 84, benchmark: 85, slouchedMinutes: 8 },
    { hour: "17:00", score: 79, benchmark: 85, slouchedMinutes: 12 }
  ]
};

let isMongoConnected = false;

// Read JSON fallback
function readFallbackData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    // Ensure users array exists
    if (!data.users || data.users.length === 0) {
      data.users = initialData.users;
      data.sessions = initialData.sessions;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch (err) {
    console.error("Error reading JSON fallback storage:", err);
    return initialData;
  }
}

// Write JSON fallback
function writeFallbackData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing JSON fallback storage:", err);
  }
}

// Initialize Storage
async function initStorage(mongoUri) {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
      isMongoConnected = true;
      console.log("🟢 Connected to MongoDB successfully.");
      return;
    } catch (err) {
      console.warn("⚠️ MongoDB connection failed (" + err.message + "). Falling back to resilient local storage adapter.");
      isMongoConnected = false;
    }
  } else {
    console.log("ℹ️ No MONGODB_URI specified. Operating with persistent local storage adapter.");
  }
  readFallbackData();
}

// --- Auth Methods ---
async function registerUser({ name, email, password, role, org }) {
  const db = readFallbackData();
  const normalizedEmail = email.toLowerCase().trim();

  const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: "usr_" + Date.now(),
    userId: "usr_" + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    role: role || "Employee",
    org: org || "General",
    preferences: {
      audioAlerts: true,
      alertFrequencyMinutes: 25,
      cameraMirror: true,
      targetScore: 85
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeFallbackData(db);

  const { passwordHash, salt: _, ...safeUser } = newUser;
  return safeUser;
}

async function authenticateUser({ email, password }) {
  const db = readFallbackData();
  const normalizedEmail = email.toLowerCase().trim();

  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

async function getUserById(userId) {
  const db = readFallbackData();
  const user = db.users.find(u => u.id === userId || u.userId === userId);
  if (!user) return null;
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

// --- User Profile & Preferences Management ---
async function updateUserProfile(userId, { name, role, org }) {
  const db = readFallbackData();
  const user = db.users.find(u => u.id === userId || u.userId === userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (name && name.trim()) user.name = name.trim();
  if (role !== undefined) user.role = role.trim();
  if (org !== undefined) user.org = org.trim();
  user.updatedAt = new Date().toISOString();

  writeFallbackData(db);
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

async function updateUserPreferences(userId, preferences) {
  const db = readFallbackData();
  const user = db.users.find(u => u.id === userId || u.userId === userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.preferences = {
    ...(user.preferences || {}),
    ...preferences
  };
  user.updatedAt = new Date().toISOString();

  writeFallbackData(db);
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

// --- Posture Logs ---
async function addPostureLog(logData) {
  const db = readFallbackData();
  if (!db.postureLogs) db.postureLogs = [];

  const log = {
    id: "plog_" + Date.now(),
    timestamp: new Date().toISOString(),
    userId: logData.userId || "demo-user",
    score: Number(logData.score) || 0,
    angles: logData.angles || {},
    status: logData.status || "Optimal"
  };

  db.postureLogs.unshift(log);
  // Keep bounded memory for logs
  if (db.postureLogs.length > 500) {
    db.postureLogs = db.postureLogs.slice(0, 500);
  }
  writeFallbackData(db);
  return log;
}

// --- Alerts Service ---
async function createAlert(alertData) {
  const db = readFallbackData();
  if (!db.alerts) db.alerts = [];

  const alert = {
    id: "alt_" + Date.now(),
    userId: alertData.userId || "demo-user",
    type: alertData.type || "movement",
    message: alertData.message,
    scheduledAt: alertData.scheduledAt || new Date().toISOString(),
    delivered: false,
    createdAt: new Date().toISOString()
  };

  db.alerts.unshift(alert);
  writeFallbackData(db);
  return alert;
}

async function getUpcomingAlerts(userId = "demo-user") {
  const db = readFallbackData();
  const alerts = (db.alerts || []).filter(a => a.userId === userId || userId === "demo-user");
  return alerts.slice(0, 10);
}

// --- Wizard Progress ---
async function saveWizardProgress({ userId, stepsCompleted, setupData, score, riskLevel, recommendations }) {
  const db = readFallbackData();
  if (!db.wizardProgress) db.wizardProgress = {};

  const uId = userId || "demo-user";
  const progress = {
    userId: uId,
    stepsCompleted: stepsCompleted || 4,
    setupData: setupData || {},
    score: score || 85,
    riskLevel: riskLevel || "Low Risk",
    recommendations: recommendations || [
      "Maintain current monitor height at horizontal eye level.",
      "Ensure lower lumbar support pad is firmly placed.",
      "Take regular 20-minute movement breaks."
    ],
    updatedAt: new Date().toISOString()
  };

  db.wizardProgress[uId] = progress;
  writeFallbackData(db);
  return progress;
}

async function getWizardStatus(userId = "demo-user") {
  const db = readFallbackData();
  if (db.wizardProgress && db.wizardProgress[userId]) {
    return db.wizardProgress[userId];
  }
  if (db.wizardProgress && db.wizardProgress["demo-user"]) {
    return db.wizardProgress["demo-user"];
  }

  return {
    userId,
    stepsCompleted: 4,
    setupData: {
      monitorEyeLevel: "yes",
      monitorDistance: "arm_length",
      chairLumbar: "yes",
      feetFlat: "yes",
      elbowAngle: "90_degrees",
      screenGlare: "minimal"
    },
    score: 85,
    riskLevel: "Low Risk",
    recommendations: [
      "Maintain current monitor height at horizontal eye level.",
      "Ensure lower lumbar support pad is firmly placed.",
      "Take regular 20-minute movement breaks."
    ]
  };
}

// --- Trends & Recommendations ---
async function getTrends(userId = "demo-user") {
  const db = readFallbackData();
  const userSessions = db.sessions.filter(s => s.userId === userId);
  const trendStatus = userSessions.length >= 2 
    ? (userSessions[0].avgScore >= userSessions[userSessions.length - 1].avgScore ? "improving" : "stable")
    : "improving";

  return {
    userId,
    trendStatus,
    scoreGrowthRate: "+4.2%",
    slouchIncidentRate: "-18%",
    weeklyCompliance: 92,
    hourlyDistribution: db.hourlyTrends || initialData.hourlyTrends
  };
}

async function getRecommendationsForUser(userId = "demo-user") {
  return {
    userId,
    personalizedTips: [
      "Elevate monitor so top third reaches horizontal eye line.",
      "Engage lumbar roll against inward lower back curve.",
      "Perform upper trapezius and scapular pinch reset every 30 minutes.",
      "Position display at 20-30 inches arm length distance."
    ],
    activeFocusArea: "Cervical Lordosis & Shoulder Symmetry",
    recommendedBreakIntervalMinutes: 25
  };
}

// --- MicroBreak Suggestions ---
function suggestMicrobreak(sittingDuration = 30) {
  let suggestedExercise = "Upper Trapezius Release";
  let durationSec = 30;
  let advice = "Gently tilt right ear toward right shoulder. Relieves cervical tension.";

  if (sittingDuration >= 60) {
    suggestedExercise = "Seated Torso Spinal Twist & Stand";
    durationSec = 60;
    advice = "Stand up, gently rotate torso from side to side, and walk 20 paces.";
  } else if (sittingDuration >= 40) {
    suggestedExercise = "Scapular Retraction (Shoulder Pinch)";
    durationSec = 30;
    advice = "Pull shoulder blades backward and downward as if squeezing a pencil.";
  } else if (sittingDuration >= 20) {
    suggestedExercise = "20-20-20 Eye Strain Reset";
    durationSec = 20;
    advice = "Shift gaze 20 feet away for 20 seconds. Blink smoothly 5 times.";
  }

  return {
    sittingDuration,
    suggestedExercise,
    durationSec,
    advice
  };
}

// --- Daily Improvement & History Service ---
async function getUserDailyImprovement(userId = "demo-user") {
  const db = readFallbackData();
  
  // Strictly filter by userId. Only use demo sessions for demo-user
  const isDemo = userId === "demo-user" || userId === "usr_demo";
  const userSessions = db.sessions.filter(s => isDemo ? (s.userId === "demo-user" || s.userId === "usr_demo") : s.userId === userId);

  if (userSessions.length === 0) {
    return {
      userId,
      dailyHistory: [],
      metrics: {
        initialScore: 0,
        currentScore: 0,
        scoreImprovement: 0,
        slouchReductionPercent: 0,
        activeStreakDays: 0,
        levelTitle: "New Ergonomist",
        tierLevel: 1,
        nextTier: "Aligned Professional (Complete First Session)",
        totalTrackedDays: 0,
        totalSessions: 0
      }
    };
  }

  // Group sessions by date
  const groupedByDate = {};
  userSessions.forEach(s => {
    if (!groupedByDate[s.date]) {
      groupedByDate[s.date] = [];
    }
    groupedByDate[s.date].push(s);
  });

  const dates = Object.keys(groupedByDate).sort(); // chronological

  const dailyHistory = dates.map(date => {
    const list = groupedByDate[date];
    const totalScore = list.reduce((acc, s) => acc + (s.avgScore || 0), 0);
    const avgScore = Math.round(totalScore / list.length);
    const totalSlouch = list.reduce((acc, s) => acc + (s.slouchCount || 0), 0);
    const totalDuration = list.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalGood = list.reduce((acc, s) => acc + (s.goodPosturePercent || 0), 0);

    return {
      date,
      avgScore,
      slouchCount: totalSlouch,
      durationMinutes: totalDuration,
      goodPercent: Math.round(totalGood / list.length),
      sessionsCount: list.length
    };
  });

  // Calculate improvement metrics
  const firstDay = dailyHistory[0];
  const latestDay = dailyHistory[dailyHistory.length - 1];

  const scoreImprovement = dailyHistory.length > 1 ? latestDay.avgScore - firstDay.avgScore : 0;
  const slouchReductionPercent = firstDay.slouchCount > 0 && dailyHistory.length > 1
    ? Math.round(((firstDay.slouchCount - latestDay.slouchCount) / firstDay.slouchCount) * 100)
    : 0;

  // Streak: consecutive active days
  const streak = dates.length;

  // Ergonomic Tier
  let levelTitle = "Posture Novice";
  let tierLevel = 1;
  let nextTier = "Aligned Professional (Avg 80%+)";
  if (latestDay.avgScore >= 85) {
    levelTitle = "Master Ergonomist";
    tierLevel = 3;
    nextTier = "Elite Health Luminary (Maintain 90%+)";
  } else if (latestDay.avgScore >= 75) {
    levelTitle = "Aligned Professional";
    tierLevel = 2;
    nextTier = "Master Ergonomist (Avg 85%+)";
  }

  return {
    userId,
    dailyHistory,
    metrics: {
      initialScore: firstDay.avgScore,
      currentScore: latestDay.avgScore,
      scoreImprovement,
      slouchReductionPercent: Math.max(0, slouchReductionPercent),
      activeStreakDays: streak,
      levelTitle,
      tierLevel,
      nextTier,
      totalTrackedDays: dates.length,
      totalSessions: userSessions.length
    }
  };
}

// --- Session Recording ---
async function addSession(sessionData) {
  const db = readFallbackData();
  const session = {
    id: "sess_" + Date.now(),
    date: sessionData.date || new Date().toISOString().split('T')[0],
    userId: sessionData.userId || "demo-user",
    ...sessionData,
    createdAt: new Date().toISOString()
  };

  db.sessions.unshift(session);

  // Update hourly trends if score provided
  if (sessionData.avgScore && sessionData.currentHour) {
    const existing = db.hourlyTrends.find(h => h.hour === sessionData.currentHour);
    if (existing) {
      existing.score = Math.round((existing.score + sessionData.avgScore) / 2);
    }
  }
  writeFallbackData(db);
  return session;
}

// --- Get All Sessions for User ---
async function getUserSessions(userId = "demo-user") {
  const db = readFallbackData();
  const isDemo = userId === "demo-user" || userId === "usr_demo";
  return db.sessions.filter(s => isDemo ? (s.userId === "demo-user" || s.userId === "usr_demo") : s.userId === userId);
}

// --- Analytics ---
async function getDailyAnalytics(date, userId = "demo-user") {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const db = readFallbackData();
  
  const isDemo = userId === "demo-user" || userId === "usr_demo";
  const userAllSessions = db.sessions.filter(s => isDemo ? (s.userId === "demo-user" || s.userId === "usr_demo") : s.userId === userId);
  let sessions = userAllSessions.filter(s => s.date === targetDate);

  // If user has sessions on other dates but none today, show recent
  if (sessions.length === 0 && userAllSessions.length > 0) {
    sessions = userAllSessions.slice(0, 5);
  }

  // If a non-demo user has zero recorded sessions ever, return a clean empty structure
  if (!isDemo && userAllSessions.length === 0) {
    return {
      date: targetDate,
      summary: {
        avgScore: 0,
        goodPercent: 0,
        totalDurationMinutes: 0,
        totalSlouchEvents: 0,
        breaksCompleted: 0,
        riskLevel: "No Sessions Recorded Yet"
      },
      hourlyTrends: [
        { hour: "09:00", score: 0, benchmark: 85, slouchedMinutes: 0 },
        { hour: "11:00", score: 0, benchmark: 85, slouchedMinutes: 0 },
        { hour: "13:00", score: 0, benchmark: 85, slouchedMinutes: 0 },
        { hour: "15:00", score: 0, benchmark: 85, slouchedMinutes: 0 },
        { hour: "17:00", score: 0, benchmark: 85, slouchedMinutes: 0 }
      ],
      recentSessions: []
    };
  }

  const totalDuration = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const avgScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.avgScore || 0), 0) / sessions.length) 
    : 84;
  const goodPercent = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + (s.goodPosturePercent || 0), 0) / sessions.length)
    : 82;
  const totalSlouches = sessions.reduce((acc, s) => acc + (s.slouchCount || 0), 0);
  const totalBreaks = sessions.reduce((acc, s) => acc + (s.breaksTaken || 0), 0);

  return {
    date: targetDate,
    summary: {
      avgScore,
      goodPercent,
      totalDurationMinutes: totalDuration,
      totalSlouchEvents: totalSlouches,
      breaksCompleted: totalBreaks,
      riskLevel: avgScore >= 85 ? "Low Ergonomic Risk" : (avgScore >= 70 ? "Moderate Ergonomic Strain" : "High Musculoskeletal Risk")
    },
    hourlyTrends: db.hourlyTrends || initialData.hourlyTrends,
    recentSessions: sessions.slice(0, 5)
  };
}

async function saveAssessment(assessmentData) {
  const db = readFallbackData();
  const assessment = {
    id: "asm_" + Date.now(),
    timestamp: new Date().toISOString(),
    ...assessmentData
  };
  if (!db.assessments) db.assessments = [];
  db.assessments.unshift(assessment);
  writeFallbackData(db);
  return assessment;
}

async function saveDemoRequest(requestData) {
  const db = readFallbackData();
  const item = {
    id: "demo_" + Date.now(),
    timestamp: new Date().toISOString(),
    ...requestData
  };
  if (!db.demoRequests) db.demoRequests = [];
  db.demoRequests.unshift(item);
  writeFallbackData(db);
  return item;
}

function getDatabaseStatus() {
  return {
    isMongoConnected,
    mode: isMongoConnected ? "MongoDB Atlas / Daemon" : "Resilient Persistent Local File Storage",
    status: "Healthy"
  };
}

module.exports = {
  initStorage,
  registerUser,
  authenticateUser,
  getUserById,
  updateUserProfile,
  updateUserPreferences,
  getUserDailyImprovement,
  addSession,
  getUserSessions,
  getDailyAnalytics,
  addPostureLog,
  createAlert,
  getUpcomingAlerts,
  saveWizardProgress,
  getWizardStatus,
  getTrends,
  getRecommendationsForUser,
  suggestMicrobreak,
  saveAssessment,
  saveDemoRequest,
  getDatabaseStatus
};
