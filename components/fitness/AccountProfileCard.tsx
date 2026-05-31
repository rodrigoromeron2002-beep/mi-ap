import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { InputField } from "@/components/fitness/InputField";
import { HealthDisclaimer } from "@/components/fitness/HealthDisclaimer";
import { Colors } from "@/constants/theme";
import type { UserProfile } from "@/types/user";

type AccountProfileCardProps = {
  profile: UserProfile;
  completion: number;
  saving: boolean;
  error: string | null;
  onChange: <Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) => void;
  onSave: () => void;
  onAcceptDisclaimer: () => void;
};

const AGE_RANGES = ["18-24", "25-34", "35-44", "45+"];
const TRAINING_PREFERENCES = ["Fuerza", "Pérdida grasa", "Energía", "Performance"];

export function AccountProfileCard({
  profile,
  completion,
  saving,
  error,
  onChange,
  onSave,
  onAcceptDisclaimer,
}: AccountProfileCardProps) {
  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CUENTA</Text>
            <Text style={styles.title}>Perfil Zentra</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{completion}%</Text>
            <Text style={styles.scoreLabel}>perfil</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Esta información queda local por ahora. Después será la base para login,
          sincronización y planes más personalizados.
        </Text>

        <InputField
          label="Nombre"
          value={profile.name}
          onChangeText={(value) => onChange("name", value)}
          placeholder="Tu nombre"
        />

        <InputField
          label="Email"
          value={profile.email}
          onChangeText={(value) => onChange("email", value)}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Rango de edad</Text>
        <ChipGroup
          options={AGE_RANGES}
          value={profile.ageRange}
          onChange={(value) => onChange("ageRange", value)}
        />

        <Text style={styles.label}>Preferencia principal</Text>
        <ChipGroup
          options={TRAINING_PREFERENCES}
          value={profile.trainingPreference}
          onChange={(value) => onChange("trainingPreference", value)}
        />

        <Text style={styles.label}>Nota personal de salud o contexto</Text>
        <TextInput
          value={profile.healthNote}
          onChangeText={(value) => onChange("healthNote", value)}
          placeholder="Ej: rodilla sensible, poco tiempo, entreno de mañana..."
          placeholderTextColor={Colors.dark.textMuted}
          multiline
          style={styles.textArea}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Guardar perfil"
          onPress={onSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
            saving && styles.disabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator color={Colors.dark.inverseText} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar perfil</Text>
          )}
        </Pressable>
      </View>

      <HealthDisclaimer
        accepted={profile.acceptedHealthDisclaimer}
        onAccept={onAcceptDisclaimer}
      />
    </>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.chipGroup}>
      {options.map((option) => {
        const active = option === value;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.pressed,
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
    borderRadius: 30,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
  },
  eyebrow: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "900",
  },
  scoreBadge: {
    minWidth: 66,
    borderRadius: 18,
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignItems: "center",
  },
  scoreValue: {
    color: Colors.dark.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  scoreLabel: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 4,
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
    gap: 9,
  },
  chip: {
    borderColor: Colors.dark.border,
    borderWidth: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  chipText: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  chipTextActive: {
    color: Colors.dark.inverseText,
  },
  textArea: {
    minHeight: 92,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 18,
    color: Colors.dark.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlignVertical: "top",
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  saveButtonText: {
    color: Colors.dark.inverseText,
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
