import { supabase } from "./supabase"

// Genera una recomendación agronómica con IA (Groq/Llama), 100% desde
// el navegador: sin backend propio, sin localhost, funciona en
// cualquier PC apenas tenga internet. Se conecta directo a Supabase
// para buscar la última medición, el cultivo y la referencia INIA, y
// directo a Open-Meteo para el clima.

const UBICACION_DEFAULT = { lat: -36.6067, lon: -72.1034 }

// ---------------------------------------------------------
// 1) Datos desde Supabase
// ---------------------------------------------------------
async function obtenerContexto(terrenoId) {
  const { data: medicion, error: errMedicion } = await supabase
    .from("Mediciones")
    .select("*")
    .eq("terreno_id", terrenoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (errMedicion) throw new Error("Error consultando Mediciones: " + errMedicion.message)
  if (!medicion) throw new Error("Este terreno todavía no tiene mediciones registradas.")

  const { data: terreno } = await supabase
    .from("Terrenos")
    .select("nombre, crop_key, coordenadas_centro")
    .eq("id", terrenoId)
    .maybeSingle()

  let nombreCultivo = null
  let referenciaINIA = null

  if (terreno?.crop_key) {
    const { data: crop } = await supabase
      .from("CROPS")
      .select('"CROP_NAME_ES"')
      .eq("CROP_KEY", terreno.crop_key)
      .maybeSingle()
    nombreCultivo = crop?.CROP_NAME_ES ?? null

    const { data: ptaData } = await supabase
      .from("PTA_DATA")
      .select("NITROGEN, PHOSPHORUS, POTASSIUM")
      .eq("CROP_KEY", terreno.crop_key)
      .eq("TISSUE_KEY", 2) // Hoja

    if (ptaData?.length) {
      const promedio = (campo) => {
        const valores = ptaData.map((d) => d[campo]).filter((v) => v != null)
        return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null
      }
      referenciaINIA = {
        nitrogeno: promedio("NITROGEN"),
        fosforo: promedio("PHOSPHORUS"),
        potasio: promedio("POTASSIUM"),
      }
    }
  }

  return { medicion, terreno, nombreCultivo, referenciaINIA }
}

// ---------------------------------------------------------
// 2) Groq: pedir la recomendación en JSON estricto
// ---------------------------------------------------------
async function pedirRecomendacionAGroq({ medicion, nombreCultivo, referenciaINIA, observacionesAdmin }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error("Falta VITE_GROQ_API_KEY en el .env")

  const valor = (campo, unidad = "") =>
    medicion?.[campo] != null ? `${medicion[campo]}${unidad}` : "sin dato"

  let prompt = `Sos un asistente agronómico. Analizá SOLO estos 6 parámetros medidos en terreno (no inventes otros nutrientes):

- Nitrógeno: ${valor("nitrogeno")}
- Fósforo: ${valor("fosforo")}
- Potasio: ${valor("potasio")}
- pH: ${valor("ph")}
- Humedad del suelo: ${valor("humedad_suelo", "%")}
- Conductividad eléctrica: ${valor("conductividad_electrica")}
`

  if (nombreCultivo) prompt += `\nCultivo del terreno: ${nombreCultivo}.`
  if (referenciaINIA) {
    prompt += `\nReferencia INIA para este cultivo (promedio en hoja): Nitrógeno ${referenciaINIA.nitrogeno?.toFixed(2)}%, Fósforo ${referenciaINIA.fosforo?.toFixed(2)}%, Potasio ${referenciaINIA.potasio?.toFixed(2)}%.`
  }
  if (observacionesAdmin) prompt += `\nObservación del técnico en terreno: "${observacionesAdmin}".`

  prompt += `

Respondé ÚNICAMENTE con un JSON válido, sin texto adicional, con esta forma exacta:
{
  "estado_general": "una frase corta resumiendo el estado del terreno",
  "alertas": ["alerta 1", "alerta 2"],
  "recomendaciones": [
    { "accion": "qué hacer", "prioridad": "alta|media|baja", "motivo": "por qué" }
  ]
}
Si no hay alertas, "alertas" debe ser un array vacío.`

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  })

  if (!res.ok) {
    const detalle = await res.json().catch(() => ({}))
    throw new Error(detalle?.error?.message || "No se pudo generar la recomendación")
  }

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}

// ---------------------------------------------------------
// 3) Clima directo desde el navegador (Open-Meteo, sin key)
// ---------------------------------------------------------
async function obtenerClima(coordenadas) {
  const lat = coordenadas?.lat ?? UBICACION_DEFAULT.lat
  const lon = coordenadas?.lng ?? coordenadas?.lon ?? UBICACION_DEFAULT.lon

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=5`

  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()

  return data.daily.time.map((fecha, i) => ({
    fecha,
    codigo: data.daily.weather_code[i],
    max: Math.round(data.daily.temperature_2m_max[i]),
    min: Math.round(data.daily.temperature_2m_min[i]),
    probLluvia: data.daily.precipitation_probability_max[i],
  }))
}

// ---------------------------------------------------------
// Función principal: la llama Mediciones.jsx directamente
// ---------------------------------------------------------
export async function generarRecomendacion(terrenoId, observacionesAdmin) {
  const { medicion, terreno, nombreCultivo, referenciaINIA } = await obtenerContexto(terrenoId)

  const [recomendacion, clima] = await Promise.all([
    pedirRecomendacionAGroq({ medicion, nombreCultivo, referenciaINIA, observacionesAdmin }),
    obtenerClima(terreno?.coordenadas_centro),
  ])

  return { recomendacion, clima }
}