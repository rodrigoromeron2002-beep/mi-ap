import { API_ENDPOINTS } from "../constants/api";
import type { CoachMessage, Plan, PlanForm } from "../types/plan";

type GeneratePlanResponse = {
  routine?: unknown;
  nutrition?: unknown;
  mindset?: unknown;
  plan?: unknown;
};

type AskCoachResponse = {
  answer?: unknown;
};

type HealthResponse = {
  ok?: unknown;
  app?: unknown;
};

function createPlanId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPlanTags(form: PlanForm) {
  return [form.goal, form.level, form.place].filter(Boolean);
}

export async function generatePlan(form: PlanForm): Promise<Plan> {
  const response = await fetch(API_ENDPOINTS.generatePlan, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objective: form.goal,
      level: form.level,
      days: form.days,
      place: form.place,
      time: form.time,
      language: form.language,
      format: "structured_daily_plan",
    }),
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  const data = (await response.json()) as GeneratePlanResponse;

  return {
    ...form,
    id: createPlanId(),
    createdAt: new Date().toISOString(),
    favorite: false,
    tags: createPlanTags(form),
    routine: String(data.routine ?? data.plan ?? ""),
    nutrition: String(data.nutrition ?? ""),
    mindset: String(data.mindset ?? ""),
  };
}

export async function checkBackendHealth() {
  const response = await fetch(API_ENDPOINTS.health);

  if (!response.ok) {
    throw new Error("Health check error");
  }

  const data = (await response.json()) as HealthResponse;

  return {
    ok: Boolean(data.ok),
    app: String(data.app ?? "Zentra backend"),
  };
}

export async function askCoach({
  question,
  plan,
  messages,
}: {
  question: string;
  plan: Plan | null;
  messages: CoachMessage[];
}) {
  const response = await fetch(API_ENDPOINTS.coach, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      plan: plan
        ? {
            goal: plan.goal,
            level: plan.level,
            days: plan.days,
            place: plan.place,
            time: plan.time,
            language: plan.language,
            routine: plan.routine,
            nutrition: plan.nutrition,
            mindset: plan.mindset,
          }
        : null,
      messages: messages.slice(-6).map((message) => ({
        role: message.role,
        text: message.text,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Coach error");
  }

  const data = (await response.json()) as AskCoachResponse;
  return String(data.answer ?? "");
}
