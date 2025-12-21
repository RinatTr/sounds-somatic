import { useState, useRef } from 'react'
import './XYController.css'

function XYController() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const padRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = padRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    })
  }

  const handleTouchMove = (e) => {
    const rect = padRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    })
  }

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = () => {
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  }

  const handleTouchEnd = () => {
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
  }

  return (
    <div className="xy-controller">
      <div
        ref={padRef}
        className="xy-pad"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="xy-cursor"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`
          }}
        />
      </div>
      <div className="xy-values">
        <div className="value-display">
          <span className="label">X:</span>
          <span className="value">{position.x.toFixed(1)}</span>
        </div>
        <div className="value-display">
          <span className="label">Y:</span>
          <span className="value">{position.y.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

export default XYController
