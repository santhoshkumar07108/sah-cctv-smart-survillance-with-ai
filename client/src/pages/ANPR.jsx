// client/src/pages/ANPR.jsx
import React, { useState } from 'react';
import { Car, Plus, Trash2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

function HsrpBadge({ plateNumber }) {
  return (
    <div className="inline-flex items-center bg-[#F8FAFC] border-2 border-[#1E293B] rounded-[3px] shadow-sm overflow-hidden select-none">
      <div className="bg-[#0038A8] text-white px-1.5 py-0.5 flex flex-col items-center justify-center border-r border-[#CBD5E1]">
        <div className="w-2.5 h-2.5 rounded-full border border-white/80 flex items-center justify-center mb-0.5">
          <div className="w-1 h-1 rounded-full bg-white/90" />
        </div>
        <span className="text-[9px] font-black tracking-tighter leading-none font-mono">
          IND
        </span>
      </div>

      <div className="px-2.5 py-0.5 flex items-center gap-1.5 bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9]">
        <div className="w-2 h-2 rounded-[1px] bg-gradient-to-br from-amber-300 via-cyan-300 to-emerald-400 opacity-80 border border-slate-400/40" />
        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#0A0E1A]">
          {plateNumber}
        </span>
      </div>
    </div>
  );
}

export default function ANPR({
  plates = [],
  watchlist = [
    { plateNumber: 'WB 02 KL 5678', category: 'Suspect', reason: 'Cross-border contraband intel' },
    { plateNumber: 'AS 01 BF 4432', category: 'Suspect', reason: 'Tax checkpoint evasion' },
    { plateNumber: 'DL 08 CZ 5566', category: 'Suspect', reason: 'Unregistered drone launch sighting' },
  ],
  onAddWatchlist,
  onRemoveWatchlist,
}) {
  const [newPlate, setNewPlate] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    if (onAddWatchlist) {
      onAddWatchlist({
        plateNumber: newPlate.toUpperCase(),
        category: 'Suspect',
        reason: newReason || 'Intelligence Watchlist Entry',
      });
    }
    setNewPlate('');
    setNewReason('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Live ANPR Detections Stream */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
              LIVE ANPR PLATE RECOGNITION STREAM (HSRP)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00C853] animate-pulse">
            ● 20s CAPTURE CYCLE ACTIVE
          </span>
        </div>

        <div className="space-y-2">
          {plates.length > 0 ? (
            plates.map((item, idx) => (
              <div
                key={idx}
                className={p-3 rounded bg-[#111827] border  flex flex-wrap items-center justify-between gap-3}
              >
                <div className="flex items-center gap-3">
                  <HsrpBadge plateNumber={item.plateNumber} />
                  <div>
                    <span className="font-mono text-xs text-[#E2E8F0] font-bold block">
                      {item.vehicleType || 'Motor Vehicle'}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      COLOR: {item.vehicleColor || 'Standard'} • CAM: {item.camera}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {item.isWatchlistHit ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4444] text-white border border-[#FF4444] animate-bounce inline-block">
                      WATCHLIST HIT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30">
                      VERIFIED
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#64748B] block mt-1">
                    {item.timestamp || 'Just now'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded bg-[#111827] border border-[#1E3A5F] text-[#64748B] font-mono text-xs">
              Awaiting next automated ANPR checkpoint capture...
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Management */}
      <div className="space-y-3">
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-3">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
            ADD TARGET TO WATCHLIST
          </h4>
          <form onSubmit={handleAdd} className="space-y-2 font-mono text-xs">
            <input
              type="text"
              placeholder="e.g. WB 02 KL 5678"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value)}
              className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1.5 text-[#E2E8F0] focus:border-[#00E5FF] outline-none"
            />
            <input
              type="text"
              placeholder="Reason for surveillance..."
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full bg-[#05080E] border border-[#1E3A5F] rounded px-2.5 py-1.5 text-[#E2E8F0] focus:border-[#00E5FF] outline-none"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 rounded font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              FLAG VEHICLE
            </button>
          </form>
        </div>

        {/* Current Watchlist */}
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0]">
            ACTIVE WATCHLIST DOSSIERS ({watchlist.length})
          </h4>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {watchlist.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[#05080E] border border-[#1E3A5F] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-[#FF4444]">
                    {item.plateNumber}
                  </span>
                  <p className="text-[10px] text-[#64748B]">{item.reason}</p>
                </div>
                {onRemoveWatchlist && (
                  <button
                    onClick={() => onRemoveWatchlist(item.plateNumber)}
                    className="p-1 text-[#64748B] hover:text-[#FF4444] transition-colors"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
