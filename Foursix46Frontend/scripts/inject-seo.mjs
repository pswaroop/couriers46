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
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST      = join(__dirname, '../dist')
const BASE_URL  = 'https://www.route46couriers.co.uk'
const API_URL   = process.env.VITE_API_URL || ''

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


// ─── routeFrom ────────────────────────────────────────────────────────────────
function routeFrom(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  const r = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '' ? '/' : r
}


// ─── Canonical normalizer ─────────────────────────────────────────────────────
// FIX: API stores canonicalUrl as https://route46couriers.co.uk/... (no www).
// Normalise to always use www to match BASE_URL and avoid split-canonicals.
function normalizeCanonical(url) {
  if (!url) return null
  return url
    .replace(/^https?:\/\/route46couriers\.co\.uk/, `${BASE_URL}`)
    .replace(/^https?:\/\/www\.route46couriers\.co\.uk/, `${BASE_URL}`)
}


// ─── API helpers ─────────────────────────────────────────────────────────────
async function safeFetch(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) { console.warn(`[seo] API ${url} → HTTP ${res.status}`); return null }
    return await res.json()
  } catch (e) {
    console.warn(`[seo] fetch failed: ${url} —`, e.message)
    return null
  }
}

function normalizeList(r) {
  return Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : []
}

// Map a fully-fetched individual API item into a standard SEO entry.
// FIX: list endpoints omit seoTitle/seoDescription/canonicalUrl/ogImage —
// only the individual item endpoint (/api/services/:slug etc.) returns them.
function toSeoEntry(item) {
  return {
    seoTitle:       item.seoTitle       || item.heroTitle    || item.name   || null,
    seoDescription: item.seoDescription || item.description                 || null,
    noindex:        item.noindex === true,
    ogImage:        item.ogImage        || item.heroImage    || item.image  || null,
    // Normalise www — CMS sometimes stores without www prefix
    canonicalUrl:   item.canonicalUrl ? normalizeCanonical(item.canonicalUrl) : null,
  }
}


