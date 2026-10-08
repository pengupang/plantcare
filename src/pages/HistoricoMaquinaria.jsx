import { useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]

const datos2024 = [1200000,1450000,1100000,1800000,1650000,1400000,1550000,1700000,1300000,1450000,1600000,1900000]
const datos2025 = [1550000,1800000,1400000,2100000,1950000,1700000,1850000,2050000,1600000,1750000,1900000,2200000]
const datos2026 = [1850000,2100000,1650000,2400000,2200000,1900000,2050000,2350000,1780000,1240000,0,0]

const [anioA, setAnioA] = [2026, () => {}]
const [anioB, setAnioB] = [2025, () => {}]

const datosMap = { 2024: datos2024, 2025: datos2025, 2026: datos2026 }

const dataComparativa = MESES.map((mes, i) => ({
  mes,
  "2024": datos2024[i],
  "2025": datos2025[i],
  "2026": datos2026[i],
})).filter(d => d["2026"] > 0 || d["2025"] > 0)

const totalAnio = (datos) => datos.filter(v=>v>0).reduce((s,v)=>s+v,0)
const promedioAnio = (datos) => { const f = datos.filter(v=>v>0); return f.reduce((s,v)=>s+v,0)/f.length }

const diff = (actual, anterior) => {
  if (!anterior) return null
  return ((actual - anterior) / anterior * 100).toFixed(1)
}

