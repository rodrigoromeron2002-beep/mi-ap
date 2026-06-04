import { clearStoredSession, saveStoredSession } from "@/storage/sessionStorage";
import type { AuthSession } from "@/types/auth";

import { supabaseAuthRequest } from "./supabaseRest";

type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  id?: string;
  email?: string;
  user?: {
    id?: string;
    email?: string;
  };
};

function mapAuthResponse(data: AuthResponse): AuthSession {
  const user = data.user ?? (data.id ? { id: data.id, email: data.email } : undefined);

  if (!data.access_token || !user?.id) {
    if (user?.id) {
      throw new Error("AUTH_EMAIL_CONFIRMATION_REQUIRED");
    }

    throw new Error("AUTH_RESPONSE_INVALID");
  }

  const expiresAt = data.expires_in
    ? Math.floor(Date.now() / 1000) + data.expires_in
    : undefined;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function signInWithPassword(email: string, password: string) {
  const data = await supabaseAuthRequest<AuthResponse>("/token?grant_type=password", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  const session = mapAuthResponse(data);
  await saveStoredSession(session);
  return session;
}

export async function signUpWithPassword(email: string, password: string) {
  const data = await supabaseAuthRequest<AuthResponse>("/signup", {
    method: "POST",
    body: {
      email,
      password,
    },
  });

  const session = mapAuthResponse(data);
  await saveStoredSession(session);
  return session;
}

export async function refreshStoredSession(session: AuthSession) {
  if (!session.refreshToken) {
    throw new Error("AUTH_REFRESH_TOKEN_MISSING");
  }

  const data = await supabaseAuthRequest<AuthResponse>("/token?grant_type=refresh_token", {
    method: "POST",
    body: {
      refresh_token: session.refreshToken,
    },
  });

  const nextSession = mapAuthResponse(data);
  await saveStoredSession(nextSession);
  return nextSession;
}

export async function signOut() {
  await clearStoredSession();
}
