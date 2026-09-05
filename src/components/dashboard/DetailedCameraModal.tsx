'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera } from '@/lib/types';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  X,
  Radio,
  Scan,
  Camera as CameraIcon,
  Flame,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Activity,
  Check,
} from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

interface DetailedCameraModalProps {
  camera: Camera | null;
  onClose: () => void;
}

export function DetailedCameraModal({ camera, onClose }: DetailedCameraModalProps) {
  const { toggleCameraIR, toggleCameraAI, triggerSimulatedBreach } = useDemoSimulation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'stream' | 'telemetry' | 'models'>('stream');

  useEffect(() => {
    if (!camera) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      // Apply PTZ transform
      ctx.translate(w / 2 + panOffset.x, h / 2 + panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-w / 2, -h / 2);

      // Background
      if (camera.irMode) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#060a12');
        grad.addColorStop(0.5, '#132135');
        grad.addColorStop(1, '#080d16');
        ctx.fillStyle = grad;
        ctx.fillRect(-w, -h, w * 3, h * 3);

        // Heatmap terrain
        ctx.strokeStyle = '#1e3a5f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.6);
        ctx.bezierCurveTo(w * 0.3, h * 0.5, w * 0.7, h * 0.7, w, h * 0.6);
        ctx.stroke();
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e293b');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(-w, -h, w * 3, h * 3);

        // Grid lines
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.55);
        ctx.lineTo(w, h * 0.55);
        ctx.stroke();
      }

      // Moving target in detailed view
      const prog = (Math.sin(tick * 0.01) + 1) / 2;
      const tx = w * (0.25 + prog * 0.45);
      const ty = h * (0.42 + Math.sin(tick * 0.02) * 0.06);
      const bw = 48;
      const bh = 95;

      // Thermal glow
      if (camera.irMode) {
        const rGrad = ctx.createRadialGradient(tx + bw / 2, ty + bh * 0.4, 8, tx + bw / 2, ty + bh * 0.4, bw * 1.2);
        rGrad.addColorStop(0, '#ffffff');
        rGrad.addColorStop(0.3, '#ff9900');
        rGrad.addColorStop(0.7, '#cc1100');
        rGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rGrad;
        ctx.fillRect(tx - 15, ty - 15, bw + 30, bh + 30);
      }

      // AI Detection Box
      if (camera.aiEnabled) {
        ctx.strokeStyle = camera.status === 'ALERT' ? '#ef4444' : '#00f0ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(tx, ty, bw, bh);

        // Corner brackets
        const cLen = 10;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tx, ty + cLen);
        ctx.lineTo(tx, ty);
        ctx.lineTo(tx + cLen, ty);
        ctx.moveTo(tx + bw - cLen, ty);
        ctx.lineTo(tx + bw, ty);
        ctx.lineTo(tx + bw, ty + cLen);
        ctx.moveTo(tx, ty + bh - cLen);
        ctx.lineTo(tx, ty + bh);
        ctx.lineTo(tx + cLen, ty + bh);
        ctx.moveTo(tx + bw - cLen, ty + bh);
        ctx.lineTo(tx + bw, ty + bh);
        ctx.lineTo(tx + bw, ty + bh - cLen);
        ctx.stroke();

        // Label
        const label = camera.status === 'ALERT' ? 'TARGET [BREACH] 97%' : `PERSON [TRACK-04] ${Math.round(camera.aiConfidence * 100)}%`;
        ctx.fillStyle = camera.status === 'ALERT' ? '#ef4444' : '#00f0ff';
        ctx.fillRect(tx, ty - 18, 160, 18);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(label, tx + 4, ty - 5);
      }

      ctx.restore();

      // Overlays outside zoom
      const scanY = (tick * 2) % h;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.fillRect(0, scanY, w, 3);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [camera, zoomLevel, panOffset]);

  if (!camera) return null;

  const handlePan = (dx: number, dy: number) => {
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(3.0, Math.max(0.8, +(prev + delta).toFixed(1))));
  };

  const resetPtz = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  const captureSnapshot = () => {
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                camera.status === 'ALERT'
                  ? 'bg-rose-500 animate-ping'
                  : camera.status === 'WARNING'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono-numbers">
                  {camera.id} – {camera.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {camera.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE STREAM
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-numbers">
                COORDINATES: {camera.coordinates.lat} N, {camera.coordinates.lng} E | LOC: {camera.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center px-4 sm:px-6 border-b border-slate-800 bg-slate-900/40 text-xs font-semibold gap-4">
          <button
            onClick={() => setActiveTab('stream')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'stream'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Feed & PTZ
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'telemetry'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            RTSP Stream Telemetry
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'models'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Vision Pipelines
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'stream' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Camera View Canvas */}
              <div className="lg:col-span-3 relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={405}
                  className="w-full h-full object-cover block"
                />

                {/* Scanline */}
                <div className="absolute inset-0 cctv-scanline opacity-75 pointer-events-none" />

                {/* Video OSD */}
                <div className="absolute top-3 left-3 text-[11px] font-mono-numbers text-cyan-400 bg-black/60 px-2 py-1 rounded backdrop-blur border border-cyan-500/30 space-y-0.5">
                  <div>RTSP STATUS: ACTIVE (30.2 FPS)</div>
                  <div>BITRATE: 4.8 Mbps H.265</div>
                  <div>ZOOM: {zoomLevel.toFixed(1)}x | PTZ: [{panOffset.x}, {panOffset.y}]</div>
                </div>

                <div className="absolute top-3 right-3 text-[11px] font-mono-numbers text-right text-emerald-400 bg-black/60 px-2 py-1 rounded backdrop-blur border border-emerald-500/30">
                  <div>{formatTimestamp()}</div>
                  <div className="text-cyan-300">CONF: {Math.round(camera.aiConfidence * 100)}%</div>
                </div>

                {snapshotSuccess && (
                  <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
                    <span className="px-4 py-2 bg-slate-900 text-cyan-300 rounded-lg font-bold border border-cyan-400 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-400" /> FRAME ARCHIVED (FULL RES)
                    </span>
                  </div>
                )}
              </div>

              {/* PTZ & Mode Controls */}
              <div className="space-y-4">
                {/* PTZ Control Pad */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Virtual PTZ Controls
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 max-w-[150px] mx-auto mb-3">
                    <div />
                    <button
                      onClick={() => handlePan(0, 30)}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <div />

                    <button
                      onClick={() => handlePan(30, 0)}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetPtz}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 flex items-center justify-center"
                      title="Reset PTZ"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handlePan(-30, 0)}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div />
                    <button
                      onClick={() => handlePan(0, -30)}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div />
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleZoom(-0.2)}
                      className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    >
                      <ZoomOut className="w-3.5 h-3.5" /> Out
                    </button>
                    <span className="text-xs font-mono-numbers text-cyan-300 px-2 font-bold">
                      {zoomLevel.toFixed(1)}x
                    </span>
                    <button
                      onClick={() => handleZoom(0.2)}
                      className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> In
                    </button>
                  </div>
                </div>

                {/* Mode Toggles */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleCameraIR(camera.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      camera.irMode
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    {camera.irMode ? 'Thermal FLIR Active' : 'Enable Thermal FLIR'}
                  </button>

                  <button
                    onClick={() => toggleCameraAI(camera.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      camera.aiEnabled
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Scan className="w-4 h-4 text-cyan-400" />
                    {camera.aiEnabled ? 'AI Overlays ON' : 'AI Overlays OFF'}
                  </button>

                  <button
                    onClick={captureSnapshot}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center justify-center gap-2"
                  >
                    <CameraIcon className="w-4 h-4 text-cyan-400" />
                    Capture Snapshot
                  </button>

                  <button
                    onClick={() => {
                      triggerSimulatedBreach(camera.id);
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(239,68,68,0.35)]"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Trigger Test Intrusion
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Stream Connection URL</div>
                <div className="text-xs font-mono-numbers text-cyan-300 bg-black/60 p-2 rounded border border-slate-800 truncate">
                  {camera.rtspUrl}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active RTSP handshake (TCP mode)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Encoding & Resolution</div>
                <div className="text-lg font-bold text-slate-100 font-mono-numbers">{camera.resolution}</div>
                <div className="text-xs text-slate-400">Framerate: {camera.fps} FPS target (H.265 Main 10)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Network Latency & Jitter</div>
                <div className="text-lg font-bold text-emerald-400 font-mono-numbers">14 ms (Jitter: 0.8 ms)</div>
                <div className="text-xs text-slate-400">Packet Loss: 0.00% (Sub-frame synchronized)</div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Assigned Computer Vision Pipelines
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">YOLOv10x Person & Intruder</div>
                    <div className="text-[11px] text-slate-400">Confidence: 70% | TensorRT FP16</div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Virtual Tripwire Geofence Logic</div>
                    <div className="text-[11px] text-slate-400">Instant vector intersection alarm</div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 rounded">
                    ARMED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
