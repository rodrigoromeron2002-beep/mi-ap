import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function addCheck(label, ok, hint = "") {
  checks.push({ label, ok, hint });
}

const packageJson = exists("package.json") ? JSON.parse(read("package.json")) : {};
const appJson = exists("app.json") ? JSON.parse(read("app.json")) : {};
const serverEnvExists = exists("server/.env");
const appEnvExists = exists(".env");
const appEnv = appEnvExists ? read(".env") : "";
const serverEnv = serverEnvExists ? read("server/.env") : "";

addCheck("Proyecto Expo encontrado", exists("package.json") && exists("app.json"));
addCheck("node_modules instalado", exists("node_modules"));
addCheck("Servidor backend encontrado", exists("server/package.json") && exists("server/index.ts"));
addCheck("Dependencias backend instaladas", exists("server/node_modules"));
addCheck("Nombre Zentra configurado", appJson.expo?.name === "Zentra");
addCheck("Script web disponible", Boolean(packageJson.scripts?.web));
addCheck("Script backend disponible", Boolean(packageJson.scripts?.backend));
addCheck(
  ".env app creado",
  appEnvExists,
  "Creá .env desde .env.example para conectar API/Supabase."
);
addCheck(
  "API local configurada",
  appEnv.includes("EXPO_PUBLIC_API_BASE_URL=http://localhost:3001") ||
    appJson.expo?.extra?.apiBaseUrl === "http://localhost:3001",
  "Recomendado para web local: EXPO_PUBLIC_API_BASE_URL=http://localhost:3001"
);
addCheck(
  "Supabase configurado",
  appEnv.includes("EXPO_PUBLIC_SUPABASE_URL=https://") &&
    !appEnv.includes("your-project-ref") &&
    appEnv.includes("EXPO_PUBLIC_SUPABASE_ANON_KEY=") &&
    !appEnv.includes("your-anon-public-key"),
  "Pendiente hasta cargar URL y anon key reales."
);
addCheck(
  "OpenAI configurado",
  serverEnv.includes("OPENAI_API_KEY=sk-") &&
    !serverEnv.includes("replace-with-your-openai-api-key"),
  "Sin key real el backend funciona en modo demo."
);

console.log("Zentra dev doctor");
console.log("=================");

for (const check of checks) {
  console.log(`${check.ok ? "OK " : "WARN"} ${check.label}`);
  if (!check.ok && check.hint) console.log(`     ${check.hint}`);
}

console.log("\nArranque recomendado:");
console.log("1. Terminal A: npm run backend");
console.log("2. Terminal B: npm run web");
console.log("3. Expo limpio si falla cache: npm run start:clear");
