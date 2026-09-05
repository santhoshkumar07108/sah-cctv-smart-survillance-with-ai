// client/src/hooks/useSocket.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('RECONNECTING...');
  const [alerts, setAlerts] = useState([]);
  const [drones, setDrones] = useState([]);
  const [flightLogs, setFlightLogs] = useState([]);
  const [weather, setWeather] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [cameraStatuses, setCameraStatuses] = useState({});
  const [plates, setPlates] = useState([]);
  const [recentAlertPings, setRecentAlertPings] = useState([]);
  const [lastConfirmation, setLastConfirmation] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('CONNECTED');
    });

    s.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('RECONNECTING...');
    });

    s.on('connect_error', () => {
      setIsConnected(false);
      setConnectionStatus('RECONNECTING...');
    });

    // Alert Stream
    s.on('alert', (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);

      if (newAlert.coordinates && newAlert.coordinates.lat && newAlert.coordinates.lon) {
        setRecentAlertPings((prev) => [
          {
            id: newAlert.id,
            lat: newAlert.coordinates.lat,
            lon: newAlert.coordinates.lon,
            severity: newAlert.severity,
            type: newAlert.type,
            timestamp: Date.now(),
          },
          ...prev.slice(0, 9),
        ]);
      }
    });

    // Drone Telemetry
    s.on('droneStatus', (droneData) => {
      if (Array.isArray(droneData)) {
        setDrones(droneData);
      } else if (droneData && droneData.id) {
        setDrones((prev) => {
          const idx = prev.findIndex((d) => d.id === droneData.id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...droneData };
            return updated;
          }
          return [...prev, droneData];
        });
      }
    });

    s.on('drone_confirmation', (conf) => {
      setLastConfirmation(conf);
      setFlightLogs((prev) => [
        {
          id: LOG-,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
          droneId: conf.droneId,
          alertId: conf.alertId,
          missionType: 'Target Intercept & Recon',
          result: conf.status === 'CONFIRMED_THREAT' ? 'Confirmed Incursion' : 'False Alarm (Biomass)',
          duration: ${Math.floor(Math.random() * 4 + 6)}m 12s,
        },
        ...prev.slice(0, 24),
      ]);
    });

    s.on('systemHealth', (health) => {
      setSystemHealth(health);
    });

    s.on('cameraStatus', (statuses) => {
      setCameraStatuses(statuses);
    });

    s.on('plateDetected', (plate) => {
      setPlates((prev) => [plate, ...prev.slice(0, 39)]);
    });

    s.on('weatherUpdate', (weatherData) => {
      setWeather(weatherData);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const dispatchDrone = useCallback((droneId, targetCoordinates) => {
    if (socketRef.current) {
      socketRef.current.emit('dispatchDrone', {
        droneId,
        targetCoordinates,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId) => {
    if (socketRef.current) {
      socketRef.current.emit('acknowledgeAlert', { alertId });
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  }, []);

  const triggerManualAlert = useCallback((alertData) => {
    if (socketRef.current) {
      socketRef.current.emit('manualAlert', alertData);
    }
  }, []);

  return {
    socket,
    isConnected,
    connectionStatus,
    alerts,
    drones,
    flightLogs,
    weather,
    systemHealth,
    cameraStatuses,
    plates,
    recentAlertPings,
    lastConfirmation,
    dispatchDrone,
    acknowledgeAlert,
    triggerManualAlert,
  };
}
