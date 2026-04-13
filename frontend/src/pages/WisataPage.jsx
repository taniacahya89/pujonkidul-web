import { useEffect } from 'react'
import { useDestinations } from '../hooks/useDestinations'
import DestinationCard from '../features/destination/DestinationCard'
import SkeletonLoader from '../components/SkeletonLoader'

function WisataPage() {
  const {
    filteredDestinations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useDestinations()

  useEffect(() => {
    setSearchQuery('')
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      {/* Header — hierarchy: eyebrow > h1 > body */}
      <div style={{ marginBottom: '40px' }}>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-3)', marginBottom: '8px' }}
        >
          Kawasan Pujon Kidul
        </p>
        <h1
          className="font-display"
          style={{ fontSize: '2rem', color: 'var(--text-1)', marginBottom: '8px' }}
        >
          Destinasi Wisata
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          Jelajahi semua destinasi wisata di kawasan Pujon Kidul, Malang
        </p>
      </div>

      {/* Search */}
      <div className="relative" style={{ maxWidth: '400px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="Cari destinasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 rounded-lg text-sm outline-none"
          style={{
            paddingLeft: '16px',
            paddingRight: searchQuery ? '36px' : '16px',
            border: '1px solid var(--surface-2)',
            backgroundColor: '#fff',
            color: 'var(--text-1)',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--surface-2)' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* States */}
      {isLoading && <SkeletonLoader type="card" count={6} />}

      {error && !isLoading && (
        <div style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center' }}>
          <p className="text-sm" style={{ color: 'var(--text-3)', marginBottom: '16px' }}>
            Gagal memuat data destinasi.
          </p>
          <button className="btn-primary" onClick={refetch}>Coba Lagi</button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {searchQuery && (
            <p className="text-xs" style={{ color: 'var(--text-3)', marginBottom: '20px' }}>
              {filteredDestinations.length} hasil untuk &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          {filteredDestinations.length === 0 ? (
            <div style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Destinasi tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WisataPage
