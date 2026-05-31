import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Reveal } from "@/components/ux/Reveal";
import { Colors } from "@/constants/theme";
import type { Plan } from "@/types/plan";
import type { ProgressEntry, ProgressStats } from "@/types/progress";

type ProgressPanelProps = {
  plan: Plan | null;
  stats: ProgressStats;
  entries: ProgressEntry[];
  loading: boolean;
  error: string | null;
  onCompleteSession: () => void;
  onResetWeek: () => void;
};

export function ProgressPanel({
  plan,
  stats,
  entries,
  loading,
  error,
  onCompleteSession,
  onResetWeek,
}: ProgressPanelProps) {
  const lastEntries = entries.slice(0, 3);
  const canResetWeek = stats.weeklySessions > 0 && !loading;
  const canCompleteSession = Boolean(plan) && !loading;

  function confirmResetWeek() {
    if (!canResetWeek) return;

    const title = "Reiniciar adherencia semanal";
    const message =
      "Esto borra solo las sesiones de esta semana. Tu historial anterior queda guardado.";

    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        onResetWeek();
      }

      return;
    }

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Reiniciar", style: "destructive", onPress: onResetWeek },
    ]);
  }

  return (
    <Reveal>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>PROGRESO</Text>
            <Text style={styles.title}>Adherencia semanal</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {plan
            ? `Marcá sesiones del plan ${plan.goal.toLowerCase()} y medí consistencia.`
            : "Generá o abrí un plan para registrar sesiones con contexto."}
        </Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reiniciar adherencia semanal"
            onPress={confirmResetWeek}
            disabled={!canResetWeek}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && canResetWeek && styles.pressed,
              !canResetWeek && styles.disabled,
            ]}
          >
            <Text style={styles.resetButtonText}>Reiniciar semana</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Completar sesión"
            onPress={onCompleteSession}
            disabled={!canCompleteSession}
            style={({ pressed }) => [
              styles.completeButton,
              pressed && canCompleteSession && styles.pressed,
              !canCompleteSession && styles.disabled,
            ]}
          >
            {loading ? (
                <ActivityIndicator color={Colors.dark.inverseText} />
            ) : (
              <Text style={styles.completeButtonText}>{plan ? "Completar" : "Sin plan"}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <ProgressStat value={`${stats.weeklySessions}`} label="esta semana" />
          <ProgressStat value={`${stats.currentStreak}`} label="racha días" />
          <ProgressStat value={`${stats.totalMinutes}`} label="min totales" />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.timeline}>
          <Text style={styles.timelineTitle}>Últimas sesiones</Text>
          {lastEntries.length === 0 ? (
            <View style={styles.emptyTimeline}>
              <Text style={styles.emptyTimelineText}>
                Todavía no registraste sesiones. El primer check-in empieza la racha.
              </Text>
            </View>
          ) : (
            lastEntries.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <View style={styles.entryDot} />
                <View style={styles.entryCopy}>
                  <Text style={styles.entryTitle}>
                    {entry.planGoal ?? "Sesión libre"} · {entry.minutes} min
                  </Text>
                  <Text style={styles.entryDate}>
                    {new Date(entry.completedAt).toLocaleDateString("es-ES")}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </Reveal>
  );
}

function ProgressStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
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
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 0,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  completeButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 96,
    alignItems: "center",
  },
  completeButtonText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  resetButton: {
    flex: 1,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 13,
  },
  statValue: {
    color: Colors.dark.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  statLabel: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },
  timeline: {
    marginTop: 16,
  },
  timelineTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  emptyTimeline: {
    backgroundColor: Colors.dark.surfaceMuted,
    borderRadius: 16,
    padding: 12,
  },
  emptyTimelineText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  entry: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  entryDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
    marginTop: 5,
  },
  entryCopy: {
    flex: 1,
  },
  entryTitle: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
  },
  entryDate: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
