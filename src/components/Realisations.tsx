import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import { projects } from '../data/projects'
import {
  fadeUp,
  lineContainer,
  lineReveal,
  staggerCards,
  staggerContainer,
} from '../lib/motion'

export default function Realisations() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const activeIndex = projects.findIndex((p) => p.id === activeProjectId)
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null
  const previousProject = activeIndex > 0 ? projects[activeIndex - 1] : undefined
  const nextProject =
    activeIndex >= 0 && activeIndex < projects.length - 1
      ? projects[activeIndex + 1]
      : undefined

  const openProject = (id: string) => setActiveProjectId(id)
  const closeProject = () => setActiveProjectId(null)
  const goToNext = () => {
    if (nextProject) setActiveProjectId(nextProject.id)
  }
  const goToPrevious = () => {
    if (previousProject) setActiveProjectId(previousProject.id)
  }

  return (
    <section id="realisations" className="bg-sand text-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-16 lg:py-40 xl:px-24">
        {/* Header de section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8"
        >
          <div className="lg:col-span-6">
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.2em] text-ink"
            >
              Réalisations
            </motion.p>
            <motion.h2
              variants={lineContainer}
              className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-balance hyphens-auto text-ink"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
            >
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.08em]">
                  Réalisations &amp; <span className="italic">cas concrets</span>.
                </motion.span>
              </span>
            </motion.h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <motion.p
              variants={fadeUp}
              className="text-[1.125rem] leading-[1.6] text-ink/80"
            >
              Trois projets, trois angles différents. Sites vitrines premium,
              catalogues, features sur mesure. Chaque projet est pensé comme un outil
              de croissance, pas comme une carte de visite.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards projets */}
        <motion.div
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-24 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openProject}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal case study : monté à la demande, animé à l'ouverture/fermeture */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            previousProject={previousProject}
            nextProject={nextProject}
            onClose={closeProject}
            onNext={goToNext}
            onPrevious={goToPrevious}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
