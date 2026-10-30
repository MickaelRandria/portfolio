import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { posterFor } from '../lib/media'

interface LazyVideoProps {
  src: string
  label: string
  className?: string
}

/**
 * Vidéo d'aperçu sans coût au chargement : `preload="none"` et poster WebP,
 * donc rien n'est téléchargé tant qu'elle n'est pas à l'écran. Elle joue en
 * entrant dans la viewport et se met en pause en sortant. Le navigateur garde
 * le fichier en cache : une seule requête même après plusieurs passages.
 * Pas de lecture automatique si l'utilisateur préfère réduire les animations.
 */
export default function LazyVideo({ src, label, className = '' }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    if (prefersReduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().catch(() => undefined)
          } else {
            el.pause()
          }
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReduced])

  return (
    <video
      ref={videoRef}
      className={className}
      poster={posterFor(src)}
      loop
      muted
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
