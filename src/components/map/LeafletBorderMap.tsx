'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface MapCamera {
  id: string;
  name?: string;
  location?: string;
  lat: number;
  lon: number;
  zone: string;
  status: 'Online' | 'Offline' | 'Degraded';
  lastAlert?: string;
}


export interface MapDrone {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: string;
  battery: number;
  targetLat?: number | null;
  targetLon?: number | null;
}

export interface MapAlertPing {
  id: string;
  lat: number;
  lon: number;
  type: string;
  severity: string;
  time: string;
}

interface LeafletBorderMapProps {
  cameras?: MapCamera[];
  drones?: MapDrone[];
  activeAlertPings?: MapAlertPing[];
  onSelectCamera?: (cameraId: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

const DEFAULT_CAMERAS: MapCamera[] = [
  { id: 'CAM-001', name: 'Petrapole ICP Checkpoint', lat: 23.017, lon: 88.917, zone: 'Charlie', status: 'Online', lastAlert: 'Vehicle ANPR match' },
  { id: 'CAM-002', name: 'Hilli Border Outpost', lat: 25.283, lon: 89.000, zone: 'Bravo', status: 'Degraded', lastAlert: 'Low-light movement' },
  { id: 'CAM-003', name: 'Changrabandha Corridor', lat: 26.317, lon: 89.617, zone: 'Bravo', status: 'Online', lastAlert: 'Fence breach alert' },
  { id: 'CAM-004', name: 'Fulbari Riverine Sentry', lat: 26.550, lon: 88.733, zone: 'Alpha', status: 'Online', lastAlert: 'River boat detected' },
  { id: 'CAM-005', name: 'Ghojadanga Culvert Gate', lat: 22.900, lon: 88.783, zone: 'Delta', status: 'Online', lastAlert: 'Clear' },
];

// India-Bangladesh Border Zero Line polyline coordinates
const BORDER_FENCE_COORDINATES: [number, number][] = [
  [22.80, 88.70],
  [22.90, 88.783],
  [23.017, 88.917],
  [23.50, 88.75],
  [24.10, 88.60],
  [24.70, 88.35],
  [25.283, 89.00],
  [25.80, 89.15],
  [26.317, 89.617],
  [26.55, 88.733],
  [26.85, 88.85],
];

export default function LeafletBorderMap({
  cameras = DEFAULT_CAMERAS,
  drones = [],
  activeAlertPings = [],
  onSelectCamera,
  height = '420px',
  center = [24.5, 88.5],
  zoom = 8,
}: LeafletBorderMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet only in browser
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance and container ID if any
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        attributionControl: false,
      });

