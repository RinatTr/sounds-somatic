import { END } from '../usePracticeRunner'

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
      timerDelayMs: 6000,
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
      controls: ['continue', 'exploreAgain'],
    //   timerDelayMs: 4000,
      transitions: {
        continue: 'experiencesInAwareness',
        exploreAgain: 'findSensation',
      },
    },
    // ---- make room around it ----
    experiencesInAwareness: {
      id: 'experiencesInAwareness',
      prompt:
        'Notice the sound holding the sensation as an experience happening in awareness.',
      timerDelayMs: 4000,
      transitions: { timer: 'notAllOfYou' },
    },
    notAllOfYou: {
      id: 'notAllOfYou',
      activatingEvent: 'timer',
      prompt: 'The sensation is real, yet is not who you are.',
      controls: ['continue'],
      transitions: { continue: 'noticeReaction' },
    },

    // ---- notice and allow the second arrows ----
    noticeReaction: {
      id: 'noticeReaction',
      prompt:
        'Notice any aversion, grasping or wish for the sensation to stop.',
      timerDelayMs: 7000,
      transitions: { timer: 'nameSecondArrow' },
    },
    nameSecondArrow: {
      id: 'nameSecondArrow',
      activatingEvent: 'timer',
      prompt: 'This added feeling may be the second arrow.',
      timerDelayMs: 6000,
      transitions: { timer: 'allowBoth' },
    },
    allowBoth: {
      id: 'allowBoth',
      activatingEvent: 'timer',
      prompt:
        'See if the sensation and your reaction to it can both be allowed for now.',
      controls: ['continue'],
      transitions: { continue: 'noticeWhatCanGo' },
    },

    // ---- loosen the second arrows ----
    noticeWhatCanGo: {
      id: 'noticeWhatCanGo',
      prompt:
        'Perhaps the added feeling can now loosen, even slightly.',
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
        'From the space that has opened, notice what kindness might offer.',
      timerDelayMs: 7000,
      transitions: { timer: 'compassionPhrase' },
    },
    compassionPhrase: {
      id: 'compassionPhrase',
      activatingEvent: 'timer',
      prompt:
        'Perhaps: “I see you, I am staying with you.”',
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