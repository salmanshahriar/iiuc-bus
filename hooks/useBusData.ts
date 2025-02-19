import useSWR from 'swr'
import { useAPI } from '@/contexts/APIContext'
import type { Bus, LiveBusRoute } from '@/types/bus'

const REFRESH_INTERVAL = 10000 // 10 seconds

export function useBusData(startPoint?: string, endPoint?: string) {
  const { fetchLiveBusSchedules } = useAPI()

  const { data, error, mutate } = useSWR(
    startPoint && endPoint ? ['buses', startPoint, endPoint] : null,
    async () => {
      const date = new Date().toISOString().split('T')[0]
      return fetchLiveBusSchedules({ date, startPoint, endPoint })
    },
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )

  return {
    buses: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
} 