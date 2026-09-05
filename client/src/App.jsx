// client/src/App.jsx
import React, { useState, useMemo } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import AlertCard from './components/AlertCard';

import CommandOverview from './pages/CommandOverview';
import LiveFeeds from './pages/LiveFeeds';
import AlertsLog from './pages/AlertsLog';
import ANPR from './pages/ANPR';
import FaceRecognition from './pages/FaceRecognition';
import DroneManagement from './pages/DroneManagement';
import BlockchainAudit from './pages/BlockchainAudit';
import SystemStatus from './pages/SystemStatus';

import { useSocket } from './hooks/useSocket';
import { useBlockchain } from './hooks/useBlockchain';
import { useWeather } from './hooks/useWeather';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const {
    isConnected,
    connectionStatus,
    alerts,
    drones,
    flightLogs,
    systemHealth,
    cameraStatuses,
    plates,
    recentAlertPings,
    dispatchDrone,
    acknowledgeAlert,
    triggerManualAlert,
  } = useSocket();

  const { weatherData } = useWeather();
  const { blocks, addBlock, exportChainJson } = useBlockchain();

  const [watchlist, setWatchlist] = useState([
    { plateNumber: 'WB 02 KL 5678', category: 'Suspect', reason: 'Cross-border contraband intel' },
    { plateNumber: 'AS 01 BF 4432', category: 'Suspect', reason: 'Tax checkpoint evasion' },
    { plateNumber: 'DL 08 CZ 5566', category: 'Suspect', reason: 'Unregistered drone launch sighting' },
  ]);

  const handleAcknowledge = async (alertId) => {
    acknowledgeAlert(alertId);
    await addBlock({
      eventType: 'ALERT_ACKNOWLEDGED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: { alertId, action: 'CONFIRMED' },
    });
  };

  const handleDispatch = async (droneId, coords) => {
    dispatchDrone(droneId, coords);
    await addBlock({
      eventType: 'DRONE_DISPATCHED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: { droneId, coords },
    });
  };

  const handleAddWatchlist = async (entry) => {
    setWatchlist((prev) => [entry, ...prev]);
    await addBlock({
      eventType: 'WATCHLIST_UPDATED',
      operatorId: 'OP-8942 (Insp. V. Singh)',
      data: entry,
    });
  };

  const handleRemoveWatchlist = (plateNumber) => {
    setWatchlist((prev) => prev.filter((item) => item.plateNumber !== plateNumber));
  };

  const unacknowledgedAlerts = useMemo(
    () => alerts.filter((a) => a.status === 'UNACKNOWLEDGED'),
    [alerts]
  );

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#E2E8F0] flex flex-col font-sans">
      <TopBar
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        activeAlertCount={unacknowledgedAlerts.length}
        onTriggerAlert={() =>
          triggerManualAlert({
            type: 'MANUAL_INCURSION',
            confidence: 94,
            severity: 'HIGH',
            cameraId: 'CAM-001',
            zone: 'Charlie',
            description: 'Manual operator alert triggered for emergency perimeter drill',
            coordinates: { lat: 23.017, lon: 88.917 },
          })
        }
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
          alertCount={unacknowledgedAlerts.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {activeTab === 'overview' && (
            <CommandOverview
              alerts={alerts}
              drones={drones}
              weather={weatherData}
              systemHealth={systemHealth}
              recentAlertPings={recentAlertPings}
              onAcknowledgeAlert={handleAcknowledge}
              onDispatchDrone={handleDispatch}
            />
          )}

          {activeTab === 'feeds' && (
            <LiveFeeds cameraStatuses={cameraStatuses} alerts={alerts} />
          )}

          {activeTab === 'alerts' && (
            <AlertsLog
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledge}
              onDispatchDrone={handleDispatch}
            />
          )}

          {activeTab === 'anpr' && (
            <ANPR
              plates={plates}
              watchlist={watchlist}
              onAddWatchlist={handleAddWatchlist}
              onRemoveWatchlist={handleRemoveWatchlist}
            />
          )}

          {activeTab === 'faces' && <FaceRecognition />}

          {activeTab === 'drone' && (
            <DroneManagement
              drones={drones}
              flightLogs={flightLogs}
              weather={weatherData}
              onDispatchDrone={handleDispatch}
            />
          )}

          {activeTab === 'blockchain' && (
            <BlockchainAudit blocks={blocks} onExportJson={exportChainJson} />
          )}

          {activeTab === 'status' && (
            <SystemStatus systemHealth={systemHealth} />
          )}
        </main>

        {/* Right Live Alert Stream Panel (Collapsible) */}
        {isRightPanelOpen && (
          <aside className="w-80 border-l border-[#1E3A5F] bg-[#0A0E1A] p-3 hidden xl:flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F] mb-3">
                <span className="font-mono text-xs font-bold text-[#E2E8F0] tracking-wider">
                  REAL-TIME ALERTS FEED
                </span>
                <span className="text-[10px] font-mono text-[#FF4444] bg-[#FF4444]/15 px-2 py-0.5 rounded border border-[#FF4444]/30">
                  {unacknowledgedAlerts.length} PENDING
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {alerts.slice(0, 8).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledge}
                    onDispatchDrone={handleDispatch}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E3A5F] text-[10px] font-mono text-[#64748B] flex items-center justify-between">
              <span>SOCKET: {connectionStatus}</span>
              <span className="text-[#00C853]">AES-256 SECURED</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
