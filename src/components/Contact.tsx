import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { EASE, fadeUp, lineContainer, lineReveal, staggerContainer } from '../lib/motion'

type Step = 1 | 2 | 3
type ProjectType = 'creation' | 'refonte' | 'audit'
type Status = 'idle' | 'sending' | 'success' | 'error'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbdenpdy'

const LABEL_CLASS = 'block text-[11px] uppercase tracking-[0.18em] text-ink/60'
const FIELD_CLASS =
  'w-full border-b border-ink/30 bg-transparent px-2 py-3 text-ink transition-colors placeholder:text-ink/30 focus:border-ink focus:outline-none'
const FILLED_BTN =
  'inline-flex items-center gap-2 rounded-[4px] bg-ink px-8 py-3 font-semibold text-sand transition-transform duration-300 enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transform-none'
const GHOST_BTN =
  'inline-flex items-center gap-2 px-2 py-3 font-semibold text-ink transition-colors hover:text-water'

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/micka%C3%ABl-randrianandraina-6b279b171/',
  },
  { label: 'GitHub', href: 'https://github.com/MickaelRandria' },
] as const

const PROJECT_OPTIONS: { value: ProjectType; title: string; subtitle: string }[] = [
  {
    value: 'creation',
    title: 'Créer un nouveau site',
    subtitle: 'Vous démarrez de zéro. Identité, site vitrine, première mise en ligne.',
  },
  {
    value: 'refonte',
    title: 'Refondre un site existant',
    subtitle:
      'Votre site actuel ne vous représente plus. On reprend les bases avec une vision neuve.',
  },
  {
    value: 'audit',
    title: 'Un audit ou un échange conseil',
    subtitle:
      'Vous voulez un regard extérieur, un diagnostic, ou simplement échanger sur un projet.',
  },
]

// Libellés formels (corps Formspree + récapitulatif étape 3).
const PROJECT_LABELS: Record<ProjectType, string> = {
  creation: "Création d'un nouveau site",
  refonte: "Refonte d'un site existant",
  audit: 'Audit ou échange conseil',
}

// Reprise du choix dans le récap de l'étape 2 ("Vous cherchez à ...").
const RECAP_CHOICE: Record<ProjectType, string> = {
  creation: 'créer un nouveau site',
  refonte: 'refondre un site existant',
  audit: 'un audit ou un échange conseil',
}

const CONTEXT_PLACEHOLDER: Record<ProjectType, string> = {
  creation: "Je porte le projet de... J'aimerais un site qui... Mon délai est...",
  refonte: "Mon site actuel est sur... Ce qui me dérange c'est... Ce que j'aimerais c'est...",
  audit: "J'aimerais un avis sur... Mon contexte est... Mon enjeu actuel est...",
}

const SUCCESS_MESSAGE: Record<ProjectType, string> = {
  creation:
    "Merci de m'avoir partagé votre projet de création. Je vous réponds sous 48h avec une première lecture et quelques questions pour aller plus loin.",
  refonte:
    "Merci pour votre demande de refonte. Je vous réponds sous 48h avec une première lecture de votre site actuel et des pistes d'amélioration.",
  audit:
    "Merci pour votre demande d'échange. Je vous réponds sous 48h pour caler un créneau qui vous arrange.",
}

// Extraction défensive d'un éventuel message d'erreur Formspree.
function readApiError(data: unknown): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const { error } = data as { error: unknown }
    if (typeof error === 'string') return error
  }
  return ''
}

