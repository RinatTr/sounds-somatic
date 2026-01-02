import { useState, useRef } from 'react'
import './XYController.css'
import SpatialAudioEngine from './SpatialAudioEngine'

function XYController() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isActive, setIsActive] = useState(false)
  const padRef = useRef(null)

  const handlePointerDown = (e) => {
    e.preventDefault()
    padRef.current.setPointerCapture(e.pointerId)
    setIsActive(true)
  }

  const handlePointerMove = (e) => {
    if (!isActive) return
    e.preventDefault()

    const rect = padRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
 
    //limit (reset to 0/100 edges) when moving outside of pad
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    })
  }

  const handlePointerUp = (e) => {
    e.preventDefault()
    padRef.current.releasePointerCapture(e.pointerId)
    setIsActive(false)
  }
console.log('isActive', isActive);
  return (
    <>
      <SpatialAudioEngine position={position} isActive={isActive} />
      <div className="xy-controller">
        <div
          ref={padRef}
          className="xy-pad"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          >
          <div
            className="xy-cursor"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              opacity: isActive ? 1 : 0.2 
            }}
          />
          {!isActive && (
            <div className="instruction-text">
              <span>Touch to begin.</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default XYController
