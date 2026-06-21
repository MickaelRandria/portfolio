import type { Variants } from 'motion/react'

/**
 * Easing maison demandé par la DA : courbe lente au départ, accélération franche,
 * sortie douce. Typé en tuple bézier strict pour rester compatible motion v12.
 */
export const EASE: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95]

/** Conteneur qui orchestre l'entrée séquentielle eyebrow -> titre -> sous-titre -> stats. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12,
    },
  },
}

/** Apparition simple (opacité + légère montée) pour eyebrow, sous-titre, cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
}

/**
 * Conteneur du titre : cascade ligne par ligne.
 * Sert de parent aux <motion.span> en effet de masque ci-dessous.
 */
export const lineContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

/**
 * Effet de masque vertical : la ligne glisse depuis le bas de son conteneur
 * `overflow-hidden`. À utiliser sur un <motion.span> enfant de lineContainer.
 */
export const lineReveal: Variants = {
  hidden: { y: '115%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: EASE },
  },
}

/**
 * Ligne fine qui se déploie horizontalement. Régler `transform-origin` via une
 * classe (origin-left / origin-right) selon le sens de déploiement voulu.
 */
export const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: EASE },
  },
}

/** Conteneur des cards Réalisations : apparition en cascade (stagger 0.15s). */
export const staggerCards: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

/** Conteneur à cadence lente (0.2s) : leviers de la section Approche. */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}
