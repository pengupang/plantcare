import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Button } from "@/components/ui/button"
import { MapPin, Trash2, Info } from 'lucide-react'

function DibujarTerreno({ onCreated, poligonoRef, limpiarRef }) {
  const map = useMap()

  useEffect(() => {
    let puntos = []
    let marcadores = []
    let polilinea = null
    let poligono = null

    const limpiar = () => {
      puntos = []
      marcadores.forEach(m => map.removeLayer(m))
      marcadores = []
      if (polilinea) { map.removeLayer(polilinea); polilinea = null }
      if (poligono) { map.removeLayer(poligono); poligono = null }
      poligonoRef.current = null
    }

    limpiarRef.current = limpiar  // <- guardas la función de limpieza

    map.on('click', function(e) {
      if (poligono) return
      puntos.push(e.latlng)
      const marcador = L.circleMarker(e.latlng, {
        radius: 5,
        color: '#047857',
        fillColor: '#059669',
        fillOpacity: 1
      }).addTo(map)
      marcadores.push(marcador)
      if (polilinea) map.removeLayer(polilinea)
      if (puntos.length > 1) {
        polilinea = L.polyline(puntos, { color: '#059669' }).addTo(map)
      }
    })

    map.on('dblclick', function() {
      if (puntos.length < 3) return
      if (polilinea) map.removeLayer(polilinea)
      marcadores.forEach(m => map.removeLayer(m))
      poligono = L.polygon(puntos, {
        color: '#047857',
        fillColor: '#059669',
        fillOpacity: 0.35
      }).addTo(map)
      poligonoRef.current = poligono
      onCreated(puntos)
    })

    return () => {
      map.off('click')
      map.off('dblclick')
    }
  }, [map])

  return null
}

function Mapa() {
  const poligonoRef = useRef(null)

  const handleCreated = (coords) => {
    console.log('Terreno delimitado:', coords)
  }

  const limpiarRef = useRef(null)

  const limpiarMapa = () => {
    if (limpiarRef.current) {
      limpiarRef.current()
    }
  }

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      {/* Header de la sección */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Delimitación de Terrenos</h1>
        <p className="text-xs text-slate-500">Mapeo espacial y registro visual de polígonos agrícolas</p>
      </div>

      {/* Grid de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Columna del Mapa (3/4 de ancho) */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Área de Trabajo Cartográfica</span>
            </h2>
            <Button 
              onClick={limpiarMapa} 
              variant="outline"
              className="h-9 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Limpiar trazo
            </Button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200/80 shadow-inner" style={{ height: '480px' }}>
            <MapContainer
              center={[-33.4569, -70.6483]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <DibujarTerreno onCreated={handleCreated} poligonoRef={poligonoRef} limpiarRef={limpiarRef} />
            </MapContainer>
          </div>
        </div>

        {/* Columna Lateral de Instrucciones (1/4 de ancho) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/60 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Instrucciones</h3>
                <p className="text-[11px] text-slate-500">Guía de uso del mapa</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 border border-emerald-100 text-[10px]">1</span>
                <span>Haz <strong>clic izquierdo</strong> en el mapa para marcar los vértices del terreno.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 border border-emerald-100 text-[10px]">2</span>
                <span>Haz <strong>doble clic</strong> en el último punto para cerrar y completar el polígono.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 font-bold flex items-center justify-center shrink-0 border border-red-100 text-[10px]">3</span>
                <span>Usa el botón <strong>Limpiar trazo</strong> para reiniciar el dibujo si necesitas corregirlo.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Mapa