import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { fadeUp, growX, lineContainer, lineReveal, staggerContainer } from '../lib/motion'

export default function TransitionSection() {
  return (
    <section className="overflow-hidden bg-ink">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8 lg:py-48"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs uppercase tracking-[0.25em] text-gold"
        >
          Portfolio
        </motion.p>

        {/* Titre flanqué de deux lignes fines qui se déploient à l'apparition */}
        <div className="mt-10 flex w-full items-center justify-center gap-6 lg:gap-12">
          <motion.span
            variants={growX}
            className="hidden h-px flex-1 origin-right bg-gold/30 md:block"
            aria-hidden="true"
          />
          <motion.h2
            variants={lineContainer}
            className="font-fraunces min-w-0 font-bold leading-[1.05] tracking-tight text-balance hyphens-auto text-sand"
            style={{ fontSize: 'clamp(2rem, 9vw, 8rem)' }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                Votre vitrine mérite
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                <span className="italic">plus qu'un site</span>.
              </motion.span>
            </span>
          </motion.h2>
          <motion.span
            variants={growX}
            className="hidden h-px flex-1 origin-left bg-gold/30 md:block"
            aria-hidden="true"
          />
        </div>

        <motion.p
          variants={fadeUp}
          className="mt-10 max-w-[600px] text-[1.125rem] leading-[1.6] text-sand/70"
        >
          Trois projets pensés comme des outils, pas comme des vitrines décoratives.
          Chaque ligne de code sert un objectif business.
        </motion.p>

        <motion.a
          variants={fadeUp}
          href="#realisations"
          className="group mt-12 inline-flex items-center gap-2.5 rounded-[4px] border border-gold/60 px-6 py-3 text-sm text-sand transition-colors duration-300 hover:bg-gold hover:text-ink"
        >
          Découvrir les réalisations
          <ArrowDown
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </motion.a>
      </motion.div>
    </section>
  )
}
