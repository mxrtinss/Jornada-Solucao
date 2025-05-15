import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    fs: {
      strict: false
    }
  },
  // Use temp directory instead of project directory
  cacheDir: path.join(os.tmpdir(), 'vite-cache-industrial-ops'),
});





