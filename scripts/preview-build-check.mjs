import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function loadDotEnv(relativePath) {
  const envPath = path.join(root, relativePath);
  if (!fs.existsSync(envPath)) return {};

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce((values, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return values;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return values;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      return { ...values, [key]: value };
    }, {});
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const appJson = readJson("app.json");
const easJson = readJson("eas.json");
const env = {
  ...loadDotEnv(".env"),
  EXPO_PUBLIC_API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? loadDotEnv(".env").EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_SUPABASE_URL:
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? loadDotEnv(".env").EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? loadDotEnv(".env").EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_DEV_UNLOCK_PRO:
    process.env.EXPO_PUBLIC_DEV_UNLOCK_PRO ?? loadDotEnv(".env").EXPO_PUBLIC_DEV_UNLOCK_PRO,
};

const expo = appJson.expo ?? {};
const apiBaseUrl = env.EXPO_PUBLIC_API_BASE_URL ?? "";
const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
const devUnlockPro = env.EXPO_PUBLIC_DEV_UNLOCK_PRO ?? "";

if (!easJson.build?.preview) failures.push("Falta build.preview en eas.json.");
if (easJson.build?.preview?.distribution !== "internal") {
  failures.push("build.preview debe usar distribution=internal.");
}
if (easJson.build?.preview?.environment !== "preview") {
  failures.push("build.preview debe usar environment=preview para leer variables EAS correctas.");
}
if (!expo.extra?.eas?.projectId) failures.push("Falta expo.extra.eas.projectId en app.json.");
if (!expo.ios?.bundleIdentifier) failures.push("Falta ios.bundleIdentifier.");
if (!expo.android?.package) failures.push("Falta android.package.");

if (!apiBaseUrl) {
  failures.push("Falta EXPO_PUBLIC_API_BASE_URL.");
} else if (!isHttpUrl(apiBaseUrl)) {
  failures.push("EXPO_PUBLIC_API_BASE_URL debe ser una URL http/https valida.");
} else if (apiBaseUrl.includes("localhost") || apiBaseUrl.includes("127.0.0.1")) {
  failures.push("EXPO_PUBLIC_API_BASE_URL no puede usar localhost para builds preview en dispositivo.");
} else if (!apiBaseUrl.startsWith("https://")) {
  warnings.push("EXPO_PUBLIC_API_BASE_URL no usa HTTPS. Para preview externo se recomienda HTTPS.");
}

if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
  failures.push("EXPO_PUBLIC_SUPABASE_URL no parece una URL Supabase valida.");
}

if (supabaseAnonKey.length < 40) {
  failures.push("EXPO_PUBLIC_SUPABASE_ANON_KEY falta o parece incompleta.");
}

if (devUnlockPro === "true") {
  failures.push("EXPO_PUBLIC_DEV_UNLOCK_PRO debe ser false para preview real.");
}

if (process.env.OPENAI_API_KEY || env.OPENAI_API_KEY) {
  failures.push("OPENAI_API_KEY no debe estar en variables EXPO_PUBLIC ni en .env de la app.");
}

console.log("Zentra preview build check");
console.log("==========================");

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nOK: configuracion lista para build preview.");
