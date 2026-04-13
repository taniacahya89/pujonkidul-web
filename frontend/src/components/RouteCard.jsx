import { formatDate } from '../utils/formatDate'

// Konfigurasi warna badge berdasarkan status kondisi jalan — palette brand
const statusConfig = {
  baik: {
    label: 'Lancar',
    color: '#237227',
    bg: '#E3DBBB',
    dot: '#237227',
  },
  sedang: {
    label: 'Hati-hati',
    color: '#b45309',
    bg: '#fef3c7',
    dot: '#d97706',
  },
  rusak: {
    label: 'Macet/Rusak',
    color: '#dc2626',
    bg: '#fee2e2',
    dot: '#ef4444',
  },
}

// Komponen card untuk menampilkan informasi kondisi akses jalan
// Prop route: { id, name, description, status, last_updated }
function RouteCard({ route }) {
  const status = statusConfig[route.status] || statusConfig.sedang

  return (
    <div
      className="rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
      style={{ backgroundColor: '#fff', border: '1px solid #E3DBBB' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Nama rute */}
        <h3 className="font-semibold text-base leading-tight" style={{ color: '#41431B' }}>
          🛣️ {route.name}
        </h3>

        {/* Badge status kondisi */}
        <span
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.dot }} />
          {status.label}
        </span>
      </div>

      {/* Deskripsi rute */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#4C5C2D' }}>
        {route.description}
      </p>

      {/* Timestamp pembaruan terakhir */}
      <p className="text-xs" style={{ color: '#AEB784' }}>
        🕐 Diperbarui: {formatDate(route.last_updated)}
      </p>
    </div>
  )
}

export default RouteCard
