import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserProfile } from "@/types/user";

const STORAGE_KEY = "@zentra_user_profile";
const LEGACY_STORAGE_KEY = "@forja_user_profile";

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  ageRange: "",
  trainingPreference: "",
  healthNote: "",
  acceptedHealthDisclaimer: false,
};

export async function getUserProfile(): Promise<UserProfile> {
  const rawProfile = await getMigratedItem(STORAGE_KEY, LEGACY_STORAGE_KEY);
  const parsedProfile = rawProfile ? (JSON.parse(rawProfile) as Partial<UserProfile>) : {};

  return {
    ...DEFAULT_PROFILE,
    ...parsedProfile,
    acceptedHealthDisclaimer: Boolean(parsedProfile.acceptedHealthDisclaimer),
  };
}

export async function saveUserProfile(profile: UserProfile) {
  const updatedProfile: UserProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
  return updatedProfile;
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
