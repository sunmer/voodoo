import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site at /voodoo/. Set BASE=/ for other hosts.
  base: process.env.BASE ?? '/voodoo/',
  plugins: [react()],
  build: {manifest: true, rollupOptions: {input: {main: 'index.html', about: 'about/index.html'}}},
  server: {port: 5180},
});
