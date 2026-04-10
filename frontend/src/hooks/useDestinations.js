import { useEffect } from 'react'
import useDestinationStore from '../store/destinationStore'

// Custom hook untuk mengambil dan mengelola data destinasi
// Menggunakan cache dari Zustand store — tidak fetch ulang jika data sudah ada
export function useDestinations() {
  const {
    destinations,
    isLoading,
    error,
    fetchDestinations,
    refetchDestinations,
    setSearchQuery,
    searchQuery,
    getFilteredDestinations,
  } = useDestinationStore()

  // Fetch destinasi saat pertama kali mount jika belum ada data
  useEffect(() => {
    if (destinations.length === 0) {
      fetchDestinations()
    }
  }, [])

  return {
    destinations,
    filteredDestinations: getFilteredDestinations(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch: refetchDestinations,
  }
}

// Custom hook untuk mengambil destinasi unggulan (halaman beranda)
export function useFeaturedDestinations() {
  const {
    featuredDestinations,
    isLoading,
    error,
    fetchFeatured,
  } = useDestinationStore()

  useEffect(() => {
    if (featuredDestinations.length === 0) {
      fetchFeatured()
    }
  }, [])

  return { featuredDestinations, isLoading, error }
}
