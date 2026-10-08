import { useState } from "react"
import { DollarSign, TrendingUp, Wrench, Users, Search } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]

const datos = [
  { mes:"Ene", ingresos:1850000, arriendos:8 },
  { mes:"Feb", ingresos:2100000, arriendos:10 },
  { mes:"Mar", ingresos:1650000, arriendos:7 },
  { mes:"Abr", ingresos:2400000, arriendos:12 },
  { mes:"May", ingresos:2200000, arriendos:11 },
  { mes:"Jun", ingresos:1900000, arriendos:9 },
  { mes:"Jul", ingresos:2050000, arriendos:10 },
  { mes:"Ago", ingresos:2350000, arriendos:11 },
  { mes:"Sep", ingresos:1780000, arriendos:8 },
  { mes:"Oct", ingresos:1240000, arriendos:6 },
]

const topServicios = [
  { nombre:"Labranza agrícola", total:8500000, arriendos:12 },
  { nombre:"Movimiento de tierra", total:6200000, arriendos:9 },
  { nombre:"Cosecha", total:4800000, arriendos:4 },
  { nombre:"Carga y transporte", total:2250000, arriendos:6 },
]

const topMaquinas = [
  { nombre:"Tractor New Holland T6", total:7800000, arriendos:14 },
  { nombre:"Retroexcavadora CAT 320", total:6100000, arriendos:10 },
  { nombre:"Cosechadora John Deere S760", total:4800000, arriendos:4 },
  { nombre:"Minicargador Bobcat S570", total:3020000, arriendos:8 },
]

const registros = [
  { id:1, fecha:"2026-10-07", cliente:"Campo Verde SpA", maquina:"Cosechadora John Deere S760", servicio:"Cosecha", monto:2000000, pagado:false },
  { id:2, fecha:"2026-10-05", cliente:"Agro Sur Ltda.", maquina:"Tractor New Holland T6", servicio:"Labranza agrícola", monto:850000, pagado:false },
  { id:3, fecha:"2026-10-01", cliente:"Juan Pérez", maquina:"Retroexcavadora CAT 320", servicio:"Movimiento de tierra", monto:1200000, pagado:true },
  { id:4, fecha:"2026-09-28", cliente:"Pedro Soto", maquina:"Minicargador Bobcat S570", servicio:"Carga y transporte", monto:750000, pagado:true },
  { id:5, fecha:"2026-09-15", cliente:"Agro Sur Ltda.", maquina:"Tractor New Holland T6", servicio:"Labranza agrícola", monto:920000, pagado:true },
  { id:6, fecha:"2026-08-20", cliente:"Campo Verde SpA", maquina:"Tractor New Holland T6", servicio:"Labranza agrícola", monto:870000, pagado:true },
]

