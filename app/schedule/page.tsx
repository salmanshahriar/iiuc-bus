"use client"

import { useEffect } from "react"
import { useAPI } from "@/contexts/APIContext"
import ScheduleView from "@/components/schedule/ScheduleView"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface SchedulePageProps {
  from: string;
  to: string;
  date: Date;
}

export default function SchedulePage({ from, to, date }: SchedulePageProps) {
  const { fetchLiveBusSchedules, schedules, isLoading } = useAPI()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLiveBusSchedules({
          date: format(date, 'yyyy-MM-dd'),
          from,
          to
        })
      } catch (error) {
        console.error("Error fetching bus schedules:", error)
      }
    }
    fetchData()
  }, [fetchLiveBusSchedules, from, to, date])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pt-0 md:p-8 mb-20 md:mb-0 glow-background">
      <div className="m-0 md:mb-6 hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-6 w-6 text-[var(--primary-color)]" />
          <h1 className="text-2xl font-bold">Bus Schedule</h1>
        </div>
        <p className="text-muted-foreground">View all IIUC bus schedules and routes</p>
      </div>
      <div className="mt-4 md:mt-8">
        <ScheduleView schedules={schedules} isLoading={isLoading} />
      </div>
    </div>
  )
}