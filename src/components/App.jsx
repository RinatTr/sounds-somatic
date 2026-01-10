import { useState } from 'react'
import '../css/App.css'
import XYController from './XYController'
import InstructionsModal from './InstructionsModal'

function App() {
  const [showInstructions, setShowInstructions] = useState(true)

  return (
    <>
      <div className="container">
        <div className="controller-wrapper">
          <div className="arrow-container">
            <div className="label-side label-left">TIGHT</div>
            <XYController />
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
      </div>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <div className="footer-credits">
        Created by Rinat Tregerman © 2026 •{' '}
        <a href="https://soundssomatic.carrd.co/">Learn more about the practice</a> • Beta Version
      </div>
    </>
  )
}

export default App
