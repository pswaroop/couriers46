// // scripts/inject-seo.mjs
// // Run with: node scripts/inject-seo.mjs
// // Add --dry-run flag to preview without writing: node scripts/inject-seo.mjs --dry-run

// import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
// import { join, relative } from 'path'
// import { fileURLToPath } from 'url'
// import { createRequire } from 'module'
// import https from 'https'
// import http from 'http'

// const DRY_RUN   = process.argv.includes('--dry-run')
// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// const DIST      = join(__dirname, '../dist')
// const BASE_URL  = 'https://www.route46couriers.co.uk'
// const API       = 'https://europe-west2-foursix46-production-4a43f.cloudfunctions.net/api/api'

// const SKIP      = ['/admin', '/send-parcel', '/pay']
// const counts    = { api: 0, fallback: 0, skipped: 0, noData: 0, noChange: 0, total: 0 }

// console.log('═══════════════════════════════════════════════════════')
// console.log(' inject-seo.mjs — SEO tag injector')
// console.log(DRY_RUN ? ' MODE: DRY RUN (no files will be written)' : ' MODE: LIVE (files will be written)')
// console.log('═══════════════════════════════════════════════════════')
// console.log(`  DIST:    ${DIST}`)
// console.log(`  API:     ${API}`)
// console.log(`  EXISTS:  ${existsSync(DIST) ? '✅ dist folder found' : '❌ dist folder NOT FOUND — run build first'}`)
// console.log('')


// // ─── HTTP fetch using Node's built-in https module ────────────────────────────
// // Uses https/http directly — no fetch(), no dependencies, works on any Node ≥ 12
// function get(url) {
//   return new Promise((resolve) => {
//     const mod = url.startsWith('https') ? https : http
//     const req = mod.get(url, { timeout: 15000 }, (res) => {
//       // Follow redirects
//       if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
//         console.log(`  ↳ redirect ${res.statusCode} → ${res.headers.location}`)
//         return resolve(get(res.headers.location))
//       }
//       if (res.statusCode !== 200) {
//         console.error(`  ❌ HTTP ${res.statusCode} — ${url}`)
//         res.resume()
//         return resolve(null)
//       }
//       let body = ''
//       res.on('data', chunk => body += chunk)
//       res.on('end', () => {
//         try {
//           resolve(JSON.parse(body))
//         } catch (e) {
//           console.error(`  ❌ JSON parse failed for ${url}`)
//           console.error(`     First 200 chars: ${body.slice(0, 200)}`)
//           resolve(null)
//         }
//       })
//     })
//     req.on('error', e => {
//       console.error(`  ❌ Request error for ${url}: ${e.message}`)
//       resolve(null)
//     })
//     req.on('timeout', () => {
//       console.error(`  ❌ Timeout for ${url}`)
//       req.destroy()
//       resolve(null)
//     })
//   })
// }

// function asList(r) {
//   if (!r) return []
//   if (Array.isArray(r)) return r
//   for (const v of Object.values(r)) if (Array.isArray(v) && v.length > 0) return v
//   return []
// }

// function asItem(r) {
//   if (!r) return null
//   if (r.slug || r.seoTitle || r.heroTitle || r.name) return r
//   if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) return r.data
//   return null
// }

// function fixCanonical(url) {
//   if (!url) return null
//   return url.replace(/^https?:\/\/(?:www\.)?route46couriers\.co\.uk/, BASE_URL)
// }

// function esc(s) { return (s ?? '').replace(/&(?!amp;|quot;|lt;|gt;)/g, '&amp;').replace(/"/g, '&quot;') }


// // ─── Build route → SEO map ────────────────────────────────────────────────────
// async function buildMap() {
//   const map = new Map()

//   // ── Step 1: fetch slug lists ─────────────────────────────────────────────
//   console.log('── Step 1: Fetching slug lists ──────────────────────────')
//   const types = [
//     { type: 'services',  url: `${API}/services`  },
//     { type: 'sectors',   url: `${API}/sectors`   },
//     { type: 'locations', url: `${API}/locations` },
//     { type: 'blog',      url: `${API}/blog`       },
//   ]

