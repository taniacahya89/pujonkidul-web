import { useState } from 'react'
import VisitorChart from './VisitorChart'
import TravelPackageList from './TravelPackageList'
import { formatRupiahShort } from '../../utils/formatCurrency'

// Warna latar card berdasarkan indeks (tema playful wisata alam)
const cardColors = [
  'from-green-400 to-emerald-500',
  'from-teal-400 to-cyan-500',
  'from-lime-400 to-green-500',
  'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500',
]

// Komponen card destinasi wisata dengan mode collapsed dan expanded
// Props:
//   - destination: objek data destinasi lengkap
//   - defaultExpanded: apakah card dibuka secara default (untuk navigasi dari peta)
//   - colorIndex: indeks warna untuk variasi tampilan
function DestinationCard({ destination, defaultExpanded = false, colorIndex = 0 }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Toggle mode collapsed/expanded saat card diklik
  const handleToggle = () => setIsExpanded((prev) => !prev)

  // Potong deskripsi singkat maksimal 150 karakter
  const shortDesc =
    destination.short_description?.length > 150
      ? destination.short_description.slice(0, 147) + '...'
      : destination.short_description

  const gradientColor = cardColors[colorIndex % cardColors.length]

  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isExpanded ? 'ring-2 ring-green-400' : ''
      }`}
      onClick={handleToggle}
    >
      {/* Header card dengan gradien warna */}
      <div className={`bg-gradient-to-r ${gradientColor} p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg leading-tight mb-1">
              {destination.name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="text-yellow-200 text-sm">⭐</span>
              <span className="text-white/90 text-sm font-medium">
                {destination.rating?.toFixed(1)}
              </span>
            </div>
          </div>
          {/* Ikon expand/collapse */}
          <span className="text-white/80 text-xl ml-2">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Konten collapsed — selalu tampil */}
      <div className="p-5">
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{shortDesc}</p>

        {/* Info ringkas: jam buka dan harga */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
            <span className="text-sm">🕐</span>
            <span className="text-gray-700 text-xs font-medium">
              {destination.opening_hours}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-1.5">
            <span className="text-sm">🎫</span>
            <span className="text-green-700 text-xs font-medium">
              {formatRupiahShort(destination.ticket_price)}
            </span>
          </div>
        </div>
      </div>

      {/* Konten expanded — hanya tampil saat isExpanded = true */}
      {isExpanded && (
        <div
          className="border-t border-gray-100 animate-fade-in"
          onClick={(e) => e.stopPropagation()} // Cegah toggle saat klik konten dalam
        >
          {/* Gambar placeholder destinasi */}
          <div className="relative bg-gray-200 h-48 overflow-hidden">
            {/* Ganti gambar di sini — ubah src dengan URL gambar asli destinasi */}
            <img
              src={destination.detail?.image_url || '/images/placeholder.jpg'}
              alt={destination.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback jika gambar tidak ditemukan
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            {/* Placeholder fallback */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300 hidden items-center justify-center"
              style={{ display: 'none' }}
            >
              <div className="text-center text-green-700">
                <div className="text-4xl mb-2">🏞️</div>
                <p className="text-sm font-medium">{destination.name}</p>
                <p className="text-xs opacity-70">Ganti gambar di sini</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Deskripsi lengkap */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Tentang Destinasi</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {destination.full_description}
              </p>
            </div>

            {/* Info detail: akses, parkir, waktu terbaik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-blue-600 text-xs font-semibold mb-1">🚗 Akses Kendaraan</p>
                <p className="text-gray-700 text-xs">{destination.vehicle_access || '-'}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-purple-600 text-xs font-semibold mb-1">🅿️ Parkir</p>
                <p className="text-gray-700 text-xs">
                  {destination.parking_available ? 'Tersedia' : 'Tidak tersedia'}
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-amber-600 text-xs font-semibold mb-1">⏰ Waktu Terbaik</p>
                <p className="text-gray-700 text-xs">{destination.best_time || '-'}</p>
              </div>
            </div>

            {/* Chart data kunjungan bulanan */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">📊 Data Kunjungan Bulanan</h4>
              <VisitorChart visitorData={destination.detail?.visitor_data} />
            </div>

            {/* Daftar paket wisata */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎒 Paket Wisata</h4>
              <TravelPackageList packages={destination.packages} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DestinationCard
