// client/src/components/TopBar.jsx
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Clock,
  Wifi,
  WifiOff,
  Bell,
  Sparkles,
  Sliders,
} from 'lucide-react';

export default function TopBar({
  isConnected,
  connectionStatus,
  activeAlertCount = 0,
  onTriggerAlert,
  onResetLayout,
}) {
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setIstTime(${new Intl.DateTimeFormat('en-IN', options).format(now)} IST);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 border-b border-[#1E3A5F] bg-[#0A0E1A] px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Sector */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#111827] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider text-[#E2E8F0] font-mono">
              IBVAP
            </span>
            <span className="text-[10px] bg-[#1E3A5F]/60 text-[#00E5FF] px-1.5 py-0.2 rounded border border-[#00E5FF]/30 font-mono">
              v2.4-TACTICAL
            </span>
          </div>
          <p className="text-[10px] text-[#64748B] tracking-tight">
            Sector-IV North Bengal & Siliguri Corridor • SSB / BSF Joint Command
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#111827] border border-[#1E3A5F]">
          <div className="relative flex items-center justify-center">
            <div className={w-2 h-2 rounded-full } />
            {isConnected && (
              <div className="absolute w-3 h-3 rounded-full bg-[#00C853] animate-ping opacity-75" />
            )}
          </div>
          <span className="text-[11px] text-[#E2E8F0]">
            SOCKET: {connectionStatus}
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#111827] border border-[#1E3A5F] text-[#E2E8F0]">
          <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="text-[11px]">{istTime || 'SYNCHRONIZING IST...'}</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#111827] border border-[#1E3A5F] text-[#E2E8F0]">
          <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          <span className="text-[11px]">NET: DEFCON-3 SECURE</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {onTriggerAlert && (
          <button
            onClick={onTriggerAlert}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FF4444]/15 hover:bg-[#FF4444]/25 text-[#FF4444] border border-[#FF4444]/40 rounded text-xs transition-colors"
            title="Simulate Incursion Alert"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">SIMULATE ALERT</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#111827] border border-[#1E3A5F] rounded text-xs font-mono text-[#E2E8F0]">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
          <span className="hidden md:inline">OP: Insp. V. Singh</span>
          <span className="md:hidden">OP-8942</span>
        </div>
      </div>
    </header>
  );
}
