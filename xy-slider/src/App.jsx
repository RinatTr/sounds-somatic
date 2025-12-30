import { useState } from 'react'
import './App.css'
import XYController from './XYController'

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {

    setIsExpanded(!isExpanded);
  }
  return (
    <>
      <div className="container">
        <div className="controller-wrapper">
          <div className="arrow-container">
            <div className="arrow arrow-up">▲</div>
            <div className="label-side label-left">TIGHT</div>
            <div className="arrow arrow-left">◀</div>
            <XYController />
            <div className="arrow arrow-right">▶</div>
            <div className="label-side label-right">MOTION</div>
            <div className="arrow arrow-down">▼</div>
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
          <p>Sound and sensation share physical qualities.</p>
          <p>Move slowly and notice how the sound changes.</p>
          <p>The labels around the pad are only suggestions.</p>
          <p>Let the sound help you sense what is present.</p>
        </div>
      </div>
    </div>
      <div className="credits">
      </div>
    </>
  )
}

export default App
