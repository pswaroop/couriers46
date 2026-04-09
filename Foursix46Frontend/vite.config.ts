// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";
// import viteTsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     viteTsconfigPaths(),
//     mode === "development" && componentTagger(),
//   ].filter(Boolean),

//   // ── ssgOptions is the CORRECT place for includedRoutes ───────────────────
//   ssgOptions: {
//   includedRoutes(paths: string[]): Promise<string[]> {
//     const filtered = paths.filter(
//       (p) =>
//         p !== "admin/login" &&
//         p !== "/admin/login" &&
//         p !== "admin/dashboard" &&
//         p !== "/admin/dashboard" &&
//         p !== "send-parcel" &&
//         p !== "/send-parcel",
//     );

//     const apiUrl = process.env.VITE_API_URL;
//     if (!apiUrl) {
//       console.warn("[SSG] VITE_API_URL is not set — skipping dynamic routes");
//       return Promise.resolve(filtered);
//     }

//     // Safe fetch — never throws, returns null on non-JSON or error responses
//     const safeFetch = async (url: string) => {
//       try {
//         const res = await fetch(url);
//         const text = await res.text();
//         const data = JSON.parse(text);
//         console.log(`[SSG] ✅ ${url} → ${(data?.data || data)?.length ?? 0} items`);
//         return data;
//       } catch (e) {
//         console.error(`[SSG] ❌ Failed to fetch ${url}:`, e);
//         return null;
//       }
//     };

//     return Promise.all([
//       safeFetch(`${apiUrl}/api/services`),
//       safeFetch(`${apiUrl}/api/sectors`),
//       safeFetch(`${apiUrl}/api/locations`),
//       safeFetch(`${apiUrl}/api/blogs`),
//     ]).then(([services, sectors, locations, blogs]) => {
//       const svcs = services?.data  || services  || [];
//       const scts = sectors?.data   || sectors   || [];
//       const locs = locations?.data || locations || [];
//       const blgs = blogs?.data     || blogs     || [];

//       console.log(
//         `[SSG] Dynamic routes → services:${svcs.length}  sectors:${scts.length}  locations:${locs.length}  blogs:${blgs.length}  loc×svc:${locs.length * svcs.length}`,
//       );

