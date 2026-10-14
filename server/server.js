const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const storage = require('./storage');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus in-memory metrics store
const metrics = {
  totalRequests: 0,
  requestDurationMs: 0,
  statusCodes: { '2xx': 0, '4xx': 0, '5xx': 0 },
  activeConnections: 0
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Metrics collection middleware
app.use((req, res, next) => {
  const start = Date.now();
  metrics.totalRequests++;
  metrics.activeConnections++;

  res.on('finish', () => {
    metrics.activeConnections = Math.max(0, metrics.activeConnections - 1);
    const duration = Date.now() - start;
    metrics.requestDurationMs += duration;

    const code = res.statusCode;
    if (code >= 200 && code < 400) {
      metrics.statusCodes['2xx']++;
    } else if (code >= 400 && code < 500) {
      metrics.statusCodes['4xx']++;
    } else if (code >= 500) {
      metrics.statusCodes['5xx']++;
    }
  });

  next();
});

// Liveness & Readiness Health Probe
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'sitsmart-backend',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: storage.getDatabaseStatus()
  });
});

// Prometheus Scrape Endpoint
app.get('/metrics', (req, res) => {
  const avgDuration = metrics.totalRequests > 0 
    ? (metrics.requestDurationMs / metrics.totalRequests).toFixed(2) 
    : 0;

  res.set('Content-Type', 'text/plain');
  res.send(`# HELP sitsmart_http_requests_total Total number of HTTP requests
# TYPE sitsmart_http_requests_total counter
sitsmart_http_requests_total ${metrics.totalRequests}

# HELP sitsmart_http_request_duration_ms_avg Average HTTP request duration in milliseconds
# TYPE sitsmart_http_request_duration_ms_avg gauge
sitsmart_http_request_duration_ms_avg ${avgDuration}

# HELP sitsmart_http_status_codes Total status codes returned
# TYPE sitsmart_http_status_codes counter
sitsmart_http_status_codes{code="2xx"} ${metrics.statusCodes['2xx']}
sitsmart_http_status_codes{code="4xx"} ${metrics.statusCodes['4xx']}
sitsmart_http_status_codes{code="5xx"} ${metrics.statusCodes['5xx']}

# HELP sitsmart_active_connections Current active HTTP connections
# TYPE sitsmart_active_connections gauge
sitsmart_active_connections ${metrics.activeConnections}

# HELP sitsmart_app_uptime_seconds Process uptime in seconds
# TYPE sitsmart_app_uptime_seconds counter
sitsmart_app_uptime_seconds ${Math.round(process.uptime())}
`);
});

// Routes
app.use('/api', apiRoutes);

// Static frontend assets (production monolith deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/healthz' || req.path === '/metrics') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root greeting fallback if frontend is not built in this directory
  app.get('/', (req, res) => {
    res.json({
      name: "SitSmart – AI Ergonomics Live Platform API",
      tagline: "Sit Smart, Work Better",
      support: "UN SDG 3 (Good Health & Well-being)",
      healthProbe: "/healthz",
      metrics: "/metrics",
      docs: "/api/health"
    });
  });
}

// Start Server & Storage
async function startServer() {
  await storage.initStorage(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`🚀 SitSmart Server active on http://localhost:${PORT}`);
    console.log(`🩺 Health Probe: http://localhost:${PORT}/healthz`);
    console.log(`📊 Prometheus Metrics: http://localhost:${PORT}/metrics`);
  });
}

startServer();
