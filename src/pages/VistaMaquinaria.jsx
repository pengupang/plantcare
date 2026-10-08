import { useState } from "react"
import { Pencil, Trash2, Plus, X, Check } from "lucide-react"

const estadoColors = {
  "Disponible":  { bg: "#D1FAE5", color: "#065F46" },
  "Arrendada":   { bg: "#FEF3C7", color: "#92400E" },
  "Mantención":  { bg: "#FEE2E2", color: "#991B1B" },
}

const initialData = [
  { id: 1, nombre: "Retroexcavadora", modelo: "CAT 320", tipo: "Excavación", estado: "Disponible", precio: 120000, notas: "" },
  { id: 2, nombre: "Tractor", modelo: "New Holland T6", tipo: "Agrícola", estado: "Arrendada", precio: 85000, notas: "Cliente: Juan Pérez" },
  { id: 3, nombre: "Minicargador", modelo: "Bobcat S570", tipo: "Carga", estado: "Mantención", precio: 75000, notas: "Cambio de aceite" },
  { id: 4, nombre: "Cosechadora", modelo: "John Deere S760", tipo: "Agrícola", estado: "Disponible", precio: 200000, notas: "" },
]

const emptyRow = { nombre: "", modelo: "", tipo: "", estado: "Disponible", precio: 0, notas: "" }

export default function VistaMaquinaria() {
  const [maquinas, setMaquinas] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (m) => { setEditId(m.id); setEditData({ ...m }) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => {
    setMaquinas(maquinas.map(m => m.id === editId ? editData : m))
    cancelEdit()
  }
  const deleteRow = (id) => setMaquinas(maquinas.filter(m => m.id !== id))
  const addRow = () => {
    setMaquinas([...maquinas, { ...newRow, id: Date.now() }])
    setNewRow(emptyRow)
    setShowAdd(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Maquinaria</h2>
          <p style={styles.sub}>{maquinas.length} equipos registrados</p>
        </div>
        <button style={styles.btnAdd} onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Agregar equipo
        </button>
      </div>

      {/* Modal agregar */}
      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nuevo equipo</h3>
              <button style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={styles.formGrid}>
              {[
                ["Nombre", "nombre"], ["Modelo", "modelo"], ["Tipo", "tipo"], ["Precio/día (CLP)", "precio"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label style={styles.label}>{label}</label>
                  <input style={styles.input} value={newRow[key]}
                    onChange={e => setNewRow({ ...newRow, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={styles.label}>Estado</label>
                <select style={styles.input} value={newRow.estado}
                  onChange={e => setNewRow({ ...newRow, estado: e.target.value })}>
                  {Object.keys(estadoColors).map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Notas</label>
                <input style={styles.input} value={newRow.notas}
                  onChange={e => setNewRow({ ...newRow, notas: e.target.value })} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={() => setShowAdd(false)}>Cancelar</button>
              <button style={styles.btnSave} onClick={addRow}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Nombre / Modelo", "Tipo", "Estado", "Precio/día", "Notas", ""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maquinas.map((m, i) => (
              <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#ffffff" }}>
                {editId === m.id ? (
                  <>
                    <td style={styles.td}>
                      <input style={styles.inlineInput} value={editData.nombre}
                        onChange={e => setEditData({ ...editData, nombre: e.target.value })} placeholder="Nombre" />
                      <input style={{ ...styles.inlineInput, marginTop: 4 }} value={editData.modelo}
                        onChange={e => setEditData({ ...editData, modelo: e.target.value })} placeholder="Modelo" />
                    </td>
                    <td style={styles.td}>
                      <input style={styles.inlineInput} value={editData.tipo}
                        onChange={e => setEditData({ ...editData, tipo: e.target.value })} />
                    </td>
                    <td style={styles.td}>
                      <select style={styles.inlineInput} value={editData.estado}
                        onChange={e => setEditData({ ...editData, estado: e.target.value })}>
                        {Object.keys(estadoColors).map(e => <option key={e}>{e}</option>)}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <input style={styles.inlineInput} type="number" value={editData.precio}
                        onChange={e => setEditData({ ...editData, precio: e.target.value })} />
                    </td>
                    <td style={styles.td}>
                      <input style={styles.inlineInput} value={editData.notas}
                        onChange={e => setEditData({ ...editData, notas: e.target.value })} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14} /></button>
                        <button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}>
                      <span style={styles.nombre}>{m.nombre}</span>
                      <span style={styles.modelo}>{m.modelo}</span>
                    </td>
                    <td style={styles.td}>{m.tipo}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...estadoColors[m.estado] }}>{m.estado}</span>
                    </td>
                    <td style={styles.td}>${Number(m.precio).toLocaleString("es-CL")}</td>
                    <td style={{ ...styles.td, color: "#94A3B8" }}>{m.notas || "—"}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.iconBtnBlue} onClick={() => startEdit(m)}><Pencil size={14} /></button>
                        <button style={styles.iconBtnRed} onClick={() => deleteRow(m.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "18px", fontWeight: 700, color: "#1E293B", margin: 0 },
  sub: { fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" },
  btnAdd: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#4A6FA5", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  tableCard: { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #E2E8F0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#94A3B8", padding: "12px 16px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "#F8FAFC" },
  td: { padding: "12px 16px", fontSize: "13px", color: "#334155", borderBottom: "1px solid #F1F5F9", verticalAlign: "middle" },
  nombre: { display: "block", fontWeight: 600, color: "#1E293B" },
  modelo: { display: "block", fontSize: "12px", color: "#94A3B8", marginTop: "2px" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 },
  actions: { display: "flex", gap: "6px" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#64748B" },
  iconBtnBlue: { background: "#EBF2FB", border: "none", cursor: "pointer", padding: "6px", borderRadius: "4px", color: "#4A6FA5" },
  iconBtnGreen: { background: "#D1FAE5", border: "none", cursor: "pointer", padding: "6px", borderRadius: "4px", color: "#065F46" },
  iconBtnGray: { background: "#F1F5F9", border: "none", cursor: "pointer", padding: "6px", borderRadius: "4px", color: "#64748B" },
  iconBtnRed: { background: "#FEE2E2", border: "none", cursor: "pointer", padding: "6px", borderRadius: "4px", color: "#991B1B" },
  inlineInput: { width: "100%", padding: "5px 8px", border: "1px solid #CBD5E1", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: 700, color: "#1E293B", margin: 0 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { display: "block", fontSize: "11px", fontWeight: 600, color: "#64748B", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#F8FAFC" },
  btnCancel: { padding: "8px 16px", backgroundColor: "transparent", border: "1px solid #E2E8F0", borderRadius: "6px", color: "#64748B", fontSize: "13px", cursor: "pointer" },
  btnSave: { padding: "8px 20px", backgroundColor: "#4A6FA5", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
}
