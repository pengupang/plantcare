import { useState } from "react"
import { Pencil, Trash2, Plus, X, Check, Phone, Mail } from "lucide-react"

const initialData = [
  { id: 1, nombre: "Agro Insumos Sur", rut: "76.123.456-7", contacto: "Carlos Muñoz", telefono: "+56 9 1234 5678", email: "contacto@agroinsumos.cl", rubro: "Alimentación animal" },
  { id: 2, nombre: "Veterinaria del Campo", rut: "76.987.654-3", contacto: "Ana Torres", telefono: "+56 9 8765 4321", email: "vet@campo.cl", rubro: "Medicamentos" },
  { id: 3, nombre: "FertiSur Ltda.", rut: "77.111.222-3", contacto: "Pedro Lagos", telefono: "+56 9 5555 1234", email: "ventas@fertisur.cl", rubro: "Fertilizantes" },
]

const emptyRow = { nombre: "", rut: "", contacto: "", telefono: "", email: "", rubro: "" }

export default function VistaProveedores({ color = "#3D6B4F", btnColor = "#3D6B4F" }) {
  const [proveedores, setProveedores] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (p) => { setEditId(p.id); setEditData({ ...p }) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => {
    setProveedores(proveedores.map(p => p.id === editId ? editData : p))
    cancelEdit()
  }
  const deleteRow = (id) => setProveedores(proveedores.filter(p => p.id !== id))
  const addRow = () => {
    setProveedores([...proveedores, { ...newRow, id: Date.now() }])
    setNewRow(emptyRow)
    setShowAdd(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Proveedores</h2>
          <p style={styles.sub}>{proveedores.length} proveedores registrados</p>
        </div>
        <button style={{ ...styles.btnAdd, backgroundColor: btnColor }} onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Agregar proveedor
        </button>
      </div>

      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nuevo proveedor</h3>
              <button style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={styles.formGrid}>
              {[
                ["Nombre empresa", "nombre"], ["RUT", "rut"],
                ["Contacto", "contacto"], ["Teléfono", "telefono"],
                ["Email", "email"], ["Rubro", "rubro"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label style={styles.label}>{label}</label>
                  <input style={styles.input} value={newRow[key]}
                    onChange={e => setNewRow({ ...newRow, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={() => setShowAdd(false)}>Cancelar</button>
              <button style={{ ...styles.btnSave, backgroundColor: btnColor }} onClick={addRow}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Empresa", "RUT", "Contacto", "Teléfono", "Email", "Rubro", ""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p, i) => (
              <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#ffffff" }}>
                {editId === p.id ? (
                  <>
                    {["nombre", "rut", "contacto", "telefono", "email", "rubro"].map(key => (
                      <td key={key} style={styles.td}>
                        <input style={styles.inlineInput} value={editData[key]}
                          onChange={e => setEditData({ ...editData, [key]: e.target.value })} />
                      </td>
                    ))}
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14} /></button>
                        <button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}><span style={styles.nombre}>{p.nombre}</span></td>
                    <td style={styles.td}>{p.rut}</td>
                    <td style={styles.td}>{p.contacto}</td>
                    <td style={styles.td}>
                      <a href={`tel:${p.telefono}`} style={styles.link}>
                        <Phone size={12} /> {p.telefono}
                      </a>
                    </td>
                    <td style={styles.td}>
                      <a href={`mailto:${p.email}`} style={styles.link}>
                        <Mail size={12} /> {p.email}
                      </a>
                    </td>
                    <td style={styles.td}>{p.rubro}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.iconBtnBlue} onClick={() => startEdit(p)}><Pencil size={14} /></button>
                        <button style={styles.iconBtnRed} onClick={() => deleteRow(p.id)}><Trash2 size={14} /></button>
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
  btnAdd: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  tableCard: { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #E2E8F0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#94A3B8", padding: "12px 16px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "#F8FAFC" },
  td: { padding: "12px 16px", fontSize: "13px", color: "#334155", borderBottom: "1px solid #F1F5F9", verticalAlign: "middle" },
  nombre: { fontWeight: 600, color: "#1E293B" },
  link: { display: "flex", alignItems: "center", gap: "4px", color: "#4A6FA5", textDecoration: "none", fontSize: "13px" },
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
  btnSave: { padding: "8px 20px", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
}