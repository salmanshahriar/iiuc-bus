"use client"

import Link from "next/link"
import { UserCircle } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "./ModeToggle"
import { cn } from "@/lib/utils"
import { ProfileSidebar } from "./ProfileSidebar"
import { useUser } from "@/contexts/UserContext"
import { usePWA } from "@/contexts/PWAContext"

export function TopNav() {
  const [isHovered, setIsHovered] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { translate } = useUser()
  const { isPWABannerVisible } = usePWA()

  return (
    <>
      <div className={`fixed left-0 right-0 h-16 bg-background border-b border-border/50 z-50 transition-all duration-300 
        ${isPWABannerVisible ? 'max-md:top-11 md:top-0' : 'top-0'}`}>
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center">
            {/* <img 
              src="/icon-logo.png" 
              alt="IIUC Logo" 
              className="h-8 w-8 rounded-xl" 
            /> */}
            <span className="text-xl font-bold ml-3 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
              IIUC<span className="text-primary">BUS</span>
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <ModeToggle />
            <button
              className="relative focus:outline-none group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsProfileOpen(true)}
            >
              <div className={cn(
                "absolute inset-0 rounded-full transition-all duration-300 transform",
                isHovered ? "bg-primary/10 scale-125" : "scale-0"
              )} />
              <UserCircle className={cn(
                "h-8 w-8 transition-colors duration-200",
                isHovered ? "text-primary" : "text-muted-foreground"
              )} />
            </button>
          </div>
        </div>
      </div>
      <div className={`h-16 transition-all duration-300 ${isPWABannerVisible ? 'max-md:mt-11' : ''}`} /> {/* Spacer */}
      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

