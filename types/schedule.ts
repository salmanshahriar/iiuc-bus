export type UserGroup = 'all' | 'students' | 'teachers' | 'staff' | 'ministerial'

export interface BusSchedule {
  id: string
  startTime: string
  busNumber: string
  startPoint: string
  route: string
  endPoint: string
  userGroups: UserGroup[]
  isAC: boolean
}

export interface ScheduleGroup {
  towardsUniversity: BusSchedule[]
  fromUniversity: BusSchedule[]
}

export interface Schedule {
  id: number
  scheduleName: string
  route: string
  startPoint: string
  endPoint: string
  time: string
  scheduleType: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userGroups: UserGroup[] 
}