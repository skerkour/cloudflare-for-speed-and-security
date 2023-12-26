import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    rollupOptions: {
      output: {
        // we use the full hashes to reduces the risk of collision with assets cached for long time
        assetFileNames(chunkInfo) {
          return `webapp/[name]-[hash:22][extname]`;
        },
        chunkFileNames(chunkInfo) {
          return `webapp/[name]-[hash:22].js`;
        },
        entryFileNames(chunkInfo) {
          return `webapp/[name]-[hash:22].js`;
        },
      },
    },
  },
})
