// // scripts/inject-seo.mjs
// // Post-build SSG SEO injector
// // Fixes: title, description, canonical, og:*, twitter:*, preload — for every page in dist/
// // Run: node scripts/inject-seo.mjs   (called automatically from "build" script in package.json)

// import { readFileSync, writeFileSync, readdirSync } from 'fs'
// import { join, relative } from 'path'
// import { fileURLToPath } from 'url'

// const __dirname  = fileURLToPath(new URL('.', import.meta.url))
// const DIST       = join(__dirname, '../dist')
// const BASE_URL   = 'https://www.route46couriers.co.uk'

// // Routes to skip entirely (no canonical, no SEO injection)
// const SKIP_PREFIXES = ['/admin', '/send-parcel', '/pay']

// const counts = { injected: 0, replaced: 0, skipped: 0, total: 0 }

// // ─── File helpers ────────────────────────────────────────────────────────────

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

// // ─── Data extraction from hydration JSON ─────────────────────────────────────
// //
// // vite-react-ssg writes window.staticRouterHydrationData = JSON.parse('...')
// // at the bottom of every SSG page. We pull seoTitle, seoDescription,
// // canonicalUrl, ogImage, noindex from that serialised JSON.

// function extractField(html, field) {
//   const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
//   const m  = html.match(re)
//   if (!m) return null
//   try   { return JSON.parse(`"${m[1]}"`) }
//   catch { return m[1].replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"') }
// }

// function extractBoolField(html, field) {
//   const re = new RegExp(`"${field}"\\s*:\\s*(true|false)`)
//   const m  = html.match(re)
//   return m ? m[1] === 'true' : false
// }

// // Grab the first hero image (large, S3 or absolute URL) from the rendered body
// function extractHeroImage(html) {
//   // Match src on the hero <img> that also carries object-cover / absolute classes
//   const m = html.match(
//     /<img[^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["'][^>]*class=["'][^"']*(?:absolute|object-cover)[^"']*["']/i
//   ) || html.match(
//     /<img[^>]+class=["'][^"']*(?:absolute|object-cover)[^"']*["'][^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["']/i
//   )
//   return m?.[1] ?? null
// }

// // ─── Strip Helmet-commented blocks ───────────────────────────────────────────
// //
// // vite-react-ssg + react-helmet-async sometimes outputs SEO tags wrapped in
// // HTML comments instead of live tags, e.g.:
// //   <!-- <title>...</title>
// //        <meta name="description" content="...">
// //        <meta name="author" content="..."> -->
// // This function removes those dead comment blocks from <head>.

// function stripCommentedSeoBlocks(html) {
//   // Any HTML comment block that contains <title> or an SEO <meta> tag
//   return html.replace(
//     /<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi,
//     ''
//   )
// }

// // ─── Tag upsert helper ────────────────────────────────────────────────────────

// function upsert(html, pattern, tag) {
//   return pattern.test(html)
//     ? html.replace(pattern, tag)
//     : html.replace('</head>', `  ${tag}\n</head>`)
// }

// function esc(s) { return s?.replace(/"/g, '&quot;') ?? '' }

// // ─── Core processor ──────────────────────────────────────────────────────────

// function processFile(filePath) {
//   const route = routeFrom(filePath)

//   if (SKIP_PREFIXES.some(p => route.startsWith(p))) {
//     console.log(`[seo] ⏭  skip       ${route}`)
//     counts.skipped++
//     return
//   }

//   let html     = readFileSync(filePath, 'utf-8')
//   const before = html

//   // ── Extract SEO data from hydration JSON ──────────────────────────────
//   const seoTitle    = extractField(html, 'seoTitle')       || extractField(html, 'heroTitle')
//   const seoDesc     = extractField(html, 'seoDescription')
//   const canonicalRaw= extractField(html, 'canonicalUrl')
//   const ogImageRaw  = extractField(html, 'ogImage')
//   const noindex     = extractBoolField(html, 'noindex')

//   const canonical   = canonicalRaw || `${BASE_URL}${route === '/' ? '' : route}`
//   const heroImg     = extractHeroImage(html)
//   const ogImage     = ogImageRaw || heroImg || `${BASE_URL}/route46logo.png`

//   // ── Step 1: Remove Helmet-commented SEO blocks ────────────────────────
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

//   // ── Step 8: Fix <link rel="preload"> to match actual hero image ───────
//   // index.html ships with route462.jpeg as a placeholder preload.
//   // For SSG pages the real hero is a .webp from S3 — fix it.
//   if (heroImg) {
//     html = html.replace(
//       /<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]*>/i,
//       `<link rel="preload" as="image" href="${heroImg}" fetchpriority="high">`
//     )
//   }

