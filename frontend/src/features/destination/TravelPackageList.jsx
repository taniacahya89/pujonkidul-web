import { formatRupiahShort } from '../../utils/formatCurrency'

// Komponen daftar paket wisata untuk satu destinasi
// Prop packages: array of { id, name, description, price, duration, includes }
function TravelPackageList({ packages }) {
  if (!packages || packages.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">Belum ada paket wisata tersedia</p>
    )
  }

  return (
    <div className="space-y-3">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-green-50 border border-green-100 rounded-xl p-4"
        >
          {/* Nama paket dan harga */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h5 className="font-semibold text-green-800 text-sm">{pkg.name}</h5>
            <span className="text-green-700 font-bold text-sm whitespace-nowrap">
              {formatRupiahShort(pkg.price)}
            </span>
          </div>

          {/* Deskripsi paket */}
          {pkg.description && (
            <p className="text-gray-600 text-xs mb-2">{pkg.description}</p>
          )}

          {/* Durasi dan fasilitas */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {pkg.duration && (
              <span className="flex items-center gap-1">
                ⏱️ {pkg.duration}
              </span>
            )}
            {pkg.includes && (
              <span className="flex items-center gap-1">
                ✅ {pkg.includes}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TravelPackageList
