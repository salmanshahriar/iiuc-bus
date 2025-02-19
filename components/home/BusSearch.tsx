"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Search, MapPin, School, AlertCircle, Clock, User, Navigation } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAPI } from "@/contexts/APIContext"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "../ui/date-picker"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BusSearchProps {
  onSearch: () => void
  currentDateTime: string
  userLogin: string
}

const LOCATIONS = [
  { value: "University", label: "University", isUniversity: true },
  { value: "GEC", label: "GEC", isUniversity: false },
  { value: "Agrabad", label: "Agrabad", isUniversity: false },
  { value: "2 No. Gate", label: "2 No. Gate", isUniversity: false },
  { value: "Muradpur", label: "Muradpur", isUniversity: false },
  { value: "AK Khan", label: "AK Khan", isUniversity: false },
] as const

export function BusSearch({ onSearch, currentDateTime, userLogin }: BusSearchProps) {
  const { fetchLiveBusSchedules } = useAPI()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [isSearching, setIsSearching] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Validation logic remains the same
  const validateSelection = (fromVal: string, toVal: string) => {
    if (!fromVal || !toVal) return null
    if (fromVal === toVal) return "Cannot select the same location"
    if (fromVal === "University" && toVal === "University") 
      return "Cannot select University for both locations"
    if (fromVal !== "University" && toVal !== "University") 
      return "One location must be University"
    return null
  }

  const handleFromChange = (value: string) => {
    setFrom(value)
    const error = validateSelection(value, to)
    setValidationError(error)
  }

  const handleToChange = (value: string) => {
    setTo(value)
    const error = validateSelection(from, value)
    setValidationError(error)
  }

  const handleSearch = async () => {
    if (!from || !to || !date) return
    
    const error = validateSelection(from, to)
    if (error) {
      setValidationError(error)
      return
    }

    setIsSearching(true)
    try {
      await fetchLiveBusSchedules({
        from,
        to,
        date: format(date, 'yyyy-MM-dd')
      })
      onSearch()
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const renderLocationItems = () => {
    const sortedLocations = [...LOCATIONS].sort((a, b) => {
      if (a.isUniversity) return -1
      if (b.isUniversity) return 1
      return a.label.localeCompare(b.label)
    })

    return sortedLocations.map((location) => (
      <SelectItem 
        key={location.value} 
        value={location.value}
        className="group"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            {location.isUniversity ? (
              <School className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground group-hover:scale-110 transition-transform duration-200" />
            )}
          </div>
          <span className={`${location.isUniversity ? 'text-primary font-medium' : ''} 
            group-hover:text-primary transition-colors duration-200`}>
            {location.label}
          </span>
        </div>
      </SelectItem>
    ))
  }

  return (
    <div className="relative space-y-4 p-3 sm:p-6 md:p-8 
      bg-background/60 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-border/50 
      shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] 
      hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)]
      transition-all duration-500 ease-out">
      
      <div className="grid gap-3 sm:gap-5">
        {/* Route Selection */}
        <div className="grid gap-2 sm:gap-4 sm:grid-cols-2">
          {/* From Location */}
          <div className="group space-y-1">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
              <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              From
            </label>
            <Select value={from} onValueChange={handleFromChange}>
              <SelectTrigger className="h-10 sm:h-12 bg-background/60 backdrop-blur-sm rounded-lg sm:rounded-xl 
                border-border/50 text-sm
                shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] 
                group-hover:shadow-[0_4px_20px_-4px_rgba(242,78,30,0.15)]
                transition-all duration-300">
                <SelectValue placeholder="Select departure" />
              </SelectTrigger>
              <SelectContent className="rounded-lg sm:rounded-xl border-border/50 
                shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)]
                max-h-[240px] overflow-y-auto">
                {renderLocationItems()}
              </SelectContent>
            </Select>
          </div>

          {/* To Location */}
          <div className="group space-y-1">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              To
            </label>
            <Select value={to} onValueChange={handleToChange}>
              <SelectTrigger className="h-10 sm:h-12 bg-background/60 backdrop-blur-sm rounded-lg sm:rounded-xl 
                border-border/50 text-sm
                shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]
                group-hover:shadow-[0_4px_20px_-4px_rgba(242,78,30,0.15)]
                transition-all duration-300">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="rounded-lg sm:rounded-xl border-border/50 
                shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)]
                max-h-[240px] overflow-y-auto">
                {renderLocationItems()}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Validation Error Message */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-destructive p-2 sm:p-4 rounded-lg sm:rounded-xl 
                bg-destructive/8 border border-destructive/15">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="leading-tight">{validationError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Picker */}
        <div className="group space-y-1">
          <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground/80 ml-1">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Date
          </label>
          <DatePicker
            date={date}
            onDateChange={(newDate) => {
              if (newDate) {
                setDate(newDate)
              }
            }}
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
          />
        </div>
      </div>

      {/* Search Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] 
                  hover:from-[var(--gradient-from)]/50 hover:to-[--gradient-to)]/50 hover:opacity-90
                  shadow-[0_4px_20px_-4px_rgba(242,78,30,0.3)]
                  hover:shadow-[0_4px_28px_-4px_rgba(242,78,30,0.45)]
                  active:scale-[0.98]
                  transition-all duration-300 group relative text-sm"
                onClick={handleSearch}
                disabled={isSearching || !from || !to || !!validationError}
              >
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Search Buses</span>
                  </div>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-background/80 backdrop-blur-lg border-border/50 text-xs sm:text-sm"
          >
            {!from || !to ? (
              <p>Please select both locations</p>
            ) : validationError ? (
              <p>{validationError}</p>
            ) : (
              <p>Search for available buses</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Status Footer */}
      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 
        text-[10px] sm:text-xs text-muted-foreground/60 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Updated: {format(new Date("2025-02-09 13:35:08"), "HH:mm:ss")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>{userLogin}</span>
        </div>
      </div>
    </div>
  )
}