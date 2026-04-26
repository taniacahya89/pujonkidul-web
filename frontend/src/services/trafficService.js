import { TRAFFIC_ROUTES } from '../utils/constants'

// ============================================================
// Status kondisi lalu lintas
// ============================================================
export const TRAFFIC_STATUS = {
  LANCAR: 'lancar',
  PADAT:  'padat',
  MACET:  'macet',
}

// Urutan status (untuk transisi gradual)
const STATUS_ORDER = ['lancar', 'padat', 'macet']

// Konfigurasi tampilan per status
export const STATUS_CONFIG = {
  lancar: {
    label: 'Lancar',
    color: '#1E5C1E',
    bg:    '#E6F4E6',
    dot:   '#2D6A2D',
    border:'#B8DDB8',
  },
  padat: {
    label: 'Hati-hati',
    color: '#7A4E08',
    bg:    '#FDF3E0',
    dot:   '#C47D10',
    border:'#E8C97A',
  },
  macet: {
    label: 'Macet',
    color: '#7A1A1A',
    bg:    '#FDEAEA',
    dot:   '#C03030',
    border:'#E8AAAA',
  },
}

// ============================================================
// Status awal berdasarkan jam dan hari — deterministik
// Tidak random, mengikuti pola lalu lintas nyata
// ============================================================
function getBaseStatus(routeId) {
  const hour    = new Date().getHours()
  const isWeekend = [0, 6].includes(new Date().getDay())
  // Jam sibuk pagi: 07–09, sore: 15–18
  const isPeakMorning = hour >= 7  && hour <= 9
  const isPeakEvening = hour >= 15 && hour <= 18
  const isPeak = isPeakMorning || isPeakEvening

  // Setiap rute punya karakteristik berbeda
  const baseMap = {
    'batu-pujon':   isPeak ? 'padat'  : 'lancar',
    'songgoriti':   isPeak ? 'macet'  : 'padat',
    'malang-kota':  isPeak ? 'macet'  : 'padat',
    'kediri-pujon': isWeekend && isPeak ? 'padat' : 'lancar',
  }
  return baseMap[routeId] || 'lancar'
}

// ============================================================
// State internal — menyimpan status terakhir setiap rute
// Digunakan untuk transisi gradual saat refresh
// ============================================================
let _currentStatuses = {}

// Transisi gradual: 70% tetap, 30% bergeser ke status tetangga
// Tidak pernah loncat dari Lancar langsung ke Macet
function evolveStatus(routeId, currentStatus) {
  const roll = Math.random()
  if (roll < 0.70) {
    // Tetap sama
    return currentStatus
  }
  // Bergeser ke status tetangga (naik atau turun 1 level)
  const idx = STATUS_ORDER.indexOf(currentStatus)
  if (idx === -1) return currentStatus

  // Tentukan arah bergeser berdasarkan jam
  const hour = new Date().getHours()
  const isPeak = (hour >= 7 && hour <= 9) || (hour >= 15 && hour <= 18)

  if (isPeak) {
    // Jam sibuk: cenderung naik (lebih padat)
    const nextIdx = Math.min(idx + 1, STATUS_ORDER.length - 1)
    return STATUS_ORDER[nextIdx]
  } else {
    // Di luar jam sibuk: cenderung turun (lebih lancar)
    const nextIdx = Math.max(idx - 1, 0)
    return STATUS_ORDER[nextIdx]
  }
}

// ============================================================
// Fungsi utama — ambil status semua rute
// Pertama kali: gunakan base status (deterministik)
// Refresh berikutnya: evolusi gradual dari status sebelumnya
// ============================================================
export async function fetchAllTrafficStatus() {
  // Simulasi network latency realistis (300–700ms)
  const delay = 300 + Math.random() * 400
  await new Promise((r) => setTimeout(r, delay))

  const now = new Date().toISOString()

  return TRAFFIC_ROUTES.map((route) => {
    const prev = _currentStatuses[route.id]
    let newStatus

    if (!prev) {
      // Pertama kali load: gunakan base status
      newStatus = getBaseStatus(route.id)
    } else {
      // Refresh: evolusi gradual dari status sebelumnya
      newStatus = evolveStatus(route.id, prev)
    }

    // Simpan status terbaru
    _currentStatuses[route.id] = newStatus

    return {
      ...route,
      status:      newStatus,
      lastUpdated: now,
    }
  })
}
