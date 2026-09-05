'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Users,
  Car,
  ScanFace,
  FileCheck2,
  AlertTriangle,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

const HOURLY_ACTIVITY_DATA = [
  { hour: '14:00', persons: 12, vehicles: 24, alerts: 1 },
  { hour: '15:00', persons: 18, vehicles: 31, alerts: 0 },
  { hour: '16:00', persons: 25, vehicles: 28, alerts: 2 },
  { hour: '17:00', persons: 30, vehicles: 42, alerts: 1 },
  { hour: '18:00', persons: 45, vehicles: 39, alerts: 3 },
  { hour: '19:00', persons: 38, vehicles: 25, alerts: 2 },
  { hour: '20:00', persons: 28, vehicles: 19, alerts: 4 },
];

const VEHICLE_PIE_DATA = [
  { name: 'SUVs & Jeeps', value: 42, color: '#00f0ff' },
  { name: 'Commercial Trucks', value: 28, color: '#38bdf8' },
  { name: 'Motorcycles', value: 19, color: '#818cf8' },
  { name: 'Buses / Heavy', value: 11, color: '#c084fc' },
];

const DETECTION_TRENDS_DATA = [
  { time: '10m ago', optical: 14, thermal: 9, anpr: 6 },
  { time: '8m ago', optical: 18, thermal: 12, anpr: 8 },
  { time: '6m ago', optical: 22, thermal: 15, anpr: 5 },
  { time: '4m ago', optical: 19, thermal: 18, anpr: 9 },
  { time: '2m ago', optical: 26, thermal: 22, anpr: 7 },
  { time: 'Now', optical: 31, thermal: 25, anpr: 11 },
];

const ALERT_FREQ_DATA = [
  { day: 'Mon', breaches: 2, loitering: 4, vehicles: 3 },
  { day: 'Tue', breaches: 1, loitering: 6, vehicles: 2 },
  { day: 'Wed', breaches: 4, loitering: 5, vehicles: 5 },
  { day: 'Thu', breaches: 3, loitering: 8, vehicles: 4 },
  { day: 'Fri', breaches: 5, loitering: 7, vehicles: 6 },
  { day: 'Sat', breaches: 2, loitering: 3, vehicles: 2 },
  { day: 'Sun', breaches: 4, loitering: 5, vehicles: 3 },
];

export default function AnalyticsPage() {
  const { kpis, anprRecords, faceRecords } = useDemoSimulation();
  const [timeRange, setTimeRange] = useState<'1H' | '24H' | '7D'>('24H');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              AI Video Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              MULTI-MODEL TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated behavioral classification, ANPR metrics, demographic flow, and threat distribution.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {(['1H', '24H', '7D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Core Analytics Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* 1. Human Detection & Tracking */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" /> Human Tracking
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono-numbers">
              YOLOv10x
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 font-mono-numbers">
              {kpis.personsDetected * 4 + 18}
            </div>
            <div className="text-[11px] text-slate-400">Total Persons Detected Today</div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono-numbers">
            <div className="flex justify-between">
              <span className="text-slate-500">Active Tracks:</span>
              <span className="text-cyan-300 font-bold">14 Live</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Avg Confidence:</span>
              <span className="text-emerald-400 font-bold">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Primary Vector:</span>
              <span className="text-slate-200">East-to-West</span>
            </div>
          </div>
        </div>

        {/* 2. Vehicle Analytics */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-400" /> Vehicle Analytics
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono-numbers">
              ConvoyNet
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 font-mono-numbers">
              {anprRecords.length + 84}
            </div>
            <div className="text-[11px] text-slate-400">Classified Vehicles</div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono-numbers">
            <div className="flex justify-between">
              <span className="text-slate-500">SUVs / Jeeps:</span>
              <span className="text-sky-300 font-bold">42 (42%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trucks (Heavy):</span>
              <span className="text-slate-200">28 (28%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Motorcycles:</span>
              <span className="text-slate-200">19 (19%)</span>
            </div>
          </div>
        </div>

        {/* 3. Face Detection */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <ScanFace className="w-4 h-4 text-indigo-400" /> Face Biometrics
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono-numbers">
              ArcFace
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 font-mono-numbers">
              {faceRecords.length + 12}
            </div>
            <div className="text-[11px] text-slate-400">Total Scans Evaluated</div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono-numbers">
            <div className="flex justify-between">
              <span className="text-slate-500">Watchlist Matches:</span>
              <span className="text-rose-400 font-bold">2 (Demo Only)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unknown Faces:</span>
              <span className="text-amber-400">9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Authorized Personnel:</span>
              <span className="text-emerald-400">5</span>
            </div>
          </div>
        </div>

        {/* 4. ANPR Metrics */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-purple-400" /> ANPR Engine
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono-numbers">
              DeepPlate
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-100 font-mono-numbers">
              95.8%
            </div>
            <div className="text-[11px] text-slate-400">Average OCR Accuracy</div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono-numbers">
            <div className="flex justify-between">
              <span className="text-slate-500">Plates Verified:</span>
              <span className="text-emerald-400 font-bold">78</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Flagged Vehicles:</span>
              <span className="text-amber-400 font-bold">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sub-Second OCR:</span>
              <span className="text-cyan-300">9.8 ms</span>
            </div>
          </div>
        </div>

        {/* 5. Behavior Analytics */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> Behavior Engine
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono-numbers">
              LSTM-Graph
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400 font-mono-numbers">
              {kpis.intrusionEvents + 6}
            </div>
            <div className="text-[11px] text-slate-400">Anomalous Behaviors</div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2 font-mono-numbers">
            <div className="flex justify-between">
              <span className="text-slate-500">Loitering Events:</span>
              <span className="text-amber-300">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Running / Sprinting:</span>
              <span className="text-rose-400">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Restricted Entry:</span>
              <span className="text-rose-400 font-bold">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Trends Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Sensor Stream Detection Trends
            </h3>
            <span className="text-xs font-mono-numbers text-slate-400">Last 10 minutes</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DETECTION_TRENDS_DATA}>
                <defs>
                  <linearGradient id="gradOptical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradThermal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" dataKey="optical" name="Optical Detections" stroke="#00f0ff" fill="url(#gradOptical)" strokeWidth={2} />
                <Area type="monotone" dataKey="thermal" name="Thermal IR Feeds" stroke="#f59e0b" fill="url(#gradThermal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Activity Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Hourly Activity Distribution
            </h3>
            <span className="text-xs font-mono-numbers text-slate-400">Persons vs Vehicles</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ACTIVITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="persons" name="Persons" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vehicles" name="Vehicles" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alerts" name="Security Alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Classification Breakdown */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-sky-400" /> Vehicle Classification Breakdown
            </h3>
            <span className="text-xs font-mono-numbers text-slate-400">100 Samples</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VEHICLE_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {VEHICLE_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Frequency by Type */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Weekly Alert Frequency
            </h3>
            <span className="text-xs font-mono-numbers text-slate-400">7 Days Trend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ALERT_FREQ_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="breaches" name="Virtual Fence Breaches" stroke="#ef4444" strokeWidth={2.5} />
                <Line type="monotone" dataKey="loitering" name="Loitering" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="vehicles" name="Unknown Vehicles" stroke="#38bdf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
