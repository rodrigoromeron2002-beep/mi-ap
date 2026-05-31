import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

const CHECKLIST = [
  { label: "Flujo local completo: crear, editar, guardar, progreso, coach", status: "Activo" },
  { label: "Backend IA estable, con errores claros y límites definidos", status: "Beta" },
  { label: "Responsive mobile/web, teclado, scroll y tabs verificados", status: "Base lista" },
  { label: "Icono, splash, nombre final, screenshots y metadata de tiendas", status: "Pendiente" },
  { label: "Privacidad, términos, aviso médico y soporte", status: "Pendiente" },
  { label: "Login, Supabase, pagos reales y recovery de cuenta", status: "Última fase" },
];

const STORE_CHECKLIST = [
  "EAS Build configurado para iOS/Android",
  "Política de privacidad publicada",
  "Cuenta Apple Developer y Google Play Console",
  "QA en dispositivo real y navegador mobile",
  "Tracking de errores antes del lanzamiento",
];

export function LaunchChecklist() {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>ROADMAP</Text>
      <Text style={styles.title}>Salida a producción</Text>

      <View style={styles.list}>
        {CHECKLIST.map((item) => (
          <View key={item.label} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        ))}
      </View>

      <View style={styles.storeBox}>
        <Text style={styles.storeTitle}>Antes de publicar</Text>
        {STORE_CHECKLIST.map((item) => (
          <View key={item} style={styles.storeRow}>
            <View style={styles.storeDot} />
            <Text style={styles.storeText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
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
  list: {
    gap: 12,
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
  },
  label: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  status: {
    color: Colors.dark.textMuted,
    fontSize: 11,
    fontWeight: "900",
    maxWidth: 86,
    textAlign: "right",
  },
  storeBox: {
    backgroundColor: Colors.dark.overlay,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  storeTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 7,
  },
  storeDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: Colors.dark.accent,
    marginTop: 7,
  },
  storeText: {
    flex: 1,
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
});
