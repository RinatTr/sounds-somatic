import { useState, useRef, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'
import { PAGES } from '../utils/modalContent'

export const COLOR_THEMES = [
  { id: 'violet', label: 'Violet', swatch: '#9D8DF1', hot: '#331f80', dark: '#11131d', ring: 'rgba(255,255,255,0.9)' },
  { id: 'indigo', label: 'Midnight Indigo', swatch: '#3D5A80', hot: '#1B263B', dark: '#0D1B2A', ring: 'rgba(152,193,217,0.9)' },
  { id: 'petrol', label: 'Petrol & Ink', swatch: '#005F6B', hot: '#002B36', dark: '#001217', ring: 'rgba(0,163,181,0.9)' },
  { id: 'moonfog', label: 'Moonlit Fog', swatch: '#D1D9E6', hot: '#2F3E46', dark: '#1A2126', ring: 'rgba(255,255,255,0.9)' },
  { id: 'moss', label: 'Moss & Shadow', swatch: '#9CAF88', hot: '#2A3624', dark: '#0F140D', ring: 'rgba(193,209,184,0.9)' },
  { id: 'sage', label: 'Sage', swatch: '#a8d5b5', hot: '#1a3d2b', dark: '#0e1a14', ring: 'rgba(168,213,181,0.9)' },
  { id: 'ember', label: 'Ember', swatch: '#f0b985', hot: '#3d2010', dark: '#1a0f08', ring: 'rgba(240,185,133,0.9)' },
]

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [themeId, setThemeId] = useState('violet')

  // Drag tracking refs
  const scrollRef = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const hasMoved = useRef(false)

  const theme = COLOR_THEMES.find(t => t.id === themeId)

  const handleMouseDown = (e) => {
    isDown.current = true
    hasMoved.current = false
    startX.current = e.clientX
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDown.current || !scrollRef.current) return
      
      const deltaX = e.clientX - startX.current
      if (Math.abs(deltaX) > 4) {
        hasMoved.current = true
      }
      
      scrollRef.current.scrollLeft = scrollLeft.current - deltaX * 1.5
    }

    const handleGlobalMouseUp = () => {
      isDown.current = false
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  return (
    <>
      {/* Ambient background atmosphere */}
      <div className="fixed inset-0 -z-10 bg-void pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(157,141,241,0.06)_0%,transparent_60%)]" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-6">

          {/* Pad + directional labels */}
          <div className="relative flex items-center justify-center">
            <span className="absolute -top-10 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
              INTENSE
            </span>
            <span className="absolute -bottom-10 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
              EXPANSIVE
            </span>
            <span className="absolute -left-16 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none -rotate-90 origin-center ml-1">
              TIGHT
            </span>
            <span className="absolute -right-16 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none rotate-90 origin-center -mr-1">
              MOTION
            </span>

            <XYController isActive={isActive} setIsActive={setIsActive} theme={theme}/>
          </div>

          {/* Container for modal buttons */}
          <div className="flex gap-4 mt-2 w-full justify-around">
            <button
              className="mt-6 bg-transparent border border-white/15 rounded-[14px] px-5 py-2 font text-[0.75rem] tracking-[0.2em] uppercase text-on-surface-variant cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet"
              onClick={() => setShowInstructions(true)}
            >
              How to Use
            </button>
            <button
              className="mt-6 bg-transparent border border-white/15 rounded-[14px] px-5 py-2 font text-[0.75rem] tracking-[0.2em] uppercase text-on-surface-variant cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet"
              onClick={() => setShowDeepDive(true)}
            >
              Deeper Dive
            </button>
          </div>

          {/* Color swatches */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
            className="
              p-[2px]
              flex items-center gap-8
              max-w-[140px]
              overflow-x-scroll
              scrollbar-none
              h-10
              cursor-grab active:cursor-grabbing select-none
            "
            role="group"
            aria-label="Color theme"
          >
            {COLOR_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  if (hasMoved.current) return
                  setThemeId(t.id)
                }}
                aria-label={`${t.label} theme`}
                aria-pressed={themeId === t.id}
                className="
                  w-6 h-6 rounded-full
                  flex-shrink-0
                  transition-[transform,box-shadow,opacity] duration-200
                  cursor-pointer border-0 p-0
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50
                "
                style={{
                  background: t.swatch,
                  opacity: themeId === t.id ? 1 : 0.35,
                  transform: themeId === t.id ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: 'none',
                }}
              />
            ))}
          </div>
        </div>
      </main>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} PAGES={PAGES.INSTRUCTIONS} />
      <InstructionsModal isOpen={showDeepDive} onClose={() => setShowDeepDive(false)} PAGES={PAGES.DEEP_DIVE} />

      <footer className={`footer-credits hide-on-active ${isActive ? 'is-active' : ''}`}>
        Rinat Tregerman © 2026
      </footer>

      <Analytics />
    </>
  )
}

export default App
