import { create } from 'zustand'
import { fetchRoutes } from '../services/routeService'

// Zustand store untuk manajemen state rute akses jalan
const useRouteStore = create((set, get) => ({
  // State
  routes: [],
  isLoading: false,
  error: null,

  // Mengambil semua rute akses jalan dari backend
  fetchRoutes: async () => {
    const { isLoading } = get()
    if (isLoading) return

    set({ isLoading: true, error: null })
    try {
      const data = await fetchRoutes()
      set({ routes: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Memaksa fetch ulang (untuk tombol refresh)
  refetchRoutes: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchRoutes()
      set({ routes: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default useRouteStore
