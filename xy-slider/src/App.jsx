import { useState } from 'react'
import './App.css'
import XYController from './XYController'

function App() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  }
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
        </div>
      </div>
      <div className="container">
      <div className="instructions-card">
        <div className="instructions-header" onClick={toggleExpand}>
          <span className="instructions-label">LISTENING NOTES</span>
          <span className={`chevron ${isExpanded ? 'open' : ''}`}>⌄</span>
        </div>

        <div className={`instructions-body ${isExpanded ? 'expanded' : ''}`}>
          <p><strong>Sound and sensation share physical qualities.</strong></p>
          <p>Move slowly around the pad and notice how the sound changes;</p>
          <p>Can you find a spot that matches your inner state?</p>
        </div>
      </div>
    </div>
      <div className="footer-credits">
        Created by Rinat Tregerman © 2026 • <a href="https://soundssomatic.carrd.co/">Learn more about the practice</a> • Beta Version
      </div>
    </>
  )
}

export default App
