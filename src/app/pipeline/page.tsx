'use client';

import React, { useState } from 'react';
import {
  Camera,
  Radio,
  Layers,
  Scan,
  GitBranch,
  Car,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Monitor,
  CheckCircle2,
  ArrowDown,
  Cpu,
  Sparkles,
  Zap,
} from 'lucide-react';

interface PipelineStage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  latency: string;
  description: string;
  techStack: string[];
  outputType: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    title: 'IP CCTV Camera Hardware',
    subtitle: 'Existing legacy & modern camera infrastructure',
    icon: Camera,
    color: '#00f0ff',
    badge: 'INGESTION',
    latency: '0 ms',
    description: 'Hardware-agnostic integration utilizing existing ONVIF & RTSP border cameras, thermal imagers, and PTZ optical towers without requiring hardware replacement.',
    techStack: ['ONVIF Profile S/G/T', 'RTSP/H.264/H.265', '4K / 1080p Streams'],
    outputType: 'Compressed Raw Video Stream',
  },
  {
    id: 2,
    title: 'Video Stream Demuxing',
    subtitle: 'Ultra-low latency packet ingestion',
    icon: Radio,
    color: '#38bdf8',
    badge: 'TRANSPORT',
    latency: '4.2 ms',
    description: 'Hardware-accelerated video decoding utilizing NVIDIA DeepStream SDK and FFmpeg pipelines to decompress multi-channel RTSP streams at sub-5ms latency.',
    techStack: ['NVIDIA DeepStream SDK', 'NVDEC Hardware Accelerators', 'FFmpeg H.265'],
    outputType: 'Demuxed RGB/NV12 Frame Buffer',
  },
  {
    id: 3,
    title: 'Frame Pre-Processing & Enhancement',
    subtitle: 'Thermal calibration & low-lux contrast normalization',
    icon: Layers,
    color: '#818cf8',
    badge: 'NORMALIZATION',
    latency: '3.1 ms',
    description: 'Dynamic CLAHE contrast enhancement, atmospheric haze penetration, and thermal false-color normalization to reveal covert movements in pitch-black terrain.',
    techStack: ['OpenCV CUDA', 'CLAHE Dehazing', 'Adaptive Gamma Correction'],
    outputType: 'Normalized Tensor [B, C, H, W]',
  },
  {
    id: 4,
    title: 'AI Primary Object Detection',
    subtitle: 'Simultaneous multi-class spatial localization',
    icon: Scan,
    color: '#00f0ff',
    badge: 'INFERENCE',
    latency: '11.8 ms',
    description: 'TensorRT-optimized YOLOv10x convolutional backbone outputting spatial bounding boxes for persons, vehicles, trucks, motorcycles, and wildlife simultaneously.',
    techStack: ['YOLOv10x FP16', 'TensorRT 10.0', 'CUDA Core Execution'],
    outputType: 'Bounding Boxes & Class Probabilities',
  },
  {
    id: 5,
    title: 'Persistent Object Tracking',
    subtitle: 'Occlusion-resistant multi-target association',
    icon: GitBranch,
    color: '#a855f7',
    badge: 'ASSOCIATION',
    latency: '2.5 ms',
    description: 'DeepSORT and ByteTrack Kalman filter state estimation preserving unique Track IDs across camera handoffs, foliage occlusions, and terrain depressions.',
    techStack: ['DeepSORT ReID', 'ByteTrack Association', 'Kalman State Filtering'],
    outputType: 'Unique Persistent Track Vectors',
  },
  {
    id: 6,
    title: 'ANPR & Facial Biometric Extraction',
    subtitle: 'Specialized deep feature networks',
    icon: Car,
    color: '#ec4899',
    badge: 'BIOMETRICS & OCR',
    latency: '12.4 ms',
    description: 'Dual secondary networks: DeepPlate OCR segmenting license plates, alongside ArcFace generating 512-dimensional facial biometric embedding vectors.',
    techStack: ['ArcFace 512-D', 'DeepPlate OCR', 'Faiss Vector Search'],
    outputType: 'Plate Strings & Biometric Matches',
  },
  {
    id: 7,
    title: 'Spatiotemporal Behavior Analysis',
    subtitle: 'Trajectory anomaly & movement classification',
    icon: Compass,
    color: '#f59e0b',
    badge: 'BEHAVIOR',
    latency: '5.2 ms',
    description: 'Graph Convolutional Networks and LSTM models analyzing movement velocity, perimeter loitering duration, restricted-zone pacing, and crowd formation.',
    techStack: ['ST-GCN Pose Graph', 'LSTM Sequence Model', 'Speed & Heading Vectors'],
    outputType: 'Behavior Class (Loitering, Sprinting)',
  },
  {
    id: 8,
    title: 'Event Classification & Tripwire Logic',
    subtitle: 'Geometric vector polygon boundary intersection',
    icon: AlertTriangle,
    color: '#f97316',
    badge: 'SPATIAL LOGIC',
    latency: '1.8 ms',
    description: 'High-speed computational geometry calculating real-time boundary polygon intersection with virtual fence lines to detect physical crossings immediately.',
    techStack: ['Ray Casting Polygon Logic', 'Spatial R-Tree Indexing', 'Directional Tripwires'],
    outputType: 'Breach State & Crossing Angle',
  },
  {
    id: 9,
    title: 'Alert Prioritization & Escalation Engine',
    subtitle: 'Heuristic deduplication & severity routing',
    icon: ShieldCheck,
    color: '#ef4444',
    badge: 'TRIAGE',
    latency: '2.0 ms',
    description: 'Intelligent rule engine deduplicating sensor chatter, ranking threat severity (Critical, High, Medium), and matching against sector Standard Operating Procedures (SOPs).',
    techStack: ['Rule-Based SOP Engine', 'Redis Threat Cache', 'WebSocket Event Broadcaster'],
    outputType: 'Enriched Security Alert Record',
  },
  {
    id: 10,
    title: 'Command Center Command & Control (C2)',
    subtitle: 'Single-pane-of-glass operator interface',
    icon: Monitor,
    color: '#10b981',
    badge: 'OPERATOR HUD',
    latency: 'Instant',
    description: 'Responsive Next.js web application rendering live video streams, bounding box HUD overlays, tactical interactive map, and one-click incident forensics.',
    techStack: ['React / Next.js', 'Tailwind CSS', 'Web Audio API', 'REST & WebSocket HUD'],
    outputType: 'Human Operator Action & Dispatch',
  },
];

