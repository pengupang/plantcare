import { useState } from "react"
import { Pencil, Trash2, Plus, X, Check, Phone, Mail } from "lucide-react"

const initialData = [
  { id: 1, nombre: "Juan Pérez", rut: "12.345.678-9", telefono: "+56 9 1234 5678", email: "juan@email.cl", direccion: "Los Robles 123, Osorno", activo: true },
  { id: 2, nombre: "Agro Sur Ltda.", rut: "76.123.456-7", telefono: "+56 9 8765 4321", email: "contacto@agrosur.cl", direccion: "Ruta 5 Sur Km 920", activo: true },
  { id: 3, nombre: "Campo Verde SpA", rut: "77.654.321-0", telefono: "+56 9 5555 9999", email: "admin@campoverde.cl", direccion: "Fundo El Roble, Río Bueno", activo: true },
  { id: 4, nombre: "Pedro Soto", rut: "15.987.654-3", telefono: "+56 9 3333 4444", email: "pedro.soto@gmail.com", direccion: "Calle Bío-Bío 45, Osorno", activo: false },
]

const emptyRow = { nombre: "", rut: "", telefono: "", email: "", direccion: "", activo: true }

export default function VistaClientes() {
  const [clientes, setClientes] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (c) => { setEditId(c.id); setEditData({ ...c }) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => { setClientes(clientes.map(c => c.id === editId ? editData : c)); cancelEdit() }
  const deleteRow = (id) => setClientes(clientes.filter(c => c.id !== id))
  const addRow = () => { setClientes([...clientes, { ...newRow, id: Date.now() }]); setNewRow(emptyRow); setShowAdd(false) }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Clientes</h2>
          <p style={styles.sub}>{clientes.filter(c => c.activo).length} activos · {clientes.length} total</p>
        </div>
        <button style={styles.btnAdd} onClick={() => setShowAdd(true)}><Plus size={15} /> Agregar cliente</button>
      </div>

      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nuevo cliente</h3>
              <button style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={styles.formGrid}>
              {[["Nombre / Empresa","nombre"],["RUT","rut"],["Teléfono","telefono"],["Email","email"]].map(([label,key]) => (
                <div key={key}><label style={styles.label}>{label}</label>
                  <input style={styles.input} value={newRow[key]} onChange={e => setNewRow({...newRow,[key]:e.target.value})} /></div>
              ))}
              <div style={{gridColumn:"span 2"}}><label style={styles.label}>Dirección</label>
                <input style={styles.input} value={newRow.direccion} onChange={e => setNewRow({...newRow,direccion:e.target.value})} /></div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={() => setShowAdd(false)}>Cancelar</button>
              <button style={styles.btnSave} onClick={addRow}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr>{["Nombre / RUT","Teléfono","Email","Dirección","Estado",""].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {clientes.map((c,i) => (
              <tr key={c.id} style={{backgroundColor: i%2===0?"#F8FAFC":"#fff"}}>
                {editId===c.id ? (
                  <>
                    <td style={styles.td}><input style={styles.inlineInput} value={editData.nombre} onChange={e=>setEditData({...editData,nombre:e.target.value})} /><input style={{...styles.inlineInput,marginTop:4}} value={editData.rut} onChange={e=>setEditData({...editData,rut:e.target.value})} placeholder="RUT"/></td>
                    {["telefono","email","direccion"].map(k=><td key={k} style={styles.td}><input style={styles.inlineInput} value={editData[k]} onChange={e=>setEditData({...editData,[k]:e.target.value})} /></td>)}
                    <td style={styles.td}><select style={styles.inlineInput} value={editData.activo} onChange={e=>setEditData({...editData,activo:e.target.value==="true"})}><option value="true">Activo</option><option value="false">Inactivo</option></select></td>
                    <td style={styles.td}><div style={styles.actions}><button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14}/></button><button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14}/></button></div></td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}><span style={styles.nombre}>{c.nombre}</span><span style={styles.rut}>{c.rut}</span></td>
                    <td style={styles.td}><a href={`tel:${c.telefono}`} style={styles.link}><Phone size={12}/>{c.telefono}</a></td>
                    <td style={styles.td}><a href={`mailto:${c.email}`} style={styles.link}><Mail size={12}/>{c.email}</a></td>
                    <td style={styles.td}>{c.direccion}</td>
                    <td style={styles.td}><span style={{...styles.badge,backgroundColor:c.activo?"#D1FAE5":"#F1F5F9",color:c.activo?"#065F46":"#64748B"}}>{c.activo?"Activo":"Inactivo"}</span></td>
                    <td style={styles.td}><div style={styles.actions}><button style={styles.iconBtnBlue} onClick={()=>startEdit(c)}><Pencil size={14}/></button><button style={styles.iconBtnRed} onClick={()=>deleteRow(c.id)}><Trash2 size={14}/></button></div></td>
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
  container:{display:"flex",flexDirection:"column",gap:"20px"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},
  title:{fontSize:"18px",fontWeight:700,color:"#1E293B",margin:0},
  sub:{fontSize:"13px",color:"#94A3B8",margin:"4px 0 0 0"},
  btnAdd:{display:"flex",alignItems:"center",gap:"6px",padding:"8px 16px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
  tableCard:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",overflow:"hidden"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",fontSize:"11px",fontWeight:600,color:"#94A3B8",padding:"12px 16px",borderBottom:"1px solid #E2E8F0",textTransform:"uppercase",letterSpacing:"0.05em",backgroundColor:"#F8FAFC"},
  td:{padding:"12px 16px",fontSize:"13px",color:"#334155",borderBottom:"1px solid #F1F5F9",verticalAlign:"middle"},
  nombre:{display:"block",fontWeight:600,color:"#1E293B"},
  rut:{display:"block",fontSize:"12px",color:"#94A3B8",marginTop:"2px"},
  badge:{padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:500},
  link:{display:"flex",alignItems:"center",gap:"4px",color:"#4A6FA5",textDecoration:"none",fontSize:"13px"},
  actions:{display:"flex",gap:"6px"},
  iconBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#64748B"},
  iconBtnBlue:{background:"#EBF2FB",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#4A6FA5"},
  iconBtnGreen:{background:"#D1FAE5",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#065F46"},
  iconBtnGray:{background:"#F1F5F9",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#64748B"},
  iconBtnRed:{background:"#FEE2E2",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#991B1B"},
  inlineInput:{width:"100%",padding:"5px 8px",border:"1px solid #CBD5E1",borderRadius:"4px",fontSize:"13px",boxSizing:"border-box"},
  modalOverlay:{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},
  modal:{backgroundColor:"#fff",borderRadius:"12px",padding:"24px",width:"100%",maxWidth:"480px",boxShadow:"0 20px 40px rgba(0,0,0,0.15)"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},
  modalTitle:{fontSize:"16px",fontWeight:700,color:"#1E293B",margin:0},
  modalFooter:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"20px"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  label:{display:"block",fontSize:"11px",fontWeight:600,color:"#64748B",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.04em"},
  input:{width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:"6px",fontSize:"13px",boxSizing:"border-box",backgroundColor:"#F8FAFC"},
  btnCancel:{padding:"8px 16px",backgroundColor:"transparent",border:"1px solid #E2E8F0",borderRadius:"6px",color:"#64748B",fontSize:"13px",cursor:"pointer"},
  btnSave:{padding:"8px 20px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
}