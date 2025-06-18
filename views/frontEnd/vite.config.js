import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import path from 'path';
import { defineConfig as defineTestConfig } from 'vitest/config';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [vue()],
  test: {
    // Enables Vitest
    globals: true,
    environment: 'happy-dom', // or 'jsdom', depending on your preference
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../bin/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../bin/localhost.pem'))
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3000', // Your backend server
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
