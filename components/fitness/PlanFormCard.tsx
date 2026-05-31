import { Pressable, StyleSheet, Text, View } from "react-native";

import { InputField } from "@/components/fitness/InputField";
import { UsageMeter } from "@/components/fitness/UsageMeter";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Reveal } from "@/components/ux/Reveal";
import { StatusFeedback } from "@/components/ux/StatusFeedback";
import { GOALS, LANGUAGES, LEVELS, PLACES } from "@/constants/planOptions";
import { Colors } from "@/constants/theme";
import type { LimitCheck } from "@/types/freemium";
import type { Language } from "@/types/plan";

type PlanFormCardProps = {
  goal: string;
  setGoal: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
  days: string;
  setDays: (value: string) => void;
  place: string;
  setPlace: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  currentLanguageName: string;
  isFormValid: boolean;
  loading: boolean;
  isPro: boolean;
  planGenerationLimit: LimitCheck;
  savePlanLimit: LimitCheck;
  onGenerate: () => void;
};

export function PlanFormCard({
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
  currentLanguageName,
  isFormValid,
  loading,
  isPro,
  planGenerationLimit,
  savePlanLimit,
  onGenerate,
}: PlanFormCardProps) {
  function setNumericValue(setter: (value: string) => void, value: string, maxLength: number) {
    setter(value.replace(/\D/g, "").slice(0, maxLength));
  }

  return (
    <Reveal>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderCopy}>
            <Text style={styles.cardEyebrow}>CONFIGURADOR</Text>
            <Text style={styles.cardTitle}>Crear plan premium</Text>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>01</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>
          Elegí tus condiciones reales. Cuanto más claro el punto de partida, mejor el plan.
        </Text>

        <FieldLabel text="Objetivo principal" />
        <ChipGroup options={GOALS} value={goal} onChange={setGoal} disabled={loading} />

        <FieldLabel text="Nivel actual" />
        <ChipGroup options={LEVELS} value={level} onChange={setLevel} disabled={loading} />

        <FieldLabel text="Dónde vas a entrenar" />
        <ChipGroup options={PLACES} value={place} onChange={setPlace} disabled={loading} />

        <View style={styles.row}>
          <InputField
            label="Días/semana"
            value={days}
            onChangeText={(value) => setNumericValue(setDays, value, 1)}
            keyboardType="number-pad"
            placeholder="3"
            maxLength={1}
            editable={!loading}
          />

          <InputField
            label="Min/sesión"
            value={time}
            onChangeText={(value) => setNumericValue(setTime, value, 3)}
            keyboardType="number-pad"
            placeholder="45"
            maxLength={3}
            editable={!loading}
          />
        </View>

        <View style={styles.helperBox}>
          <Text style={styles.helperText}>
            Recomendado para empezar: 3 días por semana · 45 minutos.
          </Text>
        </View>

        <FieldLabel text={`Idioma del plan · ${currentLanguageName}`} />
        <View style={styles.languageGrid}>
          {LANGUAGES.map((item) => {
            const active = item.value === language;

            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityLabel={`Elegir idioma ${item.name}`}
                disabled={loading}
                onPress={() => setLanguage(item.value)}
                style={({ pressed }) => [
                  styles.languageChip,
                  active && styles.languageChipActive,
                  pressed && !loading && styles.pressed,
                  loading && styles.controlDisabled,
                ]}
              >
                <Text style={[styles.languageText, active && styles.languageTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!isFormValid && (
          <StatusFeedback
            tone="warning"
            title="Generación bloqueada"
            message="Completá valores válidos para activar la generación."
          />
        )}

        <UsageMeter label="Planes IA este mes" check={planGenerationLimit} isPro={isPro} />
        <UsageMeter label="Planes guardados" check={savePlanLimit} isPro={isPro} />

        <PrimaryButton
          title={isPro ? "Generar plan PRO con IA" : "Generar plan con IA"}
          loading={loading}
          disabled={!isFormValid || (!isPro && !planGenerationLimit.allowed)}
          onPress={onGenerate}
        />
      </View>
    </Reveal>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

function ChipGroup({
  options,
  value,
  onChange,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.chipGroup}>
      {options.map((option) => {
        const active = option === value;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`Elegir ${option}`}
            disabled={disabled}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && !disabled && styles.pressed,
              disabled && styles.controlDisabled,
            ]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 32,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
  },
  cardHeaderCopy: {
    flex: 1,
  },
  cardEyebrow: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  cardTitle: {
    color: Colors.dark.text,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 0,
  },
  stepBadge: {
    backgroundColor: Colors.dark.surfaceStrong,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
  },
  cardDescription: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 18,
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderColor: Colors.dark.border,
    borderWidth: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  chipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  chipText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
  },
  chipTextActive: {
    color: Colors.dark.inverseText,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.88,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  controlDisabled: {
    opacity: 0.55,
  },
  helperBox: {
    marginTop: 12,
    backgroundColor: Colors.dark.surfaceMuted,
    borderRadius: 16,
    padding: 12,
  },
  helperText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageChip: {
    width: 48,
    height: 39,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  languageChipActive: {
    backgroundColor: Colors.dark.text,
    borderColor: Colors.dark.text,
  },
  languageText: {
    color: Colors.dark.textSecondary,
    fontWeight: "900",
    fontSize: 12,
  },
  languageTextActive: {
    color: Colors.dark.inverseText,
  },
});
