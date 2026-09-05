'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  SecurityAlert,
  EventLogItem,
  ANPRRecord,
  FaceDetectionRecord,
  VirtualFenceZone,
  AIModelSpec,
  SystemHealthMetrics,
} from '@/lib/types';
import {
  INITIAL_CAMERAS,
  INITIAL_ALERTS,
  INITIAL_EVENTS,
  INITIAL_ANPR,
  INITIAL_FACES,
  INITIAL_ZONES,
  INITIAL_MODELS,
  INITIAL_HEALTH,
} from '@/lib/mock-data';
import {
  playAlertSiren,
  playTacticalBeep,
  playRadarBlip,
  playSuccessChime,
  setSoundEnabled,
  getSoundEnabled,
} from '@/lib/sound-effects';
import { formatTimestamp } from '@/lib/utils';

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'CRITICAL' | 'HIGH' | 'INFO';
  read: boolean;
  alertId?: string;
  cameraId?: string;
}

interface DemoSimulationContextType {
  isDemoActive: boolean;
  startDemo: () => void;
  pauseDemo: () => void;
  resetDemo: () => void;
  triggerSimulatedBreach: (customCameraId?: string) => void;
  
  // Data stores
  cameras: Camera[];
  alerts: SecurityAlert[];
  events: EventLogItem[];
  anprRecords: ANPRRecord[];
  faceRecords: FaceDetectionRecord[];
  zones: VirtualFenceZone[];
  models: AIModelSpec[];
  systemHealth: SystemHealthMetrics;
  
  // Modals & inspect
  selectedCamera: Camera | null;
  setSelectedCamera: (cam: Camera | null) => void;
  investigatingAlert: SecurityAlert | null;
  setInvestigatingAlert: (alert: SecurityAlert | null) => void;
  
  // Actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  toggleCameraAI: (cameraId: string) => void;
  toggleCameraIR: (cameraId: string) => void;
  addNewCamera: (cam: Partial<Camera>) => void;
  updateModelThreshold: (modelId: string, threshold: number) => void;
  
  // Virtual fence drawing
  isDrawingFence: boolean;
  setIsDrawingFence: (drawing: boolean) => void;
  fenceDrawingPoints: Array<{ x: number; y: number }>;
  addFenceDrawingPoint: (pt: { x: number; y: number }) => void;
  clearFenceDrawing: () => void;
  saveNewFenceZone: (name: string, sector: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Sound
  soundMuted: boolean;
  toggleSound: () => void;
  
  // KPIs
  kpis: {
    activeCameras: number;
    onlineCameras: number;
    personsDetected: number;
    vehiclesDetected: number;
    activeAlerts: number;
    intrusionEvents: number;
    nightMovementEvents: number;
    systemHealthPct: number;
  };
}

const DemoSimulationContext = createContext<DemoSimulationContextType | undefined>(undefined);

export function DemoSimulationProvider({ children }: { children: React.ReactNode }) {
  const [isDemoActive, setIsDemoActive] = useState(true);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [events, setEvents] = useState<EventLogItem[]>(INITIAL_EVENTS);
  const [anprRecords, setAnprRecords] = useState<ANPRRecord[]>(INITIAL_ANPR);
  const [faceRecords, setFaceRecords] = useState<FaceDetectionRecord[]>(INITIAL_FACES);
  const [zones, setZones] = useState<VirtualFenceZone[]>(INITIAL_ZONES);
  const [models, setModels] = useState<AIModelSpec[]>(INITIAL_MODELS);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics>(INITIAL_HEALTH);
  
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [investigatingAlert, setInvestigatingAlert] = useState<SecurityAlert | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);
  
