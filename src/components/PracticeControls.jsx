import { useEffect, useState } from 'react'

const LABELS = {
  begin: 'Start',
  continue: 'Continue',
  exploreAgain: 'Redo step',
  finish: 'Finish',
}

const BUTTON_CLASS =
  'bg-transparent border border-white/15 rounded-[14px] px-5 py-2 font text-[0.75rem] ' +
  'tracking-[0.2em] uppercase text-on-surface-variant cursor-pointer transition-colors '

// Delay before a step's controls become available at all, so a button (e.g.
// "Continue") can't be clicked before there's been a moment to read the
// prompt it belongs to. Same interval for every step, on purpose.
const CONTROLS_REVEAL_DELAY_MS = 5000
// How long the fade-in itself takes, once revealed. Separate constant from
// the delay above — one is "wait", the other is "animation speed".
const CONTROLS_FADE_MS = 800
// Buttons mount at opacity 0, then flip to opacity 1 this many ms later —
// needed so there's an actual state change for the CSS transition to
// animate, instead of the button appearing already at opacity 1.
const MOUNT_FADE_DELAY_MS = 20

/**
 * Renders whichever controls the current step declares. `onEvent` is called
 * with the control name ('begin' | 'continue' | 'exploreAgain' | 'finish'),
 * matching the event names the practice runner's dispatch() expects.
 *
 * Controls only mount CONTROLS_REVEAL_DELAY_MS after `stepId` changes, and
 * fade in over CONTROLS_FADE_MS once mounted — they don't just pop in the
 * instant a step becomes current.
 *
 * The wrapper always reserves a fixed min-height, whether or not the current
 * step has any controls (or hasn't revealed them yet) — so nothing shrinks
 * the layout and shifts the pad up, only to jump back down later.
 */
function PracticeControls({ controls, stepId, onEvent }) {
  const hasControls = controls && controls.length > 0
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  // On a new step: hide/unmount immediately, wait CONTROLS_REVEAL_DELAY_MS,
  // then mount at opacity 0 and flip to visible one tick later so the CSS
  // transition has an actual state change to animate.
  useEffect(() => {
    setMounted(false)
    setVisible(false)

    let fadeTimeout
    const revealTimeout = setTimeout(() => {
      setMounted(true)
      fadeTimeout = setTimeout(() => setVisible(true), MOUNT_FADE_DELAY_MS)
    }, CONTROLS_REVEAL_DELAY_MS)

    return () => {
      clearTimeout(revealTimeout)
      clearTimeout(fadeTimeout)
    }
  }, [stepId])

  const showControls = hasControls && mounted

  return (
    <div className="min-h-[4rem] flex gap-4 justify-center items-center">
      {showControls &&
        controls.map((control) => (
          <button
            key={control}
            type="button"
            className={BUTTON_CLASS}
            onClick={() => onEvent(control)}
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity ${CONTROLS_FADE_MS}ms ease-in-out`,
            }}
          >
            {LABELS[control] ?? control}
          </button>
        ))}
    </div>
  )
}

export default PracticeControls