export default function VistaHistoricosMaquinaria() {
  const [anio1, setAnio1] = useState(2026)
  const [anio2, setAnio2] = useState(2025)

  const total1 = totalAnio(datosMap[anio1])
  const total2 = totalAnio(datosMap[anio2])
  const prom1  = promedioAnio(datosMap[anio1])
  const prom2  = promedioAnio(datosMap[anio2])
  const diffTotal = diff(total1, total2)
  const diffProm  = diff(prom1, prom2)

  const DiffBadge = ({ val }) => {
    if (val === null) return null
    const n = parseFloat(val)
    const up = n > 0
    const eq = n === 0
    return (
      <span style={{display:"inline-flex",alignItems:"center",gap:"3px",padding:"2px 8px",borderRadius:"20px",fontSize:"12px",fontWeight:600,
        backgroundColor: eq?"#F1F5F9":up?"#D1FAE5":"#FEE2E2",
        color: eq?"#64748B":up?"#065F46":"#991B1B"}}>
        {eq ? <Minus size={11}/> : up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
        {up?"+":""}{val}%
      </span>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div><h2 style={styles.title}>Datos Históricos</h2><p style={styles.sub}>Comparativa entre años</p></div>
        <div style={styles.anioSelector}>
          <span style={styles.anioLabel}>Comparar:</span>
          <select style={styles.select} value={anio1} onChange={e=>setAnio1(Number(e.target.value))}>
            {[2024,2025,2026].map(a=><option key={a}>{a}</option>)}
          </select>
          <span style={styles.anioLabel}>vs</span>
          <select style={styles.select} value={anio2} onChange={e=>setAnio2(Number(e.target.value))}>
            {[2024,2025,2026].map(a=><option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Cards comparativas */}
      <div style={styles.cardsRow}>
        <div style={styles.compCard}>
          <p style={styles.compLabel}>Ingresos totales</p>
          <div style={styles.compValues}>
            <div><span style={styles.compAnio}>{anio1}</span><span style={styles.compVal}>${(total1/1000000).toFixed(2)}M</span></div>
            <div style={styles.compDivider}/>
            <div><span style={styles.compAnio}>{anio2}</span><span style={styles.compVal}>${(total2/1000000).toFixed(2)}M</span></div>
          </div>
          <DiffBadge val={diffTotal} />
        </div>
        <div style={styles.compCard}>
          <p style={styles.compLabel}>Promedio mensual</p>
          <div style={styles.compValues}>
            <div><span style={styles.compAnio}>{anio1}</span><span style={styles.compVal}>${Math.round(prom1).toLocaleString("es-CL")}</span></div>
            <div style={styles.compDivider}/>
            <div><span style={styles.compAnio}>{anio2}</span><span style={styles.compVal}>${Math.round(prom2).toLocaleString("es-CL")}</span></div>
          </div>
          <DiffBadge val={diffProm} />
        </div>
        <div style={styles.compCard}>
          <p style={styles.compLabel}>Mejor mes {anio1}</p>
          <span style={styles.compVal}>{MESES[datosMap[anio1].indexOf(Math.max(...datosMap[anio1]))]}</span>
          <p style={styles.compSub}>${Math.max(...datosMap[anio1]).toLocaleString("es-CL")}</p>
        </div>
        <div style={styles.compCard}>
          <p style={styles.compLabel}>Crecimiento {anio1} vs {anio2}</p>
          <DiffBadge val={diffTotal} />
          <p style={styles.compSub}>{parseFloat(diffTotal)>0?"Mejor que año anterior":"Por debajo del año anterior"}</p>
        </div>
      </div>

      {/* Gráfico comparativo */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Ingresos mensuales — {anio1} vs {anio2}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataComparativa} barGap={4}>
            <XAxis dataKey="mes" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`$${(v/1000000).toFixed(1)}M`} />
            <Tooltip formatter={v=>[`$${v.toLocaleString("es-CL")}`]} />
            <Legend wrapperStyle={{fontSize:12}} />
            <Bar dataKey={String(anio1)} fill="#1B2A4A" radius={[3,3,0,0]} />
            <Bar dataKey={String(anio2)} fill="#7BA7D4" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla detalle por mes */}
      <div style={styles.tableCard}>
        <h3 style={styles.chartTitle}>Detalle mensual</h3>
        <table style={styles.table}>
          <thead><tr>
            <th style={styles.th}>Mes</th>
            <th style={styles.th}>{anio1}</th>
            <th style={styles.th}>{anio2}</th>
            <th style={styles.th}>Variación</th>
          </tr></thead>
          <tbody>
            {MESES.map((mes,i)=>{
              const v1 = datosMap[anio1][i]
              const v2 = datosMap[anio2][i]
              if (!v1 && !v2) return null
              const d = v1 && v2 ? diff(v1,v2) : null
              const dn = d ? parseFloat(d) : null
              return (
                <tr key={mes} style={{backgroundColor:i%2===0?"#F8FAFC":"#fff"}}>
                  <td style={styles.td}>{mes}</td>
                  <td style={{...styles.td,fontWeight:600}}>{v1 ? `$${v1.toLocaleString("es-CL")}` : "—"}</td>
                  <td style={styles.td}>{v2 ? `$${v2.toLocaleString("es-CL")}` : "—"}</td>
                  <td style={styles.td}>
                    {d && <span style={{color:dn>0?"#065F46":dn<0?"#991B1B":"#64748B",fontWeight:600,fontSize:"12px"}}>
                      {dn>0?"+":""}{d}%
                    </span>}
                  </td>
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
  container:{display:"flex",flexDirection:"column",gap:"20px"},
  topBar:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"},
  title:{fontSize:"18px",fontWeight:700,color:"#1E293B",margin:0},
  sub:{fontSize:"13px",color:"#94A3B8",margin:"4px 0 0 0"},
  anioSelector:{display:"flex",alignItems:"center",gap:"8px"},
  anioLabel:{fontSize:"13px",color:"#64748B"},
  select:{padding:"6px 10px",border:"1px solid #E2E8F0",borderRadius:"6px",fontSize:"13px",backgroundColor:"#F8FAFC",cursor:"pointer"},
  cardsRow:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"16px"},
  compCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"18px",border:"1px solid #E2E8F0",display:"flex",flexDirection:"column",gap:"10px"},
  compLabel:{fontSize:"12px",color:"#94A3B8",margin:0,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"},
  compValues:{display:"flex",gap:"16px",alignItems:"center"},
  compAnio:{display:"block",fontSize:"11px",color:"#94A3B8"},
  compVal:{display:"block",fontSize:"18px",fontWeight:700,color:"#1E293B"},
  compDivider:{width:1,height:36,backgroundColor:"#E2E8F0"},
  compSub:{fontSize:"11px",color:"#94A3B8",margin:0},
  chartCard:{backgroundColor:"#fff",borderRadius:"10px",padding:"20px",border:"1px solid #E2E8F0"},
  chartTitle:{fontSize:"14px",fontWeight:600,color:"#1E293B",margin:"0 0 16px 0"},
  tableCard:{backgroundColor:"#fff",borderRadius:"10px",border:"1px solid #E2E8F0",overflow:"hidden",padding:"20px"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",fontSize:"11px",fontWeight:600,color:"#94A3B8",padding:"10px 16px",borderBottom:"1px solid #E2E8F0",textTransform:"uppercase",letterSpacing:"0.05em",backgroundColor:"#F8FAFC"},
  td:{padding:"10px 16px",fontSize:"13px",color:"#334155",borderBottom:"1px solid #F1F5F9"},
}