"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import type { WrappedData } from "@/lib/types";

// Slide components
import { LoadingScreen } from "@/components/slides/LoadingScreen";
import { ErrorScreen } from "@/components/slides/ErrorScreen";
import { WelcomeSlide } from "@/components/slides/WelcomeSlide";
import { OverviewSlide } from "@/components/slides/OverviewSlide";
import { CommitsSlide } from "@/components/slides/CommitsSlide";
import { PRsSlide } from "@/components/slides/PRsSlide";
import { MonthSlide } from "@/components/slides/MonthSlide";
import { LanguagesSlide } from "@/components/slides/LanguagesSlide";
import { ReposSlide } from "@/components/slides/ReposSlide";
import { StreakSlide } from "@/components/slides/StreakSlide";
import { PersonalitySlide } from "@/components/slides/PersonalitySlide";
import { SocialStatsSlide } from "@/components/slides/SocialStatsSlide";
import { StarsSlide } from "@/components/slides/StarsSlide";
import { BioSlide } from "@/components/slides/BioSlide";
import { CodeSizeSlide } from "@/components/slides/CodeSizeSlide";
import { ReviewsSlide } from "@/components/slides/ReviewsSlide";
import { OwnedReposSlide } from "@/components/slides/OwnedReposSlide";
import { SummarySlide } from "@/components/slides/SummarySlide";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { SlideNavigation } from "@/components/ui/SlideNavigation";
import {
  SLIDE_CONFIGS,
  getSlideDuration,
  shouldAutoAdvance,
  SLIDESHOW_CONFIG,
} from "@/lib/slideConfig";

const SLIDES = [
  "welcome",        // 1. Introduction - Welcome the user
  "overview",      // 2. High-level overview - Set the stage
  "commits",       // 3. Core activity - Your commits
  "prs",           // 4. Contributions - Pull requests
  "reviews",       // 5. Code reviews - Review activity
  "month",         // 6. Time-based - Best month
  "streak",        // 7. Consistency - Streak achievement
  "languages",     // 8. Technical skills - Languages used
  "codeSize",      // 9. Volume - Code size analysis
  "repos",         // 10. Projects - Repositories worked on
  "ownedRepos",    // 11. Ownership - What you created
  "stars",         // 12. Recognition - Stars earned
  "social",        // 13. Community - Followers/following
  "personality",   // 14. Developer type - Fun insights
  // "bio",           // 15. Personal story - Your bio
  "summary",       // 16. Final wrap-up - Complete summary
] as const;

type SlideType = (typeof SLIDES)[number];

