// Reads `npm pack --dry-run --json` on stdin; update `expected` when the package layout changes.
import { readFileSync } from 'node:fs';

const expected = [
  'LICENSE',
  'README.md',
  'fesm2022/dwtechs-ngx-crud-builder-material.mjs',
  'fesm2022/dwtechs-ngx-crud-builder-material.mjs.map',
  'fesm2022/dwtechs-ngx-crud-builder.mjs',
  'fesm2022/dwtechs-ngx-crud-builder.mjs.map',
  'package.json',
  'types/dwtechs-ngx-crud-builder-material.d.ts',
  'types/dwtechs-ngx-crud-builder.d.ts',
];

// npm <= 11 prints an array, npm >= 12 an object keyed by package name.
const output = JSON.parse(readFileSync(0, 'utf8'));
const pkg = Array.isArray(output) ? output[0] : Object.values(output)[0];
const actual = pkg.files.map((f) => f.path);
const missing = expected.filter((f) => !actual.includes(f));
const extra = actual.filter((f) => !expected.includes(f));

if (missing.length || extra.length) {
  console.error('Package contents mismatch\nmissing:', missing, '\nunexpected:', extra);
  process.exit(1);
}

console.log(`Package contents OK: all ${expected.length} expected files are present, nothing unexpected.`);
