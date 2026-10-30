import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { EASE } from '../lib/motion'
import { EMAIL } from '../lib/site'

/**
 * Formulaire multi-étapes (îlot React de /contact), repris du site Vite :
 * même endpoint Formspree, mêmes 3 étapes, choix réalignés sur les 3 offres.
 */
type Step = 1 | 2 | 3
type ProjectType = 'site' | 'audit-tracking' | 'agent' | 'echange'
type Status = 'idle' | 'sending' | 'success' | 'error'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbdenpdy'

const LABEL_CLASS = 'block font-mono text-[11px] uppercase tracking-[0.08em] text-ink/65'
const FIELD_CLASS =
  'w-full border-b border-ink/30 bg-transparent px-2 py-3 text-ink transition-colors placeholder:text-ink/40 focus:border-ink focus:outline-none'
const FILLED_BTN =
  'inline-flex min-h-12 items-center gap-2 rounded-sm bg-ink px-8 font-semibold text-sand transition-transform duration-300 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transform-none'
const GHOST_BTN =
  'inline-flex min-h-12 items-center gap-2 px-2 font-semibold text-ink transition-colors hover:text-water'

const PROJECT_OPTIONS: { value: ProjectType; title: string; subtitle: string }[] = [
  {
    value: 'site',
    title: 'Un site mesuré sur mesure',
    subtitle: 'Site, plan de taggage, conformité cookies et dashboard de suivi.',
  },
  {
    value: 'audit-tracking',
    title: 'Un audit tracking / RGPD',
    subtitle: 'Diagnostic de votre site actuel, mise en conformité, plan de mesure.',
  },
  {
    value: 'agent',
    title: 'Un agent IA ou une automatisation',
    subtitle: 'Transformer vos données ou votre reporting en décisions.',
  },
  {
    value: 'echange',
    title: "L'audit offert de 30 min",
    subtitle: 'Un regard extérieur et un plan d’action priorisé sur votre site.',
  },
]

// Libellés formels (corps Formspree + récapitulatif étape 3).
const PROJECT_LABELS: Record<ProjectType, string> = {
  site: 'Site mesuré sur mesure',
  'audit-tracking': 'Audit & refonte tracking / RGPD',
  agent: 'Agent IA & automatisation',
  echange: 'Audit offert de 30 min',
}

const CONTEXT_PLACEHOLDER: Record<ProjectType, string> = {
  site: "Je lance / refonds le site de... Ce que je veux pouvoir mesurer c'est... Mon délai est...",
  'audit-tracking': 'Mon site est sur... Mes outils de mesure sont... Ce qui me pose question c’est...',
  agent: 'Aujourd’hui je passe du temps sur... Mes données sont dans... J’aimerais que...',
  echange: "Mon site est... J'aimerais un avis sur... Mon enjeu actuel est...",
}

// Extraction défensive d'un éventuel message d'erreur Formspree.
function readApiError(data: unknown): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const { error } = data as { error: unknown }
    if (typeof error === 'string') return error
  }
  return ''
}

