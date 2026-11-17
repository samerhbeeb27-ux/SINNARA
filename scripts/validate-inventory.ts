import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { evaluateInventory } from "../src/lib/vacancy-inventory";
const input: unknown = JSON.parse(readFileSync("data/vacancies.json", "utf8"));
const result = evaluateInventory(input, Date.now());
console.log("Vacancy inventory:", JSON.stringify({
  published: result.published.length, drafts: result.drafts, withdrawn: result.withdrawn,
  withheld: result.withheld.length, errors: result.errors.length, warnings: result.warnings.length,
}));
for (const issue of [...result.errors, ...result.warnings])
  console.error("Entry " + issue.index + " / " + issue.path + ": " + issue.code);
if (result.errors.length || result.warnings.length) {
  process.exitCode = 1;
} else {
  mkdirSync(".inventory-build", { recursive: true });
  writeFileSync(".inventory-build/published-vacancies.json",
    JSON.stringify({ schemaVersion: 1, vacancies: result.published }, null, 2) + "\n");
}
