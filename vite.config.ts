import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 se configure via son plugin Vite (plus de tailwind.config.js / PostCSS).
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
