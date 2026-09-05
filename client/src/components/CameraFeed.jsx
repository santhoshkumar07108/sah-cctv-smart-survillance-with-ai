// client/src/components/CameraFeed.jsx
import React from 'react';
import { Video, Maximize2, ShieldAlert, Radio } from 'lucide-react';

export default function CameraFeed({
  camera,
  isAlerting = false,
  activeAlert = null,
  onInspect,
}) {
  return (
    <div
      className={elative rounded-lg overflow-hidden bg-[#05080E] border transition-all duration-300 group }
    >
      {/* Top Feed Overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] text-[#E2E8F0]">
          <span
            className={w-2 h-2 rounded-full }
          />
          <span className="font-bold text-[#00E5FF]">{camera.id}</span>
          <span className="text-[#64748B]">|</span>
          <span className="truncate max-w-[120px]">{camera.location}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="px-1.5 py-0.5 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] text-[#00E5FF]">
            {camera.fps ? camera.fps.toFixed(1) : '30.0'} FPS
          </div>
          {onInspect && (
            <button
              onClick={() => onInspect(camera)}
              className="pointer-events-auto p-1 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] hover:border-[#00E5FF] text-[#E2E8F0] hover:text-[#00E5FF] transition-colors"
              title="Fullscreen Stream"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Video / Tactical Scan Area */}
      <div className="relative aspect-video w-full bg-[#070D18] flex items-center justify-center overflow-hidden">
        {/* Tactical Crosshair Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E3A5F15_1px,transparent_1px),linear-gradient(to_bottom,#1E3A5F15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Scanlines Effect */}
        <div className="scanlines absolute inset-0 pointer-events-none opacity-40" />

        {/* Thermal / Visual Sensor Placeholder Graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center text-[#64748B] group-hover:text-[#00E5FF]/70 transition-colors select-none">
          <Radio className="w-8 h-8 mb-1 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider">
            {camera.aiModel || 'YOLOv9-Edge'} • RTSP LIVE
          </span>
        </div>

        {/* Dynamic Bounding Box Overlay if camera is alerting */}
        {isAlerting && (
          <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-[#FF4444] bg-[#FF4444]/10 rounded z-10 pointer-events-none flex flex-col justify-between p-1">
            <div className="flex items-center justify-between">
              <span className="bg-[#FF4444] text-white text-[9px] font-mono px-1 font-bold rounded-xs">
                {activeAlert ? activeAlert.type : 'TARGET DETECTED'}
              </span>
              <span className="text-[9px] font-mono text-[#FF4444] font-bold bg-[#0A0E1A]/80 px-1">
                {activeAlert ? ${activeAlert.confidence}% : '88.4%'}
              </span>
            </div>
            <div className="w-full text-right text-[8px] font-mono text-white/70">
              TRK-ID: #9948
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="p-2 bg-[#0A0E1A] border-t border-[#1E3A5F] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span>RES: {camera.resolution || '1080p 60FPS'}</span>
        <span className="text-[#00C853]">UPTIME: {camera.uptime || '99.9%'}</span>
      </div>
    </div>
  );
}