//   const lists = {}
//   for (const { type, url } of types) {
//     console.log(`  GET ${url}`)
//     const raw = await get(url)
//     console.log(`      raw type: ${typeof raw}, isArray: ${Array.isArray(raw)}`)
//     if (raw && typeof raw === 'object') {
//       console.log(`      keys: ${Object.keys(raw).join(', ')}`)
//       if (!Array.isArray(raw) && raw.data) {
//         console.log(`      raw.data type: ${typeof raw.data}, isArray: ${Array.isArray(raw.data)}, length: ${Array.isArray(raw.data) ? raw.data.length : 'n/a'}`)
//       }
//     }
//     const items = asList(raw).filter(i => i.slug)
//     // blog: only published
//     lists[type] = type === 'blog' ? items.filter(i => i.status === 'published') : items
//     console.log(`      resolved: ${lists[type].length} items with slugs`)
//     if (lists[type].length > 0) {
//       console.log(`      sample slugs: ${lists[type].slice(0, 3).map(i => i.slug).join(', ')}`)
//     }
//   }

//   // ── Step 2: fetch individual items ──────────────────────────────────────
//   console.log('\n── Step 2: Fetching individual items ────────────────────')

//   for (const { type } of types) {
//     const items = lists[type]
//     const prefix = type === 'blog' ? '/blog' : `/${type}`

//     for (const listItem of items) {
//       const url  = `${API}/${type}/${listItem.slug}`
//       const route = `${prefix}/${listItem.slug}`
//       console.log(`  GET ${url}`)
//       const raw  = await get(url)

//       if (!raw) {
//         console.log(`      ❌ null response`)
//         continue
//       }

//       console.log(`      raw keys: ${Object.keys(raw).join(', ')}`)
//       const item = asItem(raw)

//       if (!item) {
//         console.log(`      ❌ asItem returned null`)
//         continue
//       }

//       console.log(`      seoTitle:       ${item.seoTitle       || '(none)'}`)
//       console.log(`      seoDescription: ${item.seoDescription ? item.seoDescription.slice(0, 60) + '...' : '(none)'}`)
//       console.log(`      canonicalUrl:   ${item.canonicalUrl   || '(none)'}`)
//       console.log(`      ogImage:        ${item.ogImage        || '(none)'}`)

//       const entry = {
//         seoTitle:  item.seoTitle    || item.heroTitle || item.name  || item.title || null,
//         seoDesc:   item.seoDescription || item.description          || null,
//         canonical: fixCanonical(item.canonicalUrl) || `${BASE_URL}${route}`,
//         ogImage:   item.ogImage  || item.heroImage  || item.image   || `${BASE_URL}/route46logo.png`,
//         noindex:   item.noindex === true,
//       }

//       if (entry.seoTitle) {
//         map.set(route, entry)
//         console.log(`      ✅ mapped → ${route}`)
//       } else {
//         console.log(`      ⚠️  no usable title — NOT added to map`)
//       }
//     }
//   }

//   // ── Step 3: location × service combos ───────────────────────────────────
//   for (const loc of lists.locations) {
//     for (const svc of lists.services) {
//       const key = `/locations/${loc.slug}/${svc.slug}`
//       if (map.has(key)) continue
//       const svcE = map.get(`/services/${svc.slug}`)
//       const locE = map.get(`/locations/${loc.slug}`)
//       const svcName = svcE?.seoTitle?.split('|')[0].trim() || svc.name || svc.slug
//       const locName = locE?.seoTitle?.split('|')[0].trim() || loc.name || loc.slug
//       map.set(key, {
//         seoTitle:  `${svcName} in ${locName} | Route46 Couriers`,
//         seoDesc:   null,
//         canonical: `${BASE_URL}${key}`,
//         ogImage:   svcE?.ogImage || `${BASE_URL}/route46logo.png`,
//         noindex:   false,
//       })
//     }
//   }

//   console.log(`\n── Map summary: ${map.size} routes ─────────────────────────`)
//   for (const [route, e] of map) {
//     console.log(`  ${route}`)
//     console.log(`    title:     ${e.seoTitle}`)
//     console.log(`    canonical: ${e.canonical}`)
//   }
//   console.log('')

//   return map
// }


