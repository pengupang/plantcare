import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const ESTILOS = {
  optimo: {
    card: "bg-emerald-50 border-emerald-200",
    icono: "text-emerald-500",
    valor: "text-emerald-600",
    punto: "bg-emerald-500",
    badge: "text-emerald-600",
    etiqueta: "Óptimo",
    subtitulo: "Nivel adecuado",
  },
  bajo: {
    card: "bg-orange-50 border-orange-200",
    icono: "text-orange-500",
    valor: "text-orange-600",
    punto: "bg-orange-500",
    badge: "text-orange-600",
    etiqueta: "Bajo",
    subtitulo: "Por debajo del rango",
  },
  alto: {
    card: "bg-red-50 border-red-200",
    icono: "text-red-500",
    valor: "text-red-600",
    punto: "bg-red-500",
    badge: "text-red-600",
    etiqueta: "Alto",
    subtitulo: "Por encima del rango",
  },
  neutro: {
    card: "bg-slate-50 border-slate-200",
    icono: "text-slate-400",
    valor: "text-slate-600",
    punto: "bg-slate-400",
    badge: "text-slate-500",
    etiqueta: "Sin datos",
    subtitulo: "Seleccione un terreno",
  },
}

export function evaluarEstado(campo, val) {
  if (val == null || val === "n/a" || isNaN(val)) return "neutro"
  const v = Number(val)

  switch (campo) {
    case "nitrogeno":
      return v < 20 ? "bajo" : v > 60 ? "alto" : "optimo"
    case "fosforo":
      return v < 10 ? "bajo" : v > 30 ? "alto" : "optimo"
    case "potasio":
      return v < 150 ? "bajo" : v > 300 ? "alto" : "optimo"
    case "ph":
      return v < 5.5 ? "bajo" : v > 7.5 ? "alto" : "optimo"
    case "humedad":
    case "humedad_suelo":
      return v < 30 ? "bajo" : v > 75 ? "alto" : "optimo"
    case "temperatura":
    case "temperatura_suelo":
      return v < 12 ? "bajo" : v > 28 ? "alto" : "optimo"
    // TODO: Ajustar rangos y conectar con el atributo real de conductividad eléctrica cuando esté disponible en Supabase
    case "conductividad_electrica":
    case "ce":
      return v < 200 ? "bajo" : v > 2000 ? "alto" : "optimo"
    default:
      return "optimo"
  }
}

export function MetricaCard({ titulo, valor, unidad, campo, Icono }) {
  const estado = evaluarEstado(campo, valor)
  const estilo = ESTILOS[estado]

  return (
    <Card className={`border-2 rounded-2xl p-4 flex flex-col gap-4 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${estilo.card}`}>
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
          <Icono className={`w-5 h-5 ${estilo.icono}`} aria-hidden="true" />
        </div>
        <Badge className={`bg-white rounded-full px-3 py-1 text-xs font-bold border shadow-sm flex items-center gap-1.5 h-auto ${estilo.badge}`}>
          <span className={`w-2 h-2 rounded-full ${estilo.punto}`} />
          {estilo.etiqueta}
        </Badge>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${estilo.valor}`}>{valor ?? "n/a"}</span>
        <span className="text-sm font-medium text-gray-500">{unidad}</span>
      </div>

      <div>
        <p className="text-base font-semibold text-slate-800">{titulo}</p>
        <p className="text-xs text-gray-500 mt-0.5">{estilo.subtitulo}</p>
      </div>
    </Card>
  )
}