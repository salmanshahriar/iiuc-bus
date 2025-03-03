"use client"

import { ThemeProvider } from "@/components/layout/theme-provider"
import { Navigation } from "@/components/layout/Navigation"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/contexts/UserContext"
import { PWAProvider } from "@/contexts/PWAContext" 
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt"
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