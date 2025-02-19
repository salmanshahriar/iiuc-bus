"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "../ui/button"
import { IOSInstallModal } from "./IOSInstallModal"
import { usePWA } from "@/contexts/PWAContext"

type InstallNavbarProps = {
  onDismiss: () => void
}

export function InstallNavbar({ onDismiss }: InstallNavbarProps) {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const { setIsPWABannerVisible } = usePWA()

  useEffect(() => {
    // Check if app is running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://')

    if (isStandalone) {
      setIsPWABannerVisible(false)
      return
    }

    const ua = window.navigator.userAgent.toLowerCase()
    const isMobile = window.innerWidth < 768
    const isMobileBrowser = /iphone|ipad|ipod|android/.test(ua) && isMobile

    setIsIOS(/iphone|ipad|ipod/.test(ua) && isMobile)
    setIsAndroid(/android/.test(ua) && isMobile)

    if (isMobileBrowser) {
      setIsPWABannerVisible(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    const handleAppInstalled = () => {
      setIsPWABannerVisible(false)
      onDismiss()
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      setIsPWABannerVisible(false)
    }
  }, [setIsPWABannerVisible, onDismiss])

  const handleDismiss = () => {
    setIsPWABannerVisible(false)
    onDismiss()
  }

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true)
    } else if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        console.log("User accepted the install prompt")
        handleDismiss()
      } else {
        console.log("User dismissed the install prompt")
      }
      setDeferredPrompt(null)
    } else if (isAndroid) {
      alert("To install the app, tap the browser menu and select 'Add to Home screen'.")
    }
  }

  if (!isIOS && !isAndroid) {
    return null
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 bg-[var(--secondary-color)] text-black px-2 py-2 flex items-center justify-between md:hidden h-11">
        <div className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span className="text-xs font-medium w-48">
            {isIOS ? "Install App for better experience" : "Install App for better experience"}
          </span>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="px-2 py-1.5 border-black text-xs text-black bg-black/10 hover:bg-white/20"
            onClick={handleInstall}
          >
            {isIOS ? "Learn How" : "Install"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-black hover:text-black hover:bg-black/10 p-1 h-7 w-7"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  )
}

