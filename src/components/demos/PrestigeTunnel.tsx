import { useState } from 'react'
import { C, ChartCard } from './viz'

/**
 * Réplique du tunnel de qualification de prestigerent.pro : mêmes questions et
 * mêmes options que le formulaire en ligne (relevé le 30/10/2026). Démo sans
 * envoi : la dernière étape montre le lead structuré que reçoit l'activité.
 */
const QUESTIONS = [
  { id: 'bureaux', label: 'Nombre de bureaux', options: ['1 bureau', '2 bureaux', '3 à 4 bureaux', '5 bureaux et plus'] },
  { id: 'sanitaires', label: 'Le local dispose-t-il de sanitaires ?', options: ['WC uniquement', 'WC + Douche', 'Aucun sanitaire'] },
  { id: 'superficie', label: 'Superficie approximative', options: ['Moins de 30m²', '30 à 60m²', '60 à 100m²', 'Plus de 100m²'] },
  { id: 'delai', label: 'Dans quel délai souhaitez-vous commencer ?', options: ['Dès que possible', 'Dans 1 à 3 mois', 'Dans 3 à 6 mois', 'Je réfléchis encore'] },
] as const

type Answers = Partial<Record<(typeof QUESTIONS)[number]['id'], string>>

export default function PrestigeTunnel() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [answers, setAnswers] = useState<Answers>({})
  const complete = QUESTIONS.every((q) => answers[q.id])

  return (
    <ChartCard
      title="Le tunnel de qualification, en vrai"
      subtitle="Les questions et options exactes du formulaire en ligne. Démo sans envoi."
      source="Formulaire de prestigerent.pro, relevé le 30/10/2026"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm p-5 sm:p-6" style={{ background: '#f7f1e8', color: '#3b1f24' }}>
          <div className="mb-5 flex items-center gap-2 font-mono text-xs" aria-label={`Étape ${Math.min(step, 2)} sur 2`}>
            {[1, 2].map((n) => (
              <span
                key={n}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border"
                style={{ background: step >= n ? '#6b1f2a' : 'transparent', color: step >= n ? '#fff' : '#6b1f2a', borderColor: '#6b1f2a' }}
              >
                {n}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div>
              <p className="font-fraunces text-2xl font-semibold">Vous avez un local commercial à Bordeaux ?</p>
              <p className="mt-2 text-sm opacity-80">Répondez à quelques questions pour que nous étudiions votre bien.</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li>Loyer garanti versé chaque mois</li>
                <li>Zéro gestion de votre côté</li>
                <li>Premier échange gratuit et sans engagement</li>
              </ul>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-medium text-white"
                style={{ background: '#6b1f2a' }}
              >
                Commencer ma demande →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="font-fraunces text-2xl font-semibold">Votre bien</p>
              {QUESTIONS.map((q) => (
                <fieldset key={q.id}>
                  <legend className="mb-2 text-sm font-medium">{q.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const on = answers[q.id] === o
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                          className="min-h-11 rounded-full border px-3.5 text-sm"
                          style={{ background: on ? '#6b1f2a' : 'transparent', color: on ? '#fff' : '#3b1f24', borderColor: 'rgb(107 31 42 / 0.4)' }}
                        >
                          {o}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="min-h-11 text-sm">← Retour</button>
                <button
                  type="button"
                  disabled={!complete}
                  onClick={() => setStep(3)}
                  className="inline-flex min-h-11 items-center rounded-full px-6 text-sm font-medium text-white disabled:opacity-40"
                  style={{ background: '#6b1f2a' }}
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="font-fraunces text-2xl font-semibold">Presque terminé</p>
              <p className="mt-2 text-sm opacity-80">Notre équipe vous rappelle sous 24h.</p>
              <p className="mt-4 text-sm opacity-80">Nom complet, téléphone, email : dernière étape avant l'envoi (désactivée dans cette démo).</p>
              <button type="button" onClick={() => setStep(2)} className="mt-6 min-h-11 text-sm">← Retour</button>
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: C.muted }}>Ce que reçoit l'activité</p>
          <pre
            className="mt-2 overflow-x-auto rounded-sm border p-4 font-mono text-[13px] leading-[1.7]"
            style={{ borderColor: C.grid, background: '#0b1524' }}
            aria-live="polite"
          >
            {'{\n  "profil": "propriétaire",\n'}
            {QUESTIONS.map((q, i) => (
              <span key={q.id}>
                {'  '}
                <span style={{ color: C.accent }}>"{q.id}"</span>
                {': '}
                <span style={{ color: answers[q.id] ? C.text : C.muted }}>{answers[q.id] ? `"${answers[q.id]}"` : 'null'}</span>
                {i < QUESTIONS.length - 1 ? ',\n' : '\n'}
              </span>
            ))}
            {'}'}
          </pre>
          <p className="mt-3 text-sm leading-[1.6]" style={{ color: C.text2 }}>
            {complete
              ? 'Lead qualifié avant le premier appel : le bien est décrit, le délai connu. Chaque réponse peut devenir une dimension de suivi du tunnel.'
              : `${QUESTIONS.filter((q) => answers[q.id]).length} / ${QUESTIONS.length} réponses. Le bouton Continuer reste bloqué tant que le bien n'est pas décrit.`}
          </p>
        </div>
      </div>
    </ChartCard>
  )
}
