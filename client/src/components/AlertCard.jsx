// client/src/components/AlertCard.jsx
import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export default function AlertCard({
  alert,
  onAcknowledge,
  onDispatchDrone,
  onLocateOnMap,
}) {
  const isHigh = alert.severity === 'HIGH';
  const isMed = alert.severity === 'MEDIUM';

  const badgeColor = isHigh
    ? 'bg-[#FF4444]/20 text-[#FF4444] border-[#FF4444]/40'
    : isMed
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    : 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40';

  return (
    <div
      className={p-3 rounded bg-[#111827] border  hover:border-[#00E5FF]/50 transition-all space-y-2}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border }
          >
            {alert.severity}
          </span>
          <span className="font-mono text-xs font-semibold text-[#E2E8F0]">
            {alert.type}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#64748B]">
          {alert.timestamp || 'JUST NOW'}
        </span>
      </div>

      <p className="text-xs text-[#E2E8F0]/90 leading-relaxed">
        {alert.description}
      </p>

      {/* Meta Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1 border-t border-[#1E3A5F]/50">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#00E5FF]" />
          <span>{alert.cameraId || 'CAM-001'} ({alert.zone || 'Sector'})</span>
        </div>

        {alert.confidence && (
          <div className="flex items-center gap-1">
            <span>CONF:</span>
            <div className="w-12 bg-[#1E3A5F] h-1.5 rounded-full overflow-hidden">
              <div
                className={h-full }
                style={{ width: ${alert.confidence}% }}
              />
            </div>
            <span className="text-[#E2E8F0]">{alert.confidence}%</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {alert.status === 'UNACKNOWLEDGED' && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="flex-1 py-1 px-2 rounded bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
          >
            <CheckCircle2 className="w-3 h-3" />
            ACKNOWLEDGE
          </button>
        )}

        {onDispatchDrone && !alert.droneDispatched && (
          <button
            onClick={() => onDispatchDrone(alert.id, alert.coordinates)}
            className="flex-1 py-1 px-2 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" />
            DISPATCH DRONE
          </button>
        )}

        {onLocateOnMap && alert.coordinates && (
          <button
            onClick={() => onLocateOnMap(alert.coordinates)}
            className="py-1 px-2 rounded bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-[#E2E8F0] text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
            title="Locate on Map"
          >
            <Navigation className="w-3 h-3 text-[#00E5FF]" />
          </button>
        )}
      </div>
    </div>
  );
}
