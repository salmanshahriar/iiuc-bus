import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Locate } from 'lucide-react';

// Assuming these types are defined elsewhere
interface Bus {
  vehicleID: string;
  latitude: string;
  longitude: string;
  speed: string;
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

const MapButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="bg-background p-2 rounded-full shadow-md hover:bg-accent transition-colors"
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

  const createCustomIcon = useCallback((iconName: string, color: string, isSelected: boolean) => {
    const size = isSelected ? 36 : 24;
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="background-color: ${isSelected ? "#ffffff" : "transparent"}; border-radius: 50%; padding: 2px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${isSelected ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${iconName === "bus" ? '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>' : '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'}
        </svg>
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
    });
  }, []);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleLocate = () => {
    if (map) {
      map.setView([userLocation.lat, userLocation.lng], 13, { animate: true, duration: 1 });
    }
  };

  // Initialize map only once
  useEffect(() => {
    if (!mapContainerRef.current || mapInitializedRef.current) return;

    // Initialize map with userLocation as the initial center
    const newMap = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng], // Only used on first load
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    setMap(newMap);
    mapInitializedRef.current = true;

    // Add user marker
    const userIcon = createCustomIcon("map-pin", "#0000FF", false);
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(newMap)
      .bindPopup("Your Location");

    // Handle map click to deselect bus
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
  }, [createCustomIcon, setTrackSelectedBus, onBusSelect]); // No userLocation in deps to prevent re-init

  // Update user marker position when userLocation changes
  useEffect(() => {
    if (!map || !userMarkerRef.current) return;

    userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
  }, [map, userLocation]);

  // Update bus markers
  useEffect(() => {
    if (!map) return;

    memoizedBuses.forEach((bus) => {
      const lat = Number.parseFloat(bus.latitude);
      const lng = Number.parseFloat(bus.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedBus?.vehicleID === bus.vehicleID;
      const busIcon = createCustomIcon("bus", isSelected ? "#00FF00" : "#FF0000", isSelected);

      if (busMarkersRef.current[bus.vehicleID]) {
        busMarkersRef.current[bus.vehicleID].setLatLng([lat, lng]).setIcon(busIcon);
      } else {
        const marker = L.marker([lat, lng], { icon: busIcon })
          .addTo(map)
          .bindPopup(`Bus ID: ${bus.vehicleID}<br>Speed: ${bus.speed} km/h`);

        marker.on("click", () => {
          onBusSelect(bus);
          setTrackSelectedBus(true);
        });

        busMarkersRef.current[bus.vehicleID] = marker;
      }
    });

    // Remove markers for buses no longer in the list
    Object.keys(busMarkersRef.current).forEach((busId) => {
      if (!memoizedBuses.some((bus) => bus.vehicleID === busId)) {
        busMarkersRef.current[busId].remove();
        delete busMarkersRef.current[busId];
      }
    });
  }, [map, memoizedBuses, selectedBus, createCustomIcon, onBusSelect, setTrackSelectedBus]);

  // Handle tracking of selected bus
  useEffect(() => {
    if (!map || !selectedBus || !trackSelectedBus) return;

    const lat = Number.parseFloat(selectedBus.latitude);
    const lng = Number.parseFloat(selectedBus.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    map.setView([lat, lng], map.getZoom(), { animate: true, duration: 1 });

    const updateInterval = setInterval(() => {
      const marker = busMarkersRef.current[selectedBus.vehicleID];
      if (marker) {
        map.setView(marker.getLatLng(), map.getZoom(), { animate: true, duration: 1 });
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [map, selectedBus, trackSelectedBus]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <MapButton onClick={handleZoomIn}>
          <Plus className="h-4 w-4 text-foreground" />
        </MapButton>
        <MapButton onClick={handleZoomOut}>
          <Minus className="h-4 w-4 text-foreground" />
        </MapButton>
        <MapButton onClick={handleLocate}>
          <Locate className="h-4 w-4 text-foreground" />
        </MapButton>
      </div>
    </div>
  );
};

export default Map;