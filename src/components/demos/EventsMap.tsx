import { useMemo, useState } from 'react'
import data from '../../data/demos/behind-the-song.json'
import france from '../../data/demos/france-map.json'
import { C, ChartCard, Chip, DataTable, Legend, SERIES, TipRow, Tooltip, fmt, useTip, useWidth } from './viz'

/**
 * Carte de la feature Behind the Song sur le jeu de démonstration du
 * prototype : événements géolocalisés, couleur par type, filtre par genre.
 * Même projection que le fond de carte (france-map.json).
 */
type Event = (typeof data.events)[number]

const TYPES = Object.keys(data.typeLabels) as (keyof typeof data.typeLabels)[]
const COLOR: Record<string, string> = Object.fromEntries(TYPES.map((t, i) => [t, SERIES[i]]))
const GENRES = [...new Set(data.events.map((e) => e.genre))] as (keyof typeof data.genreLabels)[]
const P = france.projection
const K = Math.cos((P.lat0 * Math.PI) / 180)
const project = (lat: number, lng: number) => [(lng - P.minLon) * K * P.scale, (P.maxLat - lat) * P.scale] as const

const frDay = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

export default function EventsMap() {
  const [genre, setGenre] = useState<string>('all')
  const events = useMemo(() => data.events.filter((e) => genre === 'all' || e.genre === genre), [genre])

  return (
    <ChartCard
      title="La carte, filtrée comme dans l'app"
      subtitle="Chaque point est un événement géolocalisé, coloré par type. Filtrez par genre."
      source={`${data.source}. Fond de carte : départements de France métropolitaine.`}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par genre">
        <Chip active={genre === 'all'} onClick={() => setGenre('all')}>
          Tous <span className="font-mono text-xs opacity-70">{data.events.length}</span>
        </Chip>
        {GENRES.map((g) => (
          <Chip key={g} active={g === genre} onClick={() => setGenre(g)}>
            {data.genreLabels[g]}
            <span className="font-mono text-xs opacity-70">{data.events.filter((e) => e.genre === g).length}</span>
          </Chip>
        ))}
      </div>

      <div className="mt-5">
        <Legend items={TYPES.map((t) => ({ label: data.typeLabels[t], color: COLOR[t] }))} />
        <Map events={events} />
      </div>

      <DataTable
        caption="Événements du jeu de démonstration"
        head={['Événement', 'Type', 'Genre', 'Lieu', 'Date', 'Prix']}
        rows={events.map((e) => [
          e.name,
          data.typeLabels[e.type as keyof typeof data.typeLabels],
          data.genreLabels[e.genre as keyof typeof data.genreLabels],
          `${e.venue}, ${e.city}`,
          frDay(e.date),
          e.price === null ? '—' : `${fmt(e.price)} €`,
        ])}
      />
    </ChartCard>
  )
}

/**
 * Écarte en couronne les événements trop proches pour être distingués
 * (même métropole) : chaque point reste visible et survolable.
 */
type Placed = { e: Event; cx: number; cy: number; anchor: readonly [number, number] | null }

function spread(events: Event[], minDist: number, radius: number): Placed[] {
  const pts = events.map((e) => ({ e, p: project(e.lat, e.lng) }))
  const groups: (typeof pts)[] = []
  for (const pt of pts) {
    const g = groups.find((gr) => Math.hypot(gr[0].p[0] - pt.p[0], gr[0].p[1] - pt.p[1]) < minDist)
    if (g) g.push(pt)
    else groups.push([pt])
  }
  return groups.flatMap((g): Placed[] =>
    g.length === 1
      ? [{ e: g[0].e, cx: g[0].p[0], cy: g[0].p[1], anchor: null }]
      : g.map((pt, i) => {
          const a = (i / g.length) * 2 * Math.PI - Math.PI / 2
          return { e: pt.e, cx: g[0].p[0] + radius * Math.cos(a), cy: g[0].p[1] + radius * Math.sin(a), anchor: g[0].p }
        }),
  )
}

function Map({ events }: { events: Event[] }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<Event>()
  const w = Math.min(width, 560)
  const s = w / france.width
  const h = france.height * s
  const placed = spread(events, 22 / s, 13 / s)

  return (
    <div ref={ref} className="relative mt-3 flex justify-center" onPointerLeave={hide}>
      <svg width={w} height={h} viewBox={`0 0 ${france.width} ${france.height}`} role="img" aria-label={`Carte de France : ${events.length} événements`}>
        <path d={france.d} fill="rgb(244 235 217 / 0.05)" stroke="rgb(244 235 217 / 0.18)" strokeWidth={1 / s} vectorEffect="non-scaling-stroke" />
        {placed.map(({ e, cx, cy, anchor }) => {
          return (
            <g
              key={e.name + e.date}
              tabIndex={0}
              aria-label={`${e.name}, ${e.venue}, ${e.city}, ${frDay(e.date)}`}
              onPointerMove={(ev) => {
                const b = (ev.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(ev.clientX - b.left + (width - w) / 2, ev.clientY - b.top, e)
              }}
              onFocus={() => show(cx * s + (width - w) / 2, cy * s, e)}
              onBlur={hide}
              className="outline-none"
            >
              {/* Trait vers la position réelle quand le point a été écarté */}
              {anchor && <line x1={anchor[0]} y1={anchor[1]} x2={cx} y2={cy} stroke={C.text2} strokeWidth={1 / s} />}
              <circle cx={cx} cy={cy} r={12 / s} fill="transparent" />
              <circle cx={cx} cy={cy} r={6 / s} fill={COLOR[e.type]} stroke={C.surface} strokeWidth={2 / s} />
            </g>
          )
        })}
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.name}</p>
          <TipRow color={COLOR[tip.d.type]} value={data.typeLabels[tip.d.type as keyof typeof data.typeLabels]} label={data.genreLabels[tip.d.genre as keyof typeof data.genreLabels]} />
          <TipRow value={tip.d.city} label={tip.d.venue} />
          <TipRow value={frDay(tip.d.date)} label={tip.d.price === null ? '' : `${fmt(tip.d.price)} €`} />
        </Tooltip>
      )}
    </div>
  )
}
