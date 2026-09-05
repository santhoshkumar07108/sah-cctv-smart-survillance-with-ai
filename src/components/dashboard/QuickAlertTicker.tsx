'use client';

import React from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { AlertCircle, ShieldAlert, ChevronRight, Zap } from 'lucide-react';

export function QuickAlertTicker() {
  const { alerts, setInvestigatingAlert, triggerSimulatedBreach } = useDemoSimulation();

  const latestAlert = alerts.find(a => a.status === 'NEW') || alerts[0];

  if (!latestAlert) return null;

  return (
    <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 backdrop-blur-md transition-all ${
      latestAlert.severity === 'CRITICAL'
        ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        : 'bg-amber-950/40 border-amber-500/50'
    }`}>
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500 text-white font-mono-numbers">
              {latestAlert.severity} ALERT
            </span>
            <span className="text-xs font-bold text-slate-100">
              {latestAlert.title} – {latestAlert.cameraName} ({latestAlert.cameraId})
            </span>
            <span className="text-[10px] text-slate-400 font-mono-numbers hidden sm:inline">
              {latestAlert.timestamp}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-1">
            {latestAlert.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setInvestigatingAlert(latestAlert)}
          className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 flex items-center gap-1 transition-colors"
        >
          Investigate Incident <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
