'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDemoSimulation, NotificationItem } from '@/context/DemoSimulationContext';
import { Bell, ShieldAlert, CheckCircle2, Info, X, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function NotificationDropdown() {
  const { notifications, dismissNotification, clearAllNotifications, setSelectedCamera, cameras } = useDemoSimulation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInspect = (notif: NotificationItem) => {
    if (notif.cameraId) {
      const targetCam = cameras.find(c => c.id === notif.cameraId);
      if (targetCam) {
        setSelectedCamera(targetCam);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/60 hover:bg-slate-800 transition-all text-slate-300 hover:text-cyan-400"
        title="Tactical Alert Notifications"
        aria-label="Tactical Alert Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
                System Incident Feed
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-400 border border-cyan-500/30">
                {unreadCount}
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                No active tactical warnings. Sector perimeter normal.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 transition-colors hover:bg-slate-900/60 ${
                    item.type === 'CRITICAL'
                      ? 'bg-rose-950/20 border-l-2 border-rose-500'
                      : item.type === 'HIGH'
                      ? 'bg-amber-950/20 border-l-2 border-amber-500'
                      : 'border-l-2 border-cyan-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {item.type === 'CRITICAL' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0 animate-pulse" />
                      ) : item.type === 'HIGH' ? (
                        <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs text-slate-200 leading-snug">{item.message}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-slate-400 font-mono-numbers">
                            {item.timestamp}
                          </span>
                          {item.cameraId && (
                            <button
                              onClick={() => handleInspect(item)}
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                            >
                              Inspect {item.cameraId} <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissNotification(item.id)}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/40 text-center">
            <Link
              href="/alerts"
              onClick={() => setIsOpen(false)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1.5"
            >
              Open Full Alert Center →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
