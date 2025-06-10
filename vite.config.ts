import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
