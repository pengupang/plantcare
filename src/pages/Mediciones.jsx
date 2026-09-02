import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Thermometer, Droplets } from "lucide-react"

// Mapeo simple de iconos de clima según el código WMO
const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return <Sun className="h-6 w-6 text-yellow-500" />
  if (code >= 51 && code <= 65) return <CloudRain className="h-6 w-6 text-blue-500" />
  if (code >= 80 && code <= 82) return <CloudRain className="h-6 w-6 text-blue-600" />
  return <Cloud className="h-6 w-6 text-gray-400" />
}

function formatDia(fechaISO) {
  const d = new Date(fechaISO + "T00:00:00")
  return d.toLocaleDateString("es-CL", { weekday: "short", day: "numeric" })
}

function Mediciones() {
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [terrenos, setTerrenos] = useState([])
  const [loadingTerrenos, setLoadingTerrenos] = useState(false)

  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null)
  const [ultimaMedicion, setUltimaMedicion] = useState(null)
  const [loadingMediciones, setLoadingMediciones] = useState(false)

  const [recomendacion, setRecomendacion] = useState(null)
  const [pronosticoClima, setPronosticoClima] = useState([])
  const [loadingIA, setLoadingIA] = useState(false)
  const [errorIA, setErrorIA] = useState(null)

  useEffect(() => {
    const cargarClientes = async () => {
      setLoadingClientes(true)
      const { data, error } = await supabase
        .from("Clientes")
        .select("id, nombre")
        .order("nombre")
      if (!error) setClientes(data)
      setLoadingClientes(false)
    }
    cargarClientes()
  }, [])

  useEffect(() => {
    if (!clienteSeleccionado) {
      setTerrenos([])
      setTerrenoSeleccionado(null)
      return
    }
    const cargarTerrenos = async () => {
      setLoadingTerrenos(true)
      setTerrenoSeleccionado(null)
      const { data, error } = await supabase
        .from("Terrenos")
        .select("id, nombre, crop_key")
        .eq("cliente_id", clienteSeleccionado.id)
        .order("nombre")
      if (!error) setTerrenos(data)
      setLoadingTerrenos(false)
    }
    cargarTerrenos()
  }, [clienteSeleccionado])

  useEffect(() => {
    if (!terrenoSeleccionado || !terrenoSeleccionado.crop_key) {
      setUltimaMedicion(null)
      setRecomendacion(null)
      setPronosticoClima([])
      setErrorIA(null)
      return
    }

    const cargarDatosYSimular = async () => {
      setLoadingMediciones(true)
      setRecomendacion(null)
      setPronosticoClima([])
      setErrorIA(null)
      
      const { data } = await supabase
        .from("referencias_cultivo")
        .select("ref_nitrogeno, ref_fosforo, ref_potasio")
        .eq("CROP_KEY", terrenoSeleccionado.crop_key)
        .maybeSingle()

      const phSimulado = (Math.random() * (7.5 - 5.5) + 5.5).toFixed(1)
      const humedadSimulada = (Math.random() * (80 - 40) + 40).toFixed(1)
      const tempSimulada = (Math.random() * (28 - 12) + 12).toFixed(1)

      setUltimaMedicion({
        nitrogeno: data?.ref_nitrogeno ?? "n/a",
        fosforo: data?.ref_fosforo ?? "n/a",
        potasio: data?.ref_potasio ?? "n/a",
        ph: parseFloat(phSimulado),
        humedad_suelo: parseFloat(humedadSimulada),
        temperatura_suelo: parseFloat(tempSimulada)
      })
      
      setLoadingMediciones(false)
    }

    cargarDatosYSimular()
  }, [terrenoSeleccionado])

  const valor = (campo) =>
    ultimaMedicion && ultimaMedicion[campo] != null ? ultimaMedicion[campo] : "n/a"

  const obtenerRecomendacion = async () => {
    if (!ultimaMedicion) return
    setLoadingIA(true)
    setErrorIA(null)
    setRecomendacion(null)
    setPronosticoClima([])
    
    try {
      const res = await fetch("http://localhost:3001/api/recomendacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cultivo: terrenoSeleccionado.nombre,
          nitrogeno: ultimaMedicion.nitrogeno,
          fosforo: ultimaMedicion.fosforo,
          potasio: ultimaMedicion.potasio,
          ph: ultimaMedicion.ph,
          humedad_suelo: ultimaMedicion.humedad_suelo,
          temperatura_suelo: ultimaMedicion.temperatura_suelo,
        }),
      })
      if (!res.ok) throw new Error("Error del servidor")
      const data = await res.json()
      
      setRecomendacion(data.recomendacion)
      setPronosticoClima(data.clima || [])
    } catch (e) {
      console.error(e)
      setErrorIA("No se pudo generar la recomendación. ¿Está corriendo el servidor y Ollama?")
    } finally {
      setLoadingIA(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mediciones</h1>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loadingClientes || clientes.length === 0}>
                {loadingClientes ? "Cargando clientes..." : clienteSeleccionado?.nombre ?? "Seleccionar cliente"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {clientes.map((c) => (
                <DropdownMenuItem key={c.id} onClick={() => setClienteSeleccionado(c)}>
                  {c.nombre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!clienteSeleccionado || loadingTerrenos || terrenos.length === 0}>
                {!clienteSeleccionado ? "Elegí un cliente primero" : terrenoSeleccionado?.nombre ?? "Seleccionar Terreno"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {terrenos.map((t) => (
                <DropdownMenuItem key={t.id} onClick={() => setTerrenoSeleccionado(t)}>
                  {t.nombre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {terrenoSeleccionado && loadingMediciones && (
        <p className="text-gray-500 mb-4">Cargando datos de referencia INIA y simulando sensores...</p>
      )}

      {/* Tarjetas de parámetros numéricos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardTitle className="p-4">Nitrógeno</CardTitle><CardContent>{valor("nitrogeno")}</CardContent></Card>
        <Card><CardTitle className="p-4">Fósforo</CardTitle><CardContent>{valor("fosforo")}</CardContent></Card>
        <Card><CardTitle className="p-4">Potasio</CardTitle><CardContent>{valor("potasio")}</CardContent></Card>
        <Card><CardTitle className="p-4">pH</CardTitle><CardContent>{valor("ph")}</CardContent></Card>
        <Card><CardTitle className="p-4">Humedad (%)</CardTitle><CardContent>{valor("humedad_suelo")}</CardContent></Card>
        <Card><CardTitle className="p-4">Temperatura (°C)</CardTitle><CardContent>{valor("temperatura_suelo")}</CardContent></Card>
      </div>

      <div className="flex flex-col gap-4">
        <Input type="text" placeholder="Observaciones" className="h-11 rounded-lg border border-gray-300 p-2" />
        
        <Button
          onClick={obtenerRecomendacion}
          disabled={!terrenoSeleccionado || !ultimaMedicion || loadingIA}
          className="bg-blue-600 hover:bg-blue-700 text-slate-50 p-2"
        >
          {loadingIA ? "Analizando terreno y clima regional..." : "Generar recomendación IA"}
        </Button>

        {errorIA && <p className="text-red-600 text-sm">{errorIA}</p>}

        {/* Zona de Análisis Integral: IA (Izquierda) + Clima (Derecha) */}
        {recomendacion && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            
            {/* Columna Izquierda: Reporte IA (Ocupa 2/3 del espacio) */}
            <Card className="lg:col-span-2 border-blue-100 shadow-md">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Diagnóstico IA</h3>
                  <p className="font-semibold text-lg">{recomendacion.estado_general}</p>
                </div>

                {recomendacion.alertas?.length > 0 && (
                  <div className="space-y-2 p-3 bg-red-50 rounded-md border border-red-100">
                    {recomendacion.alertas.map((a, i) => (
                      <p key={i} className="text-red-700 text-sm font-medium flex gap-2">
                        <span>⚠</span> {a}
                      </p>
                    ))}
                  </div>
                )}

                {recomendacion.recomendaciones?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Plan de Acción:</h4>
                    <ul className="space-y-3">
                      {recomendacion.recomendaciones.map((r, i) => (
                        <li key={i} className="bg-gray-50 p-3 rounded-md border border-gray-100 text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-gray-800">{r.accion}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              r.prioridad === 'alta' ? 'bg-red-100 text-red-700' : 
                              r.prioridad === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {r.prioridad}
                            </span>
                          </div>
                          <p className="text-gray-600">{r.motivo}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Columna Derecha: Tarjetas Visuales de Clima (Ocupa 1/3 del espacio) */}
            {pronosticoClima.length > 0 && (
              <div className="lg:col-span-1 space-y-3">
                <h4 className="text-sm font-bold text-gray-600 mb-1 ml-1">Clima considerado:</h4>
                <div className="flex flex-col gap-3">
                  {pronosticoClima.map((dia, idx) => (
                    <Card key={idx} className="bg-white border shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold capitalize text-sm">{formatDia(dia.fecha)}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Thermometer className="h-3 w-3" /> {dia.min}° - {dia.max}°
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Droplets className="h-3 w-3 text-blue-500" /> {dia.probLluvia}% ({dia.lluvia}mm)
                          </div>
                        </div>
                        <div>
                          {getWeatherIcon(dia.codigo)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default Mediciones