import { motion } from 'motion/react'
import { fadeUp, lineContainer, lineReveal, staggerContainer, staggerSlow } from '../lib/motion'

interface Levier {
  number: string
  title: string
  description: string
  tags: readonly string[]
}

const LEVIERS: readonly Levier[] = [
  {
    number: '01.',
    title: 'Concevoir',
    description:
      'Conception sur mesure, pensée pour votre marque et votre audience. Pas de template recyclé, pas de surcouche inutile. Chaque détail est intentionnel, chaque page sert votre objectif.',
    tags: ['Design', 'UX', 'React'],
  },
  {
    number: '02.',
    title: 'Construire',
    description:
      'Développement propre, performant, durable. Une stack moderne maîtrisée, un code lisible, un site qui charge vite et qui dure. Pas de dette technique cachée sous le tapis.',
    tags: ['TypeScript', 'Tailwind', 'Vite'],
  },
  {
    number: '03.',
    title: 'Faire grandir',
    description:
      'Mesure intégrée dès le premier jour pour comprendre ce qui fonctionne. Itérations basées sur la réalité de vos visiteurs, pas sur des intuitions. Le site évolue avec vos résultats.',
    tags: ['Analytics', 'CRO', 'Itérations'],
  },
]

export default function Approche() {
  return (
    <section id="approche" className="bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-16 lg:py-32 xl:px-24">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8"
        >
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.2em] text-gold"
            >
              Approche
            </motion.p>
            <motion.h2
              variants={lineContainer}
              className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-balance hyphens-auto text-sand"
              style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}
            >
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.08em]">
                  Une approche en <span className="italic">trois temps</span>.
                </motion.span>
              </span>
            </motion.h2>
          </div>
          <motion.p
            variants={fadeUp}
            className="max-w-xs text-sm leading-[1.6] text-sand/60 lg:col-span-3 lg:col-start-10 lg:self-end"
          >
            Trois leviers qui font la différence entre un site qui décore et un site
            qui performe.
          </motion.p>
        </motion.div>

        {/* Leviers empilés */}
        <div className="mt-16 lg:mt-24">
          {LEVIERS.map((levier) => (
            <motion.div
              key={levier.number}
              variants={staggerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-x-8 gap-y-5 border-t border-gold/20 py-10 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:py-16"
            >
              {/* Numéro */}
              <motion.span
                variants={fadeUp}
                className="font-fraunces italic text-gold lg:col-span-1"
                style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)' }}
                aria-hidden="true"
              >
                {levier.number}
              </motion.span>

              {/* Titre */}
              <motion.h3
                variants={fadeUp}
                className="font-fraunces font-bold leading-[1.05] tracking-tight text-sand lg:col-span-4"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
              >
                {levier.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                variants={fadeUp}
                className="text-[1.0625rem] leading-[1.7] text-sand/80 lg:col-span-5"
              >
                {levier.description}
              </motion.p>

              {/* Tags techniques */}
              <motion.ul
                variants={fadeUp}
                className="flex flex-wrap gap-2 lg:col-span-2"
              >
                {levier.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-gold/30 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-gold"
                  >
                    {tag}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
