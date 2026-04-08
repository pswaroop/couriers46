// scripts/patch-helmet-esm.cjs
const fs = require('fs')
const path = require('path')

// ── Step 1: Patch top-level react-helmet-async ────────────────────────────
const helmetDir   = path.resolve('node_modules/react-helmet-async')
const helmetPkg   = path.join(helmetDir, 'package.json')

if (fs.existsSync(helmetPkg)) {
  const pkg = JSON.parse(fs.readFileSync(helmetPkg, 'utf8'))
  const cjsEntry = pkg.main || './lib/index.js'

  // Relative path from lib/ to the CJS entry
  const relCjs = cjsEntry.startsWith('./lib/')
    ? cjsEntry.replace('./lib/', './')
    : '../' + cjsEntry.replace('./', '')

  // ESM wrapper using createRequire — valid ONLY in Node.js
  const esmWrapper =
`// Auto-generated ESM wrapper (Node.js only — do not import in browser builds)
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const _pkg = _require('${relCjs}');
export const Helmet         = _pkg.Helmet;
export const HelmetProvider = _pkg.HelmetProvider;
export const HelmetData     = _pkg.HelmetData;
export const FilledContext  = _pkg.FilledContext;
export default _pkg;
`
  fs.writeFileSync(path.join(helmetDir, 'lib', 'index.esm-node.js'), esmWrapper)

  // Patch exports: Node.js → ESM wrapper, everything else → plain CJS
  pkg.exports = {
    '.': {
      node:    { import: './lib/index.esm-node.js', require: cjsEntry },
      import:  cjsEntry,
      require: cjsEntry,
      default: cjsEntry,
    },
  }
  fs.writeFileSync(helmetPkg, JSON.stringify(pkg, null, 2))
  console.log('[patch-helmet] ✅ Patched top-level react-helmet-async')
} else {
  console.warn('[patch-helmet] ⚠️  top-level react-helmet-async not found')
}

// ── Step 2: Delete the nested copy inside vite-react-ssg ─────────────────
// Without this, vite-react-ssg uses its OWN copy → dual-instance → crash
const nestedDir = path.resolve('node_modules/vite-react-ssg/node_modules/react-helmet-async')
if (fs.existsSync(nestedDir)) {
  fs.rmSync(nestedDir, { recursive: true, force: true })
  console.log('[patch-helmet] ✅ Removed nested vite-react-ssg/node_modules/react-helmet-async')
} else {
  console.log('[patch-helmet] ℹ️  No nested copy found (already clean)')
}