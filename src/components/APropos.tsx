import { motion } from 'motion/react'
import { fadeUp, lineContainer, lineReveal, staggerContainer } from '../lib/motion'

const NOW = [
  'Apprentissage Web Analyst chez Cultura',
  'M2 Data Marketing IA à Bordeaux',
  'Projets freelance en parallèle',
] as const

export default function APropos() {
  return (
    <section id="apropos" className="bg-sand text-ink">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto grid max-w-[1600px] grid-cols-1 gap-y-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-x-8 lg:px-16 lg:py-32 xl:px-24"
      >
        {/* Colonne gauche */}
        <div className="lg:col-span-7">
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.2em] text-water"
          >
            À propos
          </motion.p>

          <motion.h2
            variants={lineContainer}
            className="font-fraunces mt-6 font-bold leading-[1.05] tracking-tight text-balance hyphens-auto text-ink"
            style={{ fontSize: 'clamp(2rem, 6.5vw, 4.5rem)' }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                Concepteur de sites
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                <span className="italic">qui durent</span>.
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-[1.0625rem] leading-[1.7] text-ink/80"
          >
            Basé à Bordeaux, je conçois et développe des sites web sur mesure pour des
            marques qui veulent une vitrine premium et des résultats concrets. En
            parallèle de ma formation en Data Marketing, j'accompagne mes clients avec
            une approche complète : direction artistique, développement, et mesure de la
            performance une fois en ligne.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink/60"
          >
            <span>Bordeaux, France</span>
            <span aria-hidden="true">·</span>
            <span>Disponible en freelance</span>
            <span aria-hidden="true">·</span>
            <span>M2 Data Marketing IA</span>
          </motion.p>
        </div>

        {/* Colonne droite : card "En ce moment" */}
        <motion.aside
          variants={fadeUp}
          className="rounded-[4px] border border-ink/15 p-8 lg:col-span-4 lg:col-start-9 lg:self-start"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink/60">
            En ce moment
          </h3>
          <ul className="mt-6 space-y-5">
            {NOW.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[1.0625rem] text-ink">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                <span className="leading-[1.5]">{item}</span>
              </li>
            ))}
          </ul>
        </motion.aside>
      </motion.div>
    </section>
  )
}
