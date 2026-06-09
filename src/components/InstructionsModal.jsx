import { useState } from 'react'

const PAGES = [
  {
    title: "Welcome",
    content: (
      <>
        <p>This is a sound-guided mindfulness tool.</p>
        <p>Sound is used to explore sensations as they arise.</p>
        <p>You may stop at any time.</p>
      </>
    ),
  },
  {
    title: "The Idea",
    content: (
      <>
        <p>
          Sound and sensation share physical qualities. Focus on a sensation, and adjust the sound until
          it describes it as closely as possible.
        </p>
        <p>
          Over time, this trains attention and reduces reactivity.
        </p>
      </>
    ),
  },
  {
    title: "Using the Pad",
    content: (
      <>
        <p>Move slowly within the pad and observe how the sound changes.</p>
        <p>
          Stay with one sensation at a time.
          You might begin with intensity, matching the sound to how strong a sensation is.
          Then notice movement, texture, spread, and any other qualities, adjusting the sound accordingly.
        </p>
      </>
    ),
  },
  {
    title: "Notes",
    content: (
      <>
        <p>
          Like in Vipassana, sound is used to detect, discern, and stay with
          sensations.
        </p>
        <p>The labels are only suggestions.</p>
        <p>
          <i>Best experienced with speakers in a quiet room, or headphones. To hear audio on iOS 16 or older, ensure silent mode is off.</i>
        </p>
      </>
    ),
  },
]

function InstructionsModal({ isOpen, onClose }) {
  const [pageIndex, setPageIndex] = useState(0)

  const handleClose = () => {
    setPageIndex(0)
    onClose()
  }

  if (!isOpen) return null

  const isFirst = pageIndex === 0
  const isLast  = pageIndex === PAGES.length - 1

  return (
    <div
      className="fixed inset-0 bg-[rgba(22,22,22,0.7)] backdrop-blur-md flex items-center justify-center z-[1000]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* modal-card: gradient bg + blur defined in @layer components (purge-safe) */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-2">
          <h2
            id="modal-title"
            className="text-[1.1rem] tracking-[0.18em] font-bold text-white/75 m-0"
          >
            {PAGES[pageIndex].title}
          </h2>
          <button
            className="bg-transparent border-none text-white/60 text-xl cursor-pointer hover:text-white/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 p-0 leading-none"
            onClick={handleClose}
            aria-label="Close instructions"
          >
            ×
          </button>
        </div>

        {/* modal-body: p styles defined in @layer components (purge-safe) */}
        <div className="modal-body px-5 pb-4">
          {PAGES[pageIndex].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pt-3 pb-5">
          <button
            disabled={isFirst}
            className="bg-transparent border-none text-white/70 text-base cursor-pointer disabled:opacity-30 disabled:cursor-default hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 p-0"
            onClick={() => setPageIndex(i => i - 1)}
          >
            Back
          </button>

          <span className="text-[0.9rem] tracking-[0.15em] text-white/40">
            {pageIndex + 1} / {PAGES.length}
          </span>

          <button
            className="bg-transparent border-none text-white/70 text-base cursor-pointer hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 p-0"
            onClick={() => isLast ? handleClose() : setPageIndex(i => i + 1)}
          >
            {isLast ? "Close" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstructionsModal