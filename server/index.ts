import cors from "cors";
import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY);

const openai = hasOpenAiKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const LANGUAGE_NAMES: Record<string, string> = {
  es: "español",
  de: "alemán",
  it: "italiano",
  pt: "portugués",
  zh: "chino simplificado",
  fr: "francés",
  en: "inglés",
};

function extractPlanSections(text: string) {
  const routine = extractSection(text, /RUTINA\s*:/i, [/ALIMENTACI[OÓ]N\s*:/i, /NUTRICI[OÓ]N\s*:/i, /MINDSET\s*:/i]);
  const nutrition =
    extractSection(text, /ALIMENTACI[OÓ]N\s*:/i, [/MINDSET\s*:/i]) ||
    extractSection(text, /NUTRICI[OÓ]N\s*:/i, [/MINDSET\s*:/i]);
  const mindset = extractSection(text, /MINDSET\s*:/i, []);

  return {
    routine: routine || text.trim(),
    nutrition,
    mindset,
  };
}

function extractSection(text: string, startPattern: RegExp, endPatterns: RegExp[]) {
  const startMatch = startPattern.exec(text);

  if (!startMatch || startMatch.index === undefined) {
    return "";
  }

  const startIndex = startMatch.index + startMatch[0].length;
  const remainingText = text.slice(startIndex);
  const endIndexes = endPatterns
    .map((pattern) => pattern.exec(remainingText)?.index)
    .filter((index): index is number => typeof index === "number");
  const endIndex = endIndexes.length > 0 ? Math.min(...endIndexes) : remainingText.length;

  return remainingText.slice(0, endIndex).trim();
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    ok: true,
    app: "Zentra backend",
    ai: hasOpenAiKey ? "openai" : "demo",
  });
});

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { objective, level, days, place, time, language = "es" } = req.body;

    if (!objective || !level || !days || !place || !time) {
      return res.status(400).json({
        error: "Faltan datos para generar el plan.",
      });
    }

    const planLanguage = LANGUAGE_NAMES[String(language)] ?? "español";

    if (!openai) {
      const demoPlan = createDemoPlan({
        objective,
        level,
        days,
        place,
        time,
        language: planLanguage,
      });

      return res.json(demoPlan);
    }

    const prompt = `
Sos Zentra, una app fitness premium con IA.

Generá un plan en ${planLanguage} para este usuario:

Objetivo: ${objective}
Nivel: ${level}
Días por semana: ${days}
Lugar: ${place}
Tiempo por sesión: ${time}

Reglas de calidad:
- Estructurá la rutina por día: Día 1, Día 2, etc.
- Indicá ejercicios, series/repeticiones o tiempos, y foco de cada día.
- La alimentación debe ser práctica, accionable y compatible con el objetivo.
- El mindset debe sonar como coach premium: claro, directo, sin frases genéricas.
- No des consejos médicos ni promesas extremas.

Devolvé el contenido separado así:

RUTINA:
[rutina semanal clara por días]

ALIMENTACION:
[recomendaciones simples de alimentación]

MINDSET:
[frase y enfoque mental]
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output_text || "";

    const { routine, nutrition, mindset } = extractPlanSections(text);

    res.json({
      routine,
      nutrition,
      mindset,
    });
  } catch (error) {
    console.error("Error generando plan:", error);

    res.status(500).json({
      error: "No pudimos generar el plan. Probá de nuevo.",
    });
  }
});

app.post("/api/coach", async (req, res) => {
  try {
    const { question, plan, messages = [] } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Falta la pregunta para el coach.",
      });
    }

    const planLanguage = LANGUAGE_NAMES[String(plan?.language ?? "es")] ?? "español";

    if (!openai) {
      return res.json({
        answer:
          "Modo demo activo: hoy hacé una sesión simple, medible y sin exagerar. Elegí 3 ejercicios principales, registrá minutos completados y dejá una nota breve sobre energía y dificultad.",
      });
    }

    const recentMessages = Array.isArray(messages)
      ? messages
          .slice(-6)
          .map((message) => `${message.role === "user" ? "Usuario" : "Coach"}: ${message.text}`)
          .join("\n")
      : "";

    const prompt = `
Sos el Coach IA de Zentra, una app fitness premium.

Respondé en ${planLanguage}.
Tu estilo: directo, cálido, accionable, sin relleno.
No des consejos médicos ni reemplaces a un profesional de salud.
Si la pregunta implica lesión, dolor fuerte, medicación o enfermedad, indicá consultar a un profesional.

Contexto del plan actual:
Objetivo: ${plan?.goal ?? "sin plan generado"}
Nivel: ${plan?.level ?? "sin dato"}
Días: ${plan?.days ?? "sin dato"}
Lugar: ${plan?.place ?? "sin dato"}
Tiempo: ${plan?.time ?? "sin dato"}
Rutina: ${plan?.routine ?? "sin rutina"}
Nutrición: ${plan?.nutrition ?? "sin nutrición"}
Mindset: ${plan?.mindset ?? "sin mindset"}

Conversación reciente:
${recentMessages || "Sin conversación previa."}

Pregunta del usuario:
${question}

Respondé en máximo 5 bullets o 1 párrafo breve. Incluí una acción concreta para hoy.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    res.json({
      answer: response.output_text || "",
    });
  } catch (error) {
    console.error("Error en coach:", error);

    res.status(500).json({
      error: "No pudimos responder desde el coach. Probá de nuevo.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Zentra backend corriendo en http://localhost:${PORT}`);
  if (!hasOpenAiKey) {
    console.log("Modo demo activo: agregá OPENAI_API_KEY en server/.env para usar IA real.");
  }
});

function createDemoPlan({
  objective,
  level,
  days,
  place,
  time,
}: {
  objective: string;
  level: string;
  days: string;
  place: string;
  time: string;
  language: string;
}) {
  return {
    routine: [
      `Día 1 - Fuerza base (${time})`,
      `Calentamiento 6 min. Sentadillas 3x10, flexiones 3x8, remo con mochila o polea 3x10, plancha 3x30s. Foco: técnica limpia para nivel ${level}.`,
      "",
      "Día 2 - Cardio inteligente",
      `Intervalos suaves: 8 rondas de 40s activo + 40s descanso. Terminá con movilidad. Ideal para entrenar en ${place}.`,
      "",
      "Día 3 - Full body",
      "Zancadas 3x10 por pierna, press hombros 3x10, bisagra de cadera 3x12, core 8 min. Cerrá registrando esfuerzo del 1 al 10.",
      "",
      `Ajuste semanal: si completás ${days} días, subí apenas la dificultad la próxima semana.`,
    ].join("\n"),
    nutrition: [
      `Objetivo: ${objective}. Priorizá proteína en cada comida, verduras o fruta a diario y agua antes de entrenar.`,
      "Usá platos simples: 1 fuente de proteína, 1 carbohidrato útil, 1 grasa saludable y volumen vegetal.",
      "Evitá cambios extremos: el progreso sostenible gana por consistencia, no por castigo.",
    ].join("\n"),
    mindset:
      "Tu meta de hoy no es entrenar perfecto: es cumplir una acción concreta y dejar evidencia. Lo que se mide, mejora.",
  };
}
