import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { supabase } from "../lib/supabase"

function ProtectedRoute({ modulo }) {
  const [estado, setEstado] = useState("cargando") // cargando | ok | sin-sesion | sin-acceso

  useEffect(() => {
    let activo = true

    async function verificar(session) {
      if (!session) {
        if (activo) setEstado("sin-sesion")
        return
      }
      const { data } = await supabase.rpc("pertenece_a_modulo", { p_modulo: modulo })
      if (activo) setEstado(data ? "ok" : "sin-acceso")
    }

    supabase.auth.getSession().then(({ data }) => verificar(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      verificar(session)
    })

    return () => {
      activo = false
      listener.subscription.unsubscribe()
    }
  }, [modulo])

  if (estado === "cargando") return null
  if (estado === "sin-sesion") return <Navigate to={`/${modulo}/login`} replace />
  if (estado === "sin-acceso") return <Navigate to="/" replace />
  return <Outlet />
}

export default ProtectedRoute