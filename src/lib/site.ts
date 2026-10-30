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

/** Les 3 offres, l'agentique IA en tête. Aucun prix, nulle part. */
export const OFFERS = [
  {
    id: 'agent-ia',
    num: '01',
    title: 'Agent IA & automatisation',
    promise: 'Des agents LLM et des automatisations qui transforment la donnée en décision.',
    forWho: 'Équipes qui passent trop de temps sur du reporting ou des tâches répétitives autour de leurs données.',
    deliverables: [
      'Cadrage du cas d’usage et des données',
      'Prototype testable',
      'Garde-fous et repli sans LLM',
      'Mise en production et passation',
    ],
    delay: 'Prototype testable en 1 semaine, mise en production 2 à 3 semaines',
  },
  {
    id: 'site-mesure',
    num: '02',
    title: 'Site mesuré sur mesure',
    promise: 'Un site livré avec son plan de taggage, sa conformité cookies et son dashboard de suivi.',
    forWho: 'Marques et indépendants qui lancent ou refondent leur site et veulent pouvoir prouver ses résultats.',
    deliverables: [
      'Site conçu et développé sur mesure',
      'Plan de taggage et tracking installé',
      'Bandeau cookies et conformité RGPD',
      'Dashboard de suivi de la performance',
    ],
    delay: '2 à 3 semaines, de l’atelier de cadrage à la mise en ligne',
  },
  {
    id: 'audit-tracking',
    num: '03',
    title: 'Audit & refonte tracking / RGPD',
    promise: 'Le diagnostic d’un site existant, sa mise en conformité et un plan de mesure fiable.',
    forWho: 'Sites existants dont les données ne sont plus fiables ou dont le bandeau cookies pose question.',
    deliverables: [
      'Audit du tracking et du consentement',
      'Mise en conformité cookies et RGPD',
      'Plan de mesure priorisé',
      'Recette des tags et documentation',
    ],
    delay: 'Audit sous 5 jours, mise en conformité 1 à 2 semaines selon le périmètre',
  },
] as const

/** Accès à une offre par son id, indépendant de l'ordre d'affichage. */
export const offer = (id: (typeof OFFERS)[number]['id']) => OFFERS.find((o) => o.id === id)!

export const DELAY_NOTE = 'Délai indicatif, confirmé après le cadrage.'
export const PRICE_NOTE = 'Sur devis, après un premier échange de 30 min.'
/** Aucun montant affiché sur le site : les fourchettes s'envoient sur demande. */
export const RANGE_NOTE = 'Fourchettes indicatives envoyées sur simple demande.'
export const RANGE_URL = '/contact?fourchettes=1'

/**
 * Argument de vitesse. Formulé face à « un développement classique » plutôt
 * qu'à des concurrents nommés : une publicité comparative doit rester
 * objective et vérifiable.
 */
export const SPEED_CLAIM = 'Près de 2 fois plus rapide qu’un développement classique'
export const SPEED_POINTS = [
  {
    title: 'Des agents pour produire',
    text: 'Design system, écrans, intégration : des agents IA spécialisés produisent en pipeline ce qui prendrait des jours à la main.',
  },
  {
    title: 'Un humain pour décider',
    text: 'Le cadrage, la conception et chaque arbitrage restent les miens. Les agents exécutent, ils ne choisissent pas.',
  },
  {
    title: 'Une QA jamais sautée',
    text: 'Un agent de revue passe après chaque étape, puis une recette manuelle : le temps gagné n’est jamais pris sur la qualité.',
  },
] as const
