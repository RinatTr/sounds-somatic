import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Sentinel transition target meaning "end the practice."
 * A step's `transitions.finish` (or any transition) may point to this
 * instead of a real step id.
 */
export const END = '__end__'

/**
 * Drives a single Practice's step graph.
 *
 * A Practice is `{ id, title, entryStepId, steps: { [stepId]: Step } }`.
 * A Step is:
 *   {
 *     id: string,
 *     prompt: string,
 *     secondaryPrompt?: string,
 *     soundAction?: 'start' | 'sustain' | 'stop' | null,
 *     controls?: Array<'begin'|'continue'|'exploreAgain'|'finish'>,
 *     transitions?: {
 *       padTouch?: string, padRelease?: string, timer?: string,
 *       begin?: string, continue?: string, exploreAgain?: string, finish?: string,
 *     },
 *     timerDelayMs?: number, // only meaningful alongside transitions.timer
 *     activatingEvent?: string, // documentation only, not read by the runner
 *   }
 *
 * All actual sound side-effects are just the two setters below — this hook
 * never touches Tone.js or SpatialAudioEngine directly, so it has no
 * dependency on how sound is implemented.
 *
 * @param {object|null} practice - the active practice, or null for free play
 * @param {{ setIsActive: Function, setIsSustaining: Function, onComplete?: Function }} controls
 */
export function usePracticeRunner(practice, { setIsActive, setIsSustaining, onComplete }) {
  const [currentStepId, setCurrentStepId] = useState(practice?.entryStepId ?? null)
  const timerRef = useRef(null)

  const clearPendingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Reset whenever the selected practice changes (including switching to
  // free play, where practice is null). This is also what makes switching
  // practices mid-flow safe: pending timers are cancelled immediately.
  useEffect(() => {
    clearPendingTimer()
    setCurrentStepId(practice?.entryStepId ?? null)
  }, [practice])

  const currentStep = practice && currentStepId ? practice.steps[currentStepId] : null

  const applySoundAction = useCallback((action) => {
    if (action === 'sustain') {
      setIsSustaining(true)
    } else if (action === 'stop') {
      setIsSustaining(false)
      setIsActive(false)
    } else if (action === 'start') {
      setIsActive(true)
    }
    // null/undefined -> no sound side-effect
  }, [setIsActive, setIsSustaining])

  const goToStep = useCallback((stepId) => {
    clearPendingTimer()

    if (stepId === END) {
      setIsSustaining(false)
      setIsActive(false)
      onComplete?.()
      return
    }

    setCurrentStepId(stepId)
  }, [onComplete, setIsActive, setIsSustaining])

  // Whenever the current step changes: apply its entry sound action, and if
  // it declares a timer transition, schedule it. Cleanup clears the timer if
  // we leave this step for any reason before it fires — this is what
  // guarantees "previous timers must not fire after the user has left or
  // restarted a section."
  useEffect(() => {
    if (!currentStep) return undefined

    applySoundAction(currentStep.soundAction)

    const timerTarget = currentStep.transitions?.timer
    if (timerTarget && currentStep.timerDelayMs != null) {
      timerRef.current = setTimeout(() => {
        goToStep(timerTarget)
      }, currentStep.timerDelayMs)
    }

    return () => clearPendingTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  const dispatch = useCallback((event) => {
    if (!currentStep) return
    const target = currentStep.transitions?.[event]
    if (!target) return // event not valid from this step -> ignored
    goToStep(target)
  }, [currentStep, goToStep])

  // Data-driven interactivity: the pad only responds while the current step
  // actually declares padTouch or padRelease as a valid transition. Before
  // "begin" and after "finish" this is naturally false with no special-casing.
  const isPadInteractive = !!(
    currentStep?.transitions?.padTouch || currentStep?.transitions?.padRelease
  )

  return { currentStep, dispatch, isPadInteractive }
}
