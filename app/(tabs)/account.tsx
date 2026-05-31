import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from "react-native";

import { AccountProfileCard } from "@/components/fitness/AccountProfileCard";
import { AppScreen } from "@/components/fitness/AppScreen";
import { AuthCard } from "@/components/fitness/AuthCard";
import { CloudSyncCard } from "@/components/fitness/CloudSyncCard";
import { LaunchChecklist } from "@/components/fitness/LaunchChecklist";
import { SystemStatusCard } from "@/components/fitness/SystemStatusCard";
import { StatusFeedback } from "@/components/ux/StatusFeedback";
import { Colors } from "@/constants/theme";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePlansContext } from "@/contexts/PlansContext";
import { useProgressContext } from "@/contexts/ProgressContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { useCloudSync } from "@/hooks/useCloudSync";

export default function AccountScreen() {
  const profile = useUserProfileContext();
  const subscription = useSubscriptionContext();
  const plans = usePlansContext();
  const progress = useProgressContext();
  const backend = useBackendHealth();
  const auth = useAuthContext();
  const cloudSync = useCloudSync();

  async function pullCloudData() {
    const cloudData = await cloudSync.pullNow(auth.session);
    if (!cloudData) return;

    if (cloudData.profile) {
      await profile.hydrateProfile(cloudData.profile);
    }

    await plans.hydratePlans(cloudData.plans);
    await progress.hydrateProgress(cloudData.progressEntries);
    await subscription.hydrateEntitlement(cloudData.entitlement);
  }

  function confirmPullCloudData() {
    const title = "Traer datos cloud";
    const message =
      "Esto reemplaza los datos locales por lo que exista en Supabase. Usalo si querés recuperar o sincronizar desde la nube.";

    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        pullCloudData();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Traer datos", onPress: pullCloudData },
    ]);
  }

  return (
    <AppScreen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Zentra</Text>
        <Text style={styles.title}>Cuenta y preparación</Text>
        <Text style={styles.description}>
          Esta pantalla prepara la transición a usuario real, sincronización, pagos y publicación.
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{subscription.tier.toUpperCase()}</Text>
            <Text style={styles.badgeLabel}>plan</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{profile.profileCompletion}%</Text>
            <Text style={styles.badgeLabel}>perfil</Text>
          </View>
        </View>
      </View>

      <AuthCard
        configured={auth.supabaseConfigured}
        status={auth.authStatus}
        email={auth.user?.email}
        busy={auth.authBusy}
        error={auth.authError}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onSignOut={auth.logOut}
      />

      <CloudSyncCard
        enabled={Boolean(auth.session)}
        syncing={cloudSync.syncing}
        pulling={cloudSync.pulling}
        error={cloudSync.syncError}
        lastSyncedAt={cloudSync.lastSyncedAt}
        lastPulledAt={cloudSync.lastPulledAt}
        onSync={() =>
          cloudSync.syncNow({
            session: auth.session,
            profile: profile.profile,
            plans: plans.savedPlans,
            progressEntries: progress.entries,
          })
        }
        onPull={confirmPullCloudData}
      />

      {profile.profileLoading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={Colors.dark.primary} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      ) : (
        <AccountProfileCard
          profile={profile.profile}
          completion={profile.profileCompletion}
          saving={profile.profileSaving}
          error={profile.profileError}
          onChange={profile.updateProfileField}
          onSave={profile.persistProfile}
          onAcceptDisclaimer={profile.acceptHealthDisclaimer}
        />
      )}

      <SystemStatusCard
        status={backend.backendStatus}
        name={backend.backendName}
        url={backend.backendUrl}
        onRefresh={backend.refreshBackendStatus}
      />

      {!profile.profile.acceptedHealthDisclaimer ? (
        <StatusFeedback
          tone="warning"
          title="Aviso pendiente"
          message="Aceptá el aviso de salud antes de tratar Zentra como una beta lista para usuarios externos."
        />
      ) : (
        <StatusFeedback
          tone="success"
          title="Base legal inicial cubierta"
          message="El aviso de salud está aceptado localmente. Para producción faltan términos y privacidad finales."
        />
      )}

      <LaunchChecklist />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 30,
    padding: 20,
  },
  eyebrow: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: "900",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  badge: {
    flex: 1,
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
  },
  badgeValue: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: "900",
  },
  badgeLabel: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 3,
  },
  loadingCard: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    alignItems: "center",
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 10,
  },
});
