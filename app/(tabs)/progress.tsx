import { router } from "expo-router";
import { useState } from "react";

import { AppScreen } from "@/components/fitness/AppScreen";
import { HistoryList } from "@/components/fitness/HistoryList";
import { ProgressPanel } from "@/components/fitness/ProgressPanel";
import { ScreenHeader } from "@/components/fitness/ScreenHeader";
import { TodayPanel } from "@/components/fitness/TodayPanel";
import { StatusFeedback } from "@/components/ux/StatusFeedback";
import { usePlansContext } from "@/contexts/PlansContext";
import { useProgressContext } from "@/contexts/ProgressContext";
import type { Plan } from "@/types/plan";

export default function ProgressScreen() {
  const plans = usePlansContext();
  const progress = useProgressContext();
  const [notice, setNotice] = useState<{
    tone: "success" | "warning" | "error";
    title: string;
    message: string;
  } | null>(null);

  function openSavedPlan(plan: Plan) {
    plans.openPlan(plan);
    router.push("/plan");
  }

  async function completeSessionWithFeedback() {
    const entry = await progress.completeSession();

    if (entry) {
      setNotice({
        tone: "success",
        title: "Sesión registrada",
        message: "La adherencia semanal y tu racha se actualizaron correctamente.",
      });
    }
  }

  async function resetWeekWithFeedback() {
    const resetDone = await progress.resetWeeklyProgress();

    if (resetDone) {
      setNotice({
        tone: "success",
        title: "Semana reiniciada",
        message: "Borré solo las sesiones de esta semana. El historial anterior quedó guardado.",
      });
    }
  }

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="PROGRESO"
        title="Adherencia y memoria"
        description="Medí consistencia semanal, racha, sesiones recientes y recuperá planes guardados."
        rightLabel={`${progress.stats.weeklySessions} SES`}
      />

      <TodayPanel
        plan={plans.plan}
        stats={progress.stats}
        entries={progress.entries}
        onCompleteToday={completeSessionWithFeedback}
        onCreatePlan={() => router.push("/create")}
      />

      {notice ? (
        <StatusFeedback tone={notice.tone} title={notice.title} message={notice.message} />
      ) : null}

      <ProgressPanel
        plan={plans.plan}
        stats={progress.stats}
        entries={progress.entries}
        loading={progress.progressLoading}
        error={progress.progressError}
        onCompleteSession={completeSessionWithFeedback}
        onResetWeek={resetWeekWithFeedback}
      />

      <HistoryList
        savedPlans={plans.savedPlans}
        sortedSavedPlans={plans.sortedSavedPlans}
        historySortMode={plans.historySortMode}
        setHistorySortMode={plans.setHistorySortMode}
        onOpen={openSavedPlan}
        onDelete={plans.deletePlan}
        onToggleFavorite={plans.toggleFavorite}
        onClear={plans.clearHistory}
      />
    </AppScreen>
  );
}
