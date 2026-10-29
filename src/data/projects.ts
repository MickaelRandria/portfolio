export type Project = {
  id: string
  badge: string
  title: string
  shortDescription: string
  /**
   * Vidéo d'aperçu dans /public/. Absente : un placeholder "Capture à venir"
   * prend sa place dans la card et le modal (cas des projets du Lab IA).
   */
  videoSrc?: string
  /** Absent : le bouton "site live" n'est pas affiché (déploiement hors ligne). */
  liveUrl?: string
  /** Libellé du CTA principal du modal. Par défaut : "Voir le site live". */
  liveLabel?: string
  githubUrl?: string
  /**
   * Niveau de maturité affiché sur les projets du Lab IA (agent réel, simulé,
   * prototype UX). Volontairement explicite : le code est public.
   */
  status?: string
  /** Étapes du pipeline agentique, affichées en frise dans le modal. */
  pipeline?: Array<{ label: string; detail: string }>
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

/**
 * Projets du Lab IA & Data. Même modèle que les réalisations clients, affichés
 * dans leur propre section (LabIA.tsx) avec leur propre navigation de modal.
 * Pour remplacer un placeholder : déposer la vidéo dans /public/ et renseigner
 * `videoSrc` (ex. '/barometre-data.mp4').
 */
export const labProjects: Project[] = [
  {
    id: 'barometre-data',
    badge: 'AGENT IA',
    status: 'Agent opérationnel · LLM Mistral',
    title: 'Baromètre Data',
    shortDescription:
      "Un agent marketing contextuel qui croise un brief de campagne, la météo live et l'attention collective pour dire si un message tombe au bon moment, et quoi changer sinon.",
    videoSrc: '/barometre-data.mp4',
    liveUrl: 'https://barometre-data.vercel.app',
    liveLabel: "Tester l'agent",
    githubUrl: 'https://github.com/MickaelRandria/Barometre_Data',
    metadata: {
      client: 'M2 Data Marketing & IA',
      year: '2026',
      role: 'Conception produit, data et développement full-stack',
      stack: 'React, Node.js, Mistral, Open-Meteo, Wikimedia',
    },
    pipeline: [
      { label: 'Brief', detail: 'Parsing et qualification du brief' },
      { label: 'Contexte', detail: 'Météo Open-Meteo et pages vues Wikimedia' },
      { label: 'Score', detail: 'Réceptivité contextuelle, revue par Ministral' },
      { label: 'Écarts', detail: 'Décalage entre message et contexte' },
      { label: 'Variantes', detail: 'Messages alternatifs générés par LLM' },
      { label: 'Activation', detail: "Plan d'activation et plan A/B test" },
      { label: 'Garde-fous', detail: 'Contrôles RGPD automatiques ou à valider' },
      { label: 'Learning', detail: 'Enseignements calculés sur résultats réels' },
    ],
    context: {
      title: "Les campagnes partent à l'aveugle, quel que soit le contexte.",
      paragraphs: [
        "Un email « moment cocooning » envoyé un jour de canicule, une promo plein air sous la pluie : la plupart des campagnes sont planifiées sans regarder le contexte dans lequel elles vont être reçues. Baromètre Data est né de ce constat, dans le cadre de mon M2 Data Marketing & IA.",
        "L'idée : un agent qui prend un brief de campagne (produit, message, ton, audience, canal, objectif, pression), récupère le contexte réel du moment, puis enchaîne une série de décisions : score de réceptivité, détection d'écarts, variantes de message, plan d'activation, A/B test, garde-fous RGPD et apprentissage post-campagne.",
      ],
    },
    challenges: {
      title: 'Quatre exigences pour un agent crédible.',
      items: [
        {
          title: 'Des données live, mais honnêtes',
          description:
            "La météo et l'attention collective arrivent d'APIs externes qui peuvent tomber. Tout repli devait être signalé clairement, sans jamais être présenté comme une donnée live.",
        },
        {
          title: 'Un LLM utile, pas indispensable',
          description:
            "Le modèle de langage devait enrichir les décisions sans devenir un point de défaillance. Si l'API ne répond pas, l'agent doit quand même rendre un résultat complet.",
        },
        {
          title: 'Une conformité RGPD sans faux-semblant',
          description:
            "Un outil ne peut pas déclarer « conforme » une règle qu'il n'a aucun moyen de vérifier. Il fallait distinguer ce que l'agent contrôle réellement de ce qui reste à valider par un humain.",
        },
        {
          title: 'Apprendre sans inventer',
          description:
            "La boucle d'apprentissage ne devait jamais simuler de résultats de campagne : les enseignements n'existent qu'à partir de métriques réellement saisies.",
        },
      ],
    },
    approach: {
      title: 'Un pipeline modulaire, un LLM en second avis.',
      items: [
        {
          title: 'Dix modules spécialisés',
          description:
            "Contexte, prédiction, détection d'écarts, recommandation, variantes, activation, A/B test, garde-fous, revue de score, apprentissage : chaque étape est un module Node.js isolé, testable, et orchestré par un endpoint unique /api/agent.",
        },
        {
          title: 'Ministral en couche optionnelle',
          description:
            "Ministral 8B apporte un second avis sur le score et génère des variantes de message. Le client LLM ne lève jamais d'exception : en cas d'échec, l'agent se replie sur son résultat déterministe.",
        },
        {
          title: 'Signaux collectifs mesurés',
          description:
            "L'attention collective est lue via Wikimedia Pageviews, agrégée par axe d'intention : moyenne sur 7 jours comparée à 90 jours, données arrêtées à J-2. Sous trois axes disponibles, l'interface bascule explicitement en estimation saisonnière.",
        },
        {
          title: 'Mesure et administration',
          description:
            "Tracking des visites et clics stocké côté serveur, dashboard admin protégé par session HttpOnly, export CSV/JSON et séparation stricte entre trafic simulé et trafic réel.",
        },
      ],
    },
    outcome: {
      title: 'Un agent démontrable de bout en bout.',
      paragraph:
        "Baromètre Data est déployé et utilisable en ligne : un brief saisi produit en quelques secondes un diagnostic complet, du score de réceptivité jusqu'au plan A/B test. Le projet est accompagné d'un livre blanc et montre comment intégrer un LLM dans un produit sans lui confier aveuglément les décisions.",
    },
  },
  {
    id: 'beastly',
    badge: 'AGENT DE CASTING',
    status: 'Prototype · agent simulé',
    title: 'Beastly Creator Portal',
    shortDescription:
      "Une plateforme d'influence marketing qui centralise créateurs, événements et contenus, avec un agent de casting qui présélectionne les profils adaptés à un brief.",
    videoSrc: '/beastly.mp4',
    liveUrl: 'https://beastly-creator-portal.vercel.app',
    liveLabel: 'Voir le prototype',
    githubUrl: 'https://github.com/MickaelRandria/beastly-creator-portal-',
    metadata: {
      client: 'Beastly · projet RNCP Data',
      year: '2026',
      role: 'Product design et développement front',
      stack: 'React, TypeScript, force-graph, PWA',
    },
    context: {
      title: 'Choisir les bons créateurs prend plus de temps que la campagne.',
      paragraphs: [
        "Une agence d'influence jongle entre des centaines de créateurs, des briefs de marques et des événements terrain. La sélection des profils se fait encore souvent à la main, dans des tableurs, au feeling.",
        "Beastly Creator Portal imagine l'outil interne de l'agence : un portail opérationnel pour l'équipe, un espace dédié pour chaque créateur invité à un événement, et un agent de casting qui propose une shortlist argumentée à partir du brief.",
      ],
    },
    challenges: {
      title: 'Trois publics, un seul outil.',
      items: [
        {
          title: 'Accélérer la sélection',
          description:
            "Passer d'un tri manuel à une shortlist scorée et justifiée, que l'équipe peut valider ou ajuster avant d'envoyer les invitations.",
        },
        {
          title: 'Lire un réseau de créateurs',
          description:
            'Des centaines de profils, plusieurs niches et plateformes : il fallait une vue qui rende visibles les proximités entre créateurs, pas une liste de plus.',
        },
        {
          title: 'Gérer le terrain',
          description:
            "Les créateurs ont besoin d'un accès simple, sans compte complexe : RSVP, brief, idées de contenus, assets et QR code d'entrée le jour J.",
        },
      ],
    },
    approach: {
      title: 'Un agent pensé comme un parcours.',
      items: [
        {
          title: 'Agent de casting en trois temps',
          description:
            "Scan des profils, scoring par rapport au brief, sélection argumentée. Dans le prototype, les étapes sont simulées côté front ; l'architecture est prévue pour brancher un scraper et Gemini.",
        },
        {
          title: 'Graphe réseau par niches',
          description:
            "Visualisation force-graph des créateurs, en nuage ou en clusters, filtrable par niche, plateforme et taille d'audience pour repérer rapidement les bons profils.",
        },
        {
          title: 'Portail créateur tokenisé',
          description:
            "Chaque créateur reçoit un lien unique vers son espace événement : confirmation, brief, idées de contenus, assets de marque, upload et QR code d'accès scanné par l'équipe à l'entrée.",
        },
        {
          title: "Pilotage de l'agence",
          description:
            'Dashboard, suivi des contenus, événements, finances et tendances réunis dans un même portail opérationnel.',
        },
      ],
    },
    outcome: {
      title: 'Un prototype qui pose le produit avant le modèle.',
      paragraph:
        "Le parcours complet est démontrable, du brief jusqu'au scan du QR code le jour de l'événement. L'agent est volontairement simulé à ce stade : le produit valide d'abord l'usage et l'expérience, la prochaine étape consiste à brancher les appels réels de scoring.",
    },
  },
  {
    id: 'timespeech',
    badge: 'PROTOTYPE UX IA',
    status: 'Prototype UX · données simulées',
    title: 'TimeSpeech',
    shortDescription:
      "Un assistant de création de cours qui génère un déroulé et des slides à partir d'un brief, et calibre la durée réelle sur le débit de parole de l'enseignant.",
    videoSrc: '/timespeech.mp4',
    githubUrl: 'https://github.com/MickaelRandria/TimeSpeech',
    metadata: {
      client: 'Projet ESD Bordeaux',
      year: '2026',
      role: 'Product design et développement front',
      stack: 'React, TypeScript, Tailwind, Framer Motion',
    },
    context: {
      title: 'Un cours de deux heures qui en dure trois.',
      paragraphs: [
        "Les enseignants vacataires préparent souvent leurs cours seuls, sur un temps contraint, et découvrent en salle que le contenu prévu ne tient pas dans le créneau. Les outils de génération de slides ignorent complètement la question du temps.",
        "TimeSpeech part de cette contrainte : à partir d'un brief de cours, l'assistant pose quelques questions, génère un plan minuté et ses slides, puis affine l'estimation de durée en calibrant le débit de parole réel de l'enseignant.",
      ],
    },
    challenges: {
      title: "Rendre l'IA lisible et utile.",
      items: [
        {
          title: 'Un affinage conversationnel',
          description:
            'Remplacer un long formulaire par quelques questions ciblées, dont chaque réponse modifie visiblement le plan proposé.',
        },
        {
          title: 'Une durée crédible',
          description:
            'Une estimation basée sur un débit standard ne suffit pas. Il fallait relier la calibration vocale à la durée du cours, de façon visible et compréhensible.',
        },
        {
          title: 'Un parcours complet en démo',
          description:
            "De l'upload du brief jusqu'au planning hebdomadaire, le prototype devait se dérouler sans accroc devant un jury.",
        },
      ],
    },
    approach: {
      title: 'Un parcours en dix écrans, construit avec des agents.',
      items: [
        {
          title: "Chat d'affinage",
          description:
            'Format, type de séance, objectif pédagogique : chaque réponse recompose le plan en direct, sections ajoutées mises en évidence.',
        },
        {
          title: 'Calibration vocale',
          description:
            "Après la mesure du débit (en mots par minute), la durée estimée du cours se met à jour à l'écran avec une transition : c'est le moment clé de la démo.",
        },
        {
          title: 'Éditeur de slides et planning',
          description:
            'Aperçu du cours généré, timeline minutée, éditeur de slides en grille et planification sur la semaine.',
        },
        {
          title: 'Développé avec 4 agents Claude Code',
          description:
            "Le front a été produit par un pipeline séquentiel de sous-agents : design system, écrans, intégration du parcours, puis revue QA avant chaque démo.",
        },
      ],
    },
    outcome: {
      title: 'Un prototype qui rend tangible une IA centrée sur le temps.',
      paragraph:
        "TimeSpeech démontre un concept produit complet, sur des données simulées : le parcours permet de juger l'expérience avant d'investir dans la génération réelle et la mesure vocale. Le projet montre aussi une façon de travailler, où des agents IA accélèrent la construction d'un prototype de bout en bout.",
    },
  },
]
