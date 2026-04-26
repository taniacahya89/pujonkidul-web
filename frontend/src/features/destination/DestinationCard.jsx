import { useState } from 'react'
import { formatRupiahShort } from '../../utils/formatCurrency'
import DestinationModal from './DestinationModal'

const IMAGE_MAP = {
  'Cafe Sawah':                      '/images/cafesawah_img.jpg',
  'Coban Rondo':                     '/images/cobanrondo_img.jpg',
  'Bukit Nirwana':                   '/images/nirwana_img.jpeg',
  'Bobocabin Coban Rondo':           '/images/bobocabin_img.jpg',
  'Kelinci Park':                    '/images/kelincipark_img.jpg',
  'Florawisata Santerra De Laponte': '/images/santerra_img.jpg',
}

function DestinationCard({ destination }) {
  const [modalOpen, setModalOpen] = useState(false)

  const imageSrc =
    IMAGE_MAP[destination.name] ||
    destination.detail?.image_url ||
    '/images/placeholder.jpg'

  return (
    <>
      <div
        className="card-base rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setModalOpen(true)}
      >
        {/* Gambar dominan — 16:9 */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={imageSrc}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
          />
          {/* Rating — minimal badge */}
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-semibold"
            style={{ backgroundColor: 'rgba(20,22,8,0.72)', color: '#E3DBBB' }}
          >
            {destination.rating?.toFixed(1)}
          </div>
        </div>

        {/* Info — pendukung, bukan dominan */}
        <div className="p-4">
          {/* Nama — level 1 */}
          <h3
            className="font-semibold text-sm leading-snug"
            style={{ color: 'var(--text-1)', marginBottom: '8px' }}
          >
            {destination.name}
          </h3>

          {/* Metadata — level 3 */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: '12px' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
              {formatRupiahShort(destination.ticket_price)}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>
              {destination.opening_hours}
            </span>
          </div>

      {/* CTA */}
          <button
            className="w-full py-2 rounded-lg text-xs font-semibold transition-all duration-150 btn-secondary"
            onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
          >
            Lihat Detail
          </button>
        </div>
      </div>

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
