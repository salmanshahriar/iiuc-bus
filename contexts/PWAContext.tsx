"use client"

import { createContext, useContext, useState } from "react"

type PWAContextType = {
  isPWABannerVisible: boolean
  setIsPWABannerVisible: (visible: boolean) => void
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isPWABannerVisible, setIsPWABannerVisible] = useState(false)

  return (
    <PWAContext.Provider value={{ isPWABannerVisible, setIsPWABannerVisible }}>
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider")
  }
  return context
} 