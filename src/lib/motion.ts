/**
 * Easing maison de la DA : courbe lente au départ, accélération franche,
 * sortie douce. Typé en tuple bézier strict pour rester compatible motion v12.
 * Le même tracé est repris en CSS pour les reveals (global.css).
 */
export const EASE: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95]
