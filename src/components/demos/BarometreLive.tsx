import { useEffect, useState } from 'react'
import { C, ChartCard, Chip, DataTable, StatTile, TipRow, Tooltip, fmt, fmt1, fmtSigned, niceTicks, useTip, useWidth } from './viz'

/**
 * Démo live de Baromètre Data : les mêmes sources que l'agent, interrogées
 * depuis le navigateur du visiteur. Articles et règles repris du repo
 * (sectorMapping.js, trendsEngine.js) : 5 axes d'intention, 2 articles chacun,
 * moyenne 7 jours comparée à 90 jours, données arrêtées à J-2, statut live
 * seulement si 3 axes au moins ont des données.
 */
const AXES: { id: string; label: string; articles: string[] }[] = [
  { id: 'cocooning', label: 'Cocooning', articles: ['Raclette', 'Jeu_de_société'] },
  { id: 'sortie', label: 'Sortie', articles: ['Restaurant', 'Cinéma'] },
  { id: 'exterieur', label: 'Activité extérieure', articles: ['Randonnée', 'Pique-nique'] },
  { id: 'bien-etre', label: 'Bien-être', articles: ['Yoga', 'Méditation'] },
  { id: 'creatif', label: 'Loisirs créatifs', articles: ['Tricot', 'Poterie'] },
]

