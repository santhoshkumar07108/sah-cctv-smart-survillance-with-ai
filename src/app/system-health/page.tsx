'use client';

import React from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Video,
  Radio,
  Clock,
  Server,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const TELEMETRY_STREAM = [
  { time: '10s', cpu: 32, gpu: 68, net: 180 },
  { time: '8s', cpu: 38, gpu: 72, net: 195 },
  { time: '6s', cpu: 35, gpu: 65, net: 175 },
  { time: '4s', cpu: 42, gpu: 78, net: 210 },
  { time: '2s', cpu: 34, gpu: 70, net: 185 },
  { time: 'Now', cpu: 36, gpu: 69, net: 190 },
];

export default function SystemHealthPage() {
  const { systemHealth, kpis } = useDemoSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              System Health & Edge Infrastructure
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              CLUSTER NORMAL (99.8% HEALTH)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time server telemetry, GPU TensorRT acceleration load, RTSP decoding pipeline, and network bandwidth.
          </p>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> CPU Load</span>
            <span className="font-mono-numbers text-cyan-300 font-bold">{systemHealth.cpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${systemHealth.cpuUsage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers">
            AMD EPYC 7763 64-Core Edge Server
          </div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> Edge GPU (TensorRT)</span>
            <span className="font-mono-numbers text-emerald-400 font-bold">{systemHealth.gpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${systemHealth.gpuUsage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers">
            NVIDIA RTX 6000 Ada (48 GB VRAM)
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-purple-400" /> System Memory</span>
            <span className="font-mono-numbers text-purple-300 font-bold">{systemHealth.ramUsageGb} / {systemHealth.ramTotalGb} GB</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(systemHealth.ramUsageGb / systemHealth.ramTotalGb) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers">
            ECC DDR5-4800 Registered Low-Latency
          </div>
        </div>

        {/* Storage */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-sky-400" /> NVMe Storage</span>
            <span className="font-mono-numbers text-sky-300 font-bold">{(systemHealth.storageUsedGb / 1000).toFixed(1)} / {(systemHealth.storageTotalGb / 1000).toFixed(1)} TB</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(systemHealth.storageUsedGb / systemHealth.storageTotalGb) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono-numbers">
            RAID-10 NVMe Video Archive Array
          </div>
        </div>
      </div>

      {/* Network & Ingestion Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyan-400" /> Network Ingestion Throughput (Mbps)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_STREAM}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="net" stroke="#00f0ff" fill="url(#netGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> GPU vs CPU Utilization (%)
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TELEMETRY_STREAM}>
                <defs>
                  <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0b121e', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="gpu" stroke="#10b981" fill="url(#gpuGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