      // Tactical Dark Map Tiles (ESRI World Dark Gray - 100% Free, No Watermark, No API Key Required)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ | IBVAP Tactical',
      }).addTo(map);

      // Reference overlay for labels and international boundaries
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        opacity: 0.85,
      }).addTo(map);

      // Draw International Border Zero Line
      L.polyline(BORDER_FENCE_COORDINATES, {
        color: '#FF4444',
        weight: 2.5,
        dashArray: '6, 6',
        opacity: 0.85,
      }).addTo(map);

      // Add Secondary Perimeter Buffer Line
      L.polyline(
        BORDER_FENCE_COORDINATES.map(([lat, lon]) => [lat - 0.04, lon - 0.03] as [number, number]),
        {
          color: '#00E5FF',
          weight: 1.5,
          dashArray: '4, 4',
          opacity: 0.5,
        }
      ).addTo(map);

      // Dedicated layer group for dynamic markers
      const dynamicLayer = L.layerGroup().addTo(map);
      layerGroupRef.current = dynamicLayer;
      mapInstanceRef.current = map;
      setIsMapReady(true);
    }).catch(err => {
      console.warn('Leaflet initialization warning:', err);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update dynamic markers (cameras, drones, alert pings) when data changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    import('leaflet').then((L) => {
      const layer = layerGroupRef.current;
      layer.clearLayers();

      // 1. Plot Camera Markers
      cameras.forEach((cam) => {
        const color =
          cam.status === 'Online'
            ? '#00C853'
            : cam.status === 'Degraded'
            ? '#FFAA00'
            : '#FF4444';

        const customIcon = L.divIcon({
          className: 'custom-camera-marker',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 26px;
              height: 26px;
              border-radius: 4px;
              background: #0A0E1A;
              border: 2px solid ${color};
              box-shadow: 0 0 10px ${color}88;
              color: ${color};
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              font-weight: bold;
              cursor: pointer;
            ">
              CAM
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([cam.lat, cam.lon], { icon: customIcon }).addTo(layer);

        // Custom Popup
        marker.bindPopup(`
          <div style="
            background: #111827;
            color: #E2E8F0;
            padding: 8px 10px;
            border-radius: 4px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            border: 1px solid #1E3A5F;
            min-width: 170px;
          ">
            <div style="font-weight: bold; color: #00E5FF; font-family: 'JetBrains Mono'; font-size: 12px; margin-bottom: 3px;">
              ${cam.id} — ${cam.name}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748B;">Zone:</span>
              <span style="font-weight: 600;">Zone ${cam.zone}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748B;">Status:</span>
              <span style="color: ${color}; font-weight: bold;">${cam.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 4px; padding-top: 4px; border-top: 1px solid #1E293B; font-size: 10px; color: #94A3B8;">
              <span>Lat: ${cam.lat.toFixed(3)}</span>
              <span>Lon: ${cam.lon.toFixed(3)}</span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectCamera) onSelectCamera(cam.id);
        });
      });

      // 2. Plot Active Alert Pings
      activeAlertPings.forEach((ping) => {
        const pingIcon = L.divIcon({
          className: 'custom-alert-ping',
          html: `
            <div style="position: relative; width: 32px; height: 32px;">
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: rgba(255, 68, 68, 0.4);
                animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                inset: 6px;
                border-radius: 50%;
                background: #FF4444;
                border: 2px solid #FFFFFF;
                box-shadow: 0 0 12px #FF4444;
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const alertMarker = L.marker([ping.lat, ping.lon], { icon: pingIcon }).addTo(layer);
        alertMarker.bindPopup(`
          <div style="background: #111827; color: #E2E8F0; padding: 6px 8px; border-radius: 4px; font-size: 11px; border: 1px solid #FF4444;">
            <div style="color: #FF4444; font-weight: bold;">🚨 ${ping.type} (${ping.severity})</div>
            <div style="font-size: 10px; color: #94A3B8;">Time: ${ping.time}</div>
          </div>
        `);
      });

      // 3. Plot Drone Position & Flight Path
      drones.forEach((drone) => {
        const isAirborne = drone.status === 'EN_ROUTE' || drone.status === 'ON_SITE' || drone.status === 'RETURNING';

        const droneIcon = L.divIcon({
          className: 'custom-drone-marker',
          html: `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
            ">
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #0A0E1A;
                border: 2px solid ${isAirborne ? '#00E5FF' : '#64748B'};
                box-shadow: 0 0 ${isAirborne ? '12px #00E5FF' : '4px #64748B'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${isAirborne ? '#00E5FF' : '#94A3B8'};
                font-size: 14px;
                transform: rotate(${isAirborne ? '45deg' : '0deg'});
                transition: transform 0.3s ease;
              ">
                🚁
              </div>
              <div style="
                background: rgba(10, 14, 26, 0.9);
                border: 1px solid #1E3A5F;
                border-radius: 2px;
                padding: 1px 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: bold;
                color: #00E5FF;
                margin-top: 2px;
                white-space: nowrap;
              ">
                ${drone.id} (${drone.battery}%)
              </div>
            </div>
          `,
          iconSize: [40, 44],
          iconAnchor: [20, 22],
        });

        const droneMarker = L.marker([drone.lat, drone.lon], { icon: droneIcon }).addTo(layer);

        droneMarker.bindPopup(`
          <div style="background: #111827; color: #E2E8F0; padding: 8px 10px; border-radius: 4px; font-size: 11px; border: 1px solid #00E5FF; min-width: 160px;">
            <div style="font-weight: bold; color: #00E5FF; font-family: 'JetBrains Mono'; font-size: 12px; margin-bottom: 3px;">
              ${drone.name}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748B;">Status:</span>
              <span style="color: ${isAirborne ? '#00E5FF' : '#00C853'}; font-weight: bold;">${drone.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748B;">Battery:</span>
              <span style="font-weight: bold; font-family: 'JetBrains Mono';">${drone.battery}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 4px; padding-top: 4px; border-top: 1px solid #1E293B; font-size: 10px; color: #94A3B8;">
              <span>Lat: ${drone.lat.toFixed(3)}</span>
              <span>Lon: ${drone.lon.toFixed(3)}</span>
            </div>
          </div>
        `);

        // Draw flight vector to target if dispatched/en-route
        if (drone.targetLat && drone.targetLon && (drone.status === 'EN_ROUTE' || drone.status === 'ON_SITE')) {
          L.polyline(
            [
              [drone.lat, drone.lon],
              [drone.targetLat, drone.targetLon],
            ],
            {
              color: '#00E5FF',
              weight: 2,
              dashArray: '4, 4',
              opacity: 0.8,
            }
          ).addTo(layer);
        }
      });
    });
  }, [isMapReady, cameras, drones, activeAlertPings, onSelectCamera]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded border border-[#1E3A5F] overflow-hidden relative z-0"
    />
  );
}
