import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type SystemStatusCardProps = {
  status: "checking" | "online" | "offline";
  name: string;
  url: string;
  onRefresh: () => void;
};

export function SystemStatusCard({ status, name, url, onRefresh }: SystemStatusCardProps) {
  const online = status === "online";
  const checking = status === "checking";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>SISTEMA</Text>
          <Text style={styles.title}>Backend IA</Text>
        </View>

        <View style={[styles.statusBadge, online ? styles.onlineBadge : styles.offlineBadge]}>
          {checking ? <ActivityIndicator color={Colors.dark.primary} /> : null}
          <Text style={styles.statusText}>
            {checking ? "CHECK" : online ? "ONLINE" : "OFFLINE"}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {online
          ? `${name} está respondiendo correctamente.`
          : "La app puede abrir, pero generación IA y coach necesitan el backend activo."}
      </Text>

      <Text style={styles.url}>{url}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Revisar estado del backend"
        onPress={onRefresh}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Revisar conexión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 26,
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
  statusBadge: {
    minWidth: 82,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  onlineBadge: {
    backgroundColor: Colors.dark.successSoft,
    borderColor: Colors.dark.successBorder,
    borderWidth: 1,
  },
  offlineBadge: {
    backgroundColor: Colors.dark.dangerSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
  },
  statusText: {
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
  url: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  button: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.surfaceStrong,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  buttonText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
