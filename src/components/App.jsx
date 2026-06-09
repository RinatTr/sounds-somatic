import { useState } from 'react'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'

/*
  Layout model
  ─────────────────────────────────────────────────────────────
  body (flex col, items-center, justify-center, min-h-screen)
    └── #root (full width, flex col, items-center)
          └── App fragment
                ├── main
                │     └── controller group (pad + labels + button)
                ├── InstructionsModal (portal-like, fixed)
                └── footer (fixed, bottom)

  The "arrow-container" holds the pad plus its four axis labels.
  Labels are absolutely positioned but the container must have
  explicit padding so the labels don't clip on small screens.

  Label clearance: labels are ~0.9rem text + tracking. We give
  the container 28px of padding on all four sides (pt/pb for
  top/bottom labels, pl/pr for left/right labels).
  ─────────────────────────────────────────────────────────────
*/

// Shared label style — identical for all four directions
const labelClass =
  'absolute text-[0.75rem] font-medium tracking-[0.3em] text-white/60 uppercase pointer-events-none whitespace-nowrap'

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <main className="flex flex-col items-center w-full px-4 py-12">

        {/*
          Outer group: pad area + button, with breathing room between.
          gap-10 on desktop, gap-8 on mobile.
        */}
        <div className="flex flex-col items-center gap-8 sm:gap-10">

          {/*
            Arrow container — wraps the pad and its four directional labels.
            p-7 (28px) on all sides gives each label room to sit without clipping.
            The inner content (the pad itself) sizes itself via XYController.
          */}
          <div className="relative flex items-center justify-center p-7">

            {/* INTENSE — top, horizontally centred */}
            <span className={`${labelClass} top-0 left-1/2 -translate-x-1/2`}>
              INTENSE
            </span>

            {/* EXPANSIVE — bottom, horizontally centred */}
            <span className={`${labelClass} bottom-0 left-1/2 -translate-x-1/2`}>
              EXPANSIVE
            </span>

            {/* TIGHT — left, reads bottom-to-top */}
            <span className={`label-vertical ${labelClass} left-0 top-1/2 -translate-y-1/2 rotate-180`}>
              TIGHT
            </span>

            {/* MOTION — right, reads top-to-bottom */}
            <span className={`label-vertical ${labelClass} right-0 top-1/2 -translate-y-1/2`}>
              MOTION
            </span>

            <XYController isActive={isActive} setIsActive={setIsActive} />
          </div>

          {/* Instructions / title button */}
          <button
            className="
              bg-transparent
              border border-white/15 rounded-2xl
              px-5 py-2
              text-sm tracking-[0.18em] text-white/60
              cursor-pointer
              hover:border-gold hover:text-white/80
              transition-colors duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40
            "
            onClick={() => setShowInstructions(true)}
          >
            Sound-Guided Body Scan
          </button>
        </div>
      </main>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* Footer — watermark state while playing, readable on hover */}
      <footer
        className={`
          fixed bottom-0 inset-x-0 py-2
          flex items-center justify-center
          text-[0.7rem] tracking-wide text-white/30
          bg-charcoal/80
          transition-opacity
          ${isActive
            ? 'opacity-0 pointer-events-none duration-200 delay-0'
            : 'opacity-[0.45] duration-[2000ms] delay-[3000ms]'
          }
          hover:opacity-100 hover:duration-300 hover:delay-0
        `}
      >
        Rinat Tregerman © 2026 •{' '}
        <a
          href="https://soundssomatic.carrd.co/"
          className="ml-1 text-white/50 no-underline hover:text-gold transition-colors"
        >
          Learn more about the practice
        </a>
      </footer>
    </>
  )
}

export default App