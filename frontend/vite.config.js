import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginIstanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginIstanbul({
      include: ['src/**/*.js', 'src/**/*.jsx'], // Adjust as necessary for your file paths
      exclude: ['**/*.spec.js', '**/*.test.js'], // Exclude test files from coverage
      extension: ['.js', '.jsx'],
    }),
  ],
})
