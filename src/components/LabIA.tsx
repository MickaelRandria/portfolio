import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import LazyVideo from './LazyVideo'
import MediaPlaceholder from './MediaPlaceholder'
import PipelineSteps from './PipelineSteps'
import ProjectModal from './ProjectModal'
import { labProjects } from '../data/projects'
import type { Project } from '../data/projects'
import { useProjectModal } from '../lib/useProjectModal'
import {
  fadeUp,
  lineContainer,
  lineReveal,
  staggerCards,
  staggerContainer,
} from '../lib/motion'

/**
 * Lab IA & Data : projets agentiques et data, sur fond encre pour trancher
 * avec les réalisations clients (fond sable). Le premier projet de
 * `labProjects` est mis en vedette avec la frise de son pipeline ; les
 * suivants passent en cards secondaires.
 */
export default function LabIA() {
  const [featured, ...others] = labProjects
  const {
    activeProject,
    previousProject,
    nextProject,
    openProject,
    closeProject,
    goToNext,
    goToPrevious,
  } = useProjectModal(labProjects)

  return (
    <section id="lab" className="border-t border-gold/15 bg-ink text-sand">
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
              className="text-xs uppercase tracking-[0.2em] text-gold"
            >
              Lab IA &amp; Data
            </motion.p>
            <motion.h2
              variants={lineContainer}
              className="font-fraunces mt-6 font-bold leading-[1.02] tracking-tight text-balance hyphens-auto text-sand"
              style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
            >
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.08em]">
                  Des agents qui
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={lineReveal} className="block pb-[0.08em]">
                  <span className="italic">décident</span>.
                </motion.span>
              </span>
            </motion.h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <motion.p
              variants={fadeUp}
              className="text-[1.125rem] leading-[1.6] text-sand/70"
            >
              IA agentique, LLM et données live. Des outils qui lisent un contexte,
              enchaînent des décisions et restent honnêtes sur ce qu'ils savent
              vraiment. Chaque projet affiche son niveau de maturité.
            </motion.p>
          </div>
        </motion.div>

        {/* Projet vedette */}
        <motion.article
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 rounded-[4px] border border-gold/20 bg-sand/[0.02] p-6 sm:p-8 lg:mt-24 lg:p-12"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col lg:col-span-5">
              <BadgeRow project={featured} />
              <h3
                className="font-fraunces mt-6 font-bold leading-[1.05] tracking-tight text-sand"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                {featured.title}
              </h3>
              <p className="mt-5 text-[1.0625rem] leading-[1.65] text-sand/70">
                {featured.shortDescription}
              </p>
              <StackList stack={featured.metadata.stack} className="mt-8" />

              <div className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
                <button
                  type="button"
                  onClick={() => openProject(featured.id)}
                  className="group inline-flex items-center gap-2 rounded-[4px] bg-sand px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Voir le case study
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
                {featured.liveUrl && (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border border-gold/60 px-6 py-3 text-sm text-sand transition-colors duration-300 hover:bg-gold hover:text-ink"
                  >
                    {featured.liveLabel ?? 'Voir le site live'}
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <LabMedia project={featured} />
            </div>
          </div>

          {featured.pipeline && (
            <div className="mt-14 border-t border-gold/15 pt-10 lg:mt-16">
              <p className="text-xs uppercase tracking-[0.2em] text-sand/50">
                Pipeline de l'agent
              </p>
              <PipelineSteps steps={featured.pipeline} className="mt-10" />
            </div>
          )}
        </motion.article>

        {/* Projets secondaires */}
        <motion.div
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {others.map((project) => (
            <motion.button
              key={project.id}
              type="button"
              variants={fadeUp}
              onClick={() => openProject(project.id)}
              aria-label={`Ouvrir le case study : ${project.title}`}
              className="group relative flex flex-col rounded-[4px] border border-gold/20 bg-sand/[0.02] p-6 text-left transition-colors duration-300 hover:border-gold/45 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gold sm:p-8"
            >
              <span
                className="absolute right-5 top-5 text-sand/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <BadgeRow project={project} />
              <h3 className="font-fraunces mt-5 text-2xl font-bold text-sand">
                {project.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-sand/65">
                {project.shortDescription}
              </p>

              <div className="mt-6">
                <LabMedia project={project} />
              </div>

              <div className="mt-auto pt-6">
                <StackList stack={project.metadata.stack} />
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Voir le case study
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

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

/** Badge du projet + pastille de maturité (agent réel, simulé, prototype). */
function BadgeRow({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <span className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em] text-gold">
          {project.badge}
        </span>
      </span>
      {project.status && (
        <span className="rounded-full border border-sand/20 px-3 py-1 text-[11px] text-sand/60">
          {project.status}
        </span>
      )}
    </div>
  )
}

function StackList({ stack, className = '' }: { stack: string; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {stack.split(',').map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-sand/20 px-3 py-1 text-xs text-sand/65"
        >
          {tech.trim()}
        </li>
      ))}
    </ul>
  )
}

/** Vidéo d'aperçu si fournie, placeholder sinon (même ratio 16/10). */
function LabMedia({ project }: { project: Project }) {
  if (!project.videoSrc) {
    return (
      <MediaPlaceholder title={project.title} className="aspect-[16/10] rounded-[4px]" />
    )
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-sand/10">
      <LazyVideo
        src={project.videoSrc}
        label={`Aperçu vidéo du projet ${project.title}`}
        className="aspect-[16/10] w-full object-cover"
      />
    </div>
  )
}
