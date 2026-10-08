import { useState } from "react"
import { Plus, X, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"

const categorias = ["Alimentación", "Veterinario", "Mantención", "Insumos", "Otros"]
const categoriasColors = {
  "Alimentación": "#3D6B4F",
  "Veterinario":  "#3B82F6",
  "Mantención":   "#F59E0B",
  "Insumos":      "#8B5CF6",
  "Otros":        "#94A3B8",
}

const initialGastos = [
  { id: 1, fecha: "2026-01-15", categoria: "Alimentación", descripcion: "Heno alfalfa x20 fardos", monto: 170000 },
  { id: 2, fecha: "2026-02-03", categoria: "Veterinario",  descripcion: "Control mensual Dr. Lagos", monto: 85000 },
  { id: 3, fecha: "2026-02-18", categoria: "Insumos",      descripcion: "Vitaminas y minerales", monto: 45000 },
  { id: 4, fecha: "2026-03-10", categoria: "Alimentación", descripcion: "Maíz molido x10 sacos", monto: 180000 },
  { id: 5, fecha: "2026-03-22", categoria: "Mantención",   descripcion: "Reparación corral", monto: 120000 },
  { id: 6, fecha: "2026-04-05", categoria: "Veterinario",  descripcion: "Inseminación artificial", monto: 95000 },
  { id: 7, fecha: "2026-04-20", categoria: "Alimentación", descripcion: "Heno + melaza", monto: 190000 },
  { id: 8, fecha: "2026-05-08", categoria: "Insumos",      descripcion: "Sal mineral x3 sacos", monto: 36000 },
  { id: 9, fecha: "2026-06-12", categoria: "Alimentación", descripcion: "Heno alfalfa x25 fardos", monto: 212500 },
  { id: 10, fecha: "2026-07-03", categoria: "Veterinario", descripcion: "Vacunación triple bovina", monto: 72000 },
  { id: 11, fecha: "2026-08-15", categoria: "Mantención",  descripcion: "Pintura galpón", monto: 65000 },
  { id: 12, fecha: "2026-09-20", categoria: "Alimentación", descripcion: "Concentrado proteico", monto: 225000 },
  { id: 13, fecha: "2026-10-01", categoria: "Veterinario", descripcion: "Control prenatal Vaca 04", monto: 55000 },
  { id: 14, fecha: "2026-10-05", categoria: "Insumos",     descripcion: "Vitamina ADE x2 litros", monto: 50000 },
]

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]

const emptyGasto = { fecha: "", categoria: categorias[0], descripcion: "", monto: 0 }

