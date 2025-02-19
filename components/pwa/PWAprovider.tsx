"use client"
import { useEffect } from 'react'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          })
          console.log('Service Worker registered with scope:', registration.scope)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                console.log('New content is available; please refresh.')
                // Optional: Show a notification to the user
                if (window.confirm('New version available! Click OK to update.')) {
                  window.location.reload()
                }
              }
            })
          })
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      // Register the service worker
      registerServiceWorker()
    }
  }, [])

  return <>{children}</>
}