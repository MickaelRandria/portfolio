import type { Project } from '../data/projects'

interface PipelineStepsProps {
  steps: NonNullable<Project['pipeline']>
  className?: string
}

/**
 * Frise des étapes d'un agent : un filet doré continu ponctué d'un point par
 * étape. 2 colonnes en mobile, 4 en desktop (soit deux rangées pour 8 étapes).
 * Purement présentationnelle : l'animation d'entrée est laissée au parent.
 */
export default function PipelineSteps({ steps, className = '' }: PipelineStepsProps) {
  return (
    <ol className={`grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 ${className}`}>
      {steps.map((step, index) => (
        <li key={step.label} className="relative border-t border-gold/30 pt-6">
          <span
            className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full bg-gold"
            aria-hidden="true"
          />
          <span className="font-fraunces text-sm italic text-gold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="font-fraunces mt-2 text-lg font-semibold text-sand">{step.label}</p>
          <p className="mt-1.5 text-sm leading-[1.55] text-sand/60">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}
