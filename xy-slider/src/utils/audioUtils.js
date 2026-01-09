/**
 * Utility functions for audio parameter scaling and mapping
 */

/**
 * Constrains a value between min and max
 */
export const clamp = (value, min = 0, max = 100) => 
  Math.max(min, Math.min(max, value))

/**
 * Maps a value from one range to another
 * Commonly used for scaling XY coordinates to audio parameters
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const normalized = (value - inMin) / (inMax - inMin)
  return outMin + normalized * (outMax - outMin)
}

/**
 * Extracts a normalized 0-1 value from a coordinate range
 * Used for mapping directional pad movements
 */
export const extractNormalized = (coord, minCoord, maxCoord) => {
  const range = maxCoord - minCoord
  return clamp((coord - minCoord) / range, 0, 1)
}

/**
 * Applies exponential scaling for more natural parameter curves
 */
export const exponentialScale = (normalized, exponent = 1) => 
  Math.pow(normalized, exponent)

/**
 * Logarithmic frequency scaling (useful for filter sweeps)
 */
export const frequencyScale = (normalized, minFreq, maxFreq) => 
  minFreq * Math.pow(maxFreq / minFreq, normalized)