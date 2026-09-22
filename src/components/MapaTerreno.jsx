import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"

export function MapaTerreno({ terreno, height = "280px" }) {
  // Coordenadas predeterminadas por defecto: Osorno, Chile (-40.5724, -73.1353)
  let center = [-40.5724, -73.1353]

  // Si hay un terreno seleccionado y cuenta con coordenadas en formato JSON {"lat": ..., "lng": ...}
  if (terreno && terreno.coordenadas_centro) {
    const coords = terreno.coordenadas_centro
    if (coords.lat !== undefined && coords.lng !== undefined) {
      center = [coords.lat, coords.lng]
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-emerald-700" />
        <h2 className="text-lg font-bold text-slate-800">
          Ubicación del Terreno {terreno ? `— ${terreno.nombre}` : "— Osorno"}
        </h2>
      </div>
      
      <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-slate-200">
        <MapContainer 
          key={JSON.stringify(center)} // Fuerza a Leaflet a recentrar el mapa al cambiar de terreno
          center={center} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              {terreno ? terreno.nombre : "Osorno, Región de Los Lagos"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}