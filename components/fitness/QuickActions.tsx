import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius } from "@/constants/theme";

type QuickActionsProps = {
  onProgress: () => void;
  onPro: () => void;
};

export function QuickActions({ onProgress, onPro }: QuickActionsProps) {
  return (
    <View style={styles.grid}>
      <ActionCard
        eyebrow="TRACKING"
        title="Progreso"
        text="Revisá adherencia, racha y sesiones."
        onPress={onProgress}
      />
      <ActionCard
        eyebrow="UPGRADE"
        title="Zentra PRO"
        text="Límites, uso mensual y monetización."
        onPress={onPro}
        highlighted
      />
    </View>
  );
}

function ActionCard({
  eyebrow,
  title,
  text,
  highlighted,
  onPress,
}: {
  eyebrow: string;
  title: string;
  text: string;
  highlighted?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        highlighted && styles.cardHighlighted,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  card: {
    flex: 1,
    minWidth: 138,
    minHeight: 132,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: 14,
    justifyContent: "space-between",
  },
  cardHighlighted: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
  },
  eyebrow: {
    color: Colors.dark.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  text: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
