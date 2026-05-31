import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

type HealthDisclaimerProps = {
  accepted: boolean;
  onAccept: () => void;
};

export function HealthDisclaimer({ accepted, onAccept }: HealthDisclaimerProps) {
  return (
    <View style={[styles.card, accepted && styles.cardAccepted]}>
      <Text style={styles.eyebrow}>SEGURIDAD</Text>
      <Text style={styles.title}>Aviso de salud</Text>
      <Text style={styles.text}>
        Zentra ofrece orientación fitness general y no reemplaza evaluación médica,
        nutricional o profesional. Si hay dolor, lesión, enfermedad, medicación o dudas
        clínicas, consultá a un profesional antes de entrenar.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aceptar aviso de salud"
        disabled={accepted}
        onPress={onAccept}
        style={({ pressed }) => [
          styles.button,
          accepted && styles.buttonAccepted,
          pressed && !accepted && styles.pressed,
        ]}
      >
        <Text style={[styles.buttonText, accepted && styles.buttonTextAccepted]}>
          {accepted ? "Aviso aceptado" : "Entendido"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.dangerSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
  },
  cardAccepted: {
    backgroundColor: Colors.dark.successSoft,
    borderColor: Colors.dark.successBorder,
  },
  eyebrow: {
    color: Colors.dark.danger,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "900",
  },
  text: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  button: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.danger,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonAccepted: {
    backgroundColor: Colors.dark.success,
  },
  buttonText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  buttonTextAccepted: {
    color: Colors.dark.inverseText,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
