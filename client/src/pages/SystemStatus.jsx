// client/src/pages/SystemStatus.jsx
import React from 'react';
import { Cpu, HardDrive, Database, Activity, Server, Radio, CheckCircle2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const CPU_HISTORY = [
  { time: '19:40', cpu: 48, ram: 65 },
  { time: '19:41', cpu: 52, ram: 66 },
  { time: '19:42', cpu: 59, ram: 68 },
  { time: '19:43', cpu: 55, ram: 67 },
  { time: '19:44', cpu: 62, ram: 69 },
  { time: '19:45', cpu: 58, ram: 68 },
];

export default function SystemStatus({
  systemHealth,
}) {
  const cpu = systemHealth ? systemHealth.cpuUsage : 54.2;
  const ram = systemHealth ? systemHealth.ramUsage : 68.1;
  const storage = systemHealth ? systemHealth.storageUsage : 61.4;
  const bops = systemHealth && systemHealth.bopLatencies
    ? systemHealth.bopLatencies
    : [
        { name: 'BOP-1 Naksalbari', latency: 32 },
        { name: 'BOP-2 Panitanki', latency: 45 },
        { name: 'BOP-3 Raniganj', latency: 28 },
        { name: 'BOP-4 Batasi', latency: 74 },
        { name: 'BOP-5 Kharibari', latency: 51 },
        { name: 'BOP-6 Galgalia', latency: 89 },
        { name: 'BOP-7 Mechi River', latency: 41 },
        { name: 'BOP-8 Ghoshpukur', latency: 36 },
      ];

  return (
    <div className="space-y-4 font-mono">
      {/* Real-time Hardware KPI Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00E5FF]" /> EDGE CLUSTER CPU
            </span>
            <span className="text-[#00E5FF] font-bold">{cpu}%</span>
          </div>
          <div className="w-full bg-[#05080E] h-2 rounded-full overflow-hidden border border-[#1E3A5F]">
            <div
              className="h-full bg-[#00E5FF] transition-all duration-500"
              style={{ width: ${cpu}% }}
            />
          </div>
          <span className="text-[10px] text-[#64748B] block">
            16x NVIDIA Jetson AGX Orin Industrial Nodes
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00C853]" /> MEMORY USAGE
            </span>
            <span className="text-[#00C853] font-bold">{ram}%</span>
          </div>
          <div className="w-full bg-[#05080E] h-2 rounded-full overflow-hidden border border-[#1E3A5F]">
            <div
              className="h-full bg-[#00C853] transition-all duration-500"
              style={{ width: ${ram}% }}
            />
          </div>
          <span className="text-[10px] text-[#64748B] block">
            43.5 GB / 64.0 GB ECC LPDDR5 Allocated
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-400" /> NVMe RAID-10 STORAGE
            </span>
            <span className="text-amber-400 font-bold">{storage}%</span>
          </div>
          <div className="w-full bg-[#05080E] h-2 rounded-full overflow-hidden border border-[#1E3A5F]">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: ${storage}% }}
            />
          </div>
          <span className="text-[10px] text-[#64748B] block">
            7.3 TB / 12.0 TB Retained (30-day loop)
          </span>
        </div>
      </div>

      {/* Real-time Telemetry Graph */}
      <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
        <h4 className="text-xs font-bold text-[#E2E8F0]">
          CLUSTER RESOURCE HISTOGRAM (CPU vs RAM %)
        </h4>
        <div className="h-44">
          <ResponsiveContainer width=\"100%\" height=\"100%\">
            <LineChart data={CPU_HISTORY}>
              <XAxis dataKey=\"time\" stroke=\"#64748B\" fontSize={10} />
              <YAxis stroke=\"#64748B\" fontSize={10} domain={[0, 100]} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#0A0E1A',
                  borderColor: '#1E3A5F',
                  fontSize: '11px',
                }}
              />
              <Line type=\"monotone\" dataKey=\"cpu\" stroke=\"#00E5FF\" strokeWidth={2} dot={false} />
              <Line type=\"monotone\" dataKey=\"ram\" stroke=\"#00C853\" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOP Latency Grid */}
      <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#E2E8F0]">
            BORDER OUTPOST (BOP) BACKHAUL FIBER & SATCOM LATENCIES
          </h4>
          <span className="text-[10px] text-[#00C853]">ALL LINKS SYNCHRONIZED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {bops.map((bop, idx) => {
            const isHigh = bop.latency > 100;
            return (
              <div
                key={idx}
                className="p-2.5 rounded bg-[#05080E] border border-[#1E3A5F] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E2E8F0] truncate">{bop.name}</span>
                  <span
                    className={ont-bold }
                  >
                    {bop.latency}ms
                  </span>
                </div>
                <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={h-full }
                    style={{ width: ${Math.min(100, bop.latency / 2)}% }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
