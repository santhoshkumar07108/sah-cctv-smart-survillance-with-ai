// client/src/components/CameraFeed.jsx
import React, { useState } from 'react';
import { Video, Maximize2, ShieldAlert, Radio, Globe, ExternalLink } from 'lucide-react';

export default function CameraFeed({
  camera,
  isAlerting = false,
  activeAlert = null,
  onInspect,
}) {
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const isEarthCam = camera.sourceProvider === 'EarthCam USA' || camera.zone === 'Global-USA';

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-[#05080E] border transition-all duration-300 group ${
        isAlerting
          ? 'border-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.4)]'
          : isEarthCam
          ? 'border-[#00E5FF]/50 hover:border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.15)]'
          : 'border-[#1E3A5F] hover:border-[#00E5FF]'
      }`}
    >
      {/* Top Feed Overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-none text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] text-[#E2E8F0]">
          <span
            className={`w-2 h-2 rounded-full ${
              isAlerting ? 'bg-[#FF4444] animate-ping' : isEarthCam ? 'bg-[#00E5FF]' : 'bg-[#00C853]'
            }`}
          />
          <span className="font-bold text-[#00E5FF]">{camera.id}</span>
          <span className="text-[#64748B]">|</span>
          <span className="truncate max-w-[130px]">{camera.location}</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {isEarthCam && (
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px]">
              EARTHCAM
            </span>
          )}
          <div className="px-1.5 py-0.5 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] text-[#00E5FF]">
            {camera.fps ? camera.fps.toFixed(1) : '30.0'} FPS
          </div>
          {onInspect && (
            <button
              onClick={() => onInspect(camera)}
              className="p-1 rounded bg-[#0A0E1A]/85 border border-[#1E3A5F] hover:border-[#00E5FF] text-[#E2E8F0] hover:text-[#00E5FF] transition-colors"
              title="Fullscreen Stream"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Video / Tactical Scan Area */}
      <div className="relative aspect-video w-full bg-[#070D18] flex items-center justify-center overflow-hidden">
        {/* Scanlines Effect */}
        <div className="scanlines absolute inset-0 pointer-events-none opacity-40 z-10" />

        {/* Tactical Corner Reticles */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#00E5FF]/40 pointer-events-none z-10" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00E5FF]/40 pointer-events-none z-10" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00E5FF]/40 pointer-events-none z-10" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#00E5FF]/40 pointer-events-none z-10" />

        {isEmbedMode && camera.earthCamUrl ? (
          <iframe
            src={camera.earthCamUrl}
            title={camera.location}
            className="w-full h-full border-0 relative z-0"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={camera.videoSrc || '/videos/cam-001.mp4'}
            className="w-full h-full object-cover"
          />
        )}

        {/* EarthCam USA Badge Overlay */}
        {isEarthCam && (
          <div className="absolute top-9 left-2.5 z-10 flex items-center gap-1.5 bg-[#0A0E1A]/85 border border-[#00E5FF]/40 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 pointer-events-none">
            <Globe className="w-3 h-3 text-[#00E5FF]" />
            <span className="font-bold">EARTHCAM 4K LIVE</span>
          </div>
        )}

        {/* Dynamic Bounding Box Overlay if camera is alerting */}
        {isAlerting && (
          <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-[#FF4444] bg-[#FF4444]/10 rounded z-10 pointer-events-none flex flex-col justify-between p-1">
            <div className="flex items-center justify-between">
              <span className="bg-[#FF4444] text-white text-[9px] font-mono px-1 font-bold rounded-xs">
                {activeAlert ? activeAlert.type : 'TARGET DETECTED'}
              </span>
              <span className="text-[9px] font-mono text-[#FF4444] font-bold bg-[#0A0E1A]/80 px-1">
                {activeAlert ? `${activeAlert.confidence}%` : '88.4%'}
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
        <div className="flex items-center gap-2">
          <span>{camera.aiModel || 'YOLOv9-Edge'}</span>
          <span>•</span>
          <span className="text-[#00C853]">UPTIME: {camera.uptime || '99.9%'}</span>
        </div>

        {camera.earthCamUrl && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEmbedMode(!isEmbedMode)}
              className="px-1.5 py-0.5 rounded bg-[#111827] text-[#00E5FF] border border-[#1E3A5F] hover:border-[#00E5FF] text-[9px]"
            >
              {isEmbedMode ? 'Video' : 'EarthCam'}
            </button>
            <a
              href={camera.earthCamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[#111827] text-[#64748B] hover:text-[#00E5FF]"
              title="Open in EarthCam"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
