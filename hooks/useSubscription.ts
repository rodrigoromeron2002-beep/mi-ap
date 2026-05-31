import { useEffect, useMemo, useState } from "react";

import { FREE_LIMITS, PRO_LIMITS } from "@/constants/freemium";
import { getSubscriptionEntitlement, isProUser, startProPurchase } from "@/services/subscriptionService";
import {
  getEntitlementState,
  getMonthlyUsage,
  incrementMonthlyUsage,
  saveEntitlementState,
} from "@/storage/freemiumStorage";
import type { AuthSession } from "@/types/auth";
import type {
  EntitlementState,
  LimitCheck,
  MonthlyUsage,
  UsageCounterKey,
} from "@/types/freemium";

function createLimitCheck(used: number, limit: number): LimitCheck {
  return {
    allowed: used < limit,
    used,
    limit,
    remaining: Math.max(limit - used, 0),
  };
}

export function useSubscription(session: AuthSession | null) {
  const [usage, setUsage] = useState<MonthlyUsage>({
    monthKey: "",
    plansGenerated: 0,
    coachMessages: 0,
  });
  const [entitlement, setEntitlement] = useState<EntitlementState>({ tier: "free" });
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const isPro = isProUser(entitlement);
  const limits = isPro ? PRO_LIMITS : FREE_LIMITS;

  useEffect(() => {
    async function loadSubscriptionState() {
      try {
        const [loadedUsage, loadedEntitlement] = await Promise.all([
          getMonthlyUsage(),
          getEntitlementState(),
        ]);

        setUsage(loadedUsage);
        setEntitlement(loadedEntitlement);
      } finally {
        setSubscriptionLoading(false);
      }
    }

    loadSubscriptionState();
  }, []);

  useEffect(() => {
    async function refreshRemoteEntitlement() {
      if (!session) return;

      setSubscriptionLoading(true);
      try {
        const remoteEntitlement = await getSubscriptionEntitlement(session);
        await saveEntitlementState(remoteEntitlement);
        setEntitlement(remoteEntitlement);
      } finally {
        setSubscriptionLoading(false);
      }
    }

    refreshRemoteEntitlement();
  }, [session]);

  const planGenerationLimit = useMemo(
    () => createLimitCheck(usage.plansGenerated, limits.plansPerMonth),
    [limits.plansPerMonth, usage.plansGenerated],
  );

  const coachMessageLimit = useMemo(
    () => createLimitCheck(usage.coachMessages, limits.coachMessagesPerMonth),
    [limits.coachMessagesPerMonth, usage.coachMessages],
  );

  function canSavePlan(savedPlansCount: number) {
    return createLimitCheck(savedPlansCount, limits.savedPlans);
  }

  async function recordUsage(counter: UsageCounterKey) {
    if (isPro) return usage;

    const updatedUsage = await incrementMonthlyUsage(counter, usage);
    setUsage(updatedUsage);
    return updatedUsage;
  }

  async function hydrateEntitlement(nextEntitlement: EntitlementState) {
    await saveEntitlementState(nextEntitlement);
    setEntitlement(nextEntitlement);
  }

  async function refreshEntitlement() {
    const remoteEntitlement = await getSubscriptionEntitlement(session);
    await hydrateEntitlement(remoteEntitlement);
    return remoteEntitlement;
  }

  async function startProCheckout() {
    return startProPurchase();
  }

  return {
    usage,
    entitlement,
    tier: entitlement.tier,
    isPro,
    limits,
    subscriptionLoading,
    planGenerationLimit,
    coachMessageLimit,
    canSavePlan,
    recordUsage,
    hydrateEntitlement,
    refreshEntitlement,
    startProCheckout,
  };
}
