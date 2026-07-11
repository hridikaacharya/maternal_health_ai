import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Maternal Health Screening MVP',
        short_name: 'MHS MVP',
        description: 'Offline-first maternal health screening for FCHVs in Nepal.',
        theme_color: '#0f6e56',
        background_color: '#f7f4ec',
        display: 'standalone'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});