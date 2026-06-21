import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Code, TrendingUp } from 'lucide-react'
import { EASE, fadeUp, lineContainer, lineReveal, staggerContainer } from '../lib/motion'

// Deux premières lignes du titre ; la troisième porte l'italique sur "grandir".
const TITLE_LEAD_LINES = ['Concevoir.', 'Mesurer.'] as const

const WORD_LIST = ['Design', 'Data', 'Growth'] as const

const CARDS = [
  { icon: Code, title: 'Approche unique', subtitle: 'Analyste qui code' },
  { icon: TrendingUp, title: 'Sur mesure', subtitle: 'Pas de template recyclé' },
] as const

export default function Hero() {
  const prefersReduced = useReducedMotion()

  // Parallax discret de la photo : translateY négatif quand on scrolle.
  // Désactivé si l'utilisateur préfère réduire les animations.
  const { scrollY } = useScroll()
  const photoY = useTransform(scrollY, [0, 700], [0, prefersReduced ? 0 : -90])

  // Photo détourée (fond transparent) : avec le duotone, les cheveux/ombres
  // virent à l'encre et se fondent dans le fond. Fallback placeholder si absente.
  const [photoSrc, setPhotoSrc] = useState('/photo-mickael-nobg.png')

  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-ink"
    >
      {/* Duotone éditorial : désaturation puis remap ombres -> encre, lumières -> sable.
          Hors flux, invisible ; référencé par la classe .duotone (voir index.css). */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="duotone-mickael" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.059 0.957" />
              <feFuncG type="table" tableValues="0.106 0.922" />
              <feFuncB type="table" tableValues="0.176 0.851" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-12 pt-32 sm:px-8 lg:px-16 lg:pt-40 xl:px-24"
      >
        {/* Bloc principal : grille 12 colonnes en desktop */}
        <div className="grid flex-1 grid-cols-1 items-center gap-y-16 lg:grid-cols-12 lg:gap-x-8">
          {/* Colonne gauche (cols 1-6) : eyebrow, titre, sous-titre */}
          <div className="lg:col-span-6">
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.2em] text-gold"
            >
              Web Analyst Digital
            </motion.p>

            <motion.h1
              variants={lineContainer}
              className="font-fraunces mt-8 font-bold leading-[0.95] tracking-tight text-balance hyphens-auto text-sand"
              style={{ fontSize: 'clamp(2.5rem, 11vw, 9rem)' }}
            >
              {TITLE_LEAD_LINES.map((line) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span variants={lineReveal} className="block pb-[0.08em]">
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.08em]">
                  Faire <span className="italic">grandir</span>.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[500px] text-[1.125rem] leading-[1.6] text-sand/70"
            >
              Sites web sur mesure pour les marques qui veulent une vitrine premium
              et des résultats mesurables.
            </motion.p>

            {/* Mention localisation en mobile/tablette (la version rotée s'affiche a partir de xl) */}
            <motion.p
              variants={fadeUp}
              className="mt-8 text-xs uppercase tracking-[0.25em] text-gold/60 xl:hidden"
            >
              Bordeaux, France — 2026
            </motion.p>
          </div>

          {/* Colonne centrale (cols 7-10) : photo, element focal, parallax au scroll */}
          <div className="lg:col-span-4">
            <motion.figure
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
              style={{
                y: photoY,
                // Fond progressif des bords : la photo émerge du fond au lieu d'y être posée.
                WebkitMaskImage:
                  'radial-gradient(ellipse 90% 90% at center 40%, black 55%, transparent 100%)',
                maskImage:
                  'radial-gradient(ellipse 90% 90% at center 40%, black 55%, transparent 100%)',
              }}
              className="relative aspect-[4/5] w-full"
            >
              <img
                src={photoSrc}
                onError={() => setPhotoSrc('/photo-mickael.svg')}
                alt="Mickael, Web Analyst Digital"
                className="duotone h-full w-full object-cover object-[center_top]"
                loading="eager"
              />
            </motion.figure>
          </div>

          {/* Colonne droite (cols 11-12) : leviers + signature */}
          <div className="lg:col-span-2">
            <ul className="font-fraunces font-bold leading-[1.05] text-sand">
              {WORD_LIST.map((word) => (
                <li key={word} className="overflow-hidden">
                  <motion.span
                    variants={lineReveal}
                    className="block"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
                  >
                    {word}
                  </motion.span>
                </li>
              ))}
            </ul>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[280px] text-sm leading-[1.6] text-gold"
            >
              Trois leviers, une seule signature. Le site que vous obtenez est pensé,
              mesuré, optimisé.
            </motion.p>
          </div>
        </div>

        {/* Bas du hero : 2 cards pleine largeur */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map(({ icon: Icon, title, subtitle }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group flex items-start gap-4 rounded-[4px] border border-gold/30 p-6 transition-colors duration-300 hover:border-gold sm:p-8"
            >
              <Icon
                className="mt-1 h-6 w-6 shrink-0 text-gold"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div>
                <h3 className="font-fraunces text-lg font-semibold text-sand">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-sand/60">{subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mention localisation, rotee a la verticale sur le bord droit (desktop) */}
      <span
        className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-xs uppercase tracking-[0.25em] text-sand/40 xl:block"
      >
        Bordeaux, France — 2026
      </span>
    </section>
  )
}
