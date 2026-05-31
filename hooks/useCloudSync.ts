import { useState } from "react";

import { pullUserData, syncUserData } from "@/services/syncService";
import type { AuthSession } from "@/types/auth";
import type { Plan } from "@/types/plan";
import type { ProgressEntry } from "@/types/progress";
import type { UserProfile } from "@/types/user";

export function useCloudSync() {
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastPulledAt, setLastPulledAt] = useState<string | null>(null);

  async function syncNow({
    session,
    profile,
    plans,
    progressEntries,
  }: {
    session: AuthSession | null;
    profile: UserProfile;
    plans: Plan[];
    progressEntries: ProgressEntry[];
  }) {
    if (!session || syncing) return false;

    setSyncing(true);
    setSyncError(null);

    try {
      await syncUserData({
        session,
        profile,
        plans,
        progressEntries,
      });

      setLastSyncedAt(new Date().toISOString());
      return true;
    } catch {
      setSyncError("No pudimos sincronizar con Supabase. Revisá tablas, RLS y credenciales.");
      return false;
    } finally {
      setSyncing(false);
    }
  }

  async function pullNow(session: AuthSession | null) {
    if (!session || pulling) return null;

    setPulling(true);
    setSyncError(null);

    try {
      const cloudData = await pullUserData(session);
      setLastPulledAt(new Date().toISOString());
      return cloudData;
    } catch {
      setSyncError("No pudimos traer datos desde Supabase. Revisá tablas, RLS y credenciales.");
      return null;
    } finally {
      setPulling(false);
    }
  }

  return {
    syncing,
    pulling,
    syncError,
    lastSyncedAt,
    lastPulledAt,
    syncNow,
    pullNow,
  };
}
