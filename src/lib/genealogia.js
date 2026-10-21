// Funciones puras de genealogía (no dependen de React ni de Supabase).
// Trabajan sobre la lista de animales: { id, madre_id, padre_id, padre_externo, ... }

const porId = (animales) => new Map(animales.map((a) => [a.id, a]))

// Todos los ancestros (ids) de un animal, a cualquier profundidad
export function ancestros(animales, id) {
  const mapa = porId(animales)
  const res = new Set()
  const visitar = (aid) => {
    const a = mapa.get(aid)
    if (!a) return
    for (const p of [a.madre_id, a.padre_id]) {
      if (p && !res.has(p)) {
        res.add(p)
        visitar(p)
      }
    }
  }
  visitar(id)
  return res
}

// Todos los descendientes (ids) de un animal
export function descendientes(animales, id) {
  const res = new Set()
  const cola = [id]
  while (cola.length) {
    const x = cola.shift()
    for (const a of animales) {
      if ((a.madre_id === x || a.padre_id === x) && !res.has(a.id)) {
        res.add(a.id)
        cola.push(a.id)
      }
    }
  }
  return res
}

export const crias = (animales, id) =>
  animales.filter((a) => a.madre_id === id || a.padre_id === id)

// Misma madre o mismo padre
export const hermanos = (animales, animal) =>
  animales.filter(
    (a) =>
      a.id !== animal.id &&
      ((animal.madre_id && a.madre_id === animal.madre_id) ||
        (animal.padre_id && a.padre_id === animal.padre_id))
  )

// Ancestros que comparten la madre y el padre (señal de consanguinidad).
// Incluye el caso en que uno de los padres sea ancestro del otro.
export function ancestrosComunes(animales, madreId, padreId) {
  if (!madreId || !padreId) return []
  const mapa = porId(animales)
  const delLadoMadre = ancestros(animales, madreId).add(madreId)
  const delLadoPadre = ancestros(animales, padreId).add(padreId)
  return [...delLadoMadre].filter((id) => delLadoPadre.has(id)).map((id) => mapa.get(id))
}

// Pedigrí por generaciones: niveles[0] = [animal], niveles[1] = [padre, madre], niveles[2] = abuelos...
// Cada slot: { animal | null, externo | null, rol }. Los desconocidos se rellenan para mantener la forma.
export function construirPedigri(animales, id, generaciones) {
  const mapa = porId(animales)
  const raiz = mapa.get(id)
  if (!raiz) return []
  const niveles = [[{ animal: raiz, externo: null, rol: "animal" }]]
  for (let g = 1; g <= generaciones; g++) {
    const siguiente = []
    for (const slot of niveles[g - 1]) {
      const a = slot.animal
      const padre = a?.padre_id ? mapa.get(a.padre_id) : null
      const madre = a?.madre_id ? mapa.get(a.madre_id) : null
      siguiente.push({ animal: padre ?? null, externo: padre ? null : a?.padre_externo || null, rol: "padre" })
      siguiente.push({ animal: madre ?? null, externo: null, rol: "madre" })
    }
    niveles.push(siguiente)
  }
  return niveles
}
