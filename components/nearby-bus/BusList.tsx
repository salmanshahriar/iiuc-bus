import type React from "react"
import type { Bus } from "@/types/bus"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BusListProps {
  buses: Bus[]
  onBusSelect: (bus: Bus) => void
  selectedBus: Bus | null
  trackSelectedBus: boolean
}

export const BusList: React.FC<BusListProps> = ({ buses, onBusSelect, selectedBus, trackSelectedBus }) => {
  return (
    <div className="space-y-2">
      {buses.map((bus) => (
        <Card
          key={bus.vehicleID}
          className={`cursor-pointer transition-all duration-200 ${
            selectedBus?.vehicleID === bus.vehicleID
              ? "border-primary/50 bg-primary/5"
              : "hover:border-primary/30 hover:bg-primary/5"
          }`}
          onClick={() => onBusSelect(bus)}
        >
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold">Bus ID: {bus.vehicleID}</h3>
              {selectedBus?.vehicleID === bus.vehicleID && trackSelectedBus && (
                <Badge variant="outline" className="text-xs">
                  Tracking
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Speed: {bus.speed} km/h</p>
            <p className="text-xs text-muted-foreground">Distance: {bus.distance} km</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

