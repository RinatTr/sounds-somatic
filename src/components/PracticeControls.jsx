const LABELS = {
  begin: 'Start',
  continue: 'Continue',
  exploreAgain: 'Explore again',
  finish: 'Finish',
}

const BUTTON_CLASS =
  'bg-transparent border border-white/15 rounded-[14px] px-5 py-2 font text-[0.75rem] ' +
  'tracking-[0.2em] uppercase text-on-surface-variant cursor-pointer transition-colors ' 

/**
 * Renders whichever controls the current step declares. `onEvent` is called
 * with the control name ('begin' | 'continue' | 'exploreAgain' | 'finish'),
 * matching the event names the practice runner's dispatch() expects.
 *
 * The wrapper always reserves a fixed min-height, whether or not the current
 * step has any controls — so a mid-cascade step with no buttons (e.g. right
 * after a touch, before Continue/Explore again appear) doesn't shrink the
 * layout and shift the pad up, only to jump back down at the next step that
 * does have buttons.
 */
function PracticeControls({ controls, onEvent }) {
  const hasControls = controls && controls.length > 0

  return (
    <div className="min-h-[4rem] flex gap-4 justify-center items-center">
      {hasControls &&
        controls.map((control) => (
          <button
            key={control}
            type="button"
            className={BUTTON_CLASS}
            onClick={() => onEvent(control)}
          >
            {LABELS[control] ?? control}
          </button>
        ))}
    </div>
  )
}

export default PracticeControls
