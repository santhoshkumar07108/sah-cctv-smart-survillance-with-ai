// server/alertGenerator.js
// Automated Border Security Alert Generation Engine for SSB/BSF Surveillance

const { v4: uuidv4 } = require('uuid');

const CAMERAS = [
  { id: 'CAM-001', location: 'Petrapole ICP Checkpoint', zone: 'Charlie', coordinates: { lat: 23.017, lon: 88.917 } },
  { id: 'CAM-002', location: 'Hilli Border Outpost Fence', zone: 'Bravo', coordinates: { lat: 25.283, lon: 89.000 } },
  { id: 'CAM-003', location: 'Changrabandha Zero Line Corridor', zone: 'Bravo', coordinates: { lat: 26.317, lon: 89.617 } },
  { id: 'CAM-004', location: 'Fulbari Riverine Sentry', zone: 'Alpha', coordinates: { lat: 26.550, lon: 88.733 } },
  { id: 'CAM-005', location: 'Ghojadanga Border Culvert', zone: 'Delta', coordinates: { lat: 22.900, lon: 88.783 } },
  { id: 'CAM-012', location: 'Panitanki ICP Gate 1', zone: 'Charlie', coordinates: { lat: 26.712, lon: 88.261 } },
  { id: 'CAM-019', location: 'Mechi River Sandbar Crossing', zone: 'Alpha', coordinates: { lat: 26.685, lon: 88.192 } },
  { id: 'CAM-034', location: 'Tea Estate Perimeter Line East', zone: 'Delta', coordinates: { lat: 26.640, lon: 88.310 } },
  { id: 'CAM-041', location: 'Nathu La High Pass Watchtower', zone: 'Echo', coordinates: { lat: 27.386, lon: 88.831 } },
];

const ALERT_TEMPLATES = [
  {
    type: 'INTRUSION',
    desc: 'Human thermal silhouette breaching primary barbed concertina fence.',
    model: 'YOLO-v9-BorderSec Thermal',
  },
  {
    type: 'VEHICLE',
    desc: 'Unregistered 4x4 pickup detected traversing restricted border patrol track.',
    model: 'ANPR-Edge-IND v2.4',
  },
  {
    type: 'FACE_MATCH',
    desc: 'Biometric identification hit against national border watchlist dossier.',
    model: 'FaceID-Military-v2',
  },
  {
    type: 'LOITERING',
    desc: 'Individual stationary in international buffer zone for greater than 10 minutes.',
    model: 'YOLO-v9-Track',
  },
  {
    type: 'NIGHT_MOVEMENT',
    desc: 'Low-light thermal detection of movement along shallow river sandbank.',
    model: 'ThermalNet-v3 IR Sentry',
  },
  {
    type: 'OBJECT_ABANDONED',
    desc: 'Unattended parcel discarded beneath boundary culvert pipe.',
    model: 'YOLO-v9-BorderSec Stationary',
  },
  {
    type: 'DRONE_ALERT',
    desc: 'Low-altitude unidentified aerial rotorcraft crossing international zero line.',
    model: 'AeroAcoustic-Radar-v1',
  },
];

class AlertGenerator {
  constructor(io, droneSimulator) {
    this.io = io;
    this.droneSimulator = droneSimulator;
    this.alerts = [];
    this.timer = null;

    // Seed initial 5 alerts
    for (let i = 0; i < 5; i++) {
      this.alerts.push(this.createAlert(true));
    }

    this.scheduleNextAlert();
  }

  getAlerts() {
    return this.alerts;
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'ACKNOWLEDGED';
      if (this.io) {
        this.io.emit('alert_acknowledged', { alertId, status: 'ACKNOWLEDGED' });
      }
      return alert;
    }
    return null;
  }

  createAlert(isSeed = false) {
    const cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
    const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const confidence = Number((Math.random() * 45 + 52).toFixed(1)); // 52% - 97%

    let severity = 'LOW';
    if (confidence >= 85 || template.type === 'INTRUSION' || template.type === 'DRONE_ALERT') {
      severity = 'HIGH';
    } else if (confidence >= 65) {
      severity = 'MEDIUM';
    }

    const alert = {
      id: `ALT-${Math.floor(8800 + Math.random() * 1100)}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      cameraId: cam.id,
      location: cam.location,
      zone: cam.zone,
      type: template.type,
      confidence,
      coordinates: {
        lat: cam.coordinates.lat + (Math.random() - 0.5) * 0.005,
        lon: cam.coordinates.lon + (Math.random() - 0.5) * 0.005,
      },
      description: template.desc,
      aiModel: template.model,
      severity,
      droneDispatched: false,
      dispatchedDroneId: null,
      status: 'UNACKNOWLEDGED',
    };

    // Requirement 6: When alert confidence is between 50-85%:
    // Auto-trigger drone dispatch event via WebSocket
    if (!isSeed && confidence >= 50 && confidence <= 85 && this.droneSimulator) {
      const dispatchedDrone = this.droneSimulator.autoDispatchForAlert(alert);
      if (dispatchedDrone) {
        alert.droneDispatched = true;
        alert.dispatchedDroneId = dispatchedDrone.id;
      }
    }

    return alert;
  }

  scheduleNextAlert() {
    // Generate an alert every 8 to 15 seconds as specified
    const delayMs = Math.floor(Math.random() * 7000 + 8000);

    this.timer = setTimeout(() => {
      const newAlert = this.createAlert();
      this.alerts.unshift(newAlert);
      if (this.alerts.length > 50) this.alerts.pop();

      if (this.io) {
        this.io.emit('alert', newAlert);
      }

      this.scheduleNextAlert();
    }, delayMs);
  }
}

module.exports = AlertGenerator;
