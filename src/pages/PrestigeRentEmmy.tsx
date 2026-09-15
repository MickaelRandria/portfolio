import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  LayoutGrid,
  Palette,
  PenLine,
  Presentation,
  Sheet,
} from 'lucide-react'
import {
  EASE,
  fadeUp,
  lineContainer,
  lineReveal,
  staggerContainer,
} from '../lib/motion'

// ── Données ────────────────────────────────────────────────────────────────
// Tous les chiffres ci-dessous sont repris tels quels du chiffrage validé.
// Chaque montant est arrondi à l'euro indépendamment (heures × TJM / 7 h).

const LIVRABLES = [
  {
    icon: Presentation,
    title: 'Deck de présentation commerciale',
    body:  'Finalisé : 10 slides validées ensemble.',
  },
  {
    icon: LayoutGrid,
    title: 'Cartes Bento Bordeaux et Or Mat',
    body:  'Intégrées à la trame visuelle du deck.',
  },
  {
    icon: PenLine,
    title: 'Corrections et uniformisation',
    body:  'Reprise du document original pour le rendre cohérent de bout en bout.',
  },
  {
    icon: Palette,
    title: 'Charte visuelle',
    body:  'Validée et harmonisée avec le site web PrestigeRent.',
  },
  {
    icon: FileText,
    title: 'Section « projet détaillé »',
    body:  'Adresse, surface, configuration, extérieurs, loyer, taxe, bail, destination.',
  },
] as const

const OUTILS = [
  {
    icon: Sheet,
    number: '1',
    title: 'Excel like',
    body:
      "Un vrai outil interactif, pas un fichier Excel de plus. Tu suis ton budget et tes travaux toi-même, simplement, sans formules à maintenir ni onglets qui se perdent.",
  },
  {
    icon: ClipboardList,
    number: '2',
    title: 'Cahier des charges de travaux interactif',
    body:
      "Le suivi de tes travaux d'aménagement en temps réel, aux couleurs de PrestigeRent. Chaque étape que tu valides apparaît aussitôt pour tes associés : ils voient où en est le chantier sans avoir à te demander.",
  },
] as const

// Couleurs des séries : validées (daltonisme + contraste ≥ 3:1 sur le fond sand)
const SERIES = {
  livre:  { label: 'Déjà livré',         color: '#1f6d9c' },
  excel:  { label: 'Excel like',         color: '#a0731f' },
  cahier: { label: 'Cahier des charges', color: '#8e2f48' },
} as const

type SerieKey = keyof typeof SERIES

// Répartition des heures : estimation basse (34 h) et haute (42 h)
const HEURES_ROWS = [
  {
    id: 'basse',
    label: 'Estimation basse',
    total: 34,
    segments: [
      { key: 'livre',  hours: 4  },
      { key: 'excel',  hours: 15 },
      { key: 'cahier', hours: 15 },
    ],
  },
  {
    id: 'haute',
    label: 'Estimation haute',
    total: 42,
    segments: [
      { key: 'livre',  hours: 12 },
      { key: 'excel',  hours: 15 },
      { key: 'cahier', hours: 15 },
    ],
  },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  total: number
  segments: ReadonlyArray<{ key: SerieKey; hours: number }>
}>

const HEURES_MAX = 42
const HEURES_TICKS = [0, 10, 20, 30, 40] as const

const TJMS = [
  { id: '200', tjm: '200€/jour', sub: 'TJM actuel',        low: 971, high: 1200, mine: false },
  { id: '180', tjm: '180€/jour', sub: 'Ancien TJM junior', low: 874, high: 1080, mine: false },
  { id: '150', tjm: '150€/jour', sub: 'Tarif ami',         low: 729, high: 900,  mine: true  },
] as const

const TJM_MAX = 1200

const TABLE_ROWS = [
  { bloc: 'Déjà livré',         temps: '4h à 12h', t200: '114€ à 343€', t180: '103€ à 309€', t150: '86€ à 257€' },
  { bloc: 'Excel like',         temps: '15h',      t200: '429€',        t180: '386€',        t150: '321€'       },
  { bloc: 'Cahier des charges', temps: '15h',      t200: '429€',        t180: '386€',        t150: '321€'       },
] as const

