"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { Schedule } from "@/types/schedule"
import { Bus } from "@/types/bus"


interface APIContextType {
  liveBusData: Bus[]
  schedules: Schedule[]
  isLoading: boolean
  errorMessage: string | null
  currentDateTime: string
  userLogin: string
  fetchLiveBusSchedules: (params: {
    from: string
    to: string
    date: string
  }) => Promise<void>
}

const APIContext = createContext<APIContextType | undefined>(undefined)

export function APIProvider({ children }: { children: ReactNode }) {
  const [liveBusData, setLiveBusData] = useState<Bus[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const currentDateTime = "2025-02-11 15:52:23" // Fixed date time as per requirement
  const userLogin = "salmanshahriar" // Fixed user login as per requirement

  const fetchLiveBusSchedules = async (params: {
    from: string
    to: string
    date: string
  }) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/find-LiveSchedule?date=${params.date}&from=${params.from}&to=${params.to}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Login': userLogin,
          'Current-Time': currentDateTime
        }
      })

      const data = await response.json()
      
      if (!response.ok || data.message === "No schedules available for the selected route and day") {
        setErrorMessage(data.message || 'No schedules available for the selected route and day')
        setLiveBusData([])
        return
      }

      setLiveBusData(data.availableBusesAndRoutes || [])
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Failed to fetch bus schedules')
      setLiveBusData([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSchedules = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/schedule`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Login': userLogin,
          'Current-Time': currentDateTime
        }
      })
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Failed to fetch schedules')
      setSchedules([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  return (
    <APIContext.Provider value={{
      liveBusData,
      schedules,
      isLoading,
      errorMessage,
      currentDateTime,
      userLogin,
      fetchLiveBusSchedules
    }}>
      {children}
    </APIContext.Provider>
  )
}

export const useAPI = () => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('useAPI must be used within an APIProvider')
  }
  return context
}