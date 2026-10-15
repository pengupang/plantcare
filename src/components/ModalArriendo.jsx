import { useState } from "react"
import { arriendos as api } from "../services/maquinaria"
import ModalLecheria, { Campo } from "./ModalLecheria"
import s, { AZUL, ESTADO_ARRIENDO } from "../pages/estilosMaquinaria"

// Formulario de arriendo (crear / editar). Lo usan Arriendos y el Calendario.
//   catalogo = { clientes, maquinas, servicios }  (ver catalogos() en services/maquinaria)
//   inicial  = fila existente (editar) o valores por defecto (crear)
export default function ModalArriendo({ inicial, catalogo, onClose, onGuardado }) {
  const { clientes, maquinas, servicios } = catalogo
  const [f, setF] = useState(() => ({
    cliente_id: "", maquina_id: "", servicio_id: "", inicio: "", fin: "", cantidad: "", unidad: "horas",
    monto: 0, pagado: false, estado: "Pendiente", notas: "", predio: "", comuna: "", operador: "",
    ...inicial,
    _montoManual: !!inicial?.id, // al editar no se pisa el monto guardado
  }))
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const serviciosDeMaquina = servicios.filter((sv) => !f.maquina_id || sv.maquinas.includes(Number(f.maquina_id)))

  // Si no se ha tocado el monto a mano, se sugiere cantidad × tarifa vigente de la máquina
  const conMonto = (n) => {
    if (n._montoManual) return n
    const m = maquinas.find((x) => x.id === Number(n.maquina_id))
    return { ...n, monto: m && Number(n.cantidad) > 0 ? Math.round(Number(n.cantidad) * m.precio) : n.monto }
  }
  const cambiar = (k, v) => setF((p) => conMonto({ ...p, [k]: v }))

  const cambiarMaquina = (id) =>
    setF((p) => {
      const sv = servicios.filter((x) => x.maquinas.includes(Number(id)))
      const actual = sv.find((x) => x.id === Number(p.servicio_id)) ?? sv[0]
      return conMonto({ ...p, maquina_id: id, servicio_id: actual?.id ?? "", unidad: actual?.unidad ?? p.unidad })
    })
  const cambiarServicio = (id) => {
    const sv = servicios.find((x) => x.id === Number(id))
    cambiar("servicio_id", id)
    if (sv) setF((p) => ({ ...p, unidad: sv.unidad }))
  }

  const guardar = async () => {
    if (!f.cliente_id) return setError("Selecciona un cliente")
    if (!f.maquina_id) return setError("Selecciona una máquina")
    if (!f.servicio_id) return setError("Selecciona un servicio")
    if (!f.inicio || !f.fin) return setError("Indica fecha de inicio y de fin")
    if (f.fin < f.inicio) return setError("La fecha de fin no puede ser anterior al inicio")
    if (!(Number(f.cantidad) > 0)) return setError("La cantidad debe ser mayor que 0")
    if (Number(f.monto) < 0) return setError("El monto no puede ser negativo")

    const payload = {
      cliente_id: f.cliente_id,
      maquina_id: Number(f.maquina_id),
      servicio_id: Number(f.servicio_id),
      inicio: f.inicio,
      fin: f.fin,
      cantidad: Number(f.cantidad),
      unidad: f.unidad,
      monto: Math.round(Number(f.monto) || 0),
      pagado: f.pagado,
      estado: f.estado,
      notas: f.notas.trim(),
      predio: f.predio?.trim() || null,
      comuna: f.comuna?.trim() || null,
      operador: f.operador?.trim() || null,
    }
    try {
      setGuardando(true)
      setError(null)
      if (f.id) await api.actualizar(f.id, payload)
      else await api.crear(payload)
      await onGuardado()
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <ModalLecheria titulo={f.id ? "Editar arriendo" : "Nuevo arriendo"} color={AZUL} ancho={600} onClose={onClose} onSave={guardar} error={error} guardando={guardando}>
      <Campo label="Cliente" full>
        <select style={s.input} value={f.cliente_id} onChange={(e) => cambiar("cliente_id", e.target.value)}>
          <option value="">Selecciona...</option>
          {/* si el cliente del arriendo quedó inactivo, igual se muestra al editar */}
          {inicial?.cliente_id && !clientes.some((c) => c.id === inicial.cliente_id) && (
            <option value={inicial.cliente_id}>{inicial.cliente?.nombre ?? "Cliente (inactivo)"}</option>
          )}
          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </Campo>
      <Campo label="Máquina">
        <select style={s.input} value={f.maquina_id} onChange={(e) => cambiarMaquina(e.target.value)}>
          <option value="">Selecciona...</option>
          {maquinas.map((m) => <option key={m.id} value={m.id}>{m.nombre} {m.modelo}</option>)}
        </select>
      </Campo>
      <Campo label="Servicio">
        <select style={s.input} value={f.servicio_id} onChange={(e) => cambiarServicio(e.target.value)}>
          <option value="">Selecciona...</option>
          {serviciosDeMaquina.map((sv) => <option key={sv.id} value={sv.id}>{sv.nombre}</option>)}
        </select>
      </Campo>
      <Campo label="Fecha inicio"><input style={s.input} type="date" value={f.inicio} onChange={(e) => cambiar("inicio", e.target.value)} /></Campo>
      <Campo label="Fecha fin"><input style={s.input} type="date" value={f.fin} onChange={(e) => cambiar("fin", e.target.value)} /></Campo>
      <Campo label={`Cantidad (${f.unidad})`}>
        <input style={s.input} type="number" min="0" step="0.5" value={f.cantidad} onChange={(e) => cambiar("cantidad", e.target.value)} />
      </Campo>
      <Campo label="Monto neto (CLP)">
        <input style={s.input} type="number" min="0" value={f.monto} onChange={(e) => setF((p) => ({ ...p, monto: e.target.value, _montoManual: true }))} />
      </Campo>
      <Campo label="Estado">
        <select style={s.input} value={f.estado} onChange={(e) => cambiar("estado", e.target.value)}>
          {Object.keys(ESTADO_ARRIENDO).map((e) => <option key={e}>{e}</option>)}
        </select>
      </Campo>
      <Campo label="Pago">
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", paddingTop: 9 }}>
          <input type="checkbox" checked={f.pagado} onChange={(e) => cambiar("pagado", e.target.checked)} /> Pago recibido
        </label>
      </Campo>
      <Campo label="Predio"><input style={s.input} value={f.predio ?? ""} onChange={(e) => cambiar("predio", e.target.value)} /></Campo>
      <Campo label="Comuna"><input style={s.input} value={f.comuna ?? ""} onChange={(e) => cambiar("comuna", e.target.value)} /></Campo>
      <Campo label="Operador"><input style={s.input} value={f.operador ?? ""} onChange={(e) => cambiar("operador", e.target.value)} /></Campo>
      <Campo label="Notas"><input style={s.input} value={f.notas} onChange={(e) => cambiar("notas", e.target.value)} /></Campo>
    </ModalLecheria>
  )
}