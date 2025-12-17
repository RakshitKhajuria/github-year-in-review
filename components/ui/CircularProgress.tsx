"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";

interface CircularProgressProps {
  progress: number; // 0 to 100
  isPaused: boolean;
  onTogglePause: () => void;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  progress,
  isPaused,
  onTogglePause,
  size = 48,
  strokeWidth = 3,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 blur-xl"
        animate={{
          scale: isPaused ? 1 : [1, 1.2, 1],
          opacity: isPaused ? 0 : [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Circular SVG Progress */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10"
      >
        {/* Background circle with pulse */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
          animate={isPaused ? {} : {
            strokeWidth: [strokeWidth, strokeWidth + 1, strokeWidth],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            opacity: isPaused ? 0.5 : 1,
          }}
          transition={{ 
            strokeDashoffset: { duration: 0.3, ease: "linear" },
            opacity: { duration: 0.3 },
          }}
        />
      </svg>

      {/* Pause/Play button overlay */}
      <AnimatePresence>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePause();
          }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Pause className="w-4 h-4 text-white" fill="white" />
            )}
          </motion.div>
        </motion.button>
      </AnimatePresence>
      
      {/* Paused indicator */}
      {isPaused && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          Paused
        </motion.div>
      )}
    </motion.div>
  );
}

