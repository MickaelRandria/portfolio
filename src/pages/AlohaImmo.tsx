import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { ArrowRight, ArrowLeft, Calendar, ExternalLink, ImageOff } from 'lucide-react'
import {
  EASE,
  fadeUp,
  lineContainer,
  lineReveal,
  staggerContainer,
  staggerCards,
} from '../lib/motion'
import type { Variants } from 'motion/react'

// Remplir avec l'URL de déploiement Vercel une fois la maquette en ligne.
// Si vide, le bouton "Explorer la maquette interactive" n'est pas affiché.
const MAQUETTE_URL = 'https://aloha-mockup.vercel.app/'

// ── Données ────────────────────────────────────────────────────────────────

interface Opportunite {
  number: string
  title: string
  description: string
}

interface GalleryCard {
  src: string
  alt: string
  eyebrow: string
  title: string
  description: string
}

const OPPORTUNITES: readonly Opportunite[] = [
  {
    number: '01.',
    title: 'Première impression',
    description:
      "Un visiteur décide en trois secondes si votre site lui inspire confiance. La hiérarchie visuelle et le message central peuvent être repensés pour capter l'attention des acheteurs et vendeurs dès l'atterrissage.",
  },
  {
    number: '02.',
    title: 'Expérience mobile',
    description:
      "La majorité de vos prospects arrivent sur mobile. Une navigation fluide, des visuels adaptés et un accès rapide aux biens font la différence entre un contact qualifié et un rebond silencieux.",
  },
  {
    number: '03.',
    title: 'Confiance et crédibilité locale',
    description:
      "Votre ancrage à La Réunion est un atout différenciant rare. Le site peut mieux mettre en scène votre expertise du marché local, vos avis clients et votre présence de terrain pour rassurer dès la première visite.",
  },
  {
    number: '04.',
    title: 'Performance et mesure',
    description:
      "Un site qui ne se mesure pas ne progresse pas. On intègre les outils de suivi dès la mise en ligne pour piloter chaque optimisation avec des données réelles, pas des suppositions.",
  },
]

const GALLERY: readonly GalleryCard[] = [
  {
    src: '/aloha_hero.png',
    alt: 'Section hero de la maquette Aloha Immo Services, accroche éditoriale territoriale sur fond sombre',
    eyebrow: 'HERO',
    title: "L'immobilier du sud-ouest malgache",
    description:
      "Une accroche éditoriale qui ancre immédiatement Aloha dans son territoire et son ambition.",
  },
  {
    src: '/aloha_univers.png',
    alt: "Section Nos Univers avec quatre portes d'entrée : Acheter, Louer, Professionnels, Accompagnement",
    eyebrow: 'NOS UNIVERS',
    title: 'Chaque projet a son chemin',
    description:
      "Quatre portes d'entrée distinctes pour clarifier votre offre : Acheter, Louer, Professionnels, Accompagnement.",
  },
  {
    src: '/aloha_invest.png',
    alt: "Section Investisseurs étrangers présentant l'expertise du bail emphytéotique à Madagascar",
    eyebrow: 'DIFFÉRENCIATION',
    title: 'Investir à Madagascar en toute sécurité',
    description:
      "Une section dédiée aux investisseurs étrangers qui met en lumière votre expertise du bail emphytéotique.",
  },
]

const BIG_NUMBERS = [
  { number: '276', label: 'PAGES ANALYSÉES' },
  { number: '2 399', label: 'IMAGES INVENTORIÉES' },
  { number: '6 658', label: 'PARAGRAPHES LUS' },
  { number: '8', label: 'CATÉGORIES IDENTIFIÉES' },
] as const

const BARS = [
  { label: 'Terrains', pct: 57, value: '59 pages' },
  { label: 'Commercial', pct: 25, value: '26 pages' },
  { label: 'Ventes', pct: 12, value: '12 pages' },
  { label: 'Locations', pct: 5, value: '5 pages' },
] as const

const PEPITE_STATS = [
  { number: '1', label: 'Article dédié au bail emphytéotique' },
  { number: '0', label: "Mention en page d'accueil" },
  { number: '0', label: 'Entrée dans le menu principal' },
  { number: '1/276', label: 'Pages dédiées aux investisseurs étrangers' },
] as const

const WORDS_TODAY = [
  { text: 'à vendre', size: 'text-3xl' },
  { text: 'Tuléar', size: 'text-4xl' },
  { text: 'F3', size: 'text-2xl' },
  { text: 'à louer', size: 'text-3xl' },
  { text: 'terrain', size: 'text-4xl' },
  { text: 'F4', size: 'text-xl' },
  { text: 'm²', size: 'text-2xl' },
  { text: 'F7', size: 'text-xl' },
  { text: 'appartement', size: 'text-2xl' },
  { text: 'maison', size: 'text-3xl' },
  { text: 'Caractéristiques', size: 'text-xl' },
  { text: 'Contactez-nous', size: 'text-lg' },
] as const

