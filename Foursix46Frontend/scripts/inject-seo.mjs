// import { readFileSync, writeFileSync, readdirSync } from 'fs'
// import { join, relative } from 'path'
// import { fileURLToPath } from 'url'

// const __dirname = fileURLToPath(new URL('.', import.meta.url))
// const DIST      = join(__dirname, '../dist')
// const BASE_URL  = 'https://www.route46couriers.co.uk'

// const SKIP_PREFIXES = ['/admin', '/send-parcel', '/pay']
// const counts = { injected: 0, replaced: 0, skipped: 0, noData: 0, total: 0 }

// // ─── File walk ───────────────────────────────────────────────────────────────
// function walk(dir, out = []) {
//   for (const e of readdirSync(dir, { withFileTypes: true })) {
//     const p = join(dir, e.name)
//     e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p)
//   }
//   return out
// }

// function routeFrom(file) {
//   const rel = relative(DIST, file).replace(/\\/g, '/')
//   const r   = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
//   return r === '' ? '/' : r
// }

// // ─── Hydration data extraction ───────────────────────────────────────────────
// //
// // vite-react-ssg injects at bottom of page:
// //   window.staticRouterHydrationData = JSON.parse('...')   ← single-quoted (most common)
// //   window.staticRouterHydrationData = JSON.parse("...")   ← double-quoted (escaped inner JSON)
// //
// // We try BOTH patterns to handle either format robustly.

// function extractHydrationData(html) {
//   let parsed = null

//   // Pattern 1: single-quoted  → JSON.parse('{"key":"val"}')
//   const m1 = html.match(
//     /window\.staticRouterHydrationData\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\)/s
//   )
//   if (m1) {
//     try { parsed = JSON.parse(m1[1]) } catch (_) {}
//   }

//   // Pattern 2: double-quoted  → JSON.parse("{\"key\":\"val\"}")
//   // Inner double quotes are escaped as \" in the raw HTML
//   if (!parsed) {
//     const m2 = html.match(
//       /window\.staticRouterHydrationData\s*=\s*JSON\.parse\("((?:[^"\\]|\\.)*)"\)/s
//     )
//     if (m2) {
//       // Unescape inner \" → " so we get valid JSON
//       try { parsed = JSON.parse(m2[1].replace(/\\"/g, '"')) } catch (_) {}
//     }
//   }

//   return parsed
// }

// // Recursively find the first object that looks like a page's SEO data
// function findPageSeoData(obj, depth = 0) {
//   if (!obj || typeof obj !== 'object' || Array.isArray(obj) || depth > 8) return null
//   // A page-data object always has seoTitle (or heroTitle) + seoDescription together
//   if ((obj.seoTitle || obj.heroTitle) && obj.seoDescription) return obj
//   for (const v of Object.values(obj)) {
//     const r = findPageSeoData(v, depth + 1)
//     if (r) return r
//   }
//   return null
// }

// // Grab the first absolute-URL hero image rendered in the body
// function extractHeroImage(html) {
//   const m = html.match(
//     /<img[^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["'][^>]*class=["'][^"']*(?:absolute|object-cover)[^"']*["']/i
//   ) || html.match(
//     /<img[^>]+class=["'][^"']*(?:absolute|object-cover)[^"']*["'][^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["']/i
//   )
//   return m?.[1] ?? null
// }

// // ─── Strip Helmet comment-wrapped SEO blocks ──────────────────────────────────
// // react-helmet-async + vite-react-ssg sometimes wraps injections in HTML comments:
// //   <!-- <title>…</title> <meta name="description" …> <meta name="author" …> -->
// function stripCommentedSeoBlocks(html) {
//   return html.replace(
//     /<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi,
//     ''
//   )
// }

// // ─── Tag upsert ───────────────────────────────────────────────────────────────
// function upsert(html, pattern, tag) {
//   return pattern.test(html)
//     ? html.replace(pattern, tag)
//     : html.replace('</head>', `  ${tag}\n</head>`)
// }

// function esc(s) { return (s ?? '').replace(/"/g, '&quot;') }

