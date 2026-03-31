# Sounds Somatic

An interactive web application that explores the relationship between sound and sensation through real-time audio manipulation.

## 🎵 Concept

**Sounds Somatic** is a tool for **somatic listening**—a practice of tuning into the body's responses to sound. Rather than a traditional musical instrument, it's an exploratory interface where users shape a continuously evolving soundscape by moving through a 2D space.

The XY controller maps physical movement to audio parameters in real-time, encouraging slow, intentional interaction and deeper awareness of how sound qualities mirror bodily sensations.

 - [Live Version](http://soundbody.space)

## 🏗️ Architecture

### Components

| Component | Purpose |
|-----------|---------|
| **`App.jsx`** | Root component, layout orchestration |
| **`XYController.jsx`** | Interactive 2D pad, input handling (mouse/touch) |
| **`SpatialAudioEngine.jsx`** | Tone.js synthesizer engine (hidden, background operation) |
| **`App.css`** | Layout and visual styling |
| **`XYController.css`** | Pad styling with gradient, animations |

### Tech Stack

- **React 18** - Component-based UI framework
- **Tone.js** - Web Audio API abstraction for synthesis and effects
- **CSS3** - Gradients, animations, responsive design

## 🎛️ Audio Engine

### Coordinate System

The XY controller normalizes input to 0-100 on both axes:

```
Y
100 ┌─────────────────┐
    │ Top-Left        │ Top-Right
    │ (0, 0)          │ (100, 0)
 50 │   Center (50)   │
    │ (0, 100)        │ (100, 100)
  0 └─────────────────┘
    0       X       100
```

### Parameter Mapping

| Axis | Direction | Parameter | Range | Effect |
|------|-----------|-----------|-------|--------|
| **X** | Left (0→50) | Filter Resonance (Q) | 0.6 → 22 | Tighter, focused tone |
| **X** | Right (50→100) | LFO Rate | 1 → 14 Hz | Tremolo/vibrato modulation |
| **Y** | Up (0→40) | High-Pass Filter | 4000 → 200 Hz | Brighter, filtered edge |
| **Y** | Down (50→100) | Chorus Mix | 0.15 → 0.75 | Wider, diffused soundscape |

### Signal Chain

The audio graph is structured as a **hybrid mixer** with one core voice, multiple parallel buses, and shared effects:

```
                    ┌─────────────────┐
                    │   PolySynth     │
                    │   (G2 @ 98Hz)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼─────┐  ┌─────▼──────┐   ┌───▼────────┐
         │Open Path │  │Tension     │   │Distortion &│
         │(Main)    │  │(Focused)   │   │Noise Buses │
         └────┬─────┘  └─────┬──────┘   └───┬────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
            ┌────────────────▼────────────────┐
            │  EQ → High-Pass → Chorus        │
            │       → Reverb → Widener        │
            └────────────────┬────────────────┘
                             │
                        ┌────▼─────────┐
                        │ LFO (Motion) │
                        │ Master Gain  │
                        └────┬─────────┘
                             │
                        ┌────▼──────────┐
                        │  Output (0.8) │
                        │  → Destination│
                        └───────────────┘
```

#### Path Descriptions

**Open Path (Center + Right)**
- Default routing with spatial effects
- Emphasis increases moving right (more motion/modulation)

**Tension Path (Left)**
- Band-pass filtered for tonal focus
- Resonance increases moving left (tighter, more resonant)
- Blends with open path based on X position

**Parallel Buses**
- Distortion and noise layers pass through pressure filter for cohesion
- Maintains unified tone regardless of parameter changes

**Motion (Right)**
- LFO modulates master gain for tremolo effect
- Creates vibrato/shimmer sensation without changing tone

## 📝 Configuration

Audio parameters are centralized in `src/config/audioConfig.js`:
**To modify audio behavior**, edit values in `audioConfig.js`. 

## 🎯 Usage

1. **Open the app** - Colorful gradient pad appears centered
2. **Touch/click** - Sound begins when active
3. **Move slowly** - Explore parameter space intentionally
4. **Observe changes** - Notice how sound evolves with position
5. **Release** - Sound fades with release envelope

## 📦 Dependencies

- `react@^18` - UI framework
- `tone@^14` - Web Audio synthesis
- `vite` - Build tool

See `package.json` for full dependency list.

## 🔗 Resources

- [Tone.js Docs](https://tonejs.github.io/)
- [Web Audio API](https://www.w3.org/TR/webaudio-1.1/)
- [Sounds-Somatic Practices](https://soundssomatic.carrd.co/)

## 📄 Credits

© 2026 Rinat Tregerman. Beta version—contributions welcome.

---

**Recommended:** Use headphones or quality speakers in a quiet environment for full sonic detail.
