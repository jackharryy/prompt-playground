import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AI Hero',
        short_name: 'AI Hero',
        description: 'Create your very own AI hero for kids aged 5-8',
        theme_color: '#fb923c',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8787',
        changeOrigin: true,
      },
      '/auth': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8787',
        changeOrigin: true,
      },
      '/openrouter': {
        target: process.env.VITE_BACKEND_URL ? `${process.env.VITE_BACKEND_URL}/openrouter` : 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
