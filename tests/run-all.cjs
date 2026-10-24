// Runs every test suite. Usage: node tests/run-all.cjs
// Build first (node build.cjs): s1-integration checks the built file in builds/.
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const files = fs.readdirSync(__dirname).filter(f => /\.test\.cjs$/.test(f)).sort();
let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8' });
  const ok = r.status === 0;
  if (!ok) failed++;
  const last = ((ok ? r.stdout : r.stderr || r.stdout) || '').trim().split('\n').pop() || '';
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}  ${ok ? '' : last.slice(0, 160)}`);
}
console.log(failed ? `${failed} of ${files.length} suites failed` : `all ${files.length} suites pass`);
process.exit(failed ? 1 : 0);
