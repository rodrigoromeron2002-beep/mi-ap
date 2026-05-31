import { ActivityIndicator, Alert, StyleSheet, Text, View, Vibration } from "react-native";
import { router } from "expo-router";

import { AppScreen } from "@/components/fitness/AppScreen";
import { PlanFormCard } from "@/components/fitness/PlanFormCard";
import { ScreenHeader } from "@/components/fitness/ScreenHeader";
import { UpgradeCard } from "@/components/fitness/UpgradeCard";
import { Reveal } from "@/components/ux/Reveal";
import { StatusFeedback } from "@/components/ux/StatusFeedback";
import { LANGUAGES } from "@/constants/planOptions";
import { Colors } from "@/constants/theme";
import { usePlansContext } from "@/contexts/PlansContext";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { useState } from "react";

export default function CreateScreen() {
  const [feedback, setFeedback] = useState<{
    tone: "warning" | "error" | "success";
    title: string;
    message: string;
  } | null>(null);
  const plans = usePlansContext();
  const userProfile = useUserProfileContext();
  const backend = useBackendHealth();
  const savePlanLimit = plans.subscription.canSavePlan(plans.savedPlans.length);
  const currentLanguageName =
    LANGUAGES.find((item) => item.value === plans.language)?.name ?? "Español";

  async function generatePlan() {
    if (plans.loading) return;

    if (!plans.isFormValid) {
      setFeedback({
        tone: "warning",
        title: "Ajustá los valores",
        message: "Usá entre 1 y 7 días por semana, y sesiones de 10 a 180 minutos.",
      });
      return;
    }

    if (!plans.subscription.isPro && !plans.subscription.planGenerationLimit.allowed) {
      setFeedback({
        tone: "warning",
        title: "Límite mensual alcanzado",
        message: "FREE incluye 3 planes IA por mes. PRO libera generación extendida.",
      });
      return;
    }

    try {
      setFeedback(null);
      const newPlan = await plans.createPlan();
      if (!newPlan) return;

      Vibration.vibrate(50);
      plans.setShowResult(true);
      router.push("/plan");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "PLAN_GENERATION_LIMIT") {
        setFeedback({
          tone: "warning",
          title: "Necesitás PRO para seguir",
          message: "Alcanzaste el límite de generaciones del plan FREE.",
        });
        return;
      }

      setFeedback({
        tone: "error",
        title: "No pudimos generar el plan",
        message:
          "Revisá que el backend configurado esté online y que la API key esté activa en el servidor.",
      });
      Alert.alert(
        "No pudimos generar el plan",
        "Revisá que el backend configurado esté online y que la API key esté activa en el servidor."
      );
    }
  }

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="CREAR"
        title="Nuevo plan IA"
        description="Configurá el contexto real de entrenamiento. Zentra convierte esos datos en una estrategia ejecutable."
        rightLabel={plans.subscription.tier.toUpperCase()}
      />

      {!userProfile.profile.acceptedHealthDisclaimer ? (
        <StatusFeedback
          tone="warning"
          title="Aviso de salud pendiente"
          message="Zentra da orientación general. Antes de usarla con usuarios reales, aceptá el aviso en Cuenta."
        />
      ) : null}

      {backend.backendStatus === "offline" ? (
        <StatusFeedback
          tone="warning"
          title="Backend IA offline"
          message={`La app sigue funcionando, pero generar planes y coach necesitan ${backend.backendUrl || "el backend activo"}.`}
        />
      ) : null}

      {feedback && (
        <StatusFeedback tone={feedback.tone} title={feedback.title} message={feedback.message} />
      )}

      {!plans.subscription.isPro &&
        !plans.subscription.planGenerationLimit.allowed && (
          <UpgradeCard
            compact
            title="Tu plan FREE llegó al límite"
            message="Podés seguir usando Zentra, pero para generar más planes necesitás PRO."
            onPress={() => router.push("/pro")}
          />
        )}

      <PlanFormCard
        goal={plans.goal}
        setGoal={plans.setGoal}
        level={plans.level}
        setLevel={plans.setLevel}
        days={plans.days}
        setDays={plans.setDays}
        place={plans.place}
        setPlace={plans.setPlace}
        time={plans.time}
        setTime={plans.setTime}
        language={plans.language}
        setLanguage={plans.setLanguage}
        currentLanguageName={currentLanguageName}
        isFormValid={plans.isFormValid}
        loading={plans.loading}
        isPro={plans.subscription.isPro}
        planGenerationLimit={plans.subscription.planGenerationLimit}
        savePlanLimit={savePlanLimit}
        onGenerate={generatePlan}
      />

      {plans.loading && (
        <Reveal>
          <View style={styles.loadingCard}>
            <ActivityIndicator color={Colors.dark.primary} />
            <Text style={styles.loadingTitle}>Analizando tus datos</Text>
            <Text style={styles.loadingText}>
              Zentra está preparando rutina, nutrición y mindset según tu perfil.
            </Text>
          </View>
        </Reveal>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    marginTop: 22,
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primarySoft,
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    alignItems: "center",
  },
  loadingTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
});
