"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  onSlideClick: (index: number) => void;
}

export function ProgressBar({ current, total, onSlideClick }: ProgressBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4">
      <div className="flex gap-1.5 max-w-3xl mx-auto">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isHovered = hoveredIndex === index;
          
          return (
            <motion.button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onSlideClick(index);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex-1 group"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background track */}
              <div className="h-1 rounded-full overflow-hidden bg-white/20 transition-colors">
                {/* Progress fill */}
                <motion.div
                  className={`h-full rounded-full ${
                    isCompleted ? "bg-white" : isCurrent ? "bg-white" : "bg-white/0"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{
                    width: isCompleted ? "100%" : isCurrent ? "100%" : "0%",
                  }}
                  transition={{
                    duration: isCurrent ? 0.4 : 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              </div>
              
              {/* Hover indicator */}
              {isHovered && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Glow effect for current slide */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/30 blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