//   // ── Write back if changed ─────────────────────────────────────────────
//   if (html !== before) {
//     writeFileSync(filePath, html, 'utf-8')

//     const hadCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(before)
//     if (hadCanonical) {
//       console.log(`[seo] ✏️  replaced   ${route}${seoTitle ? `  →  "${seoTitle.slice(0, 55)}"` : ''}`)
//       counts.replaced++
//     } else {
//       console.log(`[seo] ✅ injected   ${route}${seoTitle ? `  →  "${seoTitle.slice(0, 55)}"` : ''}`)
//       counts.injected++
//     }
//   } else {
//     console.log(`[seo] ✓  no-change  ${route}`)
//   }

//   counts.total++
// }

// // ─── Run ─────────────────────────────────────────────────────────────────────

// const files     = walk(DIST)
// counts.total    = files.length
// files.forEach(processFile)

// console.log(
//   `\n[seo] Done ─── injected: ${counts.injected}  replaced: ${counts.replaced}  skipped: ${counts.skipped}  total: ${counts.total}`
// )

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST      = join(__dirname, '../dist')
const BASE_URL  = 'https://www.route46couriers.co.uk'

const SKIP_PREFIXES = ['/admin', '/send-parcel', '/pay']
const counts = { injected: 0, replaced: 0, skipped: 0, noData: 0, total: 0 }

// ─── File walk ───────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    e.isDirectory() ? walk(p, out) : e.name.endsWith('.html') && out.push(p)
  }
  return out
}

function routeFrom(file) {
  const rel = relative(DIST, file).replace(/\\/g, '/')
  const r   = '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
  return r === '' ? '/' : r
}

// ─── Hydration data extraction ───────────────────────────────────────────────
//
// vite-react-ssg injects at bottom of page:
//   window.staticRouterHydrationData = JSON.parse('...')   ← single-quoted (most common)
//   window.staticRouterHydrationData = JSON.parse("...")   ← double-quoted (escaped inner JSON)
//
// We try BOTH patterns to handle either format robustly.

function extractHydrationData(html) {
  let parsed = null

  // Pattern 1: single-quoted  → JSON.parse('{"key":"val"}')
  const m1 = html.match(
    /window\.staticRouterHydrationData\s*=\s*JSON\.parse\('((?:[^'\\]|\\.)*)'\)/s
  )
  if (m1) {
    try { parsed = JSON.parse(m1[1]) } catch (_) {}
  }

  // Pattern 2: double-quoted  → JSON.parse("{\"key\":\"val\"}")
  // Inner double quotes are escaped as \" in the raw HTML
  if (!parsed) {
    const m2 = html.match(
      /window\.staticRouterHydrationData\s*=\s*JSON\.parse\("((?:[^"\\]|\\.)*)"\)/s
    )
    if (m2) {
      // Unescape inner \" → " so we get valid JSON
      try { parsed = JSON.parse(m2[1].replace(/\\"/g, '"')) } catch (_) {}
    }
  }

  return parsed
}

// Recursively find the first object that looks like a page's SEO data
function findPageSeoData(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || depth > 8) return null
  // A page-data object always has seoTitle (or heroTitle) + seoDescription together
  if ((obj.seoTitle || obj.heroTitle) && obj.seoDescription) return obj
  for (const v of Object.values(obj)) {
    const r = findPageSeoData(v, depth + 1)
    if (r) return r
  }
  return null
}

