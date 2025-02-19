"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { BusList } from "./BusList"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { Bus as BusIcon, Navigation2, ChevronRight, MapPin } from "lucide-react"
import { Badge } from "../ui/badge"
import { useUser } from "@/contexts/UserContext"
import BusTrackerLoading from "./loading"
import { motion, AnimatePresence } from "framer-motion"
import { useAPI } from "@/contexts/APIContext"

// Dynamically import Map component
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <BusTrackerLoading />,
})

export default function BusTracker() {
  const { liveBusData, fetchLiveTrack } = useAPI()
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { translate } = useUser()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          
          if (selectedBus) {
            fetchLiveTrack({
              vehicleID: selectedBus.vehicleId,
              latitude: location.lat,
              longitude: location.lng
            })
          }
        }
      )
    }
  }, [selectedBus])

  return (
    <div className="grid lg:grid-cols-[1fr,410px] h-full">
      {/* Map Container */}
      <div className="relative w-full h-full lg:border bg-background/95 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-50">
            {/* Bus List Button - Mobile & Tablet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden bg-background/95 backdrop-blur-sm shadow-lg rounded-xl 
                    hover:shadow-xl transition-all duration-200 
                    border border-[var(--primary-color)]/20 hover:border-[var(--primary-color)]/40
                    flex items-center gap-2 px-4 py-2.5"
                >
                  <BusIcon className="h-4 w-4 text-[var(var(--text-color))]" />
                  <Badge 
                    variant="secondary" 
                    className="ml-1 bg-[var(--primary-color)]/10 text-[var(--text-color)] border-[var(--primary-color)]/20"
                  >
                    {liveBusData.length}
                  </Badge>
                </Button>
              </SheetTrigger>
              {/* Sheet Content */}
              <SheetContent 
                side="left" 
                className="w-full p-0 bg-background/95 backdrop-blur-lg border-r border-[var(--primary-color)]/20"
              >
                <AnimatePresence>
                  <motion.div 
                    className="h-full flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Sheet content here */}
                    <div className="p-4 md:p-6 border-b border-[#FF7A5C]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--gradient-from)]/20 to-[--gradient-to]/20
                            border border-[#FF7A5C]/20">
                            <BusIcon className="h-5 w-5 text-[var(--primary-color)]" />
                          </div>
                          <div>
                            <h2 className="text-lg md:text-xl font-semibold">
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to]">
                                {translate("activeBuses")}
                              </span>
                            </h2>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-[var(--primary-color)]/10 text-[var(--text-color)] border-[var(--primary-color)]/20"
                        >
                          {liveBusData.length} {translate("active")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                      <BusList 
                        buses={liveBusData} 
                        onBusSelect={(bus) => {
                          setSelectedBus(bus)
                          setIsSheetOpen(false)
                        }}
                        selectedBus={selectedBus}
                        userLocation={userLocation}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </SheetContent>
            </Sheet>
          </div>

          {/* Location Button - Bottom Right */}
          <div className="absolute bottom-4 right-4 z-10">
            {userLocation && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-background/95 backdrop-blur-sm shadow-lg 
                  border border-[#FF7A5C]/20 hover:border-[var(--primary-color)]/40
                  hover:shadow-xl transition-all duration-200
                  flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[var(--primary-color)]" />
              </Button>
            )}
          </div>

          <Map 
            buses={liveBusData} 
            selectedBus={selectedBus}
            userLocation={userLocation}

          />
        </div>
      </div>

      {/* Desktop Active Bus List */}
      <div className="hidden lg:flex flex-col h-full lg:border-l bg-background/95 backdrop-blur-sm">
        <div className="px-6 lg:px-8 py-6 bg-background/50 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
                  {translate("activeBuses")}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {liveBusData.length} {translate("onRoad")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-4">
            <BusList 
              buses={liveBusData}
              onBusSelect={setSelectedBus}
              selectedBus={selectedBus}
              userLocation={userLocation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}