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


  console.clear();
  console.log({ x: position.x.toFixed(), y: position.y.toFixed() });
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
              top: `${position.y}%`
            }}
          />
        </div>
      </div>
    </>
  )
}

export default XYController
