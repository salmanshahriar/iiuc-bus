"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Search, MapPin, AlertCircle, Clock, User, Navigation, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { DatePicker } from "@/components/ui/date-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchScheduleSuggestions } from "@/utils/api"

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
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)

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
      setFromOpen(false)
      setValidationError(validateSelection("", to))
    } else {
      setTo("")
      setToOpen(false)
      setValidationError(validateSelection(from, ""))
    }
  }

  return (
    <div className="space-y-4 p-6 bg-background/60 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-lg">
      <div className="grid gap-4">
        {/* From */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/80">
            <Navigation className="h-3.5 w-3.5" /> From
          </label>
          <Command>
            <div className="relative">
              <CommandInput
                placeholder="Departure location..."
                value={from}
                onValueChange={(value) => {
                  setFrom(value)
                  setFromOpen(true)
                  setValidationError(validateSelection(value, to))
                }}
                onFocus={() => setFromOpen(true)}
                onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                className="h-12 bg-background/60 rounded-xl border-border/50 text-sm pr-10"
              />
              {from && (
                <button
                  onClick={() => clearInput("from")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {fromOpen && startPoints.length > 0 && (
              <CommandList className="absolute z-10 top-14 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                <CommandEmpty>No locations found</CommandEmpty>
                {startPoints
                  .filter((point) => from ? point.toLowerCase().includes(from.toLowerCase()) : true)
                  .map((point) => (
                    <CommandItem
                      key={point}
                      value={point}
                      onSelect={(value) => {
                        setFrom(value)
                        setFromOpen(false)
                        setValidationError(validateSelection(value, to))
                      }}
                      className="cursor-pointer hover:bg-accent"
                    >
                      {point}
                    </CommandItem>
                  ))}
              </CommandList>
            )}
          </Command>
        </div>

        {/* To */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/80">
            <MapPin className="h-3.5 w-3.5" /> To
          </label>
          <Command>
            <div className="relative">
              <CommandInput
                placeholder="Destination location..."
                value={to}
                onValueChange={(value) => {
                  setTo(value)
                  setToOpen(true)
                  setValidationError(validateSelection(from, value))
                }}
                onFocus={() => setToOpen(true)}
                onBlur={() => setTimeout(() => setToOpen(false), 200)}
                className="h-12 bg-background/60 rounded-xl border-border/50 text-sm pr-10"
              />
              {to && (
                <button
                  onClick={() => clearInput("to")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {toOpen && endPoints.length > 0 && (
              <CommandList className="absolute z-10 top-14 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                <CommandEmpty>No locations found</CommandEmpty>
                {endPoints
                  .filter((point) => to ? point.toLowerCase().includes(to.toLowerCase()) : true)
                  .map((point) => (
                    <CommandItem
                      key={point}
                      value={point}
                      onSelect={(value) => {
                        setTo(value)
                        setToOpen(false)
                        setValidationError(validateSelection(from, value))
                      }}
                      className="cursor-pointer hover:bg-accent"
                    >
                      {point}
                    </CommandItem>
                  ))}
              </CommandList>
            )}
          </Command>
        </div>

        {/* Validation Error */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-destructive p-4 rounded-xl bg-destructive/10"
            >
              <AlertCircle className="h-4 w-4" />
              {validationError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/80">
            <Clock className="h-3.5 w-3.5" /> Date
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
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-sm"
              onClick={handleSearch}
              disabled={isSearching || !from || !to || !!validationError}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" /> Search Buses
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!from || !to ? "Select both locations" : validationError ? validationError : "Search available buses"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Footer */}
      <div className="pt-4 flex justify-between text-xs text-muted-foreground/60 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Updated: {format(new Date(currentDateTime), "HH:mm:ss")}
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {userLogin}
        </div>
      </div>
    </div>
  )
}