import { spawnSync } from "node:child_process";

const checks = [
  ["TypeScript", "npm", ["run", "typecheck"]],
  ["Lint", "npm", ["run", "lint"]],
  ["Production structure", "npm", ["run", "prod:check"]],
  ["Release configuration", "npm", ["run", "release:check"]],
  ["Backend build", "npm", ["run", "backend:build"]],
  ["Web export", "npm", ["run", "web:export"]],
];

const failures = [];

console.log("Zentra local QA gate");
console.log("====================");

for (const [label, command, args] of checks) {
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    failures.push(label);
  }
}

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\nOK: codigo y configuracion local pasan el gate base.");
console.log("Pendiente externo: QA en dispositivos reales, Supabase real, pagos, legal y stores.");
