import { useState } from 'react'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <main className="flex flex-col items-center w-full px-4 py-12">
        <div className="flex flex-col items-center gap-8 sm:gap-10">

          {/*
            Arrow container — p-7 gives each absolutely-positioned label
            enough room so nothing clips outside the box on any screen size.
          */}
          <div className="relative flex items-center justify-center p-7">

            {/* INTENSE — top */}
            <span className="axis-label top-0 left-1/2 -translate-x-1/2">
              INTENSE
            </span>

            {/* EXPANSIVE — bottom */}
            <span className="axis-label bottom-0 left-1/2 -translate-x-1/2">
              EXPANSIVE
            </span>

            {/* TIGHT — left, reads bottom-to-top */}
            <span className="axis-label label-vertical left-0 top-1/2 -translate-y-1/2 rotate-180">
              TIGHT
            </span>

            {/* MOTION — right, reads top-to-bottom */}
            <span className="axis-label label-vertical right-0 top-1/2 -translate-y-1/2">
              MOTION
            </span>

            <XYController isActive={isActive} setIsActive={setIsActive} />
          </div>

          <button
            className="bg-transparent border border-white/15 rounded-2xl px-5 py-2 text-sm tracking-[0.18em] text-white/60 cursor-pointer hover:border-gold hover:text-white/80 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
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

      <footer
        className={
          'fixed bottom-0 inset-x-0 py-2 flex items-center justify-center text-[0.7rem] tracking-wide text-white/30 bg-charcoal/80 transition-opacity ' +
          (isActive
            ? 'opacity-0 pointer-events-none duration-200 delay-0'
            : 'opacity-[0.45] duration-[2000ms] delay-[3000ms] hover:opacity-100 hover:duration-300 hover:delay-0')
        }
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