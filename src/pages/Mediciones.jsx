import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Leaf, FlaskConical, Zap, 
  TestTube, Activity, CheckCircle2, ShieldAlert, Clock, User, FileText, Info, AlertTriangle } from "lucide-react"
import { MetricaCard } from "@/components/ui/MetricaCard"
import { SearchableSelect } from "@/components/SearchableSelect"

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

  const [estadoValidacion, setEstadoValidacion] = useState("pendiente") // 'pendiente', 'validada', 'anomalia'
  const [confirmandoAccion, setConfirmandoAccion] = useState(null) // null, 'aprobar', 'anomalia'

  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [terrenos, setTerrenos] = useState([])
  const [loadingTerrenos, setLoadingTerrenos] = useState(false)

  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null)
  const [ultimaMedicion, setUltimaMedicion] = useState(null)
  const [loadingMediciones, setLoadingMediciones] = useState(false)

  const [observaciones, setObservaciones] = useState("")
  const [recomendacion, setRecomendacion] = useState(null)
  const [pronosticoClima, setPronosticoClima] = useState([])
  const [loadingIA, setLoadingIA] = useState(false)
  const [errorIA, setErrorIA] = useState(null)

  useEffect(() => {
    const cargarClientes = async () => {
      setLoadingClientes(true)
      const { data, error } = await supabase.from("Clientes").select("id, nombre").order("nombre")
      if (error) console.error("Error cargando clientes:", error)
      else setClientes(data || [])
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

      if (error) console.error("Error cargando terrenos:", error)
      else setTerrenos(data || [])
      
      setLoadingTerrenos(false)
    }
    cargarTerrenos()
  }, [clienteSeleccionado])

  useEffect(() => {
    if (!terrenoSeleccionado) {
      setUltimaMedicion(null)
      setRecomendacion(null)
      setPronosticoClima([])
      setErrorIA(null)
      return
    }

    const cargarMedicionReal = async () => {
      setLoadingMediciones(true)
      setRecomendacion(null)
      setPronosticoClima([])
      setErrorIA(null)

      const { data, error } = await supabase
        .from("Mediciones")
        .select("*")
        .eq("terreno_id", terrenoSeleccionado.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Error al consultar mediciones en Supabase:", error)
        setUltimaMedicion(null)
      } else {
        setUltimaMedicion(data ?? null)
      }

      setLoadingMediciones(false)
    }

    cargarMedicionReal()
  }, [terrenoSeleccionado])

  const valor = (campo) => (ultimaMedicion && ultimaMedicion[campo] != null ? ultimaMedicion[campo] : null)

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
          observaciones_admin: observaciones,
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

  const metricos = [
    { titulo: "Nitrógeno (N)", campo: "nitrogeno", unidad: "kg/ha", Icono: Leaf },
    { titulo: "Fósforo (P)", campo: "fosforo", unidad: "kg/ha", Icono: FlaskConical },
    { titulo: "Potasio (K)", campo: "potasio", unidad: "kg/ha", Icono: Zap },
    { titulo: "pH del Suelo", campo: "ph", unidad: "pH", Icono: TestTube },
    { titulo: "Humedad del Suelo", campo: "humedad_suelo", unidad: "%", Icono: Droplets },
    { titulo: "Temperatura del Suelo", campo: "temperatura_suelo", unidad: "°C", Icono: Thermometer },
    { titulo: "Conductividad", campo: "conductividad_electrica", unidad: "dS/m", Icono: Activity },
  ]

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      {/* Header de la sección */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mediciones y Diagnóstico IA</h1>
          <p className="text-xs text-slate-500 mt-0.5">Supervisión técnica, validación de sensores y recomendaciones de cultivo</p>
        </div>

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

      {/* Grid Principal de 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda Principal (2/3): Validación y Métricas */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          
          {/* Panel de Supervisión y Validación de Lectura HU-ADM-04 */}
          {terrenoSeleccionado && ultimaMedicion && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    estadoValidacion === 'validada' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    estadoValidacion === 'anomalia' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {estadoValidacion === 'validada' ? <CheckCircle2 className="w-5 h-5" /> :
                     estadoValidacion === 'anomalia' ? <AlertTriangle className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado de Lectura IoT</h3>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mt-0.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        estadoValidacion === 'validada' ? 'bg-emerald-500' :
                        estadoValidacion === 'anomalia' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}></span>
                      {estadoValidacion === 'validada' ? 'Lectura Aprobada y Validada' :
                       estadoValidacion === 'anomalia' ? 'Marcada con Anomalía Técnica' :
                       'Pendiente de Supervisión'}
                    </p>
                  </div>
                </div>

                {/* Botones de Acción Rápida */}
                {estadoValidacion === 'pendiente' && !confirmandoAccion && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => setConfirmandoAccion('aprobar')}
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs h-9 shadow-sm"
                    >
                      Aprobar lectura
                    </Button>
                    <Button
                      onClick={() => setConfirmandoAccion('anomalia')}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs h-9"
                    >
                      Marcar anomalía
                    </Button>
                  </div>
                )}

                {estadoValidacion !== 'pendiente' && !confirmandoAccion && (
                  <Button
                    onClick={() => setEstadoValidacion('pendiente')}
                    size="sm"
                    variant="outline"
                    className="text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl text-xs h-9"
                  >
                    Cambiar estado
                  </Button>
                )}
              </div>

              {/* Tarjeta de Confirmación Interactiva */}
              {confirmandoAccion && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn ${
                  confirmandoAccion === 'aprobar' ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'
                }`}>
                  <div className="text-xs">
                    <p className={`font-bold ${confirmandoAccion === 'aprobar' ? 'text-emerald-900' : 'text-red-900'}`}>
                      {confirmandoAccion === 'aprobar' 
                        ? '¿Está seguro de confirmar la lectura?' 
                        : '¿Está seguro de marcar esta medición como anomalía?'}
                    </p>
                    <p className={`mt-0.5 ${confirmandoAccion === 'aprobar' ? 'text-emerald-700' : 'text-red-700'}`}>
                      Esta acción actualizará el registro oficial en la base de datos.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmandoAccion(null)}
                      className="h-8 text-xs rounded-lg bg-white border-slate-200"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const nuevoEstado = confirmandoAccion === 'aprobar' ? 'validada' : 'anomalia';
                        
                        /* =========================================================================
                         * cuando esté lista la columna 'estado_validacion' 
                         * en la tabla 'Mediciones' de Supabase, descomentar el bloque de abajo 
                         * para guardar el estado de forma persistente.
                         * =========================================================================
                         * 
                         * const actualizarSupabase = async () => {
                         *   const { error } = await supabase
                         *     .from("Mediciones")
                         *     .update({ estado_validacion: nuevoEstado })
                         *     .eq("id", ultimaMedicion.id);
                         * 
                         *   if (error) {
                         *     console.error("Error al actualizar estado en Supabase:", error);
                         *   }
                         * };
                         * actualizarSupabase();
                         * ========================================================================= */

                        // Actualización visual local 
                        setEstadoValidacion(nuevoEstado);
                        setConfirmandoAccion(null);
                        if (ultimaMedicion) {
                          setUltimaMedicion({ ...ultimaMedicion, estado_validacion: nuevoEstado });
                        }
                      }}
                      className={`h-8 text-xs rounded-lg text-white ${
                        confirmandoAccion === 'aprobar' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Sí, confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cuadrícula de Métricas de Suelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricos.map((m) => (
              <MetricaCard
                key={m.campo}
                titulo={m.titulo}
                campo={m.campo}
                unidad={m.unidad}
                Icono={m.Icono}
                valor={valor(m.campo)}
              />
            ))}
          </div>

        </div>

        {/* Columna Derecha Lateral (1/3): Control Operativo, Bitácora IA y Clima Regional */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Módulo de Trazabilidad y Visita a Terreno (HU-ADM-03) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Control Operativo</h3>
                <p className="text-xs text-slate-500">Trazabilidad de Inspección</p>
              </div>
            </div>

            {!terrenoSeleccionado ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Selecciona un terreno para ver los datos de la visita técnica.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium"><User className="w-3.5 h-3.5 text-slate-400"/> Técnico a cargo:</span>
                  {/* TODO: Vincular con columna tecnico_responsable en Supabase */}
                  <span className="font-semibold text-slate-700">Administrador / IoT</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-slate-400"/> Sincronización:</span>
                  <span className="font-semibold text-slate-700">
                    {ultimaMedicion?.created_at ? new Date(ultimaMedicion.created_at).toLocaleDateString("es-CL") : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bloque de Observaciones y Generación de Diagnóstico IA */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Bitácora de Observaciones Técnicas</span>
            </div>

            <Input 
              type="text" 
              placeholder="Ej. Aplicar riego nocturno adicional..." 
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs" 
            />

            <Button
              onClick={obtenerRecomendacion}
              disabled={!terrenoSeleccionado || !ultimaMedicion || loadingIA}
              className="bg-emerald-700 hover:bg-emerald-800 h-10 text-white font-medium rounded-xl transition-colors shadow-sm text-xs"
            >
              {loadingIA ? "Analizando terreno..." : "Generar recomendación IA"}
            </Button>

            {errorIA && <p className="text-red-600 text-xs font-medium">{errorIA}</p>}

            {/* Resultados del Diagnóstico IA */}
            {recomendacion && (
              <div className="mt-2 pt-3 border-t border-slate-100 space-y-3">
                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Diagnóstico IA</h3>
                  <p className="font-semibold text-sm text-slate-800">{recomendacion.estado_general}</p>
                </div>

                {recomendacion.alertas?.length > 0 && (
                  <div className="space-y-1.5 p-3 bg-red-50 rounded-xl border border-red-100">
                    {recomendacion.alertas.map((a, i) => (
                      <p key={i} className="text-red-700 text-xs font-medium flex gap-1.5">
                        <span>⚠</span> {a}
                      </p>
                    ))}
                  </div>
                )}

                {recomendacion.recomendaciones?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-2 text-slate-800 text-xs">Plan de Acción:</h4>
                    <ul className="space-y-2">
                      {recomendacion.recomendaciones.map((r, i) => (
                        <li key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800">{r.accion}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                              r.prioridad === 'alta' ? 'bg-red-100 text-red-700' : 
                              r.prioridad === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {r.prioridad}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{r.motivo}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel de Pronóstico del Clima Regional */}
          {pronosticoClima.length > 0 && (
            <div className="space-y-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clima Regional Considerado</h4>
              <div className="flex flex-col gap-2.5">
                {pronosticoClima.map((dia, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="font-semibold capitalize text-xs text-slate-800">{formatDia(dia.fecha)}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                        <Thermometer className="h-3 w-3" /> {dia.min}° - {dia.max}°
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 font-medium">{dia.probLluvia}%</span>
                      {getWeatherIcon(dia.codigo)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default Mediciones