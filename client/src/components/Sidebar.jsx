// client/src/components/Sidebar.jsx
import React from 'react';
import {
  Activity,
  Video,
  AlertTriangle,
  Car,
  Users,
  Cpu,
  Lock,
  Layers,
  Send,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Command Overview', icon: Activity },
  { id: 'feeds', label: 'Live Feeds', icon: Video },
  { id: 'alerts', label: 'Alerts & Events', icon: AlertTriangle, badgeKey: 'alerts' },
  { id: 'anpr', label: 'ANPR Recognition', icon: Car },
  { id: 'faces', label: 'Face Recognition', icon: Users },
  { id: 'drone', label: 'Drone Management', icon: Send },
  { id: 'blockchain', label: 'Blockchain Audit', icon: Lock },
  { id: 'status', label: 'System Status', icon: Cpu },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isExpanded,
  setIsExpanded,
  alertCount = 0,
}) {
  return (
    <aside
      className={order-r border-[#1E3A5F] bg-[#0A0E1A] flex flex-col justify-between transition-all duration-300 z-20 select-none }
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="py-3">
        <div className="px-3 mb-3 flex items-center gap-2 overflow-hidden">
          <div className="w-10 h-10 rounded bg-[#111827] border border-[#1E3A5F] flex items-center justify-center shrink-0 text-[#00E5FF]">
            <Layers className="w-5 h-5" />
          </div>
          {isExpanded && (
            <div className="leading-tight truncate">
              <span className="text-xs font-bold text-[#E2E8F0] tracking-wider uppercase font-mono">
                SSB SILIGURI
              </span>
              <p className="text-[10px] text-[#64748B]">TACTICAL HUD</p>
            </div>
          )}
        </div>

        <nav className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-all relative }
                title={item.label}
              >
                <Icon
                  className={w-5 h-5 shrink-0 transition-colors }
                />
                {isExpanded && <span className="truncate">{item.label}</span>}
                {item.id === 'alerts' && alertCount > 0 && (
                  <span
                    className={px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold  bg-[#FF4444] text-white animate-pulse}
                  >
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-[#1E3A5F] text-[10px] text-[#64748B]">
        {isExpanded ? (
          <div className="space-y-1">
            <p className="text-[#E2E8F0] font-mono">NODE: IN-WB-SLG-04</p>
            <p>LAT: 26.7271° N | LON: 88.3953° E</p>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#00C853] mx-auto" />
        )}
      </div>
    </aside>
  );
}
