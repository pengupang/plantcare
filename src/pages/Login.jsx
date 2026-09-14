import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf } from "lucide-react"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white p-8 rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Plant<span className="text-emerald-700">Care</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="admin@plantcare.cl"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50/50 p-3 focus:bg-white transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          className="h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium transition-colors shadow-sm"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar a la plataforma"}
        </Button>
      </form>
    </div>
  )
}

export default Login