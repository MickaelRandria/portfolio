import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * Une seule collection pour les Réalisations ET le Lab : le schéma est donc
 * strictement identique, ce qui garantit le gabarit de carte et de case study
 * unique. `section` décide seulement où le projet apparaît.
 *
 * Le corps MDX contient la partie « Ce que j'ai fait ». Le reste du gabarit
 * (contexte, résultat, stack, CTA) vient du frontmatter, pour que l'ordre des
 * sections ne puisse pas varier d'un projet à l'autre.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    section: z.enum(['realisations', 'lab']),
    /** Ordre d'affichage dans sa section. */
    order: z.number().int(),
    /** Typologie affichée en micro-label mono (ex. « Conformité RGPD & SEO local »). */
    typology: z.string(),
    client: z.string(),
    year: z.string(),
    /** Une ligne de valeur sous le titre. */
    value: z.string(),
    /** Le chiffre du projet, obligatoire (résultat ou livrable chiffré). */
    metric: z.string().min(1),
    /** Contexte : le problème du client, trois lignes maximum. */
    context: z.string(),
    /** Résultat, développé sous le chiffre. */
    result: z.string(),
    stack: z.array(z.string()).min(1),
    /** Niveau de maturité, affiché honnêtement (agent réel, simulé, prototype). */
    status: z.string().optional(),
    video: z.string().optional(),
    /** Étapes d'un agent, affichées en frise (projets agentiques). */
    pipeline: z.array(z.object({ label: z.string(), detail: z.string() })).optional(),
    liveUrl: z.url().optional(),
    githubUrl: z.url().optional(),
  }),
})

export const collections = { projects }
