'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BorderWeatherLocation } from '@/components/weather/BorderWeatherWidget';
import { MapDrone, MapAlertPing } from '@/components/map/LeafletBorderMap';

export interface RealtimeAlert {
  id: string;
  timestamp: string;
  timeFormatted: string;
  cameraId: string;
  location: string;
  zone: string;
  type: string;
  confidence: number;
  coordinates: { lat: number; lon: number };
  description: string;
  aiModel: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  droneDispatched: boolean;
  dispatchedDroneId?: string | null;
  status: 'UNACKNOWLEDGED' | 'ACKNOWLEDGED';
}

export interface SystemHealthData {
  cpu: number;
  ram: number;
  storage: number;
  networkLatency: number;
  timeFormatted: string;
  bopLatencies?: Record<string, number>;
}

export interface PlateDetectionEvent {
  id: string;
  plate: string;
  vehicleType: string;
  color: string;
  cameraId: string;
  timestamp: string;
  timeFormatted: string;
  watchlistHit: boolean;
  confidence: number;
  category: 'Suspect' | 'Civilian';
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'RECONNECTING...'>('RECONNECTING...');
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [drones, setDrones] = useState<MapDrone[]>([]);
  const [flightLogs, setFlightLogs] = useState<any[]>([]);
  const [weather, setWeather] = useState<BorderWeatherLocation[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthData>({
    cpu: 58.2,
    ram: 68.4,
    storage: 61.0,
    networkLatency: 28,
    timeFormatted: 'Now',
  });
  const [cameraStatuses, setCameraStatuses] = useState<Record<string, { fps: number; status: string }>>({});
  const [plates, setPlates] = useState<PlateDetectionEvent[]>([]);
  const [recentAlertPings, setRecentAlertPings] = useState<MapAlertPing[]>([]);
  const [lastConfirmation, setLastConfirmation] = useState<any>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('CONNECTED');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setConnectionStatus('RECONNECTING...');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      setConnectionStatus('RECONNECTING...');
    });

    // Initial state bundle
    socket.on('initial_data', (data) => {
      if (data.alerts) setAlerts(data.alerts);
      if (data.drones) setDrones(data.drones);
      if (data.flightLogs) setFlightLogs(data.flightLogs);
      if (data.weather) setWeather(data.weather);
    });

    // Real-time alert stream (Requirement 4)
    socket.on('alert', (newAlert: RealtimeAlert) => {
      setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)].slice(0, 50));

      // Add to map pings
      if (newAlert.coordinates?.lat && newAlert.coordinates?.lon) {
        setRecentAlertPings((prev) => [
          {
            id: newAlert.id,
            lat: newAlert.coordinates.lat,
            lon: newAlert.coordinates.lon,
            type: newAlert.type,
            severity: newAlert.severity,
            time: newAlert.timeFormatted || 'Just now',
          },
          ...prev.slice(0, 7),
        ]);
      }
    });

    // Alert acknowledged event
    socket.on('alert_acknowledged', ({ alertId }) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
      );
    });

    // Real-time drone status (Requirement 6)
    socket.on('droneStatus', (droneData: MapDrone) => {
      setDrones((prev) => {
        const idx = prev.findIndex((d) => d.id === droneData.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = droneData;
          return updated;
        }
        return [...prev, droneData];
      });
    });

    // Drone confirmation event
    socket.on('drone_confirmation', (confirmation) => {
      setLastConfirmation(confirmation);
    });

    // Real-time system health metrics (Requirement 5)
    socket.on('systemHealth', (health: SystemHealthData) => {
      setSystemHealth(health);
    });

    // Camera FPS status
    socket.on('cameraStatus', ({ cameraId, fps, status }) => {
      setCameraStatuses((prev) => ({
        ...prev,
        [cameraId]: { fps, status },
      }));
    });

    // ANPR plate stream (Requirement 7)
    socket.on('plateDetected', (plateEvent: PlateDetectionEvent) => {
      setPlates((prev) => [plateEvent, ...prev.slice(0, 30)]);
    });

    // Weather updates
    socket.on('weatherUpdate', (weatherList: BorderWeatherLocation[]) => {
      setWeather(weatherList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dispatchDrone = useCallback((droneId: string, lat: number, lon: number, alertId?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('dispatchDrone', { droneId, lat, lon, alertId });
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('acknowledgeAlert', { alertId });
    }
    // Optimistic local update
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  }, []);

  const triggerManualAlert = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('manualAlertTrigger');
    }
  }, []);

  return {
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
