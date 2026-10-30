import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import data from '../../data/demos/beastly.json'
import { C, ChartCard, Chip, DataTable, Legend, SERIES, TipRow, Tooltip, fmt, fmt1, fmtCompact, useTip, useWidth } from './viz'

/**
 * Démo de l'agent de casting sur la base fictive du prototype (30 créateurs).
 * Le prototype simule les étapes ; ici la sélection est un filtre transparent
 * (niche + seuil d'engagement), annoncé comme tel.
 */
type Creator = (typeof data.creators)[number]

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube'] as const
const COLOR: Record<string, string> = Object.fromEntries(PLATFORMS.map((p, i) => [p, SERIES[i]]))
const NICHES = ['Toutes', ...[...new Set(data.creators.map((c) => c.niche))].sort((a, b) => a.localeCompare(b, 'fr'))]
const STEPS = ['Scan des profils', 'Scoring vs brief', 'Sélection'] as const

export default function BeastlyCasting() {
  const reduce = useReducedMotion()
  const [niche, setNiche] = useState('Toutes')
  const [minEng, setMinEng] = useState(5)
  const [phase, setPhase] = useState<-1 | 0 | 1 | 2 | 3>(-1)
  const timers = useRef<number[]>([])

  const pool = useMemo(() => data.creators.filter((c) => niche === 'Toutes' || c.niche === niche), [niche])
  const shortlist = useMemo(
    () => pool.filter((c) => c.engagement >= minEng).sort((a, b) => b.engagement - a.engagement),
    [pool, minEng],
  )
  const done = phase === 3

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function run() {
    timers.current.forEach(clearTimeout)
    if (reduce) return setPhase(3)
    setPhase(0)
    timers.current = [1, 2, 3].map((p) => window.setTimeout(() => setPhase(p as 1 | 2 | 3), p * 700))
  }

  // Changer le brief invalide le casting précédent.
  const reset = (fn: () => void) => {
    fn()
    setPhase(-1)
  }

  return (
    <div className="grid gap-5">
      <ChartCard
        title="Lancer un casting"
        subtitle="Choisissez une niche et un seuil d'engagement, puis lancez l'agent."
        source={`${data.source}. Dans le prototype, les étapes et les scores sont simulés.`}
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Niche du brief">
          {NICHES.map((n) => (
            <Chip key={n} active={n === niche} onClick={() => reset(() => setNiche(n))}>
              {n}
            </Chip>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <label htmlFor="eng" className="font-mono text-xs uppercase" style={{ color: C.muted }}>
            Engagement minimum
          </label>
          <input
            id="eng"
            type="range"
            min={2}
            max={11}
            step={0.5}
            value={minEng}
            onChange={(e) => reset(() => setMinEng(Number(e.target.value)))}
            className="h-11 w-56 accent-(--viz-accent)"
          />
          <output htmlFor="eng" className="font-mono text-sm">{fmt1(minEng)} %</output>
          <button
            type="button"
            onClick={run}
            className="ml-auto inline-flex min-h-11 items-center rounded-sm px-5 text-sm font-medium"
            style={{ background: C.accent, color: '#0f1b2d' }}
          >
            {done ? 'Relancer l’agent' : 'Lancer l’agent'}
          </button>
        </div>

        <ol className="mt-6 grid grid-cols-3 gap-2" aria-live="polite">
          {STEPS.map((s, i) => {
            const state = phase > i ? 'fait' : phase === i ? 'en cours' : 'en attente'
            return (
              <li
                key={s}
                className="rounded-sm border px-3 py-2.5 transition-colors"
                style={{
                  borderColor: state === 'en attente' ? C.grid : C.accent,
                  background: state === 'en cours' ? 'rgb(217 197 160 / 0.12)' : 'transparent',
                }}
              >
                <span className="font-mono text-[11px]" style={{ color: state === 'en attente' ? C.muted : C.accent }}>
                  {String(i + 1).padStart(2, '0')} · {state}
                </span>
                <span className="mt-1 block text-sm">{s}</span>
              </li>
            )
          })}
        </ol>
      </ChartCard>

      <ChartCard
        title="Audience et engagement des créateurs"
        subtitle={
          done
            ? `${shortlist.length} créateur${shortlist.length > 1 ? 's' : ''} retenu${shortlist.length > 1 ? 's' : ''} sur ${pool.length} : niche ${niche === 'Toutes' ? 'toutes' : niche}, engagement ≥ ${fmt1(minEng)} %.`
            : `${pool.length} profils dans le périmètre du brief. Lancez l'agent pour voir la sélection.`
        }
        source={data.source}
      >
        <Legend items={PLATFORMS.map((p) => ({ label: p, color: COLOR[p] }))} />
        <Scatter creators={data.creators} inPool={pool} selected={done ? shortlist : []} minEng={minEng} />
        <DataTable
          caption="Créateurs du prototype"
          head={['Créateur', 'Niche', 'Plateforme', 'Abonnés', 'Engagement', 'Retenu']}
          rows={pool.map((c) => [c.name, c.niche, c.platform, fmt(c.followers), `${fmt1(c.engagement)} %`, done && shortlist.includes(c) ? 'oui' : '—'])}
        />
      </ChartCard>
    </div>
  )
}

function Scatter({ creators, inPool, selected, minEng }: { creators: Creator[]; inPool: Creator[]; selected: Creator[]; minEng: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<Creator>()
  const h = 300
  const pad = { l: 40, r: 16, t: 14, b: 34 }
  // Abonnés sur échelle log : de 5 000 à 100 000.
  const [lo, hi] = [Math.log10(5000), Math.log10(100000)]
  const x = (f: number) => pad.l + ((Math.log10(f) - lo) / (hi - lo)) * (width - pad.l - pad.r)
  // Engagement de la base : 3,7 à 11,2 %, axe de 2 à 12 %.
  const y = (e: number) => pad.t + (1 - (e - 2) / 10) * (h - pad.t - pad.b)
  const xTicks = [5000, 10000, 20000, 50000, 100000]
  const yTicks = [2, 4, 6, 8, 10, 12]
  const hasSel = selected.length > 0

  return (
    <div ref={ref} className="relative mt-4" onPointerLeave={hide}>
      <svg width={width} height={h} role="img" aria-label="Nuage de points : abonnés en abscisse, taux d'engagement en ordonnée">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke={C.grid} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={C.muted}>{t} %</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={h - 12} textAnchor="middle" fontSize={11} fill={C.muted}>{fmtCompact(t)}</text>
        ))}
        <text x={width - pad.r} y={h} textAnchor="end" fontSize={11} fill={C.muted}>abonnés (échelle log)</text>
        {/* Seuil d'engagement du brief */}
        <line x1={pad.l} x2={width - pad.r} y1={y(minEng)} y2={y(minEng)} stroke={C.accent} strokeWidth={1} />
        <text x={pad.l + 4} y={y(minEng) - 6} fontSize={11} fill={C.text2}>seuil {fmt1(minEng)} %</text>
        {creators.map((c) => {
          const active = inPool.includes(c)
          const picked = selected.includes(c)
          const dim = !active || (hasSel && !picked)
          return (
            <g
              key={c.name}
              tabIndex={active ? 0 : -1}
              aria-label={`${c.name}, ${c.platform}, ${fmt(c.followers)} abonnés, ${fmt1(c.engagement)} % d'engagement`}
              onPointerMove={(e) => {
                const b = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(e.clientX - b.left, e.clientY - b.top, c)
              }}
              onFocus={() => show(x(c.followers), y(c.engagement), c)}
              onBlur={hide}
              className="outline-none"
            >
              <circle cx={x(c.followers)} cy={y(c.engagement)} r={12} fill="transparent" />
              <circle
                cx={x(c.followers)}
                cy={y(c.engagement)}
                r={picked ? 6 : 4.5}
                fill={COLOR[c.platform]}
                stroke={picked ? C.text : C.surface}
                strokeWidth={2}
                opacity={dim ? 0.25 : 1}
                style={{ transition: 'opacity .3s, r .3s' }}
              />
            </g>
          )
        })}
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.name}</p>
          <TipRow color={COLOR[tip.d.platform]} value={fmt(tip.d.followers)} label={`abonnés ${tip.d.platform}`} />
          <TipRow value={`${fmt1(tip.d.engagement)} %`} label="engagement" />
          <TipRow value={tip.d.niche} label={tip.d.location} />
        </Tooltip>
      )}
    </div>
  )
}
