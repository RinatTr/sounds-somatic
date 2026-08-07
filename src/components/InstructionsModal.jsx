import { useState } from 'react'

function InstructionsModal({ isOpen, onClose, PAGES }) {
  const [pageIndex, setPageIndex] = useState(0)
  const handleClose = () => {
    setPageIndex(0)
    onClose()
  }

  if (!isOpen) return null

  const isFirst = pageIndex === 0
  const isLast  = pageIndex === PAGES.length - 1

  return (
    /* Overlay */
    <div
      className="
        fixed inset-0 z-50
        bg-[rgba(22,22,22,0.7)]
        backdrop-blur-md
        flex items-center justify-center
        px-4
      "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Card */}
      <div
        className="
          glass-panel
          w-full max-w-[420px]
          rounded-[20px]
          animate-modal-in
          shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2
            id="modal-title"
            className="
              font-sans text-[1.05rem] tracking-[0.18em] font-bold
              text-white/75
            "
          >
            {PAGES[pageIndex].title}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close instructions"
            className="
              bg-transparent border-none
              text-white/60 text-xl
              cursor-pointer leading-none
              hover:text-white/90 transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet
              rounded
            "
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="
          px-5 pb-4
          [&_p]:font-sans 
          [&_p]:leading-[1.45]
          [&_p]:text-[clamp(1rem,3vw,1.25rem)]
          [&_p]:text-white/80 [&_p]:text-left
          [&_p+p]:mt-3
          overflow-y-auto max-h-[calc(100vh-200px)]
        ">
          {PAGES[pageIndex].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pt-3 pb-5">
          <button
            disabled={isFirst}
            onClick={() => setPageIndex((i) => i - 1)}
            className="
              bg-transparent border-none
              font-sans text-base text-white/70
              cursor-pointer
              disabled:opacity-30 disabled:cursor-default
              hover:text-white transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet
              rounded
            "
          >
            Back
          </button>

          <span className="font-sans text-[0.85rem] tracking-[0.15em] text-white/40">
            {pageIndex + 1} / {PAGES.length}
          </span>

          <button
            onClick={() => (isLast ? handleClose() : setPageIndex((i) => i + 1))}
            className="
              bg-transparent border-none
              font-sans text-base text-white/70
              cursor-pointer
              hover:text-white transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet
              rounded
            "
          >
            {isLast ? 'Close' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstructionsModal
