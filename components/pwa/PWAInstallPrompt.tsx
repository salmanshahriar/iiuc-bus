"use client"

import { useState, useEffect } from "react"
import { InstallNavbar } from "./InstallNavbar"
import { usePWA } from "@/contexts/PWAContext"

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(true)
  const { setIsPWABannerVisible } = usePWA()

  useEffect(() => {
    setIsPWABannerVisible(showPrompt)
    return () => setIsPWABannerVisible(false)
  }, [showPrompt, setIsPWABannerVisible])

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return <InstallNavbar onDismiss={handleDismiss} />
}

