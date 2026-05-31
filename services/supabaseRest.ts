import { SUPABASE_ANON_KEY, SUPABASE_CONFIGURED, SUPABASE_URL } from "@/constants/supabase";

type SupabaseRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  accessToken?: string;
  body?: unknown;
  prefer?: string;
};

export function assertSupabaseConfigured() {
  if (!SUPABASE_CONFIGURED) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
}

export async function supabaseAuthRequest<T>(
  path: string,
  options: SupabaseRequestOptions = {},
): Promise<T> {
  assertSupabaseConfigured();

  const response = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${options.accessToken ?? SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return (await response.json()) as T;
}

export async function supabaseDbRequest<T>(
  path: string,
  options: SupabaseRequestOptions = {},
): Promise<T> {
  assertSupabaseConfigured();

  const response = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${options.accessToken ?? SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

async function readError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string; msg?: string; message?: string };
    return data.message ?? data.msg ?? data.error ?? "Supabase request error";
  } catch {
    return "Supabase request error";
  }
}
