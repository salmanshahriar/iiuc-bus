"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Search, MapPin, AlertCircle, Clock, User, Navigation, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchScheduleSuggestions } from "@/utils/api"
import useDebounce from "@/hooks/use-debounce"

interface BusSearchProps {
  onSearch: (params: { from: string; to: string; date: string }) => Promise<void>
  currentDateTime: string
  userLogin: string
}

export function BusSearch({ onSearch, currentDateTime, userLogin }: BusSearchProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState<Date>(() => new Date().setHours(0, 0, 0, 0) && new Date())
  const [startPoints, setStartPoints] = useState<string[]>([])
  const [endPoints, setEndPoints] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [fromFocused, setFromFocused] = useState(false)
  const [toFocused, setToFocused] = useState(false)
  const debouncedFrom = useDebounce(from, 200)
  const debouncedTo = useDebounce(to, 200)
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const data = await fetchScheduleSuggestions()
        setStartPoints(data.startPoints || [])
        setEndPoints(data.endPoints || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
    }
    getSuggestions()
  }, [])

  const validateSelection = (fromVal: string, toVal: string) => {
    if (!fromVal || !toVal) return null
    if (fromVal === toVal) return "Start and end points cannot be the same"
    if (fromVal === "University" && toVal === "University") return "Cannot select University for both locations"
    if (fromVal !== "University" && toVal !== "University") return "One location must be University"
    return null
  }

  const handleSearch = async () => {
    if (!from || !to || !date) return

    const error = validateSelection(from, to)
    if (error) {
      setValidationError(error)
      return
    }

    setIsSearching(true)
    setValidationError(null)
    try {
      await onSearch({ from, to, date: format(date, "yyyy-MM-dd") })
    } catch (error) {
      console.error("Search error:", error)
      setValidationError("Failed to fetch schedules. Try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const clearInput = (type: "from" | "to") => {
    if (type === "from") {
      setFrom("")
      setFromFocused(false)
      setValidationError(validateSelection("", to))
    } else {
      setTo("")
      setToFocused(false)
      setValidationError(validateSelection(from, ""))
    }
  }

  const handleFromBlur = () => {
    setTimeout(() => {
      if (!fromRef.current?.contains(document.activeElement)) {
        setFromFocused(false)
      }
    }, 200)
  }

  const handleToBlur = () => {
    setTimeout(() => {
      if (!toRef.current?.contains(document.activeElement)) {
        setToFocused(false)
      }
    }, 200)
  }

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.3 }, staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.2 }, opacity: { duration: 0.1 } },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.1 } },
  }

  return (
    <div className="space-y-5 p-6 glass-effect rounded-xl border shadow-lg premium-wide-shadow">
      <div className="grid gap-5">
        {/* From */}
        <div ref={fromRef} className="relative" onBlur={handleFromBlur}>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            <Navigation className="h-4 w-4 text-primary" /> From
          </label>
          <div className="relative">
            <Input
              placeholder="Departure location..."
              value={from}
              onChange={(e) => {
                setFrom(e.target.value)
                setValidationError(validateSelection(e.target.value, to))
              }}
              onFocus={() => setFromFocused(true)}
              className="h-12 pr-10 pl-4 text-sm rounded-xl border border-border/80 bg-background/50 text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
            />
            {from && (
              <button
                onClick={() => clearInput("from")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {fromFocused && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute top-20 w-full glass-effect rounded-lg shadow-lg mt-2 z-20 max-h-64 overflow-y-auto"
              >
                <motion.ul>
                  {startPoints.length === 0 ? (
                    <motion.li
                      variants={itemVariants}
                      className="px-4 py-2 text-sm text-muted-foreground"
                    >
                      No locations found
                    </motion.li>
                  ) : (
                    startPoints
                      .filter((point) =>
                        debouncedFrom ? point.toLowerCase().includes(debouncedFrom.toLowerCase()) : true
                      )
                      .map((point) => (
                        <motion.li
                          key={point}
                          variants={itemVariants}
                          className="px-4 py-2 flex items-center gap-3 hover:bg-primary/10 cursor-pointer transition-colors duration-150"
                          onClick={() => {
                            setFrom(point)
                            setFromFocused(false)
                            setValidationError(validateSelection(point, to))
                          }}
                        >
                          <Navigation className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{point}</span>
                        </motion.li>
                      ))
                  )}
                </motion.ul>
                <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
                  Select a starting point
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* To */}
        <div ref={toRef} className="relative" onBlur={handleToBlur}>
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
            <MapPin className="h-4 w-4 text-primary" /> To
          </label>
          <div className="relative">
            <Input
              placeholder="Destination location..."
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                setValidationError(validateSelection(from, e.target.value))
              }}
              onFocus={() => setToFocused(true)}
              className="h-12 pr-10 pl-4 text-sm rounded-xl border border-border/80 bg-background/50 text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
            />
            {to && (
              <button
                onClick={() => clearInput("to")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {toFocused && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute top-20 w-full glass-effect rounded-lg shadow-lg mt-2 z-20 max-h-64 overflow-y-auto"
              >
                <motion.ul>
                  {endPoints.length === 0 ? (
                    <motion.li
                      variants={itemVariants}
                      className="px-4 py-2 text-sm text-muted-foreground"
                    >
                      No locations found
                    </motion.li>
                  ) : (
                    endPoints
                      .filter((point) =>
                        debouncedTo ? point.toLowerCase().includes(debouncedTo.toLowerCase()) : true
                      )
                      .map((point) => (
                        <motion.li
                          key={point}
                          variants={itemVariants}
                          className="px-4 py-2 flex items-center gap-3 hover:bg-primary/10 cursor-pointer transition-colors duration-150"
                          onClick={() => {
                            setTo(point)
                            setToFocused(false)
                            setValidationError(validateSelection(from, point))
                          }}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{point}</span>
                        </motion.li>
                      ))
                  )}
                </motion.ul>
                <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground">
                  Select a destination
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Validation Error */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-destructive p-4 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4" />
              {validationError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-primary" /> Date
          </label>
          <DatePicker
            date={date}
            onDateChange={(newDate) => newDate && setDate(newDate)}
            disabled={(d) => d < new Date().setHours(0, 0, 0, 0)}
          />
        </div>
      </div>

      {/* Search Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-primary-foreground text-sm font-medium hover:brightness-110 transition-all duration-200"
              onClick={handleSearch}
              disabled={isSearching || !from || !to || !!validationError}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" /> Search Buses
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-muted text-foreground">
            {!from || !to ? "Select both locations" : validationError ? validationError : "Search available buses"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Footer */}
      <div className="hidden pt-4 md:flex justify-between text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Beta 0.1
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          user
        </div>
      </div>
    </div>
  )
}