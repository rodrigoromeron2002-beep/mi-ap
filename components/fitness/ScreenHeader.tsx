import { StyleSheet, Text, View } from "react-native";

import { Reveal } from "@/components/ux/Reveal";
import { Colors, Radius } from "@/constants/theme";

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  rightLabel?: string;
};

export function ScreenHeader({ eyebrow, title, description, rightLabel }: ScreenHeaderProps) {
  return (
    <Reveal distance={10}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {rightLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{rightLabel}</Text>
          </View>
        ) : null}
      </View>
    </Reveal>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    minWidth: 0,
  },
  copy: {
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
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginTop: 9,
  },
  badge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
    maxWidth: 96,
  },
  badgeText: {
    color: Colors.dark.inverseText,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
});