const CITIES = [
  { name: 'Bordeaux', lat: 44.8378, lon: -0.5792 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Lyon', lat: 45.764, lon: 4.8357 },
  { name: 'Marseille', lat: 43.2965, lon: 5.3698 },
  { name: 'Lille', lat: 50.6292, lon: 3.0573 },
]

// Codes météo WMO regroupés en libellés lisibles.
function weatherLabel(code: number) {
  if (code === 0) return 'Ciel dégagé'
  if (code <= 3) return 'Nuageux'
  if (code <= 48) return 'Brouillard'
  if (code <= 57) return 'Bruine'
  if (code <= 67) return 'Pluie'
  if (code <= 77) return 'Neige'
  if (code <= 82) return 'Averses'
  return 'Orage'
}

type Weather = { temp: number; feels: number; precip: number; code: number; wind: number; time: string }
type Axis = { id: string; label: string; days: { date: string; views: number }[]; avg7: number; avg90: number; momentum: number }

const ymd = (d: Date) => d.toISOString().slice(0, 10).replaceAll('-', '')
const frDate = (s: string) =>
  new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

async function fetchArticle(article: string, start: string, end: string) {
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.wikipedia/all-access/user/${encodeURIComponent(article)}/daily/${start}00/${end}00`
  const res = await fetch(url)
  if (!res.ok) throw new Error(String(res.status))
  const json = (await res.json()) as { items: { timestamp: string; views: number }[] }
  return json.items.map((i) => ({ date: i.timestamp.slice(0, 8), views: i.views }))
}

async function fetchAxes(): Promise<{ axes: Axis[]; through: string }> {
  // Données arrêtées à J-2 : délai de publication de Wikimedia, comme dans l'agent.
  const end = new Date(Date.now() - 2 * 86400000)
  const start = new Date(end.getTime() - 89 * 86400000)
  const [s, e] = [ymd(start), ymd(end)]
  const axes = await Promise.all(
    AXES.map(async (axis) => {
      const results = await Promise.allSettled(axis.articles.map((a) => fetchArticle(a, s, e)))
      const byDay = new Map<string, number>()
      for (const r of results) if (r.status === 'fulfilled') for (const d of r.value) byDay.set(d.date, (byDay.get(d.date) ?? 0) + d.views)
      const days = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, views]) => ({ date, views }))
      if (days.length < 14) return null
      const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
      const avg90 = mean(days.map((d) => d.views))
      const avg7 = mean(days.slice(-7).map((d) => d.views))
      return { id: axis.id, label: axis.label, days, avg7, avg90, momentum: (avg7 / avg90 - 1) * 100 }
    }),
  )
  return { axes: axes.filter((a): a is Axis => a !== null), through: e }
}

async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Europe%2FParis`
  const res = await fetch(url)
  if (!res.ok) throw new Error(String(res.status))
  const c = ((await res.json()) as { current: Record<string, number | string> }).current
  return {
    temp: Number(c.temperature_2m),
    feels: Number(c.apparent_temperature),
    precip: Number(c.precipitation),
    code: Number(c.weather_code),
    wind: Number(c.wind_speed_10m),
    time: String(c.time),
  }
}

export default function BarometreLive() {
  const [city, setCity] = useState(CITIES[0])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherErr, setWeatherErr] = useState(false)
  const [data, setData] = useState<{ axes: Axis[]; through: string } | null>(null)
  const [trendsErr, setTrendsErr] = useState(false)
  const [selected, setSelected] = useState('cocooning')

  useEffect(() => {
    let alive = true
    fetchAxes()
      .then((d) => alive && setData(d))
      .catch(() => alive && setTrendsErr(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    fetchWeather(city.lat, city.lon)
      .then((w) => {
        if (!alive) return
        setWeather(w)
        setWeatherErr(false)
      })
      .catch(() => alive && setWeatherErr(true))
    return () => {
      alive = false
    }
  }, [city])

  const live = (data?.axes.length ?? 0) >= 3
  const current = data?.axes.find((a) => a.id === selected) ?? data?.axes[0]

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ville pour la météo">
        <span className="mr-2 font-mono text-xs uppercase" style={{ color: C.muted }}>Ville</span>
        {CITIES.map((c) => (
          <Chip key={c.name} active={c.name === city.name} onClick={() => setCity(c)}>
            {c.name}
          </Chip>
        ))}
      </div>

      <ChartCard
        title={`Contexte météo · ${city.name}`}
        subtitle="Ce que l'agent lit au moment de l'analyse, récupéré à l'instant."
        source={weather ? `Open-Meteo, relevé du ${new Date(weather.time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}` : 'Open-Meteo'}
      >
        {weatherErr ? (
          <p className="text-sm" style={{ color: C.text2 }}>Open-Meteo ne répond pas pour l'instant : l'agent basculerait ici sur son estimation saisonnière, signalée comme telle.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4" style={{ opacity: weather ? 1 : 0.5 }}>
            <StatTile label="Température" value={weather ? `${fmt1(weather.temp)} °C` : '…'} note={weather ? `Ressenti ${fmt1(weather.feels)} °C` : undefined} />
            <StatTile label="Conditions" value={weather ? weatherLabel(weather.code) : '…'} />
            <StatTile label="Précipitations" value={weather ? `${fmt1(weather.precip)} mm` : '…'} />
            <StatTile label="Vent" value={weather ? `${fmt(weather.wind)} km/h` : '…'} />
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="Attention collective par axe d'intention"
        subtitle="Moyenne des 7 derniers jours comparée à la moyenne sur 90 jours, en pages vues Wikipédia. Cliquez un axe pour voir son détail."
        source={
          data
            ? `Wikimedia Pageviews, fr.wikipedia, 10 articles proxys, données arrêtées au ${frDate(data.through)} (J-2) · statut ${live ? 'live' : 'insuffisant : l’agent passerait en estimation saisonnière'}`
            : 'Wikimedia Pageviews'
        }
      >
        {trendsErr ? (
          <p className="text-sm" style={{ color: C.text2 }}>Wikimedia ne répond pas : l'agent afficherait une estimation saisonnière, jamais une donnée présentée comme live.</p>
        ) : !data ? (
          <p className="text-sm" style={{ color: C.text2 }}>Récupération des pages vues…</p>
        ) : (
          <>
            <MomentumBars axes={data.axes} selected={current?.id} onSelect={setSelected} />
            {current && <DailyLine axis={current} />}
            <DataTable
              caption="Dynamique par axe d'intention"
              head={['Axe', 'Moyenne 7 j', 'Moyenne 90 j', 'Écart']}
              rows={data.axes.map((a) => [a.label, fmt(a.avg7), fmt(a.avg90), fmtSigned(a.momentum)])}
            />
          </>
        )}
      </ChartCard>
    </div>
  )
}

/** Barres divergentes : au-dessus (orange) ou en dessous (bleu) de sa propre moyenne. */
function MomentumBars({ axes, selected, onSelect }: { axes: Axis[]; selected?: string; onSelect: (id: string) => void }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { tip, show, hide } = useTip<Axis>()
  const labelW = Math.min(150, width * 0.34)
  const plotW = width - labelW - 56
  const max = Math.max(10, ...axes.map((a) => Math.abs(a.momentum)))
  const ext = niceTicks(max, 2).at(-1) ?? max
  const x = (v: number) => labelW + 28 + ((v + ext) / (2 * ext)) * plotW
  const row = 40
  const h = axes.length * row + 24

  return (
    <div ref={ref} className="relative" onPointerLeave={hide}>
      <svg width={width} height={h} role="img" aria-label="Écart de chaque axe d'intention à sa moyenne sur 90 jours">
        {[-ext, 0, ext].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={0} y2={h - 20} stroke={t === 0 ? C.text2 : C.grid} strokeWidth={1} />
            <text x={x(t)} y={h - 4} textAnchor="middle" fontSize={11} fill={C.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {t === 0 ? 'moyenne 90 j' : fmtSigned(t)}
            </text>
          </g>
        ))}
        {axes.map((a, i) => {
          const y = i * row + 8
          const v = a.momentum
          const x0 = x(0)
          const x1 = x(Math.max(-ext, Math.min(ext, v)))
          const left = Math.min(x0, x1)
          const w = Math.max(2, Math.abs(x1 - x0))
          const r = Math.min(4, w)
          // Bout arrondi côté donnée, carré côté ligne de base.
          const d =
            v >= 0
              ? `M${left} ${y}h${w - r}a${r} ${r} 0 0 1 ${r} ${r}v${20 - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - r)}z`
              : `M${left + w} ${y}h${-(w - r)}a${r} ${r} 0 0 0 ${-r} ${r}v${20 - 2 * r}a${r} ${r} 0 0 0 ${r} ${r}h${w - r}z`
          const active = a.id === selected
          return (
            <g
              key={a.id}
              tabIndex={0}
              role="button"
              aria-pressed={active}
              aria-label={`${a.label} : ${fmtSigned(v)} par rapport à sa moyenne sur 90 jours`}
              onClick={() => onSelect(a.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(a.id))}
              onPointerMove={(e) => {
                const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
                show(e.clientX - box.left, e.clientY - box.top, a)
              }}
              onFocus={() => show(x1, y, a)}
              onBlur={hide}
              className="cursor-pointer outline-none"
            >
              <rect x={0} y={y - 8} width={width} height={row} fill={active ? 'rgb(244 235 217 / 0.06)' : 'transparent'} />
              <text x={0} y={y + 14} fontSize={13} fill={active ? C.text : C.text2} fontWeight={active ? 600 : 400}>
                {a.label}
              </text>
              <path d={d} fill={v >= 0 ? C.s2 : C.s1} />
              <text
                x={v >= 0 ? x1 + 6 : x1 - 6}
                y={y + 14}
                textAnchor={v >= 0 ? 'start' : 'end'}
                fontSize={12}
                fill={C.text}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmtSigned(v)}
              </text>
            </g>
          )
        })}
      </svg>
      {tip && (
        <Tooltip x={tip.x} y={tip.y} width={width}>
          <p className="mb-1 font-medium">{tip.d.label}</p>
          <TipRow value={fmtSigned(tip.d.momentum)} label="vs moyenne 90 j" />
          <TipRow value={fmt(tip.d.avg7)} label="vues / jour, 7 j" />
          <TipRow value={fmt(tip.d.avg90)} label="vues / jour, 90 j" />
        </Tooltip>
      )}
    </div>
  )
}

/** Détail jour par jour de l'axe sélectionné, avec réticule. */
function DailyLine({ axis }: { axis: Axis }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const h = 220
  const pad = { l: 44, r: 12, t: 16, b: 26 }
  const days = axis.days
  const max = Math.max(...days.map((d) => d.views))
  const ticks = niceTicks(max, 3)
  const top = ticks.at(-1) ?? max
  const x = (i: number) => pad.l + (i / (days.length - 1)) * (width - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - v / top) * (h - pad.t - pad.b)
  const line = days.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.views).toFixed(1)}`).join('')
  const area = `${line}L${x(days.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z`
  const last7 = x(days.length - 7)

  return (
    <div ref={ref} className="relative mt-6 border-t pt-5" style={{ borderColor: C.grid }}>
      <p className="mb-2 text-sm font-medium">
        {axis.label} <span style={{ color: C.text2 }}>· pages vues quotidiennes sur 90 jours</span>
      </p>
      <svg
        width={width}
        height={h}
        role="img"
        aria-label={`Pages vues quotidiennes de l'axe ${axis.label} sur 90 jours`}
        onPointerMove={(e) => {
          const bx = e.currentTarget.getBoundingClientRect()
          const i = Math.round(((e.clientX - bx.left - pad.l) / (width - pad.l - pad.r)) * (days.length - 1))
          setHover(Math.max(0, Math.min(days.length - 1, i)))
        }}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke={C.grid} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={C.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmt(t)}
            </text>
          </g>
        ))}
        {/* Fenêtre des 7 derniers jours, celle qu'utilise l'agent */}
        <rect x={last7} y={pad.t} width={width - pad.r - last7} height={h - pad.t - pad.b} fill={C.accent} opacity={0.1} />
        <text x={width - pad.r - 4} y={pad.t + 12} textAnchor="end" fontSize={11} fill={C.text2}>7 j</text>
        <path d={area} fill={C.s1} opacity={0.1} />
        <path d={line} fill="none" stroke={C.s1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <line x1={pad.l} x2={width - pad.r} y1={y(axis.avg90)} y2={y(axis.avg90)} stroke={C.text2} strokeWidth={1} />
        <text x={pad.l + 4} y={y(axis.avg90) - 6} fontSize={11} fill={C.text2}>moyenne 90 j · {fmt(axis.avg90)}</text>
        {[0, Math.floor(days.length / 2), days.length - 1].map((i) => (
          <text key={i} x={x(i)} y={h - 6} textAnchor={i === 0 ? 'start' : i === days.length - 1 ? 'end' : 'middle'} fontSize={11} fill={C.muted}>
            {frDate(days[i].date)}
          </text>
        ))}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={h - pad.b} stroke={C.text2} />
            <circle cx={x(hover)} cy={y(days[hover].views)} r={4} fill={C.s1} stroke={C.surface} strokeWidth={2} />
          </g>
        )}
      </svg>
      {hover !== null && (
        <Tooltip x={x(hover)} y={y(days[hover].views)} width={width}>
          <p className="mb-1" style={{ color: C.text2 }}>{frDate(days[hover].date)}</p>
          <TipRow color={C.s1} value={fmt(days[hover].views)} label="pages vues" />
        </Tooltip>
      )}
    </div>
  )
}
