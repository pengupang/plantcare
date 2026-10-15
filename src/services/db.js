import { supabase } from "../lib/supabase"

const PAGINA = 1000

// `construir` debe devolver una consulta NUEVA (y ordenada por una columna única)
// cada vez que se llama, por ejemplo: () => supabase.from("gastos").select("*").order("id")
export async function traerTodo(construir) {
  let filas = []
  for (let desde = 0; ; desde += PAGINA) {
    const { data, error } = await construir().range(desde, desde + PAGINA - 1)
    if (error) throw new Error(error.message)
    filas = filas.concat(data)
    if (data.length < PAGINA) break
  }
  return filas
}

export const check = ({ data, error }) => {
  if (error) throw new Error(mensajeAmigable(error))
  return data
}

// Traduce los errores típicos de Postgres a algo entendible
export function mensajeAmigable(error) {
  const m = error.message || String(error)
  if (error.code === "23503" || m.includes("violates foreign key"))
    return "No se puede eliminar: hay registros que dependen de este (por ejemplo arriendos o facturas asociadas)."
  if (error.code === "23505" || m.includes("duplicate key"))
    return "Ya existe un registro con ese valor único (arete, número, nombre...)."
  if (error.code === "42501" || m.includes("row-level security"))
    return "Tu usuario no tiene permiso para esta acción."
  return m
}

const sinCamposDeSistema = ({ id, created_at, ...resto }) => resto // eslint-disable-line no-unused-vars

// CRUD genérico sobre una tabla. `select` permite traer relaciones (joins).
export const crud = (tabla, { select = "*", orden = "id", ascendente = true } = {}) => ({
  listar: () =>
    traerTodo(() => supabase.from(tabla).select(select).order(orden, { ascending: ascendente }).order("id")),
  crear: async (datos) =>
    check(await supabase.from(tabla).insert(sinCamposDeSistema(datos)).select(select).single()),
  actualizar: async (id, datos) =>
    check(await supabase.from(tabla).update(sinCamposDeSistema(datos)).eq("id", id).select(select).single()),
  eliminar: async (id) => {
    const { error } = await supabase.from(tabla).delete().eq("id", id)
    if (error) throw new Error(mensajeAmigable(error))
  },
})