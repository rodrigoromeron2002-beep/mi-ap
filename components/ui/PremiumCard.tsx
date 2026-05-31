import { Platform, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/theme";

export function PremiumCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: 32,
    padding: 20,
    ...(Platform.select({
      ios: {
        shadowColor: Colors.dark.background,
        shadowOpacity: 0.45,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 18 },
        elevation: 12,
      },
      android: {
        elevation: 12,
      },
    }) ?? {}),
  },
});
