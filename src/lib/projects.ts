import { getCollection, type CollectionEntry } from 'astro:content'

type Section = CollectionEntry<'projects'>['data']['section']

/** Projets d'une section, triés par `order`. */
export async function getSection(section: Section) {
  const all = await getCollection('projects', (p) => p.data.section === section)
  return all.sort((a, b) => a.data.order - b.data.order)
}

/** Chemins statiques d'une section, chaque page connaissant le projet suivant (en boucle). */
export async function caseStudyPaths(section: Section) {
  const list = await getSection(section)
  return list.map((project, i) => ({
    params: { slug: project.id },
    props: { project, next: list[(i + 1) % list.length] },
  }))
}
