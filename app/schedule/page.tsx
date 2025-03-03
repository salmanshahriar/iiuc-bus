import ScheduleView from "@/components/schedule/ScheduleView"

async function getSchedules() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/schedule`) // Default caching
  if (!res.ok) {
    throw new Error(`Failed to fetch schedules: ${res.status} ${res.statusText}`)
  }
  const scheduleData = await res.json()
  if (!scheduleData || !Array.isArray(scheduleData.schedules)) {
    throw new Error("Invalid schedule data: 'schedules' must be an array")
  }
  return scheduleData
}

export default async function Page() {
  try {
    const scheduleData = await getSchedules()
    return (
      <div className="container max-w-full mx-auto px-4 md:px-6 mb-20 md:mb-0">
       
        <div className="mt-4 md:mt-8">
          <ScheduleView schedules={scheduleData.schedules} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <p className="text-red-500">Error loading schedules. Please try again later.</p>
      </div>
    )
  }
}