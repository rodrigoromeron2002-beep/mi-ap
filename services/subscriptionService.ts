import { DEV_UNLOCK_PRO } from "@/constants/devFlags";
import type { AuthSession } from "@/types/auth";
import type { EntitlementState } from "@/types/freemium";

import { supabaseDbRequest } from "./supabaseRest";

type EntitlementRow = {
  tier?: "free" | "pro" | null;
  plan_type?: "free" | "pro" | null;
  status?: "active" | "inactive" | "expired" | "trialing" | null;
  provider?: string | null;
  product_id?: string | null;
  expires_at?: string | null;
  updated_at?: string | null;
};

export function isProUser(entitlement: EntitlementState) {
  if (DEV_UNLOCK_PRO) return true;

  if (entitlement.tier !== "pro") return false;
  if (entitlement.status && !["active", "trialing"].includes(entitlement.status)) return false;

  if (entitlement.expiresAt) {
    return new Date(entitlement.expiresAt).getTime() > Date.now();
  }

  return true;
}

export async function getSubscriptionEntitlement(
  session: AuthSession | null,
): Promise<EntitlementState> {
  if (DEV_UNLOCK_PRO) {
    return {
      tier: "pro",
      proActivatedAt: new Date().toISOString(),
      source: "mock",
      status: "active",
    };
  }

  if (!session) {
    return {
      tier: "free",
      source: "local_cache",
      status: "active",
    };
  }

  const rows = await supabaseDbRequest<EntitlementRow[]>(
    `/entitlements?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`,
    { accessToken: session.accessToken },
  );
  const row = rows[0];

  if (!row) {
    return {
      tier: "free",
      source: "supabase",
      status: "active",
    };
  }

  const tier = row.tier === "pro" || row.plan_type === "pro" ? "pro" : "free";

  return {
    tier,
    proActivatedAt: tier === "pro" ? row.updated_at ?? undefined : undefined,
    source: row.provider === "revenuecat" ? "revenuecat" : "supabase",
    status: row.status ?? "active",
    expiresAt: row.expires_at ?? undefined,
  };
}

export async function startProPurchase() {
  // RevenueCat se conecta aca cuando existan productos reales en App Store/Play Store.
  // El frontend nunca debe escribir PRO en Supabase: RevenueCat/backend actualiza entitlements.
  throw new Error("REVENUECAT_NOT_CONFIGURED");
}
