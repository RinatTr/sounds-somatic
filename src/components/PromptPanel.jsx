import { useEffect, useRef, useState } from 'react'

const FADE_MS = 800
const SECONDARY_MOUNT_DELAY_MS = 20 // let the secondary line mount hidden before fading in

/**
 * Renders the current step's prompt (+ optional secondary prompt).
 *
 * The primary prompt only fades out/in when its TEXT actually changes. When
 * only the secondary prompt appears, changes, or disappears (the common case
 * of a step "adding" a secondary line under an unchanged primary), only the
 * secondary line animates — the primary line is left alone so it doesn't
 * visibly retrigger.
 *
 * The wrapper reserves a fixed min-height sized for the tallest expected
 * content (primary + secondary), so a step with a secondary prompt
 * appearing/disappearing doesn't shift the pad below it. See
 * PracticeControls for the equivalent treatment of the button row.
 */
function PromptPanel({ prompt }) {
  const [displayedPrompt, setDisplayedPrompt] = useState(prompt)
  const [primaryVisible, setPrimaryVisible] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    if (prompt !== displayedPrompt) {
      // Genuine content change: fade the whole panel out, swap both lines,
      // fade back in together.
      setPrimaryVisible(false)
      timeoutRef.current = setTimeout(() => {
        setDisplayedPrompt(prompt)
        setPrimaryVisible(true)

      }, FADE_MS)
      return () => clearTimeout(timeoutRef.current)
    }

    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt])

  if (!displayedPrompt) return null

  return (
    <div
      className="max-w-md min-h-[3.5rem] text-center px-4 mb-4 flex flex-col justify-center"
      aria-live="polite"
    >
      <p
        className="font-sans tracking-[0.05em] text-base md:text-lg text-on-surface-variant leading-relaxed"
        style={{ opacity: primaryVisible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }}
      >
        {displayedPrompt}
      </p>
    </div>
  )
}

export default PromptPanel
