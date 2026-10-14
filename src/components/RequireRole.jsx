import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { destinoPorRol } from "../lib/roles"

// Uso: <Route element={<RequireRole allow={["admin", "lecheria"]} />}> ...rutas... </Route>
export default function RequireRole({ allow }) {
  const { session, perfil, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Cargando...
      </div>
    )
  }

  // sin sesión o sin rol asignado -> al login
  if (!session || !perfil) return <Navigate to="/" replace />

  // con sesión pero sin permiso para esta zona -> a su propia zona
  if (!allow.includes(perfil.rol)) {
    return <Navigate to={destinoPorRol[perfil.rol] ?? "/"} replace />
  }

  return <Outlet />
}
