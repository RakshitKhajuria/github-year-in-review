/**
 * Reusable animation variants for consistent animations across slides
 * Enhanced with premium motion design principles
 */

import { Variants } from "framer-motion";
import { easings, durations, springs, orchestration } from "./motion";

// Re-export for convenience
export { orchestration } from "./motion";

/**
 * Fade in from bottom with premium easing
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: (custom?: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: custom || 0,
      duration: durations.slow,
      ease: easings.smooth,
    },
  }),
};

/**
 * Fade in from top
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (custom?: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom || 0,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

/**
 * Scale in with fade and blur for depth
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(8px)" },
  visible: (custom?: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: custom || 0,
      duration: durations.slow,
      ease: easings.dramatic,
    },
  }),
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (custom?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom || 0,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (custom?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom || 0,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

/**
 * Stagger children animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Word-by-word text animation
 * Usage: Split text by words and wrap each in motion.span with this variant
 */
export const wordAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Character-by-character animation (for dramatic reveals)
 */
export const charAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Bounce in animation
 */
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (custom?: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom || 0,
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  }),
};

/**
 * Rotate in animation
 */
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0 },
  visible: (custom?: number) => ({
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      delay: custom || 0,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
};

/**
 * Blur in animation
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: (custom?: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: custom || 0,
      duration: 0.6,
    },
  }),
};

/**
 * Helper: Split text into words for animation
 */
export function splitTextIntoWords(text: string) {
  return text.split(" ").map((word) => word + " ");
}

/**
 * Helper: Split text into characters for animation
 */
export function splitTextIntoChars(text: string) {
  return text.split("");
}

/**
 * ADVANCED VARIANTS FOR PREMIUM STORYTELLING
 */

/**
 * Hero number reveal - for big stats
 * Combines scale, blur, and counter animation
 */
export const heroNumber: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    filter: "blur(20px)",
    y: 40,
  },
  visible: (custom?: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      delay: custom || 0,
      duration: durations.slower,
      ease: easings.dramatic,
      scale: { ...springs.bouncy },
    },
  }),
};

/**
 * Glimmer effect - subtle attention grabber
 */
export const glimmer: Variants = {
  hidden: { opacity: 0.7 },
  visible: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Float animation - for ambient background elements
 */
export const float: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Shimmer slide - for progress bars and loading
 */
export const shimmer: Variants = {
  hidden: { backgroundPosition: "200% 0" },
  visible: {
    backgroundPosition: "-200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Fade in up with anticipation
 * Moves down slightly before animating up
 */
export const anticipatedEntry: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (custom?: number) => ({
    opacity: 1,
    y: [null, 40, 0],
    transition: {
      delay: custom || 0,
      duration: durations.slower,
      ease: easings.anticipate,
    },
  }),
};

/**
 * Breathe - subtle pulsing for living elements
 */
export const breathe: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Pop in - playful entrance
 */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: (custom?: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: custom || 0,
      ...springs.bouncy,
    },
  }),
};

/**
 * Slide in with overshoot - energetic entrance
 */
export const slideInOvershoot: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: (custom?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom || 0,
      ...springs.wobbly,
    },
  }),
};

/**
 * Reveal from center - dramatic entrance
 */
export const revealFromCenter: Variants = {
  hidden: { 
    opacity: 0, 
    clipPath: "circle(0% at 50% 50%)",
  },
  visible: (custom?: number) => ({
    opacity: 1,
    clipPath: "circle(150% at 50% 50%)",
    transition: {
      delay: custom || 0,
      duration: durations.slowest,
      ease: easings.smooth,
    },
  }),
};