// // ─── Core processor ───────────────────────────────────────────────────────────
// function processFile(filePath) {
//   const route = routeFrom(filePath)
//   counts.total++

//   if (SKIP_PREFIXES.some(p => route.startsWith(p))) {
//     console.log(`[seo] ⏭  skip       ${route}`)
//     counts.skipped++
//     return
//   }

//   let html     = readFileSync(filePath, 'utf-8')
//   const before = html

//   // ── Extract page data from hydration JSON ─────────────────────────────
//   const hydration = extractHydrationData(html)
//   const pageData  = hydration ? findPageSeoData(hydration) : null

//   if (!pageData) {
//     console.log(`[seo] ⚠️  no-data   ${route}  (no hydration seoTitle found — title left as-is)`)
//     counts.noData++
//     // Still fix canonical and og:url from route path even if no page data
//   }

//   const seoTitle  = pageData?.seoTitle    || pageData?.heroTitle
//   const seoDesc   = pageData?.seoDescription
//   const canonical = pageData?.canonicalUrl || `${BASE_URL}${route === '/' ? '' : route}`
//   const heroImg   = extractHeroImage(html)
//   const ogImage   = pageData?.ogImage      || heroImg || `${BASE_URL}/route46logo.png`
//   const noindex   = pageData?.noindex === true

//   // ── Step 1: Strip commented-out Helmet SEO blocks ─────────────────────
//   html = stripCommentedSeoBlocks(html)

//   // ── Step 2: Title ─────────────────────────────────────────────────────
//   if (seoTitle) {
//     html = upsert(html, /<title>[^<]*<\/title>/i, `<title>${esc(seoTitle)}</title>`)
//   }

//   // ── Step 3: Meta description ──────────────────────────────────────────
//   if (seoDesc) {
//     html = upsert(html,
//       /<meta[^>]+name=["']description["'][^>]*>/i,
//       `<meta name="description" content="${esc(seoDesc)}">`
//     )
//   }

//   // ── Step 4: Robots ────────────────────────────────────────────────────
//   html = upsert(html,
//     /<meta[^>]+name=["']robots["'][^>]*>/i,
//     noindex
//       ? `<meta name="robots" content="noindex,nofollow">`
//       : `<meta name="robots" content="index, follow">`
//   )

//   // ── Step 5: Canonical ─────────────────────────────────────────────────
//   html = upsert(html,
//     /<link[^>]+rel=["']canonical["'][^>]*>/i,
//     `<link rel="canonical" href="${canonical}">`
//   )

//   // ── Step 6: Open Graph ────────────────────────────────────────────────
//   if (seoTitle) {
//     html = upsert(html,
//       /<meta[^>]+property=["']og:title["'][^>]*>/i,
//       `<meta property="og:title" content="${esc(seoTitle)}">`
//     )
//   }
//   if (seoDesc) {
//     html = upsert(html,
//       /<meta[^>]+property=["']og:description["'][^>]*>/i,
//       `<meta property="og:description" content="${esc(seoDesc)}">`
//     )
//   }
//   html = upsert(html,
//     /<meta[^>]+property=["']og:url["'][^>]*>/i,
//     `<meta property="og:url" content="${canonical}">`
//   )
//   html = upsert(html,
//     /<meta[^>]+property=["']og:image["'][^>]*>/i,
//     `<meta property="og:image" content="${ogImage}">`
//   )

//   // ── Step 7: Twitter Card ──────────────────────────────────────────────
//   if (seoTitle) {
//     html = upsert(html,
//       /<meta[^>]+name=["']twitter:title["'][^>]*>/i,
//       `<meta name="twitter:title" content="${esc(seoTitle)}">`
//     )
//   }
//   if (seoDesc) {
//     html = upsert(html,
//       /<meta[^>]+name=["']twitter:description["'][^>]*>/i,
//       `<meta name="twitter:description" content="${esc(seoDesc)}">`
//     )
//   }
//   html = upsert(html,
//     /<meta[^>]+name=["']twitter:image["'][^>]*>/i,
//     `<meta name="twitter:image" content="${ogImage}">`
//   )

