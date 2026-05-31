import fs from "node:fs";
import path from "node:path";

const env = loadDotEnv();
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

function mask(value) {
  if (!value) return "";
  if (value.length <= 12) return `${value.slice(0, 3)}...`;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

const ok = url.startsWith("https://") && url.includes(".supabase.co") && key.length > 40;

console.log(
  JSON.stringify(
    {
      supabaseConfigured: ok,
      supabaseUrl: url || null,
      anonKeyPreview: key ? mask(key) : null,
      nextStep: ok
        ? "Reinicia Expo y prueba Cuenta > Crear cuenta."
        : "Completa EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en .env.",
    },
    null,
    2,
  ),
);

if (!ok) {
  process.exitCode = 1;
}

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce((values, line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) return values;

      const separatorIndex = trimmedLine.indexOf("=");
      if (separatorIndex === -1) return values;

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

      return {
        ...values,
        [key]: value,
      };
    }, {});
}
