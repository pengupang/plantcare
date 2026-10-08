import { useState } from "react"
import { Plus, X, Check, Pencil, Trash2, DollarSign, CheckCircle, Clock } from "lucide-react"

const clientes = ["Juan Pérez","Agro Sur Ltda.","Campo Verde SpA","Pedro Soto"]
const maquinas = ["Retroexcavadora CAT 320","Tractor New Holland T6","Minicargador Bobcat S570","Cosechadora John Deere S760"]
const servicios = ["Movimiento de tierra","Labranza agrícola","Cosecha","Carga y transporte interno"]

const initialData = [
  { id:1, cliente:"Juan Pérez", maquina:"Retroexcavadora CAT 320", servicio:"Movimiento de tierra", inicio:"2026-10-01", fin:"2026-10-10", monto:1200000, pagado:true, estado:"Activo", notas:"" },
  { id:2, cliente:"Agro Sur Ltda.", maquina:"Tractor New Holland T6", servicio:"Labranza agrícola", inicio:"2026-10-05", fin:"2026-10-15", monto:850000, pagado:false, estado:"Activo", notas:"Pendiente 2da cuota" },
  { id:3, cliente:"Pedro Soto", maquina:"Minicargador Bobcat S570", servicio:"Carga y transporte interno", inicio:"2026-09-28", fin:"2026-10-05", monto:750000, pagado:true, estado:"Finalizado", notas:"" },
  { id:4, cliente:"Campo Verde SpA", maquina:"Cosechadora John Deere S760", servicio:"Cosecha", inicio:"2026-10-07", fin:"2026-10-20", monto:2000000, pagado:false, estado:"Activo", notas:"Pago al finalizar" },
]

const emptyRow = { cliente:clientes[0], maquina:maquinas[0], servicio:servicios[0], inicio:"", fin:"", monto:0, pagado:false, estado:"Activo", notas:"" }

const estadoColors = {
  "Activo":     { bg:"#D1FAE5", color:"#065F46" },
  "Finalizado": { bg:"#F1F5F9", color:"#64748B" },
  "Pendiente":  { bg:"#FEF3C7", color:"#92400E" },
}

