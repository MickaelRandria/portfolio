# Portfolio Mickael

Portfolio one-page premium de Mickael, Web Analyst Digital et concepteur de sites à Bordeaux.

## Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4 (config CSS-first via `@tailwindcss/vite`)
- Motion (Framer Motion) v12 pour les animations
- Lucide React pour les icônes
- Fonts Google : Fraunces (titres) + Inter (corps)

## Développement

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + build de production dans dist/
npm run preview  # sert le build de production en local
```

Node 22.x requis (voir `.nvmrc` / `engines`).

## Déploiement Vercel

Le projet est prêt pour Vercel sans configuration : framework détecté automatiquement
(`vite`), build `npm run build`, dossier de sortie `dist`.

1. Pousser ce dossier sur un dépôt GitHub.
2. Sur vercel.com : New Project, importer le dépôt.
3. Laisser les réglages par défaut, Deploy.

## À compléter

- Brancher le formulaire de contact (Formspree ou équivalent) dans `src/components/Contact.tsx` (actuellement `console.log`).
- Remplacer l'image Open Graph placeholder `public/og-image.svg` par une `og-image.jpg` 1200x630 et mettre à jour les balises dans `index.html`.
