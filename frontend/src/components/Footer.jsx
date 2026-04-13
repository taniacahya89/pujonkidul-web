import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20">
          {/* Brand */}
          <div style={{ maxWidth: '260px' }}>
            <p className="font-display font-bold text-base mb-3" style={{ color: 'var(--text-1)' }}>
              Pujon Kidul Explore
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)', lineHeight: '1.7' }}>
              Platform wisata kawasan Pujon Kidul, Malang. Destinasi, peta interaktif, dan kalkulator budget perjalanan.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-3)' }}
            >
              Halaman
            </p>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/wisata', label: 'Wisata' },
                { to: '/peta', label: 'Peta Interaktif' },
                { to: '/budget', label: 'Kalkulator Budget' },
                { to: '/akses-jalan', label: 'Akses Jalan' },
              ].map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: '13px' }}
                    className="hover-text-1"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-3)' }}
            >
              Lokasi
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: '1.8' }}>
              Desa Pujon Kidul<br />
              Kecamatan Pujon, Kabupaten Malang<br />
              Jawa Timur, Indonesia
            </p>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--surface-2)', color: 'var(--text-3)' }}
        >
          2024 Pujon Kidul Explore
        </div>
      </div>
    </footer>
  )
}

export default Footer
