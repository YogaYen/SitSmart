# SitSmart – Deployment Guide 🚀

> **Crucial for AI Webcam**: Modern web browsers require **HTTPS** (SSL) to access webcam devices on public domains. Both Render and Vercel provide free automatic HTTPS out of the box.

---

## 🌟 Method 1: Render.com (Recommended – Free & Easiest All-in-One)

Render deploys both the **React Frontend** and **Node.js Backend** together in a single free web service.

### Step 1: Push Code to GitHub
1. In your terminal inside the SitSmart folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SitSmart platform"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sitsmart.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in.
2. Click **New +** -> **Web Service**.
3. Connect your **sitsmart** GitHub repository.
4. Configure the service:
   - **Name:** `sitsmart-app`
   - **Region:** Any close to you (e.g., Singapore, Frankfurt, Oregon)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm run serve
     ```
   - **Instance Type:** `Free`
5. In **Environment Variables** (optional):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *(Optional: paste your MongoDB Atlas URI if you have one; otherwise SitSmart uses resilient file storage)*
6. Click **Create Web Service**.
7. In ~2 minutes, Render will provide a free live URL: `https://sitsmart-app.onrender.com` with HTTPS enabled!

---

## ⚡ Method 2: Vercel (Frontend) + Render (Backend)

For global edge CDN performance:

### Step 1: Deploy Backend to Render
1. Follow the Render steps above, but set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
2. Copy your backend URL: e.g. `https://sitsmart-backend.onrender.com`.

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your `sitsmart` GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://sitsmart-backend.onrender.com` (your backend URL)
5. Click **Deploy**.

---

## 🐳 Method 3: Docker & Docker Compose (VPS / Cloud Server)

If deploying to your own server (DigitalOcean, AWS EC2, Linode, Ubuntu VPS):

1. Clone your repository onto the server:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sitsmart.git
   cd sitsmart
   ```
2. Launch with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Services running:
   - Frontend: `http://<your-server-ip>:80`
   - Backend API: `http://<your-server-ip>:5000`
   - MongoDB: `localhost:27017`

> *Tip: Point a domain name to your server and use Certbot (`certbot --nginx`) or Cloudflare to enable free HTTPS so the webcam functions smoothly.*

---

## 💻 Method 4: Local Production Run (Office / Intranet)

To run the optimized production build locally on your machine or local network:
```bash
npm run prod
```
Then open `http://localhost:5000` in your browser.
