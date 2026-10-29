# SitSmart – AI Ergonomics Live Platform 🪑⚡
> **Tagline:** *Sit Smart, Work Better*  
> **Advancing UN SDG 3:** *Good Health & Well-being (Target 3.4)*  
> **Live Website:** [https://yogayen.github.io/SitSmart/](https://yogayen.github.io/SitSmart/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://yogayen.github.io/SitSmart/)
[![UN SDG 3](https://img.shields.io/badge/UN_SDG_3-Good_Health_%26_Well--being-4c9f38?style=for-the-badge)](https://sdgs.un.org/goals/goal3)
[![MediaPipe](https://img.shields.io/badge/AI_Vision-MediaPipe_Pose_Wasm-0097a7?style=for-the-badge)](https://developers.google.com/mediapipe)
[![React 18](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📖 Overview

**SitSmart** is an intelligent, real-time AI ergonomics workstation and seated wellness platform designed for employees, students, remote professionals, and campus candidates. Prolonged sedentary posture, laptop slouching, forward-head drift ("text-neck"), and improper seating habits significantly increase musculoskeletal strain and fatigue.

SitSmart eliminates these risks using **100% client-side computer vision** (MediaPipe Pose), **instant synthesized audio alarms**, **spoken voice guidance**, **interactive cartoon micro-breaks**, and a dedicated **Student Interview Seating Studio with live practice camera**.

---

## 🌟 Core Features & Modules

### 1. 🎯 Real-Time AI Posture Tracking & Biomechanics (`WebcamFeed.jsx`, `PostureGauge.jsx`, `biomechanics.js`)
* **33-Landmark Skeletal Joint Tracking:** Captures 2D body joints (ears, nose, shoulders, spine, hips, elbows, wrists) at 30 FPS using MediaPipe Pose.
* **Precise Biomechanical Angle Analytics:**
  * **Cervical / Neck Angle:** Measures forward head tilt relative to vertical (Ideal: 0°–15°).
  * **Torso Flexion Angle:** Measures spinal inclination (Ideal: 0°–12°).
  * **Shoulder Asymmetry Angle:** Detects uneven lateral leaning.
  * **Eye Horizon Level:** Flags downward gaze into notes, laps, or dropped screens.
  * **Forearm & Laptop Ergonomics:** Flags poor elbow support and wrist strain.
* **Dynamic Color-Coded HUD Overlay:**
  * 🟢 **Emerald Green (≥ 82%):** Optimal cervical and spinal alignment.
  * 🟡 **Amber Yellow (60%–81%):** Mild slouch or head-forward drift.
  * 🔴 **Crimson Red (< 60%):** Active slouch alert.
* **Floating Picture-in-Picture (PiP):** Allows keeping your camera feed and live skeleton lines pinned on top of all other windows while typing or coding.
* **100% On-Device Privacy:** Video frames are processed locally inside WebAssembly; zero camera imagery or biometric video is ever transmitted to a server.

---

### 2. 🔊 Immediate 2x Pop Sound + Spoken Audio Instructions (`audioAlerts.js`, `DashboardPage.jsx`)
* **Multi-Tasking Ergonomics:** Designed specifically for users working on other tabs, documents, IDEs, or spreadsheets who cannot see the SitSmart screen.
* **Instant Double-Pop Tone (`pop... pop!`):**
  * The moment posture drifts into the **yellow zone (< 82%)** or slouching begins, SitSmart immediately plays two distinct, punchy bubble pop tones (`400Hz ➔ 880Hz` and `540Hz ➔ 1200Hz`) via the Web Audio API.
* **Actionable Spoken Voice Guidance:**
  * 320ms later, browser Speech Synthesis speaks clear natural voice instructions explaining exactly what to do without needing to look at the screen:
    * *Chin / Head Drift:* `"Attention: Score in yellow. Lift your chin to eye level, sit tall, and roll your shoulders back."`
    * *Torso / Spine Slouch:* `"Attention: Score in yellow. Slouch detected. Pull your spine upright and engage your core."`
    * *Arm / Typing Drift:* `"Attention: Score in yellow. Relax your elbows and position forearms parallel to your desk."`
* **Concurrent Visual Message On Screen:**
  * Floating top notification banner with dynamic text and a **Replay** button.
  * Flashing browser tab title: `⚠️ (74%) Yellow Drift: Sit Up! - SitSmart`.
  * Desktop Push Notification for background tab awareness.
* **Success Chime:** Plays an uplifting 3-tone harmonic chime when posture returns to green (≥ 82%).

---

### 3. 🎓 Student Interview Guide & Live Practice Camera Studio (`StudentInterviewCoach.jsx`)
A specialized module created for college students, campus placement candidates, viva exams, civil services interviews, and corporate boards to master seated executive presence:

* **Top Sections Dashboard Line:** Easily accessible right from the sticky top navigation bar.
* **Live Practice Camera Studio:**
  * **👀 Cyan Judge Eye-Line Horizon:** Renders an eye-level guide across the canvas to keep students from looking down at their lap or notes.
  * **Executive Presence Score (0–100%):** Real-time evaluation of poise, symmetry, and spinal alignment.
  * **4 Real-Time Checkpoints:**
    1. `✓ Eyes Level with Panel Line` (Head held high, direct eye-line).
    2. `✓ 2/3 Chair Spine Engagement` (Sitting on front 2/3 of seat, engaging core).
    3. `✓ Shoulders Rolled & Level` (Open chest, relaxed clavicles).
    4. `✓ Hands Still & Grounded` (Flags face/throat touching as non-verbal anxiety tell).
* **Interactive Posture Simulator (4 Presets):** Practice and test sitting guides even without a webcam:
  1. *Optimal 5° Incline (Hire Ready)*
  2. *Looking Down into Lap (Nervous Tell)*
  3. *Slouching / Leaning Back (Arrogant / Low Energy)*
  4. *Nervous Neck Touching (Stress Signal)*
* **The 4 Golden Principles:** The 2/3 Chair Rule, 5° Active Listening Incline, Eye Contact Triangle, and Grounded Hand Placement.
* **5 Practical Guidance Tabs:** Entrance protocol, spine & voice resonance, multi-judge panel eye contact, hand gesture psychology, and handling pressure questions.
* **3-Minute Posture Hold Drill:** Countdown timer (`3:00`) with audio cues and diaphragmatic breathing prompts.

---

### 4. 🧘 Human Exercise Trainer Video Clips with Coach Maya's Spoken Voice Guidance (`MicroBreakModal.jsx`, `CartoonExerciseCoach.jsx`, `audioAlerts.js`)
* **Dedicated Human Exercise Trainer (Coach Maya):**
  * Demonstrates each exercise as a high-definition human trainer video clip with real-time movement pacing and biomechanical angle overlays.
  * Alex and ZenBot have been removed, making **Coach Maya** the focused, mindful wellness guide.
* **100% Spoken Voice Guidance (Zero Reading Required):**
  * When each exercise begins, Coach Maya automatically speaks out the full step-by-step instructions so users can simply watch her demonstration and listen.
  * **Midpoint Callout:** Automatic spoken audio cue at 50% elapsed time to guide switching sides or progressing the stretch.
  * **Completion Cheer:** Spoken audio praise celebrating the user's posture reset.
  * **Active Audio Equalizer Wave:** Real-time visual audio waveform indicator showing when Coach Maya is speaking.
  * **Voice Controls:** Quick Repeat Voice button and instant Voice Mute / Unmute toggle.
* **The 6 Targeted Ergonomic Workstation Exercises:**
  1. *Spine: Seated Torso Twist & Reach* — Torso twist with hand on opposite knee, 15s hold per side, ending in double overhead reach to decompress vertebrae.
  2. *Shoulders: Shoulder Rolls with Blade Squeeze* — Inhale shrug up, roll backward, and firmly pinch shoulder blades together (10 backward circles).
  3. *Eyes: The 20-20-20 Rule & Palming* — 20 seconds gazing 20 feet away, followed by 30 seconds of gentle warm palm cupping over closed eyes to relax optic nerves.
  4. *Hands: Wrist Flexor/Extensor Stretch & Finger Spreads* — Palm out finger pull back (15s), downward extensor press (15s), followed by wide finger spreads and tight fist contractions (5 reps).
  5. *Neck: Upper Trapezius Side Tilt & Chin Tuck* — Ear-to-shoulder side drop with subtle hand weight (20s per side), followed by 5 double-chin tuck repetitions.
  6. *Knee: Seated Straight-Leg Extension* — Leg straightened parallel to the floor, foot flexed toward shin, quadricep contraction (3–5s hold, 10–12 reps per leg) to circulate synovial lubricating fluid.

---

### 5. 📋 Ergonomic Workstation Assessment Wizard (`WizardPage.jsx`, `AssessmentWizard.jsx`, `ErgonomicWizard.jsx`)
* 5-step diagnostic assessment covering:
  * Monitor height & viewing distance
  * Chair lumbar support, armrests, and seat depth
  * Desk height & 90°–100° elbow angle
  * Lighting conditions and screen glare
* Generates an Ergonomic Risk Index (Low / Moderate / High) and personalized corrective recommendations.

---

### 6. 📈 Daily Improvement Tracker & Analytics (`DailyImprovement.jsx`, `AnalyticsDashboard.jsx`)
* **Session Telemetry:** Session duration, good posture percentage ratios, slouch event counters, and completed micro-breaks.
* **Hourly Trend Graphs:** Line and bar charts showing posture score evolution throughout the day.
* **Resilient Dual Storage:** Seamless offline-first browser storage with optional cloud MongoDB persistence.

---

## 📁 Repository Structure & Clean Code Layout

```
SitSmart/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages CI/CD deployment workflow
├── client/                         # Frontend React + Vite SPA
│   ├── public/                     # Exercise illustrations and static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertsPopup.jsx             # Corner slouch alerts and reminders
│   │   │   ├── AnalyticsDashboard.jsx      # Hourly posture score charts
│   │   │   ├── AnimeStretchCharacter.jsx   # Vector cartoon exercise illustrations
│   │   │   ├── AssessmentWizard.jsx        # Workstation diagnostic quiz
│   │   │   ├── AuthModal.jsx               # User login & registration modal
│   │   │   ├── CartoonExerciseCoach.jsx    # Animated cartoon stretch player
│   │   │   ├── DailyImprovement.jsx        # Posture streak & history tracker
│   │   │   ├── DemoContactModal.jsx        # Enterprise demo contact modal
│   │   │   ├── ErgonomicWizard.jsx         # Step-by-step setup evaluator
│   │   │   ├── ErrorBoundary.jsx           # React crash protection boundary
│   │   │   ├── Features.jsx                # Landing page features grid
│   │   │   ├── Footer.jsx                  # Footer with SDG 3 disclosures
│   │   │   ├── Hero.jsx                    # Hero section with interactive CTA
│   │   │   ├── HumanExerciseCoach.jsx      # 4K human stretch demonstration player
│   │   │   ├── LiveTracker.jsx             # Quick tracker preview component
│   │   │   ├── MicroBreakModal.jsx         # Guided micro-break popup modal
│   │   │   ├── Navbar.jsx                  # Responsive nav, live score badge & mute
│   │   │   ├── PostureGauge.jsx            # SVG circular gauge (0-100%) & status
│   │   │   ├── Recommendations.jsx         # Personalized ergonomic advice
│   │   │   ├── SDGImpact.jsx               # UN SDG 3 health impact metrics
│   │   │   ├── StudentInterviewCoach.jsx   # Student interview guide & live camera
│   │   │   ├── Testimonials.jsx            # User reviews & clinical feedback
│   │   │   ├── UserProfileModal.jsx        # Profile and session history
│   │   │   └── WebcamFeed.jsx              # MediaPipe Pose tracking & HUD canvas
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx           # Main workstation layout & top section bar
│   │   │   ├── LandingPage.jsx             # Public homepage & interview banner
│   │   │   └── WizardPage.jsx              # Workstation setup assessment page
│   │   ├── services/
│   │   │   └── api.js                      # REST API client with offline fallback
│   │   ├── utils/
│   │   │   ├── audioAlerts.js              # Web Audio 2x pop & Speech Synthesis
│   │   │   ├── biomechanics.js             # Biomechanical angle calculation math
│   │   │   ├── notifications.js            # Desktop system notification dispatcher
│   │   │   └── poseUtils.js                # MediaPipe landmark utilities & drawing
│   │   ├── App.jsx                         # Main router, state sync & hash routes
│   │   ├── index.css                       # Tailwind CSS & custom design tokens
│   │   └── main.jsx                        # React root entrypoint
│   ├── index.html                          # HTML5 shell & MediaPipe CDNs
│   ├── package.json                        # Frontend dependencies
│   ├── tailwind.config.js                  # Ergonomic color palette & animations
│   └── vite.config.js                      # Relative base './' for GitHub Pages
├── server/                         # Optional Node.js Backend API
│   ├── routes/
│   │   └── api.js                          # Express REST API routes
│   ├── models.js                           # Mongoose data models
│   ├── server.js                           # Express server & health probes
│   ├── storage.js                          # Dual MongoDB / JSON file adapter
│   └── package.json                        # Server dependencies
├── monitoring/                     # DevOps Telemetry (Prometheus & Grafana)
├── sitsmart-chart/                 # Production Kubernetes Helm Chart
├── docker-compose.yml              # Local multi-service container compose
├── package.json                    # Root monorepo workspace scripts
└── README.md                       # Comprehensive platform documentation
```

---

## 💻 Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shindesanika075/SitSmart.git
   cd SitSmart
   ```

2. **Install all dependencies:**
   ```bash
   npm run build
   ```

3. **Start the local development platform:**
   ```bash
   npm start
   ```
   * Frontend opens on: `http://localhost:5173/`
   * Backend API listens on: `http://localhost:5000/api/health`

---

## 🚀 Deployment

### Method 1: GitHub Pages (Recommended for Frontend)
The repository includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for automated static deployment with free HTTPS:
1. In your GitHub repository, navigate to **Settings** ➔ **Pages**.
2. Under **Build and deployment** ➔ **Source**, select **`GitHub Actions`**.
3. Push to `main` — GitHub will build and publish your site at:  
   `https://<username>.github.io/<repo-name>/`

### Method 2: Docker Compose
```bash
docker compose up -d --build
```
* Frontend served on port `80`
* Backend API served on port `5000`

---

## 🔒 Privacy & Data Ethics

SitSmart follows a **Privacy-First** architecture:
* **No Video Uploads:** Live webcam frames are analyzed frame-by-frame entirely inside the browser's local memory via WebAssembly.
* **No Facial Recognition:** SitSmart computes only angular relationships between skeletal joints (shoulders, neck, spine); no facial biometric profiles or identities are stored.

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
