'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { Camera, CameraType } from '@/lib/types';
import { DetailedCameraModal } from '@/components/dashboard/DetailedCameraModal';
import {
  Camera as CameraIcon,
  Plus,
  Radio,
  Scan,
  Eye,
  Check,
  X,
  Sliders,
  Settings2,
  Trash2,
} from 'lucide-react';

export default function CamerasPage() {
  const {
    cameras,
    toggleCameraAI,
    toggleCameraIR,
    addNewCamera,
    selectedCamera,
    setSelectedCamera,
  } = useDemoSimulation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testStreamSuccess, setTestStreamSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<CameraType>('OPTICAL');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name) return;

    addNewCamera({
      id,
      name,
      rtspUrl: rtspUrl || 'rtsp://10.24.108.01:554/live/ch1',
      location: location || 'Sector Forward Point',
      type,
      resolution: '1920x1080 (FHD)',
      fps: 30,
    });

    setIsAddModalOpen(false);
    setId('');
    setName('');
    setRtspUrl('');
    setLocation('');
  };

  const handleTestStream = (camId: string) => {
    setTestStreamSuccess(camId);
    setTimeout(() => setTestStreamSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Camera Network & Ingestion Fleet
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {cameras.length} CAMERAS REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            IP CCTV ingestion, RTSP/H.265 stream configuration, AI model assignment, and health metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Camera
        </button>
      </div>

      {/* Camera Inventory Table */}
      <div className="rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-numbers">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Camera ID</th>
                <th className="py-3 px-4">Name & Sector</th>
                <th className="py-3 px-4">RTSP / Stream Status</th>
                <th className="py-3 px-4">Resolution & FPS</th>
                <th className="py-3 px-4">AI Vision Status</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400">{cam.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{cam.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{cam.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cam.status === 'ALERT'
                            ? 'bg-rose-500 animate-ping'
                            : cam.status === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="text-slate-200">{cam.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[160px] mt-0.5">
                      {cam.rtspUrl}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{cam.resolution}</div>
                    <div className="text-[10px] text-slate-400">{cam.fps} FPS</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleCameraAI(cam.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                        cam.aiEnabled
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {cam.aiEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {Math.round(cam.aiConfidence * 100)}%
                  </td>
                  <td className="py-3 px-4 text-slate-400">{cam.lastSeen}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTestStream(cam.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] px-2"
                        title="Test RTSP Handshake"
                      >
                        {testStreamSuccess === cam.id ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> OK
                          </span>
                        ) : (
                          'Test'
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedCamera(cam)}
                        className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40"
                        title="View Live Stream"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Camera Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-950 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Add IP Camera Stream</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Camera ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BORDER-ROAD-07"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Camera Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Ridge Observation Point"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">RTSP Stream URL</label>
                <input
                  type="text"
                  placeholder="rtsp://10.24.108.14:554/h265/stream"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location / Terrain</label>
                <input
                  type="text"
                  placeholder="Sector Delta Forest Perimeter"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Camera Sensor Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CameraType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="OPTICAL">Optical Daylight / Low-Lux</option>
                  <option value="THERMAL_IR">Thermal Infrared (FLIR)</option>
                  <option value="NIGHT_VISION">Night Vision Phosphor</option>
                  <option value="ANPR_HIGHRES">ANPR Checkpoint High-Res</option>
                  <option value="RADAR_PTZ">Long-Range Radar PTZ</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md"
                >
                  Register Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Camera Modal */}
      {selectedCamera && (
        <DetailedCameraModal
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}
    </div>
  );
}
