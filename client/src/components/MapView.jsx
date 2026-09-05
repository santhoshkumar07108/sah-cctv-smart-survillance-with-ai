// client/src/components/MapView.jsx
import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_CAMERAS = [
  { id: 'CAM-001', name: 'Petrapole ICP Checkpoint', lat: 23.017, lon: 88.917, zone: 'Charlie', status: 'Online', lastAlert: 'Vehicle ANPR match' },
  { id: 'CAM-002', name: 'Hilli Border Outpost', lat: 25.283, lon: 89.000, zone: 'Bravo', status: 'Degraded', lastAlert: 'Low-light movement' },
  { id: 'CAM-003', name: 'Changrabandha Corridor', lat: 26.317, lon: 89.617, zone: 'Bravo', status: 'Online', lastAlert: 'Fence breach alert' },
  { id: 'CAM-004', name: 'Fulbari Riverine Sentry', lat: 26.550, lon: 88.733, zone: 'Alpha', status: 'Online', lastAlert: 'River boat detected' },
  { id: 'CAM-005', name: 'Ghojadanga Culvert Gate', lat: 22.900, lon: 88.783, zone: 'Delta', status: 'Online', lastAlert: 'Clear' },
];

const BORDER_FENCE_COORDINATES = [
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

export default function MapView({
  cameras = DEFAULT_CAMERAS,
  drones = [],
  activeAlertPings = [],
  onSelectCamera,
  height = '420px',
  center = [24.5, 88.5],
  zoom = 8,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tactical Dark Map Tiles (ESRI World Dark Gray - 100% Free, No Watermark, No API Key Required)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ | IBVAP Tactical',
      }).addTo(map);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        opacity: 0.85,
      }).addTo(map);

      // Border polyline
      L.polyline(BORDER_FENCE_COORDINATES, {
        color: '#FF4444',
        weight: 2,
        dashArray: '6, 6',
        opacity: 0.8,
      }).addTo(map).bindTooltip('Zero Line / International Border', {
        permanent: false,
        direction: 'center',
        className: 'tactical-tooltip',
      });

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setIsMapReady(true);
    }).catch(err => {
      console.error('Leaflet load error:', err);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, []);

  // Update dynamic layers (cameras, alert pings, drones)
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !layerGroupRef.current) return;

    import('leaflet').then((L) => {
      const lg = layerGroupRef.current;
      lg.clearLayers();

      // Cameras
      cameras.forEach((cam) => {
        const pinColor =
          cam.status === 'Online'
            ? '#00C853'
            : cam.status === 'Degraded'
            ? '#F59E0B'
            : '#FF4444';

        const camIcon = L.divIcon({
          className: 'custom-cam-pin',
          html: 
            <div style="background-color: #0A0E1A; border: 2px solid ; border-radius: 4px; padding: 2px 5px; color: #E2E8F0; font-family: monospace; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 0 10px 88;">
              <span style="color: ; margin-right: 3px;">●</span>
            </div>
          ,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([cam.lat, cam.lon], { icon: camIcon }).addTo(lg);
        marker.bindPopup(
          <div style="background: #0A0E1A; color: #E2E8F0; padding: 6px; font-family: monospace; font-size: 11px; border: 1px solid #1E3A5F; border-radius: 4px; min-width: 160px;">
            <div style="font-weight: bold; color: #00E5FF; border-bottom: 1px solid #1E3A5F; padding-bottom: 3px; margin-bottom: 4px;">
               - 
            </div>
            <div>STATUS: <span style="color: "></span></div>
            <div>ZONE: Sector </div>
            <div>COORDS: , </div>
            <div style="margin-top: 4px; color: #94A3B8; font-size: 10px;">LAST ALERT: </div>
          </div>
        );

        if (onSelectCamera) {
          marker.on('click', () => onSelectCamera(cam.id));
        }
      });

      // Active Alert Pings
      activeAlertPings.forEach((ping) => {
        const pingIcon = L.divIcon({
          className: 'alert-ping-icon',
          html: 
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #FF4444; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FF4444; border: 2px solid #FFFFFF;"></div>
            </div>
          ,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([ping.lat, ping.lon], { icon: pingIcon })
          .addTo(lg)
          .bindPopup(
            <div style="background: #0A0E1A; color: #FF4444; padding: 6px; font-family: monospace; font-size: 11px; border: 1px solid #FF4444; border-radius: 4px;">
              <strong>INCURSION ALERT: </strong>
              <div style="color: #E2E8F0;">SEVERITY: </div>
            </div>
          );
      });

      // Drones
      drones.forEach((drone) => {
        const droneIcon = L.divIcon({
          className: 'custom-drone-pin',
          html: 
            <div style="background: #00E5FF; color: #0A0E1A; font-family: monospace; font-size: 9px; font-weight: bold; border-radius: 3px; padding: 2px 4px; box-shadow: 0 0 12px #00E5FF;">
              ▲  (%)
            </div>
          ,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });

        L.marker([drone.lat, drone.lon], { icon: droneIcon })
          .addTo(lg)
          .bindPopup(
            <div style="background: #0A0E1A; color: #00E5FF; padding: 6px; font-family: monospace; font-size: 11px; border: 1px solid #00E5FF; border-radius: 4px;">
              <strong> TACTICAL UAV</strong>
              <div>STATUS: </div>
              <div>BATTERY: %</div>
            </div>
          );
      });
    });
  }, [cameras, drones, activeAlertPings, isMapReady, onSelectCamera]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded bg-[#05080E] border border-[#1E3A5F] overflow-hidden relative z-0"
    />
  );
}
