// client/src/pages/LiveFeeds.jsx
import React, { useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import { Video, Grid, Sliders, Filter, Globe } from 'lucide-react';

const FEEDS = [
  // --- EARTHCAM USA FEEDS ---
  {
    id: 'CAM-USA-01',
    location: 'Times Square, USA',
    zone: 'Global-USA',
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'EarthCam-CrowdFlow-AI',
    uptime: '99.99%',
    videoSrc: '/videos/cam-001.mp4',
    earthCamUrl: 'https://www.earthcam.com/usa/newyork/timessquare/?cam=tsstreet',
    sourceProvider: 'EarthCam USA',
  },
  {
    id: 'CAM-USA-02',
    location: 'Texas, USA',
    zone: 'Global-USA',
    status: 'Online',
    resolution: '1080p 60FPS',
    fps: 29.9,
    aiModel: 'YOLO-v9-HighwaySec',
    uptime: '99.95%',
    videoSrc: '/videos/cam-002.mp4',
    earthCamUrl: 'https://www.earthcam.com/usa/texas/dallas/dealeyplaza/?cam=dealeyplaza',
    sourceProvider: 'EarthCam USA',
  },
  {
    id: 'CAM-USA-03',
    location: 'Las Vegas, USA',
    zone: 'Global-USA',
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'ThermalNet-Urban-v2',
    uptime: '99.98%',
    videoSrc: '/videos/cam-003.mp4',
    earthCamUrl: 'https://www.earthcam.com/usa/nevada/lasvegas/index.php?cam=catsmeow_fremont',
    sourceProvider: 'EarthCam USA',
  },
  {
    id: 'CAM-USA-04',
    location: 'New York, USA',
    zone: 'Global-USA',
    status: 'Online',
    resolution: '4K Ultra HD',
    fps: 30.0,
    aiModel: 'DeepMaritime-Optic',
    uptime: '99.97%',
    videoSrc: '/videos/cam-004.mp4',
    earthCamUrl: 'https://www.earthcam.com/usa/newyork/skyline/?cam=skyline_g',
    sourceProvider: 'EarthCam USA',
  },

  // --- INDIA BORDER DEFENSE NODES ---
  { id: 'CAM-001', location: 'Petrapole ICP Checkpoint', zone: 'Charlie', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', uptime: '99.9%', videoSrc: '/videos/cam-005.mp4', sourceProvider: 'IBVAP Defense Edge' },
  { id: 'CAM-002', location: 'Hilli Border Outpost Fence', zone: 'Bravo', status: 'Degraded', resolution: '1080p 60FPS', fps: 22.4, aiModel: 'ThermalNet-v3', uptime: '97.2%', videoSrc: '/videos/cam-012.mp4', sourceProvider: 'IBVAP Defense Edge' },
  { id: 'CAM-003', location: 'Changrabandha Corridor', zone: 'Bravo', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', uptime: '99.8%', videoSrc: '/videos/cam-001.mp4', sourceProvider: 'IBVAP Defense Edge' },
  { id: 'CAM-004', location: 'Fulbari Riverine Sentry', zone: 'Alpha', status: 'Online', resolution: '1080p 60FPS', fps: 29.8, aiModel: 'DeepFlow-Water', uptime: '99.9%', videoSrc: '/videos/cam-002.mp4', sourceProvider: 'IBVAP Defense Edge' },
  { id: 'CAM-005', location: 'Ghojadanga Border Culvert', zone: 'Delta', status: 'Online', resolution: '1080p 60FPS', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', uptime: '99.5%', videoSrc: '/videos/cam-003.mp4', sourceProvider: 'IBVAP Defense Edge' },
  { id: 'CAM-012', location: 'Panitanki ICP Gate 1', zone: 'Charlie', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', uptime: '100%', videoSrc: '/videos/cam-004.mp4', sourceProvider: 'IBVAP Defense Edge' },
];

export default function LiveFeeds({
  cameraStatuses = {},
  alerts = [],
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredFeeds = FEEDS.filter((cam) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'EARTHCAM') return cam.sourceProvider === 'EarthCam USA';
    if (selectedFilter === 'INDIA') return cam.sourceProvider === 'IBVAP Defense Edge';
    return cam.zone === selectedFilter;
  });

  return (
    <div className="space-y-4">
      {/* Feed Filters */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
            PRIMARY RTSP OPTICAL, THERMAL & EARTHCAM USA CHANNELS
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#64748B]">FILTER:</span>
          {['ALL', 'EARTHCAM', 'INDIA', 'Alpha', 'Bravo', 'Charlie', 'Delta'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
                selectedFilter === filter
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                  : 'bg-[#0A0E1A] text-[#64748B] border-[#1E293B] hover:text-[#CBD5E1]'
              }`}
            >
              {filter === 'EARTHCAM' ? '🌐 EarthCam USA' : filter === 'INDIA' ? '🇮🇳 India Defense' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredFeeds.map((cam) => {
          const liveFps = cameraStatuses[cam.id]?.fps || cam.fps;
          const liveCam = { ...cam, fps: liveFps };
          const activeCamAlert = alerts.find(
            (a) => a.cameraId === cam.id && a.status === 'UNACKNOWLEDGED'
          );

          return (
            <CameraFeed
              key={cam.id}
              camera={liveCam}
              isAlerting={!!activeCamAlert}
              activeAlert={activeCamAlert}
            />
          );
        })}
      </div>
    </div>
  );
}
