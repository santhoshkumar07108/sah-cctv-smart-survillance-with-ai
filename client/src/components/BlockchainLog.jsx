// client/src/components/BlockchainLog.jsx
import React from 'react';
import { Lock, CheckCircle2, Download, ShieldCheck, Database } from 'lucide-react';

export default function BlockchainLog({
  blocks = [],
  onExportJson,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="font-mono text-sm font-bold text-[#E2E8F0]">
            IMMUTABLE AUDIT TRAIL LEDGER
          </h3>
        </div>
        {onExportJson && (
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CHAIN JSON
          </button>
        )}
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.blockNumber}
            className="p-3 rounded bg-[#111827] border border-[#1E3A5F] hover:border-[#00E5FF]/40 transition-all font-mono space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#00E5FF] font-bold">
                  BLOCK #{block.blockNumber}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                  {block.eventType}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#00C853] text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-[#64748B] pt-1 border-t border-[#1E3A5F]/50">
              <div>
                <span className="block text-[10px]">PREVIOUS HASH:</span>
                <span className="text-[#E2E8F0] select-all truncate block">
                  {block.previousHash}
                </span>
              </div>
              <div>
                <span className="block text-[10px]">CURRENT BLOCK HASH (SHA-256):</span>
                <span className="text-[#00E5FF] select-all truncate block font-bold">
                  {block.currentHash}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1">
              <span>OPERATOR: {block.operatorId}</span>
              <span>TIME: {block.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
