import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { Reveal } from "@/components/ux/Reveal";

type StatusFeedbackProps = {
  tone: "warning" | "error" | "success";
  title: string;
  message: string;
};

export function StatusFeedback({ tone, title, message }: StatusFeedbackProps) {
  const palette = palettes[tone];

  return (
    <Reveal distance={8}>
      <View
        accessibilityRole={tone === "error" || tone === "warning" ? "alert" : "summary"}
        style={[
          styles.box,
          {
            backgroundColor: palette.background,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: palette.accent }]} />
        <View style={styles.copy}>
          <Text style={[styles.title, { color: palette.title }]}>{title}</Text>
          <Text style={[styles.message, { color: palette.message }]}>{message}</Text>
        </View>
      </View>
    </Reveal>
  );
}

const palettes = {
  warning: {
    background: Colors.dark.warningSoft,
    border: Colors.dark.primaryBorder,
    accent: Colors.dark.warning,
    title: Colors.dark.text,
    message: Colors.dark.textSecondary,
  },
  error: {
    background: Colors.dark.dangerSoft,
    border: Colors.dark.dangerBorder,
    accent: Colors.dark.danger,
    title: Colors.dark.danger,
    message: Colors.dark.textSecondary,
  },
  success: {
    background: Colors.dark.successSoft,
    border: Colors.dark.successBorder,
    accent: Colors.dark.success,
    title: Colors.dark.success,
    message: Colors.dark.textSecondary,
  },
};

const styles = StyleSheet.create({
  box: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    marginTop: 5,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 3,
  },
});