// // ─── HTML utils ───────────────────────────────────────────────────────────────
// function walk(dir, out = []) {
//   for (const e of readdirSync(dir, { withFileTypes: true })) {
//     const p = join(dir, e.name)
//     e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p)
//   }
//   return out
// }

// function routeFrom(file) {
//   const rel = relative(DIST, file).replace(/\\/g, '/')
//   if (rel === 'index.html') return '/'
//   const r = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')
//   return r === '' ? '/' : r
// }

// function strip(html) {
//   return html
//     .replace(/<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|robots|og:|twitter:))[^]*?-->/gi, '')
//     .replace(/<title[^>]*>[^<]*<\/title>/gi, '')
//     .replace(/<meta[^>]+name=["']description["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+name=["']robots["'][^>]*\/?>/gi, '')
//     .replace(/<link[^>]+rel=["']canonical["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+property=["']og:title["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+property=["']og:description["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+property=["']og:url["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+property=["']og:image["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+name=["']twitter:title["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+name=["']twitter:description["'][^>]*\/?>/gi, '')
//     .replace(/<meta[^>]+name=["']twitter:image["'][^>]*\/?>/gi, '')
//     .replace(/\n{3,}/g, '\n\n')
// }

// function buildBlock({ seoTitle, seoDesc, canonical, ogImage, noindex }) {
//   return [
//     seoTitle ? `  <title>${esc(seoTitle)}</title>`                                   : '',
//     seoDesc  ? `  <meta name="description" content="${esc(seoDesc)}">`               : '',
//     `  <meta name="robots" content="${noindex ? 'noindex,nofollow' : 'index, follow'}">`,
//     `  <link rel="canonical" href="${canonical}">`,
//     seoTitle ? `  <meta property="og:title" content="${esc(seoTitle)}">`             : '',
//     seoDesc  ? `  <meta property="og:description" content="${esc(seoDesc)}">`        : '',
//     `  <meta property="og:url" content="${canonical}">`,
//     `  <meta property="og:image" content="${ogImage}">`,
//     seoTitle ? `  <meta name="twitter:title" content="${esc(seoTitle)}">`            : '',
//     seoDesc  ? `  <meta name="twitter:description" content="${esc(seoDesc)}">`       : '',
//     `  <meta name="twitter:image" content="${ogImage}">`,
//   ].filter(Boolean).join('\n')
// }

// function injectAfterViewport(html, block) {
//   const vp = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)
//   if (vp) {
//     const idx = html.indexOf(vp[0]) + vp[0].length
//     return html.slice(0, idx) + '\n' + block + html.slice(idx)
//   }
//   return html.replace(/(<head[^>]*>)/i, `$1\n${block}`)
// }


// // ─── Process one file ─────────────────────────────────────────────────────────
// function processFile(filePath, map) {
//   const route = routeFrom(filePath)
//   counts.total++

//   if (SKIP.some(p => route.startsWith(p))) {
//     counts.skipped++
//     return
//   }

//   let html = readFileSync(filePath, 'utf-8')
//   let entry = map.get(route)
//   let src   = 'api'

//   if (!entry) {
//     // HTML fallback: read existing title/desc from the file itself
//     const tM = html.match(/<title[^>]*>([^<]+)<\/title>/i)
//     const dM = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
//              || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
//     if (tM) {
//       entry = {
//         seoTitle:  tM[1].trim(),
//         seoDesc:   dM ? dM[1].trim() : null,
//         canonical: `${BASE_URL}${route === '/' ? '' : route}`,
//         ogImage:   `${BASE_URL}/route46logo.png`,
//         noindex:   false,
//       }
//       src = 'html-fallback'
//     } else {
//       console.log(`  ⚠️  no-data  ${route}`)
//       counts.noData++
//       return
//     }
//   }

//   const before  = html
//   const stripped = strip(html)
//   const block   = buildBlock(entry)
//   const after   = injectAfterViewport(stripped, block)

//   if (after === before) {
//     counts.noChange++
//     return
//   }

//   if (!DRY_RUN) {
//     writeFileSync(filePath, after, 'utf-8')
//   }

//   console.log(`  ${DRY_RUN ? '[DRY] ' : ''}${src === 'api' ? '✅ API    ' : '🔄 FALLBK '} ${route}`)
//   console.log(`         title:     "${entry.seoTitle}"`)
//   console.log(`         canonical: ${entry.canonical}`)
//   src === 'api' ? counts.api++ : counts.fallback++
// }


