'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { CameraFeedCard } from './CameraFeedCard';
import { DetailedCameraModal } from './DetailedCameraModal';
import { Camera } from '@/lib/types';
import { Grid2X2, Grid3X3, Video, Filter, Layers } from 'lucide-react';

export function LiveCameraGrid() {
  const { cameras, selectedCamera, setSelectedCamera } = useDemoSimulation();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [gridCols, setGridCols] = useState<'3' | '2'>('3');

  const filteredCameras = cameras.filter(cam => {
    if (filterType === 'ALL') return true;
    if (filterType === 'THERMAL') return cam.type === 'THERMAL_IR';
    if (filterType === 'OPTICAL') return cam.type === 'OPTICAL';
    if (filterType === 'ANPR') return cam.type === 'ANPR_HIGHRES';
    if (filterType === 'ALERT') return cam.status === 'ALERT';
    return true;
  });

  return (
    <section className="space-y-3">
      {/* Grid Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-slate-200">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>LIVE CAMERA MATRIX</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-cyan-400 border border-cyan-500/20">
              6 SECTORS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sector / Sensor Type Filters */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800 text-xs">
            {['ALL', 'THERMAL', 'OPTICAL', 'ANPR', 'ALERT'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  filterType === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid Layout Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setGridCols('2')}
              className={`p-1 rounded ${
                gridCols === '2' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2 Columns Layout"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols('3')}
              className={`p-1 rounded ${
                gridCols === '3' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="3 Columns Layout"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Matrix */}
      <div
        className={`grid gap-4 ${
          gridCols === '3'
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {filteredCameras.map((camera) => (
          <CameraFeedCard
            key={camera.id}
            camera={camera}
            onOpenDetails={(cam) => setSelectedCamera(cam)}
          />
        ))}
      </div>

      {/* Deep Telemetry Modal */}
      {selectedCamera && (
        <DetailedCameraModal
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}
    </section>
  );
}
