'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera } from '@/lib/types';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Maximize2,
  Camera as CameraIcon,
  AlertCircle,
  Eye,
  Flame,
  Radio,
  Scan,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatTimestamp } from '@/lib/utils';

interface CameraFeedCardProps {
  camera: Camera;
  onOpenDetails: (cam: Camera) => void;
}

export function CameraFeedCard({ camera, onOpenDetails }: CameraFeedCardProps) {
  const { toggleCameraIR, triggerSimulatedBreach } = useDemoSimulation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update camera local timecode
  useEffect(() => {
    const updateTime = () => setCurrentTime(formatTimestamp());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // HTML5 Canvas dynamic video simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    // Simulated moving objects inside camera field of view
    const isThermal = camera.irMode;
    const isNight = camera.type === 'NIGHT_VISION' || camera.type === 'THERMAL_IR';

    const renderFrame = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background scene rendering (Thermal vs Optical)
      if (isThermal) {
        // High-contrast FLIR thermal gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0a0d18');
        bgGrad.addColorStop(0.5, '#121d2d');
        bgGrad.addColorStop(1, '#090d14');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Terrain contour thermal lines
        ctx.strokeStyle = '#1e3a5f';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.65);
        ctx.bezierCurveTo(width * 0.3, height * 0.55, width * 0.7, height * 0.75, width, height * 0.6);
        ctx.stroke();

        // Thermal horizon foliage
        ctx.fillStyle = '#0f243a';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.65);
        ctx.bezierCurveTo(width * 0.3, height * 0.55, width * 0.7, height * 0.75, width, height * 0.6);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
      } else if (isNight) {
        // Night Vision Green/Phosphor aesthetic
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#030d06');
        bgGrad.addColorStop(1, '#06170a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Road / Patrol path
        ctx.fillStyle = '#0a2310';
        ctx.beginPath();
        ctx.moveTo(width * 0.2, height);
        ctx.lineTo(width * 0.45, height * 0.45);
        ctx.lineTo(width * 0.55, height * 0.45);
        ctx.lineTo(width * 0.8, height);
        ctx.fill();
      } else {
        // Optical daylight/dusk camera feed
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.45, '#1e293b');
        bgGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Border fence wire / terrain elements
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.55);
        ctx.lineTo(width, height * 0.55);
        ctx.stroke();

        // Vertical fence posts
        for (let x = 20; x < width; x += 45) {
          ctx.beginPath();
          ctx.moveTo(x, height * 0.45);
          ctx.lineTo(x, height * 0.7);
          ctx.stroke();
        }
      }

      // 2. Simulated Moving AI Detected Objects
      if (camera.aiEnabled && camera.detectedCount > 0) {
        // Target 1: Moving Person / Intruder
        const speedFactor = 0.008;
        const progress1 = (Math.sin(tick * speedFactor) + 1) / 2; // 0 to 1 smooth oscillation
        const targetX = width * (0.2 + progress1 * 0.5);
        const targetY = height * (0.45 + Math.sin(tick * 0.015) * 0.08);
        const boxW = isThermal ? 32 : 28;
        const boxH = isThermal ? 56 : 52;

        // Draw historic tracking vector dots
        ctx.fillStyle = isThermal ? '#ff9900' : '#00f0ff';
        for (let i = 1; i <= 4; i++) {
          const trailProg = (Math.sin((tick - i * 15) * speedFactor) + 1) / 2;
          const trailX = width * (0.2 + trailProg * 0.5);
          const trailY = height * (0.45 + Math.sin((tick - i * 15) * 0.015) * 0.08);
          ctx.globalAlpha = 0.6 - i * 0.12;
          ctx.beginPath();
          ctx.arc(trailX + boxW / 2, trailY + boxH / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // Thermal signature glow inside box if thermal
        if (isThermal) {
          const radGrad = ctx.createRadialGradient(
            targetX + boxW / 2, targetY + boxH * 0.4, 4,
            targetX + boxW / 2, targetY + boxH * 0.4, boxW
          );
          radGrad.addColorStop(0, '#ffffff');
          radGrad.addColorStop(0.3, '#ffaa00');
          radGrad.addColorStop(0.7, '#cc2200');
          radGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = radGrad;
          ctx.fillRect(targetX - 5, targetY - 5, boxW + 10, boxH + 10);
        }

        // Bounding Box
        const isAlert = camera.status === 'ALERT';
        const strokeColor = isAlert ? '#ef4444' : isThermal ? '#f59e0b' : isNight ? '#22c55e' : '#00f0ff';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(targetX, targetY, boxW, boxH);

        // Corner brackets for military vision style
        const cornerLen = 6;
        ctx.lineWidth = 2.5;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(targetX, targetY + cornerLen);
        ctx.lineTo(targetX, targetY);
        ctx.lineTo(targetX + cornerLen, targetY);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(targetX + boxW - cornerLen, targetY);
        ctx.lineTo(targetX + boxW, targetY);
        ctx.lineTo(targetX + boxW, targetY + cornerLen);
        ctx.stroke();

        // AI Label tag
        const labelText = isAlert ? 'INTRUDER 96%' : `PERSON ${Math.round(camera.aiConfidence * 100)}%`;
        ctx.font = 'bold 9px ui-monospace, monospace';
        const textWidth = ctx.measureText(labelText).width;

        ctx.fillStyle = strokeColor;
        ctx.fillRect(targetX, targetY - 14, textWidth + 8, 14);

        ctx.fillStyle = '#000000';
        ctx.fillText(labelText, targetX + 4, targetY - 3);

        // Target 2: If checkpost or road, render vehicle
        if (camera.id === 'CHECKPOST-04' || camera.id === 'BORDER-ROAD-03') {
          const vProg = ((tick * 0.005) % 1);
          const vX = width * (0.85 - vProg * 0.6);
          const vY = height * 0.65;
          const vW = 65;
          const vH = 34;

          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(vX, vY, vW, vH);

          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(vX, vY - 13, 72, 13);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 8px ui-monospace, monospace';
          ctx.fillText('VEHICLE 92%', vX + 3, vY - 3);
        }
      }

      // 3. Electronic Scanline / Targeting Reticle Overlay
      const scanY = (tick * 1.5) % height;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.fillRect(0, scanY, width, 2);

      // Central crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10, height / 2);
      ctx.lineTo(width / 2 + 10, height / 2);
      ctx.moveTo(width / 2, height / 2 - 10);
      ctx.lineTo(width / 2, height / 2 + 10);
      ctx.stroke();

      animId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => cancelAnimationFrame(animId);
  }, [camera]);

  const handleSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-slate-950 border transition-all duration-300 ${
        camera.status === 'ALERT'
          ? 'border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
          : camera.status === 'WARNING'
          ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
          : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]'
      }`}
    >
      {/* Top OSD Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs z-10 relative">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              camera.status === 'ALERT'
                ? 'bg-rose-500 animate-ping'
                : camera.status === 'WARNING'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-bold tracking-wider text-slate-200 font-mono-numbers">
            {camera.id}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-[150px]">
            {camera.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-cyan-400 border border-cyan-800/40">
            {camera.type.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/50">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            LIVE
          </div>
        </div>
      </div>

      {/* Simulated Live Video Screen */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={225}
          className="w-full h-full object-cover block"
        />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 cctv-scanline opacity-70" />

        {/* Video HUD Telemetry Overlays */}
        <div className="absolute top-2 left-2 pointer-events-none text-[10px] font-mono-numbers text-cyan-400/90 drop-shadow-md space-y-0.5">
          <div className="bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm border border-cyan-500/20">
            LOC: {camera.location}
          </div>
          <div className="bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm border border-cyan-500/20">
            FPS: {camera.fps} | {camera.resolution.split(' ')[0]}
          </div>
        </div>

        <div className="absolute top-2 right-2 pointer-events-none text-[10px] font-mono-numbers text-right drop-shadow-md space-y-0.5">
          <div className="bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm text-emerald-400 border border-emerald-500/20">
            {currentTime || '00:00:00 IST'}
          </div>
          {camera.aiEnabled && (
            <div className="bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm text-cyan-300 border border-cyan-500/20 flex items-center justify-end gap-1">
              <Scan className="w-2.5 h-2.5" /> AI: {Math.round(camera.aiConfidence * 100)}% CONF
            </div>
          )}
        </div>

        {/* Alert Banner inside feed if critical */}
        {camera.status === 'ALERT' && (
          <div className="absolute inset-x-0 bottom-0 bg-rose-600/90 text-white text-[11px] font-bold px-2 py-1 flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> VIRTUAL FENCE BREACH TRIGGERED
            </span>
            <span className="text-[9px] bg-rose-950 px-1 rounded">SEV: CRITICAL</span>
          </div>
        )}

        {/* Snapshot Flash notification */}
        {snapshotTaken && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center transition-opacity">
            <span className="px-3 py-1.5 bg-black/80 rounded-lg text-cyan-300 text-xs font-bold border border-cyan-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> FRAME CAPTURED
            </span>
          </div>
        )}
      </div>

      {/* Bottom Camera Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-[10px] text-slate-400">OBJECTS:</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold font-mono-numbers text-[10px]">
            {camera.detectedCount} DETECTED
          </span>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1">
          {/* Toggle IR/Thermal Mode */}
          <button
            onClick={() => toggleCameraIR(camera.id)}
            className={`p-1.5 rounded transition-colors ${
              camera.irMode
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={camera.irMode ? 'Switch to Optical Mode' : 'Switch to Thermal IR Mode'}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleSnapshot}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Capture Video Snapshot"
          >
            <CameraIcon className="w-3.5 h-3.5" />
          </button>

          {/* Quick Alert Trigger */}
          <button
            onClick={() => triggerSimulatedBreach(camera.id)}
            className="p-1.5 rounded text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
            title="Simulate Breach on this Camera"
          >
            <AlertCircle className="w-3.5 h-3.5" />
          </button>

          {/* Inspect / Fullscreen */}
          <button
            onClick={() => onOpenDetails(camera)}
            className="p-1.5 rounded text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/60 border border-cyan-500/30 transition-colors flex items-center gap-1 text-[11px] font-medium"
            title="Open Deep Camera Telemetry"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Inspect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
