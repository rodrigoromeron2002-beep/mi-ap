import { useState } from "react";

import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { askCoach } from "@/services/zentraApi";
import type { CoachMessage, Plan } from "@/types/plan";

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useCoach(plan: Plan | null) {
  const subscription = useSubscriptionContext();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  async function sendQuestion(customQuestion?: string) {
    const text = (customQuestion ?? question).trim();
    if (!text || coachLoading) return;

    if (!subscription.isPro && !subscription.coachMessageLimit.allowed) {
      setCoachError("Llegaste al límite mensual del Coach IA en FREE. PRO libera conversaciones extendidas.");
      return;
    }

    const userMessage: CoachMessage = {
      id: createMessageId(),
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage].slice(-8);

    setMessages(nextMessages);
    setQuestion("");
    setCoachLoading(true);
    setCoachError(null);

    try {
      const answer = await askCoach({
        question: text,
        plan,
        messages: nextMessages,
      });

      const coachMessage: CoachMessage = {
        id: createMessageId(),
        role: "coach",
        text: answer || "No pude responder con claridad. Probá reformular la pregunta.",
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, coachMessage].slice(-10));
      await subscription.recordUsage("coachMessages");
    } catch {
      setCoachError("No pude conectar con el coach. Verificá que el backend esté activo.");
    } finally {
      setCoachLoading(false);
    }
  }

  function clearCoach() {
    setMessages([]);
    setCoachError(null);
  }

  return {
    messages,
    question,
    setQuestion,
    coachLoading,
    coachError,
    coachMessageLimit: subscription.coachMessageLimit,
    isPro: subscription.isPro,
    sendQuestion,
    clearCoach,
  };
}
