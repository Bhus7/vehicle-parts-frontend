import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward every /api/* request from the browser to the .NET backend,
      // bypassing the self-signed SSL certificate in development.
      '/api': {
        target: 'http://localhost:5037',
        changeOrigin: true,
        secure: false,         // Accept self-signed dev cert
        rewrite: (path) => path,
      },
    },
  },
})
