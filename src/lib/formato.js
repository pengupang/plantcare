export const clp = (n) => `$${Math.round(Number(n) || 0).toLocaleString("es-CL")}`
export const clpM = (n) => `$${((Number(n) || 0) / 1_000_000).toFixed(2)}M`

// "2026-10-14" -> "14-10-2026" (sin pasar por Date para evitar desfases de zona horaria)
export const fechaCL = (iso) => (iso ? iso.split("-").reverse().join("-") : "—")

export const hoyLargo = () => {
  const t = new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export const MESES_CORTO = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]