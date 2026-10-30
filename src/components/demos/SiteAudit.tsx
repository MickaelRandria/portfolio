import { C, ChartCard, DataTable, StatTile, TipRow, Tooltip, fmt, fmtKo, useTip, useWidth } from './viz'

/**
 * Audit mesuré d'un site livré (Playwright, page d'accueil) : poids par type
 * de ressource, requêtes, cookies, domaines tiers. Valeurs du JSON de mesure.
 */
export type Audit = {
  source: string
  url: string
  measuredAt: string
  totalBytes: number
  requests: number
  byType: Record<string, number>
  thirdParty: string[]
  cookies: number
}

const frDay = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function SiteAudit({ audit, note }: { audit: Audit; note?: string }) {
  const rows = Object.entries(audit.byType)
    .map(([type, bytes]) => ({ type, bytes, share: bytes / audit.totalBytes }))
    .sort((a, b) => b.bytes - a.bytes)

  return (
    <ChartCard
      title="Ce que charge le site, mesuré"
      subtitle={note ?? 'Page d’accueil chargée dans un navigateur réel, sans consentement donné.'}
      source={`${audit.source}, ${audit.url}, le ${frDay(audit.measuredAt)}`}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Poids total" value={fmtKo(audit.totalBytes)} />
        <StatTile label="Requêtes" value={fmt(audit.requests)} />
        <StatTile label="Cookies déposés" value={fmt(audit.cookies)} note={audit.cookies === 0 ? 'Rien à soumettre au consentement' : undefined} />
        <StatTile label="Domaines tiers" value={fmt(audit.thirdParty.length)} />
      </div>

      <p className="mt-6 text-sm font-medium">
        Poids par type de ressource <span style={{ color: C.text2 }}>· en Ko transférés</span>
      </p>
      <Bars rows={rows} />

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: C.muted }}>
        Domaines tiers contactés
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {audit.thirdParty.map((h) => (
          <li key={h} className="rounded-sm border px-2.5 py-1 font-mono text-xs" style={{ borderColor: C.grid }}>
            {h}
          </li>
        ))}
      </ul>

      <DataTable
        caption="Poids par type de ressource"
        head={['Type', 'Ko', 'Part']}
        rows={rows.map((r) => [r.type, fmt(r.bytes / 1024), `${fmt(r.share * 100)} %`])}
      />
    </ChartCard>
  )
}

function Bars({ rows }: { rows: { type: string; bytes: number; share: number }[] }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<(typeof rows)[number]>()
  const labelW = 96
  const valueW = 92
  const row = 34
  const max = rows[0]?.bytes ?? 1
  const plot = Math.max(40, width - labelW - valueW)
  const h = rows.length * row

  return (
    <div ref={ref} className="relative mt-3" onPointerLeave={hide}>
      <svg width={width} height={h} role="img" aria-label="Poids transféré par type de ressource">
        {rows.map((r, i) => {
          const y = i * row + 5
          const w = Math.max(3, (r.bytes / max) * plot)
          const rr = Math.min(4, w)
          return (
            <g
              key={r.type}
              tabIndex={0}
              aria-label={`${r.type} : ${fmtKo(r.bytes)}, ${fmt(r.share * 100)} % du poids`}
              onPointerMove={(e) => {
                const b = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(e.clientX - b.left, e.clientY - b.top, r)
              }}
              onFocus={() => show(labelW + w, y, r)}
              onBlur={hide}
              className="outline-none"
            >
              <rect x={0} y={y - 5} width={width} height={row} fill="transparent" />
              <text x={0} y={y + 16} fontSize={13} fill={C.text2}>{r.type}</text>
              <path
                d={`M${labelW} ${y}h${w - rr}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${22 - 2 * rr}a${rr} ${rr} 0 0 1 ${-rr} ${rr}h${-(w - rr)}z`}
                fill={C.s1}
              />
              <text x={labelW + w + 8} y={y + 16} fontSize={12} fill={C.text} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtKo(r.bytes)} · {fmt(r.share * 100)} %
              </text>
            </g>
          )
        })}
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.type}</p>
          <TipRow color={C.s1} value={fmtKo(tip.d.bytes)} label="transférés" />
          <TipRow value={`${fmt(tip.d.share * 100)} %`} label="du poids de la page" />
        </Tooltip>
      )}
    </div>
  )
}
