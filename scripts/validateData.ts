/**
 * Data integrity check. Run with: npm run validate:data
 * Exits non-zero on errors so it can gate CI or a pre-deploy step.
 */
import { validateData, stats } from "../client/src/data/index";

const issues = validateData();
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

console.log("CAF4to62443 data validation");
console.log("───────────────────────────");
console.log(`CAF outcomes:            ${stats.outcomes}`);
console.log(`Mappings:                ${stats.mappings}`);
console.log(`62443 requirements used: ${stats.requirementsReferenced}`);
console.log(`Unverified outcomes:     ${stats.unverified}`);
console.log("");

for (const w of warnings) console.warn(`  ⚠  ${w.message}`);
for (const e of errors) console.error(`  ✖  ${e.message}`);

if (errors.length === 0) {
  console.log(`\n✔ No errors. ${warnings.length} warning(s).`);
  process.exit(0);
}
console.error(`\n✖ ${errors.length} error(s).`);
process.exit(1);
