import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

const ACTIVE_NOTES = [98] // 

function SpatialAudioEngine({ position, isActive }) {
  const engineRef = useRef(null)
  const startTokenRef = useRef(0)

  // ---------- build graph once ----------
  useEffect(() => {
    const master = new Tone.Gain(0.50).toDestination()

    const filter = new Tone.Filter({
      type: 'highpass',
      frequency: 10
    }).connect(master)

    const chorus = new Tone.Chorus({
      frequency: 1.6,
      delayTime: 3.5,
      depth: 0.4,
      feedback: 0.1,
      wet: 0
    }).connect(filter)
    chorus.start()

    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle8' },
      envelope: {
        attack: 0.1,
        decay: 0.25,
        sustain: 0.7,
        release: 0.8
      }
    }).connect(chorus)

    const noise = new Tone.Noise('pink')
    const noiseGain = new Tone.Gain(0).connect(filter)
    noise.connect(noiseGain)
    noise.start()

    const lfo = new Tone.LFO({ frequency: 0, min: -1, max: 1 })
    const lfoDepth = new Tone.Gain(0)
    lfo.connect(lfoDepth)
    lfoDepth.connect(filter.frequency)
    lfo.start()

    const dist = new Tone.Distortion(0.5)
    const distGain = new Tone.Gain(0)
    dist.connect(distGain)
    distGain.connect(filter)
    polySynth.connect(dist)


    engineRef.current = {
      polySynth,
      chorus,
      filter,
      distGain,
      noiseGain,
      lfo,
      lfoDepth,
      isPlaying: false
    }

    return () => {
      polySynth.dispose()
      chorus.dispose()
      noise.dispose()
      noiseGain.dispose()
      dist.dispose()
      distGain.dispose()
      lfo.dispose()
      lfoDepth.dispose()
      filter.dispose()
      master.dispose()
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

    const clamp = (v) => Math.max(0, Math.min(100, v))
    const x = clamp(position.x)
    const y = clamp(position.y)

    // UP → high-pass
    const up = y < 50 ? (50 - y) / 50 : 0
    const hp = 10 * Math.pow(30, up) // 10 → 3000
    engine.filter.frequency.rampTo(hp, 0.08)

    // Noise (Y <= 10)
    let noiseTarget = 0
    if (isActive && y <= 10) {
    const noiseNorm = (10 - y) / 10
    noiseTarget = noiseNorm * 0.02
    }
    engine.noiseGain.gain.rampTo(noiseTarget, 0.08)

    // Dist (Y <= 10)
    let distTarget = 0
    if (isActive && y <= 10) {
    const distNorm = (10 - y) / 10
    distTarget = distNorm * 0.3
    }
    engine.distGain.gain.rampTo(distTarget, 0.08)

    // LFO (left/right)
    const dx = Math.abs(x - 50) / 50
    const rate = dx ** 1.4
    const depth = Math.sqrt(dx)
    engine.lfo.frequency.rampTo(rate * 6, 0.08)
    engine.lfoDepth.gain.rampTo(depth * 25, 0.08)


    // DOWN → chorus
    const down = y > 50 ? (y - 50) / 50 : 0

    engine.chorus.wet.rampTo(down * 0.6, 0.1)
        // depth saturates early, stays shallow
    engine.chorus.depth = 0.02 + Math.sqrt(down) * 0.06
  }, [position, isActive])

  return null
}

export default SpatialAudioEngine
