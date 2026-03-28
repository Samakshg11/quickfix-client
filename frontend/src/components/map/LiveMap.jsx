// src/components/map/LiveMap.jsx
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/** ── Industry Standard Cyber-Markers ──────────────────── */
const createPulsingIcon = (color) => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
        <div class="absolute inset-0 rounded-full animate-ping opacity-20" style="background-color: ${color}"></div>
        <div class="absolute inset-1.5 rounded-full border border-white/10 shadow-2xl" style="background-color: ${color}"></div>
        <div class="w-1.5 h-1.5 rounded-full bg-white shadow-inner"></div>
    </div>
  `,
  className: 'custom-pulsing-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const MECHANIC_ICON = createPulsingIcon('#8ff5ff'); // Cyan
const USER_ICON = createPulsingIcon('#ac89ff'); // Purple

/** ── Smart Cinematic Camera ────────────────────────── */
function SmartCamera({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.flyTo([points[0].lat, points[0].lng], 15, { duration: 1.5 });
    } else {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.flyToBounds(bounds, {
        padding: [80, 80],
        duration: 1.5,
        maxZoom: 16
      });
    }
  }, [map, JSON.stringify(points)]);
  return null;
}

/** ── High-Performance Routing ─────────────────────── */
function RoutePolyline({ from, to, setDistanceKm }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!from?.lat || !to?.lat) return;
    const L_Routing = window.L?.Routing;
    if (!L_Routing) return;

    if (controlRef.current) {
      try { map.removeControl(controlRef.current); } catch (_) { }
    }

    controlRef.current = L_Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      lineOptions: {
        styles: [
          { color: '#8ff5ff', weight: 8, opacity: 0.15 },
          { color: '#8ff5ff', weight: 3, opacity: 1 }
        ]
      },
      createMarker: () => null,
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: false,
    })
      .on('routesfound', (e) => {
        const route = e.routes[0];
        if (setDistanceKm) {
          setDistanceKm((route.summary.totalDistance / 1000).toFixed(1));
        }
      })
      .addTo(map);

    return () => {
      try { if (controlRef.current) map.removeControl(controlRef.current); } catch (_) { }
    };
  }, [from, to, map, setDistanceKm]);

  return null;
}

/** ── LiveMap Main Component ───────────────────────────── */
export default function LiveMap({
  mechanicLocation,    // For a specific active booking
  mechanics = [],      // Array of nearby mechanics for discovery
  userLocation,
  setDistanceKm,
  height = '500px',
  className = '',
}) {
  // Extract points for the camera to follow
  const mechanicNodes = mechanics.map(m => ({
    lat: m.location?.coordinates[1],
    lng: m.location?.coordinates[0],
    name: m.user?.name || m.name
  })).filter(p => !isNaN(p.lat));

  const points = [
    userLocation,
    mechanicLocation,
    ...mechanicNodes
  ].filter(p => p?.lat && p?.lng);

  const initialCenter = points.length > 0 ? [points[0].lat, points[0].lng] : [28.61, 77.23];

  return (
    <div className={`relative rounded-[3rem] overflow-hidden border border-white/5 bg-[#0b0e14] group shadow-2xl ${className}`} style={{ height }}>

      {/* Cinematic HUD Overlays */}
      <div className="absolute top-8 left-8 z-[400] flex flex-col gap-3 pointer-events-none">
        <div className="bg-surface-low/90 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(143,245,255,1)]" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Grid-Node Network Online</span>
        </div>
      </div>

      <MapContainer
        center={initialCenter}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom={true} // RE-ENABLED
        style={{ height: '100%', width: '100%', background: '#0b0e14' }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          opacity={0.85}
        />

        {/* Render all independent mechanic nodes */}
        {mechanicNodes.map((node, i) => (
          <Marker key={i} position={[node.lat, node.lng]} icon={MECHANIC_ICON}>
            <Popup className="font-sans font-bold uppercase tracking-wider text-[10px]">UNIT: {node.name}</Popup>
          </Marker>
        ))}

        {/* Dedicated active mechanic marker (if any) */}
        {mechanicLocation && (
          <Marker position={[mechanicLocation.lat, mechanicLocation.lng]} icon={MECHANIC_ICON}>
            <Popup className="font-sans font-bold">ACTIVE_UNIT_SIGNAL</Popup>
          </Marker>
        )}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={USER_ICON}>
            <Popup className="font-sans font-bold">NODE_001 (YOU)</Popup>
          </Marker>
        )}

        {/* Cinematic Logic Components */}
        <SmartCamera points={points} />
        {mechanicLocation && userLocation && (
          <RoutePolyline from={mechanicLocation} to={userLocation} setDistanceKm={setDistanceKm} />
        )}
      </MapContainer>

      {/* Map Vignette for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
