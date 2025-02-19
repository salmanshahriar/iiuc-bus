"use client"

import { useMemo } from "react"
import type { Bus } from "@/types/bus"
import { formatTime, calculateETA } from "@/lib/utils"
import { 
  Bus as BusIcon,
  Clock,
  MapPin,
  Users,
  Route as RouteIcon,
  Circle as StatusIcon,
  Timer,
  Building2,
  GraduationCap,
  UserCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { calculateDistance } from "@/lib/distance"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface BusListProps {
  buses: Bus[]
  selectedBus: Bus | null
  onBusSelect: (bus: Bus) => void
  userLocation: { lat: number; lng: number } | null
}

const typeStyles = {
  male: "bg-blue-500/15 text-blue-500 border border-blue-500/30",
  female: "bg-pink-500/15 text-pink-500 border border-pink-500/30",
  teacher: "bg-green-500/15 text-green-500 border border-green-500/30",
  administrative: "bg-red-500/15 text-red-500 border border-red-500/30",
  staff: "bg-brown-500/15 text-brown-500 border border-brown-500/30",
}

const typeIcons = {
  male: <BusIcon className="h-3.5 w-3.5" />,
  female: <BusIcon className="h-3.5 w-3.5" />,
  teacher: <Users className="h-3.5 w-3.5" />,
  administrative: <Building2 className="h-3.5 w-3.5" />,
  staff: <Building2 className="h-3.5 w-3.5" />,
}

export function BusList({ buses, selectedBus, onBusSelect, userLocation }: BusListProps) {
  if (!buses) {
    return <div>No buses available</div>
  }

  const busListItems = useMemo(() => {
    if (buses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="shrink-0 p-5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/10
                              border border-border/50 group-hover:from-primary/20 group-hover:to-primary/20
                              transition-colors duration-300 flex items-center justify-center mb-4">
            <BusIcon className="h-8 w-8  " />
          </div>
          <p className="text-lg font-medium text-muted-foreground">No active buses found</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for updates</p>
        </div>
      )
    }

    return buses.map((bus) => {
      const distance = userLocation ? calculateDistance(userLocation, bus.location) : null

      return (
        <motion.div
          key={bus.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onBusSelect(bus)}
          className={cn(
            "group relative cursor-pointer rounded-2xl border bg-gradient-to-br",
            "from-background/50 to-background/30 backdrop-blur-sm p-4",
            "hover:shadow-[0_8px_16px_rgb(0_0_0/0.08)] dark:hover:shadow-[0_8px_16px_rgb(0_0_0/0.25)]",
            "hover:border-[#FF7A5C]/30 transition-all duration-300 ease-out",
            selectedBus?.id === bus.id && [
              "border-[#FF7A5C]/40",
              "shadow-[0_0_0_1px_rgba(255,122,92,0.2),0_8px_16px_rgb(0_0_0/0.08)]",
              "dark:shadow-[0_0_0_1px_rgba(255,122,92,0.2),0_8px_16px_rgb(0_0_0/0.25)]",
              "bg-gradient-to-br from-[#FF7A5C]/5 to-background/30"
            ]
          )}
        >
          {/* Distance Badge */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium rounded-lg",
                distance ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                "bg-[#FF7A5C]/10 text-[#FF7A5C] border-[#FF7A5C]/20"
              )}
            >
              {distance ? `${distance.toFixed(1)} km away` : 'Active'}
            </Badge>
          </div>

          {/* Bus Info */}
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2.5 rounded-xl shrink-0",
              "bg-gradient-to-br from-[#FF7A5C]/10 to-[#F24E1E]/10",
              "border border-[#FF7A5C]/20 group-hover:border-[#FF7A5C]/30",
              "transition-colors duration-300"
            )}>
              {getBusTypeIcon(bus.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold tracking-tight">Bus #{bus.number}</h3>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs capitalize",
                    bus.type === 'student' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    bus.type === 'teacher' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                    bus.type === 'staff' && "bg-orange-500/10 text-orange-500 border-orange-500/20"
                  )}
                >
                  {bus.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 truncate">
                <RouteIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{bus.route}</span>
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDistanceToNow(bus.estimatedArrival, { addSuffix: true })}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )
    })
  }, [buses, selectedBus, onBusSelect, userLocation])

  return (
    <div className="space-y-4">
      {busListItems}
    </div>
  )
}

// Helper function to get bus type icon
const getBusTypeIcon = (type: string) => {
  switch(type) {
    case 'student':
      return <GraduationCap className="h-5 w-5" />
    case 'teacher':
      return <UserCircle className="h-5 w-5" />
    case 'staff':
      return <Building2 className="h-5 w-5" />
    default:
      return <BusIcon className="h-5 w-5" />
  }
}