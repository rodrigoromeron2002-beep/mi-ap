import type { AuthSession } from "@/types/auth";
import type { EntitlementState } from "@/types/freemium";
import type { Plan } from "@/types/plan";
import type { ProgressEntry } from "@/types/progress";
import type { UserProfile } from "@/types/user";

import { supabaseDbRequest } from "./supabaseRest";

type SyncPayload = {
  session: AuthSession;
  profile: UserProfile;
  plans: Plan[];
  progressEntries: ProgressEntry[];
};

export async function syncUserData({
  session,
  profile,
  plans,
  progressEntries,
}: SyncPayload) {
  const accessToken = session.accessToken;
  const userId = session.user.id;

  await runSyncStep("perfil", () =>
    supabaseDbRequest("/profiles", {
      method: "POST",
      accessToken,
      prefer: "resolution=merge-duplicates",
      body: {
        id: userId,
        email: profile.email || session.user.email,
        name: profile.name,
        age_range: profile.ageRange,
        training_preference: profile.trainingPreference,
        health_note: profile.healthNote,
        accepted_health_disclaimer: profile.acceptedHealthDisclaimer,
        updated_at: new Date().toISOString(),
      },
    }),
  );

  if (plans.length > 0) {
    await runSyncStep("planes", () =>
      supabaseDbRequest("/plans", {
        method: "POST",
        accessToken,
        prefer: "resolution=merge-duplicates",
        body: plans.map((plan) => mapPlanToRow(userId, plan)),
      }),
    );
  }

  if (progressEntries.length > 0) {
    await runSyncStep("progreso", () =>
      supabaseDbRequest("/progress_entries", {
        method: "POST",
        accessToken,
        prefer: "resolution=merge-duplicates",
        body: progressEntries.map((entry) => mapProgressEntryToRow(userId, entry)),
      }),
    );
  }

}

async function runSyncStep<T>(label: string, action: () => Promise<T>) {
  try {
    return await action();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase request error";
    throw new Error(`Falló sincronización de ${label}: ${message}`);
  }
}

export async function upsertUserProfile(session: AuthSession, profile: UserProfile) {
  await supabaseDbRequest("/profiles", {
    method: "POST",
    accessToken: session.accessToken,
    prefer: "resolution=merge-duplicates",
    body: {
      id: session.user.id,
      email: profile.email || session.user.email,
      name: profile.name,
      age_range: profile.ageRange,
      training_preference: profile.trainingPreference,
      health_note: profile.healthNote,
      accepted_health_disclaimer: profile.acceptedHealthDisclaimer,
      updated_at: profile.updatedAt ?? new Date().toISOString(),
    },
  });
}

export async function upsertCloudPlan(session: AuthSession, plan: Plan) {
  await supabaseDbRequest("/plans", {
    method: "POST",
    accessToken: session.accessToken,
    prefer: "resolution=merge-duplicates",
    body: mapPlanToRow(session.user.id, plan),
  });
}

export async function deleteCloudPlan(session: AuthSession, planId: string) {
  await supabaseDbRequest(`/plans?id=eq.${encodeURIComponent(planId)}`, {
    method: "DELETE",
    accessToken: session.accessToken,
  });
}

export async function deleteAllCloudPlans(session: AuthSession) {
  await supabaseDbRequest(`/plans?user_id=eq.${encodeURIComponent(session.user.id)}`, {
    method: "DELETE",
    accessToken: session.accessToken,
  });
}

export async function upsertCloudProgressEntry(session: AuthSession, entry: ProgressEntry) {
  await supabaseDbRequest("/progress_entries", {
    method: "POST",
    accessToken: session.accessToken,
    prefer: "resolution=merge-duplicates",
    body: mapProgressEntryToRow(session.user.id, entry),
  });
}

export async function replaceCloudProgressEntries(
  session: AuthSession,
  entries: ProgressEntry[],
) {
  await supabaseDbRequest(`/progress_entries?user_id=eq.${encodeURIComponent(session.user.id)}`, {
    method: "DELETE",
    accessToken: session.accessToken,
  });

  if (entries.length === 0) return;

  await supabaseDbRequest("/progress_entries", {
    method: "POST",
    accessToken: session.accessToken,
    prefer: "resolution=merge-duplicates",
    body: entries.map((entry) => mapProgressEntryToRow(session.user.id, entry)),
  });
}

