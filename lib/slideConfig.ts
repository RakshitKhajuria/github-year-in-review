/**
 * Slide Configuration
 * 
 * Each slide can have its own duration and animation settings.
 * Durations are in milliseconds.
 */

export interface SlideConfig {
  id: string;
  duration: number; // How long to show the slide (ms)
  autoAdvance: boolean; // Whether to auto-advance from this slide
}

export const SLIDE_CONFIGS: Record<string, SlideConfig> = {
  welcome: {
    id: "welcome",
    duration: 10000, // 10 seconds - intro slide
    autoAdvance: true,
  },
  overview: {
    id: "overview",
    duration: 10000, // 10 seconds - show activity overview
    autoAdvance: true,
  },
  commits: {
    id: "commits",
    duration: 10000, // 10 seconds - let counter animate
    autoAdvance: true,
  },
  prs: {
    id: "prs",
    duration: 10000, // 10 seconds - show PR stats
    autoAdvance: true,
  },
  month: {
    id: "month",
    duration: 10000, // 10 seconds - highlight best month
    autoAdvance: true,
  },
  languages: {
    id: "languages",
    duration: 10000, // 10 seconds - more content to read
    autoAdvance: true,
  },
  repos: {
    id: "repos",
    duration: 10000, // 10 seconds - show top repos
    autoAdvance: true,
  },
  streak: {
    id: "streak",
    duration: 10000, // 10 seconds - show streak
    autoAdvance: true,
  },
  personality: {
    id: "personality",
    duration: 10000, // 10 seconds - fun insights, more to read
    autoAdvance: true,
  },
  social: {
    id: "social",
    duration: 10000, // 10 seconds - followers/following
    autoAdvance: true,
  },
  stars: {
    id: "stars",
    duration: 10000, // 10 seconds - repository stars
    autoAdvance: true,
  },
  bio: {
    id: "bio",
    duration: 10000, // 10 seconds - user bio
    autoAdvance: true,
  },
  codeSize: {
    id: "codeSize",
    duration: 10000, // 10 seconds - code size analysis
    autoAdvance: true,
  },
  reviews: {
    id: "reviews",
    duration: 10000, // 10 seconds - PR reviews
    autoAdvance: true,
  },
  ownedRepos: {
    id: "ownedRepos",
    duration: 10000, // 10 seconds - owned repositories
    autoAdvance: true,
  },
  summary: {
    id: "summary",
    duration: 0, // Don't auto-advance from final slide
    autoAdvance: false,
  },
};

/**
 * Get duration for a specific slide
 */
export function getSlideDuration(slideId: string): number {
  return SLIDE_CONFIGS[slideId]?.duration || 5000; // Default 5 seconds
}

/**
 * Check if slide should auto-advance
 */
export function shouldAutoAdvance(slideId: string): boolean {
  return SLIDE_CONFIGS[slideId]?.autoAdvance ?? true;
}

/**
 * Global settings
 */
export const SLIDESHOW_CONFIG = {
  // Pause auto-advance when user interacts
  pauseOnInteraction: true,
  
  // How long to pause after user interaction (ms)
  pauseDuration: 15000, // 15 seconds
  
  // Allow manual navigation even during auto-advance
  allowManualNavigation: true,
  
  // Transition duration between slides (ms)
  transitionDuration: 600,
  
  // Progress timer size
  progressTimerSize: 48,
  
  // Progress timer position
  progressTimerPosition: "top-right" as const,
};

