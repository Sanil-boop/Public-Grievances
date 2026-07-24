import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'ashok-stambh.png'],
      manifest: {
        name: 'NagarSeva AI',
        short_name: 'NagarSeva',
        description: 'AI-powered civic complaint classifier and routing system.',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          {
            src: 'ashok-stambh.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'ashok-stambh.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
