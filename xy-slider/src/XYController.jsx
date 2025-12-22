import { useState, useRef } from 'react'
import './XYController.css'
import AudioEngine from './AudioEngine'

function XYController() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isActive, setIsActive] = useState(false)
  const padRef = useRef(null)

//   const handleMouseMove = (e) => {
//     const rect = padRef.current.getBoundingClientRect()
//     const x = ((e.clientX - rect.left) / rect.width) * 100
//     const y = ((e.clientY - rect.top) / rect.height) * 100

//     setPosition({
//       x: Math.max(0, Math.min(100, x)),
//       y: Math.max(0, Math.min(100, y))
//     })
//   }

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

  const handleTouchStart = () => {
    setIsActive(true)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
  }

  const handleTouchEnd = () => {
    setIsActive(false)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
  }
  console.clear();
  console.log({ x: position.x.toFixed(1), y: position.y.toFixed(1) });
  return (
    <>
      <AudioEngine position={position} isActive={isActive} />
      <div className="xy-controller">
        <div
          ref={padRef}
          className="xy-pad"
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
      </div>
    </>
  )
}

export default XYController
