import { Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import TransitionSection from './components/TransitionSection'
import Realisations from './components/Realisations'
import Approche from './components/Approche'
import APropos from './components/APropos'
import Audit from './components/Audit'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AlohaImmo from './pages/AlohaImmo'

function Portfolio() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TransitionSection />
        <Realisations />
        <Approche />
        <APropos />
        <Audit />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    // reducedMotion="user" : motion respecte prefers-reduced-motion automatiquement
    // (les transforms sont neutralisees, l'opacite reste).
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/pour-aloha-immo" element={<AlohaImmo />} />
      </Routes>
      {/* Grain filmique global, au-dessus du contenu, non interactif */}
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
