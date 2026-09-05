'use client';

import React from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { TacticalBorderMap } from '@/components/map/TacticalBorderMap';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Activity,
  Zap,
} from 'lucide-react';

export default function PerimeterPage() {
  const { zones, alerts, triggerSimulatedBreach, setInvestigatingAlert } = useDemoSimulation();

  const activeBreachAlert = alerts.find(
    a => a.category === 'VIRTUAL_FENCE_BREACH' && (a.status === 'NEW' || a.status === 'INVESTIGATING')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Virtual Perimeter & Intrusion Detection
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-500/40">
              SMART GEOFENCE ARMED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic software tripwires, polygon border corridors, and instantaneous vector intersection alarms.
          </p>
        </div>

        <button
          onClick={() => triggerSimulatedBreach('BOP-02')}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          SIMULATE FENCE BREACH
        </button>
      </div>

      {/* Active Breach Banner if Triggered */}
      {activeBreachAlert && (
        <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-800/80 pb-2">
            <div className="flex items-center gap-2 text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span className="text-sm sm:text-base font-black tracking-wider uppercase">
                VIRTUAL FENCE BREACH DETECTED
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-900 text-white font-mono-numbers">
              SEVERITY: {activeBreachAlert.severity}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono-numbers">
            <div className="bg-black/50 p-2.5 rounded-lg border border-rose-800/60">
              <span className="text-[10px] text-rose-300/80 uppercase block">Camera ID</span>
              <span className="text-slate-100 font-bold">{activeBreachAlert.cameraId}</span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-lg border border-rose-800/60">
              <span className="text-[10px] text-rose-300/80 uppercase block">Location</span>
              <span className="text-slate-100 font-bold truncate">{activeBreachAlert.location}</span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-lg border border-rose-800/60">
              <span className="text-[10px] text-rose-300/80 uppercase block">Time</span>
              <span className="text-slate-100 font-bold">{activeBreachAlert.timestamp}</span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-lg border border-rose-800/60">
              <span className="text-[10px] text-rose-300/80 uppercase block">Object Type</span>
              <span className="text-slate-100 font-bold">{activeBreachAlert.objectType}</span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-lg border border-rose-800/60">
              <span className="text-[10px] text-rose-300/80 uppercase block">AI Confidence</span>
              <span className="text-emerald-400 font-bold">
                {Math.round(activeBreachAlert.confidence * 100)}%
              </span>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setInvestigatingAlert(activeBreachAlert)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-md transition-all"
              >
                Inspect Breach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tactical Border Map Component */}
      <TacticalBorderMap allowDrawing={true} />

      {/* Active Geofences List */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Active Virtual Geofence Zones
          </h3>
          <span className="text-xs text-slate-400 font-mono-numbers">
            {zones.length} Zones Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-3.5 rounded-xl border transition-all ${
                zone.status === 'BREACHED'
                  ? 'bg-rose-950/30 border-rose-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-200 font-mono-numbers">{zone.id}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-numbers ${
                    zone.status === 'BREACHED'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {zone.status}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-100">{zone.name}</div>
              <div className="text-xs text-slate-400 mt-1">Sector: {zone.sector}</div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono-numbers flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>POLYGON: {zone.polygon.length} Vertices</span>
                <span style={{ color: zone.color }}>● Armed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
