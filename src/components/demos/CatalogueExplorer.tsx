import { useMemo, useState } from 'react'
import data from '../../data/demos/petite-maille.json'
import { C, ChartCard, Chip, DataTable, Legend, StatTile, TipRow, Tooltip, fmt, useTip, useWidth } from './viz'

/**
 * Explorateur du catalogue réel de Petite Maille : mêmes filtres que le site,
 * distribution des prix, pièces reliées ou non à une annonce Vinted.
 * Pièce reliée = point plein, sans annonce = point creux (pas la couleur seule).
 */
type Item = (typeof data.items)[number]

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'accessoires', label: 'Accessoires' },
  { id: 'deco', label: 'Déco maison' },
] as const

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export default function CatalogueExplorer() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const items = useMemo(() => data.items.filter((i) => filter === 'all' || i.category === filter), [filter])
  const prices = items.map((i) => i.price)
  const linked = items.filter((i) => i.vinted).length

  return (
    <ChartCard
      title="Le catalogue, pièce par pièce"
      subtitle="Les filtres du site, appliqués aux 15 créations réelles. Chaque point est une pièce, à son prix."
      source={data.source}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer le catalogue">
        {FILTERS.map((f) => (
          <Chip key={f.id} active={f.id === filter} onClick={() => setFilter(f.id)}>
            {f.label}
            <span className="font-mono text-xs opacity-70">{data.items.filter((i) => f.id === 'all' || i.category === f.id).length}</span>
          </Chip>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Pièces" value={fmt(items.length)} />
        <StatTile label="Prix médian" value={`${fmt(median(prices))} €`} />
        <StatTile label="Fourchette" value={`${fmt(Math.min(...prices))} à ${fmt(Math.max(...prices))} €`} />
        <StatTile label="Reliées à Vinted" value={`${linked} / ${items.length}`} note="La vente se conclut sur Vinted" />
      </div>

      <div className="mt-6">
        <Legend
          items={[
            { label: 'Annonce Vinted liée', color: C.s1 },
            { label: 'Sans annonce liée', color: C.s1, shape: 'ring' },
          ]}
        />
        <PriceStrip items={items} />
      </div>

      <DataTable
        caption="Catalogue Petite Maille"
        head={['Pièce', 'Catégorie', 'Prix', 'Annonce Vinted']}
        rows={items.map((i) => [i.name, i.category === 'deco' ? 'Déco maison' : 'Accessoires', `${fmt(i.price)} €`, i.vinted ? 'oui' : 'non'])}
      />
    </ChartCard>
  )
}

/** Bande de prix : un point par pièce, empilé quand plusieurs pièces ont le même prix. */
function PriceStrip({ items }: { items: Item[] }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<Item>()
  const pad = { l: 8, r: 8 }
  const maxPrice = 40
  const x = (p: number) => pad.l + (p / maxPrice) * (width - pad.l - pad.r)
  const step = 20
  const counts = new Map<number, number>()
  const placed = [...items]
    .sort((a, b) => a.price - b.price)
    .map((it) => {
      const k = counts.get(it.price) ?? 0
      counts.set(it.price, k + 1)
      return { it, k }
    })
  const stackMax = Math.max(1, ...counts.values())
  const base = 24 + stackMax * step
  const h = base + 30

  return (
    <div ref={ref} className="relative mt-3" onPointerLeave={hide}>
      <svg width={width} height={h} role="img" aria-label="Distribution des prix des pièces du catalogue">
        <line x1={pad.l} x2={width - pad.r} y1={base} y2={base} stroke={C.grid} />
        {[0, 10, 20, 30, 40].map((t) => (
          <text key={t} x={x(t)} y={base + 20} textAnchor={t === 0 ? 'start' : t === maxPrice ? 'end' : 'middle'} fontSize={11} fill={C.muted}>
            {t} €
          </text>
        ))}
        {placed.map(({ it, k }) => {
          const cx = x(it.price)
          const cy = base - 12 - k * step
          return (
            <g
              key={it.name}
              tabIndex={0}
              aria-label={`${it.name}, ${fmt(it.price)} euros${it.vinted ? ', annonce Vinted liée' : ''}`}
              onPointerMove={(e) => {
                const b = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(e.clientX - b.left, e.clientY - b.top, it)
              }}
              onFocus={() => show(cx, cy, it)}
              onBlur={hide}
              className="outline-none"
            >
              <circle cx={cx} cy={cy} r={12} fill="transparent" />
              <circle cx={cx} cy={cy} r={6} fill={it.vinted ? C.s1 : C.surface} stroke={it.vinted ? C.surface : C.s1} strokeWidth={2} />
            </g>
          )
        })}
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.name}</p>
          <TipRow color={C.s1} value={`${fmt(tip.d.price)} €`} label={tip.d.category === 'deco' ? 'Déco maison' : 'Accessoire'} />
          <TipRow value={tip.d.vinted ? 'oui' : 'non'} label="annonce Vinted liée" />
        </Tooltip>
      )}
    </div>
  )
}
