// server/index.js
// Express.js + Socket.io Server for IBVAP Border Surveillance Platform

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');

const DroneSimulator = require('./droneSimulator');
const AlertGenerator = require('./alertGenerator');
const MetricsEmitter = require('./metricsEmitter');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

// Enable CORS for frontend clients
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize simulation engines
const droneSimulator = new DroneSimulator(io);
const alertGenerator = new AlertGenerator(io, droneSimulator);
const metricsEmitter = new MetricsEmitter(io, alertGenerator);

/* =========================================================================
   REAL WEATHER INTEGRATION (OpenWeatherMap API + Smart Fallback)
   ========================================================================= */

const BORDER_COORDINATES = [
  { id: 'moreh', name: 'Moreh Border Sector', state: 'Manipur', lat: 24.2, lon: 94.2, altitude: '200m' },
  { id: 'nathula', name: 'Nathu La High Pass', state: 'Sikkim', lat: 27.3, lon: 88.6, altitude: '4,310m' },
  { id: 'wagah', name: 'Wagah Border ICP', state: 'Punjab', lat: 31.6, lon: 74.5, altitude: '215m' },
];

let weatherCache = {
  timestamp: Date.now(),
  data: [],
};

async function fetchBorderWeather() {
  const apiKey =
    process.env.REACT_APP_WEATHER_KEY ||
    process.env.OPENWEATHERMAP_KEY ||
    process.env.NEXT_PUBLIC_WEATHER_KEY;

  const results = [];

  for (const loc of BORDER_COORDINATES) {
    let locData = null;

    if (apiKey && apiKey !== 'your_openweathermap_api_key') {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: loc.lat,
            lon: loc.lon,
            appid: apiKey,
            units: 'metric',
          },
          timeout: 4000,
        });

        const d = response.data;
        const windKmph = Number((d.wind.speed * 3.6).toFixed(1));
        const visibilityKm = d.visibility ? Number((d.visibility / 1000).toFixed(1)) : 8.5;

        locData = {
          id: loc.id,
          name: loc.name,
          state: loc.state,
          lat: loc.lat,
          lon: loc.lon,
          temp: Math.round(d.main.temp),
          feelsLike: Math.round(d.main.feels_like),
          humidity: d.main.humidity,
          windSpeedKmph: windKmph,
          visibilityKm: visibilityKm,
          condition: d.weather[0]?.main || 'Clear',
          description: d.weather[0]?.description || 'Clear sky',
          icon: d.weather[0]?.icon || '01d',
          lowVisibilityAlert: visibilityKm < 2.0,
          droneGrounded: windKmph > 40.0,
          isLiveApi: true,
        };
      } catch (err) {
        console.warn(`[Weather] OpenWeatherMap API call failed for ${loc.name}: ${err.message}. Using high-fidelity model.`);
      }
    }

    // High-fidelity fallback if API key is not provided or quota exceeded
    if (!locData) {
      // Realistic regional weather characteristics
      let baseTemp = 28;
      let baseWind = 18;
      let baseVisibility = 8.5;
      let condition = 'Partly Cloudy';
      let icon = '02d';

      if (loc.id === 'nathula') {
        // High altitude pass: cold & windy
        baseTemp = Math.floor(Math.random() * 4 + 4); // 4 - 8°C
        baseWind = Math.floor(Math.random() * 15 + 32); // 32 - 47 kmph (tests drone grounding!)
        baseVisibility = Number((Math.random() * 2 + 1.2).toFixed(1)); // 1.2 - 3.2 km (tests low visibility!)
        condition = 'Alpine Fog / Gusts';
        icon = '50d';
      } else if (loc.id === 'moreh') {
        // Humid tropical hill region
        baseTemp = Math.floor(Math.random() * 5 + 26); // 26 - 31°C
        baseWind = Math.floor(Math.random() * 10 + 12); // 12 - 22 kmph
        baseVisibility = Number((Math.random() * 4 + 5.5).toFixed(1)); // 5.5 - 9.5 km
        condition = 'Tropical Haze';
        icon = '04d';
      } else {
        // Wagah Punjab plains
        baseTemp = Math.floor(Math.random() * 6 + 32); // 32 - 38°C
        baseWind = Math.floor(Math.random() * 12 + 14); // 14 - 26 kmph
        baseVisibility = Number((Math.random() * 3 + 6.0).toFixed(1));
        condition = 'Clear & Dry';
        icon = '01d';
      }

      locData = {
        id: loc.id,
        name: loc.name,
        state: loc.state,
        lat: loc.lat,
        lon: loc.lon,
        temp: baseTemp,
        feelsLike: baseTemp + 2,
        humidity: loc.id === 'moreh' ? 82 : loc.id === 'nathula' ? 68 : 45,
        windSpeedKmph: baseWind,
        visibilityKm: baseVisibility,
        condition,
        description: condition,
        icon,
        lowVisibilityAlert: baseVisibility < 2.0,
        droneGrounded: baseWind > 40.0,
        isLiveApi: false,
      };
    }

    results.push(locData);
  }

  weatherCache = {
    timestamp: Date.now(),
    data: results,
  };

  if (io) {
    io.emit('weatherUpdate', results);
  }

  return results;
}

