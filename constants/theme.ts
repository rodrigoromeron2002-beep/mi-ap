import { Platform } from "react-native";

const tintColorLight = "#6D5DF6";
const tintColorDark = "#7C5CFF";

export const Colors = {
  light: {
    text: "#101320",
    background: "#F7F8FC",
    tint: tintColorLight,
    icon: "#667085",
    tabIconDefault: "#667085",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F7F8FF",
    background: "#0B0F1A",
    backgroundSecondary: "#10162A",
    backgroundTertiary: "#151B31",
    card: "rgba(19, 25, 44, 0.94)",
    cardElevated: "rgba(25, 32, 56, 0.98)",
    surface: "rgba(255,255,255,0.06)",
    surfaceStrong: "rgba(255,255,255,0.10)",
    surfaceMuted: "rgba(255,255,255,0.045)",
    overlay: "rgba(6,10,24,0.62)",
    primary: "#7C5CFF",
    primaryHover: "#9277FF",
    primarySoft: "rgba(124, 92, 255, 0.16)",
    primaryBorder: "rgba(124, 92, 255, 0.34)",
    accent: "#33D6FF",
    accentSoft: "rgba(51, 214, 255, 0.12)",
    accentBorder: "rgba(51, 214, 255, 0.24)",
    coral: "#FF7A90",
    coralSoft: "rgba(255,122,144,0.12)",
    success: "#52D99A",
    successSoft: "rgba(82,217,154,0.13)",
    successBorder: "rgba(82,217,154,0.26)",
    textSecondary: "#C9D2EA",
    textMuted: "#8F9BB8",
    border: "rgba(255,255,255,0.12)",
    borderSoft: "rgba(255,255,255,0.08)",
    danger: "#FF6B7A",
    dangerSoft: "rgba(255,107,122,0.12)",
    dangerBorder: "rgba(255,107,122,0.26)",
    warning: "#F6C768",
    warningSoft: "rgba(246,199,104,0.13)",
    inverseText: "#070B16",
    tint: tintColorDark,
    icon: "#A9B3D1",
    tabIconDefault: "#A9B3D1",
    tabIconSelected: tintColorDark,
  },
};

export const Radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const Type = {
  eyebrow: 11,
  body: 14,
  small: 12,
  title: 22,
  subtitle: 16,
  hero: 36,
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "ui-serif",
    rounded: "System",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
