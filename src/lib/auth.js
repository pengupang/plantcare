import { supabase } from "./supabase"

// Deja solo números y K: "12.345.678-k" -> "12345678K"
export function normalizarRut(valor) {
  return String(valor ?? "").replace(/[^0-9kK]/g, "").toUpperCase()
}

// Calcula el dígito verificador (módulo 11)
function calcularDv(cuerpo) {
  let suma = 0
  let mult = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult
    mult = mult === 7 ? 2 : mult + 1
  }
  const resto = 11 - (suma % 11)
  if (resto === 11) return "0"
  if (resto === 10) return "K"
  return String(resto)
}

// true si el RUT es válido en Chile
export function validarRut(valor) {
  const rut = normalizarRut(valor)
  if (rut.length < 8 || rut.length > 9) return false
  const cuerpo = rut.slice(0, -1)
  const dv = rut.slice(-1)
  if (!/^\d+$/.test(cuerpo)) return false
  if (/^(\d)\1+$/.test(cuerpo)) return false // 11111111, 22222222, etc.
  return calcularDv(cuerpo) === dv
}

// "123456785" -> "12.345.678-5" (para mostrar mientras se escribe)
export function formatearRut(valor) {
  const rut = normalizarRut(valor)
  if (rut.length <= 1) return rut
  const cuerpo = rut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${cuerpo}-${rut.slice(-1)}`
}

// modulo: "maquinaria" | "lecheria"
export async function iniciarSesion(modulo, rutIngresado, password) {
  if (!validarRut(rutIngresado)) return { error: "El RUT ingresado no es válido" }
  const rut = normalizarRut(rutIngresado)

  const { data: email, error: errRut } = await supabase.rpc("email_por_rut", {
    p_modulo: modulo,
    p_rut: rut,
  })
  if (errRut) {
    console.error("email_por_rut:", errRut)
    return { error: "No se pudo consultar el usuario: " + errRut.message }
  }
  if (!email) return { error: "RUT no encontrado en este módulo" }

  const { error: errAuth } = await supabase.auth.signInWithPassword({ email, password })
  if (errAuth) {
    console.error("signInWithPassword:", errAuth)
    const msg = errAuth.message || ""
    if (msg.includes("Email not confirmed"))
      return { error: "El correo de este usuario no está confirmado en Supabase" }
    if (msg.includes("Invalid login credentials"))
      return { error: "Contraseña incorrecta, o el usuario no existe en Authentication" }
    return { error: msg }
  }

  const { data: pertenece } = await supabase.rpc("pertenece_a_modulo", { p_modulo: modulo })
  if (!pertenece) {
    await supabase.auth.signOut()
    return { error: "Este usuario no tiene acceso a este módulo" }
  }

  return { error: null }
}