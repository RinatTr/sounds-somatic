import './App.css'
import XYController from './XYController'

function App() {
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
    </>
  )
}

export default App