// // ─── Entry point ─────────────────────────────────────────────────────────────
// if (!existsSync(DIST)) {
//   console.error('\n❌ dist folder not found. Run your build first (npm run build).\n')
//   process.exit(1)
// }

// console.log('── Step 0: HTML files in dist ───────────────────────────')
// const files = walk(DIST)
// console.log(`  Found ${files.length} HTML files:`)
// files.forEach(f => console.log(`  ${routeFrom(f)}  →  ${f.replace(DIST, 'dist')}`))
// console.log('')

// buildMap().then(map => {
//   console.log('── Step 3: Processing HTML files ────────────────────────')
//   files.forEach(f => processFile(f, map))

//   console.log('\n═══════════════════════════════════════════════════════')
//   console.log(` Done — api:${counts.api}  fallback:${counts.fallback}  no-data:${counts.noData}  skipped:${counts.skipped}  no-change:${counts.noChange}  total:${counts.total}`)
//   if (DRY_RUN) console.log(' DRY RUN — no files were modified')
//   console.log('═══════════════════════════════════════════════════════\n')
// })
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST      = join(__dirname, '../dist')
const BASE_URL  = 'https://www.route46couriers.co.uk'
const API       = 'https://europe-west2-foursix46-production-4a43f.cloudfunctions.net/api/api'

const SKIP   = ['/admin', '/send-parcel', '/pay']
const counts = { ok: 0, fallback: 0, skipped: 0, noData: 0, total: 0 }

// ─── HTTP fetch ──────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { timeout: 20000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location))
      }
      if (res.statusCode !== 200) {
        console.error(`  [FETCH ERROR] HTTP ${res.statusCode} — ${url}`)
        res.resume()
        return resolve(null)
      }
      let body = ''
      res.setEncoding('utf8')
      res.on('data', c => body += c)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          console.error(`  [JSON ERROR] Parse failed — ${url}`)
          resolve(null)
        }
      })
    })
    req.on('error', e => { console.error(`  [REQ ERROR] ${url}: ${e.message}`); resolve(null) })
  })
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p)
  }
  return out
}

function routeFrom(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  const r = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')
  return r === '' ? '/' : r
}

