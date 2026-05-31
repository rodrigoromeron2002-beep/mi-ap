import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius } from "@/constants/theme";

type CloudSyncCardProps = {
  enabled: boolean;
  syncing: boolean;
  pulling: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  lastPulledAt: string | null;
  onSync: () => void;
  onPull: () => void;
};

export function CloudSyncCard({
  enabled,
  syncing,
  pulling,
  error,
  lastSyncedAt,
  lastPulledAt,
  onSync,
  onPull,
}: CloudSyncCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>CLOUD</Text>
          <Text style={styles.title}>Sync Supabase</Text>
        </View>
        <View style={[styles.badge, enabled && styles.badgeEnabled]}>
          <Text style={styles.badgeText}>{enabled ? "READY" : "LOCAL"}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {enabled
          ? "Sincronizá perfil, planes, progreso y estado PRO con el backend."
          : "Iniciá sesión para activar sincronización cloud. AsyncStorage sigue funcionando localmente."}
      </Text>

      {lastSyncedAt ? (
        <Text style={styles.meta}>
          Subido: {new Date(lastSyncedAt).toLocaleString("es-ES")}
        </Text>
      ) : null}

      {lastPulledAt ? (
        <Text style={styles.meta}>
          Descargado: {new Date(lastPulledAt).toLocaleString("es-ES")}
        </Text>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Subir datos a Supabase"
          disabled={!enabled || syncing || pulling}
          onPress={onSync}
          style={({ pressed }) => [
            styles.button,
            pressed && enabled && styles.pressed,
            (!enabled || syncing || pulling) && styles.disabled,
          ]}
        >
          {syncing ? (
            <ActivityIndicator color={Colors.dark.inverseText} />
          ) : (
            <Text style={styles.buttonText}>Subir</Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Traer datos desde Supabase"
          disabled={!enabled || syncing || pulling}
          onPress={onPull}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && enabled && styles.pressed,
            (!enabled || syncing || pulling) && styles.disabled,
          ]}
        >
          {pulling ? (
            <ActivityIndicator color={Colors.dark.textSecondary} />
          ) : (
            <Text style={styles.secondaryButtonText}>Traer</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "900",
  },
  badge: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  badgeEnabled: {
    backgroundColor: Colors.dark.successSoft,
    borderColor: Colors.dark.successBorder,
  },
  badgeText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  meta: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 9,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  button: {
    flex: 1,
    minWidth: 118,
    backgroundColor: Colors.dark.primary,
    borderRadius: Radius.pill,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  secondaryButton: {
    flex: 1,
    minWidth: 118,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.48,
  },
});
