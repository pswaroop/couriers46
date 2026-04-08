// scripts/patch-helmet-esm.cjs
const fs = require('fs')
const path = require('path')

const helmetDir = path.resolve('node_modules/react-helmet-async')
const helmetPkgPath = path.join(helmetDir, 'package.json')

if (!fs.existsSync(helmetPkgPath)) {
  console.log('[patch-helmet] react-helmet-async not found, skipping')
  process.exit(0)
}

const pkg = JSON.parse(fs.readFileSync(helmetPkgPath, 'utf8'))

// Already patched
if (pkg.exports?.['.']?.import?.includes('esm-node')) {
  console.log('[patch-helmet] Already patched, skipping')
  process.exit(0)
}

// Determine the CJS entry point
const cjsEntry = pkg.main || './lib/index.js'
// Resolve it relative to the lib/ folder the wrapper will live in
const relCjs = cjsEntry.startsWith('./lib/')
  ? cjsEntry.replace('./lib/', './')    // wrapper is inside lib/ → same dir
  : '../' + cjsEntry.replace('./', '') // wrapper is inside lib/ but main isn't

// Create an ESM wrapper using createRequire — the only reliable way to
// re-export CJS named exports as ESM in Node.js v18+
const esmWrapper = `
// Auto-generated ESM wrapper for react-helmet-async
// Needed because the package ships CJS-only and lacks an exports.import field.
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const _pkg = _require('${relCjs}');
export const Helmet         = _pkg.Helmet;
export const HelmetProvider = _pkg.HelmetProvider;
export const HelmetData     = _pkg.HelmetData;
export const FilledContext  = _pkg.FilledContext;
export default _pkg;
`.trimStart()

const wrapperPath = path.join(helmetDir, 'lib', 'index.esm-node.js')
fs.writeFileSync(wrapperPath, esmWrapper)

// Patch exports in package.json
pkg.exports = {
  '.': {
    import:  './lib/index.esm-node.js',
    require: cjsEntry,
    default: cjsEntry,
  },
}

fs.writeFileSync(helmetPkgPath, JSON.stringify(pkg, null, 2))
console.log('[patch-helmet] ✅ Patched react-helmet-async with ESM wrapper')