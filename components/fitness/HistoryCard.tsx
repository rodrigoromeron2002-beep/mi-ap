import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { Plan } from "@/types/plan";

type HistoryCardProps = {
  plan: Plan;
  onOpen: (plan: Plan) => void;
  onDelete: (planId: string) => void;
  onToggleFavorite: (planId: string) => void;
};

export function HistoryCard({ plan, onOpen, onDelete, onToggleFavorite }: HistoryCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir plan ${plan.goal}`}
        onPress={() => onOpen(plan)}
        style={({ pressed }) => [styles.openButton, pressed && styles.openButtonPressed]}
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{plan.goal}</Text>
            {plan.favorite ? <Text style={styles.favoriteMark}>★</Text> : null}
          </View>
          <Text style={styles.meta}>
            {plan.level} · {plan.place} · {plan.days} días · {plan.time} min
          </Text>
          {plan.tags && plan.tags.length > 0 && (
            <View style={styles.tags}>
              {plan.tags.slice(0, 3).map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.date}>{new Date(plan.createdAt).toLocaleDateString("es-ES")}</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={plan.favorite ? "Quitar plan de favoritos" : "Marcar plan como favorito"}
        onPress={() => onToggleFavorite(plan.id)}
        style={styles.favoriteButton}
      >
        <Text style={styles.favoriteButtonText}>{plan.favorite ? "★" : "☆"}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Borrar plan ${plan.goal}`}
        onPress={() => onDelete(plan.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Borrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...(Platform.select({
      ios: {
        shadowColor: Colors.dark.background,
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 3,
      },
    }) ?? {}),
  },
  openButton: {
    flex: 1,
  },
  openButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "900",
  },
  favoriteMark: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  meta: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "700",
  },
  date: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    marginTop: 4,
    fontWeight: "700",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tag: {
    color: Colors.dark.textSecondary,
    backgroundColor: Colors.dark.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: "900",
  },
  favoriteButton: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    width: 38,
    height: 38,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonText: {
    color: Colors.dark.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  deleteButton: {
    backgroundColor: Colors.dark.dangerSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  deleteText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "900",
  },
});
