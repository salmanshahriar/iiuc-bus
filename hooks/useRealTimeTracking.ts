import { useState, useEffect } from "react"
import { useAPI } from "@/contexts/APIContext"
import { Socket } from "socket.io-client"

type Location = {
  lat: number
  lng: number
} | null

type LocationUpdate = {
  busId: string
  location: Location
}

export function useRealTimeTracking(busId: string | null): Location {
  const [location, setLocation] = useState<Location>(null)
  const { socket } = useAPI()

  useEffect(() => {
    if (!busId || !socket) return

    // Subscribe to real-time location updates for the selected bus
    socket.emit("subscribe_bus_location", busId)

    // Handle incoming location updates
    const handleLocationUpdate = (data: LocationUpdate) => {
      if (data.busId === busId) {
        setLocation(data.location)
      }
    }

    socket.on("bus_location_update", handleLocationUpdate)

    // Cleanup: unsubscribe when component unmounts or busId changes
    return () => {
      socket.emit("unsubscribe_bus_location", busId)
      socket.off("bus_location_update", handleLocationUpdate)
    }
  }, [busId, socket])

  // Get initial location when bus is selected
  useEffect(() => {
    if (!busId) {
      setLocation(null)
      return
    }

    // You can fetch initial location from your API here
    const fetchInitialLocation = async () => {
      try {
        const response = await fetch(`/api/buses/${busId}/location`)
        const data = await response.json()
        setLocation(data.location)
      } catch (error) {
        console.error("Failed to fetch initial bus location:", error)
      }
    }

    fetchInitialLocation()
  }, [busId])

  return location
} 