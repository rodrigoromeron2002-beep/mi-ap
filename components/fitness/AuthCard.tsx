import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors, Radius } from "@/constants/theme";

type AuthCardProps = {
  configured: boolean;
  status: "not_configured" | "signed_in" | "signed_out";
  email?: string;
  busy: boolean;
  error: string | null;
  onSignIn: (email: string, password: string) => Promise<unknown>;
  onSignUp: (email: string, password: string) => Promise<unknown>;
  onSignOut: () => Promise<void>;
};

export function AuthCard({
  configured,
  status,
  email,
  busy,
  error,
  onSignIn,
  onSignUp,
  onSignOut,
}: AuthCardProps) {
  const [draftEmail, setDraftEmail] = useState(email ?? "");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const disabled = busy || !configured;
  const visibleError = formError ?? error;

  function validateCredentials() {
    const cleanEmail = draftEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError("Ingresá un email válido.");
      return null;
    }

    if (password.length < 6) {
      setFormError("La contraseña tiene que tener al menos 6 caracteres.");
      return null;
    }

    setFormError(null);
    return { email: cleanEmail, password };
  }

  function submitSignIn() {
    const credentials = validateCredentials();
    if (!credentials) return;
    onSignIn(credentials.email, credentials.password);
  }

  function submitSignUp() {
    const credentials = validateCredentials();
    if (!credentials) return;
    onSignUp(credentials.email, credentials.password);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>LOGIN</Text>
          <Text style={styles.title}>Cuenta online</Text>
        </View>

        <View style={[styles.statusBadge, status === "signed_in" && styles.statusBadgeOnline]}>
          <Text style={styles.statusText}>
            {status === "signed_in" ? "SYNC" : configured ? "READY" : "SETUP"}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {status === "signed_in"
          ? `Sesión activa${email ? ` · ${email}` : ""}.`
          : configured
            ? "Supabase está configurado. Ya podés iniciar sesión o crear una cuenta."
            : "Completá EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en .env para activar usuarios reales."}
      </Text>

      {!configured && status !== "signed_in" ? (
        <View style={styles.setupBox}>
          <Text style={styles.setupLine}>EXPO_PUBLIC_SUPABASE_URL</Text>
          <Text style={styles.setupLine}>EXPO_PUBLIC_SUPABASE_ANON_KEY</Text>
        </View>
      ) : status !== "signed_in" ? (
        <>
          <TextInput
            value={draftEmail}
            onChangeText={(value) => {
              setDraftEmail(value);
              setFormError(null);
            }}
            placeholder="email@zentra.app"
            placeholderTextColor={Colors.dark.textMuted}
            keyboardType="email-address"
            textContentType="emailAddress"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setFormError(null);
            }}
            placeholder="Contraseña"
            placeholderTextColor={Colors.dark.textMuted}
            textContentType="password"
            secureTextEntry
            returnKeyType="done"
            style={styles.input}
          />

          <View style={styles.actions}>
            <ActionButton
              label={configured ? "Entrar" : "Configurar"}
              disabled={disabled}
              busy={busy}
              onPress={submitSignIn}
            />
            <ActionButton
              label="Crear cuenta"
              disabled={disabled}
              busy={busy}
              secondary
              onPress={submitSignUp}
            />
          </View>
        </>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          onPress={onSignOut}
          disabled={busy}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed, busy && styles.disabled]}
        >
          {busy ? <ActivityIndicator color={Colors.dark.danger} /> : <Text style={styles.signOutText}>Cerrar sesión</Text>}
        </Pressable>
      )}

      {visibleError ? <Text style={styles.errorText}>{visibleError}</Text> : null}
    </View>
  );
}

function ActionButton({
  label,
  busy,
  disabled,
  secondary,
  onPress,
}: {
  label: string;
  busy: boolean;
  disabled: boolean;
  secondary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionButton,
        secondary && styles.actionButtonSecondary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {busy && !secondary ? (
        <ActivityIndicator color={Colors.dark.inverseText} />
      ) : (
        <Text style={[styles.actionText, secondary && styles.actionTextSecondary]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
    fontSize: 20,
    fontWeight: "900",
  },
  statusBadge: {
    backgroundColor: Colors.dark.coralSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusBadgeOnline: {
    backgroundColor: Colors.dark.successSoft,
    borderColor: Colors.dark.successBorder,
  },
  statusText: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: "900",
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "800",
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 12,
  },
  setupBox: {
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 13,
    gap: 7,
    marginTop: 13,
  },
  setupLine: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.dark.primary,
    borderRadius: Radius.pill,
    paddingVertical: 13,
    alignItems: "center",
  },
  actionButtonSecondary: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
  },
  actionText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  actionTextSecondary: {
    color: Colors.dark.textSecondary,
  },
  signOutButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.dangerSoft,
    borderColor: Colors.dark.dangerBorder,
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  signOutText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "900",
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 12,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.48,
  },
});
