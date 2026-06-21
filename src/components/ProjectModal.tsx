import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Feather,
  Layers,
  Sparkles,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EASE } from '../lib/motion'
import type { Project } from '../data/projects'

/** Icônes décoratives cyclées sur les sous-sections de "Ma réponse". */
const APPROACH_ICONS: LucideIcon[] = [Layers, Sparkles, Compass, Feather]

/** Sélecteur des éléments focusables, pour le piège à focus (trap). */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const TITLE_ID = 'project-modal-title'

interface ProjectModalProps {
  project: Project
  previousProject?: Project
  nextProject?: Project
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function ProjectModal({
  project,
  previousProject,
  nextProject,
  onClose,
  onNext,
  onPrevious,
}: ProjectModalProps) {
  const reduce = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Sens de la transition entre projets : +1 vers le suivant, -1 vers le précédent.
  const [direction, setDirection] = useState(0)

  // Verrou du scroll de la page, focus initial sur le bouton fermer, et
  // restitution du focus à l'élément déclencheur (la card) à la fermeture.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      html.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [])

  // Échap pour fermer + piège à focus (Tab reste dans le modal).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Au changement de projet : retour en haut du contenu du modal.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [project.id, reduce])

  const goNext = () => {
    setDirection(1)
    onNext()
  }
  const goPrevious = () => {
    setDirection(-1)
    onPrevious()
  }

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -50 }),
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center">
      {/* Backdrop : ferme au clic */}
      <motion.div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteneur du modal */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        className="relative z-10 flex max-h-screen min-h-screen w-full flex-col overflow-hidden border-t border-gold/20 bg-ink sm:mt-[8vh] sm:max-h-[92vh] sm:min-h-0 sm:w-[calc(100%-3rem)] sm:max-w-4xl lg:max-w-6xl"
        initial={{ opacity: 0, y: reduce ? 0 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : 50, transition: { duration: 0.3, ease: 'easeIn' } }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Bouton fermer : reste fixe au-dessus du contenu qui défile */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le projet"
          className="absolute right-4 top-4 z-20 rounded-full bg-ink/40 p-3 text-sand backdrop-blur transition duration-300 hover:scale-110 hover:bg-ink/60 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-6 sm:top-6"
        >
          <X className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </button>

        {/* Zone scrollable */}
        <div ref={scrollRef} className="overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={project.id}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE }}
              className="px-6 py-12 sm:px-8 lg:px-16 lg:py-20"
            >
              {/* 1. Hero */}
              <header>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold">
                  {project.badge}
                </p>
                <h2
                  id={TITLE_ID}
                  className="font-fraunces mt-4 font-bold leading-[1.02] tracking-tight text-sand"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                >
                  {project.title}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-[1.6] text-sand/70">
                  {project.shortDescription}
                </p>

                <div className="mt-12 overflow-hidden rounded-[4px] border border-sand/10">
                  <video
                    className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
                    autoPlay={!reduce}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={`Aperçu vidéo du projet ${project.title}`}
                  >
                    <source src={project.videoSrc} type="video/mp4" />
                  </video>
                </div>

                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
                  <Meta label="Client" value={project.metadata.client} />
                  <Meta label="Année" value={project.metadata.year} />
                  <Meta label="Rôle" value={project.metadata.role} />
                  <Meta label="Stack" value={project.metadata.stack} />
                </dl>
              </header>

              {/* 2. Contexte */}
              <Section root={scrollRef} reduce={reduce} className="mt-24">
                <Eyebrow>Contexte</Eyebrow>
                <SectionTitle>{project.context.title}</SectionTitle>
                <div className="mt-6 max-w-3xl space-y-5">
                  {project.context.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-[1.7] text-sand/80"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Section>

              {/* 3. Défis */}
              <Section root={scrollRef} reduce={reduce} className="mt-24">
                <Eyebrow>Défis</Eyebrow>
                <SectionTitle>{project.challenges.title}</SectionTitle>
                <ol className="mt-8">
                  {project.challenges.items.map((item, index) => (
                    <li
                      key={item.title}
                      className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-gold/15 py-8 first:border-t-0 first:pt-0 sm:gap-x-8"
                    >
                      <span className="font-fraunces text-2xl italic text-gold sm:text-3xl">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-fraunces text-xl font-semibold text-sand">
                          {item.title}
                        </h4>
                        <p className="mt-2 leading-[1.6] text-sand/70">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* 4. Ma réponse */}
              <Section root={scrollRef} reduce={reduce} className="mt-24">
                <Eyebrow>Ma réponse</Eyebrow>
                <SectionTitle>{project.approach.title}</SectionTitle>
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  {project.approach.items.map((item, index) => {
                    const Icon = APPROACH_ICONS[index % APPROACH_ICONS.length]
                    return (
                      <div key={item.title}>
                        <Icon
                          className="h-6 w-6 text-gold"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <h4 className="font-fraunces mt-4 text-xl font-semibold text-sand">
                          {item.title}
                        </h4>
                        <p className="mt-2 leading-[1.6] text-sand/70">
                          {item.description}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Captures supplémentaires (affichées seulement si fournies) */}
                {project.detailImages && project.detailImages.length > 0 && (
                  <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {project.detailImages.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Détail du projet ${project.title}`}
                        loading="lazy"
                        className="w-full rounded-[4px] border border-sand/10"
                      />
                    ))}
                  </div>
                )}
              </Section>

              {/* 5. Résultat */}
              <Section root={scrollRef} reduce={reduce} className="mt-24">
                <Eyebrow>Résultat</Eyebrow>
                <SectionTitle>{project.outcome.title}</SectionTitle>
                <p className="mt-6 max-w-3xl text-base leading-[1.7] text-sand/80">
                  {project.outcome.paragraph}
                </p>
              </Section>

              {/* 6. CTAs + navigation entre projets */}
              <Section root={scrollRef} reduce={reduce} className="mt-24">
                <div className="grid gap-4 sm:grid-cols-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-fraunces inline-flex items-center justify-center gap-2 rounded-[4px] bg-sand px-8 py-4 text-base font-semibold text-ink transition-transform duration-300 hover:scale-[1.01]"
                  >
                    Voir le site live
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-fraunces inline-flex items-center justify-center gap-2 rounded-[4px] border border-sand px-8 py-4 text-base font-semibold text-sand transition-colors duration-300 hover:bg-sand/10"
                    >
                      Voir sur GitHub
                    </a>
                  )}
                </div>

                <div className="mt-12 border-t border-gold/20 pt-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      {previousProject && (
                        <button
                          type="button"
                          onClick={goPrevious}
                          className="group inline-flex flex-col items-start text-left transition-colors duration-300 hover:text-gold"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-sand/50">
                            <ArrowLeft
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
                              aria-hidden="true"
                            />
                            Projet précédent
                          </span>
                          <span className="font-fraunces mt-1.5 text-lg font-semibold text-sand">
                            {previousProject.title}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="sm:text-right">
                      {nextProject && (
                        <button
                          type="button"
                          onClick={goNext}
                          className="group inline-flex flex-col items-start text-left transition-colors duration-300 hover:text-gold sm:items-end sm:text-right"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-sand/50">
                            Projet suivant
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="font-fraunces mt-1.5 text-lg font-semibold text-sand">
                            {nextProject.title}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/** Une métadonnée du hero : label discret + valeur. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-sand/40">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-sand">{value}</dd>
    </div>
  )
}

/** Eyebrow doré commun à toutes les sections. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold">
      {children}
    </p>
  )
}

/** Titre de section Fraunces commun. */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3
      className="font-fraunces mt-4 font-bold leading-[1.1] tracking-tight text-sand"
      style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
    >
      {children}
    </h3>
  )
}

/** Section révélée au scroll (fade-up), observée dans le conteneur du modal. */
function Section({
  children,
  className,
  reduce,
  root,
}: {
  children: ReactNode
  className?: string
  reduce: boolean | null
  root: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <motion.section
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, root }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.section>
  )
}
