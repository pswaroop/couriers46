import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteTsconfigPaths from "vite-tsconfig-paths";

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

  // ── ssgOptions is the CORRECT place for includedRoutes ───────────────────
  ssgOptions: {
  async includedRoutes(paths: string[]) {
    // ── Step 1: filter out private/admin routes ──────────────────
    const filtered = paths.filter(
      (p) =>
        p !== "admin/login" &&
        p !== "/admin/login" &&
        p !== "admin/dashboard" &&
        p !== "/admin/dashboard" &&
        p !== "send-parcel" &&
        p !== "/send-parcel",
    );

    // ── Step 2: fetch dynamic paths from API ─────────────────────
    const apiUrl = process.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn("[SSG] VITE_API_URL is not set — skipping dynamic routes");
      return filtered;
    }

    try {
      const [services, sectors, locations, blogs]: [any, any, any, any] = await Promise.all([
        fetch(`${apiUrl}/api/services`).then((r) => r.json()),
        fetch(`${apiUrl}/api/sectors`).then((r) => r.json()),
        fetch(`${apiUrl}/api/locations`).then((r) => r.json()),
        fetch(`${apiUrl}/api/blogs`).then((r) => r.json()),
      ]);

      const svcs: { slug: string }[] = services?.data  || services  || [];
      const scts: { slug: string }[] = sectors?.data   || sectors   || [];
      const locs: { slug: string }[] = locations?.data || locations || [];
      const blgs: { slug: string }[] = blogs?.data     || blogs     || [];

      const servicePaths         = svcs.map((s) => `/services/${s.slug}`);
      const sectorPaths          = scts.map((s) => `/sectors/${s.slug}`);
      const locationPaths        = locs.map((l) => `/locations/${l.slug}`);
      const blogPaths            = blgs.map((b) => `/blog/${b.slug}`);
      const locationServicePaths = locs.flatMap((l) =>
        svcs.map((s) => `/locations/${l.slug}/${s.slug}`),
      );

      console.log(
        `[SSG] Dynamic routes → services:${svcs.length}  sectors:${scts.length}  locations:${locs.length}  blogs:${blgs.length}  loc×svc:${locationServicePaths.length}`,
      );

      return [
        ...filtered,
        ...servicePaths,
        ...sectorPaths,
        ...locationPaths,
        ...blogPaths,
        ...locationServicePaths,
      ];
    } catch (e) {
      console.error("[SSG] includedRoutes fetch failed:", e);
      return filtered; // graceful fallback — static pages still render
    }
  },
},

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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