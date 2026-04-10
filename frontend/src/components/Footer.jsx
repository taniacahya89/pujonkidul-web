import { NavLink } from 'react-router-dom'

// Komponen footer sederhana dengan informasi aplikasi
function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi aplikasi */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-lg">Pujon Kidul Explore</span>
            </div>
            <p className="text-green-200 text-sm">
              Platform wisata untuk menjelajahi destinasi, peta interaktif, dan
              kalkulator budget perjalanan ke kawasan Pujon Kidul, Malang.
            </p>
          </div>

          {/* Link navigasi */}
          <div>
            <h3 className="font-semibold mb-3">Navigasi</h3>
            <ul className="space-y-2 text-green-200 text-sm">
              <li><NavLink to="/" className="hover:text-white">Beranda</NavLink></li>
              <li><NavLink to="/wisata" className="hover:text-white">Wisata</NavLink></li>
              <li><NavLink to="/peta" className="hover:text-white">Peta Interaktif</NavLink></li>
              <li><NavLink to="/budget" className="hover:text-white">Kalkulator Budget</NavLink></li>
              <li><NavLink to="/webgis" className="hover:text-white">WebGIS</NavLink></li>
            </ul>
          </div>

          {/* Informasi lokasi */}
          <div>
            <h3 className="font-semibold mb-3">Lokasi</h3>
            <p className="text-green-200 text-sm">
              📍 Desa Pujon Kidul, Kecamatan Pujon<br />
              Kabupaten Malang, Jawa Timur<br />
              Indonesia
            </p>
          </div>
        </div>

        <div className="border-t border-green-700 mt-6 pt-4 text-center text-green-300 text-xs">
          © 2024 Pujon Kidul Explore. Dibuat dengan ❤️ untuk wisata Malang.
        </div>
      </div>
    </footer>
  )
}

export default Footer
