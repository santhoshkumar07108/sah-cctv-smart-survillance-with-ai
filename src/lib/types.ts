export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';

export type CameraStatus = 'ONLINE' | 'WARNING' | 'ALERT' | 'OFFLINE';

export type CameraType = 'OPTICAL' | 'THERMAL_IR' | 'NIGHT_VISION' | 'ANPR_HIGHRES' | 'RADAR_PTZ';

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  type: CameraType;
  rtspUrl: string;
  fps: number;
  resolution: string;
  detectedCount: number;
  aiConfidence: number;
  aiEnabled: boolean;
  lastSeen: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% on tactical map
    mapY: number; // 0-100% on tactical map
  };
  activeAlerts: number;
  irMode: boolean;
}

export interface DetectionBox {
  id: string;
  label: 'PERSON' | 'VEHICLE' | 'MOTORCYCLE' | 'TRUCK' | 'FACE' | 'ANIMAL';
  confidence: number;
  x: number; // percent 0-100
  y: number; // percent 0-100
  width: number; // percent 0-100
  height: number; // percent 0-100
  trackingPath?: Array<{ x: number; y: number }>;
  behavior?: 'WALKING' | 'LOITERING' | 'RUNNING' | 'STATIONARY' | 'SPEEDING' | 'BREACHING';
  timestamp: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  severity: SeverityLevel;
  status: AlertStatus;
  category:
    | 'VIRTUAL_FENCE_BREACH'
    | 'NIGHT_MOVEMENT'
    | 'SUSPICIOUS_LOITERING'
    | 'UNKNOWN_VEHICLE'
    | 'RESTRICTED_ZONE_ENTRY'
    | 'WATCHLIST_FACE_MATCH'
    | 'CROWD_FORMATION';
  objectType: string;
  confidence: number;
  description: string;
  recommendedAction: string;
  movementVector?: string;
  zone?: string;
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  cameraId: string;
  location: string;
  eventType: string;
  object: string;
  confidence: number;
  severity: SeverityLevel;
  status: 'PROCESSED' | 'FLAGGED' | 'RESOLVED';
  details: string;
}

export interface ANPRRecord {
  id: string;
  timestamp: string;
  camera: string;
  location: string;
  vehicleType: 'SUV' | 'TRUCK' | 'MOTORCYCLE' | 'BUS' | 'SEDAN';
  plateNumber: string;
  confidence: number;
  status: 'VERIFIED' | 'UNKNOWN' | 'FLAGGED' | 'STOLEN_WATCHLIST';
  speedKmh: number;
  direction: 'INBOUND' | 'OUTBOUND';
  isSimulated: true;
}

export interface FaceDetectionRecord {
  id: string;
  timestamp: string;
  camera: string;
  location: string;
  faceId: string;
  confidence: number;
  matchScore?: number;
  status: 'UNKNOWN_DETECTED' | 'WATCHLIST_MATCH' | 'AUTHORIZED_PERSONNEL';
  matchedIdentity?: {
    name: string;
    alias: string;
    threatClass: string;
    fictionalNotice: string;
  };
  features: {
    embeddings: string;
    pitch: number;
    yaw: number;
    lighting: string;
  };
}

export interface VirtualFencePoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface VirtualFenceZone {
  id: string;
  name: string;
  polygon: VirtualFencePoint[];
  status: 'ARMED' | 'BREACHED' | 'MAINTENANCE';
  color: string;
  sector: string;
  severity: SeverityLevel;
}

export interface AIModelSpec {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'STANDBY' | 'UPDATING';
  accuracy: number;
  inferenceFps: number;
  latencyMs: number;
  version: string;
  gpuMemoryMb: number;
  confidenceThreshold: number;
  description: string;
}

export interface SystemHealthMetrics {
  cpuUsage: number;
  gpuUsage: number;
  ramUsageGb: number;
  ramTotalGb: number;
  gpuVramGb: number;
  gpuTotalVramGb: number;
  networkInMbps: number;
  networkOutMbps: number;
  storageUsedGb: number;
  storageTotalGb: number;
  activeStreams: number;
  cameraHealthPct: number;
  aiProcessingFps: number;
  apiLatencyMs: number;
  uptimeSeconds: number;
}
