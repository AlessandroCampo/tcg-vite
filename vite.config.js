import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1000 * 1024, // Adjust the chunk size limit to 1000 kB (1 MB)
  },
});
