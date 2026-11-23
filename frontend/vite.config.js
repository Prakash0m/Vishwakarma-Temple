import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/@remix-run/router/')
          ) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/chart.js/') || id.includes('node_modules/react-chartjs-2/')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/canvas-confetti/')) {
            return 'vendor-confetti';
          }
        }
      }
    }
  }
});
