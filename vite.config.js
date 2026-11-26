import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { visualizer } from 'rollup-plugin-visualizer'

const SITE_URL = 'https://magulsakwala.lk'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: SITE_URL,
      dynamicRoutes: [
        '/how-it-works',
        '/register',
        '/privacy-trust',
        '/contact-faq',
      ],
      exclude: ['/thank-you', '/sign-in', '/sign-up'],
      changefreq: 'weekly',
      priority: 0.7,
    }),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/react-router') || id.includes('/react-dom/') || /\/react\//.test(id))
            return 'vendor-react'
          if (id.includes('@react-oauth')) return 'vendor-oauth'
          if (id.includes('react-helmet-async')) return 'vendor-helmet'
        },
      },
    },
  },
  server: {
    proxy: {
      // run `php -S localhost:8000` from the repo root for local API testing
      '/api': 'http://localhost:8000',
    },
  },
})
