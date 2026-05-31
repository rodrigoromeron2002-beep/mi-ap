import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

export function AppScreen({ children }: PropsWithChildren) {
  return (
    <LinearGradient
      colors={[Colors.dark.background, Colors.dark.backgroundSecondary, Colors.dark.backgroundTertiary]}
      style={styles.screen}
    >
      <SafeAreaView style={styles.flex} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            contentInsetAdjustmentBehavior="never"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 104,
  },
  container: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
});
