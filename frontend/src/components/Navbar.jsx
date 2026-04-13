import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/',            label: 'Beranda' },
  { path: '/wisata',      label: 'Wisata' },
  { path: '/peta',        label: 'Peta' },
  { path: '/budget',      label: 'Budget' },
  { path: '/akses-jalan', label: 'Akses Jalan' },
]

// Navbar: background terang, teks gelap, active state underline tipis
function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--surface-2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink
            to="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span
              className="font-display font-bold text-base"
              style={{ color: 'var(--text-1)', letterSpacing: '-0.01em' }}
            >
              Pujon Kidul
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-2)' }}
            >
              Explore
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? 'var(--text-1)' : 'var(--text-3)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.15s',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <NavLink to="/budget" className="hidden md:block btn-primary" style={{ textDecoration: 'none' }}>
            Rencanakan Wisata
          </NavLink>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
                whiteSpace: 'nowrap',
                color: isActive ? 'var(--text-1)' : 'var(--text-3)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
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
