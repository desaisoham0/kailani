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
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,ttf,woff,woff2}'],
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
          animation: ['framer-motion']
        }
      }
    },
    // Increase chunk size warning limit to 1MB
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true
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
