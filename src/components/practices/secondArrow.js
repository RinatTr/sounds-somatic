import { END } from '../usePracticeRunner'

// Buffer between release and the continue/exploreAgain controls becoming
// available. Same reasoning as exploringTheDoer.js's READY_TO_FINISH_DELAY_MS
// — controls-bearing steps should be reached via `timer`, not directly off a
// pointer-event handler (padTouch/padRelease), to avoid the button flickering
// in on entry.
const SOUND_HELD_DELAY_MS = 1500

export const secondArrow = {
  id: 'second-arrow',
  title: 'Second Arrow',
  entryStepId: 'intro',
  steps: {
    intro: {
      id: 'intro',
      prompt:
        'Bring to mind something difficult, but manageable enough to stay with.',
      controls: ['begin'],
      transitions: { begin: 'findSensation' },
    },

    // ---- feel and match ----
    findSensation: {
      id: 'findSensation',
      prompt: 'Notice where the difficulty is felt in your body.',
      soundAction: 'stop',
      transitions: { padTouch: 'sensationTouched' },
    },
    sensationTouched: {
      id: 'sensationTouched',
      activatingEvent: 'padTouch',
      prompt: 'Notice where the difficulty is felt in your body.',
      soundAction: 'sustain',
      timerDelayMs: 2000,
      transitions: {
        padRelease: 'soundReleased',
        timer: 'matchSound',
      },
    },
    matchSound: {
      id: 'matchSound',
      activatingEvent: 'timer',
      prompt: 'Explore whether a sound can resemble the sensation.',
      timerDelayMs: 5000,
      transitions: {
        padRelease: 'soundReleased',
        timer: 'releaseWhenReady',
      },
    },
    releaseWhenReady: {
      id: 'releaseWhenReady',
      activatingEvent: 'timer',
      prompt: 'When it feels close enough, release to let the sound stay.',
      transitions: { padRelease: 'soundReleased' },
    },

    // ---- let the sound hold it ----
    soundReleased: {
      id: 'soundReleased',
      activatingEvent: 'padRelease',
      prompt: 'For a moment, let the sound hold the sensation with you.',
      soundAction: 'sustain',
      // No controls here on purpose — see the note at the top of this file.
      transitions: { timer: 'soundHeld' },
      timerDelayMs: SOUND_HELD_DELAY_MS,
    },
    soundHeld: {
      id: 'soundHeld',
      activatingEvent: 'timer',
      // carried forward — no new copy authored for this brief pause
      prompt: 'For a moment, let the sound hold the sensation with you.',
      controls: ['continue', 'exploreAgain'],
      transitions: {
        continue: 'experiencesInAwareness',
        exploreAgain: 'findSensation',
      },
    },

    // ---- make room around it ----
    experiencesInAwareness: {
      id: 'experiencesInAwareness',
      prompt:
        'Notice the experience of the sound holding the sensation.',
      timerDelayMs: 6000,
      transitions: { timer: 'theOpenness' },
    },
     theOpenness: {
      id: 'theOpenness',
      prompt:
        'Now, notice the openness in which anything else could appear alongside it.',
      timerDelayMs: 8000,
      transitions: { timer: 'notAllOfYou' },
    },

    notAllOfYou: {
      id: 'notAllOfYou',
      activatingEvent: 'timer',
      prompt: "Let the sensation happen on its own, like the sound. Try to sense its bare qualities.",
      controls: ['continue'],
      transitions: { continue: 'noticeReaction' },
    },

    // ---- notice and allow the second arrows ----
    noticeReaction: {
      id: 'noticeReaction',
      prompt:
        'Notice whether anything else is happening around it.',
      timerDelayMs: 7000,
      transitions: { timer: 'nameSecondArrow' },
    },
    nameSecondArrow: {
      id: 'nameSecondArrow',
      activatingEvent: 'timer',
      prompt: 'Any added tightening or effort may be the second arrow.',
      timerDelayMs: 6000,
      transitions: { timer: 'allowBoth' },
    },
    allowBoth: {
      id: 'allowBoth',
      activatingEvent: 'timer',
      prompt:
        'Let the sensation and what gathers around it both be here for now.',
      controls: ['continue'],
      transitions: { continue: 'noticeWhatCanGo' },
    },

    // ---- loosen the second arrows ----
    noticeWhatCanGo: {
      id: 'noticeWhatCanGo',
      prompt:
        'Perhaps you can relax the added efforts and reactions, even slightly.',
      timerDelayMs: 7000,
      transitions: { timer: 'allowRemaining' },
    },
    allowRemaining: {
      id: 'allowRemaining',
      activatingEvent: 'timer',
      prompt: 'If it remains, let that be allowed too.',
      controls: ['continue'],
      transitions: { continue: 'inviteCompassion' },
    },

    // ---- invite compassion ----
    inviteCompassion: {
      id: 'inviteCompassion',
      prompt:
        'From whatever space is here, notice what kindness might offer.',
      timerDelayMs: 7000,
      transitions: { timer: 'compassionPhrase' },
    },
    compassionPhrase: {
      id: 'compassionPhrase',
      activatingEvent: 'timer',
      prompt:
        'Perhaps: “This is difficult. I am here with it.”',
      timerDelayMs: 7000,
      transitions: { timer: 'carryKindness' },
    },
    carryKindness: {
      id: 'carryKindness',
      activatingEvent: 'timer',
      prompt:
        'Let yourself carry that kindness towards that spot.',
      controls: ['finish'],
      transitions: { finish: END },
    },
  },
}