/**
 * Premium motion design system
 * Inspired by Spotify Wrapped, Apple, and modern web experiences
 */

/**
 * Premium easing curves
 * Use these for a more polished, intentional feel
 */
export const easings = {
  // Smooth, natural ease - great for most animations
  smooth: [0.25, 0.1, 0.25, 1],
  
  // Snappy, responsive - for UI interactions
  snappy: [0.34, 1.56, 0.64, 1],
  
  // Dramatic entrance - for hero elements
  dramatic: [0.16, 1, 0.3, 1],
  
  // Soft spring - for gentle movements
  gentle: [0.6, 0.04, 0.98, 0.335],
  
  // Bouncy - for playful elements
  bouncy: [0.68, -0.55, 0.265, 1.55],
  
  // Sharp - for quick, decisive movements
  sharp: [0.4, 0, 0.6, 1],
  
  // Elastic - for attention-grabbing elements
  elastic: [0.68, -0.6, 0.32, 1.6],
  
  // Anticipation - moves back before going forward
  anticipate: [0.36, 0, 0.66, -0.56],
} as const;

/**
 * Timing tokens
 * Consistent duration values across the app
 */
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  moderate: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.2,
} as const;

/**
 * Stagger intervals for sequential animations
 */
export const stagger = {
  tight: 0.05,
  normal: 0.1,
  loose: 0.15,
  spacious: 0.2,
} as const;

/**
 * Spring configurations for natural motion
 */
export const springs = {
  // Gentle, smooth spring
  soft: { type: "spring" as const, stiffness: 120, damping: 14 },
  
  // Default spring - good for most cases
  default: { type: "spring" as const, stiffness: 170, damping: 26 },
  
  // Snappy spring - for quick responses
  snappy: { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.8 },
  
  // Bouncy spring - playful feel
  bouncy: { type: "spring" as const, stiffness: 400, damping: 12 },
  
  // Slow spring - for dramatic effects
  slow: { type: "spring" as const, stiffness: 80, damping: 18 },
  
  // Wobbly - for attention-grabbing
  wobbly: { type: "spring" as const, stiffness: 180, damping: 12 },
} as const;

/**
 * Orchestration helpers
 * Coordinate multiple animations for storytelling
 */
export const orchestration = {
  /**
   * Create a sequential delay pattern
   * @param index - Element index in sequence
   * @param baseDelay - Starting delay
   * @param increment - Delay increment per item
   */
  sequence: (index: number, baseDelay = 0, increment = stagger.normal) => 
    baseDelay + index * increment,
  
  /**
   * Create a cascade pattern (accelerating)
   * Items appear progressively faster
   */
  cascade: (index: number, baseDelay = 0) => 
    baseDelay + Math.pow(index * 0.1, 0.7),
  
  /**
   * Create a wave pattern (sin wave)
   * Items animate in a wave-like pattern
   */
  wave: (index: number, total: number, baseDelay = 0) => 
    baseDelay + Math.sin((index / total) * Math.PI) * 0.3,
  
  /**
   * Create an expand pattern (from center)
   * Items animate outward from center
   */
  expand: (index: number, total: number, baseDelay = 0) => 
    baseDelay + Math.abs(index - total / 2) * 0.08,
};

/**
 * Hover transition presets
 */
export const hover = {
  lift: {
    scale: 1.05,
    y: -4,
    transition: { ...springs.snappy, duration: durations.fast },
  },
  
  glow: {
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
    transition: { duration: durations.normal },
  },
  
  brighten: {
    filter: "brightness(1.2)",
    transition: { duration: durations.fast },
  },
  
  subtle: {
    scale: 1.02,
    transition: { ...springs.soft, duration: durations.fast },
  },
  
  dramatic: {
    scale: 1.1,
    rotate: 2,
    transition: { ...springs.bouncy, duration: durations.moderate },
  },
};

/**
 * Tap/Click feedback presets
 */
export const tap = {
  press: { scale: 0.95 },
  shrink: { scale: 0.9 },
  gentle: { scale: 0.98 },
};

/**
 * Exit animations
 * How elements leave the screen
 */
export const exit = {
  fade: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.sharp },
  },
  
  slideDown: {
    y: 20,
    opacity: 0,
    transition: { duration: durations.normal, ease: easings.sharp },
  },
  
  scaleDown: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: durations.normal, ease: easings.sharp },
  },
  
  blur: {
    filter: "blur(10px)",
    opacity: 0,
    transition: { duration: durations.moderate },
  },
};