//   // ── Step 8: Fix stale preload → real hero image ───────────────────────
//   if (heroImg) {
//     html = html.replace(
//       /<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]*>/i,
//       `<link rel="preload" as="image" href="${heroImg}" fetchpriority="high">`
//     )
//   }

//   // ── Write ─────────────────────────────────────────────────────────────
//   if (html !== before) {
//     writeFileSync(filePath, html, 'utf-8')
//     const hadCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(before)
//     if (hadCanonical) {
//       console.log(`[seo] ✏️  replaced   ${route}${seoTitle ? `\n          title: "${seoTitle.trim()}"` : ''}`)
//       counts.replaced++
//     } else {
//       console.log(`[seo] ✅ injected   ${route}${seoTitle ? `\n          title: "${seoTitle.trim()}"` : ''}`)
//       counts.injected++
//     }
//   } else {
//     console.log(`[seo] ✓  no-change  ${route}`)
//   }
// }

// // ─── Run ─────────────────────────────────────────────────────────────────────
// console.log(`[seo] Scanning: ${DIST}\n`)
// walk(DIST).forEach(processFile)
// console.log(
//   `\n[seo] Done ─── injected:${counts.injected}  replaced:${counts.replaced}  no-data:${counts.noData}  skipped:${counts.skipped}  total:${counts.total}`
// )
// console.log(
//   `\n[seo] TIP: If you see "no-data" for CMS pages, the JSON.parse format changed.\n` +
//   `      Add a console.log(html.slice(html.indexOf('staticRouterHydration'), html.indexOf('</script>', html.indexOf('staticRouterHydration')))) in processFile to inspect the raw script block.`
// )
// scripts/inject-seo.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// ─── Load .env file manually (Vite env vars are NOT auto-loaded in Node.js) ──
// This is the #1 reason VITE_API_URL is undefined at script runtime.
function loadEnv() {
  const envPath = join(__dirname, '../.env')
  const envLocalPath = join(__dirname, '../.env.local')
  for (const p of [envLocalPath, envPath]) {
    if (!existsSync(p)) continue
    const lines = readFileSync(p, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (!(key in process.env)) process.env[key] = val
    }
    console.log(`[seo] Loaded env from: ${p}`)
  }
}
loadEnv()

const DIST     = join(__dirname, '../dist')
const BASE_URL = 'https://www.route46couriers.co.uk'

// FIX: VITE_API_URL already contains the /api prefix
// e.g. https://europe-west2-xxx.cloudfunctions.net/api
// So endpoint paths must NOT repeat /api — just /services, /sectors etc.
const API_URL  = (process.env.VITE_API_URL || '').replace(/\/$/, '')

const SKIP_PREFIXES = ['/admin', '/send-parcel', '/pay']
const counts = { injected: 0, replaced: 0, skipped: 0, noData: 0, total: 0 }


// ─── File walk ────────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p)
  }
  return out
}

function routeFrom(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  const r = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '' ? '/' : r
}


// ─── Canonical normalizer ─────────────────────────────────────────────────────
function normalizeCanonical(url) {
  if (!url) return null
  return url
    .replace(/^https?:\/\/(?:www\.)?route46couriers\.co\.uk/, BASE_URL)
}


// ─── API helpers ──────────────────────────────────────────────────────────────
async function safeFetch(url) {
  try {
    console.log(`[seo]   GET ${url}`)
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[seo]   ↳ HTTP ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (e) {
    console.warn(`[seo]   ↳ fetch error: ${e.message}`)
    return null
  }
}

// Unwrap response — handles both { data: [...] } and plain [...]
function unwrapList(r) {
  if (!r) return []
  if (Array.isArray(r)) return r
  if (Array.isArray(r.data)) return r.data
  if (Array.isArray(r.services)) return r.services
  if (Array.isArray(r.sectors)) return r.sectors
  if (Array.isArray(r.locations)) return r.locations
  if (Array.isArray(r.blogs)) return r.blogs
  if (Array.isArray(r.posts)) return r.posts
  // last resort: find the first array value
  for (const v of Object.values(r)) {
    if (Array.isArray(v)) return v
  }
  return []
}

function unwrapItem(r) {
  if (!r) return null
  // Single item responses: { data: {...} } or the item directly
  if (r.slug || r.seoTitle || r.heroTitle) return r
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) return r.data
  return r
}