export default function VistaHistoricosGastos() {
  const [gastos, setGastos] = useState(initialGastos)
  const [showAdd, setShowAdd] = useState(false)
  const [newGasto, setNewGasto] = useState(emptyGasto)
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")

  const addGasto = () => {
    setGastos([...gastos, { ...newGasto, id: Date.now(), monto: Number(newGasto.monto) }])
    setNewGasto(emptyGasto)
    setShowAdd(false)
  }
  const deleteGasto = (id) => setGastos(gastos.filter(g => g.id !== id))

  // Stats
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
  const gastosMes = gastos.filter(g => g.fecha.startsWith("2026-10")).reduce((sum, g) => sum + g.monto, 0)
  const maxCategoria = Object.entries(
    gastos.reduce((acc, g) => { acc[g.categoria] = (acc[g.categoria] || 0) + g.monto; return acc }, {})
  ).sort((a, b) => b[1] - a[1])[0]

  // Datos por mes para gráfico de barras
  const datosMes = MESES.map((mes, i) => ({
    mes,
    total: gastos.filter(g => g.fecha.startsWith(`2026-${String(i+1).padStart(2,"0")}`))
                 .reduce((sum, g) => sum + g.monto, 0)
  })).filter(d => d.total > 0)

  // Datos por categoría para pie
  const datosCat = Object.entries(
    gastos.reduce((acc, g) => { acc[g.categoria] = (acc[g.categoria] || 0) + g.monto; return acc }, {})
  ).map(([name, value]) => ({ name, value }))

  const gastosFiltrados = filtroCategoria === "Todos"
    ? gastos
    : gastos.filter(g => g.categoria === filtroCategoria)

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Histórico de Gastos</h2>
          <p style={styles.sub}>{gastos.length} registros</p>
        </div>
        <button style={styles.btnAdd} onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Agregar gasto
        </button>
      </div>

      {/* Cards resumen */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#D1FAE5" }}>
            <DollarSign size={18} color="#3D6B4F" />
          </div>
          <div>
            <p style={styles.statValue}>${totalGastos.toLocaleString("es-CL")}</p>
            <p style={styles.statLabel}>Total histórico</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#DBEAFE" }}>
            <TrendingUp size={18} color="#3B82F6" />
          </div>
          <div>
            <p style={styles.statValue}>${gastosMes.toLocaleString("es-CL")}</p>
            <p style={styles.statLabel}>Gastos este mes</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#EDE9FE" }}>
            <ShoppingCart size={18} color="#8B5CF6" />
          </div>
          <div>
            <p style={styles.statValue}>{maxCategoria?.[0]}</p>
            <p style={styles.statLabel}>Mayor categoría</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: "#FEF3C7" }}>
            <TrendingDown size={18} color="#F59E0B" />
          </div>
          <div>
            <p style={styles.statValue}>${Math.round(totalGastos / gastos.length).toLocaleString("es-CL")}</p>
            <p style={styles.statLabel}>Gasto promedio</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Gastos por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datosMes}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString("es-CL")}`, "Total"]} />
              <Bar dataKey="total" fill="#3D6B4F" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Distribución por categoría</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={datosCat} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                {datosCat.map(entry => (
                  <Cell key={entry.name} fill={categoriasColors[entry.name] || "#94A3B8"} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={v => [`$${v.toLocaleString("es-CL")}`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div style={styles.tableCard}>
        <div style={styles.tableTopBar}>
          <h3 style={styles.tableTitle}>Detalle de gastos</h3>
          <div style={styles.filtros}>
            {["Todos", ...categorias].map(c => (
              <button key={c} onClick={() => setFiltroCategoria(c)}
                style={{ ...styles.filtroBadge, backgroundColor: filtroCategoria === c ? "#1E3128" : "#F1F5F9", color: filtroCategoria === c ? "#fff" : "#64748B" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Fecha", "Categoría", "Descripción", "Monto", ""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...gastosFiltrados].sort((a,b) => b.fecha.localeCompare(a.fecha)).map((g, i) => (
              <tr key={g.id} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#ffffff" }}>
                <td style={styles.td}>{g.fecha}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.catBadge, backgroundColor: categoriasColors[g.categoria] + "20", color: categoriasColors[g.categoria] }}>
                    {g.categoria}
                  </span>
                </td>
                <td style={styles.td}>{g.descripcion}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>${Number(g.monto).toLocaleString("es-CL")}</td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => deleteGasto(g.id)}><X size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAdd && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nuevo gasto</h3>
              <button style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Fecha</label>
                <input style={styles.input} type="date" value={newGasto.fecha}
                  onChange={e => setNewGasto({ ...newGasto, fecha: e.target.value })} />
              </div>
              <div>
                <label style={styles.label}>Categoría</label>
                <select style={styles.input} value={newGasto.categoria}
                  onChange={e => setNewGasto({ ...newGasto, categoria: e.target.value })}>
                  {categorias.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={styles.label}>Descripción</label>
                <input style={styles.input} value={newGasto.descripcion}
                  onChange={e => setNewGasto({ ...newGasto, descripcion: e.target.value })} />
              </div>
              <div>
                <label style={styles.label}>Monto (CLP)</label>
                <input style={styles.input} type="number" value={newGasto.monto}
                  onChange={e => setNewGasto({ ...newGasto, monto: e.target.value })} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnCancel} onClick={() => setShowAdd(false)}>Cancelar</button>
              <button style={styles.btnSave} onClick={addGasto}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "20px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "18px", fontWeight: 700, color: "#1E293B", margin: 0 },
  sub: { fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" },
  btnAdd: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#3D6B4F", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  statCard: { backgroundColor: "#fff", borderRadius: "10px", padding: "18px", display: "flex", alignItems: "center", gap: "14px", border: "1px solid #D1E8DA" },
  statIcon: { width: 40, height: 40, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statValue: { fontSize: "20px", fontWeight: 700, color: "#1E293B", margin: "0 0 2px 0" },
  statLabel: { fontSize: "12px", color: "#94A3B8", margin: 0 },
  chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  chartCard: { backgroundColor: "#fff", borderRadius: "10px", padding: "20px", border: "1px solid #D1E8DA" },
  chartTitle: { fontSize: "14px", fontWeight: 600, color: "#1E293B", margin: "0 0 16px 0" },
  tableCard: { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #D1E8DA", overflow: "hidden" },
  tableTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 0 16px", flexWrap: "wrap", gap: "10px" },
  tableTitle: { fontSize: "14px", fontWeight: 600, color: "#1E293B", margin: 0 },
  filtros: { display: "flex", gap: "6px", flexWrap: "wrap" },
  filtroBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "12px" },
  th: { textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#94A3B8", padding: "10px 16px", borderBottom: "1px solid #E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "#F8FAFC" },
  td: { padding: "11px 16px", fontSize: "13px", color: "#334155", borderBottom: "1px solid #F1F5F9" },
  catBadge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 },
  deleteBtn: { background: "#FEE2E2", border: "none", borderRadius: "4px", padding: "5px", cursor: "pointer", color: "#991B1B" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { fontSize: "16px", fontWeight: 700, color: "#1E293B", margin: 0 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { display: "block", fontSize: "11px", fontWeight: 600, color: "#64748B", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", backgroundColor: "#F8FAFC" },
  btnCancel: { padding: "8px 16px", backgroundColor: "transparent", border: "1px solid #E2E8F0", borderRadius: "6px", color: "#64748B", fontSize: "13px", cursor: "pointer" },
  btnSave: { padding: "8px 20px", backgroundColor: "#3D6B4F", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#64748B" },
}