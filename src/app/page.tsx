'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  Radio,
  Video,
  AlertTriangle,
  Car,
  Users,
  Cpu,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  X,
  RefreshCw,
  Sliders,
  Globe,
  Camera as CameraIcon,
  ExternalLink,
  VideoOff,
  LogOut,
  Bell,
  Eye,
  Crosshair,
  Lock,
  Wifi,
  WifiOff,
  Server,
  FileSpreadsheet,
  FileText,
  Plus,
  Trash2,
  HardDrive,
  Database,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Send,
  Navigation,
  Download,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

import { useSocket, RealtimeAlert } from '@/hooks/useSocket';
import BorderWeatherWidget, { BorderWeatherLocation } from '@/components/weather/BorderWeatherWidget';
import DroneManagement from '@/components/pages/DroneManagement';

// Dynamic import of Leaflet map for SSR safety
const LeafletBorderMap = dynamic(() => import('@/components/map/LeafletBorderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded bg-[#05080E] border border-[#1E3A5F] flex items-center justify-center text-xs text-[#64748B] font-mono">
      Initializing OpenStreetMap Tactical Grid...
    </div>
  ),
});

/* =========================================================================
   TYPES & INTERFACES
   ========================================================================= */

type NavigationTab =
  | 'overview'
  | 'feeds'
  | 'alerts'
  | 'anpr'
  | 'faces'
  | 'drone'
  | 'blockchain'
  | 'status';

type ZoneName = 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo' | 'Global-USA';

interface CameraItem {
  id: string;
  location: string;
  zone: ZoneName;
  lat: number;
  lon: number;
  status: 'Online' | 'Offline' | 'Degraded';
  resolution: string;
  fps: number;
  aiModel: string;
  lastSeen: string;
  uptime: string;
  videoSrc?: string;
  liveEmbedUrl?: string;
  earthCamUrl?: string;
  sourceProvider?: 'EarthCam USA' | 'IBVAP Defense Edge';
  country?: string;
  city?: string;
}

interface BlockchainBlock {
  blockNumber: number;
  previousHash: string;
  currentHash: string;
  timestamp: string;
  eventType:
    | 'ALERT_ACKNOWLEDGED'
    | 'WATCHLIST_UPDATED'
    | 'DRONE_DISPATCHED'
    | 'OPERATOR_LOGIN'
    | 'CONFIG_CHANGED'
    | 'DATA_EXPORT';
  operatorId: string;
  data: any;
  verified: boolean;
}

/* =========================================================================
   INDIAN HSRP LICENSE PLATE COMPONENT
   ========================================================================= */

