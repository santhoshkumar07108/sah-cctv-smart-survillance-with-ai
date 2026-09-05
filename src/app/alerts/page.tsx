'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { SecurityAlert, SeverityLevel, AlertStatus } from '@/lib/types';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Camera,
  Compass,
  ArrowRight,
  Eye,
  FileCheck,
  Zap,
} from 'lucide-react';

export default function AlertsPage() {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    setInvestigatingAlert,
    setSelectedCamera,
    cameras,
    triggerSimulatedBreach,
  } = useDemoSimulation();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cameraFilter, setCameraFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    const matchesCamera = cameraFilter === 'ALL' || alert.cameraId === cameraFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCamera;
  });

  const handleViewCamera = (camId: string) => {
    const cam = cameras.find(c => c.id === camId);
    if (cam) setSelectedCamera(cam);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Tactical Alert Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-500/40">
              {filteredAlerts.length} ALERTS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-sensor alert triage, forensic escalation, and operator dispatch workflow.
          </p>
        </div>

        <button
          onClick={() => triggerSimulatedBreach()}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          SIMULATE NEW ALERT
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert, camera, location, ID..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Unreviewed)</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Camera Filter */}
          <select
            value={cameraFilter}
            onChange={(e) => setCameraFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Camera Feeds</option>
            {cameras.map(c => (
              <option key={c.id} value={c.id}>{c.id} – {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Grid / Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-950/80 border border-slate-800 text-slate-500 text-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
            No alerts matching the selected filters. Sector status nominal.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black font-mono-numbers ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-500 text-black'
                          : 'bg-cyan-500 text-black'
                      }`}
                    >
                      {alert.severity}
                    </span>

                    <span className="text-xs font-bold text-slate-100 font-mono-numbers">
                      #{alert.id}
                    </span>

                    <span className="text-sm font-bold text-slate-100">
                      {alert.title}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono-numbers">
                      STATUS: {alert.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 max-w-3xl">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono-numbers text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Camera className="w-3 h-3" /> {alert.cameraId} ({alert.cameraName})
                    </span>
                    <span>LOC: {alert.location}</span>
                    <span>TIME: {alert.timestamp}</span>
                    <span className="text-emerald-400 font-bold">
                      AI CONF: {Math.round(alert.confidence * 100)}% ({alert.objectType})
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleViewCamera(alert.cameraId)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> View Feed
                  </button>

                  {alert.status === 'NEW' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-semibold transition-all"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => setInvestigatingAlert(alert)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    Investigate <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
