import { create } from 'zustand'
import {
  fetchAllDestinations,
  fetchFeaturedDestinations,
} from '../services/destinationService'

// Zustand store untuk manajemen state destinasi wisata
// Berfungsi sebagai cache — data tidak di-fetch ulang jika sudah ada
const useDestinationStore = create((set, get) => ({
  // State
  destinations: [],           // Semua destinasi
  featuredDestinations: [],   // 3 destinasi unggulan
  selectedDestination: null,  // Destinasi yang dipilih di peta
  isLoading: false,
  error: null,
  searchQuery: '',            // Query pencarian real-time

  // Mengambil semua destinasi dari backend
  // Hanya fetch jika data belum ada (caching)
  fetchDestinations: async () => {
    const { destinations, isLoading } = get()
    if (destinations.length > 0 || isLoading) return

    set({ isLoading: true, error: null })
    try {
      const data = await fetchAllDestinations()
      set({ destinations: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Mengambil 3 destinasi unggulan untuk halaman beranda
  fetchFeatured: async () => {
    const { featuredDestinations, isLoading } = get()
    if (featuredDestinations.length > 0 || isLoading) return

    set({ isLoading: true, error: null })
    try {
      const data = await fetchFeaturedDestinations()
      set({ featuredDestinations: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Memaksa fetch ulang semua destinasi (untuk tombol retry)
  refetchDestinations: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchAllDestinations()
      set({ destinations: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Mengatur destinasi yang dipilih di peta (single selection)
  setSelectedDestination: (destination) => set({ selectedDestination: destination }),

  // Mengatur query pencarian untuk filter real-time
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Getter: destinasi yang sudah difilter berdasarkan searchQuery
  // Dipanggil sebagai fungsi: store.getFilteredDestinations()
  getFilteredDestinations: () => {
    const { destinations, searchQuery } = get()
    if (!searchQuery.trim()) return destinations
    const query = searchQuery.toLowerCase()
    return destinations.filter((d) =>
      d.name.toLowerCase().includes(query)
    )
  },
}))

export default useDestinationStore
