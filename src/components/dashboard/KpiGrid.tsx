'use client';

import React from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Video,
  Radio,
  Users,
  Car,
  AlertTriangle,
  ShieldAlert,
  Moon,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export function KpiGrid() {
  const { kpis } = useDemoSimulation();

  const cards = [
    {
      title: 'Active Cameras',
      value: kpis.activeCameras,
      subValue: '6 Total Feeds Configured',
      icon: Video,
      trend: '+1 Added',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgGlow: 'from-cyan-950/20',
    },
    {
      title: 'Online Cameras',
      value: `${kpis.onlineCameras}/${kpis.activeCameras}`,
      subValue: '100% Stream Uptime',
      icon: Radio,
      trend: 'RTSP Stable',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'from-emerald-950/20',
    },
    {
      title: 'Persons Detected',
      value: kpis.personsDetected,
      subValue: 'Real-time AI tracks',
      icon: Users,
      trend: '+3 Last Hr',
      color: 'text-sky-400',
      borderColor: 'border-sky-500/20',
      bgGlow: 'from-sky-950/20',
    },
    {
      title: 'Vehicles Detected',
      value: kpis.vehiclesDetected,
      subValue: 'OCR & Classification',
      icon: Car,
      trend: '+8 Last Hr',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      bgGlow: 'from-indigo-950/20',
    },
    {
      title: 'Active Alerts',
      value: kpis.activeAlerts,
      subValue: 'Unresolved Warnings',
      icon: AlertTriangle,
      trend: kpis.activeAlerts > 0 ? 'Action Req.' : 'Nominal',
      color: kpis.activeAlerts > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400',
      borderColor: kpis.activeAlerts > 0 ? 'border-amber-500/50' : 'border-slate-800',
      bgGlow: 'from-amber-950/20',
    },
    {
      title: 'Intrusion Events',
      value: kpis.intrusionEvents,
      subValue: 'Virtual Fence Crossings',
      icon: ShieldAlert,
      trend: 'Tripwire Alert',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgGlow: 'from-rose-950/20',
    },
    {
      title: 'Night Movement Events',
      value: kpis.nightMovementEvents,
      subValue: 'Thermal Low-Lux Detections',
      icon: Moon,
      trend: 'FLIR IR Active',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgGlow: 'from-purple-950/20',
    },
    {
      title: 'System Health',
      value: `${kpis.systemHealthPct}%`,
      subValue: 'TensorRT & Edge GPU OK',
      icon: Activity,
      trend: '99.8% Index',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'from-emerald-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative p-3 rounded-xl bg-slate-950/80 border ${card.borderColor} bg-gradient-to-b ${card.bgGlow} to-transparent backdrop-blur-md transition-all duration-200 hover:scale-[1.02] shadow-sm`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-medium text-slate-400 truncate">
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.color} shrink-0`} />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono-numbers text-slate-100">
                {card.value}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span className="truncate">{card.subValue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
