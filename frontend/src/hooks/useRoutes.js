import { useEffect } from 'react'
import useRouteStore from '../store/routeStore'

// Custom hook untuk mengambil dan me-refresh data rute akses jalan
export function useRoutes() {
  const { routes, isLoading, error, fetchRoutes, refetchRoutes } = useRouteStore()

  // Fetch rute saat pertama kali mount
  useEffect(() => {
    fetchRoutes()
  }, [])

  return {
    routes,
    isLoading,
    error,
    refresh: refetchRoutes,
  }
}
