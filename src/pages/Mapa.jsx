import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import L from 'leaflet'

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
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 1
      }).addTo(map)
      marcadores.push(marcador)
      if (polilinea) map.removeLayer(polilinea)
      if (puntos.length > 1) {
        polilinea = L.polyline(puntos, { color: '#22c55e' }).addTo(map)
      }
    })

    map.on('dblclick', function() {
      if (puntos.length < 3) return
      if (polilinea) map.removeLayer(polilinea)
      marcadores.forEach(m => map.removeLayer(m))
      poligono = L.polygon(puntos, {
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.3
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Mapa</h1>
      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '500px' }}>
        <MapContainer
          center={[-33.4569, -70.6483]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
<DibujarTerreno onCreated={handleCreated} poligonoRef={poligonoRef} limpiarRef={limpiarRef} />        </MapContainer>
      </div>
      <button onClick={limpiarMapa} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
        Limpiar
      </button>
    </div>
  )
}

export default Mapa