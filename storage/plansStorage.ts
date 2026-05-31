import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Plan } from "../types/plan";

const STORAGE_KEY = "@zentra_saved_plans";
const LEGACY_STORAGE_KEY = "@forja_saved_plans";
const MAX_SAVED_PLANS = 20;

export async function getSavedPlans(): Promise<Plan[]> {
  const rawPlans = await getMigratedItem(STORAGE_KEY, LEGACY_STORAGE_KEY);
  const parsedPlans: unknown = rawPlans ? JSON.parse(rawPlans) : [];

  return Array.isArray(parsedPlans) ? parsedPlans.map(normalizePlan) : [];
}

export async function savePlans(plans: Plan[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans.slice(0, MAX_SAVED_PLANS)));
}

export async function replaceSavedPlans(plans: Plan[]) {
  const normalizedPlans = plans.map(normalizePlan).slice(0, MAX_SAVED_PLANS);
  await savePlans(normalizedPlans);
  return normalizedPlans;
}

export async function addSavedPlan(newPlan: Plan, currentPlans: Plan[]) {
  const updatedPlans = [newPlan, ...currentPlans].slice(0, MAX_SAVED_PLANS);
  await savePlans(updatedPlans);
  return updatedPlans;
}

export async function deleteSavedPlan(planId: string, currentPlans: Plan[]) {
  const updatedPlans = currentPlans.filter((item) => item.id !== planId);
  await savePlans(updatedPlans);
  return updatedPlans;
}

export async function updateSavedPlan(updatedPlan: Plan, currentPlans: Plan[]) {
  const updatedPlans = currentPlans.map((item) =>
    item.id === updatedPlan.id ? updatedPlan : item
  );
  await savePlans(updatedPlans);
  return updatedPlans;
}

export async function clearSavedPlans() {
  await AsyncStorage.multiRemove([STORAGE_KEY, LEGACY_STORAGE_KEY]);
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

function normalizePlan(plan: Plan): Plan {
  return {
    ...plan,
    favorite: Boolean(plan.favorite),
    tags: Array.isArray(plan.tags) && plan.tags.length > 0
      ? plan.tags
      : [plan.goal, plan.level, plan.place].filter(Boolean),
  };
}
