export type SubscriptionTier = "free" | "pro";

export type UsageCounterKey = "plansGenerated" | "coachMessages";

export type MonthlyUsage = {
  monthKey: string;
  plansGenerated: number;
  coachMessages: number;
};

export type EntitlementState = {
  tier: SubscriptionTier;
  proActivatedAt?: string;
  source?: "local_cache" | "supabase" | "revenuecat" | "mock";
  status?: "active" | "inactive" | "expired" | "trialing";
  expiresAt?: string;
};

export type LimitCheck = {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
};
