'use client';

import React from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Cpu,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Flame,
  ShieldCheck,
} from 'lucide-react';

export default function ModelsPage() {
  const { models, updateModelThreshold } = useDemoSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              AI Vision & Neural Model Fleet
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              8 ACTIVE ENGINES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            TensorRT accelerated neural models running on edge edge-compute nodes with configurable confidence thresholds.
          </p>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-cyan-400 font-mono-numbers">{model.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {model.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{model.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{model.description}</p>
            </div>

            <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs font-mono-numbers">
              <div className="flex justify-between">
                <span className="text-slate-500">Framework / Vers:</span>
                <span className="text-slate-300">{model.version}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Accuracy Score:</span>
                <span className="text-emerald-400 font-bold">{model.accuracy}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Inference Throughput:</span>
                <span className="text-cyan-300 font-bold">{model.inferenceFps} FPS</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Pipeline Latency:</span>
                <span className="text-slate-300">{model.latencyMs} ms</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">VRAM Allocation:</span>
                <span className="text-slate-300">{model.gpuMemoryMb} MB</span>
              </div>

              {/* Adjustable Confidence Slider */}
              <div className="pt-2 border-t border-slate-900 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">Confidence Threshold:</span>
                  <span className="text-cyan-300 font-bold">{model.confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={model.confidenceThreshold}
                  onChange={(e) => updateModelThreshold(model.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
