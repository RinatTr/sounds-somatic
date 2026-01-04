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
          <span className="instructions-label">Sound-Guided Body Scan</span>
          <span className={`chevron ${isExpanded ? 'open' : ''}`}>⌄</span>
        </div>

        <div className={`instructions-body ${isExpanded ? 'expanded' : ''}`}>
          <p><strong>Sound and sensation share physical qualities.</strong></p>
          <p> As you move slowly around the pad, observe how the sound changes.</p>
             <p> Notice whether its qualities correspond to what you feel in your body:
              You might begin with intensity, adjusting the sound to match how strong a sensation is.
              Then notice whether the sensation has movement, texture, or spread, and adjust the sound accordingly.
              Additional qualities may also be present; you might spot a sound that describes them too. </p>      
             <p>Like in Vipassana, sound is used to detect, discern, and stay with sensations. </p>
          <p><i>The labels are only suggestions. Best experienced with speakers in a quiet room, or headphones.</i></p>
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
