/**
 * Centralized audio configuration
 * All sound parameters, ranges, and mappings defined here for easy modification
 */

export const SYNTH = {
  init: {
      oscillator: { type: 'triangle8', detune: 1 },
        envelope: {
        attack: 0.1,
        decay: 0.25,
        sustain: 0.7,
        release: 0.3
    }
  }
}

export const NOTE = [98] // G2

export const FILTER = {
  highpass: {
    init: {
      type: 'highpass',
      frequency: 50,
     }
    },
  bandpass: {
    init: {
      type: 'bandpass',
      frequency: 650,
      Q: 0.6
    },
    ramp: {
        maxQ: 22
    } 
  }
}

export const EFFECTS = {
  filter: {
    highpass: {
    init: {
      type: 'highpass',
      frequency: 50,
     }
    },
  bandpass: {
    init: {
      type: 'bandpass',
      frequency: 650,
      Q: 0.6
    },
    ramp: {
        maxQ: 22
    } 
  }
  } ,
  eq: { 
    init: {
        low: -17,
        mid: -8,
        high: 0
    },
    },
  chorus: {
    init : {
        frequency: 0.5,
        delayTime: 2.5,
        depth: 0.2,
        feedback: 0,
        wet: 0,
    },
    ramp: {
        minWet: 0,
        maxWet: 0.8,
        depthMultiplier: 0.5
    }
  },
  reverb: {
    init: {
      decay: 0.7,
      wet: 0.8
    }
  },
  distortion: {
    max: 0.8,
    pressureDrive: 0.05
  },
  noise: {init:
    {
    type: 'pink'
  }},
  lfo: {
    init: { frequency: 0, min: -1, max: 1 },
    ramp: {
        minFreq: 0,
        maxFreq: 14,
        exponent: 1.4,
        maxDepth: 0.5
    },
  },
  widener: {
    default: 0.5,
    max: 1
  },
}

export const COORDINATE_RANGES = {
  intense: { min: 0, max: 40 },
  expansive: { min: 50, max: 100 },
  tight: { min: 0, max: 50 },
  motion: { min: 50, max: 100 },
  extremeIntense: { min: 0, max: 10 }
}

export const RAMP_TIMES = {
  fast: 0.04,
  medium: 0.08,
  slow: 0.1,
  smooth: 0.12
}