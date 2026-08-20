import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

function formatFecha(fechaISO) {
  const d = new Date(fechaISO)
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" })
}

function Dashboard() {
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null) // { id, nombre }
  const [terrenos, setTerrenos] = useState([])
  const [loadingTerrenos, setLoadingTerrenos] = useState(false)

  const [terrenoSeleccionado, setTerrenoSeleccionado] = useState(null) // { id, nombre }
  const [ultimaMedicion, setUltimaMedicion] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loadingMediciones, setLoadingMediciones] = useState(false)

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
        .select("id, nombre")
        .eq("cliente_id", clienteSeleccionado.id)
        .order("nombre")
      if (!error) setTerrenos(data)
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

  const valor = (campo) =>
    ultimaMedicion && ultimaMedicion[campo] != null ? ultimaMedicion[campo] : "n/a"

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={loadingClientes || clientes.length === 0}>
              {loadingClientes
                ? "Cargando clientes..."
                : clientes.length === 0
                ? "No hay clientes"
                : clienteSeleccionado?.nombre ?? "Seleccionar cliente"}
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
            <Button
              variant="outline"
              disabled={!clienteSeleccionado || loadingTerrenos || terrenos.length === 0}
            >
              {!clienteSeleccionado
                ? "Elegí un cliente primero"
                : loadingTerrenos
                ? "Cargando terrenos..."
                : terrenos.length === 0
                ? "Sin terrenos"
                : terrenoSeleccionado?.nombre ?? "Seleccionar Terreno"}
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

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardTitle className="p-4">Nitrógeno</CardTitle>
          <CardContent>{valor("nitrogeno")}</CardContent>
        </Card>
        <Card>
          <CardTitle className="p-4">Fósforo</CardTitle>
          <CardContent>{valor("fosforo")}</CardContent>
        </Card>
        <Card>
          <CardTitle className="p-4">Potasio</CardTitle>
          <CardContent>{valor("potasio")}</CardContent>
        </Card>
        <Card>
          <CardTitle className="p-4">pH</CardTitle>
          <CardContent>{valor("ph")}</CardContent>
        </Card>
        <Card>
          <CardTitle className="p-4">Humedad</CardTitle>
          <CardContent>{valor("humedad_suelo")}</CardContent>
        </Card>
        <Card>
          <CardTitle className="p-4">Temperatura</CardTitle>
          <CardContent>{valor("temperatura_suelo")}</CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-bold mb-4">Historial de mediciones (Nitrógeno)</h2>
        {!terrenoSeleccionado && (
          <p className="text-gray-500">Seleccioná un cliente y un terreno para ver su historial.</p>
        )}
        {terrenoSeleccionado && loadingMediciones && <p className="text-gray-500">Cargando...</p>}
        {terrenoSeleccionado && !loadingMediciones && historial.length === 0 && (
          <p className="text-gray-500">Este terreno todavía no tiene mediciones registradas.</p>
        )}
        {terrenoSeleccionado && !loadingMediciones && historial.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default Dashboard