import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/fitness/AppScreen";
import { ScreenHeader } from "@/components/fitness/ScreenHeader";
import { UpgradeCard } from "@/components/fitness/UpgradeCard";
import { UsageMeter } from "@/components/fitness/UsageMeter";
import { FREE_LIMITS, PRO_FEATURES, TIER_LABEL } from "@/constants/freemium";
import { Colors } from "@/constants/theme";
import { usePlansContext } from "@/contexts/PlansContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";

export default function ProScreen() {
  const subscription = useSubscriptionContext();
  const plans = usePlansContext();
  const savePlanLimit = subscription.canSavePlan(plans.savedPlans.length);

  async function handleStartPro() {
    try {
      await subscription.startProCheckout();
    } catch {
      const title = "Pagos todavía no conectados";
      const message =
        "La arquitectura PRO ya está preparada. Para activar compras reales falta configurar RevenueCat y conectar el webhook/backend que actualiza Supabase.";

      if (Platform.OS === "web") {
        window.alert(`${title}\n\n${message}`);
        return;
      }

      Alert.alert(title, message);
    }
  }

  return (
    <AppScreen>
      <ScreenHeader
        eyebrow="FREEMIUM"
        title="Zentra PRO"
        description="FREE permite probar la app. PRO se desbloquea desde suscripción verificada, no desde estado local."
        rightLabel={TIER_LABEL[subscription.tier]}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Uso mensual</Text>
        <UsageMeter
          label="Planes IA"
          check={subscription.planGenerationLimit}
          isPro={subscription.isPro}
        />
        <UsageMeter
          label="Mensajes Coach IA"
          check={subscription.coachMessageLimit}
          isPro={subscription.isPro}
        />
        <UsageMeter label="Planes guardados" check={savePlanLimit} isPro={subscription.isPro} />
      </View>

      <UpgradeCard
        title={subscription.isPro ? "PRO activo" : "Desbloquear Zentra PRO"}
        message={
          subscription.isPro
            ? "Tu suscripción está activa según Supabase/RevenueCat."
            : "Planes ilimitados, historial completo, coach extendido y personalización avanzada."
        }
        buttonLabel={subscription.isPro ? "Actualizar estado" : "Preparar compra PRO"}
        onPress={subscription.isPro ? subscription.refreshEntitlement : handleStartPro}
      />

      <View style={styles.pricingGrid}>
        <PricingCard
          title="FREE"
          price="$0"
          subtitle={`${FREE_LIMITS.plansPerMonth} planes IA/mes · ${FREE_LIMITS.coachMessagesPerMonth} mensajes coach`}
          active={!subscription.isPro}
          actionLabel={subscription.isPro ? "Disponible" : "Activo"}
          onPress={subscription.refreshEntitlement}
        />
        <PricingCard
          title="PRO"
          price="$9.99/mes"
          subtitle="Uso extendido, historial completo y features avanzadas."
          active={subscription.isPro}
          actionLabel={subscription.isPro ? "Activo" : "Configurar compra"}
          onPress={subscription.isPro ? subscription.refreshEntitlement : handleStartPro}
        />
      </View>

      <FreemiumBlueprint />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Incluido en PRO</Text>
        <View style={styles.features}>
          {PRO_FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

function PricingCard({
  title,
  price,
  subtitle,
  active,
  actionLabel,
  onPress,
}: {
  title: string;
  price: string;
  subtitle: string;
  active: boolean;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Seleccionar ${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pricingCard,
        active && styles.pricingCardActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.pricingTitle}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.pricingSubtitle}>{subtitle}</Text>
      <Text style={[styles.planState, active && styles.planStateActive]}>
        {actionLabel}
      </Text>
    </Pressable>
  );
}

const BLUEPRINT = [
  {
    title: "FREE valida el hábito",
    text: "Tiene que dejar crear, probar coach y guardar lo justo para entender valor sin regalar uso intensivo.",
  },
  {
    title: "PRO vende continuidad",
    text: "La promesa no es solo mas IA: es progreso, ajustes, historial completo y menos fricción semanal.",
  },
  {
    title: "Pagos al final",
    text: "Cuando la experiencia local esté cerrada, conectamos login, Supabase y pago real sin rediseñar la app.",
  },
];

function FreemiumBlueprint() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Regla de producto</Text>
      <View style={styles.blueprintList}>
        {BLUEPRINT.map((item, index) => (
          <View key={item.title} style={styles.blueprintRow}>
            <View style={styles.blueprintIndex}>
              <Text style={styles.blueprintIndexText}>{String(index + 1).padStart(2, "0")}</Text>
            </View>
            <View style={styles.blueprintCopy}>
              <Text style={styles.blueprintTitle}>{item.title}</Text>
              <Text style={styles.blueprintText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
  },
  cardTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "900",
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 22,
  },
  pricingCard: {
    flex: 1,
    minWidth: 148,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.borderSoft,
    borderWidth: 1,
    borderRadius: 24,
    padding: 15,
  },
  pricingCardActive: {
    borderColor: Colors.dark.primaryBorder,
    backgroundColor: Colors.dark.primarySoft,
  },
  pricingTitle: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  price: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
  },
  pricingSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  planState: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 12,
  },
  planStateActive: {
    color: Colors.dark.primary,
  },
  features: {
    gap: 10,
    marginTop: 14,
  },
  blueprintList: {
    gap: 12,
    marginTop: 15,
  },
  blueprintRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  blueprintIndex: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: Colors.dark.primarySoft,
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blueprintIndexText: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "900",
  },
  blueprintCopy: {
    flex: 1,
  },
  blueprintTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "900",
  },
  blueprintText: {
    color: Colors.dark.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    marginTop: 3,
  },
  featureRow: {
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
  featureText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
