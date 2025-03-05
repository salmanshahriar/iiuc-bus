"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BusSearch } from "@/components/home/BusSearch"
import { BusCard } from "@/components/home/BusCard"
import { Clock, MapPin, Route, Search, Bus } from "lucide-react"

interface Bus {
  busId: number
  busNo: number
  vehicleId: string
  capacity: number
  driverName: string
  driverPhone: string
  helperName: string
  helperPhone: string
  startPoint: string
  endPoint: string
  routeName: string
  scheduleDate: string
  scheduleTime: string
  busType: string
  gender: string | null
  additionalInfo: string | null
}

const features = [
  {
    title: "Live Tracking",
    description: "Track your bus in real-time with accurate GPS location updates.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    title: "Schedule Updates",
    description: "Get instant updates about bus timings and route changes.",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    title: "Route Information",
    description: "View detailed bus routes and estimated arrival times.",
    icon: <Route className="w-5 h-5" />,
  },
  {
    title: "Lost & Found",
    description: "Report or find lost items from university buses.",
    icon: <Search className="w-5 h-5" />,
  },
]

export default function Home() {
  const [liveBusData, setLiveBusData] = useState<Bus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const fetchLiveBusSchedules = async (params: { from: string; to: string; date: string }) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/find-LiveSchedule?date=${params.date}&from=${params.from}&to=${params.to}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !Array.isArray(data.availableBusesAndRoutes)) {
        throw new Error("Invalid data format received from API")
      }

      setLiveBusData(data.availableBusesAndRoutes)
      setShowResults(true)
    } catch (error) {
      console.error("Fetch Error:", error)
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred while fetching bus schedules"
      )
      setLiveBusData([])
    } finally {
      setIsLoading(false)
    }
  }

  const AvailableBusesSection = () => (
    <div className="flex-1 flex flex-col mb-20 md:mb-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-4 py-6 sm:px-6 sm:py-6 glass-effect border-b "
      >
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
            Available Buses
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {isLoading
            ? "Searching for buses..."
            : errorMessage
            ? "No schedules available"
            : `Found ${liveBusData.length} ${liveBusData.length === 1 ? "bus" : "buses"}`}
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 bg-background">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bus className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">{errorMessage}</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Try a different route or date</p>
          </div>
        ) : liveBusData.length > 0 ? (
          <div className="space-y-4">
            {liveBusData.map((bus) => (
              <BusCard key={bus.busId} bus={bus} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bus className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-muted-foreground">No buses found</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )

  const FeaturesList = () => (
    <motion.div
      key="features"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-4rem)] flex flex-col"
    >
      <div className="px-6 py-8 lg:px-8 border-b">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
            Features
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">Tools for tracking your bus</p>
      </div>

      <div className="flex-1 grid grid-cols-1 content-center gap-4 p-6 lg:p-8 bg-background">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative border hover:border-primary/40 rounded-md transition-all duration-300 card-hover-effect"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="shrink-0 p-6 rounded-xl border border-primary/50 bg-primary/15">
                {feature.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-base tracking-tight text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="md:h-[calc(100vh-4rem)] bg-background">
      {/* Mobile View */}
      <div className="block md:hidden overflow-auto bg-background h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold mt-4 mb-2 tracking-tight text-foreground">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
                IIUC Bus Tracker
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">Real-time university bus tracking</p>
          </motion.section>

          <BusSearch onSearch={fetchLiveBusSchedules} />

          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <AvailableBusesSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex h-full overflow-hidden bg-background">
        <div className="flex-1 flex items-center justify-center px-16 bg-background">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
                  IIUC BUS TRACKER
                </span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Real-time tracking for IIUC buses
              </p>
            </div>

            <BusSearch onSearch={fetchLiveBusSchedules} />
          </div>
        </div>

        <div className="w-[440px] h-full border-l bg-background">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <FeaturesList />
            ) : (
              <motion.div
                key="results"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="h-full flex flex-col"
              >
                <AvailableBusesSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}