export default function Contact() {
  const reduce = useReducedMotion()

  const [step, setStep] = useState<Step>(1)
  // direction du glissement : 1 = on avance, -1 = on revient en arrière.
  const [direction, setDirection] = useState(1)
  const [projectType, setProjectType] = useState<ProjectType | null>(null)
  const [context, setContext] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const sending = status === 'sending'
  const fillPct = step === 1 ? 33 : step === 2 ? 66 : 100
  // Même base (longueur utile, espaces ignorés) pour le compteur ET le gate, afin
  // qu'ils ne divergent jamais (ex. 20 espaces ne débloquent pas "Continuer").
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || 'Non renseigné',
          project_type: projectType ? PROJECT_LABELS[projectType] : 'Non renseigné',
          context,
          _subject: `Nouveau lead portfolio : ${
            projectType ? PROJECT_LABELS[projectType] : 'projet'
          } - ${name}`,
        }),
      })

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null)
        setErrorMessage(
          readApiError(data) ||
            "L'envoi n'a pas abouti. Réessayez ou écrivez-moi directement à mickarandrianan@gmail.com.",
        )
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage(
        'Connexion impossible. Vérifiez votre réseau ou écrivez-moi directement à mickarandrianan@gmail.com.',
      )
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
    setErrorMessage('')
  }

  return (
    <section id="contact" className="bg-sand text-ink">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-[1600px] grid-cols-1 gap-y-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-x-8 lg:px-16 lg:py-32 xl:px-24"
      >
        {/* Colonne gauche : titre + formulaire multi-étapes */}
        <div className="lg:col-span-6">
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.2em] text-water"
          >
            Contact
          </motion.p>
          <motion.h2
            variants={lineContainer}
            className="font-fraunces mt-6 font-bold leading-[1.05] tracking-tight text-balance hyphens-auto text-ink"
            style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineReveal} className="block pb-[0.08em]">
                Parlons de <span className="italic">votre projet</span>.
              </motion.span>
            </span>
          </motion.h2>

          <div className="mt-12">
            {status === 'success' ? (
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
                <h3
                  className="font-fraunces mt-6 font-bold leading-[1.1] tracking-tight text-ink"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
                >
                  Message bien reçu.
                </h3>
                <p className="mt-4 max-w-md text-base leading-[1.6] text-ink/70">
                  {projectType ? SUCCESS_MESSAGE[projectType] : SUCCESS_MESSAGE.creation}
                </p>
                <button type="button" onClick={reset} className={`${GHOST_BTN} mt-8`}>
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <>
                {/* Barre de progression */}
                <div className="flex items-center gap-4">
                  <div
                    role="progressbar"
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
                  <span className="whitespace-nowrap text-xs uppercase tracking-[0.15em] text-ink/50">
                    Étape {step} sur 3
                  </span>
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
                      {/* ÉTAPE 1 */}
                      {step === 1 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-water">Étape 1</p>
                          <h3
                            className="font-fraunces mt-3 font-bold leading-[1.1] tracking-tight text-ink"
                            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
                          >
                            Vous cherchez à...
                          </h3>
                          <div className="mt-8 grid grid-cols-1 gap-3">
                            {PROJECT_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => selectProject(opt.value)}
                                className="group flex min-h-[80px] items-center justify-between gap-4 rounded-[4px] border border-ink/20 p-6 text-left transition-colors hover:border-water hover:bg-ink/5 focus-visible:border-water focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water/30"
                              >
                                <span>
                                  <span className="font-fraunces block text-xl font-semibold text-ink">
                                    {opt.title}
                                  </span>
                                  <span className="mt-1 block text-sm text-ink/60">
                                    {opt.subtitle}
                                  </span>
                                </span>
                                <ArrowRight
                                  className="h-5 w-5 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1"
                                  strokeWidth={1.75}
                                  aria-hidden="true"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ÉTAPE 2 */}
                      {step === 2 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-water">Étape 2</p>
                          <h3
                            className="font-fraunces mt-3 font-bold leading-[1.1] tracking-tight text-ink"
                            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
                          >
                            Parlez-moi de votre projet.
                          </h3>
                          <p className="mt-3 text-sm italic text-ink/60">
                            Vous cherchez à {projectType ? RECAP_CHOICE[projectType] : ''}.{' '}
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
                            <p className="mt-2 text-right text-xs text-ink/40">
                              {contextLength} caractères
                            </p>
                          </div>

                          <div className="mt-8 flex items-center justify-between">
                            <button type="button" onClick={() => goTo(1)} className={GHOST_BTN}>
                              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                              Précédent
                            </button>
                            <button
                              type="button"
                              onClick={() => goTo(3)}
                              disabled={!canContinue}
                              className={FILLED_BTN}
                            >
                              Continuer
                              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ÉTAPE 3 */}
                      {step === 3 && (
                        <form onSubmit={handleSubmit} aria-busy={sending}>
                          <p className="text-xs uppercase tracking-[0.2em] text-water">Étape 3</p>
                          <h3
                            className="font-fraunces mt-3 font-bold leading-[1.1] tracking-tight text-ink"
                            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
                          >
                            Comment vous joindre ?
                          </h3>
                          <p className="mt-2 text-sm text-ink/60">
                            Plus que quelques infos pour vous recontacter.
                          </p>

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
                          </div>

                          {/* Récapitulatif */}
                          <div className="mt-8 rounded-[4px] border border-ink/15 bg-ink/5 p-4">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                              Récapitulatif
                            </p>
                            <p className="mt-2 text-sm text-ink">
                              {projectType ? PROJECT_LABELS[projectType] : ''}
                            </p>
                            <p className="mt-1 text-[13px] italic text-ink/70">
                              {context.length > 100 ? `${context.slice(0, 100)}...` : context}
                            </p>
                          </div>

                          <div className="mt-8 flex items-center justify-between">
                            <button type="button" onClick={() => goTo(2)} className={GHOST_BTN}>
                              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                              Précédent
                            </button>
                            <button type="submit" disabled={sending} className={FILLED_BTN}>
                              Envoyer le message
                              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                            </button>
                          </div>

                          {/* Feedback d'envoi */}
                          <div aria-live="polite" className="mt-4">
                            {status === 'sending' && (
                              <p className="text-sm italic text-ink/70">Envoi en cours...</p>
                            )}
                            {status === 'error' && (
                              <p className="text-sm text-water">{errorMessage}</p>
                            )}
                          </div>
                        </form>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Colonne droite : infos contact */}
        <div className="lg:col-span-5 lg:col-start-8">
          <motion.p
            variants={fadeUp}
            className="mb-10 max-w-xs text-[13px] italic text-ink/60"
          >
            Préférez nous écrire directement ? Toutes les coordonnées sont ici.
          </motion.p>

          <motion.div variants={fadeUp} className="mb-12">
            <p className={LABEL_CLASS}>Email</p>
            <a
              href="mailto:mickarandrianan@gmail.com"
              className="font-fraunces mt-2 inline-block text-2xl text-ink transition-colors hover:text-water"
            >
              mickarandrianan@gmail.com
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-12">
            <p className={LABEL_CLASS}>Réseaux</p>
            <ul className="mt-2 space-y-1">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-fraunces inline-flex items-center gap-1.5 text-2xl text-ink transition-colors hover:text-water"
                  >
                    {social.label}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className={LABEL_CLASS}>Localisation</p>
            <p className="font-fraunces mt-2 text-2xl text-ink">Bordeaux, France</p>
            <p className="mt-2 max-w-xs text-sm leading-[1.6] text-ink/60">
              Disponible en remote partout en France et à l'international.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
