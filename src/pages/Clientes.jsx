import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Eye, Pencil, Ban } from "lucide-react"

function calcularDV(rutNumero) {
  const rutStr = String(rutNumero)
  let suma = 0
  let multiplicador = 2
  for (let i = rutStr.length - 1; i >= 0; i--) {
    suma += parseInt(rutStr[i], 10) * multiplicador
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2
  }
  const resto = suma % 11
  const dv = 11 - resto
  if (dv === 11) return "0"
  if (dv === 10) return "K"
  return String(dv)
}

function formatRut(numero, dv) {
  if (!numero) return ""
  return `${numero}-${dv ?? ""}`
}

function parseTelefono(telTexto) {
  const soloDigitos = telTexto.replace(/[^\d]/g, "")
  if (telTexto.trim().startsWith("+") && !telTexto.trim().startsWith("+56")) {
    const codigo = soloDigitos.slice(0, 2)
    const resto = soloDigitos.slice(2)
    return { codigo_pais: parseInt(codigo, 10), telefono: parseInt(resto, 10) }
  }
  const sinCodigo = soloDigitos.startsWith("56") ? soloDigitos.slice(2) : soloDigitos
  return { codigo_pais: 56, telefono: sinCodigo ? parseInt(sinCodigo, 10) : null }
}

