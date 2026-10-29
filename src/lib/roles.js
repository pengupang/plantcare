// A dónde va cada módulo o rol después de iniciar sesión
export const destinoPorRol = {
  admin: "/portal",
  lecheria: "/lecheria/dashboard",
  maquinaria: "/maquinaria/dashboard",
}

// Convierte la respuesta de la función contexto_actual() de Supabase a un objeto cómodo
export function normalizarContexto(raw) {
  if (!raw || !raw.empresa_id) return null
  const roles = raw.roles ?? []
  return {
    empresaId: raw.empresa_id,
    empresaNombre: raw.empresa_nombre,
    roles,
    rolActivo: roles.includes("admin") ? "admin" : roles[0] ?? null,
    esAdmin: roles.includes("admin"),
    modulos: raw.modulos ?? [],
    esSuperadmin: !!raw.es_superadmin,
    empresas: raw.empresas ?? [],
  }
}

// Pantalla de inicio del usuario en su empresa activa (null si no tiene acceso a nada)
export function destinoPara(ctx) {
  if (!ctx?.rolActivo) return null
  if (ctx.rolActivo === "admin") {
    if (ctx.modulos.length === 1) return destinoPorRol[ctx.modulos[0]]
    return ctx.modulos.length > 1 ? "/portal" : null
  }
  return ctx.modulos.includes(ctx.rolActivo) ? destinoPorRol[ctx.rolActivo] : null
}