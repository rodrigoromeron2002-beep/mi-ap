import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthSession } from "@/types/auth";

const STORAGE_KEY = "@zentra_auth_session";
const LEGACY_STORAGE_KEY = "@forja_auth_session";

export async function getStoredSession(): Promise<AuthSession | null> {
  const rawSession = await getMigratedItem(STORAGE_KEY, LEGACY_STORAGE_KEY);

  if (!rawSession) return null;

  const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>;

  if (!parsedSession.accessToken || !parsedSession.user?.id) {
    return null;
  }

  return parsedSession as AuthSession;
}

export async function saveStoredSession(session: AuthSession) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredSession() {
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
