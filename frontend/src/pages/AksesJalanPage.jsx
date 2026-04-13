import { useState, useEffect, useCallback } from 'react'
import { fetchAllTrafficStatus, STATUS_CONFIG } from '../services/trafficService'
import { formatDate } from '../utils/formatDate'

// Interval refresh otomatis: 30 menit (1800000 ms)
const REFRESH_INTERVAL_MS = 30 * 60 * 1000

// Komponen card satu rute
function RouteStatusCard({ route }) {
  const cfg = STATUS_CONFIG[route.status] || STATUS_CONFIG.lancar

  return (
    <div
      className="rounded-2xl shadow-sm p-5 border"
      style={{ backgroundColor: '#fff', borderColor: '#E3DBBB' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Nama rute */}
        <h3 className="font-semibold text-base leading-tight" style={{ color: '#41431B' }}>
          🛣️ {route.name}
        </h3>

        {/* Badge status */}
        <span
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: cfg.dot }}
          />
          {cfg.label}
        </span>
      </div>

      {/* Deskripsi rute */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#4C5C2D' }}>
        {route.description}
      </p>

      {/* Timestamp */}
      <p className="text-xs" style={{ color: '#AEB784' }}>
        🕐 Diperbarui: {formatDate(route.lastUpdated)}
      </p>
    </div>
  )
}

// Halaman Akses Jalan — status kondisi lalu lintas 4 rute menuju Pujon Kidul
// Data diperbarui otomatis setiap 30 menit
function AksesJalanPage() {
  const [routes, setRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAllTrafficStatus()
      setRoutes(data)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err.message || 'Gagal memuat data kondisi jalan')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch saat mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh setiap 30 menit
  useEffect(() => {
    const timer = setInterval(loadData, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [loadData])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#41431B' }}>
            🛣️ Akses Jalan
          </h1>
          <p style={{ color: '#4C5C2D' }}>
            Kondisi lalu lintas menuju kawasan Pujon Kidul · Diperbarui setiap 30 menit
          </p>
          {lastRefresh && (
            <p className="text-xs mt-1" style={{ color: '#AEB784' }}>
              Terakhir diperbarui: {formatDate(lastRefresh.toISOString())}
            </p>
          )}
        </div>

        {/* Tombol refresh manual */}
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          style={{
            backgroundColor: isLoading ? '#AEB784' : '#237227',
            color: '#F8F3E1',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
          {isLoading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Legenda status */}
      <div
        className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl"
        style={{ backgroundColor: '#E3DBBB' }}
      >
        <span className="text-sm font-semibold" style={{ color: '#41431B' }}>Keterangan:</span>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.dot }} />
            <span className="text-sm" style={{ color: '#41431B' }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 animate-pulse"
              style={{ backgroundColor: '#E3DBBB', height: '120px' }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#fff' }}>
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#237227' }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Daftar rute */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {routes.map((route) => (
            <RouteStatusCard key={route.id} route={route} />
          ))}
        </div>
      )}

      {/* Catatan integrasi API */}
      <div
        className="mt-8 p-4 rounded-xl text-sm"
        style={{ backgroundColor: '#F8F3E1', color: '#4C5C2D', borderLeft: '3px solid #AEB877' }}
      >
        <p className="font-semibold mb-1" style={{ color: '#41431B' }}>ℹ️ Tentang Data Kondisi Jalan</p>
        <p>
          Data kondisi lalu lintas saat ini menggunakan estimasi berdasarkan jam dan hari.
          Untuk data real-time, tambahkan <code className="bg-white px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> ke
          file <code className="bg-white px-1 rounded">frontend/.env</code> dan aktifkan integrasi
          Google Maps Directions API di <code className="bg-white px-1 rounded">src/services/trafficService.js</code>.
        </p>
      </div>
    </div>
  )
}

export default AksesJalanPage
