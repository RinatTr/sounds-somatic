import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

const ACTIVE_NOTES = [98] //G2
const HP_MIN = 50
const CHORUS_MIN = {
  frequency: 0.5,
  delayTime: 2.5,
  depth: 0.2,
  feedback: 0,
  wet: 0
}

function SpatialAudioEngine({ position, isActive }) {
  // null until mounted
  const engineRef = useRef(null)
  /* start token to avoid race conditions as a result of rapid user interaction. 
    useRef so it persists across renders.
    the idea is to increment it on each start/stop request, and capture its value
    in the async start function. Then, after any await, check if the token is still the same.
    If not, it means a newer start/stop request has occurred, and we should abort the current one.
  */
  const startTokenRef = useRef(0)

  // ---------- build graph once ----------

  useEffect(() => {
    const output = new Tone.Gain(0.7).toDestination()

    // ---------- CORE VOICE ----------
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle8', detune: 2 },
      envelope: {
        attack: 0.1,
        decay: 0.25,
        sustain: 0.7,
        release: 0.3
      }
    })

    const eq = new Tone.EQ3({
      low: -17,
      mid: -8,
      high: 0
    })

    const highpass = new Tone.Filter({
      type: 'highpass',
      frequency: HP_MIN
    })

    const chorus = new Tone.Chorus(CHORUS_MIN)
    chorus.start()

    const reverb = new Tone.Reverb({
      decay: 0.8,
      wet: 0.9
    })

    // ---------- OPEN PATH (center + right) ----------
    const openGain = new Tone.Gain(1)

    polySynth.chain(
      eq,
      highpass,
      chorus,
      reverb,
      openGain,
      output
    )

    // ---------- PRESSURE PATH (left) ----------
    const pressureFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: 650,
      Q: 0.6
    })

    const pressureGain = new Tone.Gain(0)
    const pressureDrive = new Tone.Distortion(0.12)

    polySynth.chain(
      eq,
      pressureFilter,
      pressureDrive,
      pressureGain,
      highpass,
      chorus,
      reverb,
      output
    )

    // ---------- MOTION (RIGHT ONLY) ----------
    const lfo = new Tone.LFO({ frequency: 0, min: -1, max: 1 })
    const vibeDepth = new Tone.Gain(0)
    lfo.connect(vibeDepth)
    vibeDepth.connect(output.gain)
    lfo.start()

    // ---------- DISTORTION (parallel, respects pressure) ----------
    const dist = new Tone.Distortion(0.5)
    const distGain = new Tone.Gain(0)

    polySynth.connect(dist)
    dist.chain(distGain, pressureFilter)
    distGain.connect(highpass)

    // ---------- NOISE (parallel, respects pressure) ----------
    const noise = new Tone.Noise('pink')
    const noiseGain = new Tone.Gain(0)

    noise.chain(noiseGain, pressureFilter)
    noiseGain.connect(highpass)
    noise.start()

    reverb.generate()

    engineRef.current = {
      polySynth,
      eq,
      highpass,
      chorus,
      reverb,
      openGain,
      pressureFilter,
      pressureGain,
      distGain,
      noiseGain,
      lfo,
      vibeDepth,
      isPlaying: false
    }

    return () => {
      Object.values(engineRef.current || {}).forEach(n => n?.dispose?.())
      output.dispose()
      engineRef.current = null
    }
  }, [])

  // ---------- start / stop ----------
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
 
    const token = ++startTokenRef.current

    const start = async () => {
      // we initialized Tone context on pointer down in xycontroller
      // if a newer start/stop request has occurred, abort
      if (token !== startTokenRef.current) return

      if (Tone.getContext().state !== 'running') {
        // engine boundary — wait until audio is real to triggerAttack
        await Tone.start();
        if (token !== startTokenRef.current) return;
      }

      if (!engine.isPlaying) {
        engine.polySynth.triggerAttack(ACTIVE_NOTES[0])
        engine.isPlaying = true
      }
    } 

    const stop = () => {
      startTokenRef.current++
      if (engine.isPlaying) {
        engine.polySynth.triggerRelease(ACTIVE_NOTES[0])
        engine.isPlaying = false
      }
    }
    // isActive changes when user touches / releases pad
    isActive ? start() : stop()

  }, [isActive])

  // ---------- spatial mapping ----------
  useEffect(() => {
    // reference to existing audio engine
    const engine = engineRef.current
    if (!engine) return
    //constrains a numeric value to stay within the range of 0 to 100 (we have already limiter in controller)
    /* // const clamp = v => Math.max(0, Math.min(100, v))
    const x = clamp(position.x)
    const y = clamp(position.y)*/
    const [x,y] = [position.x, position.y]

    // ----------- UP → Intense (high-pass filter + noise + distortion) ----------
    if (isActive && y <= 40) {
      const up = (40 - y) / 40
      const hp = HP_MIN * Math.pow(20, up)
      engine.highpass.frequency.rampTo(hp, 0.08)
    }

    // Noise (Y <= 10)
    const noise = isActive && y <= 10 ? ((10 - y) / 10) * 0.05 : 0
    engine.noiseGain.gain.rampTo(noise, 0.04)

    // Distortion (Y <= 10)
    const dist = isActive && y <= 10 ? ((10 - y) / 10) * 0.8 : 0
    engine.distGain.gain.rampTo(dist, 0.08)

    // ---------- RIGHT → motion (LFO) ----------
    const right = x > 50 ? (x - 50) / 50 : 0
    engine.lfo.frequency.rampTo(right ** 1.4 * 14, 0.1)
    engine.vibeDepth.gain.rampTo(right * 0.5, 0.05)

    // ---------- LEFT → tight (filter)----------
    const left = x < 50 ? (50 - x) / 50 : 0
    const minQ = 0.6
    const maxQ = 22
    engine.pressureFilter.Q.rampTo(
      minQ + left ** 1.3 * (maxQ - minQ),
      0.1
    )
    // makeup gain so tightness stays audible
    engine.pressureGain.gain.rampTo(left * 2.8, 0.12)
    engine.openGain.gain.rampTo(1 - left * 1.4, 0.12)

    // ----------- DOWN → expansive (chorus)
    const down = y > 50 ? (y - 50) / 50 : 0
    engine.chorus.wet.rampTo(0.15 + down * 0.6, 0.1)
    engine.chorus.depth = 1 + Math.sqrt(down) * 0.5


  }, [position, isActive])

  return null
}

export default SpatialAudioEngine
