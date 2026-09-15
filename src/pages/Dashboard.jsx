import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Leaf, FlaskConical, Zap, TestTube, Droplets, Thermometer, Bot, AlertTriangle, 
  CheckCircle2, ShieldAlert, RefreshCw, Wheat, Sprout, Flower, Info } from "lucide-react"
import { MetricaCard } from "@/components/ui/MetricaCard"
import { SearchableSelect } from "../components/SearchableSelect"
import { MapaTerreno } from "@/components/MapaTerreno"

function formatFecha(fechaISO) {
  const d = new Date(fechaISO)
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" })
}

function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [terrenos, setTerrenos] = useState([])
  const [loadingTerrenos, setLoadingTerrenos] = useState(false)

  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null)
  const [ultimaMedicion, setUltimaMedicion] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loadingMediciones, setLoadingMediciones] = useState(false)

  useEffect(() => {
    const cargarClientes = async () => {
      setLoadingClientes(true)
      const { data, error } = await supabase.from("Clientes").select("id, nombre").order("nombre")
      if (!error) setClientes(data || [])
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
        .select("id, nombre")
        .eq("cliente_id", clienteSeleccionado.id)
        .order("nombre")
      if (!error) setTerrenos(data || [])
      setLoadingTerrenos(false)
    }
    cargarTerrenos()
  }, [clienteSeleccionado])

  useEffect(() => {
    if (!terrenoSeleccionado) {
      setUltimaMedicion(null)
      setHistorial([])
      return
    }
    const cargarMediciones = async () => {
      setLoadingMediciones(true)

      const { data: ultima } = await supabase
        .from("Mediciones")
        .select("*")
        .eq("terreno_id", terrenoSeleccionado.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      setUltimaMedicion(ultima ?? null)

      const { data: serie } = await supabase
        .from("Mediciones")
        .select("created_at, nitrogeno")
        .eq("terreno_id", terrenoSeleccionado.id)
        .order("created_at", { ascending: true })
        .limit(20)
      setHistorial(
        (serie ?? []).map((m) => ({
          fecha: formatFecha(m.created_at),
          valor: m.nitrogeno,
        }))
      )

      setLoadingMediciones(false)
    }
    cargarMediciones()
  }, [terrenoSeleccionado])

  const metricasConfig = [
    { titulo: "Nitrógeno (N)", campo: "nitrogeno", unidad: "kg/ha", Icono: Leaf },
    { titulo: "Fósforo (P)", campo: "fosforo", unidad: "kg/ha", Icono: FlaskConical },
    { titulo: "Potasio (K)", campo: "potasio", unidad: "kg/ha", Icono: Zap },
    { titulo: "pH", campo: "ph", unidad: "pH", Icono: TestTube },
    { titulo: "Humedad", campo: "humedad_suelo", unidad: "%", Icono: Droplets },
    { titulo: "Temperatura", campo: "temperatura_suelo", unidad: "°C", Icono: Thermometer },
    { titulo: "Conductividad", campo: "conductividad_electrica", unidad: "dS/m", Icono: Zap },
  ]

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard de Administración</h1>

        <div className="flex flex-wrap gap-2">
          <SearchableSelect
            items={clientes}
            value={clienteSeleccionado}
            onChange={(cliente) => setClienteSeleccionado(cliente)}
            placeholder={loadingClientes ? "Cargando clientes..." : "Seleccionar cliente"}
            searchPlaceholder="Buscar cliente..."
            disabled={loadingClientes}
          />

          <SearchableSelect
            items={terrenos}
            value={terrenoSeleccionado}
            onChange={(terreno) => setTerrenoSeleccionado(terreno)}
            placeholder={!clienteSeleccionado ? "Elegí un cliente primero" : "Seleccionar Terreno"}
            searchPlaceholder="Buscar terreno..."
            disabled={!clienteSeleccionado || loadingTerrenos}
          />
        </div>
      </div>

      {!terrenoSeleccionado && (
        <div className="mb-6 rounded-2xl bg-amber-50 p-4 border border-amber-200/80 text-amber-800 text-sm shadow-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Selecciona un cliente y un terreno específico para consultar las mediciones en la base de datos.</span>
        </div>
      )}

      {terrenoSeleccionado && loadingMediciones && (
        <p className="text-gray-500 mb-4 text-sm font-medium">Consultando registros en Supabase...</p>
      )}

      {terrenoSeleccionado && !loadingMediciones && !ultimaMedicion && (
        <div className="mb-6 rounded-2xl bg-white p-6 border border-slate-200 text-slate-600 text-sm shadow-sm flex items-center justify-center gap-2.5">
          <Info className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Este terreno no cuenta con registros de mediciones en la base de datos actualmente.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Métricas, Gráfico y Mapa */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricasConfig.map((m) => (
              <MetricaCard
                key={m.campo}
                titulo={m.titulo}
                campo={m.campo}
                unidad={m.unidad}
                Icono={m.Icono}
                valor={ultimaMedicion ? ultimaMedicion[m.campo] : null}
              />
            ))}
          </div>

          {/* Gráfico de Historial */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Historial de mediciones (Nitrógeno)</h2>
            {!terrenoSeleccionado && <p className="text-gray-500 text-sm">Seleccioná un cliente y un terreno para ver su historial.</p>}
            {terrenoSeleccionado && loadingMediciones && <p className="text-gray-500 text-sm">Cargando...</p>}
            {terrenoSeleccionado && !loadingMediciones && historial.length === 0 && (
              <p className="text-gray-500 text-sm">Este terreno todavía no tiene mediciones registradas.</p>
            )}
            {terrenoSeleccionado && !loadingMediciones && historial.length > 0 && (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={historial}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fecha" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Mapa de ubicación del terreno */}
          <MapaTerreno terreno={terrenoSeleccionado} />
        </div>

        {/* Columna Derecha (1/3): Panel de IA */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Asistente PlantCare</h3>
                <p className="text-xs text-slate-500">Recomendaciones y Sugerencias</p>
              </div>
            </div>

            {!terrenoSeleccionado ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                Selecciona un terreno para activar el análisis inteligente del suelo.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wide">Precaución en Nitrógeno</h4>
                    <p className="text-xs text-orange-700 mt-0.5">Los niveles actuales están por debajo del óptimo para el cultivo actual.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">pH Estable</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">El nivel de acidez se encuentra dentro del rango adecuado de asimilación.</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Estado del Sistema</span>
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span>Modelo conectado</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Plan de Rotación de Cultivos */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Plan de Rotación de Cultivos</h3>
            </div>

            {!terrenoSeleccionado ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                Selecciona un terreno para ver su plan de rotación.
              </p>
            ) : (
              <div className="space-y-3">
                {/* Cultivo Actual */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Trigo</h4>
                      <p className="text-[11px] text-slate-500">Abr – Sep</p>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    Actual
                  </span>
                </div>

                {/* Cultivo Próximo */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Lupino</h4>
                      <p className="text-[11px] text-slate-500">Oct – Feb</p>
                    </div>
                  </div>
                  <span className="bg-amber-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    Próximo
                  </span>
                </div>

                {/* Cultivo Planificado */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                      <Flower className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Canola</h4>
                      <p className="text-[11px] text-slate-500">Mar – Jul</p>
                    </div>
                  </div>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    Planificado
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard