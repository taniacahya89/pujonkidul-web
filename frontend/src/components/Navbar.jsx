import { NavLink } from 'react-router-dom'

// 5 item navigasi — WebGIS dihapus
const navItems = [
  { path: '/',            label: 'Beranda' },
  { path: '/wisata',      label: 'Wisata' },
  { path: '/peta',        label: 'Peta' },
  { path: '/budget',      label: 'Budget' },
  { path: '/akses-jalan', label: 'Akses Jalan' },
]

// Komponen navigasi utama dengan active state berdasarkan route saat ini
// Menggunakan palette brand: dark=#41431B, green=#237227, cream=#E3DBBB
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#41431B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan nama aplikasi */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-lg" style={{ color: '#E3DBBB' }}>
              Pujon Kidul Explore
            </span>
          </NavLink>

          {/* Link navigasi desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.15s',
                  backgroundColor: isActive ? '#237227' : 'transparent',
                  color: isActive ? '#F8F3E1' : '#AEB784',
                  textDecoration: 'none',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Tombol CTA */}
          <NavLink
            to="/budget"
            className="hidden md:block text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
          >
            Rencanakan Wisata
          </NavLink>
        </div>

        {/* Navigasi mobile — scroll horizontal */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#237227' : 'transparent',
                color: isActive ? '#F8F3E1' : '#AEB784',
                textDecoration: 'none',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
