import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // run `php -S localhost:8000` from the repo root for local API testing
      '/api': 'http://localhost:8000',
    },
  },
})
