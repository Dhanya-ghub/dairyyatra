import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      ignored: [
        '**/Images/**',
        '**/Bg videos/**',
        '**/Knowledge Institute logo/**',
        '**/partners logo/**',
        '**/public/**',
        '**/.git/**',
        '**/*.jpeg',
        '**/*.jpg',
        '**/*.png',
        '**/*.webp',
        '**/*.svg',
        '**/*.mp4',
        '**/*.pdf',
        '**/*.zip'
      ]
    }
  }
})
