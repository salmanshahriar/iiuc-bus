"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bus, Calendar, Search, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext"

const menuItems = [
  { 
    name: "home", 
    path: "/", 
    icon: Home,
  },
  { 
    name: "nearestBuses", 
    path: "/nearby-bus", 
    icon: Bus,
  },
  { 
    name: "schedule", 
    path: "/schedule", 
    icon: Calendar,
  },
  { 
    name: "lostAndFound", 
    path: "/lost-&-found", 
    icon: Search,
  },
  { 
    name: "support", 
    path: "/support", 
    icon: MessageCircle,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { translate } = useUser()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-950">
      <div className="relative">
        {/* Solid background */}
        <div className="absolute inset-0 bg-background border-t border-border/50" />
        
        {/* Main Navigation Content */}
        <div className="relative">
          <div className="flex justify-around items-center h-[80px] pb-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="relative w-full h-full"
                >
                  <motion.div
                    className="flex flex-col items-center justify-center h-full"
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {/* Icon Container */}
                    <div className="relative">
                      <motion.div
                        className={cn(
                          "relative z-10 p-2 rounded-xl transition-colors",
                          isActive && "bg-[var(--primary-color)]/10"
                        )}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <item.icon 
                          className={cn(
                            "h-5 w-5 transition-all duration-200",
                            isActive 
                              ? "text-[var(--primary-color)] stroke-[2px]" 
                              : "text-muted-foreground stroke-[1.5px] opacity-50"
                          )}
                        />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <span 
                      className={cn(
                        "text-[10px] font-medium mt-1",
                        isActive 
                          ? "text-[var(--primary-color)]" 
                          : "text-muted-foreground/70"
                      )}
                    >
                      {translate(item.name as "nearestBuses" | "schedule" | "lostAndFound" | "support" | "language" | "busType" | "home" | "teacher" | "staff" | "email" | "active" | "profile" | "male" | "female" | "administrative" | "logout" | "activeBuses" | "trackBusesRealTime" | "onRoad")}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* iOS Safe Area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}

