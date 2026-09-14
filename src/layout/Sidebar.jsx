import { NavLink, useNavigate } from 'react-router-dom'
import { X, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/mediciones', label: 'Mediciones' },
  { to: '/mapa', label: 'Mapa' },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 p-6 text-white shadow-2xl transition-transform duration-300 md:static md:min-h-screen md:translate-x-0 md:shadow-none border-r border-emerald-700/30 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="mb-10 flex items-center justify-between px-2">
            <h1 className="text-xl font-bold tracking-wider text-emerald-100 flex items-center gap-2">
              Plant<span className="text-emerald-400">Care</span>
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-emerald-200 hover:bg-white/10 transition-colors md:hidden"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/15 text-white shadow-inner font-semibold border border-white/10 backdrop-blur-sm'
                      : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-red-200 bg-red-500/10 hover:bg-red-500/20 hover:text-white transition-all duration-200 border border-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>
    </>
  )
}

export default Sidebar