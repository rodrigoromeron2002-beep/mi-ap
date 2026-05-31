import { StyleSheet, Text, View } from "react-native";

import { Colors, Radius } from "@/constants/theme";
import type { Plan } from "@/types/plan";
import type { ProgressStats } from "@/types/progress";
import { getWeeklyProgressDisplay } from "@/utils/progressDisplay";

type ForgeScoreCardProps = {
  plan: Plan | null;
  stats: ProgressStats;
};

export function ForgeScoreCard({ plan, stats }: ForgeScoreCardProps) {
  const targetDays = Number(plan?.days ?? 0);
  const adherenceRatio = targetDays > 0 ? Math.min(stats.weeklySessions / targetDays, 1) : 0;
  const streakBoost = Math.min(stats.currentStreak / 7, 1) * 0.25;
  const score = plan ? Math.round(Math.min((adherenceRatio * 0.75 + streakBoost) * 100, 100)) : 0;
  const status = getStatus(score, Boolean(plan));
  const weeklyDisplay = getWeeklyProgressDisplay(stats.weeklySessions, plan?.days);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ZENTRA SCORE</Text>
          <Text style={styles.title}>{status.title}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>

      <Text style={styles.description}>{status.description}</Text>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${score}%` }]} />
      </View>

      <View style={styles.metrics}>
        <Metric label={weeklyDisplay.extraLabel ?? "Semana"} value={weeklyDisplay.value} />
        <Metric label="Racha" value={`${stats.currentStreak}d`} />
        <Metric label="Minutos" value={`${stats.totalMinutes}`} />
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function getStatus(score: number, hasPlan: boolean) {
  if (!hasPlan) {
    return {
      title: "Sistema sin calibrar",
      description: "Creá un plan para que Zentra mida adherencia y convierta acciones en señal.",
    };
  }

  if (score >= 85) {
    return {
      title: "Semana en ritmo",
      description: "Tu consistencia está alineada con el objetivo. Mantené el ritmo sin perseguir perfección.",
    };
  }

  if (score >= 45) {
    return {
      title: "Tracción real",
      description: "Ya hay movimiento. El siguiente salto viene de completar una sesión más esta semana.",
    };
  }

  return {
    title: "Encendido inicial",
    description: "El plan está listo; ahora Zentra necesita evidencia: una sesión completada cambia todo.",
  };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.cardElevated,
    borderColor: Colors.dark.accentBorder,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 18,
    marginTop: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
  },
  eyebrow: {
    color: Colors.dark.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "900",
  },
  scoreBadge: {
    minWidth: 64,
    backgroundColor: Colors.dark.accentSoft,
    borderColor: Colors.dark.accentBorder,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignItems: "center",
  },
  scoreValue: {
    color: Colors.dark.accent,
    fontSize: 22,
    fontWeight: "900",
  },
  scoreLabel: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 1,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    marginTop: 10,
  },
  track: {
    height: 9,
    backgroundColor: Colors.dark.overlay,
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginTop: 15,
  },
  trackFill: {
    height: "100%",
    backgroundColor: Colors.dark.accent,
    borderRadius: Radius.pill,
  },
  metrics: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  metric: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 12,
  },
  metricValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "900",
  },
  metricLabel: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
});
