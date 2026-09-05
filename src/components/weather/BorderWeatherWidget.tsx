'use client';

import React from 'react';
import { Cloud, Wind, Eye, AlertTriangle, CloudRain, Sun, CloudFog, ShieldAlert } from 'lucide-react';

export interface BorderWeatherLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike?: number;
  humidity?: number;
  windSpeedKmph: number;
  visibilityKm: number;
  condition: string;
  description: string;
  icon?: string;
  lowVisibilityAlert: boolean;
  droneGrounded: boolean;
  isLiveApi?: boolean;
}

interface BorderWeatherWidgetProps {
  weatherData?: BorderWeatherLocation[];
}

const DEFAULT_WEATHER: BorderWeatherLocation[] = [
  {
    id: 'moreh',
    name: 'Moreh Border Sector',
    state: 'Manipur',
    lat: 24.2,
    lon: 94.2,
    temp: 28,
    windSpeedKmph: 18,
    visibilityKm: 6.5,
    condition: 'Tropical Haze',
    description: 'Moderate haze along international border',
    lowVisibilityAlert: false,
    droneGrounded: false,
  },
  {
    id: 'nathula',
    name: 'Nathu La High Pass',
    state: 'Sikkim',
    lat: 27.3,
    lon: 88.6,
    temp: 6,
    windSpeedKmph: 42,
    visibilityKm: 1.8,
    condition: 'Alpine Fog / High Winds',
    description: 'Severe gusts exceeding operational threshold',
    lowVisibilityAlert: true,
    droneGrounded: true,
  },
  {
    id: 'wagah',
    name: 'Wagah Border ICP',
    state: 'Punjab',
    lat: 31.6,
    lon: 74.5,
    temp: 34,
    windSpeedKmph: 22,
    visibilityKm: 7.2,
    condition: 'Clear & Dry',
    description: 'Optimal tactical flight visibility',
    lowVisibilityAlert: false,
    droneGrounded: false,
  },
];

export default function BorderWeatherWidget({ weatherData = DEFAULT_WEATHER }: BorderWeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (c.includes('fog') || c.includes('haze') || c.includes('mist')) return <CloudFog className="w-5 h-5 text-amber-300" />;
    if (c.includes('cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {weatherData.map((loc) => {
        const isGrounding = loc.droneGrounded || loc.windSpeedKmph > 40;
        const isLowVis = loc.lowVisibilityAlert || loc.visibilityKm < 2.0;

        return (
          <div
            key={loc.id}
            className={`p-3 rounded bg-[#111827] border transition-all ${
              isGrounding
                ? 'border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'border-[#1E3A5F]'
            }`}
          >
            {/* Location Title & Condition Icon */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white tracking-wide">
                  {loc.name}
                </div>
                <div className="text-[10px] font-mono text-[#64748B]">
                  {loc.state} • [{loc.lat.toFixed(1)}°N, {loc.lon.toFixed(1)}°E]
                </div>
              </div>
              <div className="p-1.5 rounded bg-[#0A0E1A] border border-[#1E293B]">
                {getWeatherIcon(loc.condition)}
              </div>
            </div>

            {/* Main Temp & Condition */}
            <div className="mt-2 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-white">
                  {loc.temp}°C
                </span>
                <span className="text-[11px] text-slate-300 font-medium truncate max-w-[120px]">
                  {loc.condition}
                </span>
              </div>
              {loc.isLiveApi && (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/10 text-[#00E5FF] border border-cyan-500/30">
                  LIVE API
                </span>
              )}
            </div>

            {/* Wind Speed & Visibility Metrics */}
            <div className="mt-2.5 pt-2 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#64748B]">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wind:</span>
                <span className={`font-mono font-bold ${isGrounding ? 'text-amber-400' : 'text-white'}`}>
                  {loc.windSpeedKmph} km/h
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[#64748B]">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vis:</span>
                <span className={`font-mono font-bold ${isLowVis ? 'text-rose-400' : 'text-white'}`}>
                  {loc.visibilityKm} km
                </span>
              </div>
            </div>

            {/* Tactical Status Alerts */}
            <div className="mt-2 space-y-1">
              {isGrounding && (
                <div className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>DRONE GROUNDED (Wind &gt; 40 km/h)</span>
                </div>
              )}

              {isLowVis && (
                <div className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span>LOW VISIBILITY ALERT (&lt; 2 km)</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
