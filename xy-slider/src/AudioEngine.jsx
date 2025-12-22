// import { useEffect, useRef } from 'react'
// import * as Tone from 'tone'

// function AudioEngine({ position, isActive }) {
//   const engineRef = useRef(null)

//   // Initialize audio graph (NO SOUND YET)
//   useEffect(() => {
//     const engine = {
//       synth: null,
//       lfo: null,
//       noise: null,
//       noiseGain: null,
//       filter: null,
//       masterGain: null,
//       isPlaying: false,
//     }

//     // Build graph synchronously
//     engine.masterGain = new Tone.Gain(0.3).toDestination()

//     engine.filter = new Tone.Filter({
//       type: 'highpass',
//       frequency: 100, // low enough to not kill 440Hz
//     }).connect(engine.masterGain)

//     engine.synth = new Tone.Synth({
//       oscillator: { type: 'sine' },
//       envelope: {
//         attack: 0.01,
//         decay: 0.1,
//         sustain: 0.4,
//         release: 0.5,
//       },
//     }).connect(engine.filter)

//     engine.noise = new Tone.Noise('white')
//     engine.noiseGain = new Tone.Gain(0).connect(engine.filter)
//     engine.noise.connect(engine.noiseGain)

//     engine.lfo = new Tone.LFO({
//       frequency: 2,
//       min: 100,
//       max: 2000,
//     })
//     engine.lfo.connect(engine.filter.frequency)

//     // START modulators ONCE
//     engine.noise.start()
//     engine.lfo.start()

//     engineRef.current = engine

//     return () => {
//       engine.synth.dispose()
//       engine.noise.dispose()
//       engine.noiseGain.dispose()
//       engine.lfo.dispose()
//       engine.filter.dispose()
//       engine.masterGain.dispose()
//     }
//   }, [])

//   // React to user gesture ONLY
//   useEffect(() => {
//     const engine = engineRef.current
//     if (!engine) return

//     const start = async () => {
//       // REQUIRED browser unlock — must be user-gesture driven
//       await Tone.start()

//       if (!engine.isPlaying) {
//         engine.synth.triggerAttack(196) // A4 = 440 Hz
//         engine.isPlaying = true
//       }
//     }

//     const stop = () => {
//       if (engine.isPlaying) {
//         engine.synth.triggerRelease()
//         engine.isPlaying = false
//       }
//     }

//     if (isActive) start()
//     else stop()
//   }, [isActive])

//   // Controller input → parameters
//   useEffect(() => {
//     const engine = engineRef.current
//     if (!engine) return

//     const clamp = (v) => Math.max(0, Math.min(100, v))

//     const x = clamp(position.x) / 100
//     const y = clamp(position.y) / 100

//     engine.lfo.frequency.value = 0.5 + x * 8
//     engine.filter.frequency.value = 80 + y * 3000
//   }, [position])

//   // External API (optional)
// //   useEffect(() => {
// //     const engine = engineRef.current
// //     if (!engine) return

// //     window.__audioEngine = {
// //       setNoiseIntensity: (v) => {
// //         engine.noiseGain.gain.rampTo(v, 0.1)
// //       },
// //     }

// //     return () => {
// //       window.__audioEngine = null
// //     }
// //   }, [])

//   return null
// }

// export default AudioEngine
