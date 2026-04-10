import { formatDate } from '../utils/formatDate'

// Konfigurasi warna badge berdasarkan status kondisi jalan
const statusConfig = {
  baik: {
    label: 'Lancar',
    className: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  sedang: {
    label: 'Hati-hati',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
  },
  rusak: {
    label: 'Macet/Rusak',
    className: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
}

// Komponen card untuk menampilkan informasi kondisi akses jalan
// Prop route: { id, name, description, status, last_updated }
function RouteCard({ route }) {
  const status = statusConfig[route.status] || statusConfig.sedang

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Nama rute */}
        <h3 className="font-semibold text-gray-800 text-base leading-tight">
          🛣️ {route.name}
        </h3>

        {/* Badge status kondisi */}
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Deskripsi rute */}
      <p className="text-gray-600 text-sm leading-relaxed mb-3">
        {route.description}
      </p>

      {/* Timestamp pembaruan terakhir */}
      <p className="text-gray-400 text-xs">
        🕐 Diperbarui: {formatDate(route.last_updated)}
      </p>
    </div>
  )
}

export default RouteCard
