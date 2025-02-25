"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bus, MapPin, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BusList } from "@/components/nearby-bus/BusList"
import BusTrackerLoading from "@/components/nearby-bus/loading"
import type { Bus as BusType } from "@/types/bus"
import ErrorBoundary from "@/components/nearby-bus/ErrorBoundary"

interface UserLocation {
  lat: number
  lng: number
}



const Map = dynamic(() => import("@/components/nearby-bus/Map"), {
  ssr: false,
  loading: () => <BusTrackerLoading />,
})

export default function NearbyBus() {
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [nearbyBuses, setNearbyBuses] = useState<BusType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [trackSelectedBus, setTrackSelectedBus] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const updateUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationError(null)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setLocationError("Unable to retrieve your location. Please enable location services and refresh the page.")
        },
      )
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Please use a modern browser with location services.",
      )
    }
  }, [])

  useEffect(() => {
    updateUserLocation()
    const locationInterval = setInterval(updateUserLocation, 5000)
    return () => clearInterval(locationInterval)
  }, [updateUserLocation])

  const fetchNearbyBuses = useCallback(async () => {
    if (!userLocation) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `http://147.93.107.88:5000/api/user/nearest-bus?userLat=${userLocation.lat}&userLon=${userLocation.lng}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch nearby buses")
      }
      const data = await response.json()
      setNearbyBuses(data)
    } catch (error) {
      console.error("Error fetching nearby buses:", error)
      setNearbyBuses([])
    } finally {
      setIsLoading(false)
    }
  }, [userLocation])

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBuses()
      const interval = setInterval(fetchNearbyBuses, 5000)
      return () => clearInterval(interval)
    }
  }, [fetchNearbyBuses, userLocation])

  const handleBusSelect = useCallback((bus: BusType | null) => {
    setSelectedBus(bus)
    setTrackSelectedBus(!!bus)
    setIsInfoOpen(false)
  }, [])

  const InfoContent = () => (
    <div className="flex flex-col h-full bg-transparent">
      <div className="px-3 py-2 bg-background/50 backdrop-blur-xl border-b border-border/50 flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Nearby Buses
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${nearbyBuses.length} buses found`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsInfoOpen(false)} className="lg:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {isLoading ? (
            <BusTrackerLoading />
          ) : nearbyBuses.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">No buses found in your area</div>
          ) : (
            <BusList
              buses={nearbyBuses}
              onBusSelect={handleBusSelect}
              selectedBus={selectedBus}
              trackSelectedBus={trackSelectedBus}
            />
          )}
        </div>
      </div>
    </div>
  )

  if (locationError) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Location Error</h1>
          <p className="text-muted-foreground mb-4">{locationError}</p>
          <Button onClick={updateUserLocation}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!userLocation) {
    return <BusTrackerLoading />
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex-grow flex h-full">
        <div className="relative flex-grow h-full bg-background/95 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 z-[9999] lg:hidden">
              <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-background/95 backdrop-blur-sm shadow-lg rounded-xl 
                      hover:shadow-xl transition-all duration-200 
                      border border-primary/20 hover:border-primary/40
                      flex items-center gap-2 px-3 py-2"
                    onClick={() => setIsInfoOpen(true)}
                  >
                    <Bus className="h-4 w-4 text-foreground" />
                    <Badge variant="secondary" className="ml-1 bg-primary/10 text-foreground border-primary/20">
                      {nearbyBuses.length}
                    </Badge>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full p-0 max-w-[300px] z-[10000]">
                  <InfoContent />
                </SheetContent>
              </Sheet>
            </div>

            <div className="absolute bottom-4 right-4 z-[9999]">
              <Button
                size="sm"
                variant="secondary"
                className="bg-background/95 backdrop-blur-sm shadow-lg 
                  border border-primary/20 hover:border-primary/40
                  hover:shadow-xl transition-all duration-200
                  flex items-center gap-2"
                onClick={() => {
                  setSelectedBus(null)
                  setTrackSelectedBus(false)
                }}
              >
                <MapPin className="h-4 w-4 text-primary" />
              </Button>
            </div>

            <div className="h-full w-full">
              <ErrorBoundary>
                <Map
                  buses={nearbyBuses}
                  selectedBus={selectedBus}
                  userLocation={userLocation}
                  onBusSelect={handleBusSelect}
                  trackSelectedBus={trackSelectedBus}
                  setTrackSelectedBus={setTrackSelectedBus}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-[300px] border-l bg-background/80 backdrop-blur-sm">
          <InfoContent />
        </div>
      </div>
    </div>
  )
}

