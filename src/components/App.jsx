import { useState, Icon } from 'react'
import '../css/App.css'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'

function App() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <main className="container">
        <div className="controller-wrapper">
          <div className="arrow-container">
            <div className="label-side label-left">TIGHT</div>
            <XYController isActive={isActive} setIsActive={setIsActive} />
            <div className="label-side label-right">MOTION</div>
            <div className="label-pad label-top">INTENSE</div>
            <div className="label-pad label-bottom">EXPANSIVE</div>
          </div>

          <button
            className="instructions-button"
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

      <footer className={`footer-credits ${isActive ? 'is-active' : ''}`}>
        <div
          className="support-container" 
          style={{ marginBottom: '5px' }}>
          <a 
            className="support-link" 
            href="https://www.buymeacoffee.com/rinatreg" 
            target="_blank" 
            rel="noopener noreferrer"
          >
          <span className="support-content">
              Support this project
              <svg
                className="coffee-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
                <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
                <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
              </svg>
          </span>
          </a>
        </div>
        <div className="credits-content">
          Rinat Tregerman © 2026 •{' '}
          <a href="https://soundssomatic.carrd.co/">Learn more about the practice</a> 
        </div>
      </footer>
    </>
  )
}

export default App
