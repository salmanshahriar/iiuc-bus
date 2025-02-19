
export interface Bus {
  busId: number
  busNo: number
  vehicleId: string
  capacity: number
  startPoint: string
  endPoint: string
  routeName: string
  scheduleDate: string
  scheduleTime: string
  busType: string
  additionalInfo: null | string
}

export interface LiveTrack {
  vehicleID: string
  latitude: number
  longitude: number
  distance: string
}

export interface LiveScheduleRequest {
  date: string
  from: string
  to: string
}

export interface BusSearchProps {
  onSearch: () => void
}

export interface BusCardProps {
  bus: Bus
}

//
export type BusType = 'student' | 'teacher' | 'staff'
export type BusStatus = 'On-time' | 'Delayed' | 'En Route'

export interface BusError {
  error: string
}



