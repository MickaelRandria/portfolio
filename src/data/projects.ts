export type Project = {
  id: string
  badge: string
  title: string
  shortDescription: string
  videoSrc: string
  liveUrl: string
  githubUrl?: string
  /**
   * Captures supplémentaires optionnelles affichées entre "Ma réponse" et
   * "Résultat" (grille 2 colonnes). Laisser vide tant que les fichiers ne sont
   * pas présents dans /public/ : la section ne s'affiche pas et le build n'échoue pas.
   */
  detailImages?: string[]
  metadata: {
    client: string
    year: string
    role: string
    stack: string
  }
  context: {
    title: string
    paragraphs: string[]
  }
  challenges: {
    title: string
    items: Array<{ title: string; description: string }>
  }
  approach: {
    title: string
    items: Array<{ title: string; description: string }>
  }
  outcome: {
    title: string
    paragraph: string
  }
}

export const projects: Project[] = [
  {
    id: 'prestigerent',
    badge: 'VITRINE PREMIUM',
    title: 'PrestigeRent',
    shortDescription:
      'Un site vitrine pour positionner une activité naissante de location courte durée commerciale comme une offre haut de gamme et crédible.',
    videoSrc: '/PrestigeRent.mp4',
    liveUrl: 'https://www.prestigerent.pro/',
    githubUrl: 'https://github.com/MickaelRandria/PrestigeRent',
    metadata: {
      client: 'Confidentiel',
      year: '2026',
      role: 'Direction artistique et développement',
      stack: 'HTML, CSS, JavaScript',
    },
    context: {
      title:
        'Lancer une activité sans antécédents publics, et inspirer la confiance dès la première visite.',
      paragraphs: [
        "PrestigeRent est une activité bordelaise de location courte durée appliquée à des locaux commerciaux. Le principe : louer des locaux via des baux commerciaux 3-6-9, les rénover avec un architecte, puis les exploiter en location courte durée dans un cadre légal strict.",
        "La fondatrice m'a contacté pour son lancement, à un moment où l'activité existait juridiquement mais n'avait encore ni biens en exploitation, ni témoignages, ni chiffres à communiquer. Le défi : produire une vitrine premium qui inspire la même confiance qu'une marque installée, sans inventer ce qu'elle n'a pas encore.",
      ],
    },
    challenges: {
      title: 'Trois enjeux à résoudre.',
      items: [
        {
          title: 'Crédibiliser un démarrage',
          description:
            "Pas de chiffres, pas d'avis clients, pas de portfolio de biens. Il fallait construire la crédibilité uniquement par le ton, l'identité visuelle et la pédagogie du modèle.",
        },
        {
          title: 'Expliquer un modèle peu connu',
          description:
            "La location courte durée commerciale via bail 3-6-9 reste un montage juridique méconnu des propriétaires. Le site devait pédagogiser sans alourdir.",
        },
        {
          title: 'Atteindre un standard premium',
          description:
            "Le marché des baux commerciaux bordelais demande un niveau de présentation à la hauteur des biens et des propriétaires visés. Pas de template, pas de générique.",
        },
      ],
    },
    approach: {
      title: 'Une direction inspirée des grandes maisons bordelaises.',
      items: [
        {
          title: 'Identité visuelle Château Margaux',
          description:
            "Palette bordeaux profond, accents dorés, fond beige chaud. Typographie Playfair Display en titres et Raleway en corps. Inspiration directe des sites des grandes maisons de vin bordelaises pour ancrer la marque dans le prestige local.",
        },
        {
          title: 'Bilingue FR / EN',
          description:
            "Switcher de langue intégré pour adresser une clientèle internationale, courante sur le marché des baux commerciaux à Bordeaux. Traductions complètes en JavaScript vanilla, sans rechargement.",
        },
        {
          title: 'FAQ pédagogique',
          description:
            "Section dédiée aux questions juridiques et opérationnelles que se posent les propriétaires : durée du bail, transformation du local, assurance, dégradations. Lever les freins sans alourdir le hero.",
        },
        {
          title: 'Stack volontairement légère',
          description:
            "HTML, CSS et JavaScript vanilla dans un seul fichier index.html, déployé en FTP. Pas de framework, pas de build, pas de dépendances. Maintenance triviale, performances maximales, déploiement immédiat.",
        },
      ],
    },
    outcome: {
      title: 'Une vitrine prête à accompagner la croissance.',
      paragraph:
        "Le site est en ligne et sert de point d'entrée pour les premiers contacts propriétaires. L'identité visuelle posée pourra accompagner l'évolution de la marque quand l'activité aura sa première vague de biens en exploitation, et permettra d'enrichir progressivement la page avec des références concrètes.",
    },
  },
  {
    id: 'behind-the-song',
    badge: 'FEATURE INNOVANTE',
    title: 'Behind the Song',
    shortDescription:
      "Reproduire l'application Deezer et y intégrer une feature originale : une carte interactive qui géolocalise les morceaux selon leur contexte de création.",
    videoSrc: '/behind-the-song.mp4',
    liveUrl: 'https://deezer-chi.vercel.app/',
    githubUrl: 'https://github.com/MickaelRandria/Deezer',
    metadata: {
      client: 'Hackathon ESD Bordeaux',
      year: '2026',
      role: 'Reproduction app et feature',
      stack: 'React, Vite, Leaflet, PWA',
    },
    context: {
      title: 'Penser une feature qui pourrait exister demain dans Deezer.',
      paragraphs: [
        "Behind the Song est né dans le cadre d'un hackathon organisé à l'ESD Bordeaux. L'exercice : reproduire fidèlement l'expérience de Deezer puis y intégrer une fonctionnalité originale, capable d'enrichir l'écoute musicale sans dénaturer le produit existant.",
        "L'idée retenue : ouvrir une dimension géographique aux morceaux. Où une chanson a-t-elle été écrite ? Où a-t-elle été enregistrée ? Quel contexte territorial a inspiré tel artiste ? Behind the Song propose une carte interactive qui répond à ces questions en associant chaque titre à un lieu et une histoire.",
      ],
    },
    challenges: {
      title: 'Quatre défis pour un produit crédible.',
      items: [
        {
          title: 'Reproduire fidèlement Deezer',
          description:
            "L'interface, les composants, les interactions devaient être suffisamment proches du produit original pour que la feature s'y intègre naturellement, sans rupture d'expérience.",
        },
        {
          title: 'Inventer une feature pertinente',
          description:
            "Pas un gadget. La feature devait apporter une valeur réelle à l'expérience d'écoute, et être défendable face à des équipes produit Deezer.",
        },
        {
          title: 'Implémenter une carte performante',
          description:
            "Manipulation de Leaflet pour afficher des centaines de morceaux géolocalisés, avec filtres par décennie, par genre, et navigation fluide entre les points et le lecteur audio.",
        },
        {
          title: 'Livrer en temps de hackathon',
          description:
            "Tout cela à concevoir, designer et développer en quelques jours, en équipe.",
        },
      ],
    },
    approach: {
      title: 'Une exécution rapide et défendable.',
      items: [
        {
          title: 'Reproduction au pixel près',
          description:
            "Recréation de l'interface Deezer en React et Tailwind : navigation latérale, lecteur en bas, pages playlists, recherche. L'utilisateur retrouve ses repères en quelques secondes.",
        },
        {
          title: 'Carte Leaflet enrichie',
          description:
            "Intégration d'une carte interactive avec markers personnalisés, popups stylisés au mood Deezer, et synchronisation avec le lecteur audio. Cliquer sur un point lance la lecture du morceau associé.",
        },
        {
          title: 'PWA installable',
          description:
            "Configuration progressive web app pour permettre l'installation sur mobile, démontrer la viabilité technique de la feature en mobilité.",
        },
        {
          title: 'En pourparler avec Deezer',
          description:
            "Suite à la présentation du prototype, une product designer Deezer a manifesté son intérêt pour partager la feature en interne. Les échanges sont en cours pour évaluer une intégration potentielle au produit.",
        },
      ],
    },
    outcome: {
      title: "Un prototype qui dépasse le cadre de l'exercice.",
      paragraph:
        "Behind the Song est passé du statut de projet de hackathon à celui de proposition étudiée par les équipes produit Deezer. Au-delà du résultat individuel, le projet démontre qu'un cadre court et contraint peut produire des features défendables, à condition d'avoir une vision claire et une exécution propre.",
    },
  },
  {
    id: 'petite-maille',
    badge: 'CATALOGUE ARTISAN',
    title: 'Petite Maille',
    shortDescription:
      "Donner une vraie vitrine à une créatrice qui vendait jusqu'ici uniquement via Vinted, sans quitter cet écosystème pour ses ventes.",
    videoSrc: '/petite-maille.mp4',
    liveUrl: 'https://petite-maille.vercel.app/',
    githubUrl: 'https://github.com/MickaelRandria/PetiteMaille',
    metadata: {
      client: 'Créatrice indépendante',
      year: '2026',
      role: 'Direction artistique et développement',
      stack: 'HTML, CSS, JavaScript',
    },
    context: {
      title: 'Sortir Vinted du cadre Vinted, sans le quitter.',
      paragraphs: [
        "Petite Maille est une créatrice qui conçoit et vend ses pièces de couture artisanale (crochet, accessoires, déco) sur Vinted. Vinted lui apportait le canal de vente, mais limitait sa capacité à raconter son univers, à présenter ses créations comme une vraie marque, et à proposer du sur-mesure.",
        "Elle voulait un site vitrine propre, qui présente ses créations dans un cadre soigné, sans pour autant migrer ses ventes ailleurs. Le pari : créer une vitrine éditoriale qui valorise son travail et qui renvoie ses visiteurs vers ses annonces Vinted pour la transaction.",
      ],
    },
    challenges: {
      title: 'Trois enjeux pour une vitrine utile.',
      items: [
        {
          title: 'Mettre en scène un artisanat singulier',
          description:
            "Le crochet et la couture artisanale méritent une présentation à la hauteur de la patience qu'ils demandent. Pas de placement marketplace, pas de grille générique : un vrai écrin éditorial.",
        },
        {
          title: 'Rester connecté à Vinted',
          description:
            "Pas de paiement, pas de panier, pas de logistique parallèle. Chaque pièce devait rediriger naturellement vers son annonce Vinted, qui reste l'unique point de transaction.",
        },
        {
          title: 'Permettre le sur-mesure',
          description:
            "La créatrice prend aussi des commandes personnalisées et des retouches. Un formulaire devait pouvoir capter ces demandes proprement.",
        },
      ],
    },
    approach: {
      title: 'Un site simple, juste, et au service du travail.',
      items: [
        {
          title: 'Direction artistique douce',
          description:
            "Palette beige et lavande, typographie serif élégante, photos des créations en grand format. L'univers évoque le fait-main, le soin, le temps long, sans tomber dans le cliché bohème.",
        },
        {
          title: 'Catalogue connecté à Vinted',
          description:
            "Chaque création présentée renvoie vers son annonce Vinted via un lien direct. La vitrine attire, Vinted convertit. Pas de double inventaire à gérer, pas de friction.",
        },
        {
          title: 'Formulaire sur-mesure et retouches',
          description:
            "Formulaire multi-étapes qui qualifie la demande : création sur-mesure, retouche, devis ou question générale. Permet de filtrer les demandes en amont et de répondre vite.",
        },
        {
          title: 'Stack volontairement légère',
          description:
            "HTML, CSS et JavaScript dans un seul fichier. Pas de framework, pas de build, déploiement Vercel immédiat. Maintenance accessible, performances optimales, et compatibilité long terme garantie.",
        },
      ],
    },
    outcome: {
      title: "Une vitrine qui donne à un atelier indépendant l'aura d'une marque.",
      paragraph:
        "Petite Maille dispose désormais d'une vitrine cohérente avec la qualité de son travail. Les visiteurs découvrent l'univers dans un cadre éditorial, puis sont orientés vers les annonces Vinted pour acheter. La structure permet aussi de capter les demandes sur-mesure, segment plus rentable qui n'existait pas avant.",
    },
  },
]
