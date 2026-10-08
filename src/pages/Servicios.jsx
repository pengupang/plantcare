import { useState } from "react"
import { Pencil, Trash2, Plus, X, Check, Wrench } from "lucide-react"

const maquinasDisponibles = ["Retroexcavadora CAT 320","Tractor New Holland T6","Minicargador Bobcat S570","Cosechadora John Deere S760"]

const initialData = [
  { id:1, nombre:"Movimiento de tierra", descripcion:"Excavación y nivelación de terrenos agrícolas e industriales", maquinas:["Retroexcavadora CAT 320","Minicargador Bobcat S570"], nota:"Precio según volumen de trabajo" },
  { id:2, nombre:"Labranza agrícola", descripcion:"Preparación de suelo para siembra, arado y rastraje", maquinas:["Tractor New Holland T6"], nota:"Precio por hectárea acordado con cliente" },
  { id:3, nombre:"Cosecha", descripcion:"Cosecha mecanizada de cultivos de grano", maquinas:["Cosechadora John Deere S760"], nota:"Disponible temporada marzo-mayo" },
  { id:4, nombre:"Carga y transporte interno", descripcion:"Movimiento de materiales dentro del predio", maquinas:["Minicargador Bobcat S570"], nota:"" },
]

const emptyRow = { nombre:"", descripcion:"", maquinas:[], nota:"" }

