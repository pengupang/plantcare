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
      setClientes(data)
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button className="bg-green-500" onClick={() => setOpen(true)}>
          Agregar cliente
        </Button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <Table className="border border-gray-200 rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-300 ">
              <TableHead>Nombre</TableHead>
              <TableHead>RUT</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4}>Cargando clientes...</TableCell>
              </TableRow>
            )}
            {!loading && clientes.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={4}>Todavía no hay clientes cargados.</TableCell>
              </TableRow>
            )}
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{formatRut(cliente.rut_numero, cliente.rut_dv)}</TableCell>
                <TableCell>{formatTelefono(cliente.codigo_pais, cliente.telefono)}</TableCell>
                <TableCell>Ver</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar cliente</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rutNumero">RUT </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="rutNumero"
                  name="rutNumero"
                  value={form.rutNumero}
                  onChange={handleChange}
                  inputMode="numeric"
                  required
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  DV: <span className="font-semibold">{dvCalculado || "-"}</span>
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <DialogFooter>
              <Button type="submit" className="bg-green-500" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cliente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Clientes