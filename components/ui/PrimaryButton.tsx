import { useRef } from "react";
import { ActivityIndicator, Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius } from "@/constants/theme";

type Props = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({ title, loading, disabled, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = loading || disabled;

  function animateTo(value: number) {
    Animated.spring(scale, {
      toValue: value,
      speed: 28,
      bounciness: 4,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={() => animateTo(0.975)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [
          styles.button,
          pressed && !isDisabled && styles.buttonPressed,
          isDisabled && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.dark.inverseText} />
            <Text style={styles.text}>Generando tu plan...</Text>
          </View>
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    backgroundColor: Colors.dark.primary,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.dark.primaryBorder,
    borderWidth: 1,
    ...(Platform.select({
      ios: {
        shadowColor: Colors.dark.primary,
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 5,
      },
    }) ?? {}),
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  loadingRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  text: {
    color: Colors.dark.inverseText,
    fontSize: 16,
    fontWeight: "900",
  },
});
