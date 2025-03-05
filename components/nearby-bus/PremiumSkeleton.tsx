
import type React from "react"
import { useState, useEffect } from "react"
import type { Bus } from "@/types/bus"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshIndicator } from "@/components/ui/refresh-indicator"

interface BusListProps {
  buses: Bus[]
  onBusSelect: (bus: Bus) => void
  selectedBus: Bus | null
  trackSelectedBus: boolean
  isRefreshing?: boolean
}

export const BusList: React.FC<BusListProps> = ({ 
  buses, 
  onBusSelect, 
  selectedBus, 
  trackSelectedBus,
  isRefreshing = false
}) => {
  const [prevBuses, setPrevBuses] = useState<Bus[]>([])
  const [busTransition, setBusTransition] = useState(false)
  
  useEffect(() => {
    if (JSON.stringify(buses) !== JSON.stringify(prevBuses)) {
      setBusTransition(true)
      const timer = setTimeout(() => {
        setPrevBuses(buses)
        setBusTransition(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [buses, prevBuses])

  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  }

  return (
    <div className="relative space-y-2">
      {isRefreshing && <RefreshIndicator isRefreshing={isRefreshing} variant="subtle" />}
      
      <AnimatePresence>
        {buses.map((bus, index) => (
          <motion.div
            key={bus.vehicleID}
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={staggerVariants}
            layoutId={bus.vehicleID}
            className="transform-gpu"
          >
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                selectedBus?.vehicleID === bus.vehicleID
                  ? "border-primary/50 bg-primary/5 shadow-md"
                  : "hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
              }`}
              onClick={() => onBusSelect(bus)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold leading-tight">Bus ID: {bus.vehicleID}</h3>
                  {selectedBus?.vehicleID === bus.vehicleID && trackSelectedBus && (
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary animate-pulse-subtle">
                      Tracking
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block w-16">Speed:</span> 
                    <span className="font-medium text-foreground">{bus.speed} km/h</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span className="inline-block w-16">Distance:</span> 
                    <span className="font-medium text-foreground">{bus.distance} km</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {buses.length === 0 && !isRefreshing && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="text-center py-6 text-sm text-muted-foreground"
        >
          No buses found in your area
        </motion.div>
      )}
    </div>
  );
};
