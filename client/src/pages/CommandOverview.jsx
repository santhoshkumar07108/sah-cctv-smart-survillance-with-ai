// client/src/pages/CommandOverview.jsx
import React from 'react';
import {
  ShieldAlert,
  Radio,
  Eye,
  Send,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import MapView from '../components/MapView';
import WeatherWidget from '../components/WeatherWidget';
import AlertCard from '../components/AlertCard';

const SEVERITY_COLORS = {
  HIGH: '#FF4444',
  MEDIUM: '#F59E0B',
  LOW: '#00E5FF',
};

const HOURLY_DATA = [
  { hour: '08:00', count: 2 },
  { hour: '09:00', count: 4 },
  { hour: '10:00', count: 3 },
  { hour: '11:00', count: 6 },
  { hour: '12:00', count: 5 },
  { hour: '13:00', count: 8 },
  { hour: '14:00', count: 4 },
  { hour: '15:00', count: 7 },
  { hour: '16:00', count: 9 },
  { hour: '17:00', count: 12 },
  { hour: '18:00', count: 15 },
  { hour: '19:00', count: 11 },
];

export default function CommandOverview({
  alerts = [],
  drones = [],
  weather = [],
  systemHealth,
  recentAlertPings = [],
  onAcknowledgeAlert,
  onDispatchDrone,
}) {
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const medCount = alerts.filter((a) => a.severity === 'MEDIUM').length;
  const lowCount = alerts.filter((a) => a.severity === 'LOW').length;

  const severityPieData = [
    { name: 'HIGH', value: highCount || 4, color: '#FF4444' },
    { name: 'MEDIUM', value: medCount || 8, color: '#F59E0B' },
    { name: 'LOW', value: lowCount || 12, color: '#00E5FF' },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F]">
          <span className="text-[10px] font-mono text-[#64748B] block">ACTIVE ALERTS</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono text-[#FF4444]">
              {alerts.length}
            </span>
            <ShieldAlert className="w-4 h-4 text-[#FF4444]" />
          </div>
        </div>

        <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F]">
          <span className="text-[10px] font-mono text-[#64748B] block">DRONES AIRBORNE</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono text-[#00E5FF]">
              {drones.filter((d) => d.status !== 'STANDBY').length} / {drones.length || 4}
            </span>
            <Send className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </div>

        <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F]">
          <span className="text-[10px] font-mono text-[#64748B] block">CAMERAS ONLINE</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono text-[#00C853]">47 / 48</span>
            <Eye className="w-4 h-4 text-[#00C853]" />
          </div>
        </div>

        <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F]">
          <span className="text-[10px] font-mono text-[#64748B] block">SYSTEM LATENCY</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold font-mono text-[#E2E8F0]">
              {systemHealth ? ${systemHealth.latencyMs}ms : '38ms'}
            </span>
            <Activity className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </div>
      </div>

      {/* Real Map View */}
      <div className="p-3 rounded bg-[#111827] border border-[#1E3A5F] space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold text-[#E2E8F0] tracking-wider uppercase">
            LIVE TACTICAL BORDER GEOSPACE (INDO-BANGLADESH SECTOR)
          </h3>
          <span className="text-[10px] font-mono text-[#00E5FF]">
            REAL OPENSTREETMAP TILES • 48 OPTICAL / THERMAL NODES
          </span>
        </div>
        <MapView
          height="380px"
          drones={drones}
          activeAlertPings={recentAlertPings}
        />
      </div>

      {/* Real Weather API Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-mono text-xs font-bold text-[#E2E8F0] tracking-wider uppercase">
            BORDER WEATHER TELEMETRY (OPENWEATHERMAP LIVE)
          </h3>
          <span className="text-[10px] font-mono text-[#64748B]">
            REFRESH CYCLE: 10 MIN
          </span>
        </div>
        <WeatherWidget weatherData={weather} />
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Severity Donut */}
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F]">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0] mb-3">
            ALERT SEVERITY DISTRIBUTION
          </h4>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width=\"100%\" height=\"100%\">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx=\"50%\"
                  cy=\"50%\"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey=\"value\"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={cell-} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0A0E1A',
                    borderColor: '#1E3A5F',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs font-mono pt-2 border-t border-[#1E3A5F]/50">
            <span className="text-[#FF4444]">HIGH: {highCount}</span>
            <span className="text-[#F59E0B]">MED: {medCount}</span>
            <span className="text-[#00E5FF]">LOW: {lowCount}</span>
          </div>
        </div>

        {/* Hourly Incursion Frequency */}
        <div className="p-3.5 rounded bg-[#111827] border border-[#1E3A5F]">
          <h4 className="font-mono text-xs font-bold text-[#E2E8F0] mb-3">
            HOURLY INCURSION ACTIVITY (LAST 12 HOURS)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width=\"100%\" height=\"100%\">
              <LineChart data={HOURLY_DATA}>
                <XAxis
                  dataKey=\"hour\"
                  stroke=\"#64748B\"
                  fontSize={10}
                  fontFamily=\"monospace\"
                />
                <YAxis
                  stroke=\"#64748B\"
                  fontSize={10}
                  fontFamily=\"monospace\"
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0A0E1A',
                    borderColor: '#1E3A5F',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type=\"monotone\"
                  dataKey=\"count\"
                  stroke=\"#00E5FF\"
                  strokeWidth={2}
                  dot={{ fill: '#00E5FF', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-mono text-[#64748B] text-center pt-2 border-t border-[#1E3A5F]/50">
            Peak surveillance activity recorded around dusk & riverine crossings
          </p>
        </div>
      </div>
    </div>
  );
}
