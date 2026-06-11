import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    cssCodeSplit: false,
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
