"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { springs, easings } from "@/lib/motion";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  className = "",
}: SlideNavigationProps) {
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <div className={`hidden md:flex items-center gap-4 ${className}`}>
      {/* Previous button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={!canGoPrev}
        className="group relative p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
        whileHover={canGoPrev ? { scale: 1.1 } : {}}
        whileTap={canGoPrev ? { scale: 0.9 } : {}}
        transition={springs.snappy}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20" />
        
        {/* Hover glow */}
        {canGoPrev && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <ChevronLeft className="w-5 h-5 text-white relative z-10" />
        
        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={canGoPrev ? { scale: 2, opacity: 0 } : {}}
          transition={{ duration: 0.4 }}
        />
      </motion.button>

      {/* Slide counter with smooth transitions */}
      <div className="relative min-w-[60px] h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSlide}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: easings.smooth }}
            className="text-white/90 text-sm font-medium tabular-nums absolute"
          >
            {currentSlide + 1} / {totalSlides}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!canGoNext}
        className="group relative p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
        whileHover={canGoNext ? { scale: 1.1 } : {}}
        whileTap={canGoNext ? { scale: 0.9 } : {}}
        transition={springs.snappy}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20" />
        
        {/* Hover glow */}
        {canGoNext && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <ChevronRight className="w-5 h-5 text-white relative z-10" />
        
        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={canGoNext ? { scale: 2, opacity: 0 } : {}}
          transition={{ duration: 0.4 }}
        />
      </motion.button>
      
      {/* Progress indicator glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
        style={{
          width: `${((currentSlide + 1) / totalSlides) * 100}%`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

