import { formatRupiahShort } from '../../utils/formatCurrency'

// Komponen sidebar informasi destinasi yang muncul saat marker diklik
// Props:
//   - destination: objek destinasi yang dipilih (null = sidebar tersembunyi)
//   - onClose: callback untuk menutup sidebar
//   - onViewDetail: callback navigasi ke halaman Wisata dengan card expanded
function MapSidebar({ destination, onClose, onViewDetail }) {
  // Jangan render jika tidak ada destinasi yang dipilih
  if (!destination) return null

  return (
    <div className="absolute top-4 right-4 w-72 bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden">
      {/* Header sidebar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-white text-base leading-tight pr-2">
            {destination.name}
          </h3>
          {/* Tombol tutup sidebar */}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg leading-none flex-shrink-0"
            aria-label="Tutup sidebar"
          >
            ✕
          </button>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-300 text-sm">⭐</span>
          <span className="text-white/90 text-sm">{destination.rating?.toFixed(1)}</span>
        </div>
      </div>

      {/* Konten sidebar */}
      <div className="p-4">
        {/* Deskripsi singkat */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {destination.short_description}
        </p>

        {/* Info ringkas */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🕐</span>
            <span>{destination.opening_hours}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🎫</span>
            <span>{formatRupiahShort(destination.ticket_price)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🅿️</span>
            <span>{destination.parking_available ? 'Parkir tersedia' : 'Parkir tidak tersedia'}</span>
          </div>
        </div>

        {/* Tombol lihat detail */}
        <button
          onClick={() => onViewDetail(destination.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Lihat Detail →
        </button>
      </div>
    </div>
  )
}

export default MapSidebar