const WORDS_TOMORROW = [
  { text: 'côte sud-ouest', size: 'text-3xl' },
  { text: 'investir', size: 'text-4xl' },
  { text: 'expertise', size: 'text-3xl' },
  { text: 'patrimoine', size: 'text-3xl' },
  { text: 'bail emphytéotique', size: 'text-2xl' },
  { text: 'Madagascar', size: 'text-4xl' },
  { text: 'sécuriser', size: 'text-3xl' },
  { text: 'vue lagon', size: 'text-2xl' },
  { text: 'accompagner', size: 'text-3xl' },
  { text: 'territoire', size: 'text-2xl' },
  { text: 'confiance', size: 'text-xl' },
  { text: 'horizon', size: 'text-xl' },
] as const

// ── Variants ───────────────────────────────────────────────────────────────

const rowStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const staggerWords: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const wordFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

// ── Composants internes ────────────────────────────────────────────────────

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 bg-ink/10 ${className ?? ''}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8 text-ink/30" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.15em] text-ink/40">
          Visuel à venir
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AlohaImmo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const barsInView = useInView(barsRef, { once: true, amount: 0.4 })

  useEffect(() => {
    document.title = 'Pour Aloha Immo Services · Mickael'
    return () => {
      document.title = 'Mickael · Web Analyst Digital'
    }
  }, [])

  // Lecture automatique dès que la vidéo entre dans le viewport, pause sinon.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── Minimal header ────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/15 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-16">
          <Link
            to="/"
            className="font-fraunces text-xl font-semibold tracking-tight text-sand transition-opacity hover:opacity-80 sm:text-2xl"
          >
            Mickael
          </Link>
          <Link
            to="/"
            aria-label="Retour au portfolio"
            className="inline-flex items-center gap-2 text-sm text-sand/60 transition-colors duration-300 hover:text-sand"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>
        </div>
      </header>

      <main lang="fr">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          id="top"
          className="relative flex min-h-screen items-center justify-center bg-ink"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto flex max-w-[1600px] flex-col items-center px-5 pb-16 pt-32 text-center sm:px-8 lg:px-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.2em] text-gold"
            >
              Proposition exclusive · Aloha Immo Services
            </motion.p>

            <motion.h1
              variants={lineContainer}
              className="font-fraunces mt-8 font-bold leading-[0.95] tracking-tight text-sand"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)' }}
            >
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.2em]">
                  Bonjour <span className="italic">Ben</span>.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-2xl text-[1.125rem] leading-[1.65] text-sand/70"
            >
              J'ai pris le temps d'analyser votre présence en ligne. Ce que je vois est
              prometteur. Voici ce que l'on pourrait construire ensemble pour faire
              d'Aloha Immo Services la référence immobilière de La Réunion sur le web.
            </motion.p>

            <motion.a
              variants={fadeUp}
              href="#opportunites"
              className="group mt-12 inline-flex items-center gap-2.5 rounded-[4px] border border-gold/60 px-8 py-4 text-sand transition-colors duration-300 hover:bg-sand hover:text-ink"
            >
              <span className="font-semibold">Découvrir la vision</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </motion.a>
          </motion.div>
        </section>

        {/* ── Première lecture : Avant / Après + Galerie ────────────────────── */}
        <section
          className="bg-sand py-24 lg:py-32"
          aria-labelledby="avantapres-titre"
        >
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">

            {/* Header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs uppercase tracking-[0.2em] text-water"
              >
                Première lecture
              </motion.p>

              <motion.h2
                id="avantapres-titre"
                variants={lineContainer}
                className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
              >
                <span className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    Du site actuel à une{' '}
                    <span className="italic">vision possible</span>.
                  </motion.span>
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-base leading-[1.7] text-ink/60"
              >
                Une comparaison directe entre votre présence actuelle et la direction que
                l'on pourrait prendre ensemble.
              </motion.p>
            </motion.div>

            {/* Sous-bloc 1 : Avant / Après */}
            <motion.div
              variants={staggerCards}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2"
            >
              {/* Card gauche : AUJOURD'HUI */}
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink/60">
                  Aujourd'hui
                </p>
                <div className="overflow-hidden rounded-sm border border-ink/15">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-ink/5">
                    <ImageWithFallback
                      src="/aloha-actuel.png"
                      alt="Capture d'écran du site actuel d'Aloha Immo Services"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                <p className="text-sm italic leading-[1.6] text-ink/50">
                  Votre vitrine actuelle : fonctionnelle, identifiée, en ligne depuis
                  plusieurs années.
                </p>
              </motion.div>

              {/* Card droite : DEMAIN */}
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-water">
                  Demain
                </p>
                <div className="relative overflow-hidden rounded-sm border border-water/40">
                  <span className="absolute left-3 top-3 z-10 rounded-sm bg-water px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sand">
                    Maquette interactive
                  </span>
                  <video
                    ref={videoRef}
                    src="/aloha_video.mp4"
                    poster="/aloha_hero.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-[16/10] w-full object-cover"
                    aria-label="Aperçu vidéo de la maquette proposée pour Aloha Immo Services"
                  />
                </div>
                <p className="text-sm italic leading-[1.6] text-ink/50">
                  Une proposition de refonte respectant votre métier, votre marché, votre
                  patrimoine de biens.
                </p>
                {/* Affiché uniquement si MAQUETTE_URL est définie */}
                {MAQUETTE_URL && (
                  <a
                    href={MAQUETTE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 self-start rounded-[4px] border border-water/50 px-5 py-2.5 text-sm font-semibold text-water transition-colors duration-300 hover:bg-water hover:text-sand"
                  >
                    Explorer la maquette interactive
                    <ExternalLink
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </a>
                )}
              </motion.div>
            </motion.div>

            {/* Sous-bloc 2 : Galerie */}
            <div className="mt-24">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-[11px] uppercase tracking-[0.2em] text-gold"
                >
                  Trois moments clés
                </motion.p>
                <motion.h3
                  variants={lineContainer}
                  className="font-fraunces mt-4 font-bold leading-[1.05] tracking-tight text-ink"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                >
                  <span className="block overflow-hidden">
                    <motion.span variants={lineReveal} className="block pb-[0.08em]">
                      Quelques <span className="italic">aperçus</span> de la maquette.
                    </motion.span>
                  </span>
                </motion.h3>
                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-xl text-[15px] leading-[1.7] text-ink/70"
                >
                  Trois sections que je trouve particulièrement représentatives de la
                  direction proposée pour Aloha.
                </motion.p>
              </motion.div>

              <motion.div
                variants={staggerCards}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {GALLERY.map((card) => (
                  <motion.div
                    key={card.eyebrow}
                    variants={fadeUp}
                    whileHover={{ scale: 1.01, transition: { duration: 0.3, ease: EASE } }}
                    className="overflow-hidden rounded-sm border border-ink/15 transition-colors duration-300 hover:border-ink/30"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                      <img
                        src={card.src}
                        alt={card.alt}
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                        {card.eyebrow}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">{card.title}</p>
                      <p className="mt-2 text-xs leading-[1.6] text-ink/60">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── L'audit en chiffres ───────────────────────────────────────────── */}
        <section
          className="bg-ink py-20 lg:py-32"
          aria-labelledby="audit-titre"
        >
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">

            {/* Header */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.p
                variants={fadeUp}
                className="text-[11px] uppercase tracking-[0.2em] text-gold"
              >
                L'audit en chiffres
              </motion.p>
              <motion.h2
                id="audit-titre"
                variants={lineContainer}
                className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-sand"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
              >
                <span className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    Ce que les <span className="italic">données disent</span> de votre site.
                  </motion.span>
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-sand/70"
              >
                Une lecture chiffrée de votre vitrine actuelle, issue d'une analyse complète
                des 276 pages de votre site. Quatre signaux qui orientent mes recommandations.
              </motion.p>
            </motion.div>

            {/* Bloc 1 : Grands chiffres */}
            <motion.div
              variants={staggerCards}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4"
            >
              {BIG_NUMBERS.map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  className="rounded-sm border border-gold/15 p-8 transition-colors duration-300 hover:border-gold/40 hover:bg-gold/5"
                >
                  <p
                    className="font-fraunces font-bold leading-none text-gold"
                    style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}
                  >
                    {item.number}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-sand/60">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Bloc 2 : Répartition barres */}
            <div className="mt-24" ref={barsRef}>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-[11px] uppercase tracking-[0.2em] text-gold"
                >
                  Répartition du contenu
                </motion.p>
                <motion.h3
                  variants={lineContainer}
                  className="font-fraunces mt-4 font-bold leading-[1.05] tracking-tight text-sand"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                >
                  <span className="block overflow-hidden">
                    <motion.span variants={lineReveal} className="block pb-[0.08em]">
                      Votre cœur de métier : le foncier.
                    </motion.span>
                  </span>
                </motion.h3>
                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-sand/70"
                >
                  Sur l'ensemble du site, près d'un quart des pages concerne les terrains.
                  C'est votre activité dominante en volume, devant les biens d'habitation et
                  les locaux commerciaux. Pourtant, le foncier est aujourd'hui présenté avec
                  la même hiérarchie qu'une location courte durée.
                </motion.p>

                {/* Barres horizontales */}
                <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-5">
                  {BARS.map((bar, i) => (
                    <div key={bar.label} className="flex items-center gap-4">
                      <span className="w-24 shrink-0 text-sm text-sand">{bar.label}</span>
                      <div
                        className="relative h-3 flex-1 overflow-hidden rounded-sm bg-sand/10"
                        aria-label={`${bar.label} : ${bar.value}, ${bar.pct}%`}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 origin-left rounded-sm bg-gold"
                          style={{ width: `${bar.pct}%` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: barsInView ? 1 : 0 }}
                          transition={{
                            duration: 1.2,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: i * 0.15,
                          }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-right text-sm text-gold">
                        {bar.value}
                      </span>
                    </div>
                  ))}
                  <p className="mt-2 text-xs italic text-sand/40">
                    Hors pages contact et pages éditoriales transverses.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Bloc 3 : Pépite cachée */}
            <div className="mt-24">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                {/* Colonne gauche : texte */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="lg:col-span-7"
                >
                  <motion.p
                    variants={fadeUp}
                    className="text-[11px] uppercase tracking-[0.2em] text-gold"
                  >
                    Pépite cachée
                  </motion.p>
                  <motion.h3
                    variants={lineContainer}
                    className="font-fraunces mt-4 font-bold leading-[1.05] tracking-tight text-sand"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                  >
                    <span className="block overflow-hidden">
                      <motion.span variants={lineReveal} className="block pb-[0.08em]">
                        Votre expertise juridique vaut une{' '}
                        <span className="italic">page d'accueil</span>.
                      </motion.span>
                    </span>
                  </motion.h3>
                  <motion.p
                    variants={fadeUp}
                    className="mt-4 text-[15px] leading-[1.7] text-sand/70"
                  >
                    Vous accompagnez les investisseurs étrangers via le bail emphytéotique,
                    vous publiez un article complet sur le droit de propriété malgache, vous
                    expliquez les conditions d'acquisition. C'est une expertise rare, à forte
                    valeur ajoutée. Mais elle est aujourd'hui enterrée dans une sous-page
                    d'article, sans aucune entrée depuis la home.
                  </motion.p>
                </motion.div>

                {/* Colonne droite : card stats */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-sm border border-gold/30 p-7 lg:col-span-4 lg:col-start-9"
                  style={{ background: 'color-mix(in srgb, #0F1B2D 85%, #D9C5A0 15%)' }}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                    Poids éditorial
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
                    {PEPITE_STATS.map((stat) => (
                      <div key={stat.label}>
                        <p
                          className="font-fraunces font-bold leading-none text-gold"
                          style={{ fontSize: '2.5rem' }}
                        >
                          {stat.number}
                        </p>
                        <p className="mt-2 text-[11px] uppercase leading-[1.5] tracking-[0.15em] text-sand/60">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bloc 4 : Champ lexical */}
            <div className="mt-24">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-[11px] uppercase tracking-[0.2em] text-gold"
                >
                  Analyse sémantique
                </motion.p>
                <motion.h3
                  variants={lineContainer}
                  className="font-fraunces mt-4 font-bold leading-[1.05] tracking-tight text-sand"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                >
                  <span className="block overflow-hidden">
                    <motion.span variants={lineReveal} className="block pb-[0.08em]">
                      Les mots qui{' '}
                      <span className="italic">vous représentent aujourd'hui</span>.
                    </motion.span>
                  </span>
                </motion.h3>
                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-sand/70"
                >
                  L'analyse du vocabulaire dominant révèle un site fonctionnel et descriptif.
                  Les mots sont des étiquettes, pas des invitations. Il manque le territoire,
                  l'expérience, l'aspiration.
                </motion.p>
              </motion.div>

              {/* Nuages côte à côte */}
              <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
                {/* Aujourd'hui */}
                <div className="lg:border-r lg:border-gold/15 lg:pr-12">
                  <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-[10px] uppercase tracking-[0.2em] text-gold"
                  >
                    Aujourd'hui
                  </motion.p>
                  <motion.div
                    variants={staggerWords}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-6 flex flex-wrap gap-x-4 gap-y-3"
                  >
                    {WORDS_TODAY.map((w) => (
                      <motion.span
                        key={w.text}
                        variants={wordFade}
                        className={`font-fraunces leading-none text-gold/80 ${w.size}`}
                      >
                        {w.text}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Demain */}
                <div className="lg:pl-12">
                  <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-[10px] uppercase tracking-[0.2em] text-water"
                  >
                    Demain
                  </motion.p>
                  <motion.div
                    variants={staggerWords}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-6 flex flex-wrap gap-x-4 gap-y-3"
                  >
                    {WORDS_TOMORROW.map((w) => (
                      <motion.span
                        key={w.text}
                        variants={wordFade}
                        className={`font-fraunces leading-none text-sand ${w.size}`}
                      >
                        {w.text}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="mx-auto mt-12 max-w-3xl text-center text-sm italic leading-[1.6] text-sand/60"
              >
                Un même fonds de commerce, raconté avec deux vocabulaires différents : l'un
                descriptif, l'autre désirable.
              </motion.p>
            </div>

            {/* Conclusion */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mx-auto mt-24 max-w-3xl rounded-sm border border-gold/20 p-8"
            >
              <p className="text-xs italic text-sand/40">Méthode.</p>
              <p className="mt-3 text-sm leading-[1.7] text-sand/70">
                Cette analyse est issue d'un crawl exhaustif de votre site, automatisé puis
                vérifié. Elle n'est qu'une couche : la lecture humaine du parcours
                utilisateur, du positionnement et de l'identité de marque vient en
                complément lors de notre échange.
              </p>
            </motion.div>

          </div>
        </section>

        {/* ── Opportunités ──────────────────────────────────────────────────── */}
        <section
          id="opportunites"
          className="bg-ink py-24 lg:py-32"
          aria-labelledby="opportunites-titre"
        >
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs uppercase tracking-[0.2em] text-gold"
              >
                Ce que l'on pourrait améliorer
              </motion.p>

              <motion.h2
                id="opportunites-titre"
                variants={lineContainer}
                className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-sand"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
              >
                <span className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    Quatre opportunités <span className="italic">concrètes</span>.
                  </motion.span>
                </span>
              </motion.h2>
            </motion.div>

            <div className="mt-16 lg:mt-24">
              {OPPORTUNITES.map((item) => (
                <motion.div
                  key={item.number}
                  variants={rowStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-gold/20 py-10 lg:grid-cols-12 lg:py-14"
                >
                  <motion.span
                    variants={fadeUp}
                    className="font-fraunces italic text-gold lg:col-span-1"
                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                    aria-hidden="true"
                  >
                    {item.number}
                  </motion.span>

                  <motion.h3
                    variants={fadeUp}
                    className="font-fraunces font-bold leading-[1.05] tracking-tight text-sand lg:col-span-4"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
                  >
                    {item.title}
                  </motion.h3>

                  <motion.p
                    variants={fadeUp}
                    className="text-[1.0625rem] leading-[1.7] text-sand/75 lg:col-span-6 lg:col-start-7"
                  >
                    {item.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────────────────── */}
        <section className="bg-sand py-24 lg:py-32" aria-labelledby="cta-titre">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <motion.p
                variants={fadeUp}
                className="text-xs uppercase tracking-[0.2em] text-water"
              >
                La suite
              </motion.p>

              <motion.h2
                id="cta-titre"
                variants={lineContainer}
                className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-ink"
                style={{ fontSize: 'clamp(2.25rem, 7vw, 6rem)' }}
              >
                <span className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    Prêt à en <span className="italic">parler</span> ?
                  </motion.span>
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-[1.125rem] leading-[1.65] text-ink/60"
              >
                Un appel de 30 minutes suffit pour voir si mon approche correspond à votre
                projet. Sans engagement, sans jargon.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
              >
                <a
                  href="/#contact"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-ink px-8 py-4 text-sand transition-colors duration-300 hover:bg-water sm:w-auto"
                >
                  <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-semibold">Réserver un créneau</span>
                </a>

                <a
                  href="/#realisations"
                  className="inline-flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-ink/55 transition-colors duration-300 hover:text-ink sm:w-auto"
                >
                  Voir mes réalisations
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-[13px] text-ink/40">
                Réponse sous 48h. Échange confidentiel.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Minimal footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-gold/15 bg-ink py-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <span className="font-fraunces text-sm font-semibold text-sand/60">Mickael</span>
          <span className="text-xs text-sand/30">
            Document confidentiel · Aloha Immo Services
          </span>
        </div>
      </footer>
    </>
  )
}
