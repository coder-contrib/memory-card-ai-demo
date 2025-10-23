import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '.coder.com', // Allow all Coder.com subdomains
      '.ai.coder.com', // Allow all ai.coder.com subdomains
    ]
  }
})
