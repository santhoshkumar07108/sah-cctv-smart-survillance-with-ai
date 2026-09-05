'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  LayoutDashboard,
  Video,
  BarChart3,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Car,
  Users,
  FileText,
  Camera,
  Cpu,
  Activity,
  GitBranch,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onToggle, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { kpis, alerts } = useDemoSimulation();

  const activeAlertsCount = alerts.filter(a => a.status === 'NEW').length;

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'AI Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Perimeter Security', href: '/perimeter', icon: ShieldAlert, badge: kpis.intrusionEvents > 0 ? 'BREACH' : undefined, badgeColor: 'bg-rose-500' },
    { label: 'Alert Center', href: '/alerts', icon: AlertTriangle, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined, badgeColor: 'bg-amber-500' },
    { label: 'Command Map', href: '/map', icon: MapPin },
    { label: 'ANPR Dashboard', href: '/anpr', icon: Car },
    { label: 'Face Analytics', href: '/faces', icon: Users },
    { label: 'Event Log', href: '/events', icon: FileText },
    { label: 'Camera Network', href: '/cameras', icon: Camera },
    { label: 'AI Models', href: '/models', icon: Cpu },
    { label: 'System Health', href: '/system-health', icon: Activity },
    { label: 'AI Pipeline', href: '/pipeline', icon: GitBranch, highlight: true },
    { label: 'Secure Login', href: '/login', icon: Lock },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-14 left-0 z-40 h-screen lg:h-[calc(100vh-3.5rem)] bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex-1 overflow-y-auto py-3 px-2.5">
          {/* Collapse Toggle for Desktop */}
          <div className="hidden lg:flex items-center justify-between px-2 mb-3">
            {!isCollapsed && (
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                Tactical Navigation
              </span>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 ml-auto transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.highlight && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                      AI FLOW
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${item.badgeColor} animate-pulse`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 hidden group-hover:flex items-center px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded shadow-xl whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && (
                        <span className={`ml-2 px-1.5 py-0.2 text-[10px] font-bold rounded ${item.badgeColor} text-white`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tactical Footer Badge */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-900 bg-slate-950/60">
            <div className="rounded-lg p-2.5 bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> SIH HACKATHON
                </span>
                <span className="text-[10px] text-emerald-400">DEMO MODE</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Simulated AI feeds, virtual fences & neural tracking live.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
