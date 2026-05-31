import type { SubscriptionTier } from "@/types/freemium";

export const FREE_LIMITS = {
  plansPerMonth: 3,
  coachMessagesPerMonth: 10,
  savedPlans: 1,
};

export const PRO_LIMITS = {
  plansPerMonth: 999,
  coachMessagesPerMonth: 999,
  savedPlans: 20,
};

export const PRO_FEATURES = [
  "Planes IA ilimitados",
  "Coach IA extendido",
  "Historial completo de 20 planes",
  "Favoritos y edición avanzada",
  "Tracking de progreso continuo",
  "Rutinas futuras adaptativas",
];

export const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: "FREE",
  pro: "PRO",
};
