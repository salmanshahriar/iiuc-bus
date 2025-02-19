"use client"

import { usePWA } from "@/contexts/PWAContext"

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isPWABannerVisible } = usePWA()

  return (
    <div className={`
      transition-all duration-300 
      md:ml-[var(--sidebar-width,5rem)]
      pt-16
      ${isPWABannerVisible ? 'max-md:pt-[108px]' : ''}
      relative
    `}>
      {children}
    </div>
  )
} 