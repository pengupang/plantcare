import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"

export function MapaTerreno({ terreno, center = [-36.6067, -72.1034], zoom = 13, height = "280px" }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-green-700" />
        <h2 className="text-lg font-bold text-slate-800">
          Ubicación del Terreno {terreno ? `— ${terreno.nombre}` : ""}
        </h2>
      </div>
      
      <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-slate-200">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              {terreno ? terreno.nombre : "Seleccione un terreno"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}