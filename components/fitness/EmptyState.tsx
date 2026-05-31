import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { Reveal } from "@/components/ux/Reveal";

type EmptyStateProps = {
  variant: "plan" | "history";
};

export function EmptyState({ variant }: EmptyStateProps) {
  const content = variant === "plan" ? planContent : historyContent;

  return (
    <Reveal>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{content.icon}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.text}>{content.text}</Text>
          </View>
        </View>

        <View style={styles.steps}>
          {content.points.map((point) => (
            <View key={point} style={styles.point}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
    </Reveal>
  );
}

const planContent = {
  icon: "01",
  title: "Tu plan aparece acá",
  text: "Cuando generes tu estrategia, Zentra la convierte en una guía clara para ejecutar.",
  points: ["Rutina adaptada", "Nutrición simple", "Mindset accionable"],
};

const historyContent = {
  icon: "02",
  title: "Historial listo para crecer",
  text: "Cada plan generado se guarda automáticamente para que compares enfoques y vuelvas al mejor.",
  points: ["Hasta 20 planes", "Acceso rápido", "Borrado individual"],
};

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: Colors.dark.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  copy: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "900",
  },
  text: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  steps: {
    marginTop: 15,
    gap: 8,
  },
  point: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
  },
  pointText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },
});
