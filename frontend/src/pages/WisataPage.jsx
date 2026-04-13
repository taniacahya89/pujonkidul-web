import { useEffect } from 'react'
import { useDestinations } from '../hooks/useDestinations'
import DestinationCard from '../features/destination/DestinationCard'
import SkeletonLoader from '../components/SkeletonLoader'

// Halaman semua destinasi wisata dengan pencarian real-time
function WisataPage() {
  const {
    filteredDestinations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useDestinations()

  // Reset search saat halaman dimuat
  useEffect(() => {
    setSearchQuery('')
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#41431B' }}>
          🏞️ Destinasi Wisata
        </h1>
        <p style={{ color: '#4C5C2D' }}>
          Jelajahi semua destinasi wisata di kawasan Pujon Kidul, Malang
        </p>
      </div>

      {/* Search bar pencarian real-time */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#AEB784' }}>🔍</span>
        <input
          type="text"
          placeholder="Cari destinasi wisata..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 shadow-sm"
          style={{
            border: '1px solid #AEB784',
            backgroundColor: '#fff',
            color: '#41431B',
            focusRingColor: '#237227',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: '#AEB784' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && <SkeletonLoader type="card" count={6} />}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Gagal memuat data destinasi.</p>
          <button
            onClick={refetch}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#237227' }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Grid destinasi */}
      {!isLoading && !error && (
        <>
          {/* Jumlah hasil */}
          {searchQuery && (
            <p className="text-gray-500 text-sm mb-4">
              Menampilkan {filteredDestinations.length} hasil untuk "{searchQuery}"
            </p>
          )}

          {/* Pesan tidak ditemukan */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">Destinasi tidak ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">
                Coba kata kunci lain atau hapus filter pencarian
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WisataPage
