import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'
import { PAGES } from '../utils/modalContent'

// ─── Color themes ─────────────────────────────────────────────────────────────
// Each theme defines:
//   hot      — the radial gradient's bright center (follows cursor)
//   dark     — the gradient's outer edge (always near #11131d)
//   ring     — border color of the cursor ring
export const COLOR_THEMES = [
  {
    id: 'violet',
    label: 'Violet',
    swatch: '#9D8DF1',
    hot:  '#331f80',
    dark: '#11131d',
    ring: 'rgba(255,255,255,0.9)',
  },
  {
    id: 'sage',
    label: 'Sage',
    swatch: '#a8d5b5',
    hot:  '#1a3d2b',
    dark: '#0e1a14',
    ring: 'rgba(168,213,181,0.9)',
  },
  {
    id: 'ember',
    label: 'Ember',
    swatch: '#f0b985',
    hot:  '#3d2010',
    dark: '#1a0f08',
    ring: 'rgba(240,185,133,0.9)',
  },
]

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [themeId, setThemeId] = useState('violet')

  const theme = COLOR_THEMES.find(t => t.id === themeId)

  return (
    <>
      {/* Ambient background atmosphere */}
      <div className="fixed inset-0 -z-10 bg-void pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(157,141,241,0.06)_0%,transparent_60%)]" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-8">

          {/* Pad + directional labels */}
          <div className="relative flex items-center justify-center">
            {/* Top label is 10 and not 16 because of the padding */}
            <span className="
              absolute -top-10
              font-sans text-[0.8rem] tracking-[0.25em] uppercase
              text-outline 
              pointer-events-none select-none
            ">
              INTENSE
            </span>

            {/* Bottom label */}
            <span className="
              absolute -bottom-10
              font-sans text-[0.8rem] tracking-[0.25em] uppercase
              text-outline 
              pointer-events-none select-none
            ">
              EXPANSIVE
            </span>

            {/* Left label */}
            <span className="
              absolute -left-16
              font-sans text-[0.8rem] tracking-[0.25em] uppercase
              text-outline 
              pointer-events-none select-none
              -rotate-90 origin-center
            ">
              TIGHT
            </span>

            {/* Right label */}
            <span className="
              absolute -right-16
              font-sans text-[0.8rem] tracking-[0.25em] uppercase
              text-outline 
              pointer-events-none select-none
              rotate-90 origin-center
            ">
              MOTION
            </span>

            <XYController isActive={isActive} setIsActive={setIsActive} theme={theme}/>
          </div>
        {/* Container for modal buttons, positioned centered, side by side */}
          <div className="flex gap-4">
            <button
              className="
                mt-6
                bg-transparent border border-white/15 rounded-[14px]
                px-5 py-2
                font text-[0.75rem] tracking-[0.2em] uppercase
                text-on-surface-variant
                cursor-pointer
                transition-colors duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet
              "
              onClick={() => setShowInstructions(true)}
            >
              Quick Start
            </button>
            <button
              className="
                mt-6
                bg-transparent border border-white/15 rounded-[14px]
                px-5 py-2
                font text-[0.75rem] tracking-[0.2em] uppercase
                text-on-surface-variant
                cursor-pointer
                transition-colors duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet
              "
              onClick={() => setShowDeepDive(true)}
            >
              Deeper Dive
            </button>
          </div>

           {/* Color swatches */}
                    <div className="flex items-center gap-10" role="group" aria-label="Color theme">
                      {COLOR_THEMES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          aria-label={`${t.label} theme`}
                          aria-pressed={themeId === t.id}
                          className="
                            w-6 h-6 rounded-full
                            transition-[transform,box-shadow,opacity] duration-200
                            cursor-pointer border-0 p-0
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50
                          "
                          style={{
                            background: t.swatch,
                            opacity: themeId === t.id ? 1 : 0.35,
                            transform: themeId === t.id ? 'scale(1.15)' : 'scale(1)',
                            boxShadow: themeId === t.id
                              ? `0 0 10px ${t.glow}`
                              : 'none',
                          }}
                        />
                      ))}
                    </div>

        </div>
      </main>

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          PAGES={PAGES.INSTRUCTIONS}
        />
        <InstructionsModal
          isOpen={showDeepDive}
          onClose={() => setShowDeepDive(false)}
          PAGES={PAGES.DEEP_DIVE}
        />

      {/* Footer — fades to watermark, hover restores, hides while pad is active */}
      <footer className={`footer-credits ${isActive ? 'is-active' : ''}`}>
        Rinat Tregerman © 2026
      </footer>

      <Analytics />
    </>
  )
}

export default App
