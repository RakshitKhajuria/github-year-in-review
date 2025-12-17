"use client";

import { motion } from "framer-motion";
import { Flame, Zap, Calendar } from "lucide-react";
import { SimpleCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface StreakSlideProps {
  data: WrappedData;
}

export function StreakSlide({ data }: StreakSlideProps) {
  const { longestStreak, currentStreak } = data.stats;

  return (
    <RadialSpotlightBackground
      spotlightColor="#f97316"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Floating flame icons */}
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
              <Flame className="w-8 h-8 text-white/12" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center w-full max-w-2xl mx-auto my-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="inline-flex p-4 rounded-full bg-white/10 mb-8"
        >
          <Flame className="w-12 h-12 text-yellow-300" />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xl mb-4"
        >
          Your longest coding streak was
        </motion.p>

        {/* Big number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-4"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-8xl md:text-9xl font-bold text-white">
              <SimpleCounter value={longestStreak} duration={1500} />
            </span>
            <span className="text-3xl text-white/70">days</span>
          </div>
        </motion.div>

        {/* Streak visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
            {[...Array(Math.min(longestStreak, 60))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.02 }}
                className="w-3 h-3 rounded-sm bg-gradient-to-br from-green-400 to-green-600"
              />
            ))}
            {longestStreak > 60 && (
              <span className="text-white/60 text-sm ml-2">+{longestStreak - 60} more</span>
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-lg mb-8"
        >
          {longestStreak >= 30
            ? "A whole month of consistent coding! 🏆"
            : longestStreak >= 14
            ? "Two weeks of dedication! 💪"
            : longestStreak >= 7
            ? "A full week streak! 🌟"
            : "Every streak starts with day one! 🌱"}
        </motion.p>

        {/* Current streak */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-full"
          >
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-white">
              Current streak:{" "}
              <span className="font-bold">{currentStreak} days</span>
            </span>
            {currentStreak >= longestStreak && (
              <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full font-medium">
                NEW RECORD!
              </span>
            )}
          </motion.div>
        )}

        {/* Active days comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-center gap-2 text-white/50"
        >
          <Calendar className="w-4 h-4" />
          <span>
            Consistency is your superpower
          </span>
        </motion.div>
      </motion.div>
    </div>
    </RadialSpotlightBackground>
  );
}

