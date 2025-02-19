import { useState, useEffect } from "react"
import type { Bus } from "@/types/bus"

interface OfflineData {
  buses: Bus[]
  timestamp: number
}

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const saveBusData = (buses: Bus[]) => {
    const data: OfflineData = {
      buses,
      timestamp: Date.now(),
    }
    try {
      localStorage.setItem("busData", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save bus data:", error)
    }
  }

  const loadBusData = (): Bus[] | null => {
    try {
      const data = localStorage.getItem("busData")
      if (!data) return null

      const parsed: OfflineData = JSON.parse(data)
      // Only return data if it's less than 30 minutes old
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        return parsed.buses
      }
      return null
    } catch (error) {
      console.error("Failed to load bus data:", error)
      return null
    }
  }

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    isOffline,
    saveBusData,
    loadBusData,
  }
}

