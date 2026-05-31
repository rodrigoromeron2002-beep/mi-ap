import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Reveal } from "@/components/ux/Reveal";
import { Colors, Radius } from "@/constants/theme";
import type { Plan, PlanEditableFields } from "@/types/plan";

type PlanCardProps = {
  plan: Plan;
  languageName: string;
  onSave: (planId: string, fields: PlanEditableFields) => Promise<Plan | null>;
  onToggleFavorite: (planId: string) => Promise<Plan | null>;
};

export function PlanCard({ plan, languageName, onSave, onToggleFavorite }: PlanCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PlanEditableFields>({
    routine: plan.routine,
    nutrition: plan.nutrition,
    mindset: plan.mindset,
    tags: plan.tags ?? [],
  });
  const [tagDraft, setTagDraft] = useState((plan.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft({
      routine: plan.routine,
      nutrition: plan.nutrition,
      mindset: plan.mindset,
      tags: plan.tags ?? [],
    });
    setTagDraft((plan.tags ?? []).join(", "));
    setEditing(false);
  }, [plan.id, plan.mindset, plan.nutrition, plan.routine, plan.tags]);

  async function saveDraft() {
    setSaving(true);
    try {
      const updatedPlan = await onSave(plan.id, {
        ...draft,
        tags: normalizeTags(tagDraft),
      });
      if (updatedPlan) {
        setDraft({
          routine: updatedPlan.routine,
          nutrition: updatedPlan.nutrition,
          mindset: updatedPlan.mindset,
          tags: updatedPlan.tags ?? [],
        });
        setTagDraft((updatedPlan.tags ?? []).join(", "));
      }
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setDraft({
      routine: plan.routine,
      nutrition: plan.nutrition,
      mindset: plan.mindset,
      tags: plan.tags ?? [],
    });
    setTagDraft((plan.tags ?? []).join(", "));
    setEditing(false);
  }

  return (
    <Reveal distance={18}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.badge}>PLAN GENERADO</Text>
            <Text style={styles.title}>{plan.goal}</Text>
            <Text style={styles.subtitle}>
              {plan.level} · {plan.place} · {languageName}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel={plan.favorite ? "Quitar plan de favoritos" : "Marcar plan como favorito"}
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => onToggleFavorite(plan.id)}
              style={styles.favoriteButton}
            >
              <Text style={styles.favoriteText}>{plan.favorite ? "★" : "☆"}</Text>
            </Pressable>

            <View style={styles.meta}>
              <Text style={styles.metaText}>
                {plan.days}d · {plan.time}m
              </Text>
            </View>
          </View>
        </View>

        {plan.tags && plan.tags.length > 0 && (
          <View style={styles.tags}>
            {plan.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}

        {editing ? (
          <View style={styles.tagEditor}>
            <Text style={styles.tagEditorLabel}>Etiquetas</Text>
            <TextInput
              value={tagDraft}
              onChangeText={setTagDraft}
              placeholder="Ej: hipertrofia, casa, principiante"
              placeholderTextColor={Colors.dark.textMuted}
              style={styles.tagInput}
            />
          </View>
        ) : null}

        <Text style={styles.goalMessage}>{getGoalMessage(plan.goal)}</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Plan personalizado para entrenar {plan.days} días por semana durante {plan.time} minutos
            por sesión.
          </Text>
        </View>

        <View style={styles.editActions}>
          {editing ? (
            <>
              <Pressable accessibilityRole="button" onPress={cancelEdit} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={saveDraft}
                style={[styles.primaryEditButton, saving && styles.actionDisabled]}
              >
                <Text style={styles.primaryEditButtonText}>{saving ? "Guardando" : "Guardar"}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable accessibilityRole="button" onPress={() => setEditing(true)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Editar plan</Text>
            </Pressable>
          )}
        </View>

        <PlanSection
          marker="01"
          title="Rutina"
          text={editing ? draft.routine : plan.routine}
          editable={editing}
          onChangeText={(routine) => setDraft((current) => ({ ...current, routine }))}
        />
        <PlanSection
          marker="02"
          title="Alimentación"
          text={editing ? draft.nutrition : plan.nutrition}
          editable={editing}
          onChangeText={(nutrition) => setDraft((current) => ({ ...current, nutrition }))}
        />
        <PlanSection
          marker="03"
          title="Mindset"
          text={editing ? draft.mindset : plan.mindset}
          editable={editing}
          onChangeText={(mindset) => setDraft((current) => ({ ...current, mindset }))}
        />
      </View>
    </Reveal>
  );
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function getGoalMessage(goalName: string) {
  if (goalName === "Ganar músculo") return "Foco: hipertrofia progresiva";
  if (goalName === "Perder grasa") return "Foco: quema calórica y déficit sostenible";
  if (goalName === "Tonificar") return "Foco: definición, postura y control muscular";
  if (goalName === "Mejorar energía") return "Foco: rendimiento diario y vitalidad";
  return "Foco: estrategia personalizada para tu objetivo";
}

function PlanSection({
  marker,
  title,
  text,
  editable,
  onChangeText,
}: {
  marker: string;
  title: string;
  text: string;
  editable?: boolean;
  onChangeText?: (value: string) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionMarker}>
          <Text style={styles.sectionMarkerText}>{marker}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {editable ? (
        <TextInput
          multiline
          value={text}
          onChangeText={onChangeText}
          placeholder="Escribí el contenido del bloque..."
          placeholderTextColor={Colors.dark.textMuted}
          style={styles.sectionInput}
        />
      ) : (
        <FormattedPlanText text={text} />
      )}
    </View>
  );
}

function FormattedPlanText({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <Text style={styles.sectionText}>{text || "Sin contenido disponible."}</Text>;
  }

  return (
    <View style={styles.formattedText}>
      {lines.map((line, index) => {
        const isDayHeader = /^d[ií]a\s+\d+/i.test(line);
        const isSectionHeader = /^[A-ZÁÉÍÓÚÑ0-9\s]{3,}:$/.test(line);
        const highlighted = isDayHeader || isSectionHeader;

        return (
          <View key={`${line}-${index}`} style={highlighted ? styles.dayLine : styles.bulletLine}>
            {!highlighted && <View style={styles.bulletDot} />}
            <Text style={highlighted ? styles.dayLineText : styles.bulletLineText}>
              {line.replace(/^[-•]\s*/, "")}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.cardElevated,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 22,
    ...(Platform.select({
      ios: {
        shadowColor: Colors.dark.background,
        shadowOpacity: 0.22,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      },
      android: {
        elevation: 8,
      },
    }) ?? {}),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  badge: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4,
    letterSpacing: 0,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 5,
  },
  meta: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  metaText: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
  },
  favoriteText: {
    color: Colors.dark.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  tagEditor: {
    marginTop: 12,
  },
  tagEditorLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  tagInput: {
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 16,
    color: Colors.dark.text,
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  goalMessage: {
    color: Colors.dark.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },
  summary: {
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  summaryText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  secondaryButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  primaryEditButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  actionDisabled: {
    opacity: 0.55,
  },
  primaryEditButtonText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  section: {
    marginTop: 16,
    backgroundColor: Colors.dark.overlay,
    borderRadius: 24,
    padding: 16,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionMarker: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionMarkerText: {
    color: Colors.dark.inverseText,
    fontSize: 11,
    fontWeight: "900",
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0,
  },
  sectionText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
  },
  formattedText: {
    gap: 8,
  },
  dayLine: {
    backgroundColor: Colors.dark.accentSoft,
    borderColor: Colors.dark.accentBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dayLineText: {
    color: Colors.dark.accent,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
  },
  bulletLine: {
    flexDirection: "row",
    gap: 9,
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
    marginTop: 8,
  },
  bulletLineText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
  },
  sectionInput: {
    minHeight: 92,
    color: Colors.dark.text,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    textAlignVertical: "top",
  },
});
