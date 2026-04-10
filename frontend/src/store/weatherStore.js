import { create } from 'zustand'
import { fetchWeather } from '../services/weatherService'

// Zustand store untuk manajemen state data cuaca
const useWeatherStore = create((set, get) => ({
  // State
  weather: null,    // Data cuaca dari OWM (via backend proxy)
  isLoading: false,
  error: null,

  // Mengambil data cuaca dari backend (proxy ke OWM)
  // API key OWM tidak pernah ada di frontend
  fetchWeather: async () => {
    const { isLoading } = get()
    if (isLoading) return

    set({ isLoading: true, error: null })
    try {
      const data = await fetchWeather()
      set({ weather: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default useWeatherStore
