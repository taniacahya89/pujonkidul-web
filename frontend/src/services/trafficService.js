import { TRAFFIC_ROUTES } from '../utils/constants'

// ============================================================
// Abstraction layer untuk data kondisi lalu lintas
// Plug-in Google Maps Directions API di sini saat API key tersedia
// ============================================================

// Status kondisi yang mungkin
export const TRAFFIC_STATUS = {
  LANCAR: 'lancar',
  PADAT:  'padat',
  MACET:  'macet',
}

// Label dan warna untuk setiap status
export const STATUS_CONFIG = {
  lancar: { label: 'Lancar',  color: '#237227', bg: '#E3DBBB', dot: '#237227' },
  padat:  { label: 'Padat',   color: '#b45309', bg: '#fef3c7', dot: '#d97706' },
  macet:  { label: 'Macet',   color: '#dc2626', bg: '#fee2e2', dot: '#ef4444' },
}

// ============================================================
// Implementasi mock — ganti dengan Google Maps API saat siap
// Untuk menggunakan Google Maps Directions API:
//   1. Tambahkan VITE_GOOGLE_MAPS_API_KEY ke frontend/.env
//   2. Ganti fungsi fetchTrafficStatus di bawah dengan implementasi nyata
//   3. Endpoint: https://maps.googleapis.com/maps/api/directions/json
//      ?origin=...&destination=...&departure_time=now&traffic_model=best_guess
//      &key=VITE_GOOGLE_MAPS_API_KEY
// ============================================================

// Simulasi variasi status berdasarkan jam (mock realistis)
function getMockStatus(routeId) {
  const hour = new Date().getHours()
  // Jam sibuk: 07-09 dan 15-18
  const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 15 && hour <= 18)
  const isWeekend = [0, 6].includes(new Date().getDay())

  const mockMap = {
    'batu-pujon':   isPeakHour ? TRAFFIC_STATUS.PADAT  : TRAFFIC_STATUS.LANCAR,
    'songgoriti':   isPeakHour ? TRAFFIC_STATUS.MACET   : TRAFFIC_STATUS.PADAT,
    'malang-kota':  isPeakHour ? TRAFFIC_STATUS.MACET   : TRAFFIC_STATUS.PADAT,
    'kediri-pujon': isWeekend  ? TRAFFIC_STATUS.PADAT   : TRAFFIC_STATUS.LANCAR,
  }
  return mockMap[routeId] || TRAFFIC_STATUS.LANCAR
}

// Ambil status lalu lintas untuk semua rute
// Mengembalikan array { ...route, status, lastUpdated }
export async function fetchAllTrafficStatus() {
  // TODO: Ganti dengan Google Maps Directions API saat API key tersedia
  // Contoh implementasi nyata:
  // const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  // if (apiKey) {
  //   return await fetchFromGoogleMaps(apiKey)
  // }

  // Simulasi network delay
  await new Promise((r) => setTimeout(r, 600))

  return TRAFFIC_ROUTES.map((route) => ({
    ...route,
    status: getMockStatus(route.id),
    lastUpdated: new Date().toISOString(),
  }))
}
