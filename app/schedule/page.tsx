import { Clock } from "lucide-react"
import ScheduleView from "@/components/schedule/ScheduleView"

async function getSchedules() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/schedule`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch schedules")
  }
  return res.json()
}

export default async function Page() {
  const scheduleData = await getSchedules()

  return (
    <div className="min-h-[calc(100vh-4rem)] mb-20 md:mb-0 glow-background">
      <div className="m-0 md:mb-6 hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-6 w-6 text-[var(--primary-color)]" />
          <h1 className="text-2xl font-bold">Bus Schedule</h1>
        </div>
        <p className="text-muted-foreground">View all IIUC bus schedules and routes</p>
      </div>
      <div className="mt-4 md:mt-8">
        <ScheduleView schedules={scheduleData.schedules} />
      </div>
    </div>
  )
}