export default function VistaArriendos() {
  const [arriendos, setArriendos] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (a) => { setEditId(a.id); setEditData({...a}) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => { setArriendos(arriendos.map(a => a.id===editId ? editData : a)); cancelEdit() }
  const deleteRow = (id) => setArriendos(arriendos.filter(a => a.id!==id))
  const addRow = () => { setArriendos([...arriendos,{...newRow,id:Date.now(),monto:Number(newRow.monto)}]); setNewRow(emptyRow); setShowAdd(false) }
  const togglePago = (id) => setArriendos(arriendos.map(a => a.id===id ? {...a,pagado:!a.pagado} : a))

  const totalPagado = arriendos.filter(a=>a.pagado).reduce((s,a)=>s+a.monto,0)
  const totalPendiente = arriendos.filter(a=>!a.pagado).reduce((s,a)=>s+a.monto,0)

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div><h2 style={styles.title}>Arriendos</h2><p style={styles.sub}>{arriendos.length} registros</p></div>
        <button style={styles.btnAdd} onClick={()=>setShowAdd(true)}><Plus size={15}/> Nuevo arriendo</button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}><div style={{...styles.statIcon,backgroundColor:"#D1FAE5"}}><CheckCircle size={18} color="#065F46"/></div><div><p style={styles.statVal}>${totalPagado.toLocaleString("es-CL")}</p><p style={styles.statLab}>Pagado</p></div></div>
        <div style={styles.statCard}><div style={{...styles.statIcon,backgroundColor:"#FEF3C7"}}><Clock size={18} color="#92400E"/></div><div><p style={styles.statVal}>${totalPendiente.toLocaleString("es-CL")}</p><p style={styles.statLab}>Por cobrar</p></div></div>
        <div style={styles.statCard}><div style={{...styles.statIcon,backgroundColor:"#EBF2FB"}}><DollarSign size={18} color="#4A6FA5"/></div><div><p style={styles.statVal}>${(totalPagado+totalPendiente).toLocaleString("es-CL")}</p><p style={styles.statLab}>Total facturado</p></div></div>
      </div>

      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h3 style={styles.modalTitle}>Nuevo arriendo</h3><button style={styles.iconBtn} onClick={()=>setShowAdd(false)}><X size={16}/></button></div>
            <div style={styles.formGrid}>
              <div><label style={styles.label}>Cliente</label><select style={styles.input} value={newRow.cliente} onChange={e=>setNewRow({...newRow,cliente:e.target.value})}>{clientes.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label style={styles.label}>Máquina</label><select style={styles.input} value={newRow.maquina} onChange={e=>setNewRow({...newRow,maquina:e.target.value})}>{maquinas.map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label style={styles.label}>Servicio</label><select style={styles.input} value={newRow.servicio} onChange={e=>setNewRow({...newRow,servicio:e.target.value})}>{servicios.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label style={styles.label}>Estado</label><select style={styles.input} value={newRow.estado} onChange={e=>setNewRow({...newRow,estado:e.target.value})}>{Object.keys(estadoColors).map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label style={styles.label}>Fecha inicio</label><input style={styles.input} type="date" value={newRow.inicio} onChange={e=>setNewRow({...newRow,inicio:e.target.value})} /></div>
              <div><label style={styles.label}>Fecha fin</label><input style={styles.input} type="date" value={newRow.fin} onChange={e=>setNewRow({...newRow,fin:e.target.value})} /></div>
              <div><label style={styles.label}>Monto (CLP)</label><input style={styles.input} type="number" value={newRow.monto} onChange={e=>setNewRow({...newRow,monto:e.target.value})} /></div>
              <div style={{display:"flex",alignItems:"center",gap:"8px",paddingTop:"20px"}}><input type="checkbox" checked={newRow.pagado} onChange={e=>setNewRow({...newRow,pagado:e.target.checked})} id="pagado"/><label htmlFor="pagado" style={{fontSize:"13px",color:"#334155"}}>Pago recibido</label></div>
              <div style={{gridColumn:"span 2"}}><label style={styles.label}>Notas</label><input style={styles.input} value={newRow.notas} onChange={e=>setNewRow({...newRow,notas:e.target.value})} /></div>
            </div>
            <div style={styles.modalFooter}><button style={styles.btnCancel} onClick={()=>setShowAdd(false)}>Cancelar</button><button style={styles.btnSave} onClick={addRow}>Guardar</button></div>
          </div>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr>{["Cliente","Máquina / Servicio","Periodo","Monto","Pago","Estado",""].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {arriendos.map((a,i)=>(
              <tr key={a.id} style={{backgroundColor:i%2===0?"#F8FAFC":"#fff"}}>
                {editId===a.id ? (
                  <>
                    <td style={styles.td}><select style={styles.inlineInput} value={editData.cliente} onChange={e=>setEditData({...editData,cliente:e.target.value})}>{clientes.map(c=><option key={c}>{c}</option>)}</select></td>
                    <td style={styles.td}><select style={styles.inlineInput} value={editData.maquina} onChange={e=>setEditData({...editData,maquina:e.target.value})}>{maquinas.map(m=><option key={m}>{m}</option>)}</select></td>
                    <td style={styles.td}><input style={styles.inlineInput} type="date" value={editData.inicio} onChange={e=>setEditData({...editData,inicio:e.target.value})} /><input style={{...styles.inlineInput,marginTop:4}} type="date" value={editData.fin} onChange={e=>setEditData({...editData,fin:e.target.value})} /></td>
                    <td style={styles.td}><input style={styles.inlineInput} type="number" value={editData.monto} onChange={e=>setEditData({...editData,monto:Number(e.target.value)})} /></td>
                    <td style={styles.td}><input type="checkbox" checked={editData.pagado} onChange={e=>setEditData({...editData,pagado:e.target.checked})} /></td>
                    <td style={styles.td}><select style={styles.inlineInput} value={editData.estado} onChange={e=>setEditData({...editData,estado:e.target.value})}>{Object.keys(estadoColors).map(s=><option key={s}>{s}</option>)}</select></td>
                    <td style={styles.td}><div style={styles.actions}><button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14}/></button><button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14}/></button></div></td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}><span style={{fontWeight:600,color:"#1E293B"}}>{a.cliente}</span></td>
                    <td style={styles.td}><span style={{display:"block",fontWeight:600,color:"#1E293B",fontSize:"12px"}}>{a.maquina}</span><span style={{fontSize:"11px",color:"#94A3B8"}}>{a.servicio}</span></td>
                    <td style={styles.td}><span style={{fontSize:"12px"}}>{a.inicio}</span><span style={{display:"block",fontSize:"11px",color:"#94A3B8"}}>hasta {a.fin}</span></td>
                    <td style={{...styles.td,fontWeight:600}}>${Number(a.monto).toLocaleString("es-CL")}</td>
                    <td style={styles.td}>
                      <button onClick={()=>togglePago(a.id)} style={{...styles.badge,backgroundColor:a.pagado?"#D1FAE5":"#FEF3C7",color:a.pagado?"#065F46":"#92400E",border:"none",cursor:"pointer"}}>
                        {a.pagado ? "✓ Pagado" : "Pendiente"}
                      </button>
                    </td>
                    <td style={styles.td}><span style={{...styles.badge,...estadoColors[a.estado]}}>{a.estado}</span></td>
                    <td style={styles.td}><div style={styles.actions}><button style={styles.iconBtnBlue} onClick={()=>startEdit(a)}><Pencil size={14}/></button><button style={styles.iconBtnRed} onClick={()=>deleteRow(a.id)}><Trash2 size={14}/></button></div></td>
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
  statsRow:{display:"flex",gap:"16px",flexWrap:"wrap"},
  statCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"18px",display:"flex",alignItems:"center",gap:"14px",border:"1px solid #E2E8F0",flex:1,minWidth:"180px"},
  statIcon:{width:40,height:40,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  statVal:{fontSize:"20px",fontWeight:700,color:"#1E293B",margin:"0 0 2px 0"},
  statLab:{fontSize:"12px",color:"#94A3B8",margin:0},
  tableCard:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",overflow:"hidden"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",fontSize:"11px",fontWeight:600,color:"#94A3B8",padding:"12px 16px",borderBottom:"1px solid #E2E8F0",textTransform:"uppercase",letterSpacing:"0.05em",backgroundColor:"#F8FAFC"},
  td:{padding:"12px 16px",fontSize:"13px",color:"#334155",borderBottom:"1px solid #F1F5F9",verticalAlign:"middle"},
  badge:{padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:500},
  actions:{display:"flex",gap:"6px"},
  iconBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#64748B"},
  iconBtnBlue:{background:"#EBF2FB",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#4A6FA5"},
  iconBtnGreen:{background:"#D1FAE5",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#065F46"},
  iconBtnGray:{background:"#F1F5F9",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#64748B"},
  iconBtnRed:{background:"#FEE2E2",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#991B1B"},
  inlineInput:{width:"100%",padding:"5px 8px",border:"1px solid #CBD5E1",borderRadius:"4px",fontSize:"13px",boxSizing:"border-box"},
  modalOverlay:{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},
  modal:{backgroundColor:"#fff",borderRadius:"12px",padding:"24px",width:"100%",maxWidth:"560px",boxShadow:"0 20px 40px rgba(0,0,0,0.15)",maxHeight:"90vh",overflowY:"auto"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},
  modalTitle:{fontSize:"16px",fontWeight:700,color:"#1E293B",margin:0},
  modalFooter:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"20px"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  label:{display:"block",fontSize:"11px",fontWeight:600,color:"#64748B",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.04em"},
  input:{width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:"6px",fontSize:"13px",boxSizing:"border-box",backgroundColor:"#F8FAFC"},
  btnCancel:{padding:"8px 16px",backgroundColor:"transparent",border:"1px solid #E2E8F0",borderRadius:"6px",color:"#64748B",fontSize:"13px",cursor:"pointer"},
  btnSave:{padding:"8px 20px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
}   