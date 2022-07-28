import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import * as path from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
    assetsDir: 'code',
    rollupOptions: {
      output: {
        manualChunks: function splitModulesOnChunks (id) {
          if (id.includes('node_modules'))
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    VitePWA({
      minify: true,
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      includeAssets: ['**/*.png', '**/*.ttf', '**/*.cur', '**/*.ico', '**/*.css'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        id: '/',
        scope: '/',
        name: 'Dodging Fish',
        display: 'fullscreen',
        start_url: '/',
        short_name: 'Dodging Fish',
        theme_color: '#3e66d2',
        description:
          'You need to avoid obstacles, keeping the little fish alive.',
        orientation: 'any',
        background_color: '#3e66d2',
        related_applications: [],
        prefer_related_applications: false,
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        categories: ['games'],
      },
    }),
  ],
})
