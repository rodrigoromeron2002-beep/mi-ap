import { useEffect, useMemo, useState } from "react";

import { SUPABASE_CONFIGURED } from "@/constants/supabase";
import {
  refreshStoredSession,
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/services/authService";
import { getStoredSession } from "@/storage/sessionStorage";
import type { AuthSession } from "@/types/auth";

type AuthStatus = "not_configured" | "signed_in" | "signed_out";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedSession = await getStoredSession();
        if (!storedSession) {
          setSession(null);
          return;
        }

        setSession(await refreshIfNeeded(storedSession));
      } catch {
        setSession(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadSession();
  }, []);

  useEffect(() => {
    if (!session) return;

    const intervalId = setInterval(async () => {
      try {
        setSession(await refreshIfNeeded(session));
      } catch {
        await signOut();
        setSession(null);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [session]);

  const authStatus = useMemo<AuthStatus>(() => {
    if (!SUPABASE_CONFIGURED) return "not_configured";
    if (session) return "signed_in";
    return "signed_out";
  }, [session]);

  async function signIn(email: string, password: string) {
    if (!SUPABASE_CONFIGURED) {
      setAuthError("Configurá Supabase URL y anon key en app.json para activar login.");
      return null;
    }

    setAuthBusy(true);
    setAuthError(null);

    try {
      const nextSession = await signInWithPassword(email.trim(), password);
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      if (error instanceof Error && /confirm|verified|not confirmed/i.test(error.message)) {
        setAuthError("Tu cuenta todavía no está confirmada. Abrí el email de Supabase y después iniciá sesión.");
        return null;
      }

      setAuthError("No pudimos iniciar sesión. Revisá email, contraseña o configuración.");
      return null;
    } finally {
      setAuthBusy(false);
    }
  }

  async function signUp(email: string, password: string) {
    if (!SUPABASE_CONFIGURED) {
      setAuthError("Configurá Supabase URL y anon key en app.json para activar registro.");
      return null;
    }

    setAuthBusy(true);
    setAuthError(null);

    try {
      const nextSession = await signUpWithPassword(email.trim(), password);
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      if (error instanceof Error && error.message === "AUTH_EMAIL_CONFIRMATION_REQUIRED") {
        setAuthError("Cuenta creada. Revisá tu email para confirmar el registro y después iniciá sesión.");
        return null;
      }

      if (error instanceof Error && error.message) {
        setAuthError(`No pudimos crear la cuenta: ${error.message}`);
        return null;
      }

      setAuthError("No pudimos crear la cuenta. Revisá si el email ya existe o si Supabase requiere confirmación.");
      return null;
    } finally {
      setAuthBusy(false);
    }
  }

  async function logOut() {
    setAuthBusy(true);
    setAuthError(null);

    try {
      await signOut();
      setSession(null);
    } finally {
      setAuthBusy(false);
    }
  }

  return {
    session,
    user: session?.user ?? null,
    authStatus,
    authLoading,
    authBusy,
    authError,
    supabaseConfigured: SUPABASE_CONFIGURED,
    signIn,
    signUp,
    logOut,
  };
}

async function refreshIfNeeded(session: AuthSession) {
  const expiresAt = session.expiresAt ?? 0;
  const shouldRefresh = Boolean(session.refreshToken) && expiresAt - 90 < Math.floor(Date.now() / 1000);

  return shouldRefresh ? refreshStoredSession(session) : session;
}
