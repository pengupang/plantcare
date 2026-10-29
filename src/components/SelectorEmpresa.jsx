import { useState } from "react"
import { Building2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

// Muestra la empresa activa. Si el usuario pertenece a más de una, permite cambiar
// (se trabaja en una a la vez: al cambiar, la app se recarga con los datos de la otra).
export default function SelectorEmpresa({ oscuro = false }) {
  const { contexto, cambiarEmpresa } = useAuth()
  const [cambiando, setCambiando] = useState(false)

  if (!contexto?.empresaNombre) return null

  const color = oscuro ? "#ffffff" : "#334155"
  const fondo = oscuro ? "rgba(0,0,0,0.35)" : "#ffffff"
  const borde = oscuro ? "1px solid rgba(255,255,255,0.25)" : "1px solid #D1E8DA"
  const caja = {
    display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
    background: fondo, border: borde, borderRadius: 6, color, fontSize: 13,
  }

  if (contexto.empresas.length <= 1) {
    return (
      <div style={caja} title="Empresa activa">
        <Building2 size={16} />
        <span>{contexto.empresaNombre}</span>
      </div>
    )
  }

  const onChange = async (e) => {
    setCambiando(true)
    try {
      await cambiarEmpresa(e.target.value)
    } catch {
      setCambiando(false)
      alert("No se pudo cambiar de empresa")
    }
  }

  return (
    <label style={caja} title="Cambiar de empresa">
      <Building2 size={16} />
      <select
        value={contexto.empresaId}
        onChange={onChange}
        disabled={cambiando}
        style={{ background: "transparent", border: "none", color, fontSize: 13, cursor: "pointer", outline: "none" }}
      >
        {contexto.empresas.map((emp) => (
          <option key={emp.id} value={emp.id} style={{ color: "#0f172a" }}>
            {emp.nombre}
          </option>
        ))}
      </select>
    </label>
  )
}