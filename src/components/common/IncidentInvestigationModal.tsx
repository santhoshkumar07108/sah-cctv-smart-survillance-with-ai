'use client';

import React, { useState } from 'react';
import { SecurityAlert, EventLogItem } from '@/lib/types';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  X,
  ShieldAlert,
  Clock,
  MapPin,
  Camera,
  Compass,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Printer,
  FileDown,
  UserCheck,
  Activity,
  Scan,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

interface IncidentInvestigationModalProps {
  alert: SecurityAlert | null;
  onClose: () => void;
}

export function IncidentInvestigationModal({ alert, onClose }: IncidentInvestigationModalProps) {
  const { events, acknowledgeAlert, resolveAlert, setSelectedCamera, cameras } = useDemoSimulation();
  const [operatorNotes, setOperatorNotes] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  if (!alert) return null;

  const relatedEvents = events.filter(
    e => e.cameraId === alert.cameraId || e.severity === alert.severity
  ).slice(0, 4);

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id);
  };

  const handleResolve = () => {
    resolveAlert(alert.id);
    onClose();
  };

  const handleInspectCamera = () => {
    const cam = cameras.find(c => c.id === alert.cameraId);
    if (cam) {
      setSelectedCamera(cam);
    }
  };

  const handleExportIncident = () => {
    const reportRow = [
      {
        IncidentID: alert.id,
        Title: alert.title,
        Severity: alert.severity,
        Status: alert.status,
        CameraID: alert.cameraId,
        CameraName: alert.cameraName,
        Location: alert.location,
        Timestamp: alert.timestamp,
        ObjectType: alert.objectType,
        AIConfidence: `${Math.round(alert.confidence * 100)}%`,
        MovementVector: alert.movementVector || 'N/A',
        RecommendedAction: alert.recommendedAction,
        OperatorNotes: operatorNotes || 'None logged',
        Disclaimer: 'SYNTHETIC DEMO DATA ONLY - Not an autonomous decision.',
      },
    ];
    exportToCSV(`IBVAP-Incident-${alert.id}`, reportRow);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono-numbers">
                  INCIDENT DOSSIER: #{alert.id}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  STATUS: {alert.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{alert.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Notice Banner */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
            <span>
              ℹ️ <strong>Operator Assistance Mode</strong>: AI detections and recommended actions assist human command. Autonomous security decisions are not authorized.
            </span>
            <span className="text-[10px] font-mono-numbers uppercase text-slate-400">
              DEMO SIMULATION
            </span>
          </div>

          {/* Grid Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" /> Sensor Camera
              </div>
              <div className="text-sm font-bold text-slate-200 font-mono-numbers">{alert.cameraId}</div>
              <div className="text-xs text-slate-400 truncate">{alert.cameraName}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Geographic Location
              </div>
              <div className="text-sm font-bold text-slate-200 truncate">{alert.location}</div>
              <div className="text-xs text-slate-400">Zone: {alert.zone || 'Zero-Line Buffer'}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Event Timestamp
              </div>
              <div className="text-sm font-bold text-slate-200 font-mono-numbers">{alert.timestamp}</div>
              <div className="text-xs text-slate-400">Verified System Clock</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Scan className="w-3 h-3 text-cyan-400" /> AI Confidence
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono-numbers">
                {Math.round(alert.confidence * 100)}% Match
              </div>
              <div className="text-xs text-slate-400">Object: {alert.objectType}</div>
            </div>
          </div>

          {/* Incident Trajectory & Forensics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" /> Movement Trajectory & Vector
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.description}
              </p>
              <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 font-mono-numbers text-xs text-cyan-300">
                VECTOR: {alert.movementVector || 'Dynamic Pacing Along Perimeter (2.4 m/s)'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Recommended Operator Action
              </h4>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium">
                {alert.recommendedAction}
              </div>
              <p className="text-[11px] text-slate-400">
                Protocol standard: SOP Section 4.2 (Border Security Emergency Response).
              </p>
            </div>
          </div>

          {/* Related System Events Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Associated Telemetry & Events
            </h4>
            <div className="divide-y divide-slate-800/80">
              {relatedEvents.map((evt) => (
                <div key={evt.id} className="py-2 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-numbers text-slate-400 text-[11px]">{evt.timestamp}</span>
                    <span className="font-semibold text-slate-200">{evt.eventType}</span>
                    <span className="text-slate-400">({evt.object})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-cyan-400 font-mono-numbers">
                      {Math.round(evt.confidence * 100)}%
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {evt.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Action Log */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Command Log Notes</span>
              {isLogged && <span className="text-emerald-400 font-normal">Notes Saved</span>}
            </label>
            <textarea
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Enter operator incident notes, dispatch callsign, confirmation status..."
              rows={2}
              className="w-full rounded-lg bg-black/60 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900/90 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportIncident}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" /> Export Dossier (CSV)
            </button>
            <button
              onClick={handleInspectCamera}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" /> View Feed {alert.cameraId}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {alert.status !== 'RESOLVED' && (
              <>
                {alert.status === 'NEW' && (
                  <button
                    onClick={handleAcknowledge}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold transition-all"
                  >
                    Acknowledge
                  </button>
                )}
                <button
                  onClick={handleResolve}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
