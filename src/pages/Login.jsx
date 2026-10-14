import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { destinoPorRol } from "../lib/roles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"

export default function Login() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { session, perfil, loading: authLoading } = useAuth()

  // Si ya hay sesión activa, no mostrar el login: ir directo a su zona
  useEffect(() => {
    if (!authLoading && session && perfil) {
      navigate(destinoPorRol[perfil.rol] ?? "/", { replace: true })
    }
  }, [authLoading, session, perfil, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1) usuario -> email (función RPC, no expone la tabla)
    const { data: email, error: usuarioError } = await supabase.rpc("email_por_usuario", {
      p_usuario: usuario.trim(),
    })
    if (usuarioError || !email) {
      setError("Usuario o contraseña incorrectos")
      setLoading(false)
      return
    }

    // 2) Login con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) {
      setError("Usuario o contraseña incorrectos")
      setLoading(false)
      return
    }

    // 3) Rol -> destino
    const { data: p } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", authData.user.id)
      .maybeSingle()

    if (!p) {
      await supabase.auth.signOut()
      setError("Tu usuario no tiene un rol asignado")
      setLoading(false)
      return
    }

    navigate(destinoPorRol[p.rol] ?? "/", { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white p-8 rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistema de gestión</h1>
          <p className="text-sm text-slate-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Usuario
            </label>
            <Input
              type="text"
              placeholder="tu usuario" autoComplete="username" autoCapitalize="none"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 p-3 focus:bg-white transition-colors"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 p-3 focus:bg-white transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="h-11 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors shadow-sm"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar a la plataforma"}
        </Button>
      </form>
    </div>
  )
}