const euro = (n: number) => `${n}€`

// ── Sous-composants ────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  id,
  children,
  intro,
  dark = false,
}: {
  eyebrow: string
  id: string
  children: ReactNode
  intro?: string
  dark?: boolean
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.p
        variants={fadeUp}
        className={`text-[11px] uppercase tracking-[0.22em] ${dark ? 'text-gold' : 'text-water'}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        id={id}
        variants={lineContainer}
        className={`font-fraunces mt-5 font-bold leading-[1.05] tracking-tight ${dark ? 'text-sand' : 'text-ink'}`}
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        <span className="block overflow-hidden">
          <motion.span variants={lineReveal} className="block pb-[0.06em]">
            {children}
          </motion.span>
        </span>
      </motion.h2>
      {intro && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 max-w-2xl text-base leading-[1.7] ${dark ? 'text-sand/70' : 'text-ink/70'}`}
        >
          {intro}
        </motion.p>
      )}
    </motion.div>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink/70">
      {(Object.keys(SERIES) as SerieKey[]).map((k) => (
        <li key={k} className="inline-flex items-center gap-2">
          <span
            className="block h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: SERIES[k].color }}
            aria-hidden="true"
          />
          {SERIES[k].label}
        </li>
      ))}
    </ul>
  )
}

