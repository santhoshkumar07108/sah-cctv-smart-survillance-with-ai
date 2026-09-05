// server/metricsEmitter.js
// Real-time System Telemetry & ANPR Stream Emitter for SSB/BSF

const BOPS = [
  'BOP-1 Naksalbari',
  'BOP-2 Panitanki',
  'BOP-3 Raniganj',
  'BOP-4 Batasi',
  'BOP-5 Kharibari',
  'BOP-6 Galgalia',
  'BOP-7 Mechi River',
  'BOP-8 Ghoshpukur',
];

const CAMERAS = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004', 'CAM-005', 'CAM-012'];

const VEHICLE_TEMPLATES = [
  { plate: 'WB 02 KL 5678', type: 'Toyota Fortuner SUV', color: 'Pearl White', camera: 'CAM-001' },
  { plate: 'MH 04 AB 1234', type: 'Mahindra Scorpio-N', color: 'Midnight Black', camera: 'CAM-002' },
  { plate: 'AS 01 BF 4432', type: 'Isuzu D-Max 4x4', color: 'Forest Green', camera: 'CAM-003' },
  { plate: 'DL 01 CA 9921', type: 'Tata Nexon EV', color: 'Daytona Grey', camera: 'CAM-004' },
  { plate: 'UP 32 ER 3319', type: 'Tata Xenon Tactical', color: 'Olive Green', camera: 'CAM-005' },
  { plate: 'HR 26 DK 8812', type: 'Hyundai Creta', color: 'Titan Grey', camera: 'CAM-012' },
  { plate: 'BR 06 GH 7701', type: 'Maruti Suzuki Swift', color: 'Solid Red', camera: 'CAM-001' },
  { plate: 'SK 01 T 2024', type: 'Mahindra Bolero Camper', color: 'Arctic White', camera: 'CAM-003' },
  { plate: 'WB 74 H 1984', type: 'Ashok Leyland 1618 Cargo', color: 'Navy Blue', camera: 'CAM-002' },
];

class MetricsEmitter {
  constructor(io, alertGenerator) {
    this.io = io;
    this.alertGenerator = alertGenerator;

    // Requirement 5: System Metrics emitted every 3 seconds
    this.metricsInterval = setInterval(() => this.emitSystemHealth(), 3000);

    // Requirement 7: ANPR Plate detections emitted every 20 seconds
    this.anprInterval = setInterval(() => this.emitPlateDetection(), 20000);

    // Camera FPS updates every 4 seconds
    this.cameraStatusInterval = setInterval(() => this.emitCameraStatus(), 4000);
  }

  emitSystemHealth() {
    if (!this.io) return;

    const cpu = Number((Math.random() * 30 + 45).toFixed(1)); // 45-75% range
    const ram = Number((Math.random() * 20 + 60).toFixed(1)); // 60-80% range
    const storage = Number((Math.random() * 10 + 55).toFixed(1)); // 55-65%

    // Network latency per BOP: 20-200ms
    const bopLatencies = {};
    BOPS.forEach((bop) => {
      // BOP-3 and BOP-7 have degraded satellite link
      if (bop.includes('Raniganj') || bop.includes('Mechi River')) {
        bopLatencies[bop] = Math.floor(Math.random() * 80 + 350);
      } else {
        bopLatencies[bop] = Math.floor(Math.random() * 35 + 12);
      }
    });

    const payload = {
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu,
      ram,
      storage,
      networkLatency: Math.floor(Math.random() * 25 + 15),
      bopLatencies,
      activeConnections: Math.floor(Math.random() * 3 + 8),
    };

    this.io.emit('systemHealth', payload);
  }

  emitPlateDetection() {
    if (!this.io) return;

    const template = VEHICLE_TEMPLATES[Math.floor(Math.random() * VEHICLE_TEMPLATES.length)];
    const watchlistHit = Math.random() > 0.85; // 15% chance of hit
    const confidence = Number((Math.random() * 8 + 91).toFixed(1));

    const detection = {
      id: `PLT-${Math.floor(1000 + Math.random() * 9000)}`,
      plate: template.plate,
      vehicleType: template.type,
      color: template.color,
      cameraId: template.camera,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      watchlistHit,
      confidence,
      category: watchlistHit ? 'Suspect' : 'Civilian',
    };

    this.io.emit('plateDetected', detection);

    // Requirement 7: If watchlistHit === true -> also emit a HIGH severity alert
    if (watchlistHit && this.alertGenerator) {
      const highAlert = {
        id: `ALT-${Math.floor(8800 + Math.random() * 1100)}`,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
        cameraId: template.camera,
        location: `${template.camera} Checkpost`,
        zone: 'Charlie',
        type: 'VEHICLE',
        confidence: 97.5,
        coordinates: { lat: 23.017, lon: 88.917 },
        description: `CRITICAL WATCHLIST HIT: License Plate ${template.plate} flagged on national intercept index!`,
        aiModel: 'ANPR-Edge-IND v2.4',
        severity: 'HIGH',
        droneDispatched: false,
        status: 'UNACKNOWLEDGED',
      };

      this.alertGenerator.alerts.unshift(highAlert);
      this.io.emit('alert', highAlert);
    }
  }

  emitCameraStatus() {
    if (!this.io) return;

    CAMERAS.forEach((camId) => {
      this.io.emit('cameraStatus', {
        cameraId: camId,
        status: camId === 'CAM-002' ? 'Degraded' : 'Online',
        fps: Number((Math.random() * 6 + 24).toFixed(1)), // 24-30 fps
        uptime: '99.8%',
        bandwidthMbps: Number((Math.random() * 3 + 6).toFixed(2)),
      });
    });
  }
}

module.exports = MetricsEmitter;
