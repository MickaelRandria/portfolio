const FOOTER_LINKS = [
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Approche', href: '#approche' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Contact', href: '#contact' },
] as const

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-16 xl:px-24">
        {/* Ligne haute */}
        <div className="grid grid-cols-1 items-center gap-y-6 lg:grid-cols-12">
          <a
            href="#top"
            className="font-fraunces text-[2rem] font-bold leading-none text-sand transition-opacity hover:opacity-80 lg:col-span-6"
          >
            Mickael
          </a>
          <nav
            aria-label="Liens de pied de page"
            className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-sand/60 lg:col-span-6 lg:justify-end"
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-sand"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Séparateur */}
        <div className="mt-12 mb-8 h-px w-full bg-gold/20" />

        {/* Ligne basse */}
        <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-12">
          <p className="text-xs text-sand/40 lg:col-span-6">
            © 2026 Mickael. Web Analyst Digital basé à Bordeaux.
          </p>
          <p className="font-fraunces text-xs italic text-sand/40 lg:col-span-6 lg:text-right">
            Concevoir des sites qui durent.
          </p>
        </div>
      </div>
    </footer>
  )
}
