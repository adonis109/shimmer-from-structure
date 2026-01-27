import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
  ],
  resolve: {
    alias: {
      '@shimmer-from-structure/svelte': resolve(__dirname, '../../packages/svelte/src/index.ts'),
    },
    dedupe: ['svelte'],
  },
  optimizeDeps: {
    exclude: ['@shimmer-from-structure/svelte'],
  },
});
