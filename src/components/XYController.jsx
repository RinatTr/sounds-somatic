import { useState, useRef } from 'react'
import SpatialAudioEngine from './SpatialAudioEngine'
import * as Tone from 'tone'

function XYController({ isActive, setIsActive }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const padRef = useRef(null)

  const handlePointerDown = (e) => {
    e.preventDefault()
    padRef.current.setPointerCapture(e.pointerId)
    updatePosition(e)
    if (navigator.audioSession) {
      navigator.audioSession.type = 'playback'
    }
    setIsActive(true)
    if (Tone.getContext().state !== 'running') {
      Tone.start()
    }
  }

  const handlePointerMove = (e) => {
    if (!isActive) return
    e.preventDefault()
    updatePosition(e)
  }

  const handlePointerUp = (e) => {
    e.preventDefault()
    padRef.current.releasePointerCapture(e.pointerId)
    setIsActive(false)
  }

  const updatePosition = (e) => {
    const rect = padRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  return (
    <>
      <SpatialAudioEngine position={position} isActive={isActive} />

      {/*
        The pad is a square that scales with the viewport.
        - On mobile (< 640px): fills most of the screen width with a max cap
        - On desktop: fixed comfortable size
        w-[min(72vw,300px)] — takes 72% of vw on small screens, caps at 300px on large
      */}
      <div
        ref={padRef}
        className="
          relative
          w-[min(72vw,300px)] aspect-square
          rounded-[26px]
          bg-[radial-gradient(circle_at_center,#E8D196_0%,#7CB9B5_70%,#68A39F_100%)]
          shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_0_60px_rgba(255,255,255,0.1)]
          select-none touch-none
          [-webkit-user-select:none] [-webkit-touch-callout:none]
          cursor-crosshair overflow-hidden
        "
        role="region"
        aria-label="Sound exploration pad"
        tabIndex="0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Cursor ring */}
        <div
          className={`
            absolute w-[58px] h-[58px]
            bg-transparent border-2 border-white/90 rounded-full
            -translate-x-1/2 -translate-y-1/2
            shadow-[0_0_15px_rgba(255,255,255,0.4),inset_0_0_10px_rgba(255,255,255,0.2)]
            pointer-events-none transition-transform
            ${isActive ? 'scale-95 shadow-[0_0_25px_rgba(255,255,255,0.6)] border-white' : ''}
          `}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            opacity: isActive ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {/* Idle instruction text */}
        {!isActive && (
          <p className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-4/5
            text-white/90 text-base
            [text-shadow:0_0_15px_rgba(0,0,0,0.6)]
            text-center pointer-events-none
            font-normal tracking-[0.12em]
            m-0
          ">
            Touch and hold to begin.
          </p>
        )}
      </div>
    </>
  )
}

export default XYController