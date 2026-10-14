const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  salt: { type: String },
  role: { type: String, default: "Employee" }, // Employee, Student, Remote Worker, Ergonomist
  org: { type: String, default: "General" },
  preferences: {
    audioAlerts: { type: Boolean, default: true },
    alertFrequencyMinutes: { type: Number, default: 25 },
    cameraMirror: { type: Boolean, default: true },
    targetScore: { type: Number, default: 85 }
  }
}, { timestamps: true });

// 2. PostureLogs Schema
const PostureLogSchema = new mongoose.Schema({
  userId: { type: String, default: "demo-user", index: true },
  timestamp: { type: Date, default: Date.now },
  score: { type: Number, required: true }, // 0 - 100
  angles: {
    neck: { type: Number, default: 0 },
    torso: { type: Number, default: 0 },
    shoulderTilt: { type: Number, default: 0 }
  },
  status: { type: String, enum: ["Optimal", "Mild Slouch", "Slouching"], default: "Optimal" },
  sessionId: { type: String }
}, { timestamps: true });

// 3. Alerts Schema
const AlertSchema = new mongoose.Schema({
  userId: { type: String, default: "demo-user", index: true },
  type: { type: String, enum: ["slouch", "movement", "break", "hydration"], default: "movement" },
  message: { type: String, required: true },
  scheduledAt: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

// 4. WizardProgress Schema
const WizardProgressSchema = new mongoose.Schema({
  userId: { type: String, default: "demo-user", index: true },
  stepsCompleted: { type: Number, default: 0 },
  setupData: {
    monitorEyeLevel: { type: String, default: "yes" },
    monitorDistance: { type: String, default: "arm_length" },
    chairLumbar: { type: String, default: "yes" },
    feetFlat: { type: String, default: "yes" },
    elbowAngle: { type: String, default: "90_degrees" },
    screenGlare: { type: String, default: "minimal" }
  },
  score: { type: Number, default: 85 },
  riskLevel: { type: String, default: "Low Risk" },
  recommendations: [{ type: String }]
}, { timestamps: true });

// 5. Analytics Schema
const AnalyticsSchema = new mongoose.Schema({
  userId: { type: String, default: "demo-user", index: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  hourlyScores: [{
    hour: { type: String, required: true },
    score: { type: Number, required: true },
    benchmark: { type: Number, default: 85 },
    slouchedMinutes: { type: Number, default: 0 }
  }],
  averageScore: { type: Number, default: 85 },
  trend: { type: String, enum: ["improving", "stable", "declining"], default: "stable" },
  totalTrackedMinutes: { type: Number, default: 0 },
  totalBreaks: { type: Number, default: 0 }
}, { timestamps: true });

// 6. Recommendations Schema
const RecommendationSchema = new mongoose.Schema({
  userId: { type: String, default: "all" },
  tip: { type: String, required: true },
  category: { type: String, enum: ["desk", "chair", "vision", "stretch", "habit"], default: "stretch" },
  priority: { type: Number, default: 1 }
}, { timestamps: true });

// 7. MicroBreaks Schema
const MicroBreakSchema = new mongoose.Schema({
  userId: { type: String, default: "demo-user" },
  sittingDuration: { type: Number, required: true }, // in minutes
  exercise: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in seconds
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Export Models
module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  PostureLog: mongoose.models.PostureLog || mongoose.model('PostureLog', PostureLogSchema),
  Alert: mongoose.models.Alert || mongoose.model('Alert', AlertSchema),
  WizardProgress: mongoose.models.WizardProgress || mongoose.model('WizardProgress', WizardProgressSchema),
  Analytics: mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema),
  Recommendation: mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema),
  MicroBreak: mongoose.models.MicroBreak || mongoose.model('MicroBreak', MicroBreakSchema)
};