function esc(s) {
  return (s ?? '')
    .replace(/&(?!(amp|quot|lt|gt|apos);)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function asList(r) {
  if (!r) return []
  if (Array.isArray(r)) return r
  if (r.data && Array.isArray(r.data)) return r.data
  for (const v of Object.values(r)) if (Array.isArray(v)) return v
  return []
}

function asItem(r) {
  if (!r) return null
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) return r.data
  return r
}

// ─── Build Map ────────────────────────────────────────────────────────────────
async function buildMap() {
  const map = new Map()
  console.log(`\n[SEO_MAP] Fetching from API: ${API}`)

  const [svcsRaw, sctsRaw, locsRaw, blogsRaw] = await Promise.all([
    get(`${API}/services`),
    get(`${API}/sectors`),
    get(`${API}/locations`),
    get(`${API}/blog`),
  ])

  const svcs  = asList(svcsRaw).filter(i => i.slug)
  const scts  = asList(sctsRaw).filter(i => i.slug)
  const locs  = asList(locsRaw).filter(i => i.slug)
  const blogs = asList(blogsRaw).filter(i => i.slug)

  console.log(`[SEO_MAP] Found: SVCS(${svcs.length}) SCTS(${scts.length}) LOCS(${locs.length}) BLOGS(${blogs.length})`)

  const fetchAll = (type, items) =>
    Promise.all(items.map(i => get(`${API}/${type}/${i.slug}`).then(asItem)))

  const [svcItems, sctItems, locItems, blogItems] = await Promise.all([
    fetchAll('services',  svcs),
    fetchAll('sectors',   scts),
    fetchAll('locations', locs),
    fetchAll('blog',      blogs),
  ])

  const add = (route, item) => {
    if (!item) return
    const title = item.seoTitle || item.heroTitle || item.name || item.title
    const desc  = item.seoDescription || item.heroSubtitle || item.description

    if (title) {
      map.set(route, {
        seoTitle: title,
        seoDesc: desc,
        canonical: item.canonicalUrl || `${BASE_URL}${route}`,
        ogImage: item.ogImage || item.heroImage || `${BASE_URL}/route46logo.png`,
        noindex: item.noindex === true
      })
    }
  }

  svcItems.forEach((item, i) => add(`/services/${svcs[i].slug}`, item))
  sctItems.forEach((item, i) => add(`/sectors/${scts[i].slug}`, item))
  locItems.forEach((item, i) => add(`/locations/${locs[i].slug}`, item))
  blogItems.forEach((item, i) => add(`/blog/${blogs[i].slug}`, item))

  // Logic for Loc x Svc combos
  for (const loc of locs) {
    for (const svc of svcs) {
      const key = `/locations/${loc.slug}/${svc.slug}`
      if (map.has(key)) continue
      const svcName = svc.name || svc.slug
      const locName = loc.name || loc.slug
      map.set(key, {
        seoTitle: `${svcName} in ${locName} | Route46 Couriers`,
        seoDesc: `Professional ${svcName} covering ${locName} and surrounding areas.`,
        canonical: `${BASE_URL}${key}`,
        ogImage: `${BASE_URL}/route46logo.png`,
        noindex: false
      })
    }
  }

  return map
}

// ─── HTML Processing ──────────────────────────────────────────────────────────
function stripTags(html) {
  // More aggressive regex to catch tags with any attributes or formatting
  return html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta[^>]+(?:name|property)=["'](?:description|robots|og:|twitter:)[^>]*\/?>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*\/?>/gi, '')
    .replace(//gi, '') // Clean vite-ssg artifacts
}

function buildBlock(entry) {
  return `
  <title>${esc(entry.seoTitle)}</title>
  <meta name="description" content="${esc(entry.seoDesc)}">
  <meta name="robots" content="${entry.noindex ? 'noindex,nofollow' : 'index, follow'}">
  <link rel="canonical" href="${entry.canonical}">
  <meta property="og:title" content="${esc(entry.seoTitle)}">
  <meta property="og:description" content="${esc(entry.seoDesc)}">
  <meta property="og:url" content="${entry.canonical}">
  <meta property="og:image" content="${entry.ogImage}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(entry.seoTitle)}">
  <meta name="twitter:description" content="${esc(entry.seoDesc)}">
  <meta name="twitter:image" content="${entry.ogImage}">
  `
}

function processFile(filePath, map) {
  const route = routeFrom(filePath)
  counts.total++

  if (SKIP.some(p => route.startsWith(p))) {
    counts.skipped++
    return
  }

  let html = readFileSync(filePath, 'utf-8')
  let entry = map.get(route)
  let mode = 'API'

  if (!entry) {
    const tMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    if (tMatch) {
      entry = {
        seoTitle: tMatch[1].trim(),
        seoDesc: "Professional same day courier services UK.",
        canonical: `${BASE_URL}${route === '/' ? '' : route}`,
        ogImage: `${BASE_URL}/route46logo.png`,
        noindex: false
      }
      mode = 'FALLBACK'
    } else {
      counts.noData++
      return
    }
  }

  const cleanHtml = stripTags(html)
  const seoBlock = buildBlock(entry)
  
  // Inject at the top of <head> to ensure it's the first thing parsers see
  const finalHtml = cleanHtml.replace(/(<head[^>]*>)/i, `$1${seoBlock}`)

  writeFileSync(filePath, finalHtml, 'utf-8')
  console.log(`[${mode}] ${route.padEnd(35)} -> ${entry.seoTitle.slice(0, 40)}...`)
  mode === 'API' ? counts.ok++ : counts.fallback++
}

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  const map = await buildMap()
  const files = walk(DIST)
  console.log(`\n[PROCESS] Injecting into ${files.length} files...\n`)
  
  files.forEach(f => processFile(f, map))

  console.log('\n' + '='.repeat(40))
  console.log(`  COMPLETED`)
  console.log(`  Injected (API): ${counts.ok}`)
  console.log(`  Fallback:       ${counts.fallback}`)
  console.log(`  Skipped:        ${counts.skipped}`)
  console.log('='.repeat(40) + '\n')
}

run().catch(console.error)