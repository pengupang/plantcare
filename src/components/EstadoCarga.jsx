import s from "../pages/estilosLecheria"

// Muestra "Cargando..." o el error con botón para reintentar. No dibuja nada si todo está bien.
export default function EstadoCarga({ cargando, error, onReintentar }) {
  if (error)
    return (
      <div style={s.errorBox}>
        No se pudieron cargar los datos: {error}{" "}
        {onReintentar && (
          <button onClick={onReintentar} style={{ marginLeft: 8, cursor: "pointer", textDecoration: "underline", background: "none", border: "none", color: "inherit" }}>
            Reintentar
          </button>
        )}
      </div>
    )
  if (cargando) return <p style={s.vacio}>Cargando...</p>
  return null
}