import { useState, useRef, useEffect, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'
import PromptPanel from './PromptPanel'
import PracticeControls from './PracticeControls'
import PracticeSelector from './PracticeSelector'
import { usePracticeRunner } from './usePracticeRunner'
import { PRACTICES } from './practices'
import { PAGES } from '../utils/modalContent'

export const COLOR_THEMES = [
  {
    id: 'violet',
    label: 'Violet',
    swatch: '#9D8DF1',
    hot: '#331f80',
    dark: '#11131d',
    ring: 'rgba(255,255,255,0.9)',
  },
  {
    id: 'indigo',
    label: 'Midnight Indigo',
    swatch: '#3D5A80',
    hot: '#1B263B',
    dark: '#0D1B2A',
    ring: 'rgba(152,193,217,0.9)',
  },
  {
    id: 'petrol',
    label: 'Petrol & Ink',
    swatch: '#005F6B',
    hot: '#002B36',
    dark: '#001217',
    ring: 'rgba(0,163,181,0.9)',
  },
  {
    id: 'moonfog',
    label: 'Moonlit Fog',
    swatch: '#D1D9E6',
    hot: '#2F3E46',
    dark: '#1A2126',
    ring: 'rgba(255,255,255,0.9)',
  },
  {
    id: 'moss',
    label: 'Moss & Shadow',
    swatch: '#9CAF88',
    hot: '#2A3624',
    dark: '#0F140D',
    ring: 'rgba(193,209,184,0.9)',
  },
  {
    id: 'sage',
    label: 'Sage',
    swatch: '#a8d5b5',
    hot: '#1a3d2b',
    dark: '#0e1a14',
    ring: 'rgba(168,213,181,0.9)',
  },
  {
    id: 'ember',
    label: 'Ember',
    swatch: '#f0b985',
    hot: '#3d2010',
    dark: '#1a0f08',
    ring: 'rgba(240,185,133,0.9)',
  },
]

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isSustaining, setIsSustaining] = useState(false)
  const [themeId, setThemeId] = useState('violet')

  // null = free play, otherwise a practice id from PRACTICES
  const [practiceId, setPracticeId] = useState(null)
  const practice = PRACTICES.find((p) => p.id === practiceId) ?? null

  // Drag tracking refs
  const scrollRef = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const hasMoved = useRef(false)

  const theme = COLOR_THEMES.find((t) => t.id === themeId)

  const handlePracticeComplete = useCallback(() => {
    setPracticeId(null)
  }, [])

  const { currentStep, dispatch, isPadInteractive } = usePracticeRunner(
    practice,
    {
      setIsActive,
      setIsSustaining,
      onComplete: handlePracticeComplete,
    },
  )

  const handleSelectPractice = useCallback((id) => {
    // Force sound off before switching — covers leaving a practice mid-flow
    // as well as entering a different practice.
    setIsActive(false)
    setIsSustaining(false)
    setPracticeId(id)
  }, [])

  const handleMouseDown = (event) => {
    isDown.current = true
    hasMoved.current = false
    startX.current = event.clientX
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      if (!isDown.current || !scrollRef.current) return

      const deltaX = event.clientX - startX.current

      if (Math.abs(deltaX) > 4) {
        hasMoved.current = true
      }

      scrollRef.current.scrollLeft =
        scrollLeft.current - deltaX * 1.5
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
            {practice && (
              <div
                className="
                  absolute bottom-full left-1/2 z-10
                  mb-6
                  w-[min(28rem,calc(100vw-2rem))]
                  -translate-x-1/2
                  pointer-events-none
                "
              >
                <PromptPanel prompt={currentStep?.prompt} />
              </div>
            )}

            {!practice && (
              <>
                <span className="absolute -top-10 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
                  INTENSE
                </span>

                <span className="absolute -bottom-10 font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
                  EXPANSIVE
                </span>

                <span className="absolute -left-16 ml-1 -rotate-90 origin-center font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
                  TIGHT
                </span>

                <span className="absolute -right-16 -mr-1 rotate-90 origin-center font-sans text-[0.8rem] tracking-[0.25em] uppercase text-outline pointer-events-none select-none">
                  MOTION
                </span>
              </>
            )}

            <XYController
              isSustaining={isSustaining}
              isActive={isActive}
              setIsActive={setIsActive}
              theme={theme}
              disabled={practice ? !isPadInteractive : false}
              onPadTouch={
                practice ? () => dispatch('padTouch') : undefined
              }
              onPadRelease={
                practice ? () => dispatch('padRelease') : undefined
              }
            />
          </div>

          {practice && (
            <PracticeControls
              controls={currentStep?.controls}
              onEvent={dispatch}
            />
          )}

          {!practice && (
            <>
              {/* Container for modal buttons */}
              <div className="mt-2 flex w-full justify-around gap-4">
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
                onDragStart={(event) => event.preventDefault()}
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
                {COLOR_THEMES.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      if (hasMoved.current) return
                      setThemeId(themeOption.id)
                    }}
                    aria-label={`${themeOption.label} theme`}
                    aria-pressed={themeId === themeOption.id}
                    className="
                      w-6 h-6 rounded-full
                      flex-shrink-0
                      transition-[transform,box-shadow,opacity] duration-200
                      cursor-pointer border-0 p-0
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-white/50
                    "
                    style={{
                      background: themeOption.swatch,
                      opacity:
                        themeId === themeOption.id ? 1 : 0.35,
                      transform:
                        themeId === themeOption.id
                          ? 'scale(1.15)'
                          : 'scale(1)',
                      boxShadow: 'none',
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsSustaining((previous) => !previous)
                }
                aria-pressed={isSustaining}
                className={`
                  flex items-center gap-2
                  bg-transparent border-0
                  px-3 py-2
                  text-[0.6rem]
                  tracking-[0.22em] uppercase
                  ${
                    isSustaining
                      ? 'text-white/70'
                      : 'text-white/20'
                  }
                  cursor-pointer
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-violet
                `}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSustaining
                      ? 'bg-white/70 shadow-[0_0_8px_-white/70]'
                      : 'bg-white/20'
                  }`}
                />

                Sustain Mode {isSustaining ? 'On' : 'Off'}
              </button>
            </>
          )}

          <PracticeSelector
            selectedId={practiceId}
            onSelect={handleSelectPractice}
          />
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

      <footer
        className={`footer-credits hide-on-active ${
          isActive ? 'is-active' : ''
        }`}
      >
        Rinat Tregerman © 2026
      </footer>

      <Analytics />
    </>
  )
}

export default App