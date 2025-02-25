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

  const currentDateTime = "2025-02-09 14:39:11"
  const userLogin = "user"

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
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !Array.isArray(data.availableBusesAndRoutes)) {
        throw new Error("Invalid data structure received from API")
      }

      setLiveBusData(data.availableBusesAndRoutes)
      setShowResults(true)
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setErrorMessage(
          "Network error: Unable to connect to the server. Please check your internet connection or try again later.",
        )
      } else {
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      }
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
        className="flex-shrink-0 px-4 py-6 sm:px-6 sm:py-6 bg-background/60 backdrop-blur-2xl 
          border-b border-border/40"
      >
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r 
            from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient"
          >
            Available Buses
          </span>
        </h2>
        <p className="text-sm text-muted-foreground/90 mt-2">
          {isLoading
            ? "Searching..."
            : errorMessage
              ? "No schedules available"
              : `Found ${liveBusData.length} ${liveBusData.length === 1 ? "bus" : "buses"} on this route`}
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--gradient-from)]/10 via-[var(--gradient-via)]/10 to-[var(--gradient-to)]/5">
              <Bus className="h-10 w-10 text-[var(--text-color)]/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-6">{errorMessage}</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Try searching for a different route or date</p>
          </div>
        ) : liveBusData.length > 0 ? (
          <div className="space-y-4">
            {liveBusData.map((bus) => (
              <BusCard key={bus.busId} bus={bus} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
              <Bus className="h-10 w-10 text-[var(--text-color)]" />
            </div>
            <p className="text-lg font-medium text-muted-foreground mt-6">No active buses found</p>
            <p className="text-sm text-muted-foreground/80 mt-2">Check back later for updates</p>
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
      <div className="px-6 py-8 lg:px-8 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <h2 className="text-2xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient">
            Features
          </span>
        </h2>
        <p className="text-sm text-muted-foreground/90 mt-2">Everything you need to track your bus</p>
      </div>

      <div className="flex-1 grid grid-cols-1 content-center gap-4 p-6 lg:p-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-background/40 backdrop-blur-2xl rounded-2xl
              border border-border/40 hover:border-primary/30
              transition-all duration-500 ease-out"
          >
            <div
              className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            />

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent
                  border border-border/40 group-hover:from-primary/20 group-hover:to-primary/5
                  transition-colors duration-500 flex items-center justify-center
                  shadow-[0_8px_32px_rgba(0,0,0,0.03)] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                >
                  {feature.icon}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0 py-0.5">
                  <h3 className="font-semibold text-base tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground/90 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="h-nin md:h-[calc(100vh-60px)] bg-gradient-to-br from-background via-background/95 to-background ">
      {/* Mobile View - Allow scrolling */}
      <div className="block md:hidden min-h-screen overflow-auto">
        <div className="p-4 space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold mt-4 mb-2 tracking-tight">
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r 
                from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient"
              >
                IIUC Bus Tracker
              </span>
            </h1>
            <p className="text-sm text-muted-foreground/80">Track university buses in real-time</p>
          </motion.section>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <BusSearch onSearch={fetchLiveBusSchedules} currentDateTime={currentDateTime} userLogin={userLogin} />
          </motion.div>

          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <AvailableBusesSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop View - No scroll */}
      <div className="hidden md:flex h-full overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 flex items-center justify-center px-16">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold leading-tight tracking-tight mb-4">
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r 
                  from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] animate-gradient"
                >
                  IIUC Bus Tracker
                </span>
              </h1>
              <p className="text-xl text-muted-foreground/80 font-light">
                Track IIUC buses in real-time and never miss your ride
              </p>
            </div>

            <BusSearch onSearch={fetchLiveBusSchedules} currentDateTime={currentDateTime} userLogin={userLogin} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[440px] h-full border-l border-border/40">
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

