# Audio Engine Documentation

## Overview
The `AudioEngine` component is a hidden audio synthesis engine built with Tone.js that generates and modulates sound based on the XY Controller input. It has no UI elements and operates entirely in the background.

## Features

### 1. **Sine Wave Oscillator (G2)**
- Generates a constant G2 (98 Hz) sine wave
- Provides the fundamental tone when audio is activated

### 2. **Low-Frequency Oscillator (LFO)**
- Modulates the high-pass filter frequency
- **Controlled by X position**: Range 1-20 Hz
  - Far left (x=0): 1 Hz slow modulation
  - Far right (x=100): 20 Hz fast modulation

### 3. **High-Pass Filter**
- Filters out low-frequency content
- **Controlled by Y position**: Range 200-4000 Hz
  - Top (y=0): 200 Hz (more bass)
  - Bottom (y=100): 4000 Hz (more treble)

### 4. **Noise Generator**
- White noise oscillator
- Selectable intensity (0-1)
- Blends with the sine wave

### 5. **Envelope Control**
- **Attack**: 0.01s (customizable via API)
- **Decay**: 0.1s
- **Sustain**: 0.3
- **Release**: 0.5s

## Component Interface

### Props
```javascript
{
  position: { x: number, y: number },  // Controller position (0-100)
  isActive: boolean                      // Whether user is touching the pad
}
```

### Behavior
- **On Touch**: Starts playing the sine wave
- **On Release**: Stops playing with smooth release envelope
- **On Move**: Real-time modulation of LFO rate and filter frequency

## External API
The component exposes a global `window.__audioEngine` object for advanced control:

```javascript
// Set white noise intensity (0-1)
window.__audioEngine.setNoiseIntensity(0.5)

// Set attack time in seconds
window.__audioEngine.setAttack(0.1)

// Get current settings
window.__audioEngine.getPosition()
```

## Signal Chain
```
Synth (G2) ─────┐
                ├──> High-Pass Filter ──> Master Gain ──> Output
Noise ────> Noise Gain ──┘

LFO ──> Modulates Filter Frequency
```

## Frequency Mappings

### LFO Rate (X Position)
- x = 0 → 1 Hz
- x = 50 → 10.5 Hz
- x = 100 → 20 Hz

### Filter Frequency (Y Position)
- y = 0 → 200 Hz (warm, bassy)
- y = 50 → 2100 Hz (mid range)
- y = 100 → 4000 Hz (bright, treble)

## Notes
- Audio starts with 0 noise intensity (silent noise)
- The synth only triggers when `isActive` is true
- All modulations are smooth with appropriate ramp times
- Resources are properly cleaned up on component unmount