function toSeoEntry(item) {
  if (!item) return null
  return {
    seoTitle:       item.seoTitle       || item.heroTitle    || item.name   || item.title || null,
    seoDescription: item.seoDescription || item.description                               || null,
    noindex:        item.noindex === true,
    ogImage:        item.ogImage        || item.heroImage    || item.image                || null,
    canonicalUrl:   item.canonicalUrl ? normalizeCanonical(item.canonicalUrl) : null,
  }
}


// ─── Build API route map ──────────────────────────────────────────────────────
// FIX: endpoint paths use NO extra /api prefix — it's already in VITE_API_URL.
// Wrong (old): ${API_URL}/api/services  →  .../api/api/services  ❌
// Correct:     ${API_URL}/services      →  .../api/services      ✅
async function buildRouteMap() {
  const map = new Map()

  if (!API_URL) {
    console.warn('\n[seo] ⚠️  VITE_API_URL is not set.')
    console.warn('[seo]     The script will fall back to existing <title>/<meta description> in each HTML file.')
    console.warn('[seo]     Set VITE_API_URL in your .env file, e.g.:')
    console.warn('[seo]     VITE_API_URL=https://europe-west2-xxx.cloudfunctions.net/api\n')
    return map
  }

  console.log(`[seo] API base: ${API_URL}`)
  console.log('[seo] Fetching slug lists...\n')

  // Step 1: fetch all four list endpoints
  const [rawSvcs, rawScts, rawLocs, rawBlgs] = await Promise.all([
    safeFetch(`${API_URL}/services`),
    safeFetch(`${API_URL}/sectors`),
    safeFetch(`${API_URL}/locations`),
    safeFetch(`${API_URL}/blog`),
  ])

  const svcList = unwrapList(rawSvcs).filter(i => i.slug)
  const sctList = unwrapList(rawScts).filter(i => i.slug)
  const locList = unwrapList(rawLocs).filter(i => i.slug)
  const blgList = unwrapList(rawBlgs).filter(i => i.slug && i.status === 'published')

  console.log(`\n[seo] Lists: ${svcList.length} services, ${sctList.length} sectors, ${locList.length} locations, ${blgList.length} blogs`)
  console.log('[seo] Fetching individual items for full SEO fields...\n')

  // Step 2: fetch every individual item in parallel
  const fetchItem = async (type, slug) => {
    const raw = await safeFetch(`${API_URL}/${type}/${slug}`)
    return unwrapItem(raw)
  }

  const [svcItems, sctItems, locItems, blgItems] = await Promise.all([
    Promise.all(svcList.map(i => fetchItem('services', i.slug))),
    Promise.all(sctList.map(i => fetchItem('sectors', i.slug))),
    Promise.all(locList.map(i => fetchItem('locations', i.slug))),
    Promise.all(blgList.map(i => fetchItem('blog', i.slug))),
  ])

  // Step 3: populate map
  svcItems.forEach((item, idx) => {
    const entry = toSeoEntry(item)
    if (entry?.seoTitle) {
      map.set(`/services/${svcList[idx].slug}`, entry)
      console.log(`[seo]   ✔ /services/${svcList[idx].slug} → "${entry.seoTitle}"`)
    }
  })
  sctItems.forEach((item, idx) => {
    const entry = toSeoEntry(item)
    if (entry?.seoTitle) {
      map.set(`/sectors/${sctList[idx].slug}`, entry)
      console.log(`[seo]   ✔ /sectors/${sctList[idx].slug} → "${entry.seoTitle}"`)
    }
  })
  locItems.forEach((item, idx) => {
    const entry = toSeoEntry(item)
    if (entry?.seoTitle) {
      map.set(`/locations/${locList[idx].slug}`, entry)
      console.log(`[seo]   ✔ /locations/${locList[idx].slug} → "${entry.seoTitle}"`)
    }
  })
  blgItems.forEach((item, idx) => {
    const entry = toSeoEntry(item)
    if (entry?.seoTitle) {
      map.set(`/blog/${blgList[idx].slug}`, entry)
      console.log(`[seo]   ✔ /blog/${blgList[idx].slug} → "${entry.seoTitle}"`)
    }
  })

  // Step 4: location × service combos
  for (const loc of locList) {
    for (const svc of svcList) {
      const key = `/locations/${loc.slug}/${svc.slug}`
      if (!map.has(key)) {
        const svcEntry = map.get(`/services/${svc.slug}`)
        const locEntry = map.get(`/locations/${loc.slug}`)
        const svcName  = svcEntry?.seoTitle?.split('|')[0]?.trim() || svc.name || svc.slug
        const locName  = locEntry?.seoTitle?.split('|')[0]?.trim() || loc.name || loc.slug
        map.set(key, {
          seoTitle:       `${svcName} in ${locName} | Route46 Couriers`,
          seoDescription: null,
          noindex:        false,
          ogImage:        svcEntry?.ogImage || null,
          canonicalUrl:   null,
        })
      }
    }
  }

  console.log(`\n[seo] Route map complete: ${map.size} dynamic routes\n`)
  return map
}


