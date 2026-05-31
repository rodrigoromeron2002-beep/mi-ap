import { StyleSheet, Text, View } from "react-native";

import { Reveal } from "@/components/ux/Reveal";
import { Colors } from "@/constants/theme";

type HeroHeaderProps = {
  savedCount: number;
  weeklySessions: number;
  currentStreak: number;
  tierLabel: string;
};

export function HeroHeader({ savedCount, weeklySessions, currentStreak, tierLabel }: HeroHeaderProps) {
  return (
    <Reveal>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.brand}>Zentra</Text>
            <Text style={styles.brandSub}>AI FITNESS PLANS</Text>
          </View>

          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>{tierLabel}</Text>
          </View>
        </View>

        <Text style={styles.title}>Fitness IA con disciplina real.</Text>

        <Text style={styles.subtitle}>
          Entrenamiento, alimentación y mentalidad en un sistema simple, medible y listo para
          ejecutar.
        </Text>

        <View style={styles.premiumPanel}>
          <View style={styles.premiumDot} />
          <Text style={styles.premiumText}>Configurá tu objetivo. Zentra arma el camino.</Text>
        </View>

        <View style={styles.statsRow}>
          <MiniStat value={`${weeklySessions}`} label="sesiones semana" />
          <MiniStat value={`${currentStreak}`} label="racha" />
          <MiniStat value={`${savedCount}`} label="planes" />
        </View>
      </View>
    </Reveal>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginBottom: 24 },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
  brandSub: {
    color: Colors.dark.textMuted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 5,
  },
  proBadge: {
    backgroundColor: Colors.dark.primary,
    minWidth: 54,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  proBadgeText: {
    color: Colors.dark.inverseText,
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    color: Colors.dark.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
  },
  premiumPanel: {
    marginTop: 18,
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primarySoft,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  premiumDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: Colors.dark.primary,
  },
  premiumText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  miniStat: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
  },
  miniStatValue: {
    color: Colors.dark.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  miniStatLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    marginTop: 5,
    fontWeight: "800",
  },
});
