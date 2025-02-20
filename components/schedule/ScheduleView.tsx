"use client"

import { Bus, Home, Filter, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"

const LOCATIONS = [
  { value: "University", label: "University", isUniversity: true },
  { value: "GEC", label: "GEC", isUniversity: false },
  { value: "Agrabad", label: "Agrabad", isUniversity: false },
  { value: "2No.Gate", label: "2 No. Gate", isUniversity: false },
  { value: "Muradpur", label: "Muradpur", isUniversity: false },
  { value: "AKKhan", label: "AK Khan", isUniversity: false },
  { value: "BOT", label: "BOT", isUniversity: false },
] as const

const SCHEDULE_TYPES = [
  "Regular Schedule",
  "Residential Schedule",
  "Friday Schedule",
  "Library Schedule",
  "Exam Schedule",
  "Special Schedule",
] as const

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
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesDirection =
        direction === "to"
          ? !schedule.startPoint.toLowerCase().includes("university") &&
            !schedule.startPoint.toLowerCase().includes("iiuc")
          : schedule.startPoint.toLowerCase().includes("university") ||
            schedule.startPoint.toLowerCase().includes("iiuc")

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.some(
          (location) => schedule.startPoint.includes(location) || schedule.endPoint.includes(location),
        )

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(schedule.scheduleType)

      return matchesDirection && matchesLocation && matchesType
    })
  }, [schedules, direction, selectedLocations, selectedTypes])

  const FilterDialog = () => {
    const [tempLocations, setTempLocations] = useState<string[]>(selectedLocations)
    const [tempTypes, setTempTypes] = useState<string[]>(selectedTypes)

    const toggleLocation = (value: string) => {
      setTempLocations((prev) => (prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]))
    }

    const toggleType = (value: string) => {
      setTempTypes((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]))
    }

    const handleDone = () => {
      setSelectedLocations(tempLocations)
      setSelectedTypes(tempTypes)
      setIsFilterOpen(false)
    }

    const handleReset = () => {
      setTempLocations([])
      setTempTypes([])
    }

    return (
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
            {(selectedLocations.length > 0 || selectedTypes.length > 0) && (
              <Badge variant="secondary" className="ml-1">
                {selectedLocations.length + selectedTypes.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Schedules</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="locations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="types">Schedule Types</TabsTrigger>
            </TabsList>
            <TabsContent value="locations">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.map((location) => (
                    <Button
                      key={location.value}
                      variant={tempLocations.includes(location.value) ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => toggleLocation(location.value)}
                    >
                      {location.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="types">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="grid grid-cols-2 gap-2">
                  {SCHEDULE_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant={tempTypes.includes(type) ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => toggleType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {tempLocations.map((location) => (
                <Badge key={location} variant="secondary" className="gap-1">
                  {location}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleLocation(location)} />
                </Badge>
              ))}
              {tempTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleType(type)} />
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleDone}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile view
  const MobileView = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={direction === "to" ? "default" : "secondary"}
            className="w-full py-6"
            onClick={() => setDirection("to")}
          >
            <Bus className="mr-2 h-5 w-5" />
            To University
          </Button>
          <Button
            variant={direction === "from" ? "default" : "secondary"}
            className="w-full py-6"
            onClick={() => setDirection("from")}
          >
            <Home className="mr-2 h-5 w-5" />
            From University
          </Button>
        </div>
        <FilterDialog />
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No bus schedules available {direction === "to" ? "to" : "from"} university at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{schedule.scheduleName}</h3>
                    <span className="text-sm font-medium">{formatTime(schedule.time)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Route: {schedule.route}</div>
                    <div className="flex flex-col mt-2">
                      <span>From: {schedule.startPoint}</span>
                      <span>To: {schedule.endPoint}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">{schedule.scheduleType}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Desktop view (table)
  const DesktopView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant={direction === "to" ? "default" : "secondary"} onClick={() => setDirection("to")}>
            <Bus className="mr-2 h-4 w-4" />
            To University
          </Button>
          <Button variant={direction === "from" ? "default" : "secondary"} onClick={() => setDirection("from")}>
            <Home className="mr-2 h-4 w-4" />
            From University
          </Button>
        </div>
        <FilterDialog />
      </div>
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule Name</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Start Point</TableHead>
              <TableHead>End Point</TableHead>
              <TableHead>Schedule Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.scheduleName}</TableCell>
                <TableCell>{schedule.route}</TableCell>
                <TableCell>{formatTime(schedule.time)}</TableCell>
                <TableCell>{schedule.startPoint}</TableCell>
                <TableCell>{schedule.endPoint}</TableCell>
                <TableCell>{schedule.scheduleType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  )

  return (
    <>
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  )
}

