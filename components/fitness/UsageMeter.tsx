import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { LimitCheck } from "@/types/freemium";

type UsageMeterProps = {
  label: string;
  check: LimitCheck;
  isPro: boolean;
};

export function UsageMeter({ label, check, isPro }: UsageMeterProps) {
  const progress = isPro ? 1 : Math.min(check.used / check.limit, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {isPro ? "PRO" : `${check.used}/${check.limit}`}
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.bar, { width: `${progress * 100}%` }]} />
      </View>

      {!isPro ? (
        <Text style={styles.hint}>
          {check.remaining > 0
            ? `Te quedan ${check.remaining} este mes.`
            : "Límite mensual alcanzado."}
        </Text>
      ) : (
        <Text style={styles.hint}>Uso extendido activo.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 18,
    padding: 13,
    marginTop: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  value: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  track: {
    height: 8,
    backgroundColor: Colors.dark.overlay,
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 9,
  },
  bar: {
    height: "100%",
    backgroundColor: Colors.dark.primary,
    borderRadius: 999,
  },
  hint: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
});
