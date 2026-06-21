import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { fadeUp, growX, lineContainer, lineReveal, staggerContainer } from '../lib/motion'

export default function Audit() {
  return (
    <section
      id="audit"
      className="flex min-h-[80vh] items-center bg-ink lg:min-h-[90vh]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-24 sm:px-8 lg:px-16 xl:px-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col items-center text-center"
        >
          {/* Ligne de cadrage haute */}
          <motion.span
            variants={growX}
            className="h-px w-full origin-center bg-gold/15"
            aria-hidden="true"
          />

          <motion.p
            variants={fadeUp}
            className="mt-12 text-xs uppercase tracking-[0.25em] text-gold"
          >
            Audit offert
          </motion.p>

          <motion.h2
            variants={lineContainer}
            className="font-fraunces mt-8 font-bold leading-[1.02] tracking-tight text-balance hyphens-auto text-sand"
            style={{ fontSize: 'clamp(2.25rem, 9vw, 7rem)' }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                Vous avez un site
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                qui <span className="italic">mérite mieux</span> ?
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-2xl text-[1.125rem] leading-[1.6] text-sand/70"
          >
            Premier audit gratuit en 30 minutes. J'identifie les leviers concrets
            d'amélioration sur votre site actuel : performance, conversion, tracking,
            expérience. Vous repartez avec un plan d'action clair, applicable, prioritisé.
          </motion.p>

          {/* Ligne de cadrage basse */}
          <motion.span
            variants={growX}
            className="mt-12 h-px w-full origin-center bg-gold/15"
            aria-hidden="true"
          />

          <motion.a
            variants={fadeUp}
            href="#contact"
            className="group mt-12 inline-flex items-center gap-2.5 rounded-[4px] bg-sand px-10 py-4 text-ink transition-colors duration-300 hover:bg-transparent hover:text-sand hover:ring-1 hover:ring-sand"
          >
            <span className="font-fraunces font-semibold">Demander mon audit</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </motion.a>

          <motion.p variants={fadeUp} className="mt-6 text-[13px] text-sand/40">
            Réponse sous 48h. Sans engagement.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
