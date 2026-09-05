// client/src/hooks/useBlockchain.js
import { useState, useCallback } from 'react';

export async function generateSha256(data) {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return '0x' + Math.random().toString(16).substring(2, 10);
  }
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useBlockchain(initialBlocks = []) {
  const [blocks, setBlocks] = useState(
    initialBlocks.length > 0
      ? initialBlocks
      : [
          {
            blockNumber: 104895,
            previousHash: '0x89b14c9e33df71aa55bc101032e28f1189ac02',
            currentHash: '0x3f8a2c7b91de04f128ab88c091d19ee12049ba3',
            timestamp: '19:30:15 IST',
            eventType: 'ALERT_ACKNOWLEDGED',
            operatorId: 'OP-8942 (Insp. V. Singh)',
            data: { alertId: 'ALT-8890', action: 'PATROL_DISPATCHED' },
            verified: true,
          },
          {
            blockNumber: 104894,
            previousHash: '0x5c421f66da1098bc4301feaa8871bd0042f9a1',
            currentHash: '0x89b14c9e33df71aa55bc101032e28f1189ac02',
            timestamp: '19:15:00 IST',
            eventType: 'WATCHLIST_UPDATED',
            operatorId: 'OP-8942 (Insp. V. Singh)',
            data: { plateNumber: 'WB 02 KL 5678', category: 'Suspect' },
            verified: true,
          },
          {
            blockNumber: 104893,
            previousHash: '0xa177bd09e51244fa8899cc3340f1a944882bc1',
            currentHash: '0x5c421f66da1098bc4301feaa8871bd0042f9a1',
            timestamp: '18:45:22 IST',
            eventType: 'DRONE_DISPATCHED',
            operatorId: 'SYSTEM_AUTONOMOUS',
            data: { droneId: 'DRONE-1', alertId: 'ALT-8884' },
            verified: true,
          },
        ]
  );

  const addBlock = useCallback(
    async ({ eventType, operatorId, data }) => {
      const prevBlock = blocks[0];
      const newBlockNumber = prevBlock ? prevBlock.blockNumber + 1 : 100000;
      const prevHash = prevBlock ? prevBlock.currentHash : '0x0000000000000000000000000000000000000000';
      const timestamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';

      const hashInput = ${newBlockNumber}---;
      const currentHash = await generateSha256(hashInput);

      const newBlock = {
        blockNumber: newBlockNumber,
        previousHash: prevHash,
        currentHash,
        timestamp,
        eventType,
        operatorId: operatorId || 'OP-8942 (Insp. V. Singh)',
        data,
        verified: true,
      };

      setBlocks((prev) => [newBlock, ...prev]);
      return newBlock;
    },
    [blocks]
  );

  const exportChainJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(blocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', ibvap_blockchain_ledger_.json);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [blocks]);

  return { blocks, addBlock, exportChainJson };
}
