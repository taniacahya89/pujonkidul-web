import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDestinations } from '../hooks/useDestinations'
import DestinationCard from '../features/destination/DestinationCard'
import SkeletonLoader from '../components/SkeletonLoader'

// Halaman semua destinasi wisata dengan pencarian real-time
function WisataPage() {
  const location = useLocation()
  const {
    filteredDestinations,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refetch,
  } = useDestinations()

  // Baca state dari navigasi (dari halaman peta untuk expand card tertentu)
  const expandedId = location.state?.expandedId

  // Reset search saat halaman dimuat
  useEffect(() => {
    setSearchQuery('')
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏞️ Destinasi Wisata
        </h1>
        <p className="text-gray-500">
          Jelajahi semua destinasi wisata di kawasan Pujon Kidul, Malang
        </p>
      </div>

      {/* Search bar pencarian real-time */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Cari destinasi wisata..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
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
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  colorIndex={index}
                  // Expand card jika navigasi dari peta dengan expandedId
                  defaultExpanded={destination.id === expandedId}
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
