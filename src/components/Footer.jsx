import { Leaf, CircleDot } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden md:flex items-center justify-between px-8 py-5 bg-white border-t border-slate-100 text-xs text-slate-500 mt-auto">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
          <Leaf className="h-4 w-4" />
          <span>PlantCare</span>
        </div>
        <span>·</span>
        <span>Sistema IoT Agrícola</span>
      </div>

      <div className="flex items-center gap-4">
        <span>Temporada {currentYear}</span>
        <span>·</span>
        <div className="flex items-center gap-2 text-emerald-600">
          <CircleDot className="h-2.5 w-2.5 fill-emerald-500" />
          <span className='font-medium'>Agricultura con Conciencia</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer