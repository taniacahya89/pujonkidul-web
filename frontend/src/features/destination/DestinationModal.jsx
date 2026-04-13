import { useEffect } from 'react'
import { formatRupiahShort } from '../../utils/formatCurrency'

// Buka Google Maps navigasi ke koordinat destinasi
function openGoogleMaps(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    '_blank',
    'noopener,noreferrer'
  )
}

// Modal detail destinasi — near full-screen overlay
// Menampilkan data real tanpa fake/halusinasi
// Props:
//   - destination: objek data destinasi lengkap
//   - imageSrc: path gambar lokal
//   - onClose: callback tutup modal
function DestinationModal({ destination, imageSrc, onClose }) {
  // Tutup modal saat tekan Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    /* Overlay backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      {/* Modal panel — max-w-2xl, scroll jika konten panjang */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#F8F3E1' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: 'rgba(65,67,27,0.8)', color: '#F8F3E1' }}
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* Gambar header */}
        <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: '16/7' }}>
          <img
            src={imageSrc}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
          />
          {/* Overlay gradient untuk readability judul */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(65,67,27,0.7) 0%, transparent 50%)' }}
          />
          <div className="absolute bottom-4 left-5 right-12">
            <h2 className="font-bold text-2xl leading-tight" style={{ color: '#F8F3E1' }}>
              {destination.name}
            </h2>
            {destination.address && (
              <p className="text-sm mt-1" style={{ color: '#E3DBBB' }}>
                📍 {destination.address}
              </p>
            )}
          </div>
        </div>

        {/* Konten detail — vertical flow */}
        <div className="p-6 space-y-5">

          {/* Deskripsi singkat */}
          <p className="text-sm leading-relaxed" style={{ color: '#41431B' }}>
            {destination.short_description}
          </p>

          {/* Section: Jam Buka */}
          <section>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#4C5C2D' }}>
              🕐 Jam Buka
            </h3>
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ backgroundColor: '#fff', color: '#41431B' }}
            >
              {destination.opening_hours}
            </div>
          </section>

          {/* Section: Harga Tiket */}
          <section>
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#4C5C2D' }}>
              🎫 Harga Tiket
            </h3>
            <div
              className="rounded-xl px-4 py-3 text-sm space-y-1"
              style={{ backgroundColor: '#fff', color: '#41431B' }}
            >
              <TicketInfo name={destination.name} basePrice={destination.ticket_price} />
            </div>
          </section>

          {/* Section: Parkir */}
          {destination.parking_info && (
            <section>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#4C5C2D' }}>
                🅿️ Tarif Parkir
              </h3>
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: '#fff', color: '#41431B' }}
              >
                {destination.parking_info.split('|').map((item, i) => (
                  <div key={i} className="py-0.5">{item.trim()}</div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Akses Kendaraan */}
          {destination.vehicle_access && (
            <section>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#4C5C2D' }}>
                🚗 Akses Kendaraan
              </h3>
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: '#fff', color: '#41431B' }}
              >
                {destination.vehicle_access}
              </div>
            </section>
          )}

          {/* Section: Waktu Terbaik */}
          {destination.best_time && (
            <section>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: '#4C5C2D' }}>
                ⏰ Waktu Terbaik Berkunjung
              </h3>
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: '#fff', color: '#41431B' }}
              >
                {destination.best_time}
              </div>
            </section>
          )}

          {/* Tombol navigasi Google Maps */}
          <button
            onClick={() => openGoogleMaps(destination.latitude, destination.longitude)}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-colors"
            style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
          >
            🧭 Buka di Google Maps
          </button>
        </div>
      </div>
    </div>
  )
}

// Komponen harga tiket berdasarkan data real per destinasi
// Tidak ada data fiktif — hanya tampilkan yang ada
function TicketInfo({ name, basePrice }) {
  const ticketData = {
    'Cafe Sawah': [
      { label: 'Tiket Masuk', price: 10000 },
    ],
    'Coban Rondo': [
      { label: 'Weekday', price: 35000 },
      { label: 'Weekend', price: 40000 },
    ],
    'Bukit Nirwana': [
      { label: 'Tiket Masuk', price: 10000 },
    ],
    'Bobocabin Coban Rondo': [
      { label: 'Weekday', price: 35000 },
      { label: 'Weekend', price: 40000 },
    ],
    'Kelinci Park': [
      { label: 'Tiket Dewasa', price: 20000 },
      { label: 'Tiket Anak-anak', price: 10000 },
    ],
    'Florawisata Santerra De Laponte': [
      { label: 'Reguler Weekday', price: 30000 },
      { label: 'Reguler Weekend', price: 35000 },
      { label: 'Terusan Weekday', price: 70000 },
      { label: 'Terusan Weekend', price: 85000 },
    ],
  }

  const items = ticketData[name]
  if (!items) {
    return <span>{formatRupiahShort(basePrice)}</span>
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between">
          <span style={{ color: '#4C5C2D' }}>{item.label}</span>
          <span className="font-semibold">{formatRupiahShort(item.price)}</span>
        </div>
      ))}
    </div>
  )
}

export default DestinationModal
