import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { supabase } from "../lib/supabase"

function ProtectedRoute() {
  const [session, setSession] = useState(undefined) // undefined se refiere a que no hay algo definido por ahora

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return null
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute