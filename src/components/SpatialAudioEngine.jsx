import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { SYNTH, EFFECTS, NOTE } from '../config/audioConfig';


function SpatialAudioEngine({ position, isActive }) {
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
    const output = new Tone.Gain(0.8).toDestination()
    const widener = new Tone.StereoWidener(EFFECTS.widener.init.width) 


    // ---------- CORE VOICE ----------
    const polySynth = new Tone.PolySynth(Tone.Synth, SYNTH.init)
    const eq = new Tone.EQ3(EFFECTS.eq.init)
    const highpass = new Tone.Filter(EFFECTS.filter.highpass.init)
    const chorus = new Tone.Chorus(EFFECTS.chorus.init) 
    chorus.start()
    const reverb = new Tone.Reverb(EFFECTS.reverb.init)

    // ---------- OPEN PATH (center + right) ----------
    const openGain = new Tone.Gain(1)

    polySynth.chain(
      eq,
      highpass,
      chorus,
      reverb,
      openGain,
      widener,
      output
    )

    // ---------- PRESSURE PATH (left) ----------
    const pressureFilter = new Tone.Filter(EFFECTS.filter.bandpass.init)
    const pressureGain = new Tone.Gain(0)
    const pressureDrive = new Tone.Distortion(0.05)

    polySynth.chain(
      eq,
      pressureFilter,
      pressureDrive,
      pressureGain,
      highpass,
      chorus,
      reverb,
      widener,
      output
    )

    // ---------- MOTION (RIGHT ONLY) ----------
    const lfo = new Tone.LFO(EFFECTS.lfo.init)
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
    const noise = new Tone.Noise(EFFECTS.noise.init.type)
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
      widener,
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
        engine.polySynth.triggerAttack(NOTE[0])
        engine.isPlaying = true
      }
    } 

    const stop = () => {
      startTokenRef.current++
      if (engine.isPlaying) {
        engine.polySynth.triggerRelease(NOTE[0])
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

    const [x,y] = [position.x, position.y]

    // ----------- UP → Intense (high-pass filter + noise + distortion) ----------
    if (isActive && y <= 40) {
      const up = (40 - y) / 40
      const hp = EFFECTS.filter.highpass.init.frequency * Math.pow(20, up)
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

    // ----------- DOWN → expansive (chorus + widener)
    const down = y > 50 ? (y - 50) / 50 : 0 // scale 'down' 0 -> 1
    engine.chorus.wet.rampTo(0.20 + down * 0.6, 0.1)
    engine.chorus.depth = 1.3 + Math.sqrt(down) * 0.5
    engine.widener.width.rampTo(0.5 + (down * 0.5), 0.1); // scale 'down' from 0->1 to 0.5 -> 1

  }, [position, isActive])

  return null
}

export default SpatialAudioEngine
