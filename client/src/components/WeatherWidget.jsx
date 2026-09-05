// client/src/components/WeatherWidget.jsx
import React from 'react';
import { Cloud, Wind, Eye, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

export default function WeatherWidget({ weatherData = [] }) {
  const defaultLocations = [
    { id: 'moreh', name: 'Moreh Border Sector', state: 'Manipur', temp: 28.5, windSpeed: 14.2, visibility: 8.5, condition: 'Scattered Clouds' },
    { id: 'nathula', name: 'Nathu La High Pass', state: 'Sikkim', temp: -3.2, windSpeed: 44.8, visibility: 1.4, condition: 'Freezing Fog / Blizzard' },
    { id: 'wagah', name: 'Wagah Border ICP', state: 'Punjab', temp: 34.0, windSpeed: 9.8, visibility: 6.0, condition: 'Haze / Dust' },
  ];

  const displayData = weatherData && weatherData.length > 0 ? weatherData : defaultLocations;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {displayData.map((loc) => {
        const isLowVis = loc.visibility < 2.0;
        const isHighWind = loc.windSpeed > 40.0;

        return (
          <div
            key={loc.id}
            className={p-3 rounded bg-[#111827] border  flex flex-col justify-between space-y-2}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
                    {loc.name}
                  </h4>
                  <p className="text-[10px] text-[#64748B]">{loc.state}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-[#00E5FF] font-mono">
                    <Thermometer className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>{loc.temp}°C</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] block truncate max-w-[100px]">
                    {loc.condition}
                  </span>
                </div>
              </div>

              {/* Badges for tactical rules */}
              <div className="flex flex-wrap gap-1 mt-2">
                {isLowVis && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF4444]/20 text-[#FF4444] border border-[#FF4444]/40 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    LOW VISIBILITY ALERT
                  </span>
                )}
                {isHighWind && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <Wind className="w-2.5 h-2.5" />
                    DRONE GROUNDED
                  </span>
                )}
                {!isLowVis && !isHighWind && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    FLIGHT OPS OPTIMAL
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 py-1 px-2 rounded bg-[#05080E] border border-[#1E3A5F] text-[10px] font-mono text-[#64748B]">
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-[#00E5FF]" />
                <span>WIND: <strong className="text-[#E2E8F0]">{loc.windSpeed} km/h</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-[#00E5FF]" />
                <span>VIS: <strong className="text-[#E2E8F0]">{loc.visibility} km</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
