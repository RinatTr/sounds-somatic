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
            <div className="label-pad label-left">TIGHT</div>
            <XYController isActive={isActive} setIsActive={setIsActive} />
            <div className="label-pad label-right">MOTION</div>
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
        <div className="credits-content">
          Rinat Tregerman © 2026 •{' '}
          <a href="https://soundssomatic.carrd.co/">Learn more about the practice</a> 
        </div>
      </footer>
    </>
  )
}

export default App
