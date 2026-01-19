import { useState } from 'react'
import '../css/InstructionsModal.css'

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
  const handleClose = () =>{
    setPageIndex(0)
    onClose()
  }
  if (!isOpen) return null

  const isFirst = pageIndex === 0
  const isLast = pageIndex === PAGES.length - 1

  return (
    <div  
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{PAGES[pageIndex].title}</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            aria-label="Close instructions"
            >
              ×
          </button>
        </div>

        <div className="modal-body">
          {PAGES[pageIndex].content}
        </div>

        <div className="modal-footer">
          <button
            disabled={isFirst}
            onClick={() => setPageIndex(i => i - 1)}
          >
            Back
          </button>

          <span className="modal-progress">
            {pageIndex + 1} / {PAGES.length}
          </span>

          <button
            onClick={() => isLast? handleClose() : setPageIndex(i => i + 1)}
          >
            {isLast ? "Close" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstructionsModal
