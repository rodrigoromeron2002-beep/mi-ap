import { Platform, Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/fitness/EmptyState";
import { HistoryCard } from "@/components/fitness/HistoryCard";
import { SectionBlock } from "@/components/fitness/SectionBlock";
import { Colors } from "@/constants/theme";
import type { HistorySortMode, Plan } from "@/types/plan";

type HistoryListProps = {
  savedPlans: Plan[];
  sortedSavedPlans: Plan[];
  historySortMode: HistorySortMode;
  setHistorySortMode: (mode: HistorySortMode) => void;
  onOpen: (plan: Plan) => void;
  onDelete: (planId: string) => Promise<void>;
  onToggleFavorite: (planId: string) => Promise<Plan | null>;
  onClear: () => Promise<void>;
};

export function HistoryList({
  savedPlans,
  sortedSavedPlans,
  historySortMode,
  setHistorySortMode,
  onOpen,
  onDelete,
  onToggleFavorite,
  onClear,
}: HistoryListProps) {
  async function confirmDeletePlan(planId: string) {
    if (Platform.OS === "web") {
      if (window.confirm("¿Seguro que querés borrar este plan?")) {
        await onDelete(planId);
      }
      return;
    }

    Alert.alert("Eliminar plan", "¿Seguro que querés borrar este plan del historial?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => onDelete(planId) },
    ]);
  }

  async function confirmClearHistory() {
    if (savedPlans.length === 0) return;

    if (Platform.OS === "web") {
      if (window.confirm("¿Seguro que querés borrar todo el historial?")) {
        await onClear();
      }
      return;
    }

    Alert.alert("Borrar historial", "¿Seguro que querés eliminar todos los planes guardados?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar todo", style: "destructive", onPress: onClear },
    ]);
  }

  return (
    <>
      <SectionBlock
        eyebrow="GUARDADOS"
        title="Historial reciente"
        count={`${savedPlans.length}/20`}
        actionLabel={savedPlans.length > 0 ? "Limpiar" : undefined}
        onActionPress={savedPlans.length > 0 ? confirmClearHistory : undefined}
      />

      {savedPlans.length > 1 && (
        <View style={styles.sortRow}>
          <SortChip
            label="Recientes"
            active={historySortMode === "recent"}
            onPress={() => setHistorySortMode("recent")}
          />
          <SortChip
            label="Favoritos"
            active={historySortMode === "favorites"}
            onPress={() => setHistorySortMode("favorites")}
          />
          <SortChip
            label="Objetivo"
            active={historySortMode === "goal"}
            onPress={() => setHistorySortMode("goal")}
          />
        </View>
      )}

      {savedPlans.length === 0 ? (
        <EmptyState variant="history" />
      ) : (
        sortedSavedPlans.map((item) => (
          <HistoryCard
            key={item.id}
            plan={item}
            onOpen={onOpen}
            onDelete={confirmDeletePlan}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      )}
    </>
  );
}

function SortChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ordenar historial por ${label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.sortChip,
        active && styles.sortChipActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.sortChipText, active && styles.sortChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  sortChip: {
    borderColor: Colors.dark.border,
    borderWidth: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  sortChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sortChipText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  sortChipTextActive: {
    color: Colors.dark.inverseText,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.88,
  },
});
