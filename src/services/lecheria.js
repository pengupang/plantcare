// ─────────────────────────────────────────────────────────────────────────────
// Capa de datos de LECHERÍA
//
// HOY: datos de ejemplo en memoria (se pierden al recargar la página).
// DESPUÉS: reemplazar SOLO el cuerpo de las 4 funciones de `crud()` por consultas
// a Supabase. Las vistas (Rebaño, Sanidad, Calendario) no cambian.
//
// Equivalentes en Supabase (tabla = potreros | animales | sanidad_registros):
//   listar:     const { data, error } = await supabase.from(tabla).select("*").order("id")
//   crear:      const { data, error } = await supabase.from(tabla).insert(row).select().single()
//   actualizar: const { data, error } = await supabase.from(tabla).update(row).eq("id", id).select().single()
//   eliminar:   const { error } = await supabase.from(tabla).delete().eq("id", id)
//   (en todos: if (error) throw new Error(error.message))
//
// Los nombres de campos están en snake_case igual que las columnas del SQL
// de `lecheria_backend.sql`. Las fechas son strings "YYYY-MM-DD".
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const enDias = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return fmt(d)
}
export const hoyISO = () => fmt(new Date())

const db = {
  potreros: [
    { id: 1, nombre: "Potrero Norte", superficie_ha: 4.5, tipo_pradera: "Pradera permanente", estado: "en_uso", capacidad: 20 },
    { id: 2, nombre: "Potrero Río", superficie_ha: 3.2, tipo_pradera: "Pradera sembrada", estado: "en_uso", capacidad: 14 },
    { id: 3, nombre: "Potrero Alto", superficie_ha: 5.0, tipo_pradera: "Alfalfa", estado: "descanso", capacidad: 18 },
    { id: 4, nombre: "Potrero Corral", superficie_ha: 1.2, tipo_pradera: "Pradera permanente", estado: "disponible", capacidad: 6 },
  ],
  animales: [
    { id: 1, arete: "CL-001", nombre: "Manchita", categoria: "vaca_ordena", potrero_id: 1, estado: "activo", fecha_nacimiento: "2020-03-14" },
    { id: 2, arete: "CL-002", nombre: "Luna", categoria: "vaca_ordena", potrero_id: 1, estado: "activo", fecha_nacimiento: "2019-08-02" },
    { id: 3, arete: "CL-003", nombre: "Canela", categoria: "vaca_ordena", potrero_id: 1, estado: "activo", fecha_nacimiento: "2021-01-21" },
    { id: 4, arete: "CL-004", nombre: "Pinta", categoria: "vaca_seca", potrero_id: 2, estado: "activo", fecha_nacimiento: "2018-11-30" },
    { id: 5, arete: "CL-005", nombre: "Estrella", categoria: "vaca_ordena", potrero_id: 2, estado: "activo", fecha_nacimiento: "2020-06-09" },
    { id: 6, arete: "CL-006", nombre: "Dulce", categoria: "vaca_seca", potrero_id: 2, estado: "activo", fecha_nacimiento: "2019-04-17" },
    { id: 7, arete: "CL-007", nombre: "", categoria: "vaquilla", potrero_id: 2, estado: "activo", fecha_nacimiento: "2024-02-05" },
    { id: 8, arete: "CL-008", nombre: "", categoria: "vaquilla", potrero_id: 4, estado: "activo", fecha_nacimiento: "2024-05-22" },
    { id: 9, arete: "CL-009", nombre: "", categoria: "ternero", potrero_id: 4, estado: "activo", fecha_nacimiento: "2026-07-10" },
    { id: 10, arete: "CL-010", nombre: "Tormenta", categoria: "toro", potrero_id: null, estado: "activo", fecha_nacimiento: "2021-09-12" },
    { id: 11, arete: "CL-011", nombre: "Rosa", categoria: "vaca_ordena", potrero_id: 1, estado: "baja", fecha_nacimiento: "2016-10-01" },
  ],
  sanidad_registros: [
    { id: 1, animal_id: 1, tipo: "Vacunación", producto: "Triple bovina", fecha: enDias(-3), proximo_control: null, costo: 4500, responsable: "Veterinaria del Campo", estado: "pendiente", nota: "Refuerzo anual" },
    { id: 2, animal_id: 4, tipo: "Control veterinario", producto: "", fecha: enDias(2), proximo_control: null, costo: 25000, responsable: "Dra. Torres", estado: "pendiente", nota: "Control de secado" },
    { id: 3, animal_id: 2, tipo: "Inseminación", producto: "Semen Holstein", fecha: enDias(5), proximo_control: enDias(26), costo: 18000, responsable: "Dra. Torres", estado: "pendiente", nota: "" },
    { id: 4, animal_id: 3, tipo: "Desparasitación", producto: "Ivermectina", fecha: enDias(9), proximo_control: null, costo: 3200, responsable: "Encargado predio", estado: "pendiente", nota: "" },
    { id: 5, animal_id: 5, tipo: "Tratamiento", producto: "Antibiótico (mastitis)", fecha: enDias(-10), proximo_control: null, costo: 15500, responsable: "Dra. Torres", estado: "realizado", nota: "Evolución favorable" },
    { id: 6, animal_id: 6, tipo: "Parto", producto: "", fecha: enDias(14), proximo_control: null, costo: 0, responsable: "Encargado predio", estado: "pendiente", nota: "Parto esperado" },
    { id: 7, animal_id: 9, tipo: "Vacunación", producto: "Clostridial", fecha: enDias(-20), proximo_control: enDias(10), costo: 2800, responsable: "Encargado predio", estado: "realizado", nota: "" },
  ],
}

let seq = 1000
const clone = (v) => JSON.parse(JSON.stringify(v))

// Fábrica de CRUD en memoria. Es lo ÚNICO que hay que reemplazar por Supabase.
const crud = (tabla, { alEliminar } = {}) => ({
  listar: async () => clone(db[tabla]),
  crear: async (data) => {
    const row = { ...data, id: ++seq }
    db[tabla].push(row)
    return clone(row)
  },
  actualizar: async (id, data) => {
    const i = db[tabla].findIndex((r) => r.id === id)
    if (i < 0) throw new Error("Registro no encontrado")
    db[tabla][i] = { ...db[tabla][i], ...data, id }
    return clone(db[tabla][i])
  },
  eliminar: async (id) => {
    db[tabla] = db[tabla].filter((r) => r.id !== id)
    alEliminar?.(id)
  },
})

// En la BD real esto lo hacen las FK: potrero_id -> ON DELETE SET NULL,
// sanidad_registros.animal_id -> ON DELETE CASCADE.
export const potreros = crud("potreros", {
  alEliminar: (id) => db.animales.forEach((a) => { if (a.potrero_id === id) a.potrero_id = null }),
})
export const animales = crud("animales", {
  alEliminar: (id) => { db.sanidad_registros = db.sanidad_registros.filter((s) => s.animal_id !== id) },
})
export const sanidad = crud("sanidad_registros")

// Texto para mostrar un animal en listas y selects
export const etiquetaAnimal = (a) => (a ? (a.nombre ? `${a.arete} · ${a.nombre}` : a.arete) : "—")