export default function WrappedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const token = searchParams.get("token") || undefined;

  const [data, setData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const isAdvancingRef = useRef(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number>(0);
  const wasLongPressRef = useRef<boolean>(false);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/github/contributions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            year,
            token,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || result.error || "Failed to fetch data");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      fetchData();
    }
  }, [username, year, token]);

  // Navigation handlers
  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
      setProgress(0);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentSlide]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Auto-advance slideshow with progress tracking
  useEffect(() => {
    // Don't auto-advance if loading, error, paused, not started, or on last slide
    if (isLoading || error || !data || isPaused || !hasStarted) {
      isAdvancingRef.current = false;
      return;
    }

    const currentSlideId = SLIDES[currentSlide];
    
    // Check if current slide should auto-advance
    if (!shouldAutoAdvance(currentSlideId)) {
      isAdvancingRef.current = false;
      return;
    }

    // Prevent duplicate timers
    if (isAdvancingRef.current) {
      return;
    }
    isAdvancingRef.current = true;

    const duration = getSlideDuration(currentSlideId);
    const interval = 50; // Update progress every 50ms for smooth animation
    
    // Calculate remaining time (accounting for current progress or resuming from pause)
    const remainingTime = remainingTimeRef.current > 0 
      ? remainingTimeRef.current 
      : duration - (progress / 100) * duration;
    
    const effectiveDuration = remainingTime;
    const isResuming = remainingTimeRef.current > 0;
    remainingTimeRef.current = 0; // Reset after using
    
    // Calculate increment based on remaining progress and effective duration
    const remainingProgress = 100 - progress;
    const increment = (remainingProgress * interval) / effectiveDuration;

    // Progress update timer
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        
        // Cap at 100%
        if (newProgress >= 100) {
          return 100;
        }
        
        return newProgress;
      });
    }, interval);

    // Advance to next slide after duration
    const advanceTimer = setTimeout(() => {
      if (currentSlide < SLIDES.length - 1) {
        setDirection(1);
        setCurrentSlide((prev) => prev + 1);
      }
      isAdvancingRef.current = false;
    }, effectiveDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(advanceTimer);
      isAdvancingRef.current = false;
    };
  }, [currentSlide, isLoading, error, data, isPaused, hasStarted, progress]);

  // Auto-resume after user interaction pause
  useEffect(() => {
    if (!isPaused || !SLIDESHOW_CONFIG.pauseOnInteraction) {
      return;
    }

    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
    }, SLIDESHOW_CONFIG.pauseDuration);

    return () => clearTimeout(resumeTimer);
  }, [isPaused, currentSlide]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
    remainingTimeRef.current = 0; // Reset remaining time on slide change
  }, [currentSlide]);

  // Cleanup long-press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setHasStarted(true);
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setHasStarted(true);
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Start slideshow on first click
  const handleFirstClick = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  // Touch/Click navigation
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if it was a long-press
    if (wasLongPressRef.current) {
      wasLongPressRef.current = false;
      return;
    }
    
    handleFirstClick();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Long-press detection for pause/resume
  const LONG_PRESS_DURATION = 500; // 500ms for long press

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleFirstClick();
    wasLongPressRef.current = false;
    
    longPressTimerRef.current = setTimeout(() => {
      wasLongPressRef.current = true;
      setIsPaused((prev) => {
        if (!prev) {
          // Pausing - calculate and store remaining time
          const currentSlideId = SLIDES[currentSlide];
          const duration = getSlideDuration(currentSlideId);
          const remainingTime = duration - (progress / 100) * duration;
          remainingTimeRef.current = remainingTime;
          pauseStartTimeRef.current = Date.now();
        }
        return true;
      });
    }, LONG_PRESS_DURATION);
  }, [handleFirstClick, currentSlide, progress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // If we were paused, resume (remaining time already calculated)
    if (isPaused && pauseStartTimeRef.current > 0) {
      pauseStartTimeRef.current = 0;
      setIsPaused(false);
    }
  }, [isPaused]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleFirstClick();
    wasLongPressRef.current = false;
    
    longPressTimerRef.current = setTimeout(() => {
      wasLongPressRef.current = true;
      setIsPaused((prev) => {
        if (!prev) {
          // Pausing - calculate and store remaining time
          const currentSlideId = SLIDES[currentSlide];
          const duration = getSlideDuration(currentSlideId);
          const remainingTime = duration - (progress / 100) * duration;
          remainingTimeRef.current = remainingTime;
          pauseStartTimeRef.current = Date.now();
        }
        return true;
      });
    }, LONG_PRESS_DURATION);
  }, [handleFirstClick, currentSlide, progress]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // If we were paused, resume (remaining time already calculated)
    if (isPaused && pauseStartTimeRef.current > 0) {
      pauseStartTimeRef.current = 0;
      setIsPaused(false);
    }
  }, [isPaused]);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingScreen username={username} />;
  }

  // Error state
  if (error) {
    return <ErrorScreen error={error} username={username} />;
  }

  // No data state
  if (!data) {
    return <ErrorScreen error="No data available" username={username} />;
  }

  // Render current slide
  const renderSlide = (slideType: SlideType) => {
    switch (slideType) {
      case "welcome":
        return <WelcomeSlide data={data} onNext={nextSlide} />;
      case "overview":
        return <OverviewSlide data={data} />;
      case "commits":
        return <CommitsSlide data={data} />;
      case "prs":
        return <PRsSlide data={data} />;
      case "month":
        return <MonthSlide data={data} />;
      case "languages":
        return <LanguagesSlide data={data} />;
      case "repos":
        return <ReposSlide data={data} />;
      case "streak":
        return <StreakSlide data={data} />;
      case "personality":
        return <PersonalitySlide data={data} />;
      case "social":
        return <SocialStatsSlide data={data} />;
      case "stars":
        return <StarsSlide data={data} />;
      case "bio":
        return <BioSlide data={data} />;
      case "codeSize":
        return <CodeSizeSlide data={data} />;
      case "reviews":
        return <ReviewsSlide data={data} />;
      case "ownedRepos":
        return <OwnedReposSlide data={data} />;
      case "summary":
        return <SummarySlide data={data} />;
      default:
        return null;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      rotateY: direction > 0 ? 10 : -10,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      rotateY: direction < 0 ? 10 : -10,
    }),
  };

  return (
    <main className="h-screen w-screen bg-github-darker relative overflow-hidden">
      {/* Progress bar */}
      <ProgressBar
        current={currentSlide}
        total={SLIDES.length}
        onSlideClick={goToSlide}
      />

      {/* Circular progress timer */}
      {!isLoading && !error && data && (
        <div
          className={`fixed z-30 ${
            SLIDESHOW_CONFIG.progressTimerPosition === "top-right"
              ? "top-4 right-4 md:top-6 md:right-6"
              : SLIDESHOW_CONFIG.progressTimerPosition === "top-left"
              ? "top-4 left-4 md:top-6 md:left-6"
              : SLIDESHOW_CONFIG.progressTimerPosition === "bottom-right"
              ? "bottom-4 right-4 md:bottom-6 md:right-6"
              : "bottom-4 left-4 md:bottom-6 md:left-6"
          }`}
        >
          {shouldAutoAdvance(SLIDES[currentSlide]) && (
            <CircularProgress
              progress={progress}
              isPaused={isPaused}
              onTogglePause={togglePause}
              size={SLIDESHOW_CONFIG.progressTimerSize}
            />
          )}
        </div>
      )}

      {/* Slide container with proper overflow handling */}
      <div
        className="h-full w-full cursor-pointer relative"
        style={{ perspective: "1200px" }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 26, mass: 0.8 },
              opacity: { duration: 0.4, ease: "easeInOut" },
              scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
              filter: { duration: 0.3 },
              rotateY: { duration: 0.4, ease: "easeOut" },
            }}
            className="h-full w-full absolute inset-0"
          >
            {renderSlide(SLIDES[currentSlide])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows (visible on larger screens) */}
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={SLIDES.length}
        onPrev={prevSlide}
        onNext={nextSlide}
        className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
      />

      {/* Share button (on last slide) */}
      {currentSlide === SLIDES.length - 1 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            // Share functionality would go here
          }}
          className="fixed top-4 right-4 md:top-6 md:right-6 p-3 rounded-full glass hover:bg-white/10 transition-colors z-20 pointer-events-auto"
        >
          <Share2 className="w-5 h-5 text-white" />
        </motion.button>
      )}

      {/* Mobile hint with animation */}
      <motion.div 
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium flex items-center gap-2 z-20 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span>Tap to continue</span>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.div>
    </main>
  );
}

