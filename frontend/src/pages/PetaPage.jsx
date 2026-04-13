import { useEffect, useState } from 'react'
import useDestinationStore from '../store/destinationStore'
import InteractiveMap from '../features/map/InteractiveMap'
import SkeletonLoader from '../components/SkeletonLoader'
import DestinationModal from '../features/destination/DestinationModal'
import { formatRupiahShort } from '../utils/formatCurrency'

// Mapping nama destinasi ke local image path
const IMAGE_MAP = {
  'Cafe Sawah':                    '/images/cafesawah_img.jpg',
  'Coban Rondo':                   '/images/cobanrondo_img.jpg',
  'Bukit Nirwana':                 '/images/nirwana_img.jpeg',
  'Bobocabin Coban Rondo':         '/images/bobocabin_img.jpg',
  'Kelinci Park':                  '/images/kelincipark_img.jpg',
  'Florawisata Santerra De Laponte': '/images/santerra_img.jpg',
}

// Buka Google Maps navigasi ke koordinat destinasi
function openGoogleMaps(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    '_blank',
    'noopener,noreferrer'
  )
}

// Halaman peta interaktif — layout dua kolom: peta kiri, side panel kanan
function PetaPage() {
  const {
    destinations,
    selectedDestination,
    isLoading,
    error,
    fetchDestinations,
    refetchDestinations,
    setSelectedDestination,
  } = useDestinationStore()

  const [modalOpen, setModalOpen] = useState(false)

  // Fetch destinasi saat mount jika belum ada data (caching)
  useEffect(() => {
    if (destinations.length === 0) fetchDestinations()
  }, [])

  const handleMarkerClick = (destination) => {
    setSelectedDestination(destination)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#41431B' }}>
          🗺️ Peta Destinasi Wisata
        </h1>
        <p style={{ color: '#4C5C2D' }}>
          Klik marker pada peta untuk melihat informasi destinasi di panel samping
        </p>
      </div>

      {isLoading && <SkeletonLoader type="map" />}

      {error && !isLoading && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">Gagal memuat data peta destinasi. Silakan coba lagi.</p>
          <button
            onClick={refetchDestinations}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#237227' }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Layout dua kolom: peta + side panel */}
      {!isLoading && !error && (
        <div className="flex gap-4 items-start">
          {/* Peta — flex-1 */}
          <div className="flex-1 min-w-0">
            <InteractiveMap
              destinations={destinations}
              onMarkerClick={handleMarkerClick}
            />
            <div className="mt-3 flex items-center gap-4 text-sm" style={{ color: '#4C5C2D' }}>
              <span>📍 {destinations.length} destinasi wisata</span>
              <span>🖱️ Klik marker untuk detail</span>
            </div>
          </div>

          {/* Side panel — lebar tetap 320px */}
          <div
            className="w-80 flex-shrink-0 rounded-2xl shadow-md overflow-hidden"
            style={{ backgroundColor: '#F8F3E1', minHeight: '500px' }}
          >
            {!selectedDestination ? (
              /* State kosong */
              <div
                className="flex flex-col items-center justify-center p-8 text-center"
                style={{ minHeight: '500px' }}
              >
                <div className="text-5xl mb-4">🗺️</div>
                <p className="font-semibold" style={{ color: '#41431B' }}>Pilih Destinasi</p>
                <p className="text-sm mt-2" style={{ color: '#4C5C2D' }}>
                  Klik salah satu marker pada peta untuk melihat informasi
                </p>
              </div>
            ) : (
              /* Detail destinasi yang dipilih */
              <div>
                {/* Header panel */}
                <div className="p-4" style={{ backgroundColor: '#4C5C2D' }}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-base leading-tight pr-2" style={{ color: '#F8F3E1' }}>
                      {selectedDestination.name}
                    </h3>
                    <button
                      onClick={() => setSelectedDestination(null)}
                      style={{ color: '#AEB784' }}
                      aria-label="Tutup panel"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Gambar destinasi */}
                <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={IMAGE_MAP[selectedDestination.name] || selectedDestination.detail?.image_url || '/images/placeholder.jpg'}
                    alt={selectedDestination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
                  />
                </div>

                {/* Info ringkas */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#41431B' }}>
                    <span>🕐</span>
                    <span>{selectedDestination.opening_hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#41431B' }}>
                    <span>🎫</span>
                    <span>{formatRupiahShort(selectedDestination.ticket_price)}</span>
                  </div>
                  {selectedDestination.address && (
                    <div className="flex items-start gap-2 text-xs" style={{ color: '#4C5C2D' }}>
                      <span className="flex-shrink-0">📍</span>
                      <span>{selectedDestination.address}</span>
                    </div>
                  )}

                  {/* Tombol aksi */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => openGoogleMaps(selectedDestination.latitude, selectedDestination.longitude)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
                    >
                      🧭 Navigasi ke Sini
                    </button>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                      style={{ borderColor: '#4C5C2D', color: '#4C5C2D', backgroundColor: 'transparent' }}
                    >
                      Lihat Detail Lengkap →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal detail destinasi */}
      {modalOpen && selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          imageSrc={IMAGE_MAP[selectedDestination.name] || selectedDestination.detail?.image_url || '/images/placeholder.jpg'}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default PetaPage
