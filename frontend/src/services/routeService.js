import api from './api'

// Service untuk data rute akses jalan

// Mengambil semua rute akses jalan beserta status kondisi terkini
export async function fetchRoutes() {
  const response = await api.get('/api/v1/routes')
  return response.data.data
}
