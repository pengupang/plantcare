import { useState } from "react"
import { Pencil, Trash2, Plus, X, Check, AlertTriangle } from "lucide-react"

const proveedoresDisponibles = ["Agro Insumos Sur", "Veterinaria del Campo", "FertiSur Ltda.", "Otro"]

const initialData = [
  { id: 1, nombre: "Heno de alfalfa", stock: 2, minimo: 5, unidad: "fardos", proveedor: "Agro Insumos Sur", precio: 8500 },
  { id: 2, nombre: "Sal mineral", stock: 1, minimo: 3, unidad: "sacos", proveedor: "Agro Insumos Sur", precio: 12000 },
  { id: 3, nombre: "Vitamina ADE", stock: 0, minimo: 2, unidad: "litros", proveedor: "Veterinaria del Campo", precio: 25000 },
  { id: 4, nombre: "Maíz molido", stock: 8, minimo: 4, unidad: "sacos", proveedor: "Agro Insumos Sur", precio: 18000 },
  { id: 5, nombre: "Melaza", stock: 3, minimo: 2, unidad: "litros", proveedor: "Agro Insumos Sur", precio: 5000 },
]

const emptyRow = { nombre: "", stock: 0, minimo: 0, unidad: "kg", proveedor: proveedoresDisponibles[0], precio: 0 }

const getStockStatus = (stock, minimo) => {
  if (stock === 0) return { bg: "#FEE2E2", color: "#991B1B", label: "Sin stock" }
  if (stock <= minimo) return { bg: "#FEF3C7", color: "#92400E", label: "Stock bajo" }
  return { bg: "#D1FAE5", color: "#065F46", label: "OK" }
}

export default function VistaComidas() {
  const [items, setItems] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (item) => { setEditId(item.id); setEditData({ ...item }) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => {
    setItems(items.map(item => item.id === editId ? editData : item))
    cancelEdit()
  }
  const deleteRow = (id) => setItems(items.filter(item => item.id !== id))
  const addRow = () => {
    setItems([...items, { ...newRow, id: Date.now() }])
    setNewRow(emptyRow)
    setShowAdd(false)
  }

  const alertas = items.filter(i => i.stock <= i.minimo)

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Comidas y Alimentos</h2>
          <p style={styles.sub}>{items.length} productos · {alertas.length} alertas de stock</p>
        </div>
        <button style={styles.btnAdd} onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Agregar producto
        </button>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div style={styles.alertBox}>
          <AlertTriangle size={16} color="#D97706" />
          <span style={styles.alertText}>
            <strong>{alertas.length} producto(s)</strong> con stock bajo o sin stock: {alertas.map(a => a.nombre).join(", ")}
          </span>
        </div>
      )}

      {/* Modal agregar */}
      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nuevo producto</h3>
              <button style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Nombre</label>
                <input style={styles.input} value={newRow.nombre}
                  onChange={e => setNewRow({ ...newRow, nombre: e.target.value })} />
              </div>
              <div>
                <label style={styles.label}>Unidad</label>
                <select style={styles.input} value={newRow.unidad}
                  onChange={e => setNewRow({ ...newRow, unidad: e.target.value })}>
                  {["kg", "litros", "sacos", "fardos", "unidades", "cajas"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Stock actual</label>
                <input style={styles.input} type="number" value={newRow.stock}
                  onChange={e => setNewRow({ ...newRow, stock: Number(e.target.value) })} />
              </div>
              <div>
                <label style={styles.label}>Stock mínimo</label>
                <input style={styles.input} type="number" value={newRow.minimo}
                  onChange={e => setNewRow({ ...newRow, minimo: Number(e.target.value) })} />
              </div>
              <div>
                <label style={styles.label}>Proveedor</label>
                <select style={styles.input} value={newRow.proveedor}
                  onChange={e => setNewRow({ ...newRow, proveedor: e.target.value })}>
                  {proveedoresDisponibles.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Precio unitario (CLP)</label>
                <input style={styles.input} type="number" value={newRow.precio}
                  onChange={e => setNewRow({ ...newRow, precio: Number(e.target.value) })} />
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
              {["Producto", "Stock actual", "Mínimo", "Unidad", "Proveedor", "Precio unit.", "Estado", ""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const status = getStockStatus(item.stock, item.minimo)
              return (
                <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#ffffff" }}>
                  {editId === item.id ? (
                    <>
                      <td style={styles.td}><input style={styles.inlineInput} value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} /></td>
                      <td style={styles.td}><input style={styles.inlineInput} type="number" value={editData.stock} onChange={e => setEditData({ ...editData, stock: Number(e.target.value) })} /></td>
                      <td style={styles.td}><input style={styles.inlineInput} type="number" value={editData.minimo} onChange={e => setEditData({ ...editData, minimo: Number(e.target.value) })} /></td>
                      <td style={styles.td}>
                        <select style={styles.inlineInput} value={editData.unidad} onChange={e => setEditData({ ...editData, unidad: e.target.value })}>
                          {["kg", "litros", "sacos", "fardos", "unidades", "cajas"].map(u => <option key={u}>{u}</option>)}
                        </select>
                      </td>
                      <td style={styles.td}>
                        <select style={styles.inlineInput} value={editData.proveedor} onChange={e => setEditData({ ...editData, proveedor: e.target.value })}>
                          {proveedoresDisponibles.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </td>
                      <td style={styles.td}><input style={styles.inlineInput} type="number" value={editData.precio} onChange={e => setEditData({ ...editData, precio: Number(e.target.value) })} /></td>
                      <td style={styles.td} />
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14} /></button>
                          <button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={styles.td}><span style={styles.nombre}>{item.nombre}</span></td>
                      <td style={styles.td}><span style={{ fontWeight: 600, color: item.stock === 0 ? "#EF4444" : "#1E293B" }}>{item.stock}</span></td>
                      <td style={styles.td}>{item.minimo}</td>
                      <td style={styles.td}>{item.unidad}</td>
                      <td style={styles.td}>{item.proveedor}</td>
                      <td style={styles.td}>${Number(item.precio).toLocaleString("es-CL")}</td>
                      <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: status.bg, color: status.color }}>{status.label}</span></td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={styles.iconBtnGreen} onClick={() => startEdit(item)}><Pencil size={14} /></button>
                          <button style={styles.iconBtnRed} onClick={() => deleteRow(item.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
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
  btnAdd: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#3D6B4F", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  alertBox: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "8px" },
  alertText: { fontSize: "13px", color: "#92400E" },
  tableCard: { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #E2E8F0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#94A3B8", padding: "12px 16px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "#F8FAFC" },
  td: { padding: "12px 16px", fontSize: "13px", color: "#334155", borderBottom: "1px solid #F1F5F9", verticalAlign: "middle" },
  nombre: { fontWeight: 600, color: "#1E293B" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 },
  actions: { display: "flex", gap: "6px" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#64748B" },
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
  btnSave: { padding: "8px 20px", backgroundColor: "#3D6B4F", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
}