export default function VistaFacturacion() {
  const [busqueda, setBusqueda] = useState("")

  const totalAnual = datos.reduce((s,d)=>s+d.ingresos,0)
  const totalMes = datos[datos.length-1].ingresos
  const totalPendiente = registros.filter(r=>!r.pagado).reduce((s,r)=>s+r.monto,0)
  const totalClientes = [...new Set(registros.map(r=>r.cliente))].length

  const registrosFiltrados = registros.filter(r =>
    r.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.maquina.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.servicio.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div><h2 style={styles.title}>Facturación e Inteligencia de Negocio</h2><p style={styles.sub}>Resumen financiero del año 2026</p></div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {[
          { label:"Ingresos totales 2026", value:`$${totalAnual.toLocaleString("es-CL")}`, icon:DollarSign, bg:"#D1FAE5", color:"#065F46" },
          { label:"Ingresos este mes", value:`$${totalMes.toLocaleString("es-CL")}`, icon:TrendingUp, bg:"#DBEAFE", color:"#1D4ED8" },
          { label:"Por cobrar", value:`$${totalPendiente.toLocaleString("es-CL")}`, icon:DollarSign, bg:"#FEF3C7", color:"#92400E" },
          { label:"Clientes activos", value:totalClientes, icon:Users, bg:"#EDE9FE", color:"#7C3AED" },
        ].map(({label,value,icon:Icon,bg,color})=>(
          <div key={label} style={styles.kpiCard}>
            <div style={{...styles.kpiIcon,backgroundColor:bg}}><Icon size={18} color={color}/></div>
            <div><p style={styles.kpiVal}>{value}</p><p style={styles.kpiLab}>{label}</p></div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Ingresos mensuales 2026</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datos}>
              <XAxis dataKey="mes" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={v=>[`$${v.toLocaleString("es-CL")}`, "Ingresos"]} />
              <Bar dataKey="ingresos" fill="#4A6FA5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Arriendos por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datos}>
              <XAxis dataKey="mes" tick={{fontSize:11}} />
              <YAxis tick={{fontSize:11}} />
              <Tooltip formatter={v=>[v, "Arriendos"]} />
              <Line type="monotone" dataKey="arriendos" stroke="#4A6FA5" strokeWidth={2} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top servicios y máquinas */}
      <div style={styles.topRow}>
        <div style={styles.topCard}>
          <h3 style={styles.chartTitle}>Top servicios</h3>
          {topServicios.map((s,i)=>(
            <div key={s.nombre} style={styles.topItem}>
              <div style={styles.topRank}>#{i+1}</div>
              <div style={{flex:1}}>
                <div style={styles.topNombre}>{s.nombre}</div>
                <div style={styles.topBar2}>
                  <div style={{...styles.topBarFill, width:`${(s.total/topServicios[0].total)*100}%`, backgroundColor:"#4A6FA5"}} />
                </div>
              </div>
              <div style={styles.topMonto}>${(s.total/1000000).toFixed(1)}M</div>
            </div>
          ))}
        </div>
        <div style={styles.topCard}>
          <h3 style={styles.chartTitle}>Top maquinaria</h3>
          {topMaquinas.map((m,i)=>(
            <div key={m.nombre} style={styles.topItem}>
              <div style={styles.topRank}>#{i+1}</div>
              <div style={{flex:1}}>
                <div style={styles.topNombre}>{m.nombre}</div>
                <div style={styles.topBar2}>
                  <div style={{...styles.topBarFill, width:`${(m.total/topMaquinas[0].total)*100}%`, backgroundColor:"#1B2A4A"}} />
                </div>
              </div>
              <div style={styles.topMonto}>${(m.total/1000000).toFixed(1)}M</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla con búsqueda */}
      <div style={styles.tableCard}>
        <div style={styles.tableTopBar}>
          <h3 style={styles.chartTitle}>Detalle de transacciones</h3>
          <div style={styles.searchBox}>
            <Search size={14} color="#94A3B8" />
            <input style={styles.searchInput} placeholder="Buscar cliente, máquina o servicio..."
              value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
          </div>
        </div>
        <table style={styles.table}>
          <thead><tr>{["Fecha","Cliente","Máquina","Servicio","Monto","Estado"].map(h=><th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {registrosFiltrados.map((r,i)=>(
              <tr key={r.id} style={{backgroundColor:i%2===0?"#F8FAFC":"#fff"}}>
                <td style={styles.td}>{r.fecha}</td>
                <td style={styles.td}>{r.cliente}</td>
                <td style={{...styles.td,fontSize:"12px"}}>{r.maquina}</td>
                <td style={styles.td}>{r.servicio}</td>
                <td style={{...styles.td,fontWeight:600}}>${r.monto.toLocaleString("es-CL")}</td>
                <td style={styles.td}><span style={{padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:500,backgroundColor:r.pagado?"#D1FAE5":"#FEF3C7",color:r.pagado?"#065F46":"#92400E"}}>{r.pagado?"Pagado":"Pendiente"}</span></td>
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
  kpiGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"16px"},
  kpiCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"18px",display:"flex",alignItems:"center",gap:"14px",border:"1px solid #E2E8F0"},
  kpiIcon:{width:40,height:40,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  kpiVal:{fontSize:"20px",fontWeight:700,color:"#1E293B",margin:"0 0 2px 0"},
  kpiLab:{fontSize:"12px",color:"#94A3B8",margin:0},
  chartsRow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  chartCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"20px",border:"1px solid #E2E8F0"},
  chartTitle:{fontSize:"14px",fontWeight:600,color:"#1E293B",margin:"0 0 16px 0"},
  topRow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},
  topCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"20px",border:"1px solid #E2E8F0"},
  topItem:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"},
  topRank:{width:24,height:24,borderRadius:"50%",backgroundColor:"#EBF2FB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:700,color:"#4A6FA5",flexShrink:0},
  topNombre:{fontSize:"12px",fontWeight:500,color:"#334155",marginBottom:"4px"},
  topBar2:{height:6,backgroundColor:"#F1F5F9",borderRadius:"3px",overflow:"hidden"},
  topBarFill:{height:"100%",borderRadius:"3px",transition:"width 0.3s"},
  topMonto:{fontSize:"12px",fontWeight:700,color:"#1E293B",flexShrink:0},
  tableCard:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",overflow:"hidden"},
  tableTopBar:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 16px 0 16px"},
  searchBox:{display:"flex",alignItems:"center",gap:"8px",padding:"7px 12px",border:"1px solid #E2E8F0",borderRadius:"6px",backgroundColor:"#F8FAFC"},
  searchInput:{border:"none",background:"none",fontSize:"13px",outline:"none",width:"220px",color:"#334155"},
  table:{width:"100%",borderCollapse:"collapse",marginTop:"12px"},
  th:{textAlign:"left",fontSize:"11px",fontWeight:600,color:"#94A3B8",padding:"10px 16px",borderBottom:"1px solid #E2E8F0",textTransform:"uppercase",letterSpacing:"0.05em",backgroundColor:"#F8FAFC"},
  td:{padding:"11px 16px",fontSize:"13px",color:"#334155",borderBottom:"1px solid #F1F5F9"},
}