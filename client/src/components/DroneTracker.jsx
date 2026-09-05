// client/src/components/DroneTracker.jsx
import React from 'react';
import { Send, Zap, Navigation, Clock, ShieldAlert } from 'lucide-react';

export default function DroneTracker({
  drones = [],
  onDispatch,
  grounded = false,
}) {
  return (
    <div className="space-y-3">
      {grounded && (
        <div className="p-3 rounded bg-[#FF4444]/15 border border-[#FF4444]/40 flex items-center gap-2 text-xs text-[#FF4444] font-mono">
          <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
          <span>
            WEATHER GROUNDING WARNING: High wind speed (>40 km/h) detected in active flight corridor. Drone launches restricted!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {drones.map((drone) => {
          const isStandby = drone.status === 'STANDBY';
          const isEnRoute = drone.status === 'EN_ROUTE';
          const isOnSite = drone.status === 'ON_SITE';
          const isReturning = drone.status === 'RETURNING';

          const statusColor = isStandby
            ? 'text-[#00C853] bg-[#00C853]/15 border-[#00C853]/30'
            : isEnRoute
            ? 'text-[#00E5FF] bg-[#00E5FF]/15 border-[#00E5FF]/30'
            : isOnSite
            ? 'text-[#FF4444] bg-[#FF4444]/15 border-[#FF4444]/30'
            : 'text-amber-400 bg-amber-400/15 border-amber-400/30';

          const batteryLevel = drone.battery || 100;
          const batteryColor =
            batteryLevel > 50
              ? 'bg-[#00C853]'
              : batteryLevel > 20
              ? 'bg-amber-400'
              : 'bg-[#FF4444]';

          return (
            <div
              key={drone.id}
              className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] hover:border-[#00E5FF]/50 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                    <span className="font-mono font-bold text-sm text-[#E2E8F0]">
                      {drone.id}
                    </span>
                  </div>
                  <span
                    className={px-2 py-0.5 rounded text-[10px] font-mono font-bold border }
                  >
                    {drone.status}
                  </span>
                </div>

                <p className="text-xs text-[#64748B] font-mono">
                  BASE: <span className="text-[#E2E8F0]">{drone.baseLocation || 'BOP HQ'}</span>
                </p>

                {/* Battery Gauge */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-[#64748B]">
                      <Zap className="w-3 h-3 text-amber-400" /> BATT:
                    </span>
                    <span className="text-[#E2E8F0] font-bold">
                      {Math.round(batteryLevel)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#05080E] h-1.5 rounded-full overflow-hidden border border-[#1E3A5F]">
                    <div
                      className={h-full  transition-all duration-500}
                      style={{ width: ${batteryLevel}% }}
                    />
                  </div>
                </div>

                {/* Telemetry coords & ETA */}
                <div className="mt-3 grid grid-cols-2 gap-1 py-1.5 px-2 rounded bg-[#05080E] border border-[#1E3A5F] text-[10px] font-mono text-[#64748B]">
                  <div>
                    <span>LAT: </span>
                    <span className="text-[#E2E8F0]">
                      {drone.lat ? drone.lat.toFixed(3) : '26.700'}
                    </span>
                  </div>
                  <div>
                    <span>LON: </span>
                    <span className="text-[#E2E8F0]">
                      {drone.lon ? drone.lon.toFixed(3) : '88.250'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-1 border-t border-[#1E3A5F]/50">
                    <span>MISSION ETA:</span>
                    <span className="text-[#00E5FF]">
                      {drone.eta ? ${drone.eta}s : 'IDLE'}
                    </span>
                  </div>
                </div>
              </div>

              {onDispatch && (
                <button
                  disabled={!isStandby || grounded}
                  onClick={() =>
                    onDispatch(drone.id, {
                      lat: drone.lat + 0.02,
                      lon: drone.lon + 0.02,
                    })
                  }
                  className={w-full py-1.5 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-colors }
                >
                  <Send className="w-3.5 h-3.5" />
                  {isStandby ? 'DISPATCH PATROL' : 'IN MISSION'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
