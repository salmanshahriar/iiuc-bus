"use client"

import { Bus, Check, X, AlertCircle, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React, { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { fetchScheduleSuggestions } from "@/utils/api"
import useDebounce from "@/hooks/use-debounce"

interface Schedule {
  id: number
  scheduleName: string
  route: string
  startPoint: string
  endPoint: string
  time: string
  scheduleType: string
}

interface ScheduleViewProps {
  schedules: Schedule[]
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  const date = new Date(2025, 0, 1, Number.parseInt(hours), Number.parseInt(minutes))
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

export default function ScheduleView({ schedules }: ScheduleViewProps) {
  if (!Array.isArray(schedules)) {
    return (
      <div className="container mx-auto py-4 text-center text-red-500">
        Error: Invalid schedule data received.
      </div>
    )
  }

  const [direction, setDirection] = useState<"to" | "from">("to")
  const [startPoints, setStartPoints] = useState<string[]>([])
  const [endPoints, setEndPoints] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false) // Explicit focus state
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState("all")
  const [validationError, setValidationError] = useState("")
  const [searchError, setSearchError] = useState("")
  const debouncedInputValue = useDebounce(inputValue, 200)
  const filterRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function getScheduleSuggestions() {
      try {
        const data = await fetchScheduleSuggestions()
        setStartPoints(data.startPoints || [])
        setEndPoints(data.endPoints || [])
      } catch (error) {
        console.error("Failed to fetch schedule suggestions:", error)
        setSearchError("Failed to load location suggestions.")
      }
    }
    getScheduleSuggestions()
  }, [])

  // Handle clicks outside to unfocus input and close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setIsInputFocused(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesDirection =
        direction === "to"
          ? !schedule.startPoint.toLowerCase().includes("university") &&
            !schedule.startPoint.toLowerCase().includes("iiuc")
          : schedule.startPoint.toLowerCase().includes("university") ||
            schedule.startPoint.toLowerCase().includes("iiuc")
      const matchesInput = !debouncedInputValue || 
        (direction === "to" 
          ? schedule.startPoint.toLowerCase().includes(debouncedInputValue.toLowerCase())
          : schedule.endPoint.toLowerCase().includes(debouncedInputValue.toLowerCase()))
      const matchesType = scheduleTypeFilter === "all" || schedule.scheduleType === scheduleTypeFilter
      return matchesDirection && matchesInput && matchesType
    })
  }, [schedules, direction, debouncedInputValue, scheduleTypeFilter])

  const clearInput = () => {
    setInputValue("")
    setValidationError("")
    setIsDropdownOpen(false)
    setIsInputFocused(true) // Refocus input after clearing
    inputRef.current?.focus()
  }

  const validateSelection = (value: string) => {
    if (direction === "to" && value.toLowerCase() === "university") {
      return "Start point cannot be University when going to University."
    }
    if (direction === "from" && value.toLowerCase() === "university") {
      return "End point cannot be University when coming from University."
    }
    return ""
  }

  const handleDirectionChange = (newDirection: "to" | "from") => {
    setDirection(newDirection)
    setInputValue("")
    setValidationError("")
    setIsDropdownOpen(false)
    setIsInputFocused(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setValidationError(validateSelection(newValue))
    setIsDropdownOpen(true)
  }

  const handleOptionSelect = (option: string) => {
    setInputValue(option)
    setIsDropdownOpen(false)
    setIsInputFocused(false) // Unfocus input after selection
    setValidationError(validateSelection(option))
    inputRef.current?.blur()
  }

  const handleFocus = () => {
    setIsInputFocused(true)
    setIsDropdownOpen(true)
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

  const FilterSection = () => (
    <div className="space-y-3 mb-4">
       <div className="m-0 md:mb-6 hidden md:block ">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-[var(--primary-color)]" />
            <h1 className="text-2xl font-bold">Bus Schedule</h1>
          </div>
          <p className="text-muted-foreground">View all IIUC bus schedules and routes</p>
        </div>
      {/* Buttons in a row */}
      <div className="flex flex-row gap-2 mb-4">
        <Button
          variant="secondary"
          className={`flex-1 h-12 text-sm bg-[#303035] hover:bg-primary/80 text-white rounded-lg flex items-center justify-center gap-2 ${direction === "to" ? " bg-primary" : ""}`}
          onClick={() => handleDirectionChange("to")}
        >
          <Bus className="h-5 w-5" />
          To University
        </Button>
        <Button
          variant="secondary"
          className={`flex-1 h-12 text-sm bg-[#303035] hover:bg-primary/80 text-white rounded-lg flex items-center justify-center gap-2 ${direction === "from" ? " bg-primary" : ""}`}
          onClick={() => handleDirectionChange("from")}
        >
          <Check className="h-5 w-5" />
          From University
        </Button>
      </div>

      {/* Filter div with border and title */}
      <div className="border rounded-md p-4">
        <h3 className="text-sm font-medium mb-2">Filter</h3>
        <div className="flex flex-col gap-3">
          <div ref={filterRef} className="relative">
            <div className="relative">
              <Input
                ref={inputRef}
                placeholder={direction === "to" ? "Start Point..." : "End Point..."}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                className="h-10 pr-10 pl-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-0"
              />
              {inputValue && (
                <button
                  onClick={clearInput}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="absolute top-12 w-full bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg mt-2 z-20 max-h-48 overflow-y-auto"
                >
                  <motion.ul>
                    {(direction === "to" ? startPoints : endPoints).length === 0 ? (
                      <motion.li
                        variants={itemVariants}
                        className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        No locations found
                      </motion.li>
                    ) : (
                      (direction === "to" ? startPoints : endPoints)
                        .filter((option) =>
                          debouncedInputValue ? option.toLowerCase().includes(debouncedInputValue.toLowerCase()) : true
                        )
                        .map((option) => (
                          <motion.li
                            key={option}
                            variants={itemVariants}
                            className="px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors duration-150"
                            onClick={() => handleOptionSelect(option)}
                          >
                            {direction === "to" ? (
                              <Bus className="h-4 w-4 text-primary " />
                            ) : (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            <span className="text-sm font-medium">
                              {option}
                            </span>
                          </motion.li>
                        ))
                    )}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Select value={scheduleTypeFilter} onValueChange={setScheduleTypeFilter}>
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="Schedule Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Regular Schedule">Regular</SelectItem>
              <SelectItem value="Residential Schedule">Residential</SelectItem>
              <SelectItem value="Friday Schedule">Friday</SelectItem>
              <SelectItem value="Library Schedule">Library</SelectItem>
              <SelectItem value="Exam Schedule">Exam</SelectItem>
              <SelectItem value="Special Schedule">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error messages */}
      <AnimatePresence>
        {(validationError || searchError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-xs text-destructive p-2 rounded-md bg-destructive/10"
          >
            <AlertCircle className="h-3 w-3" />
            <span>{validationError || searchError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const MobileView = () => (
    <div className="grid grid-rows-[auto_1fr] min-h-[calc(100vh-2rem)] px-4">
      <div>
        <FilterSection />
      </div>
      {filteredSchedules.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No bus schedules available.
        </div>
      ) : (
        <ScrollArea className="overflow-auto">
          <div className="space-y-3 pb-4">
            {filteredSchedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm truncate">{schedule.scheduleName}</h3>
                      <span className="text-sm font-medium whitespace-nowrap">{formatTime(schedule.time)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="truncate">Route: {schedule.route}</div>
                      <div className="space-y-1">
                        <div className="truncate">From: {schedule.startPoint}</div>
                        <div className="truncate">To: {schedule.endPoint}</div>
                      </div>
                      <div className="pt-1 border-t truncate">{schedule.scheduleType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )

  const DesktopView = () => (
    <div className="space-y-6 px-4">
      <FilterSection />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Schedule Name</TableHead>
              <TableHead className="text-sm">Route</TableHead>
              <TableHead className="text-sm">Time</TableHead>
              <TableHead className="text-sm">Start Point</TableHead>
              <TableHead className="text-sm">End Point</TableHead>
              <TableHead className="text-sm">Schedule Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="truncate text-sm">{schedule.scheduleName}</TableCell>
                <TableCell className="truncate text-sm">{schedule.route}</TableCell>
                <TableCell className="text-sm">{formatTime(schedule.time)}</TableCell>
                <TableCell className="truncate text-sm">{schedule.startPoint}</TableCell>
                <TableCell className="truncate text-sm">{schedule.endPoint}</TableCell>
                <TableCell className="truncate text-sm">{schedule.scheduleType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <div className="">
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </div>
  )
}