'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Shield,
  Activity,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Radio,
  UserCheck,
  Menu,
} from 'lucide-react';
import { formatCurrentTime } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const {
    isDemoActive,
    startDemo,
    pauseDemo,
    resetDemo,
    triggerSimulatedBreach,
    soundMuted,
    toggleSound,
    kpis,
  } = useDemoSimulation();

  const [time, setTime] = useState<{ ist: string; zulu: string }>({ ist: '--:--:--', zulu: '--:--:--Z' });

  useEffect(() => {
    const updateTime = () => setTime(formatCurrentTime());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  IBVAP
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span className="hidden xl:inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase bg-slate-800/80 text-cyan-400/90 border border-cyan-800/40">
                  DEFENSE AI PLATFORM
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 tracking-tight">
                Intelligent Border Video Analytics Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Military Time & Telemetry */}
        <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-medium">STREAM:</span>
            <span className="text-cyan-300 font-mono-numbers font-semibold">
              {kpis.onlineCameras}/{kpis.activeCameras} RTSP OK
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono-numbers">
            <div>
              <span className="text-[10px] text-slate-500 uppercase mr-1">IST</span>
              <span className="text-slate-200 font-semibold">{time.ist}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase mr-1">UTC</span>
              <span className="text-slate-400">{time.zulu}</span>
            </div>
          </div>
        </div>

        {/* Right: Demo Mode Bar, Sounds & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Demo Mode Action Group */}
          <div className="flex items-center bg-slate-900/90 border border-cyan-900/50 rounded-lg p-1 gap-1">
            <button
              onClick={isDemoActive ? pauseDemo : startDemo}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all ${
                isDemoActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title={isDemoActive ? 'Pause AI Event Simulation' : 'Start AI Event Simulation'}
            >
              {isDemoActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{isDemoActive ? 'PAUSE DEMO' : 'START DEMO'}</span>
            </button>

            <button
              onClick={resetDemo}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              title="Reset Simulated State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* WOW Feature: Trigger Instant Breach */}
            <button
              onClick={() => triggerSimulatedBreach()}
              className="px-2 py-1 rounded text-[11px] font-bold tracking-wide bg-rose-600/90 hover:bg-rose-500 text-white flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)]"
              title="Trigger Instant Simulated Perimeter Breach (Hackathon Demo)"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span className="hidden sm:inline">SIMULATE BREACH</span>
              <span className="sm:hidden">BREACH</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundMuted
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-slate-900/80 border-slate-700/80 text-cyan-400 hover:border-cyan-500/50'
            }`}
            title={soundMuted ? 'Tactical Audio Muted' : 'Tactical Audio Active'}
            aria-label="Toggle Tactical Audio"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Operator Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-900 to-indigo-900 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs font-bold">
              OP
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-medium text-slate-200">Cmdr. R. Verma</div>
              <div className="text-[10px] text-cyan-400 flex items-center gap-0.5">
                <UserCheck className="w-2.5 h-2.5" /> Sector Lead (Ops)
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
