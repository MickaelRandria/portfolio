import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Calendar } from 'lucide-react'
import { EASE } from '../lib/motion'

const LINKS = [
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Approche', href: '#approche' },
  { label: 'Contact', href: '#contact' },
] as const

export default function Navigation() {
  // Au-delà d'un court scroll, on pose un fond #0F1B2D + blur léger.
  // useMotionValueEvent évite un listener scroll manuel et reste synchro avec motion.
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-gold/15 bg-ink/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-16 xl:px-24">
        {/* Logo texte */}
        <a
          href="#top"
          className="font-fraunces text-xl font-semibold tracking-tight text-sand transition-opacity hover:opacity-80 sm:text-2xl"
        >
          Mickael
        </a>

        {/* Liens centraux : masqués en mobile, espacement généreux en desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm text-sand/75 transition-colors hover:text-sand"
              >
                {link.label}
                {/* Soulignement qui se déploie au survol */}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton de prise de rendez-vous -> CTA audit (section #audit).
            En mobile : icône seule (le texte serait tronqué). */}
        <a
          href="#audit"
          aria-label="Prenons rendez-vous"
          className="group inline-flex items-center gap-2 rounded-[4px] border border-gold/60 px-3 py-2.5 text-sm text-sand transition-colors duration-300 hover:bg-sand hover:text-ink sm:px-5"
        >
          <Calendar className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">Prenons rendez-vous</span>
        </a>
      </nav>
    </motion.header>
  )
}
