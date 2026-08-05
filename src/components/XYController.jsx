import { useState, useRef, useCallback, useEffect } from 'react'
import SpatialAudioEngine from './SpatialAudioEngine'
import * as Tone from 'tone'

function XYController({
  isActive,
  setIsActive,
  theme,
  isSustaining,
  disabled = false,
  onPadTouch,
  onPadRelease,
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  // Tracks literal physical contact with the pad, independent of `isActive`.
  // Needed because sustain mode keeps `isActive` true after release, so
  // `isActive` alone can no longer answer "is a pointer actually down?"
  const [isPressed, setIsPressed] = useState(false)
  const padRef = useRef(null)

  // Build the gradient string from the current theme
  const buildGradient = useCallback((x, y) =>
    `radial-gradient(circle at ${x}% ${y}%, ${theme.hot} 0%, ${theme.dark} 100%)`,
  [theme])

  // When theme changes while pad is idle, update the resting gradient
  useEffect(() => {
    if (padRef.current) {
      padRef.current.style.background = buildGradient(50, 50)
    }
  }, [theme, buildGradient])

  // Update both the React state (for the audio engine) AND the pad's
  // inline background so the gradient follows the cursor without a re-render cycle.
  const updatePosition = useCallback((e) => {
    const rect = padRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width)  * 100
    const rawY = ((e.clientY - rect.top)  / rect.height) * 100
    const x = Math.max(0, Math.min(100, rawX))
    const y = Math.max(0, Math.min(100, rawY))

    setPosition({ x, y })

    // Direct DOM write keeps the gradient smooth without a re-render
    if (padRef.current) {
      padRef.current.style.background = buildGradient(x, y)
    }
  }, [buildGradient])

  const handlePointerDown = useCallback((e) => {
    // While disabled (e.g. a guided practice's current step hasn't declared
    // a touch transition yet), the pad is fully inert: no position update,
    // no sound, no notification to the caller.
    if (disabled) return

    e.preventDefault()
    padRef.current.setPointerCapture(e.pointerId)
    updatePosition(e)

    // Unblock audio session on iOS Safari 17+
    if (navigator.audioSession) {
      navigator.audioSession.type = 'playback'
    }
    setIsPressed(true)
    // Always true on press — this covers both a fresh touch and resuming
    // control of an already-sustaining sound; either way the pad is "live."
    setIsActive(true)
    if (Tone.getContext().state !== 'running') {
      Tone.start()
    }
    onPadTouch?.()
  }, [disabled, updatePosition, setIsActive, onPadTouch])

  const handlePointerMove = useCallback((e) => {
    // Gate on physical contact, not `isActive` — while sustaining after
    // release, `isActive` is still true but hover/move must do nothing.
    if (!isPressed) return
    e.preventDefault()
    updatePosition(e)
  }, [isPressed, updatePosition])

  const handlePointerUp = useCallback((e) => {
    if (!isPressed) return
    e.preventDefault()
    padRef.current.releasePointerCapture(e.pointerId)
    setIsPressed(false)

    // Sustain off: release stops the sound, same as before.
    // Sustain on: release freezes `position` and leaves `isActive` true —
    // the sound keeps playing at the last touched point.
    if (!isSustaining) {
      setIsActive(false)
    }
    onPadRelease?.()
  }, [isPressed, isSustaining, setIsActive, onPadRelease])

  // Reacts to the sustain toggle itself (not a pointer event, so it needs
  // its own effect). If sustain is switched off while nothing is pressed,
  // stop the sustained sound immediately. If something IS pressed when it's
  // switched off, do nothing here — handlePointerUp stops it on release.
  useEffect(() => {
    if (!isSustaining && !isPressed) {
      setIsActive(false)
    }
  }, [isSustaining, isPressed, setIsActive])

  // Cursor ring + glow derived from theme
  const cursorStyle = {
    left:      `${position.x}%`,
    top:       `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    borderColor: theme.ring,
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
  }

  return (
    <>
      <SpatialAudioEngine position={position} isActive={isActive} />

      {/*
        Outer wrapper — no extra padding, just centers the pad.
        Width/height are set responsively on the pad itself.
      */}
      <div className="flex items-center justify-center">
        <div
          ref={padRef}
          /* Sizing: 288px mobile → 384px md+ (matches reference w-72/md:w-96) */
          className="
            relative
            w-72 h-72 md:w-96 md:h-96
            rounded-[10px]
            shadow-2xl
            practice-pad-bg inner-glow-violet
            overflow-hidden
            cursor-crosshair
            select-none
            touch-action-none
          "
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none',
            // Initial gradient — overwritten by updatePosition on interaction
            background: buildGradient(50, 50),
            opacity: disabled ? 0.6 : 1,
            transition: 'opacity 0.3s ease',
          }}
          role="region"
          aria-label="Sound exploration pad"
          aria-disabled={disabled}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >

          {/* Cursor ring — visible only while physically pressed. Hidden
              while passively sustaining after release, even though isActive
              is still true. */}
          <div
            aria-hidden="true"
            className={`
              absolute
              w-12 h-12 rounded-full
              border-2 border-white
              flex items-center justify-center
              pointer-events-none
              ${isPressed ? 'opacity-90' : 'opacity-0'}
            `}
            style={cursorStyle}
          >
          </div>

          {/* Idle instruction text — hidden by isActive, which correctly
              stays true (and so keeps this hidden) throughout a sustain.
              Also hidden while disabled, since a practice's own PromptPanel
              is showing the relevant text instead. */}
          {!isActive && !disabled && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
                pointer-events-none
              "
              aria-hidden="true"
            >
              <span className="
                font-sans text-lg font-light
                text-white/90
                tracking-[0.10em]
                text-center
                drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]
              ">
               Touch and hold to begin.
              </span>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default XYController
