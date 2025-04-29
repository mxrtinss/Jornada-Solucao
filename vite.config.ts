import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Isso garante que a pasta public seja servida corretamente
  server: {
    fs: {
      strict: false
    }
  }
});



