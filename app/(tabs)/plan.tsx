import { router } from "expo-router";

import { AppScreen } from "@/components/fitness/AppScreen";
import { EmptyState } from "@/components/fitness/EmptyState";
import { PlanCard } from "@/components/fitness/PlanCard";
import { ScreenHeader } from "@/components/fitness/ScreenHeader";
import { TodayPanel } from "@/components/fitness/TodayPanel";
import { LANGUAGES } from "@/constants/planOptions";
import { usePlansContext } from "@/contexts/PlansContext";
import { useProgressContext } from "@/contexts/ProgressContext";

export default function PlanScreen() {
  const { plan, language, updatePlan, toggleFavorite } = usePlansContext();
  const { entries, stats, completeSession } = useProgressContext();
  const currentLanguageName =
    LANGUAGES.find((item) => item.value === language)?.name ?? "Español";

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="PLAN"
        title={plan ? plan.goal : "Sin plan activo"}
        description={
          plan
            ? "Tu estrategia activa, editable y lista para ejecutar."
            : "Generá o abrí un plan guardado para verlo en detalle."
        }
        rightLabel={plan ? `${plan.days}D` : undefined}
      />

      {!plan ? (
        <EmptyState variant="plan" />
      ) : (
        <PlanCard
          plan={plan}
          languageName={currentLanguageName}
          onSave={updatePlan}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <TodayPanel
        plan={plan}
        stats={stats}
        entries={entries}
        onCompleteToday={() => completeSession()}
        onCreatePlan={() => router.push("/create")}
      />
    </AppScreen>
  );
}
