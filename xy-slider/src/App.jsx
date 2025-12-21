import './App.css'
import XYController from './XYController'

function App() {
  return (
    <>
      <div className="container">
        <div className="controller-wrapper">
          <div className="label-top">Intense</div>
          
          <div className="arrow-container">
            <div className="arrow arrow-up">▲</div>
            <div className="arrow arrow-left">◀</div>
            <XYController />
            <div className="arrow arrow-right">▶</div>
            <div className="arrow arrow-down">▼</div>
          </div>
          
          <div className="label-bottom">Expansive</div>
        </div>
      </div>
    </>
  )
}

export default App
