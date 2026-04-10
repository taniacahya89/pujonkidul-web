import api from './api'

// Service untuk semua operasi API terkait destinasi wisata

// Mengambil semua destinasi beserta detail dan paket wisata
export async function fetchAllDestinations() {
  const response = await api.get('/api/v1/destinations')
  return response.data.data
}

// Mengambil detail satu destinasi berdasarkan ID
export async function fetchDestinationById(id) {
  const response = await api.get(`/api/v1/destinations/${id}`)
  return response.data.data
}

// Mengambil 3 destinasi unggulan untuk halaman beranda
export async function fetchFeaturedDestinations() {
  const response = await api.get('/api/v1/destinations/featured')
  return response.data.data
}
