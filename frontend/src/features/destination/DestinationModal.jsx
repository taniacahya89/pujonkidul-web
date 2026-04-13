import { useEffect, useState } from 'react'
import { formatRupiahShort } from '../../utils/formatCurrency'

function openGoogleMaps(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    '_blank',
    'noopener,noreferrer'
  )
}

const IMAGES_MAP = {
  'Cafe Sawah':                      ['/images/cafesawah_img.jpg'],
  'Coban Rondo':                     ['/images/cobanrondo_img.jpg'],
  'Bukit Nirwana':                   ['/images/nirwana_img.jpeg'],
  'Bobocabin Coban Rondo':           ['/images/bobocabin_img.jpg'],
  'Kelinci Park':                    ['/images/kelincipark_img.jpg'],
  'Florawisata Santerra De Laponte': ['/images/santerra_img.jpg'],
}

const TICKET_DATA = {
  'Cafe Sawah':                      [{ label: 'Tiket Masuk', price: 10000 }],
  'Coban Rondo':                     [{ label: 'Weekday', price: 35000 }, { label: 'Weekend', price: 40000 }],
  'Bukit Nirwana':                   [{ label: 'Tiket Masuk', price: 10000 }],
  'Bobocabin Coban Rondo':           [{ label: 'Weekday', price: 35000 }, { label: 'Weekend', price: 40000 }],
  'Kelinci Park':                    [{ label: 'Dewasa', price: 20000 }, { label: 'Anak-anak', price: 10000 }],
  'Florawisata Santerra De Laponte': [
    { label: 'Reguler Weekday', price: 30000 },
    { label: 'Reguler Weekend', price: 35000 },
    { label: 'Terusan Weekday', price: 70000 },
    { label: 'Terusan Weekend', price: 85000 },
  ],
}

// Slider gambar — transisi halus, navigasi minimal
function ImageSlider({ images, name }) {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: '16/8', borderRadius: '12px 12px 0 0' }}>
      <div
        className="slider-track h-full"
        style={{ transform: `translateX(-${current * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((src, i) => (
          <div key={i} style={{ width: `${100 / images.length}%`, height: '100%', flexShrink: 0 }}>
            <img
              src={src}
              alt={`${name} ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
            />
          </div>
        ))}
      </div>

      {/* Gradient bawah untuk readability judul */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(20,22,8,0.55) 0%, transparent 50%)' }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'rgba(20,22,8,0.55)', color: '#F8F3E1', border: 'none', cursor: 'pointer' }}
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'rgba(20,22,8,0.55)', color: '#F8F3E1', border: 'none', cursor: 'pointer' }}
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === current ? '#E3DBBB' : 'rgba(248,243,225,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'width 0.25s, background-color 0.25s',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Section info — label + konten, dipisah spacing bukan garis
function InfoSection({ label, children }) {
  return (
    <div style={{ paddingTop: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--surface-2)' }}>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-3)', marginBottom: '6px' }}
      >
        {label}
      </p>
      <div className="text-sm" style={{ color: 'var(--text-1)', lineHeight: '1.6' }}>
        {children}
      </div>
    </div>
  )
}

function DestinationModal({ destination, imageSrc, onClose }) {
  const images = IMAGES_MAP[destination.name] || [imageSrc]
  const tickets = TICKET_DATA[destination.name]

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(20,22,8,0.65)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-y-auto rounded-xl"
        style={{
          backgroundColor: 'var(--bg)',
          maxHeight: '92vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: 'rgba(20,22,8,0.6)',
            color: '#F8F3E1',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* Slider */}
        <ImageSlider images={images} name={destination.name} />

        {/* Konten — vertical flow */}
        <div style={{ padding: '24px' }}>
          {/* Nama — heading level 1 */}
          <h2
            className="font-display"
            style={{ fontSize: '1.5rem', color: 'var(--text-1)', marginBottom: '4px' }}
          >
            {destination.name}
          </h2>

          {/* Alamat — metadata */}
          {destination.address && (
            <p className="text-xs" style={{ color: 'var(--text-3)', marginBottom: '12px' }}>
              {destination.address}
            </p>
          )}

          {/* Deskripsi — body */}
          {destination.short_description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-2)', marginBottom: '8px', lineHeight: '1.7' }}
            >
              {destination.short_description}
            </p>
          )}

          {/* Info sections */}
          <div style={{ marginTop: '8px' }}>
            <InfoSection label="Jam Buka">
              {destination.opening_hours}
            </InfoSection>

            <InfoSection label="Harga Tiket">
              {tickets ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {tickets.map((t) => (
                    <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-2)' }}>{t.label}</span>
                      <span style={{ fontWeight: '600' }}>{formatRupiahShort(t.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span>{formatRupiahShort(destination.ticket_price)}</span>
              )}
            </InfoSection>

            {destination.parking_info && (
              <InfoSection label="Parkir">
                {destination.parking_info.split('|').map((item, i) => (
                  <div key={i}>{item.trim()}</div>
                ))}
              </InfoSection>
            )}

            {destination.vehicle_access && (
              <InfoSection label="Akses Kendaraan">
                {destination.vehicle_access}
              </InfoSection>
            )}

            {destination.best_time && (
              <InfoSection label="Waktu Terbaik">
                {destination.best_time}
              </InfoSection>
            )}
          </div>

          {/* CTA */}
          <button
            className="btn-primary w-full"
            style={{ marginTop: '24px' }}
            onClick={() => openGoogleMaps(destination.latitude, destination.longitude)}
          >
            Buka di Google Maps
          </button>
        </div>
      </div>
    </div>
  )
}

export default DestinationModal
