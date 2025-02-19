"use client"

import { useState, useEffect } from "react"
import { InstallNavbar } from "./InstallNavbar"

export function InstallNavbarWrapper() {
  const [showInstallNavbar, setShowInstallNavbar] = useState(false)

  useEffect(() => {
    const checkInstallNavbarVisibility = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInstallDismissed = localStorage.getItem("installDismissed") === "true"
      const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
      const isDesktop = window.innerWidth >= 768 // Using md breakpoint

      setShowInstallNavbar(!isStandalone && !isInstallDismissed && isMobileOrTablet && !isDesktop)
    }

    checkInstallNavbarVisibility()
    window.addEventListener("resize", checkInstallNavbarVisibility)
    return () => window.removeEventListener("resize", checkInstallNavbarVisibility)
  }, [])

  const handleDismiss = () => {
    setShowInstallNavbar(false)
    localStorage.setItem("installDismissed", "true")
  }

  if (!showInstallNavbar) return null

  return <InstallNavbar onDismiss={handleDismiss} />
}