/** Barres horizontales empilées : heures par bloc, estimation basse et haute. */
function HeuresChart() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [hover, setHover] = useState<string | null>(null)

  return (
    <div ref={ref}>
      <Legend />

      <div className="mt-8 flex flex-col gap-7" onMouseLeave={() => setHover(null)}>
        {HEURES_ROWS.map((row, r) => (
          <div key={row.id} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <span className="text-[14px] font-medium text-ink md:w-36 md:shrink-0">
              {row.label}
            </span>

            <div className="flex flex-1 items-center gap-3">
              <div className="relative h-9 flex-1">
                <motion.div
                  className="absolute inset-y-0 left-0 flex origin-left gap-[2px] overflow-visible"
                  style={{ width: `${(row.total / HEURES_MAX) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? 1 : 0 }}
                  transition={{ duration: 1, ease: EASE, delay: r * 0.15 }}
                >
                  {row.segments.map((seg, i) => {
                    const id     = `${row.id}-${seg.key}`
                    const serie  = SERIES[seg.key]
                    const active = hover === id
                    const dimmed = hover !== null && !active
                    return (
                      <div
                        key={seg.key}
                        className="relative h-full cursor-default transition-opacity duration-150"
                        style={{
                          flexGrow: seg.hours,
                          flexBasis: 0,
                          backgroundColor: serie.color,
                          opacity: dimmed ? 0.4 : 1,
                          borderRadius:
                            i === 0 ? '4px 0 0 4px' :
                            i === row.segments.length - 1 ? '0 4px 4px 0' : 0,
                        }}
                        onMouseEnter={() => setHover(id)}
                        onClick={() => setHover(active ? null : id)}
                        aria-label={`${row.label}, ${serie.label} : ${seg.hours} h`}
                        role="img"
                      >
                        {seg.hours >= 10 && (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] font-semibold tabular-nums text-white">
                            {seg.hours} h
                          </span>
                        )}
                        {active && (
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-3 py-2 text-[12px] text-sand shadow-lg">
                            {serie.label} · <span className="tabular-nums">{seg.hours} h</span>
                          </span>
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              </div>
              <span className="w-12 shrink-0 text-right text-[15px] font-semibold tabular-nums text-ink">
                {row.total} h
              </span>
            </div>
          </div>
        ))}

        {/* Axe */}
        <div className="flex flex-col md:flex-row md:gap-4" aria-hidden="true">
          <span className="hidden md:block md:w-36 md:shrink-0" />
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-4 flex-1 border-t border-ink/15">
              {HEURES_TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute top-1 -translate-x-1/2 whitespace-nowrap text-[11px] tabular-nums text-ink/45"
                  style={{ left: `${(t / HEURES_MAX) * 100}%` }}
                >
                  {t} h
                </span>
              ))}
            </div>
            <span className="w-12 shrink-0" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-[13px] leading-[1.6] text-ink/55">
        Seul le bloc « Déjà livré » varie (4 h à 12 h) : 34 h à 42 h au total, soit
        ≈ 4,9 à 6 jours à 7 h/jour.
      </p>
    </div>
  )
}

/** Barres verticales : total du projet selon les 3 TJM (bas plein, haut clair). */
function TjmChart() {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const barColor = '#a0731f'

  return (
    <div ref={ref}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink/70">
        <li className="inline-flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: barColor }} aria-hidden="true" />
          Estimation basse (34 h)
        </li>
        <li className="inline-flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: barColor, opacity: 0.35 }} aria-hidden="true" />
          Jusqu'à l'estimation haute (42 h)
        </li>
      </ul>

      <div
        className="mt-8 grid grid-cols-3 gap-2 sm:gap-5"
        onMouseLeave={() => setHover(null)}
      >
        {TJMS.map((t, i) => {
          const active = hover === t.id
          const dimmed = hover !== null && !active
          return (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-sm border px-2 pb-4 pt-8 transition-opacity duration-150 sm:px-4 ${
                t.mine ? 'border-2 bg-white/40' : 'border-ink/10'
              }`}
              style={{
                borderColor: t.mine ? barColor : undefined,
                opacity: dimmed ? 0.5 : 1,
              }}
              onMouseEnter={() => setHover(t.id)}
              onClick={() => setHover(active ? null : t.id)}
            >
              {t.mine && (
                <span
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]"
                  style={{ backgroundColor: barColor }}
                >
                  Ton tarif
                </span>
              )}

              {/* Valeur */}
              <p
                className={`text-center tabular-nums leading-tight text-ink ${
                  t.mine ? 'font-bold' : 'font-semibold'
                } text-[12px] sm:text-[15px]`}
              >
                {euro(t.low)}
                <span className="block font-normal text-ink/55 sm:inline"> à </span>
                {euro(t.high)}
              </p>

              {/* Barre */}
              <div
                className="relative mx-auto mt-4 h-[180px] w-full max-w-[72px] sm:h-[220px]"
                role="img"
                aria-label={`${t.tjm} : ${euro(t.low)} à ${euro(t.high)}`}
              >
                <motion.div
                  className="absolute inset-x-0 bottom-0 flex origin-bottom flex-col gap-[2px]"
                  style={{ height: `${(t.high / TJM_MAX) * 100}%` }}
                  initial={{ scaleY: reduced ? 1 : 0 }}
                  animate={{ scaleY: inView ? 1 : 0 }}
                  transition={{ duration: 1, ease: EASE, delay: i * 0.15 }}
                >
                  <div
                    className="w-full rounded-t-[4px]"
                    style={{ flexGrow: t.high - t.low, flexBasis: 0, backgroundColor: barColor, opacity: 0.35 }}
                  />
                  <div
                    className="w-full"
                    style={{ flexGrow: t.low, flexBasis: 0, backgroundColor: barColor }}
                  />
                </motion.div>

                {active && (
                  <span className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm bg-ink px-3 py-2 text-[12px] text-sand shadow-lg">
                    34 h : <span className="tabular-nums">{euro(t.low)}</span>
                    <br />
                    42 h : <span className="tabular-nums">{euro(t.high)}</span>
                  </span>
                )}
              </div>
              <div className="h-px w-full bg-ink/20" aria-hidden="true" />

              {/* Libellés */}
              <p className={`mt-3 text-center tabular-nums text-ink ${t.mine ? 'font-bold' : 'font-medium'} text-[13px] sm:text-[15px]`}>
                {t.tjm}
              </p>
              <p className="mt-0.5 text-center text-[11px] text-ink/55 sm:text-[12px]">
                {t.sub}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PrestigeRentEmmy() {
  const isReduced = useReducedMotion()

  useEffect(() => {
    document.title = 'Pour Emmy · PrestigeRent · Mickael'
    return () => {
      document.title = 'Mickael · Web Analyst Digital'
    }
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
        {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
        <section className="flex min-h-[70vh] items-center bg-ink pt-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] uppercase tracking-[0.22em] text-gold"
            >
              Pour Emmy · PrestigeRent
            </motion.p>

            <motion.h1
              variants={lineContainer}
              className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-sand"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
            >
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.06em]">
                  Bonjour Emmy,
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.06em]">
                  on fait <span className="italic">le point</span>.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-2xl text-[1.125rem] leading-[1.65] text-sand/70"
            >
              Cette page reprend ce qu'on a déjà construit ensemble pour PrestigeRent,
              les deux outils qu'il reste à faire, et le prix que je te propose, avec
              le détail du temps derrière chaque chiffre.
            </motion.p>
          </motion.div>
        </section>

        {/* ── 2. Déjà livré ─────────────────────────────────────────────────── */}
        <section className="bg-sand py-24 lg:py-32" aria-labelledby="livre-titre">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <SectionHeader
              eyebrow="Ce qui est déjà fait"
              id="livre-titre"
              intro="Le socle visuel et commercial du projet est en place."
            >
              Une base <span className="italic">déjà solide</span>.
            </SectionHeader>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {LIVRABLES.map((item) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={item.title}
                    variants={fadeUp}
                    className={`rounded-sm border border-ink/15 p-5 transition-all duration-200 hover:border-water ${
                      isReduced ? '' : 'hover:-translate-y-0.5'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-water" strokeWidth={1.75} aria-hidden="true" />
                    <p className="mt-4 text-[15px] font-semibold leading-[1.4] text-ink">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.65] text-ink/65">
                      {item.body}
                    </p>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>
        </section>

        {/* ── 3. À construire ───────────────────────────────────────────────── */}
        <section className="bg-ink py-24 lg:py-32" aria-labelledby="outils-titre">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <SectionHeader
              eyebrow="Ce qu'il reste à construire"
              id="outils-titre"
              intro="Deux outils pensés pour que tu gagnes du temps au quotidien, et que tout le monde reste aligné."
              dark
            >
              Deux outils, <span className="italic">faits pour toi</span>.
            </SectionHeader>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {OUTILS.map((outil) => {
                const Icon = outil.icon
                return (
                  <motion.article
                    key={outil.title}
                    variants={fadeUp}
                    className="rounded-sm border border-gold/20 p-6 transition-colors duration-200 hover:border-gold/50 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-fraunces text-[1.5rem] italic text-gold" aria-hidden="true">
                        {outil.number}.
                      </span>
                      <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h3 className="font-fraunces mt-4 text-[1.5rem] font-semibold leading-tight text-sand">
                      {outil.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.7] text-sand/70">
                      {outil.body}
                    </p>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ── 4. Temps et prix ──────────────────────────────────────────────── */}
        <section className="bg-sand py-24 lg:py-32" aria-labelledby="prix-titre">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <SectionHeader
              eyebrow="Le temps et le prix"
              id="prix-titre"
              intro="À mon tarif freelance actuel (200€/jour), le projet représente 971€ à 1200€ de travail. Je te propose un tarif ami à 150€/jour, soit 729€ à 900€ au total."
            >
              La vraie valeur, <span className="italic">à ton tarif</span>.
            </SectionHeader>

            <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Graphique 1 */}
              <motion.figure
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="min-w-0"
              >
                <figcaption className="font-fraunces text-[1.35rem] font-semibold text-ink">
                  Où partent les heures
                </figcaption>
                <p className="mb-6 mt-1 text-[14px] text-ink/60">
                  Répartition du temps estimé par bloc.
                </p>
                <HeuresChart />
              </motion.figure>

              {/* Graphique 2 */}
              <motion.figure
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="min-w-0"
              >
                <figcaption className="font-fraunces text-[1.35rem] font-semibold text-ink">
                  Le total selon le tarif journalier
                </figcaption>
                <p className="mb-6 mt-1 text-[14px] text-ink/60">
                  Même travail, même temps : seul le TJM change.
                </p>
                <TjmChart />
              </motion.figure>
            </div>

            {/* Tableau récapitulatif */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-16"
            >
              <h3 className="font-fraunces text-[1.35rem] font-semibold text-ink">
                Le détail chiffré
              </h3>
              <div className="mt-6 overflow-x-auto rounded-sm border border-ink/15">
                <table className="w-full min-w-[680px] border-collapse text-left text-[14px] text-ink">
                  <thead>
                    <tr className="border-b border-ink/15 text-[12px] uppercase tracking-[0.08em] text-ink/60">
                      <th scope="col" className="px-4 py-4 font-medium">Bloc</th>
                      <th scope="col" className="px-4 py-4 font-medium">Temps estimé</th>
                      <th scope="col" className="px-4 py-4 font-medium">
                        À 200€/jour
                        <span className="block normal-case tracking-normal text-ink/45">TJM actuel</span>
                      </th>
                      <th scope="col" className="px-4 py-4 font-medium">
                        À 180€/jour
                        <span className="block normal-case tracking-normal text-ink/45">Ancien TJM junior</span>
                      </th>
                      <th scope="col" className="bg-[#a0731f]/10 px-4 py-4 font-semibold text-ink">
                        À 150€/jour
                        <span className="block normal-case tracking-normal text-ink/60">Ton tarif</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {TABLE_ROWS.map((row) => (
                      <tr key={row.bloc} className="border-b border-ink/10">
                        <th scope="row" className="px-4 py-4 font-medium">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="block h-2.5 w-2.5 rounded-[2px]"
                              style={{
                                backgroundColor:
                                  row.bloc === 'Déjà livré' ? SERIES.livre.color :
                                  row.bloc === 'Excel like' ? SERIES.excel.color : SERIES.cahier.color,
                              }}
                              aria-hidden="true"
                            />
                            {row.bloc}
                          </span>
                        </th>
                        <td className="px-4 py-4">{row.temps}</td>
                        <td className="px-4 py-4">{row.t200}</td>
                        <td className="px-4 py-4">{row.t180}</td>
                        <td className="bg-[#a0731f]/10 px-4 py-4 font-medium">{row.t150}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <th scope="row" className="px-4 py-4">Total</th>
                      <td className="px-4 py-4">
                        34h à 42h
                        <span className="block text-[12px] font-normal text-ink/55">
                          ≈ 4,9 à 6 jours à 7h/jour
                        </span>
                      </td>
                      <td className="px-4 py-4">971€ à 1200€</td>
                      <td className="px-4 py-4">874€ à 1080€</td>
                      <td className="bg-[#a0731f]/15 px-4 py-4">729€ à 900€</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-6 max-w-3xl text-[13px] leading-[1.7] text-ink/55">
                Ces montants sont des estimations basées sur le temps de travail projeté,
                pas un forfait figé au centime près. Si le cahier des charges demande plus
                de temps que prévu (la partie technique peut réserver quelques surprises),
                on en reparle et on ajuste ensemble. Chaque montant est arrondi à l'euro
                séparément, d'où un écart possible d'1€ entre la somme des lignes et le total.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 5. Clôture ────────────────────────────────────────────────────── */}
        <section className="bg-ink py-24 lg:py-32" aria-labelledby="fin-titre">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <motion.h2
                id="fin-titre"
                variants={lineContainer}
                className="font-fraunces font-bold leading-[1.05] tracking-tight text-sand"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
              >
                <span className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    On en parle <span className="italic">quand tu veux</span> ?
                  </motion.span>
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-sand/70"
              >
                Prends le temps de tout regarder. Si quelque chose te semble flou, trop
                cher ou pas prioritaire, dis-le-moi simplement : on ajuste ensemble.
                Merci pour ta confiance sur PrestigeRent.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="font-fraunces mt-8 text-[1.25rem] italic text-gold"
              >
                Mickael
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Minimal footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-gold/15 bg-ink py-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-16">
          <span className="font-fraunces text-sm font-semibold text-sand/60">
            Mickael
          </span>
          <span className="text-right text-xs text-sand/30">
            Document confidentiel · PrestigeRent
          </span>
        </div>
      </footer>
    </>
  )
}
