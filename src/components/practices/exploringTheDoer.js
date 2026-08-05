// "Exploring the doer" — see /practices/index.js for how this is registered.
//
// Modeling notes (kept here so future practices follow the same conventions):
// - This is one flat, ordered sequence of steps. It happens to contain three touch -> sound ->
//   reflect -> continue cascades back to back, but that's just what this
//   particular practice's content looks like, not a structural grouping the
//   runner or schema knows about. Step ids are named for what they show/do,
//   not for which "part" they belong to.
// - Every timed prompt change is its own step (flat graph, no nested
//   timelines).
// - `timerDelayMs` is measured from the moment THIS step became current, not
//   from the original touch/release event. The "1s then +2s" (=3s total
//   since touch) cascade is expressed as 1000 then 2000 below.
// - A step whose prompt is unchanged from the previous one (e.g. the instant
//   of touch, or the instant of release, before any timer-driven text change)
//   still gets its own step id — it exists to hold the soundAction and/or
//   start a timer, even though nothing visibly changes yet.
// - `soundAction: 'stop'` is applied on every "waiting for touch" step. This
//   is idempotent (harmless if nothing is playing) and is what kills a
//   previous cascade's sustained sound on Continue, and what "Explore again"
//   relies on to reset a cascade's sound.
// - "Release" steps carry forward the previously-shown prompt/secondaryPrompt
//   rather than introducing new copy — the spec doesn't author distinct text
//   for the instant of release itself. See the accompanying write-up.

import { END } from '../usePracticeRunner'

// Placeholder timings the spec described in words, not seconds — tune freely.
const PAUSE_BEFORE_NAMING_DELAY_MS = 4000 // "After several seconds..."
const BOUNDARY_SECONDARY_DELAY_MS = 2000 // "After a short delay..."

export const exploringTheDoer = {
  id: 'exploring-the-doer',
  title: "Observer's Dissolve",
  entryStepId: 'intro',
  steps: {
    intro: {
      id: 'intro',
      prompt: 'This is a practice in noticing the "observer".',
      controls: ['begin'],
      transitions: { begin: 'sensationPrompt' },
    },

    // ---- sensation -> sound -> soundsation ----
    sensationPrompt: {
      id: 'sensationPrompt',
      prompt: 'Let your attention find a sensation in your body.',
      soundAction: 'stop', // no-op on first entry; resets sound on "Explore again"
      transitions: { padTouch: 'sensationTouched' },
    },
    sensationTouched: {
      id: 'sensationTouched',
      activatingEvent: 'padTouch',
      prompt: 'Let your attention find a sensation in your body.',
      soundAction: 'sustain',
      transitions: { padRelease: 'soundReleased', timer: 'soundMatchPrompt' },
      timerDelayMs: 2000,
    },
    soundMatchPrompt: {
      id: 'soundMatchPrompt',
      activatingEvent: 'timer',
      prompt: 'Explore whether any sound seems to resemble it.',
      transitions: { padRelease: 'soundReleased', timer: 'soundMatchReady' },
      timerDelayMs: 4000, 
    },
    soundMatchReady: {
      id: 'soundMatchReady',
      activatingEvent: 'timer',
      prompt: 'If you find something close enough, release to let the sound stay.',
      transitions: { padRelease: 'soundReleased' },
    },
    soundReleased: {
      id: 'soundReleased',
      activatingEvent: 'padRelease',
      // carried forward — see modeling note above
      prompt: 'If you find something close enough, release to let the sound stay.',
      transitions: { timer: 'stayWithSound' },
      timerDelayMs: 3000,
    },
    stayWithSound: {
      id: 'stayWithSound',
      activatingEvent: 'timer',
      prompt: "If you'd like, stay with the sound and sensation together for a while.",
      controls: ['continue', 'exploreAgain'],
      transitions: { continue: 'doerPrompt', exploreAgain: 'sensationPrompt' },
    },

    // ---- notice and sonify the doer ----
    doerPrompt: {
      id: 'doerPrompt',
      prompt: 'As you move again, look for "who" is using the pad. You might notice the feeling of "me doing this."',
      soundAction: 'stop',
      transitions: { padTouch: 'doerTouched' },
    },
    doerTouched: {
      id: 'doerTouched',
      activatingEvent: 'padTouch',
      prompt: 'As you move again, look for "who" is using the pad. You might notice the feeling of "me doing this."',
      soundAction: 'sustain',
      transitions: { padRelease: 'doerReleased', timer: 'expressDoerPrompt' },
      timerDelayMs: 2000,
    },
    expressDoerPrompt: {
      id: 'expressDoerPrompt',
      activatingEvent: 'timer',
      prompt: 'See whether the sound can express something of that feeling. Release when it feels close enough.',
      transitions: { padRelease: 'doerReleased' },
    },
    doerReleased: {
      id: 'doerReleased',
      activatingEvent: 'padRelease',
      prompt: 'See whether the sound can express something of that feeling. Release when it feels close enough.',
      transitions: { timer: 'noticeAppearing' },
      timerDelayMs: 3000,
    },
    noticeAppearing: {
      id: 'noticeAppearing',
      activatingEvent: 'timer',
      prompt: 'Notice that even "me doing this" is something appearing in experience.',
      controls: ['continue', 'exploreAgain'],
      transitions: { continue: 'wholeProcessPrompt', exploreAgain: 'doerPrompt' },
    },

    // ---- include the whole process ----
    wholeProcessPrompt: {
      id: 'wholeProcessPrompt',
      prompt: 'Let sensation, intention, movement, sound, and "me doing it" all be here together.',
      soundAction: 'stop',
      transitions: { padTouch: 'wholeProcessTouched' },
    },
    wholeProcessTouched: {
      id: 'wholeProcessTouched',
      activatingEvent: 'padTouch',
      prompt: 'Let sensation, intention, movement, sound, and "me doing it" all be here together.',
      soundAction: 'sustain',
      controls: ['finish'],
      transitions: { finish: END },
    },
  },
}
