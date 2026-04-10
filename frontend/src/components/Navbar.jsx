import { NavLink } from 'react-router-dom'

// Daftar item navigasi utama
const navItems = [
  { path: '/', label: 'Beranda' },
  { path: '/wisata', label: 'Wisata' },
  { path: '/peta', label: 'Peta' },
  { path: '/budget', label: 'Budget' },
  { path: '/webgis', label: 'WebGIS' },
]

// Komponen navigasi utama dengan active state berdasarkan route saat ini
function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo dan nama aplikasi */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-green-700 text-lg">
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
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Tombol CTA di navbar */}
          <NavLink
            to="/budget"
            className="hidden md:block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Rencanakan Wisata
          </NavLink>
        </div>

        {/* Navigasi mobile */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
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