// Grab the first absolute-URL hero image rendered in the body
function extractHeroImage(html) {
  const m = html.match(
    /<img[^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["'][^>]*class=["'][^"']*(?:absolute|object-cover)[^"']*["']/i
  ) || html.match(
    /<img[^>]+class=["'][^"']*(?:absolute|object-cover)[^"']*["'][^>]+src=["'](https:\/\/[^"']+\.(?:webp|jpg|jpeg|png))["']/i
  )
  return m?.[1] ?? null
}

// ─── Strip Helmet comment-wrapped SEO blocks ──────────────────────────────────
// react-helmet-async + vite-react-ssg sometimes wraps injections in HTML comments:
//   <!-- <title>…</title> <meta name="description" …> <meta name="author" …> -->
function stripCommentedSeoBlocks(html) {
  return html.replace(
    /<!--(?:(?!-->)[\s\S])*?<(?:title|meta[^>]*(?:name|property)\s*=\s*["'](?:description|author|og:|twitter:))[^]*?-->/gi,
    ''
  )
}

// ─── Tag upsert ───────────────────────────────────────────────────────────────
function upsert(html, pattern, tag) {
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', `  ${tag}\n</head>`)
}

function esc(s) { return (s ?? '').replace(/"/g, '&quot;') }

// ─── Core processor ───────────────────────────────────────────────────────────
function processFile(filePath) {
  const route = routeFrom(filePath)
  counts.total++

  if (SKIP_PREFIXES.some(p => route.startsWith(p))) {
    console.log(`[seo] ⏭  skip       ${route}`)
    counts.skipped++
    return
  }

  let html     = readFileSync(filePath, 'utf-8')
  const before = html

  // ── Extract page data from hydration JSON ─────────────────────────────
  const hydration = extractHydrationData(html)
  const pageData  = hydration ? findPageSeoData(hydration) : null

  if (!pageData) {
    console.log(`[seo] ⚠️  no-data   ${route}  (no hydration seoTitle found — title left as-is)`)
    counts.noData++
    // Still fix canonical and og:url from route path even if no page data
  }

  const seoTitle  = pageData?.seoTitle    || pageData?.heroTitle
  const seoDesc   = pageData?.seoDescription
  const canonical = pageData?.canonicalUrl || `${BASE_URL}${route === '/' ? '' : route}`
  const heroImg   = extractHeroImage(html)
  const ogImage   = pageData?.ogImage      || heroImg || `${BASE_URL}/route46logo.png`
  const noindex   = pageData?.noindex === true

  // ── Step 1: Strip commented-out Helmet SEO blocks ─────────────────────
  html = stripCommentedSeoBlocks(html)

  // ── Step 2: Title ─────────────────────────────────────────────────────
  if (seoTitle) {
    html = upsert(html, /<title>[^<]*<\/title>/i, `<title>${esc(seoTitle)}</title>`)
  }

  // ── Step 3: Meta description ──────────────────────────────────────────
  if (seoDesc) {
    html = upsert(html,
      /<meta[^>]+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(seoDesc)}">`
    )
  }

  // ── Step 4: Robots ────────────────────────────────────────────────────
  html = upsert(html,
    /<meta[^>]+name=["']robots["'][^>]*>/i,
    noindex
      ? `<meta name="robots" content="noindex,nofollow">`
      : `<meta name="robots" content="index, follow">`
  )

  // ── Step 5: Canonical ─────────────────────────────────────────────────
  html = upsert(html,
    /<link[^>]+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonical}">`
  )

  // ── Step 6: Open Graph ────────────────────────────────────────────────
  if (seoTitle) {
    html = upsert(html,
      /<meta[^>]+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${esc(seoTitle)}">`
    )
  }
  if (seoDesc) {
    html = upsert(html,
      /<meta[^>]+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${esc(seoDesc)}">`
    )
  }
  html = upsert(html,
    /<meta[^>]+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${canonical}">`
  )
  html = upsert(html,
    /<meta[^>]+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${ogImage}">`
  )

  // ── Step 7: Twitter Card ──────────────────────────────────────────────
  if (seoTitle) {
    html = upsert(html,
      /<meta[^>]+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${esc(seoTitle)}">`
    )
  }
  if (seoDesc) {
    html = upsert(html,
      /<meta[^>]+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${esc(seoDesc)}">`
    )
  }
  html = upsert(html,
    /<meta[^>]+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${ogImage}">`
  )

  // ── Step 8: Fix stale preload → real hero image ───────────────────────
  if (heroImg) {
    html = html.replace(
      /<link[^>]+rel=["']preload["'][^>]+as=["']image["'][^>]*>/i,
      `<link rel="preload" as="image" href="${heroImg}" fetchpriority="high">`
    )
  }

  // ── Write ─────────────────────────────────────────────────────────────
  if (html !== before) {
    writeFileSync(filePath, html, 'utf-8')
    const hadCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(before)
    if (hadCanonical) {
      console.log(`[seo] ✏️  replaced   ${route}${seoTitle ? `\n          title: "${seoTitle.trim()}"` : ''}`)
      counts.replaced++
    } else {
      console.log(`[seo] ✅ injected   ${route}${seoTitle ? `\n          title: "${seoTitle.trim()}"` : ''}`)
      counts.injected++
    }
  } else {
    console.log(`[seo] ✓  no-change  ${route}`)
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────
console.log(`[seo] Scanning: ${DIST}\n`)
walk(DIST).forEach(processFile)
console.log(
  `\n[seo] Done ─── injected:${counts.injected}  replaced:${counts.replaced}  no-data:${counts.noData}  skipped:${counts.skipped}  total:${counts.total}`
)
console.log(
  `\n[seo] TIP: If you see "no-data" for CMS pages, the JSON.parse format changed.\n` +
  `      Add a console.log(html.slice(html.indexOf('staticRouterHydration'), html.indexOf('</script>', html.indexOf('staticRouterHydration')))) in processFile to inspect the raw script block.`
)