import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { Colors, Radius } from "../../constants/theme";

type InputFieldProps = TextInputProps & {
  label: string;
};

export function InputField({ label, style, ...props }: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor={Colors.dark.textMuted}
        style={[styles.input, focused && styles.inputFocused, style]}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 18,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    borderWidth: 1,
    borderRadius: Radius.md,
    color: Colors.dark.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "800",
  },
  inputFocused: {
    borderColor: Colors.dark.primaryBorder,
    backgroundColor: Colors.dark.surfaceStrong,
  },
});
