// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// HTML statique généré au build : chaque page est indexable, et React n'est
// envoyé au navigateur que pour les îlots interactifs (client:*).
export default defineConfig({
  site: 'https://portfolio-mickaelrandria.vercel.app',
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
