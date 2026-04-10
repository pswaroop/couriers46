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
// FIX: bare 'index.html' at dist root produced '/index' with the old regex.
function routeFrom(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  const r = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '' ? '/' : r
}


// ─── API route map ────────────────────────────────────────────────────────────
// Primary SEO data source — fetches the same API endpoints used by vite.config.ts.
// This is reliable even when hydration loaderData is null (all-null is normal for
// static routes; dynamic CMS routes also have null loaderData in SSG output).
async function buildRouteMap() {
  const map = new Map()

  if (!API_URL) {
    console.warn('[seo] ⚠️  VITE_API_URL not set — dynamic-route SEO will show as no-data.')
    return map
  }

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) { console.warn(`[seo] API ${url} → HTTP ${res.status}`); return [] }
      const json = await res.json()
      return json?.data ?? json ?? []
    } catch (e) {
      console.warn(`[seo] fetch failed: ${url} —`, e.message)
      return []
    }
  }

  const [rawSvcs, rawScts, rawLocs, rawBlgs] = await Promise.all([
    safeFetch(`${API_URL}/api/services`),
    safeFetch(`${API_URL}/api/sectors`),
    safeFetch(`${API_URL}/api/locations`),
    safeFetch(`${API_URL}/api/blog`),
  ])

  const normalize = (r) =>
    Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : []

  const svcs = normalize(rawSvcs)
  const scts = normalize(rawScts)
  const locs = normalize(rawLocs)
  const blgs = normalize(rawBlgs).filter((b) => b.status === 'published' && b.slug)

  const addItems = (items, prefix) => {
    for (const item of items) {
      if (!item.slug) continue
      map.set(`${prefix}/${item.slug}`, {
        seoTitle:       item.seoTitle       || item.heroTitle    || item.title       || null,
        seoDescription: item.seoDescription || item.description                      || null,
        noindex:        item.noindex === true,
        ogImage:        item.ogImage        || item.image                             || null,
        canonicalUrl:   item.canonicalUrl                                             || null,
      })
    }
  }

  addItems(svcs, '/services')
  addItems(scts, '/sectors')
  addItems(locs, '/locations')
  addItems(blgs, '/blog')

  // location × service combos — synthesise title when no dedicated data exists
  for (const loc of locs) {
    for (const svc of svcs) {
      const key = `/locations/${loc.slug}/${svc.slug}`
      if (!map.has(key)) {
        map.set(key, {
          seoTitle:       `${svc.title || svc.slug} in ${loc.title || loc.slug} | Route46 Couriers`,
          seoDescription: null,
          noindex:        false,
          ogImage:        null,
          canonicalUrl:   null,
        })
      }
    }
  }

  console.log(`[seo] API route map built: ${map.size} dynamic routes\n`)
  return map
}


// ─── Hydration data extraction (secondary fallback) ───────────────────────────
// FIX: vite-react-ssg now injects window.__staticRouterHydrationData (double
// underscores). (?:__)? makes the prefix optional so both old and new forms match.
function extractHydrationData(html) {
  let parsed = null

  // Pattern 1: single-quoted → JSON.parse('...')
  const m1 = html.match(
    /window\.(?:__)?staticRouterHydrationData\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\)/s
  )
  if (m1) {
    try { parsed = JSON.parse(m1[1]) } catch (_) {}
  }

  // Pattern 2: double-quoted → JSON.parse("...") — current vite-react-ssg format
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
// Ensures static routes (/, /about, /contact …) always get their OG/Twitter
// tags synced from the real <title> and <meta name="description"> in the HTML.
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
// FIX: removes every occurrence of each tag anywhere in the document, including
// Helmet comment-wrapped blocks, template fallback blocks, and duplicate tags.
// A single clean block is then inserted in the correct position.
function stripAllSeoTags(html) {
  return html
    // Helmet comment-wrapped blocks
    .replace(
      /<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi,
      ''
    )
    // Individual tags — all occurrences
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
    // Clean up blank lines left behind (collapse 3+ newlines → 2)
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
// FIX: previous versions appended tags just before </head> — after CSS & JS.
// Inserting after viewport puts all SEO tags near the top of <head>, which is
// the correct position (title/canonical before stylesheets for faster discovery).
function injectSeoBlock(html, block) {
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i)
  if (viewportMatch) {
    const idx = html.indexOf(viewportMatch[0]) + viewportMatch[0].length
    return html.slice(0, idx) + '\n' + block + html.slice(idx)
  }
  // Fallback: insert just inside <head> opening
  return html.replace(/(<head[^>]*>)/i, `$1\n${block}`)
}


// ─── Fix stale hero preload ───────────────────────────────────────────────────
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

  // ── Resolve SEO data: API → hydration → existing HTML ─────────────────
  const apiData       = routeMap.get(route)
  const hydration     = extractHydrationData(html)
  const hydraPage     = hydration ? findPageSeoData(hydration) : null
  // extractExistingMeta reads BEFORE stripping, so the original tags are still present
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
    console.log(`[seo] ⚠️  no-data   ${route}  (no seoTitle anywhere — skipping SEO injection)`)
    counts.noData++
    return
  }

  // ── Step 1: Strip ALL existing SEO tags ───────────────────────────────
  html = stripAllSeoTags(html)

  // ── Step 2: Build and inject the clean SEO block after <meta viewport> ─
  const seoBlock = buildSeoBlock({ seoTitle, seoDesc, canonical, ogImage, noindex })
  html = injectSeoBlock(html, seoBlock)

  // ── Step 3: Fix stale hero image preload ──────────────────────────────
  html = fixHeroPreload(html, heroImg)

  // ── Write ─────────────────────────────────────────────────────────────
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
    console.log(`\n[seo] TIP: ${counts.noData} route(s) had no SEO data at all (not even a <title> in HTML).`)
    console.log(`      • Check that index.html has a default <title> tag for static routes.`)
    console.log(`      • For CMS routes, ensure the API returns seoTitle + seoDescription.`)
    console.log(`      • VITE_API_URL is currently: ${API_URL || '(not set)'}`)
  }
})