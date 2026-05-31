import AsyncStorage from "@react-native-async-storage/async-storage";

import type { EntitlementState, MonthlyUsage, UsageCounterKey } from "@/types/freemium";

const USAGE_STORAGE_KEY = "@zentra_monthly_usage";
const ENTITLEMENT_STORAGE_KEY = "@zentra_entitlement";
const LEGACY_USAGE_STORAGE_KEY = "@forja_monthly_usage";
const LEGACY_ENTITLEMENT_STORAGE_KEY = "@forja_entitlement";

export function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function createEmptyUsage(monthKey = getCurrentMonthKey()): MonthlyUsage {
  return {
    monthKey,
    plansGenerated: 0,
    coachMessages: 0,
  };
}

export async function getMonthlyUsage(): Promise<MonthlyUsage> {
  const currentMonthKey = getCurrentMonthKey();
  const rawUsage = await getMigratedItem(USAGE_STORAGE_KEY, LEGACY_USAGE_STORAGE_KEY);
  const parsedUsage = rawUsage ? (JSON.parse(rawUsage) as Partial<MonthlyUsage>) : null;

  if (!parsedUsage || parsedUsage.monthKey !== currentMonthKey) {
    return createEmptyUsage(currentMonthKey);
  }

  return {
    monthKey: currentMonthKey,
    plansGenerated: Number(parsedUsage.plansGenerated ?? 0),
    coachMessages: Number(parsedUsage.coachMessages ?? 0),
  };
}

export async function saveMonthlyUsage(usage: MonthlyUsage) {
  await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
}

export async function incrementMonthlyUsage(counter: UsageCounterKey, currentUsage: MonthlyUsage) {
  const currentMonthKey = getCurrentMonthKey();
  const baseUsage =
    currentUsage.monthKey === currentMonthKey ? currentUsage : createEmptyUsage(currentMonthKey);
  const updatedUsage: MonthlyUsage = {
    ...baseUsage,
    monthKey: currentMonthKey,
    [counter]: baseUsage[counter] + 1,
  };

  await saveMonthlyUsage(updatedUsage);
  return updatedUsage;
}

export async function getEntitlementState(): Promise<EntitlementState> {
  const rawEntitlement = await getMigratedItem(
    ENTITLEMENT_STORAGE_KEY,
    LEGACY_ENTITLEMENT_STORAGE_KEY
  );
  const parsedEntitlement = rawEntitlement
    ? (JSON.parse(rawEntitlement) as Partial<EntitlementState>)
    : null;

  return {
    tier: parsedEntitlement?.tier === "pro" ? "pro" : "free",
    proActivatedAt: parsedEntitlement?.proActivatedAt,
  };
}

export async function saveEntitlementState(entitlement: EntitlementState) {
  await AsyncStorage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(entitlement));
}

async function getMigratedItem(storageKey: string, legacyStorageKey: string) {
  const currentValue = await AsyncStorage.getItem(storageKey);
  if (currentValue) return currentValue;

  const legacyValue = await AsyncStorage.getItem(legacyStorageKey);
  if (legacyValue) {
    await AsyncStorage.setItem(storageKey, legacyValue);
  }

  return legacyValue;
}
