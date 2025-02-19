"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bus, Users, AirVent, ArrowRight, ArrowLeft, Home } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading"
import type { UserGroup, Schedule } from "@/types/schedule"
import { cn } from "@/lib/utils"

interface ScheduleViewProps {
  selectedUserGroup?: UserGroup
  schedules: Schedule[]
  isLoading: boolean
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ selectedUserGroup, schedules, isLoading }) => {
  const [direction, setDirection] = useState<'towardsUniversity' | 'fromUniversity'>('towardsUniversity')

  const filterByDirection = (schedules: Schedule[], direction: 'towardsUniversity' | 'fromUniversity') => {
    return schedules.filter(schedule => 
      direction === 'towardsUniversity' ? schedule.endPoint === 'University' : schedule.startPoint === 'University'
    )
  }

  const filterByUserGroup = (schedules: Schedule[]) => {
    if (!selectedUserGroup) return schedules
    return schedules.filter(
      (schedule) => schedule.userGroups.includes(selectedUserGroup) || schedule.userGroups.includes("all"),
    )
  }

  const renderScheduleCard = (schedule: Schedule) => (
    <div key={schedule.id} className="bg-card dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <h3 className="font-medium">{schedule.scheduleName}</h3>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{schedule.route}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-semibold">{schedule.time}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground dark:text-gray-400">From:</span>
        <span className="font-medium">{schedule.startPoint}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground dark:text-gray-400">To:</span>
        <span className="font-medium">{schedule.endPoint}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <div className="flex flex-wrap gap-1">
          {(schedule.userGroups || []).map((group) => (
            <Badge
              key={group}
              variant="secondary"
              className={cn(
                "text-xs",
                group === "teachers" && "bg-blue-500/10 text-blue-500",
                group === "students" && "bg-green-500/10 text-green-500",
                group === "staff" && "bg-purple-500/10 text-purple-500",
                group === "ministerial" && "bg-orange-500/10 text-orange-500",
                group === "all" && "bg-gray-500/10 text-gray-500",
              )}
            >
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  const renderScheduleTable = (schedules: Schedule[]) => (
    <table className="min-w-full bg-white dark:bg-gray-800 border rounded-lg">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b dark:border-gray-700">Schedule Name</th>
          <th className="py-2 px-4 border-b dark:border-gray-700">Route</th>
          <th className="py-2 px-4 border-b dark:border-gray-700">Start Point</th>
          <th className="py-2 px-4 border-b dark:border-gray-700">End Point</th>
          <th className="py-2 px-4 border-b dark:border-gray-700">Time</th>
          <th className="py-2 px-4 border-b dark:border-gray-700">User Groups</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map(schedule => (
          <tr key={schedule.id} className="dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="py-2 px-4 border-b dark:border-gray-700">{schedule.scheduleName}</td>
            <td className="py-2 px-4 border-b dark:border-gray-700">{schedule.route}</td>
            <td className="py-2 px-4 border-b dark:border-gray-700">{schedule.startPoint}</td>
            <td className="py-2 px-4 border-b dark:border-gray-700">{schedule.endPoint}</td>
            <td className="py-2 px-4 border-b dark:border-gray-700">{schedule.time}</td>
            <td className="py-2 px-4 border-b dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {(schedule.userGroups || []).map(group => (
                  <Badge
                    key={group}
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      group === "teachers" && "bg-blue-500/10 text-blue-500",
                      group === "students" && "bg-green-500/10 text-green-500",
                      group === "staff" && "bg-purple-500/10 text-purple-500",
                      group === "ministerial" && "bg-orange-500/10 text-orange-500",
                      group === "all" && "bg-gray-500/10 text-gray-500",
                    )}
                  >
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </Badge>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const filteredSchedules = filterByDirection(filterByUserGroup(schedules), direction)

  return (
    <Tabs defaultValue="towardsUniversity" onValueChange={(value) => setDirection(value as any)} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="towardsUniversity" className="w-full">
          <div className="flex items-center">
            <Bus className="h-5 w-5 mr-2" />
            To University
          </div>
        </TabsTrigger>
        <TabsTrigger value="fromUniversity" className="w-full">
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            From University
          </div>
        </TabsTrigger>
      </TabsList>
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <TabsContent value="towardsUniversity">
              <div className="hidden md:block">
                {filteredSchedules.length > 0 ? (
                  renderScheduleTable(filteredSchedules)
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No bus schedules available (will be updated soon).
                  </p>
                )}
              </div>
              <div className="block md:hidden space-y-4">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map(schedule => renderScheduleCard(schedule))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No bus schedules available (will be updated soon).
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="fromUniversity">
              <div className="hidden md:block">
                {filteredSchedules.length > 0 ? (
                  renderScheduleTable(filteredSchedules)
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No bus schedules available (will be updated soon).
                  </p>
                )}
              </div>
              <div className="block md:hidden space-y-4">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map(schedule => renderScheduleCard(schedule))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No bus schedules available (will be updated soon).
                  </p>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}

export default ScheduleView