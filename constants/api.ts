import { Platform } from "react-native";
import Constants from "expo-constants";

const LOCAL_IP = "172.16.0.176";
const configuredApiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export const API_BASE_URL =
  typeof configuredApiBaseUrl === "string" && configuredApiBaseUrl.length > 0
    ? configuredApiBaseUrl
    : Platform.OS === "web"
    ? "http://localhost:3001"
    : `http://${LOCAL_IP}:3001`;

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  generatePlan: `${API_BASE_URL}/api/generate-plan`,
  coach: `${API_BASE_URL}/api/coach`,
};
