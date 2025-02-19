"use client"

import { useState, useEffect } from "react"
import { TopNav } from "./TopNav"
import { BottomNav } from "./BottomNav"
import { SideNav } from "./SideNav"
import { InstallNavbar } from "../pwa/InstallNavbar"
import { usePWA } from "@/contexts/PWAContext"

export function Navigation() {
  const [showInstallNavbar, setShowInstallNavbar] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const { isPWABannerVisible, setIsPWABannerVisible } = usePWA()

  useEffect(() => {
    const checkMobileOrTablet = () => {
      setIsMobileOrTablet(window.innerWidth < 768)
    }

    // Initial check
    checkMobileOrTablet()
    
    // Add resize listener
    window.addEventListener("resize", checkMobileOrTablet)

    // Check PWA status
    const isInstallDismissed = localStorage.getItem("installDismissed") === "true"
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const shouldShowBanner = !isInstallDismissed && !isStandalone && isMobileOrTablet

    setShowInstallNavbar(shouldShowBanner)
    setIsPWABannerVisible(shouldShowBanner)

    return () => window.removeEventListener("resize", checkMobileOrTablet)
  }, [isMobileOrTablet, setIsPWABannerVisible])

  const handleDismiss = () => {
    setShowInstallNavbar(false)
    setIsPWABannerVisible(false)
    localStorage.setItem("installDismissed", "true")
  }

  return (
    <>
      <div className={`fixed inset-x-0 ${isPWABannerVisible ? 'max-md:top-11' : 'top-0'} z-50 transition-all`}>
        <TopNav />
      </div>
      {showInstallNavbar && (
        <div className="fixed inset-x-0 top-0 z-40 md:hidden">
          <InstallNavbar onDismiss={handleDismiss} />
        </div>
      )}
      <div className="hidden md:block">
        <SideNav />
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-16 md:hidden z-[60] bg-background">
        <BottomNav />
      </div>
    </>
  )
}

