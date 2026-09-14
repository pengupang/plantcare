import { useEffect, useState } from "react"
import { Cloud, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const UBICACION_DEFAULT = { lat: -36.6067, lon: -72.1034, nombre: "Chillán, Ñuble" }

const CODIGOS_CLIMA = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna leve",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  61: "Lluvia leve",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  71: "Nieve leve",
  73: "Nieve moderada",
  75: "Nieve intensa",
  80: "Chubascos leves",
  81: "Chubascos moderados",
  82: "Chubascos intensos",
  95: "Tormenta eléctrica",
}

function descripcionClima(codigo) {
  return CODIGOS_CLIMA[codigo] ?? "Condición desconocida"
}

function formatDia(fechaISO) {
  const d = new Date(fechaISO + "T00:00:00")
  return d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric" })
}

function WeatherWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ubicacionNombre, setUbicacionNombre] = useState(UBICACION_DEFAULT.nombre)
  const [actual, setActual] = useState(null)
  const [diario, setDiario] = useState([])

  const cargarClima = (lat, lon) => {
    setLoading(true)
    setError(null)

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&forecast_days=7`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el clima")
        return res.json()
      })
      .then((data) => {
        setActual(data.current)
        const dias = data.daily.time.map((fecha, i) => ({
          fecha,
          codigo: data.daily.weather_code[i],
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          probLluvia: data.daily.precipitation_probability_max[i],
        }))
        setDiario(dias)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!open) return
    if (actual) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUbicacionNombre("Tu ubicación")
          cargarClima(pos.coords.latitude, pos.coords.longitude)
        },
        () => {
          setUbicacionNombre(UBICACION_DEFAULT.nombre)
          cargarClima(UBICACION_DEFAULT.lat, UBICACION_DEFAULT.lon)
        },
        { timeout: 5000 }
      )
    } else {
      cargarClima(UBICACION_DEFAULT.lat, UBICACION_DEFAULT.lon)
    }
  }, [open])

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-4 z-40 rounded-full bg-green-700 text-white hover:bg-green-800 shadow-md border-0"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ver el clima"
      >
        <Cloud className="h-5 w-5" />
      </Button>

      {open && (
        <Card className="fixed top-16 right-4 z-40 w-80 max-h-[80vh] overflow-y-auto bg-white shadow-xl rounded-2xl border border-slate-200/80">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-800">Clima — {ubicacionNombre}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin text-green-700" />
                Cargando clima...
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {!loading && actual && (
              <div className="mb-4 pb-3 border-b border-slate-100">
                <p className="text-3xl font-bold text-slate-900">{Math.round(actual.temperature_2m)}°C</p>
                <p className="text-sm text-slate-600">{descripcionClima(actual.weather_code)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Humedad: {actual.relative_humidity_2m}% · Viento: {Math.round(actual.wind_speed_10m)} km/h
                </p>
              </div>
            )}

            {!loading && diario.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Próximos días</p>
                {diario.map((d) => (
                  <div key={d.fecha} className="flex justify-between items-center text-sm py-1">
                    <span className="capitalize w-20 text-slate-700 font-medium">{formatDia(d.fecha)}</span>
                    <span className="flex-1 text-slate-600 text-xs px-2 truncate">{descripcionClima(d.codigo)}</span>
                    <span className="text-xs text-blue-600 w-10 text-right font-medium">{d.probLluvia}%</span>
                    <span className="w-16 text-right text-slate-800 font-semibold text-xs">
                      {Math.round(d.max)}° / {Math.round(d.min)}°
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default WeatherWidget