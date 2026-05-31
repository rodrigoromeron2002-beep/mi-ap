import { Pressable, StyleSheet, Text, View } from "react-native";

import { Reveal } from "@/components/ux/Reveal";
import { Colors } from "@/constants/theme";
import type { Plan } from "@/types/plan";
import type { ProgressEntry, ProgressStats } from "@/types/progress";
import { getWeeklyProgressDisplay } from "@/utils/progressDisplay";

type TodayPanelProps = {
  plan: Plan | null;
  stats: ProgressStats;
  entries: ProgressEntry[];
  onCompleteToday: () => void;
  onCreatePlan?: () => void;
};

export function TodayPanel({ plan, stats, entries, onCompleteToday, onCreatePlan }: TodayPanelProps) {
  const targetDays = Number(plan?.days ?? 0);
  const completedToday = hasCompletedToday(entries);
  const remainingThisWeek = Math.max(targetDays - stats.weeklySessions, 0);
  const progressDisplay = getWeeklyProgressDisplay(stats.weeklySessions, plan?.days);
  const focus = getFocusCopy({
    plan,
    completedToday,
    remainingThisWeek,
    weeklySessions: stats.weeklySessions,
  });

  return (
    <Reveal>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>HOY</Text>
            <Text style={styles.title}>{focus.title}</Text>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{progressDisplay.value}</Text>
            <Text style={styles.scoreLabel}>{progressDisplay.extraLabel ?? progressDisplay.label}</Text>
          </View>
        </View>

        <Text style={styles.description}>{focus.description}</Text>

        <View style={styles.focusRow}>
          <FocusPill label={focus.primary} active />
          <FocusPill label={focus.secondary} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={plan ? "Marcar foco de hoy como completado" : "Crear plan"}
          onPress={plan ? onCompleteToday : onCreatePlan}
          disabled={!plan && !onCreatePlan}
          style={({ pressed }) => [
            styles.actionButton,
            completedToday && styles.actionButtonDone,
            !plan && styles.actionButtonCreate,
            !plan && !onCreatePlan && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.actionText,
              completedToday && styles.actionTextDone,
              !plan && styles.actionTextCreate,
            ]}
          >
            {!plan ? "Crear plan" : completedToday ? "Registrar otra sesión" : "Marcar foco completado"}
          </Text>
        </Pressable>
      </View>
    </Reveal>
  );
}

function FocusPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </View>
  );
}

function hasCompletedToday(entries: ProgressEntry[]) {
  const today = toLocalDateKey(new Date());
  return entries.some((entry) => toLocalDateKey(new Date(entry.completedAt)) === today);
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getFocusCopy({
  plan,
  completedToday,
  remainingThisWeek,
  weeklySessions,
}: {
  plan: Plan | null;
  completedToday: boolean;
  remainingThisWeek: number;
  weeklySessions: number;
}) {
  if (!plan) {
    return {
      title: "Definí tu siguiente movimiento",
      description: "Generá un plan para que Zentra calcule tu foco diario y mida adherencia.",
      primary: "Crear plan",
      secondary: "Base semanal",
    };
  }

  if (completedToday) {
    return {
      title: "Trabajo de hoy registrado",
      description: "La prioridad ahora es recuperación: hidratación, sueño y una comida simple con proteína.",
      primary: "Recuperación",
      secondary: "Consistencia",
    };
  }

  if (remainingThisWeek <= 0) {
    return {
      title: "Semana cubierta",
      description: "Ya cumpliste el objetivo semanal. Si entrenás hoy, bajá intensidad y priorizá técnica.",
      primary: "Opcional suave",
      secondary: `${weeklySessions} sesiones`,
    };
  }

  return {
    title: `Toca avanzar en ${plan.goal.toLowerCase()}`,
    description: `Quedan ${remainingThisWeek} sesiones para cerrar la semana según tu objetivo de ${plan.days} días.`,
    primary: `${plan.time} min`,
    secondary: plan.place,
  };
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },
  headerCopy: {
    flex: 1,
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
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: 0,
  },
  scoreBadge: {
    minWidth: 66,
    borderRadius: 18,
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignItems: "center",
  },
  scoreValue: {
    color: Colors.dark.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  scoreLabel: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  focusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
  },
  pill: {
    borderColor: Colors.dark.border,
    borderWidth: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  pillActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  pillText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  pillTextActive: {
    color: Colors.dark.inverseText,
  },
  actionButton: {
    marginTop: 16,
    backgroundColor: Colors.dark.text,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionButtonDone: {
    backgroundColor: Colors.dark.surfaceStrong,
    borderColor: Colors.dark.border,
    borderWidth: 1,
  },
  actionButtonCreate: {
    backgroundColor: Colors.dark.primary,
  },
  actionText: {
    color: Colors.dark.inverseText,
    fontSize: 14,
    fontWeight: "900",
  },
  actionTextDone: {
    color: Colors.dark.textSecondary,
  },
  actionTextCreate: {
    color: Colors.dark.inverseText,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
