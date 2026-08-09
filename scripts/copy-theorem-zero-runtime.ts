import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const sourcePath = resolve('theorem_zero_runtime_rolling.html');
const destinationPath = resolve('dist/theorem-zero/index.html');

if (!existsSync(sourcePath)) {
  throw new Error('Missing theorem_zero_runtime_rolling.html');
}

const html = readFileSync(sourcePath, 'utf8');
const requiredMarkers = [
  '<title>Theorem Zero — Rolling Lawful Runtime</title>',
  '"title": "Theorem Zero — Canonical Substrate v1.0"',
  '"canonical_status": "canonical_substrate_v1_0"',
  '"field_type": "triangular_barycentric"',
  '"ledger_is_semantic_authority": true',
  '"canonical_runtime_failure_mode": "hard_fail"',
];

for (const marker of requiredMarkers) {
  if (!html.includes(marker)) {
    throw new Error(`Theorem Zero runtime is missing required canonical marker: ${marker}`);
  }
}

mkdirSync(dirname(destinationPath), { recursive: true });
writeFileSync(destinationPath, html);
console.log('Published theorem_zero_runtime_rolling.html -> dist/theorem-zero/index.html unchanged');
