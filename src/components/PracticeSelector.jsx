import { PRACTICES } from './practices'

const FREE_PLAY_VALUE = 'free-play'

/**
 * `selectedId` is null for free play, or a practice id. onSelect is called
 * with null or the chosen practice id.
 */
function PracticeSelector({ selectedId, onSelect }) {
  return (
    <select
      value={selectedId ?? FREE_PLAY_VALUE}
      onChange={(e) => {
        const value = e.target.value
        onSelect(value === FREE_PLAY_VALUE ? null : value)
      }}
      aria-label="Choose a practice"
      className="
        bg-transparent 
        px-4 py-2 font-sans text-xs tracking-[0.15em] uppercase
        text-on-surface-variant cursor-pointer rounded
      "
    >
      <option value={FREE_PLAY_VALUE}>Free Play</option>
      {PRACTICES.map((practice) => (
        <option key={practice.id} value={practice.id}>
          {practice.title}
        </option>
      ))}
    </select>
  )
}

export default PracticeSelector
