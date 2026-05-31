import { Pressable, StyleSheet, Text, View } from "react-native";

import { PRO_FEATURES } from "@/constants/freemium";
import { Colors } from "@/constants/theme";

type UpgradeCardProps = {
  title?: string;
  message?: string;
  buttonLabel?: string;
  compact?: boolean;
  onPress: () => void;
};

export function UpgradeCard({
  title = "Zentra PRO",
  message = "Desbloqueá más generación, coach extendido y límites pensados para uso real.",
  buttonLabel = "Ver PRO",
  compact,
  onPress,
}: UpgradeCardProps) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>FREEMIUM</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PRO</Text>
        </View>
      </View>

      <Text style={styles.message}>{message}</Text>

      {!compact ? (
        <View style={styles.features}>
          {PRO_FEATURES.slice(0, 4).map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver Zentra PRO"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  compactCard: {
    marginTop: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  eyebrow: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "900",
  },
  badge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: {
    color: Colors.dark.inverseText,
    fontSize: 11,
    fontWeight: "900",
  },
  message: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
  },
  features: {
    gap: 8,
    marginTop: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
  },
  featureText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  button: {
    marginTop: 16,
    backgroundColor: Colors.dark.primary,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.dark.inverseText,
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
