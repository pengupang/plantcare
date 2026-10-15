import { useCallback, useState } from "react"
import { Pencil, Trash2, Plus, Wrench } from "lucide-react"
import { servicios as api, maquinas as maquinasApi } from "../services/maquinaria"
import useCarga from "../lib/useCarga"
import EstadoCarga from "../components/EstadoCarga"
import ModalLecheria, { Campo } from "../components/ModalLecheria"
import s, { AZUL } from "./estilosMaquinaria"

const vacio = { nombre: "", descripcion: "", unidad: "hectáreas", nota: "", maquinas: [] }

export default function VistaServicios() {
  const cargarTodo = useCallback(async () => {
    const [servicios, maquinas] = await Promise.all([api.listar(), maquinasApi.listar()])
    return { servicios, maquinas }
  }, [])
  const { datos, cargando, error, setError, recargar } = useCarga(cargarTodo, { servicios: [], maquinas: [] })
  const { servicios, maquinas } = datos

  const [modal, setModal] = useState(null)
  const [modalError, setModalError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const campo = (k, v) => setModal((m) => ({ ...m, [k]: v }))
  const toggleMaquina = (id) =>
    setModal((m) => ({ ...m, maquinas: m.maquinas.includes(id) ? m.maquinas.filter((x) => x !== id) : [...m.maquinas, id] }))
  const nombreMaquina = (id) => {
    const m = maquinas.find((x) => x.id === id)
    return m ? `${m.nombre} ${m.modelo}` : `#${id}`
  }

  const guardar = async () => {
    if (!modal.nombre.trim()) return setModalError("El nombre es obligatorio")
    const payload = {
      nombre: modal.nombre.trim(),
      descripcion: modal.descripcion.trim(),
      unidad: modal.unidad,
      nota: modal.nota.trim(),
      maquinas: modal.maquinas,
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

  const eliminar = async (sv) => {
    if (!window.confirm(`¿Eliminar el servicio "${sv.nombre}"?`)) return
    try { await api.eliminar(sv.id); await recargar() } catch (e) { setError(e.message) }
  }

  return (
    <div style={s.container}>
      <div style={s.topBar}>
        <div>
          <h2 style={s.title}>Tipos de Servicio</h2>
          <p style={s.sub}>{servicios.length} servicios disponibles</p>
        </div>
        <button style={s.btnAdd} onClick={() => { setModalError(null); setModal({ ...vacio }) }}>
          <Plus size={15} /> Agregar servicio
        </button>
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

      {!cargando && !error && (
        <div style={s.cardsGrid}>
          {servicios.map((sv) => (
            <div key={sv.id} style={s.card}>
              <div style={s.cardHead}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#EBF2FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench size={16} color={AZUL} />
                </div>
                <div style={s.actions}>
                  <button style={s.iconBtnBlue} title="Editar" onClick={() => { setModalError(null); setModal({ ...sv }) }}><Pencil size={13} /></button>
                  <button style={s.iconBtnRed} title="Eliminar" onClick={() => eliminar(sv)}><Trash2 size={13} /></button>
                </div>
              </div>
              <h3 style={s.cardTitle}>{sv.nombre}</h3>
              <p style={{ ...s.cardMeta, lineHeight: 1.5 }}>{sv.descripcion}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {sv.maquinas.map((id) => (
                  <span key={id} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, backgroundColor: "#EBF2FB", color: AZUL, fontWeight: 500 }}>
                    {nombreMaquina(id)}
                  </span>
                ))}
              </div>
              <p style={{ ...s.cardMeta, fontStyle: "italic" }}>Se cobra por {sv.unidad === "horas" ? "hora" : "hectárea"}{sv.nota ? ` · ${sv.nota}` : ""}</p>
            </div>
          ))}
          {servicios.length === 0 && <p style={s.vacio}>Aún no hay servicios registrados.</p>}
        </div>
      )}

      {modal && (
        <ModalLecheria
          titulo={modal.id ? "Editar servicio" : "Nuevo servicio"}
          color={AZUL}
          onClose={() => setModal(null)}
          onSave={guardar}
          error={modalError}
          guardando={guardando}
        >
          <Campo label="Nombre del servicio" full><input style={s.input} value={modal.nombre} onChange={(e) => campo("nombre", e.target.value)} /></Campo>
          <Campo label="Descripción" full>
            <textarea style={{ ...s.input, height: 70, resize: "vertical" }} value={modal.descripcion} onChange={(e) => campo("descripcion", e.target.value)} />
          </Campo>
          <Campo label="Unidad de cobro">
            <select style={s.input} value={modal.unidad} onChange={(e) => campo("unidad", e.target.value)}>
              <option value="horas">horas</option>
              <option value="hectáreas">hectáreas</option>
            </select>
          </Campo>
          <Campo label="Nota de tarifa"><input style={s.input} value={modal.nota} onChange={(e) => campo("nota", e.target.value)} /></Campo>
          <Campo label="Maquinaria que realiza este servicio" full>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, backgroundColor: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
              {maquinas.map((m) => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", cursor: "pointer" }}>
                  <input type="checkbox" checked={modal.maquinas.includes(m.id)} onChange={() => toggleMaquina(m.id)} />
                  {m.nombre} {m.modelo}
                </label>
              ))}
            </div>
          </Campo>
        </ModalLecheria>
      )}
    </div>
  )
}