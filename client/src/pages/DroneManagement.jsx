// client/src/pages/DroneManagement.jsx
import React, { useState } from 'react';
import DroneTracker from '../components/DroneTracker';
import MapView from '../components/MapView';
import { Send, ShieldAlert, History, Navigation } from 'lucide-react';

export default function DroneManagement({
  drones = [],
  flightLogs = [],
  weather = [],
  onDispatchDrone,
}) {
  const [manualDroneId, setManualDroneId] = useState('DRONE-1');
  const [manualLat, setManualLat] = useState('26.720');
  const [manualLon, setManualLon] = useState('88.350');

  const nathulaWeather = weather.find((w) => w.id === 'nathula');
  const isHighWindGrounded = (nathulaWeather && nathulaWeather.windSpeed > 40) || false;

  const handleManualDispatch = (e) => {
    e.preventDefault();
    if (onDispatchDrone) {
      onDispatchDrone(manualDroneId, {
        lat: parseFloat(manualLat),
        lon: parseFloat(manualLon),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Fleet Cards */}
      <DroneTracker
        drones={drones}
        onDispatch={(droneId, coords) => onDispatchDrone && onDispatchDrone(droneId, coords)}
        grounded={isHighWindGrounded}
      />

      {/* Grid: Map + Manual Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-3 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold text-[#E2E8F0] tracking-wider uppercase">
              TACTICAL AIR PATROL RADAR & WAYPOINTS
            </h4>
            <span className="text-[10px] font-mono text-[#00E5FF]">
              REAL-TIME KINEMATICS • 1Hz TELEMETRY
            </span>
          </div>
          <MapView height=\"340px\" drones={drones} zoom={9} />
        </div>

        {/* Manual Dispatch Form */}
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A5F]">
              <Navigation className="w-4 h-4 text-[#00E5FF]" />
              <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
                MANUAL WAYPOINT DISPATCH
              </h4>
            </div>

            <form onSubmit={handleManualDispatch} className="space-y-2.5 font-mono text-xs mt-3">
              <div>
                <label className="text-[10px] text-[#64748B] block mb-1">SELECT UAV</label>
                <select
                  value={manualDroneId}
                  onChange={(e) => setManualDroneId(e.target.value)}
                  className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1.5 text-[#E2E8F0] outline-none"
                >
                  {drones.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} ({d.status}) - Batt: {Math.round(d.battery || 100)}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#64748B] block mb-1">TARGET LATITUDE</label>
                <input
                  type="text"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1.5 text-[#E2E8F0] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#64748B] block mb-1">TARGET LONGITUDE</label>
                <input
                  type="text"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1.5 text-[#E2E8F0] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isHighWindGrounded}
                className={w-full py-2 rounded font-bold flex items-center justify-center gap-1.5 transition-colors }
              >
                <Send className="w-3.5 h-3.5" />
                INITIATE SORTIE
              </button>
            </form>
          </div>

          <p className="text-[10px] font-mono text-[#64748B]">
            Automated collision avoidance and geo-fencing (SSB SOP-09) active across all border sectors.
          </p>
        </div>
      </div>

      {/* Flight Logs */}
      <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A5F]">
          <History className="w-4 h-4 text-[#00E5FF]" />
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
            TACTICAL FLIGHT SORTIE MISSION LOGS
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E3A5F] text-[#64748B] text-[10px]">
                <th className="py-2">MISSION ID</th>
                <th className="py-2">TIME</th>
                <th className="py-2">UAV</th>
                <th className="py-2">TYPE</th>
                <th className="py-2">OUTCOME</th>
                <th className="py-2">DURATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/50">
              {flightLogs.length > 0 ? (
                flightLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1E3A5F]/20">
                    <td className="py-2 text-[#00E5FF]">{log.id}</td>
                    <td className="py-2 text-[#64748B]">{log.timestamp}</td>
                    <td className="py-2 text-[#E2E8F0] font-bold">{log.droneId}</td>
                    <td className="py-2">{log.missionType}</td>
                    <td className="py-2">
                      <span className="text-[#00C853] font-bold">{log.result}</span>
                    </td>
                    <td className="py-2 text-[#64748B]">{log.duration}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-[#64748B]">
                    No completed sorties recorded in current session
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
