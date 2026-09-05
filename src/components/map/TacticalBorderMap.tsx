'use client';

import React, { useState, useRef } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import { Camera, VirtualFenceZone } from '@/lib/types';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Layers,
  Crosshair,
  Maximize2,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface TacticalBorderMapProps {
  allowDrawing?: boolean;
  fullScreen?: boolean;
}

export function TacticalBorderMap({ allowDrawing = true, fullScreen = false }: TacticalBorderMapProps) {
  const {
    cameras,
    zones,
    setSelectedCamera,
    isDrawingFence,
    setIsDrawingFence,
    fenceDrawingPoints,
    addFenceDrawingPoint,
    clearFenceDrawing,
    saveNewFenceZone,
    triggerSimulatedBreach,
  } = useDemoSimulation();

  const [selectedLayer, setSelectedLayer] = useState<'ALL' | 'CAMERAS' | 'FENCES' | 'RADAR'>('ALL');
  const [hoveredCamera, setHoveredCamera] = useState<Camera | null>(null);
  const [newZoneName, setNewZoneName] = useState('Sector Delta Geofence');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawingFence) return;
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    addFenceDrawingPoint({ x, y });
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${
        fullScreen ? 'h-[calc(100vh-8.5rem)]' : 'h-[580px]'
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono-numbers">
              SECTOR GRID: WESTERN CORRIDOR 32.42° N, 74.91° E
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono-numbers">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> ONLINE
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> WARNING
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" /> BREACH ALERT
            </span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2">
          {allowDrawing && (
            <>
              {!isDrawingFence ? (
                <button
                  onClick={() => setIsDrawingFence(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                >
                  <Plus className="w-3.5 h-3.5" /> Draw Virtual Fence
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-cyan-500/50">
                  <span className="text-[11px] text-cyan-300 font-mono-numbers px-2">
                    Points: {fenceDrawingPoints.length}
                  </span>
                  <button
                    onClick={() => saveNewFenceZone(newZoneName, 'Perimeter Sensor Buffer')}
                    disabled={fenceDrawingPoints.length < 3}
                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Arm Geofence
                  </button>
                  <button
                    onClick={clearFenceDrawing}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    title="Cancel Drawing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Simulate Breach Trigger */}
          <button
            onClick={() => triggerSimulatedBreach('BOP-02')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Test Breach
          </button>
        </div>
      </div>

      {/* Main SVG Tactical Canvas */}
      <div className="relative flex-1 w-full bg-[#050912] overflow-hidden cursor-crosshair">
        {/* Radar Sweep Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-cyan-500/25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-cyan-500/20" />
        </div>

        {/* Tactical Grid Pattern */}
        <svg
          ref={svgRef}
          onClick={handleMapClick}
          viewBox="0 0 1000 600"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="tacticalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Striped pattern for restricted zone */}
            <pattern id="restrictedHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="3" />
            </pattern>
          </defs>

          {/* Grid Fill */}
          <rect width="1000" height="600" fill="url(#tacticalGrid)" />

          {/* Terrain & River Segment (Ravi Basin) */}
          <path
            d="M 280,0 Q 360,200 420,350 T 520,600"
            fill="none"
            stroke="#132742"
            strokeWidth="48"
            strokeLinecap="round"
          />
          <path
            d="M 280,0 Q 360,200 420,350 T 520,600"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <text x="440" y="320" fill="#0284c7" fontSize="11" fontFamily="monospace" opacity="0.8">
            RAVI RIVERINE BASIN
          </text>

          {/* Patrol Highway Track */}
          <path
            d="M 0,220 C 300,240 600,200 1000,280"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
          />
          <path
            d="M 0,220 C 300,240 600,200 1000,280"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <text x="680" y="240" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            PATROL CORRIDOR DELTA (HIGHWAY 14)
          </text>

          {/* International Border Line (Zero Line) */}
          <path
            d="M 120,0 L 250,150 L 500,250 L 750,420 L 920,600"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="12 6"
            filter="drop-shadow(0 0 8px rgba(239,68,68,0.7))"
          />
          <text x="760" y="440" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace">
            ZERO LINE (INTERNATIONAL BORDER)
          </text>

          {/* Virtual Fence Zones */}
          {zones.map((zone) => {
            const isBreached = zone.status === 'BREACHED';
            const pointsStr = zone.polygon
              .map((p) => `${p.x * 10},${p.y * 6}`)
              .join(' ');

            return (
              <g key={zone.id}>
                <polygon
                  points={pointsStr}
                  fill={isBreached ? 'url(#restrictedHatch)' : `${zone.color}15`}
                  stroke={isBreached ? '#ef4444' : zone.color}
                  strokeWidth={isBreached ? 3 : 2}
                  strokeDasharray={isBreached ? '6 4' : undefined}
                  className={isBreached ? 'animate-pulse' : ''}
                />
                <text
                  x={zone.polygon[0].x * 10 + 10}
                  y={zone.polygon[0].y * 6 + 20}
                  fill={isBreached ? '#ef4444' : zone.color}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {zone.name} [{zone.status}]
                </text>
              </g>
            );
          })}

          {/* Currently Drawing Points / Lines */}
          {isDrawingFence && fenceDrawingPoints.length > 0 && (
            <g>
              <polyline
                points={fenceDrawingPoints.map((p) => `${p.x * 10},${p.y * 6}`).join(' ')}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {fenceDrawingPoints.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x * 10}
                  cy={p.y * 6}
                  r="5"
                  fill="#00f0ff"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}

          {/* Checkposts & Watchtowers */}
          <g transform="translate(780, 390)">
            <rect x="-12" y="-12" width="24" height="24" fill="#0b121e" stroke="#00f0ff" strokeWidth="2" />
            <text x="16" y="4" fill="#00f0ff" fontSize="10" fontFamily="monospace" fontWeight="bold">
              CHECKPOST-04 GATE
            </text>
          </g>

          <g transform="translate(350, 108)">
            <polygon points="0,-14 12,10 -12,10" fill="#0b121e" stroke="#f59e0b" strokeWidth="2" />
            <text x="16" y="4" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              WATCHTOWER-05
            </text>
          </g>

          {/* CCTV Camera Nodes on Map */}
          {cameras.map((cam) => {
            const cx = cam.coordinates.mapX * 10;
            const cy = cam.coordinates.mapY * 6;
            const isAlert = cam.status === 'ALERT';
            const isWarning = cam.status === 'WARNING';
            const color = isAlert ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

            return (
              <g
                key={cam.id}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCamera(cam);
                }}
                onMouseEnter={() => setHoveredCamera(cam)}
                onMouseLeave={() => setHoveredCamera(null)}
              >
                {/* Pulsing ring for alert */}
                {isAlert && (
                  <circle r="22" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" values="12;28" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}

                <circle r="12" fill="#060b13" stroke={color} strokeWidth="2.5" />
                <circle r="5" fill={color} />

                {/* Camera Name Tag */}
                <text
                  x="16"
                  y="4"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                >
                  {cam.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Camera Tooltip */}
        {hoveredCamera && (
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-xs font-mono-numbers space-y-1 pointer-events-none z-20">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              {hoveredCamera.id} – {hoveredCamera.name}
            </div>
            <div className="text-slate-300">LOC: {hoveredCamera.location}</div>
            <div className="text-slate-400">TYPE: {hoveredCamera.type} | FPS: {hoveredCamera.fps}</div>
            <div className="text-emerald-400">
              STATUS: {hoveredCamera.status} ({hoveredCamera.detectedCount} objects tracked)
            </div>
          </div>
        )}

        {/* Instruction overlay when drawing */}
        {isDrawingFence && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-xs text-cyan-300 font-bold shadow-xl backdrop-blur-md animate-bounce">
            Click on map to drop polygon points (min 3 points) → Click "Arm Geofence"
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 font-mono-numbers">
        <div className="flex items-center gap-4">
          <span>COORDINATE DATUM: WGS84</span>
          <span>ELEVATION: 280m - 410m</span>
          <span>GEOMAGNETIC COMPASS: 004° E</span>
        </div>
        <div className="text-slate-500">
          PROTOTYPE DEMONSTRATION – SMART INDIA HACKATHON
        </div>
      </div>
    </div>
  );
}
