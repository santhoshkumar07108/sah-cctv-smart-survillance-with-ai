// client/src/pages/BlockchainAudit.jsx
import React from 'react';
import BlockchainLog from '../components/BlockchainLog';
import { Lock, ShieldCheck, Download, Database } from 'lucide-react';

export default function BlockchainAudit({
  blocks = [],
  onExportJson,
}) {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
              CRYPTO-AUDIT LEDGER INTEGRITY ENGINE
            </h3>
          </div>
          <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
            Every critical alert acknowledgement, watchlist mutation, and drone launch is cryptographically hashed with SHA-256 and chained into an immutable audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/40 text-xs font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            ZERO TAMPER DETECTED
          </span>
          {onExportJson && (
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] border border-[#00E5FF]/40 rounded text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD CHAIN (.JSON)
            </button>
          )}
        </div>
      </div>

      {/* Blocks List */}
      <BlockchainLog blocks={blocks} onExportJson={onExportJson} />
    </div>
  );
}
