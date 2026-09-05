'use client';

import React, { useState } from 'react';
import { useDemoSimulation } from '@/context/DemoSimulationContext';
import {
  Users,
  ScanFace,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Database,
  Fingerprint,
  ShieldAlert,
  Cpu,
  Eye,
} from 'lucide-react';

export default function FacesPage() {
  const { faceRecords, cameras } = useDemoSimulation();
  const [selectedRecord, setSelectedRecord] = useState(faceRecords[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100 uppercase">
              Facial Biometrics & Watchlist Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-500/30 font-mono-numbers">
              ARCFACE 512-D
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            512-dimensional facial embedding extraction, cosine distance scoring, and watchlist biometric triage.
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-xs text-indigo-300 flex items-center justify-between">
        <span>
          ℹ️ <strong>Strict Privacy Notice</strong>: All identities, facial vectors, and threat classifications shown are <strong>COMPLETELY FICTIONAL SYNTHETIC DEMO DATA</strong> for hackathon prototype evaluation. No real personal identities are utilized.
        </span>
        <span className="px-2 py-0.5 rounded bg-indigo-900 text-[10px] font-bold uppercase font-mono-numbers">
          FICTIONAL DEMO IDENTITIES
        </span>
      </div>

      {/* 5-Step Visual Biometric Processing Pipeline */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> Live Neural Biometric Inference Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto text-xs font-bold">
              1
            </div>
            <div className="text-xs font-bold text-slate-100">Face Detected</div>
            <div className="text-[10px] text-slate-400">YOLO-Face / RetinaFace landmark alignment</div>
            <div className="text-[10px] text-emerald-400 font-mono-numbers">Confidence: 97.4%</div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto text-xs font-bold">
              2
            </div>
            <div className="text-xs font-bold text-slate-100">Feature Extraction</div>
            <div className="text-[10px] text-slate-400">512D deep embedding vector representation</div>
            <div className="text-[10px] text-cyan-300 font-mono-numbers">Latency: 14.8 ms</div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto text-xs font-bold">
              3
            </div>
            <div className="text-xs font-bold text-slate-100">Database Comparison</div>
            <div className="text-[10px] text-slate-400">Faiss vector search vs Watchlist index</div>
            <div className="text-[10px] text-purple-300 font-mono-numbers">Index: 10,000 Keys</div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xs font-bold">
              4
            </div>
            <div className="text-xs font-bold text-slate-100">Match Confidence</div>
            <div className="text-[10px] text-slate-400">Cosine distance metric calculation</div>
            <div className="text-[10px] text-amber-300 font-mono-numbers">Threshold: ≥ 85%</div>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center relative space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-xs font-bold">
              5
            </div>
            <div className="text-xs font-bold text-slate-100">Alert Escalation</div>
            <div className="text-[10px] text-slate-400">Operator notification & checkpoint freeze</div>
            <div className="text-[10px] text-rose-400 font-mono-numbers">Dispatched in 20ms</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Biometric History & Selected Face Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scans Table */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Recent Facial Detection Events
            </h3>
            <span className="text-xs text-slate-400 font-mono-numbers">{faceRecords.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-slate-900/90 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Face ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Camera</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Watchlist Match</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {faceRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`cursor-pointer transition-colors ${
                      selectedRecord.id === rec.id
                        ? 'bg-indigo-950/30 text-indigo-200'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-100">{rec.faceId}</td>
                    <td className="py-2.5 px-3 text-slate-400">{rec.timestamp}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{rec.camera}</td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      {Math.round(rec.confidence * 100)}%
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'WATCHLIST_MATCH'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            : rec.status === 'AUTHORIZED_PERSONNEL'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(rec);
                        }}
                        className="text-cyan-400 hover:underline text-[11px]"
                      >
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Biometric Dossier */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-400" /> Biometric Forensic Card
            </h3>
            <span className="text-xs font-mono-numbers text-slate-400">{selectedRecord.faceId}</span>
          </div>

          {/* Fictional portrait avatar */}
          <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-b from-indigo-950 to-slate-900 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 relative overflow-hidden shadow-inner">
            <ScanFace className="w-14 h-14" />
            <div className="absolute inset-0 border border-cyan-400/30 rounded-2xl animate-pulse" />
          </div>

          <div className="space-y-2 text-xs font-mono-numbers">
            {selectedRecord.matchedIdentity ? (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 space-y-1">
                <div className="text-[10px] text-rose-300 font-bold uppercase">MATCHED FICTIONAL DOSSIER</div>
                <div className="text-sm font-black text-slate-100">{selectedRecord.matchedIdentity.name}</div>
                <div className="text-[11px] text-rose-400">Class: {selectedRecord.matchedIdentity.threatClass}</div>
                <p className="text-[10px] text-slate-400 mt-1">{selectedRecord.matchedIdentity.fictionalNotice}</p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">CLASSIFICATION</div>
                <div className="text-xs font-bold text-slate-200">Unknown Subject (No Criminal Record Match)</div>
              </div>
            )}

            <div className="space-y-1 text-slate-400 pt-2">
              <div className="flex justify-between">
                <span>Vector Hash:</span>
                <span className="text-cyan-300">{selectedRecord.features.embeddings}</span>
              </div>
              <div className="flex justify-between">
                <span>Pose Pitch / Yaw:</span>
                <span className="text-slate-200">{selectedRecord.features.pitch}° / {selectedRecord.features.yaw}°</span>
              </div>
              <div className="flex justify-between">
                <span>Lighting Condition:</span>
                <span className="text-slate-200">{selectedRecord.features.lighting}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
