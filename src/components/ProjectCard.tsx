import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { fadeUp } from '../lib/motion'
import type { Project } from '../data/projects'

/** Petit point coloré du badge, décliné par position dans la grille. */
const DOT_CLASSES = ['bg-water', 'bg-gold', 'bg-ink'] as const

export interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (id: string) => void
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReduced = useReducedMotion()
  const dotClass = DOT_CLASSES[index % DOT_CLASSES.length]
  const stack = project.metadata.stack.split(',').map((tech) => tech.trim())

  // La vidéo ne joue que lorsqu'elle entre dans la viewport (économie de bande
  // passante + perf). Pas d'autoplay si l'utilisateur préfère réduire les animations.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    if (prefersReduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().catch(() => undefined)
          } else {
            el.pause()
          }
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReduced])

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      onClick={() => onOpen(project.id)}
      aria-label={`Ouvrir le case study : ${project.title}`}
      className="group relative flex flex-col rounded-[4px] border border-ink/15 bg-[#EAE0CC] p-8 text-left transition-transform duration-300 hover:scale-[1.01] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-water"
    >
      {/* Flèche d'affordance : apparaît en haut à droite au survol */}
      <span
        className="absolute right-5 top-5 text-ink/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
      </span>

      {/* Badge */}
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.18em] text-ink/70">
          {project.badge}
        </span>
      </div>

      <h3 className="font-fraunces mt-5 text-2xl font-bold text-ink">{project.title}</h3>

      <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-ink/70">
        {project.shortDescription}
      </p>

      {/* Vidéo : démarrée par l'IntersectionObserver, jamais préchargée en entier */}
      <div className="mt-6 overflow-hidden rounded-[4px] border border-ink/15">
        <video
          ref={videoRef}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={`Aperçu vidéo du projet ${project.title}`}
        >
          <source src={project.videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Pied de card : stack + indicateur de case study (révélé au survol) */}
      <div className="mt-auto pt-6">
        <ul className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/70"
            >
              {tech}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Voir le case study
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}