  // Virtual fence drawing
  const [isDrawingFence, setIsDrawingFence] = useState(false);
  const [fenceDrawingPoints, setFenceDrawingPoints] = useState<Array<{ x: number; y: number }>>([]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      message: 'Virtual fence breach detected – BOP-02 Riverine Sector',
      timestamp: '20:12:45 IST',
      type: 'CRITICAL',
      read: false,
      cameraId: 'BOP-02',
    },
    {
      id: 'notif-2',
      message: 'Night movement detected – WATCHTOWER-05 Foliage Ridge',
      timestamp: '20:06:12 IST',
      type: 'HIGH',
      read: false,
      cameraId: 'WATCHTOWER-05',
    },
    {
      id: 'notif-3',
      message: 'Vehicle detected – CHECKPOST-04 Gate 02 Entry',
      timestamp: '19:48:30 IST',
      type: 'INFO',
      read: true,
      cameraId: 'CHECKPOST-04',
    },
  ]);

  const toggleSound = useCallback(() => {
    setSoundMuted(prev => {
      const next = !prev;
      setSoundEnabled(!next);
      return next;
    });
  }, []);

  const addNotification = useCallback((message: string, type: 'CRITICAL' | 'HIGH' | 'INFO', cameraId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      message,
      timestamp: formatTimestamp(),
      type,
      read: false,
      cameraId,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const triggerSimulatedBreach = useCallback((customCameraId?: string) => {
    const targetCamId = customCameraId || 'BOP-02';
    const timestamp = formatTimestamp();
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;

    const targetCamera = cameras.find(c => c.id === targetCamId) || cameras[1];

    const newAlert: SecurityAlert = {
      id: alertId,
      title: 'VIRTUAL FENCE BREACH DETECTED',
      cameraId: targetCamera.id,
      cameraName: targetCamera.name,
      location: targetCamera.location,
      timestamp,
      severity: 'CRITICAL',
      status: 'NEW',
      category: 'VIRTUAL_FENCE_BREACH',
      objectType: 'PERSON (Infiltrator detected)',
      confidence: 0.97,
      description: `Immediate boundary tripwire breach registered by ${targetCamera.type} AI tracking engine. Subject breached Zero-Line cordon.`,
      recommendedAction: 'Sound Sector Alarm, deploy QRT unit to coordinates, and lock automated checkpoint gate.',
      movementVector: 'North to South 3.1 m/s (Fast pacing)',
      zone: 'Sector Beta Buffer',
    };

    const newEvent: EventLogItem = {
      id: eventId,
      timestamp,
      cameraId: targetCamera.id,
      location: targetCamera.location,
      eventType: 'Virtual Fence Breach',
      object: 'PERSON',
      confidence: 0.97,
      severity: 'CRITICAL',
      status: 'FLAGGED',
      details: 'Automated tripwire breach registered. Operator notification dispatched.',
    };

    setAlerts(prev => [newAlert, ...prev]);
    setEvents(prev => [newEvent, ...prev]);
    
    // Highlight camera in alert state
    setCameras(prev =>
      prev.map(c =>
        c.id === targetCamera.id
          ? { ...c, status: 'ALERT', activeAlerts: c.activeAlerts + 1, detectedCount: c.detectedCount + 1 }
          : c
      )
    );

    // Trigger breached status on zone
    setZones(prev =>
      prev.map(z => (z.id === 'ZONE-BETA' ? { ...z, status: 'BREACHED' } : z))
    );

    addNotification(`Virtual fence breach detected – ${targetCamera.id}`, 'CRITICAL', targetCamera.id);
    playAlertSiren();
  }, [cameras, addNotification]);

  // Periodic Demo Mode Event Simulator
  useEffect(() => {
    if (!isDemoActive) return;

    const interval = setInterval(() => {
      const rand = Math.random();
      const timestamp = formatTimestamp();

      if (rand < 0.28) {
        // Vehicle / ANPR event
        const plateLetters = ['DL', 'PB', 'HR', 'JK', 'MH', 'UP'];
        const p1 = plateLetters[Math.floor(Math.random() * plateLetters.length)];
        const p2 = Math.floor(10 + Math.random() * 89);
        const p3 = ['AB', 'XY', 'ZZ', 'KM', 'TH'][Math.floor(Math.random() * 5)];
        const p4 = Math.floor(1000 + Math.random() * 8999);
        const fakePlate = `${p1} ${p2} ${p3} ${p4}`;

        const vehicles: Array<'SUV' | 'TRUCK' | 'MOTORCYCLE' | 'BUS' | 'SEDAN'> = ['SUV', 'TRUCK', 'MOTORCYCLE', 'SEDAN', 'BUS'];
        const vType = vehicles[Math.floor(Math.random() * vehicles.length)];
        const confidence = +(0.88 + Math.random() * 0.11).toFixed(2);
        const status = Math.random() > 0.8 ? 'FLAGGED' : 'VERIFIED';

        const newAnpr: ANPRRecord = {
          id: `ANPR-${Date.now().toString().slice(-4)}`,
          timestamp,
          camera: 'CHECKPOST-04',
          location: 'Entry Checkpoint Gate 02',
          vehicleType: vType,
          plateNumber: fakePlate,
          confidence,
          status,
          speedKmh: Math.floor(15 + Math.random() * 35),
          direction: Math.random() > 0.5 ? 'INBOUND' : 'OUTBOUND',
          isSimulated: true,
        };

        setAnprRecords(prev => [newAnpr, ...prev.slice(0, 24)]);
        
        setEvents(prev => [
          {
            id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp,
            cameraId: 'CHECKPOST-04',
            location: 'Entry Checkpoint Gate 02',
            eventType: status === 'FLAGGED' ? 'Unknown Vehicle Flagged' : 'ANPR Vehicle Verification',
            object: vType,
            confidence,
            severity: status === 'FLAGGED' ? 'MEDIUM' : 'LOW',
            status: status === 'FLAGGED' ? 'FLAGGED' : 'PROCESSED',
            details: `Simulated OCR match for ${fakePlate} (${status})`,
          },
          ...prev.slice(0, 49),
        ]);

        if (status === 'FLAGGED') {
          addNotification(`Unregistered vehicle detected – ${fakePlate}`, 'HIGH', 'CHECKPOST-04');
          playRadarBlip();
        } else {
          playTacticalBeep(650, 0.04);
        }
      } else if (rand < 0.55) {
        // Night movement / thermal detection
        const targetCam = cameras[Math.floor(Math.random() * cameras.length)];
        const confidence = +(0.87 + Math.random() * 0.1).toFixed(2);

        setEvents(prev => [
          {
            id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp,
            cameraId: targetCam.id,
            location: targetCam.location,
            eventType: 'AI Motion Vector Tracked',
            object: 'PERSON',
            confidence,
            severity: 'LOW',
            status: 'PROCESSED',
            details: `Continuous trajectory tracking by ${targetCam.id}.`,
          },
          ...prev.slice(0, 49),
        ]);

        playRadarBlip();
      } else if (rand < 0.72) {
        // Face detection simulation
        const isWatchlist = Math.random() > 0.85;
        const faceRecord: FaceDetectionRecord = {
          id: `FACE-${Date.now().toString().slice(-4)}`,
          timestamp,
          camera: 'CHECKPOST-04',
          location: 'Entry Checkpoint Gate 02',
          faceId: `F-SIM-${Math.floor(10000 + Math.random() * 89999)}`,
          confidence: +(0.88 + Math.random() * 0.1).toFixed(2),
          matchScore: isWatchlist ? 0.94 : 0.32,
          status: isWatchlist ? 'WATCHLIST_MATCH' : 'UNKNOWN_DETECTED',
          matchedIdentity: isWatchlist
            ? {
                name: 'Simulated Suspect #19',
                alias: 'Sector Wanderer',
                threatClass: 'Class C Infiltrator (Demo Mock)',
                fictionalNotice: 'Simulated identity for hackathon evaluation.',
              }
            : undefined,
          features: {
            embeddings: `512D Vector: ${Math.random().toString(16).slice(2, 10)}...`,
            pitch: +(Math.random() * 10 - 5).toFixed(1),
            yaw: +(Math.random() * 20 - 10).toFixed(1),
            lighting: 'Dynamic Ambient Lux',
          },
        };

        setFaceRecords(prev => [faceRecord, ...prev.slice(0, 19)]);
        if (isWatchlist) {
          addNotification(`Watchlist biometric match detected – CHECKPOST-04`, 'CRITICAL', 'CHECKPOST-04');
          playAlertSiren();
        }
      }

      // Slightly fluctuate system health for realism
      setSystemHealth(prev => ({
        ...prev,
        cpuUsage: +(32 + Math.random() * 10).toFixed(1),
        gpuUsage: +(65 + Math.random() * 15).toFixed(1),
        aiProcessingFps: +(27.5 + Math.random() * 3).toFixed(1),
        networkInMbps: +(180 + Math.random() * 25).toFixed(1),
        apiLatencyMs: Math.floor(10 + Math.random() * 6),
      }));

    }, 6000);

    return () => clearInterval(interval);
  }, [isDemoActive, cameras, addNotification]);

  const startDemo = () => {
    setIsDemoActive(true);
    playTacticalBeep(980, 0.1);
  };

  const pauseDemo = () => {
    setIsDemoActive(false);
    playTacticalBeep(440, 0.1);
  };

  const resetDemo = () => {
    setCameras(INITIAL_CAMERAS);
    setAlerts(INITIAL_ALERTS);
    setEvents(INITIAL_EVENTS);
    setAnprRecords(INITIAL_ANPR);
    setFaceRecords(INITIAL_FACES);
    setZones(INITIAL_ZONES);
    setModels(INITIAL_MODELS);
    setSystemHealth(INITIAL_HEALTH);
    setSelectedCamera(null);
    setInvestigatingAlert(null);
    playSuccessChime();
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    playTacticalBeep(750, 0.08);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
    setCameras(prev =>
      prev.map(c => (c.status === 'ALERT' ? { ...c, status: 'ONLINE', activeAlerts: 0 } : c))
    );
    setZones(prev =>
      prev.map(z => (z.status === 'BREACHED' ? { ...z, status: 'ARMED' } : z))
    );
    playSuccessChime();
  };

  const toggleCameraAI = (cameraId: string) => {
    setCameras(prev =>
      prev.map(c => (c.id === cameraId ? { ...c, aiEnabled: !c.aiEnabled } : c))
    );
    playTacticalBeep(880, 0.05);
  };

  const toggleCameraIR = (cameraId: string) => {
    setCameras(prev =>
      prev.map(c => (c.id === cameraId ? { ...c, irMode: !c.irMode } : c))
    );
    playTacticalBeep(1100, 0.05);
  };

  const addNewCamera = (cam: Partial<Camera>) => {
    const newCam: Camera = {
      id: cam.id || `CAM-0${cameras.length + 1}`,
      name: cam.name || `Perimeter Cam ${cameras.length + 1}`,
      location: cam.location || 'Border Sector Zero',
      status: 'ONLINE',
      type: cam.type || 'OPTICAL',
      rtspUrl: cam.rtspUrl || 'rtsp://10.24.106.01:554/live/feed',
      fps: 30,
      resolution: cam.resolution || '1920x1080 (FHD)',
      detectedCount: 0,
      aiConfidence: 0.92,
      aiEnabled: true,
      lastSeen: 'Just now',
      coordinates: cam.coordinates || { lat: 32.42, lng: 74.92, mapX: 50, mapY: 50 },
      activeAlerts: 0,
      irMode: false,
    };
    setCameras(prev => [...prev, newCam]);
    playSuccessChime();
  };

  const updateModelThreshold = (modelId: string, threshold: number) => {
    setModels(prev =>
      prev.map(m => (m.id === modelId ? { ...m, confidenceThreshold: threshold } : m))
    );
  };

  const addFenceDrawingPoint = (pt: { x: number; y: number }) => {
    setFenceDrawingPoints(prev => [...prev, pt]);
    playTacticalBeep(950, 0.05);
  };

  const clearFenceDrawing = () => {
    setFenceDrawingPoints([]);
    setIsDrawingFence(false);
  };

  const saveNewFenceZone = (name: string, sector: string) => {
    if (fenceDrawingPoints.length < 3) return;
    const newZone: VirtualFenceZone = {
      id: `ZONE-${Date.now().toString().slice(-4)}`,
      name: name || `Custom Perimeter Zone ${zones.length + 1}`,
      polygon: fenceDrawingPoints,
      status: 'ARMED',
      color: '#00f0ff',
      sector: sector || 'Dynamic Security Line',
      severity: 'CRITICAL',
    };
    setZones(prev => [...prev, newZone]);
    clearFenceDrawing();
    playSuccessChime();
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // KPI Calculations
  const kpis = {
    activeCameras: cameras.length,
    onlineCameras: cameras.filter(c => c.status !== 'OFFLINE').length,
    personsDetected: cameras.reduce((acc, c) => acc + (c.type === 'OPTICAL' || c.type === 'THERMAL_IR' ? c.detectedCount : 0), 4),
    vehiclesDetected: anprRecords.length + 12,
    activeAlerts: alerts.filter(a => a.status === 'NEW' || a.status === 'INVESTIGATING').length,
    intrusionEvents: events.filter(e => e.eventType.toLowerCase().includes('breach') || e.eventType.toLowerCase().includes('fence')).length + 1,
    nightMovementEvents: events.filter(e => e.eventType.toLowerCase().includes('night') || e.eventType.toLowerCase().includes('motion')).length + 2,
    systemHealthPct: +(systemHealth.cameraHealthPct).toFixed(1),
  };

  return (
    <DemoSimulationContext.Provider
      value={{
        isDemoActive,
        startDemo,
        pauseDemo,
        resetDemo,
        triggerSimulatedBreach,
        cameras,
        alerts,
        events,
        anprRecords,
        faceRecords,
        zones,
        models,
        systemHealth,
        selectedCamera,
        setSelectedCamera,
        investigatingAlert,
        setInvestigatingAlert,
        acknowledgeAlert,
        resolveAlert,
        toggleCameraAI,
        toggleCameraIR,
        addNewCamera,
        updateModelThreshold,
        isDrawingFence,
        setIsDrawingFence,
        fenceDrawingPoints,
        addFenceDrawingPoint,
        clearFenceDrawing,
        saveNewFenceZone,
        notifications,
        dismissNotification,
        clearAllNotifications,
        soundMuted,
        toggleSound,
        kpis,
      }}
    >
      {children}
    </DemoSimulationContext.Provider>
  );
}

export function useDemoSimulation() {
  const context = useContext(DemoSimulationContext);
  if (!context) {
    throw new Error('useDemoSimulation must be used within a DemoSimulationProvider');
  }
  return context;
}
