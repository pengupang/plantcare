import {
  Wrench,
  FileText,
  Users,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

const stats = [
  {
    label: "Máquinas disponibles",
    value: "8",
    icon: Wrench,
    color: "#4A6FA5",
    bg: "#EBF2FB",
    sub: "de 12 en total",
  },
  {
    label: "En arriendo",
    value: "3",
    icon: FileText,
    color: "#F59E0B",
    bg: "#FEF3C7",
    sub: "actualmente",
  },
  {
    label: "En mantención",
    value: "1",
    icon: AlertCircle,
    color: "#EF4444",
    bg: "#FEE2E2",
    sub: "fuera de servicio",
  },
  {
    label: "Arriendos del mes",
    value: "14",
    icon: CalendarCheck,
    color: "#10B981",
    bg: "#D1FAE5",
    sub: "octubre 2026",
  },
  {
    label: "Clientes activos",
    value: "27",
    icon: Users,
    color: "#8B5CF6",
    bg: "#EDE9FE",
    sub: "registrados",
  },
  {
    label: "Ingresos del mes",
    value: "$1.240.000",
    icon: TrendingUp,
    color: "#0EA5E9",
    bg: "#E0F2FE",
    sub: "CLP estimado",
  },
]

const arriendosRecientes = [
  { cliente: "Juan Pérez", maquina: "Retroexcavadora CAT 320", desde: "01/10/2026", hasta: "10/10/2026", estado: "Activo" },
  { cliente: "Agro Sur Ltda.", maquina: "Tractor New Holland T6", desde: "05/10/2026", hasta: "15/10/2026", estado: "Activo" },
  { cliente: "Pedro Soto", maquina: "Minicargador Bobcat S570", desde: "28/09/2026", hasta: "05/10/2026", estado: "Finalizado" },
  { cliente: "Campo Verde SpA", maquina: "Cosechadora John Deere", desde: "07/10/2026", hasta: "20/10/2026", estado: "Activo" },
]

export default function DashboardMaquinaria() {
  return (
    <div style={styles.container}>
      <p style={styles.fecha}>Miércoles, 7 de octubre de 2026</p>

      {/* Stats */}
      <div style={styles.grid}>
        {stats.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} style={styles.card}>
            <div style={{ ...styles.iconBox, backgroundColor: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={styles.statValue}>{value}</p>
              <p style={styles.statLabel}>{label}</p>
              <p style={styles.statSub}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arriendos recientes */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Arriendos recientes</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Cliente", "Máquina", "Desde", "Hasta", "Estado"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arriendosRecientes.map((a, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#ffffff" }}>
                <td style={styles.td}>{a.cliente}</td>
                <td style={styles.td}>{a.maquina}</td>
                <td style={styles.td}>{a.desde}</td>
                <td style={styles.td}>{a.hasta}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: a.estado === "Activo" ? "#D1FAE5" : "#F1F5F9",
                    color: a.estado === "Activo" ? "#065F46" : "#64748B",
                  }}>
                    {a.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  fecha: {
    fontSize: "13px",
    color: "#94A3B8",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1E293B",
    margin: "0 0 2px 0",
  },
  statLabel: {
    fontSize: "13px",
    color: "#475569",
    margin: "0 0 2px 0",
    fontWeight: 500,
  },
  statSub: {
    fontSize: "11px",
    color: "#94A3B8",
    margin: 0,
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  tableTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E293B",
    margin: "0 0 16px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: "#94A3B8",
    padding: "8px 12px",
    borderBottom: "1px solid #E2E8F0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  td: {
    padding: "10px 12px",
    fontSize: "13px",
    color: "#334155",
    borderBottom: "1px solid #F1F5F9",
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
}