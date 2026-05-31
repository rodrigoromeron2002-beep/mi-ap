import Constants from "expo-constants";

const DEFAULT_API_BASE_URL = "https://mi-ap.onrender.com";
const configuredApiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export const API_BASE_URL =
  typeof configuredApiBaseUrl === "string" && configuredApiBaseUrl.length > 0
    ? configuredApiBaseUrl
    : DEFAULT_API_BASE_URL;

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  generatePlan: `${API_BASE_URL}/api/generate-plan`,
  coach: `${API_BASE_URL}/api/coach`,
};
