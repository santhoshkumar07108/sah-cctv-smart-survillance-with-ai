// client/src/pages/LiveFeeds.jsx
import React, { useState } from 'react';
import CameraFeed from '../components/CameraFeed';
import { Video, Grid, Sliders, Filter } from 'lucide-react';

const FEEDS = [
  { id: 'CAM-001', location: 'Petrapole ICP Checkpoint', zone: 'Charlie', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', uptime: '99.9%' },
  { id: 'CAM-002', location: 'Hilli Border Outpost Fence', zone: 'Bravo', status: 'Degraded', resolution: '1080p 60FPS', fps: 22.4, aiModel: 'ThermalNet-v3', uptime: '97.2%' },
  { id: 'CAM-003', location: 'Changrabandha Corridor', zone: 'Bravo', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', uptime: '99.8%' },
  { id: 'CAM-004', location: 'Fulbari Riverine Sentry', zone: 'Alpha', status: 'Online', resolution: '1080p 60FPS', fps: 29.8, aiModel: 'DeepFlow-Water', uptime: '99.9%' },
  { id: 'CAM-005', location: 'Ghojadanga Border Culvert', zone: 'Delta', status: 'Online', resolution: '1080p 60FPS', fps: 30.0, aiModel: 'YOLO-v9-BorderSec', uptime: '99.5%' },
  { id: 'CAM-012', location: 'Panitanki ICP Gate 1', zone: 'Charlie', status: 'Online', resolution: '4K Ultra HD', fps: 30.0, aiModel: 'ANPR-Edge-IND', uptime: '100%' },
];

export default function LiveFeeds({
  cameraStatuses = {},
  alerts = [],
}) {
  const [selectedZone, setSelectedZone] = useState('ALL');

  const filteredFeeds = FEEDS.filter(
    (cam) => selectedZone === 'ALL' || cam.zone === selectedZone
  );

  return (
    <div className="space-y-4">
      {/* Feed Filters */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
            PRIMARY RTSP OPTICAL & THERMAL CHANNELS
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#64748B]">ZONE:</span>
          {['ALL', 'Alpha', 'Bravo', 'Charlie', 'Delta'].map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={px-2 py-1 rounded text-xs font-mono transition-colors }
            >
              {zone}
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
