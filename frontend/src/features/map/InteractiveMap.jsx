import { useEffect, useRef } from 'react'
import { PUJON_KIDUL_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants'

// Komponen peta interaktif menggunakan Leaflet vanilla JS
// PENTING: Menggunakan useRef + useEffect, BUKAN react-leaflet
// Props:
//   - destinations: array destinasi dengan latitude dan longitude
//   - onMarkerClick: callback saat marker diklik, menerima objek destinasi
function InteractiveMap({ destinations, onMarkerClick }) {
  // Ref ke DOM element container peta
  const mapContainerRef = useRef(null)
  // Ref ke instance L.map (bukan state, agar tidak trigger re-render)
  const mapInstanceRef = useRef(null)
  // Ref ke array marker aktif
  const markersRef = useRef([])

  // Inisialisasi peta Leaflet saat komponen pertama kali mount
  useEffect(() => {
    // Hindari inisialisasi ganda (React StrictMode double-invoke)
    if (mapInstanceRef.current) return
    if (!mapContainerRef.current) return

    // Pastikan Leaflet tersedia (dimuat via CDN di index.html)
    const L = window.L
    if (!L) {
      console.error('Leaflet tidak tersedia. Pastikan leaflet.css dan leaflet.js dimuat.')
      return
    }

    // Inisialisasi instance L.map dengan center Pujon Kidul
    const map = L.map(mapContainerRef.current, {
      center: PUJON_KIDUL_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    // Tambahkan tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    // Cleanup: hapus instance peta saat komponen unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Hanya run sekali saat mount

  // Update marker saat data destinasi berubah
  useEffect(() => {
    const L = window.L
    if (!mapInstanceRef.current || !L || !destinations.length) return

    // Hapus semua marker lama sebelum menambahkan yang baru
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Tambahkan marker baru untuk setiap destinasi
    destinations.forEach((destination) => {
      // Skip destinasi dengan koordinat tidak valid (lat=0 dan lon=0)
      if (!destination.latitude || !destination.longitude) return
      if (destination.latitude === 0 && destination.longitude === 0) return

      // Buat custom icon marker dengan div HTML
      const customIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: #16a34a;
            color: white;
            border-radius: 50% 50% 50% 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg);">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      // Buat marker dan tambahkan ke peta
      const marker = L.marker([destination.latitude, destination.longitude], {
        icon: customIcon,
        title: destination.name,
      })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          // Panggil callback dengan data destinasi yang diklik
          if (onMarkerClick) onMarkerClick(destination)
        })

      markersRef.current.push(marker)
    })
  }, [destinations, onMarkerClick])

  return (
    // Container peta — Leaflet membutuhkan height eksplisit
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-xl z-0"
      style={{ minHeight: '400px' }}
    />
  )
}

export default InteractiveMap
