import { router } from "expo-router";

import { AppScreen } from "@/components/fitness/AppScreen";
import { EmptyState } from "@/components/fitness/EmptyState";
import { ForgeScoreCard } from "@/components/fitness/ForgeScoreCard";
import { HeroHeader } from "@/components/fitness/HeroHeader";
import { QuickActions } from "@/components/fitness/QuickActions";
import { TodayPanel } from "@/components/fitness/TodayPanel";
import { UpgradeCard } from "@/components/fitness/UpgradeCard";
import { usePlansContext } from "@/contexts/PlansContext";
import { useProgressContext } from "@/contexts/ProgressContext";

export default function HomeScreen() {
  const { plan, savedPlans, subscription } = usePlansContext();
  const { entries, stats, completeSession } = useProgressContext();

  return (
    <AppScreen>
      <HeroHeader
        savedCount={savedPlans.length}
        weeklySessions={stats.weeklySessions}
        currentStreak={stats.currentStreak}
        tierLabel={subscription.tier.toUpperCase()}
      />

      <ForgeScoreCard plan={plan} stats={stats} />

      <TodayPanel
        plan={plan}
        stats={stats}
        entries={entries}
        onCompleteToday={() => completeSession()}
        onCreatePlan={() => router.push("/create")}
      />

      {!plan && <EmptyState variant="plan" />}

      <QuickActions onProgress={() => router.push("/progress")} onPro={() => router.push("/pro")} />

      {!savedPlans.length && (
        <UpgradeCard
          compact
          title="Modelo freemium listo"
          message="FREE sirve para probar Zentra. PRO será la capa para uso intensivo, coach extendido y progreso avanzado."
          onPress={() => router.push("/pro")}
        />
      )}
    </AppScreen>
  );
}
