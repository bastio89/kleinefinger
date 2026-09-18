import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' damit die gebaute Seite auch aus einem Unterordner
// (z. B. GitHub Pages) oder direkt vom Dateisystem laeuft.
export default defineConfig({
  base: './',
  plugins: [react()],
})