function mapPlanToRow(userId: string, plan: Plan) {
  return {
    id: plan.id,
    user_id: userId,
    goal: plan.goal,
    level: plan.level,
    days: Number(plan.days),
    place: plan.place,
    minutes: Number(plan.time),
    language: plan.language,
    routine: plan.routine,
    nutrition: plan.nutrition,
    mindset: plan.mindset,
    favorite: Boolean(plan.favorite),
    tags: plan.tags ?? [],
    created_at: plan.createdAt,
    updated_at: plan.updatedAt ?? plan.createdAt,
  };
}

function mapProgressEntryToRow(userId: string, entry: ProgressEntry) {
  return {
    id: entry.id,
    user_id: userId,
    plan_id: entry.planId ?? null,
    plan_goal: entry.planGoal ?? null,
    minutes: entry.minutes,
    note: entry.note ?? null,
    completed_at: entry.completedAt,
  };
}

type ProfileRow = {
  email?: string | null;
  name?: string | null;
  age_range?: string | null;
  training_preference?: string | null;
  health_note?: string | null;
  accepted_health_disclaimer?: boolean | null;
  updated_at?: string | null;
};

type PlanRow = {
  id: string;
  goal: string;
  level: string;
  days: number;
  place: string;
  minutes: number;
  language: Plan["language"];
  routine?: string | null;
  nutrition?: string | null;
  mindset?: string | null;
  favorite?: boolean | null;
  tags?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ProgressEntryRow = {
  id: string;
  plan_id?: string | null;
  plan_goal?: string | null;
  minutes: number;
  note?: string | null;
  completed_at?: string | null;
};

type EntitlementRow = {
  tier?: "free" | "pro" | null;
  plan_type?: "free" | "pro" | null;
  status?: "active" | "inactive" | "expired" | "trialing" | null;
  provider?: string | null;
  expires_at?: string | null;
  updated_at?: string | null;
};

export async function pullUserData(session: AuthSession) {
  const accessToken = session.accessToken;
  const userId = session.user.id;

  const [profiles, plans, progressEntries, entitlements] = await Promise.all([
    supabaseDbRequest<ProfileRow[]>(
      `/profiles?id=eq.${encodeURIComponent(userId)}&select=*`,
      { accessToken },
    ),
    supabaseDbRequest<PlanRow[]>(
      `/plans?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`,
      { accessToken },
    ),
    supabaseDbRequest<ProgressEntryRow[]>(
      `/progress_entries?user_id=eq.${encodeURIComponent(userId)}&select=*&order=completed_at.desc`,
      { accessToken },
    ),
    supabaseDbRequest<EntitlementRow[]>(
      `/entitlements?user_id=eq.${encodeURIComponent(userId)}&select=*`,
      { accessToken },
    ),
  ]);

  const profileRow = profiles[0];
  const entitlementRow = entitlements[0];

  return {
    profile: profileRow
      ? {
          email: profileRow.email ?? session.user.email ?? "",
          name: profileRow.name ?? "",
          ageRange: profileRow.age_range ?? "",
          trainingPreference: profileRow.training_preference ?? "",
          healthNote: profileRow.health_note ?? "",
          acceptedHealthDisclaimer: Boolean(profileRow.accepted_health_disclaimer),
          updatedAt: profileRow.updated_at ?? undefined,
        }
      : null,
    plans: plans.map((plan): Plan => ({
      id: plan.id,
      goal: plan.goal,
      level: plan.level,
      days: String(plan.days),
      place: plan.place,
      time: String(plan.minutes),
      language: plan.language,
      routine: plan.routine ?? "",
      nutrition: plan.nutrition ?? "",
      mindset: plan.mindset ?? "",
      favorite: Boolean(plan.favorite),
      tags: plan.tags ?? [],
      createdAt: plan.created_at ?? new Date().toISOString(),
      updatedAt: plan.updated_at ?? undefined,
    })),
    progressEntries: progressEntries.map((entry): ProgressEntry => ({
      id: entry.id,
      planId: entry.plan_id ?? undefined,
      planGoal: entry.plan_goal ?? undefined,
      minutes: entry.minutes,
      note: entry.note ?? undefined,
      completedAt: entry.completed_at ?? new Date().toISOString(),
    })),
    entitlement: {
      tier: entitlementRow?.tier === "pro" || entitlementRow?.plan_type === "pro" ? "pro" : "free",
      proActivatedAt:
        entitlementRow?.tier === "pro" || entitlementRow?.plan_type === "pro"
          ? entitlementRow.updated_at ?? undefined
          : undefined,
      source: entitlementRow?.provider === "revenuecat" ? "revenuecat" : "supabase",
      status: entitlementRow?.status ?? "active",
      expiresAt: entitlementRow?.expires_at ?? undefined,
    } satisfies EntitlementState,
  };
}
