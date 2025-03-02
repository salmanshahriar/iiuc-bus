"use client"

import { Bus, Check, X, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React, { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchScheduleSuggestions } from "@/utils/api"

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
  const [direction, setDirection] = useState<"to" | "from">("to")
  const [startPoints, setStartPoints] = useState<string[]>([])
  const [endPoints, setEndPoints] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState("all")
  const [validationError, setValidationError] = useState("")
  const [searchError, setSearchError] = useState("")

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

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesDirection =
        direction === "to"
          ? !schedule.startPoint.toLowerCase().includes("university") &&
            !schedule.startPoint.toLowerCase().includes("iiuc")
          : schedule.startPoint.toLowerCase().includes("university") ||
            schedule.startPoint.toLowerCase().includes("iiuc")
      const matchesInput = !inputValue || 
        (direction === "to" 
          ? schedule.startPoint.toLowerCase().includes(inputValue.toLowerCase())
          : schedule.endPoint.toLowerCase().includes(inputValue.toLowerCase()))
      const matchesType = scheduleTypeFilter === "all" || schedule.scheduleType === scheduleTypeFilter
      return matchesDirection && matchesInput && matchesType
    })
  }, [schedules, direction, inputValue, scheduleTypeFilter])

  const clearInput = () => {
    setInputValue("")
    setValidationError("")
    setIsDropdownOpen(false)
    if (inputRef.current) inputRef.current.focus()
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsDropdownOpen(true)
    setValidationError(validateSelection(newValue))
  }

  const handleOptionSelect = (option: string) => {
    setInputValue(option)
    setIsDropdownOpen(false)
    setValidationError(validateSelection(option))
  }

  const FilterSection = () => (
    <div className="space-y-3 mb-4">
      {/* Buttons in a row */}
      <div className="flex flex-row gap-2 mb-4">
        <Button
          variant="secondary"
          className={`flex-1 h-12 text-sm bg-[#2c3e50] text-white hover:bg-[#34495e] rounded-lg flex items-center justify-center gap-2 ${direction === "to" ? "ring-2 ring-primary" : ""}`}
          onClick={() => handleDirectionChange("to")}
        >
          <Bus className="h-5 w-5" />
          To University
        </Button>
        <Button
          variant="secondary"
          className={`flex-1 h-12 text-sm bg-[#2c3e50] text-white hover:bg-[#34495e] rounded-lg flex items-center justify-center gap-2 ${direction === "from" ? "ring-2 ring-primary" : ""}`}
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
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              placeholder={direction === "to" ? "Start Point..." : "End Point..."}
              className="h-10 text-sm w-full pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {inputValue && (
              <button
                onClick={clearInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isDropdownOpen && (direction === "to" ? startPoints : endPoints).length > 0 && (
              <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-auto top-full mt-1">
                {(direction === "to" ? startPoints : endPoints)
                  .filter((option) => inputValue ? option.toLowerCase().includes(inputValue.toLowerCase()) : true)
                  .map((option) => (
                    <div
                      key={option}
                      onMouseDown={() => handleOptionSelect(option)}
                      className="cursor-pointer hover:bg-accent text-sm py-1.5 px-2"
                    >
                      {option}
                    </div>
                  ))}
                {(direction === "to" ? startPoints : endPoints)
                  .filter((option) => inputValue ? option.toLowerCase().includes(inputValue.toLowerCase()) : true).length === 0 && (
                  <div className="text-sm text-muted-foreground p-2">
                    No location found.
                  </div>
                )}
              </div>
            )}
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
    <div className="flex flex-col min-h-screen px-4 space-y-6">
      {/* Filter Section */}
      <FilterSection />

      {/* Table Section */}
      <div className="flex-1">
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
    <div className="container mx-auto py-4">
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </div>
  )
}