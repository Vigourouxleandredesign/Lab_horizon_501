import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Racine = dossier frontend : `/src/main.tsx` résout vers `src/main.tsx`.
export default defineConfig({
  plugins: [react()],
  // Chemins absolus depuis la racine du serveur (public/, assets buildés).
  base: '/',
  root: __dirname,
  publicDir: path.join(__dirname, 'public'),
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
})