// ─── Hydration fallback ───────────────────────────────────────────────────────
function extractHydrationData(html) {
  let parsed = null
  const m1 = html.match(
    /window\.(?:__)?staticRouterHydrationData\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\)/s
  )
  if (m1) { try { parsed = JSON.parse(m1[1]) } catch (_) {} }

  if (!parsed) {
    const m2 = html.match(
      /window\.(?:__)?staticRouterHydrationData\s*=\s*JSON\.parse\("((?:[^"\\]|\\.)*)"\)/s
    )
    if (m2) { try { parsed = JSON.parse(m2[1].replace(/\\"/g, '"')) } catch (_) {} }
  }
  return parsed
}

function findPageSeoData(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || depth > 8) return null
  if ((obj.seoTitle || obj.heroTitle) && obj.seoDescription) return obj
  for (const v of Object.values(obj)) {
    const r = findPageSeoData(v, depth + 1)
    if (r) return r
  }
  return null
}

function extractExistingMeta(html) {
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const descM  =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i)
  return {
    title: titleM ? titleM[1].trim() : null,
    desc:  descM  ? descM[1].trim()  : null,
  }
}

function extractHeroImage(html) {
  const m =
    html.match(/<img[^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["'][^>]*class=["'][^"']*(?:absolute|object-cover)[^"']*["']/i) ||
    html.match(/<img[^>]+class=["'][^"']*(?:absolute|object-cover)[^"']*["'][^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["']/i)
  return m?.[1] ?? null
}

function esc(s) { return (s ?? '').replace(/"/g, '&quot;') }


// ─── Strip & rebuild ──────────────────────────────────────────────────────────
function stripAllSeoTags(html) {
  return html
    .replace(/<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi, '')
    .replace(/<title[^>]*>[^<]*<\/title>/gi, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:title["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:image["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:title["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:image["'][^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
}

function buildSeoBlock({ seoTitle, seoDesc, canonical, ogImage, noindex }) {
  const lines = []
  if (seoTitle) lines.push(`  <title>${esc(seoTitle)}</title>`)
  if (seoDesc)  lines.push(`  <meta name="description" content="${esc(seoDesc)}">`)
  lines.push(`  <meta name="robots" content="${noindex ? 'noindex,nofollow' : 'index, follow'}">`)
  lines.push(`  <link rel="canonical" href="${canonical}">`)
  if (seoTitle) lines.push(`  <meta property="og:title" content="${esc(seoTitle)}">`)
  if (seoDesc)  lines.push(`  <meta property="og:description" content="${esc(seoDesc)}">`)
  lines.push(`  <meta property="og:url" content="${canonical}">`)
  lines.push(`  <meta property="og:image" content="${ogImage}">`)
  if (seoTitle) lines.push(`  <meta name="twitter:title" content="${esc(seoTitle)}">`)
  if (seoDesc)  lines.push(`  <meta name="twitter:description" content="${esc(seoDesc)}">`)
  lines.push(`  <meta name="twitter:image" content="${ogImage}">`)
  return lines.join('\n')
}

function injectSeoBlock(html, block) {
  const vp = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)
  if (vp) {
    const idx = html.indexOf(vp[0]) + vp[0].length
    return html.slice(0, idx) + '\n' + block + html.slice(idx)
  }
  return html.replace(/(<head[^>]*>)/i, `$1\n${block}`)
}

function fixHeroPreload(html, heroImg) {
  if (!heroImg) return html
  return html.replace(
    /<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]*>/i,
    `<link rel="preload" as="image" href="${heroImg}" fetchpriority="high">`
  )
}


// ─── Core processor ───────────────────────────────────────────────────────────
function processFile(filePath, routeMap) {
  const route = routeFrom(filePath)
  counts.total++

  if (SKIP_PREFIXES.some(p => route.startsWith(p))) {
    console.log(`[seo] ⏭  skip      ${route}`)
    counts.skipped++
    return
  }

  let html     = readFileSync(filePath, 'utf-8')
  const before = html

  // Priority: 1) API  2) hydration JSON  3) existing HTML tags
  const apiData   = routeMap.get(route)
  const hydration = extractHydrationData(html)
  const hydraPage = hydration ? findPageSeoData(hydration) : null
  const { title: htmlTitle, desc: htmlDesc } = extractExistingMeta(html) // read BEFORE stripping

  const seoTitle  = apiData?.seoTitle       || hydraPage?.seoTitle       || hydraPage?.heroTitle || htmlTitle || null
  const seoDesc   = apiData?.seoDescription || hydraPage?.seoDescription                         || htmlDesc  || null
  const canonical = apiData?.canonicalUrl   || hydraPage?.canonicalUrl
    || `${BASE_URL}${route === '/' ? '' : route}`
  const heroImg   = extractHeroImage(html)
  const ogImage   = apiData?.ogImage || hydraPage?.ogImage || heroImg || `${BASE_URL}/route46logo.png`
  const noindex   = apiData?.noindex === true || hydraPage?.noindex === true

  const src = apiData ? 'api' : hydraPage ? 'hydration' : htmlTitle ? 'html-fallback' : 'none'

  if (!seoTitle) {
    console.log(`[seo] ⚠️  no-data  ${route}  (no SEO data found — skipping)`)
    counts.noData++
    return
  }

  html = stripAllSeoTags(html)
  html = injectSeoBlock(html, buildSeoBlock({ seoTitle, seoDesc, canonical, ogImage, noindex }))
  html = fixHeroPreload(html, heroImg)

  if (html !== before) {
    writeFileSync(filePath, html, 'utf-8')
    const hadCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(before)
    if (hadCanonical) {
      console.log(`[seo] ✏️  replaced  ${route}  [${src}]`)
    } else {
      console.log(`[seo] ✅ injected  ${route}  [${src}]`)
    }
    console.log(`          title: "${seoTitle.trim()}"`)
    console.log(`          canonical: ${canonical}`)
    hadCanonical ? counts.replaced++ : counts.injected++
  } else {
    console.log(`[seo] ✓  no-change ${route}`)
  }
}


// ─── Run ──────────────────────────────────────────────────────────────────────
console.log(`\n[seo] Scanning: ${DIST}\n`)

buildRouteMap().then(routeMap => {
  walk(DIST).forEach(f => processFile(f, routeMap))

  console.log(`\n[seo] ─── injected:${counts.injected}  replaced:${counts.replaced}  no-data:${counts.noData}  skipped:${counts.skipped}  total:${counts.total}\n`)

  if (!API_URL) {
    console.log('[seo] ACTION REQUIRED: Set VITE_API_URL in your .env file:')
    console.log('[seo] VITE_API_URL=https://europe-west2-xxx.cloudfunctions.net/api')
    console.log('[seo] This is required for dynamic route SEO (services/sectors/locations/blog).\n')
  } else if (counts.noData > 0) {
    console.log(`[seo] TIP: ${counts.noData} route(s) had no SEO data.`)
    console.log(`[seo] Verify your API base URL is correct: ${API_URL}`)
    console.log(`[seo] Test with: curl ${API_URL}/services\n`)
  }
})