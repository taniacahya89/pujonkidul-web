import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDestinationStore from '../store/destinationStore'
import InteractiveMap from '../features/map/InteractiveMap'
import MapSidebar from '../features/map/MapSidebar'
import SkeletonLoader from '../components/SkeletonLoader'

// Halaman peta interaktif dengan Leaflet vanilla JS
function PetaPage() {
  const navigate = useNavigate()
  const {
    destinations,
    selectedDestination,
    isLoading,
    error,
    fetchDestinations,
    refetchDestinations,
    setSelectedDestination,
  } = useDestinationStore()

  // Fetch destinasi saat mount jika belum ada data (caching)
  useEffect(() => {
    if (destinations.length === 0) {
      fetchDestinations()
    }
  }, [])

  // Saat marker diklik — set single selected destination
  const handleMarkerClick = (destination) => {
    setSelectedDestination(destination)
  }

  // Saat tombol "Lihat Detail" diklik — navigasi ke halaman Wisata
  // dengan state expandedId untuk expand card yang bersangkutan
  const handleViewDetail = (destinationId) => {
    navigate('/wisata', { state: { expandedId: destinationId } })
  }

  // Tutup sidebar
  const handleCloseSidebar = () => {
    setSelectedDestination(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header halaman */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🗺️ Peta Destinasi Wisata
        </h1>
        <p className="text-gray-500">
          Klik marker pada peta untuk melihat informasi destinasi
        </p>
      </div>

      {/* Loading state */}
      {isLoading && <SkeletonLoader type="map" />}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">
            Gagal memuat data peta destinasi. Silakan coba lagi.
          </p>
          <button
            onClick={refetchDestinations}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Peta interaktif */}
      {!isLoading && !error && (
        <div className="relative">
          <InteractiveMap
            destinations={destinations}
            onMarkerClick={handleMarkerClick}
          />
          {/* Sidebar info destinasi (posisi absolut di atas peta) */}
          <MapSidebar
            destination={selectedDestination}
            onClose={handleCloseSidebar}
            onViewDetail={handleViewDetail}
          />
        </div>
      )}

      {/* Legenda peta */}
      {!isLoading && !error && (
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-green-600">📍</span>
            <span>Destinasi wisata ({destinations.length} lokasi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🖱️</span>
            <span>Klik marker untuk info detail</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PetaPage
