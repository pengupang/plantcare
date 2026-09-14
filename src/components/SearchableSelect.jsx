import { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchableSelect({ 
  items = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  searchPlaceholder = "Buscar...",
  disabled = false 
}) {
  const [open, setOpen] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const ref = useRef(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const itemsFiltrados = items.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="bg-white shadow-sm border-slate-200 justify-between w-[220px] font-normal"
      >
        <span className="truncate">
          {value ? value.nombre : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute left-0 mt-2 w-[260px] p-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
          <div className="flex items-center border-b border-slate-100 px-3 pb-2 mb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="h-8 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0"
              autoFocus
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {itemsFiltrados.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">No se encontraron resultados.</p>
            ) : (
              itemsFiltrados.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onChange(item)
                    setOpen(false)
                    setBusqueda("")
                  }}
                  className="flex items-center justify-between px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 cursor-pointer font-medium text-slate-700 transition-colors"
                >
                  <span>{item.nombre}</span>
                  {value?.id === item.id && <Check className="h-4 w-4 text-green-700" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}