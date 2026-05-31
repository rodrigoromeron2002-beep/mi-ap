import { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  replaceCloudProgressEntries,
  upsertCloudProgressEntry,
} from "@/services/syncService";
import {
  addProgressEntry,
  getProgressEntries,
  replaceProgressEntries,
} from "@/storage/progressStorage";
import type { Plan } from "@/types/plan";
import type { ProgressEntry, ProgressStats } from "@/types/progress";

function createEntryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sortEntries(entries: ProgressEntry[]) {
  return [...entries].sort(
    (first, second) =>
      new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime(),
  );
}

function getStats(entries: ProgressEntry[]): ProgressStats {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const uniqueDays = new Set(entries.map((entry) => toLocalDateKey(new Date(entry.completedAt))));

  let currentStreak = 0;
  const cursor = new Date(now);
  const todayKey = toLocalDateKey(now);

  if (!uniqueDays.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (uniqueDays.has(toLocalDateKey(cursor))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const orderedEntries = sortEntries(entries);

  return {
    totalSessions: entries.length,
    weeklySessions: entries.filter((entry) => new Date(entry.completedAt) >= startOfWeek).length,
    totalMinutes: entries.reduce((total, entry) => total + entry.minutes, 0),
    currentStreak,
    lastCompletedAt: orderedEntries[0]?.completedAt,
  };
}

export function useProgress(plan: Plan | null) {
  const auth = useAuthContext();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setEntries(sortEntries(await getProgressEntries()));
      } catch {
        setProgressError("No pudimos cargar tu progreso local.");
      }
    }

    loadProgress();
  }, []);

  const stats = useMemo(() => getStats(entries), [entries]);

  async function completeSession(minutes?: number, note?: string) {
    if (progressLoading) return null;

    const parsedMinutes = Number(minutes ?? plan?.time ?? 45);
    const safeMinutes = Number.isFinite(parsedMinutes)
      ? Math.max(5, Math.min(240, Math.round(parsedMinutes)))
      : 45;

    const entry: ProgressEntry = {
      id: createEntryId(),
      planId: plan?.id,
      planGoal: plan?.goal,
      minutes: safeMinutes,
      note,
      completedAt: new Date().toISOString(),
    };

    setProgressLoading(true);
    setProgressError(null);

    try {
      const updatedEntries = await addProgressEntry(entry, entries);
      setEntries(updatedEntries);
      syncProgressEntryIfOnline(entry);
      return entry;
    } catch {
      setProgressError("No pudimos guardar la sesión. Intentá de nuevo.");
      return null;
    } finally {
      setProgressLoading(false);
    }
  }

  async function resetWeeklyProgress() {
    if (progressLoading) return false;

    const startOfWeek = getStartOfWeek(new Date());
    const updatedEntries = entries.filter(
      (entry) => new Date(entry.completedAt) < startOfWeek,
    );

    setProgressLoading(true);
    setProgressError(null);

    try {
      const savedEntries = await replaceProgressEntries(updatedEntries);
      setEntries(sortEntries(savedEntries));
      replaceCloudProgressIfOnline(savedEntries);
      return true;
    } catch {
      setProgressError("No pudimos reiniciar la adherencia semanal. Intentá de nuevo.");
      return false;
    } finally {
      setProgressLoading(false);
    }
  }

  async function hydrateProgress(nextEntries: ProgressEntry[]) {
    setProgressLoading(true);
    setProgressError(null);

    try {
      const savedEntries = await replaceProgressEntries(sortEntries(nextEntries));
      setEntries(sortEntries(savedEntries));
    } catch {
      setProgressError("No pudimos cargar el progreso cloud.");
    } finally {
      setProgressLoading(false);
    }
  }

  return {
    entries,
    stats,
    progressLoading,
    progressError,
    completeSession,
    resetWeeklyProgress,
    hydrateProgress,
  };

  function syncProgressEntryIfOnline(entry: ProgressEntry) {
    if (!auth.session) return;
    upsertCloudProgressEntry(auth.session, entry).catch(() => {
      // Local progress stays saved; cloud can be repaired from Cuenta > Subir.
    });
  }

  function replaceCloudProgressIfOnline(nextEntries: ProgressEntry[]) {
    if (!auth.session) return;
    replaceCloudProgressEntries(auth.session, nextEntries).catch(() => {
      // Local reset already succeeded; cloud can be repaired from Cuenta > Subir.
    });
  }
}