function formatTelefono(codigo, telefono) {
  if (!telefono) return ""
  return `+${codigo} ${telefono}`
}

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  // Estados para las ventanas emergentes (modales)
  const [modalDetalles, setModalDetalles] = useState(null)
  const [modalEditar, setModalEditar] = useState(null)
  const [modalDeshabilitar, setModalDeshabilitar] = useState(null)

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", rutNumero: "", telefono: "+569" })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const cargarClientes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("Clientes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setClientes(data || [])
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "rutNumero") {
      setForm({ ...form, rutNumero: value.replace(/\D/g, "") })
      return
    }
    setForm({ ...form, [name]: value })
  }

  const dvCalculado = form.rutNumero ? calcularDV(form.rutNumero) : ""

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    const rut_numero = parseInt(form.rutNumero, 10)
    const rut_dv = calcularDV(form.rutNumero)
    const { codigo_pais, telefono } = parseTelefono(form.telefono)

    const { error } = await supabase.from("Clientes").insert([
      {
        nombre: form.nombre,
        rut_numero,
        rut_dv,
        codigo_pais,
        telefono,
      },
    ])

    if (error) {
      setFormError(error.message)
    } else {
      setForm({ nombre: "", rutNumero: "", telefono: "+569" })
      setOpen(false)
      cargarClientes()
    }
    setSaving(false)
  }

  // Filtrado en tiempo real por nombre o RUT basado en datos reales de Supabase
  const clientesFiltrados = clientes.filter((cliente) => {
    const nombreMatch = cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    const rutCompleto = `${cliente.rut_numero || ""}-${cliente.rut_dv || ""}`.toLowerCase()
    const rutMatch = rutCompleto.includes(busqueda.toLowerCase())
    return nombreMatch || rutMatch
  })

  return (
    <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Administra los registros y la información de contacto</p>
        </div>
        <Button
          className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl shadow-sm flex items-center gap-2 h-11 px-4"
          onClick={() => setOpen(true)}
        >
          <UserPlus className="h-4 w-4" /> Agregar cliente
        </Button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-6 flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200/60 max-w-md">
        <Search className="h-4 w-4 text-slate-400 ml-1" />
        <Input
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0 h-auto"
        />
      </div>

      {error && <p className="mb-4 text-red-600 text-sm font-medium">{error}</p>}

      {/* Tabla con Estilo Oscurecido y Elegante */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200/80">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="px-6 text-slate-700 font-semibold">Nombre</TableHead>
              <TableHead className="px-6 text-slate-700 font-semibold">RUT</TableHead>
              <TableHead className="px-6 text-slate-700 font-semibold">Teléfono</TableHead>
              <TableHead className="px-6 text-slate-700 font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                  Cargando clientes desde la base de datos...
                </TableCell>
              </TableRow>
            )}
            {!loading && clientes.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                  Todavía no hay clientes registrados en Supabase.
                </TableCell>
              </TableRow>
            )}
            {!loading && clientes.length > 0 && clientesFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-8 text-slate-500 text-center">
                  No se encontraron resultados para "{busqueda}".
                </TableCell>
              </TableRow>
            )}
            {clientesFiltrados.map((cliente) => (
              <TableRow key={cliente.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-800">{cliente.nombre}</span>
                    {/* Indicador de Estado */}
                    {/* TODO: Reemplazar 'true' por la propiedad real de Supabase (ej: cliente.activo) */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Activo
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">{formatRut(cliente.rut_numero, cliente.rut_dv)}</TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  {formatTelefono(cliente.codigo_pais, cliente.telefono)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center gap-3">
                    {/* Botón Ver Detalles */}
                    <button 
                      onClick={() => setModalDetalles(cliente)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Botón Editar  */}
                    <button 
                      onClick={() => setModalEditar(cliente)}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                      title="Editar cliente"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Botón Deshabilitar */}
                    <button 
                      onClick={() => setModalDeshabilitar(cliente)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Deshabilitar cliente"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Agregar Cliente con Fondo Sólido */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Agregar nuevo cliente</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nombre</Label>
              <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required className="rounded-xl border-slate-200 bg-slate-50/50 h-11" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rutNumero" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">RUT</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="rutNumero"
                  name="rutNumero"
                  placeholder="Sin puntos ni guion"
                  value={form.rutNumero}
                  onChange={handleChange}
                  inputMode="numeric"
                  required
                  className="rounded-xl border-slate-200 bg-slate-50/50 h-11"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200/60">
                  DV: <span className="font-bold text-slate-700">{dvCalculado || "-"}</span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="rounded-xl border-slate-200 bg-slate-50/50 h-11"
              />
            </div>

            {formError && <p className="text-red-600 text-xs font-medium">{formError}</p>}

            <DialogFooter className="pt-2">
              <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl h-11 w-full shadow-sm" disabled={saving}>
                {saving ? "Guardando cliente..." : "Guardar cliente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    {/* 1. MODAL: VER DETALLES */}
      {modalDetalles && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Detalles del Cliente</h3>
              <button onClick={() => setModalDetalles(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium uppercase tracking-wider">Nombre Completo</span>
                <span className="font-bold text-slate-800 text-sm">{modalDetalles.nombre}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium uppercase tracking-wider">RUT</span>
                <span className="font-semibold text-slate-700">{modalDetalles.rut || "Sin RUT registrado"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium uppercase tracking-wider">Teléfono de Contacto</span>
                <span className="font-semibold text-slate-700">{modalDetalles.telefono || "Sin teléfono"}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setModalDetalles(null)} className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs h-9 px-4">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: EDITAR CLIENTE (Prueba visual) */}
      {modalEditar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Editar Cliente (Modo Prueba)</h3>
              <button onClick={() => setModalEditar(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">NOMBRE</label>
                <input 
                  type="text" 
                  defaultValue={modalEditar.nombre} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">RUT</label>
                <input 
                  type="text" 
                  defaultValue={modalEditar.rut} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">TELÉFONO</label>
                <input 
                  type="text" 
                  defaultValue={modalEditar.telefono} 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalEditar(null)} className="rounded-xl text-xs h-9">
                Cancelar
              </Button>
              <Button onClick={() => { alert("Cambios guardados en modo de prueba local."); setModalEditar(null); }} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs h-9">
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL: DESHABILITAR CLIENTE (Prueba visual) */}
      {modalDeshabilitar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2"> Deshabilitar Cliente</h3>
              <button onClick={() => setModalDeshabilitar(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              ¿Estás seguro de que deseas deshabilitar al cliente <strong className="text-slate-800">{modalDeshabilitar.nombre}</strong>? 
              <br/><span className="text-[11px] text-slate-400 mt-1 block">*(Nota: Como la base de datos aún no cuenta con la columna de estado, esta acción es solo una simulación visual por ahora).*</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalDeshabilitar(null)} className="rounded-xl text-xs h-9">
                Cancelar
              </Button>
              <Button onClick={() => { alert(`Acción simulada: Cliente ${modalDeshabilitar.nombre} deshabilitado localmente.`); setModalDeshabilitar(null); }} className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs h-9">
                Sí, deshabilitar
              </Button>
            </div>
          </div>
        </div>
      )}



    </div>
  )
}

export default Clientes