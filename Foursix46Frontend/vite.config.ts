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
      // Point Vite's browser + SSR builds at the plain CJS file.
      // resolve.alias bypasses the exports field, so Rollup handles
      // CJS→ESM and never sees the Node-only createRequire wrapper.
      'react-helmet-async': path.resolve(
        __dirname,
        'node_modules/react-helmet-async/lib/index.js'
      ),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
  },

  // ── ssr.noExternal is intentionally OMITTED for react-helmet-async ────────
  // Externalising it means the SSR temp bundle does a real Node.js import at
  // runtime → resolves via exports.node.import → same createRequire wrapper →
  // same require-cached CJS instance as vite-react-ssg's HelmetProvider.
  // Both share the same React context. Bundling them separately (noExternal)
  // creates two distinct instances → HelmetDispatcher context is undefined.

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

        const toArr = (res: any): any[] => {
          if (Array.isArray(res)) return res
          if (res?.data && Array.isArray(res.data)) return res.data
          if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data
          return []
        }

        // Valid slug: non-empty, no slashes, only url-safe chars, max 50 chars
        // Filters out malformed entries like "same-day-couriersame-day-courier"
        const validSlug = (s: any): s is string =>
          typeof s === 'string' &&
          s.length > 0 &&
          s.length <= 50 &&
          !s.includes('/') &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)

        const allRoutes = [
          ...paths,
          ...toArr(services).filter(s => validSlug(s.slug)).map(s => `/services/${s.slug}`),
          ...toArr(sectors).filter(s => validSlug(s.slug)).map(s => `/sectors/${s.slug}`),
          ...toArr(locations).filter(l => validSlug(l.slug)).map(l => `/locations/${l.slug}`),
          ...toArr(landings)
            .filter(l => validSlug(l.locationSlug) && validSlug(l.serviceSlug))
            .map(l => `/locations/${l.locationSlug}/${l.serviceSlug}`),
          ...toArr(blogs).filter(b => validSlug(b.slug)).map(b => `/blog/${b.slug}`),
        ]

        const unique = [...new Set(allRoutes.filter(Boolean))]
        console.log(`[SSG] Routes to render: ${unique.length}`)
        return unique
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
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) return 'assets/images/[name]-[hash][extname]'
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) return 'assets/fonts/[name]-[hash][extname]'
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
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'framer-motion'],
  },
}))