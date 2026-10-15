import { useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import { maquinas as api } from "../services/maquinaria"
import useCarga from "../lib/useCarga"
import { clp } from "../lib/formato"
import EstadoCarga from "../components/EstadoCarga"
import ModalLecheria, { Campo } from "../components/ModalLecheria"
import s, { AZUL, ESTADO_MAQUINA } from "./estilosMaquinaria"

const vacio = { nombre: "", modelo: "", tipo: "", estado: "Disponible", precio: 0, unidad_cobro: "hora", notas: "" }

export default function VistaMaquinaria() {
  const { datos: maquinas, cargando, error, setError, recargar } = useCarga(api.listar, [])
  const [modal, setModal] = useState(null) // formulario abierto (null = cerrado)
  const [modalError, setModalError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const campo = (k, v) => setModal((m) => ({ ...m, [k]: v }))

  const guardar = async () => {
    if (!modal.nombre.trim()) return setModalError("El nombre es obligatorio")
    if (Number(modal.precio) < 0) return setModalError("La tarifa no puede ser negativa")
    const payload = {
      nombre: modal.nombre.trim(),
      modelo: modal.modelo.trim(),
      tipo: modal.tipo.trim(),
      estado: modal.estado,
      precio: Math.round(Number(modal.precio) || 0),
      unidad_cobro: modal.unidad_cobro,
      notas: modal.notas.trim(),
    }
    try {
      setGuardando(true)
      setModalError(null)
      if (modal.id) await api.actualizar(modal.id, payload)
      else await api.crear(payload)
      setModal(null)
      await recargar()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (m) => {
    if (!window.confirm(`¿Eliminar ${m.nombre} ${m.modelo}? También se borrarán sus mantenciones.`)) return
    try { await api.eliminar(m.id); await recargar() } catch (e) { setError(e.message) }
  }

  return (
    <div style={s.container}>
      <div style={s.topBar}>
        <div>
          <h2 style={s.title}>Maquinaria</h2>
          <p style={s.sub}>{maquinas.length} equipos registrados</p>
        </div>
        <button style={s.btnAdd} onClick={() => { setModalError(null); setModal({ ...vacio }) }}>
          <Plus size={15} /> Agregar equipo
        </button>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {!cargando && !error && (
        <div style={s.tableCard}>
          <table style={s.table}>
            <thead>
              <tr>{["Nombre / Modelo", "Tipo", "Estado", "Tarifa neta", "Notas", ""].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {maquinas.map((m, i) => (
                <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={s.td}>
                    <span style={s.nombre}>{m.nombre}</span>
                    <span style={s.rutTxt}>{m.modelo}</span>
                  </td>
                  <td style={s.td}>{m.tipo}</td>
                  <td style={s.td}><span style={{ ...s.badge, ...ESTADO_MAQUINA[m.estado] }}>{m.estado}</span></td>
                  <td style={s.td}>{clp(m.precio)} <span style={{ color: "#94A3B8" }}>/ {m.unidad_cobro}</span></td>
                  <td style={{ ...s.td, color: "#94A3B8" }}>{m.notas || "—"}</td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.iconBtnBlue} title="Editar" onClick={() => { setModalError(null); setModal({ ...m }) }}><Pencil size={14} /></button>
                      <button style={s.iconBtnRed} title="Eliminar" onClick={() => eliminar(m)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {maquinas.length === 0 && <tr><td colSpan={6} style={s.vacio}>Aún no hay equipos registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ModalLecheria
          titulo={modal.id ? "Editar equipo" : "Nuevo equipo"}
          color={AZUL}
          onClose={() => setModal(null)}
          onSave={guardar}
          error={modalError}
          guardando={guardando}
        >
          <Campo label="Nombre"><input style={s.input} value={modal.nombre} onChange={(e) => campo("nombre", e.target.value)} /></Campo>
          <Campo label="Modelo"><input style={s.input} value={modal.modelo} onChange={(e) => campo("modelo", e.target.value)} /></Campo>
          <Campo label="Tipo"><input style={s.input} value={modal.tipo} onChange={(e) => campo("tipo", e.target.value)} placeholder="Ej: Fumigación" /></Campo>
          <Campo label="Estado">
            <select style={s.input} value={modal.estado} onChange={(e) => campo("estado", e.target.value)}>
              {Object.keys(ESTADO_MAQUINA).map((e) => <option key={e}>{e}</option>)}
            </select>
          </Campo>
          <Campo label="Tarifa neta (CLP)"><input style={s.input} type="number" min="0" value={modal.precio} onChange={(e) => campo("precio", e.target.value)} /></Campo>
          <Campo label="Se cobra por">
            <select style={s.input} value={modal.unidad_cobro} onChange={(e) => campo("unidad_cobro", e.target.value)}>
              <option value="hora">hora</option>
              <option value="hectárea">hectárea</option>
            </select>
          </Campo>
          <Campo label="Notas" full><input style={s.input} value={modal.notas} onChange={(e) => campo("notas", e.target.value)} /></Campo>
        </ModalLecheria>
      )}
    </div>
  )
}