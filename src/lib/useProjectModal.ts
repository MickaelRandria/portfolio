import { useState } from 'react'
import type { Project } from '../data/projects'

/**
 * État du modal case study pour une liste de projets : projet actif, voisins
 * précédent/suivant (bornés à la liste, sans boucle) et actions associées.
 */
export function useProjectModal(list: Project[]) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const activeIndex = list.findIndex((p) => p.id === activeProjectId)
  const activeProject = activeIndex >= 0 ? list[activeIndex] : null
  const previousProject = activeIndex > 0 ? list[activeIndex - 1] : undefined
  const nextProject =
    activeIndex >= 0 && activeIndex < list.length - 1 ? list[activeIndex + 1] : undefined

  return {
    activeProject,
    previousProject,
    nextProject,
    openProject: (id: string) => setActiveProjectId(id),
    closeProject: () => setActiveProjectId(null),
    goToNext: () => {
      if (nextProject) setActiveProjectId(nextProject.id)
    },
    goToPrevious: () => {
      if (previousProject) setActiveProjectId(previousProject.id)
    },
  }
}
