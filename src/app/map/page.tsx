'use client';

import React from 'react';
import { TacticalBorderMap } from '@/components/map/TacticalBorderMap';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { DetailedCameraModal } from '@/components/dashboard/DetailedCameraModal';
import { Map, Radio, ShieldAlert, Compass } from 'lucide-react';

export default function CommandMapPage() {
  const { selectedCamera, setSelectedCamera } = useDemoSimulation();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Full-Screen Operational Command Map
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              TACTICAL SECTOR OVERVIEW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geospatial sensor matrix, real-time camera node telemetry, dynamic patrol routes, and virtual tripwire layers.
          </p>
        </div>
      </div>

      {/* Full-screen tactical map */}
      <TacticalBorderMap allowDrawing={true} fullScreen={true} />

      {/* Camera Inspector if clicked on map */}
      {selectedCamera && (
        <DetailedCameraModal
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}
    </div>
  );
}
