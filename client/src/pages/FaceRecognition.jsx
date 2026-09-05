// client/src/pages/FaceRecognition.jsx
import React from 'react';
import { Users, ShieldAlert, Crosshair, CheckCircle2, UserCheck } from 'lucide-react';

const BIOMETRIC_MATCHES = [
  { id: 'BIO-901', name: 'Suspect Ref #892', matchConfidence: 94.2, camera: 'CAM-001 Petrapole', timestamp: '19:28:44 IST', status: 'MATCH_CONFIRMED', notes: 'Counterfeit currency smuggling syndicate dossier' },
  { id: 'BIO-902', name: 'Unknown Subject', matchConfidence: 41.5, camera: 'CAM-003 Changrabandha', timestamp: '19:15:10 IST', status: 'LOW_CONFIDENCE', notes: 'Buffer zone pedestrian crossing' },
  { id: 'BIO-903', name: 'BOP Liaison Officer', matchConfidence: 98.8, camera: 'CAM-012 Panitanki Gate', timestamp: '19:04:22 IST', status: 'AUTHORIZED_PERSONNEL', notes: 'SSB Field Intelligence Unit personnel' },
];

const WATCHLIST_PERSONS = [
  { name: 'Rafiqul Islam', alias: 'Chhota Babu', threatLevel: 'CRITICAL', nationality: 'Cross-Border Smuggler', lastSeen: 'Petrapole border area' },
  { name: 'Sunil Karmakar', alias: 'Pilot', threatLevel: 'HIGH', nationality: 'Unlicensed Drone Courier', lastSeen: 'Mechi river sandbanks' },
  { name: 'Manish Gurung', alias: 'Siliguri Fox', threatLevel: 'MEDIUM', nationality: 'Border Tax Evader', lastSeen: 'Panitanki Checkpoint' },
];

export default function FaceRecognition() {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
            AI BIOMETRIC FACIAL MATCHING & SURVEILLANCE
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
          ENGINE: FaceID-Military-v2 • 512-D EMBEDDINGS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Matches Stream */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
            RECENT FACIAL MATCH DETECTIONS
          </h4>

          <div className="space-y-2.5">
            {BIOMETRIC_MATCHES.map((item) => {
              const isHighMatch = item.matchConfidence >= 85;
              return (
                <div
                  key={item.id}
                  className={p-3 rounded bg-[#111827] border  flex flex-wrap items-center justify-between gap-3}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#05080E] border border-[#1E3A5F] flex items-center justify-center text-[#00E5FF]">
                      <Crosshair className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#E2E8F0] block">
                        {item.name}
                      </span>
                      <p className="text-[10px] text-[#64748B] font-mono">
                        {item.notes}
                      </p>
                      <span className="text-[10px] text-[#00E5FF] font-mono block mt-0.5">
                        {item.camera} • {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs font-mono text-[#64748B]">MATCH:</span>
                      <span
                        className={	ext-sm font-bold font-mono }
                      >
                        {item.matchConfidence}%
                      </span>
                    </div>
                    <div className="w-24 bg-[#05080E] h-1.5 rounded-full overflow-hidden border border-[#1E3A5F] mt-1 ml-auto">
                      <div
                        className={h-full }
                        style={{ width: ${item.matchConfidence}% }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watchlist Dossiers */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
            BORDER SURVEILLANCE TARGETS
          </h4>

          <div className="space-y-2.5">
            {WATCHLIST_PERSONS.map((target, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-[#111827] border border-[#1E3A5F] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E2E8F0]">{target.name}</span>
                  <span
                    className={px-1.5 py-0.2 rounded text-[10px] }
                  >
                    {target.threatLevel}
                  </span>
                </div>
                <p className="text-[11px] text-[#00E5FF]">ALIAS: {target.alias}</p>
                <p className="text-[10px] text-[#64748B]">
                  PROFILE: {target.nationality}
                </p>
                <p className="text-[10px] text-[#64748B]">
                  LAST SEEN: {target.lastSeen}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