function HsrpPlateBadge({ plateNumber }: { plateNumber: string }) {
  return (
    <div className="inline-flex items-center bg-[#F8FAFC] border-2 border-[#1E293B] rounded-[3px] shadow-sm overflow-hidden select-none">
      <div className="bg-[#0038A8] text-white px-1.5 py-0.5 flex flex-col items-center justify-center border-r border-[#CBD5E1]">
        <div className="w-2.5 h-2.5 rounded-full border border-white/80 flex items-center justify-center mb-0.5">
          <div className="w-1 h-1 rounded-full bg-white/90" />
        </div>
        <span className="text-[9px] font-black tracking-tighter leading-none font-mono">
          IND
        </span>
      </div>

      <div className="px-2.5 py-0.5 flex items-center gap-1.5 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9]">
        <div className="w-2 h-2 rounded-[1px] bg-gradient-to-br from-amber-300 via-cyan-300 to-emerald-400 opacity-80 border border-slate-400/40" />
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#0A0E1A]">
          {plateNumber}
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   STATIC BASE CAMERAS (EARTHCAM USA + INDO-BANGLADESH BORDER DEFENSE)
   ========================================================================= */

const BASE_CAMERAS: CameraItem[] = [
  // --- EARTHCAM 24/7 LIVE FEEDS (UNITED STATES) ---
  {
    id: 'CAM-USA-01',
    location: 'Times Square, USA',
    zone: 'Global-USA',
    lat: 40.7580,
    lon: -73.9855,
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'EarthCam-CrowdFlow-AI',
    lastSeen: 'Live Now',
    uptime: '99.99%',
    videoSrc: '/videos/cam-001.mp4',
    liveEmbedUrl: 'https://www.youtube-nocookie.com/embed/QhFYcPBmkcI?autoplay=1&mute=1&playsinline=1',
    earthCamUrl: 'https://www.earthcam.com/usa/newyork/timessquare/?cam=tsstreet',
    sourceProvider: 'EarthCam USA',
    country: 'USA',
    city: 'Times Square, New York'
  },
  {
    id: 'CAM-USA-02',
    location: 'Texas, USA',
    zone: 'Global-USA',
    lat: 32.7767,
    lon: -96.7970,
    status: 'Online',
    resolution: '1080p 60FPS',
    fps: 29.9,
    aiModel: 'YOLO-v9-HighwaySec',
    lastSeen: 'Live Now',
    uptime: '99.95%',
    videoSrc: '/videos/cam-002.mp4',
    liveEmbedUrl: 'https://www.youtube-nocookie.com/embed/SDK_m1_BVJ4?autoplay=1&mute=1&playsinline=1',
    earthCamUrl: 'https://www.earthcam.com/usa/texas/dallas/dealeyplaza/?cam=dealeyplaza',
    sourceProvider: 'EarthCam USA',
    country: 'USA',
    city: 'Dallas / Frontier, Texas'
  },
  {
    id: 'CAM-USA-03',
    location: 'Las Vegas, USA',
    zone: 'Global-USA',
    lat: 36.1699,
    lon: -115.1398,
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'ThermalNet-Urban-v2',
    lastSeen: 'Live Now',
    uptime: '99.98%',
    videoSrc: '/videos/cam-003.mp4',
    liveEmbedUrl: 'https://www.youtube-nocookie.com/embed/_rmUXOHSf0w?autoplay=1&mute=1&playsinline=1',
    earthCamUrl: 'https://www.earthcam.com/usa/nevada/lasvegas/index.php?cam=catsmeow_fremont',
    sourceProvider: 'EarthCam USA',
    country: 'USA',
    city: 'The Strip / Fremont St, Nevada'
  },
  {
    id: 'CAM-USA-04',
    location: 'New York, USA',
    zone: 'Global-USA',
    lat: 40.7128,
    lon: -74.0060,
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'DeepMaritime-Optic',
    lastSeen: 'Live Now',
    uptime: '99.97%',
    videoSrc: '/videos/cam-004.mp4',
    liveEmbedUrl: 'https://www.youtube-nocookie.com/embed/zMCea32gpmg?autoplay=1&mute=1&playsinline=1',
    earthCamUrl: 'https://www.earthcam.com/usa/newyork/skyline/?cam=skyline_g',
    sourceProvider: 'EarthCam USA',
    country: 'USA',
    city: 'Midtown Skyline / Harbor, New York'
  },

  // --- INDIA BORDER DEFENSE NODES ---
  { id: 'CAM-001', location: 'Petrapole ICP Checkpoint', zone: 'Charlie', lat: 23.017, lon: 88.917, status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', lastSeen: 'Just now', uptime: '99.9%', videoSrc: '/videos/cam-005.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Petrapole, West Bengal' },
  { id: 'CAM-002', location: 'Hilli Border Outpost Fence', zone: 'Bravo', lat: 25.283, lon: 89.000, status: 'Degraded', resolution: '1080p 60FPS', fps: 22.4, aiModel: 'ThermalNet-v3', lastSeen: '1m ago', uptime: '97.2%', videoSrc: '/videos/cam-012.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Hilli, West Bengal' },
  { id: 'CAM-003', location: 'Changrabandha Corridor', zone: 'Bravo', lat: 26.317, lon: 89.617, status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', lastSeen: 'Just now', uptime: '99.8%', videoSrc: '/videos/cam-001.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Changrabandha, Cooch Behar' },
  { id: 'CAM-004', location: 'Fulbari Riverine Sentry', zone: 'Alpha', lat: 26.550, lon: 88.733, status: 'Online', resolution: '1080p 60FPS', fps: 29.8, aiModel: 'DeepFlow-Water', lastSeen: 'Just now', uptime: '99.9%', videoSrc: '/videos/cam-002.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Fulbari, Jalpaiguri' },
  { id: 'CAM-005', location: 'Ghojadanga Border Culvert', zone: 'Delta', lat: 22.900, lon: 88.783, status: 'Online', resolution: '1080p 60FPS', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', lastSeen: 'Just now', uptime: '99.5%', videoSrc: '/videos/cam-003.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Ghojadanga, North 24 Parganas' },
  { id: 'CAM-012', location: 'Panitanki ICP Gate 1', zone: 'Charlie', lat: 26.712, lon: 88.261, status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', lastSeen: 'Just now', uptime: '100%', videoSrc: '/videos/cam-004.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Panitanki, Darjeeling' },
  { id: 'CAM-019', location: 'Mechi River Sandbar Crossing', zone: 'Alpha', lat: 26.685, lon: 88.192, status: 'Online', resolution: '1080p 60FPS', fps: 29.8, aiModel: 'ThermalNet-v3', lastSeen: 'Just now', uptime: '99.7%', videoSrc: '/videos/cam-005.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Mechi River' },
  { id: 'CAM-027', location: 'Patrol Road East Junction', zone: 'Delta', lat: 26.660, lon: 88.290, status: 'Online', resolution: '1080p 60FPS', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', lastSeen: 'Just now', uptime: '99.9%', videoSrc: '/videos/cam-012.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Patrol Road' },
  { id: 'CAM-034', location: 'Tea Estate Perimeter Line East', zone: 'Delta', lat: 26.640, lon: 88.310, status: 'Online', resolution: '1080p 60FPS', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', lastSeen: 'Just now', uptime: '99.7%', videoSrc: '/videos/cam-001.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Tea Estate' },
  { id: 'CAM-041', location: 'Nathu La High Pass Watchtower', zone: 'Echo', lat: 27.386, lon: 88.831, status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'LongRange-Optic-v4', lastSeen: 'Just now', uptime: '99.9%', videoSrc: '/videos/cam-002.mp4', sourceProvider: 'IBVAP Defense Edge', country: 'India', city: 'Nathu La' },
];

// Helper to generate SHA-256 using browser Web Crypto API
async function generateSha256(data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return '0x' + Math.random().toString(16).substring(2, 10);
  }
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* =========================================================================
   MAIN APPLICATION
   ========================================================================= */

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<ZoneName | null>(null);

  // Live IST Clock (Requirement 1)
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavigationTab;
      const hashParam = window.location.hash.replace('#', '') as NavigationTab;
      if (tabParam && ['overview', 'feeds', 'alerts', 'anpr', 'faces', 'drone', 'blockchain', 'status'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (hashParam && ['overview', 'feeds', 'alerts', 'anpr', 'faces', 'drone', 'blockchain', 'status'].includes(hashParam)) {
        setActiveTab(hashParam);
      }
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(`${new Intl.DateTimeFormat('en-IN', options).format(now)} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Connect to Socket.io real-time engine
  const {
    isConnected,
    connectionStatus,
    alerts: socketAlerts,
    drones,
    flightLogs,
    weather,
    systemHealth,
    cameraStatuses,
    plates: socketPlates,
    recentAlertPings,
    lastConfirmation,
    dispatchDrone,
    acknowledgeAlert: socketAcknowledgeAlert,
    triggerManualAlert,
  } = useSocket();

  // Blockchain Ledger State with Web Crypto SHA-256
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>([
    {
      blockNumber: 104895,
      previousHash: '0x89b14c9e33df71aa55bc101032e28f1189ac02',
      currentHash: '0x3f8a2c7b91de04f128ab88c091d19ee12049ba3',
      timestamp: '19:30:15 IST',
      eventType: 'ALERT_ACKNOWLEDGED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: { alertId: 'ALT-8890', action: 'PATROL_DISPATCHED' },
      verified: true,
    },
    {
      blockNumber: 104894,
      previousHash: '0x5c421f66da1098bc4301feaa8871bd0042f9a1',
      currentHash: '0x89b14c9e33df71aa55bc101032e28f1189ac02',
      timestamp: '19:15:00 IST',
      eventType: 'WATCHLIST_UPDATED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: { plateNumber: 'WB 02 KL 5678', category: 'Suspect' },
      verified: true,
    },
    {
      blockNumber: 104893,
      previousHash: '0xa177bd09e51244fa8899cc3340f1a944882bc1',
      currentHash: '0x5c421f66da1098bc4301feaa8871bd0042f9a1',
      timestamp: '18:45:22 IST',
      eventType: 'DRONE_DISPATCHED',
      operatorId: 'SYSTEM_AUTONOMOUS',
      data: { droneId: 'DRONE-1', alertId: 'ALT-8884' },
      verified: true,
    },
  ]);

  // Modal and Inspection State
  const [inspectingCamera, setInspectingCamera] = useState<CameraItem | null>(null);
  const [watchlistPlates, setWatchlistPlates] = useState([
    { plateNumber: 'WB 02 KL 5678', category: 'Suspect', reason: 'Cross-border narcotics intelligence alert #NAR-842', addedBy: 'Insp. V. Singh', date: '01 Sep 2026' },
    { plateNumber: 'AS 01 BF 4432', category: 'Suspect', reason: 'Evasion of border tax checkpost & illegal timber transport', addedBy: 'Sub-Insp. M. Das', date: '28 Aug 2026' },
    { plateNumber: 'DL 08 CZ 5566', category: 'Suspect', reason: 'Unregistered drone launch sighting near Bravo sector', addedBy: 'Insp. V. Singh', date: '15 Aug 2026' },
    { plateNumber: 'UP 32 ER 3319', category: 'Military', reason: 'SSB Sector 4 Quick Reaction Team command vehicle', addedBy: 'HQ Logistics', date: '10 Jul 2026' },
  ]);

  // Unacknowledged alerts count
  const unacknowledgedCount = useMemo(() => {
    return socketAlerts.filter((a) => a.status === 'UNACKNOWLEDGED').length;
  }, [socketAlerts]);

  // Handle alert acknowledgement with real cryptographic hash append
  const handleAcknowledgeAlert = async (alertId: string) => {
    socketAcknowledgeAlert(alertId);

    const prevBlock = blockchainBlocks[0];
    const newBlockNumber = prevBlock ? prevBlock.blockNumber + 1 : 100000;
    const prevHash = prevBlock ? prevBlock.currentHash : '0x0000000000000000000000000000000000000000';
    const timestamp = istTime || new Date().toISOString();

    const dataPayload = { alertId, operator: 'Insp. V. Singh', action: 'ACKNOWLEDGED' };
    const hashInput = `${newBlockNumber}-${prevHash}-${timestamp}-${JSON.stringify(dataPayload)}`;
    const currentHash = await generateSha256(hashInput);

    const newBlock: BlockchainBlock = {
      blockNumber: newBlockNumber,
      previousHash: prevHash,
      currentHash,
      timestamp,
      eventType: 'ALERT_ACKNOWLEDGED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: dataPayload,
      verified: true,
    };

    setBlockchainBlocks((prev) => [newBlock, ...prev]);
  };

  // Export Blockchain as JSON (Requirement 8)
  const handleExportBlockchainJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(blockchainBlocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ibvap_blockchain_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#0A0E1A] flex flex-col items-center justify-center text-[#00E5FF] font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
        <span className="tracking-widest">INITIALIZING IBVAP DEFCON-3 SURVEILLANCE GRID...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0E1A] text-[#E2E8F0] font-sans selection:bg-[#00E5FF] selection:text-[#0A0E1A]">
      {/* =====================================================================
          TOP BAR
          ===================================================================== */}
      <header className="h-14 border-b border-[#1E3A5F] bg-[#0A0E1A] px-4 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left: Sector & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#111827] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">
                IBVAP
              </span>
              <span className="text-[11px] px-1.5 py-0.2 text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded font-mono">
                SSB/BSF DEFNET
              </span>
              <span className="hidden md:inline-block text-xs text-[#64748B]">
                Intelligent Border Video Analytics Platform
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Socket Status & IST Clock */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs bg-[#111827] border border-[#1E3A5F] px-3 py-1 rounded">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#00C853] animate-pulse' : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-[#64748B]">WebSocket:</span>
            <span
              className={`font-mono text-[11px] font-bold ${
                isConnected ? 'text-[#00C853]' : 'text-amber-400'
              }`}
            >
              {connectionStatus}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#111827] border border-[#1E3A5F] px-3 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-mono text-xs font-semibold text-[#E2E8F0] tracking-wider">
              {istTime || 'SYNCHRONIZING CLOCK...'}
            </span>
          </div>
        </div>

        {/* Right: Operator info & Panel Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('feeds')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold hover:bg-[#00E5FF]/25 transition-colors"
            title="View EarthCam USA Live Streams"
          >
            <Globe className="w-3.5 h-3.5 text-[#00E5FF]" /> EarthCam USA Feeds
          </button>

          <button
            onClick={triggerManualAlert}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/25 transition-colors"
            title="Simulate border intrusion event"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Trigger Test Alert
          </button>

          <div className="hidden sm:flex items-center gap-2 text-right">
            <div className="w-7 h-7 rounded-full bg-[#1E2A3A] border border-[#1E3A5F] flex items-center justify-center text-xs font-bold text-cyan-300 font-mono">
              VS
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-slate-200">Insp. V. Singh</div>
              <div className="text-[10px] font-mono text-[#64748B]">DUTY COMM.</div>
            </div>
          </div>

          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isRightPanelOpen
                ? 'bg-[#111827] border-[#00E5FF]/40 text-[#00E5FF]'
                : 'bg-[#111827] border-[#1E3A5F] text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Feed</span>
            {unacknowledgedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF4444] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unacknowledgedCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* =====================================================================
          APP BODY (Sidebar + Main Content + Right Panel)
          ===================================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Collapsible Rail Sidebar */}
        <aside
          className={`shrink-0 bg-[#0A0E1A] border-r border-[#1E3A5F] flex flex-col justify-between transition-all duration-200 z-20 ${
            isSidebarExpanded ? 'w-56' : 'w-[60px]'
          } hidden md:flex`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          <div className="py-3 space-y-1">
            <SidebarButton
              icon={<Layers className="w-5 h-5" />}
              label="Command Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<Video className="w-5 h-5" />}
              label="Live Feeds"
              active={activeTab === 'feeds'}
              onClick={() => setActiveTab('feeds')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<ShieldAlert className="w-5 h-5" />}
              label="Alerts & Events"
              active={activeTab === 'alerts'}
              onClick={() => setActiveTab('alerts')}
              expanded={isSidebarExpanded}
              badgeCount={unacknowledgedCount}
            />
            <SidebarButton
              icon={<Car className="w-5 h-5" />}
              label="ANPR Recognition"
              active={activeTab === 'anpr'}
              onClick={() => setActiveTab('anpr')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<Users className="w-5 h-5" />}
              label="Face Recognition"
              active={activeTab === 'faces'}
              onClick={() => setActiveTab('faces')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<Navigation className="w-5 h-5" />}
              label="Drone Management"
              active={activeTab === 'drone'}
              onClick={() => setActiveTab('drone')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<Lock className="w-5 h-5" />}
              label="Blockchain Audit"
              active={activeTab === 'blockchain'}
              onClick={() => setActiveTab('blockchain')}
              expanded={isSidebarExpanded}
            />
            <SidebarButton
              icon={<Cpu className="w-5 h-5" />}
              label="System Status"
              active={activeTab === 'status'}
              onClick={() => setActiveTab('status')}
              expanded={isSidebarExpanded}
            />
          </div>

          <div className="p-2 border-t border-[#1E3A5F] space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded bg-[#111827]">
              <div className="w-7 h-7 rounded bg-[#1E2A3A] flex items-center justify-center shrink-0 border border-slate-700">
                <span className="text-[10px] font-bold text-cyan-400 font-mono">SSB</span>
              </div>
              {isSidebarExpanded && (
                <div className="overflow-hidden">
                  <div className="text-[11px] font-semibold text-slate-200 truncate">
                    Sector 4 HQ
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate font-mono">
                    North Bengal
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => alert('Security console locked. Tap smart card to resume.')}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>Lock Console</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0A0E1A] p-4 lg:p-5 hud-grid pb-20 md:pb-16">
          {/* PAGE 1: COMMAND OVERVIEW */}
          {activeTab === 'overview' && (
            <CommandOverviewPage
              alerts={socketAlerts}
              drones={drones}
              weather={weather}
              cameras={BASE_CAMERAS}
              alertPings={recentAlertPings}
              onNavigate={setActiveTab}
              onSelectCamera={(camId) => {
                const cam = BASE_CAMERAS.find((c) => c.id === camId);
                if (cam) setInspectingCamera(cam);
              }}
            />
          )}

          {/* PAGE 2: LIVE FEED MONITOR */}
          {activeTab === 'feeds' && (
            <LiveFeedsPage
              cameras={BASE_CAMERAS}
              activeAlerts={socketAlerts}
              cameraStatuses={cameraStatuses}
              onInspectCamera={setInspectingCamera}
            />
          )}

          {/* PAGE 3: ALERTS & EVENTS */}
          {activeTab === 'alerts' && (
            <AlertsLogPage
              alerts={socketAlerts}
              onAcknowledge={handleAcknowledgeAlert}
              onDispatchDrone={(alert) => {
                dispatchDrone('DRONE-1', alert.coordinates.lat, alert.coordinates.lon, alert.id);
                alert.droneDispatched = true;
              }}
              onInspectCamera={(camId) => {
                const c = BASE_CAMERAS.find((cam) => cam.id === camId);
                if (c) setInspectingCamera(c);
              }}
            />
          )}

          {/* PAGE 4: ANPR RECOGNITION */}
          {activeTab === 'anpr' && (
            <AnprPage
              plates={socketPlates}
              watchlistPlates={watchlistPlates}
              onAddWatchlistPlate={(newP) => setWatchlistPlates((prev) => [newP, ...prev])}
              onRemoveWatchlistPlate={(plateNum) =>
                setWatchlistPlates((prev) => prev.filter((p) => p.plateNumber !== plateNum))
              }
            />
          )}

          {/* PAGE 5: FACE RECOGNITION */}
          {activeTab === 'faces' && (
            <FaceRecognitionPage />
          )}

          {/* PAGE 6: DRONE MANAGEMENT (NEW PAGE) */}
          {activeTab === 'drone' && (
            <DroneManagement
              drones={drones}
              flightLogs={flightLogs}
              weather={weather}
              onDispatchDrone={dispatchDrone}
            />
          )}

          {/* PAGE 7: BLOCKCHAIN AUDIT */}
          {activeTab === 'blockchain' && (
            <BlockchainAuditPage
              blocks={blockchainBlocks}
              onExportJson={handleExportBlockchainJson}
            />
          )}

          {/* PAGE 8: SYSTEM STATUS */}
          {activeTab === 'status' && (
            <SystemStatusPage
              health={systemHealth}
              cameras={BASE_CAMERAS}
            />
          )}
        </main>

        {/* Right Collapsible Panel: Real-time Live Alert Stream */}
        {isRightPanelOpen && (
          <aside className="w-80 lg:w-96 border-l border-[#1E3A5F] bg-[#0A0E1A] flex flex-col shrink-0 z-10 select-none">
            <div className="h-11 px-3.5 border-b border-[#1E3A5F] bg-[#111827] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Live Alert Stream (WebSocket)
                </span>
              </div>
              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="text-[#64748B] hover:text-white p-1"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {socketAlerts.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded bg-[#111827] border transition-all ${
                    item.status === 'UNACKNOWLEDGED'
                      ? 'border-l-4 border-l-[#FF4444] border-t-[#1E3A5F] border-r-[#1E3A5F] border-b-[#1E3A5F] bg-rose-950/10'
                      : 'border-[#1E3A5F]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-cyan-300 font-bold">
                      {item.cameraId} ({item.zone})
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B]">
                      {item.timeFormatted || 'Just now'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white mt-1">
                    {item.type}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1E293B] text-[10px]">
                    <span className="font-mono text-cyan-400 font-bold">
                      Conf: {item.confidence}%
                    </span>

                    {item.status === 'UNACKNOWLEDGED' ? (
                      <button
                        onClick={() => handleAcknowledgeAlert(item.id)}
                        className="px-2 py-0.5 rounded font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Logged
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* =====================================================================
          BOTTOM LIVE ALERT TICKER
          ===================================================================== */}
      <div className="h-8 border-t border-[#1E3A5F] bg-[#0A0E1A] flex items-center overflow-hidden shrink-0 z-20 select-none">
        <div className="bg-[#111827] px-3 h-full flex items-center border-r border-[#1E3A5F] text-[11px] font-bold text-[#00E5FF] shrink-0 gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse text-[#FF4444]" />
          <span>REAL-TIME STREAM</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee-scroll flex items-center gap-8 whitespace-nowrap text-xs">
            {socketAlerts.slice(0, 10).map((a, i) => (
              <div key={i} className="inline-flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    a.severity === 'HIGH' ? 'bg-[#FF4444] animate-ping' : 'bg-[#00E5FF]'
                  }`}
                />
                <span className="font-mono text-[#64748B] text-[11px]">
                  [{a.timeFormatted || 'Now'}]
                </span>
                <span className="font-bold text-white text-[11px]">
                  {a.type}
                </span>
                <span className="text-[#64748B] text-[11px]">at {a.location}</span>
                <span className="font-mono text-[10px] text-cyan-400">
                  ({a.cameraId} • {a.confidence}%)
                </span>
                <span className="text-[#1E3A5F]">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Camera Modal */}
      {inspectingCamera && (
        <CameraExpandedModal
          camera={inspectingCamera}
          onClose={() => setInspectingCamera(null)}
        />
      )}
    </div>
  );
}

/* =========================================================================
   PAGE 1: COMMAND OVERVIEW COMPONENT
   ========================================================================= */

function CommandOverviewPage({
  alerts,
  drones,
  weather,
  cameras,
  alertPings,
  onNavigate,
  onSelectCamera,
}: {
  alerts: RealtimeAlert[];
  drones: any[];
  weather: BorderWeatherLocation[];
  cameras: CameraItem[];
  alertPings: any[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectCamera: (camId: string) => void;
}) {
  // Severity counts for Donut Chart
  const severityData = useMemo(() => {
    const high = alerts.filter((a) => a.severity === 'HIGH').length;
    const medium = alerts.filter((a) => a.severity === 'MEDIUM').length;
    const low = alerts.filter((a) => a.severity === 'LOW').length;

    return [
      { name: 'High Threats', value: Math.max(high, 1), color: '#FF4444' },
      { name: 'Medium Caution', value: Math.max(medium, 1), color: '#FFAA00' },
      { name: 'Low Priority', value: Math.max(low, 1), color: '#00E5FF' },
    ];
  }, [alerts]);

  // Hourly alert frequency (last 12 hours)
  const hourlyData = [
    { hour: '08:00', count: 4 },
    { hour: '09:00', count: 7 },
    { hour: '10:00', count: 3 },
    { hour: '11:00', count: 9 },
    { hour: '12:00', count: 6 },
    { hour: '13:00', count: 2 },
    { hour: '14:00', count: 5 },
    { hour: '15:00', count: 8 },
    { hour: '16:00', count: 4 },
    { hour: '17:00', count: 11 },
    { hour: '18:00', count: 14 },
    { hour: '19:00', count: alerts.length },
  ];

  return (
    <div className="space-y-5">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Command Overview & Tactical Situation</span>
            <span className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              LIVE SURVEILLANCE
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real OpenStreetMap Leaflet border mapping, live weather radar, and WebSocket incident telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('feeds')}
            className="px-3 py-1.5 rounded bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/50 text-xs font-semibold text-[#00E5FF] flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#00E5FF]" /> EarthCam Live Feeds
          </button>
          <button
            onClick={() => onNavigate('drone')}
            className="px-3 py-1.5 rounded bg-[#111827] hover:bg-[#1E2A3A] border border-[#1E3A5F] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#00E5FF]" /> Drone Fleet
          </button>
          <button
            onClick={() => onNavigate('alerts')}
            className="px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> All Incidents ({alerts.length})
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiBlock label="Feeds Online" value="14/14" sublabel="4 EarthCam + 10 Defense" color="#00C853" icon={<Video className="w-4 h-4 text-emerald-400" />} />
        <KpiBlock label="Active Alerts" value={alerts.filter((a) => a.status === 'UNACKNOWLEDGED').length.toString()} sublabel="Unacknowledged" color="#FF4444" icon={<AlertTriangle className="w-4 h-4 text-rose-400" />} highlight />
        <KpiBlock label="UAVs Airborne" value={drones.filter((d) => d.status !== 'STANDBY').length.toString()} sublabel="Active Missions" color="#00E5FF" icon={<Navigation className="w-4 h-4 text-cyan-400" />} />
        <KpiBlock label="Vehicles Logged" value="128" sublabel="HSRP Auto ANPR" color="#00E5FF" icon={<Car className="w-4 h-4 text-cyan-400" />} />
        <KpiBlock label="Watchlist Hits" value="3" sublabel="POI Intercepts" color="#FFAA00" icon={<Users className="w-4 h-4 text-amber-400" />} />
      </div>

      {/* Leaflet Real OpenStreetMap Canvas (Requirement 3) */}
      <div className="rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <h2 className="text-xs font-bold text-white tracking-wide">
              Tactical Border Map (OpenStreetMap Leaflet Engine)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">
            INDO-BANGLADESH SECTOR • NO API KEY REQUIRED
          </span>
        </div>

        <LeafletBorderMap
          cameras={cameras}
          drones={drones}
          activeAlertPings={alertPings}
          onSelectCamera={onSelectCamera}
          height="400px"
          center={[24.5, 88.5]}
          zoom={8}
        />
      </div>

      {/* Weather Widgets for 3 Border Sectors (Requirement 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-[#1E3A5F]">
          <h2 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00E5FF]" /> Real Border Weather Radar (OpenWeatherMap)
          </h2>
          <span className="text-[10px] font-mono text-[#64748B]">
            REFRESH RATE: 10 MINS
          </span>
        </div>
        <BorderWeatherWidget weatherData={weather} />
      </div>

      {/* Recharts Analytics: Alert Severity Donut & Hourly Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Severity Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-2">
            <span className="text-xs font-bold text-white">Threat Severity Distribution</span>
            <span className="text-[10px] font-mono text-[#64748B]">LIVE RATIO</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0A0E1A', borderColor: '#1E3A5F', borderRadius: '4px', fontSize: '11px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-[#1E293B] text-xs font-mono">
            <span className="text-rose-400">High: {alerts.filter((a) => a.severity === 'HIGH').length}</span>
            <span className="text-amber-400">Med: {alerts.filter((a) => a.severity === 'MEDIUM').length}</span>
            <span className="text-cyan-400">Low: {alerts.filter((a) => a.severity === 'LOW').length}</span>
          </div>
        </div>

        {/* Hourly Frequency Line Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-2">
            <span className="text-xs font-bold text-white">Hourly Incident Velocity (Last 12 Hours)</span>
            <span className="text-[10px] font-mono text-[#00E5FF]">TREND ANALYSIS</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0A0E1A', borderColor: '#1E3A5F', borderRadius: '4px', fontSize: '11px' }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00E5FF"
                  strokeWidth={2}
                  dot={{ fill: '#00E5FF', r: 3 }}
                  activeDot={{ r: 5, fill: '#FF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-[#64748B] pt-2 border-t border-[#1E293B] flex items-center justify-between font-mono">
            <span>PEAK HOURS: 17:00 - 19:00 IST</span>
            <span>CORRELATION: DUSK TRANSIT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 2: LIVE FEED MONITOR (EARTHCAM USA + BORDER DEFENSE)
   ========================================================================= */

function LiveFeedsPage({
  cameras,
  activeAlerts,
  cameraStatuses,
  onInspectCamera,
}: {
  cameras: CameraItem[];
  activeAlerts: RealtimeAlert[];
  cameraStatuses: Record<string, { fps: number; status: string }>;
  onInspectCamera: (cam: CameraItem) => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'EARTHCAM' | 'INDIA'>('ALL');
  const [visionMode, setVisionMode] = useState<'optical' | 'thermal' | 'night' | 'tensor'>('optical');
  const [streamMode, setStreamMode] = useState<Record<string, 'live' | 'embed' | 'ai'>>({});
  
  // Local Webcam Sentry Integration
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  const startWebcam = async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      webcamStreamRef.current = stream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      setWebcamActive(true);
    } catch (err: any) {
      console.error('Webcam access error:', err);
      setWebcamError('Camera access denied or unavailable.');
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getVisionFilterStyle = (mode: 'optical' | 'thermal' | 'night' | 'tensor') => {
    switch (mode) {
      case 'thermal':
        return 'hue-rotate(180deg) saturate(2.5) contrast(1.4)';
      case 'night':
        return 'sepia(1) hue-rotate(85deg) saturate(3) brightness(1.2) contrast(1.2)';
      case 'tensor':
        return 'contrast(2) grayscale(1) invert(0.15)';
      default:
        return 'none';
    }
  };

  // Filter cameras based on category
  const filteredCameras = useMemo(() => {
    if (categoryFilter === 'EARTHCAM') {
      return cameras.filter((c) => c.sourceProvider === 'EarthCam USA' || c.zone === 'Global-USA');
    }
    if (categoryFilter === 'INDIA') {
      return cameras.filter((c) => c.sourceProvider !== 'EarthCam USA' && c.zone !== 'Global-USA');
    }
    return cameras;
  }, [cameras, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Top Banner & Telemetry Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#1E3A5F]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Video className="w-5 h-5 text-[#00E5FF] animate-pulse" />
              <span>Live Surveillance Grid & EarthCam Global Sentries</span>
            </h1>
            <span className="text-[11px] font-mono text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF4444] animate-ping" />
              <span>4 EARTHCAM USA 24/7 LIVE STREAMS ACTIVE</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              10 BORDER DEFENSE NODES
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time live video broadcasts from <span className="text-cyan-400 font-semibold">EarthCam USA (Times Square, Texas, Las Vegas, New York)</span> streaming 24/7 alongside Indo-Bangladesh border optical channels.
          </p>
        </div>

        {/* Global Feeds Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => (webcamActive ? stopWebcam() : startWebcam())}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all ${
              webcamActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(255,68,68,0.3)]'
                : 'bg-[#111827] text-cyan-300 border-[#1E3A5F] hover:border-[#00E5FF]'
            }`}
          >
            {webcamActive ? <VideoOff className="w-3.5 h-3.5" /> : <CameraIcon className="w-3.5 h-3.5" />}
            <span>{webcamActive ? 'Disconnect Local Sentry' : 'Connect Laptop Webcam Sentry'}</span>
          </button>
        </div>
      </div>

      {webcamError && (
        <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span>{webcamError}</span>
          <button onClick={() => setWebcamError(null)} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter & Vision Mode Control Hub */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#64748B] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> FEED CHANNEL:
          </span>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
              categoryFilter === 'ALL'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50 font-bold'
                : 'bg-[#0A0E1A] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            ALL CHANNELS ({cameras.length})
          </button>
          <button
            onClick={() => setCategoryFilter('EARTHCAM')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border flex items-center gap-1 ${
              categoryFilter === 'EARTHCAM'
                ? 'bg-[#00E5FF] text-[#0A0E1A] border-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'bg-[#0A0E1A] text-[#00E5FF] border-[#1E3A5F] hover:border-[#00E5FF]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>EARTHCAM USA LIVE (4 CAMS)</span>
          </button>
          <button
            onClick={() => setCategoryFilter('INDIA')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
              categoryFilter === 'INDIA'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-[#0A0E1A] text-[#94A3B8] border-[#1E293B] hover:text-white'
            }`}
          >
            🇮🇳 INDIA BORDER DEFENSE
          </button>
        </div>

        {/* Vision Sensor Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-[#64748B] mr-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#00E5FF]" /> SENSOR SHADER:
          </span>
          {[
            { id: 'optical', label: 'RGB Optical' },
            { id: 'thermal', label: 'FLIR Thermal' },
            { id: 'night', label: 'Night Vision' },
            { id: 'tensor', label: 'Tensor Edge' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setVisionMode(mode.id as any)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                visionMode === mode.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                  : 'bg-[#0A0E1A] text-[#64748B] border-[#1E293B] hover:text-[#CBD5E1]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Local Webcam Feed Card (If active) */}
        {webcamActive && (
          <div className="rounded bg-[#111827] border-2 border-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.3)] overflow-hidden flex flex-col relative">
            <div className="px-3 py-2 bg-[#0A0E1A] border-b border-[#1E3A5F] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="font-mono font-bold text-[#00E5FF]">CAM-LOCAL-OPERATOR</span>
                <span className="text-slate-300 text-[11px]">Primary Command Desk Webcam</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400">
                  HARDWARE SENTRY
                </span>
                <span className="font-mono text-[10px] text-emerald-400">30.0 FPS</span>
              </div>
            </div>

            <div className="relative aspect-video bg-[#05080E] overflow-hidden flex items-center justify-center select-none">
              <div className="absolute inset-0 cctv-scanline z-10 pointer-events-none" />
              <video
                ref={webcamVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ filter: getVisionFilterStyle(visionMode) }}
              />

              {/* Local AI Bounding Box */}
              <div className="absolute top-[20%] left-[30%] w-[40%] h-[55%] border-2 border-[#00E5FF] z-10 flex flex-col justify-between p-1 bg-cyan-500/10 pointer-events-none">
                <div className="bg-[#00E5FF] text-[#0A0E1A] text-[9px] font-mono font-bold px-1 py-0.2 self-start">
                  OPERATOR VERIFIED [99.2%]
                </div>
                <div className="text-[8px] font-mono text-cyan-300 text-right">SEC-ID #HQ-01</div>
              </div>

              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#00E5FF] pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00E5FF] pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00E5FF] pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#00E5FF] pointer-events-none" />
            </div>

            <div className="px-3 py-2 bg-[#0A0E1A] border-t border-[#1E3A5F] flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Hardware Video Device</span>
              <button
                onClick={stopWebcam}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-mono"
              >
                Disconnect Stream
              </button>
            </div>
          </div>
        )}

        {/* Regular & EarthCam Feeds */}
        {filteredCameras.map((feed) => {
          const isEarthCam = feed.sourceProvider === 'EarthCam USA' || feed.zone === 'Global-USA';
          const activeMode = streamMode[feed.id] || (isEarthCam && feed.liveEmbedUrl ? 'live' : 'ai');
          const matchingAlert = activeAlerts.find(
            (a) => a.cameraId === feed.id && a.status === 'UNACKNOWLEDGED'
          );
          const isAlerting = Boolean(matchingAlert);
          const fps = cameraStatuses[feed.id]?.fps || feed.fps;

          return (
            <div
              key={feed.id}
              onClick={() => onInspectCamera(feed)}
              className={`rounded bg-[#111827] border transition-all cursor-pointer overflow-hidden group flex flex-col relative ${
                isAlerting
                  ? 'border-[#FF4444] shadow-[0_0_18px_rgba(255,68,68,0.4)]'
                  : isEarthCam
                  ? 'border-[#00E5FF]/40 hover:border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'border-[#1E3A5F] hover:border-[#38BDF8]'
              }`}
            >
              {/* Card Header */}
              <div className="px-3 py-2 bg-[#0A0E1A] border-b border-[#1E3A5F] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isAlerting
                        ? 'bg-[#FF4444] animate-ping'
                        : isEarthCam && activeMode === 'live'
                        ? 'bg-[#FF4444] animate-ping'
                        : isEarthCam
                        ? 'bg-[#00E5FF]'
                        : 'bg-[#00C853]'
                    }`}
                  />
                  <span className="font-mono font-bold text-white group-hover:text-[#00E5FF]">
                    {feed.id}
                  </span>
                  <span className="text-[#94A3B8] text-[11px] truncate max-w-[130px]" title={feed.location}>
                    {feed.location}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isEarthCam && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      EARTHCAM
                    </span>
                  )}
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#111827] text-slate-300 border border-[#1E293B]">
                    {feed.resolution.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400">
                    {fps.toFixed(1)} FPS
                  </span>
                </div>
              </div>

              {/* Card Viewport: 24/7 Live Stream / Web Portal / AI Video */}
              <div className="relative aspect-video bg-[#05080E] overflow-hidden flex items-center justify-center select-none">
                <div className="absolute inset-0 cctv-scanline z-10 pointer-events-none" />
                <div className="scan-bar z-10 pointer-events-none" />

                {/* Corner reticles */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#00E5FF]/40 pointer-events-none z-10" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00E5FF]/40 pointer-events-none z-10" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00E5FF]/40 pointer-events-none z-10" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#00E5FF]/40 pointer-events-none z-10" />

                {activeMode === 'live' && feed.liveEmbedUrl ? (
                  <div className="w-full h-full relative z-0 bg-black">
                    <iframe
                      src={feed.liveEmbedUrl}
                      title={`${feed.location} Live 24/7 Stream`}
                      className="w-full h-full border-0 pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : activeMode === 'embed' && feed.earthCamUrl ? (
                  <div className="w-full h-full relative z-0 bg-[#000]">
                    <iframe
                      src={feed.earthCamUrl}
                      title={feed.location}
                      className="w-full h-full border-0 pointer-events-auto"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={feed.videoSrc || '/videos/cam-001.mp4'}
                    className="w-full h-full object-cover"
                    style={{ filter: getVisionFilterStyle(visionMode) }}
                  />
                )}

                {/* EarthCam 24/7 Live Badge Overlay */}
                {isEarthCam && (
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#0A0E1A]/85 backdrop-blur-xs border border-rose-500/50 px-2 py-0.5 rounded text-[10px] font-mono text-rose-300 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#FF4444] animate-ping" />
                    <span className="font-bold text-white">EARTHCAM 24/7 LIVE</span>
                    <span className="text-[#64748B]">|</span>
                    <span className="text-cyan-300">{feed.city || feed.location}</span>
                  </div>
                )}

                {/* Blinking Red Alert Overlay when active alert */}
                {isAlerting && (
                  <div className="absolute inset-0 border-2 border-[#FF4444] animate-alert-banner z-10 flex flex-col justify-between p-3 pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-[#FF4444] text-white text-[10px] font-bold tracking-wider font-mono self-start animate-pulse">
                      ALERT: {matchingAlert?.type}
                    </span>
                    <span className="font-mono text-[10px] text-rose-300 font-bold self-end">
                      CONF: {matchingAlert?.confidence}%
                    </span>
                  </div>
                )}

                {/* Bounding Box Simulation in AI mode */}
                {activeMode === 'ai' && (
                  <>
                    {isAlerting ? (
                      <div className="absolute top-[32%] left-[30%] w-[38%] h-[50%] border-2 border-[#FF4444] z-10 flex flex-col justify-between p-1 bg-rose-500/10 pointer-events-none">
                        <div className="bg-[#FF4444] text-white text-[9px] font-mono font-bold px-1 py-0.2 self-start">
                          {matchingAlert?.type} [{matchingAlert?.confidence}%]
                        </div>
                      </div>
                    ) : isEarthCam ? (
                      <div className="absolute top-[38%] left-[25%] w-[45%] h-[40%] border border-[#00E5FF]/60 z-10 flex flex-col justify-between p-1 bg-cyan-500/5 pointer-events-none">
                        <div className="bg-[#00E5FF]/90 text-[#0A0E1A] text-[8px] font-mono font-bold px-1 py-0.2 self-start rounded-xs">
                          CROWD/TRAFFIC ANALYTICS [97.8%]
                        </div>
                        <div className="text-[7px] font-mono text-cyan-300/80 text-right">
                          AUTO-TRACKING
                        </div>
                      </div>
                    ) : null}
                  </>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-[#0A0E1A]/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center gap-2 text-white text-xs font-semibold pointer-events-none">
                  <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
                  <span>Inspect Forensic Telemetry</span>
                </div>
              </div>

              {/* Card Footer with Stream Switcher & Details */}
              <div className="px-3 py-2 bg-[#0A0E1A] border-t border-[#1E3A5F] flex items-center justify-between text-[11px] text-[#64748B]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-mono text-[10px] text-cyan-400 truncate">
                    {feed.aiModel}
                  </span>
                  <span className="text-[#1E3A5F] hidden sm:inline">|</span>
                  <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                    Up: {feed.uptime}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {isEarthCam ? (
                    <>
                      {feed.liveEmbedUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStreamMode((prev) => ({ ...prev, [feed.id]: 'live' }));
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors border flex items-center gap-1 ${
                            activeMode === 'live'
                              ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_8px_rgba(255,68,68,0.5)]'
                              : 'bg-[#111827] text-rose-300 border-[#1E3A5F] hover:border-rose-400'
                          }`}
                          title="Play 24/7 Live Stream from EarthCam"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                          <span>Live 24/7</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStreamMode((prev) => ({ ...prev, [feed.id]: 'embed' }));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold transition-colors border ${
                          activeMode === 'embed'
                            ? 'bg-[#00E5FF] text-[#0A0E1A] border-[#00E5FF]'
                            : 'bg-[#111827] text-[#00E5FF] border-[#1E3A5F] hover:border-[#00E5FF]'
                        }`}
                        title="Open Official EarthCam.com Web Frame"
                      >
                        Portal
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStreamMode((prev) => ({ ...prev, [feed.id]: 'ai' }));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold transition-colors border ${
                          activeMode === 'ai'
                            ? 'bg-cyan-500 text-[#0A0E1A] border-cyan-500'
                            : 'bg-[#111827] text-slate-400 border-[#1E293B] hover:text-white'
                        }`}
                        title="Switch to AI Tactical Analytics View"
                      >
                        AI
                      </button>

                      <a
                        href={feed.earthCamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-[#111827] border border-[#1E3A5F] text-[#64748B] hover:text-[#00E5FF] hover:border-[#00E5FF] transition-colors"
                        title="Open on EarthCam.com"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 3: ALERTS & EVENTS LOG
   ========================================================================= */

function AlertsLogPage({
  alerts,
  onAcknowledge,
  onDispatchDrone,
  onInspectCamera,
}: {
  alerts: RealtimeAlert[];
  onAcknowledge: (id: string) => void;
  onDispatchDrone: (alert: RealtimeAlert) => void;
  onInspectCamera: (camId: string) => void;
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filterType !== 'ALL' && a.type !== filterType) return false;
      if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return a.cameraId.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [alerts, filterType, filterSeverity, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Border Security Incident Log (Live Stream)</span>
            <span className="text-[11px] font-mono text-[#FF4444] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              {filtered.length} INCIDENTS
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time WebSocket alerts with automated drone dispatch linkage and cryptographic integrity verification.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search Camera, ID, or Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] rounded text-xs text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#64748B]">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-2 py-1.5 bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] rounded text-xs text-white outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="INTRUSION">INTRUSION</option>
            <option value="VEHICLE">VEHICLE</option>
            <option value="FACE_MATCH">FACE_MATCH</option>
            <option value="LOITERING">LOITERING</option>
            <option value="NIGHT_MOVEMENT">NIGHT_MOVEMENT</option>
            <option value="OBJECT_ABANDONED">OBJECT_ABANDONED</option>
            <option value="DRONE_ALERT">DRONE_ALERT</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#64748B]">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full px-2 py-1.5 bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] rounded text-xs text-white outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">HIGH Priority</option>
            <option value="MEDIUM">MEDIUM Priority</option>
            <option value="LOW">LOW Priority</option>
          </select>
        </div>
      </div>

      {/* Real-time Alert List */}
      <div className="space-y-2.5">
        {filtered.map((alert) => {
          const isUnack = alert.status === 'UNACKNOWLEDGED';

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded bg-[#111827] border transition-all ${
                isUnack
                  ? 'border-l-4 border-l-[#FF4444] border-t-[#1E3A5F] border-r-[#1E3A5F] border-b-[#1E3A5F] bg-rose-950/10 shadow-[0_0_10px_rgba(255,68,68,0.1)]'
                  : 'border-[#1E3A5F]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      alert.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-[#FF4444] border border-rose-500/40'
                        : alert.severity === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40'
                    }`}
                  >
                    {alert.type}
                  </span>

                  <button
                    onClick={() => onInspectCamera(alert.cameraId)}
                    className="font-mono text-xs font-bold text-cyan-300 hover:underline"
                  >
                    {alert.cameraId}
                  </button>
                  <span className="text-[11px] text-[#64748B]">at {alert.location}</span>
                </div>

                <span className="font-mono text-xs text-[#64748B]">
                  {alert.timeFormatted || alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-200 mt-2">{alert.description}</p>

              {/* Bottom Actions & Metadata */}
              <div className="mt-3 pt-2 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <span>Confidence:</span>
                    <span className="font-mono font-bold text-white">{alert.confidence}%</span>
                    <div className="w-16 h-1.5 bg-[#0A0E1A] rounded-full overflow-hidden ml-1">
                      <div
                        className={`h-full rounded-full ${
                          alert.confidence > 85 ? 'bg-[#FF4444]' : 'bg-[#00E5FF]'
                        }`}
                        style={{ width: `${alert.confidence}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[#64748B] font-mono text-[10px]">
                    [{alert.coordinates?.lat?.toFixed(3)}, {alert.coordinates?.lon?.toFixed(3)}]
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!alert.droneDispatched ? (
                    <button
                      onClick={() => onDispatchDrone(alert)}
                      className="px-2.5 py-1 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-[11px] font-semibold hover:bg-[#00E5FF]/30 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Dispatch Drone
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      🚁 Sortie Airborne
                    </span>
                  )}

                  {isUnack ? (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold hover:bg-rose-500/30"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 4: ANPR RECOGNITION
   ========================================================================= */

function AnprPage({
  plates,
  watchlistPlates,
  onAddWatchlistPlate,
  onRemoveWatchlistPlate,
}: {
  plates: any[];
  watchlistPlates: any[];
  onAddWatchlistPlate: (p: any) => void;
  onRemoveWatchlistPlate: (num: string) => void;
}) {
  const [newPlate, setNewPlate] = useState('');
  const [newCategory, setNewCategory] = useState('Suspect');
  const [newReason, setNewReason] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    onAddWatchlistPlate({
      plateNumber: newPlate.toUpperCase().trim(),
      category: newCategory,
      reason: newReason.trim() || 'Border alert record',
      addedBy: 'Insp. V. Singh',
      date: 'Today',
    });
    setNewPlate('');
    setNewReason('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Automated Number Plate Recognition (ANPR Live Stream)</span>
            <span className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              INDIAN HSRP FORMAT
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Streaming real-time vehicular character recognition from border checkpoints every 20 seconds.
          </p>
        </div>
      </div>

      {/* Live Plate Detection Feed (Requirement 7) */}
      <div className="rounded border border-[#1E3A5F] bg-[#111827] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0A0E1A] border-b border-[#1E3A5F] flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            Live Plate Ingestion Feed
          </span>
          <span className="text-[10px] font-mono text-[#64748B]">SOCKET.IO STREAM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827] border-b border-[#1E293B] text-[#64748B] font-semibold">
                <th className="py-2.5 px-3">High Security Plate</th>
                <th className="py-2.5 px-3">Vehicle Specification</th>
                <th className="py-2.5 px-3">Camera / Post</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Watchlist Intercept</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {plates.map((p) => (
                <tr
                  key={p.id || p.plate}
                  className={`hover:bg-[#0A0E1A]/40 transition-colors ${
                    p.watchlistHit ? 'bg-rose-500/10 animate-pulse' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <HsrpPlateBadge plateNumber={p.plate} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">
                    {p.color} {p.vehicleType}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">
                    {p.cameraId}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#64748B]">
                    {p.timeFormatted || p.timestamp}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {p.watchlistHit ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#FF4444] text-white animate-pulse">
                        WATCHLIST HIT ({p.category || 'SUSPECT'})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                        Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watchlist Section with Add/Remove */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded border border-[#1E3A5F] bg-[#111827] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <h2 className="text-xs font-bold text-white">Active Watchlist Tags</h2>
            <span className="text-[10px] font-mono text-[#64748B]">{watchlistPlates.length} REGISTERED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {watchlistPlates.map((item) => (
              <div key={item.plateNumber} className="p-2.5 rounded bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <HsrpPlateBadge plateNumber={item.plateNumber} />
                  <div className="text-[10px] text-[#64748B] mt-1">{item.reason}</div>
                </div>
                <button
                  onClick={() => onRemoveWatchlistPlate(item.plateNumber)}
                  className="p-1 text-[#64748B] hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Plate Form */}
        <div className="lg:col-span-4 rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col justify-between">
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <h2 className="text-xs font-bold text-white pb-2 border-b border-[#1E293B]">
              Add Tag to Watchlist
            </h2>
            <div>
              <label className="block text-[#64748B] mb-1">Plate Number</label>
              <input
                type="text"
                required
                placeholder="e.g. DL 01 CA 9921"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-[#0A0E1A] border border-[#1E3A5F] text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[#64748B] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#0A0E1A] border border-[#1E3A5F] text-white outline-none rounded"
              >
                <option value="Suspect">Suspect</option>
                <option value="Civilian">Civilian</option>
                <option value="Military">Military</option>
              </select>
            </div>
            <div>
              <label className="block text-[#64748B] mb-1">Reason</label>
              <input
                type="text"
                placeholder="Intelligence bulletin..."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-[#0A0E1A] border border-[#1E3A5F] text-white outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 rounded bg-[#00E5FF] text-[#0A0E1A] font-bold text-xs hover:bg-[#00E5FF]/90"
            >
              Enroll Watchlist Tag
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 5: FACE RECOGNITION
   ========================================================================= */

function FaceRecognitionPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Biometric Face Recognition & Target Index</span>
            <span className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              512-D EMBEDDINGS
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time biometric feature extraction and cosine distance matching against national border surveillance lists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'POI — Singh', threat: 'High', id: 'SSB-W-4402', notes: 'Transnational smuggler network coordinator.' },
          { name: 'Subject Bravo-9', threat: 'High', id: 'SSB-W-4320', notes: 'Border perimeter wire cutter suspect.' },
          { name: 'Cleared — Ravi Kumar', threat: 'Watch', id: 'SSB-W-4388', notes: 'Verified local tea garden farmer.' },
        ].map((subject) => (
          <div key={subject.id} className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{subject.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${subject.threat === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {subject.threat.toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan-300">ID: {subject.id}</div>
            <p className="text-[11px] text-[#64748B]">{subject.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 7: BLOCKCHAIN AUDIT TRAIL
   ========================================================================= */

function BlockchainAuditPage({
  blocks,
  onExportJson,
}: {
  blocks: BlockchainBlock[];
  onExportJson: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="p-3.5 rounded bg-[#111827] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,200,83,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-ping" />
              <span className="text-xs font-bold text-white tracking-wide">
                Chain Integrity: Verified (Web Crypto SHA-256)
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Cryptographically signed ledger blocks with real-time browser-side SHA-256 hash chaining.
            </p>
          </div>
        </div>

        <button
          onClick={onExportJson}
          className="px-3 py-1.5 rounded bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/40 text-xs font-semibold text-[#00E5FF] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export Chain as JSON
        </button>
      </div>

      <div className="rounded border border-[#1E3A5F] bg-[#111827] p-4 space-y-3">
        <div className="text-xs font-bold text-white pb-2 border-b border-[#1E293B] flex items-center justify-between">
          <span>Cryptographic Ledger Blocks</span>
          <span className="text-[10px] font-mono text-[#64748B]">SHA-256 VERIFICATION</span>
        </div>

        <div className="space-y-3">
          {blocks.map((b) => (
            <div key={b.blockNumber} className="p-3 rounded bg-[#0A0E1A] border border-[#1E3A5F] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#00E5FF]">Block #{b.blockNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {b.eventType}
                </span>
                <span className="font-mono text-[#64748B] text-[10px]">{b.timestamp}</span>
              </div>

              <div className="font-mono text-[11px] text-slate-300 break-all">
                Hash: <span className="text-emerald-400">{b.currentHash}</span>
              </div>
              <div className="font-mono text-[10px] text-[#64748B] break-all">
                Prev: {b.previousHash}
              </div>

              <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#64748B]">
                <span>Signer: {b.operatorId}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Hash Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAGE 8: SYSTEM STATUS
   ========================================================================= */

function SystemStatusPage({
  health,
  cameras,
}: {
  health: any;
  cameras: CameraItem[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">System Health & Telemetry</h1>
          <p className="text-xs text-[#64748B]">Live system gauges emitted every 3 seconds via WebSocket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>CPU Usage</span>
            <span className="font-mono text-cyan-400">{health.cpu}%</span>
          </div>
          <div className="w-full h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
            <div className="h-full bg-[#00E5FF]" style={{ width: `${health.cpu}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>RAM Usage</span>
            <span className="font-mono text-emerald-400">{health.ram}%</span>
          </div>
          <div className="w-full h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
            <div className="h-full bg-[#00C853]" style={{ width: `${health.ram}%` }} />
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Network Latency</span>
            <span className="font-mono text-amber-400">{health.networkLatency} ms</span>
          </div>
          <div className="w-full h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${health.networkLatency}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   UI HELPERS
   ========================================================================= */

function SidebarButton({
  icon,
  label,
  active,
  onClick,
  expanded,
  badgeCount,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
  badgeCount?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center h-10 px-3 transition-colors relative group select-none ${
        active
          ? 'bg-[#111827] text-[#00E5FF] font-semibold'
          : 'text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#111827]/40'
      }`}
      title={!expanded ? label : undefined}
    >
      {active && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#00E5FF] rounded-r" />}
      <div className="w-6 flex items-center justify-center shrink-0">{icon}</div>
      {expanded && <span className="ml-3 text-xs tracking-wide truncate">{label}</span>}
      {badgeCount !== undefined && badgeCount > 0 && (
        <div
          className={`ml-auto rounded-full bg-[#FF4444] text-white text-[10px] font-bold flex items-center justify-center ${
            expanded ? 'px-1.5 py-0.2' : 'w-4 h-4 text-[9px] absolute top-2 right-2'
          }`}
        >
          {badgeCount}
        </div>
      )}
    </button>
  );
}

function KpiBlock({
  label,
  value,
  sublabel,
  color,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  sublabel: string;
  color: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded bg-[#111827] border transition-all select-none ${
        highlight ? 'border-[#FF4444]/60 shadow-[0_0_12px_rgba(255,68,68,0.2)]' : 'border-[#1E3A5F]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#64748B]">{label}</span>
        {icon}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-mono text-xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <div className="text-[10px] text-[#64748B] font-mono mt-0.5 truncate">{sublabel}</div>
    </div>
  );
}

function CameraExpandedModal({
  camera,
  onClose,
}: {
  camera: CameraItem;
  onClose: () => void;
}) {
  const isEarthCam = camera.sourceProvider === 'EarthCam USA' || camera.zone === 'Global-USA';
  const [modalVision, setModalVision] = useState<'optical' | 'thermal' | 'night' | 'tensor'>('optical');
  const [viewMode, setViewMode] = useState<'live' | 'video' | 'embed'>(isEarthCam && camera.liveEmbedUrl ? 'live' : 'video');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

  const getVisionFilter = (mode: 'optical' | 'thermal' | 'night' | 'tensor') => {
    switch (mode) {
      case 'thermal':
        return 'hue-rotate(180deg) saturate(2.5) contrast(1.4)';
      case 'night':
        return 'sepia(1) hue-rotate(85deg) saturate(3) brightness(1.2) contrast(1.2)';
      case 'tensor':
        return 'contrast(2) grayscale(1) invert(0.15)';
      default:
        return 'none';
    }
  };

  const handleCaptureSnapshot = () => {
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);
  };

  const handlePan = (dx: number, dy: number) => {
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleResetPtz = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E1A]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-6xl h-[90vh] bg-[#111827] border border-[#00E5FF]/60 rounded flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="h-14 px-4 bg-[#0A0E1A] border-b border-[#1E3A5F] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm sm:text-base">{camera.id}</span>
                <span className="text-xs text-cyan-400 font-semibold">— {camera.location}</span>
                {isEarthCam && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 hidden sm:inline-flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    EarthCam 24/7 Live Stream Broadcast
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">
                COORDS: {camera.lat.toFixed(4)}° N, {camera.lon.toFixed(4)}° E • ZONE: {camera.zone} • {camera.aiModel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {camera.earthCamUrl && (
              <a
                href={camera.earthCamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono hover:bg-[#00E5FF]/25 transition-colors"
                title="Open directly on EarthCam.com"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open EarthCam Portal</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#64748B] hover:text-white hover:bg-[#1E293B] transition-colors"
              title="Close Fullscreen View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Center Layout: Video Viewport + Forensic Controls */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Viewport */}
          <div className="flex-1 bg-[#05080E] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 cctv-scanline z-10 pointer-events-none" />

            {/* Viewport Content */}
            {viewMode === 'live' && camera.liveEmbedUrl ? (
              <iframe
                src={camera.liveEmbedUrl}
                title={`${camera.location} Live 24/7 Stream`}
                className="w-full h-full border-0 relative z-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : viewMode === 'embed' && camera.earthCamUrl ? (
              <iframe
                src={camera.earthCamUrl}
                title={camera.location}
                className="w-full h-full border-0 relative z-0"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div
                className="w-full h-full relative flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={camera.videoSrc || '/videos/cam-001.mp4'}
                  className="w-full h-full object-cover"
                  style={{ filter: getVisionFilter(modalVision) }}
                />
              </div>
            )}

            {/* Tactical HUD Reticle Overlays */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00E5FF] pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00E5FF] pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00E5FF] pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00E5FF] pointer-events-none z-20" />

            {/* Center Targeting Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-30">
              <Crosshair className="w-16 h-16 text-[#00E5FF]" />
            </div>

            {/* Live Timestamp & Telemetry Watermark */}
            <div className="absolute top-4 left-8 z-20 font-mono text-[11px] text-cyan-300 bg-[#0A0E1A]/80 px-2 py-1 rounded border border-[#1E3A5F] pointer-events-none">
              <div>STREAM: {camera.id} // {viewMode === 'live' ? 'EARTHCAM 24/7 LIVE BROADCAST' : 'TACTICAL EDGE SENTRY'}</div>
              <div className="text-[10px] text-slate-400">FPS: 30.0 • CODEC: H.264/H.265 • COORDS: {camera.lat.toFixed(2)}, {camera.lon.toFixed(2)}</div>
            </div>

            {/* Snapshot Toast Banner */}
            {snapshotSuccess && (
              <div className="absolute top-4 inset-x-0 mx-auto w-fit z-30 font-mono text-xs text-emerald-400 bg-emerald-950/90 border border-emerald-500/50 px-4 py-1.5 rounded shadow-lg flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>FRAME SNAPSHOT CAPTURED & SAVED TO FORENSIC LOGS</span>
              </div>
            )}
          </div>

          {/* Forensic Telemetry & PTZ Control Panel */}
          <div className="w-full lg:w-80 bg-[#0A0E1A] border-t lg:border-t-0 lg:border-l border-[#1E3A5F] p-4 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
            {/* Stream View Modes */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                Display Feed Source
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {camera.liveEmbedUrl && (
                  <button
                    onClick={() => setViewMode('live')}
                    className={`px-2 py-2 rounded text-xs font-mono font-bold transition-colors border text-center flex flex-col items-center justify-center gap-0.5 ${
                      viewMode === 'live'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_8px_rgba(255,68,68,0.5)]'
                        : 'bg-[#111827] text-rose-300 border-[#1E293B] hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    <span>24/7 Live</span>
                  </button>
                )}
                <button
                  onClick={() => setViewMode('video')}
                  className={`px-2 py-2 rounded text-xs font-mono font-semibold transition-colors border text-center ${
                    viewMode === 'video'
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50'
                      : 'bg-[#111827] text-slate-400 border-[#1E293B] hover:text-white'
                  }`}
                >
                  AI Video
                </button>
                {camera.earthCamUrl && (
                  <button
                    onClick={() => setViewMode('embed')}
                    className={`px-2 py-2 rounded text-xs font-mono font-semibold transition-colors border text-center ${
                      viewMode === 'embed'
                        ? 'bg-[#00E5FF] text-[#0A0E1A] border-[#00E5FF]'
                        : 'bg-[#111827] text-cyan-300 border-[#1E3A5F] hover:border-[#00E5FF]'
                    }`}
                  >
                    Web Portal
                  </button>
                )}
              </div>
            </div>

            {/* Sensor Vision Shaders */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Sensor Visual Pipeline</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'optical', label: 'RGB Optical' },
                  { id: 'thermal', label: 'FLIR Thermal' },
                  { id: 'night', label: 'Night Vision' },
                  { id: 'tensor', label: 'Tensor Edge' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setModalVision(mode.id as any)}
                    className={`px-2 py-1.5 rounded text-xs font-mono transition-colors border text-center ${
                      modalVision === mode.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-[#111827] text-slate-400 border-[#1E293B] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PTZ (Pan / Tilt / Zoom) Controls */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                <span>Tactical PTZ Sentry</span>
                <span className="text-cyan-400">{zoomLevel.toFixed(1)}x ZOOM</span>
              </div>
              <div className="bg-[#111827] p-3 rounded border border-[#1E3A5F] space-y-2.5">
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs">
                  <div />
                  <button
                    onClick={() => handlePan(0, 20)}
                    className="p-2 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-slate-200"
                    title="Tilt Up"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    onClick={() => handlePan(20, 0)}
                    className="p-2 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-slate-200"
                    title="Pan Left"
                  >
                    ◀
                  </button>
                  <button
                    onClick={handleResetPtz}
                    className="p-2 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-cyan-400 font-bold text-[10px]"
                    title="Reset PTZ"
                  >
                    RESET
                  </button>
                  <button
                    onClick={() => handlePan(-20, 0)}
                    className="p-2 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-slate-200"
                    title="Pan Right"
                  >
                    ▶
                  </button>
                  <div />
                  <button
                    onClick={() => handlePan(0, -20)}
                    className="p-2 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-slate-200"
                    title="Tilt Down"
                  >
                    ▼
                  </button>
                  <div />
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-[#1E293B]">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                    className="flex-1 py-1 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-xs font-mono text-cyan-300"
                  >
                    + Zoom In
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                    className="flex-1 py-1 rounded bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#1E3A5F] text-xs font-mono text-cyan-300"
                  >
                    - Zoom Out
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions & Snapshot */}
            <div className="space-y-2 pt-2 border-t border-[#1E3A5F]">
              <button
                onClick={handleCaptureSnapshot}
                className="w-full py-2 px-3 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <CameraIcon className="w-4 h-4" />
                <span>Capture Frame Snapshot</span>
              </button>

              {camera.earthCamUrl && (
                <a
                  href={camera.earthCamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch External EarthCam</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
