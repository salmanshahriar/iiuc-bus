"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { Badge } from "../ui/badge"

interface BusCardProps {
  bus: {
    busId: number
    busNo: string
    vehicleId: string
    capacity: number
    startPoint: string
    endPoint: string
    routeName: string
    scheduleDate: string // Add this field from API response
    scheduleTime: string
    busType: string
    additionalInfo: string | null // Add this field from API response
  }
}

export function BusCard({ bus }: BusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-4 rounded-xl border bg-gradient-to-br from-background/50 to-background/30"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">Bus #{bus.busNo}</h3>
          <p className="text-sm text-muted-foreground">{bus.routeName}</p>
        </div>
        <Badge 
          variant="outline"
          className="bg-[var(--primary-color)]/10 text-[var(--text-color)] border-[var(--primary-color)]/20"
        >
          {bus.busType}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>{bus.scheduleDate} at {bus.scheduleTime}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Route</p>
          <p>{bus.startPoint} → {bus.endPoint}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Capacity</p>
          <p>{bus.capacity} seats</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vehicle ID</p>
          <p>{bus.vehicleId}</p>
        </div>
        {bus.additionalInfo && (
          <div>
            <p className="text-muted-foreground">Additional Info</p>
            <p>{bus.additionalInfo}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}