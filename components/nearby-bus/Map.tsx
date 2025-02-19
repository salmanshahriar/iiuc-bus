"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Bus } from "@/types/bus"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { usePWA } from "@/contexts/PWAContext"

interface MapProps {
  buses: Bus[]
  selectedBus: Bus | null
  userLocation: { lat: number; lng: number } | null
}

const busIcon = new L.Icon({
  iconUrl: "/bus-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

export default function Map({ buses, selectedBus, userLocation }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [currentLayer, setCurrentLayer] = useState<keyof typeof mapLayers>("detailed")
  const defaultCenter: [number, number] = [22.3569, 91.7832]
  const [map, setMap] = useState<L.Map | null>(null)
  const { isPWABannerVisible } = usePWA()

  useEffect(() => {
    if (map && selectedBus?.location) {
      map.setView(
        [selectedBus.location.lat, selectedBus.location.lng],
        16,
        { animate: true }
      )
    }
  }, [selectedBus, map])

  return (
    <>
      <style jsx global>{`
        .leaflet-control-zoom {
          border: none !important;
          margin-top: 16px !important;
          margin-right: 16px !important;
        }
        
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          background-color: hsl(var(--background)) !important;
          border: 1px solid rgba(255, 122, 92, 0.2) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 18px !important;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease-out;
        }
        
        .leaflet-control-zoom-in {
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
        }
        
        .leaflet-control-zoom-out {
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
          border-top: none !important;
        }
        
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background-color: rgba(255, 122, 92, 0.1) !important;
          border-color: rgba(255, 122, 92, 0.4) !important;
          color: rgb(255, 122, 92) !important;
        }
      `}</style>
      
      <div className={`
        relative w-full
        ${isPWABannerVisible 
          ? 'h-[calc(100vh-172px)]' // 64px (top) + 44px (banner) + 64px (bottom)
          : 'h-[calc(100vh-128px)]' // 64px (top) + 64px (bottom)
        }
        md:h-[calc(100vh-64px)] // Only top navbar on desktop
      `}>
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
          ref={setMap}
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          boxZoom={true}
          keyboard={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={new L.Icon({
                iconUrl: "/user-location.png",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Bus markers */}
          {buses.map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.location.lat, bus.location.lng]}
              icon={busIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">Bus #{bus.number}</h3>
                  <p className="text-sm text-muted-foreground">{bus.route}</p>
                  <p className="text-sm">Next Stop: {bus.nextStop}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}