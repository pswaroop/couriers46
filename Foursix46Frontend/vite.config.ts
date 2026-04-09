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
    includedRoutes(paths: string[]) {
      // vite-react-ssg may emit paths with OR without leading slash
      // e.g. "admin/login" or "/admin/login" — filter both
      return paths.filter(
        (p) => p !== "admin/login"
              && p !== "/admin/login"
              && p !== "admin/dashboard"
              && p !== "/admin/dashboard"
              && p !== "send-parcel"   
              && p !== "/send-parcel",
      );
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