export default function PipelinePage() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              End-to-End AI Architecture Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono-numbers">
              SUB-50ms TOTAL LATENCY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Software-only transformation pipeline converting existing IP CCTV into an autonomous neural border surveillance network.
          </p>
        </div>
      </div>

      {/* Interactive Pipeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 10 Stages Sequential Flow */}
        <div className="lg:col-span-2 space-y-2.5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage.id === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border"
                      style={{
                        backgroundColor: `${stage.color}15`,
                        borderColor: `${stage.color}50`,
                        color: stage.color,
                      }}
                    >
                      {stage.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                          {stage.title}
                        </h4>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-mono-numbers"
                          style={{
                            backgroundColor: `${stage.color}20`,
                            color: stage.color,
                          }}
                        >
                          {stage.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[280px] sm:max-w-md">
                        {stage.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono-numbers text-xs shrink-0">
                    <span className="text-emerald-400 font-bold">{stage.latency}</span>
                    <span className="text-[10px] text-slate-500 block">Stage Latency</span>
                  </div>
                </div>

                {/* Animated Arrow Connector */}
                {idx < PIPELINE_STAGES.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-cyan-500/50 to-indigo-500/50" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Col: Deep Inspection Inspector */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4 lg:sticky lg:top-20 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-400 uppercase font-mono-numbers">
              STAGE {selectedStage.id} SPECIFICATION
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono-numbers">
              {selectedStage.latency} LATENCY
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100">{selectedStage.title}</h3>
            <p className="text-xs text-slate-400">{selectedStage.subtitle}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {selectedStage.description}
          </p>

          <div className="space-y-2 text-xs font-mono-numbers">
            <div className="text-slate-400 uppercase font-bold text-[10px]">
              Technology & Frameworks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedStage.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono-numbers border-t border-slate-800 pt-3">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Downstream Output</div>
            <div className="text-emerald-400 font-bold">{selectedStage.outputType}</div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Hackathon Value Proposition
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Zero additional capital expenditure on camera hardware. Scales seamlessly from 6 prototype cameras to 5,000+ national border checkpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
