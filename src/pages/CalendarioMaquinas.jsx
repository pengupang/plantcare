import { useState } from "react"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"

const clientes = ["Juan Pérez","Agro Sur Ltda.","Campo Verde SpA","Pedro Soto"]
const maquinas = ["Retroexcavadora CAT 320","Tractor New Holland T6","Minicargador Bobcat S570","Cosechadora John Deere S760"]

const maquinaColors = {
  "Retroexcavadora CAT 320":   { color:"#1D4ED8", bg:"#DBEAFE" },
  "Tractor New Holland T6":    { color:"#065F46", bg:"#D1FAE5" },
  "Minicargador Bobcat S570":  { color:"#7C3AED", bg:"#EDE9FE" },
  "Cosechadora John Deere S760":{ color:"#B45309", bg:"#FEF3C7" },
}

const today = new Date()

const initialArriendos = [
  { id:1, cliente:"Juan Pérez", maquina:"Retroexcavadora CAT 320", inicio:new Date(today.getFullYear(),today.getMonth(),1), fin:new Date(today.getFullYear(),today.getMonth(),10) },
  { id:2, cliente:"Agro Sur Ltda.", maquina:"Tractor New Holland T6", inicio:new Date(today.getFullYear(),today.getMonth(),5), fin:new Date(today.getFullYear(),today.getMonth(),15) },
  { id:3, cliente:"Campo Verde SpA", maquina:"Cosechadora John Deere S760", inicio:new Date(today.getFullYear(),today.getMonth(),7), fin:new Date(today.getFullYear(),today.getMonth(),20) },
  { id:4, cliente:"Pedro Soto", maquina:"Minicargador Bobcat S570", inicio:new Date(today.getFullYear(),today.getMonth(),18), fin:new Date(today.getFullYear(),today.getMonth(),25) },
]

const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"]
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

const emptyArriendo = { cliente:clientes[0], maquina:maquinas[0], inicio:"", fin:"" }

