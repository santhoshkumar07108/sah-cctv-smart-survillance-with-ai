// server/droneSimulator.js
// Real-time Tactical Drone Fleet Simulation for Indian Border Security (SSB/BSF)

const DRONE_BASES = {
  'DRONE-1': { id: 'DRONE-1', name: 'Garuda-1 Sentry', baseName: 'BOP Panitanki Airfield', baseLat: 26.71, baseLon: 88.26, maxSpeedKmph: 75 },
  'DRONE-2': { id: 'DRONE-2', name: 'Netra-2 Long-Range', baseName: 'BOP Mechi River Helipad', baseLat: 26.68, baseLon: 88.19, maxSpeedKmph: 85 },
  'DRONE-3': { id: 'DRONE-3', name: 'Trishul-3 Thermal Scout', baseName: 'BOP Hilli Outpost', baseLat: 25.28, baseLon: 89.00, maxSpeedKmph: 80 },
  'DRONE-4': { id: 'DRONE-4', name: 'Vayu-4 Fast Interceptor', baseName: 'BOP Petrapole Terminal', baseLat: 23.02, baseLon: 88.92, maxSpeedKmph: 90 },
};

class DroneSimulator {
  constructor(io) {
    this.io = io;
    this.drones = {
      'DRONE-1': {
        id: 'DRONE-1',
        name: 'Garuda-1 Sentry',
        status: 'STANDBY', // STANDBY, DISPATCHED, EN_ROUTE, ON_SITE, RETURNING
        lat: 26.71,
        lon: 88.26,
        baseLat: 26.71,
        baseLon: 88.26,
        targetLat: null,
        targetLon: null,
        battery: 98,
        etaSeconds: 0,
        missionId: null,
        alertId: null,
        timeOnSite: 0,
        altitudeMeters: 0,
      },
      'DRONE-2': {
        id: 'DRONE-2',
        name: 'Netra-2 Long-Range',
        status: 'STANDBY',
        lat: 26.68,
        lon: 88.19,
        baseLat: 26.68,
        baseLon: 88.19,
        targetLat: null,
        targetLon: null,
        battery: 92,
        etaSeconds: 0,
        missionId: null,
        alertId: null,
        timeOnSite: 0,
        altitudeMeters: 0,
      },
      'DRONE-3': {
        id: 'DRONE-3',
        name: 'Trishul-3 Thermal Scout',
        status: 'STANDBY',
        lat: 25.28,
        lon: 89.00,
        baseLat: 25.28,
        baseLon: 89.00,
        targetLat: null,
        targetLon: null,
        battery: 89,
        etaSeconds: 0,
        missionId: null,
        alertId: null,
        timeOnSite: 0,
        altitudeMeters: 0,
      },
      'DRONE-4': {
        id: 'DRONE-4',
        name: 'Vayu-4 Fast Interceptor',
        status: 'STANDBY',
        lat: 23.02,
        lon: 88.92,
        baseLat: 23.02,
        baseLon: 88.92,
        targetLat: null,
        targetLon: null,
        battery: 95,
        etaSeconds: 0,
        missionId: null,
        alertId: null,
        timeOnSite: 0,
        altitudeMeters: 0,
      },
    };

    this.flightLogs = [
      { id: 'FL-901', droneId: 'DRONE-1', mission: 'Border Fence Patrol Alpha', duration: '18m 42s', outcome: 'CONFIRMED_CLEAR', time: '10:15 IST' },
      { id: 'FL-902', droneId: 'DRONE-2', mission: 'Riverine Thermal Recon Mechi', duration: '24m 10s', outcome: 'TARGET_INTERCEPTED', time: '09:40 IST' },
      { id: 'FL-903', droneId: 'DRONE-3', mission: 'Night Trail Scan Bravo-4', duration: '31m 05s', outcome: 'FALSE_ALARM', time: '08:20 IST' },
      { id: 'FL-904', droneId: 'DRONE-4', mission: 'Highway Checkpoint VEP Surveillance', duration: '14m 12s', outcome: 'VEHICLE_TRACKED', time: '07:05 IST' },
    ];

    // Start 1-second simulation clock
    this.interval = setInterval(() => this.tick(), 1000);
  }

  getDrones() {
    return Object.values(this.drones);
  }

  getFlightLogs() {
    return this.flightLogs;
  }

  dispatch(droneId, targetCoords, alertId = null) {
    const drone = this.drones[droneId];
    if (!drone) return null;

    drone.status = 'DISPATCHED';
    drone.targetLat = targetCoords.lat;
    drone.targetLon = targetCoords.lon;
    drone.alertId = alertId;
    drone.missionId = `MSN-${Math.floor(1000 + Math.random() * 9000)}`;
    drone.altitudeMeters = 120;
    drone.timeOnSite = 0;

    // Estimate ETA based on distance (~20-40 seconds in simulated time)
    drone.etaSeconds = Math.floor(Math.random() * 15 + 20);

    setTimeout(() => {
      if (drone.status === 'DISPATCHED') {
        drone.status = 'EN_ROUTE';
      }
    }, 1500);

    this.broadcastStatus(drone);
    return drone;
  }

