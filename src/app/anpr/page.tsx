'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Car,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Camera,
  Compass,
  FileDown,
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';

export default function AnprPage() {
  const { anprRecords } = useDemoSimulation();
  const [searchPlate, setSearchPlate] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredRecords = anprRecords.filter(item => {
    const matchesSearch =
      item.plateNumber.toLowerCase().includes(searchPlate.toLowerCase()) ||
      item.camera.toLowerCase().includes(searchPlate.toLowerCase()) ||
      item.location.toLowerCase().includes(searchPlate.toLowerCase());

    const matchesType = vehicleTypeFilter === 'ALL' || item.vehicleType === vehicleTypeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleExport = () => {
    exportToCSV('IBVAP-ANPR-Log', filteredRecords as unknown as Record<string, unknown>[]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Automated Number Plate Recognition (ANPR)
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-950 text-sky-400 border border-sky-500/30 font-mono-numbers">
              DEEPPLATE OCR v5.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Optical character recognition, vehicle make & type classification, and checkpoint transit log.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5 text-cyan-400" /> Export Records (CSV)
        </button>
      </div>

      {/* Synthetic Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-300 flex items-center justify-between">
        <span>
          ⚠️ <strong>Mandatory Prototype Disclosure</strong>: All vehicle license plates, speed readouts, and registration statuses displayed below are <strong>DEMO / SIMULATED DATA</strong> for hackathon demonstration.
        </span>
        <span className="px-2 py-0.5 rounded bg-cyan-900 text-[10px] font-bold uppercase font-mono-numbers">
          SYNTHETIC TELEMETRY
        </span>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              placeholder="Search plate (e.g. DL 04, PB 10), camera, location..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="SUV">SUV & Jeeps</option>
            <option value="TRUCK">Heavy Commercial Trucks</option>
            <option value="MOTORCYCLE">Motorcycles & Two-Wheelers</option>
            <option value="SEDAN">Sedans & Passenger Cars</option>
            <option value="BUS">Buses</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified Manifest</option>
            <option value="FLAGGED">Flagged / Unverified</option>
            <option value="UNKNOWN">Unknown / Scanning</option>
          </select>
        </div>
      </div>

      {/* ANPR Data Table */}
      <div className="rounded-xl overflow-hidden bg-slate-950/90 border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-numbers">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vehicle Snapshot</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Camera / Location</th>
                <th className="py-3 px-4">Vehicle Type</th>
                <th className="py-3 px-4">Plate Number</th>
                <th className="py-3 px-4">Speed & Transit</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-900/50 transition-colors">
                  {/* Mock snapshot graphic */}
                  <td className="py-3 px-4">
                    <div className="w-20 h-11 rounded bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-500 relative overflow-hidden group">
                      <Car className="w-5 h-5 text-cyan-400/70" />
                      <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-cyan-300 font-bold">
                        ZOOM
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{rec.timestamp}</td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{rec.camera}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{rec.location}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                      {rec.vehicleType}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="inline-block px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wider">
                      {rec.plateNumber}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">[SIMULATED]</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div>{rec.speedKmh} km/h</div>
                    <div className="text-[10px] text-slate-400">{rec.direction}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-bold font-mono">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : rec.status === 'FLAGGED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rec.status}
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