export default function VistaServicios() {
  const [servicios, setServicios] = useState(initialData)
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(emptyRow)

  const startEdit = (s) => { setEditId(s.id); setEditData({...s}) }
  const cancelEdit = () => { setEditId(null); setEditData({}) }
  const saveEdit = () => { setServicios(servicios.map(s => s.id===editId ? editData : s)); cancelEdit() }
  const deleteRow = (id) => setServicios(servicios.filter(s => s.id!==id))
  const addRow = () => { setServicios([...servicios,{...newRow,id:Date.now()}]); setNewRow(emptyRow); setShowAdd(false) }

  const toggleMaquina = (maquina, data, setData) => {
    const curr = data.maquinas || []
    setData({...data, maquinas: curr.includes(maquina) ? curr.filter(m=>m!==maquina) : [...curr, maquina]})
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Tipos de Servicio</h2>
          <p style={styles.sub}>{servicios.length} servicios disponibles</p>
        </div>
        <button style={styles.btnAdd} onClick={()=>setShowAdd(true)}><Plus size={15}/> Agregar servicio</button>
      </div>

      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h3 style={styles.modalTitle}>Nuevo servicio</h3><button style={styles.iconBtn} onClick={()=>setShowAdd(false)}><X size={16}/></button></div>
            <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              <div><label style={styles.label}>Nombre del servicio</label><input style={styles.input} value={newRow.nombre} onChange={e=>setNewRow({...newRow,nombre:e.target.value})} /></div>
              <div><label style={styles.label}>Descripción</label><textarea style={{...styles.input,height:"70px",resize:"vertical"}} value={newRow.descripcion} onChange={e=>setNewRow({...newRow,descripcion:e.target.value})} /></div>
              <div>
                <label style={styles.label}>Maquinaria que puede realizar este servicio</label>
                <div style={styles.checkList}>
                  {maquinasDisponibles.map(m=>(
                    <label key={m} style={styles.checkItem}>
                      <input type="checkbox" checked={newRow.maquinas.includes(m)} onChange={()=>toggleMaquina(m,newRow,setNewRow)} />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              <div><label style={styles.label}>Nota de tarifa</label><input style={styles.input} value={newRow.nota} onChange={e=>setNewRow({...newRow,nota:e.target.value})} placeholder="Ej: precio según acuerdo con cliente" /></div>
            </div>
            <div style={styles.modalFooter}><button style={styles.btnCancel} onClick={()=>setShowAdd(false)}>Cancelar</button><button style={styles.btnSave} onClick={addRow}>Guardar</button></div>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {servicios.map(s => (
          <div key={s.id} style={styles.card}>
            {editId===s.id ? (
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                <input style={styles.inlineInput} value={editData.nombre} onChange={e=>setEditData({...editData,nombre:e.target.value})} />
                <textarea style={{...styles.inlineInput,height:"60px",resize:"vertical"}} value={editData.descripcion} onChange={e=>setEditData({...editData,descripcion:e.target.value})} />
                <div style={styles.checkList}>
                  {maquinasDisponibles.map(m=>(
                    <label key={m} style={styles.checkItem}>
                      <input type="checkbox" checked={editData.maquinas?.includes(m)} onChange={()=>toggleMaquina(m,editData,setEditData)} />{m}
                    </label>
                  ))}
                </div>
                <input style={styles.inlineInput} value={editData.nota} onChange={e=>setEditData({...editData,nota:e.target.value})} placeholder="Nota tarifa" />
                <div style={styles.actions}><button style={styles.iconBtnGreen} onClick={saveEdit}><Check size={14}/></button><button style={styles.iconBtnGray} onClick={cancelEdit}><X size={14}/></button></div>
              </div>
            ) : (
              <>
                <div style={styles.cardHeader}>
                  <div style={styles.cardIcon}><Wrench size={16} color="#4A6FA5"/></div>
                  <div style={styles.cardActions}>
                    <button style={styles.iconBtnBlue} onClick={()=>startEdit(s)}><Pencil size={13}/></button>
                    <button style={styles.iconBtnRed} onClick={()=>deleteRow(s.id)}><Trash2 size={13}/></button>
                  </div>
                </div>
                <h3 style={styles.cardTitle}>{s.nombre}</h3>
                <p style={styles.cardDesc}>{s.descripcion}</p>
                <div style={styles.maquinasList}>
                  {s.maquinas.map(m=><span key={m} style={styles.maquinaBadge}>{m}</span>)}
                </div>
                {s.nota && <p style={styles.cardNota}>💡 {s.nota}</p>}
              </>
            )}
          </div>
        ))}
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
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px"},
  card:{backgroundColor:"#fff",borderRadius:"10px",padding:"20px",border:"1px solid #E2E8F0"},
  cardHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"},
  cardIcon:{width:36,height:36,borderRadius:"8px",backgroundColor:"#EBF2FB",display:"flex",alignItems:"center",justifyContent:"center"},
  cardActions:{display:"flex",gap:"6px"},
  cardTitle:{fontSize:"15px",fontWeight:700,color:"#1E293B",margin:"0 0 8px 0"},
  cardDesc:{fontSize:"13px",color:"#64748B",lineHeight:1.5,margin:"0 0 12px 0"},
  maquinasList:{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"10px"},
  maquinaBadge:{padding:"3px 8px",borderRadius:"4px",fontSize:"11px",backgroundColor:"#EBF2FB",color:"#4A6FA5",fontWeight:500},
  cardNota:{fontSize:"12px",color:"#94A3B8",margin:0,fontStyle:"italic"},
  actions:{display:"flex",gap:"6px"},
  iconBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#64748B"},
  iconBtnBlue:{background:"#EBF2FB",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#4A6FA5"},
  iconBtnGreen:{background:"#D1FAE5",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#065F46"},
  iconBtnGray:{background:"#F1F5F9",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#64748B"},
  iconBtnRed:{background:"#FEE2E2",border:"none",cursor:"pointer",padding:"6px",borderRadius:"4px",color:"#991B1B"},
  inlineInput:{width:"100%",padding:"6px 8px",border:"1px solid #CBD5E1",borderRadius:"4px",fontSize:"13px",boxSizing:"border-box"},
  checkList:{display:"flex",flexDirection:"column",gap:"8px",padding:"8px",backgroundColor:"#F8FAFC",borderRadius:"6px",border:"1px solid #E2E8F0"},
  checkItem:{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#334155",cursor:"pointer"},
  modalOverlay:{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},
  modal:{backgroundColor:"#fff",borderRadius:"12px",padding:"24px",width:"100%",maxWidth:"500px",boxShadow:"0 20px 40px rgba(0,0,0,0.15)"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},
  modalTitle:{fontSize:"16px",fontWeight:700,color:"#1E293B",margin:0},
  modalFooter:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"20px"},
  label:{display:"block",fontSize:"11px",fontWeight:600,color:"#64748B",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.04em"},
  input:{width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:"6px",fontSize:"13px",boxSizing:"border-box",backgroundColor:"#F8FAFC"},
  btnCancel:{padding:"8px 16px",backgroundColor:"transparent",border:"1px solid #E2E8F0",borderRadius:"6px",color:"#64748B",fontSize:"13px",cursor:"pointer"},
  btnSave:{padding:"8px 20px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
}