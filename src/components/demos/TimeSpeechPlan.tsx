import { useState } from 'react'
import data from '../../data/demos/timespeech.json'
import { C, ChartCard, Chip, DataTable, Legend, StatTile, TipRow, Tooltip, useTip, useWidth } from './viz'

/**
 * Démo de l'optimisation de durée de TimeSpeech, sur le plan minuté du
 * prototype : avant (132 min) et après (118 min) pour un créneau de 2h00.
 */
type Section = (typeof data.sections)[number]
type Mode = 'before' | 'after'

const hm = (min: number) => `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`

export default function TimeSpeechPlan() {
  const [mode, setMode] = useState<Mode>('before')
  const total = (m: Mode) => data.sections.reduce((a, s) => a + s[m], 0)
  const over = total(mode) - data.targetMinutes

  return (
    <ChartCard
      title="Faire tenir le cours dans son créneau"
      subtitle="Chaque bloc est une section du cours, à sa durée estimée. La ligne marque le créneau de 2h00."
      source={data.source}
    >
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Version du plan">
        <Chip active={mode === 'before'} onClick={() => setMode('before')}>Plan généré</Chip>
        <Chip active={mode === 'after'} onClick={() => setMode('after')}>Plan optimisé</Chip>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Durée estimée" value={hm(total(mode))} />
        <StatTile label="Créneau" value={hm(data.targetMinutes)} />
        <StatTile
          label={over > 0 ? 'Dépassement' : 'Marge'}
          value={over > 0 ? `+${over} min` : `${-over} min`}
          note={over > 0 ? 'Le cours ne tient pas.' : 'Le cours tient dans le créneau.'}
        />
      </div>

      <div className="mt-6">
        <Legend
          items={[
            { label: 'Dans le créneau', color: C.s1, shape: 'rect' },
            { label: 'Au-delà de 2h00', color: C.s2, shape: 'rect' },
          ]}
        />
        <Timeline sections={data.sections} mode={mode} target={data.targetMinutes} />
      </div>

      <DataTable
        caption="Durée par section, avant et après optimisation"
        head={['Section', 'Plan généré', 'Plan optimisé', 'Écart']}
        rows={[
          ...data.sections.map((s) => [s.title, `${s.before} min`, `${s.after} min`, s.after === s.before ? '—' : `${s.after - s.before} min`]),
          ['Total', `${total('before')} min`, `${total('after')} min`, `${total('after') - total('before')} min`],
        ]}
      />
    </ChartCard>
  )
}

function Timeline({ sections, mode, target }: { sections: Section[]; mode: Mode; target: number }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<Section>()
  const scaleMax = 140
  const h = 96
  const barY = 22
  const barH = 24
  const gap = 2
  const x = (min: number) => (min / scaleMax) * width

  // Début de chaque section = somme des durées qui la précèdent.
  const blocks = sections.map((s, i) => {
    const start = sections.slice(0, i).reduce((a, p) => a + p[mode], 0)
    return { s, start, end: start + s[mode] }
  })

  return (
    <div ref={ref} className="relative mt-3" onPointerLeave={hide}>
      <svg width={width} height={h} role="img" aria-label={`Frise du plan ${mode === 'before' ? 'généré' : 'optimisé'} face au créneau de 2h00`}>
        {[0, 30, 60, 90, 120].map((t) => (
          <text key={t} x={x(t)} y={h - 8} textAnchor={t === 0 ? 'start' : 'middle'} fontSize={11} fill={C.muted}>
            {t === 0 ? '0' : hm(t)}
          </text>
        ))}
        {blocks.map(({ s, start, end }, i) => {
          // Un bloc qui franchit 2h00 est scindé : la part en dépassement passe en orange.
          const parts =
            end <= target
              ? [{ a: start, b: end, color: C.s1 }]
              : start >= target
                ? [{ a: start, b: end, color: C.s2 }]
                : [
                    { a: start, b: target, color: C.s1 },
                    { a: target, b: end, color: C.s2 },
                  ]
          const x0 = x(start) + (i ? gap / 2 : 0)
          const x1 = x(end) - (i < blocks.length - 1 ? gap / 2 : 0)
          return (
            <g
              key={s.title}
              tabIndex={0}
              aria-label={`${s.title} : ${s[mode]} minutes`}
              onPointerMove={(e) => {
                const b = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(e.clientX - b.left, e.clientY - b.top, s)
              }}
              onFocus={() => show(x0, barY, s)}
              onBlur={hide}
              className="outline-none"
            >
              {parts.map((p, j) => (
                <rect
                  key={j}
                  x={Math.max(x0, x(p.a))}
                  y={barY}
                  width={Math.max(0, Math.min(x1, x(p.b)) - Math.max(x0, x(p.a)))}
                  height={barH}
                  rx={2}
                  fill={p.color}
                  style={{ transition: 'x .5s ease, width .5s ease' }}
                />
              ))}
              {(() => {
                // Étiquette centrée sur la part qui a la place, sans chevaucher la ligne du créneau.
                const inA = Math.max(x0, Math.min(x1, x(Math.min(end, target))))
                const [la, lb] = inA - x0 >= x1 - inA ? [x0, inA] : [inA, x1]
                return lb - la > 44 ? (
                  <text x={(la + lb) / 2} y={barY + 16} textAnchor="middle" fontSize={11} fill="#ffffff" pointerEvents="none">
                    {s[mode]} min
                  </text>
                ) : null
              })()}
            </g>
          )
        })}
        <line x1={x(target)} x2={x(target)} y1={8} y2={barY + barH + 10} stroke={C.text} strokeWidth={1} />
        <text x={x(target) + 6} y={14} fontSize={11} fill={C.text2}>créneau 2h00</text>
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.title}</p>
          <TipRow color={C.s1} value={`${tip.d[mode]} min`} label={mode === 'before' ? 'plan généré' : 'plan optimisé'} />
          {tip.d.before !== tip.d.after && <TipRow value={`${tip.d.before} → ${tip.d.after} min`} label="après optimisation" />}
        </Tooltip>
      )}
    </div>
  )
}
