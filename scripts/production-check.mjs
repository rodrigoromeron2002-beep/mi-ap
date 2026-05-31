import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "app.config.js",
  "app.json",
  ".env.example",
  "eas.json",
  "assets/images/icon.png",
  "assets/images/favicon.png",
  "assets/images/android-icon-foreground.png",
  "assets/images/android-icon-background.png",
  "assets/images/android-icon-monochrome.png",
  "docs/DEPLOYMENT.md",
  "docs/PRODUCT_READINESS.md",
  "docs/SUPABASE_SCHEMA.sql",
  "server/.env.example",
  "server/package.json",
];

const warnings = [];
const failures = [];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`Falta ${file}`);
  }
}

const appJson = readJson("app.json");
const expo = appJson.expo ?? {};

if (!expo.name || expo.name === "mi-app") failures.push("Defini un nombre final en app.json > expo.name");
if (!expo.slug) failures.push("Defini expo.slug");
if (!expo.version) failures.push("Defini expo.version");
if (!expo.ios?.bundleIdentifier) failures.push("Defini ios.bundleIdentifier");
if (!expo.android?.package) failures.push("Defini android.package");

if (expo.ios?.bundleIdentifier === "com.zentra.app") {
  warnings.push("ios.bundleIdentifier es com.zentra.app; confirmalo antes de publicar.");
}

if (expo.android?.package === "com.zentra.app") {
  warnings.push("android.package es com.zentra.app; confirmalo antes de publicar.");
}

const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");

if (!envExample.includes("EXPO_PUBLIC_API_BASE_URL")) {
  failures.push(".env.example debe incluir EXPO_PUBLIC_API_BASE_URL");
}

if (!envExample.includes("EXPO_PUBLIC_SUPABASE_URL")) {
  failures.push(".env.example debe incluir EXPO_PUBLIC_SUPABASE_URL");
}

const packageJson = readJson("package.json");
const scripts = packageJson.scripts ?? {};

for (const script of ["typecheck", "lint", "web:export", "prod:check", "ready"]) {
  if (!scripts[script]) failures.push(`Falta script npm: ${script}`);
}

console.log("Zentra production check");
console.log("======================");

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nOK: estructura base lista para preparar deploy.");
if (warnings.length === 0) console.log("OK: sin warnings.");
