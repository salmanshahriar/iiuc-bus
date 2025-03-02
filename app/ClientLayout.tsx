"use client"

import { useEffect } from "react"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Navigation } from "@/components/layout/Navigation"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import { PWAProvider } from "@/contexts/PWAContext" 
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt"
import { PageWrapper } from "@/components/layout/PageWrapper"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Register service worker and handle push subscription
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js")
          console.log("Service Worker registered:", registration)

          // Request notification permission and subscribe to push
          if ("PushManager" in window) {
            const permission = await Notification.requestPermission()
            if (permission === "granted") {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "YOUR_PUBLIC_VAPID_KEY", 
              })
              console.log("Push subscription:", subscription)

              await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/push-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription),
              })
              console.log("Subscription sent to server")
            } else {
              console.log("Notification permission denied")
            }
          }
        } catch (error) {
          console.error("Service Worker or Push setup failed:", error)
        }
      }

      registerServiceWorker()
    } else {
      console.log("Service Worker or Push not supported in this browser")
    }
  }, []) 

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <PWAProvider>
          <div className="relative min-h-screen">
            <PWAInstallPrompt />
            <Navigation />
            <PageWrapper>
              {children}
            </PageWrapper>
            <Toaster />
          </div>
        </PWAProvider>
      </UserProvider>
    </ThemeProvider>
  )
}