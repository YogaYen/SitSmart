# SitSmart – AI Ergonomics Live Platform
> **Tagline:** *Sit Smart, Work Better*  
> **Advancing UN SDG 3:** *Good Health & Well-being (Target 3.4)*  
> **Live Site:** [https://shindesanika075.github.io/SitSmart/](https://shindesanika075.github.io/SitSmart/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://shindesanika075.github.io/SitSmart/)

SitSmart is an AI-powered ergonomics live platform that helps employees, students, remote workers, and corporate organizations reduce the physical and musculoskeletal health risks of prolonged sitting. Featuring real-time on-device computer vision posture analysis, step-by-step ergonomic workstation wizards, proactive movement alerts, and evidence-based micro-breaks, it directly supports SDG 3 by preventing spinal strain and fostering lasting workplace wellness.

---

## 🚀 Key Features

### 1. Live Webcam Pose Tracking (`WebcamFeed.jsx`)
- **Real-Time Skeletal Joint Tracking:** Captures 2D body keypoints (ears, nose, shoulders, spine, hips) at 30 FPS using MediaPipe Pose.
- **Dynamic Color-Coded Skeletal Overlay:**
  - 🟢 **Emerald Green:** Optimal cervical and spinal alignment.
  - 🟡 **Amber Yellow:** Mild head tilt or shoulder asymmetry.
  - 🔴 **Crimson Red:** Slouching alert.
- **100% On-Device Privacy:** All vision models run client-side in the browser via WebAssembly. Zero video frames or webcam images are ever transmitted to any server.
- **Interactive Simulated Demo Mode:** Allows testing on any device without webcam hardware or camera permissions.

### 2. Biomechanical Angle Calculations & Dynamic Posture Score (`PostureGauge.jsx`, `poseUtils.js`)
- **Neck Inclination Angle:** Measures cervical angle between ear and shoulder relative to the vertical axis (Ideal: 0°–15°).
- **Torso Flexion Angle:** Measures spinal inclination relative to vertical (Ideal: 0°–12°).
- **Shoulder Asymmetry:** Measures horizontal shoulder tilt to detect uneven leaning.
- **Dynamic 0–100% Posture Score Gauge:** Smooth circular SVG gauge with Exponential Moving Average (EMA) smoothing to eliminate jitter.

### 3. Smart Movement & Stretch Alerts (`AlertsPopup.jsx`, `notifications.js`)
- **5-Second Slouch Warning:** Visual pop-up alert and gentle Web Audio chime when poor posture persists.
- **20-20-20 Rule Prompts:** Prompts users every 20 minutes to gaze 20 feet away for 20 seconds.
- **Synthesized Audio:** Built with Web Audio API (zero external audio file dependencies).

### 4. Step-by-Step Ergonomic Assessment Wizard (`ErgonomicWizard.jsx`, `WizardPage.jsx`)
- 5-step evaluator for:
  - Monitor height & horizontal eye-level alignment
  - Chair lumbar support & seat depth
  - Desk & elbow 90°–100° angles
  - Screen glare and environmental illumination
- Instant calculation of Ergonomic Risk Index and printable/downloadable PDF-ready action plan.

### 5. Daily Analytics Dashboard (`AnalyticsDashboard.jsx`, `DashboardPage.jsx`)
- Hourly posture score trends throughout the workday (09:00 - 17:00).
- Session tracking (average posture, good posture ratio %, slouch events count, micro-breaks completed).
- Ergonomic Risk Index classification (Low Risk / Moderate Strain / High Strain).

### 6. Micro-Break Stretch Engine (`MicroBreakModal.jsx`)
- Guided 20-30 second desk exercises with countdown timers and biomechanical benefits:
  1. *Upper Trapezius Release*
  2. *Scapular Retraction (Shoulder Pinch)*
  3. *20-20-20 Eye Strain Reset*
  4. *Seated Torso Spinal Twist*
  5. *Wrist & Finger Flexor Stretch*
  6. *Chest & Anterior Shoulder Opener*

---

## 🧩 Architecture & Developer Handoff

```
client/
├── src/
│   ├── components/
│   │   ├── WebcamFeed.jsx           # Live webcam stream, MediaPipe Pose, skeleton overlay
│   │   ├── PostureGauge.jsx         # Circular SVG 0-100% posture gauge & angles readout
│   │   ├── AlertsPopup.jsx          # Corner movement & slouch pop-up alerts
│   │   ├── ErgonomicWizard.jsx      # 5-step workstation setup wizard with progress bar
│   │   ├── AnalyticsDashboard.jsx   # Hourly posture score line & bar charts
│   │   ├── MicroBreakModal.jsx      # Micro-break player with animated countdowns
│   │   └── Navbar.jsx               # Navigation tabs, live score badge, audio mute
│   ├── pages/
│   │   ├── LandingPage.jsx          # Hero, About SDG 3, Features, Benefits, Testimonials
│   │   ├── DashboardPage.jsx        # Workstation layout: Webcam left, Gauge right, Alerts bottom
│   │   └── WizardPage.jsx           # Dedicated assessment page with OSHA/ISO guidelines
│   ├── utils/
│   │   ├── poseUtils.js             # Joint angles, scoring math, skeleton drawing
│   │   └── notifications.js         # Web Audio chimes & system notifications
│   ├── services/
│   │   └── api.js                   # REST API client with local fallback cache
│   └── App.jsx                      # Multi-page router coordination & global state
server/
├── models.js                        # Mongoose Schemas (Users, PostureLogs, Alerts, Wizard, Analytics)
├── routes/
│   └── api.js                       # Express REST endpoints
├── storage.js                       # Dual-engine: MongoDB Atlas + resilient local JSON adapter
├── test_api.js                      # Automated endpoint test suite
└── server.js                        # Express server, /healthz probe, Prometheus metrics
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/healthz` | Kubernetes liveness/readiness health probe |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint |
| `GET` | `/api/health` | Service and database engine status |
| `POST` | `/api/posture/analyze` | Evaluate biomechanical angles & posture score |
| `POST` | `/api/alerts/create` | Create scheduled movement or slouch alert |
| `GET` | `/api/alerts/upcoming/:userId` | Retrieve pending alerts for a user |
| `POST` | `/api/wizard/setup` | Save workstation ergonomic setup progress |
| `GET` | `/api/wizard/status/:userId` | Get user wizard status and recommendations |
| `GET` | `/api/analytics/daily/:userId` | Daily summary, hourly scores, and risk index |
| `GET` | `/api/analytics/trends/:userId` | 7-day posture score trends & breakdown |
| `GET` | `/api/recommendations/:userId` | Personalized ergonomic tips & active setup |
| `POST` | `/api/microbreak/suggest` | Dynamic stretch recommendation by sitting duration |
| `POST` | `/api/sessions` | Record completed posture tracking session |
| `POST` | `/api/assessments` | Evaluate questionnaire and return risk rating |
| `POST` | `/api/demo-request` | Submit corporate wellness demo request |

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

- **Users:** `name`, `email`, `role`, `org`, `preferences` (audioAlerts, alertFrequencyMinutes, targetScore)
- **PostureLogs:** `userId`, `timestamp`, `score`, `angles` (neck, torso, shoulderTilt), `status`
- **Alerts:** `userId`, `type`, `message`, `scheduledAt`, `delivered`
- **WizardProgress:** `userId`, `stepsCompleted`, `setupData`, `score`, `riskLevel`, `recommendations`
- **Analytics:** `userId`, `date`, `hourlyScores`, `averageScore`, `trend`, `totalTrackedMinutes`
- **Recommendations:** `userId`, `tip`, `category`, `priority`
- **MicroBreaks:** `userId`, `sittingDuration`, `exercise`, `duration`, `completedAt`

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Start API Server
```bash
cd server
npm install
npm run dev
```
*Server running on `http://localhost:5000`*  
*Run test suite: `npm test`*

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend running on `http://localhost:5173`*

---

## ⚙️ DevOps & Cloud Deployment

### Docker & Docker Compose
To run the full stack (Frontend + Backend + MongoDB) with persistent volumes:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:80` (or `http://localhost:5173`)
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Kubernetes Helm Deployment (EKS / AKS)
Deploy to your Kubernetes cluster using the provided Helm chart:
```bash
helm install sitsmart ./sitsmart-chart --namespace sitsmart --create-namespace
```
Features included in the chart:
- Ingress with TLS support via NGINX Ingress Controller
- Horizontal Pod Autoscaling (HPA) based on CPU and memory
- ConfigMap and secret mounting
- Persistent volume claims for MongoDB

### Monitoring & Observability
- **Prometheus:** Scrapes `/metrics` every 15s (`monitoring/prometheus.yml`)
- **Grafana Dashboard:** Pre-configured JSON dashboard (`monitoring/grafana-dashboard.json`) covering:
  - Operations (API latency, status codes, request throughput)
  - Application Telemetry (active workstations, slouch vs. optimal ratio)
  - Business & SDG 3 Impact (micro-breaks taken, organizational posture health score)
