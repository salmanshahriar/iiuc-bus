"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Locate, Bus, Gauge, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bus {
  vehicleID: string;
  latitude: string;
  longitude: string;
  speed: string;
  distance: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface MapProps {
  buses: Bus[];
  selectedBus: Bus | null;
  userLocation: LatLng;
  onBusSelect: (bus: Bus | null) => void;
  trackSelectedBus: boolean;
  setTrackSelectedBus: (value: boolean) => void;
}

const MapButton = ({ onClick, children, active = false }: { 
  onClick: () => void; 
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-all duration-300",
      "transform hover:scale-105 active:scale-95",
      active 
        ? "bg-[#008547] text-white" 
        : "bg-[#008547]/90 text-white hover:bg-[#008547]"
    )}
    style={{
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    {children}
  </button>
);

const Map = ({
  buses,
  selectedBus,
  userLocation,
  onBusSelect,
  trackSelectedBus,
  setTrackSelectedBus,
}: MapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const busMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const mapInitializedRef = useRef(false);

  const memoizedBuses = useMemo(() => buses, [buses]);

  const createCustomIcon = useCallback((iconType: string, isSelected: boolean) => {
    const size = isSelected ? 40 : 30;
    const pulseAnimation = isSelected ? `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
      .pulse-icon {
        animation: pulse 2s infinite ease-in-out;
      }
    ` : '';
    
    let iconContent;
    
    if (iconType === "bus") {
      const fillColor = "#008547";
      const strokeColor = "#ffffff";
      
      iconContent = `
        <div class="${isSelected ? 'pulse-icon' : ''}" style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 12px;
          background-color: ${fillColor};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          transform-origin: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="${size*0.6}" height="${size*0.6}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>
          </svg>
        </div>
      `;
    } else {
      iconContent = `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: ${size*0.5}px;
            height: ${size*0.5}px;
            background-color: #008547;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 2px rgba(0, 133, 71, 0.2), 0 2px 6px rgba(0,0,0,0.2);
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 133, 71, 0.2) 0%, rgba(0, 133, 71, 0) 70%);
            animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
          "></div>
        </div>
        <style>
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
      `;
    }
    
    return L.divIcon({
      className: "custom-icon",
      html: `
        <style>${pulseAnimation}</style>
        ${iconContent}
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  }, []);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleLocate = () => {
    setTrackSelectedBus(false);
    onBusSelect(null);
    if (map) {
      map.flyTo([userLocation.lat, userLocation.lng], 13, { 
        duration: 1.5,
        easeLinearity: 0.25 
      });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInitializedRef.current) return;

    const newMap = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '',
    }).addTo(newMap);

    setMap(newMap);
    mapInitializedRef.current = true;

    const userIcon = createCustomIcon("user", false);
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(newMap);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!(e.originalEvent.target instanceof Element) || !e.originalEvent.target.closest(".custom-icon")) {
        setTrackSelectedBus(false);
        onBusSelect(null);
      }
    };
    newMap.on("click", handleMapClick);

    return () => {
      newMap.off("click", handleMapClick);
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      newMap.remove();
      mapInitializedRef.current = false;
    };
  }, [createCustomIcon, setTrackSelectedBus, onBusSelect]);

  useEffect(() => {
    if (!map || !userMarkerRef.current) return;
    userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
  }, [map, userLocation]);

  useEffect(() => {
    if (!map) return;

    memoizedBuses.forEach((bus) => {
      const lat = Number.parseFloat(bus.latitude);
      const lng = Number.parseFloat(bus.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedBus?.vehicleID === bus.vehicleID;
      const busIcon = createCustomIcon("bus", isSelected);

      if (busMarkersRef.current[bus.vehicleID]) {
        busMarkersRef.current[bus.vehicleID].setLatLng([lat, lng]).setIcon(busIcon);
      } else {
        const marker = L.marker([lat, lng], { icon: busIcon })
          .addTo(map);

        marker.on("click", () => {
          onBusSelect(bus);
          setTrackSelectedBus(true);
        });

        busMarkersRef.current[bus.vehicleID] = marker;
      }
    });

    Object.keys(busMarkersRef.current).forEach((busId) => {
      if (!memoizedBuses.some((bus) => bus.vehicleID === busId)) {
        busMarkersRef.current[busId].remove();
        delete busMarkersRef.current[busId];
      }
    });
  }, [map, memoizedBuses, selectedBus, createCustomIcon, onBusSelect, setTrackSelectedBus]);

  useEffect(() => {
    if (!map || !selectedBus || !trackSelectedBus) return;

    const updateMapPosition = () => {
      const lat = Number.parseFloat(selectedBus.latitude);
      const lng = Number.parseFloat(selectedBus.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const currentCenter = map.getCenter();
      const distance = currentCenter.distanceTo([lat, lng]);

      if (distance > 50) {
        map.flyTo([lat, lng], map.getZoom(), { duration: 1.2, easeLinearity: 0.25 });
      }
    };

    updateMapPosition();

    const updateInterval = setInterval(updateMapPosition, 2000);

    return () => clearInterval(updateInterval);
  }, [map, selectedBus, trackSelectedBus]);

  return (
    <div className="relative h-[calc(100vh-8rem)] md:h-full w-full overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-3">
        <MapButton onClick={handleZoomIn}>
          <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </MapButton>
        <MapButton onClick={handleZoomOut}>
          <Minus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </MapButton>
        <MapButton onClick={handleLocate} active={!trackSelectedBus}>
          <Locate className="h-5 w-5 text-white" strokeWidth={2.5} />
        </MapButton>
      </div>
      {selectedBus && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-[#111113] backdrop-blur-md rounded-full shadow-lg px-4 py-2 mb-2 max-w-[95%] w-auto">
          <div className="flex items-center space-x-3 text-sm whitespace-nowrap overflow-x-auto text-gray-900 dark:text-white">
            <span className="flex items-center">
              <Bus className="h-4 w-4 mr-1 text-[#008547] dark:text-white" />
              {selectedBus.vehicleID}
            </span>
            <span className="flex items-center">
              <Gauge className="h-4 w-4 mr-1 text-[#008547] dark:text-white" />
              {selectedBus.speed} km/h
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-[#008547] dark:text-white" />
              {selectedBus.distance} km
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;