"use client";

import { motion } from "framer-motion";
import { Star, Sparkles, TrendingUp } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { fadeInUp, heroNumber, orchestration } from "@/lib/animations";
import { easings, durations } from "@/lib/motion";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface StarsSlideProps {
  data: WrappedData;
}

export function StarsSlide({ data }: StarsSlideProps) {
  const { totalStars, averageStarsPerRepo, mostStarredRepo } = data.stats;

  return (
    <RadialSpotlightBackground
      spotlightColor="#eab308"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating star icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
              className="absolute"
            style={{
                left: `${5 + (i % 4) * 30}%`,
                top: `${10 + Math.floor(i / 4) * 30}%`,
            }}
            animate={{
                y: [0, -40, 0],
                opacity: [0, 0.35, 0],
                rotate: [0, 20, -20, 0],
                scale: [0.7, 1, 0.7],
            }}
            transition={{
                duration: 5 + i * 0.3,
              repeat: Infinity,
                delay: i * 0.1,
              ease: "easeInOut",
            }}
          >
              <Star className="w-8 h-8 text-white/12" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: durations.moderate }}
        className="relative z-10 text-center max-w-2xl w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </motion.div>

        {/* Main headline */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(0, 0.2)}
          className="text-white/80 text-xl md:text-2xl mb-4 font-light"
        >
          Your repositories earned
        </motion.p>

        {/* Big number */}
        <motion.div
          variants={heroNumber}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mb-8 relative"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="text-7xl md:text-9xl font-bold text-yellow-300/20 blur-2xl">
              {totalStars}
            </div>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4">
            <span className="text-7xl md:text-9xl font-bold text-white drop-shadow-2xl relative z-10">
              <SimpleCounter value={totalStars} duration={2000} />
            </span>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-12 h-12 md:w-16 md:h-16 text-yellow-300" fill="currentColor" />
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(2, 0.2)}
          className="text-white/80 text-2xl md:text-3xl mb-8 font-light"
        >
          stars this year!
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {averageStarsPerRepo > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={orchestration.sequence(3, 0.2)}
              className="p-4 glass-premium rounded-xl"
            >
              <p className="text-white/60 text-sm mb-1">Average per repo</p>
              <p className="text-2xl font-bold text-white">
                {averageStarsPerRepo.toFixed(1)} ⭐
              </p>
            </motion.div>
          )}

          {mostStarredRepo && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={orchestration.sequence(4, 0.2)}
              className="p-4 glass-premium rounded-xl"
            >
              <p className="text-white/60 text-sm mb-1">Most starred</p>
              <p className="text-lg font-semibold text-white truncate">
                {mostStarredRepo.name}
              </p>
              <p className="text-white/50 text-xs">
                {mostStarredRepo.stars} stars
              </p>
            </motion.div>
          )}
        </div>

        {/* Fun fact */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={orchestration.sequence(5, 0.2)}
          className="text-white/70 text-lg italic"
        >
          {totalStars > 1000
            ? "Your code is shining bright! ✨"
            : totalStars > 100
            ? "People love your work! 💫"
            : "Every star is a vote of confidence! 🌟"}
        </motion.p>
      </motion.div>
    </div>
    </RadialSpotlightBackground>
  );
}

