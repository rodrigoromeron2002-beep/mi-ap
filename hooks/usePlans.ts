import { useEffect, useMemo, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import {
  deleteAllCloudPlans,
  deleteCloudPlan,
  upsertCloudPlan,
} from "@/services/syncService";
import { generatePlan as requestPlan } from "../services/zentraApi";
import {
  addSavedPlan,
  clearSavedPlans,
  deleteSavedPlan as removeSavedPlan,
  getSavedPlans,
  replaceSavedPlans,
  updateSavedPlan,
} from "../storage/plansStorage";
import type { HistorySortMode, Language, Plan, PlanEditableFields, PlanForm } from "../types/plan";

export function usePlans() {
  const auth = useAuthContext();
  const subscription = useSubscriptionContext();

  const [goal, setGoal] = useState("Ganar músculo");
  const [level, setLevel] = useState("Principiante");
  const [days, setDays] = useState("3");
  const [place, setPlace] = useState("Casa");
  const [time, setTime] = useState("45");
  const [language, setLanguage] = useState<Language>("es");

  const [plan, setPlan] = useState<Plan | null>(null);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [historySortMode, setHistorySortMode] = useState<HistorySortMode>("recent");

  const cleanDays = Number(days);
  const cleanTime = Number(time);

  const isFormValid = useMemo(() => {
    return (
      goal.trim().length > 0 &&
      level.trim().length > 0 &&
      place.trim().length > 0 &&
      Number.isFinite(cleanDays) &&
      cleanDays >= 1 &&
      cleanDays <= 7 &&
      Number.isFinite(cleanTime) &&
      cleanTime >= 10 &&
      cleanTime <= 180
    );
  }, [goal, level, place, cleanDays, cleanTime]);

  useEffect(() => {
    async function loadSavedPlans() {
      try {
        const loadedPlans = await getSavedPlans();
        setSavedPlans(loadedPlans);

        if (loadedPlans.length > 0) {
          setPlan(loadedPlans[0]);
          setShowResult(true);
        }
      } catch {
        setSavedPlans([]);
      }
    }

    loadSavedPlans();
  }, []);

  async function createPlan() {
    if (loading) return null;

    if (!subscription.isPro && !subscription.planGenerationLimit.allowed) {
      throw new Error("PLAN_GENERATION_LIMIT");
    }

    const form: PlanForm = {
      goal,
      level,
      days: String(cleanDays),
      place,
      time: String(cleanTime),
      language,
    };

    setLoading(true);

    try {
      const newPlan = await requestPlan(form);
      setPlan(newPlan);
      setShowResult(true);

      const availableHistorySlots = Math.max(subscription.limits.savedPlans - 1, 0);
      const basePlans = subscription.isPro
        ? savedPlans
        : savedPlans.slice(0, availableHistorySlots);
      const updatedPlans = await addSavedPlan(newPlan, basePlans);
      setSavedPlans(updatedPlans);
      await subscription.recordUsage("plansGenerated");
      syncPlanIfOnline(newPlan);

      return newPlan;
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan(planId: string) {
    const updatedPlans = await removeSavedPlan(planId, savedPlans);
    setSavedPlans(updatedPlans);

    if (plan?.id === planId) {
      const nextPlan = updatedPlans[0] ?? null;
      setPlan(nextPlan);
      setShowResult(Boolean(nextPlan));
    }

    deletePlanIfOnline(planId);
  }

  async function updatePlan(planId: string, fields: PlanEditableFields) {
    const currentPlan = savedPlans.find((item) => item.id === planId) ?? plan;
    if (!currentPlan) return null;

    const updatedPlan: Plan = {
      ...currentPlan,
      ...fields,
      updatedAt: new Date().toISOString(),
    };

    const updatedPlans = await updateSavedPlan(updatedPlan, savedPlans);
    setSavedPlans(updatedPlans);

    if (plan?.id === planId) {
      setPlan(updatedPlan);
    }

    syncPlanIfOnline(updatedPlan);

    return updatedPlan;
  }

  async function toggleFavorite(planId: string) {
    const currentPlan = savedPlans.find((item) => item.id === planId) ?? plan;
    if (!currentPlan) return null;

    const updatedPlan: Plan = {
      ...currentPlan,
      favorite: !currentPlan.favorite,
      updatedAt: new Date().toISOString(),
    };

    const updatedPlans = await updateSavedPlan(updatedPlan, savedPlans);
    setSavedPlans(updatedPlans);

    if (plan?.id === planId) {
      setPlan(updatedPlan);
    }

    syncPlanIfOnline(updatedPlan);

    return updatedPlan;
  }

  async function clearHistory() {
    setSavedPlans([]);
    setPlan(null);
    setShowResult(false);
    await clearSavedPlans();
    clearCloudPlansIfOnline();
  }

  function openPlan(item: Plan) {
    setPlan(item);
    setShowResult(true);
  }

  async function hydratePlans(plans: Plan[]) {
    const updatedPlans = await replaceSavedPlans(plans);
    setSavedPlans(updatedPlans);

    if (updatedPlans.length > 0) {
      setPlan(updatedPlans[0]);
      setShowResult(true);
    } else {
      setPlan(null);
      setShowResult(false);
    }
  }

  const sortedSavedPlans = useMemo(() => {
    const plans = [...savedPlans];

    if (historySortMode === "favorites") {
      return plans.sort((a, b) => {
        if (Boolean(a.favorite) !== Boolean(b.favorite)) {
          return Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    if (historySortMode === "goal") {
      return plans.sort((a, b) => a.goal.localeCompare(b.goal));
    }

    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [historySortMode, savedPlans]);

  return {
    goal,
    setGoal,
    level,
    setLevel,
    days,
    setDays,
    place,
    setPlace,
    time,
    setTime,
    language,
    setLanguage,
    plan,
    savedPlans,
    sortedSavedPlans,
    loading,
    showResult,
    setShowResult,
    cleanDays,
    cleanTime,
    isFormValid,
    createPlan,
    deletePlan,
    updatePlan,
    toggleFavorite,
    clearHistory,
    openPlan,
    hydratePlans,
    historySortMode,
    setHistorySortMode,
    subscription,
  };

  function syncPlanIfOnline(nextPlan: Plan) {
    if (!auth.session) return;
    upsertCloudPlan(auth.session, nextPlan).catch(() => {
      // AsyncStorage remains the offline source of truth until the next manual sync.
    });
  }

  function deletePlanIfOnline(planId: string) {
    if (!auth.session) return;
    deleteCloudPlan(auth.session, planId).catch(() => {
      // Local deletion already succeeded; cloud can be repaired from Cuenta > Subir.
    });
  }

  function clearCloudPlansIfOnline() {
    if (!auth.session) return;
    deleteAllCloudPlans(auth.session).catch(() => {
      // Local history is cleared; cloud can be repaired on the next sync.
    });
  }
}
