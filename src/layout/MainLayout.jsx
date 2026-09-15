import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import WeatherWidget from '../components/WeatherWidget'
import Footer from '@/components/Footer'    

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Cambiamos bg-slate por bg-white shadow-sm para que sea un fondo sólido */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white shadow-sm px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-green-800 hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-green-800">PlantCare</span>
        </header>

        <main className="flex-1 bg-slate-50">
          <Outlet />
        </main>
        <Footer />
      </div>

      <WeatherWidget />
    </div>
  )
}

export default MainLayout