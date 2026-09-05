// client/src/pages/AlertsLog.jsx
import React, { useState } from 'react';
import AlertCard from '../components/AlertCard';
import { AlertTriangle, Filter, Search, CheckCircle2 } from 'lucide-react';

export default function AlertsLog({
  alerts = [],
  onAcknowledgeAlert,
  onDispatchDrone,
  onLocateOnMap,
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        alert.type.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q) ||
        alert.cameraId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search alerts by type, camera, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1 text-xs text-[#E2E8F0] focus:border-[#00E5FF] outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#64748B]">SEVERITY:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={px-2 py-1 rounded transition-colors }
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={onAcknowledgeAlert}
              onDispatchDrone={onDispatchDrone}
              onLocateOnMap={onLocateOnMap}
            />
          ))
        ) : (
          <div className="col-span-full p-8 text-center rounded bg-[#111827] border border-[#1E3A5F] text-[#64748B] font-mono text-xs">
            NO ALERTS MATCHING CURRENT FILTERS
          </div>
        )}
      </div>
    </div>
  );
}
