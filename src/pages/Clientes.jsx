import { useMemo, useState } from "react"
import { Pencil, Trash2, Plus, Phone, Mail, Search } from "lucide-react"
import { clientes as api } from "../services/maquinaria"
import { validarRut, formatearRut } from "../lib/auth"
import useCarga from "../lib/useCarga"
import EstadoCarga from "../components/EstadoCarga"
import ModalLecheria, { Campo } from "../components/ModalLecheria"
import s, { AZUL } from "./EstilosMaquinaria"

const TIPOS = ["Agrícola", "Lechería", "Mixto"]
const vacio = { nombre: "", rut: "", telefono_txt: "", email: "", direccion: "", comuna: "", tipo: "Agrícola", activo: true }

export default function VistaClientes() {
  const { datos: clientes, cargando, error, setError, recargar } = useCarga(api.listar, [])
  const [q, setQ] = useState("")
  const [verInactivos, setVerInactivos] = useState(true)
  const [modal, setModal] = useState(null)
  const [modalError, setModalError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const campo = (k, v) => setModal((m) => ({ ...m, [k]: v }))

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase()
    return clientes.filter(
      (c) => (verInactivos || c.activo) && (!t || `${c.nombre} ${c.rut} ${c.comuna ?? ""} ${c.email ?? ""}`.toLowerCase().includes(t))
    )
  }, [clientes, q, verInactivos])

  const guardar = async () => {
    if (!modal.nombre.trim()) return setModalError("El nombre es obligatorio")
    if (modal.rut.trim() && !validarRut(modal.rut)) return setModalError("El RUT no es válido")
    try {
      setGuardando(true)
      setModalError(null)
      if (modal.id) await api.actualizar(modal.id, modal)
      else await api.crear(modal)
      setModal(null)
      await recargar()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (c) => {
    if (!window.confirm(`¿Eliminar a ${c.nombre}?`)) return
    try { await api.eliminar(c.id); await recargar() } catch (e) { setError(e.message) }
  }

  return (
    <div style={s.container}>
      <div style={s.topBar}>
        <div>
          <h2 style={s.title}>Clientes</h2>
          <p style={s.sub}>{clientes.filter((c) => c.activo).length} activos · {clientes.length} total</p>
        </div>
        <button style={s.btnAdd} onClick={() => { setModalError(null); setModal({ ...vacio }) }}>
          <Plus size={15} /> Agregar cliente
        </button>
      </div>

      <div style={s.filtros}>
        <div style={s.buscador}>
          <Search size={14} color="#94A3B8" />
          <input style={s.buscadorInput} placeholder="Buscar nombre, RUT o comuna..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
          <input type="checkbox" checked={verInactivos} onChange={(e) => setVerInactivos(e.target.checked)} /> Mostrar inactivos
        </label>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {!cargando && !error && (
        <div style={s.tableCard}>
          <table style={s.table}>
            <thead>
              <tr>{["Nombre / RUT", "Teléfono", "Email", "Dirección", "Tipo", "Estado", ""].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => (
                <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={s.td}><span style={s.nombre}>{c.nombre}</span><span style={s.rutTxt}>{c.rut}</span></td>
                  <td style={s.td}>{c.telefono_txt && <a href={`tel:${c.telefono_txt.replace(/\s/g, "")}`} style={s.link}><Phone size={12} />{c.telefono_txt}</a>}</td>
                  <td style={s.td}>{c.email && <a href={`mailto:${c.email}`} style={s.link}><Mail size={12} />{c.email}</a>}</td>
                  <td style={s.td}>{c.direccion}</td>
                  <td style={s.td}>{c.tipo}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, backgroundColor: c.activo ? "#D1FAE5" : "#F1F5F9", color: c.activo ? "#065F46" : "#64748B" }}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.iconBtnBlue} title="Editar" onClick={() => { setModalError(null); setModal({ ...c, rut: c.rut || "" }) }}><Pencil size={14} /></button>
                      <button style={s.iconBtnRed} title="Eliminar" onClick={() => eliminar(c)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={7} style={s.vacio}>No hay clientes que coincidan.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ModalLecheria
          titulo={modal.id ? "Editar cliente" : "Nuevo cliente"}
          color={AZUL}
          onClose={() => setModal(null)}
          onSave={guardar}
          error={modalError}
          guardando={guardando}
        >
          <Campo label="Nombre / Empresa" full><input style={s.input} value={modal.nombre} onChange={(e) => campo("nombre", e.target.value)} /></Campo>
          <Campo label="RUT"><input style={s.input} value={modal.rut} onChange={(e) => campo("rut", formatearRut(e.target.value))} placeholder="12.345.678-5" /></Campo>
          <Campo label="Teléfono"><input style={s.input} value={modal.telefono_txt} onChange={(e) => campo("telefono_txt", e.target.value)} placeholder="+56 9 1234 5678" /></Campo>
          <Campo label="Email" full><input style={s.input} type="email" value={modal.email ?? ""} onChange={(e) => campo("email", e.target.value)} /></Campo>
          <Campo label="Dirección" full><input style={s.input} value={modal.direccion ?? ""} onChange={(e) => campo("direccion", e.target.value)} /></Campo>
          <Campo label="Comuna"><input style={s.input} value={modal.comuna ?? ""} onChange={(e) => campo("comuna", e.target.value)} /></Campo>
          <Campo label="Tipo">
            <select style={s.input} value={modal.tipo ?? "Agrícola"} onChange={(e) => campo("tipo", e.target.value)}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Campo>
          <Campo label="Estado">
            <select style={s.input} value={String(modal.activo)} onChange={(e) => campo("activo", e.target.value === "true")}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </Campo>
        </ModalLecheria>
      )}
    </div>
  )
}