// Initial fetch and 10-minute cron schedule
fetchBorderWeather();
cron.schedule('*/10 * * * *', () => {
  fetchBorderWeather();
});

/* =========================================================================
   REST API ENDPOINTS
   ========================================================================= */

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'IBVAP Central Security Hub',
    timestamp: new Date().toISOString(),
    istTime: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    uptimeSeconds: Math.floor(process.uptime()),
    nodesActive: 8,
    activeAlerts: alertGenerator.getAlerts().filter((a) => a.status === 'UNACKNOWLEDGED').length,
    activeDrones: droneSimulator.getDrones().length,
  });
});

app.get('/api/weather', async (req, res) => {
  // If cache is older than 10 minutes, refresh
  if (Date.now() - weatherCache.timestamp > 10 * 60 * 1000 || weatherCache.data.length === 0) {
    await fetchBorderWeather();
  }
  res.json(weatherCache.data);
});

app.get('/api/alerts', (req, res) => {
  res.json(alertGenerator.getAlerts());
});

app.post('/api/alerts/acknowledge', (req, res) => {
  const { alertId } = req.body;
  if (!alertId) {
    return res.status(400).json({ error: 'alertId is required' });
  }

  const updated = alertGenerator.acknowledgeAlert(alertId);
  if (!updated) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  res.json({ success: true, alert: updated });
});

app.get('/api/drones', (req, res) => {
  res.json({
    drones: droneSimulator.getDrones(),
    flightLogs: droneSimulator.getFlightLogs(),
  });
});

app.post('/api/drones/dispatch', (req, res) => {
  const { droneId, lat, lon, alertId } = req.body;
  if (!droneId || lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'droneId, lat, and lon are required' });
  }

  const drone = droneSimulator.dispatch(droneId, { lat: Number(lat), lon: Number(lon) }, alertId);
  if (!drone) {
    return res.status(404).json({ error: 'Drone not found' });
  }

  res.json({ success: true, drone });
});

app.get('/api/cameras', (req, res) => {
  const cameras = [
    { id: 'CAM-001', location: 'Petrapole ICP Checkpoint', lat: 23.017, lon: 88.917, zone: 'Charlie', status: 'Online', fps: 30, uptime: '99.9%' },
    { id: 'CAM-002', location: 'Hilli Border Outpost Fence', lat: 25.283, lon: 89.000, zone: 'Bravo', status: 'Online', fps: 29.8, uptime: '99.7%' },
    { id: 'CAM-003', location: 'Changrabandha Corridor', lat: 26.317, lon: 89.617, zone: 'Bravo', status: 'Online', fps: 30, uptime: '99.8%' },
    { id: 'CAM-004', location: 'Fulbari Riverine Sentry', lat: 26.550, lon: 88.733, zone: 'Alpha', status: 'Online', fps: 29.9, uptime: '99.9%' },
    { id: 'CAM-005', location: 'Ghojadanga Border Culvert', lat: 22.900, lon: 88.783, zone: 'Delta', status: 'Online', fps: 29.7, uptime: '99.5%' },
  ];
  res.json(cameras);
});

/* =========================================================================
   SOCKET.IO REAL-TIME EVENT STREAM
   ========================================================================= */

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send initial dataset immediately to newly connected client
  socket.emit('initial_data', {
    alerts: alertGenerator.getAlerts(),
    drones: droneSimulator.getDrones(),
    flightLogs: droneSimulator.getFlightLogs(),
    weather: weatherCache.data,
  });

  // Client requests manual drone dispatch
  socket.on('dispatchDrone', (data) => {
    const { droneId, lat, lon, alertId } = data;
    if (droneId && lat && lon) {
      droneSimulator.dispatch(droneId, { lat: Number(lat), lon: Number(lon) }, alertId);
    }
  });

  // Client acknowledges alert
  socket.on('acknowledgeAlert', (data) => {
    if (data?.alertId) {
      alertGenerator.acknowledgeAlert(data.alertId);
    }
  });

  // Client triggers test alert
  socket.on('manualAlertTrigger', () => {
    const alert = alertGenerator.createAlert();
    alertGenerator.alerts.unshift(alert);
    io.emit('alert', alert);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

/* =========================================================================
   SERVER START
   ========================================================================= */

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 IBVAP Tactical Surveillance Server Online`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🛰 WebSocket Endpoint: ws://localhost:${PORT}`);
  console.log(`🌦 Weather Coordinates: Moreh, Nathu La, Wagah`);
  console.log(`🚁 Drone Fleet: DRONE-1, DRONE-2, DRONE-3, DRONE-4`);
  console.log(`=======================================================`);
});
