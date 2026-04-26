import { useState, useEffect, useCallback } from 'react'
import { fetchAllTrafficStatus, STATUS_CONFIG } from '../services/trafficService'
import { formatDate } from '../utils/formatDate'

// Auto-refresh setiap 30 menit
const REFRESH_INTERVAL_MS = 30 * 60 * 1000

// Card satu rute — menggunakan badge CSS class dari design system
function RouteStatusCard({ route, isNew }) {
  const cfg = STATUS_CONFIG[route.status] || STATUS_CONFIG.lancar
  const badgeClass = `badge-${route.status}`

  return (
    <div
      className="card-lift rounded-2xl p-5"
      style={{
        backgroundColor: '#fff',
        border: '1px solid var(--surface-2)',
        boxShadow: 'var(--shadow-sm)',
        // Animasi masuk saat data baru
        animation: isNew ? 'fadeSlideIn 0.35s ease both' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Nama rute */}
        <h3
          className="font-semibold text-sm leading-snug"
          style={{ color: 'var(--text-1)' }}
        >
          {route.name}
        </h3>

        {/* Badge status */}
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${badgeClass}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: cfg.dot }}
          />
          {cfg.label}
        </span>
      </div>

      {/* Deskripsi */}
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: 'var(--text-2)' }}
      >
        {route.description}
      </p>

      {/* Timestamp */}
      <p className="text-xs" style={{ color: 'var(--text-3)' }}>
        Diperbarui: {formatDate(route.lastUpdated)}
      </p>
    </div>
  )
}

function AksesJalanPage() {
  const [routes, setRoutes]           = useState([])
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [isNew, setIsNew]             = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAllTrafficStatus()
      setRoutes(data)
      setLastRefresh(new Date())
      // Trigger animasi masuk
      setIsNew(true)
      setTimeout(() => setIsNew(false), 600)
    } catch (err) {
      setError(err.message || 'Gagal memuat data kondisi jalan')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Auto-refresh setiap 30 menit
  useEffect(() => {
    const timer = setInterval(loadData, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [loadData])

  return (
    <div
      className="max-w-4xl mx-auto px-6"
      style={{ paddingTop: '56px', paddingBottom: '80px' }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-4"
        style={{ marginBottom: '36px' }}
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-3)', marginBottom: '8px' }}
          >
            Informasi Perjalanan
          </p>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-1)', marginBottom: '6px' }}
          >
            Akses Jalan
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            Kondisi lalu lintas menuju Pujon Kidul · Diperbarui otomatis setiap 30 menit
          </p>
          {lastRefresh && (
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>
              Terakhir diperbarui: {formatDate(lastRefresh.toISOString())}
            </p>
          )}
        </div>

        {/* Tombol refresh */}
        <button
          onClick={loadData}
          disabled={isLoading}
          className="btn-primary flex-shrink-0"
          style={{ minWidth: '110px' }}
        >
          <span
            style={{
              display: 'inline-block',
              transition: 'transform 0.5s ease',
              transform: isLoading ? 'rotate(360deg)' : 'rotate(0deg)',
            }}
          >
            ↻
          </span>
          {isLoading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Legenda status */}
      <div
        className="flex flex-wrap items-center gap-5 mb-6 px-4 py-3 rounded-xl"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--surface-2)',
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-3)' }}
        >
          Status:
        </span>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cfg.dot }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
              {cfg.label}
            </span>
          </div>
        ))}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{
                backgroundColor: 'var(--surface)',
                height: '108px',
              }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--surface-2)',
          }}
        >
          <p className="text-2xl mb-3">⚠️</p>
          <p className="text-sm mb-4" style={{ color: '#9B2020' }}>{error}</p>
          <button onClick={loadData} className="btn-primary">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Daftar rute */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {routes.map((route) => (
            <RouteStatusCard key={route.id} route={route} isNew={isNew} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AksesJalanPage