//       return [
//         ...filtered,
//         ...svcs.map((s: any) => `/services/${s.slug}`),
//         ...scts.map((s: any) => `/sectors/${s.slug}`),
//         ...locs.map((l: any) => `/locations/${l.slug}`),
//         ...blgs.map((b: any) => `/blog/${b.slug}`),
//         ...locs.flatMap((l: any) =>
//           svcs.map((s: any) => `/locations/${l.slug}/${s.slug}`)
//         ),
//       ];
//     });
//   },
// },

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     minify: "esbuild",
//     chunkSizeWarningLimit: 1000,
//     cssCodeSplit: true,
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (
//             id.includes("node_modules/react") ||
//             id.includes("node_modules/react-dom") ||
//             id.includes("node_modules/react-router")
//           )
//             return "react-vendor";
//           if (id.includes("node_modules/@radix-ui")) return "ui-vendor";
//           if (
//             id.includes("node_modules/react-hook-form") ||
//             id.includes("node_modules/zod") ||
//             id.includes("node_modules/@hookform")
//           )
//             return "form-vendor";
//           if (id.includes("node_modules/framer-motion")) return "animation-vendor";
//           if (id.includes("node_modules/lucide-react")) return "icons-vendor";
//           if (id.includes("node_modules/firebase")) return "firebase-vendor";
//           if (id.includes("node_modules/@stripe")) return "stripe-vendor";
//           if (id.includes("node_modules/recharts")) return "charts-vendor";
//         },
//         assetFileNames: (assetInfo) => {
//           if (!assetInfo.name) return "assets/[name]-[hash][extname]";
//           if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name))
//             return "assets/images/[name]-[hash][extname]";
//           if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name))
//             return "assets/fonts/[name]-[hash][extname]";
//           return "assets/[name]-[hash][extname]";
//         },
//         chunkFileNames: "assets/js/[name]-[hash].js",
//         entryFileNames: "assets/js/[name]-[hash].js",
//       },
//     },
//     sourcemap: false,
//     reportCompressedSize: true,
//   },
//   optimizeDeps: {
//     include: ["react", "react-dom", "react-router-dom", "lucide-react", "framer-motion"],
//   },
// }));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteTsconfigPaths from "vite-tsconfig-paths";

const BASE_URL = "https://www.route46couriers.co.uk";

// Routes that should never be statically generated
const EXCLUDED_ROUTES = new Set([
  "admin/login",
  "/admin/login",
  "admin/dashboard",
  "/admin/dashboard",
  "send-parcel",
  "/send-parcel",
]);

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    viteTsconfigPaths(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  // ── SSG Options ─────────────────────────────────────────────────────────────
  ssgOptions: {

    // ── Dynamic route discovery ─────────────────────────────────────────────
    includedRoutes(paths: string[]): Promise<string[]> {
      const filtered = paths.filter((p) => !EXCLUDED_ROUTES.has(p));

      const apiUrl = process.env.VITE_API_URL;
      if (!apiUrl) {
        console.warn("[SSG] VITE_API_URL is not set — skipping dynamic routes");
        return Promise.resolve(filtered);
      }

      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const data = JSON.parse(text);
          console.log(
            `[SSG] ✅ ${url} → ${(data?.data || data)?.length ?? 0} items`,
          );
          return data;
        } catch (e) {
          console.error(`[SSG] ❌ Failed to fetch ${url}:`, e);
          return null;
        }
      };

      return Promise.all([
        safeFetch(`${apiUrl}/api/services`),
        safeFetch(`${apiUrl}/api/sectors`),
        safeFetch(`${apiUrl}/api/locations`),
        safeFetch(`${apiUrl}/api/blogs`),
      ]).then(([services, sectors, locations, blogs]) => {
        const svcs = services?.data  || services  || [];
        const scts = sectors?.data   || sectors   || [];
        const locs = locations?.data || locations || [];
        const blgs = blogs?.data     || blogs     || [];

        console.log(
          `[SSG] Dynamic routes → services:${svcs.length}  sectors:${scts.length}  locations:${locs.length}  blogs:${blgs.length}  loc×svc:${locs.length * svcs.length}`,
        );

        return [
          ...filtered,
          ...svcs.map((s: any) => `/services/${s.slug}`),
          ...scts.map((s: any) => `/sectors/${s.slug}`),
          ...locs.map((l: any) => `/locations/${l.slug}`),
          ...blgs.map((b: any) => `/blog/${b.slug}`),
          ...locs.flatMap((l: any) =>
            svcs.map((s: any) => `/locations/${l.slug}/${s.slug}`),
          ),
        ];
      });
    },

    // ── Canonical injection ─────────────────────────────────────────────────
    // react-helmet-async does not extract <link> tags into SSG HTML by default.
    // This hook runs after each page is rendered and guarantees every static
    // page has a correct <link rel="canonical"> in its <head>.
    //
    // Priority: page-level Helmet canonical (set in each page component) wins
    // over this fallback because it's injected BEFORE </head>. If Helmet ever
    // starts injecting link tags, this safely deduplicates by checking first.
    // onPageRendered(route: string, html: string): string {
    //   // Skip admin and non-public routes
    //   if (EXCLUDED_ROUTES.has(route) || route.startsWith("/admin")) {
    //     return html;
    //   }

    //   // Normalise: remove trailing slash (except root "/")
    //   const cleanRoute =
    //     route.endsWith("/") && route !== "/" ? route.slice(0, -1) : route;

    //   const canonical = `${BASE_URL}${cleanRoute}`;

    //   // If canonical already exists (injected by Helmet), replace it to ensure
    //   // correct www + trailing-slash normalisation.
    //   if (
    //     html.includes('rel="canonical"') ||
    //     html.includes("rel='canonical'")
    //   ) {
    //     return html.replace(
    //       /<link\s[^>]*rel=["']canonical["'][^>]*\/?>/i,
    //       `<link rel="canonical" href="${canonical}" />`,
    //     );
    //   }

    //   // Not present — inject just before </head>
    //   return html.replace(
    //     "</head>",
    //     `  <link rel="canonical" href="${canonical}" />\n</head>`,
    //   );
    // },
  },

  // ── Path aliases ────────────────────────────────────────────────────────────
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ── Build ───────────────────────────────────────────────────────────────────
  build: {
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          )
            return "react-vendor";
          if (id.includes("node_modules/@radix-ui")) return "ui-vendor";
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/zod") ||
            id.includes("node_modules/@hookform")
          )
            return "form-vendor";
          if (id.includes("node_modules/framer-motion")) return "animation-vendor";
          if (id.includes("node_modules/lucide-react")) return "icons-vendor";
          if (id.includes("node_modules/firebase")) return "firebase-vendor";
          if (id.includes("node_modules/@stripe")) return "stripe-vendor";
          if (id.includes("node_modules/recharts")) return "charts-vendor";
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return "assets/[name]-[hash][extname]";
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name))
            return "assets/images/[name]-[hash][extname]";
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name))
            return "assets/fonts/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    sourcemap: false,
    reportCompressedSize: true,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "lucide-react", "framer-motion"],
  },
}));