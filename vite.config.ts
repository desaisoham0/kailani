import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Kailani Hawaiian Restaurant',
        short_name: 'Kailani',
        description: 'Hawaiian Shave Ice & Ramen Restaurant in New Milford, NJ',
        theme_color: '#e83838',
        background_color: '#19b4bd',
        display: 'standalone',
        icons: [
          {
            src: 'Kailani_logo.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,ttf,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Firebase into its own chunk
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Separate React into its own chunk
          react: ['react', 'react-dom'],
          // Separate date utilities
          'date-fns': ['date-fns'],
          // Separate router
          router: ['react-router-dom'],
          // Separate animation library
          animation: ['framer-motion'],
          // Separate UI libraries
          fontawesome: ['@fortawesome/react-fontawesome', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-brands-svg-icons']
        }
      }
    },
    // Increase chunk size warning limit to 1MB
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize CSS
    cssCodeSplit: true,
    // Optimize for modern browsers
    reportCompressedSize: false,
    // Faster builds
    write: true
  },
  server: {
    // Add your Ngrok host to the allowed hosts
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '7ccd-74-105-11-131.ngrok-free.app'
    ],
    // You may also want to add this to allow CORS
    cors: true
  },
})
