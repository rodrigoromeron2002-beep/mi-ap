import { AppScreen } from "@/components/fitness/AppScreen";
import { CoachPanel } from "@/components/fitness/CoachPanel";
import { ScreenHeader } from "@/components/fitness/ScreenHeader";
import { usePlansContext } from "@/contexts/PlansContext";
import { useCoach } from "@/hooks/useCoach";

export default function CoachScreen() {
  const { plan } = usePlansContext();
  const coach = useCoach(plan);

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="COACH"
        title="Ajustes inteligentes"
        description="Preguntá por cambios de rutina, nutrición, recuperación o foco diario con contexto del plan activo."
        rightLabel={plan ? "CON PLAN" : "SIN PLAN"}
      />

      <CoachPanel
        plan={plan}
        messages={coach.messages}
        question={coach.question}
        loading={coach.coachLoading}
        error={coach.coachError}
        isPro={coach.isPro}
        coachMessageLimit={coach.coachMessageLimit}
        onChangeQuestion={coach.setQuestion}
        onSend={coach.sendQuestion}
        onClear={coach.clearCoach}
      />
    </AppScreen>
  );
}
