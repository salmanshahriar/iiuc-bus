"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/layout/Navigation"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import { PWAProvider } from "@/contexts/PWAContext" 
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt"
import { APIProvider } from "@/contexts/APIContext"
import { PageWrapper } from "@/components/layout/PageWrapper"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>
        <PWAProvider>
          <APIProvider>
            <div className="relative min-h-screen">
              <PWAInstallPrompt />
              <Navigation />
              <PageWrapper>
                {children}
              </PageWrapper>
              <Toaster />
            </div>
          </APIProvider>
        </PWAProvider>
      </UserProvider>
    </ThemeProvider>
  )
}