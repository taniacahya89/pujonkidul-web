import { NavLink } from 'react-router-dom'

// Komponen footer sederhana dengan informasi aplikasi
function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#41431B', color: '#E3DBBB' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi aplikasi */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-lg" style={{ color: '#F8F3E1' }}>Pujon Kidul Explore</span>
            </div>
            <p className="text-sm" style={{ color: '#AEB784' }}>
              Platform wisata untuk menjelajahi destinasi, peta interaktif, dan
              kalkulator budget perjalanan ke kawasan Pujon Kidul, Malang.
            </p>
          </div>

          {/* Link navigasi */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: '#F8F3E1' }}>Navigasi</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#AEB784' }}>
              <li><NavLink to="/" className="hover:text-white">Beranda</NavLink></li>
              <li><NavLink to="/wisata" className="hover:text-white">Wisata</NavLink></li>
              <li><NavLink to="/peta" className="hover:text-white">Peta Interaktif</NavLink></li>
              <li><NavLink to="/budget" className="hover:text-white">Kalkulator Budget</NavLink></li>
              <li><NavLink to="/akses-jalan" className="hover:text-white">Akses Jalan</NavLink></li>
            </ul>
          </div>

          {/* Informasi lokasi */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: '#F8F3E1' }}>Lokasi</h3>
            <p className="text-sm" style={{ color: '#AEB784' }}>
              📍 Desa Pujon Kidul, Kecamatan Pujon<br />
              Kabupaten Malang, Jawa Timur<br />
              Indonesia
            </p>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-center text-xs" style={{ borderColor: '#4C5C2D', color: '#AEB784' }}>
          © 2024 Pujon Kidul Explore. Dibuat dengan ❤️ untuk wisata Malang.
        </div>
      </div>
    </footer>
  )
}

export default Footer
