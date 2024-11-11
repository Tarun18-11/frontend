import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], server: {
    proxy: {
     '/api': {
          target: 'https://voting-app-45a7.onrender.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

