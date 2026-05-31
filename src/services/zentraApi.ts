const API_URL = 'http://localhost:3001';

export type GeneratePlanPayload = {
  objective: string;
  level: string;
  days: string;
  place: string;
  time: string;
};

export async function generatePlan(payload: GeneratePlanPayload): Promise<string> {
  const response = await fetch(`${API_URL}/api/generate-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'No pudimos generar el plan.');
  }

  return data.plan;
}