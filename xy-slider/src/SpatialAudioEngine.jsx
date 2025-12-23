import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

const ACTIVE_NOTES = [100] // B
const HP_MIN = 50 // min high-pass frequency
const CHORUS_MIN = { frequency: 0.5, delayTime: 2.5, depth: 0.2, feedback: 0, wet: 0 }

function SpatialAudioEngine({ position, isActive }) {
  const engineRef = useRef(null)
  const startTokenRef = useRef(0)

  // ---------- build graph once ----------

  useEffect(() => {
  const output = new Tone.Gain(0.5).toDestination()

  const filter = new Tone.Filter({
    type: 'highpass',
    frequency: HP_MIN
  })

  const chorus = new Tone.Chorus(CHORUS_MIN)
  chorus.start()

  const reverb = new Tone.Reverb({
    decay: 0.5,
    wet: 0.5
  })

  const eq = new Tone.EQ3({
    low: -5,
    mid: -8,
    high: 0
  })

  const polySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle8' },
    envelope: {
      attack: 0.1,
      decay: 0.25,
      sustain: 0.7,
      release: 0.3
    }
  })

  // MAIN SIGNAL CHAIN
  polySynth.chain(
    eq,
    chorus,
    filter,
    reverb,
    output
  )

  // --- VIBE (amplitude micro-motion) ---
  const lfo = new Tone.LFO({ frequency: 0, min: -1, max: 1 })
  const vibeDepth = new Tone.Gain(0)
  lfo.connect(vibeDepth)
  vibeDepth.connect(output.gain)
  lfo.start()

  // --- DISTORTION (parallel) ---
  const dist = new Tone.Distortion(0.7)
  const distGain = new Tone.Gain(0)
  polySynth.connect(dist)
  dist.chain(distGain, filter)

  // --- NOISE (parallel) ---
  const noise = new Tone.Noise('pink')
  const noiseGain = new Tone.Gain(0)
  noise.chain(noiseGain, filter)
  noise.start()

  // generate reverb *after* context unlock
  reverb.generate()

  engineRef.current = {
    polySynth,
    eq,
    chorus,
    reverb,
    filter,
    distGain,
    noiseGain,
    lfo,
    vibeDepth,
    isPlaying: false
  }

  return () => {
    polySynth.dispose()
    eq.dispose()
    chorus.dispose()
    reverb.dispose()
    filter.dispose()
    dist.dispose()
    distGain.dispose()
    noise.dispose()
    noiseGain.dispose()
    lfo.dispose()
    vibeDepth.dispose()
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
    const context = Tone.getContext()

    if (context.state !== 'running') {
      await Tone.start()
    }

    // abort if a newer toggle happened
    if (token !== startTokenRef.current) return

    if (!engine.isPlaying) {
      engine.polySynth.triggerAttack(ACTIVE_NOTES[0])
      engine.isPlaying = true
    }
  }

  const stop = () => {
    // invalidate any pending start
    startTokenRef.current++

    if (engine.isPlaying) {
      engine.polySynth.triggerRelease(ACTIVE_NOTES[0])
      engine.isPlaying = false
    }
  }

  if (isActive) start()
  else stop()
}, [isActive])

  // ---------- spatial mapping ----------
  useEffect(() => {
     const engine = engineRef.current

    if (!engine) return

    console.log("noiseGain:", engine.noiseGain.gain.value.toFixed(4), "distGain:", engine.distGain.gain.value.toFixed(4), "filterFreq:", engine.filter.frequency.value.toFixed(1), "lfoFreq:", engine.lfo.frequency.value.toFixed(2), "lfoDepth:", engine.vibeDepth.gain.value.toFixed(4), "chorusWet:", engine.chorus.wet.value.toFixed(3));

    const clamp = (v) => Math.max(0, Math.min(100, v))
    const x = clamp(position.x)
    const y = clamp(position.y)

    // UP → high-pass
    const up = y < 40 ? (40 - y) / 40 : 0
    if (isActive && y <= 40) {
      const hp = HP_MIN * Math.pow(30, up) // 10 → 3000
      engine.filter.frequency.rampTo(hp, 0.08)
    }

    // Noise (Y <= 10)
    let noiseTarget = 0
    if (isActive && y <= 10) {
    const noiseNorm = (10 - y) / 10
    noiseTarget = noiseNorm * 0.05
    }
    engine.noiseGain.gain.rampTo(noiseTarget, 0.04)

    // Dist (Y <= 10)
    let distTarget = 0
    if (isActive && y <= 10) {
    const distNorm = (10 - y) / 10
    distTarget = distNorm * 0.7
    }
    engine.distGain.gain.rampTo(distTarget, 0.08)

    // LFO (left/right)
    const dx = Math.abs(x - 50) / 50

    // vibration rate (felt, not heard as wobble)
    const vibeRate = dx ** 1.4 * 20   // 0 → ~20 Hz
    const vibeDepth = dx * 0.1      // very small

    engine.lfo.frequency.rampTo(vibeRate, 0.1)
    engine.vibeDepth.gain.rampTo(vibeDepth, 0.12)


    // DOWN → chorus
    const down = y > 50 ? (y - 50) / 50 : 0

    engine.chorus.wet.rampTo(down * 0.6, 0.1)
        // depth saturates early, stays shallow
    engine.chorus.depth = 0.02 + Math.sqrt(down) * 0.06
  }, [position, isActive])

  return null
}

export default SpatialAudioEngine
