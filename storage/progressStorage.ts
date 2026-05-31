import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ProgressEntry } from "@/types/progress";

const STORAGE_KEY = "@zentra_progress_entries";
const LEGACY_STORAGE_KEY = "@forja_progress_entries";
const MAX_PROGRESS_ENTRIES = 120;

export async function getProgressEntries(): Promise<ProgressEntry[]> {
  const rawEntries = await getMigratedItem(STORAGE_KEY, LEGACY_STORAGE_KEY);
  const parsedEntries: unknown = rawEntries ? JSON.parse(rawEntries) : [];

  return Array.isArray(parsedEntries) ? (parsedEntries as ProgressEntry[]) : [];
}

export async function saveProgressEntries(entries: ProgressEntry[]) {
  const cappedEntries = entries.slice(0, MAX_PROGRESS_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cappedEntries));
}

export async function addProgressEntry(newEntry: ProgressEntry, currentEntries: ProgressEntry[]) {
  const updatedEntries = [newEntry, ...currentEntries].slice(0, MAX_PROGRESS_ENTRIES);
  await saveProgressEntries(updatedEntries);
  return updatedEntries;
}

export async function replaceProgressEntries(entries: ProgressEntry[]) {
  await saveProgressEntries(entries);
  return entries;
}

export async function clearProgressEntries() {
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
