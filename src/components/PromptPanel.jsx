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
function PromptPanel({ prompt, secondaryPrompt }) {
  const [displayedPrompt, setDisplayedPrompt] = useState(prompt)
  const [displayedSecondary, setDisplayedSecondary] = useState(secondaryPrompt)
  const [primaryVisible, setPrimaryVisible] = useState(true)
  const [secondaryVisible, setSecondaryVisible] = useState(!!secondaryPrompt)
  const timeoutRef = useRef(null)

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    if (prompt !== displayedPrompt) {
      // Genuine content change: fade the whole panel out, swap both lines,
      // fade back in together.
      setPrimaryVisible(false)
      setSecondaryVisible(false)
      timeoutRef.current = setTimeout(() => {
        setDisplayedPrompt(prompt)
        setDisplayedSecondary(secondaryPrompt)
        setPrimaryVisible(true)
        setSecondaryVisible(!!secondaryPrompt)
      }, FADE_MS)
      return () => clearTimeout(timeoutRef.current)
    }

    // Primary unchanged — only the secondary prompt may need to animate,
    // and only that line moves.
    if (secondaryPrompt !== displayedSecondary) {
      if (secondaryPrompt) {
        setDisplayedSecondary(secondaryPrompt)
        setSecondaryVisible(false)
        timeoutRef.current = setTimeout(() => setSecondaryVisible(true), SECONDARY_MOUNT_DELAY_MS)
      } else {
        setSecondaryVisible(false)
        timeoutRef.current = setTimeout(() => setDisplayedSecondary(null), FADE_MS)
      }
      return () => clearTimeout(timeoutRef.current)
    }

    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, secondaryPrompt])

  if (!displayedPrompt) return null

  return (
    <div
      className="max-w-md min-h-[5rem] text-center px-4 mb-6 flex flex-col justify-center"
      aria-live="polite"
    >
      <p
        className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed"
        style={{ opacity: primaryVisible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }}
      >
        {displayedPrompt}
      </p>
      {displayedSecondary && (
        <p
          className="font-sans text-sm md:text-base italic text-on-surface-variant/70 mt-2 leading-relaxed"
          style={{ opacity: secondaryVisible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }}
        >
          {displayedSecondary}
        </p>
      )}
    </div>
  )
}

export default PromptPanel
