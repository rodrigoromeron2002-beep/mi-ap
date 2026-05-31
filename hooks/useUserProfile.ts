import { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { upsertUserProfile } from "@/services/syncService";
import { DEFAULT_PROFILE, getUserProfile, saveUserProfile } from "@/storage/userStorage";
import type { UserProfile } from "@/types/user";

export function useUserProfile() {
  const auth = useAuthContext();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setProfile(await getUserProfile());
      } catch {
        setProfileError("No pudimos cargar tu perfil local.");
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, []);

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.ageRange,
      profile.trainingPreference,
      profile.healthNote,
    ];
    const completedFields = fields.filter((field) => field.trim().length > 0).length;
    const disclaimerPoint = profile.acceptedHealthDisclaimer ? 1 : 0;

    return Math.round(((completedFields + disclaimerPoint) / 6) * 100);
  }, [profile]);

  function updateProfileField<Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function persistProfile() {
    setProfileSaving(true);
    setProfileError(null);

    try {
      const updatedProfile = await saveUserProfile(profile);
      setProfile(updatedProfile);
      syncProfileIfOnline(updatedProfile);
      return updatedProfile;
    } catch {
      setProfileError("No pudimos guardar tu perfil. Intentá de nuevo.");
      return null;
    } finally {
      setProfileSaving(false);
    }
  }

  async function acceptHealthDisclaimer() {
    setProfileSaving(true);
    setProfileError(null);

    const acceptedProfile: UserProfile = {
      ...profile,
      acceptedHealthDisclaimer: true,
    };

    setProfile(acceptedProfile);

    try {
      const updatedProfile = await saveUserProfile(acceptedProfile);
      setProfile(updatedProfile);
      syncProfileIfOnline(updatedProfile);
      return updatedProfile;
    } catch {
      setProfileError("No pudimos guardar la aceptación del aviso. Intentá de nuevo.");
      return null;
    } finally {
      setProfileSaving(false);
    }
  }

  async function hydrateProfile(nextProfile: UserProfile) {
    setProfileSaving(true);
    setProfileError(null);

    try {
      const updatedProfile = await saveUserProfile(nextProfile);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch {
      setProfileError("No pudimos cargar el perfil cloud.");
      return null;
    } finally {
      setProfileSaving(false);
    }
  }

  return {
    profile,
    profileLoading,
    profileSaving,
    profileError,
    profileCompletion,
    updateProfileField,
    persistProfile,
    acceptHealthDisclaimer,
    hydrateProfile,
  };

  function syncProfileIfOnline(nextProfile: UserProfile) {
    if (!auth.session) return;
    upsertUserProfile(auth.session, nextProfile).catch(() => {
      // Local profile remains saved; cloud can be repaired from Cuenta > Subir.
    });
  }
}
