import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function filePath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(filePath(relativePath), "utf8"));
}

function getPngSize(relativePath) {
  const buffer = fs.readFileSync(filePath(relativePath));
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function requireFile(relativePath) {
  if (!exists(relativePath)) failures.push(`Falta ${relativePath}`);
}

function requirePngSize(relativePath, width, height) {
  requireFile(relativePath);
  if (!exists(relativePath)) return;

  const size = getPngSize(relativePath);
  if (!size || size.width !== width || size.height !== height) {
    failures.push(`${relativePath} debe ser PNG ${width}x${height}`);
  }
}

const packageJson = readJson("package.json");
const appJson = readJson("app.json");
const easJson = readJson("eas.json");
const expo = appJson.expo ?? {};

requireFile("app.config.js");
requireFile("eas.json");
requireFile("docs/STORE_LISTING.md");
requireFile("docs/RELEASE_RUNBOOK.md");
requireFile("docs/LEGAL_DRAFTS.md");
requireFile("docs/SUPABASE_SCHEMA.sql");
requirePngSize("assets/images/icon.png", 1024, 1024);
requirePngSize("assets/images/splash-icon.png", 1024, 1024);
requirePngSize("assets/images/favicon.png", 48, 48);
requirePngSize("assets/images/android-icon-foreground.png", 512, 512);
requirePngSize("assets/images/android-icon-background.png", 512, 512);

if (packageJson.name !== "zentra") failures.push('package.json > name debe ser "zentra"');
if (expo.name !== "Zentra") failures.push('app.json > expo.name debe ser "Zentra"');
if (expo.slug !== "zentra") failures.push('app.json > expo.slug debe ser "zentra"');
if (expo.scheme !== "zentra") failures.push('app.json > expo.scheme debe ser "zentra"');
if (expo.userInterfaceStyle !== "dark") failures.push('app.json > userInterfaceStyle debe ser "dark"');
if (expo.ios?.bundleIdentifier !== "com.zentra.app") {
  failures.push("iOS bundleIdentifier debe estar definido para publicar");
}
if (expo.android?.package !== "com.zentra.app") {
  failures.push("Android package debe estar definido para publicar");
}
if (!easJson.build?.preview) failures.push("Falta perfil EAS preview");
if (!easJson.build?.production) failures.push("Falta perfil EAS production");
if (easJson.build?.preview?.android?.buildType !== "apk") {
  warnings.push("Preview Android no genera APK descargable directo.");
}
if (easJson.build?.production?.android?.buildType !== "app-bundle") {
  warnings.push("Produccion Android deberia generar AAB para Play Store.");
}

console.log("Zentra release check");
console.log("====================");

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nOK: paquete listo a nivel configuracion para generar builds descargables.");
