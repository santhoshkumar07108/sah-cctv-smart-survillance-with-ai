'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapDrone } from '@/components/map/LeafletBorderMap';
import { BorderWeatherLocation } from '@/components/weather/BorderWeatherWidget';
import { Send, Battery, Navigation, Clock, ShieldCheck, AlertTriangle, Activity, MapPin } from 'lucide-react';

// Dynamic import for Leaflet map to ensure SSR safety
const LeafletBorderMap = dynamic(() => import('@/components/map/LeafletBorderMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded bg-[#05080E] border border-[#1E3A5F] flex items-center justify-center text-xs text-[#64748B] font-mono">
      Initializing Tactical Drone Radar Map...
    </div>
  ),
});

interface DroneManagementProps {
  drones: MapDrone[];
  flightLogs: Array<{ id: string; droneId: string; mission: string; duration: string; outcome: string; time: string }>;
  weather: BorderWeatherLocation[];
  onDispatchDrone: (droneId: string, lat: number, lon: number, alertId?: string) => void;
}

export default function DroneManagement({
  drones,
  flightLogs,
  weather,
  onDispatchDrone,
}: DroneManagementProps) {
  const [selectedDroneId, setSelectedDroneId] = useState('DRONE-1');
  const [targetLat, setTargetLat] = useState('25.283');
  const [targetLon, setTargetLon] = useState('89.000');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Check if any zone has wind > 40 km/h
  const highWindAlert = weather.find((w) => w.droneGrounded || w.windSpeedKmph > 40);

  const handleManualDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(targetLat);
    const lon = parseFloat(targetLon);

    if (isNaN(lat) || isNaN(lon)) {
      setDispatchStatus('Invalid coordinates entered.');
      return;
    }

    onDispatchDrone(selectedDroneId, lat, lon);
    setDispatchStatus(`Tactical dispatch command transmitted to ${selectedDroneId} -> [${lat}, ${lon}]`);

    setTimeout(() => {
      setDispatchStatus(null);
    }, 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EN_ROUTE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40 animate-pulse">EN ROUTE</span>;
      case 'ON_SITE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/20 text-[#FF4444] border border-rose-500/40 animate-pulse">ON SITE</span>;
      case 'RETURNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40">RETURNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-[#00C853] border border-emerald-500/40">STANDBY</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E3A5F]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span>Tactical Drone Fleet Management</span>
            <span className="text-[11px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              4 ACTIVE UAV SQUADRONS
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated aerial dispatch, telemetry tracking, and border perimeter verification sorties.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
          <span>FLEET READINESS:</span>
          <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
        </div>
      </div>

      {/* Weather Grounding Alert Banner */}
      {highWindAlert && (
        <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/50 text-amber-300 flex items-center justify-between gap-3 select-none animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold tracking-wide">
                TACTICAL UAV GROUNDING ADVISORY — HIGH WIND SPEEDS
              </div>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Gusts recorded at {highWindAlert.windSpeedKmph} km/h in {highWindAlert.name} ({highWindAlert.state}). Autonomous sorties temporarily restricted in affected mountain passes.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-amber-400 font-bold px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/40 shrink-0">
            {highWindAlert.windSpeedKmph} KM/H
          </span>
        </div>
      )}

      {/* 4 Drone Fleet Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {drones.map((drone) => {
          const isAirborne = drone.status !== 'STANDBY';

          return (
            <div
              key={drone.id}
              className={`p-3.5 rounded bg-[#111827] border transition-all ${
                isAirborne ? 'border-[#00E5FF]/60 shadow-[0_0_12px_rgba(0,229,255,0.15)]' : 'border-[#1E3A5F]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚁</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {drone.id}
                  </span>
                </div>
                {getStatusBadge(drone.status)}
              </div>

              <div className="text-xs text-slate-300 font-medium mt-1 truncate">
                {drone.name}
              </div>

              {/* Battery Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-cyan-400" /> Battery
                  </span>
                  <span className={`font-bold ${drone.battery < 25 ? 'text-rose-400' : 'text-white'}`}>
                    {drone.battery}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0A0E1A] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      drone.battery < 25
                        ? 'bg-[#FF4444]'
                        : drone.battery < 50
                        ? 'bg-amber-400'
                        : 'bg-[#00C853]'
                    }`}
                    style={{ width: `${drone.battery}%` }}
                  />
                </div>
              </div>

              {/* Mission Telemetry Readout */}
              <div className="mt-3 pt-2 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-[10px] font-mono text-[#64748B]">
                <div>
                  <span>COORDS:</span>
                  <div className="text-slate-300 font-bold">
                    {drone.lat.toFixed(2)}, {drone.lon.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span>ETA / T-MINUS:</span>
                  <div className={`font-bold ${isAirborne ? 'text-[#00E5FF]' : 'text-slate-400'}`}>
                    {isAirborne ? `${(drone as any).etaSeconds || 14}s` : 'HOLD'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Mini Live Map + Manual Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Tactical Drone Map (7 Cols) */}
        <div className="lg:col-span-7 rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
              <h2 className="text-xs font-bold text-white tracking-wide">
                Live UAV Tracking Radar Map
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              REAL-TIME VECTOR INTERPOLATION
            </span>
          </div>

          <LeafletBorderMap drones={drones} height="360px" center={[24.8, 88.8]} zoom={8} />
        </div>

        {/* Manual Dispatch Form (5 Cols) */}
        <div className="lg:col-span-5 rounded border border-[#1E3A5F] bg-[#111827] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-3">
              <h2 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#00E5FF]" /> Manual Sortie Dispatch
              </h2>
              <span className="text-[10px] font-mono text-[#64748B]">TACTICAL OVERRIDE</span>
            </div>

            <form onSubmit={handleManualDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#64748B] mb-1">Select UAV Squadron</label>
                <select
                  value={selectedDroneId}
                  onChange={(e) => setSelectedDroneId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] text-white font-mono outline-none"
                >
                  {drones.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.name} [{d.status} • {d.battery}%]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#64748B] mb-1">Target Latitude</label>
                  <input
                    type="text"
                    required
                    value={targetLat}
                    onChange={(e) => setTargetLat(e.target.value)}
                    placeholder="e.g. 25.283"
                    className="w-full px-3 py-2 rounded bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] mb-1">Target Longitude</label>
                  <input
                    type="text"
                    required
                    value={targetLon}
                    onChange={(e) => setTargetLon(e.target.value)}
                    placeholder="e.g. 89.000"
                    className="w-full px-3 py-2 rounded bg-[#0A0E1A] border border-[#1E3A5F] focus:border-[#00E5FF] text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Preset Quick Coordinates */}
              <div>
                <div className="text-[10px] text-[#64748B] mb-1.5 font-mono">PRESET SECTOR COORDINATES:</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Hilli Fence', lat: '25.283', lon: '89.000' },
                    { label: 'Petrapole ICP', lat: '23.017', lon: '88.917' },
                    { label: 'Changrabandha', lat: '26.317', lon: '89.617' },
                    { label: 'Fulbari River', lat: '26.550', lon: '88.733' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setTargetLat(p.lat);
                        setTargetLon(p.lon);
                      }}
                      className="px-2 py-1 rounded bg-[#0A0E1A] border border-[#1E293B] hover:border-[#00E5FF]/40 text-[10px] font-mono text-slate-300"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 rounded bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0A0E1A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_12px_rgba(0,229,255,0.25)]"
              >
                <Send className="w-3.5 h-3.5" /> Transmit Dispatch Vector
              </button>

              {dispatchStatus && (
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                  {dispatchStatus}
                </div>
              )}
            </form>
          </div>

          <div className="text-[10px] text-[#64748B] pt-3 border-t border-[#1E293B] flex items-center justify-between font-mono">
            <span>UAV LINK: 915 MHz DEFNET</span>
            <span>FAILSAFE: AUTO RETURN</span>
          </div>
        </div>
      </div>

      {/* Flight Log History Table */}
      <div className="rounded border border-[#1E3A5F] bg-[#111827] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0A0E1A] border-b border-[#1E293B] flex items-center justify-between text-xs">
          <span className="font-bold text-white">Automated Flight Log Archive</span>
          <span className="font-mono text-[10px] text-[#64748B]">MISSION OUTCOMES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111827] border-b border-[#1E293B] text-[#64748B] font-semibold">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Drone Unit</th>
                <th className="py-2.5 px-3">Mission Designation</th>
                <th className="py-2.5 px-3">Airborne Duration</th>
                <th className="py-2.5 px-3">Logged Time</th>
                <th className="py-2.5 px-3 text-right">Verification Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {flightLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0A0E1A]/40 transition-colors">
                  <td className="py-2 px-3 font-mono text-cyan-300 font-bold">{log.id}</td>
                  <td className="py-2 px-3 font-mono text-white">{log.droneId}</td>
                  <td className="py-2 px-3 text-slate-300">{log.mission}</td>
                  <td className="py-2 px-3 font-mono text-[#64748B]">{log.duration}</td>
                  <td className="py-2 px-3 font-mono text-[#64748B]">{log.time}</td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        log.outcome === 'CONFIRMED_THREAT'
                          ? 'bg-rose-500/20 text-[#FF4444] border border-rose-500/40'
                          : log.outcome === 'TARGET_INTERCEPTED'
                          ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40'
                          : 'bg-emerald-500/20 text-[#00C853] border border-emerald-500/40'
                      }`}
                    >
                      {log.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
