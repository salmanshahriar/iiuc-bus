import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    const successHandler = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
      setError(null)
    }

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error.message)
    }

    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { latitude, longitude, error }
} 