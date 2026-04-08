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
const wrapperPath = path.join(helmetDir, 'lib', 'index.esm-node.js')

// ESM wrapper using createRequire — valid ONLY in Node.js, not in browsers
const esmWrapper = `// Auto-generated ESM wrapper (Node.js context only)
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const _pkg = _require('./index.js');
export const Helmet         = _pkg.Helmet;
export const HelmetProvider = _pkg.HelmetProvider;
export const HelmetData     = _pkg.HelmetData;
export const FilledContext  = _pkg.FilledContext;
export default _pkg;
`

fs.writeFileSync(wrapperPath, esmWrapper)

// Use NESTED `node` condition so only Node.js picks up the ESM wrapper.
// Vite/Rollup (browser + SSR builds) do NOT activate the `node` condition —
// they fall through to `import`/`default` which point to the plain CJS file.
// Vite handles CJS→ESM transformation internally via @rollup/plugin-commonjs.
pkg.exports = {
  '.': {
    node: {
      import:  './lib/index.esm-node.js', // ← vite-react-ssg SSG tool (Node.js ESM)
      require: './lib/index.js',
    },
    import:  './lib/index.js', // ← Vite browser build falls here (CJS, Rollup handles it)
    require: './lib/index.js',
    default: './lib/index.js',
  },
}

fs.writeFileSync(helmetPkgPath, JSON.stringify(pkg, null, 2))
console.log('[patch-helmet] ✅ Patched react-helmet-async with node-scoped ESM wrapper')