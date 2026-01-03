# Sounds Somatic

An interactive web application that explores the relationship between sound and bodily sensation through spatial audio manipulation.

## 🎵 Concept

**Sounds Somatic** invites users to discover how physical qualities of sound mirror bodily sensations. By moving around an XY controller pad, you shape a continuously evolving soundscape in real-time. The experience encourages slow, intentional exploration—noticing how the sound's intensity, movement, texture, and spread change as you move through the space.

This is not a traditional musical interface, but rather a tool for **somatic listening**—a practice of tuning into the body's responses to sound and using sound to deepen body awareness.

## 🏗️ Architecture

### Core Components

- **`App.jsx`** - Main application container, orchestrates layout and state management
- **`XYController.jsx`** - Interactive 2D pad component that captures user input (touch/mouse) and tracks position
- **`SpatialAudioEngine.jsx`** - Tone.js-based synthesizer engine that generates and processes audio based on controller input (hidden, background operation)
- **`XYController.css`** - Styling for the interactive pad with gradient background and cursor feedback

### Tech Stack

- **React** - UI framework for component-based architecture
- **Tone.js** - Web audio library for synthesis and effects processing
- **CSS3** - Modern styling with gradients, animations, and responsive design

## 🎛️ Axis Coordinate Map

The XY controller uses a normalized coordinate system from 0-100 on both axes:

```
        X: 0 to 100 (Left ← → Right)
        Y: 0 to 100 (Top ↑ ↓ Bottom)
        
        Center: (50, 50)
        Top-Left: (0, 0)
        Top-Right: (100, 0)
        Bottom-Left: (0, 100)
        Bottom-Right: (100, 100)
```

### Audio Parameter Mapping

| Direction | Parameter | Range | Effect |
|-----------|-----------|-------|--------|
| **Left (X: 0→50)** | Filter Resonance (Q) | 0.6 → 22 | "TIGHT" - Narrow, resonant tones |
| **Right (X: 50→100)** | LFO Rate | 1 → 14 Hz | "MOTION" - Fast modulation & vibrato |
| **Up (Y: 0→40)** | High-Pass Filter | 4000 → 200 Hz | "INTENSE" - Bright, filtered edge |
| **Down (Y: 50→100)** | Chorus Wet Mix | 0.15 → 0.75 | "EXPANSIVE" - Spacious, diffused sound |

## 🎚️ Audio Engine Features

The **SpatialAudioEngine** is a sophisticated synthesizer controlled entirely by XY pad position:

### Real-Time Effects
- **High-Pass Filter** - Removes low frequencies, creates brightness (Y-axis up)
- **Resonant Filter (Pressure Filter)** - Emphasizes frequencies around a central point (X-axis left)
- **LFO (Low-Frequency Oscillator)** - Modulates filter cutoff for shimmering, vibrato effect (X-axis right)
- **Noise Generator** - White/pink noise for textural complexity (Y-axis up)
- **Distortion** - Adds harmonic richness (Y-axis up)
- **Chorus** - Creates spatial width and diffusion (Y-axis down)
- **Reverb** - Adds spatial depth and ambience

### Control Flow
1. User touches/clicks the XY pad
2. Position coordinates (0-100) are captured in real-time
3. SpatialAudioEngine receives position & active state
4. Audio parameters are smoothly ramped to new values
5. Sound plays while user is active, stops on release

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build
```bash
npm run build
```

## 🎯 Usage

1. **Open the app** - You'll see a colorful gradient pad in the center
2. **Touch or click** - The pad becomes active and sound begins
3. **Explore slowly** - Move around the pad and notice how the sound changes
4. **Read the labels** - "INTENSE", "EXPANSIVE", "TIGHT", "MOTION" suggest directions to explore
5. **Feel the sound** - Let bodily sensations guide your exploration

## 📚 Learn More

- [Sounds Somatic Practice Overview](https://soundssomatic.carrd.co/)
- [Tone.js Documentation](https://tonejs.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 📝 Credits

Created by **Rinat Tregerman** © 2026

Beta Version - Feedback and contributions welcome

---

**Note:** For best experience, use headphones or speakers in a quiet environment to fully appreciate the subtle sonic qualities.