// ─── API route map ────────────────────────────────────────────────────────────
// Strategy:
//   1. Fetch each list endpoint to discover slugs
//   2. Fetch EVERY individual item in parallel to get full SEO fields
//   3. Build route → SEO map from individual item responses
async function buildRouteMap() {
  const map = new Map()

  if (!API_URL) {
    console.warn('[seo] ⚠️  VITE_API_URL not set — dynamic-route SEO will show as no-data.')
    return map
  }

  // Step 1: lists (for slugs only)
  console.log('[seo] Fetching slug lists...')
  const [rawSvcs, rawScts, rawLocs, rawBlgs] = await Promise.all([
    safeFetch(`${API_URL}/api/services`),
    safeFetch(`${API_URL}/api/sectors`),
    safeFetch(`${API_URL}/api/locations`),
    safeFetch(`${API_URL}/api/blog`),
  ])

  const svcList = normalizeList(rawSvcs)
  const sctList = normalizeList(rawScts)
  const locList = normalizeList(rawLocs)
  const blgList = normalizeList(rawBlgs).filter(b => b.status === 'published' && b.slug)

  const svcSlugs = svcList.filter(i => i.slug).map(i => i.slug)
  const sctSlugs = sctList.filter(i => i.slug).map(i => i.slug)
  const locSlugs = locList.filter(i => i.slug).map(i => i.slug)
  const blgSlugs = blgList.map(i => i.slug)

  console.log(`[seo] Found: ${svcSlugs.length} services, ${sctSlugs.length} sectors, ${locSlugs.length} locations, ${blgSlugs.length} blog posts`)
  console.log('[seo] Fetching individual items for full SEO data...')

  // Step 2: individual items in parallel (full SEO fields only on these endpoints)
  const fetchItem = async (type, slug) => {
    const json = await safeFetch(`${API_URL}/api/${type}/${slug}`)
    if (!json) return null
    return json?.data ?? json
  }

  const [svcItems, sctItems, locItems, blgItems] = await Promise.all([
    Promise.all(svcSlugs.map(s => fetchItem('services', s))),
    Promise.all(sctSlugs.map(s => fetchItem('sectors', s))),
    Promise.all(locSlugs.map(s => fetchItem('locations', s))),
    Promise.all(blgSlugs.map(s => fetchItem('blog', s))),
  ])

  // Step 3: populate map from individual items
  svcItems.forEach((item, i) => {
    if (item) map.set(`/services/${svcSlugs[i]}`, toSeoEntry(item))
  })
  sctItems.forEach((item, i) => {
    if (item) map.set(`/sectors/${sctSlugs[i]}`, toSeoEntry(item))
  })
  locItems.forEach((item, i) => {
    if (item) map.set(`/locations/${locSlugs[i]}`, toSeoEntry(item))
  })
  blgItems.forEach((item, i) => {
    if (item) map.set(`/blog/${blgSlugs[i]}`, toSeoEntry(item))
  })

  // Step 4: location × service combos
  // Use already-fetched individual item data for better title quality
  for (const loc of locList.filter(i => i.slug)) {
    for (const svc of svcList.filter(i => i.slug)) {
      const key = `/locations/${loc.slug}/${svc.slug}`
      if (!map.has(key)) {
        const svcEntry = map.get(`/services/${svc.slug}`)
        const locEntry = map.get(`/locations/${loc.slug}`)
        // Extract just the primary name from seoTitle (strip " | Route46..." suffix)
        const svcName = svcEntry?.seoTitle?.split('|')[0]?.trim() || svc.name || svc.slug
        const locName = locEntry?.seoTitle?.split('|')[0]?.trim() || loc.name || loc.slug
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

  console.log(`[seo] Route map built: ${map.size} dynamic routes\n`)
  return map
}


// ─── Hydration data extraction (secondary fallback) ───────────────────────────
// vite-react-ssg now injects window.__staticRouterHydrationData (double underscores).
// (?:__)? handles both old and new forms.
function extractHydrationData(html) {
  let parsed = null

  const m1 = html.match(
    /window\.(?:__)?staticRouterHydrationData\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\)/s
  )
  if (m1) {
    try { parsed = JSON.parse(m1[1]) } catch (_) {}
  }

  if (!parsed) {
    const m2 = html.match(
      /window\.(?:__)?staticRouterHydrationData\s*=\s*JSON\.parse\("((?:[^"\\]|\\.)*)"\)/s
    )
    if (m2) {
      try { parsed = JSON.parse(m2[1].replace(/\\"/g, '"')) } catch (_) {}
    }
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


// ─── Extract existing <title> / <meta description> as final fallback ──────────
// Keeps static routes (/, /about, /contact …) fully synced even without API data.
function extractExistingMeta(html) {
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title  = titleM ? titleM[1].trim() : null

  const descM =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i)
  const desc = descM ? descM[1].trim() : null

  return { title, desc }
}


// ─── Extract hero image ───────────────────────────────────────────────────────
function extractHeroImage(html) {
  const m =
    html.match(
      /<img[^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["'][^>]*class=["'][^"']*(?:absolute|object-cover)[^"']*["']/i
    ) ||
    html.match(
      /<img[^>]+class=["'][^"']*(?:absolute|object-cover)[^"']*["'][^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["']/i
    )
  return m?.[1] ?? null
}

function esc(s) { return (s ?? '').replace(/"/g, '&quot;') }


// ─── Strip ALL existing SEO tags globally ────────────────────────────────────
function stripAllSeoTags(html) {
  return html
    .replace(
      /<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi,
      ''
    )
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


// ─── Build the SEO block string ───────────────────────────────────────────────
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


// ─── Inject SEO block right after <meta name="viewport"> ─────────────────────
// Puts SEO tags near the top of <head>, before CSS/JS — correct position for
// faster crawler discovery and clean source order.
function injectSeoBlock(html, block) {
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)
  if (viewportMatch) {
    const idx = html.indexOf(viewportMatch[0]) + viewportMatch[0].length
    return html.slice(0, idx) + '\n' + block + html.slice(idx)
  }
  return html.replace(/(<head[^>]*>)/i, `$1\n${block}`)
}


// ─── Fix stale hero image preload ─────────────────────────────────────────────
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

  if (SKIP_PREFIXES.some((p) => route.startsWith(p))) {
    console.log(`[seo] ⏭  skip       ${route}`)
    counts.skipped++
    return
  }

  let html     = readFileSync(filePath, 'utf-8')
  const before = html

  // Priority: API individual item → hydration JSON → existing HTML tags
  const apiData       = routeMap.get(route)
  const hydration     = extractHydrationData(html)
  const hydraPage     = hydration ? findPageSeoData(hydration) : null
  // Read BEFORE stripping so the fallback can still see the original tags
  const { title: htmlTitle, desc: htmlDesc } = extractExistingMeta(html)

  const seoTitle  = apiData?.seoTitle       || hydraPage?.seoTitle       || hydraPage?.heroTitle || htmlTitle || null
  const seoDesc   = apiData?.seoDescription || hydraPage?.seoDescription                         || htmlDesc  || null
  const canonical = apiData?.canonicalUrl   || hydraPage?.canonicalUrl
    || `${BASE_URL}${route === '/' ? '' : route}`
  const heroImg   = extractHeroImage(html)
  const ogImage   = apiData?.ogImage || hydraPage?.ogImage || heroImg || `${BASE_URL}/route46logo.png`
  const noindex   = apiData?.noindex === true || hydraPage?.noindex === true

  const sourceLabel = apiData ? 'api' : hydraPage ? 'hydration' : htmlTitle ? 'html-fallback' : 'none'

  if (!seoTitle) {
    console.log(`[seo] ⚠️  no-data   ${route}  (no SEO data found anywhere — skipping)`)
    counts.noData++
    return
  }

  // Step 1: Strip ALL existing SEO tags (prevents duplicates from any source)
  html = stripAllSeoTags(html)

  // Step 2: Build and inject clean SEO block after <meta viewport>
  const seoBlock = buildSeoBlock({ seoTitle, seoDesc, canonical, ogImage, noindex })
  html = injectSeoBlock(html, seoBlock)

  // Step 3: Fix stale hero preload link if needed
  html = fixHeroPreload(html, heroImg)

  // Write only if changed
  if (html !== before) {
    writeFileSync(filePath, html, 'utf-8')
    const hadCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(before)
    if (hadCanonical) {
      console.log(`[seo] ✏️  replaced   ${route}  [${sourceLabel}]\n          title: "${seoTitle.trim()}"`)
      counts.replaced++
    } else {
      console.log(`[seo] ✅ injected   ${route}  [${sourceLabel}]\n          title: "${seoTitle.trim()}"`)
      counts.injected++
    }
  } else {
    console.log(`[seo] ✓  no-change  ${route}`)
  }
}


// ─── Run ──────────────────────────────────────────────────────────────────────
console.log(`[seo] Scanning: ${DIST}\n`)

buildRouteMap().then((routeMap) => {
  walk(DIST).forEach((f) => processFile(f, routeMap))

  console.log(
    `\n[seo] Done ─── injected:${counts.injected}  replaced:${counts.replaced}  no-data:${counts.noData}  skipped:${counts.skipped}  total:${counts.total}`
  )

  if (counts.noData > 0) {
    console.log(`\n[seo] TIP: ${counts.noData} route(s) had no SEO data anywhere.`)
    console.log(`      • Static routes (/, /about, /contact …) fall back to the existing <title>/<meta description> in the HTML.`)
    console.log(`      • If a static route shows no-data, ensure its HTML has a <title> tag.`)
    console.log(`      • VITE_API_URL is currently: ${API_URL || '(not set)'}`)
  }
})