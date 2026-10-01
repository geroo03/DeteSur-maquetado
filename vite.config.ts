import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages sirve el sitio bajo /<repo>/, así que el build necesita ese
  // prefijo para resolver los assets. `preview` lo usa también, para que
  // reproduzca exactamente lo que va a servir Pages; el dev server queda en la
  // raíz. BASE_PATH lo sobreescribe al desplegar en la raíz de un dominio
  // (Vercel, Netlify, dominio propio).
  base:
    process.env.BASE_PATH ??
    (command === 'build' || isPreview ? '/DeteSur-maquetado/' : '/'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
  },
}));