export default function ContactForm() {
  const reduce = useReducedMotion()

  const [step, setStep] = useState<Step>(1)
  // direction du glissement : 1 = on avance, -1 = on revient en arrière.
  const [direction, setDirection] = useState(1)
  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [context, setContext] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  // Pré-cochée en arrivant d'un lien « recevoir les fourchettes » (/contact?fourchettes=1).
  // La case n'apparaît qu'à l'étape 3 : pas d'écart entre rendu serveur et hydratation.
  const [wantsRanges, setWantsRanges] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fourchettes'),
  )
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const sending = status === 'sending'
  const fillPct = step === 1 ? 33 : step === 2 ? 66 : 100
  // Même base (longueur utile, espaces ignorés) pour le compteur ET le gate.
  const contextLength = context.trim().length
  const canContinue = contextLength >= 20

  const stepVariants: Variants = {
    initial: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 30 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * -30,
      transition: { duration: 0.4, ease: EASE },
    }),
  }

  function selectProject(value: ProjectType) {
    setProjectType(value)
    setDirection(1)
    setStep(2)
  }

  function goTo(target: Step) {
    setDirection(target > step ? 1 : -1)
    setStep(target)
  }

  async function submit() {
    if (sending) return
    setStatus('sending')
    setErrorMessage('')

    try {
      const label = projectType ? PROJECT_LABELS[projectType] : 'projet'
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || 'Non renseigné',
          project_type: label,
          context,
          fourchettes: wantsRanges ? 'Oui, envoyer les fourchettes indicatives' : 'Non',
          _subject: `Nouveau lead portfolio : ${label} - ${name}`,
        }),
      })

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null)
        setErrorMessage(
          readApiError(data) || `L'envoi n'a pas abouti. Réessayez ou écrivez-moi directement à ${EMAIL}.`,
        )
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage(`Connexion impossible. Vérifiez votre réseau ou écrivez-moi directement à ${EMAIL}.`)
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setStep(1)
    setDirection(1)
    setProjectType(null)
    setContext('')
    setName('')
    setEmail('')
    setPhone('')
    setWantsRanges(false)
    setErrorMessage('')
  }

  if (status === 'success') {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-start"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-water">
          <Check className="h-8 w-8 text-water" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h2 className="font-fraunces mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink">
          Message bien reçu.
        </h2>
        <p className="mt-4 max-w-md text-base leading-[1.6] text-ink/70">
          Merci. Je vous réponds sous 48 h pour caler notre premier échange de 30 min.
        </p>
        <button type="button" onClick={reset} className={`${GHOST_BTN} mt-8`}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Envoyer un autre message
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Barre de progression */}
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-label="Progression du formulaire"
          aria-valuenow={fillPct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-0.5 flex-1 overflow-hidden bg-ink/10"
        >
          <div
            className="h-full bg-water transition-all duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <span className="whitespace-nowrap font-mono text-xs uppercase text-ink/60">Étape {step} sur 3</span>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {step === 1 && (
              <fieldset>
                <legend className="font-fraunces text-3xl font-bold leading-[1.1] tracking-tight text-ink">
                  Vous cherchez...
                </legend>
                <div className="mt-8 grid grid-cols-1 gap-3">
                  {PROJECT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectProject(opt.value)}
                      className="group flex min-h-[80px] items-center justify-between gap-4 rounded-sm border border-ink/20 p-6 text-left transition-colors hover:border-water hover:bg-ink/5"
                    >
                      <span>
                        <span className="font-fraunces block text-xl font-semibold text-ink">{opt.title}</span>
                        <span className="mt-1 block text-sm text-ink/65">{opt.subtitle}</span>
                      </span>
                      <ArrowRight
                        className="h-5 w-5 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-fraunces text-3xl font-bold leading-[1.1] tracking-tight text-ink">
                  Parlez-moi de votre contexte.
                </h2>
                <p className="mt-3 text-sm italic text-ink/65">
                  {projectType ? PROJECT_LABELS[projectType] : ''}.{' '}
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="text-water underline underline-offset-2 hover:text-water/80"
                  >
                    Modifier
                  </button>
                </p>

                <div className="mt-8">
                  <label htmlFor="contact-context" className={LABEL_CLASS}>
                    Votre contexte
                  </label>
                  <textarea
                    id="contact-context"
                    name="context"
                    rows={5}
                    required
                    minLength={20}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={projectType ? CONTEXT_PLACEHOLDER[projectType] : ''}
                    className={`${FIELD_CLASS} mt-2 resize-none`}
                  />
                  <p className="mt-2 text-right font-mono text-xs text-ink/55">
                    {contextLength} caractères (20 minimum)
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={() => goTo(1)} className={GHOST_BTN}>
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Précédent
                  </button>
                  <button type="button" onClick={() => goTo(3)} disabled={!canContinue} className={FILLED_BTN}>
                    Continuer
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void submit()
                }}
                aria-busy={sending}
              >
                <h2 className="font-fraunces text-3xl font-bold leading-[1.1] tracking-tight text-ink">
                  Comment vous joindre ?
                </h2>

                <div className="mt-8 flex flex-col gap-6">
                  <div>
                    <label htmlFor="contact-name" className={LABEL_CLASS}>
                      Votre nom
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${FIELD_CLASS} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={LABEL_CLASS}>
                      Votre email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${FIELD_CLASS} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={LABEL_CLASS}>
                      Votre téléphone (facultatif)
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`${FIELD_CLASS} mt-2`}
                    />
                  </div>
                  <label htmlFor="contact-ranges" className="flex min-h-11 cursor-pointer items-start gap-3">
                    <input
                      id="contact-ranges"
                      name="fourchettes"
                      type="checkbox"
                      checked={wantsRanges}
                      onChange={(e) => setWantsRanges(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
                    />
                    <span className="text-sm leading-[1.5] text-ink/80">
                      Recevoir les fourchettes de prix indicatives avant notre échange
                    </span>
                  </label>
                </div>

                <div className="mt-8 rounded-sm border border-ink/15 bg-ink/5 p-4">
                  <p className={LABEL_CLASS}>Récapitulatif</p>
                  <p className="mt-2 text-sm text-ink">{projectType ? PROJECT_LABELS[projectType] : ''}</p>
                  <p className="mt-1 text-[13px] italic text-ink/70">
                    {context.length > 100 ? `${context.slice(0, 100)}...` : context}
                  </p>
                  {wantsRanges && (
                    <p className="mt-2 font-mono text-xs text-ink/70">+ fourchettes de prix indicatives</p>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={() => goTo(2)} className={GHOST_BTN}>
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Précédent
                  </button>
                  <button type="submit" disabled={sending} className={FILLED_BTN}>
                    Envoyer
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>

                <div aria-live="polite" className="mt-4">
                  {status === 'sending' && <p className="text-sm italic text-ink/70">Envoi en cours...</p>}
                  {status === 'error' && <p className="text-sm text-water">{errorMessage}</p>}
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
