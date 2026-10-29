import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { destinoPara } from "../lib/roles"

// Uso: <Route element={<RequireRole allow={["admin", "lecheria"]} modulo="lecheria" />}> ...rutas... </Route>
//  - allow:  roles que pueden entrar (el rol que cuenta es el que tiene en la EMPRESA ACTIVA)
//  - modulo: módulo que la empresa activa debe tener contratado (opcional)
export default function RequireRole({ allow, modulo }) {
  const { session, perfil, contexto, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Cargando...
      </div>
    )
  }

  // sin sesión, sin perfil o sin empresa -> al login
  if (!session || !perfil || !contexto) return <Navigate to="/" replace />

  // sin permiso, o la empresa no tiene ese módulo -> a su propia zona
  const sinRol = !allow.includes(contexto.rolActivo)
  const sinModulo = modulo && !contexto.modulos.includes(modulo)
  if (sinRol || sinModulo) {
    return <Navigate to={destinoPara(contexto) ?? "/"} replace />
  }

  return <Outlet />
}