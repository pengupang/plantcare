import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined = todavía no sabemos si hay sesión
  const [session, setSession] = useState(undefined)
  // guardamos de qué usuario es el perfil para evitar mostrar el de otro
  const [perfilState, setPerfilState] = useState({ userId: null, data: null })

  // Efecto 1: sesión (el callback solo guarda la sesión, nada de consultas aquí)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Efecto 2: perfil (rol) del usuario con sesión
  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) return
    let cancelled = false

    supabase
      .from("perfiles")
      .select("id, rut, email, rol")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setPerfilState({ userId, data: data ?? null })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const perfil = userId && perfilState.userId === userId ? perfilState.data : null
  // cargando = no sabemos la sesión, o hay sesión pero aún no llega su perfil
  const loading = session === undefined || (!!userId && perfilState.userId !== userId)

  return (
    <AuthContext.Provider value={{ session: session ?? null, perfil, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
