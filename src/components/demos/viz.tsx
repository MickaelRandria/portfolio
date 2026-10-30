/**
 * Socle commun des démos dataviz : tokens, formats français, info-bulle,
 * carte de graphique et tableau de données (accès sans survol).
 * Les couleurs sont lues depuis les variables CSS `.viz` (global.css).
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Largeur réelle d'un conteneur, pour des SVG au pixel près (pas d'étirement de trait). */
// Largeur provisoire avant mesure : étroite, pour ne jamais déborder sur mobile.
export function useWidth<T extends HTMLElement>(fallback = 300) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export const C = {
  s1: 'var(--viz-1)',
  s2: 'var(--viz-2)',
  s3: 'var(--viz-3)',
  accent: 'var(--viz-accent)',
  grid: 'var(--viz-grid)',
  text: 'var(--viz-text)',
  text2: 'var(--viz-text-2)',
  muted: 'var(--viz-muted)',
  surface: 'var(--viz-surface)',
}

/** Couleurs catégorielles dans l'ordre fixe : la couleur suit l'entité, jamais le rang. */
export const SERIES = [C.s1, C.s2, C.s3] as const

const nf = new Intl.NumberFormat('fr-FR')
const nf1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })
export const fmt = (n: number) => nf.format(Math.round(n))
export const fmt1 = (n: number) => nf1.format(n)
export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
export const fmtKo = (bytes: number) => `${fmt(bytes / 1024)} Ko`
export const fmtSigned = (n: number) => `${n > 0 ? '+' : ''}${fmt1(n)} %`

/** Graduations « propres » entre 0 et max. */
export function niceTicks(max: number, count = 4) {
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw || 1))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

/** État d'info-bulle partagé : position relative au conteneur du graphique. */
export function useTip<T>() {
  const [tip, setTip] = useState<{ x: number; y: number; d: T } | null>(null)
  return { tip, show: (x: number, y: number, d: T) => setTip({ x, y, d }), hide: () => setTip(null) }
}

export function Tooltip({ x, y, children, width }: { x: number; y: number; children: ReactNode; width: number }) {
  // Reste dans le cadre : bascule à gauche du pointeur près du bord droit.
  const flip = x > width - 200
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-36 rounded-sm border px-3 py-2 text-xs shadow-lg"
      style={{
        left: flip ? undefined : x + 14,
        right: flip ? width - x + 14 : undefined,
        top: Math.max(0, y - 12),
        background: '#0b1524',
        borderColor: 'rgb(217 197 160 / 0.3)',
        color: C.text,
      }}
    >
      {children}
    </div>
  )
}

/** Ligne d'info-bulle : la valeur en premier, le libellé ensuite, clé en trait. */
export function TipRow({ color, value, label }: { color?: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      {color && <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />}
      <span className="font-mono font-medium">{value}</span>
      <span style={{ color: C.text2 }}>{label}</span>
    </div>
  )
}

export function Legend({ items }: { items: { label: string; color: string; shape?: 'dot' | 'ring' | 'rect' | 'line' }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: C.text2 }}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={it.shape === 'line' ? 'h-0.5 w-4 rounded-full' : it.shape === 'rect' ? 'h-2.5 w-2.5 rounded-xs' : 'h-2.5 w-2.5 rounded-full'}
            style={it.shape === 'ring' ? { border: `2px solid ${it.color}` } : { background: it.color }}
          />
          {it.label}
        </li>
      ))}
    </ul>
  )
}

/** Tableau de données repliable : chaque valeur reste lisible sans survol. */
export function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-4 text-xs" style={{ color: C.text2 }}>
      <summary className="inline-flex min-h-11 cursor-pointer items-center font-mono uppercase tracking-[0.06em] hover:text-[var(--viz-text)]">
        Voir les données
      </summary>
      <div className="mt-2 max-h-72 overflow-auto rounded-sm border" style={{ borderColor: C.grid }}>
        <table className="w-full text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="sticky top-0 px-3 py-2 font-mono font-normal" style={{ background: '#0b1524' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: C.grid }}>
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

/** Carte d'un graphique : titre, sous-titre, contenu, source. */
export function ChartCard({
  title,
  subtitle,
  source,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  source: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={`viz rounded-sm border p-5 sm:p-6 ${className}`} style={{ background: C.surface, borderColor: 'rgb(217 197 160 / 0.2)' }}>
      <h3 className="font-fraunces text-xl font-semibold leading-tight">{title}</h3>
      {subtitle && <p className="mt-1 text-sm" style={{ color: C.text2 }}>{subtitle}</p>}
      <div className="mt-5">{children}</div>
      <figcaption className="mt-4 font-mono text-[11px] leading-[1.5]" style={{ color: C.muted }}>
        Source : {source}
      </figcaption>
    </figure>
  )
}

/** Tuile chiffre : libellé, valeur, précision. */
export function StatTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-sm border p-4" style={{ borderColor: C.grid }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: C.muted }}>{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {note && <p className="mt-1 text-xs" style={{ color: C.text2 }}>{note}</p>}
    </div>
  )
}

/** Bouton-pastille de filtre (état pressé lisible au lecteur d'écran). */
export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors"
      style={
        active
          ? { background: C.text, color: '#0f1b2d', borderColor: C.text }
          : { borderColor: 'rgb(244 235 217 / 0.3)', color: C.text }
      }
    >
      {children}
    </button>
  )
}
