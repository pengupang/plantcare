import {
  Leaf,
  AlertTriangle,
  Package,
  Thermometer,
  Droplets,
} from "lucide-react"

const stats = [
  {
    label: "Animales registrados",
    value: "48",
    icon: Leaf,
    color: "#3D6B4F",
    bg: "#D1FAE5",
    sub: "en el sistema",
  },
  {
    label: "Productos en stock",
    value: "23",
    icon: Package,
    color: "#0EA5E9",
    bg: "#E0F2FE",
    sub: "ítems en inventario",
  },
  {
    label: "Alertas de stock bajo",
    value: "3",
    icon: AlertTriangle,
    color: "#EF4444",
    bg: "#FEE2E2",
    sub: "requieren atención",
  },
  {
    label: "Última medición suelo",
    value: "Hoy",
    icon: Leaf,
    color: "#10B981",
    bg: "#D1FAE5",
    sub: "PlantCare activo",
  },
]

const alertasStock = [
  { producto: "Heno de alfalfa", stock: 2, minimo: 5, unidad: "fardos" },
  { producto: "Sal mineral", stock: 1, minimo: 3, unidad: "sacos" },
  { producto: "Vitamina ADE", stock: 0, minimo: 2, unidad: "litros" },
]

const ultimasMediciones = [
  { parametro: "Humedad suelo", valor: "38.4 %", icono: Droplets, color: "#0EA5E9" },
  { parametro: "Temperatura suelo", valor: "14.2 °C", icono: Thermometer, color: "#F59E0B" },
  { parametro: "pH", valor: "6.8", icono: Leaf, color: "#10B981" },
  { parametro: "Nitrógeno (N)", valor: "142 mg/kg", icono: Leaf, color: "#8B5CF6" },
  { parametro: "Fósforo (P)", valor: "89 mg/kg", icono: Leaf, color: "#EC4899" },
  { parametro: "Potasio (K)", valor: "210 mg/kg", icono: Leaf, color: "#F59E0B" },
]

export default function DashboardLecheria() {
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

      <div style={styles.row}>
        {/* Alertas stock bajo */}
        <div style={{ ...styles.tableCard, flex: 1 }}>
          <div style={styles.tableHeader}>
            <AlertTriangle size={16} color="#EF4444" />
            <h3 style={{ ...styles.tableTitle, color: "#EF4444" }}>Alertas de stock bajo</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Producto", "Stock actual", "Mínimo", ""].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alertasStock.map((a, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#FFF7F7" : "#ffffff" }}>
                  <td style={styles.td}>{a.producto}</td>
                  <td style={styles.td}>
                    <span style={{ color: a.stock === 0 ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>
                      {a.stock} {a.unidad}
                    </span>
                  </td>
                  <td style={styles.td}>{a.minimo} {a.unidad}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: a.stock === 0 ? "#FEE2E2" : "#FEF3C7",
                      color: a.stock === 0 ? "#991B1B" : "#92400E",
                    }}>
                      {a.stock === 0 ? "Sin stock" : "Stock bajo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Últimas mediciones PlantCare */}
        <div style={{ ...styles.tableCard, flex: 1 }}>
          <div style={styles.tableHeader}>
            <Leaf size={16} color="#3D6B4F" />
            <h3 style={styles.tableTitle}>Última medición PlantCare</h3>
          </div>
          <div style={styles.medicionesList}>
            {ultimasMediciones.map(({ parametro, valor, icono: Icon, color }) => (
              <div key={parametro} style={styles.medicionRow}>
                <div style={{ ...styles.medicionIcon, backgroundColor: color + "18" }}>
                  <Icon size={14} color={color} />
                </div>
                <span style={styles.medicionLabel}>{parametro}</span>
                <span style={styles.medicionValor}>{valor}</span>
              </div>
            ))}
          </div>
          <p style={styles.medicionFecha}>Última medición: hoy 09:34 — Terreno Norte</p>
        </div>
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
    border: "1px solid #D1E8DA",
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
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #D1E8DA",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    minWidth: "280px",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  tableTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E293B",
    margin: 0,
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
  medicionesList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  medicionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 0",
    borderBottom: "1px solid #F1F5F9",
  },
  medicionIcon: {
    width: 28,
    height: 28,
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  medicionLabel: {
    fontSize: "13px",
    color: "#475569",
    flex: 1,
  },
  medicionValor: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1E293B",
  },
  medicionFecha: {
    fontSize: "11px",
    color: "#94A3B8",
    marginTop: "12px",
    marginBottom: 0,
  },
}