export default function VistaCalendarioArriendo() {
  const [arriendos, setArriendos] = useState(initialArriendos)
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(),today.getMonth(),1))
  const [showAdd, setShowAdd] = useState(false)
  const [newA, setNewA] = useState(emptyArriendo)
  const [selectedDay, setSelectedDay] = useState(null)

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1))
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1))

  const daysInMonth = new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate()
  const firstDay = new Date(viewDate.getFullYear(),viewDate.getMonth(),1).getDay()

  const getArriendosDia = (day) => {
    const d = new Date(viewDate.getFullYear(),viewDate.getMonth(),day)
    return arriendos.filter(a => d >= a.inicio && d <= a.fin)
  }

  const addArriendo = () => {
    const [yi,mi,di] = newA.inicio.split("-").map(Number)
    const [yf,mf,df] = newA.fin.split("-").map(Number)
    setArriendos([...arriendos,{...newA,id:Date.now(),inicio:new Date(yi,mi-1,di),fin:new Date(yf,mf-1,df)}])
    setNewA(emptyArriendo); setShowAdd(false)
  }

  const arriendosDiaSeleccionado = selectedDay ? getArriendosDia(selectedDay) : []

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div><h2 style={styles.title}>Calendario de Arriendos</h2><p style={styles.sub}>{arriendos.length} arriendos activos</p></div>
        <button style={styles.btnAdd} onClick={()=>setShowAdd(true)}><Plus size={15}/> Nuevo arriendo</button>
      </div>

      {/* Leyenda */}
      <div style={styles.leyenda}>
        {Object.entries(maquinaColors).map(([maq,{color,bg}])=>(
          <span key={maq} style={{...styles.leyendaItem,backgroundColor:bg,color}}><span style={{...styles.dot,backgroundColor:color}}/>{maq}</span>
        ))}
      </div>

      <div style={styles.calLayout}>
        <div style={styles.calCard}>
          <div style={styles.calHeader}>
            <button style={styles.navBtn} onClick={prevMonth}><ChevronLeft size={16}/></button>
            <span style={styles.mesLabel}>{MESES[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button style={styles.navBtn} onClick={nextMonth}><ChevronRight size={16}/></button>
          </div>
          <div style={styles.diasSemana}>{DIAS.map(d=><div key={d} style={styles.diaSemana}>{d}</div>)}</div>
          <div style={styles.grid}>
            {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day = i+1
              const evs = getArriendosDia(day)
              const isToday = today.getDate()===day && today.getMonth()===viewDate.getMonth() && today.getFullYear()===viewDate.getFullYear()
              const isSelected = selectedDay===day
              return (
                <div key={day} style={{...styles.dayCell,backgroundColor:isSelected?"#1B2A4A":isToday?"#EBF2FB":"#fff",border:isToday?"1px solid #4A6FA5":"1px solid #F1F5F9"}}
                  onClick={()=>setSelectedDay(day)}>
                  <span style={{...styles.dayNum,color:isSelected?"#fff":isToday?"#4A6FA5":"#334155",fontWeight:isToday?700:400}}>{day}</span>
                  <div style={styles.eventDots}>
                    {evs.slice(0,3).map(e=><span key={e.id} style={{...styles.eventDot,backgroundColor:maquinaColors[e.maquina]?.color}}/>)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={styles.sidePanel}>
          <h3 style={styles.sidePanelTitle}>{selectedDay ? `${selectedDay} de ${MESES[viewDate.getMonth()]}` : "Arriendos activos"}</h3>
          {(selectedDay ? arriendosDiaSeleccionado : arriendos).length === 0
            ? <p style={styles.noEventos}>Sin arriendos</p>
            : (selectedDay ? arriendosDiaSeleccionado : arriendos).map(a=>(
              <div key={a.id} style={styles.eventoCard}>
                <div style={{...styles.maqBadge,backgroundColor:maquinaColors[a.maquina]?.bg,color:maquinaColors[a.maquina]?.color}}>{a.maquina}</div>
                <p style={styles.clienteLabel}>{a.cliente}</p>
                <p style={styles.fechaLabel}>{a.inicio.toLocaleDateString("es-CL")} → {a.fin.toLocaleDateString("es-CL")}</p>
              </div>
            ))
          }
        </div>
      </div>

      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}><h3 style={styles.modalTitle}>Nuevo arriendo</h3><button style={styles.iconBtn} onClick={()=>setShowAdd(false)}><X size={16}/></button></div>
            <div style={styles.formGrid}>
              <div><label style={styles.label}>Cliente</label><select style={styles.input} value={newA.cliente} onChange={e=>setNewA({...newA,cliente:e.target.value})}>{clientes.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label style={styles.label}>Máquina</label><select style={styles.input} value={newA.maquina} onChange={e=>setNewA({...newA,maquina:e.target.value})}>{maquinas.map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label style={styles.label}>Fecha inicio</label><input style={styles.input} type="date" value={newA.inicio} onChange={e=>setNewA({...newA,inicio:e.target.value})} /></div>
              <div><label style={styles.label}>Fecha fin</label><input style={styles.input} type="date" value={newA.fin} onChange={e=>setNewA({...newA,fin:e.target.value})} /></div>
            </div>
            <div style={styles.modalFooter}><button style={styles.btnCancel} onClick={()=>setShowAdd(false)}>Cancelar</button><button style={styles.btnSave} onClick={addArriendo}>Guardar</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container:{display:"flex",flexDirection:"column",gap:"20px"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},
  title:{fontSize:"18px",fontWeight:700,color:"#1E293B",margin:0},
  sub:{fontSize:"13px",color:"#94A3B8",margin:"4px 0 0 0"},
  btnAdd:{display:"flex",alignItems:"center",gap:"6px",padding:"8px 16px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
  leyenda:{display:"flex",gap:"10px",flexWrap:"wrap"},
  leyendaItem:{display:"flex",alignItems:"center",gap:"6px",padding:"4px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500},
  dot:{width:8,height:8,borderRadius:"50%",flexShrink:0},
  calLayout:{display:"flex",gap:"16px",alignItems:"flex-start"},
  calCard:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",padding:"20px",flex:1},
  calHeader:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"},
  mesLabel:{fontSize:"15px",fontWeight:700,color:"#1E293B"},
  navBtn:{background:"none",border:"1px solid #E2E8F0",borderRadius:"6px",padding:"4px 8px",cursor:"pointer",color:"#64748B"},
  diasSemana:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:"4px"},
  diaSemana:{textAlign:"center",fontSize:"11px",fontWeight:600,color:"#94A3B8",padding:"6px 0"},
  grid:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px"},
  dayCell:{borderRadius:"6px",padding:"6px 4px",minHeight:"52px",cursor:"pointer",transition:"background 0.15s"},
  dayNum:{fontSize:"13px",display:"block",textAlign:"center"},
  eventDots:{display:"flex",justifyContent:"center",gap:"2px",marginTop:"4px"},
  eventDot:{width:6,height:6,borderRadius:"50%"},
  sidePanel:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",padding:"20px",width:"240px",flexShrink:0},
  sidePanelTitle:{fontSize:"14px",fontWeight:700,color:"#1E293B",margin:"0 0 16px 0"},
  noEventos:{fontSize:"13px",color:"#94A3B8"},
  eventoCard:{backgroundColor:"#F8FAFC",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px",border:"1px solid #F1F5F9"},
  maqBadge:{display:"inline-block",padding:"2px 8px",borderRadius:"20px",fontSize:"10px",fontWeight:600,marginBottom:"6px"},
  clienteLabel:{fontSize:"13px",fontWeight:600,color:"#1E293B",margin:"0 0 4px 0"},
  fechaLabel:{fontSize:"11px",color:"#94A3B8",margin:0},
  modalOverlay:{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},
  modal:{backgroundColor:"#fff",borderRadius:"12px",padding:"24px",width:"100%",maxWidth:"440px",boxShadow:"0 20px 40px rgba(0,0,0,0.15)"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"},
  modalTitle:{fontSize:"16px",fontWeight:700,color:"#1E293B",margin:0},
  modalFooter:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"20px"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  label:{display:"block",fontSize:"11px",fontWeight:600,color:"#64748B",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.04em"},
  input:{width:"100%",padding:"9px 12px",border:"1px solid #E2E8F0",borderRadius:"6px",fontSize:"13px",boxSizing:"border-box",backgroundColor:"#F8FAFC"},
  btnCancel:{padding:"8px 16px",backgroundColor:"transparent",border:"1px solid #E2E8F0",borderRadius:"6px",color:"#64748B",fontSize:"13px",cursor:"pointer"},
  btnSave:{padding:"8px 20px",backgroundColor:"#4A6FA5",border:"none",borderRadius:"6px",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"},
  iconBtn:{background:"none",border:"none",cursor:"pointer",padding:"4px",color:"#64748B"},
}