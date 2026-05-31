import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { UsageMeter } from "@/components/fitness/UsageMeter";
import { Reveal } from "@/components/ux/Reveal";
import { Colors } from "@/constants/theme";
import type { LimitCheck } from "@/types/freemium";
import type { CoachMessage, Plan } from "@/types/plan";

type CoachPanelProps = {
  plan: Plan | null;
  messages: CoachMessage[];
  question: string;
  loading: boolean;
  error: string | null;
  isPro: boolean;
  coachMessageLimit: LimitCheck;
  onChangeQuestion: (value: string) => void;
  onSend: (question?: string) => void;
  onClear: () => void;
};

const SUGGESTIONS = [
  "Adaptá mi entreno si tengo 25 minutos",
  "Qué como antes de entrenar",
  "Cómo progreso esta semana",
];

export function CoachPanel({
  plan,
  messages,
  question,
  loading,
  error,
  isPro,
  coachMessageLimit,
  onChangeQuestion,
  onSend,
  onClear,
}: CoachPanelProps) {
  function confirmClearCoach() {
    if (messages.length === 0) return;

    if (Platform.OS === "web") {
      if (window.confirm("¿Limpiar la conversación del Coach IA?")) {
        onClear();
      }
      return;
    }

    Alert.alert("Limpiar Coach", "¿Querés borrar la conversación actual?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Limpiar", style: "destructive", onPress: onClear },
    ]);
  }

  return (
    <Reveal>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>COACH IA</Text>
            <Text style={styles.title}>Entrenador en contexto</Text>
          </View>

          {messages.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpiar conversación del Coach IA"
              onPress={confirmClearCoach}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.description}>
          {plan
            ? "Preguntale ajustes sobre el plan actual, alimentación o foco de entrenamiento."
            : "Generá o abrí un plan para que el coach responda con contexto real."}
        </Text>

        <UsageMeter label="Mensajes Coach IA este mes" check={coachMessageLimit} isPro={isPro} />

        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              accessibilityRole="button"
              accessibilityLabel={`Preguntar: ${suggestion}`}
              onPress={() => onSend(suggestion)}
              disabled={loading}
              style={({ pressed }) => [
                styles.suggestion,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.messages}>
          {messages.length === 0 ? (
            <View style={styles.emptyCoach}>
              <Text style={styles.emptyCoachTitle}>Listo para ajustar tu estrategia</Text>
              <Text style={styles.emptyCoachText}>
                Usá preguntas cortas. El coach responde con acciones concretas.
              </Text>
            </View>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Colors.dark.primary} />
              <Text style={styles.loadingText}>Coach pensando...</Text>
            </View>
          ) : null}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputRow}>
          <TextInput
            value={question}
            onChangeText={onChangeQuestion}
            placeholder="Preguntá algo al coach..."
            placeholderTextColor={Colors.dark.textMuted}
            style={styles.input}
            multiline
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar pregunta al coach"
            onPress={() => onSend()}
            disabled={loading || question.trim().length === 0}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.pressed,
              (loading || question.trim().length === 0) && styles.disabled,
            ]}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </Pressable>
        </View>
      </View>
    </Reveal>
  );
}

function MessageBubble({ message }: { message: CoachMessage }) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.coachBubble]}>
      <Text style={[styles.bubbleLabel, isUser ? styles.userLabel : styles.coachLabel]}>
        {isUser ? "Vos" : "Coach"}
      </Text>
      <Text style={[styles.bubbleText, isUser ? styles.userText : styles.coachText]}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
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
  clearButton: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 15,
  },
  suggestion: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  suggestionText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  messages: {
    gap: 10,
    marginTop: 16,
  },
  emptyCoach: {
    backgroundColor: Colors.dark.surfaceMuted,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  emptyCoachTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "900",
  },
  emptyCoachText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: "700",
  },
  bubble: {
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
  },
  coachBubble: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
  },
  bubbleLabel: {
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 5,
  },
  userLabel: {
    color: Colors.dark.primary,
  },
  coachLabel: {
    color: Colors.dark.textMuted,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  userText: {
    color: Colors.dark.textSecondary,
  },
  coachText: {
    color: Colors.dark.textSecondary,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
    marginTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 18,
    color: Colors.dark.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "700",
  },
  sendButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sendButtonText: {
    color: Colors.dark.inverseText,
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
