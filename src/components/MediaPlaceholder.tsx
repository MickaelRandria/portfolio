import { ImageIcon } from 'lucide-react'

interface MediaPlaceholderProps {
  title: string
  /** Fond clair (cards sable) ou sombre (Agentique IA). */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Emplacement réservé à une capture ou une vidéo pas encore fournie.
 * Garde le ratio de la vraie vidéo pour que la mise en page ne bouge pas
 * le jour où `videoSrc` est renseigné.
 */
export default function MediaPlaceholder({
  title,
  tone = 'dark',
  className = '',
}: MediaPlaceholderProps) {
  const palette =
    tone === 'dark'
      ? 'border-gold/25 bg-sand/[0.03] text-sand/45'
      : 'border-ink/25 bg-ink/[0.03] text-ink/45'

  return (
    <div
      role="img"
      aria-label={`Capture du projet ${title} à venir`}
      className={`relative flex w-full items-center justify-center overflow-hidden border border-dashed ${palette} ${className}`}
    >
      {/* Trame de points discrète, dans la couleur courante */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.2em]">Capture à venir</span>
      </div>
    </div>
  )
}
