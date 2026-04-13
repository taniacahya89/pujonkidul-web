import { useState } from 'react'
import { formatRupiahShort } from '../../utils/formatCurrency'
import DestinationModal from './DestinationModal'

// Mapping nama destinasi ke local image path
const IMAGE_MAP = {
  'Cafe Sawah':                    '/images/cafesawah_img.jpg',
  'Coban Rondo':                   '/images/cobanrondo_img.jpg',
  'Bukit Nirwana':                 '/images/nirwana_img.jpeg',
  'Bobocabin Coban Rondo':         '/images/bobocabin_img.jpg',
  'Kelinci Park':                  '/images/kelincipark_img.jpg',
  'Florawisata Santerra De Laponte': '/images/santerra_img.jpg',
}

// Komponen card destinasi wisata — visual-first design
// Gambar tampil sejak awal, detail via modal overlay
// Props:
//   - destination: objek data destinasi lengkap
function DestinationCard({ destination }) {
  const [modalOpen, setModalOpen] = useState(false)

  // Ambil gambar dari local map, fallback ke image_url dari DB, lalu placeholder
  const imageSrc =
    IMAGE_MAP[destination.name] ||
    destination.detail?.image_url ||
    '/images/placeholder.jpg'

  return (
    <>
      {/* Card — minimal, clean, visual-first */}
      <div
        className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        style={{ backgroundColor: '#fff' }}
        onClick={() => setModalOpen(true)}
      >
        {/* Gambar — dominant visual, aspect ratio 4:3 */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={imageSrc}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg'
            }}
          />
          {/* Rating badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'rgba(65,67,27,0.85)', color: '#AEB877' }}
          >
            ⭐ {destination.rating?.toFixed(1)}
          </div>
        </div>

        {/* Info minimal di bawah gambar */}
        <div className="p-4">
          <h3 className="font-bold text-base mb-2 leading-tight" style={{ color: '#41431B' }}>
            {destination.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            {/* Harga tiket */}
            <span
              className="text-sm font-semibold px-2 py-1 rounded-lg"
              style={{ backgroundColor: '#E3DBBB', color: '#4C5C2D' }}
            >
              🎫 {formatRupiahShort(destination.ticket_price)}
            </span>
            {/* Jam buka */}
            <span className="text-xs" style={{ color: '#4C5C2D' }}>
              🕐 {destination.opening_hours}
            </span>
          </div>
          {/* Tombol detail */}
          <button
            className="mt-3 w-full py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
            onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
          >
            Lihat Detail
          </button>
        </div>
      </div>

      {/* Modal detail — full overlay */}
      {modalOpen && (
        <DestinationModal
          destination={destination}
          imageSrc={imageSrc}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

export default DestinationCard
