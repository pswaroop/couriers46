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
//     mode === "development" && componentTagger()
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     // Enable minification with esbuild (faster and more stable than terser)
//     minify: 'esbuild',
//     // Optimize chunk size
//     chunkSizeWarningLimit: 1000,
//     // Enable CSS code splitting
//     cssCodeSplit: true,
//     // Rollup options for better code splitting
//     rollupOptions: {
//       output: {
//         // Manual chunk splitting for better caching
//         manualChunks(id) {
//           // React core libraries
//           if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
//             return 'react-vendor';
//           }
//           // Radix UI components
//           if (id.includes('node_modules/@radix-ui')) {
//             return 'ui-vendor';
//           }
//           // Form libraries
//           if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod') || id.includes('node_modules/@hookform')) {
//             return 'form-vendor';
//           }
//           // Animation
//           if (id.includes('node_modules/framer-motion')) {
//             return 'animation-vendor';
//           }
//           // Icons
//           if (id.includes('node_modules/lucide-react')) {
//             return 'icons-vendor';
//           }
//           // Firebase
//           if (id.includes('node_modules/firebase')) {
//             return 'firebase-vendor';
//           }
//           // Stripe
//           if (id.includes('node_modules/@stripe')) {
//             return 'stripe-vendor';
//           }
//           // Charts
//           if (id.includes('node_modules/recharts')) {
//             return 'charts-vendor';
//           }
//         },
//         // Optimize asset file names
//         assetFileNames: (assetInfo) => {
//           if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
//           const info = assetInfo.name.split('.');
//           const ext = info[info.length - 1];
//           if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
//             return `assets/images/[name]-[hash][extname]`;
//           } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
//             return `assets/fonts/[name]-[hash][extname]`;
//           }
//           return `assets/[name]-[hash][extname]`;
//         },
//         chunkFileNames: 'assets/js/[name]-[hash].js',
//         entryFileNames: 'assets/js/[name]-[hash].js',
//       },
//     },
//     // Source maps for production debugging (optional, can disable for smaller builds)
//     sourcemap: false,
//     // Report compressed size
//     reportCompressedSize: true,
//   },
//   // Optimize dependencies
//   optimizeDeps: {
//     include: [
//       'react',
//       'react-dom',
//       'react-router-dom',
//       'lucide-react',
//       'framer-motion',
//     ],
//   },
// }));
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from 'lovable-tagger'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const API_URL = process.env.VITE_API_URL || 'https://your-firebase-functions-url.com'

export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },

  plugins: [
    react(),
    viteTsconfigPaths(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ── Force vite-react-ssg to use the project's own react-helmet-async
      //    instead of its internal nested copy — prevents dual-instance crash ──
      'react-helmet-async': path.resolve(
        __dirname,
        'node_modules/react-helmet-async',
      ),
    },
    // ── Deduplicate to guarantee a single instance across all bundles ──
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
    ],
  },

  // ── SSR/SSG: bundle CJS packages instead of externalizing them ────────────
  // Prevents "Named export not found" errors for CommonJS modules in Node ESM
  ssr: {
    noExternal: [
      'react-helmet-async',
    ],
  },

  // ── SSG Options ───────────────────────────────────────────────────────────
  ssgOptions: {
    script: 'async',
    formatting: 'none',
    includedRoutes: async (paths: string[]) => {
      try {
        const [services, sectors, locations, landings, blogs] = await Promise.all([
          fetch(`${API_URL}/api/services`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/sectors`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/locations`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/location-services`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/blog`).then(r => r.json()).catch(() => []),
        ])

        // ── Normalise API responses — handles both [] and { data: [] } shapes ──
        const toArr = (res: any): any[] => {
          if (Array.isArray(res)) return res
          if (res && Array.isArray(res.data)) return res.data
          return []
        }

        const allRoutes = [
          ...paths,
          ...toArr(services).map((s: any)  => `/services/${s.slug}`),
          ...toArr(sectors).map((s: any)   => `/sectors/${s.slug}`),
          ...toArr(locations).map((l: any) => `/locations/${l.slug}`),
          ...toArr(landings).map((l: any)  => `/locations/${l.locationSlug}/${l.serviceSlug}`),
          ...toArr(blogs).map((b: any)     => `/blog/${b.slug}`),
        ]

        // ── Deduplicate and strip any empty/undefined routes ──
        return [...new Set(allRoutes.filter(Boolean))]
      } catch (err) {
        console.error('[SSG] Failed to fetch dynamic routes:', err)
        return paths
      }
    },
  },

  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) return 'react-vendor'
          if (id.includes('node_modules/@radix-ui')) return 'ui-vendor'
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/zod') ||
            id.includes('node_modules/@hookform')
          ) return 'form-vendor'
          if (id.includes('node_modules/framer-motion')) return 'animation-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor'
          if (id.includes('node_modules/firebase')) return 'firebase-vendor'
          if (id.includes('node_modules/@stripe')) return 'stripe-vendor'
          if (id.includes('node_modules/recharts')) return 'charts-vendor'
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    sourcemap: false,
    reportCompressedSize: true,
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion',
    ],
  },
}))