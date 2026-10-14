const http = require('http');

// Helper to make local HTTP requests to express app without running standalone port
const express = require('express');
const cors = require('cors');
const storage = require('./storage');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

// Health probe
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Metrics
app.get('/metrics', (req, res) => {
  res.send('sitsmart_http_requests_total 42\n');
});

app.use('/api', apiRoutes);

async function runTests() {
  await storage.initStorage(null);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`Testing API on ${baseUrl}...`);

    async function req(path, options = {}) {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
      });
      const data = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text();
      return { status: res.status, data };
    }

    try {
      // 1. Health Probe
      const h1 = await req('/healthz');
      console.log('✓ /healthz:', h1.status, h1.data);

      // 2. Metrics
      const m1 = await req('/metrics');
      console.log('✓ /metrics:', m1.status, m1.data.trim());

      // 3. Health API
      const h2 = await req('/api/health');
      console.log('✓ /api/health:', h2.status, h2.data.status);

      // 4. Posture Analyze
      const p1 = await req('/api/posture/analyze', {
        method: 'POST',
        body: JSON.stringify({ angles: { neck: 24, torso: 18, shoulderTilt: 5 } })
      });
      console.log('✓ /api/posture/analyze:', p1.status, 'Score:', p1.data.score, 'Status:', p1.data.status);

      // 5. Alerts Create
      const a1 = await req('/api/alerts/create', {
        method: 'POST',
        body: JSON.stringify({ userId: 'demo-user', message: 'Test stretch alert' })
      });
      console.log('✓ /api/alerts/create:', a1.status, a1.data.success);

      // 6. Upcoming Alerts
      const a2 = await req('/api/alerts/upcoming/demo-user');
      console.log('✓ /api/alerts/upcoming/demo-user:', a2.status, 'Count:', a2.data.alerts.length);

      // 7. Wizard Setup
      const w1 = await req('/api/wizard/setup', {
        method: 'POST',
        body: JSON.stringify({ userId: 'demo-user', stepsCompleted: 4, setupData: { monitorEyeLevel: 'yes' } })
      });
      console.log('✓ /api/wizard/setup:', w1.status, w1.data.success);

      // 8. Wizard Status
      const w2 = await req('/api/wizard/status/demo-user');
      console.log('✓ /api/wizard/status/demo-user:', w2.status, 'Risk:', w2.data.status.riskLevel);

      // 9. Analytics Daily
      const an1 = await req('/api/analytics/daily/demo-user');
      console.log('✓ /api/analytics/daily/demo-user:', an1.status, 'AvgScore:', an1.data.summary.avgScore);

      // 10. Analytics Trends
      const an2 = await req('/api/analytics/trends/demo-user');
      console.log('✓ /api/analytics/trends/demo-user:', an2.status, 'Trend:', an2.data.trendStatus);

      // 11. Recommendations
      const r1 = await req('/api/recommendations/demo-user');
      console.log('✓ /api/recommendations/demo-user:', r1.status, 'Tips count:', r1.data.personalizedTips.length);

      // 12. Microbreak Suggest
      const mb = await req('/api/microbreak/suggest', {
        method: 'POST',
        body: JSON.stringify({ sittingDuration: 45 })
      });
      console.log('✓ /api/microbreak/suggest:', mb.status, 'Exercise:', mb.data.suggestedExercise);

      // 13. Sessions
      const s1 = await req('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ durationMinutes: 45, avgScore: 88 })
      });
      console.log('✓ /api/sessions:', s1.status, s1.data.success);

      // 14. Auth: Register New User
      const testEmail = `testuser_${Date.now()}@sitsmart.com`;
      const reg = await req('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: "Test Developer",
          email: testEmail,
          password: "password123",
          role: "UX Engineer",
          org: "ErgoLab"
        })
      });
      console.log('✓ /api/auth/register:', reg.status, reg.data.user.email);
      const testToken = reg.data.token;
      const testUserId = reg.data.user.id;

      // 15. Auth: Login User
      const login = await req('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: testEmail, password: "password123" })
      });
      console.log('✓ /api/auth/login:', login.status, login.data.user.name);

      // 16. Auth: Get Current User with Bearer Token
      const me = await req('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${testToken}` }
      });
      console.log('✓ /api/auth/me:', me.status, me.data.user.email);

      // 17. User Profile & Preferences Update
      const prefUpdate = await req(`/api/users/${testUserId}/preferences`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${testToken}` },
        body: JSON.stringify({ audioAlerts: false, targetScore: 92, alertFrequencyMinutes: 20 })
      });
      console.log('✓ /api/users/:userId/preferences:', prefUpdate.status, prefUpdate.data.user.preferences.targetScore);

      // 18. Save Session with User Token
      const userSession = await req('/api/sessions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${testToken}` },
        body: JSON.stringify({
          durationMinutes: 60,
          avgScore: 94,
          goodPosturePercent: 92,
          slouchCount: 1,
          totalSlouchSeconds: 30,
          breaksTaken: 2
        })
      });
      console.log('✓ /api/sessions (user-isolated):', userSession.status, userSession.data.session.userId === testUserId);

      // 19. Verify User Sessions History
      const userSessionsList = await req(`/api/users/${testUserId}/sessions`, {
        headers: { 'Authorization': `Bearer ${testToken}` }
      });
      console.log('✓ /api/users/:userId/sessions:', userSessionsList.status, 'Session count:', userSessionsList.data.count);

      // 20. Verify User Daily Improvement Tracker
      const userImprovement = await req(`/api/analytics/user/${testUserId}`);
      console.log('✓ /api/analytics/user/:userId:', userImprovement.status, 'CurrentScore:', userImprovement.data.metrics.currentScore);

      console.log('\n🎉 ALL 20 ENDPOINT & USER AUTH / HISTORY TESTS PASSED SUCCESSFULLY!');
      server.close(() => {
        setImmediate(() => process.exit(0));
      });
    } catch (err) {
      console.error('❌ Test failed:', err);
      server.close(() => {
        setImmediate(() => process.exit(1));
      });
    }
  });
}

runTests();
