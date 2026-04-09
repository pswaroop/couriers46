// scripts/inject-canonical.mjs
// Runs AFTER vite-ssg build. Scans dist/ and injects <link rel="canonical">
// into every HTML file based on the file's path relative to dist root.
// This approach is 100% independent of react-helmet-async / vite-react-ssg internals.

import { readFileSync, writeFileSync } from "fs";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL  = "https://www.route46couriers.co.uk";
const DIST_DIR  = join(__dirname, "../dist");

// Routes that must NOT have a canonical injected
const SKIP_PREFIXES = ["/admin", "/send-parcel"];

// ─── Recursively collect all .html files ──────────────────────────────────────
function collectHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectHtmlFiles(full, files);
    } else if (entry.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

// ─── Derive canonical URL from file path ─────────────────────────────────────
// dist/index.html              → /
// dist/services/index.html     → /services
// dist/services/same-day/index.html → /services/same-day
function fileToRoute(filePath) {
  let route = "/" + relative(DIST_DIR, filePath).replace(/\\/g, "/");
  if (route.endsWith("/index.html")) route = route.slice(0, -"/index.html".length) || "/";
  else if (route.endsWith(".html"))  route = route.slice(0, -".html".length);
  // Remove trailing slash (except root)
  if (route !== "/" && route.endsWith("/")) route = route.slice(0, -1);
  return route;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const htmlFiles = collectHtmlFiles(DIST_DIR);
let injected = 0, replaced = 0, skipped = 0;

for (const file of htmlFiles) {
  const route = fileToRoute(file);

  // Skip admin/protected routes
  if (SKIP_PREFIXES.some((p) => route.startsWith(p))) {
    skipped++;
    continue;
  }

  const canonical = `${BASE_URL}${route}`;
  let html = readFileSync(file, "utf-8");

  if (/<link\s[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    // Replace existing canonical (e.g. wrong URL from Helmet or prior run)
    html = html.replace(
      /<link\s[^>]*rel=["']canonical["'][^>]*\/?>/i,
      `<link rel="canonical" href="${canonical}" />`
    );
    writeFileSync(file, html, "utf-8");
    replaced++;
    console.log(`[canonical] ✏️  replaced  ${route}`);
  } else {
    // Inject just before </head>
    html = html.replace(
      "</head>",
      `  <link rel="canonical" href="${canonical}" />\n</head>`
    );
    writeFileSync(file, html, "utf-8");
    injected++;
    console.log(`[canonical] ✅ injected  ${route}`);
  }
}

console.log(
  `\n[canonical] Done — injected:${injected}  replaced:${replaced}  skipped:${skipped}  total:${htmlFiles.length}`
);