  // Auto-dispatch nearest available drone to an alert coordinate
  autoDispatchForAlert(alert) {
    const available = Object.values(this.drones).find((d) => d.status === 'STANDBY' && d.battery > 30);
    if (!available) return null;

    return this.dispatch(available.id, alert.coordinates, alert.id);
  }

  tick() {
    for (const id in this.drones) {
      const drone = this.drones[id];

      if (drone.status === 'EN_ROUTE') {
        // Move towards target
        drone.battery = Math.max(5, drone.battery - 0.15);
        drone.etaSeconds = Math.max(0, drone.etaSeconds - 1);

        const step = 0.15;
        drone.lat = drone.lat + (drone.targetLat - drone.lat) * step;
        drone.lon = drone.lon + (drone.targetLon - drone.lon) * step;

        if (drone.etaSeconds <= 0 || (Math.abs(drone.lat - drone.targetLat) < 0.005 && Math.abs(drone.lon - drone.targetLon) < 0.005)) {
          drone.lat = drone.targetLat;
          drone.lon = drone.targetLon;
          drone.status = 'ON_SITE';
          drone.timeOnSite = 0;
          this.broadcastStatus(drone);
        } else {
          this.broadcastStatus(drone);
        }
      } else if (drone.status === 'ON_SITE') {
        drone.timeOnSite += 1;
        drone.battery = Math.max(5, drone.battery - 0.1);

        // Circular hover trajectory
        const angle = drone.timeOnSite * 0.2;
        drone.lat = drone.targetLat + Math.cos(angle) * 0.002;
        drone.lon = drone.targetLon + Math.sin(angle) * 0.002;

        // After 25 seconds on site (speeded up for testing, represents 90s mission)
        if (drone.timeOnSite >= 25) {
          const isConfirmed = Math.random() > 0.35;
          const confirmationType = isConfirmed ? 'CONFIRMED_THREAT' : 'FALSE_ALARM';

          if (this.io) {
            this.io.emit('drone_confirmation', {
              droneId: drone.id,
              alertId: drone.alertId,
              missionId: drone.missionId,
              outcome: confirmationType,
              timestamp: new Date().toISOString(),
              coordinates: { lat: drone.targetLat, lon: drone.targetLon },
            });
          }

          // Add to flight logs
          this.flightLogs.unshift({
            id: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
            droneId: drone.id,
            mission: `Investigation for Alert ${drone.alertId || 'Target'}`,
            duration: `${Math.floor(drone.timeOnSite + 30)}s`,
            outcome: confirmationType,
            time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST',
          });
          if (this.flightLogs.length > 20) this.flightLogs.pop();

          drone.status = 'RETURNING';
          drone.etaSeconds = 25;
          this.broadcastStatus(drone);
        } else {
          this.broadcastStatus(drone);
        }
      } else if (drone.status === 'RETURNING') {
        drone.battery = Math.max(5, drone.battery - 0.12);
        drone.etaSeconds = Math.max(0, drone.etaSeconds - 1);

        const step = 0.15;
        drone.lat = drone.lat + (drone.baseLat - drone.lat) * step;
        drone.lon = drone.lon + (drone.baseLon - drone.lon) * step;

        if (drone.etaSeconds <= 0 || (Math.abs(drone.lat - drone.baseLat) < 0.005 && Math.abs(drone.lon - drone.baseLon) < 0.005)) {
          drone.lat = drone.baseLat;
          drone.lon = drone.baseLon;
          drone.status = 'STANDBY';
          drone.targetLat = null;
          drone.targetLon = null;
          drone.altitudeMeters = 0;
          this.broadcastStatus(drone);
        } else {
          this.broadcastStatus(drone);
        }
      } else if (drone.status === 'STANDBY') {
        // Slowly recharge when at base
        if (drone.battery < 100) {
          drone.battery = Math.min(100, drone.battery + 0.2);
        }
      }
    }
  }

  broadcastStatus(drone) {
    if (this.io) {
      this.io.emit('droneStatus', {
        droneId: drone.id,
        name: drone.name,
        lat: Number(drone.lat.toFixed(5)),
        lon: Number(drone.lon.toFixed(5)),
        baseLat: drone.baseLat,
        baseLon: drone.baseLon,
        battery: Math.round(drone.battery),
        status: drone.status,
        etaSeconds: drone.etaSeconds,
        missionId: drone.missionId,
        alertId: drone.alertId,
        altitudeMeters: drone.altitudeMeters,
      });
    }
  }
}

module.exports = DroneSimulator;
