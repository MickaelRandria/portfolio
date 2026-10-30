/**
 * Coordonnées et canaux de contact, utilisés par le footer, /contact et le
 * JSON-LD. Un canal à `href: null` est affiché comme « à venir » sans lien :
 * renseigner l'URL ici suffit à l'activer partout.
 */
export const EMAIL = 'mickarandrianan@gmail.com'

export const CHANNELS: { label: string; href: string | null; external?: boolean }[] = [
  { label: 'Email', href: `mailto:${EMAIL}` },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/micka%C3%ABl-randrianandraina-6b279b171/',
    external: true,
  },
  { label: 'GitHub', href: 'https://github.com/MickaelRandria', external: true },
  // TODO : lien wa.me à fournir.
  { label: 'WhatsApp', href: null },
  { label: 'Réserver 30 min', href: '/contact' },
]

/** Profils publics, repris dans `sameAs` du JSON-LD. */
export const SAME_AS = CHANNELS.filter((c) => c.external && c.href).map((c) => c.href as string)

/** Les 3 offres, dans l'ordre de la hiérarchie du brief. Aucun prix, nulle part. */
export const OFFERS = [
  {
    id: 'site-mesure',
    num: '01',
    title: 'Site mesuré sur mesure',
    promise: 'Un site livré avec son plan de taggage, sa conformité cookies et son dashboard de suivi.',
    forWho: 'Marques et indépendants qui lancent ou refondent leur site et veulent pouvoir prouver ses résultats.',
    deliverables: [
      'Site conçu et développé sur mesure',
      'Plan de taggage et tracking installé',
      'Bandeau cookies et conformité RGPD',
      'Dashboard de suivi de la performance',
    ],
    delay: '4 à 6 semaines, de l’atelier de cadrage à la mise en ligne',
  },
  {
    id: 'audit-tracking',
    num: '02',
    title: 'Audit & refonte tracking / RGPD',
    promise: 'Le diagnostic d’un site existant, sa mise en conformité et un plan de mesure fiable.',
    forWho: 'Sites existants dont les données ne sont plus fiables ou dont le bandeau cookies pose question.',
    deliverables: [
      'Audit du tracking et du consentement',
      'Mise en conformité cookies et RGPD',
      'Plan de mesure priorisé',
      'Recette des tags et documentation',
    ],
    delay: 'Audit sous 10 jours, mise en conformité 2 à 3 semaines selon le périmètre',
  },
  {
    id: 'agent-ia',
    num: '03',
    title: 'Agent IA & automatisation',
    promise: 'Des agents LLM et des automatisations qui transforment la donnée en décision.',
    forWho: 'Équipes qui passent trop de temps sur du reporting ou des tâches répétitives autour de leurs données.',
    deliverables: [
      'Cadrage du cas d’usage et des données',
      'Prototype testable',
      'Garde-fous et repli sans LLM',
      'Mise en production et passation',
    ],
    delay: 'Prototype testable en 2 à 3 semaines, mise en production 4 à 6 semaines',
  },
] as const

export const DELAY_NOTE = 'Délai indicatif, confirmé après le cadrage.'
export const PRICE_NOTE = 'Sur devis, après un premier échange de 30 min.'
