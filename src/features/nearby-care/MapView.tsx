import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NormalizedFacility, FacilityType } from './types';
import { formatDistance, formatTravelTime, getNavigationUrl } from './utils/formatDistance';
import { Navigation2, Phone, AlertCircle, Eye, RefreshCw } from 'lucide-react';

interface MapViewProps {
  userLat?: number;
  userLng?: number;
  accuracyRadiusMeters?: number;
  facilities: NormalizedFacility[];
  selectedFacilityId?: string;
  onSelectFacility: (id: string) => void;
  onManualPinPlaced?: (lat: number, lng: number) => void;
  isHighContrast?: boolean;
}

// Marker background colors by facility type
const TYPE_COLORS: Record<FacilityType, string> = {
  hospital: '#dc2626', // Red
  clinic: '#0284c7', // Sky
  PHC: '#059669', // Emerald
  CHC: '#0d9488', // Teal
  pharmacy: '#16a34a', // Green
  diagnostic_lab: '#7c3aed', // Purple
  nursing_home: '#4f46e5' // Indigo
};

export const MapView: React.FC<MapViewProps> = ({
  userLat,
  userLng,
  accuracyRadiusMeters,
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onManualPinPlaced,
  isHighContrast = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const [mapCenterChanged, setMapCenterChanged] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = userLat || 20.2961;
    const initialLng = userLng || 85.8245;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true
    });

    // High contrast vs Standard OpenStreetMap Tiles
    const tileUrl = isHighContrast
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Map move listener for "Search this area"
    map.on('moveend', () => {
      setMapCenterChanged(true);
    });

    // Click map to drop pin if handler provided
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onManualPinPlaced) {
        onManualPinPlaced(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isHighContrast, onManualPinPlaced, userLat, userLng]);

  // Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLat && userLng) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position:relative; width:24px; height:24px;">
            <div style="position:absolute; inset:0; border-radius:9999px; background:#0284c7; opacity:0.35; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute; inset:3px; border-radius:9999px; background:#0284c7; border:3px solid #ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLat, userLng], {
          icon: userIcon,
          title: 'Your Detected Location'
        }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }

      // Accuracy Circle
      const radius = Math.min(accuracyRadiusMeters || 100, 2000);
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([userLat, userLng], {
          radius,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.12,
          weight: 1.5
        }).addTo(map);
      } else {
        accuracyCircleRef.current.setLatLng([userLat, userLng]);
        accuracyCircleRef.current.setRadius(radius);
      }
    }
  }, [userLat, userLng, accuracyRadiusMeters]);

  // Update Facility Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    facilities.forEach((fac) => {
      const color = TYPE_COLORS[fac.type] || '#475569';
      const isSelected = fac.id === selectedFacilityId;
      const size = isSelected ? 36 : 28;

      const markerHtml = `
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:50%;
          background:${color};
          border:${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
          box-shadow:${isSelected ? '0 0 0 3px #0284c7, 0 10px 15px -3px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.3)'};
          display:flex;
          align-items:center;
          justify-content:center;
          color:#ffffff;
          font-weight:bold;
          font-size:${isSelected ? '14px' : '11px'};
          cursor:pointer;
          transition:transform 0.2s;
        " title="${fac.name}">
          ${fac.emergencyAvailable ? '★' : fac.type.substring(0, 1)}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'facility-marker',
        html: markerHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([fac.lat, fac.lng], { icon: customIcon });

      // Popup Content
      const navUrl = getNavigationUrl(fac.lat, fac.lng, fac.name, userLat, userLng);
      const popupHtml = `
        <div style="font-family:inherit; min-width:210px; max-width:260px; padding:2px;">
          <div style="font-size:10px; font-weight:800; text-transform:uppercase; color:${color}; margin-bottom:2px;">
            ${fac.type.toUpperCase()} • ${fac.ownership.toUpperCase()}
          </div>
          <div style="font-size:13px; font-weight:700; color:#0f172a; margin-bottom:4px; line-height:1.2;">
            ${fac.name}
          </div>
          <div style="font-size:11px; color:#64748b; margin-bottom:6px;">
            📍 ${fac.address}
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#0284c7; margin-bottom:8px;">
            <span>${formatDistance(fac.distanceKm)}</span>
            <span>${formatTravelTime(fac.estimatedTravelTimeMin)}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <a href="tel:${fac.phone}" style="flex:1; background:#f1f5f9; text-align:center; padding:6px; border-radius:8px; font-size:11px; font-weight:700; color:#0f172a; text-decoration:none;">
              📞 Call
            </a>
            <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="flex:1; background:#0284c7; text-align:center; padding:6px; border-radius:8px; font-size:11px; font-weight:700; color:#ffffff; text-decoration:none;">
              🧭 Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: true });

      marker.on('click', () => {
        onSelectFacility(fac.id);
      });

      markersGroup.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [facilities, selectedFacilityId, onSelectFacility, userLat, userLng]);

  const handleCenterOnUser = () => {
    if (mapInstanceRef.current && userLat && userLng) {
      mapInstanceRef.current.setView([userLat, userLng], 14, { animate: true });
      setMapCenterChanged(false);
    }
  };

  const handleSearchThisArea = () => {
    if (mapInstanceRef.current && onManualPinPlaced) {
      const center = mapInstanceRef.current.getCenter();
      onManualPinPlaced(center.lat, center.lng);
      setMapCenterChanged(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-0" tabIndex={0} aria-label="Interactive Care Facility Map" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Center on Me Button */}
        {userLat && userLng && (
          <button
            type="button"
            onClick={handleCenterOnUser}
            className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-slate-700 dark:text-slate-200 hover:text-sky-600 transition"
            title="Recenter on my location"
            aria-label="Recenter on my location"
          >
            <Navigation2 className="w-4 h-4 text-sky-600" />
          </button>
        )}
      </div>

      {/* "Search This Area" Pill on Pan */}
      {mapCenterChanged && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <button
            type="button"
            onClick={handleSearchThisArea}
            className="px-4 py-2 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-xl border border-slate-700 flex items-center gap-1.5 hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Search This Area (यहाँ खोजें)</span>
          </button>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl text-[10px] font-bold shadow-md hidden sm:flex items-center gap-3 text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Hospital
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> PHC/CHC
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Clinic
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Pharmacy
        </span>
        <span className="flex items-center gap-1 text-amber-500">
          ★ 24x7 Emergency
        </span>
      </div>
    </div>
  );
};
