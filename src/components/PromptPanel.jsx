import { useEffect, useRef, useState } from 'react'

const FADE_MS = 800

/**
 * Displays the current practice prompt.
 *
 * The prompt is positioned absolutely by App, so mounting, unmounting,
 * or changing its height does not move the XY controller.
 */
function PromptPanel({ prompt }) {
  const [displayedPrompt, setDisplayedPrompt] = useState(prompt)
  const [isVisible, setIsVisible] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    clearTimeout(timeoutRef.current)

    if (prompt !== displayedPrompt) {
      setIsVisible(false)

      timeoutRef.current = setTimeout(() => {
        setDisplayedPrompt(prompt)
        setIsVisible(true)
      }, FADE_MS)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [prompt, displayedPrompt])

  if (!displayedPrompt) return null

  return (
  <div
  className="h-full flex flex-col justify-center px-4 text-center"
  aria-live="polite"
>
  <p
    className="font-sans font-thin text-base md:text-lg tracking-normal leading-snug text-on-surface-variant break-words whitespace-normal"
    style={{
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${FADE_MS}ms ease-in-out`,
    }}
  >
    {displayedPrompt}
  </p>
</div>
  )
}

export default PromptPanel