'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { EventLogItem, SeverityLevel } from '@/lib/types';
import {
  FileText,
  Search,
  Filter,
  FileDown,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  Camera,
  Activity,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

export default function EventsPage() {
  const { events } = useDemoSimulation();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventLogItem | null>(null);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.id.toLowerCase().includes(search.toLowerCase()) ||
      evt.cameraId.toLowerCase().includes(search.toLowerCase()) ||
      evt.location.toLowerCase().includes(search.toLowerCase()) ||
      evt.eventType.toLowerCase().includes(search.toLowerCase()) ||
      evt.object.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || evt.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const handleExport = () => {
    exportToCSV('IBVAP-Events-Log', filteredEvents as unknown as Record<string, unknown>[]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Forensic Event Audit Log
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 font-mono-numbers">
              {filteredEvents.length} TOTAL LOGS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable temporal audit trail of all AI neural detections, geofence tripwire crossings, and security incidents.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <FileDown className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event ID, camera, object, location..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Today (Live 24h Window)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-numbers">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Object</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-400">{evt.id}</td>
                  <td className="py-3 px-4 text-slate-300">{evt.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{evt.cameraId}</td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-[160px]">{evt.location}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">{evt.eventType}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {evt.object}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {Math.round(evt.confidence * 100)}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        evt.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          : evt.severity === 'HIGH'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{evt.status}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Inspect Event"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-mono-numbers">
                  EVENT DETAILS: {selectedEvent.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-numbers">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-200">{selectedEvent.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Camera Source:</span>
                <span className="text-cyan-300 font-bold">{selectedEvent.cameraId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Geographic Location:</span>
                <span className="text-slate-200">{selectedEvent.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Event Classification:</span>
                <span className="text-slate-200 font-bold">{selectedEvent.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Object Tracked:</span>
                <span className="text-slate-200">{selectedEvent.object}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="text-emerald-400 font-bold">{Math.round(selectedEvent.confidence * 100)}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Severity:</span>
                <span className="text-rose-400 font-bold">{selectedEvent.severity}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Details:</span>
                <p className="p-2.5 rounded bg-slate-900 text-slate-300 leading-relaxed font-sans">
                  {selectedEvent.details}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
