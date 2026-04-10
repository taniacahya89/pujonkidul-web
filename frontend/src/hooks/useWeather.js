import { useEffect } from 'react'
import useWeatherStore from '../store/weatherStore'

// Custom hook untuk mengambil data cuaca dari backend proxy
// API key OWM tidak pernah ada di frontend
export function useWeather() {
  const { weather, isLoading, error, fetchWeather } = useWeatherStore()

  // Fetch cuaca saat komponen mount
  useEffect(() => {
    fetchWeather()
  }, [])

  return { weather, isLoading, error }
}
