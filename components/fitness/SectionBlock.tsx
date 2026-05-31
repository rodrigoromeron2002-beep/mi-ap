import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/theme";

type SectionBlockProps = {
  eyebrow: string;
  title: string;
  count?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionBlock({
  eyebrow,
  title,
  count,
  actionLabel,
  onActionPress,
}: SectionBlockProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.actions}>
        {count ? <Text style={styles.count}>{count}</Text> : null}

        {actionLabel && onActionPress ? (
          <Pressable onPress={onActionPress} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
    letterSpacing: 0,
  },
  actions: {
    alignItems: "flex-end",
    gap: 8,
  },
  count: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
  },
  actionButton: {
    backgroundColor: Colors.dark.dangerSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  actionText: {
    color: Colors.dark.danger,
    fontSize: 11,
    fontWeight: "900",
  },
});
